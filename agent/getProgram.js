const { ethers } = require('ethers');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const RPC_URL = "https://evm-t3.cronos.org";
const REGISTRY_ADDRESS = "0xbf41acf1722cc071667a5bb9b0a30da57fb0728c"; // From agent.ts

async function main() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const registry = new ethers.Contract(REGISTRY_ADDRESS, [
        "function getProgram(uint256) view returns (tuple(uint256 id, address owner, string name, uint256 budget, address token, string policyURI, uint8 programType, uint8 status))"
    ], provider);

    console.log("Fetching Program 0...");
    const p = await registry.getProgram(0);
    console.log(`Program 0: ${p.name}`);
    console.log(`Budget: ${ethers.formatUnits(p.budget, 18)}`);
    console.log(`Token: ${p.token}`);
}

main().catch(console.error);
