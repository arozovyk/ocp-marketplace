import React from "react";
import { getSelectedAccount, getColTokenUri } from "./Web3Client";
import { getJsonAsync } from "./utils";
export class Collections extends React.Component {
  constructor(props) {
    super(props);
    this.state = { collections: null };
  }
  componentDidMount() {
    this.loadCollections();
  }

  loadCollections = () => {
    getSelectedAccount().then((currentAddr) => {
      const collections = new Map();
      console.log("selected addr", currentAddr);
      fetch(
        `https://api-testnet.snowtrace.io/api?module=account&action=tokennfttx&address=${currentAddr}&sort=asc`
      )
        .then((response) => response.json())
        .then((data) => {
          data.result.forEach((tx) => {
            const from = tx.from;
            const to = tx.to;
            const tokenID = tx.tokenID;
            const contractAddress = tx.contractAddress;
            if (!collections.has(contractAddress)) {
              collections.set(contractAddress, new Set());
            }
            if (currentAddr === to) {
              const col = collections.get(contractAddress);
              col.add(tokenID);
              collections.set(contractAddress, col);
            } else {
              if (currentAddr === from) {
                const col = collections.get(contractAddress);
                col.delete(tokenID);
                if (col.size === 0) {
                  collections.delete(contractAddress);
                }
              }
            }
          });
          console.log(collections);
          this.setState({ collections });
        });
    });
  };

  toCaroussel = async () => {
    const collAddr = "0xf1e2b933a54404e3fd13c89189e9dcf6e7476f02";
    let col = Array.from(this.state.collections.get(collAddr));
    let truc = await Promise.all(
      col.map(async (tokenID) => {
        let tokenURI = await getColTokenUri(collAddr, tokenID);
        let meta = await getJsonAsync(tokenURI);
        let selectedAddr = await getSelectedAccount();
        return  {
            tokenId: tokenID,
            owner: selectedAddr,
            image: meta.image,
            name: meta.name,
            description: meta.description,
          };

 
      })
    );
    console.log(truc)
  };

  render() {
    return (
      <div>
        {this.state.collections !== null
          ? Array.from(this.state.collections.keys()).map((collAddr, i) => (
              <div key={i}>
                {" "}
                <p>{collAddr}</p>
                <button onClick={this.toCaroussel}>ssss</button>
                {Array.from(this.state.collections.get(collAddr)).map(
                  (tokenID, i) => (
                    <Collection key={i} collAddr={collAddr} tokenID={tokenID} />
                  )
                )}
              </div>
            ))
          : ""}
      </div>
    );
  }
}

class Collection extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tokenUri: "" };
  }
  componentDidMount() {
    getColTokenUri(this.props.collAddr, this.props.tokenID).then((tokenUri) =>
      this.setState({ tokenUri })
    );
  }
  render() {
    return (
      <div>
        <p>{this.props.tokenID} </p> <p>{this.state.tokenUri}</p>
      </div>
    );
  }
}

export async function toCaroussel() {}
/* toCaroussel = async () => {
    const collAddr = "0xf1e2b933a54404e3fd13c89189e9dcf6e7476f02";
    let col = Array.from(this.state.collections.get(collAddr));
    let truc = col.map((tokenID) => {
      let item;
      getColTokenUri(collAddr, tokenID).then((tokenURI) => {
        getJsonAsync(tokenURI).then((meta) =>
          getSelectedAccount().then((selectedAddr) => {
            item = {
              tokenId: tokenID,
              owner: selectedAddr,
              image: meta.image,
              name: meta.name,
              description: meta.description,
            };
          })
        );
      });
      console.log("items is ", item);

      return item;
    });
    console.log("crrt is ", c);
  };*/
