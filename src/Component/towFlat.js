import React, { Component } from 'react';
import Viewer from "cesium/Source/Widgets/Viewer/Viewer";
import ScreenSpaceEventHandler from 'cesium/Source/Core/ScreenSpaceEventHandler'
import Matrix4 from 'cesium/Source/Core/Matrix4'
import ScreenSpaceEventType from 'cesium/Source/Core/ScreenSpaceEventType'
import Cartesian2 from 'cesium/Source/Core/Cartesian2'
import Cartesian3 from 'cesium/Source/Core/Cartesian3'
import defined from 'cesium/Source/Core/defined'
import Color from 'cesium/Source/Core/Color'
import CallbackProperty from 'cesium/Source/DataSources/CallbackProperty'
import Math from 'cesium/Source/Core/Math'
import Plane from 'cesium/Source/Core/Plane'
import Transforms from 'cesium/Source/Core/Transforms'
import IonResource from 'cesium/Source/Core/IonResource'
import HeadingPitchRoll from 'cesium/Source/Core/HeadingPitchRoll'
import HeadingPitchRange from 'cesium/Source/Core/HeadingPitchRange'
import Cesium3DTileset from 'cesium/Source/Scene/Cesium3DTileset'
import ClippingPlane from 'cesium/Source/Scene/ClippingPlane'
import ClippingPlaneCollection from 'cesium/Source/Scene/ClippingPlaneCollection'
import knockout from 'cesium/Source/ThirdParty/knockout.js'
//import  'cesium/Apps/Sandcastle/templates/bucket.css'

class twoFlat extends Component{

