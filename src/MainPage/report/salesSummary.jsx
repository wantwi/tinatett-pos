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

const SalesSummary = () => {
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

  const { data: products, isLoading: productsIsLoading } = useGet("products", "/product");
  const { data: suppliers, isLoading: suppliersIsLoading } = useGet("suppliers", "/supplier");

  const [loggedInUser, setLoggedInUser] = useState({})

  const [selectedProduct, setSelectedProduct] = useState({})
  const [selectedProductInfo, setSelectedProductInfo] = useState({})
  const [supplier, setSupplier] = useState('')
  //const [isLoading, setIsLoading] = useState(false)
  const [isBatchLoading, setIsBatchLoading] = useState(false)
  const [formData, setFormData] = useState({ quantity: '', amount: '', batchNumber: {},  startDate:'', endDate:'' })
  const [reportFile, setReportFile] = useState(null)
  const [reportIsLoading, setreportIsLoading] = useState(false)

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
    setFormData({ quantity: '', amount: '', batchNumber: '',  startDate:'', endDate:'' })
    setSupplier(null)
    setSelectedProduct(null)
  }

  const handleGenerateReport = () => {
    let filters = {
      formData,
      selectedProduct,
      supplier,

    }

    setreportIsLoading(true)
    $('#pdfViewer').modal('show')
      axios.get(`report/getSalesSummaryReport?startDate=${formData.startDate}&endDate=${formData.endDate}&productId=${selectedProduct?.id || ''}&batchNumber=${formData?.batchNumber?.value || ''}&clientId=${supplier?.value || ''}`)
      .then((res) => {

        let base64 = res.data.base64String
        const blob = base64ToBlob(base64, 'application/pdf');
        const blobFile = `data:application/pdf;base64,${base64}`
        const url = URL.createObjectURL(blob);
        setReportFile(blobFile)
    

       
      })
      .finally(() =>  setreportIsLoading(false))

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



  if(isLoading){
    return (<LoadingSpinner/>)
  }



  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Sales Summary Report</h4>
              <h6>Generate your Sales Summary</h6>
            </div>
            <div className="page-btn">
              <Link
                to="#" 
                data-bs-toggle="modal" data-bs-target="#filters"
                className="btn btn-success"
              >
                
                Generate Sales Summary
              </Link>
            </div>
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-body">
              <Tabletop inputfilter={inputfilter} togglefilter={togglefilter} data={data} title={'Sales List'}/>
              {/* /Filter */}
              <div
                className={`card mb-0 ${ inputfilter ? "toggleCls" : ""}`}
                id="filter_inputs"
                style={{ display: inputfilter ? "block" :"none"}}
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
                <Table columns={columns} dataSource={data} />
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
                    <h5 className="modal-title">Sales Search (Summary)</h5>
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
                            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
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
                            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                          />
                      </div>
                    </div>
                  </div>
                  <div className="row">
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
                              return { value: item.batchNumber, label: item?.availablequantity == 0 ? item?.batchNumber + '-(' + item?.Quantity + ')' : item?.batchNumber + '-(' + item?.availablequantity + ')', expireDate: item?.expireDate, manufacturingDate: item?.manufacturingDate }
                            })}
                            placeholder=""
                            value={formData.batchNumber}
                            onChange={(e) => setFormData({ ...formData, batchNumber: (e)})}
                          //onChange={(e) => console.log(e)}
                          />

                        </div>
                      </div>
                  </div>
                  
              </div>
              <div className="modal-footer">
                  <Link to="#" className="btn btn-cancel me-2"  style={{width:'47%'}} onClick={handleReset}>
                    Reset
                  </Link>
                  <Link to="#" className="btn btn-submit "  style={{width:'47%'}} onClick={handleGenerateReport}>
                    Search
                  </Link>
              </div>
            </div>
          </div>

        </div>


          {/* PDF Modal */ }
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
              <div className="modal-body" style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                {!reportIsLoading ? (<iframe width='100%' height='800px' src={reportFile}></iframe>) : (<div className="spinner-border text-primary me-1" role="status" style={{ height: 50, width: 50,  }}>
                          <span className="sr-only">Loading...</span>
                        </div>)}
              </div>

            </div>
          </div>
        </div>
    </>
  );
};
export default SalesSummary;
