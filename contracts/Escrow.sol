// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.15;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./PropertyContractNFT.sol";

contract Escrow is IERC721Receiver {

    address public nftAddress;
    address payable public sellerAddress;
    address payable public buyerAddress;

    uint256 public tokenId;

    enum EscrowState { newEscrow, nftDeposited, cancelledNFT, cancelledPayment, ethDeposited, delivered }
    EscrowState public state; 

    constructor() {
        sellerAddress = payable(msg.sender);
        state = EscrowState.newEscrow;
    }

    function onERC721Received( address operator, address from, uint256 tokenId, bytes calldata data ) public pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function depositNFT(address _NFTAddress, uint256 _TokenID) public {
        nftAddress = _NFTAddress;
        tokenId = _TokenID;
        PropertyContractNFT(nftAddress).approve(address(this), tokenId);
        PropertyContractNFT(nftAddress).transferFrom(msg.sender, address(this), tokenId);
        state = EscrowState.nftDeposited;
    }

    function cancelNFT() public {
        require(msg.sender == sellerAddress, "Only seller can cancel NFT!");
        PropertyContractNFT(nftAddress).approve(sellerAddress, tokenId);
        PropertyContractNFT(nftAddress).transferFrom(address(this), sellerAddress, tokenId);
        state = EscrowState.cancelledNFT;
    }

    function depositETH() public payable {
        buyerAddress = payable(msg.sender);
        state = EscrowState.ethDeposited;
    }

    function withdrawPayment() public {
        bool sent = payable(buyerAddress).send(address(this).balance);
        require(sent, "Failed to refund money!");
        state = EscrowState.cancelledPayment;
    }

    function confirmDelivery() public payable {
        PropertyContractNFT(nftAddress).safeTransferFrom(address(this), buyerAddress, tokenId);
        bool sent = payable(sellerAddress).send(address(this).balance);
        require(sent, "Failed to send money!");
        state = EscrowState.delivered;
    }
}