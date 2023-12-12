import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Table from "../../EntryFile/datatable";
import Tabletop from "../../EntryFile/tabletop";
import {

  search_whites,
} from "../../EntryFile/imagePath";
import Select from "react-select";
import "react-select2-wrapper/css/select2.css";
import { useGet } from "../../hooks/useGet";
import { moneyInTxt } from "../../utility";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import { debounce } from "lodash";
import useCustomApi from "../../hooks/useCustomApi";
import { BASE_URL } from "../../api/CustomAxios";
import PurchaseReport from "./tables/PurchaseReport";


const Sales = () => {
  const [inputfilter, setInputfilter] = useState(false);
  const [data, setData] = useState([]);


  const [productsDropdown, setProductsDropdown] = useState([]);
  const [customersDropdown, setCustomersDropdown] = useState([]);
  const [usersDropdown, setUsersDropdown] = useState([]);

  const { data: products, isLoading: productsIsLoading } = useGet("products", "/product");
  const { data: customers, isLoading: customersIsLoading } = useGet("customers", "/customer/combo");
  useGet("users", "/user/branchUsers", (data) => {
    setUsersDropdown(data?.data.map(x => ({
      id: x?.id,
      label: `${x?.firstName} ${x?.lastName}`,
      value: x?.id
    })))

  });


  const {
    data: sales,
    isError,
    isLoading: isSuspendLoading,
    isSuccess,
  } = useGet("suspend", "/sales");

  const [selectedProduct, setSelectedProduct] = useState({})
  const [selectedProductInfo, setSelectedProductInfo] = useState(null)
  const [customer, setCustomer] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isBatchLoading, setIsBatchLoading] = useState(false)
  const [supplier, setSupplier] = useState('')
  const [formData, setFormData] = useState({ productId: '', quantity: '', amount: '', batchNumber: {}, startDate: '', endDate: '' })
  const [reportFile, setReportFile] = useState(null)
  const [reportIsLoading, setreportIsLoading] = useState(false)
  const [report, setReport] = useState([])
  const [selectedUser, setSelectedUser] = useState({})

  const [userType, setUserType] = useState('')



  useEffect(() => {
    let userRole = localStorage.getItem('auth')
    let obj = JSON.parse(userRole)
    console.log("Role:", obj.role)
    setUserType(obj.role)
  }, [])


  useEffect(() => {
    if (!productsIsLoading) {

      let mappedData = products?.data.map((product) => {
        return {
          id: product?.id,
          name: product?.name,
          status: product?.status,
          alert: product?.alert,
          retailPrice: product?.retailPrice,
          wholeSalePrice: product?.wholeSalePrice,
          specialPrice: product?.specialPrice,
          remainingStock: product?.stock_count || 0,
          ownershipType: product?.ownershipType,
          createdBy: product?.createdBy,
          value: product?.id,
          label: product?.name,
          retailPrice: product?.retailPrice,
          manuDate: product?.manufacturingDate,
          expDate: product?.expiryDate
        }
      })

      setProductsDropdown(mappedData)
      //console.log('loaded..')
    }
    else {
      // console.log('loading...')
    }
  }, [productsIsLoading])



  useEffect(() => {
    if (!customersIsLoading) {
      let mappedData = customers?.data.map((customer) => {
        return {
          value: customer?.id,
          label: customer?.name,
          customerType: customer?.customerType,
        }
      })
      setCustomersDropdown(mappedData)

    }
  }, [customersIsLoading])

  useEffect(() => {
    if (!isSuspendLoading) {

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
  }, [isSuspendLoading])

  const axios = useCustomApi()




  const handleProductSelect = (e) => {
    setSelectedProduct(e)
    setRetailPrice('(' + e.retailPrice + 'GHS)')
    setWholesalePrice('(' + e.wholeSalePrice + 'GHS)')
    setSpecialPrice('(' + e.specialPrice + 'GHS)')
    salesType == 'Retail' ? setPrice(e.retailPrice) : salesType == "Wholesale" ? setPrice(e.wholeSalePrice) : setPrice(e.specialPrice)
    salesType == 'Retail' ? setEditPrice(e.retailPrice) : salesType == "Wholesale" ? setEditPrice(e.wholeSalePrice) : setEditPrice(e.specialPrice)
    setIsBatchLoading(true)
  }


  useEffect(() => {
    // console.log("Selected Prod", selectedProduct)

    axios.get(`${BASE_URL}/purchase/product/${selectedProduct?.value}`).then((res) => {
      setIsLoading(true)
      setFormData({ ...formData, batchNumber: null })
      if (res.data.success) {
        // setIsLoading(false)
        //console.log(res.data.newProduct)
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

  const handleReset = () => {
    setFormData({ productId: '', quantity: '', amount: '', batchNumber: {}, startDate: '', endDate: '' })
    setCustomer(null)
    setSelectedProduct(null)
    setSelectedUser(null)
  }

  const handleGenerateReport = () => {

    const baseUrl = "report/getSalesReport";
    let filters = {
      productId: selectedProduct?.id || "",
      startDate: formData?.startDate || "",
      endDate: formData?.endDate || "",
      batchNumber: formData?.batchNumber?.label || "",
      clientId: customer?.value || "",
      userId: selectedUser?.value || "",
    };

    console.log({ filters });

    const encodeFilterValue = (value) => encodeURIComponent(value);

    const urlParams = Object.entries(filters)
      .filter(([key, value]) => value !== undefined && value !== null && value !== "")
      .map(([key, value]) => `${key}=${encodeFilterValue(value)}`)
      .join("&");

    const dynamicUrl = `${baseUrl}?${urlParams}`;

    setreportIsLoading(true)

    // axios.get(`report/getSalesReport?startDate=${formData.startDate}&endDate=${formData.endDate}&productId=${selectedProduct?.id || ''}&batchNumber=${formData?.batchNumber?.value || ''}&clientId=${customer?.value || ''}`)
    axios.get(dynamicUrl).then((res) => {

      setReport(res.data?.data)
      $('#filters').modal('hide')


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



  if (isSuspendLoading) {
    return (<LoadingSpinner message="Fetching Sales.." />)
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Sales List</h4>
              <h6>Generate your sales Reports</h6>
            </div>
            <div className="page-btn">
              <Link
                to="#"
                data-bs-toggle="modal" data-bs-target="#filters"
                className="btn btn-success"
              >

                Generate Sales Report
              </Link>
            </div>
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-body">

              <div
                className={`card mb-0 ${inputfilter ? "toggleCls" : ""}`}
                id="filter_inputs"
                style={{ display: inputfilter ? "block" : "none" }}
              >
                <div className="card-body pb-0">
                  <div className="row">
                    <div className="col-lg-12 col-sm-12">
                      <div className="row">

                        <div className="col-lg col-sm-6 col-12 ">
                          <div className="form-group">
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Enter max price range"

                            />
                          </div>
                        </div>
                        <div className="col-lg-1 col-sm-6 col-12">
                          <div className="form-group">
                            <a className="btn btn-filters ms-auto">
                              <img src={search_whites} alt="img" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Filter */}
              <div className="table-responsive">
                <PurchaseReport data={report} fileName="salesReport" title="SALES REPORT" isSupplier={false} />
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
              <h5 className="modal-title">Sales Search </h5>
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
              <div className="row">
                <div className="form-group">
                  <label>Customer</label>
                  <Select
                    id="customer"
                    className="select"
                    options={customersDropdown}
                    value={customer}
                    isLoading={customersIsLoading}
                    onChange={(e) => {
                      setCustomer(e)
                    }}
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group">
                  <label>Product</label>
                  <Select
                    id="productName"
                    className="select"
                    options={productsDropdown}
                    value={selectedProduct}
                    isLoading={productsIsLoading}
                    onChange={(e) => handleProductSelect(e)}
                  />
                </div>
              </div>
              <div className="row">
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
                        return { value: item.batchNumber, label: item?.availablequantity == 0 ? item?.batchNumber : item?.batchNumber, expireDate: item?.expireDate, manufacturingDate: item?.manufacturingDate }
                      })}
                      placeholder=""
                      value={formData.batchNumber}
                      onChange={(e) => setFormData({ ...formData, batchNumber: (e), manuDate: e.manufacturingDate, expDate: e.expireDate })}
                    //onChange={(e) => console.log(e)}
                    />

                  </div>
                </div>
              </div>
              <div className="row">
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
              <h5 className="modal-title">Sales Report</h5>
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
export default Sales;
