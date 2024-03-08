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
import ExpensesTable from "./tables/ExpensesTable";
const options = [
  // { id: 1, label: "Cho", value: "" },
  { id: 2, label: "Fuel", value: "Fuel" },
  { id: 3, label: "Electric Power", value: "Electric Power" },
  { id: 4, label: "Poly Bag", value: "Poly Bag" },
  { id: 5, label: "Drinking Water", value: "Drinking Water " },
  { id: 6, label: "Stationery", value: "Stationery" },
  { id: 7, label: "Printing and Photocopies", value: "Printing and Photocopies" },
  { id: 8, label: "Detergent and Toiletries", value: "Detergent and Toiletries" },
  { id: 9, label: "Sanitation", value: "Sanitation" },
  { id: 10, label: "Plastic Tables and Chairs", value: "Plastic Tables and Chairs" },
  { id: 11, label: "Repairs and Maintenance", value: "Repairs and Maintenance" },
  { id: 12, label: "Deliveries", value: "Deliveries" },
  { id: 13, label: "Refund", value: "Refund" },
  { id: 14, label: "Printer cartriage", value: "Printer cartriage" },
  { id: 15, label: "Fire extinguisher", value: "Fire extinguisher" },
  { id: 16, label: "Business Operations Permit", value: "Business Operations Permit" },
  { id: 17, label: "Head Potters", value: "Head Potters" },
  { id: 18, label: "Loading fee", value: "Loading fee" },
  { id: 19, label: "Battery", value: "Battery" },
  { id: 20, label: "Water bill", value: "Water bill" },
  { id: 21, label: "Payment to Supplier", value: "Payment to Supplier" },
  { id: 22, label: "Advertisement and Radio Show", value: "Advertisement and Radio Show" },
  { id: 23, label: "Accomodation (rent for staff)", value: "Accomodation (rent for staff)" },
  { id: 24, label: "FDA", value: "FDA" },
  { id: 25, label: "MOH", value: "MOH" },
  { id: 26, label: "Assembly Levy", value: "Assembly Levy" },
  { id: 27, label: "Allowance", value: "Allowance" },
  { id: 28, label: "Special Bonus", value: "Special Bonus" },
  { id: 29, label: "Transportation", value: "Transportation" },
  { id: 30, label: "Refuse Collection", value: "Refuse Collection" },
  { id: 31, label: "Salary", value: "Salary" },
  { id: 32, label: "Other", value: "Other" },
];

let sortedOptions = options.sort(function (a, b) {
  if (a.label < b.label) {
    return -1;
  }
  if (a.label > b.label) {
    return 1;
  }
  return 0;
});

