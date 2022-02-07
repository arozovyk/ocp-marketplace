import React from "react";
import { DisplayOneNFT } from "./pannels/DisplayOneNFT";
import { MintOneNFT } from "./pannels/MintOneNFT";
import { CreateMarketplaceItem } from "./pannels/CreateMarketplaceItem";
import { DisplayMarketItems } from "./pannels/DisplayMarketItems";
import { DisplayMyNFTS } from "./pannels/DisplayMyNFTS";
 import "rsuite/dist/rsuite.min.css";
import { fetchNFTgraph } from "./thegraph";

const styles = {
  padding: 20,
  textAlign: "left",
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleMarketNftsChange = this.handleMarketNftsChange.bind(this);
    this.state = { myNfts: null, marketNFTs: null };
  }

 
  handleMarketNftsChange(marketNFTs) {
    this.setState({ marketNFTs });
  }

  componentDidMount() {
    fetchNFTgraph().then((myNFTS) => this.setState({ myNFTS }));
  }

  render() {
    return (
      <div className="App">
        <div style={styles}>
          <DisplayMyNFTS myNfts={this.state.myNfts} />
          <DisplayMarketItems
            onMarketNftsChange={this.handleMarketNftsChange}
            marketNFTs={this.state.marketNFTs}
          />
          <MintOneNFT />
          <CreateMarketplaceItem
            onMarketNftsChange={this.handleMarketNftsChange}
          />
          <DisplayOneNFT />
        </div>
      </div>
    );
  }
}

export default App;
