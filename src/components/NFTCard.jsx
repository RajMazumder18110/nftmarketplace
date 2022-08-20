import { useNavigate } from 'react-router-dom'
import { Card, CardBody, CardSubtitle, CardText, CardTitle, Button } from "reactstrap";

const NFTCard = ({ inAssets, active, mint, nftData }) => {
    const navigate = useNavigate()
    const mintNft = () => {
        console.log(nftData)
        alert(`minted ${nftData.title}`)
    }

    const buyNft = () => {
        alert('nft bought')
        navigate('/myassets')
    }

    const listNft = () => {
        alert('nft listed')
    }

    const delistNft = () => {
        alert('nft delisted')
    }

return (
        <Card style={{
            width: mint ? '23rem' : '18rem',
            // border: '1px solid #fff'
            }} color='dark' inverse>
            <img src={nftData ? nftData.image : null}  alt="nft image" style={{
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px'
            }}/>
            <CardBody className="text-center">
                <CardTitle tag='h5'>{nftData.title}</CardTitle>
                <CardSubtitle tag='p' className="text-muted">{nftData.desc}</CardSubtitle>
                <CardText tag='h5'><i className="fa-brands fa-ethereum me-1 mt-3"></i> {nftData.price} ETH</CardText>
                { inAssets && active === 'owned' ?
                    <Button className="ms-3 mt-3 px-5 py-2 btn-custom"
                        onClick={listNft}
                        >List</Button>
                  : inAssets && active === 'listed' ?
                   <Button className="ms-3 mt-3 px-5 py-2 btn-custom"
                    onClick={delistNft}
                    >Delist</Button>
                  : mint ? <Button className="ms-3 mt-3 px-5 py-2 btn-custom"
                             onClick={mintNft}
                            >Mint</Button>
                  : <Button className="ms-3 mt-3 px-5 py-2 btn-custom"
                    onClick={buyNft}
                    >Buy</Button>
                }
            </CardBody>
        </Card>
    )
}

export default NFTCard;