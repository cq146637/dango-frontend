import React from 'react'
import PropTypes from 'prop-types'


export default class TodoItem extends React.Component {

    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete() {
        this.props.delete(this.props.index)
    }

    shouldComponentUpdate(nextProp, nextState) {
        if(nextProp.content !== this.props.content) {
            return true;
        } else {
            return false;
        }
    }

    render() {
        // 当父组件的render的执行时，子组件的render也会重新执行一次
        const { content } = this.props
        return (
            <li onClick={this.handleDelete}>{content}</li>
        )
    }
}

// 参数属性校验
TodoItem.propTypes = {
    content: PropTypes.string.isRequired,
    delete: PropTypes.func,
    index: PropTypes.number
}

// 默认属性校验
TodoItem.defaultProps = {
    content: 'test',
    index: 0
}