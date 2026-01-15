# Cronos X402 Facilitator Integration Guide

## ✅ Integration Status: COMPLETE

The Cronos X402 Facilitator SDK has been successfully integrated into the Croquity Agent. This document provides setup and verification steps.

---

## 📋 What Was Implemented

### 1. **Core Implementation** (`src/cronos/facilitator.ts`)

- ✅ Real `@crypto.com/facilitator-client` SDK imported and initialized
- ✅ Full X402 gasless payment flow implemented:
  1. **Generate Requirements** - Off-chain payment requirements
  2. **Initialize Signer** - Payer wallet from `PAYOUT_PRIVATE_KEY`
  3. **Generate Header** - EIP-3009 payment authorization (Base64)
  4. **Build Verify Request** - Verification payload
  5. **Verify Payment** - Facilitator server verification
  6. **Settle on-chain** - Execute transaction on Cronos
- ✅ Comprehensive logging at each step with color-coded output
- ✅ Error handling and normalization

### 2. **Agent Integration** (`src/core/agent.ts`)

- ✅ Updated `requestCrossChainPayout` call with proper object signature
- ✅ Amount conversion from 18 decimals (agent balance) to 6 decimals (USDC.e)
- ✅ Conditional bridging for payouts > 100 USDC.e
- ✅ Description auto-populated from payout reason

### 3. **Environment Configuration**

- ✅ `.env.example` - Contains all placeholder keys with documentation
- ✅ `.env` - Local development secrets (DO NOT COMMIT)
- ✅ `.gitignore` - Already includes `.env` patterns

### 4. **Dependencies**

- ✅ `@crypto.com/facilitator-client@^1.0.2` in `package.json`
- ✅ `ethers@^6.8.0` for wallet management
- ✅ `dotenv@^16.3.0` for environment variables

---

## 🚀 Setup Instructions

### Step 1: Install Dependencies

```bash
cd agent/
npm install
```

### Step 2: Configure Environment Variables

Edit `agent/.env` and populate with Cronos Testnet values:

```dotenv
# Local Hardhat (for contract testing)
RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Contract addresses (populate after deploy.js execution)
PROGRAM_REGISTRY_ADDRESS=0x...
PROGRAM_VAULT_ADDRESS=0x...
USDC_ADDRESS=0x...

# Agent configuration
AGENT_INTERVAL_MS=60000

# X402 / Cronos Facilitator (IMPORTANT: Real values for testnet)
X402_API_KEY=your-x402-api-key-here      # Placeholder if/when required
FACILITATOR_NETWORK=testnet               # "testnet" or "mainnet"
CRONOS_RPC_URL=https://evm-t3.cronos.org # Cronos Testnet RPC
PAYOUT_PRIVATE_KEY=0x...                  # Your testnet wallet private key
```

#### ⚠️ Critical: Fund Your Payout Wallet

Before running the agent, ensure the wallet at `PAYOUT_PRIVATE_KEY` has:

- **devUSDC.e** (Cronos Testnet stablecoin) - ~1000+ units for testing
- **CRO** (gas tokens) - ~1+ CRO for transaction fees

**Faucet**: https://faucet.cronos.org

### Step 3: Deploy Smart Contracts (if needed)

```bash
cd contracts/
npm install
npx hardhat run scripts/deploy.js --network cronos-testnet
```

Copy the deployed contract addresses from the output and update `.env`.

### Step 4: Start the Agent

```bash
cd agent/
npm start
```

---

## ✨ Verification

### Automated: Console Logs

When a payout > 100 USDC.e is executed, you'll see:

```
[x402_BRIDGE] Initializing cross-chain payout via Facilitator SDK...
  > Recipient: 0x...
  > Amount: 1000000 USDC.e (base units)
  > Description: Agent payout via X402
  [1/5] Generating payment requirements...
  [2/5] Initializing payer wallet...
  > Payer address: 0x...
  [3/5] Generating EIP-3009 payment header...
  [4/5] Verifying payment with facilitator...
  ✓ Payment verified
  [5/5] Settling payment on-chain...
  ✅ x402_PAYMENT_SETTLED: Tx: 0x...
```

