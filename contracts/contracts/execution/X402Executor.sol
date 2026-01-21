// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract X402Executor is Ownable {
    event CrossChainPayoutRequested(uint256 indexed programId, address recipient, uint256 amount, uint256 destinationChainId);

    constructor() Ownable(msg.sender) {}

    function requestPayout(uint256 _programId, address _recipient, uint256 _amount, uint256 _destChainId) external {
        emit CrossChainPayoutRequested(_programId, _recipient, _amount, _destChainId);
    }
}
