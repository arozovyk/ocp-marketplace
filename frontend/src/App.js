import React from "react";

import { DisplayOneNFT } from "./DiplayOneNFT";
import { MintOneNFT } from "./MintOneNFT";
import { CreateMarketplaceItem } from "./CreateMarketplaceItem";
import { DisplayMarketItems } from "./DisplayMarketItems";
import { DiplayMyNFTS } from "./DiplayMyNFTS";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { getSelectedAccount } from "./Web3Client";
import "rsuite/dist/rsuite.min.css";

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

//import { render } from "react-dom";
//import { AgGridColumn, AgGridReact } from "ag-grid-react";

const styles = {
  padding: 20,
  textAlign: "left",
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.fetchNftGraph = this.fetchNftGraph.bind(this);
    this.handleMarketNftsChange = this.handleMarketNftsChange.bind(this);
    this.state = { myNfts: null, marketNFTs: null };
  }

  fetchNftGraph = async () => {
    let data2 = await client.query({
      query: gql(tokensQuery),
    });
    let selectedAddr = await getSelectedAccount();
    var acc = data2.data.users.filter((user) => {
      return user.id === selectedAddr;
    })[0];
    let userTokens = acc !== undefined ? acc.tokens : [];

    const items = await Promise.all(
      userTokens.map(async (i) => {
        const tokenUri = i.contentURI;
        const meta = await this.getJsonAsync(tokenUri);
        let item = {
          tokenId: i.id,
          owner: selectedAddr,
          image: meta.image,
          name: meta.name,
          description: meta.description,
        };
        return item;
      })
    );
      console.log("this is items", items)
    this.setState({ myNfts: items });
    return;
  };

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

  handleMarketNftsChange(marketNFTs) {
    this.setState({ marketNFTs });
  }
 

  componentDidMount() {
    this.interval = setInterval(() => this.fetchNftGraph(), 5000);
  }
  
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div className="App">
        <div style={styles}>
          <DiplayMyNFTS myNfts={this.state.myNfts} />
          <MintOneNFT />
          <DisplayOneNFT />
          <CreateMarketplaceItem
            onMarketNftsChange={this.handleMarketNftsChange}
          />
          <DisplayMarketItems
            onMarketNftsChange={this.handleMarketNftsChange}
            marketNFTs={this.state.marketNFTs}
          />
        </div>
      </div>
    );
  }
}

export default App;
