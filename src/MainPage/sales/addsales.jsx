import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Plus,
  Scanner,
  Product7,
  DeleteIcon,
  Calendar,
  Product8,
  Product1,
  EditIcon,
} from "../../EntryFile/imagePath";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import { useEffect } from "react";
import { useGet } from "../../hooks/useGet";
import Select from "react-select";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import { isValidNumber, moneyInTxt } from "../../utility";
import { BASE_URL } from "../../api/CustomAxios";
import useCustomApi from "../../hooks/useCustomApi";
import FeatherIcon from 'feather-icons-react'
import { usePost } from "../../hooks/usePost";
import alertify from "alertifyjs";
import "../../../node_modules/alertifyjs/build/css/alertify.css";
import "../../../node_modules/alertifyjs/build/css/themes/semantic.css";


const Addsales = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('cash')
  const [disabledUnselectedPrice,setDisableUnselectedPrice] = useState({retail: false, wholesale:false, special:false})
  const [customerList, setCustomerList] = useState([])
  const [productsList, setProductsList] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState({})
  const [selectedProductInfo, setSelectedProductInfo] = useState()
  const [price, setPrice] = useState(0)
  const [retailprice, setRetailPrice] = useState('')
  const [wholesaleprice, setWholesalePrice] = useState('')
  const [specialprice, setSpecialPrice] = useState('')
  const [formData, setFormData] = useState({quantity:'', amount:'', batchNumber:'', manuDate:'', expDate:''})
  const [salesType, setSalesType] = useState('Retail')
  const [paymentData, setPaymentData] = useState({paymentType:'', accountNo:'', branch: ''})
  const [productGridData, setProductGridData] = useState([])
  const [transDate, setTransDate] = useState(new Date().toISOString().substring(0,10))
  const [invoiceNo, setInvoiceNo] = useState('')
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false)
  const retailpriceTypeRef = useRef()
  const specialpriceTypeRef = useRef()
  const wholesalepriceTypeRef = useRef()
  const {
    data: customers,
    isLoading: customersIsLoading,
  } = useGet("customers", "/customer");

  const {
    data: products,
    isLoading: productsIsLoading,
  } = useGet("products", "/product");
  const { isLoading, data, isError, error, mutate } = usePost("/sales/suspend");

  // useEffect(() => {
  //   if(data?.success){
  //     setIsSubmitSuccessful(true)
  //     setProductGridData([])
  //     setFormData({quantity:0, amount:0, batchNumber:'', manuDate:'', expDate:''})
  //     setSelectedProduct('')
  //   }
  // }, [data])

  const axios = useCustomApi()

  const handleInvoice = () =>{

  }

  const handleNoInvoice = () => {

  }

  const handleCredit = () => {

  }

  const handleSuspend = () => {
    let payload = {
      customerId: selectedCustomer.value,
      transDate: transDate,
      totalAmount : productGridData.reduce((total, item) => total + item.amount, 0),
      salesType:salesType,
      products: productGridData,
    }



    //console.log(payload)
    mutate(payload)
    setProductGridData([])
    setFormData({quantity:'', amount:'', batchNumber:'', manuDate:'', expDate:''})
    setSelectedProduct('')
    setInvoiceNo('')
    setIsSubmitSuccessful(true)
  }

  useEffect(() => {
    if (!isError && !isLoading && isSubmitSuccessful) {
      console.log("res", data)
      alertify.set("notifier", "position", "top-right");
      alertify.success("Sales suspended successfully.");
    }
    else if(isError){
      alertify.set("notifier", "position", "top-right");
      alertify.error("Error...Could not suspend transaction");
    }
    
    return () => {};
  }, [isError, isLoading, isSubmitSuccessful]);

  const handleAddItem = () => {
    //console.log(productFormData)
  console.log(selectedCustomer)
      let obj = {
         name: selectedProduct.label,
         productId:selectedProduct.value,
         batchNumber: formData.batchNumber?.value,
         quantity :formData.quantity,
         unitPrice:price,
         amount:formData.quantity * price
      } 
      if (obj.amount < 1 || obj.unitPrice == '' || obj.name == '' || selectedCustomer == null) {
        alertify.set("notifier", "position", "top-right");
        alertify.warning("Please make sure all fields are filled.");
      }   
      else{
        setProductGridData([...productGridData, obj])
        setFormData({quantity:'', amount:'', batchNumber:'', manuDate:'', expDate:''})
        setSelectedProduct('')
        retailpriceTypeRef.current.checked = false
        wholesalepriceTypeRef.current.checked = false
        specialpriceTypeRef.current.checked = false
        setWholesalePrice('')
        setSpecialPrice('')
        setRetailPrice('')
      }
  
   
    }

  const handleProductSelect = (e) => {
    setSelectedProduct(e)
    setRetailPrice('(' + e.retailPrice + 'GHS)')
    setWholesalePrice('(' + e.wholeSalePrice  + 'GHS)')
    setSpecialPrice('(' + e.specialPrice  + 'GHS)')
    //console.log(e)
  }

  useEffect(() => {
    axios.get(`${BASE_URL}/purchase/product/${selectedProduct?.value}`).then((data) => {
      if(data.data.success){
        setSelectedProductInfo(data.data.data)
      }
    })

  }, [selectedProduct])


  useEffect(() => {
    if (!productsIsLoading && !customersIsLoading) {

      let mappedData =  customers?.data.map((customer) => {
          return {
            value: customer?.id,
            label: customer?.name,
            customerType: customer?.customerType,
          }
        })
      setCustomerList(mappedData)

          
      let mappedData2 =  products?.data.map((product) => {
          return {
            value: product?.id,
            label: product?.name,
            retailPrice: product?.retailPrice,
            wholeSalePrice: product?.wholeSalePrice,
            specialPrice: product?.specialPrice,
            remainingStock: product?.remainingStock,
            manuDate: product?.manufacturingDate,
            expDate: product?.expiryDate
          }
        })
        setProductsList(mappedData2)
      
    }
  }, [productsIsLoading, customersIsLoading])


  // if(productsIsLoading || customersIsLoading){
  //   return (<LoadingSpinner/>)
  // }

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Add Sale</h4>
            <h6>Add your new sale</h6>
          </div>
        </div>

      <div style={{display:'flex', gap:20}}>
        <div style={{width: '50%'}}>
          <div className="card" >
            <div className="card-body">
                <div className="row">
                <div className="col-6">
                    <div className="form-group">
                      <label> Date</label>
                      <div className="input-groupicon">
                      <input type="date" className="form-control" value={transDate} onChange={(e) => setTransDate(e.target.value)}/>
                      </div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="form-group">
                      <label>Invoice no. (Hard Copy)</label>
                      <div className="input-groupicon">
                      <input type="text" placeholder="" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)}/>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">

                  <div className="col-12">
                  <div className="form-group">
                    <label>Sales Type</label>
                    <div className="row">
                        

                          <div className="col-lg-6">

                            <div className="input-group">
                              <div className="input-group-text">
                                <input className="form-check-input" type="radio" name="salesType" checked={true}  value={'Retail'} onChange={(e) => {
                                 setSalesType(e.target.value)}}
                                />
                              </div>
                              <input type="text" className="form-control" aria-label="Text input with radio button"  placeholder={`Retail`} />
                            </div>
                          
                          </div>

                          <div className="col-lg-6">
                            <div className="input-group">
                              <div className="input-group-text">
                                <input className="form-check-input" type="radio" name="salesType" value={'Wholesale'} onChange={(e) => {
                                 setSalesType(e.target.value)}}
                                />
                              </div>
                              <input type="text" className="form-control" aria-label="Text input with radio button" placeholder={`Wholesale`} />
                            </div>
                        </div>

                          
                      </div>
                  </div>
                  </div>

                  {/* <div className="col-6">
                    <div className="form-group">
                      <label>Sales Type</label>
                      <div className="input-groupicon">
                      <Select style={{width:'100%'}}
                        options={options1}
                        value={formData.salesType}
                        onChange={(e) => setFormData({...formData, salesType: (e)})}
                      />
                      </div>
                    </div>
                  </div> */}

                </div>
            </div>
          </div>
          
          <div className="card" >
             <div className="card-body">
              <div className="row">

              <div className="col-12">
                    <div className="form-group">
                      <label>Customer</label>
                      <div className="row">
                        <div className="col-lg-12 col-sm-10 col-10">
                        
                        <Select
                            className="select"
                            options={customerList}
                            value={selectedCustomer}
                            onChange={(e) => setSelectedCustomer(e)}
                            isLoading={customersIsLoading}
                        />
                        
                        </div>
                        
                      </div>
                    </div>
                  </div>

                <div className="col-8">
                  <div className="form-group">
                    <label>Product Name</label>
                    <div className="input-groupicon">
                      <Select style={{width:'100%'}}
                          options={productsList}
                          placeholder={'Select product'}
                          value={selectedProduct}
                          onChange={handleProductSelect}
                          isSearchable= {true}
                          isLoading={productsIsLoading}
                          
                       />
                      
                    </div>
                  </div>
                </div>

                <div className="col-4">
                  <div className="form-group">
                    <label>Quantity Left</label>
                    <div className="input-groupicon">
                      <input
                        className="form-control"
                        type="text"
                        value={selectedProductInfo?.totalQuantity}
                        disabled
                      />
                      
                    </div>
                  </div>
                </div>

                <div className="col-4">
                  <div className="form-group">
                    <label>Batch No.</label>
                    <div className="input-groupicon">
                      <Select
                        options={selectedProductInfo?.batchNumber?.map((item) => {
                          return {value:item.batchNumber, label:item?.batchNumber + '-(' + item?.remainingQuantity +')', expireDate:item?.expireDate, manufacturingDate: item?.manufacturingDate}
                        })}
                        placeholder=""
                        value={formData.batchNumber}
                        onChange={(e) => setFormData({...formData, batchNumber: (e), manuDate: e.manufacturingDate, expDate: e.expireDate})}
                        //onChange={(e) => console.log(e)}
                      />
                      
                    </div>
                  </div>
                </div>

                <div className="col-4">
                  <div className="form-group">
                    <label>Manufacturing Date</label>
                    <div className="input-groupicon">
                      <DatePicker
                        selected={startDate}
                        value={formData?.manuDate.substring(0,10)}
                        disabled

                      />
                      <Link className="addonset">
                        <img src={Calendar} alt="img" />
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-4">
                  <div className="form-group">
                    <label>Exp. Date</label>
                    <div className="input-groupicon">
                    <DatePicker
                        selected={startDate}
                        value={formData?.expDate.substring(0,10)}
                        disabled

                      />
                      <Link className="addonset">
                        <img src={Calendar} alt="img" />
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-group">
                    <label>Unit Price</label>
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

                <div className="col-6">
                  <div className="form-group">
                    <label>Quantity</label>
                    <div className="input-groupicon">
                      <input
                       className="form-control"
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

               

                {/* <div className="col-6">
                  <div className="form-group">
                    <label>Balance</label>
                    <div className="input-groupicon">
                      <input
                        className="form-control"
                        type="number"
                      />
                      
                    </div>
                  </div>
                </div> */}

                <div className="col-12" style={{display:'flex', justifyContent:'flex-end'}}>
                <div className="form-group">
                  <label></label>
                  <Link to="#" className="btn btn-submit me-2" style={{width: '100%', textAlign:'center', marginTop:8}} onClick={handleAddItem}>
                  <FeatherIcon icon="shopping-cart"/> {" Add to Basket"}
                    </Link>
                  </div>
                 
                </div>
                </div>
               
            </div>
            
          </div>

          <div className="card">
            <div className="card-body">
                <div className="payment-div">
                  <ul className="nav nav-tabs">
                      <li className="nav-item" onClick={()=>setActiveTab('cash')}>
                        <a className={activeTab == 'cash' ? `nav-link active`: `nav-link`} href="javascript:void(0);">Cash</a>
                      </li>

                      <li className="nav-item" onClick={()=>setActiveTab('cheque')}>
                        <a className={activeTab == 'cheque' ? `nav-link active`: `nav-link`} href="javascript:void(0);">Cheque</a>
                      </li>

                      <li className="nav-item" onClick={()=>setActiveTab('momo')}>
                        <a className={activeTab == 'momo' ? `nav-link active`: `nav-link`} href="javascript:void(0);">Mobile Money</a>
                      </li>
                      
                  </ul>

                  {activeTab == 'cash' ? <div id="cash-tab" style={{marginTop:20}}>
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group">
                        <label>Waybill</label>
                        <div className="input-groupicon">
                          <input
                            type="text"
                            placeholder=""
                          />
                          
                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="form-group">
                        <label>Amount </label>
                        <div className="input-groupicon">
                          <input
                            type="text"
                            placeholder=""
                          />
                          
                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="form-group">
                        <label>Receipt No </label>
                        <div className="input-groupicon">
                          <input
                            type="text"
                            placeholder=""
                          />
                          
                        </div>
                      </div>
                    </div>

                  </div>
                </div> : null}
                {activeTab == 'cheque' ? <div id="cheque-tab" style={{marginTop:20}}>
                  <div className="row">

                  <div className="col-6">
                      <div className="form-group">
                        <label>Waybill</label>
                        <div className="input-groupicon">
                          <input
                            type="text"
                            placeholder=""
                          />
                          
                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                        <div className="form-group">
                          <label>Cheque No</label>
                          <div className="input-groupicon">
                            <input
                              type="text"
                              placeholder=""
                            />
                            
                          </div>
                        </div>
                      </div>


                      <div className="col-6">
                      <div className="form-group">
                        <label>Receipt No</label>
                        <div className="input-groupicon">
                          <input
                            type="text"
                            placeholder=""
                          />
                          
                        </div>
                      </div>
                    </div>

                      <div className="col-6">
                      <div className="form-group">
                        <label>Due Date</label>
                        <div className="input-groupicon">
                          <input
                            type="date"
                            placeholder=""
                            className="form-control"
                          />
                          
                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="form-group">
                        <label>Bank</label>
                        <div className="input-groupicon">
                          <input
                            type="text"
                            placeholder=""
                          />
                          
                        </div>
                      </div>
                    </div>

                      

                      <div className="col-6">
                        <div className="form-group">
                          <label>Amount</label>
                          <div className="input-groupicon">
                            <input
                              type="text"
                              placeholder=""
                            />
                            
                          </div>
                        </div>
                      </div>
                  </div>
                   
                </div> : null}
                {activeTab == 'momo' ? <div id="momo-tab" style={{marginTop:20}}>
                  <div className="row">
                  <div className="col-6">
                      <div className="form-group">
                        <label>Receipt No</label>
                        <div className="input-groupicon">
                          <input
                            type="text"
                            placeholder=""
                          />
                          
                        </div>
                      </div>
                    </div>


                    <div className="col-6">
                      <div className="form-group">
                        <label>Name</label>
                        <div className="input-groupicon">
                          <input
                            type="text"
                            placeholder=""
                          />
                          
                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="form-group">
                        <label>Amount</label>
                        <div className="input-groupicon">
                          <input
                            type="text"
                            placeholder=""
                          />
                          
                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="form-group">
                        <label>Transaction ID</label>
                        <div className="input-groupicon">
                          <input
                            type="text"
                            placeholder=""
                          />
                          
                        </div>
                      </div>
                    </div>
                  </div>
                   
                </div> :null}
                </div>
            </div>
          </div>
        </div>



        <div style={{width:'50%'}}>
        <div className="card" >
          <div className="card-body">
              <div className="row">
                <div className="col-lg-12">
                <div className="row" >
                <div className="table-responsive mb-3" style={{height:720, maxHeight:720, overflow:'auto'}}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Product Name</th>
                        <th>Exp Date</th>
                        <th>QTY</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                        <th>Action</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {
                        productGridData?.map((item, i) => {
                          return (
                            <tr>
                            <td>{i+1}</td>
                            <td>
                            {/* <td className="productimgname"> */}
                              {/* <Link className="product-img">
                                <img src={Product7} alt="product" />
                              </Link> */}
                              <Link to="#">{item.name}</Link>
                            </td>
                            <td>{item?.expDate}</td>
                            <td>{item.quantity}</td>
                            <td>{item.unitPrice}</td>
                            <td>{item.amount}</td>
                            
                            <td>
                            <Link to="#" className="delete-set me-2">
                                <img src={EditIcon} alt="svg" />
                              </Link>
                              <Link to="#" className="delete-set">
                                <img src={DeleteIcon} alt="svg" />
                              </Link>
                            </td>
                          </tr>
                          )
                        })
                      }
                     
                     
                    </tbody>
                  </table>
                </div>
              </div>
                </div>



              </div>  
          </div>
        </div>     
            
        <div className="card" >
          <div className="card-body">
              <div className="row">
                <div className="col-lg-6 ">
                  <div className="total-order w-100 max-widthauto m-auto mb-4">
                    <ul>
                      <li>
                        <h4>Amount Given</h4>
                        <h5>GHS 0.00 </h5>
                      </li>
                      <li>
                        <h4>Discount </h4>
                        <h5>GHS 0.00</h5>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-6 ">
                  <div className="total-order w-100 max-widthauto m-auto mb-4">
                    <ul>
                    <li className="total">
                        <h4>Grand Total</h4>
                        <h5>GHS {moneyInTxt(productGridData.reduce((total, item) => total + item.amount, 0))}</h5>
                      </li>
                      <li>
                        <h4>Balance</h4>
                        <h5>GHS 0.00</h5>
                      </li>
                     
                    </ul>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-12" >
                  <Link to="#" className="btn btn-submit me-2" onClick={handleSuspend} style={{width:'100%'}}>
                  <FeatherIcon icon="pause"/>
                    Suspend Sale
                  </Link>                
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-lg-12" style={{display:'flex', justifyContent:'space-between'}} >
                  <button className="btn btn-info me-2" onClick={handleInvoice} style={{width:'20%'}}>
                    Sell and Print
                  </button>
                  <button className="btn btn-warning me-2" onClick={handleNoInvoice} style={{width:'20%'}}>
                    Sell Only
                  </button>
                  <button className="btn btn-danger me-2" style={{width:'20%'}} onClick={handleCredit} >
                    Credit and Print
                  </button>
                  <button  className="btn btn-cancel" style={{width:'20%'}} onClick={handleCredit}>
                     Credit Only
                  </button>
                  
                </div>
              </div>
               
            </div>
        </div>
        </div>

       
      </div>
        
        </div>
      </div>
  
  );
};

export default Addsales;
