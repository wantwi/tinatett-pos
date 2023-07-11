import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom';
import AddTransfer from './AddTransfer';
import ImportTransfer from './ImportTransfer';
import TransferList from './TransferList';
import EditTransfer from './EditTransfer';
import TransferProformaItems from './TransferProformaItems';


const TransferRoute = ({ match}) =>(
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/transferlist-transfer`} />
        <Route path={`${match.url}/transferlist-transfer`} component={TransferList} />
        <Route path={`${match.url}/addtransfer-transfer`} component={AddTransfer} />
        <Route path={`${match.url}/importtransfer-transfer`} component={ImportTransfer} />
        <Route path={`${match.url}/edittransfer-transfer`} component={EditTransfer} />
        <Route path={`${match.url}/proforma-transfer`} component={TransferProformaItems} />

    </Switch>
)

export default TransferRoute;