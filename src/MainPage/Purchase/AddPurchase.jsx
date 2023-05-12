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

const options2 = [
  { id: 1, text: "choose Status", text: "choose Status" },
  { id: 2, text: "Inprogess", text: "Inprogess" },
  { id: 3, text: "Completed", text: "Completed" },
];
const deleteRow = () => {
  $(document).on("click", ".delete-set", function () {
    $(this).parent().parent().hide();
  });
};
const AddPurchase = () => {
  const [purDate, setPurDate] = useState('');
  const [manDate, setManDate] = useState('');
  const [expDate, setExpDate] = useState('');


  const [productGridData, setProductGridData] = useState([])
  const [productFormData, setProductFormData] = useState({ unitPrice: 0, quantity: 0, amount: 0, batchNumber: ''})
  const [supplier, setSupplier] = useState('')
  const [purchaseDate, setPurchaseDate] = useState('')

  const [productsDropdown, setProductsDropdown] = useState([]);
  const [suppliersDropdown, setSuppliersDropdown] = useState([]);

  const { data: products, isLoading: productsIsLoading } = useGet("products", "/product");
  const { data: suppliers, isLoading: suppliersIsLoading } = useGet("suppliers", "/supplier");
  const { isLoading, data, isError, error, mutate } = usePost("/purchase");

  const productRef = useRef()

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
      title: "Batch Number",
      dataIndex: "batchNumber",
      // render: (text, record) => <p style={{textAlign:'center'}}>{text || ''}</p>
    },
    {
      title: "Manufacturing Date",
      dataIndex: "manufacturingDate",
      render: (text, record) => <p style={{textAlign:'left'}}>{record.manufacturingDate.substring(0,10) || ''}</p>
    },
    {
      title: "Expiring Date",
      dataIndex: "expireDate",
      render: (text, record) => <p style={{textAlign:'left'}}>{record.expireDate.substring(0,10) || ''}</p>
    },
    {
      title:"Action",
      render: () => (
        <>
          <Link className="delete-set" to="#" onClick={deleteRow}>
            <img src={DeleteIcon} alt="img" />
          </Link>
        </>
      ),
    },
  ];


  const handleProductSelect = (e) => {
      let p = productRef.current?.props?.data?.find((item) => item.value === e.target.value)
      if(p){
        setProductFormData({ ...productFormData, productName: p.text, productId: e.target.value })
      
      }
  }

  const handleAddItem = () => {
    if(productFormData.expireDate == '' || productFormData.manufacturingDate == '' || productFormData.batchNo == ''){
      alertify.set("notifier", "position", "top-right");
      alertify.warning("Please make sure all fields are filled.");
    }
    else{
      setProductGridData([...productGridData, productFormData])
      setProductFormData({ unitPrice: 0, quantity: 0, amount: 0, batchNumber: ''})
      setManDate('')
      setExpDate('')
    }
   
  }

  const onSubmit = (data) => {
    let user = sessionStorage.getItem('auth')
    let userOBJ = JSON.parse(user)
    let postBody = {
      supplierId:supplier,
      branchId: userOBJ.branchId,
      products: productGridData
    }

    console.log(postBody)
    mutate(postBody)
  };

  useEffect(() => {
    if (!productsIsLoading && !suppliersIsLoading) {
      let mappedProducts = products?.data.map((item) => {
        return {
          id: item?.id,
          text: item?.name,
          value: item?.id,
        }

      })
      setProductsDropdown(mappedProducts)

      let mappedSuppliers = suppliers?.data.map((item) => {
        return {
          id: item?.id,
          text: item?.name,
          value: item?.id,
        }

      })
      setSuppliersDropdown(mappedSuppliers)
    }

  }, [suppliers, products])

  useEffect(() => {
    if (!isError && data) {
      alertify.set("notifier", "position", "top-right");
      alertify.success("Purchase added successfully.");
    }
    else if(isError){
      alertify.set("notifier", "position", "top-right");
      alertify.error("Error...Could not save purchase transaction");
    }
    
    return () => {};
  }, [isError]);


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
          <div className="card">
            <div className="card-body">


              <div className="row">
                <div className="col-lg-9 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Supplier Name</label>
                    <div className="row">
                      <div className="col-lg-12 col-sm-12 col-12">
                        <Select2
                          className="select"
                          data={suppliersDropdown}
                          options={{
                            placeholder: "Supplier List",
                          }} 
                          value={supplier}
                          onChange={(e) => {
                            setSupplier( e.target.value)
                          }}
                        />
                      </div>
                    
                    </div>
                  </div>
                </div>

                <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Purchase Date </label>
                    <div className="input-groupicon">
                      <DatePicker
                        selected={purDate}
                        onChange={(e) => {
                          setPurDate(e)
                          setProductFormData({ ...productFormData, purchaseDate: new Date(e).toISOString() })
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

              <div className="row">

              
                <div className="col-lg-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Product Name (Designation)</label>
                    <Select2
                      className="select"
                      data={productsDropdown}
                      options={{
                        placeholder: "Select Product",
                      }}
                      value={productFormData?.productId}
                      ref = {productRef}
                      onChange={(e) => handleProductSelect(e)}
                    />
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Batch No.</label>
                    <input
                      type="text"
                      placeholder="Batch No."
                      value={productFormData?.batchNumber}
                      onChange={(e) => setProductFormData({ ...productFormData, batchNumber: e.target.value })} />
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6 col-12">
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
              </div>

              <div className="row">
                <div className="col-lg-3 col-sm-6 col-12">
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
                <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Quantity</label>
                    <input type="text"
                      value={productFormData?.quantity}
                      onChange={(e) => {
                        let qty = parseInt(e.target.value) || 0
                        let unitP = parseInt(productFormData.unitPrice) || 0
                        setProductFormData({ ...productFormData, quantity: e.target.value, amount: unitP * qty  })
                        }
                      } />
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Unit Price</label>
                    <input type="text"
                      value={productFormData?.unitPrice}
                      onChange={(e) => {
                        let unitP = parseInt(e.target.value) || 0
                        let qty = parseInt(productFormData.quantity) || 0
                        setProductFormData({ ...productFormData, unitPrice: e.target.value, amount: unitP * qty })
                      }
                      } />
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Amount</label>
                    <div className="input-groupicon">
                      <input
                        type="text"
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
                
                <div className="col-lg-12">
                  <div className="form-group">
                    <label>Note</label>
                    <textarea className="form-control" defaultValue={""} />
                  </div>
                </div>
                <div className="col-lg-12" style={{textAlign:'right'}}>
                  <button className="btn btn-submit me-2" type="submit" onClick={onSubmit}>Submit</button>
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

export default AddPurchase;
