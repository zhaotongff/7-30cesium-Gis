import React, { Component } from 'react';
import bg from '../bg.png'

class Home extends Component{
	constructor(props){
		super(props)
		this.state = {
			username: '',
			password: '',
			errorTip: '',
		}
	}
	showSubmit(){
			this.refs.homeSubmit.style.display = 'block'
	}
	handleClick(){		
		if(this.state.username==='admin' && this.state.password==='123'){
			this.setState({
				errorTip: "登录成功"
			})
			this.refs.homeSubmit.style.display = 'none'
			this.refs.loginShow.style.display = 'none'
		}else{
			this.setState({
				errorTip: "请输入正确的用户名或密码"
			})
		}
	}
	changeUsername(event){
		this.setState({
			username: event.target.value
		})
	}
	changePassword(event){
		this.setState({
			password: event.target.value
		})
	}
	render(){
		return(
			<div className='home-main'>
				<div className="home-middle">
		            <img src={bg} alt="logo" />
		            <div className="home-middle-right" ref='loginShow'>
		            	<button className="login">注册</button>
		                <button className="login" onClick={this.showSubmit.bind(this)}>登陆</button>
		            </div>

		            <div className='home-submit' ref='homeSubmit'>
						<div className='home-field'>
							<span className='home-field-name'>用户名：</span>
							<div className='home-field-input'>
								<input type='username' onChange={this.changeUsername.bind(this)}/>
							</div>
						</div>
						<div className='home-field'>
							<span className='home-field-name'>密码：</span>
							<div className='home-field-input'>
								<input type='password' onChange={this.changePassword.bind(this)}/>
							</div>
						</div>
						<div id='error'>{this.state.errorTip}</div>
						<div className='home-field-button'>
							<button onClick={this.handleClick.bind(this)}>
								登录
							</button>
						</div>
					</div>  
            	</div>        
          

		        <div className="home-right">
	            <p className="text">项目简介:</p>
	            <p className="text">本项目自2018年7月9日起实施，项目组成员通过多方面调研，最终确定利用支持3D技术gis开源前端框架CesiumJS实现，主要完成的功能包括：3D可视化模型、楼宇模型、热力图</p>
				</div>
			</div>
		)
	}
}

export default Home;