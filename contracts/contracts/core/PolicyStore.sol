// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";


contract PolicyStore is Ownable {
    struct PolicyMetadata {
        string policyURI;
        bytes32 policyHash; // For integrity verification by the agent
    }

    mapping(uint256 => PolicyMetadata) public programPolicies;
    
    event PolicyUpdated(uint256 indexed programId, string policyURI, bytes32 policyHash);

    constructor() Ownable(msg.sender) {}

    function setPolicy(uint256 _programId, string calldata _policyURI, bytes32 _policyHash) external {
        // In production, this would verify program ownership via registry.ownerOf(_programId)
        programPolicies[_programId] = PolicyMetadata({
            policyURI: _policyURI,
            policyHash: _policyHash
        });
        
        emit PolicyUpdated(_programId, _policyURI, _policyHash);
    }

    function getPolicy(uint256 _programId) external view returns (string memory uri, bytes32 hash) {
        PolicyMetadata memory metadata = programPolicies[_programId];
        return (metadata.policyURI, metadata.policyHash);
    }
}
