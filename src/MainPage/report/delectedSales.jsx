import React, { useEffect, useState } from "react";
import Table from "../../EntryFile/datatable";
import Tabletop from "../../EntryFile/tabletop";
import Select2 from "react-select2-wrapper";
import Select from "react-select";
import "react-select2-wrapper/css/select2.css";
import { Link } from "react-router-dom";
import {
  ClosesIcon,
  Excel,
  Filter,
  Pdf,
  PlusIcon,
  Printer,
  Search,
  search_whites,
  EditIcon,
  DeleteIcon,
} from "../../EntryFile/imagePath";
import { useGet } from "../../hooks/useGet";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import Swal from "sweetalert2";
import { BASE_URL } from "../../api/CustomAxios";
import useCustomApi from "../../hooks/useCustomApi";
import { moneyInTxt } from "../../utility";
import PurchaseSummaryTable from "./tables/PurchaseSummary"
import StockReport from "./tables/StockTable";
import alertify from "alertifyjs";
import ProductMovementTable from "./tables/ProductMovementTable";
import DeletedSalesTable from "./tables/DeletedSalesTable";

function getWeek(dateString) {
  const date = new Date(dateString);
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // Calculate the start date by subtracting the day of the week from the current date
  const startDate = new Date(date);
  startDate.setDate(date.getDate() - dayOfWeek);

  // Calculate the end date by adding the remaining days to the start date
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  // Format the dates as 'YYYY-MM-DD'
  const formattedStartDate = startDate.toISOString().split('T')[0];
  const formattedEndDate = endDate.toISOString().split('T')[0];

  return formattedEndDate
}

const getTitle = (type) => {
  switch (type) {
    case "SL":

      return "DELETED SALES REPORT"

    case "PR":
      return "DELETED PURCHASE REPORT"
    case "TO":
      return "DELETED TRANSFER REPORT"
    default:
      return "DELETED SALES REPORT"
  }
}

const getFileName = (type) => {
  console.log({ getFileName: type })
  switch (type) {
    case "SL":
      return "deletedsalesreport"
    case "PR":
      return "deletedpurchasereport"
    case "TO":
      return "deletedtransferreport"
    default:
      return "deletedsalesreport"
  }
}


