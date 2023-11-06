import React, { useState, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import SignIn from './SignIn'
import ForgetPassword from './ForgetPassword';
import SignUp from './SignUp'
import Pos from './pos/pos'
import DefaultLayout from './Sidebar/DefaultLayout';

import Error404 from '../MainPage/ErrorPage/Error404';
import Error500 from '../MainPage/ErrorPage/Error500';


//use Query imports
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from '../ErrorBoundary';


export default function App(props) {



    const client = new QueryClient({
        defaultOptions: {
          refetchOnWindowsFocus: true
        }
      });


    useEffect(() => {
        if (location.pathname.includes("signIn") || location.pathname.includes("signUp") || location.pathname.includes("forgetPassword")) {
            $('body').addClass('account-page');
        }    
    }, [])

   
        const { location } = props;

        if (location.pathname === "/") {
            return (<Redirect to={'/signIn'} />)
        }

        return (
            <Switch>
               
                <ErrorBoundary>
                    <QueryClientProvider client={client}>
                        <Route path="/signIn" component={SignIn} />
                        <Route path="/forgetPassword" component={ForgetPassword} />
                        <Route path="/signUp" component={SignUp} />
                        <Route path="/tinatett-pos" component={DefaultLayout} />
                        <Route path="/error-404" component={Error404} />
                        <Route path="/error-500" component={Error500} />
                        <Route path="/pos" component={Pos} />
                    </QueryClientProvider>
                </ErrorBoundary>
                
            </Switch>
        )
    
}
