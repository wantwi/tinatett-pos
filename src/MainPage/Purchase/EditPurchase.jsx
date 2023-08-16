import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Calendar,
  Plus,
  Scanner,
  DeleteIcon,
  EditIcon,

} from "../../EntryFile/imagePath";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import { Table } from "antd";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { isValidNumber, moneyInTxt } from "../../utility";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import { useGet } from "../../hooks/useGet";
import { usePut } from "../../hooks/usePut";
import alertify from "alertifyjs";
import "../../../node_modules/alertifyjs/build/css/alertify.css";
import "../../../node_modules/alertifyjs/build/css/themes/semantic.css";
import Select from "react-select";
import Swal from "sweetalert2";
import useCustomApi from "../../hooks/useCustomApi";
import { NotificationsContext } from "../../InitialPage/Sidebar/DefaultLayout";


const EditPurchase = () => {
  const {state} = useLocation()
  //console.log("State", state)
  const [manDate, setManDate] = useState('');
  const [expDate, setExpDate] = useState('');
  const [purchaseId] = useState(state?.id)

  const [loading, setLoading] = useState(false)


  const [productsDropdown, setProductsDropdown] = useState([]);
  const [suppliersDropdown, setSuppliersDropdown] = useState([]);

  const { data: products, isLoading: productsIsLoading } = useGet("products", "/product");
  const { data: suppliers, isLoading: suppliersIsLoading } = useGet("suppliers", "/supplier");
  const { data: purchase, isLoading: purchaseIsLoading } = useGet("purchase", `/purchase/${state?.id}`);
  const [purDate] = useState(state?.date)
  const [supplier] = useState(purchase?.supplierId)
  const [selectedProduct, setSelectedProduct] = useState('')
  const { data: purchaseDetails, isLoading: purchaseIsLoadingDetails } = useGet("purchase-details", `/purchase/products/${state?.id}`);
  const { isLoading, data, isError, error, mutate } = usePut(`/purchase/${purchaseId}`); 
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false)


  const [productFormData, setProductFormData] = useState({ id:'', unitPrice: '', quantity: '', amount: '', manufacturingDate:'', expireDate:''})
  const [editFormData, setEditFormData] = useState({ id:'', unitPrice: '', quantity: '', amount: '', manufacturingDate:'', expireDate:''})
  const [productList, setProductList] = useState([])

  const { notifications, setNotifications } = useContext(NotificationsContext)
  let storage = JSON.parse(localStorage.getItem("auth"))

  const axios = useCustomApi()

  const handleProductSelect = (e) => {
    console.log("Product:", e)
    setSelectedProduct(e)
    setProductFormData({ ...productFormData, productName: e.label, productId: e.value })
}

useEffect(() => {
  $('#unitPrice').css('border', '1px solid rgba(145, 158, 171, 0.32)')
}, [productFormData.unitPrice])

useEffect(() => {
  $('#batchNumber').css('border', '1px solid rgba(145, 158, 171, 0.32)')
}, [productFormData.batchNumber])

useEffect(() => {
  $('#quantity').css('border', '1px solid rgba(145, 158, 171, 0.32)')
}, [productFormData.quantity])

useEffect(() => {
  $('#manufacturingDate').css('border', '1px solid rgba(145, 158, 171, 0.32)')
}, [productFormData.manufacturingDate])

useEffect(() => {
  $('#expiryDate').css('border', '1px solid rgba(145, 158, 171, 0.32)')
}, [productFormData.expireDate])

useEffect(() => {
  $('#supplier').css('border', '1px solid rgba(145, 158, 171, 0.32)')
}, [supplier])

