import * as React from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
  themeCSS: `
    g.classGroup rect {
      fill: #282a36;
      stroke: #6272a4;
    }
    g.classGroup text {
      fill: #f8f8f2;
    }
    g.classGroup line {
      stroke: #f8f8f2;
      stroke-width: 0.5;
    }
    .classLabel .box {
      stroke: #21222c;
      stroke-width: 3;
      fill: #21222c;
      opacity: 1;
    }
    .classLabel .label {
      fill: #f1fa8c;
    }
    .relation {
      stroke: #ff79c6;
      stroke-width: 1;
    }
    #compositionStart, #compositionEnd {
      fill: #bd93f9;
      stroke: #bd93f9;
      stroke-width: 1;
    }
    #aggregationEnd, #aggregationStart {
      fill: #21222c;
      stroke: #50fa7b;
      stroke-width: 1;
    }
    #dependencyStart, #dependencyEnd {
      fill: #00bcd4;
      stroke: #00bcd4;
      stroke-width: 1;
    }
    #extensionStart, #extensionEnd {
      fill: #f8f8f2;
      stroke: #f8f8f2;
      stroke-width: 1;
    }`,
  // fontFamily: "Fira Code"
});

const Mermaid = ({ chart }) => {
  React.useEffect(() => {
    mermaid.contentLoaded();
  }, []);
  return <div className="mermaid">{chart}</div>;
};

const str = `
classDiagram
class GeoPointType {
 <<enumeration>>
  BROWNFIELD
  OGWELL
  CELL_TOWER
  NUCLEAR_REACTOR
  SUPERFUND
}
class GeoPoint {
  -UUID id
  +GeoPointType type
  +GeographyPoint location
  -UUID metadata references metadata(id)
  +Datetime createdAt
}
class GeographyPoint {
  <<interface>>
  +GeoJSON geojson
  +Int srid
  +Float longitude
  +Float latitude
}
class NearbyPoint {
 <<Interface>>
  -UUID id references GeoPoint(id)
  +GeoPointType GeoPoint::type
  +GeographyPoint GeoPoint::location
  +UUID GeoPoint::metadata
  +Float distance
}
class NearbyPoints {
<<Service>>
  +GeoJSON origin
  +Float radiusMi
  +Int first
  +Int last
  +Int offset
  +Cursor before
  +Cursor after
}
class Hotel {
 -UUID id
+String name
-Int objectid
}
GeoPoint *-- GeoPointType: Composition
GeoPoint *-- GeographyPoint: Composition
GeoPoint "1" <|-- "1" NearbyPoint: Implements
NearbyPoints "1" -- "0..n"NearbyPoint: Contains
Hotel "1" -- "1" GeoPoint: May Contain

`;

export const TestDiagram = ({ diagramStr, title }) => {
  return (
    <>
      <h1>{title}</h1>
      <Mermaid chart={diagramStr} />
    </>
  );
};
