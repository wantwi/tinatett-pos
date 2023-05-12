import React, { useEffect, useState } from "react";
import Table from "../../EntryFile/datatable";
import Tabletop from "../../EntryFile/tabletop";
import Select2 from "react-select2-wrapper";
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

const PurchaseList = () => {
  const [inputfilter, setInputfilter] = useState(false);
  const [data, setData] = useState([]);

  const {
    data: purchases,
    isError,
    isLoading,
    isSuccess,
  } = useGet("purchases", "/purchase");


  useEffect(() => {
    if(!isLoading){
      let mappedData =  purchases?.data.map((purchase) => {
          return {
            id: purchase?.id,
            supplierName: purchase?.supplier.name,
            status: purchase?.status,
            reference: purchase.purchaseRef,
            numberOfProduct: purchase.numberOfProduct,
            branch: purchase.branch.name,
            date: new Date(purchase.purchaseDate).toISOString().substring(0,10),
            createdBy: "Admin",

            
          }
        })
      setData(mappedData)
      console.log('loaded..')
    }
    else{
      console.log('loading...')
    }
  }, [isLoading])


  const options = [
    { id: 1, text: "Choose Product", text: "Choose Product" },
    { id: 2, text: "Macbook pro", text: "Macbook pro" },
    { id: 3, text: "Orange", text: "Orange" },
  ];
  const options2 = [
    { id: 1, text: "Choose Category", text: "Choose Category" },
    { id: 2, text: "Computers", text: "Computers" },
    { id: 3, text: "Fruits", text: "Fruits" },
  ];
  const options3 = [
    { id: 1, text: "Choose Sub Category", text: "Choose Sub Category" },
    { id: 2, text: "Computers", text: "Computers" },
  ];
  const options4 = [
    { id: 1, text: "Brand", text: "Brand" },
    { id: 2, text: "N/D", text: "N/D" },
  ];
  const options5 = [
    { id: 1, text: "Price", text: "Price" },
    { id: 2, text: "150.00", text: "150.00" },
  ];

  const togglefilter = (value) => {
    setInputfilter(value);
  };



  const columns = [
    {
      title: "Supplier Name",
      dataIndex: "supplierName",
      sorter: (a, b) => a.supplierName.length - b.supplierName.length,
    },
    {
      title: "Reference",
      dataIndex: "reference",
      sorter: (a, b) => a.reference.length - b.reference.length,
    },
    {
      title: "Purchase Date",
      dataIndex: "date",
      sorter: (a, b) => a.date.length - b.date.length,
    },
    {
      title: "# of Products",
      dataIndex: "numberOfProduct",
      sorter: (a, b) => a.numberOfProduct.length - b.numberOfProduct.length,
    },
    {
      title: "Branch",
      dataIndex: "branch",
      sorter: (a, b) => a.branch.length - b.branch.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (record.status == 1 ? <span className="badges bg-lightgreen">Active</span> : <span className="badges bg-lightred">Inctive</span> ),
      sorter: (a, b) => a.status.length - b.status.length,
    },
    
    // {
    //   title: "Payment Status",
    //   dataIndex: "paymentStatus",
    //   render: (text, record) => (
    //     <span
    //       className={
    //         text === "Paid"
    //           ? "badges bg-lightgreen"
    //           : text == "Unpaid"
    //           ? "badges bg-lightred"
    //           : "badges bg-lightyellow"
    //       }
    //     >
    //       {text}
    //     </span>
    //   ),
    //   sorter: (a, b) => a.paymentStatus.length - b.paymentStatus.length,
    //   width: "120px",
    // },
    {
      title: "Action",
      render: (a, record) => (
        <>
          <Link className="me-3" to= {{pathname:"/dream-pos/purchase/editpurchase", state: record}}>
            <img src={EditIcon} alt="img" />
          </Link>
          <Link className="confirm-text" to="">
            <img src={DeleteIcon} alt="img" />
          </Link>
        </>
      ),
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
              <h4>Purchase List</h4>
              <h6>Manage your Purchase</h6>
            </div>
            <div className="page-btn">
              <Link
                to="/dream-pos/purchase/addpurchase"
                className="btn btn-added"
              >
                <img src={PlusIcon} alt="img" className="me-1" />
                Add New Purchase
              </Link>
            </div>
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-body">
              <Tabletop inputfilter={inputfilter} togglefilter={togglefilter} />
              {/* /Filter */}
              <div
                className={`card mb-0 ${ inputfilter ? "toggleCls" : ""}`}
                id="filter_inputs"
                style={{ display: inputfilter ? "block" :"none"}}
              >
                <div className="card-body pb-0">
                  <div className="row">
                    <div className="col-lg-12 col-sm-12">
                      <div className="row">
                        <div className="col-lg col-sm-6 col-12">
                          <div className="form-group">
                            <Select2
                              className="select"
                              data={options}
                              options={{
                                placeholder: "Choose Product",
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg col-sm-6 col-12">
                          <div className="form-group">
                            <Select2
                              className="select"
                              data={options2}
                              options={{
                                placeholder: "Choose Category",
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg col-sm-6 col-12">
                          <div className="form-group">
                            <Select2
                              className="select"
                              data={options3}
                              options={{
                                placeholder: "Choose Sub Category",
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg col-sm-6 col-12">
                          <div className="form-group">
                            <Select2
                              className="select"
                              data={options4}
                              options={{
                                placeholder: "Choose Sub Category",
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg col-sm-6 col-12 ">
                          <div className="form-group">
                            <Select2
                              className="select"
                              data={options5}
                              options={{
                                placeholder: "Brand",
                              }}
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
export default PurchaseList;
