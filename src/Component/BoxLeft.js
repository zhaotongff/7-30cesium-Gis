import React,{Component} from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Home from './Home'
import Trag from './Trag'
import Thermo from './Thermo'

class BoxLeft extends Component{
  render(){
    return(
      <div id="box-left">
        <Router>
                <div>
                  <ul>
                    <li>
                      <Link to="/">飞行图</Link>
                    </li>
                    <li>
                      <Link to="/traj">行走轨迹</Link>
                    </li>
                    <li>
                      <Link to="/thermo">热力图</Link>
                    </li>
                  </ul>

                  <hr />
                  <Route exact path="/" component={Home} />
                  <Route path="/traj" component={Trag} />
                  <Route path="/thermo" component={Thermo} />

                  
                </div>
              </Router>
      </div>
    )
  }
}

export default BoxLeft