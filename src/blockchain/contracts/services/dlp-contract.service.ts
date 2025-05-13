import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseContractService } from './base-contract.service';
import { IDlpContract } from '../interfaces';
import { dlpAbi } from '../abis';
import { BlockchainModuleConfig } from '../../config/blockchain-config.type';
import { WalletService } from '../../wallet/wallet.service';
import { TransactionService } from '../../wallet/transaction.service';

/**
 * Service for interacting with the DLP (Data Labeling Protocol) smart contract
 */
@Injectable()
export class DlpContractService
  extends BaseContractService
  implements IDlpContract
{
  constructor(
    protected readonly configService: ConfigService,
    protected readonly walletService: WalletService,
    protected readonly transactionService: TransactionService,
  ) {
    super(configService, walletService, transactionService);
    this.initializeDlpContract();
  }

  /**
   * Initialize the DLP contract
   */
  private initializeDlpContract(): void {
    const config = this.configService.get<BlockchainModuleConfig>(
      'blockchain',
      { infer: true },
    );
    if (!config) {
      throw new Error('Blockchain configuration not found');
    }

    const contractAddress = config.contracts.dlp.address;
    this.initializeContract(dlpAbi, contractAddress);
  }

  /**
   * Requests a reward for a data labeling contribution
   *
   * @param contributorAddress - Address of the contributor requesting the reward
   * @param contributionId - Identifier of the contribution
   * @param proofHash - Hash of the proof of contribution
   * @param rewardAmount - Amount of tokens to be rewarded
   * @returns Transaction hash
   */
  async requestReward(
    contributorAddress: string,
    contributionId: string,
    proofHash: string,
    rewardAmount: string,
  ): Promise<string> {
    this.logger.log(
      `Requesting reward of ${rewardAmount} for contributor ${contributorAddress} and contribution ${contributionId}`,
    );

    return this.sendTransaction(
      'requestReward',
      contributorAddress,
      contributionId,
      proofHash,
      rewardAmount,
    );
  }
}
