import React, { Component } from 'react';
import Viewer from "cesium/Source/Widgets/Viewer/Viewer";

import Cesium3DTileset from "cesium/Source/Scene/Cesium3DTileset";

import IonResource from "cesium/Source/Core/IonResource";

class FHouse extends Component{
componentDidMount() {
var viewer = new Viewer('cesiumContainer');

var tileset = new Cesium3DTileset({
    url: IonResource.fromAssetId(3836)
});

viewer.scene.primitives.add(tileset);
viewer.zoomTo(tileset);

}
render(){
	return(
		<div>
			<div id="cesiumContainer" ref={ element => this.cesiumContainer = element }/>
			
		</div>
	)
}
}

export default FHouse