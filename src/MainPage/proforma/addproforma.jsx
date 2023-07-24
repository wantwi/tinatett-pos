import React, { useRef, useState } from "react";
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
  EditIcon,
  Plus,
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


const AddProforma = () => {
  const [customerOptions, setCustomerOptions] = useState([])
  const [productOptions, setProductOptions] = useState([])


  const { data: customers, isError, isLoading: isCustomerLoading, isSuccess } = useGet("customers", "/customer");
  const { data: products, isLoading: isProductLoading } = useGet("products", "/product");
  const { isLoading, isError: isPostError, error, mutate } = usePost("/proforma");

  const [selectedProduct, setSelectedProduct] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [selectedCustomerPrint, setSelectedCustomerPrint] = useState('')
  const [formData, setFormData] = useState({ amount: '', quantity: '', price: '' })
  const [editFormData, setEditFormData] = useState({ amount: '', quantity: '', price: '' })
  const [productGridData, setProductGridData] = useState([])
  const [printGridData, setPrintGridData] = useState([])
  const [transDate, setTransDate] = useState(new Date().toISOString().slice(0, 10));
  const retailpriceTypeRef = useRef()
  const specialpriceTypeRef = useRef()
  const wholesalepriceTypeRef = useRef()
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false)


  useEffect(() => {
    if (!isProductLoading && !isCustomerLoading) {
      let mappedData = customers?.data.map((customer) => {
        return {
          id: customer?.id,
          label: customer?.name,
          value: customer?.id,
          location: customer?.location,
          contact: customer?.contact,
          email: customer?.email

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
          specialPrice: product?.specialPrice
        }
      })
      setProductOptions(mappedData2)
   
    }
   
  }, [isCustomerLoading, isProductLoading])


  const handleProductSelect = (e) => {
    if (products && !isProductLoading) {
      // let item = products?.data.find((product) => product.id == e.target.value)
      setSelectedProduct(e)
    }
  }

  const handleCustomerSelect = (e) => {
    if (customers && !isCustomerLoading) {
      // let item = customers?.data.find((customer) => customer.id == e.target.value)
      setSelectedCustomer(e)
      setSelectedCustomerPrint(e)
      
    }
  }

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
  const handleAddItem = () => {
    let item =

    {
      productId: selectedProduct.id,
      productName: selectedProduct.label,
      quantity: formData.quantity,
      unitPrice: formData?.price,
      amount: formData?.price * formData?.quantity

    }
    if (item.amount < 1 || formData.unitPrice == '' || item.productName == '' || selectedCustomer == '') {
      alertify.set("notifier", "position", "top-right");
      alertify.warning("Please make sure all fields are filled.");
    }
    else {


      setProductGridData([...productGridData, item])
      setPrintGridData([...printGridData, item])
      setFormData({ quantity: '', amount: '' })
      setSelectedProduct('')
      retailpriceTypeRef.current.checked = false
      wholesalepriceTypeRef.current.checked = false
      specialpriceTypeRef.current.checked = false

    }

  }

  const axios = useCustomApi()
  const onSubmit = () => {

    if (productGridData.length < 1) {
      alertify.set("notifier", "position", "top-right");
      alertify.warning("Please add at least one item to list before saving.");
    }
    else {
      let payload = {
        customerId: selectedCustomer.id,
        transDate: transDate,
        products: productGridData
      }
     // mutate(postBody)
     axios.post('/proforma', payload)
     .then((res) => {
        if(res.status == 201 || res.data.success == true){

          alertify.set("notifier", "position", "top-right");
          alertify.success("Proforma saved successfully.");

          setSelectedCustomer({})
          setSelectedProduct({})
          setFormData({ amount: '', quantity: '', price: '' })
          setProductGridData([])
          setTransDate('')

          setTimeout(() => {
            let base64 = res.data.base64
            const blob = base64ToBlob(base64, 'application/pdf');
            const url = URL.createObjectURL(blob);
            const pdfWindow = window.open("");
            pdfWindow.document.write("<iframe width='100%' height='100%' src='" + url + "'></iframe>");
          }, 1500)
          
        }
        else{
          alertify.set("notifier", "position", "top-right");
          alertify.error("Error...Could not save.");
        }
     })


      //base 64 function
      function base64ToBlob(base64, type = "application/octet-stream") {
        const binStr = atob(base64);
        const len = binStr.length;
        const arr = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          arr[i] = binStr.charCodeAt(i);
        }
        return new Blob([arr], { type: type });
      }

    }

  };

  const createPDF =  (id) => {
    const pdf = new jsPDF("portrait", "pt", "a4");
    const data =  document.getElementById(id);
    pdf.html(data).then(() => {
      pdf.save(`Proforma.pdf`);
    });
    setPrintGridData([])
  };


  const printReport = () => {
    let printContents = document.getElementById('printArea').innerHTML
    let originalContents = document.body.innerHTML
    document.body.innerHTML = printContents
    window.print(printContents)

    document.body.innerHTML = originalContents
    location.reload()
  }


  useEffect(() => {
    setFormData({ ...formData, amount: Number(formData.price) * Number(formData.quantity) || '' })
    console.log(formData.price)
  }, [formData.quantity])


  useEffect(() => {
  
    console.log(selectedCustomer)
  }, [selectedCustomer])

  if (isProductLoading && isCustomerLoading) {
    return <LoadingSpinner />
  }

  // if(isLoading){
  //   return <LoadingSpinner message="Saving Proforma.."/>
  // }

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Add Proforma</h4>
            <h6>Add your new proforma</h6>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20 }}>

          <div style={{ display: 'flex', flexDirection: 'column', width: '35%', }}>
            <div className="card">
              {/* <form onSubmit={handleSubmit(onSubmit)}> */}
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-12 col-sm-12 col-12">
                    <div className="form-group">
                      <label>Customer Name</label>
                      <div className="row">
                        <div className="col-lg-10 col-sm-12 col-12">
                          <Select
                            className="select"
                            options={customerOptions}
                            onChange={handleCustomerSelect}
                            value={selectedCustomer}

                          />
                        </div>

                        <div className="col-lg-2 col-sm-2 col-2 ps-0">
                            <div className="add-icon">
                              <Link to="#">
                                <img src={Plus} alt="img" />
                              </Link>
                            </div>
                        </div>

                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 col-sm-12 col-12">
                    <div className="form-group">
                      <label> Date</label>
                      <input type="date" className="form-control" value={transDate} onChange={(e) => setTransDate(e.target.value)} />                   
                
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="col-lg-12 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Product Name (Designation)</label>
                    <Select
                      className="select"
                      options={productOptions}
                      onChange={handleProductSelect}
                      value={selectedProduct}
                    />
                  </div>
                </div>


                <div className="col-lg-12 col-sm-12 col-12">
                  <div className="form-group">
                    <label>Unit Price </label>
                    <div className="row">

                      <div class="col-lg-6">

                        <div class="input-group">
                          <div class="input-group-text">
                            <input className="form-check-input" type="radio" name="customerType" value={selectedProduct?.retailPrice} ref={retailpriceTypeRef}
                              onChange={(e) => {
                                if (selectedProduct == '') {
                                  alertify.set("notifier", "position", "top-right");
                                  alertify.warning("Please select a product first.");
                                  retailpriceTypeRef.current.checked = false
                                } else {
                                  setFormData({ ...formData, price: selectedProduct.retailPrice, amount: formData.quantity ? selectedProduct?.retailPrice * formData.quantity : selectedProduct?.retailPrice * 1 })
                                  //console.log(selectedProduct?.retailPrice, formData.quantity, formData.amount)
                                }

                              }} />
                          </div>
                          <input type="text" className="form-control" aria-label="Text input with radio button" value={'Retail Price'} />
                        </div>

                      </div>

                      <div class="col-lg-6">
                        <div class="input-group">
                          <div class="input-group-text">
                            <input className="form-check-input" type="radio" name="customerType" value={selectedProduct?.wholeSalePrice} ref={wholesalepriceTypeRef}
                              onChange={(e) => {
                                if (selectedProduct == '') {
                                  alertify.set("notifier", "position", "top-right");
                                  alertify.warning("Please select a product first.");
                                  wholesalepriceTypeRef.current.checked = false
                                } else {
                                  setFormData({ ...formData, price: selectedProduct.wholeSalePrice, amount: formData.quantity ? selectedProduct.wholeSalePrice * formData.quantity : selectedProduct.wholeSalePrice * 1 })
                                  //console.log(selectedProduct?.wholeSalePrice, formData.quantity, formData.amount)
                                }

                              }} />
                          </div>
                          <input type="text" className="form-control" aria-label="Text input with radio button" value={'Wholesale Price'} />
                        </div>
                      </div>
                    </div>

                    <div className="row" style={{ marginTop: 20 }}>
                      <div class="col-lg-6">

                        <div class="input-group">
                          <div class="input-group-text">
                            <input className="form-check-input" type="radio" name="customerType" value={selectedProduct?.specialPrice} ref={specialpriceTypeRef}
                              onChange={(e) => {
                                if (selectedProduct == '') {
                                  alertify.set("notifier", "position", "top-right");
                                  alertify.warning("Please select a product first.");
                                  specialpriceTypeRef.current.checked = false
                                } else {
                                  setFormData({ ...formData, price: selectedProduct.specialPrice, amount: formData.quantity ? selectedProduct.specialPrice * formData.quantity : selectedProduct.specialPrice * 1 })
                                  //console.log(selectedProduct?.specialPrice, formData.quantity, formData.amount)
                                }

                              }} />
                          </div>
                          <input type="text" className="form-control" aria-label="Text input with radio button" value={'Special Price'} />
                        </div>

                      </div>
                    </div>

                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Quantity</label>
                      <div className="input-groupicon">
                        <input
                          type="text"
                          //min={1}
                          className="form-control"
                          value={formData.quantity}
                          // {...register("quantity")}
                          onChange={(e) => {
                            if(e.target.value == ''){
                              setFormData({...formData, quantity: ''})
                            }
                            else if(isValidNumber(e.target.value)) {
                              setFormData({ ...formData, quantity: Number(e.target.value) })
                            }

                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Amount</label>
                      <div className="input-groupicon">
                        <input
                          type="text"
                          className="form-control"
                          disabled
                          value={formData.amount}

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


          <div className="card" style={{ width: '65%' }} >
            <div className="card-body">
              <div className="row">
                <div className="table-responsive mb-3">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Amount</th>
                        <th>Action</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {productGridData?.map((item, index) => {
                        return (
                          <tr key={item?.id}>
                            <td>{index + 1}</td>
                            <td>
                              {/* <td className="productimgname"> */}
                              {/* <Link className="product-img">
                                  <img src={Product7} alt="product" />
                                </Link> */}
                              <Link to="#">{item?.productName}</Link>
                            </td>
                            <td>{item?.quantity}</td>
                            <td>{item?.unitPrice}</td>
                            <td>{item?.amount}</td>

                            <td>
                            <Link to="#" className="me-2">
                                <img src={EditIcon} alt="svg" data-bs-toggle="modal" data-bs-target="#editproduct" onClick={() => setEditFormData(item)}/>
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
                  <button type="submit" className="btn btn-submit me-2" onClick={onSubmit}><FeatherIcon icon="save" />
                    {" Generate Proforma"}
                  </button>
                  {/* <Link id="printModalClick" to="#" className="btn btn-cancel me-2" style={{ backgroundColor: '#FF9F43' }} data-bs-toggle="modal"
                    data-bs-target="#create" >
                    Refresh
                  </Link> */}
                  <Link to="/tinatett-pos/proforma/proformalist" className="btn btn-cancel">
                    Cancel
                  </Link>
                </div>
              </div>
            </div>
            {/* </form> */}
          </div>
        </div>


      </div>


      <div
        className="modal fade"
        id="create"
        tabIndex={-1}
        aria-labelledby="create"
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
                    <div style={{display:'flex', flexDirection:'column', gap:10}}>
                      <h5 style={{textAlign:'center', fontWeight:900}}>TINATETT HERBAL MANUFACTURING AND MARKKETING COMPANY LIMITED</h5>
                      <span style={{textAlign:'center'}}>P.O. BOC CO 2699, TEMA-ACCRA, WHOLESALE AND RETAIL OF HERBAL MEDICINE </span>
                      <span style={{textAlign:'center'}}>KOTOBABI SPINTEX - FACTORY WEARHOUSE, 02081660807, tinatettonline@gmail.com</span>
                      <h5 style={{textAlign:'center', textDecoration:'underline', fontWeight:700}}>PROFORMA INVOICE</h5>
                      <h6 style={{fontWeight:700}}>Customer Info: </h6>
                      <span>Customer Name : {selectedCustomerPrint?.label}</span>
                      <span>Email: {selectedCustomerPrint?.email}</span>
                      <span>Contact: {selectedCustomerPrint?.contact}</span>
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
                                  <tr key={item?.id}>
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
                    <div className="col-lg-6"  style={{ textAlign: 'right' }}></div>
                      <div className="col-lg-6 "  style={{ textAlign: 'right' }}>
                        <div className="total-order w-100 max-widthauto m-auto mb-4">
                          <ul>

                            <li className="total" >
                              <h4>Grand Total</h4>
                              <h5>GHS {moneyInTxt(
                                printGridData.reduce((total, item) => total + item.amount, 0)
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
                        <label>Unit Price</label>
                        <input type="text" value={editFormData?.unitPrice} 
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
    </div>
  );
};

export default AddProforma;