    componentDidMount() {
        var viewer = new Viewer('cesiumContainer', {
            infoBox: false,
            selectionIndicator: false
        });
        var scene = viewer.scene;

        var clipObjects = ['BIM', 'Point Cloud', 'Instanced', 'Model'];
        var viewModel = {
            debugBoundingVolumesEnabled : false,
            edgeStylingEnabled : true,
            exampleTypes : clipObjects,
            currentExampleType : clipObjects[0]
        };

        var targetY = 0.0;
        var planeEntities = [];
        var selectedPlane;

// Select plane when mouse down
        var downHandler = new ScreenSpaceEventHandler(viewer.scene.canvas);
        downHandler.setInputAction(function(movement) {
            var pickedObject = scene.pick(movement.position);
            if (defined(pickedObject) &&
                defined(pickedObject.id) &&
                defined(pickedObject.id.plane)) {
                selectedPlane = pickedObject.id.plane;
                selectedPlane.material =Color.WHITE.withAlpha(0.05);
                selectedPlane.outlineColor = Color.WHITE;
                scene.screenSpaceCameraController.enableInputs = false;
            }
        }, ScreenSpaceEventType.LEFT_DOWN);

// Release plane on mouse up
        var upHandler = new ScreenSpaceEventHandler(viewer.scene.canvas);
        upHandler.setInputAction(function() {
            if (defined(selectedPlane)) {
                selectedPlane.material = Color.WHITE.withAlpha(0.1);
                selectedPlane.outlineColor =Color.WHITE;
                selectedPlane = undefined;
            }

            scene.screenSpaceCameraController.enableInputs = true;
        }, ScreenSpaceEventType.LEFT_UP);

        var moveHandler = new ScreenSpaceEventHandler(viewer.scene.canvas);
        moveHandler.setInputAction(function(movement) {
            if (defined(selectedPlane)) {
                var deltaY = movement.startPosition.y - movement.endPosition.y;
                targetY += deltaY;
            }
        }, ScreenSpaceEventType.MOUSE_MOVE);

        var scratchPlane = new ClippingPlane(Cartesian3.UNIT_X, 0.0);
        function createPlaneUpdateFunction(plane, transform) {
            return function () {
                plane.distance = targetY;
                return Plane.transform(plane, transform, scratchPlane);
            };
        }

        var tileset;
        function loadTileset(url) {
            var clippingPlanes = [
                new ClippingPlane(new Cartesian3(0.0, 0.0, -1.0), -100.0)
            ];

            tileset = viewer.scene.primitives.add(new Cesium3DTileset({
                url : url,
                clippingPlanes : new ClippingPlaneCollection({
                    planes : clippingPlanes,
                    edgeWidth : viewModel.edgeStylingEnabled ? 1.0 : 0.0
                })
            }));

            tileset.debugShowBoundingVolume = viewModel.debugBoundingVolumesEnabled;
            return tileset.readyPromise.then(function() {
                var boundingSphere = tileset.boundingSphere;
                var radius = boundingSphere.radius;

                viewer.zoomTo(tileset, new HeadingPitchRange(0.5, -0.2, radius * 4.0));

                for (var i = 0; i < clippingPlanes.length; ++i) {
                    var plane = clippingPlanes[i];
                    var planeEntity = viewer.entities.add({
                        position : boundingSphere.center,
                        plane : {
                            dimensions : new Cartesian2(radius * 2.5, radius * 2.5),
                            material : Color.WHITE.withAlpha(0.1),
                            plane : new CallbackProperty(createPlaneUpdateFunction(plane, tileset.modelMatrix), false),
                            outline : true,
                            outlineColor : Color.WHITE
                        }
                    });

                    planeEntities.push(planeEntity);
                }
                return tileset;
            }).otherwise(function(error) {
                console.log(error);
            });
        }

        var modelEntityClippingPlanes;
        function loadModel(url) {
            var clippingPlanes = [
                new ClippingPlane(new Cartesian3(0.0, 0.0, -1.0), -100.0)
            ];

            modelEntityClippingPlanes = new ClippingPlaneCollection({
                planes : clippingPlanes,
                edgeWidth : viewModel.edgeStylingEnabled ? 1.0 : 0.0
            });

            function updateClippingPlanes() {
                return modelEntityClippingPlanes;
            }

            var position = Cartesian3.fromDegrees(-123.0744619, 44.0503706, 100.0);
            var heading = Math.toRadians(135.0);
            var pitch = 0.0;
            var roll = 0.0;
            var hpr = new HeadingPitchRoll(heading, pitch, roll);
            var orientation = Transforms.headingPitchRollQuaternion(position, hpr);
            var entity = viewer.entities.add({
                name : url,
                position : position,
                orientation : orientation,
                model : {
                    uri : url,
                    scale : 8,
                    minimumPixelSize : 100.0,
                    clippingPlanes : new CallbackProperty(updateClippingPlanes, false)
                }
            });

            viewer.trackedEntity = entity;

            for (var i = 0; i < clippingPlanes.length; ++i) {
                var plane = clippingPlanes[i];
                var planeEntity = viewer.entities.add({
                    position : position,
                    plane : {
                        dimensions : new Cartesian2(300.0, 300.0),
                        material :Color.WHITE.withAlpha(0.1),
                        plane : new CallbackProperty(createPlaneUpdateFunction(plane, Matrix4.IDENTITY), false),
                        outline : true,
                        outlineColor :Color.WHITE
                    }
                });

                planeEntities.push(planeEntity);
            }
        }

// Power Plant design model provided by Bentley Systems
        var bimUrl = IonResource.fromAssetId(3837);
        var pointCloudUrl = IonResource.fromAssetId(3838);
        var instancedUrl = IonResource.fromAssetId(3876);
        var modelUrl = '../../../../Apps/SampleData/models/CesiumAir/Cesium_Air.glb';

        loadTileset(bimUrl);

// Track and create the bindings for the view model
        var toolbar = document.getElementById('toolbar');
        knockout.track(viewModel);
        knockout.applyBindings(viewModel, toolbar);

        knockout.getObservable(viewModel, 'currentExampleType').subscribe(function(newValue) {
            reset();

            if (newValue === clipObjects[0]) {
                loadTileset(bimUrl);
            } else if (newValue === clipObjects[1]) {
                loadTileset(pointCloudUrl).then(function(tileset) {
                    tileset.clippingPlanes.modelMatrix = Transforms.eastNorthUpToFixedFrame(tileset.boundingSphere.center);
                });
            } else if (newValue === clipObjects[2]) {
                loadTileset(instancedUrl).then(function(tileset) {
                    tileset.clippingPlanes.modelMatrix = Transforms.eastNorthUpToFixedFrame(tileset.boundingSphere.center);
                });
            } else {
                loadModel(modelUrl);
            }
        });

        knockout.getObservable(viewModel, 'debugBoundingVolumesEnabled').subscribe(function(value) {
            if (defined(tileset)) {
                tileset.debugShowBoundingVolume = value;
            }
        });

       knockout.getObservable(viewModel, 'edgeStylingEnabled').subscribe(function(value) {
            var edgeWidth = value ? 1.0 : 0.0;

            if (defined(tileset)) {
                tileset.clippingPlanes.edgeWidth = edgeWidth;
            }

            if (defined(modelEntityClippingPlanes)) {
                modelEntityClippingPlanes.edgeWidth = edgeWidth;
            }
        });

        function reset() {
            viewer.entities.removeAll();
            viewer.scene.primitives.remove(tileset);
            planeEntities = [];
            targetY = 0.0;
            tileset = undefined;
        }




    }
    render(){
        return(
            <div>
                <div id="cesiumContainer" class="fullSize"></div>
                <div id="loadingOverlay"><h1>Loading...</h1></div>
                <div id="toolbar">
                    <select data-bind="options: exampleTypes, value: currentExampleType"></select>
                    <input type="checkbox" value="false" data-bind="checked: debugBoundingVolumesEnabled, valueUpdate: 'input'"/> Show bounding volume
                        <input type="checkbox" value="true" data-bind="checked: edgeStylingEnabled, valueUpdate: 'input'"/> Enable edge styling
                </div>
            </div>
        )
    }
}

export default twoFlat