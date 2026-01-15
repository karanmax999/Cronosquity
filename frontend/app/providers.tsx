'use client';

import * as React from 'react';
import {
    RainbowKitProvider,
    getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import {
    cronosTestnet,
    mainnet,
} from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, http } from 'wagmi';
import '@rainbow-me/rainbowkit/styles.css';

const config = getDefaultConfig({
    appName: 'Croquity Treasury',
    projectId: '3fcc6bba6f1de962d911bb5b5c3dba68',
    chains: [mainnet, cronosTestnet],
    transports: {
        [mainnet.id]: http(),
        [cronosTestnet.id]: http(),
    },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    {mounted && children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
