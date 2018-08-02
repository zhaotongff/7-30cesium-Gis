import React, { Component } from 'react';

import Viewer from "cesium/Source/Widgets/Viewer/Viewer";

import Cesium3DTileset from "cesium/Source/Scene/Cesium3DTileset";

import IonResource from "cesium/Source/Core/IonResource";
import h337 from 'heatmap.js/build/heatmap.js'

import "./stylesheet/landingpage.css"
//import "./stylesheet/prism.css"
import "./stylesheet/commons.css"

class FThermo extends Component{
componentDidMount() {
var viewer = new Viewer('cesiumContainer');   

var tileset = new Cesium3DTileset({
    url: IonResource.fromAssetId(3836)
});

viewer.scene.primitives.add(tileset);
viewer.zoomTo(tileset);//这是一个动画效果，进入后镜头就会自动转到这个实体处
  var ex1el = document.querySelector('.example-1');//dom元素选取.example-1的区域
       
        var heatmap1 = h337.create({//创建heatmap1对象  自动在右上角图片中创建热力图

          container: ex1el, //domNode  heatmap载体   只需要一个container，也就是最终要绘制图形的dom节点，
      
 
        });
      
        var count=1;
var countval=document.getElementById("data3")
        var refreshHeatmap1 = function() {

          var data1 = {};

          var datap1 = [];

          var max1 = 0;

          var w = 620;

          var h = 270;

          var l = 180;

          while(l--) {

            var val = Math.random()*10;

            max1 = Math.max(max1, val);

            var d = {

              x: Math.floor(Math.random()*w+30),

              y: Math.floor(Math.random()*h+30),

              value: val

            };
           
            datap1.push(d);

          }

          data1["max"] = max1;

          data1["data"] = datap1;

          heatmap1.setData(data1);
           

        };

        refreshHeatmap1();

        window.requestAnimationFrame = (function(){

          return  window.requestAnimationFrame       ||

                  window.webkitRequestAnimationFrame ||

                  window.mozRequestAnimationFrame    ||

                  function( callback ){

                    window.setTimeout(callback, 1000 / 60);

                  };

        })();

      var double=function(){
        var body = document.body;
        var bodyStyle = getComputedStyle(body);

        var hmEl = document.querySelector('.heatmap-wrapper');

        hmEl.style.width = bodyStyle.width;

        hmEl.style.height = '1400px';



        var hm = document.querySelector('#heatmap');



        var heatmap = h337.create({

          container: hm

        });


        var trackData = false;

        setInterval(function() {

          trackData = true;

        }, 50);

        var idleTimeout, idleInterval;

        var lastX=3, lastY;

        var idleCount;
        function startIdle() {
          idleCount = 0;
          function idle() {
            heatmap.addData({
              x: lastX,

              y: lastY
            });

            idleCount++;

            if (idleCount >100) {

              clearInterval(idleInterval);
            }

          };

          idle();

          idleInterval = setInterval(idle, 1000);

        };


         //鼠标移动函数
        var datax=document.getElementById("data1");
        var datay=document.getElementById("data2");
        body.onmousemove = function(ev) {

          if (idleTimeout) clearTimeout(idleTimeout);

          if (idleInterval) clearInterval(idleInterval);

          if (trackData) {

            lastX = ev.pageX;

            lastY = ev.pageY;


            heatmap.addData({

              x: lastX,

              y: lastY

            });

     
  }
           datax.innerHTML=ev.pageX+"px"
           datay.innerHTML=ev.pageY+"px"
   
            trackData = false;


          };

  // ex1el.onclick = function() {
  //          countval.innerHTML=count;
  //           count=count+1;
  //         refreshHeatmap1();
  //         body.onmousemove();
  //       };}
      
          idleTimeout = setTimeout(startIdle, 5000);
 }
   double();
  ex1el.onclick = function() {
           countval.innerHTML=count;
            count=count+1;
          refreshHeatmap1();
          double();
        };


}
render(){
  return(
    <div>
       <div id="cesiumContainer" ref={ element => this.cesiumContainer = element }/>
     
           <div class="heatmap-wrapper" >
                  <div id="heatmap" >
                </div>  
                
                    <div id="datas" >

                        x:<span id="data1"></span>
                      <br/>
                       y:<span id="data2"></span>
                       <br/>
                        count:<span id="data3"></span>
                        <div className="example-1" >
                    <button class="btn-gethm btn">切换</button>  
                    </div>
                    </div> 
 
             </div>
                  
             
       
    </div>
  )
}
}
export default FThermo





/*/* import React, { Component } from 'react';*/
// /*import h337 from 'heatmap.js/build/heatmap.min.js'*/
// import h337 from 'heatmap.js/build/heatmap.js'
// import Viewer from "cesium/Source/Widgets/Viewer/Viewer";

