import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Table from "../../EntryFile/datatable";
import Tabletop from "../../EntryFile/tabletop";
import {
  PlusIcon,
  MacbookIcon,
  IphoneIcon,
  SamsungIcon,
  EarpodIcon,
  OrangeImage,
  PineappleImage,
  StawberryImage,
  AvocatImage,
  EyeIcon,
  EditIcon,
  DeleteIcon,
  search_whites,
} from "../../EntryFile/imagePath";
import Select from "react-select";
import "react-select2-wrapper/css/select2.css";
import { useGet } from "../../hooks/useGet";
import { moneyInTxt } from "../../utility";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import { debounce } from "lodash";
import useCustomApi from "../../hooks/useCustomApi";

const ProductReport = () => {
  const [inputfilter, setInputfilter] = useState(false);
  const [data, setData] = useState([]);

  
  const [productsDropdown, setProductsDropdown] = useState([]);
  const [suppliersDropdown, setSuppliersDropdown] = useState([]);

  const { data: products, isLoading: productsIsLoading } = useGet("products", "/product");
  const { data: suppliers, isLoading: suppliersIsLoading } = useGet("suppliers", "/supplier");

  const [selectedProduct, setSelectedProduct] = useState('')
  const [selectedProductInfo, setSelectedProductInfo] = useState()
  const [supplier, setSupplier] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isBatchLoading, setIsBatchLoading] = useState(false)
  const [formData, setFormData] = useState({productId:'', quantity: '', amount: '', batchNumber: '', manuDate: '', expDate: '' })
  const [reportFile, setReportFile] = useState(null)
  const [reportIsLoading, setreportIsLoading] = useState(false)




  useEffect(() => {
    if(!productsIsLoading){
      
      let mappedData =  products?.data.map((product) => {
          return {
            id: product?.id,
            image: AvocatImage,
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
      setData([...mappedData])
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
        image: AvocatImage,
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

  const handleGenerateReport = () => {
    let filters = {
      formData,
      selectedProduct,
      supplier,

    }

    setreportIsLoading(true)
    $('#pdfViewer').modal('show')
      axios.get(`report/getProductReport?productId=${formData?.productId}`)
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
            {record.name}
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

          <div className="modal-dialog modal-md modal-dialog-centered" role="document">
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
               
              </div>
              <div className="modal-footer">
                  <Link to="#" className="btn btn-submit me-2"  style={{width:'100%'}} onClick={handleGenerateReport}>
                    Search
                  </Link>
                  {/* <Link to="#" className="btn btn-cancel" data-bs-dismiss="modal">
                    Cancel
                </Link> */}
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
