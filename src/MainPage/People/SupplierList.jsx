import React, { useState, useEffect } from "react";
import Table from "../../EntryFile/datatable";
import Tabletop from "../../EntryFile/tabletop"
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  ClosesIcon,
  Noimage,
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

const SupplierList = () => {
  const [inputfilter, setInputfilter] = useState(false);
  const [data, setData] = useState([]);

  const {
    data: suppliers,
    isError,
    isLoading,
    isSuccess,
  } = useGet("suppliers", "/supplier");


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

  useEffect(() => {
    if (!isLoading) {
      let mappedData = suppliers?.data.map((supplier) => {
        return {
          id: supplier.id,
          name: supplier.name,
          status: supplier.status,
          contact: supplier.contact,
          othercontact: supplier.othercontact,
          email: supplier.email,
          location: supplier.location,
          customerType: supplier.customerType,
          gpsAddress: supplier.gpsAddress,
          creditPeriod: supplier.creditPeriod,
          product: supplier.product,
          paymentInfo: {
            type: supplier.paymentInfo.type,
            accountNumber: supplier.paymentInfo.accountNumber,
            branch: supplier.paymentInfo.branch,
            serviceProvider: supplier.paymentInfo.serviceProvider
          },
          createdBy: supplier.user.firstName + ' ' + supplier.user.lastName
        }
      })

      setData(mappedData)
      console.log('loaded..')
    }
    else {
      console.log('loading...')
    }
  }, [isLoading])


  const columns = [
    {
      title: "Supplier Name",
      dataIndex: "name",
      render: (text, record) => (
        <div className="productimgname">
          {/* <Link to="#" className="product-img">
            <img src={Noimage} alt="product" />
          </Link> */}
          <Link to="#">{text}</Link>
        </div>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
      width: "250px",
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: "Location",
      dataIndex: "location",
      sorter: (a, b) => a.location.length - b.location.length,
    },
    {
      title: "Phone",
      dataIndex: "contact",
      sorter: (a, b) => a.contact.length - b.contact.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a, b) => a.status.length - b.status.length,
      render: (text, record) => (record.status == 1 ? <span className="badges bg-lightgreen">Active</span> : <span className="badges bg-lightred">Inctive</span> )

    },
    {
      title: "Action",
      render: (a, record) => (
        <>
          <Link className="me-3" to={{pathname:"/dream-pos/people/editsupplier", state:record}}>
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
    return (<LoadingSpinner message="Fetching suppliers.."/>)
  }
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Supplier List</h4>
              <h6>Manage your Supplier</h6>
            </div>
            <div className="page-btn">
              <Link
                to="/dream-pos/people/addsupplier"
                className="btn btn-added"
              >
                <img src={PlusIcon} alt="img" className="me-1" />
                Add Supplier
              </Link>
            </div>
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-body">
              <Tabletop inputfilter={inputfilter} togglefilter={togglefilter} data={data} title={'Suppliers List'}/>
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
                        <input type="text" placeholder="Enter Supplier Code" />
                      </div>
                    </div>
                    <div className="col-lg-2 col-sm-6 col-12">
                      <div className="form-group">
                        <input type="text" placeholder="Enter Supplier" />
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
    </>
  );
};
export default SupplierList;
