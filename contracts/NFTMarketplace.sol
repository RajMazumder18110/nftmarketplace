// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openZeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTMarketplace is ReentrancyGuard {
    using Counters for Counters.Counter;

    /**
     * @dev the struct contains all the details about market items.
     * @param itemId: The market item id.
     * @param tokenId: The token id of the NFT.
     * @param nftContract: The nft contract address.
     * @param seller: The listed person.
     * @param owner: The buyer of the NFT.
     * @param price: The NFT price.
     * @param status: The Current status of the NFT.
     */
    struct MarketItem {
        uint256 itemId;
        uint256 tokenId;
        address nftContract;
        address payable seller;
        address payable owner;
        uint256 price;
        NFTStatus status;
    }

    /**
     * @dev Using counters for keep track of market items.
     */
    Counters.Counter private _itemIds;

    /**
     * @dev Keep track of owner of the NFTMarket contract and for pay the minting fee.
     */
    address payable owner;

    /**
     * @dev Listing fee to list their nfts.
     */
    uint256 listingFee = 0.025 ether;

    /**
     * @dev Enum to keep track of the NFT status whether it's listed, delisted, sold, Owned.
     */
    enum NFTStatus {
        Owned, Listed, Sold, Delisted
    }

    /**
     * @dev Mapping between market itemId to MarketItem.
     */
    mapping(uint256 => MarketItem) private _itemIdToMarketItem;

    /**
     * @dev Modifier OnlyOwner checks if the msg.sender is owner or not.
     */
    modifier OnlyOwner(){
        require(msg.sender == owner, "OnlyOwner: Function Only accessable of owner");
        _;
    }

    /**
     * @dev Modifier ListingPriceSent checks if the minter sends the listing fee or not.
     */
    modifier ListingPriceSent() {
        require(msg.value == listingFee, "ListingPriceSent: Please sent the correct listing fee");
        _;
    }

    /**
     * @dev Modifier PriceMoreThanZero checks if the price is more than zero.
     * @param _price: The price which we want to check.
     */
    modifier PriceMoreThanZero(uint256 _price){
        require(_price > 0, "PriceMoreThanZero: You can set price to zero");
        _;
    }

    /**
     * @dev Modifier BuyAmountSent checks if the msg.value is equals to nft price.
     * @param _itemId: The item we want to check.
     */
    modifier BuyAmountSent(uint256 _itemId){
        require(_itemIdToMarketItem[_itemId].price == msg.value, "BuyAmountSent: Please sent the correct NFT price");
        _;
    }

    /**
     * @dev Modifier BuyerisNotSeller checks if the msg.value is equals to nft price.
     * @param _itemId: The item we want to check.
     */
    modifier BuyerisNotSeller(uint256 _itemId){
        require(_itemIdToMarketItem[_itemId].seller != msg.sender, "BuyerisNotSeller: You are the seller");
        _;
    }

    /**
     * @dev Modifier OnlyMinter checks if the msg.sender is current owner.
     * @param _itemId: The token Id which we want to check.
     */
    modifier OnlyMinter(uint256 _itemId){
        require(_itemIdToMarketItem[_itemId].owner == msg.sender, "OnlyMinter: You are not the minter");
        _;
    }

    /**
     * @dev Modifier StatusOwnedOrDelisted checks if the marketItem status is Owned or Delisted.
     * @param _itemId: The item id.
     */
    modifier StatusOwnedOrDelisted(uint256 _itemId){
        require(
            (_itemIdToMarketItem[_itemId].status == NFTStatus.Owned) || (_itemIdToMarketItem[_itemId].status == NFTStatus.Delisted), 
            "StatusMintedOrDelisted: Current Status is not Minted or Dlisted");
        _;
    }

    /**
     * @dev Modifier StatusListed checks if the marketItem status is Listed.
     * @param _itemId: The item id.
     */
    modifier StatusListed(uint256 _itemId){
        require( _itemIdToMarketItem[_itemId].status == NFTStatus.Listed,  "StatusListed: Current Status is not Listed");
        _;
    }

    /**
     * @dev Modifier StatusSold checks if the marketItem status is Listed.
     * @param _itemId: The item id.
     */
    modifier StatusSold(uint256 _itemId){
        require( _itemIdToMarketItem[_itemId].status == NFTStatus.Sold,  "StatusSold: Current Status is not Listed");
        _;
    }

    /**
     * @dev Setting the owner to contract deployer.
     */
    constructor(){
        owner = payable(msg.sender);
    }

    /**
     * @dev Returns the listing fee.
     */
    function getListingFee() external view returns(uint256){
        return listingFee;
    }

    /**
     * @dev Updating the listing fee which only applicable to owner.
     * @param _newFee: The new fee of the listing price.
     */
    function updateListingFee(uint256 _newFee) external OnlyOwner {
        listingFee = _newFee;
    }

    /**
     * @dev Geiing all the marketItems
     */
    function getAllMarketItems() external view returns(MarketItem[] memory){
        uint256 totalItems = _itemIds.current();
        uint256 marketItemsArrayIndex;
        MarketItem[] memory marketItems = new MarketItem[](totalItems);
        for(uint256 loopIndex = 1; loopIndex <= totalItems; loopIndex++){
            MarketItem memory marketItem = _itemIdToMarketItem[loopIndex];
            marketItems[marketItemsArrayIndex] = marketItem;
            marketItemsArrayIndex++;
        }
        return marketItems;
    }

    /**
     * @dev Creating marketitem.
     * @param _nftContract: The NFT contract address.
     * @param _price: The price of the NFT.
     * @param _tokenId: The NFT tokenId.
     */
    function createMarketItem(address _nftContract, uint256 _tokenId, uint256 _price)
        external payable ListingPriceSent PriceMoreThanZero(_price) nonReentrant {
        _itemIds.increment();
        uint256 newItemId = _itemIds.current();

        _itemIdToMarketItem[newItemId] = MarketItem(
            newItemId, _tokenId, _nftContract, payable(address(0)),
            payable(msg.sender), _price, NFTStatus.Owned
        );

        owner.transfer(listingFee);
    }

    /**
     * @dev Lising Marketitem.
     * @param _itemId: The itemId.
     */
    function listMarketItem(uint256 _itemId)
        external OnlyMinter(_itemId) StatusOwnedOrDelisted(_itemId) nonReentrant {
            MarketItem storage marketItem =  _itemIdToMarketItem[_itemId];
            IERC721(marketItem.nftContract).approve(address(this), marketItem.tokenId);
            IERC721(marketItem.nftContract).transferFrom(msg.sender, address(this), marketItem.tokenId);

            marketItem.status = NFTStatus.Listed;
            marketItem.seller = payable(msg.sender);
            marketItem.owner = payable(address(0));
    }

    /**
     * @dev Delist MarketItem.
     * @param _itemId: The item id.
     */
    function delistMarketItem(uint256 _itemId)
        external OnlyMinter(_itemId) StatusListed(_itemId) nonReentrant {
        
        MarketItem storage marketItem = _itemIdToMarketItem[_itemId];
        marketItem.status = NFTStatus.Delisted;
        marketItem.seller = payable(address(0));
        marketItem.owner = payable(msg.sender);

        IERC721(marketItem.nftContract).approve(msg.sender, marketItem.tokenId);
        IERC721(marketItem.nftContract).transferFrom(address(this), msg.sender, marketItem.tokenId);
    }

    /**
     * @dev buy nfts.
     * @param _itemId: The market item which want to buy.
     */
    function buyMarketItem(uint _itemId)
        external StatusListed(_itemId) BuyAmountSent(_itemId) BuyerisNotSeller(_itemId) nonReentrant payable {
        
        MarketItem storage marketItem = _itemIdToMarketItem[_itemId];
        address payable seller = marketItem.seller;

        marketItem.status = NFTStatus.Sold;
        marketItem.owner = payable(msg.sender);
        marketItem.seller = payable(address(0));
        seller.transfer(marketItem.price);

        _approveBuyerForFurtherProcess(_itemId, marketItem.nftContract, msg.sender, marketItem.tokenId);
    }

    /**
     * @dev Helper function for further transacion for buyer.
     * @param _itemId: The market item.
     * @param _nftContract: The Nft contract.
     * @param _owner: The new owner of the nft.
     * @param _tokenId: The token id of the NFT.
     */
    function _approveBuyerForFurtherProcess(uint256 _itemId, address _nftContract, address _owner, uint256 _tokenId) 
        private StatusSold(_itemId) {
        
        _itemIdToMarketItem[_itemId].status = NFTStatus.Owned;
        IERC721(_nftContract).approve(_owner, _tokenId);
        IERC721(_nftContract).transferFrom(address(this), _owner, _tokenId);
    }
}