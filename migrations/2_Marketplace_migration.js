const NFT = artifacts.require("NFT");
const NFTMarketplace = artifacts.require("NFTMarketplace");

module.exports = (deployer) => {
    deployer.deploy(NFT);
    deployer.deploy(NFTMarketplace);
}