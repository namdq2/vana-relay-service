import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseContractService } from './base-contract.service';
import { IDataRegistryContract } from '../interfaces';
import { dataRegistryAbi } from '../abis';
import { BlockchainModuleConfig } from '../../config/blockchain-config.type';
import { WalletService } from '../../wallet/wallet.service';
import { TransactionService } from '../../wallet/transaction.service';

/**
 * Service for interacting with the Data Registry smart contract
 */
@Injectable()
export class DataRegistryContractService
  extends BaseContractService
  implements IDataRegistryContract
{
  constructor(
    protected readonly configService: ConfigService,
    protected readonly walletService: WalletService,
    protected readonly transactionService: TransactionService,
  ) {
    super(configService, walletService, transactionService);
    this.initializeDataRegistryContract();
  }

  /**
   * Initialize the Data Registry contract
   */
  private initializeDataRegistryContract(): void {
    const config = this.configService.get<BlockchainModuleConfig>(
      'blockchain',
      { infer: true },
    );
    if (!config) {
      throw new Error('Blockchain configuration not found');
    }

    const contractAddress = config.contracts.dataRegistry.address;
    this.initializeContract(dataRegistryAbi, contractAddress);
  }

  /**
   * Adds a file to the registry with specified permissions
   *
   * @param fileId - Unique identifier for the file
   * @param fileHash - Hash of the file content
   * @param fileSize - Size of the file in bytes
   * @param fileType - Type/format of the file
   * @param permissionedUsers - Array of user addresses who have permission to access the file
   * @returns Transaction hash
   */
  async addFileWithPermission(
    fileId: string,
    fileHash: string,
    fileSize: number,
    fileType: string,
    permissionedUsers: string[],
  ): Promise<string> {
    this.logger.log(
      `Adding file ${fileId} to registry with permissions for ${permissionedUsers.length} users`,
    );

    return this.sendTransaction(
      'addFileWithPermission',
      fileId,
      fileHash,
      fileSize,
      fileType,
      permissionedUsers,
    );
  }
}
