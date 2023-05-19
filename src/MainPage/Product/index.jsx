import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom';
import ProductList from './ProductList'
import AddProduct from './AddProduct'
import EditProduct from './EditProduct'

import ImportProduct from './ImportProduct';
import PrintBarcode from './PrintBarcode';
import ProductDetails from './productDetails';

const ProductRoute = ({ match }) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/productlist`} />
        <Route path={`${match.url}/productlist`} component={ProductList} />
        <Route path={`${match.url}/addproduct`} component={AddProduct} />
        <Route path={`${match.url}/editproduct`} component={EditProduct} />

        <Route path={`${match.url}/importproduct`} component={ImportProduct} />
        <Route path={`${match.url}/printbarcode`} component={PrintBarcode} />
        <Route path={`${match.url}/product-details`} component={ProductDetails} />

    </Switch>
)

export default ProductRoute;