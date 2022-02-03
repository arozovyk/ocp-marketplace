import React from "react";

import { DisplayOneNFT } from "./DiplayOneNFT";
import { MintOneNFT } from "./MintOneNFT";

import "rsuite/dist/rsuite.min.css";

//import { render } from "react-dom";
//import { AgGridColumn, AgGridReact } from "ag-grid-react";

const styles = {
  padding: 20,
  textAlign: "left",
};

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <div style={styles}>
          <MintOneNFT />
          <DisplayOneNFT />
        </div>
      </div>
    );
  }
}

export default App;
