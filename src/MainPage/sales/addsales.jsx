import React, { useState } from "react";
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
const Addsales = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('cash')
  const [disabledUnselectedPrice,setDisableUnselectedPrice] = useState({retail: false, wholesale:false, special:false})

  const options = [
    { id: 1, text: "Choose", text: "Choose" },
    { id: 2, text: "Costumer Name", text: "Costumer Name" },
  ];
  const options1 = [
    { id: 1, text: "Choose", text: "Choose" },
    { id: 2, text: "Supplier Name", text: "Supplier Name" },
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
            <h4>Add Sale</h4>
            <h6>Add your new sale</h6>
          </div>
        </div>

      <div style={{display:'flex', gap:20}}>
        <div className="card" style={{width: '50%'}}>
          <div className="card-body">
            <div className="row">
             
                <div className="col-6">
                  <div className="form-group">
                    <label>Customer</label>
                    <div className="row">
                      <div className="col-lg-12 col-sm-10 col-10">
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

                <div className="col-6">
                  <div className="form-group">
                    <label>Date</label>
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
          
                <div className="col-6">
                  <div className="form-group">
                    <label>Product Name</label>
                    <div className="input-groupicon">
                      <input
                        type="text"
                        placeholder="Please type product code and select..."
                      />
                      
                    </div>
                  </div>
                </div>

                <div className="col-3">
                  <div className="form-group">
                    <label>Quantity Left</label>
                    <div className="input-groupicon">
                      <input
                        className="form-control"
                        type="number"
                      />
                      
                    </div>
                  </div>
                </div>

                <div className="col-3">
                  <div className="form-group">
                    <label>Batch No.</label>
                    <div className="input-groupicon">
                      <input
                        type="text"
                        placeholder=""
                      />
                      
                    </div>
                  </div>
                </div>

                <div className="col-6">
                  <div className="form-group">
                    <label>Manufacturing Date</label>
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

                <div className="col-6">
                  <div className="form-group">
                    <label>Exp. Date</label>
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

                <div className="col-12">
                  <div className="form-group">
                    <label>Unit Price</label>
                    <div className="row">
                        

                          <div className="col-lg-4">

                            <div className="input-group">
                              <div className="input-group-text">
                                <input className="form-check-input" type="radio" name="priceType" onChange={() => setDisableUnselectedPrice({retail:false, wholesale:true, special:true})}/>
                              </div>
                              <input type="text" className="form-control" aria-label="Text input with radio button"  placeholder="Retail" disabled={disabledUnselectedPrice.retail}/>
                            </div>
                          
                          </div>

                          <div className="col-lg-4">
                            <div className="input-group">
                              <div className="input-group-text">
                                <input className="form-check-input" type="radio" name="priceType" value="Wholesale Price" onChange={() => setDisableUnselectedPrice({wholesale:false, retail:true, special:true})} />
                              </div>
                              <input type="text" className="form-control" aria-label="Text input with radio button" placeholder={'Wholesale'} disabled={disabledUnselectedPrice.wholesale}/>
                            </div>
                        </div>

                          <div className="col-lg-4">

                            <div className="input-group">
                              <div className="input-group-text">
                                <input className="form-check-input" type="radio" name="priceType" value="Special Price" onChange={() => setDisableUnselectedPrice({special:false, wholesale:true, retail:true})}/>
                              </div>
                              <input type="text" className="form-control" aria-label="Text input with radio button" placeholder={'Special'} disabled={disabledUnselectedPrice.special} />
                            </div>
                          
                          </div>
                      </div>
                  </div>
                </div>

                <div className="col-6">
                  <div className="form-group">
                    <label>Quantity</label>
                    <div className="input-groupicon">
                      <input
                       className="form-control"
                        type="number"
                        placeholder=""
                      />
                      
                    </div>
                  </div>
                </div>
             
                <div className="col-6">
                  <div className="form-group">
                    <label>Amount</label>
                    <div className="input-groupicon">
                      <input
                        className="form-control"
                        type="number"
                      />
                      
                    </div>
                  </div>
                </div>

                <div className="payment-div" style={{border: '1px solid #e3e3e3', paddingTop:20}}>
                  <ul className="nav nav-tabs">
                      <li className="nav-item" onClick={()=>setActiveTab('cash')}>
                        <a className={activeTab == 'cash' ? `nav-link active`: `nav-link`} href="#">Cash</a>
                      </li>

                      <li className="nav-item" onClick={()=>setActiveTab('cheque')}>
                        <a className={activeTab == 'cheque' ? `nav-link active`: `nav-link`} href="#">Cheque</a>
                      </li>

                      <li className="nav-item" onClick={()=>setActiveTab('momo')}>
                        <a className={activeTab == 'momo' ? `nav-link active`: `nav-link`} href="#">Mobile Money</a>
                      </li>
                      
                  </ul>

                  {activeTab == 'cash' ? <div id="cash-tab" style={{marginTop:20}}>
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group">
                        <label>Waybill</label>
                        <div className="input-groupicon">
                          <input
                            type="text"
                            placeholder=""
                          />
                          
                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="form-group">
                        <label>Amount </label>
                        <div className="input-groupicon">
                          <input
                            type="text"
                            placeholder=""
                          />
                          
                        </div>
                      </div>
                    </div>
                  </div>
                </div> : null}
                {activeTab == 'cheque' ? <div id="cheque-tab" style={{marginTop:20}}>
                  <div className="row">
                    <div className="col-6">
                        <div className="form-group">
                          <label>Cheque No</label>
                          <div className="input-groupicon">
                            <input
                              type="text"
                              placeholder=""
                            />
                            
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="form-group">
                          <label>Amount</label>
                          <div className="input-groupicon">
                            <input
                              type="text"
                              placeholder=""
                            />
                            
                          </div>
                        </div>
                      </div>
                  </div>
                   
                </div> : null}
                {activeTab == 'momo' ? <div id="momo-tab" style={{marginTop:20}}>
                  <div className="row">
                  <div className="col-6">
                      <div className="form-group">
                        <label>Momo number</label>
                        <div className="input-groupicon">
                          <input
                            type="text"
                            placeholder=""
                          />
                          
                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="form-group">
                        <label>Amount</label>
                        <div className="input-groupicon">
                          <input
                            type="text"
                            placeholder=""
                          />
                          
                        </div>
                      </div>
                    </div>
                  </div>
                   
                </div> :null}
                </div>

                <div className="col-6 mt-3">
                  <div className="form-group">
                    <label>Balance</label>
                    <div className="input-groupicon">
                      <input
                        className="form-control"
                        type="number"
                      />
                      
                    </div>
                  </div>
                </div>

               
                

                

              
              
            </div>
          </div>
        </div>

        <div className="card" style={{width: '50%'}}>
          <div className="card-body">
              <div className="row">
                <div className="col-lg-12">
                <div className="row" style={{height:550, maxHeight:550, overflow:'auto'}}>
                <div className="table-responsive mb-3">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Product Name</th>
                        <th>QTY</th>
                        <th>Price</th>
                        <th>Discount</th>
                        <th>Tax</th>
                        <th>Subtotal</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
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
                     
                    </tbody>
                  </table>
                </div>
              </div>
                </div>



              </div>       
            
              <div className="row">
                <div className="col-lg-6 ">
                  <div className="total-order w-100 max-widthauto m-auto mb-4">
                    <ul>
                      {/* <li>
                        <h4>Order Tax</h4>
                        <h5>$ 0.00 (0.00%)</h5>
                      </li>
                      <li>
                        <h4>Discount </h4>
                        <h5>$ 0.00</h5>
                      </li> */}
                    </ul>
                  </div>
                </div>
                <div className="col-lg-6 ">
                  <div className="total-order w-100 max-widthauto m-auto mb-4">
                    <ul>
                      <li>
                        <h4>Shipping</h4>
                        <h5>$ 0.00</h5>
                      </li>
                      <li className="total">
                        <h4>Grand Total</h4>
                        <h5>$ 0.00</h5>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-12" style={{textAlign:'right'}}>
                  <Link to="#" className="btn btn-submit me-2">
                    Invoice
                  </Link>
                  <Link to="#" className="btn btn-cancel me-2">
                    No Invoice
                  </Link>
                  <Link to="#" className="btn btn-submit me-2">
                    Credit
                  </Link>
                  <Link to="#" className="btn btn-cancel">
                    Suspend
                  </Link>
                  
                </div>
              </div>
               
            </div>
        </div>
      </div>
        
        </div>
      </div>
  
  );
};

export default Addsales;
