import React from "react";
import { DisplayOneNFT } from "./pannels/DisplayOneNFT";
import { MintOneNFT } from "./pannels/MintOneNFT";
import { CreateMarketplaceItem } from "./pannels/CreateMarketplaceItem";
import { DisplayMarketItems } from "./pannels/DisplayMarketItems";
import { DisplayMyNFTS } from "./pannels/DisplayMyNFTS";
import { fetchNFTgraph } from "./thegraph";
import "rsuite/dist/rsuite.min.css";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const styles = {
  padding: 20,
  textAlign: "left",
};

const renderTime = ({ remainingTime }) => {
  if (remainingTime === 0) {
    return <div className="timer">Too lale...</div>;
  }

  return (
    <div className="timer">
      <div className="value">{remainingTime}</div>
    </div>
  );
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
    fetchNFTgraph().then((myNfts) => this.setState({ myNfts }));
  }

  render() {
    return (
      <div className="App">
        <div>
          <CountdownCircleTimer
            isPlaying
            size={100}
            duration={3}
            colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
            colorsTime={[10, 6, 3, 0]}
            onComplete={() => {
              fetchNFTgraph().then((myNfts) => this.setState({ myNfts }));
              console.log("fetched this shit ", this.state.myNfts);
              return { shouldRepeat: true, delay: 1 };
            }}
          >
            {renderTime}
          </CountdownCircleTimer>
        </div>
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
