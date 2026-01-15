// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ProgramRegistry.sol";

contract ProgramVault is Ownable {
    ProgramRegistry public registry;

    mapping(uint256 => uint256) public programBalances;
    mapping(address => bool) public globalAgents;

    event ProgramFunded(uint256 indexed programId, uint256 amount);
    event PayoutExecuted(uint256 indexed programId, address indexed recipient, uint256 amount, string reason);

    constructor() Ownable(msg.sender) {}

    function initialize(address _registry) external onlyOwner {
        registry = ProgramRegistry(_registry);
    }

    function setGlobalAgent(address _agent, bool _status) external onlyOwner {
        globalAgents[_agent] = _status;
    }

    function fundProgram(uint256 _programId, uint256 _amount) external {
        ProgramRegistry.Program memory p = registry.getProgram(_programId);
        require(p.owner != address(0), "Program does not exist");
        
        IERC20 token = IERC20(p.token);
        require(token.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        
        programBalances[_programId] += _amount;
        emit ProgramFunded(_programId, _amount);
    }

    function executePayout(
        uint256 _programId,
        address _recipient,
        uint256 _amount,
        string calldata _reason
    ) public {
        ProgramRegistry.Program memory p = registry.getProgram(_programId);
        require(p.owner != address(0), "Program does not exist");
        require(msg.sender == p.owner || globalAgents[msg.sender], "Not authorized");
        require(programBalances[_programId] >= _amount, "Insufficient program balance");

        programBalances[_programId] -= _amount;
        
        IERC20 token = IERC20(p.token);
        require(token.transfer(_recipient, _amount), "Transfer failed");

        emit PayoutExecuted(_programId, _recipient, _amount, _reason);
    }

    /**
     * @dev Executes multiple payouts in a single transaction for gas efficiency.
     */
    function executeBatchPayout(
        uint256 _programId,
        address[] calldata _recipients,
        uint256[] calldata _amounts,
        string[] calldata _reasons
    ) external {
        require(
            _recipients.length == _amounts.length && _amounts.length == _reasons.length,
            "Array lengths mismatch"
        );

        ProgramRegistry.Program memory p = registry.getProgram(_programId);
        require(p.owner != address(0), "Program does not exist");
        require(msg.sender == p.owner || globalAgents[msg.sender], "Not authorized");

        IERC20 token = IERC20(p.token);

        for (uint256 i = 0; i < _recipients.length; i++) {
            uint256 amount = _amounts[i];
            require(programBalances[_programId] >= amount, "Insufficient program balance at index");

            programBalances[_programId] -= amount;
            require(token.transfer(_recipients[i], amount), "Transfer failed");

            emit PayoutExecuted(_programId, _recipients[i], amount, _reasons[i]);
        }
    }

    function getProgramBalance(uint256 _programId) external view returns (uint256) {
        return programBalances[_programId];
    }
}
