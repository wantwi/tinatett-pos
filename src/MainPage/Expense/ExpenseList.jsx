import React, { useEffect, useState } from "react";
import Table from "../../EntryFile/datatable";
import { Link } from "react-router-dom";
import Tabletop from "../../EntryFile/tabletop"
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
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
import Swal from "sweetalert2";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import { useGet } from "../../hooks/useGet";
import useCustomApi from "../../hooks/useCustomApi";
import { moneyInTxt } from "../../utility";
import FeatherIcon from 'feather-icons-react'

const ExpenseList = () => {
  const [inputfilter, setInputfilter] = useState(false);
  const [data, setData] = useState([])



  const onSuccess = (data) =>{
    
    setData([])

    let mappedData =  data?.data.map((expense) => {
      return {
        ...expense, expenseDate: expense?.expenseDate.substring(0,10) || expense.expenseDate
      }
    })
    let sortedData = mappedData.sort((a,b) => new Date(b.expenseDate) - new Date(a.expenseDate))
    setData(sortedData)

  }
  const {data: expenses, isLoading, refetch} = useGet("expenses", "/expense", onSuccess);

 


  useEffect(() => {
    if(!isLoading){
      let mappedData =  expenses?.data.map((expense) => {
          return {
            ...expense, expenseDate: expense?.expenseDate.substring(0,10) || expense.expenseDate
          }
        })
      let sortedData = mappedData.sort((a,b) => new Date(b.expenseDate) - new Date(a.expenseDate))
      setData(sortedData)
    }
 
  }, [isLoading])

  const options = [
    { id: 1, text: "Choose Product", text: "Choose Product" },
    { id: 2, text: "Macbook pro", text: "Macbook pro" },
    { id: 3, text: "Orange", text: "Orange" },
  ];
  const options2 = [
    { id: 1, text: "Choose Category", value: "Choose Category" },
    { id: 2, text: "Food", value: "Food" },
    { id: 3, text: "Office Supply", value: "Office Supply" },
    { id: 4, text: "Entertainment", value: "Entertainment" },
    { id: 5, text: "Miscellaneous", value: "Miscellaneous" },
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
    }).then(async function (t) {
     // t.value &&

      if(t.isConfirmed){
        axios.delete(`/expense/${id}`)
      .then((res) => {
        
          if(res.status < 205){
            Swal.fire({
              type: "success",
              title: "Deleted!",
              text: "Your record has been deleted.",
              confirmButtonClass: "btn btn-success",
            });
            refetch()
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
      }

      t.dismiss === Swal.DismissReason.cancel &&
      Swal.fire({
        title: "Cancelled",
        text: "You cancelled the delete action",
        type: "error",
        confirmButtonClass: "btn btn-success",
      });
  });
}

  const togglefilter = (value) => {
    setInputfilter(value);
  };


  const columns = [
    {
      title: "Date",
      dataIndex: "expenseDate",
      sorter: (a, b) => a.expenseDate.length - b.expenseDate.length,
    },
    {
      title: "Expense Ref",
      dataIndex: "expenseref",
      sorter: (a, b) => a.expenseref.length - b.expenseref.length,
    },
    {
      title: "Number of Items",
      dataIndex: "numberOfItem",
      sorter: (a, b) => a.numberOfItem.length - b.numberOfItem.length,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      sorter: (a, b) => a.amount.length - b.amount.length,
      render: (text) => <span>{moneyInTxt(text)}</span>,
      width: "125px",
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      
    },
   
    {
      title: "Action",
      render: (a,record) => (
        <>
          {/* <Link className="me-3"  to={{pathname:"/tinatett-pos/expense/editexpense", state:record}} > */}
          <a href={`/tinatett-pos/expense/editexpense?id=${record.id}`} >
            <span className="badges btn-cancel me-2"><FeatherIcon icon="edit" /> Edit</span>
          </a>
          {/* </Link> */}
          <Link className="confirm-text" to="#" onClick={() => confirmText(record.id)}>
          <span className="badges btn-danger me-2"><FeatherIcon icon="trash" /> Delete</span>
          </Link>
        </>
      ),
    },
  ];

  if(isLoading){
    return <LoadingSpinner/>
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Expense List</h4>
              <h6>Manage your Expenses</h6>
            </div>
            <div className="page-btn">
              <Link
                to="/tinatett-pos/expense/addexpense"
                className="btn btn-added"
              >
                <img src={PlusIcon} alt="img" className="me-1" />
                Add New Expense
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
                              data={options2}
                              options={{
                                placeholder: "Choose Category",
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
export default ExpenseList;
