import React, { useState, useRef, useEffect, useContext } from "react";
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
import { useGet } from "../../hooks/useGet";
import { NotificationsContext } from "../../InitialPage/Sidebar/DefaultLayout";

const EditExpense = () => {
  //const { state } = useLocation()
  //console.log(state)

  
  let href = window.location.search;
  let urlParams = new URLSearchParams(href)
  let id = urlParams.get('id');



  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().substring(0,10));
  const [formData, setFormData] = useState({expenseFor:'', description:'', amount:'', category:''})
  const [editFormData, setEditFormData] = useState({ amount: '', quantity: '', price: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [listData, setProductGridData] = useState([])
  const { data: expenseDetails, isLoading: isListLoading } = useGet("expense-details", `/expense/items/${id}`);
  const options = [
    // { id: 1, label: "Cho", value: "" },
    { id: 2, label: "Fuel", value: "Fuel" },
    { id: 3, label: "Electric Power", value: "Electric Power" },
    { id: 4, label: "Poly Bag", value: "Poly Bag" },
    { id: 5, label: "Drinking Water", value: "Drinking Water " },
    { id: 6, label: "Stationery", value: "Stationery" },
    { id: 7, label: "Printing and Photocopies", value: "Printing and Photocopies" },
    { id: 8, label: "Detergent and Toiletries", value: "Detergent and Toiletries" },
    { id: 9, label: "Sanitation", value: "Sanitation" },
    { id: 10, label: "Plastic Tables and Chairs", value: "Plastic Tables and Chairs" },
    { id: 11, label: "Repairs and Maintenance", value: "Repairs and Maintenance" },
    { id: 12, label: "Deliveries", value: "Deliveries" },
    { id: 13, label: "Refund", value: "Refund" },
    { id: 14, label: "Printer cartriage", value: "Printer cartriage" },
    { id: 15, label: "Fire extinguisher", value: "Fire extinguisher" },
    { id: 16, label: "Business Operations Permit", value: "Business Operations Permit" },
    { id: 17, label: "Head Potters", value: "Head Potters" },
    { id: 18, label: "Loading fee", value: "Loading fee" },
    { id: 19, label: "Battery", value: "Battery" },
    { id: 20, label: "Water bill", value: "Water bill" },
    { id: 21, label: "Payment to Supplier", value: "Payment to Supplier" },
    { id: 22, label: "Advertisement and Radio Show", value: "Advertisement and Radio Show" },
    { id: 23, label: "Accomodation (rent for staff)", value: "Accomodation (rent for staff)" },
    { id: 24, label: "FDA", value: "FDA" },
    { id: 25, label: "MOH", value: "MOH" },
    { id: 26, label: "Assembly Levy", value: "Assembly Levy" },
    { id: 27, label: "Allowance", value:"Allowance" },
    { id: 28, label: "Special Bonus", value: "Special Bonus"},
    { id: 29, label: "Transportation", value: "Transportation" }, 
    { id: 30, label: "Refuse Collection", value:  "Refuse Collection"},
    { id: 31, label: "Salary", value:  "Salary"},
    { id: 32, label: "Other", value: "Other" },
  ];


  let sortedOptions = options.sort(function (a, b) {
    if (a.label < b.label) {
      return -1;
    }
    if (a.label > b.label) {
      return 1;
    }
    return 0;
  });

  const directorRef = useRef()
  const shopRef = useRef()
  const companyRef = useRef()
  const productionRef = useRef()
  const editdirectorRef = useRef()
  const editshopRef = useRef()
  const editcompanyRef = useRef()
  const editproductionRef = useRef()

  const { notifications, setNotifications } = useContext(NotificationsContext)

  const axios = useCustomApi();

  const history = useHistory()


  const handleTypeChange = (e) => {
    setFormData({ ...formData, category: e.target.value })
  }

  const handleEditTypeChange = (e) => {
    setEditFormData({ ...editFormData, category: e.target.value})
  }

  const handleAddItem = () => {
    let item = {
      id: listData.length + 1,
      expenseDate: expenseDate,
      category: formData.category,
      expenseFor: formData.expenseFor.label,
      description: formData?.description,
      amount: formData.amount
    }
    // console.log(item)

    if (item.category == '' || item.category == undefined) {
      alertify.set("notifier", "position", "bottom-right");
      alertify.warning("Please make sure category is selected.");
      $('#category').css('border', '1px solid red')

      let storage = JSON.parse(localStorage.getItem("auth"))
      let newNotification = {
        id: Math.ceil(Math.random() * 1000000),
        message: `${storage.name} Please make sure category is selected.`,
        time: new Date().toISOString(),
        type: 'warning'
      }
      setNotifications([newNotification, ...notifications])
    }
    else if (formData.amount < 1 || formData.amount == "" || item.amount == undefined) {
      alertify.set("notifier", "position", "bottom-right");
      alertify.warning("Please make you enter amount.");
      $('#amount').css('border', '1px solid red')

      let storage = JSON.parse(localStorage.getItem("auth"))
      let newNotification = {
        id: Math.ceil(Math.random() * 1000000),
        message: `${storage.name} Please make you enter amount.`,
        time: new Date().toISOString(),
        type: 'warning'
      }
      setNotifications([newNotification, ...notifications])
    }
    else if (item.expenseDate == '' || item.expenseDate == undefined) {
      alertify.set("notifier", "position", "bottom-right");
      alertify.warning("Please make sure you select a date.");
      $('#expenseDate').css('border', '1px solid red')

      let storage = JSON.parse(localStorage.getItem("auth"))
      let newNotification = {
        id: Math.ceil(Math.random() * 1000000),
        message: `${storage.name} Please make sure you select a date.`,
        time: new Date().toISOString(),
        type: 'warning'
      }
      setNotifications([newNotification, ...notifications])
    }
    else if (item.expenseFor == '' || item.expenseFor == undefined) {
      alertify.set("notifier", "position", "bottom-right");
      alertify.warning("Please make sure you selected type of expense");
      $('#expenseFor').css('border', '1px solid red')

      let storage = JSON.parse(localStorage.getItem("auth"))
      let newNotification = {
        id: Math.ceil(Math.random() * 1000000),
        message: `${storage.name} Please make sure you selected type of expense.`,
        time: new Date().toISOString(),
        type: 'warning'
      }
      setNotifications([newNotification, ...notifications])
    }

    else {
      setProductGridData([...listData, item])
      setFormData({ expenseFor: '', description: '', amount: '', category: '' })
      directorRef.current.checked = false
      productionRef.current.checked = false
      shopRef.current.checked = false
      companyRef.current.checked = false
    }
  }

  const handleUpdateList = () => {
    let updated = {...editFormData, expenseFor: editFormData.expenseFor.label}
    //console.log(updated)
    let listCopy = [...listData]
    let index = listData.findIndex(item => item.id == updated.id)
    listCopy[index] = updated
    setProductGridData(listCopy)
    $('.modal').modal('hide')
  }
  
  const handleGetSelected = (item) => {
    // console.log(item)
    if(item.category == 'Shop Related'){
      editshopRef.current.checked = true
    }
    else if(item.category == 'Production'){
      editproductionRef.current.checked = true
    }
    if(item.category == 'Company'){
      editcompanyRef.current.checked = true
    }
    if(item.category == 'Director'){
      editdirectorRef.current.checked = true
    }
    let expenseFor = options.find((x) => x.label == item.expenseFor)
    console.log({...item, expenseFor: expenseFor })
    setEditFormData({...item, expenseFor: expenseFor })
  }

  const deleteRow = (record) => {
    let newGridData = listData.filter((item) => item.id !== record.id)
    setProductGridData(newGridData)
  }

  const handleUpdate = () => {

    let payload = {
      amount: listData.reduce((total, item) => item.amount + total, 0),
      expenseDate: expenseDate,
      expenseList: listData.map((item) => {
        return {
          "category": item.category,
          "expenseDate": item.expenseDate,
          "amount": item.amount,
          "expenseFor": item.expenseFor || '',
          "description": item.description || ''
        }
      })
    }

    if (!listData.length > 0) {
      alertify.set("notifier", "position", "bottom-right");
      alertify.warning("Please make sure you've added expenses.");
      let storage = JSON.parse(localStorage.getItem("auth"))
      let newNotification = {
        id: Math.ceil(Math.random() * 1000000),
        message: `${storage.name} Please make sure you've added expenses.`,
        time: new Date().toISOString(),
        type: 'warning'
      }
      setNotifications([newNotification, ...notifications])
    }

    //  console.log(payload)
    setIsLoading(true)
    axios.put(`/expense/${id}`, payload)
      .then((res) => {

        if (res.data.success) {
          alertify.set("notifier", "position", "bottom-right");
          alertify.success("Expense successfully updated.");
          setTimeout(() => {
            history.push('/tinatett-pos/expense/expenselist')
          })
        }
      })
      .catch((error) => {
        alertify.set("notifier", "position", "bottom-right");
        alertify.error("Error...Could not complete transaction");
      })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    let mappedData = expenseDetails?.data.map((item, index) => {
      return {
        id: index + 1,
        category: item?.category,
        description: item?.description,
        expenseFor: item?.expenseFor,
        expenseDate: item?.expenseDate,
        amount: item?.amount
      }
    })

    setTimeout(() => {
      console.log(mappedData[0])
      setExpenseDate(mappedData[0]?.expenseDate.substring(0,10))
    },500)
    //console.log(mappedData)
    setProductGridData(mappedData)

  }, [expenseDetails])



  useEffect(() => {
    $('#amount').css('border', '1px solid rgba(145, 158, 171, 0.32)')
  }, [formData.amount])

  useEffect(() => {
    $('#category').css('border', 'none')
  }, [formData.category])

  useEffect(() => {
    $('#expenseDate').css('border', '1px solid rgba(145, 158, 171, 0.32)')
  }, [expenseDate])

  useEffect(() => {
    $('#expenseFor').css('border', '1px solid rgba(145, 158, 171, 0.32)')
  }, [formData.expenseFor])


  if (isLoading) {
    return <LoadingSpinner message="Updating expense.." />
  }


  if (isListLoading) {
    return <LoadingSpinner message="Please wait.." />
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

          <div style={{ display: 'flex', gap: 20 }}>
            <div className="card" style={{ width: '40%', height: 620 }}>
              <div className="card-body">
                <div className="row">
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
                              <input className="form-check-input" type="radio" ref={shopRef} name="category" value={'Shop Related'} onChange={handleTypeChange} />
                            </div>
                            <input type="text" className="form-control" aria-label="Text input with radio button" value={'Shop Related'} />
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="input-group">
                            <div className="input-group-text">
                              <input className="form-check-input" type="radio" ref={companyRef} name="category" value={'Company'} onChange={handleTypeChange} />
                            </div>
                            <input type="text" className="form-control" aria-label="Text input with radio button" value={'Company'} />
                          </div>
                        </div>

                        <br /><br />

                        <div className="col-lg-6">

                          <div className="input-group">
                            <div className="input-group-text">
                              <input className="form-check-input" type="radio" ref={productionRef} name="category" value={'Production'} onChange={handleTypeChange} />
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
                      <Select style={{ width: '100%' }}
                          id="expenseFor"
                          className="select"
                          options={sortedOptions}
                          value={formData.expenseFor}
                          onChange={(e) => setFormData({ ...formData, expenseFor: e })}

                        />

                      </div>

                    </div>
                  </div>

                </div>


                <div className="row">
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Description</label>
                      <textarea id="description" className="form-control" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    </div>
                  </div>

                  <div className="row" style={{}}>
                    <div className="col-lg-6 col-sm-6 col-12">
                      <div className="form-group">
                        <label>Amount</label>
                        <div className="input-groupicon">
                          <input type="text"
                            id="amount"
                            value={formData?.amount}
                            onChange={(e) => {
                              if (e.target.value == '') {
                                setFormData({ ...formData, amount: '' })
                              }
                              else if (isValidNumber(e.target.value)) {
                                let amt = parseInt(e.target.value)
                                setFormData({ ...formData, amount: amt })
                              }
                            }}
                          />

                        </div>
                      </div>
                    </div>

                    <div className="col-lg-6" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button style={{ height: 50, marginTop: 30 }} className="btn btn-submit me-2" onClick={handleAddItem}>Add Expenses</button>

                    </div>
                  </div>



                </div>




              </div>
            </div>


            <div style={{ width: '60%', height: 620 }}>
              <div className="card" >
                <div className="card-body">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="row" >
                        <div className="table-responsive mb-3" style={{ height: 530, maxHeight: 530, overflow: 'auto' }}>
                          <table className="table">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Type of Expense</th>
                                <th>Category</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Action</th>

                              </tr>
                            </thead>
                            <tbody>
                              {
                                listData?.map((item, key) => {
                                  return (
                                    <tr key={item?.id}>
                                      <td>{key + 1}</td>
                                      <td>
                                        <Link to="#">{item?.expenseFor}</Link>
                                      </td>
                                      <td>{item?.category}</td>
                                      <td>{item?.description}</td>
                                      <td>{item?.amount}</td>
                                      <td>
                                        <a href="#" className="me-2">
                                          <img src={EditIcon} alt="svg" data-bs-toggle="modal" data-bs-target="#editexpense" onClick={() => handleGetSelected(item)} />
                                        </a>
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
                    </div>

                    <div className="col-lg-12" style={{ textAlign: 'right' }}>
                      <button className="btn btn-submit me-2" onClick={() => handleUpdate()}>Update</button>
                      <Link to="/tinatett-pos/expense/expenselist" className="btn btn-cancel">
                        Cancel
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

            </div>


          </div>


        </div>
      </div>


       {/* Edit Modal */}
       <div
            className="modal fade"
            id="editexpense"
            tabIndex={-1}
            aria-labelledby="editexpense"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-md modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Expense</h5>
                  <button
                    type="button"
                    className="close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12 col-sm-12 col-12">
                    <div className="form-group">
                      <label>Expense Category</label>
                      <div className="row" id="category">
                        <div className="col-lg-6">
                          <div className="input-group">
                            <div className="input-group-text">
                              <input className="form-check-input" type="radio" ref={editshopRef} name="category" value={'Shop Related'} onChange={handleEditTypeChange} />
                            </div>
                            <input type="text" className="form-control" aria-label="Text input with radio button" value={'Shop Related'} />
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="input-group">
                            <div className="input-group-text">
                              <input className="form-check-input" type="radio" ref={editcompanyRef} name="category" value={'Company'} onChange={handleEditTypeChange} />
                            </div>
                            <input type="text" className="form-control" aria-label="Text input with radio button" value={'Company'} />
                          </div>
                        </div>

                        <br /><br />

                        <div className="col-lg-6">

                          <div className="input-group">
                            <div className="input-group-text">
                              <input className="form-check-input" type="radio" ref={editproductionRef} name="category" value={'Production'} onChange={handleEditTypeChange} />
                            </div>
                            <input type="text" className="form-control" aria-label="Text input with radio button" value={'Production'} />
                          </div>

                        </div>

                        <div className="col-lg-6">
                          <div className="input-group">
                            <div className="input-group-text">
                              <input className="form-check-input" type="radio" ref={editdirectorRef} name="category" value={'Director'} onChange={handleEditTypeChange} />
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
                      <Select style={{ width: '100%' }}
                          id="expenseFor"
                          className="select"
                          options={sortedOptions}
                          value={editFormData.expenseFor}
                          onChange={(e) => setEditFormData({ ...editFormData, expenseFor: e })}

                        />
                      </div>

                    </div>
                  </div>

                </div>


                <div className="row">
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Description</label>
                      <textarea id="description" className="form-control" value={editFormData.description} onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })} />
                    </div>
                  </div>

                  <div className="row" style={{}}>
                    <div className="col-lg-12 col-sm-6 col-12">
                      <div className="form-group">
                        <label>Amount</label>
                        <div className="input-groupicon">
                          <input type="text"
                            id="amount"
                            value={editFormData?.amount}
                            onChange={(e) => {
                              if (e.target.value == '') {
                                setEditFormData({ ...editFormData, amount: '' })
                              }
                              else if (isValidNumber(e.target.value)) {
                                let amt = parseInt(e.target.value)
                                setEditFormData({ ...editFormData, amount: amt })
                              }
                            }}
                          />

                        </div>
                      </div>
                    </div>

                   
                  </div>


                </div>
                </div>
                <div className="modal-footer" style={{justifyContent:'flex-end'}}>
                  <button type="button" className="btn btn-submit" onClick={handleUpdateList}>
                    Update
                  </button>
                  <button
                    type="button"
                    className="btn btn-cancel"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
      </div>
    </>
  );
};

export default EditExpense;
