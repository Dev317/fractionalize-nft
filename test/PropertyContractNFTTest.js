const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PropertyNFT", function() {

    deployContract = async () => {
        // Deploy NFT contract
        const PropertyContractNFT = await ethers.getContractFactory("PropertyContractNFT");
        const propertyContractNFT = await PropertyContractNFT.deploy();
        await propertyContractNFT.deployed();

        return propertyContractNFT
    }

    it("Test deployment", async function () {
        const propertyContractNFT = await deployContract();
        let numNFTs = await propertyContractNFT.getNumberOfNFTs();
        expect(numNFTs.toNumber()).to.equal(0);
    });


    it("Test pause()", async () => {
        const propertyContractNFT = await deployContract();
        await propertyContractNFT.pause()
        expect(propertyContractNFT._paused, true)
    })

    it("Test unpause()", async () => {
        const propertyContractNFT = await deployContract();
        await propertyContractNFT.pause()
        await propertyContractNFT.unpause()
        expect(propertyContractNFT._paused, false)
    })


    it("Test mint()", async () => {
        const [_, buyerAddress] = await ethers.getSigners();
        const titleDeeds = "ipfs://titleDeeds"
        const totalPropertyFractionTokens = 5

        const propertyContractNFT = await deployContract();
        await propertyContractNFT.mint(buyerAddress.address, titleDeeds, totalPropertyFractionTokens)
        expect(await propertyContractNFT.getNumberOfNFTs(), 1)
        expect(await propertyContractNFT.PFTMap(0).tokenId, 0)
    })

    it("Test tokenURI()", async () => {
        const [_, buyerAddress] = await ethers.getSigners();
        const titleDeeds = "ipfs://titleDeeds"
        const totalPropertyFractionTokens = 5

        const propertyContractNFT = await deployContract();
        await propertyContractNFT.mint(buyerAddress.address, titleDeeds, totalPropertyFractionTokens)
        expect(await propertyContractNFT.tokenURI(0), titleDeeds)
    })

    it("Test transferERC20()", async () => {
        const [_, buyerAddress] = await ethers.getSigners();
        const titleDeeds = "ipfs://titleDeeds"
        const totalPropertyFractionTokens = 5

        const propertyContractNFT = await deployContract();
        await propertyContractNFT.mint(buyerAddress.address, titleDeeds, totalPropertyFractionTokens)
        await propertyContractNFT.transferERC20(buyerAddress.address, 0, 2)

        pft = await propertyContractNFT.PFTMap(0)
        pftAddress = pft.pftAddress;
        const PropertyFractionToken = await ethers.getContractFactory("PropertyFractionToken");
        const token = PropertyFractionToken.attach(pftAddress);
        const balance = await token.holderBalances(buyerAddress.address)
        expect(balance, 2)
    })

});