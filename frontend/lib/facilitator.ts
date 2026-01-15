import { Facilitator, CronosNetwork } from '@crypto.com/facilitator-client';

// Singleton instance for the app
// We might want to allow network switching, but for now we default to Testnet as per request/env.
const network = process.env.NEXT_PUBLIC_CRONOS_NETWORK === 'mainnet'
    ? CronosNetwork.CronosMainnet
    : CronosNetwork.CronosTestnet;

export const facilitator = new Facilitator({
    network,
});

export const getFacilitator = () => facilitator;
