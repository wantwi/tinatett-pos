import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom';
import Purchaseorder from './purchaseorder'

import Sales from './sales'
import Invoices from './invoices'

import Supplier from './supplier'
import Customer from './customer'
import PurchaseSummary from './purchaseSummary';
import ProductReport from './product';
import SalesSummary from './salesSummary';
import StockReport from './stockreport';
import TransferReport from './transfer';
import TransferSummaryReport from './transferSummary';
import ProductMovement from './productMovement';
import WeeklySummary from './weeklySummary';
import Expenses from './expenses';


const AppIndex = ({ match }) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/purchaseorderreport`} />
        <Route path={`${match.url}/purchaseorderreport`} component={Purchaseorder} />
        <Route path={`${match.url}/inventoryreport`} component={ProductReport} />
        <Route path={`${match.url}/salesreport`} component={Sales} />
        <Route path={`${match.url}/invoicereport`} component={Invoices} />
        <Route path={`${match.url}/purchase-summary-report`} component={PurchaseSummary} />
        <Route path={`${match.url}/sales-summary-report`} component={SalesSummary} />
        <Route path={`${match.url}/supplierreport`} component={Supplier} />
        <Route path={`${match.url}/customerreport`} component={Customer} />
        <Route path={`${match.url}/stock-report`} component={StockReport} />
        <Route path={`${match.url}/transfer-report`} component={TransferReport} />
        <Route path={`${match.url}/transfer-summary-report`} component={TransferSummaryReport} />
        <Route path={`${match.url}/product-movement`} component={ProductMovement} />
        <Route path={`${match.url}/weekly-summary`} component={WeeklySummary} />
        <Route path={`${match.url}/expenses`} component={Expenses} />

    </Switch>
)

export default AppIndex