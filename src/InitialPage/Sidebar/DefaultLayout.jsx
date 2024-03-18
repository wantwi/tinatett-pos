import React, { createContext, useEffect, useState } from "react";
import { Route, withRouter } from "react-router-dom";

import routerService from "../../Router";
import Header from "./Header";
import Sidebar from "./Sidebar";


export const AppContext = createContext()

const DefaultLayout =(props)=> {
  let storage = JSON.parse(localStorage.getItem("auth"))
    const { match } = props;
    const [notifications, setNotifications] = useState([
      { message: `${storage.name} welcome to Tinatett POS`, time: new Date().toISOString()}
    ])
    const [selectedBranch, setSelectedBranch] = useState({label:'Select Branch', value:'00000000-0000-0000-0000-000000000000'})
    
    useEffect(() => {
      const loggedInUser = localStorage.getItem('auth')
      if(!loggedInUser){
        window.location.href = '/'
      }
    }, [])


 
    return (
      <>
      <AppContext.Provider value={{notifications, setNotifications, selectedBranch, setSelectedBranch}}>
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
      </AppContext.Provider >
        <div className="sidebar-overlay"></div>
       
      </>
    );
}

export default withRouter(DefaultLayout);
