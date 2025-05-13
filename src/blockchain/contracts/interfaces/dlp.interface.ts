/**
 * Interface for the DLP (Data Labeling Protocol) smart contract
 *
 * This contract handles reward distribution for data labeling contributions
 */
export interface IDlpContract {
  /**
   * Requests a reward for a data labeling contribution
   *
   * @param contributorAddress - Address of the contributor requesting the reward
   * @param contributionId - Identifier of the contribution
   * @param proofHash - Hash of the proof of contribution
   * @param rewardAmount - Amount of tokens to be rewarded
   * @returns Transaction hash
   */
  requestReward(
    contributorAddress: string,
    contributionId: string,
    proofHash: string,
    rewardAmount: string,
  ): Promise<string>;
}
