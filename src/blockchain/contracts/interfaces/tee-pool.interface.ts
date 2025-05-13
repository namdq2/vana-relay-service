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
   * @param contributorAddress - Address of the contributor requesting the proof
   * @param dataId - Identifier of the data being contributed
   * @param contributionHash - Hash of the contribution data
   * @returns Transaction hash
   */
  requestContributionProof(
    contributorAddress: string,
    dataId: string,
    contributionHash: string,
  ): Promise<string>;
}
