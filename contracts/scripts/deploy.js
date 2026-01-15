const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying Program OS contracts with account:", deployer.address);

    // 1. Deploy MockUSDC
    let usdcAddress = process.env.USDC_ADDRESS;
    if (!usdcAddress || usdcAddress.startsWith("0x5FbDB")) {
        console.log("Deploying MockUSDC...");
        const MockUSDC = await hre.ethers.getContractFactory("contracts/mocks/MockUSDC.sol:MockUSDC");
        const usdc = await MockUSDC.deploy();
        await usdc.waitForDeployment();
        usdcAddress = await usdc.getAddress();
        console.log("MockUSDC deployed to:", usdcAddress);
    } else {
        console.log("Using existing token at:", usdcAddress);
    }

    // 2. Deploy ProgramRegistry
    console.log("Deploying ProgramRegistry...");
    const ProgramRegistry = await hre.ethers.getContractFactory("contracts/core/ProgramRegistry.sol:ProgramRegistry");
    const registry = await ProgramRegistry.deploy();
    await registry.waitForDeployment();
    const registryAddress = await registry.getAddress();
    console.log("ProgramRegistry deployed to:", registryAddress);

    // 3. Deploy ProgramVault
    console.log("Deploying ProgramVault...");
    const ProgramVault = await hre.ethers.getContractFactory("contracts/core/ProgramVault.sol:ProgramVault");
    const vault = await ProgramVault.deploy();
    await vault.waitForDeployment();
    const vaultAddress = await vault.getAddress();
    console.log("ProgramVault deployed to:", vaultAddress);

    // 4. Initialize contracts
    console.log("Initializing ProgramRegistry...");
    await registry.initialize(vaultAddress);

    console.log("Initializing ProgramVault...");
    await vault.initialize(registryAddress);

    // 5. Set deployer as global agent for testing
    console.log("Setting deployer as global agent...");
    await vault.setGlobalAgent(deployer.address, true);

    // 6. Save addresses to config file
    const configDir = path.join(__dirname, "../../");
    const addresses = {
        token: usdcAddress,
        programRegistry: registryAddress,
        programVault: vaultAddress,
        network: hre.network.name
    };

    fs.writeFileSync(
        path.join(configDir, "addresses.json"),
        JSON.stringify(addresses, null, 2)
    );
    console.log("Addresses saved to addresses.json at root");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
