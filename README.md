# Temporal 3D Tileset

This is a small package that adds functionality to [CesiumJS](https://github.com/CesiumGS/cesium). Specifically it adds the capability to assign an per tile time availability in your tileset.json file. This allows to segment datasets temporally rather than spatially (quadtrees or octrees). This is particularly useful for datasets collected by airborne instruments as data points in close proximity will often have close proximity temporally and it coincidentally segments them spatially along the flight track.

Since tiles with availability outside of the current time are culled, the style engine will skip the culled tiles and save on performance. This is a big improvement when using large dense datasets with the methods detailed here https://cesium.com/blog/2018/11/08/weather-prediction-data-time-series-and-3d-tiles/ .

## Installation

For npm
```
npm install temporal-3d-tile
```

You can also include it in a script tag
```
<script src="./temporal-3d-tileset.js"></script>
```


## Usage

The module exposes a method to which you must pass a reference to Cesium and it returns a class object that you can then instantiate just as a Cesium3DTileset.

For projects using npm and es6 module imports:
```
import { extendCesium3DTileset } from 'Temporal3DTilesetExtender'
const Temporal3DTileset = extendCesium3DTileset(Cesium);

const pointCloud = new Temporal3DTileset(options);
```

For projects using npm and common module requires:
```
const { extendCesium3DTileset } from 'temporal-3d-tile';
const Temporal3DTileset = extendCesium3DTileset(Cesium);

const pointCloud = new Temporal3DTileset(options);
```

For script tag:
```
const Temporal3DTileset = Temporal3DTilesetExtender.extendCesium3DTileset(Cesium);

const pointCloud = new Temporal3DTileset(options);
```

## Example tileset.json

It's as simple as adding the `availability` property to any tile that you want to be culled by its time availability. A child tile without an explicit availability will inherit the availability from the parent tile if it has one.

```
{
  "asset": {
    "version": "1.0",
    "type": "Airborne Radar"
  },
  "root": {
    "geometricError": 1000000,
    "refine": "REPLACE",
    "boundingVolume": {
      "region": [
        -2.203347685749427,
        0.820374523257895,
        -2.1344509094007504,
        0.8675643396145267,
        3.408846195301425e-05,
        344.5732638211542
      ]
    },
    "children": [
      {
        "availability": "2015-12-03T16:16:40Z/2015-12-03T16:35:26Z",
        "geometricError": 32,
        "boundingVolume": {
          "region": [
            -2.1691863536834717,
            0.8243063688278198,
            -2.150635242462158,
            0.8354669809341431,
            5.748046875,
            19727.2421875
          ]
        },
        "content": {
          "uri": "0.pnts"
        },
        "refine": "ADD"
      },
      {
        "availability": "2015-12-03T16:25:26Z/2015-12-03T16:47:00Z",
        "geometricError": 32,
        "boundingVolume": {
          "region": [
            -2.179356336593628,
            0.8203744888305664,
            -2.1584794521331787,
            0.8355889320373535,
            0.013671875,
            19737.490234375
          ]
        },
        "content": {
          "uri": "1.pnts"
        },
        "refine": "ADD"
      }
    ]
  },
  "properties": {
    "epoch": "2015-12-03T14:28:57Z"
}
```
## Demo

A demo can be seen at http://eatitloser.com/cesium_demo
