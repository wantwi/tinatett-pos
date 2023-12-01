import React, { useEffect, useRef, useState } from "react";
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

const ProductReport = () => {
  const [inputfilter, setInputfilter] = useState(false);
  const [data, setData] = useState([]);

  
  const [productsDropdown, setProductsDropdown] = useState([]);
  const [suppliersDropdown, setSuppliersDropdown] = useState([]);

  const { data: products, isLoading: productsIsLoading } = useGet("products", "/product");
  const { data: suppliers, isLoading: suppliersIsLoading } = useGet("suppliers", "/supplier");

  const [selectedProduct, setSelectedProduct] = useState({})
  const [selectedProductInfo, setSelectedProductInfo] = useState()
  const [supplier, setSupplier] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isBatchLoading, setIsBatchLoading] = useState(false)
  const [formData, setFormData] = useState({productId:'', quantity: '', amount: '', batchNumber: {}, manufactureFromDate: '', manufactureEndDate:'', expireFromDate: '', expireEndDate:'' })
  const [reportFile, setReportFile] = useState(null)
  const [reportIsLoading, setreportIsLoading] = useState(false)

  const [priceType, setPriceType] = useState('All')

  const retailpriceTypeRef = useRef()
  const specialpriceTypeRef = useRef()
  const wholesalepriceTypeRef = useRef()


  useEffect(() => {
    if(!productsIsLoading){
      
      let mappedData =  products?.data.map((product) => {
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
      setData([...mappedData])
      setProductsDropdown(mappedData)
      //console.log('loaded..')
    }
    else{
     // console.log('loading...')
    }
  }, [productsIsLoading])

  const axios = useCustomApi()
  const handleSearch = debounce((value) => {
    axios.get(`/product?ownershipType=&name=${value}`)
    .then((res) => {
     let mapped = res?.data.data.map((product) => {
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
        createdBy: product?.createdBy
      }
    })
    setData(mapped)
  })
    

}, 300)


  const togglefilter = (value) => {
    setInputfilter(false);
  };

  const handleReset = () => {
    setFormData({productId:'', quantity: '', amount: '', batchNumber: {}, manufactureFromDate: '', manufactureEndDate:'', expireFromDate: '', expireEndDate:'' })
    setSelectedProduct(null)
  }

  const handleGenerateReport = () => {
    let filters = {
      formData,
      selectedProduct,
      supplier,
      priceType

    }

    console.log(filters)

    setreportIsLoading(true)
    $('#pdfViewer').modal('show')
      axios.get(`report/getProductReport?productId=${selectedProduct?.id || ''}&batchNumber=${formData?.batchNumber?.value || ''}&manufacturingStartDate=${formData.manufactureFromDate}&manufacturingEndDate=${formData?.manufactureEndDate}&expireStartDate=${formData?.expireFromDate}&expireEndDate=${formData?.expireEndDate}&unitPrice=${priceType}`)
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

  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      render: (text, record) => (
        <div className="productimgname">
          {/* <Link className="product-img">
            <img alt="" src={record.image} />
          </Link> */}
          <Link style={{ fontSize: "15px", marginLeft: "10px" }}>
            {record?.name}
          </Link>
        </div>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Retail Price",
      dataIndex: "retailPrice",
      sorter: (a, b) => a.retailPrice - b.retailPrice,
      render: (text, record) => <p>{moneyInTxt(record?.retailPrice)}</p> 
    },
    {
      title: "Wholesale Price",
      dataIndex: "wholeSalePrice",
      sorter: (a, b) => a.wholeSalePrice - b.wholeSalePrice,
      render: (text, record) => <p>{moneyInTxt(record?.wholeSalePrice)}</p> 
    },
    {
      title: "Special Price",
      dataIndex: "specialPrice",
      sorter: (a, b) => a.specialPrice - b.specialPrice,
      render: (text, record) => <p>{moneyInTxt(record?.specialPrice)}</p> 
    },
    {
      title: "Quantity",
      dataIndex: "remainingStock",
      sorter: (a, b) => a.remainingStock - b.remainingStock,
      render: (text, record) => <p>{(record?.remainingStock)}</p> 
    },
   
   
  ];

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
      if (res.data.success) {
        setIsLoading(false)
        //console.log(res.data.newProduct)
        setSelectedProductInfo(res.data.newProduct)
        let x = res.data.newProduct.batchNumber?.map((item) => {
          return { value: item.batchNumber, label: item?.availablequantity == 0 ? item?.batchNumber + '-(' + item?.Quantity + ')' : item?.batchNumber + '-(' + item?.availablequantity + ')', expireDate: item?.expireDate, manufacturingDate: item?.manufacturingDate }
        })
        setIsBatchLoading(false)
        // setFormData({ ...formData, batchNumber: x[0], manuDate: (x[0]?.manufacturingDate).substring(0, 10), expDate: (x[0]?.expireDate).substring(0, 10) })
  
      }
    })
    $('#selectedProduct').css('border', '1px solid rgba(145, 158, 171, 0.32)')

  }, [selectedProduct])

  if(productsIsLoading){
    return (<LoadingSpinner message="Fetching Products.."/>)
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Product List</h4>
              <h6>Manage your products</h6>
            </div>
            <div className="page-btn">
            <Link
                to="#" 
                data-bs-toggle="modal" data-bs-target="#filters"
                className="btn btn-success"
              >
                
                Generate Product Report
              </Link>
            </div>
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-body">
              <Tabletop inputfilter={inputfilter} togglefilter={togglefilter} title={'Products List'} data={data} handleSearch={handleSearch}/>
              {/* /Filter */}
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

          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                    <h5 className="modal-title">Product Search </h5>
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
                    <div className="col-6">
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

                    <div className="col-6">
                      <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <label>Batch No.</label>
                          {isBatchLoading && <div className="spinner-border text-primary me-1" role="status" style={{ height: 20, width: 20 }}>
                            <span className="sr-only">Loading...</span>
                          </div>}
                        </div>
                        <div className="input-groupicon">
                          <Select
                            isLoading={isLoading}
                            options={selectedProductInfo?.batchNumber?.map((item) => {
                              return { value: item.batchNumber, label: item?.availablequantity == 0 ? item?.batchNumber + '-(' + item?.Quantity + ')' : item?.batchNumber + '-(' + item?.availablequantity + ')', expireDate: item?.expireDate, manufacturingDate: item?.manufacturingDate }
                            })}
                            placeholder=""
                            value={formData.batchNumber}
                            onChange={(e) => setFormData({ ...formData, batchNumber: (e), manuDate: e.manufacturingDate, expDate: e.expireDate })}
                          //onChange={(e) => console.log(e)}
                          />

                        </div>
                      </div>
                    </div>
                      
                  </div>


                 

                  <div className="row">
                    <div className="form-group">
                      <label>Unit Price</label>
                      <div className="row">
                        <div className="col-lg-3">

                          <div className="input-group">
                            <div className="input-group-text">
                              <input className="form-check-input" type="radio" ref={specialpriceTypeRef} name="priceType" value={'All'} 
                              onClick={(e) => {
                                setPriceType(e.target.value)
                               }} />
                            </div>
                            <input type="text" className="form-control" aria-label="Text input with radio button" placeholder={`All `}  />
                          </div>

                        </div>

                        <div className="col-lg-3">

                          <div className="input-group">
                            <div className="input-group-text">
                              <input className="form-check-input" type="radio" ref={retailpriceTypeRef} name="priceType" value={'Retail'}
                                onClick={(e) => {
                                  setPriceType(e.target.value)
                                  }} />
                            </div>
                            <input type="text" className="form-control" aria-label="Text input with radio button" placeholder={`Retail`}  />
                          </div>

                        </div>

                        <div className="col-lg-3">
                          <div className="input-group">
                            <div className="input-group-text">
                              <input className="form-check-input" type="radio" ref={wholesalepriceTypeRef} name="priceType" vvalue={'Wholesale'}
                                onClick={(e) => {
                                  setPriceType(e.target.value)
                                }
                                } />
                            </div>
                            <input type="text" className="form-control" aria-label="Text input with radio button" placeholder={`Wholesale `} />
                          </div>
                        </div>

                        <div className="col-lg-3">

                          <div className="input-group">
                            <div className="input-group-text">
                              <input className="form-check-input" type="radio" ref={specialpriceTypeRef} name="priceType" value={'Special'} onClick={(e) => {
                                setPriceType(e.target.value)
                               }} />
                            </div>
                            <input type="text" className="form-control" aria-label="Text input with radio button" placeholder={`Special `}  />
                          </div>

                        </div>

                        
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-6">
                        <div className="form-group">
                          <label>Manufacture From</label>
                          <div className="input-groupicon">
                            <input
                              type="date" className={`form-control `}
                              id="amount"
                              placeholder=""
                              value={formData.manufactureFromDate}
                              onChange={(e) => setFormData({...formData, manufactureFromDate: e.target.value})}
                            />
                        </div>
                      </div>
                    </div>
                     
                     <div className="col-6">
                      <div className="form-group">
                        <label>Manufacture To</label>
                        <div className="input-groupicon">
                          <input
                            type="date" className={`form-control `}
                            id="amount"
                            placeholder=""
                            value={formData.manufactureEndDate}
                            onChange={(e) => setFormData({...formData, manufactureEndDate: e.target.value})}
                          />
                      </div>
                      </div>
                     </div>
                      
                  </div>

                   <div className="row">
                    <div className="col-6">
                        <div className="form-group">
                          <label>Expire From</label>
                          <div className="input-groupicon">
                            <input
                              type="date" className={`form-control `}
                              id="amount"
                              placeholder=""
                              value={formData.expireFromDate}
                              onChange={(e) => setFormData({...formData, expireFromDate: e.target.value})}
                            />
                        </div>
                      </div>
                    </div>
                     
                     <div className="col-6">
                      <div className="form-group">
                        <label>Expire To</label>
                        <div className="input-groupicon">
                          <input
                            type="date" className={`form-control `}
                            id="amount"
                            placeholder=""
                            value={formData.expireEndDate}
                            onChange={(e) => setFormData({...formData, expireEndDate: e.target.value})}
                          />
                      </div>
                      </div>
                     </div>
                      
                  </div>
                  {/* <div className="row">
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
                  </div> */}
                 
               
              </div>
              <div className="modal-footer">
                  <Link to="#" className="btn btn-cancel me-2"  style={{width:'47%'}} onClick={handleReset}>
                    Reset
                  </Link>
                  <Link to="#" className="btn btn-submit "  style={{width:'50%'}} onClick={handleGenerateReport}>
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
                <h5 className="modal-title">Product Report</h5>
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
export default ProductReport;
