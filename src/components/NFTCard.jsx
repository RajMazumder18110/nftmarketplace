import { useNavigate } from 'react-router-dom'
import { Card, CardBody, CardSubtitle, CardText, CardTitle, Button } from "reactstrap";
import { MarketPlaceContext } from '../contexts'
import { useContext, useState } from "react";
import { create as IPFS } from 'ipfs-http-client'
import { Buffer } from 'buffer'
import { ethers } from 'ethers';

const NFTCard = ({ inAssets, active, mint, nftData, marketplace }) => {
    const [progress, setProgress] = useState(false);
    const ipfs = IPFS({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        headers: {
            authorization: `Basic ` + Buffer.from(
                `${process.env.REACT_APP_IPFS_PROJECT_KEY}:${process.env.REACT_APP_IPFS_API_KEY}`
            ).toString('base64')
        }
    })
    const { account, setMyAssetActive, nft, nftMarketplace, setMinting, setMintingTitle, setMintingProgress } = useContext(MarketPlaceContext);
    const navigate = useNavigate()

    const mintNft = async () => {
        if(!checkMintForm()){
            alert("Please fill the form correctly")
            return
        }
        try{
            setMinting(false);
            setMintingTitle("Uploding file to IPFS")

            const { filecid, status } = await uploadImage(nftData.image);
            if(status){
                setMintingTitle("Uploading Metadata to IPFS")
                const { metadatacid, status } = await uploadMetadata(JSON.stringify({
                    title: nftData.title,
                    desc: nftData.desc,
                    image: `${process.env.REACT_APP_IPFS_LINK}${filecid}`,
                }));

                if(status){
                    setMintingTitle("Minting Token")
                    setMintingProgress('Accepting transaction ...')
                    const tokenURI = `${process.env.REACT_APP_IPFS_LINK}${metadatacid}`
                    const fee = ethers.utils.parseEther('0.025')
                
                    let tx = await nft.mintToken(tokenURI);
                    setMintingProgress('Transaction Accepted...')
                    let result = await tx.wait();
                    const tokenId = result.events[0].args.tokenId.toString()

                    setMintingTitle("Creating Market item")

                    setMintingProgress('Accepting transaction ...')
                    
                    const price = ethers.utils.parseEther(nftData.price).toString();
                    tx = await nftMarketplace.createMarketItem(
                        nft.address, tokenId, price, {
                            value: fee
                        }
                    )
                    setMintingProgress('Transaction Accepted...')
                    
                    result = await tx.wait();

                    setMintingTitle('')
                    setMintingProgress('')
                    setMyAssetActive('owned')
                    setMinting(true);
                }
            }
        }catch(e){
            setMinting(true)
            alert("Error occured while uploading file")
        }
    }

    const uploadImage = async (file) => {
        try{
            const { cid } = await ipfs.add(file, {
                progress: (prog) => setMintingProgress(`Done ${prog} KB`)
            });
            return {
                filecid: cid,
                status: true
            }
        }catch(e){
            return {
                filecid: '',
                status: false
            }
        }
    }

    const uploadMetadata = async (metadata) => {
        try{
            const { cid } = await ipfs.add(metadata, {
                progress: (prog) => setMintingProgress(`Done ${prog/1024} MB`)
            });
            return {
                metadatacid: cid,
                status: true
            }
        }catch(e){
            return {
                metadatacid: '',
                status: true
            }
        }
    }

    const checkMintForm = () => {
        if(
            nftData.title.length >= 5 &&
            nftData.desc.length >= 5 &&
            Number(nftData.price) > 0 &&
            nftData.image.length >= 20
            ){
            return true
        }
        return false;
    }

    const buyNft = async (itemId) => {
        try{
            setProgress(true)
            const price = ethers.utils.parseEther(nftData.price)
            const tx = await nftMarketplace.buyMarketItem(itemId, {
                value: price
            })
            await tx.wait();

            setProgress(false)
            navigate('/nftmarketplace/myassets')
        }catch(e){
            setProgress(false)
            alert("Error occured during buying")
        }
    }

    const listNft = async (itemId, tokenId) => {
        try{
            setProgress(true)
            let tx = await nft.approve(nftMarketplace.address, tokenId)
            await tx.wait();

            tx = await nftMarketplace.listMarketItem(itemId);
            await tx.wait();

            setProgress(false);
            setMyAssetActive('listed')
        }catch(e){
            setProgress(false)
            alert('Error occured while listing')
        }
    }

    const delistNft = async (itemId) => {
        try{
            setProgress(true)
            const tx = await nftMarketplace.delistMarketItem(itemId);
            await tx.wait()

            setMyAssetActive('owned');
            setProgress(false);
        }catch(e){
            setProgress(false)
            alert('Error occured while delising')
        }
    }

return (
        <Card style={{
            width: mint ? '23rem' : '18rem',
            border: '1px solid #555'
            }} color='dark' inverse>
            <img src={nftData ? nftData.image : null}  alt="nft pic" style={{
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px'
            }}/>
            <CardBody className="text-center">
                <CardTitle tag='h5'>{nftData.title}</CardTitle>
                <CardSubtitle tag='p' className="text-muted">{nftData.desc}</CardSubtitle>
                <CardSubtitle tag='p' className="text-muted mt-2">
                    {nftData.owner ? `Owner : ${nftData.owner}`: `Seller : ${nftData.seller}`}
                </CardSubtitle>
                <CardText tag='h5'><i className="fa-brands fa-ethereum me-1 mt-3"></i> {nftData.price} ETH</CardText>
                { inAssets && active === 'owned' ?
                    <Button className="ms-3 mt-3 px-5 py-2 btn-custom" disabled={progress}
                        onClick={() => listNft(nftData.itemId, nftData.tokenId)}
                        >List</Button>
                  : inAssets && active === 'listed' ?
                   <Button className="ms-3 mt-3 px-5 py-2 btn-custom" disabled={progress}
                    onClick={() => delistNft(nftData.itemId)}
                    >Delist</Button>
                  : mint ?
                    <Button className="ms-3 mt-3 px-5 py-2 btn-custom"
                        onClick={mintNft}
                    >Mint</Button>
                  : marketplace && account.replace(account.substring(6,36), '-xxx-') !== nftData.seller.toLowerCase() ?
                    <Button className="ms-3 mt-3 px-5 py-2 btn-custom" disabled={progress}
                        onClick={() => buyNft(nftData.itemId)}
                     >Buy</Button>
                  : null
                }
            </CardBody>
        </Card>
    )
}

export default NFTCard;