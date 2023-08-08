import React, { useEffect, useState } from "react";
import Table from "../../EntryFile/datatable";
import Tabletop from "../../EntryFile/tabletop"
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import {
  PlusIcon,  
  search_whites,
  EditIcon,
  DeleteIcon,
  UnpaidGray,
} from "../../EntryFile/imagePath";
import { useGet } from "../../hooks/useGet";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import useCustomApi from "../../hooks/useCustomApi";

const QuotationList = () => {
  const [inputfilter, setInputfilter] = useState(false);
  const {
    data: productRequests,
    isError,
    isLoading,
    isSuccess,
  } = useGet("productRequests", "/productRequest");
  const [data, setData] = useState([])


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

  const axios = useCustomApi()

  const confirmText = (id) => {
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
     // t.value &&

     axios.delete(`/productRequest/${id}`)
     .then((res) => {
      if(res.status < 205){
        Swal.fire({
          type: "success",
          title: "Deleted!",
          text: "Your record has been deleted.",
          confirmButtonClass: "btn btn-success",
        });
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
      else{
        Swal.fire({
          type: "error",
          title: "Error!",
          text: "Your record could not be deleted.",
          confirmButtonClass: "btn btn-danger",
        });
      }
     })

       
    });
  };

  const togglefilter = (value) => {
    setInputfilter(value);
  };

 


  useEffect(() => {
    if (!isLoading) {
      let mappedData = productRequests?.data?.map((productRequest) => {
        return {
          id: productRequest?.id,
          reference: productRequest?.reference,
          status: productRequest?.status,
          requestDate: new Date(productRequest.requestDate).toISOString().substring(0, 10),
          numberOfItems: productRequest?.numberOfItems,
          createdBy: productRequest?.createdBy || 'N/A',
        }
      })

      let sortedData = mappedData.sort((a,b) => new Date(b.requestDate) - new Date(a.requestDate))
      setData(sortedData)

    }
  }, [isLoading])


  if (isLoading) {
    return (<LoadingSpinner message="Loading list.." />)
  }


  const columns = [
    {
      title: "Request Date",
      dataIndex: "requestDate",
      sorter: (a, b) => a.requestDate.length - b.requestDate.length,
    },
 
    {
      title: "Reference",
      dataIndex: "reference",
      sorter: (a, b) => a.reference.length - b.reference.length,
    },
    
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <span
          className={
            text == "1"
              ? "badges bg-lightgreen"
              : text == "0"
              ? "badges bg-lightyellow" : ''
          }
        >
          {text == 0 ? 'Pending Approval' : 'Approved'}
        </span>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
    },
    {
      title: "No of Items",
      dataIndex: "numberOfItems",
      sorter: (a, b) => a.numberOfItems.length - b.numberOfItems.length,
    },
    {
      title: "Requested By",
      dataIndex: "createdBy",
     
    },
    {
      title: "Action",
      render: (record) => (
        <>
          <Link className="me-3" to= {{pathname:"/tinatett-pos/quotation/editquotation-quotation", state: record}}>
            <img src={EditIcon} alt="img" />
          </Link>
          <Link className="confirm-text" to="#" onClick={() => confirmText(record?.id)}>
            <img src={DeleteIcon} alt="img" />
          </Link>
        </>
      ),
    },
  ];
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Request List</h4>
              <h6>Manage your Product Requests</h6>
            </div>
            <div className="page-btn">
              <Link
                to="/tinatett-pos/quotation/addquotation-quotation"
                className="btn btn-added"
              >
                <img src={PlusIcon} alt="img" className="me-1" />
                Add New Request
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
                                placeholder: "Brand",
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
                                placeholder: "Price",
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
export default QuotationList;
