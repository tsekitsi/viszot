import React, {useState, useEffect} from 'react'
import ForceGraph2D from "react-force-graph-2d"
import axios from 'axios'
import ItemsList from './components/ItemsList'
import './components/ItemView.scss'
import './App.css'

const App = () => {

  const [items, setItems] = useState([]);
  const [seed, setSeed] = useState(null);
  const [graphData, setGraphData] = useState();

  const renderGraph = (centerItem) => {
    let nodesArr = [];
    let linksArr = [];
    let ctrDOI = centerItem['DOI'];
    axios
      .get('https://opencitations.net/index/coci/api/v1/references/'+ctrDOI)
      .then(res => {
        for (const dataObj of res.data) {
          nodesArr.push({
            id: dataObj.cited,
            inLib: true
          });
          linksArr.push({source: dataObj.citing, target: dataObj.cited, value:1});
        }
        nodesArr.push({id: ctrDOI});  // add root node
        setGraphData({
          nodes: nodesArr,
          links: linksArr
        });
      })
      .catch(err => {
        console.log(err);
      });
    console.log(nodesArr);
  };

  useEffect(() => {
    axios.get('/allItems', {  // in production: axios.get('http://localhost:23119/viszot/allItems', {  // axios.get('/allItems', {
        headers: {'zotero-allowed-request':true}
    })
      .then(res => {
          setItems(res.data)
      })
      .catch(err => {
          console.log(err)
      })
  }, [])

  return(
    <div className='App'>
      <div className='ItemListContainer'>
        <ItemsList items={items} seed={seed} setSeed={setSeed} renderGraph={renderGraph} />
      </div>
      <div className='GraphContainer'>
        <div className='GraphInner'>
          {(seed === null) ? 'Please select seed paper.' :
            (
              <ForceGraph2D
                graphData={graphData}
                nodeColor={ node => node.inLib ? 'black' : 'red' }
                nodeLabel="id"
                linkCurvature="curvature"
                enablePointerInteraction={true}
                linkDirectionalParticleWidth={1}
              />
            )
          }
        </div>
      </div>
    </div>
  )
  
}

export default App;
