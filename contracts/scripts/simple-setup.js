const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Account:", deployer.address);

    // These are the deployed addresses
    const fs = require("fs");
    const path = require("path");
    const addresses = JSON.parse(fs.readFileSync(path.join(__dirname, "../../addresses.json"), "utf8"));

    const registryAddr = addresses.programRegistry;
    const vaultAddr = addresses.programVault;
    const usdcAddr = addresses.token;

    // Minimal ABI
    const registryABI = [
        "function createProgram(uint8 _pType, address _token, string memory _metadataURI, string memory _policyURI, uint256 _budget) external returns (uint256)",
        "function getProgram(uint256 _id) external view returns (tuple(uint256 id, address owner, uint8 programType, address token, string metadataURI, string policyURI, uint256 budget, uint8 status))"
    ];
    const vaultABI = [
        "function fundProgram(uint256 _programId, uint256 _amount) external",
        "function getProgramBalance(uint256 _programId) external view returns (uint256)"
    ];
    const erc20ABI = [
        "function approve(address spender, uint256 amount) external returns (bool)",
        "function transfer(address to, uint256 amount) external returns (bool)"
    ];

    const registry = new hre.ethers.Contract(registryAddr, registryABI, deployer);
    const vault = new hre.ethers.Contract(vaultAddr, vaultABI, deployer);
    const usdc = new hre.ethers.Contract(usdcAddr, erc20ABI, deployer);

    // 1. Create program
    console.log("\n1️⃣  Creating test program...");
    const tx1 = await registry.createProgram(
        1, // type
        usdcAddr,
        "ipfs://test",
        JSON.stringify({ maxTotalBudget: 1000, maxPerRecipient: 500, maxRecipients: 3 }),
        hre.ethers.parseUnits("1000", 18)
    );
    await tx1.wait();
    console.log("✅ Program 0 created");

    // 2. Approve
    console.log("\n2️⃣  Approving vault...");
    const tx2 = await usdc.approve(vaultAddr, hre.ethers.parseUnits("10000", 18));
    await tx2.wait();
    console.log("✅ Approved");

    // 3. Fund
    console.log("\n3️⃣  Funding program...");
    const tx3 = await vault.fundProgram(0, hre.ethers.parseUnits("1000", 18));
    await tx3.wait();
    console.log("✅ Program funded with 1000 USDC");

    // Check balance
    const balance = await vault.getProgramBalance(0);
    console.log(`\n📊 Program 0 balance: ${hre.ethers.formatUnits(balance, 18)} USDC`);
}

main().catch(console.error);
