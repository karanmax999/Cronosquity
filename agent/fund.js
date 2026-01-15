const { ethers } = require('ethers');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const RPC_URL = "https://evm-t3.cronos.org";
const USDC_ADDRESS = "0xa9bfff502e499b3c6188c5f88304880aba2fa486";
const VAULT_ADDRESS = "0xaf1626a9117387399879a22fa48600d829b90554";

async function main() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    console.log(`Funding Program 0 from ${wallet.address}`);

    const usdc = new ethers.Contract(USDC_ADDRESS, [
        "function approve(address, uint256) public returns (bool)",
        "function decimals() view returns (uint8)"
    ], wallet);

    const vault = new ethers.Contract(VAULT_ADDRESS, [
        "function fundProgram(uint256, uint256) external"
    ], wallet);

    const decimals = await usdc.decimals();
    console.log(`USDC Decimals: ${decimals}`);

    const amountToFund = ethers.parseUnits("0.001", decimals);

    console.log("Approving Vault...");
    const tx1 = await usdc.approve(VAULT_ADDRESS, amountToFund);
    await tx1.wait();
    console.log("Approval confirmed.");

    console.log("Funding Program 0...");
    const tx2 = await vault.fundProgram(0, amountToFund);
    const receipt = await tx2.wait();
    console.log(`Funding confirmed: ${receipt.hash}`);
}

main().catch(console.error);
