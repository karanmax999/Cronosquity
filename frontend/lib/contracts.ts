export const PROGRAM_REGISTRY_ADDRESS = "0x55c5FAAf35C7EBFC7a7518637a7A084f8858969f" as const;
export const PROGRAM_VAULT_ADDRESS = "0x206fcAfc3dF7F15fcaB9a0031F643592E7ccC8B0" as const;
export const USDC_ADDRESS = "0xa9BFFF502E499b3c6188c5f88304880AbA2FA486" as const;

export const PROGRAM_REGISTRY_ABI = [
    {
        "inputs": [
            { "internalType": "uint8", "name": "_pType", "type": "uint8" },
            { "internalType": "address", "name": "_token", "type": "address" },
            { "internalType": "string", "name": "_metadataURI", "type": "string" },
            { "internalType": "string", "name": "_policyURI", "type": "string" },
            { "internalType": "uint256", "name": "_budget", "type": "uint256" }
        ],
        "name": "createProgram",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "nonpayable",
        "type": "function"
    }
] as const;

export const PROGRAM_VAULT_ABI = [
    {
        "inputs": [
            { "internalType": "uint256", "name": "_programId", "type": "uint256" },
            { "internalType": "uint256", "name": "_amount", "type": "uint256" }
        ],
        "name": "fundProgram",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
] as const;
