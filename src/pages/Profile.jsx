import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col } from "reactstrap";
import Mint from '../components/Mint';
import NFTCard from "../components/NFTCard";
import { MarketPlaceContext } from '../contexts';
import { ethers } from 'ethers';


const Profile = () => {
    const { walletConnected, myAssetActive, setMyAssetActive, nftMarketplace, account, nft } = useContext(MarketPlaceContext)
    const [nftDataOwned, setNftDataOwned] = useState([]);
    const [nftDataListed, setNftDataListed] = useState([]);

    const getData = async (item) => {
        const tokenURI = await nft.tokenURI(item.tokenId);
        const metadata = (await axios.get(tokenURI)).data;
        const img = (await axios.get(metadata.image)).data;

        return {
            title: metadata.title,
            desc: metadata.desc,
            price: ethers.utils.formatUnits(item.price.toString()).toString(),
            image: img,
        }
    }

    useEffect(() => {
        const fetch = async () => {
            const items = await nftMarketplace.getAllMarketItems();
            const owned = items.filter(item => item.owner.toLowerCase() === account);
            const listed = items.filter(item => item.seller.toLowerCase() === account);

            const ownedItems = []
            const listedItems = []
            for(let item of owned){
                const data = await getData(item);
                ownedItems.push({
                    ...data,
                    itemId: item.itemId.toString(),
                    tokenId: item.tokenId.toString()
                })
            }
            for(let item of listed){
                const data = await getData(item);
                listedItems.push({
                    ...data,
                    itemId: item.itemId.toString()
                })
            }
            setNftDataOwned(ownedItems);
            setNftDataListed(listedItems)
        }
        walletConnected && fetch()
    }, [walletConnected, myAssetActive, account])

    if(!walletConnected){
        return(
            <Container style={{
                height: '90vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center'
            }}>
                <h1>Please Connect your <br /> Metamask Wallet <br /> <i className="fa-brands fa-ethereum mt-3" style={{fontSize: '5rem'}}></i></h1>
            </Container>
        )
    }

    return (
        <Container>
            <h2 className="mt-5">My Assets</h2>
            <div className="myassets-lists mt-4 d-flex">
                <p className={myAssetActive ==='owned' ? "me-4" : "me-4 text-muted"}
                    onClick={() => setMyAssetActive('owned')}
                    style={{ cursor: 'pointer' }}
                >Owned</p>
                <p className={myAssetActive ==='listed' ? "me-4" : "me-4 text-muted"}
                    onClick={() => setMyAssetActive('listed')}
                    style={{ cursor: 'pointer' }}
                >Listed</p>
                <p className={myAssetActive ==='mint' ? "me-4" : "me-4 text-muted"}
                    onClick={() => setMyAssetActive('mint')}
                    style={{ cursor: 'pointer' }}
                >Mint NFT</p>
            </div>
            {myAssetActive ==='owned' ?
                <Row xs='1' sm='1' md='2' lg='3' xl='3' xxl='4'>
                    {nftDataOwned.map((nftData, key) => (
                        <Col className="mt-4" key={key}>
                            <NFTCard inAssets active={myAssetActive} nftData={nftData}/>
                        </Col>
                    ))}
                </Row> : myAssetActive ==='listed' ?
                <Row xs='1' sm='1' md='2' lg='3' xl='3' xxl='4'>
                    {nftDataListed.map((nftData, key) => (
                        <Col className="mt-4" key={key}>
                            <NFTCard inAssets active={myAssetActive} nftData={nftData}/>
                        </Col>
                    ))}
                </Row> : <Mint />
            }
        </Container>
    )
}

export default Profile;