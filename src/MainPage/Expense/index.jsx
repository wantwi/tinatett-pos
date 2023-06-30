import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom';
import ExpenseList from './ExpenseList.jsx'
import AddExpense from './AddExpense.jsx';
import EditExpense from './EditExpense.jsx';
import ExpenseCategory from './ExpenseCategory.jsx';

const PurchaseRoute = ({ match}) =>(
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/expenselist`} />
        <Route path={`${match.url}/expenselist`} component={ExpenseList} />
        <Route path={`${match.url}/addexpense`} component={AddExpense} />
        <Route path={`${match.url}/editexpense`} component={EditExpense} />
        <Route path={`${match.url}/expensecategory-expense`} component={ExpenseCategory} />
    </Switch>
)

export default PurchaseRoute;