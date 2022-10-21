import { ethers } from 'ethers'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { create as ipfsHttpClient } from 'ipfs-http-client';
import PropertyContractNFT from '../artifacts/contracts/PropertyContractNFT.sol/PropertyContractNFT.json'

// const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

// const ipfsClient = require('ipfs-http-client');
const projectID = process.env.INFURA_IPFS_PROJECT_ID;
const projectSecret = process.env.INFURA_PROJECT_SECRET;
console.log(projectID, projectSecret);
const auth = 'Basic ' + Buffer.from(projectID + ':' + projectSecret).toString('base64');
const client = ipfsHttpClient({
    host: 'infura-ipfs.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});

const propertyContractNFTAddress = process.env.PROPERTY_NFT_ADDRESS;

export default function CreateContract({ web3Provider }) {

    const [fileURL, setFileURL] = useState();
    const [formInput, updateFormInput] = useState({
        name: '',
        description: '',
        numTokens: '',
        propertyOwner: ''
    });
    const router = useRouter();

    async function onChange(e) {
        const file = e.target.files[0];

        try {
            const added = await client.add(
                file,
                {
                    progress: (prog) => console.log(`received: ${prog}`)
                }
            );

            const url = `infura-ipfs.io/ipfs/${added.path}`;
            console.log(url);
            setFileURL(url);
        } catch(e) {
            console.log(e);
        }
    }

    async function createContract() {
        const { name, description, numTokens, propertyOwner } = formInput;

        if (!name || !description || !numTokens || !propertyOwner ||!fileURL) {
            return;
        }

        const data = JSON.stringify({
            name, description, numTokens, propertyOwner, image: fileURL
        });

        try {
            const added = await client.add(data);
            const url = `infura-ipfs.io/ipfs/${added.path}`;
            console.log(url);
            confirmContract(url, propertyOwner, numTokens);
        } catch(e) {
            console.log(e);
        }
    }

    async function confirmContract(url, propertyOwner, numTokens) {
        // const web3Modal = new Web3Modal();
        // const connection = await web3Modal.connect();
        // const provider = new ethers.providers.Web3Provider(connection);
        // const signer = provider.getSigner();
        console.log(web3Provider.provider.selectedAddress);
        const signer = web3Provider.getSigner();

        // let contract = new ethers.Contract(nftAddress, NFT.abi, signer);
        // let transaction = await contract.createToken(url);
        // let tx = await transaction.wait();

        // let event = tx.events[0];
        // let value = event.args[2];
        // let tokenId = value.toNumber();

        // const price = ethers.utils.parseUnits(formInput.price, 'ether');

        // contract = new ethers.Contract(nftMarketAddress, Market.abi, signer);
        // let listingPrice = await contract.getListingPrice();
        // listingPrice = listingPrice.toString();

        // transaction = await contract.createMarketItem(nftAddress, tokenId, price, { value: listingPrice });

        // await transaction.wait();

        let propertyNFTContract = new ethers.Contract(propertyContractNFTAddress, PropertyContractNFT.abi, signer);
        let transaction = await propertyNFTContract.mint(propertyOwner, url, parseInt(numTokens));
        let tx = await transaction.wait();

        router.push('/');
    }

    return(
        <div className="flex justify-center">
            <div className="w-1/2 flex flex-col pb-12">
                <label className="block mt-6 text-center">
                    <span className="font-sans text-xl font-medium">Contract Creation</span>
                </label>
                <input
                    placeholder="Asset name"
                    className="mt-8 border rounded p-4"
                    onChange={e => updateFormInput({...formInput, name: e.target.value })}
                />
                <textarea
                    placeholder="Asset description"
                    className="mt-2 border rounded p-4"
                    onChange={e => updateFormInput({...formInput, description: e.target.value })}
                />
                <input
                    placeholder="Number of fraction tokens"
                    className="mt-2 border rounded p-4"
                    onChange={e => updateFormInput({...formInput, numTokens: e.target.value })}
                />
                <input
                    placeholder="Property owner address"
                    className="mt-2 border rounded p-4"
                    onChange={e => updateFormInput({...formInput, propertyOwner: e.target.value })}
                />

                <label className="block mt-4">
                    <span className="sr-only">Choose File</span>
                    <input
                        type="file"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        onChange={onChange}
                    />
                </label>
                {
                    fileURL && (
                        <img className="rounded mt-4" width="800" src={fileURL}/>
                    )
                }

                <button
                    onClick={createContract}
                    className="font-bold mt-4 bg-indigo-500 text-white rounded p-4 shadow-lg"
                > Confirm
                </button>
            </div>
        </div>
    );
}