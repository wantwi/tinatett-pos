import React, { useState, useEffect } from "react";
import Table from "../../EntryFile/datatable";
import Tabletop from "../../EntryFile/tabletop"
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  DeleteIcon,
  EditIcon,
  PlusIcon,
  Printer,
  Search,
  search_whites,

} from "../../EntryFile/imagePath";
import { useGet } from "../../hooks/useGet";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import { debounce } from "lodash";
import useCustomApi from "../../hooks/useCustomApi";
import FeatherIcon from 'feather-icons-react'

const BranchList = () => {
  const [tableID] = useState("BranchList")
  const [inputfilter, setInputfilter] = useState(false);
  
  const [data, setData] = useState([])

  const {
    data: branchList,
    isError,
    isLoading,
    isSuccess,
  } = useGet("branches", "/branch");

  // const axios = useCustomApi()
  // const handleSearch = debounce((value) => {
  //     axios.get(`/branch/search?name=${value}`)
  //     .then((res) => {
       
  //     setData(res.data.data)
  //   })
      

  // }, 300)


  useEffect(() => {
    if(!isLoading){
     // console.log(branchList)
      setData(branchList.data)
      console.log('loaded..')
    }
    else{
      console.log('loading...')
    }
  }, [isLoading])

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
      t.value &&
        Swal.fire({
          type: "success",
          title: "Deleted!",
          text: "Your file has been deleted.",
          confirmButtonClass: "btn btn-success",
        });
    });
  };
  const togglefilter = (value) => {
    setInputfilter(false);
  };




  const columns = [
    {
      title: "Branch",
      dataIndex: "name",
      render: (text, record) => (
        <div className="productimgname">

          <Link style={{ fontSize: "15px", marginLeft: "10px", textAlign:'left' }}>
            {record.name}
          </Link>
        </div>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
      width: "170px",
    },
    {
      title: "Location",
      dataIndex: "location",
     
    },
    // {
    //   title: "Phone",
    //   dataIndex: "contact",
    //   sorter: (a, b) => a.contact.length - b.contact.length,
    // },
    // {
    //   title: "Email",
    //   dataIndex: "email",
    //   sorter: (a, b) => a.email.length - b.email.length,
    // },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (record.status == 1 ? <span className="badges bg-lightgreen">Active</span> : <span className="badges bg-lightred">Inctive</span> )
    },
    {
      title: "Action",
      render: (a, record) => (
        // <>
        //   <Link className="me-3" to={{pathname:"/tinatett-pos/users/new-branch", state:record}}>
        //     <img src={EditIcon} alt="img" />
        //   </Link>
        //   <span className="me-3" onClick={() => confirmText(record.id)}>
        //     <img src={DeleteIcon} alt="img" />
        //   </span>
        // </>

        <>
        <Link to={{pathname:"/tinatett-pos/users/new-branch", state:record}}>
          <span className="badges btn-cancel me-2"><FeatherIcon icon="edit" /> Edit</span> 
        </Link>

        <span className="badges btn-danger me-2" onClick={() => confirmText(record.id)}>
          <FeatherIcon icon="trash" /> Delete</span>          
        </>
      ),
    },
  ];


  if(isLoading){
     return (<LoadingSpinner message="Fetching Branches.."/>)
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Branch List</h4>
              <h6>Manage your Branches</h6>
            </div>
            <div className="page-btn">
              <Link
                to="/tinatett-pos/people/addcustomer"
                className="btn btn-added"
              >
                <img src={PlusIcon} alt="img" className="me-1" />
                Add Customer
              </Link>
            </div>
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-body">
            <Tabletop inputfilter={inputfilter} togglefilter={togglefilter} tableID={tableID} data={data} title={'Branch List'}/>
              {/* /Filter */}
              <div
                className={`card mb-0 ${ inputfilter ? "toggleCls" : ""}`}
                id="filter_inputs"
                style={{ display: inputfilter ? "block" :"none"}}
              >
                <div className="card-body pb-0">
                  <div className="row">
                    <div className="col-lg-2 col-sm-6 col-12">
                      <div className="form-group">
                        <input type="text" placeholder="Enter Customer Code" />
                      </div>
                    </div>
                    <div className="col-lg-2 col-sm-6 col-12">
                      <div className="form-group">
                        <input type="text" placeholder="Enter Customer Name" />
                      </div>
                    </div>
                    <div className="col-lg-2 col-sm-6 col-12">
                      <div className="form-group">
                        <input type="text" placeholder="Enter Phone Number" />
                      </div>
                    </div>
                    <div className="col-lg-2 col-sm-6 col-12">
                      <div className="form-group">
                        <input type="text" placeholder="Enter Email" />
                      </div>
                    </div>
                    <div className="col-lg-1 col-sm-6 col-12  ms-auto">
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
              <div className="table-responsive" id={tableID} >
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
export default BranchList;
