import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
//import App from './App';
// import TodoList from './pages/todolist/TodoList';
// import './pages/todolist/style.css'
// import App from './pages/cartoon/App'
// import App from './pages/transitiongroup/App'
// import App from './pages/multi-transition/App'
// import App from './pages/demo/App'
// import Admin from './admin'
// import Home from './test/router-demo/router1/Home'
// import Router from './test/router-demo/route2/router'
// import Router from './test/router-demo/route3/router'
import Router from './router';
import { Provider } from 'react-redux'
import configureStore from './redux/store/configureStore'

const store = configureStore()
ReactDOM.render(
    <Provider store={store}>
        <Router />
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();
