import React, { useEffect, useState } from "react";
import Table from "../../EntryFile/datatable";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import Tabletop from "../../EntryFile/tabletop";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import {
  ClosesIcon,
  Excel,
  Filter,
  Pdf,
  Eye1,
  Calendar,
  Printer,
  search_whites,
  Search,
  PlusIcon,
  EditIcon,
  Dollar1,
  plusCircle,
  Download,
  delete1,
  DeleteIcon,
  datepicker,
} from "../../EntryFile/imagePath";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import { useGet } from "../../hooks/useGet";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import { moneyInTxt } from "../../utility";

const Suspended = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [startDate1, setStartDate1] = useState(new Date());
  const [inputfilter, setInputfilter] = useState(false);
  const [activeTab, setActiveTab] = useState('cash')

  const togglefilter = (value) => {
    setInputfilter(value);
  };

  const confirmText = () => {
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
    }).then(function (t) {
      t.value &&
        Swal.fire({
          type: "success",
          title: "Deleted!",
          text: "Your file has been deleted.",
          confirmButtonClass: "btn btn-success",
        });
    });
  };
  const options = [
    { id: 1, text: "Completed", text: "Completed" },
    { id: 2, text: "Paid", text: "Paid" },
  ];
  const options1 = [
    { id: 1, text: "Cash", text: "Cash" },
    { id: 2, text: "Online", text: "Online" },
    { id: 2, text: "Inprogess", text: "Inprogess" },
  ];
 const [data, setData] = useState([{
  name: 'Ernest',
  date: new Date().toISOString(),
  reference: 'REF001',
  status: 'Suspended',
  total: 30000,
  payment: "Paid",
  paid: 1000,
  due: 2000,
  biller: 'admin'

 }])


  const {
    data: sales,
    isError,
    isLoading,
    isSuccess,
  } = useGet("sales", "/sales");


  // useEffect(() => {
  //   if(!isLoading){
  //     let mappedData =  sales?.data.map((sale) => {
  //         return {
  //           id: sale?.id,
  //           Date: sale?.transDate,
  //           Name: sale?.name || 'Franslina Pharmacy',
  //           Status: sale?.status,
  //           Reference: sale?.salesRef,
  //           Payment: sale?.status,
  //           Total: moneyInTxt(sale?.totalAmount),
  //           Paid: 0,
  //           Due: 0,
  //           Biller: sale?.salesPerson,
  //         }
  //       })
  //     setData(mappedData)
  //     console.log('loaded..')
  //   }
  //   else{
  //     console.log('loading...')
  //   }
  // }, [isLoading])

  const handleCredit = () => {

  }

  const columns = [
    {
      title: "Costumer name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Date",
      dataIndex: "date",
      sorter: (a, b) => a.date.length - b.date.length,
    },
    {
      title: "Reference",
      dataIndex: "reference",
      sorter: (a, b) => a.reference.length - b.reference.length,
    },

    {
      title: "Total (GHS)",
      dataIndex: "total",
      sorter: (a, b) => a.total.length - b.total.length,
    },
    {
      title: "Paid (GHS)",
      dataIndex: "paid",
      render: (text, record) => (
        <>
          {/* {text === 100 && <div className="text-green">{moneyInTxt(text)}</div>} */}
          {<div>{moneyInTxt(text)}</div>}
        </>
      ),
      sorter: (a, b) => a.paid.length - b.paid.length,
    },
    {
      title: "Balance Due (GHS)",
      dataIndex: "due",
      render: (text, record) => (
        <>
          {/* {text === 100 && <div className="text-red">{moneyInTxt(text)}</div>} */}
          {<div>{moneyInTxt(text)}</div>}
        </>
      ),
      sorter: (a, b) => a.due.length - b.due.length,
    },
    {
      title: "Cashier",
      dataIndex: "biller",
      sorter: (a, b) => a.biller.length - b.biller.length,
    },
    {
      title: "Action",
      render: (text, record) => (
        <>
          <div className="text-center">
            <Link
              className="action-set"
              to="#"
              data-bs-toggle="dropdown"
              aria-expanded="true"
            >
              <i className="fa fa-ellipsis-v" aria-hidden="true" />
            </Link>
            <ul className="dropdown-menu">
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
              <li>
                <Link
                  to="#"
                  className="dropdown-item"
                  data-bs-toggle="modal"
                  data-bs-target="#showpayment"
                >
                  <img src={Dollar1} className="me-2" alt="img" />
                  Make Payments
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="dropdown-item"
                  data-bs-toggle="modal"
                  data-bs-target="#createpayment"
                >
                  <img src={plusCircle} className="me-2" alt="img" />
                  Create Payment
                </Link>
              </li>
              <li>
                <Link to="#" className="dropdown-item">
                  <img src={Download} className="me-2" alt="img" />
                  Download pdf
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="dropdown-item confirm-text"
                  onClick={confirmText}
                >
                  <img src={delete1} className="me-2" alt="img" />
                  Delete Sale
                </Link>
              </li>
            </ul>
          </div>
        </>
      ),
    },
  ];


  if(isLoading){
    return (<LoadingSpinner message="Fetching Sales.."/>)
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Suspended List</h4>
              <h6>Cashiers Window </h6>
            </div>
            <div className="page-btn">
              <Link to="/tinatett-pos/sales/add-sales" className="btn btn-added">
                <img src={PlusIcon} alt="img" className="me-1" />
                Go to Sales
              </Link>
            </div>
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-body">
              <Tabletop inputfilter={inputfilter} togglefilter={togglefilter} />
              {/* /Filter */}
              <div
                className={`card mb-0 ${ inputfilter ? "toggleCls" : ""}`}
                id="filter_inputs"
                style={{ display: inputfilter ? "block" :"none"}}
              >
                <div className="card-body pb-0">
                  <div className="row">
                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="form-group">
                        <input type="text" placeholder="Enter Name" />
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="form-group">
                        <input type="text" placeholder="Enter Reference No" />
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="form-group">
                        <Select2
                          className="select"
                          data={options}
                          options={{
                            placeholder: "Choose Suppliers",
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="form-group">
                        <Link className="btn btn-filters ms-auto">
                          <img src={search_whites} alt="img" />
                        </Link>
                      </div>
                    </div>
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
                <h5 className="modal-title">Sales Type: Wholesale</h5>
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
                <div style={{display:'grid', gridTemplateColumns:'4fr 1fr'}}>
                  <div className="card" style={{border: '1px solid #252525'}}>
                    <div className="card-body">
                        <div className="payment-div" >
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
                          </div>
                        </div> : null}
                        {activeTab == 'cheque' ? <div id="cheque-tab" style={{marginTop:20}}>
                          <div className="row">
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
                                <label>Momo number</label>
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
                          
                        </div> :null}
                        </div>

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
                                  <h5>GHS 0.00</h5>
                                </li>
                                <li>
                                  <h4>Balance</h4>
                                  <h5>GHS 0.00</h5>
                                </li>
                              
                              </ul>
                            </div>
                          </div>
                        </div>
                    </div>
                  </div>

                  <div style={{display:'flex', justifyContent:'center', alignItems:'center', fontSize:20, fontWeight:900}}>GHS 50,000</div>
                </div>
                
                <div className="row mt-2">
                <div className="col-lg-12" style={{display:'flex', justifyContent:'space-between'}} >
                  <button className="btn btn-info me-2" onClick={handleCredit} style={{width:'20%'}}>
                    Sell and Print
                  </button>
                  <button className="btn btn-warning me-2" onClick={handleCredit} style={{width:'20%'}}>
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
        {/* show payment Modal */}
        {/* show payment Modal */}
        <div
          className="modal fade"
          id="createpayment"
          tabIndex={-1}
          aria-labelledby="createpayment"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create Payment</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="form-group">
                      <label>Customer</label>
                      <div className="input-groupicon">
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                        />
                        <div className="addonset">
                          <img src={Calendar} alt="img" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="form-group">
                      <label>Reference</label>
                      <input type="text" defaultValue="INV/SL0101" />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="form-group">
                      <label>Received Amount</label>
                      <input type="text" defaultValue={0.0} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="form-group">
                      <label>Paying Amount</label>
                      <input type="text" defaultValue={0.0} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="form-group">
                      <label>Payment type</label>
                      <Select2
                        className="select"
                        data={options1}
                        options={{
                          placeholder: "Choose Suppliers",
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group mb-0">
                      <label>Note</label>
                      <textarea className="form-control" defaultValue={""} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-submit">
                  Submit
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
        {/* show payment Modal */}
        {/* edit payment Modal */}
        <div
          className="modal fade"
          id="editpayment"
          tabIndex={-1}
          aria-labelledby="editpayment"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Payment</h5>
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
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="form-group">
                      <label>Customer</label>
                      <div className="input-groupicon">
                        <DatePicker
                          selected={startDate1}
                          onChange={(date) => setStartDate1(date)}
                        />
                        <div className="addonset">
                          <img src={datepicker} alt="img" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="form-group">
                      <label>Reference</label>
                      <input type="text" defaultValue="INV/SL0101" />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="form-group">
                      <label>Received Amount</label>
                      <input type="text" defaultValue={0.0} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="form-group">
                      <label>Paying Amount</label>
                      <input type="text" defaultValue={0.0} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="form-group">
                      <label>Payment type</label>
                      <Select2
                        className="select"
                        data={options1}
                        options={{
                          placeholder: "Choose Suppliers",
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group mb-0">
                      <label>Note</label>
                      <textarea className="form-control" defaultValue={""} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-submit">
                  Submit
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
    </>
  );
};

export default Suspended;
