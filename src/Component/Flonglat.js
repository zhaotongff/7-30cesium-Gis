//引入react需要的组件
import React, { Component } from 'react';
//引入cesium需要的文件  这里引用的是Cesium的库，你以后所有的东西都从这个库中调用
//import Viewer from "。./Build/Cesium/Cesium.js
import Viewer from "cesium/Source/Widgets/Viewer/Viewer";
import HorizontalOrigin from 'cesium/Source/Scene/HorizontalOrigin'
import VerticalOrigin from 'cesium/Source/Scene/VerticalOrigin'
import Cartesian2 from 'cesium/Source/Core/Cartesian2'
import Cartesian3 from 'cesium/Source/Core/Cartesian3'
import ScreenSpaceEventHandler from 'cesium/Source/Core/ScreenSpaceEventHandler'
import Cartographic from 'cesium/Source/Core/Cartographic'
import Color from 'cesium/Source/Core/Color'
import ColorMaterialProperty from 'cesium/Source/DataSources/ColorMaterialProperty'
import CallbackProperty from 'cesium/Source/DataSources/CallbackProperty'
import Math from 'cesium/Source/Core/Math'
import ScreenSpaceEventType from 'cesium/Source/Core/ScreenSpaceEventType'
import EntityCollection from 'cesium/Source/DataSources/EntityCollection'
import defined from 'cesium/Source/Core/defined'

import SceneMode from 'cesium/Source/Scene/SceneMode'