useEffect(() => {
  $('#productName').css('border', '1px solid rgba(145, 158, 171, 0.32)')
}, [selectedProduct])

  const handleAddItem = () => {

    if(selectedProduct == '' || selectedProduct == null){
      $('#productName').css('border', '1px solid red')
      alertify.set("notifier", "position", "bottom-right");
      alertify.warning("Please make sure you've selected a product");
      let newNotification = {
        message: `${storage.name} Please make sure you've selected a product.`,
        time: new Date().toISOString(),  type: 'warning'
      }
      setNotifications([newNotification, ...notifications])
    }

    else if (productFormData.manufacturingDate == '') {
      $('#manufacturingDate').css('border', '1px solid red')
      alertify.set("notifier", "position", "bottom-right");
      alertify.warning("Please enter Manufacturing Date.");
      let newNotification = {
        message: `${storage.name} Please enter Manufacturing Date`,
        time: new Date().toISOString(), type: 'warning'
      }
      setNotifications([newNotification, ...notifications])
    }

    else if (productFormData.expireDate == '') {
      $('#expiryDate').css('border', '1px solid red')
      alertify.set("notifier", "position", "bottom-right");
      alertify.warning("Please make sure you've provided expiry date.");
      let newNotification = {
        message: `${storage.name} Please make sure you've provided expiry date.`,
        time: new Date().toISOString(),  type: 'warning'
      }
      setNotifications([newNotification, ...notifications])
    }

    else if (productFormData.batchNumber == '') {
      $('#batchNumber').css('border', '1px solid red')
      alertify.set("notifier", "position", "bottom-right");
      alertify.warning("Please enter batch number.");
      let newNotification = {
        message: `${storage.name} Please enter batch number.`,
        time: new Date().toISOString(),  type: 'warning'
      }
      setNotifications([newNotification, ...notifications])
    }
  

    else if (productFormData.quantity == '') {
      $('#quantity').css('border', '1px solid red')
      alertify.set("notifier", "position", "bottom-right");
      alertify.warning("Please enter quantity.");
      let newNotification = {
        message: `${storage.name} Please enter quantity`,
        time: new Date().toISOString(),  type: 'warning'
      }
      setNotifications([newNotification, ...notifications])
    }

   

    else if (productFormData.unitPrice == '') {
      $('#unitPrice').css('border', '1px solid red')
      alertify.set("notifier", "position", "bottom-right");
      alertify.warning("Please enter unit price.");
      let newNotification = {
        message: `${storage.name} Please enter unit price.`,
        time: new Date().toISOString(),  type: 'warning'
      }
      setNotifications([newNotification, ...notifications])
    }

   
    
    
    else{
      
      let newList = [...productList]
      //console.log("new List", newList)
      let index = newList.findIndex((item) => item.id == productFormData.id)
      if(index != -1){
        newList[index] = productFormData
        setProductList(newList)
      }
      else{
        setProductList([...productList, productFormData])
      }
     
     
      setSelectedProduct('')
      setProductFormData({ unitPrice: '', quantity: '', amount: '', manufacturingDate:'', expireDate:''}) 
      setManDate('')
      setExpDate('')
    }
   
  }

  const handleUpdate = () => {
    let updated = editFormData
    let listCopy = [...productList]
    let index = productList.findIndex(item => item.productId == updated.productId)
    listCopy[index] = updated
    setProductList(listCopy)
    $('.modal').modal('hide')
  }

  const checkIfBatchNoExists = (batchNumber, productId) => {
    setLoading(true)
    axios.get(`/purchase/product/${productId}/${batchNumber}`)
    .then((res) => {
      if(res.data.statusText == 'Allow Purchase'){
        
      }
      else if(res.data.statusText == 'Deny Purchase'){
        alertify.set("notifier", "position", "bottom-right");
        alertify.warning(res.data.message);

        let newNotification = {
          message: `${storage.name} ${res.data.message}`,
          time: new Date().toISOString(),  type: 'warning'
        }
        setNotifications([newNotification, ...notifications])
        setProductFormData({ ...productFormData, batchNumber:'' })
      }
    })
    .finally(() => setLoading(false))
  }
 

  const handleEdit = (record) => {
    setEditFormData({
      id: record?.id,
      productName: record?.productName,
      productId: record.productId,
      unitPrice: record.unitPrice,
      quantity:record.quantity,
      amount: record.quantity * record.unitPrice,
      manufacturingDate: record?.manufacturingDate,
      expireDate: record?.expireDate,
      batchNumber: record?.batchNumber
    })

  }

  const onSubmit = () => {
    let postBody = {
      supplierId:state?.supplierId,
      purchaseDate: new Date(purDate).toISOString(),
      products: productList.map((item) => {
        return {
          id: item?.id,
          productName: item?.productName,
          productId: item?.productId,
          unitPrice: item?.unitPrice,
          quantity: item?.quantity,
          amount: item?.amount,
          manufacturingDate: item?.manufacturingDate,
          expireDate: item?.expireDate,
          batchNumber: item?.batchNumber || ''

        }
      })
    }

    // console.log(postBody)
    mutate(postBody)
    setIsSubmitSuccessful(true)
  };

  useEffect(() => {
    let mappedData = purchaseDetails?.data.map((item) =>{
      return {
        ...item,
        productName: item?.product?.name,
        quantity: item?.quantity,
        amount: item?.total
      }
    })
    setProductList(mappedData)
    // console.log("Details:", purchaseDetails?.data)
  }, [purchaseDetails])

  useEffect(() => {
    if (!productsIsLoading && !suppliersIsLoading) {
      let mappedProducts = products?.data.map((item) => {
        return {
          id: item?.id,
          label: item?.name,
          value: item?.id,
          retailPrice: item?.retailPrice,
          wholeSalePrice : item?.wholeSalePrice,
          specialPrice: item?.wholeSalePrice,
          ownershipType: item?.ownershipType
        }

      })
      setProductsDropdown(mappedProducts)

      let mappedSuppliers = suppliers?.data.map((item) => {
        return {
          id: item?.id,
          text: item?.name,
          value: item?.id,
        }

      })
      setSuppliersDropdown(mappedSuppliers)
    }

  }, [suppliers, products])

  useEffect(() => {
    if (!isError && isSubmitSuccessful) {
      alertify.set("notifier", "position", "bottom-right");
      alertify.success("Purchase updated successfully.");
      setTimeout(() => {
        window.location.href = '/tinatett-pos/purchase/purchaselist'
      },1000)
    }
    else if(isError){
      alertify.set("notifier", "position", "bottom-right");
      alertify.error("Failed to update");

      let newNotification = {
        message: `${storage.name} Failed to update.`,
        time: new Date().toISOString(),  type: 'error'
      }
      setNotifications([newNotification, ...notifications])
    }
    return () => {};
  }, [isError, isSubmitSuccessful]);




  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      render: (text, record) => (
        <div className="productimgname">
          <Link className="product-img">
            <img alt="" src={record.image} />
          </Link>
          <Link style={{ fontSize: "15px", marginLeft: "10px" }}>
            {record?.productName}
          </Link>
        </div>
      ),
    },
    {
      title: "QTY",
      dataIndex: "quantity",
      render: (text, record) => <p style={{textAlign:'center'}}>{(record.quantity) || 0}</p>
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      render: (text, record) => <p style={{textAlign:'center'}}>{moneyInTxt(text)}</p>
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (text, record) => <p style={{textAlign:'center'}}>{moneyInTxt(text)}</p>
    },
    {
      title: "Batch #",
      dataIndex: "batchNumber",
      width: "150px"
      // render: (text, record) => <p style={{textAlign:'center'}}>{text || ''}</p>
    },
    {
      title: "Manufacturing",
      dataIndex: "manufacturingDate",
      render: (text, record) => <p style={{textAlign:'center'}}>{record.manufacturingDate.substring(0,10) || ''}</p>
    },
    {
      title: "Expiring",
      dataIndex: "expireDate",
      render: (text, record) => <p style={{textAlign:'center'}}>{record.expireDate.substring(0,10) || ''}</p>
    },
    {
      title:"Action",
      render: (text, record) => (
        <>
         <span className="me-3" to="#" data-bs-target="#editproduct" data-bs-toggle="modal"  onClick={() => handleEdit(record)} style={{cursor:'pointer'}}>
            <img src={EditIcon} alt="img" />
          </span>
          <span className="delete-set" to="#" onClick={() => confirmText(record)} style={{cursor:'pointer'}}>
            <img src={DeleteIcon} alt="img" />
          </span>
        </>
      ),
    },
  ];


  const deleteRow = (record) => {
    let newGridData = productList.filter((item) => item.productId !== record.productId)
    //console.log(newGridData)
    setProductList(newGridData)
   };

  const confirmText = (record) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: !0,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      confirmButtonClass: "btn btn-primary",
      cancelButtonClass: "btn btn-danger ml-1",
      buttonsStyling: !1,
    })
    .then( async() => {
      //console.log('deleting...')
      let data = await axios.delete(`/purchase/item/${record.id}`)
      console.log(data)
      if(data.status == 204){
        deleteRow(record)
        Swal.fire({
          type: "success",
          title: "Deleted!",
          text: "Your purchase item has been deleted.",
          confirmButtonClass: "btn btn-success",
        });
      }
      else{
        Swal.fire({
          type: "danger",
          title: "Error!",
          text: data.response.data.error,
          confirmButtonClass: "btn btn-danger",
        });
      }
    })
    .catch( (error) => {
        Swal.fire({
          type: "danger",
          title: "Error!",
          text: error,
          confirmButtonClass: "btn btn-danger",
        });
    });
  };


  if(purchaseIsLoading){
    return <LoadingSpinner/>
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Purchase </h4>
              <h6>Update Purchase</h6>
            </div>
          </div>

          <div style={{display:'flex', gap:20}}>
            <div  style={{width: '30%'}}>
              <div className="card">
                <div className="card-body">


                  <div className="row">
                    <div className="col-lg-7 col-sm-6 col-12">
                      <div className="form-group">
                        <label>Supplier Name</label>
                        <div className="row">
                          <div className="col-lg-12 col-sm-12 col-12" id="supplier">
                          
                          {/* <input type="text" value={purchase?.supplierName}/> */}
                            <Select2
                              className="select"
                              data={suppliersDropdown}
                              value={state?.supplierId}      
                              disabled      
                            />
                          </div>
                        
                        </div>
                      </div>
                    </div>

                    
                    <div className="col-lg-5 col-sm-6 col-12">
                      <div className="form-group">
                        <label>Purchase Date </label>
                        <div className="input-groupicon">
                        <input type="date" id="purDate"  className="form-control" value={purDate} disabled/>
                          {/* <DatePicker
                           selected={purDate}
                           disabled
                          />
                          <div className="addonset">
                            <img src={Calendar} alt="img" />
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                  <div className="card-body">

                      <div className="row">

                      
                        <div className="col-lg-12 col-sm-6 col-12">
                          <div className="form-group">
                            <label>Product Name (Designation)</label>
                            <Select
                            id="productName"
                              className="select"
                              options={productsDropdown}
                              isLoading={productsIsLoading}
                              value={selectedProduct}
                              onChange={(e) => handleProductSelect(e)}
                            />
                            {/* <Select2
                              className="select"
                              data={productsDropdown}
                              options={{
                                placeholder: "Select Product",
                              }}
                              value={productFormData?.productId}
                              ref = {productRef}
                              onChange={(e) => handleProductSelect(e)}
                            /> */}
                          </div>
                        </div>
                        
                        <div className="col-lg-6 col-sm-6 col-12">
                          <div className="form-group">
                            <label>Manufacturing Date </label>
                            <div className="input-groupicon">
                            <input type="date" id="manufacturingDate"  className="form-control" value={manDate} onChange={(e) => {
                                  setManDate(e.target.value)
                                  setProductFormData({ ...productFormData, manufacturingDate: e.target.value })
                                }}/>
                              {/* <DatePicker
                                selected={manDate}
                                //value={product?.manufacturingDate}
                                onChange={(e) => {
                                  setManDate(e)
                                  setProductFormData({ ...productFormData, manufacturingDate: new Date(e).toISOString() })
                                }}
                              />
                              <div className="addonset">
                                <img src={Calendar} alt="img" />
                              </div> */}
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-6 col-sm-6 col-12">
                          <div className="form-group">
                            <label>Expiring Date </label>
                            <div className="input-groupicon">
                            <input type="date" id="expiryDate" className="form-control" value={expDate} onChange={(e) => {
                                  setExpDate(e.target.value)
                                  setProductFormData({ ...productFormData, expireDate: e.target.value })
                                }}/>
                              {/* <DatePicker
                                selected={expDate}
                                onChange={(e) => {
                                  setExpDate(e)
                                  setProductFormData({ ...productFormData, expireDate: new Date(e).toISOString() })
                                }}
                              />
                              <div className="addonset">
                                <img src={Calendar} alt="img" />
                              </div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                  
                      <div className="row">
                      <div className="col-lg-6 col-sm-6 col-12">
                      <div className="form-group">
                        <label>Batch No</label>
                        <input type="text" id="batchNumber" className={`form-control `} disabled={selectedProduct?.ownershipType == "Tinatett" ? false : false}
                          value={productFormData?.batchNumber}
                          onBlur={(e) => checkIfBatchNoExists(e.target.value,selectedProduct.id, )}
                          onChange={(e) => {
                            setProductFormData({ ...productFormData, batchNumber: e.target.value })
                          }
                          } />
                      </div>
                    </div>

                        <div className="col-lg-6 col-sm-6 col-12">
                          <div className="form-group">
                            <label>Quantity</label>
                            <input type="text" id="quantity"  className={`form-control `}
                              value={productFormData?.quantity}
                              onChange={(e) => {
                                let qty = (e.target.value) 
                                let unitP = (productFormData.unitPrice)
                                setProductFormData({ ...productFormData, quantity: e.target.value, amount: unitP * qty  })
                                }
                              } />
                          </div>
                        </div>

                        <div className="col-lg-6 col-sm-6 col-12">
                          <div className="form-group">
                            <label>Unit Price</label>
                            <input type="text" id="unitPrice" className={`form-control `}
                              value={productFormData?.unitPrice}
                              onChange={(e) => {
                              
                                let unitP = (e.target.value) 
                                let qty = (productFormData.quantity) 
                                // console.log(e.target.value, unitP)
                                setProductFormData({ ...productFormData, unitPrice: e.target.value, amount: unitP * qty })
                              }
                              } />
                          </div>
                        </div>

                        <div className="col-lg-6 col-sm-6 col-12">
                          <div className="form-group">
                            <label>Amount</label>
                            <div className="input-groupicon">
                              <input
                                type="text" className={`form-control `}
                                placeholder=""
                                id="amount"
                                value={Number(productFormData?.amount).toFixed(2)}
                                disabled
                              />

                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row" style={{textAlign:'right'}}>
                        <div className="col-lg-12 col-sm-6 col-12">
                          <div className="form-group">
                            <button to="#" className="btn btn-submit me-2" onClick={handleAddItem}>
                              Add to List
                            </button>
                            <Link to="#" className="btn btn-cancel">
                              Clear
                            </Link>
                          </div>

                        </div>
                      </div>
                    </div>
              </div>
            </div>

            <div className="card"  style={{width: '70%'}}>
              <div className="card-body">
                <div className="row">
                  <div className="table-responsive">
                    <Table
                      columns={columns}
                      dataSource={productList}
                      pagination={false}
                    />
                  </div>
                </div>

                <div className="row" >
                  <div className="col-lg-12 float-md-right">
                    <div className="total-order">
                      <ul>
                        {/* <li>
                          <h4>Order Tax</h4>
                          <h5>$ 0.00 (0.00%)</h5>
                        </li> */}
                        <li>
                          <h4>Discount </h4>
                          <h5>GHS 0.00</h5>
                        </li>

                        <li className="total">
                          <h4>Grand Total</h4>
                          <h5>GHS {moneyInTxt(
                            productList?.reduce((total, item) => total + item.amount, 0)
                          )}</h5>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="row">
                  {/* <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Order Tax</label>
                      <input type="text" />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Discount</label>
                      <input type="text" />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Shipping</label>
                      <input type="text" />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Status</label>
                      <Select2
                        className="select"
                        data={options2}
                        options={{
                          placeholder: "Category",
                        }}
                      />
                    </div>
                  </div> */}
                  
                  <div className="col-lg-12" style={{textAlign:'right'}}>
                    <button className="btn btn-submit me-2" type="submit" onClick={onSubmit}>Update</button>
                    <Link to="/tinatett-pos/purchase/purchaselist" className="btn btn-cancel">
                    Cancel
                   </Link>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>


      {/* Edit Modal */}
      <div
            className="modal fade"
            id="editproduct"
            tabIndex={-1}
            aria-labelledby="editproduct"
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

                    <div className="col-lg-6 col-sm-6 col-12">
                          <div className="form-group">
                            <label>Manufacturing Date </label>
                            <div className="input-groupicon">
                            <input type="date" className="form-control" value={(editFormData?.manufacturingDate).substring(0,10)} onChange={(e) => {
                                  setEditFormData({ ...editFormData, manufacturingDate: e.target.value })
                                }}/>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-6 col-sm-6 col-12">
                          <div className="form-group">
                            <label>Expiring Date </label>
                            <div className="input-groupicon">
                            <input type="date" className="form-control" value={(editFormData?.expireDate).substring(0,10)} onChange={(e) => {
                                  setProductFormData({ ...editFormData, expireDate: e.target.value })
                                }}/>
                            </div>
                          </div>
                        </div>

                    <div className="col-lg-6 col-sm-12 col-12">
                      <div className="form-group">
                        <label>Quantity</label>
                        <input type="text" value={editFormData?.quantity}
                         onChange={(e) => {
                          if(e.target.value == ''){
                            setEditFormData({...editFormData, quantity: ''})
                          }
                          else if (isValidNumber(e.target.value)) {
                            let qty = parseInt(e.target.value) || 0
                            let unitP = parseInt(editFormData.unitPrice) || 0
                            setEditFormData({ ...editFormData, quantity: e.target.value, amount: unitP * qty || unitP * 1 })
                          }
                        }
                        }/>
                      </div>
                    </div>
                 
                    <div className="col-lg-6 col-sm-12 col-12">
                      <div className="form-group">
                        <label>Unit Price</label>
                        <input type="text" value={editFormData?.unitPrice} 
                         disabled
                         onChange={(e) => {
                          let unitP = parseInt(e.target.value) || 0
                          let qty = parseInt(editFormData.quantity) || 0
                          setEditFormData({ ...editFormData, unitPrice: e.target.value, amount: unitP * qty || unitP * 1 })
                        }}
                        />
                      </div>
                    </div>

                    <div className="col-lg-6 col-sm-12 col-12">
                      <div className="form-group">
                        <label>Amount</label>
                        <input type="text" value={editFormData?.amount} />
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

export default EditPurchase;


// setEditFormData({
//   id: record?.id,
//   productId: record.productId,
//   unitPrice: record.unitPrice,
//   quantity:record.quantity,
//   amount: record.quantity * record.unitPrice,
//   manufacturingDate: record?.manufacturingDate,
//   expireDate: record?.expireDate,
//   batchNumber: record?.batchNumber
// })