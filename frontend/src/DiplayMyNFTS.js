import React from "react";
import { Panel } from "rsuite";
import Carousel from "react-grid-carousel";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { getTokenUri, weiToEther, buyNft, fetchMyNFTs } from "./Web3Client";

const APIURL =
  "https://api.thegraph.com/subgraphs/name/arozovyk/nftmarketplace";

const tokensQuery = `
  query {
    users {
      id
      tokens {
        id
        contentURI
      }
    }
  }
`;
const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});
export class DiplayMyNFTS extends React.Component {
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
    this.itemsSetUp().then(() => {
      let items = this.state.marketItems.map((nft) => {
        let i = {
          src: nft.image,
          thumbnail: nft.image,
          thumbnailWidth: 320,
          thumbnailHeight: 212,
          caption: "<p>" + nft.name + "</p><p>" + nft.description + "</p>",
        };
        return i;
      });
      this.setState({ marketGalery: items });
    });
    client
      .query({
        query: gql(tokensQuery),
      })
      .then((data) => console.log("Subgraph data: ", data))
      .catch((err) => {
        console.log("Error fetching data: ", err);
      });
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
    let data = await fetchMyNFTs();
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
    console.log("price in submit" + price);
    buyNft(id, price);
    event.preventDefault();
  }

  render() {
    return (
      <Panel header="My NFTs:" bordered>
        <div>
          {this.state.marketItems != null ? (
            <Carousel cols={4} rows={1} gap={0} loop>
              {this.state.marketItems.map((nft, i) => (
                <Carousel.Item key={i}>
                  <img src={nft.image} width="50%" alt="" />
                  <p>Name : {nft.name}</p>
                  <p>Description : {nft.description}</p>
                  <p>tokenId : {nft.tokenId}</p>
                  <p>Price : {nft.price} AVAX</p>
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


        <Carousel cols={2} rows={1} gap={10} loop>
            <Carousel.Item>
              <img width="100%" src="https://picsum.photos/800/600?random=1" />
            </Carousel.Item>
            <Carousel.Item>
              <img width="100%" src="https://picsum.photos/800/600?random=2" />
            </Carousel.Item>
            <Carousel.Item>
              <img width="100%" src="https://picsum.photos/800/600?random=3" />
              <p>Lol</p>
            </Carousel.Item>
           
          </Carousel>


        */
