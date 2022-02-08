import React from "react";
import { Panel } from "rsuite";
import Carousel from "react-grid-carousel";
import { createMarketItem } from "../Web3Client";



export class DisplayMyNFTS extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenOwner: null,
      marketItems: null,
    };
  }
 

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
    createMarketItem(id, price);
    event.preventDefault();
  }

  render() {
    return (
      <Panel header="My NFTs:" bordered>
        <div>
          {this.props.myNfts != null ? (
            <Carousel cols={4} rows={1} gap={0} loop>
              {this.props.myNfts.map((nft, i) => (
                <Carousel.Item key={i}>
                  <img src={nft.image} width="50%" alt="" />
                  <p>Name : {nft.name}</p>
                  <p>Description : {nft.description}</p>
                  <p>tokenId : {nft.tokenId}</p>
                  <form onSubmit={this.handleSubmit}>
                    <input type="hidden" name="tokenID" value={nft.tokenId} />
                    <input
                      type="number"
                      step="0.1"
                      name="price"
                      value={nft.price}
                    />
                    <input type="submit" value="Sell" />
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

