import React, { useState } from "react";

export default function ItemView({ isSeed, seed, setSeed, item, renderGraph }) {
  const title = item.title;
  const author = item.creators[0]['lastName']+' et al.';
  const authors = item.creators.map(creator => {
    return creator['firstName']+' '+creator['lastName']
  }).join(', ');
  const year = item.date;
  let citedBy = "null";
  let cites = "null";
  try {
    const cociInfo = JSON.parse(
                      JSON.parse(
                        JSON.parse(
                          item.extra))['coci']);
    citedBy = cociInfo['incoming_citations_count'];
    cites = cociInfo['outgoing_citations_count'];
  } catch (e) {}
  const tagsCount = item.tags.length;
  const tags = item.tags.map(tag => tag.tag).join(', ');
  const abstract = item.abstractNote;
  
  const [expanded, setExpanded] = useState(0);

  let classes = {
    title: "long-and-truncated",
    author: "ItemViewAuthorRow",
    details: "ItemViewDetailsRow",
    abstract: "ItemViewAbstract"
  };
  let imgs = {
    chevron: "assets/chevron-forward-outline.svg",
    leaf: "assets/leaf.svg",
    leafOutline: "assets/leaf-outline.svg",
    libr: "assets/library.svg",
    doi: "assets/DOI_true.svg"
  };
  if (expanded === 1) {
    imgs.chevron = "assets/chevron-down.svg";
    classes.abstract = "ExpandedAbstract";
    classes.details = "ItemViewDetailsRow ExpandedDetails";
    classes.title = "non-truncated";
  }
  let chevron = (
    <button
      onClick={() => setExpanded(expanded ? 0 : 1)}
      className="CustomButton"
    >
      <img src={imgs.chevron} alt=">" />
    </button>
  );
  let leaf = (
    <button 
      onClick={() => {
        setSeed(item);
        renderGraph(item);
      }}  // (TO-DO: if clicking the on the same item, set seed to null)
      className="CustomButton">
      <img src={isSeed ? imgs.leaf : imgs.leafOutline} alt="seed" />
    </button>
  );
  let libr = (
    <button className="CustomButton">
      <img src={imgs.libr} alt="libr" />
    </button>
  );
  let doi = (
    <button className="CustomButton">
      <img src={imgs.doi} alt="doi" />
    </button>
  );
  const citedByIco = <img src="assets/enter-outline.svg" alt="cited by" />;
  const citesIco = <img src="assets/exit-outline.svg" alt="cites" />;
  const tagsIco = <img src="assets/pricetags-outline.svg" alt="tags" />;

  return (
    <div className="ItemViewPaddedBorder">
      <div className="ItemViewContainer">
        <div className="ItemViewTitleRow">
          <div>{chevron}</div>
          <div className={classes.title}>{title}</div>
          {expanded === 0 ? (
            <div>
              {leaf} {libr} {doi}
            </div>
          ) : (
            <div>
              <div>{leaf}</div>
              <div>{libr}</div>
              <div>{doi}</div>
            </div>
          )}
        </div>
        <div style={{ paddingTop: 2 }} className="ItemViewAuthorRow">
          {expanded === 0 ? (
            <div>
              {author}, {year}
            </div>
          ) : (
            <div>
              <div>
                <b>Authors:</b> {authors}
              </div>
              <div>
                <b>Year:</b> {year}
              </div>
            </div>
          )}
        </div>
        {expanded === 0 ? (
          <div className={classes.details}>
            <div style={{ marginLeft: 0 }}>{citedByIco}</div>
            <p>{citedBy}</p>
            <div>{citesIco}</div>
            <p>{cites}</p>
            <div>{tagsIco}</div>
            <p>{tagsCount}</p>
          </div>
        ) : (
          <div className={classes.details}>
            <div>
              {citedByIco} <p>Cited By: {citedBy}</p>
            </div>
            <div>
              {citesIco} <p>Cites: {cites}</p>
            </div>
            <div>
              {tagsIco} <p>Tags: {tags}</p>{" "}
            </div>
          </div>
        )}
        <div className={classes.abstract}>
          <b>Abstract:</b> {abstract}
        </div>
      </div>
    </div>
  );
}
