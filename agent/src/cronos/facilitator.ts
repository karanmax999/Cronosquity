import { Facilitator, CronosNetwork } from '@crypto.com/facilitator-client';
import { JsonRpcProvider, Wallet } from 'ethers';

const FACILITATOR_NETWORK =
    process.env.FACILITATOR_NETWORK === 'mainnet'
        ? CronosNetwork.CronosMainnet
        : CronosNetwork.CronosTestnet;

const USE_MOCK_MODE = process.env.X402_USE_MOCK === 'true';

/**
 * @title X402Facilitator
 * @dev Integration wrapper for @crypto.com/facilitator-client.
 * Implements real Cronos X402 gasless payments using EIP-3009.
 * 
 * Mock Mode:
 *   Set X402_USE_MOCK=true to bypass real Cronos calls and return simulated responses.
 *   Useful for local testing and demos without real devUSDC.e or gas costs.
 */
export class X402Facilitator {
    private client: Facilitator;

    constructor() {
        this.client = new Facilitator({
            network: FACILITATOR_NETWORK,
            // apiKey: process.env.X402_API_KEY, // enable once required/supported
        });
        
        const modeStr = USE_MOCK_MODE ? 'MOCK' : 'REAL';
        const netStr = FACILITATOR_NETWORK === CronosNetwork.CronosMainnet ? 'MAINNET' : 'TESTNET';
        console.log(`\n\x1b[33m[X402] Facilitator initialized on ${netStr} [${modeStr} MODE]\x1b[0m`);
    }

    /**
     * @dev Executes a cross-chain payout using the Cronos X402 Facilitator.
     * Flow: requirements → header → verify → settle
     * 
     * In mock mode, simulates the flow without hitting Cronos testnet.
     */
    async requestCrossChainPayout(params: {
        recipient: string;
        amount: string;        // base units, e.g. '1000000' = 1 USDC.e (6 decimals)
        description?: string;
    }) {
        const { recipient, amount, description = 'Agent payout via X402' } = params;

        console.log(`\n\x1b[33m[x402_BRIDGE] Initializing cross-chain payout via Facilitator SDK...\x1b[0m`);
        console.log(`  > Recipient: ${recipient}`);
        console.log(`  > Amount: ${amount} USDC.e (base units)`);
        console.log(`  > Description: ${description}`);
        console.log(`  > Mode: ${USE_MOCK_MODE ? '🎭 MOCK' : '🔴 REAL'}`);

        try {
            // Mock mode: Simulate the full flow locally
            if (USE_MOCK_MODE) {
                console.log(`  \x1b[36m[MOCK 1/5] Generating payment requirements...\x1b[0m`);
                console.log(`  \x1b[36m[MOCK 2/5] Initializing payer wallet...\x1b[0m`);
                console.log(`  > Payer address: 0xMOCK_PAYER`);
                console.log(`  \x1b[36m[MOCK 3/5] Generating EIP-3009 payment header...\x1b[0m`);
                console.log(`  \x1b[36m[MOCK 4/5] Verifying payment with facilitator...\x1b[0m`);
                console.log(`  \x1b[32m✓ Payment verified (mock)\x1b[0m`);
                console.log(`  \x1b[36m[MOCK 5/5] Settling payment on-chain...\x1b[0m`);
                
                const mockTxHash = `0xmock_${Date.now().toString().slice(-12)}`;
                console.log(`  \x1b[32m✅ x402_PAYMENT_SETTLED (MOCK): Tx: ${mockTxHash}\x1b[0m`);

                return {
                    success: true,
                    txHash: mockTxHash,
                    facilitatorReference: `ref_mock_${Date.now()}`,
                    network: FACILITATOR_NETWORK === CronosNetwork.CronosMainnet ? 'cronos-mainnet' : 'cronos-testnet',
                    mock: true
                };
            }

            // Real mode: Execute actual X402 flow
            // 1. Build X402 payment requirements (off-chain)
            console.log(`  \x1b[36m[1/5] Generating payment requirements...\x1b[0m`);
            const requirements = this.client.generatePaymentRequirements({
                payTo: recipient,
                description,
                maxAmountRequired: amount,
            });

            // 2. Create signer on Cronos (payer wallet)
            console.log(`  \x1b[36m[2/5] Initializing payer wallet...\x1b[0m`);
            const provider = new JsonRpcProvider(
                process.env.CRONOS_RPC_URL || 'https://evm-t3.cronos.org'
            );

            if (!process.env.PAYOUT_PRIVATE_KEY) {
                throw new Error('PAYOUT_PRIVATE_KEY is not set in environment');
            }

            const signer = new Wallet(process.env.PAYOUT_PRIVATE_KEY, provider);
            console.log(`  > Payer address: ${await signer.getAddress()}`);

            // 3. Generate EIP-3009 payment header (Base64)
            console.log(`  \x1b[36m[3/5] Generating EIP-3009 payment header...\x1b[0m`);
            const header = await this.client.generatePaymentHeader({
                to: recipient,
                value: amount,
                signer,
                validBefore: Math.floor(Date.now() / 1000) + 600, // 10 min expiry
            });

            // 4. Build verification payload
            const verifyBody = this.client.buildVerifyRequest(header, requirements);

            // 5. Verify payment
            console.log(`  \x1b[36m[4/5] Verifying payment with facilitator...\x1b[0m`);
            const verify = await this.client.verifyPayment(verifyBody);
            if (!verify.isValid) {
                throw new Error(`X402 verification failed: ${(verify as any).reason ?? 'unknown reason'}`);
            }
            console.log(`  \x1b[32m✓ Payment verified\x1b[0m`);

            // 6. Settle payment on-chain
            console.log(`  \x1b[36m[5/5] Settling payment on-chain...\x1b[0m`);
            const settle = await this.client.settlePayment(verifyBody);

            console.log(`  \x1b[32m✅ x402_PAYMENT_SETTLED: Tx: ${settle.txHash}\x1b[0m`);

            // 7. Return normalized response
            return {
                success: true,
                txHash: settle.txHash,
                facilitatorReference: (verify as any).referenceId ?? null,
                network: FACILITATOR_NETWORK === CronosNetwork.CronosMainnet ? 'cronos-mainnet' : 'cronos-testnet',
            };
        } catch (err: any) {
            console.error(`  \x1b[31m❌ x402_FACILITATOR_ERROR:\x1b[0m`, {
                recipient,
                amount,
                message: err?.message,
                stack: err?.stack,
            });

            return {
                success: false,
                error: err?.message ?? 'Unknown facilitator error',
            };
        }
    }
}
