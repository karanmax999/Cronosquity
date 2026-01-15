// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ProgramRegistry is Ownable {
    enum ProgramType { Hackathon, Bounty, Grant, Payroll }
    enum ProgramStatus { Active, Closed }

    struct Program {
        uint256 id;
        address owner;
        ProgramType programType;
        address token; // First-class entity: Every program defines its token
        string metadataURI;
        string policyURI;
        uint256 budget;
        ProgramStatus status;
    }

    mapping(uint256 => Program) public programs;
    uint256 public nextProgramId;
    address public vault;

    event ProgramCreated(uint256 indexed id, address indexed owner, ProgramType pType, address token);
    event ProgramStatusUpdated(uint256 indexed id, ProgramStatus status);

    constructor() Ownable(msg.sender) {}

    function initialize(address _vault) external onlyOwner {
        vault = _vault;
    }

    function createProgram(
        ProgramType _pType,
        address _token,
        string calldata _metadataURI,
        string calldata _policyURI,
        uint256 _budget
    ) external returns (uint256) {
        uint256 id = nextProgramId++;
        programs[id] = Program({
            id: id,
            owner: msg.sender,
            programType: _pType,
            token: _token,
            metadataURI: _metadataURI,
            policyURI: _policyURI,
            budget: _budget,
            status: ProgramStatus.Active
        });

        emit ProgramCreated(id, msg.sender, _pType, _token);
        return id;
    }

    function updateStatus(uint256 _id, ProgramStatus _status) external {
        require(programs[_id].owner == msg.sender, "Not owner");
        programs[_id].status = _status;
        emit ProgramStatusUpdated(_id, _status);
    }

    function getProgram(uint256 _id) external view returns (Program memory) {
        return programs[_id];
    }
}
