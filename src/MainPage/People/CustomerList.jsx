import React, { useState, useEffect } from "react";
import Table from "../../EntryFile/datatable";
import Tabletop from "../../EntryFile/tabletop"
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
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
  Thomas,
  Benjamin,
  James,
  Bruklin,
  Beverly,
} from "../../EntryFile/imagePath";
import { useGet } from "../../hooks/useGet";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";

const CustomerList = () => {
  const [tableID] = useState("customerList")
  const [inputfilter, setInputfilter] = useState(false);
  
  const [data, setData] = useState([])

  const {
    data: customers,
    isError,
    isLoading,
    isSuccess,
  } = useGet("customers", "/customer");




  useEffect(() => {
    if(!isLoading){
      console.log(customers)
      let mappedData =  customers?.data.map((customer) => {
          return {
            id: customer?.id,
            image: Thomas,
            customerName: customer?.name,
            status: customer?.status,
            customerType: customer?.customerType,
            location: customer?.location,
            gpsAddress: customer?.gpsAddress,
            email: customer?.email,
            contact: customer?.contact,
            othercontact: customer?.otherContact,
            createdBy: customer?.user.firstName  + ' ' + customer.user.lastName,
          }
        })
      setData(mappedData)
      console.log('loaded..')
    }
    else{
      console.log('loading...')
    }
  }, [isLoading])

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
  const togglefilter = (value) => {
    setInputfilter(value);
  };




  const columns = [
    {
      title: "Customer",
      dataIndex: "customerName",
      render: (text, record) => (
        <div className="productimgname">
          {/* <Link style={{ width: "30%" }} className="product-img">
            <img alt="" src={record.image} />
          </Link> */}
          <Link style={{ fontSize: "15px", marginLeft: "10px", textAlign:'left' }}>
            {record.customerName}
          </Link>
        </div>
      ),
      sorter: (a, b) => a.customerName.length - b.customerName.length,
      width: "170px",
    },
    {
      title: "Location",
      dataIndex: "location",
      sorter: (a, b) => a.customer.length - b.customer.length,
    },
    {
      title: "Phone",
      dataIndex: "contact",
      sorter: (a, b) => a.contact.length - b.contact.length,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a, b) => a.code.length - b.code.length,
      render: (text, record) => (record.status == 1 ? <span className="badges bg-lightgreen">Active</span> : <span className="badges bg-lightred">Inctive</span> )
    },
    {
      title: "Action",
      render: (a, record) => (
        <>
          <Link className="me-3" to={{pathname:"/dream-pos/people/editcustomer", state:record}}>
            <img src={EditIcon} alt="img" />
          </Link>
          <Link className="confirm-text" to="#" onClick={confirmText}>
            <img src={DeleteIcon} alt="img" />
          </Link>
        </>
      ),
    },
  ];


  if(isLoading){
     return (<LoadingSpinner message="Fetching Customers.."/>)
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Customer List</h4>
              <h6>Manage your Customers</h6>
            </div>
            <div className="page-btn">
              <Link
                to="/dream-pos/people/addcustomer"
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
            <Tabletop inputfilter={inputfilter} togglefilter={togglefilter} tableID={tableID} data={data} title={'Customers List'}/>
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
              <div className="table-responsive" id={tableID} title={'Customers List'}>
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
export default CustomerList;
