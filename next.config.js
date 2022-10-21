/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig

module.exports = {
  env: {
    INFURA_IPFS_PROJECT_ID: '2BzKoHz2QXyERucAVYAN6iZFpw8',
    INFURA_PROJECT_SECRET: 'd7b9841c57d6fae7cf6bd28ccdd891b3',
    PROPERTY_NFT_ADDRESS: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  },
}
