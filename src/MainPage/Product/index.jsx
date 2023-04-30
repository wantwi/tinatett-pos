import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom';
import ProductList from './ProductList'
import AddProduct from './AddProduct'
import EditProduct from './EditProduct'
import CategoryList from './CategoryList';
import AddCategory from './AddCategory';
import EditCategory from './EditCategory';
import SubCategoryTable from './SubCategoryTable';
import AddSubCategory from './AddSubCategory';
import EditSubCategory from './EditSubCategory';
import BrandList from './BrandList';
import AddBrand from './AddBrand';
import EditBrand from './EditBrand';
import ImportProduct from './ImportProduct';
import PrintBarcode from './PrintBarcode';
import ProductDetails from './productDetails';

const ProductRoute = ({ match }) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/productlist`} />
        <Route path={`${match.url}/productlist`} component={ProductList} />
        <Route path={`${match.url}/addproduct`} component={AddProduct} />
        <Route path={`${match.url}/editproduct`} component={EditProduct} />
        <Route path={`${match.url}/categorylist`} component={CategoryList} />
        <Route path={`${match.url}/addcategory`} component={AddCategory} />
        <Route path={`${match.url}/editcategory`} component={EditCategory} />
        <Route path={`${match.url}/subcategorytable`} component={SubCategoryTable} />
        <Route path={`${match.url}/addsubcategory`} component={AddSubCategory} />
        <Route path={`${match.url}/editsubcategory`} component={EditSubCategory} />
        <Route path={`${match.url}/brandlist`} component={BrandList} />
        <Route path={`${match.url}/addbrand`} component={AddBrand} />
        <Route path={`${match.url}/editbrand`} component={EditBrand} />
        <Route path={`${match.url}/importproduct`} component={ImportProduct} />
        <Route path={`${match.url}/printbarcode`} component={PrintBarcode} />
        <Route path={`${match.url}/product-details`} component={ProductDetails} />

    </Switch>
)

export default ProductRoute;