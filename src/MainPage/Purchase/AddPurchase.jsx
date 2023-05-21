import React, { useEffect, useRef, useState } from "react";
import {
  Calendar,
  Plus,
  Scanner,
  DeleteIcon,
  EditIcon,
  MacbookIcon,
  EarpodIcon,
} from "../../EntryFile/imagePath";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select2 from "react-select2-wrapper";
import Select from "react-select";
import "react-select2-wrapper/css/select2.css";
import { Table } from "antd";
import { useGet } from "../../hooks/useGet";
import { moneyInTxt } from "../../utility";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import alertify from "alertifyjs";
import "../../../node_modules/alertifyjs/build/css/alertify.css";
import "../../../node_modules/alertifyjs/build/css/themes/semantic.css";
import { usePost } from "../../hooks/usePost";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";

const options2 = [
  { id: 1, text: "choose Status", text: "choose Status" },
  { id: 2, text: "Inprogess", text: "Inprogess" },
  { id: 3, text: "Completed", text: "Completed" },
];

const AddPurchase = () => {
  const [purDate, setPurDate] = useState(new Date());
  const [manDate, setManDate] = useState('');
  const [expDate, setExpDate] = useState('');


  const [productGridData, setProductGridData] = useState([])
  const [productFormData, setProductFormData] = useState({ unitPrice: 0, quantity: 1, amount: 0, manufacturingDate:'', expireDate:''})
  const [supplier, setSupplier] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('')

  const [productsDropdown, setProductsDropdown] = useState([]);
  const [suppliersDropdown, setSuppliersDropdown] = useState([]);

  const { data: products, isLoading: productsIsLoading } = useGet("products", "/product");
  const { data: suppliers, isLoading: suppliersIsLoading } = useGet("suppliers", "/supplier");
  const { isLoading, data, isError, error, mutate } = usePost("/purchase");
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false)


  const deleteRow = (record) => {
    // console.log(record)
    // console.log(productGridData)
    let newGridData = productGridData.filter((item) => item.productId !== record.productId)
    //console.log(newGridData)
    setProductGridData(newGridData)
  };


  useEffect(() => {
    setProductFormData({...productFormData, amount: productFormData.quantity * productFormData.unitPrice})
  }, [productFormData.quantity, productFormData.unitPrice])

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      render: (text, record) => (
        <div className="productimgname">
          <Link className="product-img">
            <img alt="" src={record.image} />
          </Link>
          <Link style={{ fontSize: "15px", marginLeft: "10px" }}>
            {record.productName}
          </Link>
        </div>
      ),
    },
    {
      title: "QTY",
      dataIndex: "quantity",
      // render: (text, record) => <p style={{textAlign:'center'}}>{text || 0}</p>
    },
    {
      title: "Unit Price(GHS)",
      dataIndex: "unitPrice",
      //render: (text, record) => <p style={{textAlign:'left'}}>{text || 0}</p>
    },
    {
      title: "Amount(GHS)",
      dataIndex: "amount",
      // render: (text, record) => <p style={{textAlign:'center'}}>{text || 0}</p>
    },
    {
      title: "Manufacturing Date",
      dataIndex: "manufacturingDate",
      render: (text, record) => <p key={text} style={{textAlign:'left'}}>{record?.manufacturingDate.substring(0,10) || ''}</p>
    },
    {
      title: "Expiring Date",
      dataIndex: "expireDate",
      render: (text, record) => <p key={text} style={{textAlign:'left'}}>{record?.expireDate.substring(0,10) || ''}</p>
    },
    {
      title:"Action",
      render: (text, record) => (
        <>
          <Link className="delete-set" to="#" onClick={() => deleteRow(record)}>
            <img src={DeleteIcon} alt="img" />
          </Link>
        </>
      ),
    },
  ];


  const handleProductSelect = (e) => {
      console.log(e)
      setSelectedProduct(e)
      setProductFormData({ ...productFormData, productName: e.label, productId: e.value })
  }

  const handleAddItem = () => {
    //console.log(productFormData)
    if(productFormData.expireDate == '' || productFormData.manufacturingDate == '' || purDate == '' || selectedProduct == '' || supplier == ''){
      alertify.set("notifier", "position", "top-right");
      alertify.warning("Please make sure all fields are filled.");
    }
    else{
      setProductGridData([...productGridData, productFormData])
      setProductFormData({ unitPrice: 0, quantity: 0, amount: 0})
      setManDate('')
      setExpDate('')
      setSelectedProduct('')
    }
   
  }

  const onSubmit = (data) => {
    let postBody = {
      supplierId:supplier.id,
      purchaseDate: new Date(purDate).toISOString(),
      products: productGridData
    }

    //console.log(postBody)
    mutate(postBody)
    setManDate('')
    setExpDate('')
    setPurDate('')
    setSelectedProduct('')
    setSupplier('')
    setProductGridData([])
    setIsSubmitSuccessful(true)
  };

  useEffect(() => {
    if (!productsIsLoading && !suppliersIsLoading) {
      let mappedProducts = products?.data.map((item) => {
        return {
          id: item?.id,
          label: item?.name,
          value: item?.id,
          retailPrice: item?.retailPrice,
          wholeSalePrice : item?.wholeSalePrice,
          specialPrice: item?.wholeSalePrice
        }

      })
      setProductsDropdown(mappedProducts)

      let mappedSuppliers = suppliers?.data.map((item) => {
        return {
          id: item?.id,
          label: item?.name,
          value: item?.id,
        }

      })
      setSuppliersDropdown(mappedSuppliers)
    }

  }, [suppliers, products])

  useEffect(() => {
    if (!isError &&  isSubmitSuccessful) {
      alertify.set("notifier", "position", "top-right");
      alertify.success("Purchase added successfully.");
    }
    else if(isError){
      alertify.set("notifier", "position", "top-right");
      alertify.error("Error...Could not save purchase transaction");
    }
    
    return () => {};
  }, [isError, !isSubmitSuccessful]);

  if(isLoading){
    <LoadingSpinner/>
  }


  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>New Purchase</h4>
              <h6>Add Purchase</h6>
            </div>
          </div>

            <div style={{display:'flex', gap:20}}>
            <div  style={{width: '30%'}}>
              <div className="card">
                <div className="card-body">


                  <div className="row">
                    <div className="col-lg-7 col-sm-6 col-12">
                      <div className="form-group">
                        <label>Supplier Name</label>
                        <div className="row">
                          <div className="col-lg-12 col-sm-12 col-12">
                            <Select
                              className="select"
                              options={suppliersDropdown}
                              value={supplier}
                              isLoading={suppliersIsLoading}
                              //onChange={(e) => handleSupplierSelect(e)}
                              onChange={(e) => {
                                console.log(e)
                                setSupplier(e)
                              }}
                            />
                          </div>
                        
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-5 col-sm-6 col-12">
                      <div className="form-group">
                        <label>Purchase Date </label>
                        <div className="input-groupicon">
                          <DatePicker
                            selected={purDate}
                            onChange={(e) => {
                              setPurDate(e)
                              // setProductFormData({ ...productFormData, purchaseDate: new Date(e).toISOString() })
                            }
                            }
                          />
                          <div className="addonset">
                            <img src={Calendar} alt="img" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>


                <div className="card">
                  <div className="card-body">

                      <div className="row">

                      
                        <div className="col-lg-12 col-sm-6 col-12">
                          <div className="form-group">
                            <label>Product Name (Designation)</label>
                            <Select
                              className="select"
                              options={productsDropdown}
                              value={selectedProduct}
                              isLoading={productsIsLoading}
                              onChange={(e) => handleProductSelect(e)}
                            />
                          </div>
                        </div>
                        
                        <div className="col-lg-6 col-sm-6 col-12">
                          <div className="form-group">
                            <label>Manufacturing Date </label>
                            <div className="input-groupicon">
                              <DatePicker
                                selected={manDate}
                                //value={product?.manufacturingDate}
                                onChange={(e) => {
                                  setManDate(e)
                                  setProductFormData({ ...productFormData, manufacturingDate: new Date(e).toISOString() })
                                }}
                              />
                              <div className="addonset">
                                <img src={Calendar} alt="img" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-6 col-sm-6 col-12">
                          <div className="form-group">
                            <label>Expiring Date </label>
                            <div className="input-groupicon">
                              <DatePicker
                                selected={expDate}
                                onChange={(e) => {
                                  setExpDate(e)
                                  setProductFormData({ ...productFormData, expireDate: new Date(e).toISOString() })
                                }}
                              />
                              <div className="addonset">
                                <img src={Calendar} alt="img" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                  
                      <div className="row">
                        <div className="col-lg-6 col-sm-6 col-12">
                          <div className="form-group">
                            <label>Quantity</label>
                            <input type="number"  className={`form-control `}
                              value={productFormData?.quantity}
                              onChange={(e) => {
                                let qty = parseInt(e.target.value) || 0
                                let unitP = parseInt(productFormData.unitPrice) || 0
                                setProductFormData({ ...productFormData, quantity: e.target.value, amount: unitP * qty  })
                                }
                              } />
                          </div>
                        </div>

                        <div className="col-lg-6 col-sm-6 col-12">
                          <div className="form-group">
                            <label>Unit Price</label>
                            <input type="number" className={`form-control `}
                              step={0.01}
                              value={productFormData?.unitPrice}
                              onChange={(e) => {
                                let unitP = parseInt(e.target.value) || 0
                                let qty = parseInt(productFormData.quantity) || 0
                                setProductFormData({ ...productFormData, unitPrice: e.target.value, amount: unitP * qty })
                              }
                              } />
                          </div>
                        </div>

                        <div className="col-lg-6 col-sm-6 col-12">
                          <div className="form-group">
                            <label>Amount</label>
                            <div className="input-groupicon">
                              <input
                                type="number" className={`form-control `}
                                step={0.01}
                                placeholder=""
                                value={productFormData?.amount}
                                disabled
                              />

                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row" style={{textAlign:'right'}}>
                        <div className="col-lg-12 col-sm-6 col-12">
                          <div className="form-group">
                            <Link to="#" className="btn btn-submit me-2" onClick={handleAddItem}>
                              Add to List
                            </Link>
                            <Link to="#" className="btn btn-cancel">
                              Clear
                            </Link>
                          </div>

                        </div>
                      </div>
                    </div>
                </div>
              </div>
             


              <div className="card" style={{width:'70%'}}>
                <div className="card-body">
                  <div className="row">
                    <div className="table-responsive">
                      <Table
                        columns={columns}
                        dataSource={productGridData}
                        pagination={false}
                      />
                    </div>
                  </div>
                

                  <div className="row" >
                    <div className="col-lg-12 float-md-right">
                      <div className="total-order">
                        <ul>
                          {/* <li>
                            <h4>Order Tax</h4>
                            <h5>$ 0.00 (0.00%)</h5>
                          </li> */}
                          <li>
                            <h4>Discount </h4>
                            <h5>GHS 0.00</h5>
                          </li>

                          <li className="total">
                            <h4>Grand Total</h4>
                            <h5>GHS {moneyInTxt(
                              productGridData.reduce((total, item) => total + item.amount, 0)
                            )}</h5>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    
                    
                    <div className="col-lg-12" style={{textAlign:'right'}}>
                      <button className="btn btn-submit me-2" type="submit" onClick={onSubmit}>Submit</button>
                      <button className="btn btn-cancel">Cancel</button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          </div>
         
    </>
  );
};

export default AddPurchase;
