import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom';
import ProformaList from './proformaList'
import AddProforma from './addproforma'
import ProformaDetail from './proformaDetails';
import EditProforma from './editproforma';


const ProformaIndex = ({ match}) =>(
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/generalsettings`} />
        <Route path={`${match.url}/proformalist`} component={ProformaList} />                                                                                                                                                                                        
        <Route path={`${match.url}/add-proforma`} component={AddProforma} />                                                                                                                                                                                        
        <Route path={`${match.url}/edit-proforma`} component={EditProforma} />                                                                                                                                                                                        
        <Route path={`${match.url}/proforma-details`} component={ProformaDetail} />                                                                                               
    </Switch>
)

export default ProformaIndex