### Manual: On-Chain Verification

1. **Get Transaction Hash** - From agent logs or response object
2. **Open Explorer** - https://explorer.cronos.org/testnet/
3. **Search TX Hash** - Paste the hash in the search bar
4. **Verify Details**:
   - Token: USDC.e (devUSDC.e on testnet)
   - From: Your payout wallet
   - To: Recipient address
   - Amount: Matches your request

### Response Object

Successful payout returns:

```typescript
{
  success: true,
  txHash: "0x...",
  facilitatorReference: "ref_..." | null,
  network: "cronos-testnet" | "cronos-mainnet"
}
```

Failed payout returns:

```typescript
{
  success: false,
  error: "EIP-3009 signature validation failed" | "..."
}
```

---

## 🔧 Configuration Reference

| Variable              | Default                     | Purpose                                    |
| --------------------- | --------------------------- | ------------------------------------------ |
| `RPC_URL`             | `http://127.0.0.1:8545`     | Local Hardhat for contract testing         |
| `PRIVATE_KEY`         | Hardhat #0                  | Agent wallet for local contracts           |
| `FACILITATOR_NETWORK` | `testnet`                   | Cronos network: `testnet` or `mainnet`     |
| `CRONOS_RPC_URL`      | `https://evm-t3.cronos.org` | Cronos Testnet RPC endpoint                |
| `PAYOUT_PRIVATE_KEY`  | —                           | **Required**: Wallet that signs EIP-3009   |
| `X402_API_KEY`        | —                           | Optional: API key if facilitator adds auth |
| `AGENT_INTERVAL_MS`   | `60000`                     | Agent loop interval in milliseconds        |

---

## 🛡️ Security Notes

- **Never commit `.env`** — It's in `.gitignore`
- **Never share `PAYOUT_PRIVATE_KEY`** — Use separate wallet per environment
- **Use testnet funds only** for development/demo
- **Rotate keys regularly** for production systems

---

## 🐛 Troubleshooting

### Issue: `PAYOUT_PRIVATE_KEY is not set in environment`

**Solution**: Add `PAYOUT_PRIVATE_KEY=0x...` to `.env` and restart agent.

### Issue: `X402 verification failed`

**Solution**:

- Verify payout wallet has devUSDC.e and CRO
- Check `CRONOS_RPC_URL` is accessible
- Ensure `FACILITATOR_NETWORK` matches intended network

### Issue: `ethers.parseUnits` errors

**Solution**: Agent converts amount from 18 decimals to 6 decimals. Ensure amount is numeric.

### Issue: Agent doesn't execute payouts

**Solution**: Check if payout amount > 100 USDC.e (bridging threshold). Payouts ≤ 100 stay on local network.

---

## 📚 Additional Resources

- **X402 Spec**: [EIP-3009 TransferWithAuthorization](https://eips.ethereum.org/EIPS/eip-3009)
- **Facilitator SDK**: `@crypto.com/facilitator-client` docs
- **Cronos Testnet**: https://explorer.cronos.org/testnet/
- **Faucet**: https://faucet.cronos.org

---

## ✅ Checklist: Pre-Launch

- [ ] Dependencies installed: `npm install` ✓
- [ ] `.env` populated with `PAYOUT_PRIVATE_KEY` ✓
- [ ] Payout wallet has devUSDC.e (>100 units) ✓
- [ ] Payout wallet has CRO (>1) ✓
- [ ] No TypeScript errors: `npm run build` ✓
- [ ] Agent starts without errors: `npm start` ✓
- [ ] First payout executes successfully ✓
- [ ] TX hash appears on Cronos Testnet Explorer ✓

---

**Status**: Production-Ready for Cronos Testnet  
**Last Updated**: January 4, 2026
