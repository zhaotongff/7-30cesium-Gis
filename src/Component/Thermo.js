import React, { Component } from 'react';
import Viewer from "cesium/Source/Widgets/Viewer/Viewer";

class Thermo extends Component{
	componentDidMount() { 
        this.viewer = new Viewer(this.cesiumContainer,{
        	geocoder: false,
		    homeButton: false,
		    sceneModePicker: false,
		    baseLayerPicker: false,
		    navigationHelpButton: false,
		    animation: false,
		    timeline: false,
		    fullscreenButton: false,
		    vrButton: false,
		    shouldAnimate : true,
	    	
	    });
    }
	render(){
		return(
			<div>
				<h2>Thermo</h2>
				<div id="cesiumContainer" ref={ element => this.cesiumContainer = element }/>
			</div>
		)
	}
}

export default Thermo;