import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

const RPC_URL = "https://evm-t3.cronos.org";
const USDC_ADDRESS = "0xa9bfff502e499b3c6188c5f88304880aba2fa486";
const VAULT_ADDRESS = "0x206fcafc3df7f15fcab9a0031f643592e7ccc8b0";

async function main() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

    console.log(`Agent Wallet: ${wallet.address}`);

    const balance = await provider.getBalance(wallet.address);
    console.log(`TCRO Balance: ${ethers.formatEther(balance)}`);

    const usdc = new ethers.Contract(USDC_ADDRESS, ["function balanceOf(address) view returns (uint256)", "function allowance(address, address) view returns (uint256)"], provider);
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
