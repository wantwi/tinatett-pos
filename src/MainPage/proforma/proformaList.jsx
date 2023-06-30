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
import useCustomApi from "../../hooks/useCustomApi";
import { useGet } from "../../hooks/useGet";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";

const ProformaList = () => {

  const [inputfilter, setInputfilter] = useState(false);

  const [data, setData] = useState([])
  const [productGridData, setProductGridData] = useState([])
  const [loading, setLoading] = useState(true)
  const axios = useCustomApi()

  const {
    data: proformas,
    isError,
    isLoading,
    isSuccess,
  } = useGet("proformas", "/proforma");

  useEffect(() => {
    if (!isLoading) {
      // console.log(proformas)
      let mappedData = proformas?.data.map((proforma) => {
        return {
          id: proforma?.id,
          customerName: proforma.customer?.name,
          customer: proforma?.customer,
          status: proforma?.status,
          date: new Date(proforma.createdAt).toISOString().substring(0, 10),
          proformaRef: proforma?.proformaRef,
          numberOfProduct: proforma?.numberOfProduct,
          createdBy: proforma?.createdBy || 'N/A',
        }
      })
      setData(mappedData)
      console.log('loaded..')
    }
    else {
      console.log('loading...')
    }
  }, [isLoading])


  if (isLoading) {
    return (<LoadingSpinner message="Loading list.." />)
  }


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

  const handleSell = (id) => {
    axios.get(`/proforma/products/${id}`)
    .then((res) => {
      let x = (res.data?.data)
      let mapped = x.map((item) => 
        {
          return {
            productName:  item?.product?.name,
            quantity: item?.quantity,
            unitPrice: item?.unitPrice,
            amount: item?.amount
          }
      })
      console.log("Mapped:", mapped)
      setProductGridData(mapped)
    }).finally(() => setLoading(false))
  }


  // useEffect(() => {
  //   console.log("Grid", productGridData)
  // }, [productGridData])



  const columns = [
    {
      title: "Costumer Name",
      dataIndex: "customerName",
      // sorter: (a, b) => a.customerName.length - b.customerName.length,
      render: (text, record) =>
        <>
          <Link to={{ pathname: "/tinatett-pos/proforma/proforma-details", state: record }} title={'View Details'}>{text}</Link>
        </>
    },
    {
      title: "Reference",
      dataIndex: "proformaRef",
      sorter: (a, b) => a.proformaRef.length - b.proformaRef.length,
      render: (text, record) =>
        <>
          <Link to={{ pathname: "/tinatett-pos/proforma/proforma-details", state: record }} title={'View Details'}>{text}</Link>
        </>
    },
    {
      title: "Date",
      dataIndex: "date",
      sorter: (a, b) => a.createdAt.length - b.createdAt.length,
    },
    {
      title: "# of Products",
      dataIndex: "numberOfProduct",
      sorter: (a, b) => a.numberOfProduct.length - b.numberOfProduct.length,
    },

    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   render: (text, record) => (
    //     <>
    //       {text == "1" && (
    //         <span className="badges bg-lightred">{"Pending"}</span>
    //       )}
    //       {text == "2" && (
    //         <span className="badges bg-lightgreen">{"Fulfilled"}</span>
    //       )}
    //     </>
    //   ),
    //   sorter: (a, b) => a.status.length - b.status.length,
    // },
    // {


    // {
    //   title: "Paid",
    //   dataIndex: "Paid",
    //   render: (text, record) => (
    //     <>
    //       {text === 100 && <div className="text-green">{text}</div>}
    //       {text === 0 && <div>{text}</div>}
    //     </>
    //   ),
    //   sorter: (a, b) => a.Paid.length - b.Paid.length,
    // },
    // {
    //   title: "Due",
    //   dataIndex: "Due",
    //   render: (text, record) => (
    //     <>
    //       {text === 100 && <div className="text-red">{text}</div>}
    //       {text === 0 && <div>{text}</div>}
    //     </>
    //   ),
    //   sorter: (a, b) => a.Due.length - b.Due.length,
    // },
    {
      title: "Biller",
      dataIndex: "createdBy",
      sorter: (a, b) => a.createdBy.length - b.createdBy.length,
    },
    {
      title: "Action",
      render: (text, record) => (
        <div style={{ width: '10%' }}>


          {/* <Link  to={{pathname:"/tinatett-pos/proforma/proforma-details", state:record}} > */}
          {/* <img src={Eye1} className="me-2" alt="img" /> */}
          {/* <span className="badges btn-cancel me-2">View</span> */}
          {/* </Link> */}

          <Link to={{ pathname: "/tinatett-pos/proforma/edit-proforma", state: record }} >
            {/* <img src={Eye1} className="me-2" alt="img" /> */}
            <span className="badges btn-cancel me-2">Edit</span>
          </Link>

          {/* <Link  to={{pathname:"/tinatett-pos/sales/add-sales", state:record}}  > */}
          {/* <img src={Eye1} className="me-2" alt="img" /> */}
          <span className="badges bg-lightgreen me-2" style={{ cursor: 'pointer' }} data-bs-target="#editpayment" data-bs-toggle="modal" onClick={() => handleSell(record?.id)}>Sell</span>
          {/* </Link> */}

          {/* <Link  to={{pathname:"/tinatett-pos/transfer/addtransfer-transfer", state:record}} > */}
          {/* <img src={Eye1} className="me-2" alt="img" /> */}
          <span className="badges btn-primary me-2" style={{ cursor: 'pointer' }} data-bs-target="#createpayment" data-bs-toggle="modal">Transfer</span>
          {/* </Link> */}



          <Link
            to="#"
            // className="dropdown-item confirm-text"
            onClick={confirmText}
            title={'Delete'}
          >
            {/* <img src={delete1} className="me-2" alt="img" /> */}
            {/* <img src={DeleteIcon} alt="img" /> */}
            <span className="badges bg-lightred me-2">Delete</span>

          </Link>


        </div>
      ),
      width: '20%'
    },
  ];
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Proforma List</h4>
              <h6>Manage your Proformas</h6>
            </div>
            <div className="page-btn">
              <Link to="/tinatett-pos/proforma/add-proforma" className="btn btn-added">
                <img src={PlusIcon} alt="img" className="me-1" />
                Add Proforma
              </Link>
            </div>
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-body">
              <Tabletop inputfilter={inputfilter} togglefilter={togglefilter} data={data} title={'Proforma List'} />
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
                <h5 className="modal-title">Transfer</h5>
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
                      {!loading ?  (<tbody>
                         {productGridData?.map((item, index) => {
                          return (
                            <tr key={item?.id}>
                              <td>{index + 1}</td>
                              <td>
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

                      </tbody>) : null}
                    </table>
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
                <h5 className="modal-title">Sell Proforma</h5>
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
                          <th>Action</th>
                          <th />
                        </tr>
                      </thead>
                      {!loading ?  (<tbody>
                         {productGridData?.map((item, index) => {
                          return (
                            <tr key={item?.id}>
                              <td>{index + 1}</td>
                              <td>
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

                      </tbody>) : null}
                    </table>
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
        </div>
      </>
    </>
  );
};

export default ProformaList;
