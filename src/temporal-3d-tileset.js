function extendCesium3DTileset({
  Cesium3DTileset,
  Cesium3DTile,
  Cesium3DTileOptimizations,
  Cesium3DTileRefine,
  CullingVolume,
  RuntimeError,
  TimeInterval,
  defined,
}) {
  class Temporal3DTile extends Cesium3DTile {
    constructor(tileset, baseResource, header, parent) {
      super(tileset, baseResource, header, parent);
      var availability;
      if (defined(header.availability)) {
        availability = TimeInterval.fromIso8601({
          iso8601: header.availability,
        });
      } else if (defined(parent)) {
        availability = TimeInterval.clone(parent.availability);
      }
      this._availability = availability;
    }
    get availability() {
      return this._availability;
    }
    visibility(frameState, parentVisibilityPlaneMask) {
      var cullingVolume = super.visibility(
        frameState,
        parentVisibilityPlaneMask
      );
      var availability = this._availability;
      var isAvailable =
        !defined(availability) ||
        TimeInterval.contains(availability, frameState.time);
      if (isAvailable) {
        return cullingVolume;
      } else {
        return CullingVolume.MASK_OUTSIDE;
      }
    }
  }

  class Temporal3DTileset extends Cesium3DTileset {
    constructor(options) {
      super(options);
    }

    loadTileset(resource, tilesetJson, parentTile) {
      var asset = tilesetJson.asset;
      if (!defined(asset)) {
        throw new RuntimeError("Tileset must have an asset property.");
      }
      if (asset.version !== "0.0" && asset.version !== "1.0") {
        throw new RuntimeError(
          "The tileset must be 3D Tiles version 0.0 or 1.0."
        );
      }
      var statistics = this._statistics;
      var tilesetVersion = asset.tilesetVersion;
      if (defined(tilesetVersion)) {
        this._basePath += "?v=" + tilesetVersion;
        resource.setQueryParameters({ v: tilesetVersion });
      }
      var rootTile = new Temporal3DTile(
        this,
        resource,
        tilesetJson.root,
        parentTile
      );
      if (defined(parentTile)) {
        parentTile.children.push(rootTile);
        rootTile._depth = parentTile._depth + 1;
      }

      var stack = [];
      stack.push(rootTile);

      while (stack.length > 0) {
        var tile = stack.pop();
        ++statistics.numberOfTilesTotal;
        this._allTilesAdditive =
          this._allTilesAdditive && tile.refine === Cesium3DTileRefine.ADD;
        var children = tile._header.children;
        if (defined(children)) {
          var length = children.length;
          for (var i = 0; i < length; ++i) {
            var childHeader = children[i];
            var childTile = new Temporal3DTile(
              this,
              resource,
              childHeader,
              tile
            );
            tile.children.push(childTile);
            childTile._depth = tile._depth + 1;
            stack.push(childTile);
          }
        }
        if (this._cullWithChildrenBounds) {
          Cesium3DTileOptimizations.checkChildrenWithinParent(tile);
        }
      }
      return rootTile;
    }
  }
  return Temporal3DTileset;
}

export { extendCesium3DTileset };
