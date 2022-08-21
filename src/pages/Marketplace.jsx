import { Container, Row, Col } from "reactstrap";
import NFTCard from "../components/NFTCard";
import { MarketPlaceContext } from '../contexts'
import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";

const Marketplace = () => {
    const [nftDataMarketplace, setNftDataMarketplace] = useState([])
    const { nft, nftMarketplace, walletConnected } = useContext(MarketPlaceContext)

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
            const listed = items.filter(item => item.status.toString() === '1');

            const listedItems = []
            for(let item of listed){
                const data = await getData(item);
                listedItems.push({
                    ...data,
                    itemId: item.itemId.toString(),
                    seller: item.seller.replace(item.seller.substring(6,36), '-xxx-')
                })
            }
            setNftDataMarketplace(listedItems)
        }
        walletConnected && fetch()
    },[walletConnected])
    return (
        <Container>
            <h2 className="mt-5">Explore NFTs</h2>
            <Row xs='1' sm='1' md='2' lg='3' xl='3' xxl='4' style={{ cursor: 'pointer' }}>
                {nftDataMarketplace.map((nftData, key) => (
                    <Col className="mt-4" key={key}>
                        <NFTCard nftData={nftData} marketplace/>
                    </Col>
                ))}
            </Row>
        </Container>
    )
}

export default Marketplace;