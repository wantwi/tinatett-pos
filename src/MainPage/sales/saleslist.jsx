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
import useCustomApi from "../../hooks/useCustomApi";

const SalesList = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [startDate1, setStartDate1] = useState(new Date());
  const [inputfilter, setInputfilter] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [userType, setUserType] = useState('')

  const togglefilter = (value) => {
    setInputfilter(value);
  };


  useEffect(() => {
    let userRole = localStorage.getItem('auth')
    let obj =JSON.parse(userRole)
    console.log("Role:", obj.role)
    setUserType(obj.role)
  }, [])

  const axios = useCustomApi()

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
    }).then(async (t) => {

      if (t.isConfirmed) {
        let data = await axios.delete(`/sales/${id}`)
        if (data.status < 205) {
          Swal.fire({
            type: "success",
            title: "Deleted!",
            text: "Your sales item has been deleted.",
            confirmButtonClass: "btn btn-success",
          });
        

        }
        else {
          Swal.fire({
            type: "danger",
            title: "Error!",
            text: data.response.data.message,
            confirmButtonClass: "btn btn-danger",
          });
        }
      }

      t.dismiss === Swal.DismissReason.cancel &&
        Swal.fire({
          title: "Cancelled",
          text: "You cancelled the delete action",
          type: "error",
          confirmButtonClass: "btn btn-success",
        });


    })
      .catch((error) => {
        Swal.fire({
          type: "danger",
          title: "Error!",
          text: error,
          confirmButtonClass: "btn btn-danger",
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
  const [data, setData] = useState([])


  const {
    data: sales,
    isError,
    isLoading,
    isSuccess,
  } = useGet("suspend", "/sales");


  useEffect(() => {
    if (!isLoading) {

      let mappedData = sales?.data.map((sale) => {
        // console.log("Payment Infor:", (JSON.parse(sale?.paymentInfo)).type)
        return {
          id: sale?.id,
          Date: sale?.transDate,
          Name: sale?.customerName,
          Status: sale?.status,
          Reference: sale?.salesRef,
          // Payment: JSON.parse(sale?.paymentInfo).type,
          Total: moneyInTxt(sale?.totalAmount) || '',
          Paid: moneyInTxt(sale?.amountPaid),
          Balance: moneyInTxt(sale?.balance),
          Biller: sale?.salesPerson,
        }
      })
      let sortedData = mappedData.sort((a, b) => new Date(b.Date) - new Date(a.Date))
      setData(sortedData)
      console.log('loaded..')
    }
    else {
      console.log('loading...')
    }
  }, [isLoading])


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
      title: "Status",
      dataIndex: "Status",
      render: (text, record) => (
        <>
          {text === "Paid" && (
            <span className="badges btn-success">{"Paid"}</span>
          )}
          {text === "Suspended" && (
            <span className="badges bg-lightgreen">{"Suspended"}</span>
          )}
          {text === "Credit" && (
            <span className="badges bg-lightred">{"Credit"}</span>
          )}
        </>
      ),
      sorter: (a, b) => a.Status.length - b.Status.length,
    },
    // {
    //   title: "Payment",
    //   dataIndex: "Payment",
    //   render: (text, record) => (
    //     <>

    //         <span className="badges bg-lightgreen">{(text)}</span>

    //     </>
    //   ),
    //   sorter: (a, b) => a.Payment.length - b.Payment.length,
    // },
    {
      title: "Total Amount (GHS)",
      dataIndex: "Total",
      sorter: (a, b) => a.Total.length - b.Total.length,
    },
    {
      title: "Paid Amount (GHS)",
      dataIndex: "Paid",

    },
    {
      title: "Balance (GHS)",
      dataIndex: "Balance",

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
              </li> */}
          {/* <li>
                <Link to="/tinatett-pos/sales/edit-sales" className="dropdown-item">
                  <img src={EditIcon} className="me-2" alt="img" />
                  Edit Sale
                </Link>
              </li> */}
          {/* <li>
                <Link
                  to="#"
                  className="dropdown-item"
                  data-bs-toggle="modal"
                  data-bs-target="#showpayment"
                >
                  <img src={Dollar1} className="me-2" alt="img" />
                  Show Payments
                </Link>
              </li> */}
          {/* <li>
                <Link
                  to="#"
                  className="dropdown-item"
                  data-bs-toggle="modal"
                  data-bs-target="#createpayment"
                >
                  <img src={plusCircle} className="me-2" alt="img" />
                  Create Payment
                </Link>
              </li> */}

          <a href="javascript:void(0);"
            title="Download Invoice"
            onClick={() => {
              setIsSaving(true)
              getInvoiceReceipt(record?.Reference)
            }}>
            <img src={Download} className="me-2" alt="img" />

          </a>


          {userType == 'admin' &&  <Link
                  to="#"
                  className="confirm-text"
                  onClick={() => confirmText(record?.id)}
                  title=" Delete Sale"
                >
                  <img src={DeleteIcon} alt="img" />
                 
                </Link>}


        </>
      ),
    },
  ];


  const getInvoiceReceipt = (salesref) => {
    axios.get('/sales/getSaleReceipt/' + salesref)
      .then((res) => {
        // console.log(res.data)
        if (res.data) {
          setIsSaving(false)
        }

        let base64 = res.data.base64
        const blob = base64ToBlob(base64, 'application/pdf');
        const blobFile = `data:application/pdf;base64,${base64}`
        const url = URL.createObjectURL(blob);
        setReceiptFile(blobFile)
        //window.open(url, "_blank", "width=600, height=600", 'modal=yes');
        // var newWindow = window.open(url, "_blank", "width=800, height=800");  
        //pdfWindow.document.write("<iframe width='100%' height='100%' src='" + url + "'></iframe>");

        $('#pdfViewer').modal('show')
      })

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


  if (isLoading) {
    return (<LoadingSpinner message="Fetching Sales.." />)
  }

  if (isSaving) {
    return <LoadingSpinner message="Downloading...please wait" />
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Sales List</h4>
              <h6>Manage your Sales</h6>
            </div>
            <div className="page-btn">
              <Link to="/tinatett-pos/sales/add-sales" className="btn btn-added">
                <img src={PlusIcon} alt="img" className="me-1" />
                Add Sales
              </Link>
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
                <h5 className="modal-title">Show Payments</h5>
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
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Reference</th>
                        <th>Amount </th>
                        <th>Paid By </th>
                        <th>Paid By </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bor-b1">
                        <td>2022-03-07 </td>
                        <td>INV/SL0101</td>
                        <td>$ 0.00 </td>
                        <td>Cash</td>
                        <td>
                          <Link className="me-2" to="#">
                            <img src={Printer} alt="img" />
                          </Link>
                          <Link
                            className="me-2"
                            to="#"
                            data-bs-target="#editpayment"
                            data-bs-toggle="modal"
                            data-bs-dismiss="modal"
                          >
                            <img src={EditIcon} alt="img" />
                          </Link>
                          <Link className="me-2 confirm-text" to="#">
                            <img src={DeleteIcon} alt="img" />
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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

        {/* PDF Modal */}
        <div
          className="modal fade"
          id="pdfViewer"
          tabIndex={-1}
          aria-labelledby="pdfViewer"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Sales Receipt</h5>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => $('.modal').modal('hide')}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <iframe width='100%' height='800px' src={receiptFile}></iframe>
              </div>

            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default SalesList;
