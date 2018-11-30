import React from 'react'

export default class first extends React.Component{

    componentWillMount(){
        console.log("componentWillMount")
    }

    componentDidMount(){
        console.log("componentDidMount")
    }

    // 一个组件从父组件接受参数
    // 只要父组件的render函数被执行了，子组件的这个生命周期就会被自动执行
    componentWillReceiveProps(newProps){
        console.log("componentWillReceiveProps" + newProps.name)
    }

    shouldComponentUpdate(){
        console.log("shouldComponentUpdate")
        return true
    }

    componentWillUpdate(){
        console.log("componentWillUpdate")
    }

    componentDidUpdate(){
        console.log("componentDidUpdate")        
    }

    render(){
        return <div>
            <p>子组件！！！！here</p>
            <p>{this.props.name}</p>
        </div>
    }

}