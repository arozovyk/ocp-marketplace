import React from "react";
import { Panel } from "rsuite";
import { Button } from "rsuite";

import { getTokenUri, getOwnerOf } from "./Web3Client";

export class DisplayOneNFT extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenId: null,
      tokenMetadata: null,
      tokenUri: null,
      tokenOwner: null,
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

  findByTokenId = (event) => {
    getTokenUri(this.state.tokenId).then((res) => {
      this.getJsonAsync(res).then((jm) =>
        this.setState({
          tokenMetadata: JSON.stringify(jm),
          tokenUri: jm.image,
        })
      );
    });
    getOwnerOf(this.state.tokenId).then((res) => {
      this.setState({
        tokenOwner: res,
      });
    });
    event.preventDefault();
  };

  render() {
    return (
      <Panel header="Display NFT by TokenId" bordered>
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
      </Panel>
    );
  }
}
