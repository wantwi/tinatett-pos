import React, { useEffect, useRef, useState } from "react";
import {
  Calendar,
  Plus,
  Scanner,
  DeleteIcon,
  EditIcon,

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
import Select from "react-select";

const deleteRow = () => {
  $(document).on("click", ".delete-set", function () {
    $(this).parent().parent().hide();
  });
};


const EditPurchase = () => {
  const {state} = useLocation()
  //console.log("State", state)
  const [manDate, setManDate] = useState('');
  const [expDate, setExpDate] = useState('');
  const [purchaseId] = useState(state?.id)




  const [productsDropdown, setProductsDropdown] = useState([]);
  const [suppliersDropdown, setSuppliersDropdown] = useState([]);

  const { data: products, isLoading: productsIsLoading } = useGet("products", "/product");
  const { data: suppliers, isLoading: suppliersIsLoading } = useGet("suppliers", "/supplier");
  const { data: purchase, isLoading: purchaseIsLoading } = useGet("purchase", `/purchase/${state?.id}`);
  const [purDate] = useState(state?.date)
  const [supplier] = useState(purchase?.supplierId)
  const [selectedProduct, setSelectedProduct] = useState('')
  const { data: purchaseDetails, isLoading: purchaseIsLoadingDetails } = useGet("purchase-details", `/purchase/products/${state?.id}`);
  const { isLoading, data, isError, error, mutate } = usePut(`/purchase/${purchaseId}`); 


  const [productFormData, setProductFormData] = useState({ id:'', unitPrice: '', quantity: '', amount: '', manufacturingDate:'', expireDate:''})
  const [productList, setProductList] = useState([])

  const productRef = useRef()

  const handleProductSelect = (e) => {
    // console.log(e)
    setSelectedProduct(e)
    setProductFormData({ ...productFormData, productName: e.label, productId: e.value })
}

  const handleAddItem = () => {
    if(productFormData.expireDate == '' || productFormData.manufacturingDate == '' || manDate == '' || expDate == '' || productFormData.quantity == '' || productFormData.unitPrice == ''){
      alertify.set("notifier", "position", "top-right");
      alertify.warning("Please make sure all fields are filled.");
    }
    else{
      
      let newList = [...productList]
      //console.log("new List", newList)
      let index = newList.findIndex((item) => item.id == productFormData.id)
      if(index != -1){
        newList[index] = productFormData
        setProductList(newList)
      }
      else{
        setProductList([...productList, productFormData])
      }
     
     
      setSelectedProduct('')
      setProductFormData({ unitPrice: '', quantity: '', amount: '', manufacturingDate:'', expireDate:''}) 
      setManDate('')
      setExpDate('')
    }
   
  }

  const handleEdit = (record) => {
    console.log("Record:", record)
    setProductFormData({
      id: record?.id,
      productId: record.productId,
      unitPrice: record.unitPrice,
      quantity:record.quantity,
      amount: record.quantity * record.unitPrice,
      manufacturingDate: record?.manufacturingDate,
      expireDate: record?.expireDate,
      batchNumber: record?.batchNumber
    })
    setExpDate(new Date(record?.expireDate))
    setManDate(new Date(record?.manufacturingDate))
  }

  const onSubmit = () => {
    let postBody = {
      supplierId:state?.supplierId,
      purchaseDate: new Date(purDate).toISOString(),
      products: productList.map((item) => {
        return {
          id: item?.id,
          productName: item?.productName,
          productId: item?.productId,
          unitPrice: item?.unitPrice,
          quantity: item?.quantity,
          amount: item?.amount,
          manufacturingDate: item?.manufacturingDate,
          expireDate: item?.expireDate,
          batchNumber: item?.batchNumber || ''

        }
      })
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
      render: (text, record) => <p style={{textAlign:'right'}}>{moneyInTxt(text)}</p>
    },
    {
      title: "Amount(GHS)",
      dataIndex: "amount",
      render: (text, record) => <p style={{textAlign:'right'}}>{moneyInTxt(text)}</p>
    },
    // {
    //   title: "Batch Number",
    //   dataIndex: "batchNumber",
    //   // render: (text, record) => <p style={{textAlign:'center'}}>{text || ''}</p>
    // },
    {
      title: "Manufacturing Date",
      dataIndex: "manufacturingDate",
      render: (text, record) => <p style={{textAlign:'center'}}>{record.manufacturingDate.substring(0,10) || ''}</p>
    },
    {
      title: "Expiring Date",
      dataIndex: "expireDate",
      render: (text, record) => <p style={{textAlign:'center'}}>{record.expireDate.substring(0,10) || ''}</p>
    },
    {
      title:"Action",
      render: (text, record) => (
        <>
         <span className="me-3" to="#" onClick={() => handleEdit(record)} style={{cursor:'pointer'}}>
            <img src={EditIcon} alt="img" />
          </span>
          <span className="delete-set" to="#" onClick={deleteRow} style={{cursor:'pointer'}}>
            <img src={DeleteIcon} alt="img" />
          </span>
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
                        <input type="date" className="form-control" value={purDate} disabled/>
                          {/* <DatePicker
                           selected={purDate}
                           disabled
                          />
                          <div className="addonset">
                            <img src={Calendar} alt="img" />
                          </div> */}
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
                              isLoading={productsIsLoading}
                              value={selectedProduct}
                              onChange={(e) => handleProductSelect(e)}
                            />
                            {/* <Select2
                              className="select"
                              data={productsDropdown}
                              options={{
                                placeholder: "Select Product",
                              }}
                              value={productFormData?.productId}
                              ref = {productRef}
                              onChange={(e) => handleProductSelect(e)}
                            /> */}
                          </div>
                        </div>
                        
                        <div className="col-lg-6 col-sm-6 col-12">
                          <div className="form-group">
                            <label>Manufacturing Date </label>
                            <div className="input-groupicon">
                            <input type="date" className="form-control" value={manDate} onChange={(e) => {
                                  setManDate(e.target.value)
                                  setProductFormData({ ...productFormData, manufacturingDate: e.target.value })
                                }}/>
                              {/* <DatePicker
                                selected={manDate}
                                //value={product?.manufacturingDate}
                                onChange={(e) => {
                                  setManDate(e)
                                  setProductFormData({ ...productFormData, manufacturingDate: new Date(e).toISOString() })
                                }}
                              />
                              <div className="addonset">
                                <img src={Calendar} alt="img" />
                              </div> */}
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-6 col-sm-6 col-12">
                          <div className="form-group">
                            <label>Expiring Date </label>
                            <div className="input-groupicon">
                            <input type="date" className="form-control" value={expDate} onChange={(e) => {
                                  setExpDate(e.target.value)
                                  setProductFormData({ ...productFormData, expireDate: e.target.value })
                                }}/>
                              {/* <DatePicker
                                selected={expDate}
                                onChange={(e) => {
                                  setExpDate(e)
                                  setProductFormData({ ...productFormData, expireDate: new Date(e).toISOString() })
                                }}
                              />
                              <div className="addonset">
                                <img src={Calendar} alt="img" />
                              </div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                  
                      <div className="row">
                        <div className="col-lg-6 col-sm-6 col-12">
                          <div className="form-group">
                            <label>Quantity</label>
                            <input type="text" className={`form-control `}
                              value={productFormData?.quantity}
                              onChange={(e) => {
                                let qty = (e.target.value) 
                                let unitP = (productFormData.unitPrice)
                                setProductFormData({ ...productFormData, quantity: e.target.value, amount: unitP * qty  })
                                }
                              } />
                          </div>
                        </div>

                        <div className="col-lg-6 col-sm-6 col-12">
                          <div className="form-group">
                            <label>Unit Price</label>
                            <input type="text" className={`form-control `}
                              value={productFormData?.unitPrice}
                              onChange={(e) => {
                              
                                let unitP = (e.target.value) 
                                let qty = (productFormData.quantity) 
                                console.log(e.target.value, unitP)
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
                                type="text" className={`form-control `}
                                placeholder=""
                                value={Number(productFormData?.amount).toFixed(2)}
                                disabled
                              />

                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row" style={{textAlign:'right'}}>
                        <div className="col-lg-12 col-sm-6 col-12">
                          <div className="form-group">
                            <button to="#" className="btn btn-submit me-2" onClick={handleAddItem}>
                              Add to List
                            </button>
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
                    <Link to="/dream-pos/purchase/purchaselist" className="btn btn-cancel">
                    Cancel
                   </Link>
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
