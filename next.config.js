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
    PROPERTY_NFT_ADDRESS: '0xb5D24C76bD0904E4bfdF644FA857452029C6251E',
  },
}
