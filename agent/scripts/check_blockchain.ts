import { ethers } from "ethers";

const RPC_URL = "https://evm-t3.cronos.org";
const REGISTRY_ADDR = "0x55c5FAAf35C7EBFC7a7518637a7A084f8858969f";
const VAULT_ADDR = "0x206fcAfc3dF7F15fcaB9a0031F643592E7ccC8B0";

const REGISTRY_ABI = [
    "function nextProgramId() view returns (uint256)",
    "function getProgram(uint256) view returns (tuple(uint256 id, address owner, uint8 programType, address token, string metadataURI, string policyURI, uint256 budget, uint8 status))"
];

const VAULT_ABI = [
    "event PayoutExecuted(uint256 indexed programId, address indexed recipient, uint256 amount, string reason)"
];

async function main() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const registry = new ethers.Contract(REGISTRY_ADDR, REGISTRY_ABI, provider);
    const vault = new ethers.Contract(VAULT_ADDR, VAULT_ABI, provider);

    const count = await registry.nextProgramId();
    console.log(`Next Program ID: ${count}`);

    for (let i = 0; i < Number(count); i++) {
        const p = await registry.getProgram(i);
        console.log(`Program ${i}: owner=${p.owner}, status=${p.status}`);
    }

    const filter = vault.filters.PayoutExecuted();
    // Querying last 100,000 blocks to avoid timeout
    const currentBlock = await provider.getBlockNumber();
    console.log(`Current Block: ${currentBlock}`);
    const logs = await vault.queryFilter(filter, currentBlock - 100000);
    console.log(`PayoutExecuted Events (last 100k blocks): ${logs.length}`);
}

main().catch(console.error);
