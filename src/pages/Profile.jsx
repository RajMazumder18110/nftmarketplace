import { useContext } from 'react';
import { Container, Row, Col } from "reactstrap";
import Mint from '../components/Mint';
import NFTCard from "../components/NFTCard";
import { MarketPlaceContext } from '../contexts';
import { nftDataListed, nftDataOwned } from '../assets/data'


const Profile = () => {
    const { walletConnected, myAssetActive, setMyAssetActive } = useContext(MarketPlaceContext)

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