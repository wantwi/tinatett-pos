import React, { useEffect, useRef, useState } from "react";
import {
  Calendar,
  Plus,
  Scanner,
  DeleteIcon,
  EditIcon,
  MacbookIcon,
  EarpodIcon,
  Dollar,
} from "../../EntryFile/imagePath";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import { isValidNumber, moneyInTxt } from "../../utility";
import useCustomApi from "../../hooks/useCustomApi";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import alertify from "alertifyjs";
import "../../../node_modules/alertifyjs/build/css/alertify.css";
import "../../../node_modules/alertifyjs/build/css/themes/semantic.css";
import Select from "react-select";
import FeatherIcon from 'feather-icons-react'

const AddExpense = () => {
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().substring(0,10));
  const [formData, setFormData] = useState({expenseFor:'', description:'', amount:'', category:''})
  const [editFormData, setEditFormData] = useState({ amount: '', quantity: '', price: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [listData, setProductGridData] = useState([])
  const options = [
    { id: 1, label: "Choose Category", value: "Choose Category" },
    { id: 2, label: "Fuel", value: "Fuel" },
    { id: 3, label: "Electric Power ", value: "Electric Power" },
    { id: 4, label: "Poly Bag ", value: "Poly Bag " },
    { id: 5, label: "Drinking Water ", value: "Drinking Water " },
    { id: 6, label: "Stationery", value: "Stationery" },
    { id: 7, label: " Printing and Photocopies ", value: " Printing and Photocopies " },
    { id: 8, label: "Detergent and Toiletries ", value: "Detergent and Toiletries " },
    { id: 9, label: "Sanitation", value: "Sanitation" },
    { id: 10, label: "Plastic Tables and Chairs ", value: "Plastic Tables and Chairs " },
    { id: 11, label: "Repairs and Maintenance ", value: "Repairs and Maintenance " },
    { id: 12, label: "Deliveries", value: "Deliveries" },
    { id: 13, label: "Refund", value: "Refund" },
    { id: 14, label: " Printer cartriage ", value: " Printer cartriage " },
    { id: 15, label: " Fire extinguisher ", value: " Fire extinguisher " },
    { id: 16, label: "  Business Operations Permit ", value: "  Business Operations Permit " },
    { id: 17, label: "Head Potters", value: "Head Potters" },
    { id: 18, label: "  Loading fee", value: "  Loading fee" },
    { id: 19, label: "  Battery", value: "  Battery" },
    { id: 20, label: "Water bill", value: "Water bill" },
    { id: 21, label: "Payment to Supplier", value: "Payment to Supplier" },
    { id: 22, label: "Advertisement and Radio Show", value: "Advertisement and Radio Show" },
    { id: 23, label: "Accomodation (rent for staff)", value: "Accomodation (rent for staff)" },
    { id: 24, label: "FDA", value: "FDA" },
    { id: 25, label: "MOH", value: "MOH" },
    { id: 26, label: " Assembly Levy", value: " Assembly Levy" },
    { id: 27, label: "Other", value: "Other" },
  ];

  const directorRef = useRef()
  const shopRef = useRef()
  const companyRef = useRef()
  const productionRef = useRef()

  const axios = useCustomApi();


  const handleTypeChange = (e) => {
    setFormData({...formData, category: e.target.value})
  }

  const handleAddItem = () => {
    let item =

    {
      id: listData.length + 1,
      expenseDate: expenseDate,
      category: formData.category,
      expenseFor: formData.expenseFor.label,
      description: formData?.description,
      amount: formData.amount

    }
    if (item.amount < 1 || formData.category == '' || item.expenseFor == '' || item.expenseDate == '') {
      alertify.set("notifier", "position", "top-right");
      alertify.warning("Please make sure all fields are filled.");
    }
    else {


      setProductGridData([...listData, item])
      setFormData({ expenseFor:'', description:'', amount:'', category:''})
      directorRef.current.checked = false
      productionRef.current.checked = false
      shopRef.current.checked = false
      companyRef.current.checked = false

    }

  }

  const deleteRow = (record) => {
    // console.log(record)
    // console.log(listData)
    let newGridData = listData.filter((item) => item.id !== record.id)
    //console.log(newGridData)
    setProductGridData(newGridData)
  };

  const handleSubmit = () => {
    let payload = {
      expenseList: listData.map((item) => {
        return {
            "category": item.category,
            "expenseDate": item.expenseDate,
            "amount": item.amount,
            "expenseFor":item.expenseFor,
            "description": item.description
        }
      })
    }

    console.log(payload)
    setIsLoading(true)
    axios.post('/expense',payload)
    .then((res) => {
     
      if(res.data.success){
        alertify.set("notifier", "position", "top-right");
        alertify.success("Expense successfully added.");
        setIsLoading(false)
        setProductGridData([])
      }
    })
    .catch((error) => {
      alertify.set("notifier", "position", "top-right");
      alertify.error("Error...Could not complete transaction");
      setIsLoading(false)
    })
    .finally(() => {
      setFormData({amount:'', description:'', expenseFor:'', category:''})
      setStartDate(new Date().toISOString().substring(0,10))
      setIsLoading(false)
    })
  }


  if(isLoading){
    return <LoadingSpinner message="Adding expense.."/>
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Add Expense</h4>
              <h6>Add/Update Expenses</h6>
            </div>
          </div>

          <div style={{display:'flex', gap:20}}>
              <div className="card" style={{width: '40%'}}>
                <div className="card-body">
                  <div  className="row">
                    <div className="col-lg-6 col-sm-6 col-12">
                      <div className="form-group">
                        <label>Expense Date </label>
                        <div className="input-groupicon">
                          <input type="date" className="form-control"
                            value={expenseDate}
                            onChange={(e) => setExpenseDate(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-12 col-sm-12 col-12">
                      <div className="form-group">
                        <label>Expense Category</label>
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="input-group">
                              <div className="input-group-text">
                                <input className="form-check-input" type="radio" ref={shopRef}  name="category" value={'Shop Related'}  onChange={handleTypeChange} />
                              </div>
                              <input type="text" className="form-control" aria-label="Text input with radio button" value={'Shop Related'} />
                            </div>
                          </div>

                          <div className="col-lg-6">
                            <div className="input-group">
                              <div className="input-group-text">
                                <input className="form-check-input" type="radio" ref={companyRef}  name="category" value={'Company'}  onChange={handleTypeChange}/>
                              </div>
                              <input type="text" className="form-control" aria-label="Text input with radio button" value={'Company'} />
                            </div>
                          </div> 

                          <br/><br/>

                          <div className="col-lg-6">

                            <div className="input-group">
                              <div className="input-group-text">
                                <input className="form-check-input" type="radio" ref={productionRef}  name="category" value={'Production'}   onChange={handleTypeChange}/>
                              </div>
                              <input type="text" className="form-control" aria-label="Text input with radio button" value={'Production'} />
                            </div>

                          </div>

                          <div className="col-lg-6">
                          <div className="input-group">
                            <div className="input-group-text">
                              <input className="form-check-input" type="radio" ref={directorRef} name="category" value={'Director'} onChange={handleTypeChange} />
                            </div>
                            <input type="text" className="form-control" aria-label="Text input with radio button" value={'Director'} />
                          </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  
                  </div>


                  <div className="row">

                          <div className="form-group">
                            <label>Type of Expense</label>
                            <div className="row">
                              <div className="col-lg-12 col-sm-12 col-12">
                              <Select style={{width:'100%'}}
                              className="select"
                              options={options}
                              value={formData.expenseFor}
                              onChange={(e) => setFormData({...formData, expenseFor: e})}
                            
                            />
                              </div>

                            </div>
                          </div>
                      
                  </div>


                  <div className="row">
                    <div className="col-lg-12">
                      <div className="form-group">
                        <label>Description</label>
                        <textarea className="form-control" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}/>
                      </div>
                  </div>

                  <div  className="row" style={{}}>
                      <div className="col-lg-6 col-sm-6 col-12">
                          <div className="form-group">
                            <label>Amount</label>
                            <div className="input-groupicon">
                              <input type="text" 
                              value={formData?.amount}
                              onChange={(e) => {
                                if(e.target.value == ''){
                                  setFormData({...formData, amount: ''})
                                }
                                else if (isValidNumber(e.target.value)) {
                                  let amt = parseInt(e.target.value) || 0
                                  setFormData({ ...formData, amount:amt})
                                }
                              }}
                              />
                            
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-6" style={{display:'flex', justifyContent:'flex-end'}}>
                            <button style={{height:50,  marginTop:30}} className="btn btn-submit me-2" onClick={handleAddItem}>Add Expenses</button>
                    
                        </div>
                  </div>

                  
                  </div>

                

                
                </div>
              </div>


              <div className="card" style={{width:'60%'}}>
              <div className="card-body">
                <div className="row">
                  <div className="table-responsive mb-3">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Date</th>
                          <th>Type of Expense</th>
                          <th>Amount</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listData?.map((item, index) => {
                          return (
                            <tr key={item?.id}>
                              <td>{index + 1}</td>
                              <td>
                                <Link to="#">{item?.expenseDate}</Link>
                              </td>
                              <td>{item?.expenseFor}</td>
                              <td>{moneyInTxt(item?.amount)}</td>
                              <td>
                                {/* <Link to="#" className="me-2">
                                    <img src={EditIcon} alt="svg" data-bs-toggle="modal" data-bs-target="#editproduct" onClick={() => setEditFormData(item)}/>
                                  </Link> */}
                                <Link to="#" className="delete-set" onClick={() => deleteRow(item)}>
                                  <img src={DeleteIcon} alt="svg" />
                                </Link>
                              </td>
                            </tr>
                          )
                        })}

                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-6 ">
                    <div className="total-order w-100 max-widthauto m-auto mb-4">
                     
                    </div>
                  </div>
                  <div className="col-lg-6 ">
                    <div className="total-order w-100 max-widthauto m-auto mb-4">
                      <ul>

                        <li className="total">
                          <h4>Grand Total</h4>
                          <h5>GHS {moneyInTxt(
                            listData.reduce((total, item) => total + item.amount, 0)
                          )}</h5>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12" style={{ textAlign: 'right' }}>
                  <button type="submit" className="btn btn-submit me-2" onClick={handleSubmit}><FeatherIcon icon="save" />
                    {" Save Expenses"}
                  </button>
                  
                  <Link to="/tinatett-pos/proforma/proformalist" className="btn btn-cancel">
                    Cancel
                  </Link>
                </div>
              
            </div>
              </div>
          </div>
         
        </div>
      </div>
    </>
  );
};

export default AddExpense;
