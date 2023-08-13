import React, { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Pdf,
  Scanner,
  Product7,
  DeleteIcon,
  Calendar,
  Product8,
  Product1,
  Printer,
  MinusIcon,
  Plus,
  EditIcon,
} from "../../EntryFile/imagePath";
import Select from "react-select";
import "react-select2-wrapper/css/select2.css";
import { useEffect } from "react";
import { useGet } from "../../hooks/useGet";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import { isValidNumber, moneyInTxt } from "../../utility";
import { usePost } from "../../hooks/usePost";
import alertify from "alertifyjs";
import "../../../node_modules/alertifyjs/build/css/alertify.css";
import "../../../node_modules/alertifyjs/build/css/themes/semantic.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import FeatherIcon from 'feather-icons-react'
import jsPDF from "jspdf";
import useCustomApi from "../../hooks/useCustomApi";
import { BASE_URL } from "../../api/CustomAxios";
import { NotificationsContext } from "../../InitialPage/Sidebar/DefaultLayout";


const AddTransfer = () => {
  const [customerOptions, setCustomerOptions] = useState([])
  const [productOptions, setProductOptions] = useState([])
  const [startDate, setStartDate] = useState(new Date());

  const { data: customers, isError, isLoading: isCustomerLoading, isSuccess } = useGet("branches", "/branch");
  const {data: products, isLoading: isProductsLoading, } = useGet("products", "/product");
  const { isLoading, isError: isPostError, error, mutate } = usePost("/transfer");

  const [selectedProduct, setSelectedProduct] = useState({})
  const [selectedProductInfo, setSelectedProductInfo] = useState()
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [selectedCustomerPrint, setSelectedCustomerPrint] = useState('')
  const [formData, setFormData] = useState({quantity:'', amount:'', batchNumber:{}, manuDate:'', expDate:''})
  const [editFormData, setEditFormData] = useState({quantity:'', amount:'', batchNumber:{}, manuDate:'', expDate:''})
  const [productGridData, setProductGridData] = useState([])
  const [printGridData, setPrintGridData] = useState([])
  const [transDate, setTransDate] = useState(new Date().toISOString().slice(0, 10));
  const [disabledUnselectedPrice,setDisableUnselectedPrice] = useState({retail: false, wholesale:false, special:false})
  const retailpriceTypeRef = useRef()
  const specialpriceTypeRef = useRef()
  const wholesalepriceTypeRef = useRef()
  const [retailprice, setRetailPrice] = useState('')
  const [price, setPrice] = useState(0)
  const [wholesaleprice, setWholesalePrice] = useState('')
  const [specialprice, setSpecialPrice] = useState('')
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false)

  const { notifications, setNotifications } = useContext(NotificationsContext)
  let storage = JSON.parse(localStorage.getItem("auth"))

  useEffect(() => {
    if (!isProductsLoading && !isCustomerLoading) {
      let mappedData = customers?.data.map((customer) => {
        return {
          id: customer?.id,
          label: customer?.name,
          value: customer?.id,
          location: customer?.location,
          contact: customer?.contact,
          email: customer?.email,
          status: customer?.status,
          location: customer?.location

        }
      })
      setCustomerOptions(mappedData)

      let mappedData2 = products?.data.map((product) => {
        return {
          id: product?.id,
          label: product?.name,
          value: product?.id,
          retailPrice: product?.retailPrice,
          wholeSalePrice: product?.wholeSalePrice,
          specialPrice: product?.specialPrice,
          totalQuantity: product?.stock_count
        }
      })
      setProductOptions(mappedData2)

    }

  }, [isCustomerLoading, isProductsLoading])



  const handleProductSelect = (e) => {
    setSelectedProduct(e)
    setRetailPrice('(' + e.retailPrice + 'GHS)')
    setWholesalePrice('(' + e.wholeSalePrice  + 'GHS)')
    setSpecialPrice('(' + e.specialPrice  + 'GHS)')
    setPrice(e.retailPrice) 
    //console.log(e)
    
  }
  const axios = useCustomApi()

  useEffect(() => {
    axios.get(`${BASE_URL}/purchase/product/${selectedProduct?.value}`).then((res) => {
      if(res.data.success){
        setSelectedProductInfo(res.data.data)
        let x = res.data.data.batchNumber?.map((item) => {
          return {value:item.batchNumber, label:item?.batchNumber + '-(' + item?.Quantity +')', expireDate:item?.expireDate, manufacturingDate: item?.manufacturingDate}
        })
        //console.log(x)
        setFormData({...formData, batchNumber: x[0], manuDate: x[0].manufacturingDate, expDate: x[0].expireDate})
        retailpriceTypeRef.current.checked = true
      }
    })

  }, [selectedProduct])

  const handleCustomerSelect = (e) => {
    if (customers && !isCustomerLoading) {
      // let item = customers?.data.find((customer) => customer.id == e.target.value)
      setSelectedCustomer(e)
      setSelectedCustomerPrint(e)
    }
  }

  const handleAddItem = () => {
    let item =

    {
      productId: selectedProduct.id,
      name: selectedProduct.label,
      batchNumber: formData.batchNumber?.value,
      manufacturingDate: formData?.manuDate,
      expireDate: formData?.expDate,
      quantity: formData?.quantity,
      unitPrice:price,
      amount:formData.quantity * price

    }


     if (item.name == '' || item.name == null)  {
      alertify.set("notifier", "position", "bottom-right");
      alertify.warning("Please select a product.");
      let newNotification = {
        id: Math.ceil(Math.random()*1000000),
        message: `${storage.name} Please select a product`,
        time: new Date().toISOString()
      }
      setNotifications([...notifications, newNotification])
      $('#selectedProduct').css('border', '1px solid red')
       setTimeout(() => {
        $('#selectedProduct').css('border', '1px solid rgba(145, 158, 171, 0.32)')
      }, 3000)
    }

    else if (item.quantity == '' || item.quantity == null)  {
      alertify.set("notifier", "position", "bottom-right");
      alertify.warning("Please enter quantity.");
      let newNotification = {
        id: Math.ceil(Math.random()*1000000),
        message: `${storage.name} Please enter quantity`,
        time: new Date().toISOString()
      }
      setNotifications([...notifications, newNotification])
      $('#quantity').css('border', '1px solid red')
       setTimeout(() => {
        $('#quantity').css('border', '1px solid rgba(145, 158, 171, 0.32)')
      }, 3000)
    }

    else if (selectedCustomer == '' || selectedCustomer == null) {
      alertify.set("notifier", "position", "bottom-right");
      alertify.warning("Please select a branch.");
      let newNotification = {
        id: Math.ceil(Math.random()*1000000),
        message: `${storage.name} Please select a branch.`,
        time: new Date().toISOString()
      }
      setNotifications([...notifications, newNotification])
      $('#selectedCustomer').css('border', '1px solid red')
      setTimeout(() => {
        $('#selectedCustomer').css('border', '1px solid rgba(145, 158, 171, 0.32)')
      }, 3000)
    }


    else {


      setProductGridData([...productGridData, item])
      setPrintGridData([...printGridData, item])
      setFormData({quantity:'', amount:'', batchNumber:'', manuDate:'', expDate:''})
      setSelectedProduct({totalQuantity:''})
      retailpriceTypeRef.current.checked = false
      wholesalepriceTypeRef.current.checked = false
      specialpriceTypeRef.current.checked = false
      setWholesalePrice('')
      setSpecialPrice('')
      setRetailPrice('')
      setPrice(0)

    }

  }


  const onSubmit = (hasInvoice) => {

    if (productGridData.length < 1) {
      alertify.set("notifier", "position", "bottom-right");
      alertify.warning("Please add at least one item to list before saving.");

      let newNotification = {
        id: Math.ceil(Math.random()*1000000),
        message: `${storage.name} Please add at least one item to list before saving.`,
        time: new Date().toISOString()
      }
      setNotifications([...notifications, newNotification])

    }
    else if(selectedCustomer == ''){
      alertify.set("notifier", "position", "bottom-right");
      alertify.warning("Please select a branch before saving.");

      let newNotification = {
        id: Math.ceil(Math.random()*1000000),
        message: `${storage.name} Please select a branch before saving.`,
        time: new Date().toISOString()
      }
      setNotifications([...notifications, newNotification])
      $('#selectedCustomer').css('border', '1px solid red')
      setTimeout(() => {
        $('#selectedCustomer').css('border', '1px solid rgba(145, 158, 171, 0.32)')
      }, 3000)
    }
    else {
      let postBody = {
        destinationBranchId: selectedCustomer.id,
        transferDate: transDate,
        products: productGridData
      }

      mutate(postBody)
      setSelectedProduct('')
      setProductGridData([])
      setIsSubmitSuccessful(true)
      if(hasInvoice){
        $('#invoice').modal('show');
      }
   
    }
  }


  useEffect(() => {
    if (!isPostError && isSubmitSuccessful) {
      alertify.set("notifier", "position", "bottom-right");
      alertify.success("Transfer sent successfully.");

          let newNotification = {
            message: `${storage.name} made a successful Transfer Request.`,
            time: new Date().toISOString()
          }
          setNotifications([...notifications, newNotification])
  
    }
    else if (isPostError) {
      alertify.set("notifier", "position", "bottom-right");
      alertify.error("Error...Could not complete transfer.");
   
          let newNotification = {
            message: `${storage.name} could not process Transfer Request.`,
            time: new Date().toISOString()
          }
      setNotifications([...notifications, newNotification])
    }

    return () => { };
  }, [isPostError, isSubmitSuccessful]);



  const printReport = () => {
    let printContents = document.getElementById('printArea').innerHTML
    let originalContents = document.body.innerHTML
    document.body.innerHTML = printContents
    window.print(printContents)

    document.body.innerHTML = originalContents
    location.reload()
  }

  const deleteRow = (record) => {
    console.log(record)
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


  useEffect(() => {
    setFormData({ ...formData, amount: Number(formData.price) * Number(formData.quantity) || '' })
    if(Number(formData?.quantity) > selectedProduct?.totalQuantity){
      alertify.set("notifier", "position", "bottom-right");
      alertify.warning("You can not transfer more than stock available.");

      let newNotification = {
        id: Math.ceil(Math.random()*1000000),
        message: `${storage.name} you can not transfer more than stock available.`,
        time: new Date().toISOString()
      }
      setNotifications([...notifications, newNotification])
      setFormData(({...formData, quantity:''}))
    }
  }, [formData.quantity])



  if (isProductsLoading && isCustomerLoading) {
    return <LoadingSpinner />
  }



  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>New Transfer</h4>
            <h6>Transfer products to other branches</h6>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20 }}>

          <div style={{ display: 'flex', flexDirection: 'column', width: '40%', }}>
            <div className="card">
              {/* <form onSubmit={handleSubmit(onSubmit)}> */}
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-8 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Branch Name</label>
                      <div className="row">
                        <div className="col-lg-12 col-sm-12 col-12">
                          <Select
                            className="select"
                            options={customerOptions}
                            onChange={handleCustomerSelect}
                            value={selectedCustomer}
                            id="selectedCustomer"

                          />
                        </div>

                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-sm-6 col-12">
                    <div className="form-group">
                      <label> Date</label>
                      <input type="date" className="form-control" value={transDate} onChange={(e) => setTransDate(e.target.value)} />                      {/* <div className="input-groupicon">
                       
                       
                     */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">

                <div className="col-12">
                  <div className="form-group">
                    <label>Product Name</label>
                    <div className="input-groupicon" id="selectedProduct">
                      <Select style={{width:'100%'}}
                          options={productOptions}
                          placeholder={'Select product'}
                          value={selectedProduct}
                          onChange={handleProductSelect}
                          isSearchable= {true}
                          isLoading={isProductsLoading}
                          
                       />
                      
                    </div>
                  </div>
                </div>

                <div className="row">
                    <div className="col-6">
                      <div className="form-group">
                        <label>Quantity Left</label>
                        <div className="input-groupicon">
                          <input
                            className="form-control"
                            type="text"
                            value={selectedProduct?.totalQuantity}
                            disabled
                          />
                          
                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="form-group">
                        <label>Batch No.</label>
                        <div className="input-groupicon">
                          <Select
                            options={selectedProductInfo?.batchNumber?.map((item) => {
                              return {value:item.batchNumber, label:item?.batchNumber + '-(' + item?.Quantity +')', expireDate:item?.expireDate, manufacturingDate: item?.manufacturingDate}
                            })}
                            placeholder=""
                            value={formData.batchNumber}
                            onChange={(e) => setFormData({...formData, batchNumber: (e), manuDate: e.manufacturingDate, expDate: e.expireDate})}
                            //onChange={(e) => console.log(e)}
                          />
                          
                        </div>
                      </div>
                    </div>
                </div>
                
                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      <label>Manufacturing Date</label>
                      <div className="input-groupicon">
                      <input type="date" className="form-control" value={formData?.manuDate.substring(0, 10)} disabled/>
                        {/* <DatePicker
                          selected={startDate}
                          value={formData?.manuDate.substring(0,10)}
                          disabled

                        />
                        <Link className="addonset">
                          <img src={Calendar} alt="img" />
                        </Link> */}
                      </div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="form-group">
                      <label>Exp. Date</label>
                      <div className="input-groupicon">
                      <input type="date" className="form-control" value={formData?.expDate.substring(0, 10)} disabled/>
                      {/* <DatePicker
                          selected={startDate}
                          value={formData?.expDate.substring(0,10)}
                          disabled

                        />
                        <Link className="addonset">
                          <img src={Calendar} alt="img" />
                        </Link> */}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-group">
                    <label>Product Value</label>
                    <div className="row">
                        

                          <div className="col-lg-4">

                            <div className="input-group">
                              <div className="input-group-text">
                                <input className="form-check-input" type="radio" ref={retailpriceTypeRef} name="priceType" value={selectedProduct?.retailPrice} onChange={(e) => {
                                  setPrice(e.target.value)
                                  setDisableUnselectedPrice({retail:false, wholesale:true, special:true})
                                }}/>
                              </div>
                              <input type="text" className="form-control" aria-label="Text input with radio button"  placeholder={`Retail ${retailprice}`} disabled={disabledUnselectedPrice.retail}/>
                            </div>
                          
                          </div>

                          <div className="col-lg-4">
                            <div className="input-group">
                              <div className="input-group-text">
                                <input className="form-check-input" type="radio" ref={wholesalepriceTypeRef} name="priceType" value={selectedProduct?.wholeSalePrice} onChange={(e) => {
                                  setPrice(e.target.value)
                                  setDisableUnselectedPrice({wholesale:false, retail:true, special:true})}
                                 } />
                              </div>
                              <input type="text" className="form-control" aria-label="Text input with radio button" placeholder={`Wholesale ${wholesaleprice}`} disabled={disabledUnselectedPrice.wholesale}/>
                            </div>
                        </div>

                          <div className="col-lg-4">

                            <div className="input-group">
                              <div className="input-group-text">
                                <input className="form-check-input" type="radio" ref={specialpriceTypeRef} name="priceType" value={selectedProduct?.specialPrice} onChange={(e) => {
                                  setPrice(e.target.value)
                                  setDisableUnselectedPrice({special:false, wholesale:true, retail:true})
                                } }/>
                              </div>
                              <input type="text" className="form-control" aria-label="Text input with radio button" placeholder={`Special ${specialprice}`} disabled={disabledUnselectedPrice.special} />
                            </div>
                          
                          </div>
                      </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      <label>Quantity</label>
                      <div className="input-groupicon">
                        <input
                         className="form-control"
                          id="quantity"
                          type="text"
                          value={formData?.quantity}
                          onChange={(e) => {
                            if(e.target.value == ''){
                              setFormData({...formData, quantity: ''})
                            }
                            else if(isValidNumber(e.target.value)){
                              setFormData({...formData, quantity: Number(e.target.value)})
                            }
                          }}
                        />
                        
                      </div>
                    </div>
                  </div>
              
                  <div className="col-6">
                    <div className="form-group">
                      <label>Amount</label>
                      <div className="input-groupicon">
                        <input
                          className="form-control"
                          type="text"
                          value={formData.quantity ? formData.quantity * price : price * 1}  
                        />
                        
                      </div>
                    </div>
                  </div>
                </div>


                <div className="col-lg-12 col-sm-6 col-12">
                  <div className="form-group">
                    <Link to="#" className="btn btn-submit me-2" onClick={handleAddItem} style={{ width: '100%' }}><FeatherIcon icon="shopping-cart" />
                      {" Add to Basket"}
                    </Link>
                    {/* <Link to="#" className="btn btn-cancel">
                        Clear
                      </Link> */}
                  </div>

                </div>
              </div>
            </div>
          </div>


          <div className="card" style={{ width: '60%' }} >
            <div className="card-body">
              <div className="row">
                <div className="table-responsive mb-3">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Product Value</th>
                        <th>Amount</th>
                        <th>Batch #</th>
                        <th>Action</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {productGridData?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <Link to="#">{item?.name}</Link>
                            </td>
                            <td>{item?.quantity}</td>
                            <td>{item?.unitPrice}</td>
                            <td>{item?.amount}</td>
                            <td>{item?.batchNumber}</td>

                            <td>
                              <Link to="#" className="delete-set me-2" data-bs-toggle="modal" data-bs-target="#editproduct" onClick={() => {setEditFormData(item)}}>
                                <img src={EditIcon} alt="svg" />
                              </Link>
                              <Link to="#" className="delete-set" onClick={() => deleteRow(item)}>
                                <img src={DeleteIcon} alt="svg" />
                              </Link>
                            </td>
                          </tr>
                        )
                      })}

                    </tbody>
                  </table>
                </div>
              </div>
              <div className="row">
                <div className="row">
                  <div className="col-lg-6 ">
                    <div className="total-order w-100 max-widthauto m-auto mb-4">
                      {/* <ul>
                          <li>
                            <h4>Order Tax</h4>
                            <h5>$ 0.00 (0.00%)</h5>
                          </li>
                          <li>
                            <h4>Discount </h4>
                            <h5>$ 0.00</h5>
                          </li>
                        </ul> */}
                    </div>
                  </div>
                  <div className="col-lg-6 ">
                    <div className="total-order w-100 max-widthauto m-auto mb-4">
                      <ul>

                        <li className="total">
                          <h4>Grand Total</h4>
                          <h5>GHS {moneyInTxt(
                            productGridData.reduce((total, item) => total + item.amount, 0)
                          )}</h5>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12" style={{ textAlign: 'right' }}>
                  <button type="submit" className="btn btn-submit me-2" data-bs-toggle="modal" data-bs-target="#confirm"><FeatherIcon icon="save" />
                    {" Invoice"}
                  </button>
                  {/* <Link id="printModalClick" to="#" className="btn btn-cancel me-2" style={{ backgroundColor: '#FF9F43' }} data-bs-toggle="modal"
                    data-bs-target="#create" >
                    Refresh
                  </Link> */}
                  <button type="submit" className="btn btn-cancel me-2" ><FeatherIcon icon="" />
                    {"No Invoice"}
                  </button>
                </div>
              </div>
            </div>
            {/* </form> */}
          </div>
        </div>


      </div>


        {/* Confirm Modal */}
        <div
        className="modal fade"
        id="confirm"
        tabIndex={-1}
        aria-labelledby="confirm"
        aria-hidden="true">

          <div className="modal-dialog modal-md modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                    <h5 className="modal-title">Confirm</h5>
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
                Are you sure you want to complete this transfer?
              </div>
              <div className="modal-footer">
                  <Link to="#" className="btn btn-submit me-2" data-bs-dismiss="modal" onClick={() =>onSubmit(false)}>
                    Yes
                  </Link>
                  <Link to="#" className="btn btn-cancel" data-bs-dismiss="modal">
                    No
                </Link>
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
                        <input type="text" value={editFormData?.name} onChange={(e) => setEditFormData({...editFormData, name:e.target.value})} disabled/>
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
                            setEditFormData({ ...editFormData, quantity: e.target.value, amount: editFormData.quantity ? unitP * qty : unitP * 1 })
                          }
                        }
                        }/>
                      </div>
                    </div>
                 
                    <div className="col-lg-6 col-sm-12 col-12">
                      <div className="form-group">
                        <label>Product Value</label>
                        <input type="text" value={editFormData?.unitPrice} 
                         disabled
                         onChange={(e) => {
                          let unitP = parseInt(e.target.value) || 0
                          let qty = parseInt(editFormData.quantity) || 0
                          setEditFormData({ ...editFormData, unitPrice: e.target.value, amount: editFormData ? unitP * qty : unitP * 1 })
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

      <div
        className="modal fade"
        id="invoice"
        tabIndex={-1}
        aria-labelledby="invoice"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Print Preview</h5>
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

              <div id="printArea">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <h5 style={{ textAlign: 'center', fontWeight: 900 }}>TINATETT HERBAL MANUFACTURING AND MARKKETING COMPANY LIMITED</h5>
                  <span style={{ textAlign: 'center' }}>P.O. BOC CO 2699, TEMA-ACCRA, WHOLESALE AND RETAIL OF HERBAL MEDICINE </span>
                  <span style={{ textAlign: 'center' }}>KOTOBABI SPINTEX - FACTORY WEARHOUSE, 02081660807, tinatettonline@gmail.com</span>
                  <h5 style={{ textAlign: 'center', textDecoration: 'underline', fontWeight: 700 }}>PROFORMA INVOICE</h5>
                  <h6 style={{ fontWeight: 700 }}>Customer Info: </h6>
                  <span>Customer Name : {selectedCustomerPrint?.label}</span>
                  {/* <span>Email: {selectedCustomerPrint?.email}</span>
                  <span>Contact: {selectedCustomerPrint?.contact}</span> */}
                  <span>Address: {selectedCustomerPrint?.location}</span>
                </div>
                <div className="row mt-3">
                  <div class="table-responsive mb-3">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>#</th><th>Product Name</th><th>Quantity</th><th>Unit Price</th><th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {printGridData?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <Link to="#">{item?.productName}</Link>
                              </td>
                              <td>{item?.quantity}</td>
                              <td>{item?.unitPrice}</td>
                              <td>{item?.amount}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>


                <div className="row mt-3">
                  <div className="col-lg-6" style={{ textAlign: 'right' }}></div>
                  <div className="col-lg-6 " style={{ textAlign: 'right' }}>
                    <div className="total-order w-100 max-widthauto m-auto mb-4">
                      <ul>

                        <li className="total" >
                          <h4>Grand Total</h4>
                          <h5>GHS {moneyInTxt(
                            printGridData.reduce((total, item) => total + Number(item.amount), 0)
                          )}</h5>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

              </div>

              <div className="col-lg-12" style={{ textAlign: 'right' }}>
                <Link to="#" className="btn btn-submit me-2" data-bs-dismiss="modal" onClick={() => printReport()}>
                  <FeatherIcon icon="printer" /> Print
                </Link>
                <Link to="#" className="btn btn-cancel" data-bs-dismiss="modal">
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTransfer;
