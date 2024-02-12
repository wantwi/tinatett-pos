import React, { useEffect, useState } from "react";
import Table from "../../EntryFile/datatable";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import {
  ClosesIcon,
  Excel,
  Filter,
  Pdf,
  Calendar,
  Printer,
  search_whites,
  Search,
  PlusIcon,
  EditIcon,
  DeleteIcon,
} from "../../EntryFile/imagePath";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import { useGet } from "../../hooks/useGet";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import useCustomApi from "../../hooks/useCustomApi";
import FeatherIcon from 'feather-icons-react'

const UserLists = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [inputfilter, setInputfilter] = useState(false);
  const options = [
    { id: 1, text: "Disable", text: "Disable" },
    { id: 2, text: "Enable", text: "Enable" },
  ];
  const togglefilter = (value) => {
    setInputfilter(value);
  };

  const [data, setData] = useState([])

  const {
    data: userList,
    isError,
    isLoading,
    isSuccess,
  } = useGet("users", "/user");


  useEffect(() => {
    if(!isLoading){
     // console.log(branchList)
      setData(userList.data)
      console.log('loaded..')
    }
    else{
      console.log('loading...')
    }
  }, [isLoading])

  const columns = [
    {
      title: "User Name",
      dataIndex: "userName",
    
    },
    {
      title: "First Name",
      dataIndex: "firstName",
    
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
     
    },
    {
      title: "Role",
      dataIndex: "role",
      sorter: (a, b) => a.Role.length - b.Role.length,
    },
    
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <>
          {text == "1" && (
            <span className="badges bg-lightgreen">{'Active'}</span>
          )}
          {text == "0" && (
            <span className="badges bg-lightred">{'Inactive'}</span>
          )}
        </>
      ),
      sorter: (a, b) => a.Status.length - b.Status.length,
    },
    {
      title: "Action",
      render: (text, record) => (
        <>
         <Link to= {{pathname:"/tinatett-pos/users/newuseredit", state: record}}>
            <span className="badges btn-cancel me-2"><FeatherIcon icon="edit" /> Edit</span> 
          </Link>
         
          <span className="badges btn-danger me-2" onClick={() => confirmText(record.id)}><FeatherIcon icon="trash" /> Delete</span>          
        </>
      ),
    },
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
    }) .then( async(t) => {
     
  
    if(t.isConfirmed){
        let data = await axios.delete(`/user/${id}`)
      if(data.status < 205){
        Swal.fire({
          type: "success",
          title: "Deleted!",
          text: "User has been deleted.",
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


  if(isLoading){
    return <LoadingSpinner/>
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>User List</h4>
            <h6>Manage your User</h6>
          </div>
          <div className="page-btn">
            <Link to="/tinatett-pos/users/newuser" className="btn btn-added">
              <img src={PlusIcon} alt="img" className="me-2" />
              Add User
            </Link>
          </div>
        </div>
        {/* /product list */}
        <div className="card">
          <div className="card-body">
            <div className="table-top">
              <div className="search-set">
                <div className="search-path">
                  <a
                    className={` btn ${
                      inputfilter ? "btn-filter setclose" : "btn-filter"
                    } `}
                    id="filter_search"
                    onClick={() => togglefilter(!inputfilter)}
                  >
                    <img src={Filter} alt="img" />
                    <span>
                      <img src={ClosesIcon} alt="img" />
                    </span>
                  </a>
                </div>
                <div className="search-input">
                  <input
                    className="form-control form-control-sm search-icon"
                    type="text"
                    placeholder="Search..."
                  />
                  <a className="btn btn-searchset">
                    <img src={Search} alt="img" />
                  </a>
                </div>
              </div>
              <div className="wordset">
                <ul>
                  <li>
                    <a
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="pdf"
                    >
                      <img src={Pdf} alt="img" />
                    </a>
                  </li>
                  <li>
                    <a
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="excel"
                    >
                      <img src={Excel} alt="img" />
                    </a>
                  </li>
                  <li>
                    <a
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="print"
                    >
                      <img src={Printer} alt="img" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            {/* /Filter */}
            <div
              className={`card mb-0 ${inputfilter ? "toggleCls" : ""}`}
              id="filter_inputs"
              style={{ display: inputfilter ? "block" : "none" }}
            >
              <div className="card-body pb-0">
                <div className="row">
                  <div className="col-lg-2 col-sm-6 col-12">
                    <div className="form-group">
                      <input type="text" placeholder="Enter User Name" />
                    </div>
                  </div>
                  <div className="col-lg-2 col-sm-6 col-12">
                    <div className="form-group">
                      <input type="text" placeholder="Enter Phone" />
                    </div>
                  </div>
                  <div className="col-lg-2 col-sm-6 col-12">
                    <div className="form-group">
                      <input type="text" placeholder="Enter Email" />
                    </div>
                  </div>
                  <div className="col-lg-2 col-sm-6 col-12">
                    <div className="form-group">
                      <div className="input-groupicon">
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                        />
                        <div className="addonset">
                          <img src={Calendar} alt="img" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2 col-sm-6 col-12">
                    <div className="form-group">
                      <Select2
                        className="select"
                        data={options}
                        options={{
                          placeholder: "Select",
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-1 col-sm-6 col-12 ms-auto">
                    <div className="form-group">
                      <a className="btn btn-filters ms-auto">
                        <img src={search_whites} alt="img" />
                      </a>
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
  );
};

export default UserLists;
