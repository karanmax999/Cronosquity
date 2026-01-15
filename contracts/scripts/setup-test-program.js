const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Setting up test program with account:", deployer.address);

    // Contract addresses (from deploy.js output)
    const REGISTRY_ADDRESS = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
    const VAULT_ADDRESS = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
    const USDC_ADDRESS = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";

    // Get contract instances using full ABIs from artifacts
    const ProgramVault = await hre.ethers.getContractFactory("contracts/core/ProgramVault.sol:ProgramVault");
    const ProgramRegistry = await hre.ethers.getContractFactory("contracts/core/ProgramRegistry.sol:ProgramRegistry");
    const MockUSDC = await hre.ethers.getContractFactory("contracts/mocks/MockUSDC.sol:MockUSDC");

    const registry = new hre.ethers.Contract(REGISTRY_ADDRESS, ProgramRegistry.interface, deployer);
    const vault = new hre.ethers.Contract(VAULT_ADDRESS, ProgramVault.interface, deployer);
    const usdc = new hre.ethers.Contract(USDC_ADDRESS, MockUSDC.interface, deployer);

    // Skip vault initialize - contracts are already initialized
    console.log("✅ Using already-initialized contracts");

    // 1. Create a test program (Bounty type = 1)
    console.log("\n📝 Creating test program...");
    const createTx = await registry.createProgram(
        1, // ProgramType.Bounty
        USDC_ADDRESS,
        "ipfs://QmTest1", // metadataURI
        JSON.stringify({
            maxTotalBudget: 1000,
            maxPerRecipient: 500,
            minRecipients: 1,
            maxRecipients: 3,
            requireUniqueWallets: true
        }),
        hre.ethers.parseUnits("1000", 18) // 1000 MockUSDC budget
    );
    
    await createTx.wait();
    console.log("✅ Program created!");

    // Get the created program ID
    const program = await registry.getProgram(0);
    console.log(`   Program ID: ${program.id}`);
    console.log(`   Type: Bounty`);
    console.log(`   Token: ${program.token}`);
    console.log(`   Budget: ${hre.ethers.formatUnits(program.budget, 18)} MockUSDC`);

    // 2. Approve vault to spend deployer's USDC
    console.log("\n💰 Approving vault to spend USDC...");
    const approveTx = await usdc.approve(VAULT_ADDRESS, hre.ethers.parseUnits("1000", 18));
    await approveTx.wait();
    console.log("✅ Approved!");

    // 3. Fund the program
    console.log("\n🏦 Funding program vault...");
    const fundTx = await vault.fundProgram(0, hre.ethers.parseUnits("1000", 18));
    await fundTx.wait();
    console.log("✅ Program funded!");

    // 4. Verify balance
    const balance = await vault.getProgramBalance(0);
    console.log(`   Vault balance for Program 0: ${hre.ethers.formatUnits(balance, 18)} MockUSDC`);

    console.log("\n✨ Test program setup complete!");
    console.log("\n📋 Next steps:");
    console.log("   1. Agent will check this program every 60 seconds");
    console.log("   2. When conditions are met, it will compute payouts");
    console.log("   3. Payouts > 100 USDC will trigger X402 bridge to Cronos Testnet");
    console.log("\n🚀 Agent should now see 1 active program in the next iteration");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
