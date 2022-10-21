const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarket", function() {
    // it("Create and execute market sale", async function () {
    //     // Deploy Market contract
    //     const Market = await ethers.getContractFactory("NFTMarket");
    //     const market = await Market.deploy();
    //     await market.deployed();
    //     const marketAddress = market.address;

    //     // Deploy NFT contract
    //     const NFT = await ethers.getContractFactory("NFT");
    //     const nft = await NFT.deploy(marketAddress);
    //     await nft.deployed();
    //     const nftContractAddress = nft.address;


    //     let listingPrice = await market.getListingPrice();
    //     listingPrice = listingPrice.toString();

    //     const auctionPrice = ethers.utils.parseUnits('0.5', 'ether');

    //     // Mint 2 NFTs
    //     await nft.createToken("abc");
    //     await nft.createToken("cdf");

    //     // Create sale item for 2 NFTs on marketplace
    //     await market.createMarketItem(nftContractAddress, 1, auctionPrice, { value: listingPrice });
    //     await market.createMarketItem(nftContractAddress, 2, auctionPrice, { value: listingPrice });


    //     // Buying NFT
    //     const [_, buyerAddress] = await ethers.getSigners();
    //     await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, { value: auctionPrice });


    //     let items = await market.fetchMarketItems();

    //     items = await Promise.all(items.map( async i => {
    //         const tokenURI = await nft.tokenURI(i.tokenId);
    //         let item = {
    //             price: i.price.toString(),
    //             tokenId: i.tokenId.toString(),
    //             seller: i.seller,
    //             owner: i.owner,
    //             tokenURI
    //         };
    //         return item;
    //     }))
    //     console.log('items: ', items);

    // });

    it("Test property contract", async function () {
        // Deploy Market contract
        const PropertyContractNFT = await ethers.getContractFactory("PropertyContractNFT");
        const propertyContractNFT = await PropertyContractNFT.deploy();
        await propertyContractNFT.deployed();
        const propertyContractNFTAddress = propertyContractNFT.address;

        let numNFTs = await propertyContractNFT.getNumberOfNFTs();
        console.log(numNFTs.toNumber());
    });
});