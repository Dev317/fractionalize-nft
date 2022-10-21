import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { TbExternalLink } from 'react-icons/tb'


import PropertyContractNFT from '../artifacts/contracts/PropertyContractNFT.sol/PropertyContractNFT.json'
import PropertyFractionToken from '../artifacts/contracts/PropertyFractionToken.sol/PropertyFractionToken.json'

const propertyContractNFTAddress = process.env.PROPERTY_NFT_ADDRESS;
console.log(propertyContractNFTAddress);

export default function Home({ web3Provider }) {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');

  useEffect(() => {
    loadNFTs();
  }, [])

  async function loadNFTs() {
    const provider = new ethers.providers.InfuraProvider("goerli");
    // const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
    // const marketContract = new ethers.Contract(nftMarketAddress, Market.abi, provider);

    // const data = await marketContract.fetchMarketItems();

    // const items = await Promise.all(data.map(async i => {
    //   const tokenURI = await tokenContract.tokenURI(i.tokenId);
    //   const meta = await axios.get(tokenURI);
    //   let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
    //   let item = {
    //     price,
    //     tokenId: i.tokenId,
    //     seller: i.seller,
    //     owner: i.owner,
    //     image: meta.data.image,
    //     name: meta.data.name,
    //     description: meta.data.description
    //   };
    //   return item;
    // }));

    // setNfts(items);
    // setLoadingState('loaded');

    const propertyNFTContract = new ethers.Contract(propertyContractNFTAddress, PropertyContractNFT.abi, provider);

    let numberNFTs;

    try {
      numberNFTs = await propertyNFTContract.getNumberOfNFTs();
      numberNFTs = numberNFTs.toNumber();
    } catch (e) {
      console.log(e);
    }
    console.log(numberNFTs);
    let items = [];

    for (let i = 0; i < numberNFTs; i++) {
      const pcnft = await propertyNFTContract.PCNFTMap(i);

      const propertyFractionTokenAddress = await pcnft.fractionalERC20TokenAddress.toString();
      const propertyFractionTokenContract = new ethers.Contract(propertyFractionTokenAddress, PropertyFractionToken.abi, provider);
      const fractionTokenSupply = await propertyFractionTokenContract.totalSupply();
      const parsedFractionTokenSupply = parseInt(ethers.utils.formatUnits(fractionTokenSupply, 18));
      const holderAddresses = await propertyFractionTokenContract.getHolderAddresses();

      const tokenURI = await propertyNFTContract.tokenURI(pcnft.tokenId.toString());
      const metadata = await axios.get(tokenURI);
      console.log(metadata);

      let item = {
        parsedSupply: parsedFractionTokenSupply,
        tokenId: pcnft.tokenId.toString(),
        tokenAddress: propertyFractionTokenAddress,
        owner: metadata.data.propertyOwner,
        image: metadata.data.image,
        name: metadata.data.name,
        description: metadata.data.description,
        holders : []
      };

      for (let j = 0; j < holderAddresses.length; j++) {
        const holderBalance = await propertyFractionTokenContract.balanceOf(holderAddresses[j]);
        const parsedBalance = parseInt(ethers.utils.formatUnits(holderBalance, 18));
        item.holders.push({
          walletAddress: holderAddresses[j],
          balance: parsedBalance
        });
      }

      items.push(item);
    }
    setNfts(items);
    setLoadingState('loaded');

  }

  // async function buyNft(nft) {
  //   const web3Modal = new Web3Modal();
  //   const connection = await web3Modal.connect();
  //   const provider = new ethers.providers.Web3Provider(connection);
  //   const signer = provider.getSigner();
  //   const contract = new ethers.Contract(nftMarketAddress, Market.abi, signer);
  //   const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
  //   const transaction = await contract.createMarketSale(nftAddress, nft.tokenId, { value: price });
  //   await transaction.wait();

  //   loadNFTs();
  // }

  if (loadingState === 'loaded' && !nfts.length) {
    return (
      <h1 className="py-10 px-10 text-xl"> No contract listed at the moment! </h1>
    );
  }

  return (
    <div className="flex justify-start mb-5">
      <div className="px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <div>
                  <img src={nft.image} className="object-cover h-48 w-96"/>
                </div>
                <div className="pt-4">
                  <p className="text-2xl font-semibold mb-2 px-4">{nft.name}</p>
                  <div style={{ overflow: 'hidden' }} className="mb-4">
                    <p className="px-4 text-gray-400">{nft.description}</p>
                  </div>

                  <div style={{ overflow: 'hidden' }} className="mb-3">
                    <p className="ml-4 font-semibold text-violet-800">Number of holder(s): {nft.holders.length}</p>
                      {nft.holders.map((holder, j) =>(
                        <p key={j} className="ml-4 text-violet-400">{holder.walletAddress.slice(0,6) + "..."+ holder.walletAddress.slice(-4) + " owns " + holder.balance + " PFT"}</p>
                      ))}
                  </div>
                </div>

                <div className="bg-indigo-500 text-center py-3">
                  <p className="text-xl font-bold text-white">Total Supply: {nft.parsedSupply} PFT</p>
                </div>

                <a href={`https://goerli.etherscan.io/token/${nft.tokenAddress}`} target="_blank" rel="noreferrer">
                <button className="w-full bg-violet-400 hover:bg-violet-300 flex justify-center items-center text-white font-bold py-4 px-12 rounded-br-lg rounded-bl-lg">
                  <p className="px-1">
                    View Transactions
                  </p>
                  <TbExternalLink />
                </button>
                </a>

              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
