const { ethers } = require('ethers');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const RPC_URL = "https://evm-t3.cronos.org";
const USDC_ADDRESS = "0xa9bfff502e499b3c6188c5f88304880aba2fa486";

async function main() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const usdc = new ethers.Contract(USDC_ADDRESS, [
        "function mint(address, uint256) public",
        "function faucet() public",
        "function decimals() view returns (uint8)"
    ], wallet);

    console.log("Checking for faucet()...");
    try {
        const tx = await usdc.faucet();
        await tx.wait();
        console.log("Faucet successful!");
    } catch (e) {
        console.log("No faucet() or failed.");
    }

    console.log("Checking for mint()...");
    try {
        const decimals = await usdc.decimals();
        const tx = await usdc.mint(wallet.address, ethers.parseUnits("10000", decimals));
        await tx.wait();
        console.log("Mint successful!");
    } catch (e) {
        console.log("No mint() or failed.");
    }
}

main().catch(console.error);
