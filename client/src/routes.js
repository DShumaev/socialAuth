import React from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import {MainPage} from "./pages/MainPage"
import {AuthPage} from "./pages/AuthPage"


export const useRoutes = isAuthenticated => {

    if (isAuthenticated) {
        return (
            <Switch>
                <Route path="/main" exact>
                    <MainPage />
                </Route>
                <Redirect to="/main" />
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path="/auth" exact>
                <AuthPage />
            </Route>
            <Redirect to="/auth" />
        </Switch>
    )
}

