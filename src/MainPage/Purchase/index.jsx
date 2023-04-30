import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom';
import AddPurchase from './AddPurchase';
import PurchaseList from './PurchaseList';
import ImportPurchase from './ImportPurchase';
import EditPurchase from './EditPurchase';

const PurchaseRoute = ({ match}) =>(
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/purchaselist`} />
        <Route path={`${match.url}/purchaselist`} component={PurchaseList} />
        <Route path={`${match.url}/addpurchase`} component={AddPurchase} />
        <Route path={`${match.url}/importpurchase`} component={ImportPurchase} />
        <Route path={`${match.url}/editpurchase`} component={EditPurchase} />


    </Switch>
)

export default PurchaseRoute;