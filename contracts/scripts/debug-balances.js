const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    const addresses = JSON.parse(fs.readFileSync(path.join(__dirname, "../../addresses.json"), "utf8"));
    const vaultAddr = addresses.programVault;

    console.log("🔍 Checking Program Balances on", addresses.network, "...");
    console.log("   Vault:", vaultAddr);

    const vault = await hre.ethers.getContractAt("ProgramVault", vaultAddr);

    // Check programs 4, 5, 6, 7
    const programIds = [4, 5, 6, 7];

    for (const id of programIds) {
        try {
            const balance = await vault.getProgramBalance(id);
            console.log(`   Program ${id}: ${hre.ethers.formatUnits(balance, 18)} USDC`);
        } catch (e) {
            console.log(`   Program ${id}: Error reading balance (${e.message})`);
        }
    }
}

main().catch(console.error);
