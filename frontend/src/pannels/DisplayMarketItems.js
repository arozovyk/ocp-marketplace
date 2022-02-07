import React from "react";
import { Panel } from "rsuite";
import Carousel from "react-grid-carousel";
import {getJsonAsync} from "../utils"
import {
  getTokenUri,
  fetchMarketItems,
  weiToEther,
  buyNft,
} from "../Web3Client";

export class DisplayMarketItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenId: null,
      tokenMetadata: null,
      tokenUri: null,
      tokenOwner: null,
      marketItems: null,
      marketGalery: null,
    };
  }

  componentDidMount() {
    this.itemsSetUp().then(() => {});
  }

  

  itemsSetUp = async () => {
    let data = await fetchMarketItems();
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await getTokenUri(i.tokenId);
        const meta = await getJsonAsync(tokenUri);
        let price = await weiToEther(i.price.toString());
        let item = {
          price,
          tokenId: i.tokenId,
          itemId: i.itemId,
          seller: i.seller,
          owner: i.owner,
          image: meta.image,
          name: meta.name,
          description: meta.description,
        };
        return item;
      })
    );
    this.setState({ marketItems: items });
  };

  handleInputChange = (event) => {
    //TODO export it from upstream to remove code duplication
    const target = event.target;
    const value = target.type === "file" ? target.files[0] : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit(event) {
    let id = event.target[0].value;
    let price = event.target[1].value;
    buyNft(id, price);
    event.preventDefault();
  }

  render() {
    return (
      <Panel header="NFTs on sale:" bordered>
        <div>
          {this.state.marketItems != null ? (
            <Carousel cols={4} rows={1} gap={0} loop>
              {this.state.marketItems.map((nft, i) => (
                <Carousel.Item key={i}>
                  <img src={nft.image} width="50%" alt="" />
                  <p>Name : {nft.name}</p>
                  <p>Description : {nft.description}</p>
                  <p>tokenId : {nft.tokenId}</p>
                  <p>itemId : {nft.itemId}</p>
                  <p>Price : {nft.price} AVAX</p>
                  <form onSubmit={this.handleSubmit}>
                    <input type="hidden" name="itemId" value={nft.itemId} />
                    <input type="hidden"  name="price" value={nft.price}  />
                    <input type="submit" value="Buy" />
                  </form>
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            ""
          )}
        </div>
      </Panel>
    );
  }
}
