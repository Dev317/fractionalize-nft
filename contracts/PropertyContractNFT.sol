// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "./PropertyFractionToken.sol";


contract PropertyContractNFT is ERC721, ERC721URIStorage, Pausable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenCounter;

    constructor() ERC721("PropertyContractNFT", "PCNFT") {}

    struct PFT {
        uint256 tokenId;
        address pftAddress;
    }

    mapping(uint256=>PFT) public PFTMap;


    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        whenNotPaused
    {
        super._beforeTokenTransfer(from, to, tokenId, 4);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
      override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function mint(address _to, string memory _tokenURI, uint256 _totalPropertyFractionTokens) external onlyOwner {
        // Mint NFT contract and set URI for title deeds
        _safeMint(_to, _tokenCounter.current());
        _setTokenURI(_tokenCounter.current(), _tokenURI);

        // Create ERC20 contract and mint stated number of ERC20 Tokens
        PropertyFractionToken PFTContract = new PropertyFractionToken(_totalPropertyFractionTokens, msg.sender);

        PFT memory pft = PFT(_tokenCounter.current(), address(PFTContract));
        PFTMap[_tokenCounter.current()] = pft;

        _tokenCounter.increment();
    }

    function transferERC20(address _to, uint256 _tokenId, uint256 _amount) public {
        address tokenAddress = PFTMap[_tokenId].pftAddress;
        PropertyFractionToken token = PropertyFractionToken(tokenAddress);
        token.trackTransfer(msg.sender, _to, _amount);
    }

    function getNumberOfNFTs() public view returns(uint256) {
        return _tokenCounter.current();
    }
}