import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import './App.css';

import Header from './Component/Header'
import Home from './Component/Home'

/**** 功能里面的组件 ****/
import FHouse from './Component/FHouse.js'
import FThermo from './Component/FThermo.js'
import FGlobal from './Component/FGlobal.js'
import FTraj from './Component/FTraj.js'
import FAir from './Component/FAir.js'
import Flonglat from './Component/Flonglat.js'
import towFlat from './Component/towFlat.js'
/**** 其他里面的组件 ****/
import Others1 from './Component/Others1'
import Others2 from './Component/Others2'

import Footer from './Component/Footer'

class SAP extends Component {
  constructor(props) {
      super(props);
      this.state = {
        funControl: false,
        otherControl: false
      };
  }
  handleClick(){
    this.setState({
      funControl: false,
      otherControl: false
    })
  }
  handleFunClick() {
    this.setState({
      funControl: !this.state.funControl,
      otherControl: false
    });
  }
  handleOtherClick(){
    this.setState({
      otherControl: !this.state.otherControl,
      funControl: false
    });
  }
  render(){
    let funCls = 'dropdown-content';
    let otherCls = 'dropdown-content';

    let dropbtn1 = 'dropbtn dropbtnshow';
    let dropbtn2 = 'dropbtn';
    let dropbtn3 = 'dropbtn';

    if(this.state.funControl){
      dropbtn1 = 'dropbtn';
      dropbtn3 = 'dropbtn';
      dropbtn2 += ' dropbtnshow';
      funCls += ' funStyle';
      otherCls = 'dropdown-content';
    }
    if(this.state.otherControl){
      dropbtn1 = 'dropbtn';
      dropbtn2 = 'dropbtn';
      dropbtn3 += ' dropbtnshow';
      otherCls += ' otherStyle';
      funCls = 'dropdown-content';
    }
      return(<div id="box" >
        <Router>
          <div>
            <div id="box-left">
              <ul>
                <li className="dropdown">
                  <Link to="/" className={dropbtn1} onClick={this.handleClick.bind(this)}>首页</Link>
                </li>
                <li>
                  <Link to="/func/" className={dropbtn2} onClick={this.handleFunClick.bind(this)}>功能</Link>
                  <ul className={funCls}>
                    <li className="a"><Link to='/func/'>楼宇</Link></li>
                    <li className="a"><Link to='/func/thermo'>热力图</Link></li>
                    <li className="a"><Link to='/func/global'>3D球型图</Link></li>
                     <li className="a"><Link to='/func/Flonglat'>经纬度显示</Link></li>
                    <li className="a"><Link to='/func/traj'>人员轨迹的控制</Link></li>
                    <li className="a"><Link to='/func/air'>飞机轨迹的还原</Link></li>        
                     <li className="a"  ><Link to='/func/towFlat'>平面缓存</Link></li>
                  </ul>
                </li>
                <li>
                  <Link to="/others/" className={dropbtn3} onClick={this.handleOtherClick.bind(this)}>其他</Link>   
                  <ul className={otherCls}>
                    <li className="a"><Link to='/others/'>使用说明</Link></li>
                    <li className="a"><Link to='/others/others2'>版本维护</Link></li>
                  </ul>
                </li>
              </ul>
            </div>
            <div id='box-right'>
              <Route exact path="/" component={Home} />

              <Route exact path="/func/" component={FHouse} />
              <Route path='/func/thermo' component={FThermo} />
              <Route path='/func/global' component={FGlobal} />
              <Route path='/func/Flonglat' component={Flonglat} />
              <Route path='/func/traj' component={FTraj} />
              <Route path='/func/air' component={FAir} />
              
               <Route path='/func/towFlat' component={towFlat} />
              <Route exact path='/others/' component={Others1} />
              <Route path='/others/others2' component={Others2} />
            </div>            
          </div>
        </Router>
      </div>)
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
          <Header />
           <SAP id={"SAP"}/>
          <Footer />
      </div>
    );
  }
}


export default App