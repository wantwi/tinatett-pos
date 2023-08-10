import React, { createContext, useEffect, useState } from "react";
import { Route, withRouter } from "react-router-dom";

import routerService from "../../Router";
import Header from "./Header";
import Sidebar from "./Sidebar";


export const NotificationsContext = createContext()

const DefaultLayout =(props)=> {
    const { match } = props;
    const [notifications, setNotifications] = useState([
      { message: "Augustine Akoto welcome to Tinatett POS", time: '2023-08-09T15:29:01+0000'}
    ])
    
    useEffect(() => {
      const loggedInUser = localStorage.getItem('auth')
      if(!loggedInUser){
        window.location.href = '/'
      }
    }, [])


 
    return (
      <>
      <NotificationsContext.Provider value={{notifications, setNotifications}}>
        <div className="main-wrapper">
          <Header />
          <div>
            {routerService &&
              routerService.map((route, key) => (
                <Route
                  key={key}
                  path={`${match.url}/${route.path}`}
                  component={route.component}
                />
              ))}
          </div>
          <Sidebar />
        </div>
      </NotificationsContext.Provider >
        <div className="sidebar-overlay"></div>
       
      </>
    );
}

export default withRouter(DefaultLayout);
