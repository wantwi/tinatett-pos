import React,{useState} from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Plus,
  Scanner,
  Product7,
  DeleteIcon,
  Calendar,
  Product8,
  Product1,
} from "../../EntryFile/imagePath";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import { useEffect } from "react";
const AddProforma = () => {
  const [startDate, setStartDate] = useState(new Date());
  const options = [
    { id: 1, text: "Choose", text: "Choose" },
    { id: 2, text: "Costumer Name", text: "Costumer Name" },
  ];
  const options1 = [
    { id: 1, text: "Choose", text: "Choose" },
    { id: 2, text: "Unit Price", text: "Unit Price" },
    { id: 2, text: "Retail Price", text: "Retail Price" },
    { id: 2, text: "Wholesale Price", text: "Wholesale Price" },
    { id: 2, text: "Special Price", text: "Special Price" },
  ];
  const options2 = [
    { id: 1, text: "Completed", text: "Completed" },
    { id: 2, text: "Inprogess", text: "Inprogess" },
  ];

  useEffect(() => {
    $(document).on("click", ".delete-set", function () {
      $(this).parent().parent().hide();
    });
  });

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Add Proforma</h4>
            <h6>Add your new proforma</h6>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-8 col-sm-6 col-12">
                <div className="form-group">
                  <label>Customer Name</label>
                  <div className="row">
                    <div className="col-lg-12 col-sm-12 col-12">
                      <Select2
                        className="select"
                        data={options}
                        options={{
                          placeholder: "Choose",
                        }}
                      />
                    </div>
                    
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-sm-6 col-12">
                <div className="form-group">
                  <label> Date</label>
                  <div className="input-groupicon">
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                    />
                    <Link className="addonset">
                      <img src={Calendar} alt="img" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-sm-6 col-12">
                <div className="form-group">
                  <label>Product Name (Designation)</label>
                  <Select2
                    className="select"
                    data={options1}
                    options={{
                      placeholder: "Choose Product",
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-4 col-sm-6 col-12">
                <div className="form-group">
                  <label>Quantity</label>
                  <div className="input-groupicon">
                    <input
                      type="text"
                      placeholder="Please type quantity..."
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-sm-6 col-12">
                <div className="form-group">
                  <label>Amount</label>
                  <div className="input-groupicon">
                    <input
                      type="text"
                      placeholder="Please type amount..."
                    />
                   
                  </div>
                </div>
              </div>
              <div className="col-lg-8 col-sm-12 col-12">
                <div className="form-group">
                  <label>Price Type</label>
                  <div className="row">
                        <div class="col-lg-3">
                          <div class="input-group">
                            <div class="input-group-text">
                              <input className="form-check-input" type="radio" name="customerType" value="Unit Price" />
                            </div>
                            <input type="text" className="form-control" aria-label="Text input with radio button" value={'Unit Price'}/>
                          </div>
                       </div>

                        <div class="col-lg-3">

                          <div class="input-group">
                            <div class="input-group-text">
                              <input className="form-check-input" type="radio" name="customerType" value="Retail Price"/>
                            </div>
                            <input type="text" className="form-control" aria-label="Text input with radio button" value={'Retail Price'} />
                          </div>
                        
                        </div>

                        <div class="col-lg-3">
                          <div class="input-group">
                            <div class="input-group-text">
                              <input className="form-check-input" type="radio" name="customerType" value="Wholesale Price" />
                            </div>
                            <input type="text" className="form-control" aria-label="Text input with radio button" value={'Wholesale Price'}/>
                          </div>
                       </div>

                        <div class="col-lg-3">

                          <div class="input-group">
                            <div class="input-group-text">
                              <input className="form-check-input" type="radio" name="customerType" value="Special Price"/>
                            </div>
                            <input type="text" className="form-control" aria-label="Text input with radio button" value={'Special Price'} />
                          </div>
                        
                        </div>
                    </div>
                  {/* <Select2
                    className="select"
                    data={options1}
                    options={{
                      placeholder: "Choose Type",
                    }}
                  /> */}
                </div>
              </div>
              
              <div className="col-lg-12 col-sm-6 col-12">
                <div className="form-group">
                  <Link to="#" className="btn btn-submit me-2">
                    Add
                  </Link>
                  <Link to="#" className="btn btn-cancel">
                    Clear
                  </Link>
                </div>
                
              </div>
              
            </div>
            <div className="row">
              <div className="table-responsive mb-3">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Product Name</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Amount</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {/* <tr>
                      <td>1</td>
                      <td className="productimgname">
                        <Link className="product-img">
                          <img src={Product7} alt="product" />
                        </Link>
                        <Link to="#">Apple Earpods</Link>
                      </td>
                      <td>1.00</td>
                      <td>15000.00</td>
                      <td>0.00</td>
                      <td>0.00</td>
                      <td>1500.00</td>
                      <td>
                        <Link to="#" className="delete-set">
                          <img src={DeleteIcon} alt="svg" />
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td className="productimgname">
                        <Link className="product-img">
                          <img src={Product8} alt="product" />
                        </Link>
                        <Link to="#">iPhone 11</Link>
                      </td>
                      <td>1.00</td>
                      <td>1500.00</td>
                      <td>0.00</td>
                      <td>0.00</td>
                      <td>1500.00</td>
                      <td>
                        <Link to="#" className="delete-set">
                          <img src={DeleteIcon} alt="svg" />
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td className="productimgname">
                        <Link className="product-img">
                          <img src={Product1} alt="product" />
                        </Link>
                        <Link to="#">Macbook pro</Link>
                      </td>
                      <td>1.00</td>
                      <td>1500.00</td>
                      <td>0.00</td>
                      <td>0.00</td>
                      <td>1500.00</td>
                      <td>
                        <Link to="#" className="delete-set">
                          <img src={DeleteIcon} alt="svg" />
                        </Link>
                      </td>
                    </tr> */}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="row">
              {/* <div className="col-lg-3 col-sm-6 col-12">
                <div className="form-group">
                  <label>Order Tax</label>
                  <input type="text" />
                </div>
              </div>
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="form-group">
                  <label>Discount</label>
                  <input type="text" />
                </div>
              </div>
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="form-group">
                  <label>Shipping</label>
                  <input type="text" />
                </div>
              </div>
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="form-group">
                  <label>Status</label>
                  <Select2
                    className="select"
                    data={options2}
                    options={{
                      placeholder: "Choose Status",
                    }}
                  />
                </div>
              </div> */}
              <div className="row">
                <div className="col-lg-6 ">
                  <div className="total-order w-100 max-widthauto m-auto mb-4">
                    {/* <ul>
                      <li>
                        <h4>Order Tax</h4>
                        <h5>$ 0.00 (0.00%)</h5>
                      </li>
                      <li>
                        <h4>Discount </h4>
                        <h5>$ 0.00</h5>
                      </li>
                    </ul> */}
                  </div>
                </div>
                <div className="col-lg-6 ">
                  <div className="total-order w-100 max-widthauto m-auto mb-4">
                    <ul>
                      
                      <li className="total">
                        <h4>Grand Total</h4>
                        <h5>GHS 0.00</h5>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-12" style={{textAlign:'right'}}>
                <Link to="#" className="btn btn-submit me-2">
                  Proforma
                </Link>
                {/* <Link to="#" className="btn btn-cancel me-2" style={{backgroundColor:'#FF9F43'}}>
                  Refresh
                </Link> */}
                <Link to="#" className="btn btn-cancel">
                  Delete
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProforma;
