import React, { useEffect, useState } from "react";
import Table from "../../EntryFile/datatable";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import Tabletop from "../../EntryFile/tabletop";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import {

  Calendar,
  Printer,
  search_whites,
  //Search,
  PlusIcon,
  //EditIcon,
  Dollar1,
  Download,
  pause1,
  delete1,
  //DeleteIcon,
  datepicker,
  DeleteIcon,
} from "../../EntryFile/imagePath";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import { useGet } from "../../hooks/useGet";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import { commaRemover, isValidNumber, moneyInTxt } from "../../utility";
import useCustomApi from "../../hooks/useCustomApi";
import { usePost } from "../../hooks/usePost";
import alertify from "alertifyjs";
import "../../../node_modules/alertifyjs/build/css/alertify.css";
import "../../../node_modules/alertifyjs/build/css/themes/semantic.css";
import { Button } from "antd";
import FeatherIcon from 'feather-icons-react'

const Cashier = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [startDate1, setStartDate1] = useState(new Date());
  const [inputfilter, setInputfilter] = useState(true);
  const [activeTab, setActiveTab] = useState('Cash')
  const [modalData, setModalData] = useState(null)
  const [isCredit, setIsCredit] = useState(false)
  const [paymentInfo, setPaymentInfo] = useState({
    type:'',
    cashWaybill:'',
    cashReceiptNo:'',
    cashAmount:'',
    chequeNo:'',
    chequeReceiptNo:'',
    chequeAmount:'',
    chequeWaybill:'',
    dueDate:'',
    bank:'',
    momoName:'',
    momoReceiptNo:'',
    momoAmount:'' ,
    transactionID:'',
    amountPaid:''
     
  })
  const [filter, setFilter] = useState('All')
  const [productGridData, setProductGridData] = useState([])


  useEffect(() => {
   setPaymentInfo({...paymentInfo, amountPaid: Number(paymentInfo.cashAmount) + Number(paymentInfo.chequeAmount) + Number(paymentInfo.momoAmount)})
  }, [paymentInfo.cashAmount, paymentInfo.chequeAmount, paymentInfo.momoAmount])

  const {
    data: sales,
    isError,
    isLoading,
    isSuccess,
  } = useGet("suspend", "/sales/suspend");
  const [data, setData] = useState([])


  const togglefilter = (value) => {
    setInputfilter(value);
  };

  const confirmText = (id) => {
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
    }) .then( async() => {
     
      let data = await axios.delete(`/suspend/${id}`)
      if(data.status < 205){
        Swal.fire({
          type: "success",
          title: "Deleted!",
          text: "Your suspended item has been deleted.",
          confirmButtonClass: "btn btn-success",
        });
        setTimeout(() => {
          window.location.reload()
        },1000)
   
      }
      else{
        Swal.fire({
          type: "danger",
          title: "Error!",
          text: data.response.data.message,
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

  const axios = useCustomApi()

  const processPayment = (type, print) =>{
    if((Number(paymentInfo.cashAmount) + Number(paymentInfo.cashAmount) + Number(paymentInfo.cashAmount) > 0 ) || type == 'Credit'){
      let pType = ''
      if(paymentInfo.cashAmount > 0){
        pType = pType.concat('Cash,')
      }
      if(paymentInfo.momoAmount > 0){
        pType = 
        pType.concat('Momo,')
      }
      if(paymentInfo.chequeAmount > 0){
        pType = pType.concat('Cheque,')
      }
      let payload = {
        status: type,
        salesRef:modalData.Reference,
        amount: (Number(paymentInfo.cashAmount) + Number(paymentInfo.cashAmount) + Number(paymentInfo.cashAmount)) ,
        // amount:modalData?.Total,
        paymentType: pType,
        paymentInfo: [
          {"type":"Cash", waybill:paymentInfo.cashWaybill, amountPaid: paymentInfo.cashAmount },
          {"type":"Momo", name: paymentInfo.momoName,  receiptNo: paymentInfo.momoReceiptNo, amountPaid: paymentInfo.momoAmount},
          {"type":"Cheque", waybill: paymentInfo.chequeWaybill,  chequeNo: paymentInfo.chequeNo, chequeReceiptNo: paymentInfo.chequeReceiptNo, amountPaid: paymentInfo.chequeAmount, waybill: paymentInfo.chequeWaybill}
        ]
      }
  
     //console.log(payload)
      axios.post('/sales',payload)
      .then((res) => {
        console.log(res.data.success)
        if(res.data.success){
          if(print){
            getInvoiceReceipt(modalData.Reference)
          }
          alertify.set("notifier", "position", "top-right");
          alertify.success("Sale completed.");
         
        }
      })
      .catch((error) => {
        alertify.set("notifier", "position", "top-right");
        alertify.error("Error...Could not complete transaction");
      })
      .finally(() => {
        setIsCredit(false)
        setPaymentInfo({type:'',
        cashWaybill:'',
        cashReceiptNo:'',
        cashAmount:'',
        chequeNo:'',
        chequeReceiptNo:'',
        chequeAmount:'',
        chequeWaybill:'',
        dueDate:'',
        bank:'',
        momoName:'',
        momoReceiptNo:'',
        momoAmount:'' ,
        transactionID:'',
        amountPaid:''
       })
        setTimeout(() => {
          $('.modal').modal('hide')
          window.location.reload()
        }, 1500)
        //
      })
    }
    else{
      alertify.set("notifier", "position", "top-right");
      alertify.warning("Please enter an amount first");
    }
    

  }

  const getInvoiceReceipt = (salesref) => {
    axios.get('/sales/getSaleReceipt/'+ salesref)
    .then((res) =>{
    console.log(res.data)
    var base64 = res.data.base64
    const blob = base64ToBlob( base64, 'application/pdf' );
    const url = URL.createObjectURL( blob );
    const pdfWindow = window.open("");
    pdfWindow.document.write("<iframe width='100%' height='100%' src='" + url + "'></iframe>");
    })
    
    function base64ToBlob( base64, type = "application/octet-stream" ) {
      const binStr = atob( base64 );
      const len = binStr.length;
      const arr = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        arr[ i ] = binStr.charCodeAt( i );
      }
      return new Blob( [ arr ], { type: type } );
    }
  }

 


  const options = [
    { id: 'Retail', text: "Retail", text: "Retail" },
    { id: 'Wholesale', text: "Wholesale", text: "Wholesale" },
    { id: 'All', text: "All", text: "All" },
  ];
  const options1 = [
    { id: 1, text: "Cash", text: "Cash" },
    { id: 2, text: "Online", text: "Online" },
    { id: 2, text: "Inprogess", text: "Inprogess" },
  ];



  useEffect(() => {
    if(!isLoading){
      let mappedData =  sales?.data.map((sale) => {
          return {
            id: sale?.id,
            Date: sale?.transDate,
            Name: sale?.customer?.name || 'N/A',
            Status: sale?.status,
            Reference: sale?.salesRef,
            Payment: sale?.paymentType,
            Total: moneyInTxt(sale?.totalAmount),
            Paid: sale?.changeAmt,
            Due: sale?.balance,
            Biller: sale?.salesPerson,
            salestype: sale?.salesType
          }
        })
      setData(mappedData)
      console.log('loaded..')
    }
    else{
      console.log('loading...')
    }
  }, [isLoading])



  useEffect(() => {
    if(!isLoading){
    let mappedData =  sales?.data.map((sale) => {
      return {
        id: sale?.id,
        Date: sale?.transDate,
        Name: sale?.customer?.name || 'N/A',
        Status: sale?.status,
        Reference: sale?.salesRef,
        Payment: sale?.paymentType,
        Total: moneyInTxt(sale?.totalAmount),
        Paid: sale?.changeAmt,
        Due: sale?.balance,
        Biller: sale?.salesPerson,
        salestype: sale?.salesType
      }
    })
    if(filter == 'All'){
      setData(mappedData)
    }
    else{
      setData(mappedData?.filter((item) => item?.salestype == filter))
    }
   
  }
  }, [filter])


  const getSalesProductById = (id) => {
    axios.get(`/sales/suspend/items/${id}`)
    .then((res) => {
      let x = (res.data?.data)
      console.log("Items", x)
      let mapped = x.map((item) => 
        {
          return {
            salesRef: item?.salesRef,
            name:  item?.product?.name,
            productId: item?.id,
            quantity: item?.quantity,
            unitPrice: item?.unitPrice,
            amount: item?.amount
          }
      })
     setProductGridData(mapped)
    })//.finally(() => setLoading(false))
  }


  const columns = [
    {
      title: "Date",
      dataIndex: "Date",
      sorter: (a, b) => a.Date.length - b.Date.length,
    },
    {
      title: "Customer name",
      dataIndex: "Name",
      sorter: (a, b) => a.Name.length - b.Name.length,
    },
   
    {
      title: "Reference",
      dataIndex: "Reference",
      sorter: (a, b) => a.Reference.length - b.Reference.length,
    },
   
    {
      title: "Amt Due (GHS)",
      dataIndex: "Total",
      sorter: (a, b) => a.Total.length - b.Total.length,
    },
    {
      title: "Sales Type",
      dataIndex: "salestype",
      render: (text, record) => (
        <>
         <p>{text}</p>
        </>
      ),
      sorter: (a, b) => a.salestype.length - b.salestype.length,
    },
    {
      title: "Biller",
      dataIndex: "Biller",
      sorter: (a, b) => a.Biller.length - b.Biller.length,
    },
    {
      title: "Action",
      render: (text, record) => (
        <>
        
              {/* <li>
                <Link to="/tinatett-pos/sales/sales-details" className="dropdown-item">
                  <img src={Eye1} className="me-2" alt="img" />
                  Sale Detail
                </Link>
              </li>
              <li>
                <Link to="/tinatett-pos/sales/edit-sales" className="dropdown-item">
                  <img src={EditIcon} className="me-2" alt="img" />
                  Edit Sale
                </Link>
              </li> */}
                 <Link
                  to="#" data-bs-toggle="modal" data-bs-target="#showproducts" title="View"  onClick={() => getSalesProductById(record.id)}>
                    <span class="badges btn-cancel me-2"><FeatherIcon icon="eye"/> View</span>
                  </Link>
            
                <Link
                  to="#"
                  // className="dropdown-item"
                  data-bs-toggle="modal"
                  data-bs-target="#showpayment"
                  onClick={() => {setModalData(record), setIsCredit(false)}}
                  title={'Pay'}
                >
                  {/* <img src={Dollar1} className="me-2" alt="img" /> */}
                  <span className="badges bg-lightgreen me-2"><FeatherIcon icon="credit-card"/> Pay</span>
                  {/* Pay */}
                </Link>

                <Link
                  to="#"
                  // className="dropdown-item"
                  data-bs-toggle="modal"
                  data-bs-target="#cashpayment"
                  onClick={() => {setModalData(record), setIsCredit(false)}}
                  title={'Pay Cash'}
                >
                  {/* <img src={Dollar1} className="me-2" alt="img" /> */}
                  <span className="badges btn-success me-2"><FeatherIcon icon="dollar-sign"/> Cash</span>
                  {/* Pay */}
                </Link>
             


                <Link
                  to="#"
                  // className="dropdown-item"
                  data-bs-toggle="modal"
                  data-bs-target="#creditpayment"
                  onClick={() => {setModalData(record), setIsCredit(true)}}
                  title={'Credit'}
                >
                  {/* <img src={Dollar1} className="me-2" alt="img" /> */}
                  <span className="badges btn-primary me-2"><FeatherIcon icon="credit-card"/> Credit</span>
                  {/* Pay */}
                </Link>
             
      
                <Link
                  to="#"
                  // className="dropdown-item confirm-text"
                  onClick={confirmText}
                  title={'Remove'}
                >
                  
                  <span className="badges bg-lightred"><FeatherIcon icon="trash"/> Remove</span>
                  {/* Remove  */}
                </Link>
             
            
        </>
      ),
    },
  ];


  if (isLoading) {
    return (<LoadingSpinner message="Fetching Suspended sales.." />)
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Cashier's Window</h4>
              <h6>Complete Suspend </h6>
            </div>
            <div className="page-btn">
              {/* <Link to="/tinatett-pos/sales/add-sales" className="btn btn-added">
                <img src={PlusIcon} alt="img" className="me-1" />
                Go to Sales
              </Link> */}
            </div>
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-body">
              <Tabletop inputfilter={inputfilter} togglefilter={togglefilter} />
              {/* /Filter */}
              <div
                className={`card mb-0 ${inputfilter ? "toggleCls" : ""}`}
                id="filter_inputs"
                style={{ display: inputfilter ? "block" : "none" }}
              >
                <div className="card-body pb-0">
                  <div className="row">
                    
                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="form-group">
                        <Select2
                          className="select"
                          data={options}
                          options={{
                            placeholder: "Filter by Sales Type",
                          }}
                          value={filter}
                          onChange={(e) => setFilter(e.target.value)}
                        />
                      </div>
                    </div>
                    {/* <div className="col-lg-3 col-sm-6 col-12">
                      <div className="form-group">
                        <Link className="btn btn-filters ms-auto">
                          <img src={search_whites} alt="img" />
                        </Link>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
              {/* /Filter */}
              <div className="table-responsive">
                <Table columns={columns} dataSource={data} />
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>
      </div>
      <>
       {/* show payment Modal */}
        <div
          className="modal fade"
          id="showpayment"
          tabIndex={-1}
          aria-labelledby="showpayment"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Sales Type: {modalData?.salestype}</h5>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setIsCredit(false)}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '4fr 1fr' }}>
                  <div className="card" style={{ border: '1px solid #252525' }}>
                    <div className="card-body">
                      <div className="payment-div" >
                        <ul className="nav nav-tabs">
                          <li className="nav-item" onClick={() => setActiveTab('Cash')}>
                            <a className={activeTab == 'Cash' ? `nav-link active` : `nav-link`} href="javascript:void(0);">Cash</a>
                          </li>

                          <li className="nav-item" onClick={() => setActiveTab('Cheque')}>
                            <a className={activeTab == 'Cheque' ? `nav-link active` : `nav-link`} href="javascript:void(0);">Cheque</a>
                          </li>

                          <li className="nav-item" onClick={() => setActiveTab('Momo')}>
                            <a className={activeTab == 'Momo' ? `nav-link active` : `nav-link`} href="javascript:void(0);">Mobile Money</a>
                          </li>

                        </ul>

                        {activeTab == 'Cash' ? <div id="cash-tab" style={{ marginTop: 20 }}>
                          <div className="row">
                            <div className="col-6">
                              <div className="form-group">
                                <label>Waybill</label>
                                <div className="input-groupicon">
                                  <input
                                    type="text"
                                    placeholder=""
                                    value={paymentInfo.cashWaybill}
                                    onChange={(e) => setPaymentInfo({...paymentInfo, cashWaybill: e.target.value})}
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
                                    value={paymentInfo.cashAmount}
                                    onChange={(e) => {
                                      if(e.target.value == ''){
                                        setPaymentInfo({...paymentInfo, cashAmount: ''})
                                      }
                                      else if(isValidNumber(e.target.value)){
                                        setPaymentInfo({...paymentInfo, cashAmount: Number(e.target.value)})
                                      }
                                     
                                    }}
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
                                    value={paymentInfo.cashReceiptNo}
                                    onChange={(e) => setPaymentInfo({...paymentInfo, cashReceiptNo: e.target.value})}
                                  />

                                </div>
                              </div>
                            </div>

                          </div>
                        </div> : null}
                        {activeTab == 'Cheque' ? <div id="cheque-tab" style={{ marginTop: 20 }}>
                          <div className="row">

                            <div className="col-6">
                              <div className="form-group">
                                <label>Waybill</label>
                                <div className="input-groupicon">
                                  <input
                                    type="text"
                                    placeholder=""
                                    value={paymentInfo.chequeWaybill}
                                    onChange={(e) => setPaymentInfo({...paymentInfo, chequeWaybill: e.target.value})}
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
                                    value={paymentInfo.chequeNo}
                                    onChange={(e) => setPaymentInfo({...paymentInfo, chequeNo: e.target.value})}
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
                                    value={paymentInfo.chequeReceiptNo}
                                    onChange={(e) => setPaymentInfo({...paymentInfo, chequeReceiptNo: e.target.value})}
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
                                    value={paymentInfo.dueDate}
                                    onChange={(e) => setPaymentInfo({...paymentInfo, dueDate: e.target.value})}
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
                                    value={paymentInfo.bank}
                                    onChange={(e) => setPaymentInfo({...paymentInfo, bank: e.target.value})}
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
                                    value={paymentInfo.chequeAmount}
                                    
                                    onChange={(e) => {
                                      if(e.target.value == ''){
                                        setPaymentInfo({...paymentInfo, chequeAmount: ''})
                                      }
                                      else if(isValidNumber(e.target.value)){
                                        setPaymentInfo({...paymentInfo, chequeAmount: Number(e.target.value)})
                                      }
                              
                                    }}
                                  />

                                </div>
                              </div>
                            </div>
                          </div>

                        </div> : null}
                        {activeTab == 'Momo' ? <div id="momo-tab" style={{ marginTop: 20 }}>
                          <div className="row">
                            <div className="col-6">
                              <div className="form-group">
                                <label>Receipt No</label>
                                <div className="input-groupicon">
                                  <input
                                    type="text"
                                    placeholder=""
                                    value={paymentInfo.momoReceiptNo}
                                    onChange={(e) => setPaymentInfo({...paymentInfo, momoReceiptNo: e.target.value})}
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
                                    value={paymentInfo.momoName}
                                    onChange={(e) => setPaymentInfo({...paymentInfo, momoName: e.target.value})}
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
                                    value={paymentInfo.momoAmount}
                                    onChange={(e) => {
                                      if(e.target.value == ''){
                                        setPaymentInfo({...paymentInfo, momoAmount: ''})
                                      }
                                      else if(isValidNumber(e.target.value)){
                                        setPaymentInfo({...paymentInfo, momoAmount: Number(e.target.value)})
                                      }
                              
                                    }}
                                  
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
                                    value={paymentInfo.transactionID}
                                    onChange={(e) => setPaymentInfo({...paymentInfo, transactionID: e.target.value})}
                                  />

                                </div>
                              </div>
                            </div>
                          </div>

                        </div> : null}
                      </div>

                      <div className="row">
                        <div className="col-lg-6 ">
                          <div className="total-order w-100 max-widthauto m-auto mb-4">
                            <ul>
                              <li>
                                <h4>Amount Given</h4>
                                <h5>GHS {moneyInTxt(paymentInfo?.amountPaid)} </h5>
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
                                <h5>GHS {moneyInTxt(modalData?.Total)}</h5>
                              </li>
                              <li style={{border: Number(modalData?.Total) - Number(paymentInfo.amountPaid) > 0 ? '2px solid red' : Number(modalData?.Total) - Number(paymentInfo.amountPaid) < 0 ? '2px solid green' : null}}>
                                <h4>{Number(modalData?.Total) - Number(paymentInfo.amountPaid) < 0 ? 'Change' : 'Balance'}</h4>
                                <h5>GHS {moneyInTxt(Math.abs(Number(modalData?.Total) - Number(paymentInfo.amountPaid)))}</h5>
                              </li>

                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                
                  <div style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center',  fontWeight: 900 }}>
                    <div  style={{ display: 'flex', flexDirection:'column', width:'90%', gap:10}}>
                    <Button  data-bs-dismiss="modal" color="#3085d6">{' Hold '} </Button>
                    <Button  data-bs-dismiss="modal" color="#252525">Remove</Button>
                    </div> 
                    <span style={{fontSize: 20, marginTop:180, marginBottom:180}}>GHS {modalData?.Total}</span>
                    </div>
                </div>

                <div className="row mt-2">
                  <div className="col-lg-12" style={{ display: 'flex', justifyContent: 'flex-start' }} >
                    {!isCredit && (<button className="btn btn-info me-2" onClick={() => processPayment("Paid", true)} style={{ width: '20%' }}>
                      Sell and Print
                    </button>)}
                    {!isCredit && (<button className="btn btn-warning me-2" onClick={() => processPayment("Paid", false)} style={{ width: '20%' }}>
                      Sell Only
                    </button>)}
                    <button className="btn btn-danger me-2" style={{ width: '20%' }} onClick={() => processPayment("Credit", true)} >
                      Credit and Print
                    </button>
                    <button className="btn btn-cancel" style={{ width: '20%' }} onClick={() => processPayment("Credit", false)}>
                      Credit Only
                    </button>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
       
         {/* cash payment Modal */}
         <div
          className="modal fade"
          id="cashpayment"
          tabIndex={-1}
          aria-labelledby="cashpayment"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Sales Type: {modalData?.salestype}</h5>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setIsCredit(false)}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '4fr 1fr' }}>
                  <div className="card" style={{ border: '1px solid #252525' }}>
                    <div className="card-body">
                      <div className="payment-div" >
                        <ul className="nav nav-tabs">
                          <li className="nav-item" onClick={() => setActiveTab('Cash')}>
                            <a className={activeTab == 'Cash' ? `nav-link active` : `nav-link`} href="javascript:void(0);">Cash</a>
                          </li>

                        </ul>

                        <div id="cash-tab" style={{ marginTop: 20 }}>
                          <div className="row">
                           

                            <div className="col-12">
                              <div className="form-group">
                                <label>Amount </label>
                                <div className="input-groupicon">
                                  <input
                                    type="text"
                                    placeholder=""
                                    value={paymentInfo.cashAmount}
                                    onChange={(e) => {
                                      if(e.target.value == ''){
                                        setPaymentInfo({...paymentInfo, cashAmount: ''})
                                      }
                                      else if(isValidNumber(e.target.value)){
                                        setPaymentInfo({...paymentInfo, cashAmount: Number(e.target.value)})
                                      }
                                     
                                    }}
                                  />

                                </div>
                              </div>
                            </div>


                          </div>
                        </div> 
                       
                      </div>

                      <div className="row">
                        <div className="col-lg-6 ">
                          <div className="total-order w-100 max-widthauto m-auto mb-4">
                            <ul>
                              <li>
                                <h4>Amount Given</h4>
                                <h5>GHS {moneyInTxt(paymentInfo?.amountPaid)} </h5>
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
                                <h5>GHS {moneyInTxt(modalData?.Total)}</h5>
                              </li>
                              <li style={{border: Number(modalData?.Total) - Number(paymentInfo.amountPaid) > 0 ? '2px solid red' : Number(modalData?.Total) - Number(paymentInfo.amountPaid) < 0 ? '2px solid green' : null}}>
                                <h4>{Number(modalData?.Total) - Number(paymentInfo.amountPaid) < 0 ? 'Change' : 'Balance'}</h4>
                                <h5>GHS {moneyInTxt(Math.abs(Number(modalData?.Total) - Number(paymentInfo.amountPaid)))}</h5>
                              </li>

                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                
                  <div style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center',  fontWeight: 900 }}>
                    <div  style={{ display: 'flex', flexDirection:'column', width:'90%', gap:10}}>
                    <Button  data-bs-dismiss="modal" color="#3085d6">{' Hold '} </Button>
                    <Button  data-bs-dismiss="modal" color="#252525">Remove</Button>
                    </div> 
                    <span style={{fontSize: 20, marginTop:180, marginBottom:180}}>GHS {modalData?.Total}</span>
                    </div>
                </div>

                <div className="row mt-2">
                  <div className="col-lg-12" style={{ display: 'flex', justifyContent: 'flex-start' }} >
                    {!isCredit && (<button className="btn btn-info me-2" onClick={() => processPayment("Paid", true)} style={{ width: '20%' }}>
                      Sell and Print
                    </button>)}
                    {!isCredit && (<button className="btn btn-warning me-2" onClick={() => processPayment("Paid", false)} style={{ width: '20%' }}>
                      Sell Only
                    </button>)}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


          {/* Credit Modal */}
          <div
          className="modal fade"
          id="creditpayment"
          tabIndex={-1}
          aria-labelledby=""
          aria-hidden="true"
        >
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Sales Type: {modalData?.salestype}</h5>
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
                      <h3 style={{textAlign:'center'}}>Do you want to do a full credit? </h3>
              </div>
              <div className="modal-footer">
                  <div className="col-lg-12" style={{ display: 'flex', justifyContent: 'flex-end' }} >
                    <button className="btn btn-success me-2" onClick={() => processPayment("Credit", true)} style={{ width: '20%' }}>
                      Yes
                    </button>
                    <button className="btn btn-danger me-2" data-bs-dismiss="modal">
                     No
                    </button>

                  </div>
                </div>
            </div>
          </div>
        </div>
    

        {/* View Products Modal */}
        <div
          className="modal fade"
          id="showproducts"
          tabIndex={-1}
          aria-labelledby=""
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Sales Ref - {productGridData[0]?.salesRef || 'N/A'}</h5>
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
                  <div className="table-responsive mb-3">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Product Name</th>
                          <th>Quantity</th>
                          <th>Unit Price</th>
                          <th>Amount</th>
                         
                        </tr>
                      </thead>
                      <tbody>
                      { productGridData.length > 0  ? productGridData?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <Link to="#">{item?.name}</Link>
                              </td>
                              <td>{item?.quantity}</td>
                              <td>{item?.unitPrice}</td>
                              <td>{item?.amount}</td>

                             
                            </tr>
                          )
                        }): 'No Data'} 

                      </tbody>
                    </table>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default Cashier;
