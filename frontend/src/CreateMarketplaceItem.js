import React from "react";
import { Panel } from "rsuite";
import { Button } from "rsuite";
import { create } from "ipfs-http-client";

import {
  mint,
  init,
  getSelectedAccount,
  getSelectedAccountsNftBalance,
  createMarketItem,
} from "./Web3Client";

const ipfs = create("http://ipfs.infura.io:5001");

export class CreateMarketplaceItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nft_name: null,
      nft_asset: null,
      nft_description: null,
      price: 0,
      selectedAccount: null,
      uploadedFile: null,
      ipfs_path: null,
      selectedAccountsNftBalance: 0,
    };
  }
  updateNftBalance = () => {
    getSelectedAccountsNftBalance().then((balance) => {
      this.setState({ selectedAccountsNftBalance: parseInt(balance) });
    });
  };
  componentDidMount() {
    init()
      .then(() => {
        getSelectedAccount()
          .then((acc) => {
            this.setState({ selectedAccount: acc });
          })
          .then(() => this.updateNftBalance());
      })
      .catch(() => console.log("Failed to initialize."));
  }

  changeHandler = (event) => {
    this.setState({ uploadedFile: event.target.files[0] });
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "file" ? target.files[0] : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  };

  createItem = (event) => {
    ipfs.add(this.state.nft_asset).then((asset_res) => {
      var json = {
        name: this.state.nft_name,
        description: this.state.nft_description,
        image: "https://ipfs.io/ipfs/" + asset_res.path,
      };
      ipfs.add(JSON.stringify(json)).then((metadata_res) => {
        this.setState({ ipfs_path: metadata_res.path });
        mint(metadata_res.path).then((res) => {
          let newID = res.events.Transfer.returnValues[2];
          console.log("Minted an nft with id : " + newID);
          createMarketItem(newID,  this.state.price);
          console.log("Created market for : " + newID + " costing : " + this.state.price);

          this.updateNftBalance();
        });
      });
    });

    event.preventDefault();
  };

  render() {
    return (
      <Panel header="Create marketplace item" bordered>
        <p>Current connected account :{this.state.selectedAccount} </p>

        <div>
          <form onSubmit={this.createItem}>
            <p>
              <label>Name:</label>
              <input
                type="text"
                required
                name="nft_name"
                onChange={this.handleInputChange}
              />
            </p>
            <p>
              <label>
                Description:
                <input
                  type="text"
                  required
                  name="nft_description"
                  onChange={this.handleInputChange}
                />
              </label>
            </p>
            <p>
              <label>
                Price:
                <input
                  type="number"
                  required
                  step="0.000001"
                  name="price"
                  onChange={this.handleInputChange}
                />
              </label>
            </p>
            <p>
              <label>
                File to mint:
                <input
                  type="file"
                  required
                  name="nft_asset"
                  onChange={this.handleInputChange}
                />
              </label>
            </p>

            <div>
              <Button
                color="violet"
                appearance="primary"
                type="submit"
                value="Mint NFT"
              >
                Create Market
              </Button>
            </div>
          </form>
        </div>
      </Panel>
    );
  }
}
