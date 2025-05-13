import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Service for securely managing wallet private keys
 */
@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);
  private readonly encryptionKey: string;
  private readonly storagePath: string;
  private readonly algorithm = 'aes-256-cbc';
  private walletCache: Map<string, ethers.Wallet> = new Map();

  constructor(private readonly configService: ConfigService) {
    // Get encryption key from environment variable
    const encryptionKeyEnvVar =
      process.env.WALLET_ENCRYPTION_KEY_ENV_VAR || 'WALLET_ENCRYPTION_KEY';
    if (!encryptionKeyEnvVar) {
      throw new Error(
        'Environment variable for encryption key not set: WALLET_ENCRYPTION_KEY_ENV_VAR',
      );
    }

    const encryptionKey = process.env[encryptionKeyEnvVar];
    if (!encryptionKey) {
      throw new Error(
        `Encryption key not found in environment variable: ${encryptionKeyEnvVar}`,
      );
    }

    this.encryptionKey = encryptionKey;
    if (!this.encryptionKey) {
      throw new Error(
        `Encryption key not found in environment variable: ${encryptionKeyEnvVar}`,
      );
    }

    // Create storage directory if it doesn't exist
    this.storagePath =
      process.env.WALLET_STORAGE_PATH ||
      path.join(process.cwd(), '.wallet-storage');
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
      this.logger.log(`Created wallet storage directory: ${this.storagePath}`);
    }
  }

  /**
   * Store a wallet private key securely
   *
   * @param walletId - Identifier for the wallet
   * @param privateKey - Private key to store
   */
  storeWallet(walletId: string, privateKey: string): void {
    try {
      // Encrypt the private key
      const encryptedData = this.encrypt(privateKey);

      // Store the encrypted data
      const filePath = path.join(this.storagePath, `${walletId}.enc`);
      fs.writeFileSync(filePath, JSON.stringify(encryptedData));

      this.logger.log(`Wallet ${walletId} stored securely`);
    } catch (error) {
      this.logger.error(`Failed to store wallet ${walletId}: ${error.message}`);
      throw new Error(`Failed to store wallet: ${error.message}`);
    }
  }

  /**
   * Retrieve a wallet by ID
   *
   * @param walletId - Identifier for the wallet
   * @param provider - Ethereum provider to use with the wallet
   * @returns Ethers wallet instance
   */
  getWallet(
    walletId: string,
    provider?: ethers.providers.Provider,
  ): ethers.Wallet {
    // Check if wallet is in cache
    if (this.walletCache.has(walletId)) {
      const wallet = this.walletCache.get(walletId);
      if (!wallet) {
        throw new Error(`Wallet ${walletId} not found in cache`);
      }
      // If provider is provided and different from current provider, connect to new provider
      if (provider && wallet.provider !== provider) {
        return wallet.connect(provider);
      }
      return wallet;
    }

    try {
      const filePath = path.join(this.storagePath, `${walletId}.enc`);

      if (!fs.existsSync(filePath)) {
        throw new Error(`Wallet ${walletId} not found`);
      }

      // Read and decrypt the private key
      const encryptedData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const privateKey = this.decrypt(encryptedData);

      // Create wallet instance
      const wallet = provider
        ? new ethers.Wallet(privateKey, provider)
        : new ethers.Wallet(privateKey);

      // Cache the wallet
      this.walletCache.set(walletId, wallet);

      this.logger.log(`Wallet ${walletId} retrieved successfully`);
      return wallet;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve wallet ${walletId}: ${error.message}`,
      );
      throw new Error(`Failed to retrieve wallet: ${error.message}`);
    }
  }

  /**
   * Check if a wallet exists
   *
   * @param walletId - Identifier for the wallet
   * @returns True if wallet exists, false otherwise
   */
  walletExists(walletId: string): boolean {
    const filePath = path.join(this.storagePath, `${walletId}.enc`);
    return fs.existsSync(filePath);
  }

  /**
   * Delete a wallet
   *
   * @param walletId - Identifier for the wallet
   */
  deleteWallet(walletId: string): void {
    try {
      const filePath = path.join(this.storagePath, `${walletId}.enc`);

      if (!fs.existsSync(filePath)) {
        throw new Error(`Wallet ${walletId} not found`);
      }

      // Remove from cache
      this.walletCache.delete(walletId);

      // Delete the file
      fs.unlinkSync(filePath);

      this.logger.log(`Wallet ${walletId} deleted successfully`);
    } catch (error) {
      this.logger.error(
        `Failed to delete wallet ${walletId}: ${error.message}`,
      );
      throw new Error(`Failed to delete wallet: ${error.message}`);
    }
  }

  /**
   * Rotate a wallet key
   *
   * @param walletId - Identifier for the wallet
   * @returns New wallet address
   */
  async rotateWalletKey(walletId: string): Promise<string> {
    try {
      // Get the current wallet
      // const wallet = await this.getWallet(walletId);

      // Generate a new wallet
      const newWallet = ethers.Wallet.createRandom();

      // Store the new wallet
      await this.storeWallet(walletId, newWallet.privateKey);

      // Update cache
      this.walletCache.set(walletId, newWallet);

      this.logger.log(`Wallet ${walletId} key rotated successfully`);
      return newWallet.address;
    } catch (error) {
      this.logger.error(
        `Failed to rotate wallet ${walletId} key: ${error.message}`,
      );
      throw new Error(`Failed to rotate wallet key: ${error.message}`);
    }
  }

  /**
   * Encrypt data using the encryption key
   *
   * @param data - Data to encrypt
   * @returns Encrypted data with IV
   */
  private encrypt(data: string): { iv: string; encryptedData: string } {
    // Generate a random initialization vector
    const iv = crypto.randomBytes(16);

    // Create cipher
    const cipher = crypto.createCipheriv(
      this.algorithm,
      crypto
        .createHash('sha256')
        .update(this.encryptionKey)
        .digest('base64')
        .substr(0, 32),
      iv,
    );

    // Encrypt the data
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return {
      iv: iv.toString('hex'),
      encryptedData: encrypted,
    };
  }

  /**
   * Decrypt data using the encryption key
   *
   * @param encryptedData - Encrypted data with IV
   * @returns Decrypted data
   */
  private decrypt(encryptedData: {
    iv: string;
    encryptedData: string;
  }): string {
    // Convert IV from hex to Buffer
    const iv = Buffer.from(encryptedData.iv, 'hex');

    // Create decipher
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      crypto
        .createHash('sha256')
        .update(this.encryptionKey)
        .digest('base64')
        .substr(0, 32),
      iv,
    );

    // Decrypt the data
    let decrypted = decipher.update(encryptedData.encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
