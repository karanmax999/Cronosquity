import * as dotenv from "dotenv";
dotenv.config();
import * as http from "http";

import { CronosAgent } from "./core/agent";
import { runAgentOnce } from "./core/agent";

/**
 * Print startup configuration and safety checks
 */
function printStartupConfig() {
    console.log("\n╔═══════════════════════════════════════════════════════════╗");
    console.log("║        CROQUITY AGENT - STARTUP CONFIGURATION             ║");
    console.log("╚═══════════════════════════════════════════════════════════╝");

    console.log("\n📡 Network Configuration:");
    console.log(`   Local RPC: ${process.env.RPC_URL || "http://127.0.0.1:8545"}`);
    console.log(`   Registry: ${process.env.PROGRAM_REGISTRY_ADDRESS || "NOT SET"}`);
    console.log(`   Vault: ${process.env.PROGRAM_VAULT_ADDRESS || "NOT SET"}`);

    console.log("\n🌉 X402 Facilitator (Cronos Bridge):");
    console.log(`   Network: ${process.env.FACILITATOR_NETWORK || "testnet"}`);
    console.log(`   Cronos RPC: ${process.env.CRONOS_RPC_URL || "https://evm-t3.cronos.org"}`);
    console.log(`   Payout Key Set: ${process.env.PAYOUT_PRIVATE_KEY ? "✅ YES" : "❌ NO"}`);

    const useMock = process.env.X402_USE_MOCK === "true";
    console.log(`   Use Mock Mode: ${useMock ? "✅ YES (no real Cronos calls)" : "❌ NO (real calls)"}`);

    console.log("\n⚙️  Agent Configuration:");
    console.log(`   Loop Interval: ${process.env.AGENT_INTERVAL_MS || 60000}ms`);
    console.log(`   Auto Execute: ${process.env.AUTO_EXECUTE === "true" ? "✅ YES" : "❌ NO (dry-run)"}`);
    console.log(`   Bridge Threshold: 100 USDC.e (payouts > this trigger Cronos bridge)`);

    console.log("\n🔐 Security Checks:");
    if (!process.env.PROGRAM_REGISTRY_ADDRESS || !process.env.PROGRAM_VAULT_ADDRESS) {
        console.log("   ⚠️  WARNING: Contract addresses not set");
    } else {
        console.log("   ✅ Contract addresses configured");
    }

    if (!process.env.PAYOUT_PRIVATE_KEY) {
        console.log("   ⚠️  WARNING: PAYOUT_PRIVATE_KEY not set (X402 bridge will fail)");
    } else {
        console.log("   ✅ Payout key set (X402 bridge ready)");
    }

    console.log("\n📖 Reference: See config/programs.json for bridge mapping");
    console.log("   Docs: agent/X402_INTEGRATION_GUIDE.md\n");
}

async function main() {
    // Print startup config and checks
    printStartupConfig();

    console.log("Starting Croquity Program OS Agent...");

    // Start a simple health-check server to keep Render happy
    const port = process.env.PORT || 3000;
    http.createServer((req, res) => {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Croquity AI Agent is alive\n");
    }).listen(port, () => {
        console.log(`✅ Health-check server listening on port ${port}`);
    });

    // Initialize the agent with blockchain integration
    const agent = new CronosAgent();

    // Define the agent loop
    const runLoop = async () => {
        try {
            await (agent as any).run();
        } catch (error) {
            console.error("\x1b[31m[FATAL] Agent loop failed:\x1b[0m", error);
        }
    };

    // Run immediately, then at intervals
    await runLoop();
    const interval = Number(process.env.AGENT_INTERVAL_MS) || 60000;
    console.log(`\n\x1b[35m⏱️  Agent will run every ${interval}ms\x1b[0m`);
    setInterval(runLoop, interval);
}

main().catch(console.error);
