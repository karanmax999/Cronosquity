
import * as dotenv from "dotenv";
dotenv.config();

import { ethers } from "ethers";

// ABI for ERC20 Token (Standard)
const ERC20_ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function balanceOf(address account) external view returns (uint256)",
    "function decimals() external view returns (uint8)"
];

// ABI for ProgramVault (Only what we need)
const VAULT_ABI = [
    "function fundProgram(uint256 _programId, uint256 _amount) external"
];

// Configuration
const RPC_URL = process.env.RPC_URL || "https://evm-t3.cronos.org";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const VAULT_ADDRESS = process.env.PROGRAM_VAULT_ADDRESS;
const USDC_ADDRESS = process.env.USDC_ADDRESS;

// Funding amounts per program (in full tokens, not wei)
const FUNDING_AMOUNTS: { [key: number]: string } = {
    0: "2000", // Bounty
    1: "50",   // Hackathon (Small)
    2: "2000", // Hackathon
    3: "2000", // Hackathon
    4: "2000", // Hackathon
    5: "1000", // Grant
    6: "500",  // Bounty
    7: "1000"  // Payroll
};

async function main() {
    console.log("\n💰 Croquity Program Funding Script\n");

    if (!PRIVATE_KEY || !VAULT_ADDRESS || !USDC_ADDRESS) {
        console.error("❌ Missing environment variables. Check .env file.");
        process.exit(1);
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    console.log(`🔌 Connected to: ${RPC_URL}`);
    console.log(`👛 Wallet: ${wallet.address}`);
    console.log(`🏦 Vault: ${VAULT_ADDRESS}`);
    console.log(`💵 Token: ${USDC_ADDRESS}\n`);

    const usdc = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, wallet);
    const vault = new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, wallet);

    // 1. Check Wallet Balance
    const decimals = await usdc.decimals();
    const balance = await usdc.balanceOf(wallet.address);
    console.log(`💳 Wallet Balance: ${ethers.formatUnits(balance, decimals)} USDC.e`);

    // 2. Approve Vault to spend tokens
    console.log("\n🔐 Checking Allowance...");
    const allowance = await usdc.allowance(wallet.address, VAULT_ADDRESS);
    console.log(`   Current Allowance: ${ethers.formatUnits(allowance, decimals)} USDC.e`);

    // Calculate total needed
    let totalNeeded = BigInt(0);
    for (const amount of Object.values(FUNDING_AMOUNTS)) {
        totalNeeded += ethers.parseUnits(amount, decimals);
    }

    if (allowance < totalNeeded) {
        console.log(`   ⚠️  Allowance too low. Approving Vault...`);
        const tx = await usdc.approve(VAULT_ADDRESS, ethers.MaxUint256);
        console.log(`   ⏳ Transaction sent: ${tx.hash}`);
        await tx.wait();
        console.log(`   ✅ Approved Infinite Usage`);
    } else {
        console.log(`   ✅ Allowance Sufficient`);
    }

    // 3. Fund Programs
    console.log("\n🚀 Funding Programs...");

    for (const [programId, amountStr] of Object.entries(FUNDING_AMOUNTS)) {
        const amountWei = ethers.parseUnits(amountStr, decimals);

        try {
            console.log(`   👉 Funding Program ${programId} with ${amountStr} USDC.e...`);
            const tx = await vault.fundProgram(programId, amountWei);
            console.log(`      ⏳ Tx: ${tx.hash}`);
            await tx.wait();
            console.log(`      ✅ Funded!`);
        } catch (error: any) {
            console.error(`      ❌ Failed to fund Program ${programId}: ${error.message}`);
        }
    }

    console.log("\n🎉 Funding Complete!");
}

main().catch(console.error);
