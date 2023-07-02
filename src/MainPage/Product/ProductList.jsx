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
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import { useGet } from "../../hooks/useGet";
import { moneyInTxt } from "../../utility";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";

const ProductList = () => {
  const [inputfilter, setInputfilter] = useState(false);
  const [data, setData] = useState([]);

  const {
    data: products,
    isError,
    isLoading,
    isSuccess,
  } = useGet("products", "/product");


  useEffect(() => {
    if(!isLoading){
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
  }, [isLoading])


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
   
    {
      title: "Action",
      render: (text, record) => (
        <>
          <>
            {/* <Link className="me-3" to="/tinatett-pos/product/product-details">
              <img src={EyeIcon} alt="img" />
            </Link> */}
            <Link className="me-3" to={{ pathname:`/tinatett-pos/product/editproduct`, state:record}} title="Edit Product">
              <img src={EditIcon} alt="img" />
            </Link>
            <Link className="confirm-text" to="#" onClick={confirmText} title="Delete Product">
              <img src={DeleteIcon} alt="img" />
            </Link>
          </>
        </>
      ),
    },
  ];

  if(isLoading){
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
                to="/tinatett-pos/product/addproduct"
                className="btn btn-added"
              >
                <img src={PlusIcon} alt="img" className="me-1" />
                Add New Product
              </Link>
            </div>
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-body">
              <Tabletop inputfilter={inputfilter} togglefilter={togglefilter} title={'Products List'} data={data}/>
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
    </>
  );
};
export default ProductList;
