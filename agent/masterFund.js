const { ethers } = require('ethers');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const RPC_URL = "https://evm-t3.cronos.org";
const USDC_ADDRESS = "0xa9bfff502e499b3c6188c5f88304880aba2fa486";
const VAULT_ADDRESS = "0x206fcAfc3dF7F15fcaB9a0031F643592E7ccC8B0";

async function main() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    console.log(`Master Funding from ${wallet.address}`);

    const usdc = new ethers.Contract(USDC_ADDRESS, [
        "function approve(address, uint256) public returns (bool)",
        "function decimals() view returns (uint8)",
        "function balanceOf(address) view returns (uint256)"
    ], wallet);

    const vault = new ethers.Contract(VAULT_ADDRESS, [
        "function fundProgram(uint256, uint256) external",
        "function getProgramBalance(uint256) view returns (uint256)"
    ], wallet);

    const decimals = await usdc.decimals();
    const balance = await usdc.balanceOf(wallet.address);
    console.log(`Wallet Balance: ${ethers.formatUnits(balance, decimals)} USDC.e`);

    const amountToFund = ethers.parseUnits("0.05", decimals);

    console.log("Approving...");
    const tx1 = await usdc.approve(VAULT_ADDRESS, amountToFund, { gasLimit: 100000 });
    console.log(`Approve TX: ${tx1.hash}`);
    await tx1.wait();
    console.log("Approved.");

    await new Promise(r => setTimeout(r, 5000));

    console.log("Funding...");
    const tx2 = await vault.fundProgram(0, amountToFund, { gasLimit: 200000 });
    console.log(`Fund TX: ${tx2.hash}`);
    await tx2.wait();
    console.log("Funded.");

    const finalBalance = await vault.getProgramBalance(0);
    console.log(`Final Program 0 Balance: ${ethers.formatUnits(finalBalance, decimals)}`);
}

main().catch(console.error);
