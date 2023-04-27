import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom';
import Saleslist from './saleslist'
import AddProforma from './addproforma'
import Editsales from './editsales'
import Saledetails from './saledetails'
import SalesReturnList from '../Return/SalesReturnList'
import AddSalesReturn from '../Return/AddSalesReturn'







const ProformaIndex = ({ match}) =>(
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/generalsettings`} />
        <Route path={`${match.url}/proformalist`} component={Saleslist} />                                                                                                                                                                                        
        <Route path={`${match.url}/add-proforma`} component={AddProforma} />                                                                                                                                                                                        
        <Route path={`${match.url}/edit-proforma`} component={Editsales} />                                                                                                                                                                                        
        <Route path={`${match.url}/proforma-details`} component={Saledetails} />                                                                                               
    </Switch>
)

export default ProformaIndex