import React, {Component, Fragment} from 'react'
import TodoItem from './TodoItem'
import axios from 'axios'
// 发送Ajax需要导入包

export default class TodoList extends Component{
    
    constructor(props){
        // 当组件的state或者props发生改变的时候，render函数就会重新执行
        super(props);
        this.state = {
            list: [],
            inputValue: ''
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleBtnClick = this.handleBtnClick.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleBtnClick(){
        this.setState({
            list: [...this.state.list, this.state.inputValue],
            inputValue: ''
        })
    }

    // 箭头函数的使用
    handleInputChange(e) {
        const value = e.target.value;
        this.setState(() => ({
            inputValue: value
        }));
    }

    handleLiClick(index) {
        const list = [...this.state.list]
        list.splice(index, 1)
        this.setState({list})
    }

    handleDelete(index) {
        const list = [...this.state.list]
        list.splice(index, 1)
        this.setState({list})
    }

    getTodoItems() {
        return (
            this.state.list.map((item, index) => {
                // return <li key={index} onClick={this.handleLiClick.bind(this, index)}>{item}</li>
                return (
                    <TodoItem 
                        delete={this.handleDelete} 
                        content={item} 
                        index={index} 
                        key={index}
                    />
                );
            })
        )
    }

    componentDidMount() {
        axios.get('/api/todolist')
        // .then((res) => {
        //     this.setState(() => {
        //         return {
        //             list: res.data
        //         }
        //     });
        // })
        .then((res) => {
            this.setState(() => ({
                list: [...res.data]
            }));
        })
        .catch(() => {alert('error')})
    }


    render(){
        return (
            <Fragment>
                <div>
                    <input value={this.state.inputValue} onChange={this.handleInputChange}/>
                    <button className='btn-css' onClick={this.handleBtnClick}>add</button>
                </div>
                <ul>{this.getTodoItems()}</ul>
            </Fragment>
        );
    }
}