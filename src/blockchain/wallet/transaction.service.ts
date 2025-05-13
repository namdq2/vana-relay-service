import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { WalletService } from './wallet.service';
import { BlockchainModuleConfig } from '../config/blockchain-config.type';

/**
 * Service for handling blockchain transactions
 */
@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);
  private nonceMap: Map<string, number> = new Map();
  private pendingTransactions: Map<
    string,
    ethers.providers.TransactionResponse
  > = new Map();
  private provider: ethers.providers.JsonRpcProvider;

  constructor(
    private readonly configService: ConfigService,
    private readonly walletService: WalletService,
  ) {
    this.initializeProvider();
  }

  /**
   * Initialize the Ethereum provider
   */
  private initializeProvider(): void {
    const config = this.configService.get<BlockchainModuleConfig>(
      'blockchain',
      { infer: true },
    );
    if (!config) {
      throw new Error('Blockchain configuration not found');
    }

    this.provider = new ethers.providers.JsonRpcProvider(
      config.blockchain.provider,
    );
    this.logger.log(
      `Provider initialized for network: ${config.blockchain.network}`,
    );
  }

  /**
   * Sign and send a transaction
   *
   * @param walletId - ID of the wallet to use for signing
   * @param to - Recipient address
   * @param data - Transaction data
   * @param value - Transaction value in wei
   * @param priorityLevel - Priority level for gas price (low, medium, high)
   * @returns Transaction hash
   */
  async sendTransaction(
    walletId: string,
    to: string,
    data: string,
    value: string = '0',
    priorityLevel: 'low' | 'medium' | 'high' = 'medium',
  ): Promise<string> {
    try {
      const wallet = this.walletService.getWallet(walletId, this.provider);
      const config = this.configService.get<BlockchainModuleConfig>(
        'blockchain',
        { infer: true },
      );

      if (!config) {
        throw new Error('Blockchain configuration not found');
      }

      // Get the next nonce for this wallet
      const nonce = await this.getNextNonce(wallet.address);

      // Get optimized gas price based on priority level
      const { maxFeePerGas, maxPriorityFeePerGas } =
        await this.getOptimizedGasPrice(priorityLevel);

      // Prepare transaction
      const tx = {
        to,
        data,
        value: ethers.utils.parseEther(value),
        nonce,
        gasLimit: config.wallet.gasLimit,
        maxFeePerGas,
        maxPriorityFeePerGas,
        type: 2, // EIP-1559 transaction
      };

      // Sign and send transaction
      const txResponse = await wallet.sendTransaction(tx);
      this.logger.log(`Transaction sent: ${txResponse.hash}`);

      // Store pending transaction
      this.pendingTransactions.set(txResponse.hash, txResponse);

      // Wait for transaction confirmation in the background
      await this.waitForConfirmation(txResponse.hash);

      return txResponse.hash;
    } catch (error) {
      this.logger.error(`Error sending transaction: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get the next nonce for a wallet address
   *
   * @param address - Wallet address
   * @returns Next nonce
   */
  private async getNextNonce(address: string): Promise<number> {
    try {
      // Get the current nonce from the blockchain
      const onchainNonce = await this.provider.getTransactionCount(
        address,
        'pending',
      );

      // Get the locally tracked nonce
      const localNonce = this.nonceMap.get(address) || 0;

      // Use the higher of the two
      const nextNonce = Math.max(onchainNonce, localNonce);

      // Update the nonce map
      this.nonceMap.set(address, nextNonce + 1);

      return nextNonce;
    } catch (error) {
      this.logger.error(`Error getting nonce: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get optimized gas price based on network conditions and priority level
   *
   * @param priorityLevel - Priority level (low, medium, high)
   * @returns Optimized gas price
   */
  private async getOptimizedGasPrice(
    priorityLevel: 'low' | 'medium' | 'high' = 'medium',
  ): Promise<{
    maxFeePerGas: ethers.BigNumber;
    maxPriorityFeePerGas: ethers.BigNumber;
  }> {
    try {
      const config = this.configService.get<BlockchainModuleConfig>(
        'blockchain',
        { infer: true },
      );

      if (!config) {
        throw new Error('Blockchain configuration not found');
      }

      // Get fee data from the network
      const feeData = await this.provider.getFeeData();

      if (!feeData.maxFeePerGas || !feeData.maxPriorityFeePerGas) {
        // Fallback to configuration values if network doesn't support EIP-1559
        return {
          maxFeePerGas: ethers.utils.parseUnits(
            config.wallet.maxFeePerGas,
            'gwei',
          ),
          maxPriorityFeePerGas: ethers.utils.parseUnits(
            config.wallet.maxPriorityFeePerGas,
            'gwei',
          ),
        };
      }

      // Adjust based on priority level
      let priorityMultiplier: number;
      switch (priorityLevel) {
        case 'low':
          priorityMultiplier = 0.8;
          break;
        case 'high':
          priorityMultiplier = 1.5;
          break;
        case 'medium':
        default:
          priorityMultiplier = 1.0;
      }

      // Calculate adjusted values
      const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas
        .mul(Math.floor(priorityMultiplier * 100))
        .div(100);

      const maxFeePerGas = feeData.maxFeePerGas
        .mul(Math.floor(priorityMultiplier * 100))
        .div(100);

      // Ensure we don't exceed the maximum gas price
      const maxGasPrice = ethers.utils.parseUnits(
        config.gas.maxGasPrice,
        'gwei',
      );

      return {
        maxFeePerGas: maxFeePerGas.gt(maxGasPrice) ? maxGasPrice : maxFeePerGas,
        maxPriorityFeePerGas,
      };
    } catch (error) {
      this.logger.error(`Error getting optimized gas price: ${error.message}`);

      // Fallback to configuration values
      const config = this.configService.get<BlockchainModuleConfig>(
        'blockchain',
        { infer: true },
      );
      return {
        maxFeePerGas: ethers.utils.parseUnits(
          config.wallet.maxFeePerGas,
          'gwei',
        ),
        maxPriorityFeePerGas: ethers.utils.parseUnits(
          config.wallet.maxPriorityFeePerGas,
          'gwei',
        ),
      };
    }
  }

  /**
   * Wait for transaction confirmation and handle result
   *
   * @param txHash - Transaction hash
   */
  private async waitForConfirmation(txHash: string): Promise<void> {
    try {
      const tx = this.pendingTransactions.get(txHash);

      if (!tx) {
        this.logger.warn(
          `Transaction ${txHash} not found in pending transactions`,
        );
        return;
      }

      // Wait for confirmation
      const receipt = await tx.wait();

      // Remove from pending transactions
      this.pendingTransactions.delete(txHash);

      this.logger.log(
        `Transaction ${txHash} confirmed in block ${receipt.blockNumber}`,
      );
    } catch (error) {
      this.logger.error(`Transaction ${txHash} failed: ${error.message}`);

      // Remove from pending transactions
      this.pendingTransactions.delete(txHash);

      // Handle failed transaction (could implement retry logic here)
    }
  }

  /**
   * Get the status of a transaction
   *
   * @param txHash - Transaction hash
   * @returns Transaction status
   */
  async getTransactionStatus(
    txHash: string,
  ): Promise<'pending' | 'confirmed' | 'failed' | 'not_found'> {
    try {
      // Check if it's in pending transactions
      if (this.pendingTransactions.has(txHash)) {
        return 'pending';
      }

      // Check on the blockchain
      const receipt = await this.provider.getTransactionReceipt(txHash);

      if (!receipt) {
        const tx = await this.provider.getTransaction(txHash);
        return tx ? 'pending' : 'not_found';
      }

      return receipt.status === 1 ? 'confirmed' : 'failed';
    } catch (error) {
      this.logger.error(`Error getting transaction status: ${error.message}`);
      throw error;
    }
  }

  /**
   * Estimate gas for a transaction
   *
   * @param to - Recipient address
   * @param data - Transaction data
   * @param value - Transaction value in wei
   * @returns Estimated gas limit
   */
  async estimateGas(
    to: string,
    data: string,
    value: string = '0',
  ): Promise<number> {
    try {
      const gasEstimate = await this.provider.estimateGas({
        to,
        data,
        value: ethers.utils.parseEther(value),
      });

      const config = this.configService.get<BlockchainModuleConfig>(
        'blockchain',
        { infer: true },
      );

      // Apply gas limit multiplier for safety
      const gasLimit = Math.floor(
        gasEstimate.toNumber() * config.gas.gasLimitMultiplier,
      );

      return gasLimit;
    } catch (error) {
      this.logger.error(`Error estimating gas: ${error.message}`);
      throw error;
    }
  }
}
