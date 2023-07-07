import React, { useEffect, useState } from "react";
import Select from "react-select";
import "react-select2-wrapper/css/select2.css";
import {
  Calendar,
  Plus,
  Scanner,
  DeleteIcon,
  EditIcon,
  MacbookIcon,
  EarpodIcon,
} from "../../EntryFile/imagePath";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Table } from "antd";
import FeatherIcon from 'feather-icons-react'
import { useGet } from "../../hooks/useGet";
import { isValidNumber } from "../../utility";
import useCustomApi from "../../hooks/useCustomApi";
import alertify from "alertifyjs";
import "../../../node_modules/alertifyjs/build/css/alertify.css";
import "../../../node_modules/alertifyjs/build/css/themes/semantic.css";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";



const EditQuotation = () => {
  const {state} = useLocation()
  console.log("State:", state)
  const [id] = useState(state?.id)
  const [startDate, setStartDate] = useState((state?.requestDate));
  const [selectedProduct, setSelectedProduct] = useState('')
  const { data: products, isLoading: productsIsLoading } = useGet("products", "/product");
  const { data: productRequestDetails, isLoading: productRequestLoading } = useGet("productRequest-details", `/productRequest/productItems/${state?.id}`);
  const [productsDropdown, setProductsDropdown] = useState([]);

  const [productGridData, setProductGridData] = useState([])
  const [productFormData, setProductFormData] = useState({qty:''})
  const [editFormData, setEditFormData] = useState({qty:''})
  const [loading, setLoading] = useState(false)


  const axios = useCustomApi()

  
  useEffect(() => {
    let mappedData = productRequestDetails?.data.map((item) =>{
      return {
        productId: item?.productId,
        productName: item?.product.name,
        remainingStock: item?.currentStock,
        qty: item?.quantity
      }
    })
    setProductGridData(mappedData)
  }, [productRequestDetails])

  const columns = [
    {
      title: "Product",
      dataIndex: "product",
      render: (text, record) => (
        <div className="productimgname">
          {/* <Link className="product-img">
            <img alt="" src={record.image} />
          </Link> */}
          <Link style={{ fontSize: "15px", marginLeft: "10px" }}>
            {record.productName}
          </Link>
        </div>
      ),
    },
    {
      title: "Current Stock",
      dataIndex: "remainingStock",
      render: (text) => <span style={{paddingLeft:50}}>{text}</span>
    },
    // {
    //   title: "Estimated Request",
    //   dataIndex: "stock",
    // },
    {
      title: "Requested Qty",
      dataIndex: "qty",
      render: (text) => <span style={{paddingLeft:50}}>{text}</span>
    },
  
    {
      title: "Actions",
      render: (record) => (
        <>
         <span className="delete-set me-2" data-bs-toggle="modal" data-bs-target="#editrequestitem" onClick={() => {setEditFormData(record)}}>
            <img src={EditIcon} alt="img" />
          </span>{'   '}
          <Link className="delete-set" href="#" onClick={() => deleteRow(record)}>
            <img src={DeleteIcon} alt="img" />
          </Link>
        </>
      ),
    },
  ];


  const deleteRow = (record) => {
    // console.log(record)
    // console.log(productGridData)
    let newGridData = productGridData.filter((item) => item.productId !== record.productId)
    //console.log(newGridData)
    setProductGridData(newGridData)
  };

  const handleUpdate = ()=> {
    let updated = editFormData
    let listCopy = [...productGridData]
    let index = productGridData.findIndex(item => item.productId == updated.productId)
    listCopy[index] = updated
    setProductGridData(listCopy)
    $('.modal').modal('hide')
  }

  const handleProductSelect = (e) => {
    console.log("Product:", e)
    setSelectedProduct(e)
    setProductFormData({ ...productFormData, productName: e.label, productId: e.value, remainingStock: e.remainingStock })
  }

  const handleAddItem = () => {
    if(selectedProduct == null || selectedProduct == ''){
      alertify.set("notifier", "position", "top-right");
      alertify.warning("Please select a product first");
    }
    if(productFormData?.qty == ''){
      alertify.set("notifier", "position", "top-right");
      alertify.warning("Please provide a quantity first");
    }
    else{
      setProductGridData([...productGridData, productFormData])
      //console.log(productGridData)
      setProductFormData({remainingStock: '', qty:''})
       setSelectedProduct('')
    }
   
  }


  const handleSubmit = () => {
    if(productGridData.length <1){
      alertify.set("notifier", "position", "top-right");
      alertify.warning("Please add at least one product to the list");
    }else{
      setLoading(true)
      const payload = {
        requestDate: startDate,
        products: productGridData.map((item) => {
          return {
            "productId": item.productId,
             "quantity": item.qty,
             "currentStock": item.remainingStock
          }
        })
      }
  
      //console.log(payload)
      axios.put(`/productRequest/${id}`, payload)
      .then((res) => {
        if(res.data.success){
          alertify.set("notifier", "position", "top-right");
          alertify.success("Request updated.");
          setProductGridData([])
        }
      })
      .catch((err) => {
        alertify.set("notifier", "position", "top-right");
        alertify.error("Error. Failed to update request");
      })
      .finally(() => setLoading(false))
    }
    

  }

  
  useEffect(() => {
    if (!productsIsLoading) {
      let mappedProducts = products?.data.map((item) => {
        return {
          id: item?.id,
          label: item?.name,
          value: item?.id,
          retailPrice: item?.retailPrice,
          wholeSalePrice: item?.wholeSalePrice,
          specialPrice: item?.wholeSalePrice,
          ownershipType: item?.ownershipType,
          remainingStock: item?.stock_count 
        }

      })
      setProductsDropdown(mappedProducts)
    }

  }, [products])

  if(loading || productRequestLoading){
    return <LoadingSpinner message="Loading ..."/>
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Edit Request</h4>
              <h6>Update your product request</h6>
            </div>
          </div>

          <div style={{display:'flex', gap:20}}>
            <div className="card" style={{width: '30%', height:500}}>
              <div className="card-body">
                <div className="row">
                 
                  <div className="col-lg-12 col-sm-6 col-12">
                    <div className="form-group">
                      <label> Date </label>
                      <input type="date" className="form-control" value={startDate} onChange={(e) => { setStartDate(e.target.value) }} disabled/>
                    </div>
                  </div>
                 
                  <div className="col-lg-12 col-sm-6 col-12">
                      <div className="form-group">
                        <label>Product Name (Designation)</label>
                        <Select
                          className="select"
                          options={productsDropdown}
                          value={selectedProduct}
                          isLoading={productsIsLoading}
                          onChange={(e) => handleProductSelect(e)}
                        />
                      </div>
                    </div>


                    <div className="col-lg-12 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Current Stock</label>
                      <div className="input-groupicon">
                        <input
                          type="text"
                          value={productFormData?.remainingStock}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-12 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Quantity</label>
                      <div className="input-groupicon">
                        <input
                          type="text"
                          value={productFormData?.qty}
                          onChange={(e) => {
                            if(e.target.value == ''){
                              setProductFormData({...productFormData, qty: ''})
                            }
                            if(Number(e.target.value) > (productFormData?.remainingStock)){
                              alertify.set("notifier", "position", "top-right");
                              alertify.warning('Amount can not be greater than amount due')
                            }
                            else{
                              let qty = parseInt(e.target.value) || 0
                              setProductFormData({ ...productFormData, qty: qty })
                            }
                           
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-12 col-sm-6 col-12">
                    <div className="form-group">
                      <Link to="#" className="btn btn-submit me-2"  style={{ width: '100%' }} onClick={handleAddItem} >
                        <FeatherIcon icon="shopping-cart" />{" Add to Basket"}
                      </Link>
                      {/* <Link to="#" className="btn btn-cancel">
                          Clear
                        </Link> */}
                  </div>

                </div>

                </div>
              </div>
            </div>

            <div className="card" style={{width: '70%', height:'auto'}}> 
              <div className="card-body">
              
                <div className="row">
                  <div className="table-responsive">
                    <Table
                      columns={columns}
                      dataSource={productGridData}
                      pagination={false}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12 float-md-right">
                    <div className="total-order">
                      <ul>
                        
                        <li className="total">
                          <h4>Total Quantity</h4>
                          <h5>{productGridData?.reduce((total, item) => Number(item.qty) + total, 0)}</h5>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-12" style={{textAlign:'right'}}>
                    <button className="btn btn-submit me-2" style={{width:300}} onClick={handleSubmit}>Update Request</button>
                  </div>
                </div>
               
              </div>
            </div>
          </div>
         
        </div>
      </div>


      <div
            className="modal fade"
            id="editrequestitem"
            tabIndex={-1}
            aria-labelledby="editrequestitem"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-md modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Product</h5>
                  <button
                    type="button"
                    className="close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-lg-12 col-sm-12 col-12">
                      <div className="form-group">
                        <label>Product Name</label>
                        <div className="input-groupicon">
                        <input type="text" value={editFormData?.productName} onChange={(e) => setEditFormData({...editFormData, productName:e.target.value})} disabled/>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-12 col-12">
                      <div className="form-group">
                        <label>Quantity</label>
                        <input type="text" value={editFormData?.qty}
                         onChange={(e) => {
                          if(e.target.value == ''){
                            setEditFormData({...editFormData, qty: ''})
                          }
                          else if (isValidNumber(e.target.value)) {
                            setEditFormData({ ...editFormData, qty: e.target.value})
                          }
                        }
                        }/>
                      </div>
                    </div>
                 
                   
                    <div className="col-lg-6 col-sm-12 col-12">
                      <div className="form-group">
                        <label>Current Stock</label>
                        <input type="text" value={editFormData?.remainingStock} />
                      </div>
                    </div>
                   
                   
                  </div>
                </div>
                <div className="modal-footer" style={{justifyContent:'flex-end'}}>
                  <button type="button" className="btn btn-submit" onClick={handleUpdate}>
                    Update
                  </button>
                  <button
                    type="button"
                    className="btn btn-cancel"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
      </div>
    </>
  );
};

export default EditQuotation;
