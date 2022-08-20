const { expect } = require('chai');
const NFT = artifacts.require("NFT");
console.clear();

contract("NFT", (accounts) => {
    let nft, result
    before(async () => {
        nft = await NFT.deployed();
    })

    describe("Deployment", () => {
        it('Should deploy contract perfectly', async () => {
            expect(nft.address).not.to.be.equal('0x0');
            expect(nft.address).not.to.be.equal('');
            expect(nft.address).not.to.be.equal(null);
        })

        it("Should return correct Name & Symbol", async () => {
            result = await nft.name();
            expect(result).to.be.equal("NFT Marketplace");
            result = await nft.symbol();
            expect(result).to.be.equal("NFTM");
        })
    })

    describe("Minting", () => {
        const tokenURI = "https://google.com"

        it('Should mint an nft to account1', async () => {
            result = await nft.mintToken(tokenURI);
            const tokenId = result.logs[0].args.tokenId.toNumber()
            const owner = result.logs[0].args.to
            expect(tokenId).to.be.equal(1);
            expect(owner).to.be.equal(accounts[0]);
        })

        it('should return the correct tokenURI for token 1', async () => {
            result = await nft.tokenURI(1);
            expect(result).to.be.equal(tokenURI);
        })
    })
})