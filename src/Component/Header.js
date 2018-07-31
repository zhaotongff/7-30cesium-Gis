import React,{Component} from 'react'
import logo from '../logo.png'

class Header extends Component{
	render(){
		return(
			<header className="AppHeader">
				<div className='AppLeft'>
					<h1>GIS可视化设计项目</h1>
					<img src={logo} className="bigLogo" alt="logo" />
				</div>
				<div className='AppCenter'>
	            	<p className="AppTitle">GIS可视化设计项目</p>
				</div>
	            <span className='welcome'>欢迎你，admin</span>
	        </header>
		)
	}
}

export default Header