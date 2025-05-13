/**
 * Interface for the Data Registry smart contract
 *
 * This contract handles file registration and permission management
 */
export interface IDataRegistryContract {
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
  addFileWithPermission(
    fileId: string,
    fileHash: string,
    fileSize: number,
    fileType: string,
    permissionedUsers: string[],
  ): Promise<string>;
}
