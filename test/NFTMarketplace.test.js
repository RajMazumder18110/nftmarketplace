const { expect } = require('chai');
const { ethers } = require('ethers')
const NFTMarketplace = artifacts.require('NFTMarketplace');
console.clear();

const NFTAddress = '0xf4B3ebd3CfaC3d3B879E9D10FD21449C1Ee12158'
const zeroAddress = '0x0000000000000000000000000000000000000000'

contract('NFTMarketplace', accounts => {
    let nftMarketplace, result;

    before(async () => {
        nftMarketplace = await NFTMarketplace.deployed();
    })
    describe('Deployment', () => {
        it('Should deploy contract perfectly', async () => {
            expect(nftMarketplace.address).not.to.be.equal('0x0');
            expect(nftMarketplace.address).not.to.be.equal('');
            expect(nftMarketplace.address).not.to.be.equal(null);
        })

        it('Should return initial listing fee as 0.025 ETH', async () => {
            result = await nftMarketplace.getListingFee();
            const fee = ethers.utils.formatUnits(result.toString(), 'ether');
            expect(fee).to.be.equal('0.025');
        })

        it('Should return initial market items is 0', async () => {
            result = await nftMarketplace.getAllMarketItems();
            expect(result.length).to.be.equal(0);
        })
    })

    describe("Listing Fee", () => {
        describe('- Success', () => {
            it('Should update the listing fee while sender is account 1', async () => {
                const newFee = ethers.utils.parseEther('0.2');
                await nftMarketplace.updateListingFee(newFee);
                result = await nftMarketplace.getListingFee();
                const fee = ethers.utils.formatUnits(result.toString(), 'ether');
                expect(fee).to.be.equal('0.2');
            })
        })

        describe('- Faliour', () => {
            it('Should revert update lising fee while sender is not owner', async () => {
                try{
                   const newFee = ethers.utils.parseEther('0.5');
                   await nftMarketplace.updateListingFee(newFee, { from: accounts[1] });
                }catch(e){
                    expect(e.reason).to.be.equal('OnlyOwner: Function Only accessable of owner')
                }
            })
        })  
    })

    describe('Creating Market Items', () => {
        describe('- Success', () => {
            it('Should create a market item with tokenId 1', async () => {
                const price = ethers.utils.parseEther('1.5');
                const fee = ethers.utils.parseEther('0.2')
                const tokenId = 1;
                result = await nftMarketplace.createMarketItem(
                    NFTAddress, tokenId, price, {
                        value: fee
                    }
                )
            })
    
            it('Should return the token 1 MarketItem data corrctly', async () => {
                const items = await nftMarketplace.getAllMarketItems();
                const price = ethers.utils.parseEther('1.5').toString();
    
                expect(items.length).to.be.equal(1)
                expect(items[0].itemId.toString()).to.be.equal('1')
                expect(items[0].tokenId.toString()).to.be.equal('1')
                expect(items[0].nftContract).to.be.equal(NFTAddress)
                expect(items[0].seller).to.be.equal(zeroAddress)
                expect(items[0].owner).to.be.equal(accounts[0])
                expect(items[0].price).to.be.equal(price)
                expect(items[0].status.toString()).to.be.equal('0')
            })
        })

        describe('- Faliour', () => {
            const tokenId = 2
            it('Should rever creating market item while listing price is not sent', async () => {
                const price = 100
                try{
                    await nftMarketplace.createMarketItem(
                        NFTAddress, tokenId, price
                    )
                }catch(e){
                    expect(e.reason).to.be.equal('ListingPriceSent: Please sent the correct listing fee')
                }
            })

            it('Should revert creating market item while price is zero', async () => {
                const price = 0;
                const fee = ethers.utils.parseEther('0.2')
                try{
                    await nftMarketplace.createMarketItem(
                        NFTAddress, tokenId, price, {
                            value: fee
                        }
                    )
                }catch(e){
                    expect(e.reason).to.be.equal('PriceMoreThanZero: You can set price to zero')
                }
            })
        })
    })
})