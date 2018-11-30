import React, {Component, Fragment} from 'react'
import './style.css'

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: true
        };
        this.handleToggole = this.handleToggole.bind(this);
    }

    handleToggole() {
        this.setState({
            show: this.state.show ? false : true
        })
    }

    render() {
        return (
            <Fragment>
                <div className={this.state.show ? 'show': 'hide'}>hello world!</div>
                <button onClick={this.handleToggole}>toggle</button>
            </Fragment>
        )
    }
}