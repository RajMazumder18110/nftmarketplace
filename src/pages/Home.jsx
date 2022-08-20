import { Card, CardBody, CardSubtitle, CardTitle, Col, Container, Row } from "reactstrap";
import { Link } from 'react-router-dom'

import NFTImg from '../assets/images/nft3.jpg'

const Home = () => {
    return (
        <Container className="home-container d-flex">
            <Row xs='1' md='2'>
                <Col>
                    <h1 className="heading dyna-font">Discover, collect, and sell extraordinary NFTs</h1>
                    <p className="paragraph pt-3 dyna-font text-muted">NFTMarket is the worlds first and <br /> largest NFT marketplace</p>
                    <Link to="/explore" className="btn px-5 mt-3 py-2 btn-custom" >Explore</Link>
                    <Link to="/myassets" className="btn ms-3 mt-3 px-5 py-2 btn-custom" >Mint</Link>
                </Col>
                <Col className="mt-5 text-center d-flex" style={{
                    justifyContent: 'center', alignItems: 'center'
                }}>
                    <Card style={{
                        width: '30rem', border: '2px solid', borderRadius: '15px'
                        }} color='dark' inverse className="home-card">

                        <img src={NFTImg} alt="NFT" style={{
                            borderTopLeftRadius: '15px',
                            borderTopRightRadius: '15px'
                            }}/>
                        <CardBody>
                            <CardTitle tag="h4" className="dyna-font">SuperNFT #3627</CardTitle>
                            <CardSubtitle className="mb-2 text-muted dyna-font" tag="p">An Awesome Landscape</CardSubtitle>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default Home;