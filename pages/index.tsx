import { NFTCard } from "../components/nftCard";
import { useState } from "react";

const Home = () => {
	const [wallet, setWalletAddress] = useState("");
	const [collection, setCollectionAddress] = useState("");
	const [NFTs, setNFTs] = useState([]);
	const [fetchForCollection, setFetchForCollection] = useState(false);
	const [paginateKey, setPaginateKey] = useState("");

	const fetchNFTs = async (willPaginate: boolean) => {
		let nfts: any;
		console.log("fetching nfts");
		const api_key = "A8A1Oo_UTB9IN5oNHfAc2tAxdR4UVwfM";
		const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTs/`;
		var requestOptions = {
			method: "GET",
		};

		if (!collection.length) {
			const fetchURL = `${baseURL}?owner=${wallet}&pageSize=5&pageKey=${
				willPaginate && paginateKey
			}`;

			nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
		} else {
			console.log("fetching nfts for collection owned by address");
			const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}&pageSize=5&pageKey=${
				willPaginate && paginateKey
			}`;
			nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
		}

		if (nfts) {
			console.log("nfts:", nfts);
			setPaginateKey(nfts.pageKey);
			willPaginate && setNFTs((prevState) => [...prevState, ...nfts.ownedNfts]);
			!willPaginate && setNFTs(nfts.ownedNfts);
		}
	};

	const fetchNFTsForCollection = async (willPaginate: boolean) => {
		if (collection.length) {
			var requestOptions = {
				method: "GET",
			};
			const api_key = "A8A1Oo_UTB9IN5oNHfAc2tAxdR4UVwfM";
			const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTsForCollection/`;
			const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}&limit=5${
				willPaginate ? `&startToken=${paginateKey}` : ""
			}`;

			const nfts = await fetch(fetchURL, requestOptions).then((data) =>
				data.json()
			);
			if (nfts) {
				console.log("NFTs in collection:", nfts);
				setPaginateKey(nfts.nextToken);
				willPaginate && setNFTs((prevState) => [...prevState, ...nfts.nfts]);
				!willPaginate && setNFTs(nfts.nfts);
			}
		}
	};
	return (
		<div className="flex flex-col items-center justify-center py-8 gap-y-3">
			<div className="flex flex-col w-full justify-center items-center gap-y-2">
				<input
					disabled={fetchForCollection}
					type={"text"}
					onChange={(e) => setWalletAddress(e.target.value)}
					placeholder="Add your wallet address"
				></input>
				<input
					type={"text"}
					placeholder="Add the collection address"
					onChange={(e) => setCollectionAddress(e.target.value)}
				></input>
				<label className="text-gray-600 ">
					<input
						onChange={(e) => {
							setFetchForCollection(e.target.checked);
						}}
						type={"checkbox"}
						className="mr-2"
					></input>
					Fetch for collection
				</label>
				<button
					className={
						"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"
					}
					onClick={() => {
						if (fetchForCollection) {
							fetchNFTsForCollection();
						} else fetchNFTs();
					}}
				>
					Let's go!{" "}
				</button>
			</div>
			<div className="flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center">
				{NFTs.length &&
					NFTs.map((nft) => {
						return (
							<NFTCard
								key={nft.id.tokenId + nft.contract.address}
								nft={nft}
							></NFTCard>
						);
					})}
			</div>

			{paginateKey && (
				<button
					className={
						"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"
					}
					onClick={() => {
						if (fetchForCollection) {
							fetchNFTsForCollection(true);
						} else fetchNFTs(true);
					}}
				>
					Load More
				</button>
			)}
		</div>
	);
};

export default Home;
