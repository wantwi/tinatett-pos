import React, { useEffect, useState } from "react";
import Table from "../../EntryFile/datatable";
import Tabletop from "../../EntryFile/tabletop";
import Swal from "sweetalert2";
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
import useCustomApi from "../../hooks/useCustomApi";

const TransferList = () => {
  const [inputfilter, setInputfilter] = useState(false);
  
  const [data, setData] = useState([])


  const onSuccess = (data) =>{
    
    setData([])

    let sortedData = data?.data?.sort((a,b) => new Date(b.transferDate) - new Date(a.transferDate))
      setData(sortedData)
  }

  const {
    data: transfers,
    isError,
    isLoading,
    refetch,
  } = useGet("transfers", "/transfer", onSuccess);
  

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
  const axios = useCustomApi();
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
    }) .then( async(t) => {
     
      if(t.isConfirmed){
      let data = await axios.delete(`/transfer/${id}`)
      if(data.status < 205){
        Swal.fire({
          type: "success",
          title: "Deleted!",
          text: "Your Transfer item has been deleted.",
          confirmButtonClass: "btn btn-success",
        });
       refetch()
   
      }
      else{
        Swal.fire({
          type: "danger",
          title: "Error!",
          text: data.response.data.message,
          confirmButtonClass: "btn btn-danger",
        });
      }
    }
    t.dismiss === Swal.DismissReason.cancel &&
    Swal.fire({
      title: "Cancelled",
      text: "You cancelled the delete action",
      type: "error",
      confirmButtonClass: "btn btn-success",
    });
    })
    .catch( (error) => {
        Swal.fire({
          type: "danger",
          title: "Error!",
          text: error,
          confirmButtonClass: "btn btn-danger",
        });
    });
  };
  const togglefilter = (value) => {
    setInputfilter(false);
  };


  const columns = [
    {
      title: "Date",
      dataIndex: "transferDate",
      sorter: (a, b) => a.transferDate.length - b.transferDate.length,
    },
    {
      title: "Reference",
      dataIndex: "transferRef",
      sorter: (a, b) => a.transferRef.length - b.transferRef.length,
    },
    {
      title: "To",
      dataIndex: "branchName",
      sorter: (a, b) => a.branchName.length - b.branchName.length,
      render: (text, record) => (<span>{text}{' Branch'}</span>)
    },
   
    {
      title: "No of Items",
      dataIndex: "numberOfProduct",
      sorter: (a, b) => a.numberOfProduct.length - b.numberOfProduct.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <span
          className={
            text === "0"
              ? "badges bg-lightgreen"
              : text == "1"
              ? "badges bg-lightgreen": ''
             
          }
        >
          {text == 0 ? "Completed" : "Completed"}
        </span>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
    },
    {
      title: "Action",
      render: (record) => (
        <>
          <Link className="me-3" to= {{pathname:"/tinatett-pos/transfer/edittransfer-transfer", state: record}}>
            <img src={EditIcon} alt="img" />
          </Link>
          <Link className="confirm-text" to="#" onClick={() => confirmText(record.id)}>
            <img src={DeleteIcon} alt="img" />
          </Link>
        </>
      ),
    },
  ];



  useEffect(() => {
    if (!isLoading) {
      let sortedData = transfers?.data?.sort((a,b) => new Date(b.transferDate) - new Date(a.transferDate))
      setData(sortedData)

    }
  }, [isLoading])


  if(isLoading){
    return <LoadingSpinner message="Please wait..Getting List.."/>
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Transfer List</h4>
              <h6>Transfer your stocks to one store another store</h6>
            </div>
            <div className="page-btn">
              <Link
                to="/tinatett-pos/transfer/addtransfer-transfer"
                className="btn btn-added"
              >
                <img src={PlusIcon} alt="img" className="me-1" />
                Add Transfer
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
export default TransferList;
