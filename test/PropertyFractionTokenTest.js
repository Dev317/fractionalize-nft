const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PropertyFrationToken", function() {

    deployContract = async () => {
        // Deploy ERC20 token contract
        const [ownerAddress] = await ethers.getSigners();
        const PropertyFractionToken = await ethers.getContractFactory("PropertyFractionToken");
        const token = await PropertyFractionToken.deploy(10, ownerAddress.address);
        await token.deployed();

        return token
    }

    it("Test deployment", async function () {
        const [ownerAddress] = await ethers.getSigners();
        const token = await deployContract();
        expect(await token.holderBalances(ownerAddress.address)).to.equal(10);

    });

    it("Test trackTransfer()", async () => {
        const [ownerAddress, buyerAddress] = await ethers.getSigners();
        const token = await deployContract();
        await token.trackTransfer(ownerAddress.address, buyerAddress.address, 5)
        expect(await token.holderBalances(ownerAddress.address)).to.equal(5);
    })

    it("Test getNumHolders()", async () => {
        const [ownerAddress, buyerAddress] = await ethers.getSigners();
        const token = await deployContract();
        await token.trackTransfer(ownerAddress.address, buyerAddress.address, 5)
        expect(await token.getNumHolders()).to.equal(2);

    })

    it("Test getHolderAddresses()", async () => {
        const [ownerAddress, buyerAddress] = await ethers.getSigners();
        const token = await deployContract();
        await token.trackTransfer(ownerAddress.address, buyerAddress.address, 5)
        const holderAdresses = await token.getHolderAddresses();
        expect(holderAdresses.length).to.equal(2);
    })

});