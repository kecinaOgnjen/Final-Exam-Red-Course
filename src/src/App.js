import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import HomeScreen from "./Page/HomeScreen";
import history from './history';

export default class App extends React.Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/">
                        <HomeScreen/>
                    </Route>
                </Switch>
            </Router>
        );
    }
}
