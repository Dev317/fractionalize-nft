// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import "./PropertyFractionToken.sol";


contract BuyBack {
    address public propertyContractNFTAddress;
    address public propertyFractionTokenAddress;

    enum BuyBackState { initiated, waitingAcceptance, requestAccepted }

    struct BuyBackAmount {
        uint256 tokenBuyBack;
        uint256 weiValuePerToken;
    }

    mapping(address=>BuyBackAmount) public requestAmountMap;
    mapping(address=>mapping(address=>bool)) public requestAcceptStatusMap;

    BuyBackState public state;

    constructor(address _propertyContractNFTAddress, address _propertyFractionTokenAddress) {
        propertyContractNFTAddress = _propertyContractNFTAddress;
        state = BuyBackState.initiated;
        propertyFractionTokenAddress = _propertyFractionTokenAddress;
    }

    function submitRequest(address _fractionalOwner, uint256 _tokenBuyBack, uint256 _weiValuePerToken) public {
        PropertyFractionToken token = PropertyFractionToken(propertyFractionTokenAddress);
        require(token.balanceOf(_fractionalOwner) >= _tokenBuyBack, "Fractional owner does not have such amount!");

        BuyBackAmount memory buyback = BuyBackAmount(_tokenBuyBack, _weiValuePerToken);
        requestAmountMap[msg.sender] = buyback;

        requestAcceptStatusMap[msg.sender][_fractionalOwner] = false;
        state = BuyBackState.waitingAcceptance;
    }

    function acceptRequest(address _buyer) public {
        require(requestAcceptStatusMap[_buyer][msg.sender] == false, "Request completed!");
        requestAcceptStatusMap[_buyer][msg.sender] = true;
        state = BuyBackState.requestAccepted;
    }

    function buyBackPurchase(address _fractionalOwner) public payable {
        require(msg.value >= requestAmountMap[msg.sender].tokenBuyBack * requestAmountMap[msg.sender].weiValuePerToken, "Insufficient money sent!");
        bool sent = payable(_fractionalOwner).send(msg.value);
        require(sent, "Failed to send money!");
        PropertyFractionToken(propertyFractionTokenAddress).trackTransfer(_fractionalOwner, msg.sender, requestAmountMap[msg.sender].tokenBuyBack);
    }

}