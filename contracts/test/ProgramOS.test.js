const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Program OS Architecture", function () {
    let registry;
    let vault;
    let usdc;
    let owner;
    let agent;
    let user;

    beforeEach(async function () {
        [owner, agent, user] = await ethers.getSigners();

        const MockUSDC = await ethers.getContractFactory("MockUSDC");
        usdc = await MockUSDC.deploy();

        const ProgramRegistry = await ethers.getContractFactory("ProgramRegistry");
        registry = await ProgramRegistry.deploy();

        const ProgramVault = await ethers.getContractFactory("ProgramVault");
        vault = await ProgramVault.deploy();

        await registry.initialize(await vault.getAddress(), await usdc.getAddress());
        await vault.initialize(await registry.getAddress(), await usdc.getAddress());
    });

    it("Should create a program and fund it", async function () {
        const budget = ethers.parseUnits("1000", 18);
        await registry.createProgram(0, "ipfs://metadata", "ipfs://policy", budget);

        const program = await registry.getProgram(0);
        expect(program.owner).to.equal(owner.address);
        expect(program.budget).to.equal(budget);

        await usdc.approve(await vault.getAddress(), budget);
        await vault.fundProgram(0, budget);

        expect(await vault.getProgramBalance(0)).to.equal(budget);
    });

    it("Should allow global agent to execute payout", async function () {
        const budget = ethers.parseUnits("1000", 18);
        await registry.createProgram(0, "ipfs://metadata", "ipfs://policy", budget);
        await usdc.approve(await vault.getAddress(), budget);
        await vault.fundProgram(0, budget);

        await vault.setGlobalAgent(agent.address, true);

        const payout = ethers.parseUnits("100", 18);
        await vault.connect(agent).executePayout(0, user.address, payout, "Winner rank 1");

        expect(await usdc.balanceOf(user.address)).to.equal(payout);
        expect(await vault.getProgramBalance(0)).to.equal(budget - payout);
    });
});
