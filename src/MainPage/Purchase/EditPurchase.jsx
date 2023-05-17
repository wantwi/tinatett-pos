import React, { useEffect, useRef, useState } from "react";
import {
  Calendar,
  Plus,
  Scanner,
  DeleteIcon,

} from "../../EntryFile/imagePath";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import { Table } from "antd";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { moneyInTxt } from "../../utility";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import { useGet } from "../../hooks/useGet";
import { usePut } from "../../hooks/usePut";
import alertify from "alertifyjs";
import "../../../node_modules/alertifyjs/build/css/alertify.css";
import "../../../node_modules/alertifyjs/build/css/themes/semantic.css";


const deleteRow = () => {
  $(document).on("click", ".delete-set", function () {
    $(this).parent().parent().hide();
  });
};


const EditPurchase = () => {
  const {state} = useLocation()
  console.log(state)
  const [purDate] = useState(new Date(state?.date))
  const [manDate, setManDate] = useState('');
  const [expDate, setExpDate] = useState('');
  const [purchaseId] = useState(state?.id)


  const [supplier] = useState(state?.supplierId)

  const [productsDropdown, setProductsDropdown] = useState([]);
  const [suppliersDropdown, setSuppliersDropdown] = useState([]);

  const { data: products, isLoading: productsIsLoading } = useGet("products", "/product");
  const { data: suppliers, isLoading: suppliersIsLoading } = useGet("suppliers", "/supplier");
  const { data: purchase, isLoading: purchaseIsLoading } = useGet("purchase", `/purchase/${state?.id}`);
  const { data: purchaseDetails, isLoading: purchaseIsLoadingDetails } = useGet("purchase-details", `/purchase/products/${state?.id}`);
  const { isLoading, data, isError, error, mutate } = usePut(`/purchase/${purchaseId}`); 


  const [productFormData, setProductFormData] = useState({ unitPrice: 0, quantity: 0, amount: 0, manufacturingDate:'', expireDate:''})
  const [productList, setProductList] = useState([])

  const productRef = useRef()

  const handleProductSelect = (e) => {
    let p = productRef.current?.props?.data?.find((item) => item.value === e.target.value)
    if(p){
      setProductFormData({ ...productFormData, productName: p.text, productId: e.target.value })
    
    }
  }

  const handleAddItem = () => {
    
    console.log(productFormData)
    if(productFormData.expireDate == '' || productFormData.manufacturingDate == ''){
      alertify.set("notifier", "position", "top-right");
      alertify.warning("Please make sure all fields are filled.");
    }
    else{
      setProductList([...productList, productFormData])
      setProductFormData({ unitPrice: 0, quantity: 0, amount: 0})
      setManDate('')
      setExpDate('')
    }
   
  }

  const onSubmit = () => {
    let postBody = {
      supplierId:supplier,
      purchaseDate: new Date(purDate).toISOString(),
      products: productList
    }

    console.log(postBody)
    mutate(postBody)
  };

  useEffect(() => {
    let mappedData = purchaseDetails?.data.map((item) =>{
      return {
        ...item,
        productName: item?.product?.name,
        quantity: item?.initialquantity
      }
    })
    setProductList(mappedData)
    console.log("Details:", purchaseDetails?.data)
  }, [purchaseDetails])

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
      alertify.success("Purchase updated successfully.");
      setTimeout(() => {
        history.push('/dream-pos/purchase/purchaselist')
      })
    }
    else if(isError){
      alertify.set("notifier", "position", "top-right");
      alertify.warning("Failed to update");
    }
    return () => {};
  }, [isError, data]);


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
            {record?.productName}
          </Link>
        </div>
      ),
    },
    {
      title: "QTY",
      dataIndex: "quantity",
      render: (text, record) => <p style={{textAlign:'center'}}>{(record.quantity) || 0}</p>
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
    // {
    //   title: "Batch Number",
    //   dataIndex: "batchNumber",
    //   // render: (text, record) => <p style={{textAlign:'center'}}>{text || ''}</p>
    // },
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

  if(purchaseIsLoading){
    return <LoadingSpinner/>
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Purchase </h4>
              <h6>Update Purchase</h6>
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
                          
                          {/* <input type="text" value={purchase?.supplierName}/> */}
                            <Select2
                              className="select"
                              data={suppliersDropdown}
                              value={state?.supplierId}      
                              disabled      
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
                           disabled
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

                        <div className="col-lg-6 col-sm-6 col-12">
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

                        <div className="col-lg-6 col-sm-6 col-12">
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
                    </div>
              </div>
            </div>

            <div className="card"  style={{width: '70%'}}>
              <div className="card-body">
                <div className="row">
                  <div className="table-responsive">
                    <Table
                      columns={columns}
                      dataSource={productList}
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
                            productList?.reduce((total, item) => total + item.amount, 0)
                          )}</h5>
                        </li>
                      </ul>
                    </div>
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
                          placeholder: "Category",
                        }}
                      />
                    </div>
                  </div> */}
                  
                  <div className="col-lg-12" style={{textAlign:'right'}}>
                    <button className="btn btn-submit me-2" type="submit" onClick={onSubmit}>Update</button>
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

export default EditPurchase;
