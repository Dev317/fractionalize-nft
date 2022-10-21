require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const projectID = process.env.INFURA_ETHERUM_PROJECT_ID;
const privateKey = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    // hardhat: {
    //   chainId: 1337
    // },
    goerli: {
      url: `https://goerli.infura.io/v3/${projectID}`,
      accounts: [privateKey]
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${projectID}`,
      accounts: [privateKey]
    }
  },
  solidity: "0.8.9",
};
