// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    /**
     * @dev Using counters for keep track of minted token ids
     */
    Counters.Counter private _tokenIds;

    /**
     * @dev Keep track of NFTMarketplace address which is immutable
     */
    address immutable marketplaceAddress;

    /**
     * @dev Function which mint tokens to the minterb and set the URL to token id
     * @param _tokenURI: The URL of the IPFS file
     */
    function mintToken(string calldata _tokenURI) external {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
    }

    /**
     * @dev Assigning the Marketplace contract address and giving name and symbol to Contract
     * @param _marketplaceAddress: The Address of the marketplace
     */
    constructor(address _marketplaceAddress) ERC721("NFT Marketplace", "NFTM"){
        marketplaceAddress = _marketplaceAddress;
    }
}