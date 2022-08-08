// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.15;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract PropertyFractionToken is ERC20 {
    mapping(address=>uint256) public holderBalances;
    address[] public holderAddresses;

    constructor(uint256 _totalPropertyFractionTokens, address _minter) ERC20("PropertyFractionToken", "PFT") {
        _mint(_minter, _totalPropertyFractionTokens * 10**uint(decimals()));
        holderBalances[_minter] = _totalPropertyFractionTokens;
        holderAddresses.push(_minter);
    }

    function trackTransfer(address _from, address _to, uint256 _amount) public {
        require(balanceOf(_from) != 0, "Insufficient balance!");

        if (holderBalances[_to] == 0) {
            holderAddresses.push(_to);
        }

        _transfer(_from, _to, _amount * 10**uint(decimals()));
        holderBalances[_from] -= _amount;
        holderBalances[_to] += _amount;
    }

    function getNumHolders() public view returns(uint256) {
        return holderAddresses.length;
    }

    function getHolderAddresses() public view returns(address[] memory) {
        return holderAddresses;
    }
}