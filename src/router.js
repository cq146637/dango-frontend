import React from 'react'
import { HashRouter, Route, Switch} from 'react-router-dom'
import App from './App'
import Admin from './admin'
import Home from './pages/home'
import NoMatch from './pages/nomatch'
import Standard from './pages/standard'
import Room from './pages/room'
import Administrator from './pages/admin'
import Customer from './pages/customer'
import Order from './pages/order'
import Remark from './pages/remark'
import Picture from './pages/picture'


export default class ERouter extends React.Component{

    render(){
        return (
            <HashRouter>
                <App>
                    <Switch>
                        <Route path="/" render={()=>
                            <Admin>
                                <Switch>
                                    <Route path='/home' component={Home} />
                                    <Route path='/standard' component={Standard} />
                                    <Route path='/room' component={Room} />
                                    <Route path='/user/admin' component={Administrator} />
                                    <Route path='/user/customer' component={Customer} />
                                    <Route path='/order' component={Order} />
                                    <Route path='/remark' component={Remark} />
                                    <Route path='/pic' component={Picture} />
                                    <Route component={NoMatch} />
                                </Switch>
                            </Admin>         
                        } />
                    </Switch>
                </App>
            </HashRouter>
        );
    }
}