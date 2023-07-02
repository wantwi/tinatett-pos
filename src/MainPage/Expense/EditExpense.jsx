import React, { useState } from "react";
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
  const [startDate, setStartDate] = useState(state?.expenseDate);
  const [isLoading, setIsLoading] = useState(false)
  const [otherCategory, setOtherCategory] = useState('')

  
  const options = [
    { id: 1, text: "Choose Category", value: "Choose Category" },
    { id: 2, text: "Food", value: "Food" },
    { id: 3, text: "Office Supply", value: "Office Supply" },
    { id: 4, text: "Entertainment", value: "Entertainment" },
    { id: 5, text: "Fuel", value: "Fuel" },
    { id: 6, text: "Water", value: "Water" },
    { id: 7, text: "Light", value: "Light" },
    { id: 8, text: "Other", value: "Other" },
  ];

  const axios = useCustomApi()
  const history = useHistory()

  const handleUpdate = () => {
    let payload = {
      amount: formData.amount,
      description: formData.description,
      expenseFor: formData.expenseFor, 
      category: formData?.category,
      specifyOther: otherCategory,
      expenseDate: startDate,
    }

    //console.log(payload)
    //setIsLoading(true)
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
          <div className="card">
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

                {/* <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Reference No.</label>
                    <input type="text" 
                    value={formData.referenceNo}
                    onChange={(e) => setFormData({...formData, referenceNo: e.target.value})}
                    />
                  </div>
                </div> */}
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
                  <button className="btn btn-cancel">Cancel</button>
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
