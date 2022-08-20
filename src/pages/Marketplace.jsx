import { Container, Row, Col } from "reactstrap";
import NFTCard from "../components/NFTCard";

import { nftDataMarketplace } from '../assets/data'

const Marketplace = () => {
    return (
        <Container>
            <h2 className="mt-5">Explore NFTs</h2>
            <Row xs='1' sm='1' md='2' lg='3' xl='3' xxl='4' style={{ cursor: 'pointer' }}>
                {nftDataMarketplace.map((nftData, key) => (
                    <Col className="mt-4" key={key}>
                        <NFTCard nftData={nftData} />
                    </Col>
                ))}
            </Row>
        </Container>
    )
}

export default Marketplace;