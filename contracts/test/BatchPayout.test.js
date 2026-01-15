const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProgramVault Batch Payouts", function () {
    let registry;
    let vault;
    let usdc;
    let owner;
    let agent;
    let user1;
    let user2;

    beforeEach(async function () {
        [owner, agent, user1, user2] = await ethers.getSigners();

        const MockUSDC = await ethers.getContractFactory("MockUSDC");
        usdc = await MockUSDC.deploy();

        const ProgramRegistry = await ethers.getContractFactory("ProgramRegistry");
        registry = await ProgramRegistry.deploy();

        const ProgramVault = await ethers.getContractFactory("ProgramVault");
        vault = await ProgramVault.deploy();

        await registry.initialize(await vault.getAddress());
        await vault.initialize(await registry.getAddress());
    });

    it("Should execute batch payouts correctly", async function () {
        const budget = ethers.parseUnits("1000", 18);
        // ProgramType.Hackathon is 0
        await registry.createProgram(0, await usdc.getAddress(), "ipfs://metadata", "ipfs://policy", budget);

        await usdc.approve(await vault.getAddress(), budget);
        await vault.fundProgram(0, budget);

        await vault.setGlobalAgent(agent.address, true);

        const amount1 = ethers.parseUnits("100", 18);
        const amount2 = ethers.parseUnits("200", 18);

        const recipients = [user1.address, user2.address];
        const amounts = [amount1, amount2];
        const reasons = ["Winner 1", "Winner 2"];

        await expect(vault.connect(agent).executeBatchPayout(0, recipients, amounts, reasons))
            .to.emit(vault, "PayoutExecuted")
            .withArgs(0, user1.address, amount1, "Winner 1")
            .to.emit(vault, "PayoutExecuted")
            .withArgs(0, user2.address, amount2, "Winner 2");

        expect(await usdc.balanceOf(user1.address)).to.equal(amount1);
        expect(await usdc.balanceOf(user2.address)).to.equal(amount2);
        expect(await vault.getProgramBalance(0)).to.equal(budget - amount1 - amount2);
    });

    it("Should fail if array lengths mismatch", async function () {
        const budget = ethers.parseUnits("1000", 18);
        await registry.createProgram(0, await usdc.getAddress(), "ipfs://metadata", "ipfs://policy", budget);
        await usdc.approve(await vault.getAddress(), budget);
        await vault.fundProgram(0, budget);

        const recipients = [user1.address, user2.address];
        const amounts = [ethers.parseUnits("100", 18)]; // Mismatch
        const reasons = ["Reason 1", "Reason 2"];

        await expect(vault.executeBatchPayout(0, recipients, amounts, reasons))
            .to.be.revertedWith("Array lengths mismatch");
    });

    it("Should fail if unauthorized", async function () {
        const budget = ethers.parseUnits("1000", 18);
        await registry.createProgram(0, await usdc.getAddress(), "ipfs://metadata", "ipfs://policy", budget);

        const recipients = [user1.address];
        const amounts = [ethers.parseUnits("100", 18)];
        const reasons = ["Reason 1"];

        await expect(vault.connect(user1).executeBatchPayout(0, recipients, amounts, reasons))
            .to.be.revertedWith("Not authorized");
    });

    it("Should fail if insufficient balance mid-batch", async function () {
        const budget = ethers.parseUnits("150", 18); // Only enough for one payout
        await registry.createProgram(0, await usdc.getAddress(), "ipfs://metadata", "ipfs://policy", budget);
        await usdc.approve(await vault.getAddress(), budget);
        await vault.fundProgram(0, budget);

        const recipients = [user1.address, user2.address];
        const amounts = [ethers.parseUnits("100", 18), ethers.parseUnits("100", 18)];
        const reasons = ["Reason 1", "Reason 2"];

        await expect(vault.executeBatchPayout(0, recipients, amounts, reasons))
            .to.be.revertedWith("Insufficient program balance at index");
    });
});
