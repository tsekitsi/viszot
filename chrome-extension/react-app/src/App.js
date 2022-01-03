import React, {useState, useEffect} from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import axios from 'axios'
import moment from 'moment'
import ItemsList from './components/ItemsList'
import './components/ItemView.scss'
import './App.css'

const App = () => {

  const [items, setItems] = useState([]);
  const [seed, setSeed] = useState(null);
  const [graphData, setGraphData] = useState();

  const [displayWidth, setDisplayWidth] = useState(window.innerWidth);
  const [displayHeight, setDisplayHeight] = useState(window.innerHeight);
  window.addEventListener('resize', () => {
    setDisplayWidth(window.innerWidth);
    setDisplayHeight(window.innerHeight);
  });  // https://github.com/vasturiano/react-force-graph/issues/233#issuecomment-738778495

  /**
	 * Returns (as JSON object) the value of the 'coci' key in `item`'s
   * 'extra' field.
   * Note: assumes that the value of `item['extra']['coci']` is
   * always useful.
	 * @param {Object} item a Zotero Item
	 */
  const getCOCIinfo = item => {
    try {
      return JSON.parse(item['extra'])['coci']
    } catch (e) {
      return null
    }
  }

  /**
	 * Writes `info` as the value of the key 'coci' in a JSON object
   * (`extraContents`). Then, `extraContents` gets stringified and
   * stored in the 'extra' field of item (`item['extra']`). Any
   * previous, non-JSON contents of the `item`'s 'extra' field are
   * preserved in the 'other' key (`item['extra']['other']`).
	 * @param {String} info the value to set to key 'coci'
   * @param {Object} item a Zotero Item
	 */
  const setCOCIinfo = (info, item) => {
    let extraContents = {};
    try {
      extraContents = JSON.parse(item['extra']);  // if in json format, (over)write viszot field
    } catch (e) {
      extraContents['other'] = item['extra'];  // if not in json, capture old contents in 'other' field
    }
    extraContents['coci'] = info;
    item.setField('extra', JSON.stringify(extraContents));
  }

  /**
   * Ensures each item in `items` with a DOI has COCI info, by
   * selecting the subset that do not have COCI info already, sending
   * a single API request to /metadata/{dois} and calling `setCOCIinfo`
   * on each .
   * @param {Array} items 
   */
  const ensureItemsHaveCOCIinfo = async items => {
    let itemsNeedingCOCIinfoFetching = [];
    items.forEach(item => {
      if (item['DOI']) {  // weed out items without a DOI
        if (!getCOCIinfo(item)) {  // weed out items that have 
          itemsNeedingCOCIinfoFetching.push(item);
        }
      }
    })
    let dois = itemsNeedingCOCIinfoFetching
      .map(elmt => elmt['DOI'])
      .join('__')  // prep string for API request
    axios.get('https://opencitations.net/index/coci/api/v1/metadata/'+dois)
      .then(res => {
        itemsNeedingCOCIinfoFetching.forEach((item, index) => {
          setCOCIinfo(JSON.stringify(
            {incoming_citations_count: res[index]['citation_count'],
             outgoing_citations_count: res[index]['reference'].split(';').length,
             last_updated: moment()
            }), item)
        })
      })
      .catch(err => console.log(err))
  }

  const renderGraph = centerItem => {
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
    //)()  // just making everything into an async function which I call
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
                width={.7*displayWidth}
                height={displayHeight}
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
