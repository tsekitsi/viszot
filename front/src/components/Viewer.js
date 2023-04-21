import { ResponsiveNetwork } from "@nivo/network";

const Viewer = ({ data }) => (
  <ResponsiveNetwork
    data={data}
    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
    linkDistance={function(e){return e.distance}}
    centeringStrength={0.3}
    repulsivity={6}
    nodeSize={function(n){return n.size}}
    activeNodeSize={function(n){return 1.5*n.size}}
    nodeColor={function(e){return e.color}}
    nodeBorderWidth={1}
    nodeBorderColor={{
      from: 'color',
      modifiers: [
        [
          'darker',
          0.8
        ]
      ]
    }}
    linkThickness={function(n){return 2+2*n.target.data.height}}
    linkBlendMode="multiply"
    motionConfig="wobbly"
  />
)

export default Viewer
