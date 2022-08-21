const { expect } = require('chai');
const { ethers } = require('ethers')
const NFTMarketplace = artifacts.require('NFTMarketplace');
const NFT = artifacts.require("NFT");
console.clear();

const zeroAddress = '0x0000000000000000000000000000000000000000'

const revertedWithMsg = (e, msg) => {
    return (e.hijackedStack.includes(msg) || e.reason === msg)
}

contract('NFTMarketplace', accounts => {
    let nftMarketplace, nft, result;

    before(async () => {
        nftMarketplace = await NFTMarketplace.deployed();
        nft = await NFT.deployed();
    })

    describe("NFT", () => {
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

            it('Should mint an nft to account2', async () => {
                result = await nft.mintToken(tokenURI, { from: accounts[1] });
                const tokenId = result.logs[0].args.tokenId.toNumber()
                const owner = result.logs[0].args.to
                expect(tokenId).to.be.equal(2);
                expect(owner).to.be.equal(accounts[1]);
            })
    
            it('should return the correct tokenURI for token 1 & 2', async () => {
                result = await nft.tokenURI(1);
                expect(result).to.be.equal(tokenURI);
            })

        })
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
                    expect(revertedWithMsg(e, 'OnlyOwner: Function Only accessable of owner'))
                            .to.be.equal(true)

                }
            })
        })  
    })

    describe('Creating Market Items', () => {
        describe('- Success', () => {
            it('Should create a market item with tokenId 1', async () => {
                const price = ethers.utils.parseEther('1.5').toString();
                const fee = ethers.utils.parseEther('0.2').toString()
                const tokenId = 1;
                result = await nftMarketplace.createMarketItem(
                    nft.address, tokenId, price, {
                        value: fee
                    }
                )
            })

            it('Should create a market item with tokenId 2', async () => {
                const price = ethers.utils.parseEther('1.5').toString();
                const fee = ethers.utils.parseEther('0.2').toString()
                const tokenId = 2;
                result = await nftMarketplace.createMarketItem(
                    nft.address, tokenId, price, {
                        from: accounts[1], value: fee
                    }
                )
            })
    
            it('Should return the token 1 MarketItem data corrctly', async () => {
                const items = await nftMarketplace.getAllMarketItems();
                const price = ethers.utils.parseEther('1.5').toString();
    
                expect(items.length).to.be.equal(2)
                expect(items[0].itemId.toString()).to.be.equal('1')
                expect(items[0].tokenId.toString()).to.be.equal('1')
                expect(items[0].nftContract).to.be.equal(nft.address)
                expect(items[0].seller).to.be.equal(zeroAddress)
                expect(items[0].owner).to.be.equal(accounts[0])
                expect(items[0].price).to.be.equal(price)
                expect(items[0].status.toString()).to.be.equal('0')
            })
        })

        describe('- Faliour', () => {
            const tokenId = 2
            it('Should revert creating market item while listing price is not sent', async () => {
                const price = 100
                try{
                    await nftMarketplace.createMarketItem(
                        nft.address, tokenId, price
                    )
                }catch(e){
                    expect(revertedWithMsg(e, 'ListingPriceSent: Please sent the correct listing fee'))
                            .to.be.equal(true)
                }
            })

            it('Should revert creating market item while price is zero', async () => {
                const price = 0;
                const fee = ethers.utils.parseEther('0.2').toString()
                try{
                    await nftMarketplace.createMarketItem(
                        nft.address, tokenId, price, {
                            value: fee
                        }
                    )
                }catch(e){
                    expect(revertedWithMsg(e, 'PriceMoreThanZero: You can set price to zero'))
                            .to.be.equal(true)
                }
            })
        })
    })

    describe("Listing Items", () => {
        const itemId = 1
        const tokenId = '1'

        describe("-Success", () => {
            it('Should list market item of item id 1', async () => {
                await nft.approve(nftMarketplace.address, 1);
                await nftMarketplace.listMarketItem(itemId);
                result = await nftMarketplace.getAllMarketItems()

                expect(result[0].tokenId).to.be.equal(tokenId)
                expect(result[0].nftContract).to.be.equal(nft.address)
                expect(result[0].seller).to.be.equal(accounts[0])
                expect(result[0].owner).to.be.equal(zeroAddress)
                expect(result[0].status).to.be.equal('1')

                result = await nft.ownerOf(1)
                expect(result).to.be.equal(nftMarketplace.address)
            })
        })

        describe('-Faliour', async () => {
            it('Should revert listing while owner is not msg.sender', async () => {
                try{
                    await nftMarketplace.listMarketItem(itemId, {
                        from: accounts[1]
                    });
                }catch(e){
                    expect(revertedWithMsg(e, "OnlyMinter: You are not the minter"))
                            .to.be.equal(true)
                }
            })
        })
    })

    describe('Delist Market Item', async () => {
        const itemId = 1

        describe('-Success', () => {
            it('Should delist item1', async () => {
                await nftMarketplace.delistMarketItem(itemId);
                result = await nftMarketplace.getAllMarketItems()
                expect(result[0].tokenId).to.be.equal('1')
                expect(result[0].itemId).to.be.equal('1')
                expect(result[0].seller).to.be.equal(zeroAddress)
                expect(result[0].owner).to.be.equal(accounts[0])
                expect(result[0].status).to.be.equal('3')

                result = await nft.ownerOf(1);
                expect(result).to.be.equal(accounts[0])
            })
        })

        describe('-Faliour', () => {
            it('Should revert delist while owner is not msg.sender', async () => {
                try{
                    await nftMarketplace.delistMarketItem(itemId, {
                        from: accounts[1]
                    })
                }catch(e){
                    expect(revertedWithMsg(e, "OnlyMinter: You are not the minter"))
                            .to.be.equal(true)
                }
            })

            it('Should revert delist while status is not listed', async () => {
                try{
                    await nftMarketplace.delistMarketItem(itemId)
                }catch(e){
                    expect(revertedWithMsg(e, "StatusListed: Current Status is not Listed"))
                            .to.be.equal(true)
                }
            })
        })
    })

    describe('Relisting Market Item', () => {
        const itemId = 1
        const tokenId = 1

        describe('-Success', () => {
            it('Should relist token 1 & item 1', async () => {
                await nft.approve(nftMarketplace.address, tokenId)
                await nftMarketplace.listMarketItem(itemId)
                result = await nftMarketplace.getAllMarketItems()

                expect(result[0].tokenId).to.be.equal('1')
                expect(result[0].itemId).to.be.equal('1')
                expect(result[0].seller).to.be.equal(accounts[0])
                expect(result[0].owner).to.be.equal(zeroAddress)
                expect(result[0].status).to.be.equal('1')

                result = await nft.ownerOf(1)
                expect(result).to.be.equal(nftMarketplace.address)
            })

            it('Should list token 2 & item 2', async () => {
                await nft.approve(nftMarketplace.address, tokenId + 1, {
                    from: accounts[1]
                })
                await nftMarketplace.listMarketItem(itemId + 1, {
                    from: accounts[1]
                })
                result = await nftMarketplace.getAllMarketItems()

                expect(result[1].tokenId).to.be.equal('2')
                expect(result[1].itemId).to.be.equal('2')
                expect(result[1].seller).to.be.equal(accounts[1])
                expect(result[1].owner).to.be.equal(zeroAddress)
                expect(result[1].status).to.be.equal('1')

                result = await nft.ownerOf(1)
                expect(result).to.be.equal(nftMarketplace.address)
            })
        })
    })

    describe('Buying listed NFTs', () => {
        const itemId = 1
        const buyValue = ethers.utils.parseEther('1.5').toString()

        describe('-Success', () => {
            it('Should bought by the new owner', async () => {
                await nftMarketplace.buyMarketItem(itemId, {
                    from: accounts[3],
                    value: buyValue
                });

                result = await nft.ownerOf(1)
                expect(result).to.be.equal(accounts[3])

                result = await nftMarketplace.getAllMarketItems()
                expect(result[0].owner).to.be.equal(accounts[3]);
                expect(result[0].seller).to.be.equal(zeroAddress);
                expect(result[0].status).to.be.equal('0');
                
            })
        })

        describe('-Faliour', () => {
            it('Should revert buying while seller is msg.sender', async () => {
                try{
                    await nftMarketplace.buyMarketItem(itemId + 1, {
                        from: accounts[1],
                        value: buyValue
                    })
                }catch(e){
                    expect(revertedWithMsg(e, "BuyerisNotSeller: You are the seller"))
                            .to.be.equal(true)
                }
            })

            it('Should revert buying while buy amount is no correct', async () => {
                try{
                    await nftMarketplace.buyMarketItem(itemId + 1, {
                        from: accounts[5],
                        value: 0
                    })
                }catch(e){
                    expect(revertedWithMsg(e, "BuyAmountSent: Please sent the correct NFT price"))
                            .to.be.equal(true)
                }
            })
        })
    })

    describe('Relist by Buyer', () => {
        const itemId = 1
        const tokenId = 1

        describe('-Success', () => {
            it('Should relist the token 1 after buying from buyer', async () => {
                await nft.approve(nftMarketplace.address, tokenId, {
                    from: accounts[3]
                })
                await nftMarketplace.listMarketItem(itemId, {
                    from: accounts[3]
                })

                result = await nftMarketplace.getAllMarketItems()
                expect(result[0].itemId).to.be.equal('1')
                expect(result[0].tokenId).to.be.equal('1')
                expect(result[0].seller).to.be.equal(accounts[3])
                expect(result[0].owner).to.be.equal(zeroAddress)
                expect(result[0].status).to.be.equal('1')
            })
        })
    })
})