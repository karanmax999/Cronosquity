const { ethers } = require('ethers');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const RPC_URL = "https://evm-t3.cronos.org";
const USDC_ADDRESS = "0xa9BFFF502E499b3c6188c5f88304880AbA2FA486";
const VAULT_ADDRESS = process.env.PROGRAM_VAULT_ADDRESS || "0xaF1626A9117387399879A22FA48600d829B90554";

async function main() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    if (!process.env.PRIVATE_KEY) {
        console.error("PRIVATE_KEY not found in .env");
        return;
    }
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    console.log(`Agent Wallet: ${wallet.address}`);

    const balance = await provider.getBalance(wallet.address);
    console.log(`TCRO Balance: ${ethers.formatEther(balance)}`);

    const usdc = new ethers.Contract(USDC_ADDRESS, ["function balanceOf(address) view returns (uint256)"], provider);
    const usdcBalance = await usdc.balanceOf(wallet.address);
    console.log(`USDC.e Balance: ${ethers.formatUnits(usdcBalance, 6)}`);

    const vault = new ethers.Contract(VAULT_ADDRESS, ["function getProgramBalance(uint256) view returns (uint256)"], provider);
    try {
        const p0Balance = await vault.getProgramBalance(0);
        console.log(`Program 0 Balance: ${ethers.formatUnits(p0Balance, 18)}`);
    } catch (e) {
        console.log("Could not fetch Program 0 balance");
    }
}

main().catch(console.error);
