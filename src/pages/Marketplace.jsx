import { Container, Row, Col } from "reactstrap";
import NFTCard from "../components/NFTCard";

const Marketplace = () => {
    return (
        <Container>
            <h2 className="mt-5">Explore NFTs</h2>
            <Row xs='1' sm='1' md='2' lg='3' xl='3' xxl='4'>
                <Col className="mt-4">
                    <NFTCard/>
                </Col>
                <Col className="mt-4">
                    <NFTCard/>
                </Col>
                <Col className="mt-4">
                    <NFTCard/>
                </Col>
                <Col className="mt-4">
                    <NFTCard/>
                </Col>
                <Col className="mt-4">
                    <NFTCard/>
                </Col>
                <Col className="mt-4">
                    <NFTCard/>
                </Col>
                <Col className="mt-4">
                    <NFTCard/>
                </Col>
                <Col className="mt-4">
                    <NFTCard/>
                </Col>
                <Col className="mt-4">
                    <NFTCard/>
                </Col>
                <Col className="mt-4">
                    <NFTCard/>
                </Col>
            </Row>
        </Container>
    )
}

export default Marketplace;