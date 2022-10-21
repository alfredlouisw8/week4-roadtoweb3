import { ethers } from "ethers";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";

export const NFTCard = ({ nft }) => {
	function copyToClipboard() {
		navigator.clipboard.writeText(nft.contract.address);
		alert("copied to clipboard");
	}

	return (
		<div className="w-1/6 flex flex-col ">
			<div className="rounded-md">
				<img
					className="object-cover h-128 w-full rounded-t-md"
					src={nft.media[0].gateway}
				></img>
			</div>
			<div className="flex flex-col y-gap-2 px-2 py-3 bg-slate-100 rounded-b-md h-110 ">
				<div className="">
					<h2 className="text-xl text-gray-800">{nft.title}</h2>
					<p className="text-gray-600">Id: {parseInt(nft.id.tokenId)}</p>
					<div className="flex items-center group">
						<p className="text-gray-600 overflow-ellipsis overflow-hidden w-5/6">
							{nft.contract.address}...
						</p>
						<DocumentDuplicateIcon
							className="group-hover:block hidden ml-2 w-5 h-5 cursor-pointer"
							onClick={copyToClipboard}
						/>
					</div>
				</div>

				<div className="flex-grow mt-2">
					<p className="text-gray-600">{nft.description.substr(0, 150)}...</p>
				</div>
			</div>
		</div>
	);
};