const Expenses = () => {
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
  const [suppliersDropdown, setSuppliersDropdown] = useState([]);
  const [usersDropdown, setUsersDropdown] = useState([]);

  const { data: products, isLoading: productsIsLoading } = useGet("products", "/product");
  const { data: suppliers, isLoading: suppliersIsLoading } = useGet("suppliers", "/supplier");
  useGet("users", "/user/branchUsers", (data) => {
    setUsersDropdown(data?.data.map(x => ({
      id: x?.id,
      label: `${x?.firstName} ${x?.lastName}`,
      value: x?.id
    })))

  });

  const [loggedInUser, setLoggedInUser] = useState({})

  const [selectedProduct, setSelectedProduct] = useState({ label: "All", value: "" })
  const [selectedExpenseType, setSelectedExpenseType] = useState({ label: "All", value: "" })
  const [selectedProductInfo, setSelectedProductInfo] = useState({})
  const [supplier, setSupplier] = useState('')
  //const [isLoading, setIsLoading] = useState(false)
  const [isBatchLoading, setIsBatchLoading] = useState(false)
  const [formData, setFormData] = useState({ quantity: '', amount: '', batchNumber: { label: "All", value: "" }, startDate: '', endDate: '' })
  const [reportFile, setReportFile] = useState(null)
  const [reportIsLoading, setreportIsLoading] = useState(false)
  const [report, setReport] = useState([])
  const [selectedUser, setSelectedUser] = useState({})
  const [showOnlyActive, setShowOnlyActive] = useState(true)

  useEffect(() => {
    if (!productsIsLoading && !suppliersIsLoading) {
      let mappedProducts = products?.data.map((item) => {
        return {
          id: item?.id,
          label: item?.name,
          value: item?.id,
          retailPrice: item?.retailPrice,
          wholeSalePrice: item?.wholeSalePrice,
          specialPrice: item?.wholeSalePrice,
          ownershipType: item?.ownershipType
        }

      })
      setProductsDropdown(mappedProducts)

      let mappedSuppliers = suppliers?.data.map((item) => {
        return {
          id: item?.id,
          label: item?.name,
          value: item?.id,
        }

      })
      setSuppliersDropdown(mappedSuppliers)
    }

  }, [suppliers, products])

  useEffect(() => {
    // console.log("Selected Prod", selectedProduct)

    axios.get(`${BASE_URL}/purchase/product/${selectedProduct?.value}`).then((res) => {
      setFormData({ ...formData, batchNumber: null })
      if (res.data.success) {
        // setIsLoading(false)
        console.log(res.data.newProduct)
        setSelectedProductInfo(res.data.newProduct)
        // let x = res.data.newProduct.batchNumber?.map((item) => {
        //   return { value: item.batchNumber, label: item?.availablequantity == 0 ? item?.batchNumber + '-(' + item?.Quantity + ')' : item?.batchNumber + '-(' + item?.availablequantity + ')', expireDate: item?.expireDate, manufacturingDate: item?.manufacturingDate }
        // })
        // setIsBatchLoading(false)
        // setFormData({ ...formData, batchNumber: x[0], manuDate: (x[0]?.manufacturingDate).substring(0, 10), expDate: (x[0]?.expireDate).substring(0, 10) })

      }
    })
    $('#selectedProduct').css('border', '1px solid rgba(145, 158, 171, 0.32)')

  }, [selectedProduct])

  useEffect(() => {
    let userDetails = localStorage.getItem('auth')
    let user = JSON.parse(userDetails)
    setLoggedInUser(user)
  }, [])

  const handleProductSelect = (e) => {
    console.log(e)
    setSelectedProduct(e)
  }

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

  const handleReset = () => {
    setFormData({ quantity: '', amount: '', batchNumber: '', startDate: '', endDate: '' })
    setSupplier(null)
    setSelectedProduct(null)
    setSelectedUser(null)
  }

  const handleGenerateReport = () => {
    // if (!formData?.startDate || !formData?.endDate) {

    //   alertify.warning("Please select a date range");
    //   return

    // }
    // if (!selectedProduct?.id || !formData?.batchNumber?.label) {

    //   alertify.warning("Please product and batch number");
    //   return

    // }
    const baseUrl = "report/getExpensesReport";
    let filters = {
      category: selectedProduct?.value || "",
      startDate: formData?.startDate || "",
      endDate: formData?.endDate || "",
      expenseFor: selectedExpenseType?.value || "",
      // clientId: supplier?.id || "",
      // userId: selectedUser?.value || "",
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
      setReport(res.data?.data)


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
              <h4>Expenses Report</h4>
              <h6>Generate your Expenses Report</h6>
            </div>
            <div className="page-btn">
              <Link
                to="#"
                data-bs-toggle="modal" data-bs-target="#filters"
                className="btn btn-success"
              >

                Generate Expenses Report
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
                <ExpensesTable startDate={formData?.startDate} endDate={formData?.endDate} title="EXPENSES REPORT" fileName="expensesreport" data={report} />
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
              <h5 className="modal-title">Expenses Search</h5>
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
                  <label>Supplier</label>
                  <Select
                    id="supplier"
                    className="select"
                    options={suppliersDropdown}
                    value={supplier}
                    isLoading={suppliersIsLoading}
                    onChange={(e) => {
                      setSupplier(e)
                    }}
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group">
                  <label>Expense Category</label>
                  <Select
                    id="productName"
                    className="select"
                    options={[{ label: 'All', value: '' }, { label: 'Shop Related', value: 'Shop Related' }, { label: 'Company', value: 'Company' }, { label: 'Production', value: 'Production' }, { label: 'Director', value: 'Director' }]}
                    placeholder="Select category"
                    value={selectedProduct}
                    isLoading={productsIsLoading}
                    onChange={(e) => handleProductSelect(e)}

                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label>Expenses Type</label>
                    {isBatchLoading && <div className="spinner-border text-primary me-1" role="status" style={{ height: 20, width: 20 }}>
                      <span className="sr-only">Loading...</span>
                    </div>}
                  </div>
                  <div className="input-groupicon">
                    <Select
                      options={[{ label: "All", value: "" }, ...sortedOptions]}
                      placeholder="Select expenses type"
                      value={selectedExpenseType}
                      //onChange={(e) => setFormData({ ...formData, batchNumber: (e) })}
                      onChange={(e) => setSelectedExpenseType(e)}
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
              <div className="row" hidden>
                <div className="form-group">
                  <label>User</label>
                  <Select
                    id="users"
                    className="select"
                    options={usersDropdown}
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e)}
                  />
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
export default Expenses;