import React, { Component } from 'react';
import Viewer from "cesium/Source/Widgets/Viewer/Viewer";

import Cartesian3 from "cesium/Source/Core/Cartesian3";
import ClockRange from "cesium/Source/Core/ClockRange";
import TimeIntervalCollection from 'cesium/Source/Core/TimeIntervalCollection'
import TimeInterval from 'cesium/Source/Core/TimeInterval'
import JulianDate from 'cesium/Source/Core/JulianDate'
import Math from "cesium/Source/Core/Math";

import ArcGisMapServerImageryProvider from "cesium/Source/Scene/ArcGisMapServerImageryProvider";

import SampledPositionProperty from "cesium/Source/DataSources/SampledPositionProperty";

import VelocityOrientationProperty from "cesium/Source/DataSources/VelocityOrientationProperty";


const url = '../cesium/Apps/SampleData/models/CesiumAir/Cesium_Air.glb'
class FAir extends Component{
componentDidMount() {
    let view = new Viewer('cesiumContainer', {
	    baseLayerPicker: false,
	    imageryProvider: new ArcGisMapServerImageryProvider({
	        url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
	    }),
	    // 阴影是否被太阳投射
	    shadows: true
	});
    // 启用地球照明
    view.scene.globe.enableLighting = true;

    //镜头一开始的位置
    var point = Cartesian3.fromDegrees(116.405419,39.918034, 8000000.0);
    view.camera.setView({
        destination : point,
        orientation: {
            heading : Math.toRadians(0.0), //默认值
            pitch : Math.toRadians(-90.0), // 默认值
            roll : 0.0 //默认值
        }
    });

    let data = [];

    data[0] = [{longitude:116.405419, dimension:39.918034, height:0, time:0},{longitude:116.2821, dimension:39.918145, height:0, time:40},{longitude:115.497402, dimension:39.344641, height:70000, time:100},{longitude:107.942392, dimension:29.559967, height:70000, time:280}, {longitude:106.549265, dimension:29.559967, height:0, time:360}];

    // 起始时间
    let start = JulianDate.fromDate(new Date(2017,7,11));
    // 结束时间
    let stop = JulianDate.addSeconds(start, 360, new JulianDate());

    // 设置始时钟始时间
    view.clock.startTime = start.clone();
    // 设置时钟当前时间
    view.clock.currentTime = start.clone();
    // 设置始终停止时间
    view.clock.stopTime  = stop.clone();
    // 时间速率，数字越大时间过的越快
    view.clock.multiplier = 10;
    // 时间轴
    view.timeline.zoomTo(start,stop);
    // 循环执行
    view.clock.clockRange = ClockRange.LOOP_STOP;


    let property = computeFlight(data[0]);
    // 添加模型
    view.entities.add({
        // 和时间轴关联
        availability : new TimeIntervalCollection([new TimeInterval({
            start : start,
            stop : stop
        })]),
        position: property,
        // 根据所提供的速度计算点
        orientation: new VelocityOrientationProperty(property),
        // 模型数据
        model: {
            uri: url,
            minimumPixelSize:128
        }
    });
 
    /**
     * 计算飞行
     * @param source 数据坐标
     * @returns {SampledPositionProperty|*}
     */
    function computeFlight(source) {
        // 取样位置 相当于一个集合
        let property = new SampledPositionProperty();
        for(let i=0; i<source.length; i++){
            let time = JulianDate.addSeconds(start, source[i].time, new JulianDate());
            let position = Cartesian3.fromDegrees(source[i].longitude, source[i].dimension, source[i].height);
            // 添加位置，和时间对应
            property.addSample(time, position);
        }
        return property;
    }

}
render(){
	return(
		<div>
			<div id="cesiumContainer" ref={ element => this.cesiumContainer = element }/>
		</div>
	)
}
}

export default FAir