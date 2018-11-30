import React, {Component, Fragment} from 'react'
import { CSSTransition } from 'react-transition-group';
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
                <CSSTransition
                    in={this.state.show}
                    timeout={1000}
                    classNames="fade"
                    unmountOnExit
                    onEntered={(el) => {el.style.color='red'}}
                    appear={true}
                >
                    <div>hello world!</div>
                </CSSTransition>
                <button onClick={this.handleToggole}>toggle</button>
            </Fragment>
        )
    }
}