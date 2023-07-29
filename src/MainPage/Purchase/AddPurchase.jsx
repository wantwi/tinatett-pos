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
import { isValidNumber, moneyInTxt } from "../../utility";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import alertify from "alertifyjs";
import "../../../node_modules/alertifyjs/build/css/alertify.css";
import "../../../node_modules/alertifyjs/build/css/themes/semantic.css";
import { usePost } from "../../hooks/usePost";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import FeatherIcon from "feather-icons-react";
import useCustomApi from "../../hooks/useCustomApi";

const options2 = [
  { id: 1, text: "choose Status", text: "choose Status" },
  { id: 2, text: "Inprogess", text: "Inprogess" },
  { id: 3, text: "Completed", text: "Completed" },
];

const AddPurchase = () => {
  const [purDate, setPurDate] = useState(new Date().toISOString().slice(0, 10));
  const [manDate, setManDate] = useState('');
  const [expDate, setExpDate] = useState('');


  const [productGridData, setProductGridData] = useState([])
  const [productFormData, setProductFormData] = useState({ unitPrice: '', quantity: '', amount: '', manufacturingDate: '', expireDate: '', batchNumber: '' })
  const [editFormData, setEditFormData] = useState({ unitPrice: '', quantity: '', amount: '', manufacturingDate: '', expireDate: '', batchNumber: '' })
  const [supplier, setSupplier] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('')

  const [productsDropdown, setProductsDropdown] = useState([]);
  const [suppliersDropdown, setSuppliersDropdown] = useState([]);

  const { data: products, isLoading: productsIsLoading } = useGet("products", "/product");
  const { data: suppliers, isLoading: suppliersIsLoading } = useGet("suppliers", "/supplier");
  const { isLoading, data, isError, error, mutate } = usePost("/purchase");
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false)
  const [loading, setLoading] = useState(false)

  //add customer states
  const [supplierType, setSupplierType] = useState(0)
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Customer name is required"),
    contact: Yup.string().required("Phone number is required"),
  });

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      contact: "",
      location: "",
      customerType: 0,
      type: 0,
      creditPeriod: "",
      othercontact: "",
      bankDetails: "",
      cashDetails: "",
      momoDetails: ""

    },
    resolver: yupResolver(validationSchema),
  });

  const axios = useCustomApi()


  const deleteRow = (record) => {
    // console.log(record)
    // console.log(productGridData)
    let newGridData = productGridData.filter((item) => item.productId !== record.productId)
    //console.log(newGridData)
    setProductGridData(newGridData)
  };

  const handleUpdate = () => {
    let updated = editFormData
    let listCopy = [...productGridData]
    let index = productGridData.findIndex(item => item.productId == updated.productId)
    listCopy[index] = updated
    setProductGridData(listCopy)
    $('.modal').modal('hide')
  }


  const checkIfBatchNoExists = (batchNumber, productId) => {
    setLoading(true)
    axios.get(`/purchase/product/${productId}/${batchNumber}`)
      .then((res) => {
        if (res.data.statusText == 'Allow Purchase') {

        }
        else if (res.data.statusText == 'Deny Purchase') {
          alertify.set("notifier", "position", "top-right");
          alertify.warning(res.data.message);
          setProductFormData({ ...productFormData, batchNumber: '' })
        }
      })
      .finally(() => setLoading(false))
  }


  useEffect(() => {
    setProductFormData({ ...productFormData, amount: productFormData.quantity * productFormData.unitPrice })
  }, [productFormData.quantity, productFormData.unitPrice])


  //save adhoc supplier
  const onSubmit = (data) => {
    let payload = {
      "name": data.name,
      "contact": data.contact,
      "othercontact": data.othercontact,
      "location": data.location,
      "customerType": supplierType,
      "email": data.email,
      "gpsAddress": data.gpsAddress,
      "creditPeriod": data.creditPeriod,
      "product": data.product,
      paymentInfo: [
        {
          type: 'cash',
          details: data.cashDetails
        },
        {
          type: 'momo',
          details: data.momoDetails
        },
        {
          type: 'bank',
          details: data.bankDetails
        },

      ]
      //paymentInfo: {"type":paymentType.label, "accountNumber":data.accountNumber,"branch":data.branch,"serviceProvider":data.serviceProvider} 
    }

    axios.post(`/supplier`, payload)
      .then((res) => {
        // console.log(res.data)
        if (res.data.success) {
          alertify.set("notifier", "position", "top-right");
          alertify.success("Supplier added successfully.");

          let addedCustomer = {
            id: res.data.data?.id,
            label: res.data.data?.name,
            value: res.data.data?.id,
          }
          setSuppliersDropdown([addedCustomer, ...suppliersDropdown])
          $('.modal').modal('hide')
        }
        else {
          alertify.set("notifier", "position", "top-right");
          alertify.error("Error...Could not save supplier.");
        }

      })
  };

  const handleProductSelect = (e) => {
    //console.log("Product:", e)
    setSelectedProduct(e)
    setProductFormData({ ...productFormData, productName: e.label, productId: e.value, })
  }

  const handleAddItem = () => {
    //console.log(productFormData)
    if (productFormData.expireDate == '' || productFormData.manufacturingDate == '' || purDate == '' || selectedProduct == '' ) {
      alertify.set("notifier", "position", "top-right");
      alertify.warning("Please make sure all fields are filled.");
    }
    if (productFormData.expireDate == '') {
      $('#expiryDate').css('border', '1px solid red')
      setTimeout(() => {
        $('#expiryDate').css('border', '1px solid rgba(145, 158, 171, 0.32)')
      }, 3000)
    }

    if (productFormData.manufacturingDate == '') {
      $('#manufacturingDate').css('border', '1px solid red')
      setTimeout(() => {
        $('#manufacturingDate').css('border', '1px solid rgba(145, 158, 171, 0.32)')
      }, 3000)
    }

    if (selectedProduct == '') {
      $('#productName').css('border', '1px solid red')
      setTimeout(() => {
        $('#productName').css('border', '1px solid rgba(145, 158, 171, 0.32)')
      }, 3000)
    }

    if (productFormData.quantity == '') {
      $('#quantity').css('border', '1px solid red')
      setTimeout(() => {
        $('#quantity').css('border', '1px solid rgba(145, 158, 171, 0.32)')
      }, 3000)
    }

    if (productFormData.batchNumber == '') {
      $('#batchNumber').css('border', '1px solid red')
      setTimeout(() => {
        $('#batchNumber').css('border', '1px solid rgba(145, 158, 171, 0.32)')
      }, 3000)
    }

    if (productFormData.unitPrice == '') {
      $('#unitPrice').css('border', '1px solid red')
      setTimeout(() => {
        $('#unitPrice').css('border', '1px solid rgba(145, 158, 171, 0.32)')
      }, 3000)
    }

    
    else {
      setManDate('')
      setExpDate('')
      setProductGridData([...productGridData, productFormData])
      setProductFormData({ unitPrice: '', quantity: '', amount: '', manufacturingDate: '', expireDate: '', batchNumber: '' })
      setSelectedProduct('')
    }

  }

  const onSubmitPurchase = (data) => {
    if (productGridData.length < 1) {
      alertify.set("notifier", "position", "top-right");
      alertify.warning("Please add items to your cart");
    }
    else if (supplier == '') {
      alertify.set("notifier", "position", "top-right");
      alertify.warning("Please make sure Supplier was selected.");
      $('#supplier').css('border', '1px solid red')
      setTimeout(() => {
        $('#supplier').css('border', '1px solid rgba(145, 158, 171, 0.32)')
      }, 3000)
    }
    else if (purDate == '') {
      alertify.set("notifier", "position", "top-right");
      alertify.warning("Please make sure purchaase date was selected.");
      $('#purDate').css('border', '1px solid red')
      setTimeout(() => {
        $('#purDate').css('border', '1px solid rgba(145, 158, 171, 0.32)')
      }, 3000)
    }
    else {
      let postBody = {
        supplierId: supplier.id,
        purchaseDate: new Date(purDate).toISOString(),
        products: productGridData
      }

      //console.log(postBody)
      mutate(postBody)
      setManDate('')
      setExpDate('')
      //setPurDate('')
      setSelectedProduct('')
      setSupplier('')
      setProductGridData([])
      setIsSubmitSuccessful(true)
    }

  };

  useEffect(() => {
    if (!productsIsLoading && !suppliersIsLoading) {
      let mappedProducts = products?.data.map((item) => {
        return {
          id: item?.id,
          label: item?.name,
          value: item?.id,
          retailPrice: item?.retailPrice,
          wholeSalePrice: item?.wholeSalePrice,
          specialPrice: item?.wholeSalePrice,
          ownershipType: item?.ownershipType
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
    if (!isError && isSubmitSuccessful) {
      console.log("res", data)
      alertify.set("notifier", "position", "top-right");
      alertify.success("Purchase added successfully.");
    }
    else if (isError) {
      alertify.set("notifier", "position", "top-right");
      alertify.error("Error...Could not save purchase transaction");
    }

    return () => { };
  }, [isError, !isSubmitSuccessful]);


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
      title: "Unit Price",
      dataIndex: "unitPrice",
      render: (text, record) => <p style={{ textAlign: 'center' }}>{moneyInTxt(text)}</p>
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (text, record) => <p style={{ textAlign: 'center' }}>{moneyInTxt(text)}</p>
    },
    {
      title: "Batch #",
      dataIndex: "batchNumber",
      width: "150px"
      // render: (text, record) => <p style={{textAlign:'center'}}>{text || 0}</p>
    },


    {
      title: "Manufacturing",
      dataIndex: "manufacturingDate",
      render: (text, record) => <p key={text} style={{ textAlign: 'center' }}>{record?.manufacturingDate.substring(0, 10) || ''}</p>
    },
    {
      title: "Expiring",
      dataIndex: "expireDate",
      render: (text, record) => <p key={text} style={{ textAlign: 'center' }}>{record?.expireDate.substring(0, 10) || ''}</p>
    },
    {
      title: "Action",
      render: (text, record) => (
        <>
          <span className="me-2"> <img src={EditIcon} alt="img" data-bs-toggle="modal" data-bs-target="#editproduct" onClick={() => setEditFormData(record)} /></span>
          <Link className="delete-set" to="#" onClick={() => deleteRow(record)}>
            <img src={DeleteIcon} alt="img" />
          </Link>

        </>
      ),
    },
  ];


  if (isLoading) {
    <LoadingSpinner />
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

          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ width: '30%' }}>
              <div className="card">
                <div className="card-body">


                  <div className="row">
                    <div className="col-lg-12 col-sm-6 col-12">
                      <div className="form-group">
                        <label>Supplier Name</label>
                        <div className="row">
                          <div className="col-lg-10 col-sm-10 col-10">
                            <Select
                             id="supplier"
                              className="select"
                              options={suppliersDropdown}
                              value={supplier}
                              isLoading={suppliersIsLoading}
                              //onChange={(e) => handleSupplierSelect(e)}
                              onChange={(e) => {
                                setSupplier(e)
                              }}
                            />
                          </div>
                          <div className="col-lg-2 col-sm-2 col-2 ps-0">
                            <div className="add-icon">
                              <Link to="#" title="Add Supplier" data-bs-toggle="modal" data-bs-target="#addsupplier">
                                <img src={Plus} alt="img" />
                              </Link>
                            </div>
                          </div>

                        </div>
                      </div>

                    </div>


                    <div className="col-lg-12 col-sm-12 col-12">
                      <div className="form-group">
                        <label>Purchase Date </label>
                        <input type="date" id="purDate" className="form-control" value={purDate} onChange={(e) => { setPurDate(e.target.value) }} />
                        {/* <div className="input-groupicon">
                          <DatePicker
                            selected={purDate}
                            ref = {dateRef}
                            onChange={(e) => {
                              setPurDate(e)
                              // setProductFormData({ ...productFormData, purchaseDate: new Date(e).toISOString() })
                            }
                            }
                          /> 
                          <div className="addonset">
                            <img src={Calendar} alt="img" onClick={() => dateRef.current.setFocus()}/>
                          </div> 
                        </div>*/}
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
                          id="productName"
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
                          <input type="date" id="manufacturingDate" className="form-control" value={manDate} onChange={(e) => {
                            setManDate(e.target.value)
                            setProductFormData({ ...productFormData, manufacturingDate: new Date(e.target.value).toISOString() })
                          }} />
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
                          <input type="date" id="expiryDate" className="form-control" value={expDate} onChange={(e) => {
                            setExpDate(e.target.value)
                            setProductFormData({ ...productFormData, expireDate: new Date(e.target.value).toISOString() })
                          }} />
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
                        <label>Batch No</label>
                        <input type="text" id="batchNumber" className={`form-control `} disabled={selectedProduct?.ownershipType == "Tinatett" ? false : false}
                          value={productFormData?.batchNumber}
                          onBlur={(e) => checkIfBatchNoExists(e.target.value, selectedProduct.id,)}
                          onChange={(e) => {
                            setProductFormData({ ...productFormData, batchNumber: e.target.value })
                          }
                          } />
                      </div>
                    </div>

                    <div className="col-lg-6 col-sm-6 col-12">
                      <div className="form-group">
                        <label>Quantity</label>
                        <input type="text" id="quantity" className={`form-control `}
                          value={productFormData?.quantity}
                          onChange={(e) => {
                            if (e.target.value == '') {
                              setProductFormData({ ...productFormData, quantity: '' })
                            }
                            else if (isValidNumber(e.target.value)) {
                              let qty = parseInt(e.target.value) || 0
                              let unitP = parseInt(productFormData.unitPrice) || 0
                              setProductFormData({ ...productFormData, quantity: e.target.value, amount: productFormData.quantity ? unitP * qty : unitP * 1 })
                            }
                          }
                          } />
                      </div>
                    </div>

                    <div className="col-lg-6 col-sm-6 col-12">
                      <div className="form-group">
                        <label>Unit Price</label>
                        <input type="text" id="unitPrice" className={`form-control `}
                          //step={0.01}
                          value={productFormData?.unitPrice}
                          onChange={(e) => {
                            let unitP = parseInt(e.target.value) || 0
                            let qty = parseInt(productFormData.quantity) || 0
                            setProductFormData({ ...productFormData, unitPrice: e.target.value, amount: productFormData ? unitP * qty : unitP * 1 })
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
                            id="amount"
                            placeholder=""
                            value={productFormData?.amount}
                            disabled
                          />

                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row" style={{ textAlign: 'right' }}>
                    <div className="col-lg-12 col-sm-6 col-12">
                      <div className="form-group">
                        <Link to="#" className="btn btn-submit me-2" onClick={handleAddItem} style={{ width: '100%' }}>
                          <FeatherIcon icon="shopping-cart" /> {" Add to Basket"}
                        </Link>
                        {/* <Link to="#" className="btn btn-cancel">
                              Clear
                            </Link> */}
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ width: '70%' }}>
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


                  <div className="col-lg-12" style={{ textAlign: 'right' }}>
                    <button className="btn btn-submit me-2" type="submit" onClick={onSubmitPurchase}><FeatherIcon icon="save" />Save</button>
                    <Link to="/tinatett-pos/purchase/purchaselist" className="btn btn-cancel">
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div
            className="modal fade"
            id="editproduct"
            tabIndex={-1}
            aria-labelledby="editproduct"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-md modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Product</h5>
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
                        <label>Product Name</label>
                        <div className="input-groupicon">
                          <input type="text" value={editFormData?.productName} onChange={(e) => setEditFormData({ ...editFormData, productName: e.target.value })} disabled />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-12 col-12">
                      <div className="form-group">
                        <label>Manufacturing Date</label>
                        <input type="date" className="form-control" value={editFormData?.manufacturingDate.substring(0, 10)} onChange={(e) => setEditFormData({ ...editFormData, manufacturingDate: e.target.value })} />
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-12 col-12">
                      <div className="form-group">
                        <label>Expiring Date</label>
                        <input type="date" className="form-control" value={editFormData?.expireDate.substring(0, 10)} onChange={(e) => setEditFormData({ ...editFormData, expireDate: e.target.value })} />
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-12 col-12">
                      <div className="form-group">
                        <label>Quantity</label>
                        <input type="text" value={editFormData?.quantity}
                          onChange={(e) => {
                            if (e.target.value == '') {
                              setEditFormData({ ...editFormData, quantity: '' })
                            }
                            else if (isValidNumber(e.target.value)) {
                              let qty = parseInt(e.target.value) || 0
                              let unitP = parseInt(editFormData.unitPrice) || 0
                              setEditFormData({ ...editFormData, quantity: e.target.value, amount: editFormData.quantity ? unitP * qty : unitP * 1 })
                            }
                          }
                          } />
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-12 col-12">
                      <div className="form-group">
                        <label>Batch No.</label>
                        <input type="text" value={editFormData?.batchNumber} onChange={(e) => setEditFormData({ ...editFormData, batchNumber: e.target.value })} />
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-12 col-12">
                      <div className="form-group">
                        <label>Unit Price</label>
                        <input type="text" value={editFormData?.unitPrice}
                          disabled
                          onChange={(e) => {
                            let unitP = parseInt(e.target.value) || 0
                            let qty = parseInt(editFormData.quantity) || 0
                            setEditFormData({ ...editFormData, unitPrice: e.target.value, amount: editFormData ? unitP * qty : unitP * 1 })
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-12 col-12">
                      <div className="form-group">
                        <label>Amount</label>
                        <input type="text" value={editFormData?.amount} />
                      </div>
                    </div>


                  </div>
                </div>
                <div className="modal-footer" style={{ justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-submit" onClick={handleUpdate}>
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

          {/* Add Customer Modal */}
          <div
            className="modal fade"
            id="addsupplier"
            tabIndex={-1}
            aria-labelledby="addsupplier"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Supplier</h5>
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
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                      <div className="col-lg-6 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Supplier Name</label>
                          <input className={`form-control ${errors.name ? "is-invalid" : ""
                            }`}
                            type="text"
                            {...register("name")} />
                        </div>
                      </div>

                      <div className="col-lg-6 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Supplier Type</label>
                          <div className="row">
                            <div class="col-lg-6">
                              <div class="input-group">
                                <div class="input-group-text">
                                  <input className="form-check-input" type="radio" name="customerType" value="Company" onChange={(e) => setSupplierType(e.target.value)} />
                                </div>
                                <input type="text" className="form-control" aria-label="Text input with radio button" value={'Company'} />
                              </div>
                            </div>

                            <div class="col-lg-6">

                              <div class="input-group">
                                <div class="input-group-text">
                                  <input className="form-check-input" type="radio" name="customerType" value="Individual" onChange={(e) => setSupplierType(e.target.value)} />
                                </div>
                                <input type="text" className="form-control" aria-label="Text input with radio button" value={'Individual'} />
                              </div>

                            </div>
                          </div>

                        </div>
                      </div>

                      <div className="col-lg-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Credit Period</label>
                          <input className={`form-control ${errors.name ? "is-invalid" : ""
                            }`}
                            type="text"
                            placeholder="month, days, weeks..."
                            {...register("creditPeriod")} />
                        </div>
                      </div>

                    </div>

                    <div className="row">
                      <div className="col-lg-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Products Supplied</label>
                          <textarea className={`form-control ${errors.name ? "is-invalid" : ""
                            }`}
                            type="text"
                            placeholder="Enter products, separated by comma"
                            {...register("product")} />
                        </div>
                      </div>

                      <div className="col-lg-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Email</label>
                          <input className={`form-control ${errors.name ? "is-invalid" : ""
                            }`}
                            type="text"
                            {...register("email")} />
                        </div>
                      </div>

                      <div className="col-lg-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Contact No</label>
                          <input className={`form-control ${errors.name ? "is-invalid" : ""
                            }`}
                            type="text"
                            {...register("contact")} />
                        </div>
                      </div>

                      <div className="col-lg-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Other Contact No</label>
                          <input className={`form-control ${errors.name ? "is-invalid" : ""
                            }`}
                            type="text"
                            {...register("othercontact")} />
                        </div>
                      </div>

                      <div className="col-lg-4 col-12">
                        <div className="form-group">
                          <label>Location/Address</label>
                          <input className={`form-control ${errors.name ? "is-invalid" : ""
                            }`}
                            type="text"
                            {...register("location")} />
                        </div>
                      </div>

                      <div className="col-lg-4 col-12">
                        <div className="form-group">
                          <label>Ghana Post Address</label>
                          <input className={`form-control ${errors.name ? "is-invalid" : ""
                            }`}
                            type="text"
                            placeholder="GZ-000-0000"
                            {...register("gpsAddress")} />
                        </div>
                      </div>


                      <fieldset>

                        <div className="row">

                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="form-group">
                              <label>Cash Details</label>
                              <textarea className={`form-control ${errors.name ? "is-invalid" : ""
                                }`}
                                type="text"
                                {...register("cashDetails")} ></textarea>
                            </div>
                          </div>

                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="form-group">
                              <label>Bank Details</label>
                              <textarea className={`form-control ${errors.name ? "is-invalid" : ""
                                }`}
                                type="text"
                                {...register("bankDetails")} ></textarea>
                            </div>
                          </div>

                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="form-group">
                              <label>Momo Details</label>
                              <textarea className={`form-control ${errors.name ? "is-invalid" : ""
                                }`}
                                type="text"
                                {...register("momoDetails")} ></textarea>
                            </div>
                          </div>
                        </div>
                      </fieldset>


                      <div className="col-lg-12" style={{ textAlign: 'right' }}>
                        <button type="submit" className="btn btn-submit me-2"><FeatherIcon icon="save" />Save</button>
                        <button type="button" className="btn btn-cancel" data-bs-dismiss="modal">Close</button>
                      </div>
                    </div>
                  </form>
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
