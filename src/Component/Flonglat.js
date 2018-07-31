import React, { Component } from 'react';
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




        var viewer = new Viewer('cesiumContainer', {
            selectionIndicator: false,
            infoBox: false
        });

        var scene = viewer.scene;
        if (!scene.pickPositionSupported) {
            console.log('This browser does not support pickPosition.');
        }

        var handler;

        window.Sandcastle.addDefaultToolbarButton('Show Cartographic Position on Mouse Over', function () {
            var entity = viewer.entities.add({
                label: {
                    show: false,
                    showBackground: true,
                    font: '14px monospace',
                    horizontalOrigin: HorizontalOrigin.LEFT,
                    verticalOrigin: VerticalOrigin.TOP,
                    pixelOffset: new Cartesian2(15, 0)
                }
            });

            // Mouse over the globe to see the cartographic position
            handler = new ScreenSpaceEventHandler(scene.canvas);
            handler.setInputAction(function (movement) {
                var cartesian = viewer.camera.pickEllipsoid(movement.endPosition, scene.globe.ellipsoid);
                if (cartesian) {
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

        window.Sandcastle.addToolbarButton('Pick Entity', function () {
            var entity = viewer.entities.add({
                position: Cartesian3.fromDegrees(-75.59777, 40.03883),
                billboard: {
                    image: '../images/Cesium_Logo_overlay.png'
                }
            });

            // If the mouse is over the billboard, change its scale and color
            handler = new ScreenSpaceEventHandler(scene.canvas);
            handler.setInputAction(function (movement) {
                var pickedObject = scene.pick(movement.endPosition);
                if (defined(pickedObject) && (pickedObject.id === entity)) {
                    entity.billboard.scale = 2.0;
                    entity.billboard.color = Color.YELLOW;
                } else {
                    entity.billboard.scale = 1.0;
                    entity.billboard.color = Color.WHITE;
                }
            }, ScreenSpaceEventType.MOUSE_MOVE);
        });

        window.Sandcastle.addToolbarButton('Drill-Down Picking', function () {
            var pickedEntities = new EntityCollection();
            var pickColor = Color.YELLOW.withAlpha(0.5);

            function makeProperty(entity, color) {
                var colorProperty = new CallbackProperty(function (time, result) {
                    if (pickedEntities.contains(entity)) {
                        return pickColor.clone(result);
                    }
                    return color.clone(result);
                }, false);

                entity.polygon.material = new ColorMaterialProperty(colorProperty);
            }

            var red = viewer.entities.add({
                polygon: {
                    hierarchy: Cartesian3.fromDegreesArray([-70.0, 30.0,
                        -60.0, 30.0,
                        -60.0, 40.0,
                        -70.0, 40.0]),
                    height: 0
                }
            });
            makeProperty(red, Color.RED.withAlpha(0.5));

            var blue = viewer.entities.add({
                polygon: {
                    hierarchy: Cartesian3.fromDegreesArray([-75.0, 34.0,
                        -63.0, 34.0,
                        -63.0, 40.0,
                        -75.0, 40.0]),
                    height: 0
                }
            });
            makeProperty(blue, Color.BLUE.withAlpha(0.5));

            var green = viewer.entities.add({
                polygon: {
                    hierarchy: Cartesian3.fromDegreesArray([-67.0, 36.0,
                        -55.0, 36.0,
                        -55.0, 30.0,
                        -67.0, 30.0]),
                    height: 0
                }
            });
            makeProperty(green, Color.GREEN.withAlpha(0.5));

            // Move the primitive that the mouse is over to the top.
            handler = new ScreenSpaceEventHandler(scene.canvas);
            handler.setInputAction(function (movement) {
                // get an array of all primitives at the mouse position
                var pickedObjects = scene.drillPick(movement.endPosition);
                if (defined(pickedObjects)) {
                    //Update the collection of picked entities.
                    pickedEntities.removeAll();
                    for (var i = 0; i < pickedObjects.length; ++i) {
                        var entity = pickedObjects[i].id;
                        pickedEntities.add(entity);
                    }
                }

            }, ScreenSpaceEventType.MOUSE_MOVE);
        });

        window.Sandcastle.addToolbarButton('Pick position', function () {
            var modelEntity = viewer.entities.add({
                name: 'milktruck',
                position: Cartesian3.fromDegrees(-123.0744619, 44.0503706),
                model: {
                    uri: '../../SampleData/models/CesiumMilkTruck/CesiumMilkTruck-kmc.gltf'
                }
            });
            viewer.zoomTo(modelEntity);

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

            // Mouse over the globe to see the cartographic position
            handler = new ScreenSpaceEventHandler(scene.canvas);
            handler.setInputAction(function (movement) {

                var foundPosition = false;

                var scene = viewer.scene;
                if (scene.mode !== SceneMode.MORPHING) {
                    var pickedObject = scene.pick(movement.endPosition);
                    if (scene.pickPositionSupported && defined(pickedObject) && pickedObject.id === modelEntity) {
                        var cartesian = viewer.scene.pickPosition(movement.endPosition);

                        if (defined(cartesian)) {
                            var cartographic = Cartographic.fromCartesian(cartesian);
                            var longitudeString = Math.toDegrees(cartographic.longitude).toFixed(2);
                            var latitudeString = Math.toDegrees(cartographic.latitude).toFixed(2);
                            var heightString = cartographic.height.toFixed(2);

                            labelEntity.position = cartesian;
                            labelEntity.label.show = true;
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