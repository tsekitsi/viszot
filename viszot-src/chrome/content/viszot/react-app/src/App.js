import React, { useState, useEffect } from "react";
import ForceGraph2D from "react-force-graph-2d";
import axios from "axios";
import './App.css';

//const Zotero = Components.classes["@zotero.org/Zotero;1"]
//                .getService(Components.interfaces.nsISupports)
//                .wrappedJSObject;

const App = () => {  // https://youtu.be/A5KaLpqzRi4
  const [graphData, setGraphData] = useState();

  const renderGraph = () => {
    let nodesArr = [];
    let linksArr = [];
    const seedDOI = "10.1371/journal.ppat.1003608";
    axios
      .get("https://opencitations.net/index/coci/api/v1/references/"+seedDOI)
      .then(res => {
        console.log(res);
        for (const dataObj of res.data) {
          nodesArr.push({id: dataObj.cited});
          linksArr.push({source: dataObj.citing, target: dataObj.cited, value:1});
        }
        nodesArr.push({id: seedDOI});  // add root node
        setGraphData({
          nodes: nodesArr,
          links: linksArr
        });
      })
      .catch(err => {
        console.log(err);
      });
    console.log(nodesArr, linksArr);
  };

  useEffect(() => {
    renderGraph()
  }, [])

  return(
    <div className="App">
      <div> Graph: </div>
      <div>
        {
          graphData ?  // https://stackoverflow.com/a/63281723
          (
            <ForceGraph2D
              graphData={graphData}
              nodeLabel="id"
              linkCurvature="curvature"
              enablePointerInteraction={true}
              linkDirectionalParticleWidth={1}
            />
          ) : <div />
        }
      </div>
    </div>
  )
}

export default App;
