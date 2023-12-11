import React, { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Pdf,
  Scanner,
  Product7,
  DeleteIcon,
  Calendar,
  Product8,
  Product1,
  Printer,
  EditIcon,
  Plus,
} from "../../EntryFile/imagePath";
import Select from "react-select";
import "react-select2-wrapper/css/select2.css";
import { useEffect } from "react";
import { useGet } from "../../hooks/useGet";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import { isValidNumber, moneyInTxt } from "../../utility";
import { usePost } from "../../hooks/usePost";
import alertify from "alertifyjs";
import "../../../node_modules/alertifyjs/build/css/alertify.css";
import "../../../node_modules/alertifyjs/build/css/themes/semantic.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import FeatherIcon from 'feather-icons-react'
import jsPDF from "jspdf";
import useCustomApi from "../../hooks/useCustomApi";
import { NotificationsContext } from "../../InitialPage/Sidebar/DefaultLayout";



const AddProforma = () => {
  const [customerOptions, setCustomerOptions] = useState([])
  const [productOptions, setProductOptions] = useState([])


  const { data: customers, isError, isLoading: isCustomerLoading, refetch } = useGet("customers", "/customer/combo");
  const { data: products, isLoading: isProductLoading } = useGet("products", "/product");
  // const { isLoading, isError: isPostError, error, mutate } = usePost("/proforma");

  const [selectedProduct, setSelectedProduct] = useState('')
  // const [selectedProductEdit, setSelectedProductEdit] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [selectedCustomerPrint, setSelectedCustomerPrint] = useState('')
  const [formData, setFormData] = useState({ amount: '', quantity: '', price: '' })
  const [editFormData, setEditFormData] = useState({ amount: '', quantity: '', price: '' })
  const [productGridData, setProductGridData] = useState([])
  const [printGridData, setPrintGridData] = useState([])
  const [transDate, setTransDate] = useState(new Date().toISOString().slice(0, 10));
  const retailpriceTypeRef = useRef()
  const specialpriceTypeRef = useRef()
  const wholesalepriceTypeRef = useRef()
  const editretailpriceTypeRef = useRef()
  const editspecialpriceTypeRef = useRef()
  const editwholesalepriceTypeRef = useRef()
  const [isSaving, setIsSaving] = useState(false)
  const [proformaFile, setProformaFile] = useState(null)
  const [priceType, setPriceType] = useState('')

  const { notifications, setNotifications } = useContext(NotificationsContext)
  let storage = JSON.parse(localStorage.getItem("auth"))

  //add customer states
  const [customerType, setCustomerType] = useState(0)
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Customer name is required"),
    contact: Yup.string().required("Phone number is required"),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitSuccessful } } = useForm({
    defaultValues: {
      name: "",
      email: "",
      contact: "",
      otherContact: "",
      location: "",
      customerType: 0,
      gpsAddress: ""

    },
    resolver: yupResolver(validationSchema),
  });

  const axios = useCustomApi()


  //save adhoc customer
  const onSubmit = (data) => {
    let payload = { ...data, customerType }

    axios.post(`/customer`, payload)
      .then((res) => {
        console.log(res.data)
        if (res.data.success) {
          let addedCustomer = {
            id: res.data.data?.id,
            label: res.data.data?.name,
            value: res.data.data?.id,
            location: res.data.data?.location,
            contact: res.data.data?.contact,
            email: res.data.data?.email

          }
          setCustomerOptions([addedCustomer, ...customerOptions])
        }
        else {
          alertify.set("notifier", "position", "bottom-right");
          alertify.error("Error...Could not save customer.");

          let newNotification = {
            id: Math.ceil(Math.random() * 1000000),
            message: `${storage.name} Error..could not save customer`,
            time: new Date().toISOString(),
            type: 'error'
          }
          setNotifications([newNotification, ...notifications])
        }

      })
  };

  useEffect(() => {
    if (isSubmitSuccessful && !isError) {
      reset();

      alertify.set("notifier", "position", "bottom-right");
      alertify.success("Customer added successfully.");

      $('.modal').modal('hide')
    }
    return () => { };
  }, [isSubmitSuccessful, isError]);


  useEffect(() => {
    if (!isProductLoading && !isCustomerLoading) {
      let mappedData = customers?.data.map((customer) => {
        return {
          id: customer?.id,
          label: customer?.name,
          value: customer?.id,
          location: customer?.location,
          contact: customer?.contact,
          email: customer?.email

        }
      })
      setCustomerOptions(mappedData)


      let mappedData2 = products?.data.map((product) => {
        return {
          id: product?.id,
          label: product?.name,
          value: product?.id,
          retailPrice: product?.retailPrice,
          wholeSalePrice: product?.wholeSalePrice,
          specialPrice: product?.specialPrice
        }
      })
      setProductOptions(mappedData2)
      retailpriceTypeRef.current.checked = true
      editretailpriceTypeRef.current.checked = true

    }

  }, [isCustomerLoading, isProductLoading, refetch])


  const handleProductSelect = (e) => {
    if (products && !isProductLoading) {
      // let item = products?.data.find((product) => product.id == e.target.value)
      setSelectedProduct(e)
      setSelectedProductEdit(e)
    }
    $('#selectedProduct').css('border', 'none')
  }

  const handleCustomerSelect = (e) => {
    if (customers && !isCustomerLoading) {
      // let item = customers?.data.find((customer) => customer.id == e.target.value)
      setSelectedCustomer(e)
      setSelectedCustomerPrint(e)

    }
    $('#selectedCustomerRef').css('border', '1px solid rgba(145, 158, 171, 0.32)')
  }

  const deleteRow = (record) => {
    // console.log(record)
    // console.log(productGridData)
    // let newGridData = productGridData.filter((item) => item.productId !== record.productId)
    //console.log(newGridData)
    // setProductGridData(newGridData)

    let newGridData = productGridData.filter((item) => item.id !== record.id)
    setProductGridData(newGridData)
  };

  const handleUpdate = () => {
    let updated = editFormData
    let listCopy = [...productGridData]
    let index = productGridData.findIndex(item => item.id == updated.id)
    listCopy[index] = updated
    setProductGridData(listCopy)
    $('.modal').modal('hide')

    editretailpriceTypeRef.current.checked = false
    editwholesalepriceTypeRef.current.checked = false
    editspecialpriceTypeRef.current.checked = false
  }


  const handleAddItem = () => {

    let item =
    {
      id: Math.ceil(Math.random() * 1000000),
      productId: selectedProduct.id,
      productName: selectedProduct.label,
      quantity: formData.quantity,
      unitPrice: formData?.price,
      amount: formData?.price * formData?.quantity,
      retailPrice: selectedProduct.retailPrice,
      specialPrice: selectedProduct.specialPrice,
      wholeSalePrice: selectedProduct.wholeSalePrice


    }
    //console.log(item)
    if (selectedCustomer == '') {
      $('#selectedCustomerRef').css('border', '1px solid red')
      // setTimeout(() => {
      //   $('#selectedCustomerRef').css('border', 'none')
      // }, 3000)
    }

    if (selectedProduct == '') {
      $('#selectedProduct').css('border', '1px solid red')
      // setTimeout(() => {
      //   $('#selectedProduct').css('border', 'none')
      // }, 3000)
    }

    if (item.quantity == '') {
      $('#quantity').css('border', '1px solid red')
      // setTimeout(() => {
      //   $('#quantity').css('border', '1px solid rgba(145, 158, 171, 0.32)')
      // }, 3000)
    }

    if (formData.price == '' || formData.price == null) {
      $('#priceType').css('border', '1px solid red')
    }

    if (item.amount < 1 || item.amount == '' || item.quantity == '' || formData.unitPrice == '' || item.productName == '' || selectedCustomer == '') {
      alertify.set("notifier", "position", "bottom-right");
      alertify.warning("Please make sure all fields are filled.");

      let newNotification = {
        id: Math.ceil(Math.random() * 1000000),
        message: `${storage.name} Please make sure all fields are filled`,
        time: new Date().toISOString(),
        type: 'warning'
      }
      setNotifications([newNotification, ...notifications])
    }
    else {


      setProductGridData([...productGridData, item])
      setPrintGridData([...printGridData, item])
      setFormData({ quantity: '', amount: '' })
      setSelectedProduct('')
      //retailpriceTypeRef.current.checked = true
      // wholesalepriceTypeRef.current.checked = false
      // specialpriceTypeRef.current.checked = false

    }

  }


  useEffect(() => {
    $('#quantity').css('border', '1px solid rgba(145, 158, 171, 0.32)')
  }, [formData.quantity])

  useEffect(() => {
    $('#priceType').css('border', 'none')
  }, [formData.price])

  useEffect(() => {
    setSelectedCustomer(customerOptions.find((item) => item.label == 'Default Retail Customer'))
  }, [customerOptions])


  useEffect(() => {
    if (selectedCustomer && selectedCustomer?.label.includes('Retail')) {
      retailpriceTypeRef.current.checked = true
      editretailpriceTypeRef.current.checked = true

      wholesalepriceTypeRef.current.disabled = true
      editwholesalepriceTypeRef.current.disabled = true

      retailpriceTypeRef.current.disabled = false
      editretailpriceTypeRef.current.disabled = false
    }
    else if (selectedCustomer && selectedCustomer?.label.includes('Whole')) {
      wholesalepriceTypeRef.current.checked = true
      editwholesalepriceTypeRef.current.checked = true

      retailpriceTypeRef.current.disabled = true
      editretailpriceTypeRef.current.disabled = true

      wholesalepriceTypeRef.current.disabled = false
      editwholesalepriceTypeRef.current.disabled = false
    }

    else if ((selectedCustomer && !selectedCustomer?.label.includes('Whole')) && (!selectedCustomer?.label.includes('Retail'))) {

      wholesalepriceTypeRef.current.disabled = false
      editwholesalepriceTypeRef.current.disabled = false

      retailpriceTypeRef.current.disabled = false
      editretailpriceTypeRef.current.disabled = false

      //setDisableUnselectedPrice({ wholesale: false, retail: false, special: false })
    }


    $('#selectedCustomer').css('border', '1px solid rgba(145, 158, 171, 0.32)')
  }, [selectedCustomer])


  useEffect(() => {
    if ($('#retailPriceType').prop('checked')) {
      setFormData({ ...formData, price: selectedProduct.retailPrice, amount: formData.quantity ? selectedProduct?.retailPrice * formData.quantity : selectedProduct?.retailPrice * 1 })
    }
    else if ($('#wholeSaleType').prop('checked')) {
      setFormData({ ...formData, price: selectedProduct.wholeSalePrice, amount: formData.quantity ? selectedProduct?.wholeSalePrice * formData.quantity : selectedProduct?.wholeSalePrice * 1 })
    }
    else {
      setFormData({ ...formData, price: selectedProduct.specialPrice, amount: formData.quantity ? selectedProduct?.specialPrice * formData.quantity : selectedProduct?.specialPrice * 1 })
    }

  }, [selectedProduct, selectedCustomer])




  const onSubmitProforma = () => {

    if (productGridData.length < 1) {
      alertify.set("notifier", "position", "bottom-right");
      alertify.warning("Please add at least one item to list before saving.");
      let newNotification = {
        id: Math.ceil(Math.random() * 1000000),
        message: `${storage.name} Please add at least one item to list before saving`,
        time: new Date().toISOString(),
        type: 'warning'
      }
      setNotifications([newNotification, ...notifications])
    }
    else {
      setIsSaving(true)

      let payload = {
        customerId: selectedCustomer.id,
        transDate: transDate,
        products: productGridData.map((item) => {
          return {
            "productId": item.productId,
            "quantity": item.quantity,
            "unitPrice": item.unitPrice
          }
        })
      }
      // mutate(postBody)
      axios.post('/proforma', payload)
        .then((res) => {
          if (res.status == 201 || res.data.success == true) {

            alertify.set("notifier", "position", "bottom-right");
            alertify.success("Proforma saved successfully.");

            let storage = JSON.parse(localStorage.getItem("auth"))
            let newNotification = {
              message: `${storage.name} added a Proforma successfully.`,
              time: new Date().toISOString(),
              type: 'success'
            }
            setNotifications([newNotification, ...notifications])

            //setSelectedCustomer(customerOptions[0])
            setSelectedProduct({})
            setFormData({ amount: '', quantity: '', price: '' })
            setProductGridData([])

            //setTransDate('')

            setTimeout(() => {
              let base64 = res.data.base64
              const blob = base64ToBlob(base64, 'application/pdf');
              const blobFile = `data:application/pdf;base64,${base64}`
              const url = URL.createObjectURL(blob);
              setProformaFile(blobFile)
              //window.open(url, "_blank", "width=600, height=600", 'modal=yes');
              // var newWindow = window.open(url, "_blank", "width=800, height=800");  
              //pdfWindow.document.write("<iframe width='100%' height='100%' src='" + url + "'></iframe>");

              $('#pdfViewer').modal('show')

            }, 1000)

          }
          else {
            alertify.set("notifier", "position", "bottom-right");
            alertify.error("Error...Could not save.");
            let newNotification = {
              id: Math.ceil(Math.random() * 1000000),
              message: `${storage.name} Error. Could not save Proforma`,
              time: new Date().toISOString(),
              type: 'error'
            }
            setNotifications([newNotification, ...notifications])
          }
        }).finally(() => {
          setIsSaving(false)
          retailpriceTypeRef.current.checked = true
          editretailpriceTypeRef.current.checked = true
          setSelectedCustomer(customerOptions[0])
        })


      //base 64 function
      function base64ToBlob(base64, type = "application/octet-stream") {
        const binStr = atob(base64);
        const len = binStr.length;
        const arr = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          arr[i] = binStr.charCodeAt(i);
        }
        return new Blob([arr], { type: type });
      }

    }

  };

  const createPDF = (id) => {
    const pdf = new jsPDF("portrait", "pt", "a4");
    const data = document.getElementById(id);
    pdf.html(data).then(() => {
      pdf.save(`Proforma.pdf`);
    });
    setPrintGridData([])
  };


  const printReport = () => {
    let printContents = document.getElementById('printArea').innerHTML
    let originalContents = document.body.innerHTML
    document.body.innerHTML = printContents
    window.print(printContents)

    document.body.innerHTML = originalContents
    location.reload()
  }

  useEffect(() => {
    //priceType == 'Retail' ? editretailpriceTypeRef?.current.checked = true : priceType == "Wholesale" ? editwholesalepriceTypeRef?.current.checked = true: editspecialpriceTypeRef?.current.checked = true
    if (priceType == 'Retail' && editretailpriceTypeRef != undefined) {
      editretailpriceTypeRef.current.checked = true
    }
    else if (priceType == 'Wholesale' && editwholesalepriceTypeRef != undefined) {
      editwholesalepriceTypeRef.current.checked = true
    }
    else if (priceType == 'Special' && editspecialpriceTypeRef != undefined) {
      editspecialpriceTypeRef.current.checked = true
    }

  }, [priceType])

  useEffect(() => {
    setFormData({ ...formData, amount: Number(formData.price) * Number(formData.quantity) || '' })
    console.log(formData.price)
  }, [formData.quantity])



  if (isProductLoading && isCustomerLoading) {
    return <LoadingSpinner />
  }

  if (isSaving) {
    return <LoadingSpinner message="Saving.." />
  }

  // if(isLoading){
  //   return <LoadingSpinner message="Saving Proforma.."/>
  // }

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Add Proforma</h4>
            <h6>Add your new proforma</h6>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20 }}>

          <div style={{ display: 'flex', flexDirection: 'column', width: '35%', }}>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-12 col-sm-12 col-12">
                    <div className="form-group">
                      <label>Customer Name</label>
                      <div className="row">
                        <div className="col-lg-10 col-sm-12 col-12">
                          <Select
                            id="selectedCustomerRef"
                            className="select"
                            options={customerOptions}
                            onChange={handleCustomerSelect}
                            value={selectedCustomer}

                          />
                        </div>

                        <div className="col-lg-2 col-sm-2 col-2 ps-0">
                          <div className="add-icon">
                            <Link to="#" data-bs-toggle="modal" data-bs-target="#addsupplier">
                              <img src={Plus} alt="img" />
                            </Link>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 col-sm-12 col-12">
                    <div className="form-group">
                      <label> Date</label>
                      <input type="date" className="form-control" value={transDate} onChange={(e) => setTransDate(e.target.value)} />

                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="col-lg-12 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Product Name (Designation)</label>
                    <Select
                      id="selectedProduct"
                      className="select"
                      options={productOptions}
                      onChange={handleProductSelect}
                      value={selectedProduct}
                    />
                  </div>
                </div>


                <div className="col-lg-12 col-sm-12 col-12" id="priceType">
                  <div className="form-group">
                    <label>Unit Price </label>
                    <div className="row" >

                      <div class="col-lg-6">

                        <div class="input-group">
                          <div class="input-group-text">
                            <input className="form-check-input" id="retailPriceType" type="radio" name="customerType" value={selectedProduct?.retailPrice} ref={retailpriceTypeRef}
                              onClick={(e) => {
                                setPriceType('Retail')
                                if (selectedProduct == '') {
                                  alertify.set("notifier", "position", "bottom-right");
                                  alertify.warning("Please select a product first.");
                                  let newNotification = {
                                    id: Math.ceil(Math.random() * 1000000),
                                    message: `${storage.name} Please select a product first`,
                                    time: new Date().toISOString(),
                                    type: 'warning'
                                  }
                                  setNotifications([newNotification, ...notifications])
                                  //retailpriceTypeRef.current.checked = false
                                } else {
                                  setFormData({ ...formData, price: selectedProduct.retailPrice, amount: formData.quantity ? selectedProduct?.retailPrice * formData.quantity : selectedProduct?.retailPrice * 1 })
                                  //console.log(selectedProduct?.retailPrice, formData.quantity, formData.amount)
                                }

                              }} />
                          </div>
                          <input type="text" className="form-control" aria-label="Text input with radio button" value={'Retail Price'} />
                        </div>

                      </div>

                      <div class="col-lg-6">
                        <div class="input-group">
                          <div class="input-group-text">
                            <input className="form-check-input" id="wholeSaleType" type="radio" name="customerType" value={selectedProduct?.wholeSalePrice} ref={wholesalepriceTypeRef}
                              onClick={(e) => {
                                setPriceType('Wholesale')
                                if (selectedProduct == '') {
                                  alertify.set("notifier", "position", "bottom-right");
                                  alertify.warning("Please select a product first.");
                                  let newNotification = {
                                    id: Math.ceil(Math.random() * 1000000),
                                    message: `${storage.name} Please select a product first`,
                                    time: new Date().toISOString(),
                                    type: 'warning'
                                  }
                                  setNotifications([newNotification, ...notifications])
                                  //wholesalepriceTypeRef.current.checked = false
                                } else {
                                  setFormData({ ...formData, price: selectedProduct.wholeSalePrice, amount: formData.quantity ? selectedProduct.wholeSalePrice * formData.quantity : selectedProduct.wholeSalePrice * 1 })
                                  //console.log(selectedProduct?.wholeSalePrice, formData.quantity, formData.amount)
                                }

                              }} />
                          </div>
                          <input type="text" className="form-control" aria-label="Text input with radio button" value={'Wholesale Price'} />
                        </div>
                      </div>
                    </div>

                    <div className="row" style={{ marginTop: 20 }}>
                      <div class="col-lg-6">

                        <div class="input-group">
                          <div class="input-group-text">
                            <input className="form-check-input" id="specialPriceType" type="radio" name="customerType" value={selectedProduct?.specialPrice} ref={specialpriceTypeRef}
                              onClick={(e) => {
                                setPriceType('Special')
                                if (selectedProduct == '') {
                                  alertify.set("notifier", "position", "bottom-right");
                                  alertify.warning("Please select a product first.");
                                  let newNotification = {
                                    id: Math.ceil(Math.random() * 1000000),
                                    message: `${storage.name} Please select a product first`,
                                    time: new Date().toISOString(),
                                    type: 'warning'
                                  }
                                  setNotifications([newNotification, ...notifications])
                                  //specialpriceTypeRef.current.checked = false
                                } else {
                                  setFormData({ ...formData, price: selectedProduct.specialPrice, amount: formData.quantity ? selectedProduct.specialPrice * formData.quantity : selectedProduct.specialPrice * 1 })
                                  //console.log(selectedProduct?.specialPrice, formData.quantity, formData.amount)
                                }

                              }} />
                          </div>
                          <input type="text" className="form-control" aria-label="Text input with radio button" value={'Special Price'} />
                        </div>

                      </div>
                    </div>

                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Quantity</label>
                      <div className="input-groupicon">
                        <input
                          type="text"
                          id="quantity"
                          className="form-control"
                          value={formData.quantity}
                          // {...register("quantity")}
                          onChange={(e) => {
                            if (e.target.value == '') {
                              setFormData({ ...formData, quantity: '' })
                            }
                            else if (isValidNumber(e.target.value)) {
                              setFormData({ ...formData, quantity: Number(e.target.value) })
                            }

                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Amount</label>
                      <div className="input-groupicon">
                        <input
                          min={0}
                          type="number"
                          className="form-control"
                          disabled
                          value={formData.amount}

                        />

                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 col-sm-6 col-12">
                  <div className="form-group">
                    <Link to="#" className="btn btn-submit me-2" onClick={handleAddItem} style={{ width: '100%' }}><FeatherIcon icon="shopping-cart" />
                      {" Add to Basket"}
                    </Link>
                    {/* <Link to="#" className="btn btn-cancel">
                        Clear
                      </Link> */}
                  </div>

                </div>
              </div>
            </div>
          </div>


          <div className="card" style={{ width: '65%' }} >
            <div className="card-body">
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
                        <th>Action</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {productGridData?.map((item, index) => {
                        return (
                          <tr key={item?.id}>
                            <td>{index + 1}</td>
                            <td>
                              {/* <td className="productimgname"> */}
                              {/* <Link className="product-img">
                                  <img src={Product7} alt="product" />
                                </Link> */}
                              <Link to="#">{item?.productName}</Link>
                            </td>
                            <td>{item?.quantity}</td>
                            <td>{item?.unitPrice}</td>
                            <td>{item?.amount}</td>

                            <td>
                              <Link to="#" className="me-2">
                                <img src={EditIcon} alt="svg" data-bs-toggle="modal" data-bs-target="#editproduct" onClick={() => {
                                  // console.log(item, 'ITEM')
                                  setEditFormData(item)
                                }
                                } />
                              </Link>
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
              <div className="row">
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
                          <h5>GHS {moneyInTxt(
                            productGridData.reduce((total, item) => total + item.amount, 0)
                          )}</h5>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12" style={{ textAlign: 'right' }}>
                  <button type="submit" className="btn btn-submit me-2" data-bs-toggle="modal" data-bs-target="#confirm"><FeatherIcon icon="save" />
                    {" Generate Proforma"}
                  </button>
                  {/* <Link id="printModalClick" to="#" className="btn btn-cancel me-2" style={{ backgroundColor: '#FF9F43' }} data-bs-toggle="modal"
                    data-bs-target="#create" >
                    Refresh
                  </Link> */}
                  <Link to="/tinatett-pos/proforma/proformalist" className="btn btn-cancel">
                    Cancel
                  </Link>
                </div>
              </div>
            </div>
            {/* </form> */}
          </div>
        </div>


      </div>


      <div
        className="modal fade"
        id="create"
        tabIndex={-1}
        aria-labelledby="create"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Print Preview</h5>
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

              <div id="printArea">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <h5 style={{ textAlign: 'center', fontWeight: 900 }}>TINATETT HERBAL MANUFACTURING AND MARKKETING COMPANY LIMITED</h5>
                  <span style={{ textAlign: 'center' }}>P.O. BOC CO 2699, TEMA-ACCRA, WHOLESALE AND RETAIL OF HERBAL MEDICINE </span>
                  <span style={{ textAlign: 'center' }}>KOTOBABI SPINTEX - FACTORY WEARHOUSE, 02081660807, tinatettonline@gmail.com</span>
                  <h5 style={{ textAlign: 'center', textDecoration: 'underline', fontWeight: 700 }}>PROFORMA INVOICE</h5>
                  <h6 style={{ fontWeight: 700 }}>Customer Info: </h6>
                  <span>Customer Name : {selectedCustomerPrint?.label}</span>
                  <span>Email: {selectedCustomerPrint?.email}</span>
                  <span>Contact: {selectedCustomerPrint?.contact}</span>
                  <span>Address: {selectedCustomerPrint?.location}</span>
                </div>
                <div className="row mt-3">
                  <div class="table-responsive mb-3">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>#</th><th>Product Name</th><th>Quantity</th><th>Unit Price</th><th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {printGridData?.map((item, index) => {
                          return (
                            <tr key={item?.id}>
                              <td>{index + 1}</td>
                              <td>
                                <Link to="#">{item?.productName}</Link>
                              </td>
                              <td>{item?.quantity}</td>
                              <td>{item?.unitPrice}</td>
                              <td>{item?.amount}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>


                <div className="row mt-3">
                  <div className="col-lg-6" style={{ textAlign: 'right' }}></div>
                  <div className="col-lg-6 " style={{ textAlign: 'right' }}>
                    <div className="total-order w-100 max-widthauto m-auto mb-4">
                      <ul>

                        <li className="total" >
                          <h4>Grand Total</h4>
                          <h5>GHS {moneyInTxt(
                            printGridData.reduce((total, item) => total + item.amount, 0)
                          )}</h5>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

              </div>

              <div className="col-lg-12" style={{ textAlign: 'right' }}>
                <Link to="#" className="btn btn-submit me-2" data-bs-dismiss="modal" onClick={() => printReport()}>
                  <FeatherIcon icon="printer" /> Print
                </Link>
                <Link to="#" className="btn btn-cancel" data-bs-dismiss="modal">
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
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
                <div className="col-lg-12 col-sm-12 col-12">
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
                          setEditFormData({ ...editFormData, quantity: e.target.value, amount: unitP * qty || unitP * 1 })
                        }
                      }
                      } />
                  </div>
                </div>

                {/* <div className="col-lg-6 col-sm-12 col-12">
                      <div className="form-group">
                        <label>Unit Price</label>
                        <input type="text" value={editFormData?.unitPrice} 
                         disabled
                         onChange={(e) => {
                          let unitP = parseInt(e.target.value) || 0
                          let qty = parseInt(editFormData.quantity) || 0
                          setEditFormData({ ...editFormData, unitPrice: e.target.value, amount: unitP * qty || unitP * 1 })
                        }}
                        />
                      </div>
                    </div> */}

                <div className="col-lg-12 col-sm-12 col-12" id="editpriceType">
                  <div className="form-group">
                    <label>Unit Price </label>
                    <div className="row" >

                      <div class="col-lg-6">

                        <div class="input-group">
                          <div class="input-group-text">
                            <input className="form-check-input" id="editretailPriceType" name="priceTypeEdit" type="radio" value={editFormData?.retailPrice} ref={editretailpriceTypeRef}
                              onClick={(e) => {
                                console.log(e.target.value)
                                let unitP = parseInt(e.target.value) || 0
                                let qty = parseInt(editFormData.quantity) || 0
                                setEditFormData({ ...editFormData, unitPrice: e.target.value, amount: unitP * qty || unitP * 1 })
                              }} />
                          </div>
                          <input type="text" className="form-control" aria-label="Text input with radio button" value={'Retail Price'} />
                        </div>

                      </div>

                      <div class="col-lg-6">
                        <div class="input-group">
                          <div class="input-group-text">
                            <input className="form-check-input" id="editwholeSaleType" name="priceTypeEdit" type="radio" value={editFormData?.wholeSalePrice} ref={editwholesalepriceTypeRef}
                              onClick={(e) => {
                                console.log(e.target.value)
                                let unitP = parseInt(e.target.value) || 0
                                let qty = parseInt(editFormData.quantity) || 0
                                setEditFormData({ ...editFormData, unitPrice: e.target.value, amount: unitP * qty || unitP * 1 })
                              }} />
                          </div>
                          <input type="text" className="form-control" aria-label="Text input with radio button" value={'Wholesale Price'} />
                        </div>
                      </div>
                    </div>

                    <div className="row" style={{ marginTop: 20 }}>
                      <div class="col-lg-6">

                        <div class="input-group">
                          <div class="input-group-text">
                            <input className="form-check-input" id="editspecialPriceType" name="priceTypeEdit" type="radio" value={editFormData?.specialPrice} ref={editspecialpriceTypeRef}
                              onClick={(e) => {
                                console.log(e.target.value)
                                let unitP = parseInt(e.target.value) || 0
                                let qty = parseInt(editFormData.quantity) || 0
                                setEditFormData({ ...editFormData, unitPrice: e.target.value, amount: unitP * qty || unitP * 1 })
                              }} />
                          </div>
                          <input type="text" className="form-control" aria-label="Text input with radio button" value={'Special Price'} />
                        </div>

                      </div>
                    </div>

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
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Customer</h5>
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
                  <div className="col-lg-12 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Customer Name</label>
                      <input
                        className={`form-control ${errors.name ? "is-invalid" : ""
                          }`}
                        type="text"
                        {...register("name")}
                      />
                      <div className="invalid-feedback">
                        {errors.name?.message}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-12 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Choose Type</label>
                      <div className="row">
                        <div class="col-lg-6">
                          <div class="input-group">
                            <div class="input-group-text">
                              <input className="form-check-input" type="radio" name="customerType" value="0" onChange={(e) => setCustomerType(e.target.value)} />
                            </div>
                            <input type="text" className="form-control" aria-label="Text input with radio button" value={'Company'} />
                          </div>
                        </div>

                        <div class="col-lg-6">

                          <div class="input-group">
                            <div class="input-group-text">
                              <input className="form-check-input" type="radio" name="customerType" value="1" onChange={(e) => setCustomerType(e.target.value)} />
                            </div>
                            <input type="text" className="form-control" aria-label="Text input with radio button" value={'Individual'} />
                          </div>

                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="col-lg-12 col-sm-12 col-12">
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        placeholder="someone@gmail.com"
                        className={`form-control ${errors.name ? "is-invalid" : ""
                          }`}
                        type="text"
                        {...register("email")}
                      />

                    </div>
                  </div>


                </div>

                <div className="row">
                  <div className="col-lg-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Contact</label>
                      <input className={`form-control ${errors.name ? "is-invalid" : ""
                        }`}
                        type="text"
                        {...register("contact")}
                      />
                      <div className="invalid-feedback">
                        {errors.name?.message}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 col-12">
                    <div className="form-group">
                      <label>Other Contact</label>
                      <input className={`form-control ${errors.name ? "is-invalid" : ""
                        }`}
                        type="text"
                        {...register("otherContact")}
                      />

                    </div>
                  </div>


                  <div className="col-lg-12 col-12">
                    <div className="form-group">
                      <label>Location/Address</label>
                      <input className={`form-control ${errors.name ? "is-invalid" : ""
                        }`}
                        type="text"
                        {...register("location")} />
                    </div>
                  </div>

                  <div className="col-lg-12 col-12">
                    <div className="form-group">
                      <label>Ghana Post Address</label>
                      <input className={`form-control ${errors.name ? "is-invalid" : ""
                        }`}
                        type="text"
                        placeholder="GZ-000-0000"
                        {...register("gpsAddress")} />
                    </div>
                  </div>

                  <div className="col-lg-12" style={{ textAlign: 'right' }}>
                    <button type="submit" className="btn btn-submit me-2"><FeatherIcon icon="save" /> Save</button>
                    <button type="button" className="btn btn-cancel" data-bs-dismiss="modal">Close</button>
                  </div>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>

      {/* Confirm Modal */}

      <div
        className="modal fade"
        id="confirm"
        tabIndex={-1}
        aria-labelledby="confirm"
        aria-hidden="true">

        <div className="modal-dialog modal-md modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm</h5>
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
              Are you sure you want to generate this Proforma?
            </div>
            <div className="modal-footer">
              <Link to="#" className="btn btn-submit me-2" data-bs-dismiss="modal" onClick={onSubmitProforma}>
                Yes
              </Link>
              <Link to="#" className="btn btn-cancel" data-bs-dismiss="modal">
                No
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* PDF Modal */}
      <div
        className="modal fade"
        id="pdfViewer"
        tabIndex={-1}
        aria-labelledby="pdfViewer"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Proforma Receipt</h5>
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
              <iframe width='100%' height='800px' src={proformaFile}></iframe>
            </div>

          </div>
        </div>
      </div>
    </div>



  );
};

export default AddProforma;
