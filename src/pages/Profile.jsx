import { useState } from 'react'
import { Container, Row, Col } from "reactstrap";
import Mint from '../components/Mint';
import NFTCard from "../components/NFTCard";

import { nftDataListed, nftDataOwned } from '../assets/data'

const Profile = () => {
    const [active, setActive] = useState('owned');
    return (
        <Container>
            <h2 className="mt-5">My Assets</h2>
            <div className="myassets-lists mt-4 d-flex">
                <p className={active ==='owned' ? "me-4" : "me-4 text-muted"}
                    onClick={() => setActive('owned')}
                    style={{ cursor: 'pointer' }}
                >Owned</p>
                <p className={active ==='listed' ? "me-4" : "me-4 text-muted"}
                    onClick={() => setActive('listed')}
                    style={{ cursor: 'pointer' }}
                >Listed</p>
                <p className={active ==='mint' ? "me-4" : "me-4 text-muted"}
                    onClick={() => setActive('mint')}
                    style={{ cursor: 'pointer' }}
                >Mint NFT</p>
            </div>
            {active ==='owned' ?
                <Row xs='1' sm='1' md='2' lg='3' xl='3' xxl='4'>
                    {nftDataOwned.map((nftData, key) => (
                        <Col className="mt-4" key={key}>
                            <NFTCard inAssets active={active} nftData={nftData}/>
                        </Col>
                    ))}
                </Row> : active ==='listed' ?
                <Row xs='1' sm='1' md='2' lg='3' xl='3' xxl='4'>
                    {nftDataListed.map((nftData, key) => (
                        <Col className="mt-4" key={key}>
                            <NFTCard inAssets active={active} nftData={nftData}/>
                        </Col>
                    ))}
                </Row> : <Mint />
            }
        </Container>
    )
}

export default Profile;