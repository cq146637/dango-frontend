import React, {Component, Fragment} from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './style.css'
import './style1.less'

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            list: []
        };
        this.handleToggole = this.handleToggole.bind(this);
    }

    handleToggole() {
        this.setState((prveState) => {
            return {
                list: [...prveState.list, 'item']
            }
        })
    }

    render() {
        return (
            <Fragment>
                <TransitionGroup>
                    {
                        this.state.list.map((item, index) => {
                            return (
                                <CSSTransition
                                    key={index}
                                    timeout={1000}
                                    classNames="fade"
                                    unmountOnExit
                                    onEntered={(el) => {el.style.color='red'}}
                                    appear={true}
                                >
                                    <div className='content'>{item}</div>
                                </CSSTransition>  
                            )
                        })
                    }
                </TransitionGroup>
                <button onClick={this.handleToggole}>toggle</button>
            </Fragment>
        )
    }
}