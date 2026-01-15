import fs from "fs";
import path from "path";
import { ScoreEntry } from "../types";

export class ScoringService {
    async getScoresForProgram(programId: bigint): Promise<ScoreEntry[]> {
        console.log(`ScoringService: Loading scores for program ${programId}...`);

        // Try to load program-specific scores first
        const programScoresPath = path.join(process.cwd(), "mock", `scores.program-${programId}.json`);
        if (fs.existsSync(programScoresPath)) {
            const data = fs.readFileSync(programScoresPath, "utf-8");
            return JSON.parse(data);
        }

        // Fallback to general scores
        const globalScoresPath = path.join(process.cwd(), "mock", "scores.json");
        if (fs.existsSync(globalScoresPath)) {
            const data = fs.readFileSync(globalScoresPath, "utf-8");
            return JSON.parse(data);
        }

        // Default mock data if no files exist
        return [
            { address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", score: 95 },
            { address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", score: 82 },
            { address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", score: 75 }
        ];
    }
}
