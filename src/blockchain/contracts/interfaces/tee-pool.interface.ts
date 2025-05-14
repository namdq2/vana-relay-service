/**
 * Interface for the TEE Pool smart contract
 *
 * This contract handles Trusted Execution Environment (TEE) operations
 * and contribution proof requests
 */
export interface ITeePoolContract {
  /**
   * Requests a contribution proof from the TEE Pool
   *
   * @param fileId - ID of the file in the Data Registry
   * @returns Transaction hash
   */
  requestContributionProof(fileId: number): Promise<string>;
}
