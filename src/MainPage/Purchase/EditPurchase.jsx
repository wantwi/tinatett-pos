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
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { moneyInTxt } from "../../utility";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import { useGet } from "../../hooks/useGet";
import { usePut } from "../../hooks/usePut";


const deleteRow = () => {
  $(document).on("click", ".delete-set", function () {
    $(this).parent().parent().hide();
  });
};


const EditPurchase = () => {
  const [startDate, setStartDate] = useState(new Date());
  const {state} = useLocation()
  console.log(state)
  const [formData, setFormData] = useState(state)

  const [purDate, setPurDate] = useState('');
  const [manDate, setManDate] = useState('');
  const [expDate, setExpDate] = useState('');


  const [productList, setProductList] = useState([])
  const [product, setProduct] = useState({ unitPrice: 0, quantity: 0, amount: 0, batchNumber: ''})
  const [supplier, setSupplier] = useState('')

  const [productsDropdown, setProductsDropdown] = useState([]);
  const [suppliersDropdown, setSuppliersDropdown] = useState([]);

  const { data: products, isLoading: productsIsLoading } = useGet("products", "/product");
  const { data: suppliers, isLoading: suppliersIsLoading } = useGet("suppliers", "/supplier");
  const { data: purchase, isLoading: purchaseIsLoading } = useGet("purchase", `/purchase/${state?.id}`);
  const { isLoading, data, isError, error, mutate } = usePut("/purchase");

  const productRef = useRef()

  const handleProductSelect = (e) => {
    let p = productRef.current?.props?.data?.find((item) => item.value === e.target.value)
    if(p){
      setProduct({ ...product, productName: p.text, productId: e.target.value })
    
    }
  }

  const handleAddItem = () => {
    if(product.expireDate == '' || product.manufacturingDate == '' || product.purchaseDate == '' || product.batchNo == ''){
      alertify.set("notifier", "position", "top-right");
      alertify.warning("Please make sure all fields are filled.");
    }
    else{
      setProductList([...productList, product])
    }
  
  }

  const onSubmit = () => {
    let user = sessionStorage.getItem('auth')
    let userOBJ = JSON.parse(user)
    let postBody = {
      supplierId:supplier,
      branchId: userOBJ.branchId,
      products: productList
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
   
    
    return () => {};
  }, [isError]);



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
                          value={purchase?.supplierId}
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
                        selected={new Date(state?.date)}
                        value={purchase?.createdAt}
                        //value={product?.purchaseDate}
                        onChange={(e) => {
                          setPurDate(e)
                          setProduct({ ...product, purchaseDate: new Date(e).toISOString() })
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
                      value={product?.productId}
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
                      value={product?.batchNumber}
                      onChange={(e) => setProduct({ ...product, batchNumber: e.target.value })} />
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
                          setProduct({ ...product, manufacturingDate: new Date(e).toISOString() })
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
                        //value={product?.expiringDate}
                        onChange={(e) => {
                          setExpDate(e)
                          setProduct({ ...product, expireDate: new Date(e).toISOString() })
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
                      value={product?.quantity}
                      onChange={(e) => setProduct({ ...product, quantity: e.target.value })} />
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Unit Price</label>
                    <input type="text"
                      value={product?.unitPrice}
                      onChange={(e) => {
                        let unitP = parseInt(e.target.value) || 0
                        let qty = parseInt(product.quantity) || 0
                        setProduct({ ...product, unitPrice: e.target.value, amount: unitP * qty })
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
                        value={product?.amount}
                        disabled
                      //onChange={(e) => setProduct({...product, amount:e.target.value})}
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
                          productList.reduce((total, item) => total + item.amount, 0)
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

export default EditPurchase;