//import addDefaultToolbarButton from 'cesium/Apps/Sandcastle/Sandcastle-header/addDefaultToolbarButton'
//import reset  from 'cesium/Apps/Sandcastle/Sandcastle-header.js/reset'
class Flonglat extends Component{
    componentDidMount() {


             var defaultAction;
             var bucket = window.location.href;
             var pos = bucket.lastIndexOf('/');
             if (pos > 0 && pos < (bucket.length - 1)) {
                 bucket = bucket.substring(pos + 1);
             }
             window.Sandcastle = {
                 bucket : bucket,
                 declare : function() {
                 },
                 highlight : function() {
                 },
                 registered : [],
                 finishedLoading : function() {
                     window.Sandcastle.reset();

                     if(defaultAction) {
                         window.Sandcastle.highlight(defaultAction);
                         defaultAction();
                         defaultAction = undefined;
                     }

                     document.body.className = document.body.className.replace(/(?:\s|^)sandcastle-loading(?:\s|$)/, ' ');
                 },
                 addToggleButton : function(text, checked, onchange, toolbarID) {
                     window.Sandcastle.declare(onchange);
                     var input = document.createElement('input');
                     input.checked = checked;
                     input.type = 'checkbox';
                     input.style.pointerEvents = 'none';
                     var label = document.createElement('label');
                     label.appendChild(input);
                     label.appendChild(document.createTextNode(text));
                     label.style.pointerEvents = 'none';
                     var button = document.createElement('button');
                     button.type = 'button';
                     button.className = 'cesium-button';
                     button.appendChild(label);

                     button.onclick = function() {
                         window.Sandcastle.reset();
                         window.Sandcastle.highlight(onchange);
                         input.checked = !input.checked;
                         onchange(input.checked);
                     };

                     document.getElementById(toolbarID || 'toolbar').appendChild(button);
                 },
                 addToolbarButton : function(text, onclick, toolbarID) {
                     window.Sandcastle.declare(onclick);
                     var button = document.createElement('button');
                     button.type = 'button';
                     button.className = 'cesium-button';
                     button.onclick = function() {
                         window.Sandcastle.reset();
                         window.Sandcastle.highlight(onclick);
                         onclick();
                     };
                     button.textContent = text;
                     document.getElementById(toolbarID || 'toolbar').appendChild(button);
                 },
                 addDefaultToolbarButton : function(text, onclick, toolbarID) {
                     window.Sandcastle.addToolbarButton(text, onclick, toolbarID);
                     defaultAction = onclick;
                 },
                 addDefaultToolbarMenu : function(options, toolbarID) {
                     window.Sandcastle.addToolbarMenu(options, toolbarID);
                     defaultAction = options[0].onselect;
                 },
                 addToolbarMenu : function(options, toolbarID) {
                     var menu = document.createElement('select');
                     menu.className = 'cesium-button';
                     menu.onchange = function() {
                         window.Sandcastle.reset();
                         var item = options[menu.selectedIndex];
                         if (item && typeof item.onselect === 'function') {
                             item.onselect();
                         }
                     };
                     document.getElementById(toolbarID || 'toolbar').appendChild(menu);

                     if (!defaultAction && typeof options[0].onselect === 'function') {
                         defaultAction = options[0].onselect;
                     }

                     for (var i = 0, len = options.length; i < len; ++i) {
                         var option = document.createElement('option');
                         option.textContent = options[i].text;
                         option.value = options[i].value;
                         menu.appendChild(option);
                     }
                 },
                 reset : function() {
                 }
             };

             if (window.location.protocol === 'file:') {
                 if (window.confirm("You must host this app on a web server.\nSee contributor's guide for more info?")) {
                     window.location = 'https://github.com/AnalyticalGraphicsInc/cesium/wiki/Contributor%27s-Guide';
                 }
             }



//
        var viewer = new Viewer('cesiumContainer', {//从cesium引入视图后，在视图内显示球体
            selectionIndicator: false,//
            infoBox: false// //是否显示点击要素之后显示的信息
        });

        var scene = viewer.scene; // 得到当前三维场景
        if (!scene.pickPositionSupported) {
            console.log('no scane');
        }

        var handler;
  //显示鼠标所在位置的制图，移动鼠标将屏幕坐标转换为图上的经纬度坐标
        window.Sandcastle.addDefaultToolbarButton('If the mouse is over the billboard, change its scale and color', function () {
          //添加实体对象
            var entity = viewer.entities.add({
                label: {
                    show: false,
                    showBackground: true,
                    font: '12px monospace',
                    horizontalOrigin: HorizontalOrigin.LEFT,
                    verticalOrigin: VerticalOrigin.TOP,
                    //表示一个二维笛卡尔坐标系，也就是直角坐标系（屏幕坐标系）
                    pixelOffset: new Cartesian2(15, 0)

                }
            });

            // 将鼠标悬停在地球上以查看制图位置
            handler = new ScreenSpaceEventHandler(scene.canvas);
            handler.setInputAction(function (movement) {
                //获取相机
                var cartesian = viewer.camera.pickEllipsoid(movement.endPosition, scene.globe.ellipsoid);
                if (cartesian) {
                  // 经纬度坐标转地理坐标
                    var cartographic = Cartographic.fromCartesian(cartesian);

                    var longitudeString = Math.toDegrees(cartographic.longitude).toFixed(2);
                    var latitudeString = Math.toDegrees(cartographic.latitude).toFixed(2);

                    entity.position = cartesian;
                    entity.label.show = true;
                    entity.label.text =
                        'Lon: ' + ('   ' + longitudeString).slice(-7) + '\u00B0' +
                        '\nLat: ' + ('   ' + latitudeString).slice(-7) + '\u00B0';
                } else {
                    entity.label.show = false;
                }
            }, ScreenSpaceEventType.MOUSE_MOVE);
        });



       //显示logo展板
        window.Sandcastle.addToolbarButton('pick entities', function () {
            var entity = viewer.entities.add({
               //表示一个三维笛卡尔坐标系，也是直角坐标系(就是真实世界的坐标系)
               //经纬度坐标转世界坐标
                position: Cartesian3.fromDegrees(-75.59777, 40.03883),

                billboard: {
                    image: '../cesium/Apps/Sandcastle/images/Cesium_Logo_overlay.png'
                }
            });

            // 如果鼠标在展板上，改变它的比例和颜色
            handler = new ScreenSpaceEventHandler(scene.canvas);
            handler.setInputAction(function (movement) {
                var pickedObject = scene.pick(movement.endPosition);
                if (defined(pickedObject) && (pickedObject.id === entity)) {
                    entity.billboard.scale = 2.0;//展板实体放大2倍
                    entity.billboard.color = Color.YELLOW;//展板颜色i变为黄色
                } else {
                    entity.billboard.scale = 1.0;
                    entity.billboard.color = Color.WHITE;
                }
            }, ScreenSpaceEventType.MOUSE_MOVE);
        });

        
//选取一个具体的位置，在上面放上一辆牛奶车，可以实时移动鼠标查看经纬度及海拔盖度
        window.Sandcastle.addToolbarButton('Pick position', function () {
            var modelEntity = viewer.entities.add({
                name: 'milktruck',
                position: Cartesian3.fromDegrees(-123.0744619, 44.0503706),
                model: {
                    uri: '../cesium/Apps/SampleData/models/CesiumMilkTruck/CesiumMilkTruck-kmc.glb'
                }
            });
            viewer.zoomTo(modelEntity);//直接定位到模型试题具体位置

            var labelEntity = viewer.entities.add({
                label: {
                    show: false,
                    showBackground: true,
                    font: '14px monospace',
                    horizontalOrigin: HorizontalOrigin.LEFT,
                    verticalOrigin: VerticalOrigin.TOP,
                    pixelOffset: new Cartesian2(15, 0)
                }
            });

            // 53 / 5000
         //将鼠标悬停在地球上以查看地图位置
            handler = new ScreenSpaceEventHandler(scene.canvas);
            handler.setInputAction(function (movement) {

                var foundPosition = false;

                var scene = viewer.scene;
                if (scene.mode !== SceneMode.MORPHING) {
                    var pickedObject = scene.pick(movement.endPosition);
                    if (scene.pickPositionSupported && defined(pickedObject) && pickedObject.id === modelEntity) {
                        var cartesian = viewer.scene.pickPosition(movement.endPosition);

                        if (defined(cartesian)) {//defined引入的一个函数作用 判断cartesian值是否存在
                            var cartographic = Cartographic.fromCartesian(cartesian);
                            var longitudeString = Math.toDegrees(cartographic.longitude).toFixed(2);
                            var latitudeString = Math.toDegrees(cartographic.latitude).toFixed(2);
                            var heightString = cartographic.height.toFixed(2);

                            labelEntity.position = cartesian;
                            labelEntity.label.show = true;

                            //屏幕坐标与世界坐标的转换
                            labelEntity.label.text =
                                'Lon: ' + ('   ' + longitudeString).slice(-7) + '\u00B0' +
                                '\nLat: ' + ('   ' + latitudeString).slice(-7) + '\u00B0' +
                                '\nAlt: ' + ('   ' + heightString).slice(-7) + 'm';

                            labelEntity.label.eyeOffset = new Cartesian3(0.0, 0.0, -cartographic.height * (scene.mode === SceneMode.SCENE2D ? 1.5 : 1.0));

                            foundPosition = true;
                        }
                    }
                }

                if (!foundPosition) {
                    labelEntity.label.show = false;
                }
            }, ScreenSpaceEventType.MOUSE_MOVE);
        });
        window.Sandcastle.reset = function () {
            viewer.entities.removeAll();
            handler = handler && handler.destroy();
        }
        ;





    }
        render(){
        return (
            <div>
                <div id="cesiumContainer" class="fullSize"></div>
                <div id="loadingOverlay"><h1>Loading...</h1></div>
                <div id="toolbar"></div>
            </div>
        );
    }

}
export default Flonglat