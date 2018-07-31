import React, { Component } from 'react';
import Viewer from "cesium/Source/Widgets/Viewer/Viewer";



import WebMapTileServiceImageryProvider from "cesium/Source/Scene/WebMapTileServiceImageryProvider";

class FGlobal extends Component{
	componentDidMount() { 
		var viewer = new Viewer('cesiumContainer', {
		    animation: false,
		    baseLayerPicker: false,
		    geocoder: true,
		    timeline: false,
		    sceneModePicker: true,
		    navigationHelpButton: false,
		    infoBox: true,
		});
  
		viewer.imageryLayers.addImageryProvider(new WebMapTileServiceImageryProvider({
	        url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
	        layer: "tdtImgBasicLayer",
	        style: "default",
	        format: "image/jpeg",
	        tileMatrixSetID: "GoogleMapsCompatible",
	        show: false
	    }));//卫星影像
 
		viewer.imageryLayers.addImageryProvider(new WebMapTileServiceImageryProvider({
            url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
            layer: "tdtImgAnnoLayer",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "GoogleMapsCompatible",
            show: false
        }));//注记图层
	}

	render(){
		return(
			<div>
				<div id="cesiumContainer" ref={ element => this.cesiumContainer = element }/>
			</div>
		)
	}
}

export default FGlobal