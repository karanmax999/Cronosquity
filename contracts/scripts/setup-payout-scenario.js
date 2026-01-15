const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("🚀 Setting up 5-Program x402 Scenario...");
    console.log("   Deployer:", deployer.address);

    const addresses = JSON.parse(fs.readFileSync(path.join(__dirname, "../../addresses.json"), "utf8"));
    const usdcAddr = addresses.token;
    const vaultAddr = addresses.programVault;
    const registryAddr = addresses.programRegistry;

    const registry = await hre.ethers.getContractAt("ProgramRegistry", registryAddr);
    const vault = await hre.ethers.getContractAt("ProgramVault", vaultAddr);
    const usdc = await hre.ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", usdcAddr);

    // Scenario Data
    const scenarios = [
        {
            name: "Hackathon Q1",
            type: 0, // Hackathon
            budget: "900",
            policy: { maxTotalBudget: 900, maxPerRecipient: 300, maxRecipients: 3, requireUniqueWallets: false }
        },
        {
            name: "Dev Grant",
            type: 2, // Grant
            budget: "500",
            policy: { maxTotalBudget: 500, maxPerRecipient: 500, maxRecipients: 1, requireUniqueWallets: false }
        },
        {
            name: "Security Bounty",
            type: 1, // Bounty
            budget: "200",
            policy: { maxTotalBudget: 200, maxPerRecipient: 200, maxRecipients: 1, requireUniqueWallets: false }
        },
        {
            name: "Core Contributor",
            type: 3, // Payroll
            budget: "250",
            policy: { maxTotalBudget: 250, maxPerRecipient: 250, maxRecipients: 1, requireUniqueWallets: false }
        },
        {
            name: "RWA Settlement",
            type: 2, // Grant/Other
            budget: "750",
            policy: { maxTotalBudget: 750, maxPerRecipient: 750, maxRecipients: 1, requireUniqueWallets: false }
        }
    ];

    // Calculate Total Budget Needed
    const totalBudget = scenarios.reduce((acc, s) => acc + parseInt(s.budget), 0);
    console.log(`\n💰 Total Funding Needed: ${totalBudget} USDC`);

    // Approve Vault once
    const approveAmount = hre.ethers.parseUnits(totalBudget.toString(), 18);
    console.log("   Approving Vault...");
    const txApprove = await usdc.approve(vaultAddr, approveAmount);
    await txApprove.wait();
    console.log("   ✅ Approved");

    // Loop to create and fund
    for (const [index, s] of scenarios.entries()) {
        console.log(`\n-------------------------------------------`);
        console.log(`Creating Program ${index + 1}/5: ${s.name}`);

        const budgetWei = hre.ethers.parseUnits(s.budget, 18);

        // Create
        const txCreate = await registry.createProgram(
            s.type,
            usdcAddr,
            `ipfs://${s.name.replace(/\s/g, '')}`,
            JSON.stringify(s.policy),
            budgetWei
        );
        const receipt = await txCreate.wait();

        // Find ID from events (assuming standard format or just taking nextId logic if sequential)
        // For simplicity in this script, we can query nextProgramId or assume sequential
        // But better to just assume it was created successfully.

        // We need the ID to fund it. 
        // Let's get the ID from the event if possible, or just query nextProgramId before/after.
        // Easiest hack: We know the IDs increment.
        const nextId = await registry.nextProgramId();
        const programId = Number(nextId) - 1;

        console.log(`   ✅ Created (ID: ${programId})`);

        // Fund
        console.log(`   Funding with ${s.budget} USDC...`);
        const txFund = await vault.fundProgram(programId, budgetWei);
        await txFund.wait();
        console.log(`   ✅ Funded`);
    }

    console.log("\n✅ SCENARIO SETUP COMPLETE!");
    console.log("   Restart the Agent to pick up the new programs.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
