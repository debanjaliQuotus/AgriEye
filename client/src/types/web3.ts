import { Eip1193Provider } from 'ethers';


export interface EthereumProvider extends Eip1193Provider {
  on(event: 'accountsChanged', handler: (accounts: string[]) => void): void;
  removeListener(event: 'accountsChanged', handler: (accounts: string[]) => void): void;
  selectedAddress?: string | null; // Optional for TypeScript compatibility
  ethereum?: Eip1193Provider; // Optional for TypeScript compatibility
}

export interface Web3ContextType {
  account: string | null;
  connectWallet: () => Promise<void>;
  isConnected: boolean;
  isConnecting: boolean; // Track connection state
  
}