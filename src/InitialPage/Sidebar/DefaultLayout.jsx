import React, { createContext, useEffect, useState } from "react";
import { Route, withRouter } from "react-router-dom";

import routerService from "../../Router";
import Header from "./Header";
import Sidebar from "./Sidebar";


export const NotificationsContext = createContext()

const DefaultLayout =(props)=> {
  let storage = JSON.parse(localStorage.getItem("auth"))
    const { match } = props;
    const [notifications, setNotifications] = useState([
      { message: `${storage.name} welcome to Tinatett POS`, time: new Date().toISOString()}
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
