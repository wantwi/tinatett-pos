import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom';
import Purchaseorder from './purchaseorder'
import Inventry from './inventry'
import Sales from './sales'
import Invoices from './invoices'
import Purchase from './purchaseSummary'
import Supplier from './supplier'
import Customer from './customer'
import PurchaseSummary from './purchaseSummary';





const AppIndex = ({ match}) =>(
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/purchaseorderreport`} />
        <Route path={`${match.url}/purchaseorderreport`} component={Purchaseorder} />                                                                                             
        <Route path={`${match.url}/inventoryreport`} component={Inventry} />                                                                                             
        <Route path={`${match.url}/salesreport`} component={Sales} />                                                                                             
        <Route path={`${match.url}/invoicereport`} component={Invoices} />                                                                                             
        <Route path={`${match.url}/purchase-summary-report`} component={PurchaseSummary} />                                                                                             
        <Route path={`${match.url}/supplierreport`} component={Supplier} />                                                                                             
        <Route path={`${match.url}/customerreport`} component={Customer} />                                                                                             
        
    </Switch>
)

export default AppIndex