const DelectedSales = () => {
  const [inputfilter, setInputfilter] = useState(false);
  const [data, setData] = useState([]);
  const axios = useCustomApi();



  const {
    data: sales,
    isError,
    isLoading,
    isSuccess,
  } = useGet("suspend", "/sales");

  const [productsDropdown, setProductsDropdown] = useState([]);
  const [suppliersDropdown, setTypesDropdown] = useState([]);
  const [usersDropdown, setUsersDropdown] = useState([]);

  useGet("users", "/user/branchUsers", (data) => {
    setUsersDropdown(data?.data.map(x => ({
      id: x?.id,
      label: `${x?.firstName} ${x?.lastName}`,
      value: x?.id
    })))

  });

  const [loggedInUser, setLoggedInUser] = useState({})

  const [selectedProduct, setSelectedProduct] = useState({})
  const [selectedProductInfo, setSelectedProductInfo] = useState({})
  const [type, setType] = useState('')
  //const [isLoading, setIsLoading] = useState(false)
  const [isBatchLoading, setIsBatchLoading] = useState(false)
  const [formData, setFormData] = useState({ quantity: '', amount: '', batchNumber: {}, startDate: '', endDate: '' })
  const [reportFile, setReportFile] = useState(null)
  const [reportIsLoading, setreportIsLoading] = useState(false)
  const [report, setReport] = useState([])
  const [selectedUser, setSelectedUser] = useState({})
  const [showOnlyActive, setShowOnlyActive] = useState(true)





  useEffect(() => {
    let userDetails = localStorage.getItem('auth')
    let user = JSON.parse(userDetails)
    setLoggedInUser(user)
  }, [])

  const handleProductSelect = (e) => {
    console.log(e)
    setSelectedProduct(e)
  }

  // useEffect(() => {
  //   if (!isLoading) {

  //     let mappedData = sales?.data.map((sale) => {
  //       // console.log("Payment Infor:", (JSON.parse(sale?.paymentInfo)).type)
  //       return {
  //         id: sale?.id,
  //         Date: sale?.transDate,
  //         Name: sale?.customerName,
  //         Status: sale?.status,
  //         Reference: sale?.salesRef,
  //         // Payment: JSON.parse(sale?.paymentInfo).type,
  //         Total: moneyInTxt(sale?.totalAmount) || '',
  //         Paid: moneyInTxt(sale?.amountPaid),
  //         Balance: moneyInTxt(sale?.balance),
  //         Biller: sale?.salesPerson,
  //       }
  //     })
  //     let sortedData = mappedData.sort((a, b) => new Date(b.Date) - new Date(a.Date))
  //     setData(sortedData)
  //     console.log('loaded..')
  //   }
  //   else {
  //     console.log('loading...')
  //   }
  // }, [isLoading])

  const handleReset = () => {
    setFormData({ quantity: '', amount: '', batchNumber: '', startDate: '', endDate: '' })
    setType(null)
    setSelectedProduct(null)
    setSelectedUser(null)
  }

  // useEffect(() => {
  //   if (formData?.startDate) {
  //     setFormData(prev => ({ ...prev, endDate: getWeek(formData?.startDate) }))
  //   }

  //   return () => {

  //   }
  // }, [formData?.startDate])


  const handleGenerateReport = () => {
    if (!type) {

      alertify.warning("Please select the report type");
      return

    }
    if (!formData?.startDate || !formData?.endDate) {

      alertify.warning("Please select a date range");
      return

    }

    const baseUrl = "report/getDeletedReport";
    let filters = {
      type: type?.value || "",
      startDate: formData?.startDate || "",
      endDate: formData?.endDate || "",
    };

    const encodeFilterValue = (value) => encodeURIComponent(value);

    const urlParams = Object.entries(filters)
      .filter(([key, value]) => value !== undefined && value !== null && value !== "")
      .map(([key, value]) => `${key}=${encodeFilterValue(value)}`)
      .join("&");

    const dynamicUrl = `${baseUrl}?${urlParams}`;

    setreportIsLoading(true)
    // $('#pdfViewer').modal('show')
    // axios.get(`report/getSalesSummaryReport?startDate=${formData.startDate}&endDate=${formData.endDate}&productId=${selectedProduct?.id || ''}&batchNumber=${formData?.batchNumber?.value || ''}&clientId=${supplier?.value || ''}`)
    axios.get(dynamicUrl).then((res) => {

      console.log({ deletedSales: res.data?.data })

      // const deletedList = res.data?.data?.map(item => ({ ...item, items: JSON.parse(JSON.parse(item?.data))?.salesItems })).flatMap(x => x?.items);
      // console.log({ deletedList })
      setReport(res.data?.data || [])


      $('#filters').modal('hide')

      // let base64 = res.data.base64String
      // const blob = base64ToBlob(base64, 'application/pdf');
      // const blobFile = `data:application/pdf;base64,${base64}`
      // const url = URL.createObjectURL(blob);
      // setReportFile(blobFile)



    })
      .finally(() => setreportIsLoading(false))

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


  const togglefilter = (value) => {
    setInputfilter(false);
  };



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
  ];
  if (isLoading) {
    return (<LoadingSpinner />)
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Deleted Report</h4>
              <h6>Generate your Deleted Report</h6>
            </div>
            <div className="page-btn">
              <Link
                to="#"
                data-bs-toggle="modal" data-bs-target="#filters"
                className="btn btn-success"
              >

                Generate Deletded Report
              </Link>
            </div>
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-body">
              <Tabletop inputfilter={inputfilter} togglefilter={togglefilter} data={data} title={'Deleted Sales List'} />
              {/* /Filter */}
              <div
                className={`card mb-0 ${inputfilter ? "toggleCls" : ""}`}
                id="filter_inputs"
                style={{ display: inputfilter ? "block" : "none" }}
              >
                <div className="card-body pb-0">
                  <div className="row">
                    <div className="col-lg-12 col-sm-12">

                    </div>
                  </div>
                </div>
              </div>
              {/* /Filter */}
              <div className="table-responsive">
                <DeletedSalesTable startDate={formData?.startDate} endDate={formData?.endDate} title={getTitle(type?.value)} fileName={getFileName(type?.value)} data={report} />
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>
      </div>


      {/* Filters Modal */}

      <div
        className="modal fade"
        id="filters"
        tabIndex={-1}
        aria-labelledby="filters"
        aria-hidden="true">

        <div className="modal-dialog modal-md modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Deleted Report Search</h5>
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
                <div className="form-group">
                  <label>Type</label>
                  <Select
                    id="type"
                    className="select"
                    options={[{ label: "Sales", value: "SL" }, { label: "Purchase", value: "PR" }, { label: "Transfer", value: "TO" }]}
                    value={type}
                    // isLoading={suppliersIsLoading}
                    onChange={(e) => {
                      setType(e)
                    }}
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group">
                  <label>From</label>
                  <div className="input-groupicon">
                    <input
                      type="date" className={`form-control `}
                      id="startDate"
                      placeholder=""
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="form-group">
                  <label>To</label>
                  <div className="input-groupicon">
                    <input

                      type="date" className={`form-control `}
                      id="endDate"
                      placeholder=""
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Link to="#" className="btn btn-cancel me-2" style={{ width: '47%' }} onClick={handleReset}>
                Reset
              </Link>
              <Link to="#" className="btn btn-submit " style={{ width: '47%' }} onClick={handleGenerateReport}>
                {reportIsLoading ? 'Loading Please wait...' : 'Search'}
              </Link>
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
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Deleted Sales Report</h5>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {!reportIsLoading ? (<iframe width='100%' height='800px' src={reportFile}></iframe>) : (<div className="spinner-border text-primary me-1" role="status" style={{ height: 50, width: 50, }}>
                <span className="sr-only">Loading...</span>
              </div>)}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};
export default DelectedSales;
