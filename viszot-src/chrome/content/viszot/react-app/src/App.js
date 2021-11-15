import React, { useRef, useEffect, Component } from 'react';
//import ForceGraph2D from "react-force-graph-2d";
import axios from 'axios';
//import logo from './logo.svg';
import './App.css';

const Zotero = Components.classes["@zotero.org/Zotero;1"]
                .getService(Components.interfaces.nsISupports)
                .wrappedJSObject;

Components.utils.import("chrome://viszot/content/init.jsm");

class App extends Component {
  state = {Nodes: [],
           Links: [],
           ItemsDOIs: [],
           References: []
          };
  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
      console.log(state);
    });
  }
  async componentDidMount() {
    let items = Zotero.getActiveZoteroPane().getSelectedCollection().getChildItems();
    let itemsDOIs = items.map(item => item.getField('DOI', false, true));
    let seedDOI = '10.1371/journal.ppat.1003608'; // items[0].getField('DOI', false, true);
    const res = await axios.get('https://opencitations.net/index/coci/api/v1/references/'+seedDOI);
    const refs = res.data;

    // Prepping data for graph visualization:
    let citedPapers = refs.map(ref => {return {id: ref.cited}});
    let citedPapers_asArray = Array.from(citedPapers);
    citedPapers_asArray.push({id: seedDOI});
    let data = {
      nodes: Array.from(citedPapers), //[{ id: "A" }, { id: "B" }, { id: "C" }, { id: "D" }]
      // https://stackoverflow.com/a/61223925
      // https://stackoverflow.com/a/68891876
      // https://appcircle.io/blog/how-to-install-update-upgrade-downgrade-npm-yarn-and-node-js-versions/
      links: Array.from(itemsDOIs.map(ref => {
        return { source: seedDOI, target: ref.cited, value: 1 }
      }))
    }

    await this.setStateAsync({Nodes: data.nodes, Links: data.links, ItemsDOIs: itemsDOIs, References: refs})
  }  // https://stackoverflow.com/a/47659112

  render() {
    //let items = Zotero.getActiveZoteroPane().getSelectedCollection().getChildItems();
    
    /*
    const forceRef = useRef(null);
    useEffect(() => {
      forceRef.current.d3Force("charge").strength(-400);
    });
    */
    
    return (
      <div className="App">
        <div>{heyMsg}</div>
        {
          // Print list of papers in the Zotero collection:
          //items.map(item => <div> {item.getField('title', false, true)} </div>)
          this.state.References.map(ref => {
            if (this.state.ItemsDOIs.indexOf(ref.cited) > -1) {
              return <div>{"["+ref.cited+"]"}</div>
            } else return <div>{ref.cited}</div>
          })
        }
        {/*
        <div> ............................... </div>
        <div> {this.state.Links.map(link => link.source)} </div>
        */}
      </div>
    );
  }
}

export default App;
