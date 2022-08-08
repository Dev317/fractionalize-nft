import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'

import PropertyContractNFT from '../artifacts/contracts/PropertyContractNFT.sol/PropertyContractNFT.json'

import { useRouter } from 'next/router'

const propertyContractNFTAddress = process.env.PROPERTY_NFT_ADDRESS;


export default function Dashboard({ web3Provider }) {

    const [formInput, updateFormInput] = useState({
        tokenId: '',
        fractionalOwnerAddress: '',
        amount: '',
    });

    const router = useRouter();


    async function transfer() {
        const { tokenId, fractionalOwnerAddress, amount } = formInput;

        if (!tokenId || !fractionalOwnerAddress || !amount) {
            return;
        }

        console.log(web3Provider.provider.selectedAddress);


        const signer = web3Provider.getSigner();
        const propertyNFTContract = new ethers.Contract(propertyContractNFTAddress,PropertyContractNFT.abi, signer);
        let transaction = await propertyNFTContract.transferERC20(fractionalOwnerAddress, parseInt(tokenId), parseInt(amount));
        let tx = await transaction.wait();

        router.push('/');

    }


    return(
        <div className="flex justify-center">
            <div className="w-1/2 flex flex-col pb-12">
                <label className="block mt-6 text-center">
                    <span className="font-sans text-xl font-medium">Transfer Token</span>
                </label>
                <input
                    placeholder="Token Id"
                    className="mt-8 border rounded p-4"
                    onChange={e => updateFormInput({...formInput, tokenId: e.target.value })}
                />
                <input
                    placeholder="Fractional owner address"
                    className="mt-2 border rounded p-4"
                    onChange={e => updateFormInput({...formInput, fractionalOwnerAddress: e.target.value })}
                />
                <input
                    placeholder="Amount of tokens to transfer"
                    className="mt-2 border rounded p-4"
                    onChange={e => updateFormInput({...formInput, amount: e.target.value })}
                />
                <button
                    onClick={transfer}
                    className="font-bold mt-4 bg-indigo-500 text-white rounded p-4 shadow-lg"
                > Confirm
                </button>
            </div>
        </div>
    );

    // const [nfts, setNfts] = useState([]);
    // const [sold, setSold] = useState([]);
    // const [loadingState, setLoadingState] = useState('not-loaded');

    // useEffect(() => {
    //     loadNFTs();
    // }, []);

    // async function loadNFTs() {
    //     const web3Modal = new Web3Modal();
    //     const connection = await web3Modal.connect();
    //     const provider = new ethers.providers.Web3Provider(connection);
    //     const signer = provider.getSigner();

    //     const tokenContract = new ethers.Contract(nftAddress, NFT.abi, signer);
    //     const marketContract = new ethers.Contract(nftMarketAddress, Market.abi, signer);

    //     const data = await marketContract.fetchItemsCreated();

    //     const items = await Promise.all(data.map(async i => {
    //       const tokenURI = await tokenContract.tokenURI(i.tokenId);
    //       const meta = await axios.get(tokenURI);
    //       let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
    //       let item = {
    //         price,
    //         tokenId: i.tokenId,
    //         seller: i.seller,
    //         owner: i.owner,
    //         image: meta.data.image,
    //       };
    //       return item;
    //     }));

    //     const soldItems = items.filter(i => i.sold);
    //     setSold(soldItems);
    //     setNfts(items);
    //     setLoadingState('loaded');
    // }

    // return (
    //     <div>
    //         <div className="p-4">
    //             <h2 className="text-2xl py-2">Items created</h2>
    //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
    //                 {
    //                     nfts.map((nft, i) => (
    //                         <div key={i} className="border shadow rounded-xl overflow-hidden">
    //                             <img src={nft.image} className="rounded"/>
    //                             <div className="p-4 bg-black">
    //                                 <p className="text-2xl mb-4 font-bold text-white">Price - {nft.price} ETH</p>
    //                             </div>
    //                         </div>
    //                     ))
    //                 }
    //             </div>
    //         </div>

    //         <div className="px-4">
    //             {
    //                 Boolean(sold.length) && (
    //                     <div>
    //                         <h2 className="text-2xl py-2">Items sold</h2>
    //                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
    //                             {
    //                                 sold.map((nft, i) => (
    //                                     <div key={i} className="border shadow rounded-xl overflow-hidden">
    //                                         <img src={nft.image} className="rounded"/>
    //                                         <div className="p-4 bg-black">
    //                                             <p className="text-2xl mb-4 font-bold text-white">Price - {nft.price} ETH</p>
    //                                         </div>
    //                                     </div>
    //                                 ))
    //                             }
    //                         </div>
    //                     </div>
    //                 )
    //             }
    //         </div>
    //     </div>
    // );

}