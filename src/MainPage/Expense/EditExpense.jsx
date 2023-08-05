import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import { isValidNumber } from "../../utility";
import useCustomApi from "../../hooks/useCustomApi";
import alertify from "alertifyjs";
import "../../../node_modules/alertifyjs/build/css/alertify.css";
import "../../../node_modules/alertifyjs/build/css/themes/semantic.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const AddExpense = () => {
  const {state} = useLocation()
  // console.log(state)
  const [formData, setFormData] = useState(state)
  // const [startDate, setStartDate] = useState(state?.expenseDate);
  // const [isLoading, setIsLoading] = useState(false)
  // const [otherCategory, setOtherCategory] = useState('')

  const [expenseDate, setExpenseDate] = useState(state?.expenseDate);
  //const [formData, setFormData] = useState({expenseFor:'', description:'', amount:'', category:''})
  const [editFormData, setEditFormData] = useState({ amount: '', quantity: '', price: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [listData, setProductGridData] = useState([])

  const options = [
    // { id: textbel: "Cho", value: "" },
    { id: 2, text: "Fuel", value: "Fuel" },
    { id: 3, text: "Electric Power", value: "Electric Power" },
    { id: 4, text: "Poly Bag", value: "Poly Bag" },
    { id: 5, text: "Drinking Water", value: "Drinking Water " },
    { id: 6, text: "Stationery", value: "Stationery" },
    { id: 7, text: "Printing and Photocopies", value: "Printing and Photocopies" },
    { id: 8, text: "Detergent and Toiletries", value: "Detergent and Toiletries" },
    { id: 9, text: "Sanitation", value: "Sanitation" },
    { id: 10,text: "Plastic Tables and Chairs", value: "Plastic Tables and Chairs" },
    { id: 11, text: "Repairs and Maintenance", value: "Repairs and Maintenance" },
    { id: 12, text: "Deliveries", value: "Deliveries" },
    { id: 13, text: "Refund", value: "Refund" },
    { id: 14, text: "Printer cartriage", value: "Printer cartriage" },
    { id: 15, text: "Fire extinguisher", value: "Fire extinguisher" },
    { id: 16, text: "Business Operations Permit", value: "Business Operations Permit" },
    { id: 17, text: "Head Potters", value: "Head Potters" },
    { id: 18, text: "Loading fee", value: "Loading fee" },
    { id: 19, text: "Battery", value: "Battery" },
    { id: 20, text: "Water bill", value: "Water bill" },
    { id: 21, text: "Payment to Supplier", value: "Payment to Supplier" },
    { id: 22, text: "Advertisement and Radio Show", value: "Advertisement and Radio Show" },
    { id: 23, text: "Accomodation (rent for staff)", value: "Accomodation (rent for staff)" },
    { id: 24, text: "FDA", value: "FDA" },
    { id: 25, text: "MOH", value: "MOH" },
    { id: 26, text: "Assembly Levy", value: "Assembly Levy" },
    { id: 27, text: "Other", value: "Other" },
  ];


  const directorRef = useRef()
  const shopRef = useRef()
  const companyRef = useRef()
  const productionRef = useRef()


  useEffect(() => {
    if(state.category == "Director"){
      directorRef.current.checked = true
    }
    if(state.category == "Company"){
      companyRef.current.checked = true
    }
    if(state.category == "Production"){
      productionRef.current.checked = true
    }
    if(state.category == "Shop"){
      shopRef.current.checked = true
    }
  }, [])

  const axios = useCustomApi();

  const history = useHistory()

  const handleTypeChange = (e) => {
    setFormData({...formData, category: e.target.value})
  }

  const handleUpdate = () => {
    let payload = {
      expenseDate: expenseDate,
      category: formData.category,
      expenseFor: formData.expenseFor,
      description: formData?.description,
      amount: formData.amount
    }

    // console.log(payload)
    setIsLoading(true)
    axios.put(`/expense/${state?.id}`,payload)
    .then((res) => {
  
      if(res.data.success){
        alertify.set("notifier", "position", "top-right");
        alertify.success("Expense successfully updated.");
        setTimeout(() => {
          history.push('/tinatett-pos/expense/expenselist')
        })
      }
    })
    .catch((error) => {
      alertify.set("notifier", "position", "top-right");
      alertify.error("Error...Could not complete transaction");
    })
    .finally(() => setIsLoading(false))
  }


  if(isLoading){
    return <LoadingSpinner message="Updating expense.."/>
  }
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Expense Edit</h4>
              <h6>Update Expenses</h6>
            </div>
          </div>

             <div style={{display:'flex', gap:20}}>
              <div className="card" style={{width: '50%'}}>
                <div className="card-body">
                  <div  className="row">
                    <div className="col-lg-6 col-sm-6 col-12">
                      <div className="form-group">
                        <label>Expense Date </label>
                        <div className="input-groupicon">
                          <input type="date" className="form-control" id="expenseDate"
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
                        <div className="row" id="category">
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
                              <Select2 style={{width:'100%'}}
                              id="expenseFor"
                              className="select"
                              data={options}
                              value={formData.expenseFor}
                              onChange={(e) => setFormData({...formData, expenseFor: e.target.value})}
                              // onChange={(e) => console.log(e.target.value)}
                            
                            />
                              </div>

                            </div>
                          </div>
                      
                  </div>


                  <div className="row">
                    <div className="col-lg-12">
                      <div className="form-group">
                        <label>Description</label>
                        <textarea id="description" className="form-control" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}/>
                      </div>
                  </div>

                  <div  className="row" style={{}}>
                      <div className="col-lg-6 col-sm-6 col-12">
                          <div className="form-group">
                            <label>Amount</label>
                            <div className="input-groupicon">
                              <input type="text" 
                              id="amount"
                              value={formData?.amount}
                              onChange={(e) => {
                                if(e.target.value == ''){
                                  setFormData({...formData, amount: ''})
                                }
                                else if (isValidNumber(e.target.value)) {
                                  let amt = parseInt(e.target.value) 
                                  setFormData({ ...formData, amount:amt})
                                }
                              }}
                              />
                            
                            </div>
                          </div>
                        </div>

                        {/* <div className="col-lg-6" style={{display:'flex', justifyContent:'flex-end'}}>
                            <button style={{height:50,  marginTop:30}} className="btn btn-submit me-2" onClick={handleAddItem}>Add Expenses</button>
                    
                        </div> */}
                  </div>
                  <div className="col-lg-12">
                  <button className="btn btn-submit me-2" onClick={() => handleUpdate()}>Update</button>
                  <Link to="/tinatett-pos/expense/expenselist" className="btn btn-cancel">
                    Cancel
                  </Link>
                </div>

                  
                  </div>

                

                
                </div>
              </div>


          </div>
          {/* <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-lg-4 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Expense Category</label>
                    <div className="row">
                      <div className="form-group">
                        <Select2
                          className="select"
                          data={options}
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          options={{
                            placeholder: "Choose Category",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Expense Date </label>
                    <div className="input-groupicon">
                      <input type="date" className="form-control"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-sm-6 col-12">
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

                <div className="col">
                  <div className="form-group">
                    <label>Expense for</label>
                    <div className="input-groupicon">
                      <input type="text" 
                      value={formData.expenseFor}
                      onChange={(e) => setFormData({...formData, expenseFor: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                {formData.category == 'Other' && (<div className="col">
                  <div className="form-group">
                    <label>If Other Specify</label>
                    <div className="input-groupicon">
                      <input type="text" 
                      value={otherCategory}
                      onChange={(e) => setOtherCategory( e.target.value)}
                      />
                    </div>
                  </div>
                </div>)}
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-group">
                    <label>Description</label>
                    <textarea className="form-control" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}/>
                  </div>
                </div>
                <div className="col-lg-12">
                  <button className="btn btn-submit me-2" onClick={handleUpdate}>Update</button>
                  <Link to="/tinatett-pos/expense/expenselist" className="btn btn-cancel">
                    Cancel
                  </Link>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default AddExpense;
