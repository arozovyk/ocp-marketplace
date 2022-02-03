import React from "react";
import { Panel } from "rsuite";
import Gallery from 'react-grid-gallery';

import { getTokenUri, fetchMarketItems, weiToEther } from "./Web3Client";


const IMAGES =
[{
        src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
        thumbnail: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_n.jpg",
        thumbnailWidth: 320,
        thumbnailHeight: 174,
        isSelected: true,
        caption: "After Rain (Jeshu John - designerspics.com)"
},
{
        src: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",
        thumbnail: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_n.jpg",
        thumbnailWidth: 320,
        thumbnailHeight: 212,
        tags: [{value: "Ocean", title: "Ocean"}, {value: "People", title: "People"}],
        caption: "Boats (Jeshu John - designerspics.com)"
},
 
{
        src: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg",
        thumbnail: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_n.jpg",
        thumbnailWidth: 320,
        thumbnailHeight: 212,
        thumbnailCaption: "test"
}]


export class DisplayMarketItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenId: null,
      tokenMetadata: null,
      tokenUri: null,
      tokenOwner: null,
      marketItems: null,
    };
  }


  componentDidMount(){
    this.itemsSetUp().then();

  }

  getJsonAsync(url) {
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  itemsSetUp = async () => {
     let data = await fetchMarketItems();
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await getTokenUri(i.tokenId);
        const meta = await this.getJsonAsync(tokenUri);
        let price = await weiToEther(i.price.toString());
        let item = {
          price,
          tokenId: i.tokenId,
          seller: i.seller,
          owner: i.owner,
          image: meta.image,
          name: meta.name,
          description: meta.description,
        };
        console.log(item)
        return item;
      })
    );
    this.setState({ marketItems: items });
  };
  componentDidMount() {
    this.itemsSetUp()
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

  render() {
    return (
      <Panel header="NFTs on sale:" bordered>
        <div>
          {this.state.marketItems != null
            ? this.state.marketItems.map((nft, i) => (
                <div key={i}>
                 <img
                src={nft.image}
                width="300px"
                height="300px"
                alt="new"
              />
                  <div>
                    <p>{nft.name}</p>
                    <div>
                      <p>{nft.description}</p>
                    </div>
                  </div>
                  <div>
                    <p>{nft.price} AVAX</p>
                    <button>Buy</button>
                  </div>
                </div>
              ))
            : ""}
        </div>
         
      </Panel>
      
    );
  }
}

/*
<div>
          <form onSubmit={this.findByTokenId}>
            <p>
              <label>
                Token id:
                <input
                  type="text"
                  required
                  name="tokenId"
                  onChange={this.handleInputChange}
                />
              </label>
            </p>
            <Button
              color="red"
              appearance="primary"
              type="submit"
              value="Mint NFT"
            >
              Find
            </Button>
          </form>
        </div>
        {this.state.tokenMetadata == null ? (
          ""
        ) : (
          <div>
            <p style={{ color: "green" }}>
              NFT metadata : {this.state.tokenMetadata}
            </p>
            <p>Owner : {this.state.tokenOwner}</p>
            <p>
              <img
                src={this.state.tokenUri}
                width="300px"
                height="300px"
                alt="new"
              />
            </p>
          </div>
        )}
        */
