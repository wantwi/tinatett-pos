import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom';
import Newuser from './newuser'
import Userlists from './userlists'
import Newuseredit from './newuseredit'
import NewBranch from './newbranch';
import BranchList from './BranchList';





const UserIndex = ({ match}) =>(
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/newuser`} />
        <Route path={`${match.url}/newuser`} component={Newuser} />                                                                                             
        <Route path={`${match.url}/userlists`} component={Userlists} />                                                                                             
        <Route path={`${match.url}/newuseredit`} component={Newuseredit} />     
        <Route path={`${match.url}/new-branch`} component={NewBranch} />    
        <Route path={`${match.url}/branch-list`} component={BranchList} />                                                                                         
                                                                                                  
        
    </Switch>
)

export default UserIndex