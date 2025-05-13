export type BlockchainConfig = {
  provider: string;
  network: string;
  chainId: number;
};

export type WalletConfig = {
  privateKeyEnvVar: string;
  gasLimit: number;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
};

export type ContractsConfig = {
  dataRegistry: {
    address: string;
  };
  teePool: {
    address: string;
  };
  dlp: {
    address: string;
  };
};

export type GasConfig = {
  maxGasPrice: string;
  gasLimitMultiplier: number;
  retryCount: number;
  retryDelayMs: number;
};

export type BlockchainModuleConfig = {
  blockchain: BlockchainConfig;
  wallet: WalletConfig;
  contracts: ContractsConfig;
  gas: GasConfig;
};
