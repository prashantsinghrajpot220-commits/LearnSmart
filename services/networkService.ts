import NetInfo from '@react-native-community/netinfo';
import { create } from 'zustand';

interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean;
  connectionType: string | null;
  setNetworkStatus: (status: any) => void;
  initializeNetworkListener: () => () => void;
  cleanupNetworkListener: () => void;
}

const NetworkStore = create<NetworkState>((set, get) => ({
  isConnected: true,
  isInternetReachable: true,
  connectionType: null,
  setNetworkStatus: (status: any) => {
    set({
      isConnected: status.isConnected ?? false,
      isInternetReachable: status.isInternetReachable ?? false,
      connectionType: status.type,
    });
  },
  initializeNetworkListener: () => {
    // First, get initial state
    NetInfo.fetch().then((status) => {
      get().setNetworkStatus(status);
    });

    // Then, subscribe to changes
    const unsubscribe = NetInfo.addEventListener((status) => {
      get().setNetworkStatus(status);
    });

    return unsubscribe;
  },
  cleanupNetworkListener: () => {
    set({
      isConnected: true,
      isInternetReachable: true,
      connectionType: null,
    });
  },
}));

let networkSubscription: (() => void) | null = null;

export function initializeNetworkListener(): () => void {
  networkSubscription = NetworkStore.getState().initializeNetworkListener();
  return networkSubscription;
}

export function cleanupNetworkListener(): void {
  if (networkSubscription) {
    networkSubscription();
    networkSubscription = null;
  }
  NetworkStore.getState().cleanupNetworkListener();
}

export function useNetworkStatus() {
  return {
    isConnected: NetworkStore((state) => state.isConnected),
    isInternetReachable: NetworkStore((state) => state.isInternetReachable),
    connectionType: NetworkStore((state) => state.connectionType),
  };
}

export async function checkNetworkConnectivity(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return state.isConnected ?? false;
}

export async function checkInternetReachability(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return state.isInternetReachable ?? false;
}

export const NetworkEvents = {
  NETWORK_CHANGE: 'networkChange',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
};

export type NetworkEventType = 
  | typeof NetworkEvents.NETWORK_CHANGE
  | typeof NetworkEvents.CONNECTED
  | typeof NetworkEvents.DISCONNECTED;

export type NetworkCallback = (event: NetworkEventType, details: any) => void;

const networkCallbacks: Set<NetworkCallback> = new Set();

export function subscribeToNetworkEvents(callback: NetworkCallback): () => void {
  networkCallbacks.add(callback);

  return () => {
    networkCallbacks.delete(callback);
  };
}

function notifyNetworkChange(event: NetworkEventType, details: any): void {
  networkCallbacks.forEach((callback) => {
    try {
      callback(event, details);
    } catch (error) {
      console.error('Network callback error:', error);
    }
  });
}

// Initialize with periodic checking
let connectivityCheckInterval: NodeJS.Timeout | null = null;

export function startPeriodicConnectivityCheck(intervalMs: number = 30000): void {
  if (connectivityCheckInterval) {
    clearInterval(connectivityCheckInterval);
  }

  connectivityCheckInterval = setInterval(async () => {
    const isConnected = await checkNetworkConnectivity();
    const state = await NetInfo.fetch();
    
    if (isConnected) {
      notifyNetworkChange(NetworkEvents.CONNECTED, state);
    } else {
      notifyNetworkChange(NetworkEvents.DISCONNECTED, state);
    }
  }, intervalMs);
}

export function stopPeriodicConnectivityCheck(): void {
  if (connectivityCheckInterval) {
    clearInterval(connectivityCheckInterval);
    connectivityCheckInterval = null;
  }
}

export const networkService = {
  initialize: initializeNetworkListener,
  cleanup: cleanupNetworkListener,
  checkConnectivity: checkNetworkConnectivity,
  checkInternetReachability,
  subscribe: subscribeToNetworkEvents,
  startPeriodicCheck: startPeriodicConnectivityCheck,
  stopPeriodicCheck: stopPeriodicConnectivityCheck,
};
