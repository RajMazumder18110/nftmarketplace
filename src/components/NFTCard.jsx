import { Card, CardBody, CardSubtitle, CardText, CardTitle, Button } from "reactstrap";

import NFTImg1 from '../assets/nft1.jpg'
import NFTImg2 from '../assets/nft2.jpg'
import NFTImg3 from '../assets/nft3.jpg'
const images = [NFTImg1, NFTImg2, NFTImg3]

const NFTCard = () => {
    const random = Math.floor(Math.random() * 2)
    return (
        <Card style={{
            width: '18rem',
            border: '1px solid #fff'
            }} color='dark' inverse>
            <img src={images[random + 1]}  alt="nft" style={{
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px'
            }}/>
            <CardBody className="text-center">
                <CardTitle tag='h5'>Supernft #42442</CardTitle>
                <CardSubtitle tag='p' className="text-muted">Dog on ETH</CardSubtitle>
                <CardText tag='h5'><i className="fa-brands fa-ethereum me-1 mt-3"></i> 0.2 ETH</CardText>
                <Button className="ms-3 mt-3 px-5 py-2 btn-custom">Buy</Button>
            </CardBody>
        </Card>
    )
}

export default NFTCard;