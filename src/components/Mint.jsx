import { useState, useContext } from "react";
import { Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { MarketPlaceContext } from "../contexts";
import NFTCard from "./NFTCard";

const Mint = () => {
    const { account } = useContext(MarketPlaceContext)
    const [nftData, setNftdata] = useState({
        title: '',
        desc: '',
        price: '',
        image: '',
        file: ''
    })
    const onUploadFile = (e) => {
        const reader = new FileReader()
        const img = e.target.files[0];
        
        if(img){
            reader.onload = () => {
                if(reader.readyState === 2){
                    setNftdata({
                        ...nftData,
                        file: img,
                        image: reader.result
                    })
                }
            }
            reader.readAsDataURL(img)
        }
    }

    const inputChange = (e) => {
        setNftdata({
            ...nftData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <Row xs='1' sm='1' md='1' lg='2' style={{
            height: '75vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Col className="mb-5">
                <h2 className="mb-4">Preview</h2>
                <NFTCard mint nftData={nftData}/>
            </Col>
            <Col>
                <Form>
                    <FormGroup>
                        <Label for="nftHeading">Title</Label>
                        <Input
                            id="nftHeading"
                            name="title"
                            placeholder="Super nft #123"
                            type="text"
                            onChange={(e) => inputChange(e)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for='nftDesc'>Description</Label>
                        <Input 
                            id='nftDesc'
                            name='desc'
                            placeholder="Description"
                            type="textarea"
                            onChange={(e) => inputChange(e)}
                        />
                    </FormGroup>
                    <Row xs={2}>
                        <Col>
                            <FormGroup>
                                <Label for="nftPrice">Price (ETH)</Label>
                                <Input 
                                    id='nftPrice'
                                    name="price"
                                    placeholder="1.0"
                                    type="number"
                                    onChange={(e) => inputChange(e)}
                                />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label for='nftFile'>NFT File</Label>
                                <Input 
                                    id="nftFile"
                                    name="file"
                                    placeholder="NFT File"
                                    type="file"
                                    onChange={(e) => onUploadFile(e)}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <FormGroup className="mt-3">
                        <Label className="text-muted">On <i className="fa-brands fa-ethereum mx-2 mt-1"></i> Chain</Label> <br />
                        <Label className="text-muted">Minter : {account}</Label> <br />
                        <Label>Minting fee : <i className="fa-brands fa-ethereum mx-1"></i> 0.02 ETH</Label>
                    </FormGroup>
                </Form>
            </Col>
        </Row>
    )
}
export default Mint;