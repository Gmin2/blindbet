'use client';

import { useState, useCallback } from 'react';

const SDK_CDN_URL = 'https://cdn.zama.org/relayer-sdk-js/0.3.0-5/relayer-sdk-js.umd.cjs';

type FhevmInstance = any;

interface UseFhevmReturn {
  instance: FhevmInstance | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  initialize: () => Promise<FhevmInstance>;
}

let globalInstance: FhevmInstance | null = null;
let initializationPromise: Promise<FhevmInstance> | null = null;

// Load RelayerSDK from CDN
async function loadRelayerSDK(): Promise<any> {
  console.log('[loadRelayerSDK] Checking if SDK already loaded...');

  // Check if already loaded
  const existingSDK = (window as any).RelayerSDK || (window as any).relayerSDK;
  if (existingSDK) {
    console.log('[loadRelayerSDK] SDK already loaded');
    (window as any).relayerSDK = existingSDK; // Normalize
    return existingSDK;
  }

  console.log('[loadRelayerSDK] Loading SDK from CDN:', SDK_CDN_URL);

  // Load SDK from CDN
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SDK_CDN_URL;
    script.type = 'text/javascript';
    script.async = true;

    script.onload = () => {
      console.log('[loadRelayerSDK] Script loaded');
      const sdk = (window as any).RelayerSDK || (window as any).relayerSDK;
      if (!sdk) {
        console.error('[loadRelayerSDK] SDK not found after loading');
        reject(new Error('RelayerSDK not found after loading'));
        return;
      }
      console.log('[loadRelayerSDK] ✅ SDK loaded successfully');
      (window as any).relayerSDK = sdk; // Normalize
      resolve(sdk);
    };

    script.onerror = () => {
      console.error('[loadRelayerSDK] Failed to load script');
      reject(new Error('Failed to load RelayerSDK from CDN'));
    };

    document.head.appendChild(script);
  });
}

// Initialize SDK (WASM)
async function initializeSDK(sdk: any): Promise<void> {
  console.log('[initializeSDK] Checking if SDK already initialized...');

  if (sdk.__initialized__) {
    console.log('[initializeSDK] SDK already initialized');
    return;
  }

  console.log('[initializeSDK] Initializing SDK...');

  try {
    const result = await sdk.initSDK();
    sdk.__initialized__ = result;
    if (!result) {
      throw new Error('SDK initialization returned false');
    }
    console.log('[initializeSDK] ✅ SDK initialized with CDN');
  } catch (error) {
    console.warn('[initializeSDK] CDN initialization failed, trying local WASM fallback:', error);
    const result = await sdk.initSDK({
      tfheParams: '/tfhe_bg.wasm',
      kmsParams: '/kms_lib_bg.wasm',
    });
    sdk.__initialized__ = result;
    if (!result) {
      throw new Error('SDK initialization with local files returned false');
    }
    console.log('[initializeSDK] ✅ SDK initialized with local WASM files');
  }
}

export function useFhevm(): UseFhevmReturn {
  const [instance, setInstance] = useState<FhevmInstance | null>(globalInstance);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(!!globalInstance);

  const initialize = useCallback(async (): Promise<FhevmInstance> => {
    console.log('[useFhevm] Initialize called');

    // If already initialized, return
    if (globalInstance) {
      console.log('[useFhevm] Already initialized');
      setInstance(globalInstance);
      setInitialized(true);
      return globalInstance;
    }

    // If initialization in progress, wait
    if (initializationPromise) {
      console.log('[useFhevm] Initialization in progress, waiting...');
      const inst = await initializationPromise;
      setInstance(inst);
      setInitialized(true);
      return inst;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('[useFhevm] Step 1: Loading RelayerSDK...');
      const sdk = await loadRelayerSDK();

      console.log('[useFhevm] Step 2: Initializing SDK (WASM)...');
      await initializeSDK(sdk);

      // Get config from loaded SDK
      const configBase = sdk.ZamaEthereumConfig || sdk.SepoliaConfig;
      if (!configBase) {
        throw new Error('No config found in SDK');
      }

      console.log('[useFhevm] Using config:', {
        aclAddress: configBase.aclContractAddress,
        chainId: configBase.chainId,
        relayerUrl: configBase.relayerUrl,
      });

      // Create config with network provider
      const config = {
        ...configBase,
        network: window.ethereum,
      };

      console.log('[useFhevm] Step 3: Creating FhevmInstance...');
      initializationPromise = sdk.createInstance(config);
      const fhevmInstance = await initializationPromise;

      console.log('[useFhevm] ✅ FhevmInstance created successfully!');

      globalInstance = fhevmInstance;
      setInstance(fhevmInstance);
      setInitialized(true);
      setLoading(false);
      return fhevmInstance;
    } catch (err: any) {
      console.error('[useFhevm] ❌ Error:', err);
      setError(err.message || 'Failed to initialize FHEVM');
      setLoading(false);
      initializationPromise = null;
      throw err;
    }
  }, []);

  return {
    instance,
    loading,
    error,
    initialized,
    initialize,
  };
}
