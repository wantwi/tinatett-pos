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
import WeeklySaleSummaryTable from "./tables/WeeklySaleSummaryTable";
import FinancialActivityTable from "./tables/FinancialActivityTable";

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



const FinancialActivityReport = () => {
  const [inputfilter, setInputfilter] = useState(false);
  const [data, setData] = useState([]);
  const axios = useCustomApi();

  const [loggedInUser, setLoggedInUser] = useState({})

  const [selectedProductInfo, setSelectedProductInfo] = useState({})
  const [show, setShow] = useState(false)
  const [isBatchLoading, setIsBatchLoading] = useState(false)
  const [formData, setFormData] = useState({ quantity: '', amount: '', batchNumber: {}, startDate: '', endDate: '' })
  const [reportFile, setReportFile] = useState(null)
  const [reportIsLoading, setreportIsLoading] = useState(false)
  const [report, setReport] = useState({
    salesTrans: [],
    expenses: [],
    creditSale: [],
    creditPayment: [],
    cashInHand: []
  })
  const [showOnlyActive, setShowOnlyActive] = useState(true)


  useEffect(() => {
    let userDetails = localStorage.getItem('auth')
    let user = JSON.parse(userDetails)
    setLoggedInUser(user)
  }, [])

  const handleReset = () => { setFormData({ quantity: '', amount: '', batchNumber: '', startDate: '', endDate: '' }) }

  const handleGenerateReport = () => {
    if (!formData?.startDate || !formData?.endDate) {
      alertify.warning("Please select a date range");
      return
    }

    const baseUrl = "report/getFinancialActivityReport";
    let filters = {
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

    axios.get(dynamicUrl).then((res) => {
      console.log({ dynamicUrl: res });
      setReport(res.data?.data)
      $('#filters').modal('hide')
      setShow(false)
    })
      .finally(() => setreportIsLoading(false))
  }

  const togglefilter = (value) => {
    setInputfilter(false);
  };


  // if (isLoading) {
  //   return (<LoadingSpinner />)
  // }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Financial Activity Report</h4>
              <h6>Generate your Financial Activity Report</h6>
            </div>
            <div className="page-btn">
              <Link
                to="#"
                data-bs-toggle="modal" data-bs-target="#filters"
                className="btn btn-success"
              >

                Generate Financial Activity Report
              </Link>
            </div>
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-body">
              <Tabletop inputfilter={inputfilter} togglefilter={togglefilter} data={data} title={'Sales List'} />
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
                <FinancialActivityTable startDate={formData?.startDate} endDate={formData?.endDate} title="Financial Activity Report" fileName="financialActivityreport" data={report} />
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
              <h5 className="modal-title">Financial Search</h5>
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
                  <label>From</label>
                  <div className="input-groupicon">
                    <input
                      type="date" className={`form-control `}
                      id="amount"
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
                      id="amount"
                      placeholder=""
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>


              <div className="row" hidden>
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label>Batch No.</label>
                    {isBatchLoading && <div className="spinner-border text-primary me-1" role="status" style={{ height: 20, width: 20 }}>
                      <span className="sr-only">Loading...</span>
                    </div>}
                  </div>
                  <div className="input-groupicon">
                    <Select

                      options={selectedProductInfo?.batchNumber?.map((item) => {
                        return { value: item.batchNumber, label: item?.batchNumber, expireDate: item?.expireDate, manufacturingDate: item?.manufacturingDate }
                      })}
                      placeholder="Select batch number"
                      value={formData.batchNumber}
                      onChange={(e) => setFormData({ ...formData, batchNumber: (e) })}
                    //onChange={(e) => console.log(e)}
                    />

                  </div>
                </div>
              </div>
              <div hidden>
                <div className="col">

                  <div className="input-group" style={{ marginLeft: -13 }}>
                    <div className="input-group-text">
                      <input className="form-check-input" type="checkbox" checked={showOnlyActive} name="priceType" value={'Hide Dormat Product'}
                        onClick={(e) => {
                          setShowOnlyActive(!showOnlyActive)
                        }} />
                    </div>
                    <input type="text" className="form-control" aria-label="Text input with radio button" placeholder={`Hide Dormat Product `} />
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
              <h5 className="modal-title">Sales Summary Report</h5>
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
export default FinancialActivityReport;