// import Cesium3DTileset from "cesium/Source/Scene/Cesium3DTileset";

// import IonResource from "cesium/Source/Core/IonResource";
// import "./stylesheet/landingpage.css"
// //import "./stylesheet/prism.css"
// import "./stylesheet/commons.css"
// class FThermo extends Component{

// constructor(props) {
//       super(props);
//       this.state = {
//        lastX:0,
//        lastY:0,
//        valueo:0
//       }
//      //this.handelMove=this.handelMove.bind(this)
     
//   }

  

// componentDidMount() {
//   /*this.viewer = new Viewer(this.cesiumContainer,{
//         shouldAnimate : true,     
//         infoBox: false, //Disable InfoBox widget
//         selectionIndicator: false, //Disable selection indicator  
//       });

//     //Enable lighting based on sun/moon positions
//     this.viewer.scene.globe.enableLighting = true;

//     //Enable depth testing so things behind the terrain disappear.
//     this.viewer.scene.globe.depthTestAgainstTerrain = true;
//    */
     
   
// var count=1;
// var countval=document.getElementById("data3")
//         var refreshHeatmap1 = function() {

//           var data1 = {};

//           var datap1 = [];

//           var max1 = 0;

//           var w = 320;

//           var h = 270;

//           var l = 50;

//           while(l--) {

//             var val = Math.random()*10;

//             max1 = Math.max(max1, val);

//             var d = {

//               x: Math.floor(Math.random()*w),

//               y: Math.floor(Math.random()*h),

//               value: val

//             };
           
//             datap1.push(d);

//           }

//           data1["max"] = max1;

//           data1["data"] = datap1;

//           heatmap1.setData(data1);
           

//         };

//         refreshHeatmap1();

//         ex1el.onclick = function() {
//            countval.innerHTML=count;
//             count=count+1;
//           refreshHeatmap1();
         
       

 
//         };
 
        
//         window.requestAnimationFrame = (function(){

//           return  window.requestAnimationFrame       ||

//                   window.webkitRequestAnimationFrame ||

//                   window.mozRequestAnimationFrame    ||

//                   function( callback ){

//                     window.setTimeout(callback, 1000 / 60);

//                   };

//         })();




//         var body = document.body;
//         var bodyStyle = getComputedStyle(body);

//         var hmEl = document.querySelector('.heatmap-wrapper');

//         hmEl.style.width = bodyStyle.width;

//         hmEl.style.height = '1400px';



//         var hm = document.querySelector('#heatmap');



//         var heatmap = h337.create({

//           container: hm

//         });


//         var trackData = false;


//         setInterval(function() {

//           trackData = true;

//         }, 50);


//         var idleTimeout, idleInterval;

//         var lastX=3, lastY;

//         var idleCount;
//         function startIdle() {
//           idleCount = 0;
//           function idle() {
//             heatmap.addData({
//               x: lastX,

//               y: lastY
//             });

//             idleCount++;

//             if (idleCount > 10) {

//               clearInterval(idleInterval);
//             }

//           };

//           idle();

//           idleInterval = setInterval(idle, 1000);

//         };


//          //鼠标移动函数
//         var datax=document.getElementById("data1");
//         var datay=document.getElementById("data2");
//         body.onmousemove = function(ev) {

//           if (idleTimeout) clearTimeout(idleTimeout);

//           if (idleInterval) clearInterval(idleInterval);

//           if (trackData) {

//             lastX = ev.pageX;

//             lastY = ev.pageY;


//             heatmap.addData({

//               x: lastX,

//               y: lastY

//             });

          
          
         
//   }


//            datax.innerHTML=ev.pageX+"px"
//            datay.innerHTML=ev.pageY+"px"

//            // console.log(lastX)
//   /*console.log(heatmap.getData().data)*/
   
   
//             trackData = false;


//           };





//        //    ex1el.onclick = function() {
//        //     countval.innerHTML=count;
//        //      count=count+1;
//        //    refreshHeatmap1();
//        // body.onmousemove();

 
//        //  };
 
                    




//           idleTimeout = setTimeout(startIdle, 500000);

       

        
//         /*setTimeout(function() {

//           document.querySelector('.sharer').classList.add('show');

//         },1000);*/



//       };




//  render(){
//     return(
//        <div>
//        <div id="cesiumContainer" ref={ element => this.cesiumContainer = element }>
//            <div class="heatmap-wrapper" >
//                   <div id="heatmap" ></div>     
//             </div>
                  
//               <div class="example-1" >
//                       <button class="btn-gethm btn"></button>
//              </div>
//              <div id="datas" >
//              x:<span id="data1"></span>
//              <br/>
//              y:<span id="data2"></span>
//              <br/>
//              count:<span id="data3"></span>
//              </div>
//       </div>

//        </div>
//       )


//   }


// }


// export default FThermo