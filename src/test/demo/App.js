import React from 'react'
import Child from './Child'
import {Button} from 'antd'

export default class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            count: 0
        };
    }

    handleAdd=()=>{
        this.setState({
            count: this.state.count + 1
        })
    }

    handleClick(){
        this.setState({
            count: this.state.count + 1
        })
    }
    
    render(){
        return <div>
            <p>React生命周期</p>
            <Button onClick={this.handleClick.bind(this)}>点击一下</Button><br/>
            <button onClick={this.handleClick.bind(this)}>点击一下</button><br/>
            <button onClick={this.handleAdd}>点击一下</button>
            <p>{this.state.count}</p>
            <Child name={this.state.count}></Child>
        </div>
    }
}