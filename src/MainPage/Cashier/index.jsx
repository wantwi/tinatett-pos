import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom';
import Cashier from './cashier';
import CreditPayment from './creditpayment';




const CashierIndex = ({ match}) =>(
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/generalsettings`} />                                                                                                                                                                                   
        <Route path={`${match.url}/sales-payment`} component={Cashier} />  
        <Route path={`${match.url}/credit-payment`} component={CreditPayment} />                                                                                                                                                                                                                                                                                                                                                             
                                                                                        
    </Switch>
)


export default CashierIndex