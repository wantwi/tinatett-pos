import React, { useContext, useRef, useState } from "react";
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
  EditIcon,
} from "../../EntryFile/imagePath";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import { useEffect } from "react";
import { useGet } from "../../hooks/useGet";
import Select from "react-select";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import { isValidNumber, moneyInTxt } from "../../utility";
import { BASE_URL } from "../../api/CustomAxios";
import useCustomApi from "../../hooks/useCustomApi";
import FeatherIcon from 'feather-icons-react'
import { usePost } from "../../hooks/usePost";
import alertify from "alertifyjs";
import "../../../node_modules/alertifyjs/build/css/alertify.css";
import "../../../node_modules/alertifyjs/build/css/themes/semantic.css";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { LoadingOutlined } from "@ant-design/icons";
import { AppContext } from "../../InitialPage/Sidebar/DefaultLayout";


const ProformaSales = () => {
  // const {state} = useLocation()
  // console.log("State", state)

  let href = window.location.search;
  let urlParams = new URLSearchParams(href)
  let id = urlParams.get('id');

  // $('#proform-submenu').removeClass("active")
  const init = {
    type: '',
    cashWaybill: '',
    cashReceiptNo: '',
    cashAmount: '',
    chequeNo: '',
    chequeReceiptNo: '',
    chequeAmount: '',
    chequeWaybill: '',
    dueDate: '',
    bank: '',
    momoName: '',
    momoReceiptNo: '',
    momoAmount: '',
    transactionID: '',
    amountPaid: ''

  }
  const [startDate, setStartDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('Cash')
  const [disabledUnselectedPrice, setDisableUnselectedPrice] = useState({ retail: false, wholesale: false, special: false })
  const [customerList, setCustomerList] = useState([])
  const [productsList, setProductsList] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState({})
  const [selectedProductEditMode, setSelectedProductEditMode] = useState({})
  const [selectedProductInfo, setSelectedProductInfo] = useState()
  const [selectedProductInfoEditMode, setSelectedProductInfoEditMode] = useState()
  const [price, setPrice] = useState(0)
  const [retailprice, setRetailPrice] = useState('')
  const [wholesaleprice, setWholesalePrice] = useState('')
  const [specialprice, setSpecialPrice] = useState('')
  const [formData, setFormData] = useState({ quantity: '', amount: '', batchNumber: '', manuDate: '', expDate: '' })
  const [editFormData, setEditFormData] = useState({ name: '', quantity: '', amount: '', batchNumber: '', manufacturingDate: '', expireDate: '' })
  const [salesType, setSalesType] = useState('Retail')
  const [productGridData, setProductGridData] = useState([])
  const [productGridList, setProductGridList] = useState([])
  const [transDate, setTransDate] = useState(new Date().toISOString().substring(0, 10))
  const [invoiceNo, setInvoiceNo] = useState('')
  const retailpriceTypeRef = useRef()
  const specialpriceTypeRef = useRef()
  const wholesalepriceTypeRef = useRef()
  const [referenceData, setReferenceData] = useState({ data: [], reference: '', amountToPay: '' })
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [paymentInfo, setPaymentInfo] = useState(init)

  const [transactionType, setTransactionType] = useState('SP')
  const [recieptData, setReceiptData] = useState({})
  const [receiptFile, setReceiptFile] = useState(null)
  const [isBatchLoading, setIsBatchLoading] = useState(false)

  const retailRef = useRef()
  const wholesaleRef = useRef()

  const { data: customers, isLoading: customersIsLoading } = useGet("customers", "/customer");
  const { data: products, isLoading: productsIsLoading } = useGet("products", "/product");
  const { data: proformaItems, isLoading: proformaIsLoading } = useGet("proformaItems", `/proforma/products/${id}`);
  const { data: proformaDetails, isLoading: proformaDetailsLoading } = useGet("proformaDetails", `/proforma/${id}`);


  const axios = useCustomApi()
  const { notifications, setNotifications } = useContext(AppContext)
  let storage = JSON.parse(localStorage.getItem("auth"))

  const deleteRow = (record) => {
    //console.log(record, i)
    let newGridData = productGridData.filter((item) => item.id !== record.id)
    setProductGridData(newGridData)
  };


  const getProformaProductsBatchNumbers = () => {
    //get the batchNumber for each product
    let list = []
    let list2 = []
    if (!proformaIsLoading && !proformaDetailsLoading) {
      proformaItems.data.map((product) => {
        axios.get(`/purchase/product/${product.productId}`)
          .then((res) => {
            console.log("Batch Number", res.data.data)
            let mapped = {
              ...product,
              name: product.product.name,
              manufacturingDate: res.data.data.batchNumber[0].manufacturingDate,
              batchNumber: res.data.data.batchNumber[0].batchNumber,
              expireDate: res.data.data.batchNumber[0].expireDate,
            }
            let mapped2 = {
              ...product,
              name: product.product.name,
              productId: product.productId,
              batchNumber: res.data.data.batchNumber,
            }
            //console.log(mapped)
            list = [...list, mapped]
            list2 = [...list2, mapped2]
            //console.log('mappedList', list)

          })
          .finally(() => {
            setProductGridData(list)
            setProductGridList(list2)
          })
      })

    }
  }


  useEffect(() => {
    getProformaProductsBatchNumbers()
  }, [proformaIsLoading, proformaDetailsLoading])


  const handleEdit = (item) => {
    setIsLoadingDetails(true)
    let product = productsList.find((product) => product.id == item.productId)
    setSelectedProductEditMode(product)


    //get batch number
    // let query = productGridList.find((productX) => productX.productId == product.id)
    // console.log("M:", productGridList);
    // console.log("X:", query)
    //  let x = res.data.data.batchNumber?.map((item) => {
    //   return {value:item.batchNumber, label:item?.batchNumber + '-(' + item?.Quantity +')', expireDate:item?.expireDate, manufacturingDate: item?.manufacturingDate}
    // })
    //console.log(x)

    axios.get(`${BASE_URL}/purchase/product/${item.productId}`).then((res) => {
      if (res.data.success) {
        setSelectedProductInfoEditMode(res.data.data)
        let x = res.data.data.batchNumber?.map((item) => {
          return { value: item.batchNumber, label: item?.batchNumber + '-(' + item?.Quantity + ')', expireDate: item?.expireDate, manufacturingDate: item?.manufacturingDate }
        })
        //console.log(x)
        setEditFormData({ ...editFormData, ...item, batchNumber: x[0], manufacturingDate: x[0]?.manufacturingDate.substring(0, 10), expireDate: x[0]?.expireDate.substring(0, 10) })
      }
    }).finally(() => setIsLoadingDetails(false))

  }

  const handleUpdate = () => {
    let updated = { ...editFormData, batchNumber: editFormData?.batchNumber?.value }
    let listCopy = [...productGridData]
    let index = productGridData.findIndex(item => item.productId == updated.productId)
    listCopy[index] = updated
    setProductGridData(listCopy)
    setEditFormData({ quantity: '', amount: '', batchNumber: {}, manufacturingDate: '', expireDate: '' })
    $('.modal').modal('hide')
  }

  const processPayment = (type, print) => {


    if (productGridData.length < 1) {
      alertify.set("notifier", "position", "bottom-right");
      alertify.warning("Please add at least one item to list before saving.");

      let newNotification = {
        id: Math.ceil(Math.random()*1000000),
        message: `${storage.name} Please add at least one item to list before saving.`,
        time: new Date().toISOString(), type:'warning'
      }
      setNotifications([newNotification, ...notifications])
    }
    else if( (transactionType == 'SP' || transactionType == 'SO') && paymentInfo.amountPaid < (productGridData.reduce((total, item) => total + item.amount, 0))){
      alertify.set("notifier", "position", "bottom-right");
      alertify.warning("Please provide payment amount before saving.");
      let newNotification = {
        id: Math.ceil(Math.random()*1000000),
        message: `${storage.name} Please provide payment amount before saving.`,
        time: new Date().toISOString(), type:'warning'
      }
      setNotifications([newNotification, ...notifications])
    }

    else {
      //handle the suspend first and then use the reference to process payment
      setIsSaving(true)
      let payload = {
        customerId: selectedCustomer?.value,
        transDate: transDate,
        totalAmount: productGridData.reduce((total, item) => total + item.amount, 0),
        salesType: retailpriceTypeRef.current.checked == true ? "Retail" : "Wholesale",
        products: productGridData.map((product) => {
          return {
            name: product?.name,
            productId: product?.productId,
            batchNumber: product?.batchNumber,
            quantity: product?.quantity,
            expireDate: product?.expireDate.substring(0, 10),
            manufacturingDate: product?.manufacturingDate.substring(0, 10),
            unitPrice: product?.unitPrice,
            // priceType: salesType,
            priceType: retailpriceTypeRef.current.checked == true ? 'Retail' : 'Wholesale',
            amount: product?.amount
          }
        })
      }

      console.log(payload)
      axios.post(`/sales/suspend`, payload)
        .then((res) => {
          if (res.data.success) {
            setProductGridData([])
            setFormData({ quantity: '', amount: '', batchNumber: '', manuDate: '', expDate: '' })
            setSelectedProduct('')
            setInvoiceNo('')
            setReferenceData(res.data)

            //delete proforma on suspend
            axios.delete(`/proforma/${id}`).then((res) => console.log(res))


            //call payment api
            let pType = ''
            if (paymentInfo.cashAmount > 0) {
              pType = pType.concat('Cash,')
            }
            if (paymentInfo.momoAmount > 0) {
              pType =
                pType.concat('Momo,')
            }
            if (paymentInfo.chequeAmount > 0) {
              pType = pType.concat('Cheque,')
            }
            // let payload = {
            //   status: type,
            //   salesRef: res.data.reference,
            //   amount: productGridData.reduce((total, item) => total + item.amount, 0),
            //   paymentType: pType,
            //   paymentInfo: [
            //     { "type": "Cash", waybill: paymentInfo.cashWaybill, amountPaid: paymentInfo.cashAmount },
            //     { "type": "Momo", name: paymentInfo.momoName, receiptNo: paymentInfo.momoReceiptNo, amountPaid: paymentInfo.momoAmount },
            //     { "type": "Cheque", waybill: paymentInfo.chequeWaybill, chequeNo: paymentInfo.chequeNo, chequeReceiptNo: paymentInfo.chequeReceiptNo, amountPaid: paymentInfo.chequeAmount, waybill: paymentInfo.chequeWaybill }
            //   ]
            // }

            let payload = {
              "status": type,
              "salesRef": res.data.reference,
              "amount": (Number(paymentInfo.cashAmount) + Number(paymentInfo.momoAmount) + Number(paymentInfo.chequeAmount)),
              "paymentType": pType,
              "cashAmount":Number(paymentInfo.cashAmount),
              "momoAmount":Number(paymentInfo.momoAmount),
              "chequeAmount":Number(paymentInfo.chequeAmount),
              "paymentInfo": [
                  {
                      "type": "Cash",
                      "waybill": paymentInfo.cashWaybill,
                      "amountPaid": paymentInfo.cashAmount
                  },
                  {
                      "type": "Momo",
                      "name": paymentInfo.momoName,
                      "receiptNo": paymentInfo.momoReceiptNo,
                      "amountPaid": paymentInfo.momoAmount
                  },
                  {
                      "type": "Cheque",
                      "waybill": paymentInfo.chequeWaybill,
                      "chequeNo": paymentInfo.chequeNo,
                      "chequeReceiptNo": paymentInfo.chequeReceiptNo,
                      "amountPaid": paymentInfo.chequeAmount
                  }
              ]
            }


            axios.post('/sales', payload)
              .then((res) => {

                if (res.data.success) {
                  setReceiptData({
                    amountPaid: res.data.data?.amountPaid,
                    balance: res.data.data.balance,
                    change: res.data.data.change,
                    amountToPay: res.data.data.result?.totalAmount
                  })
                  if (print) {
                    getInvoiceReceipt(payload.salesRef)
                  }
                  alertify.set("notifier", "position", "bottom-right");
                  alertify.success("Sale completed.");
                 
                  let newNotification = {
                    message: `${storage.name} completed a sale with reference ${payload.salesRef}`,
                    time: new Date().toISOString(), type:'success'
                  }
                  setNotifications([newNotification, ...notifications])

                }
              })
              .catch((error) => {
                alertify.set("notifier", "position", "bottom-right");
                alertify.error("Error...Could not complete transaction");
                let newNotification = {
                  id: Math.ceil(Math.random()*1000000),
                  message: `${storage.name} Error...Could not complete transaction.`,
                  time: new Date().toISOString(), type:'error'
                }
                setNotifications([newNotification, ...notifications])
              })
              .finally(() => {
                setActiveTab('Cash')
                setPaymentInfo({
                  type: '',
                  cashWaybill: '',
                  cashReceiptNo: '',
                  cashAmount: '',
                  chequeNo: '',
                  chequeReceiptNo: '',
                  chequeAmount: '',
                  chequeWaybill: '',
                  dueDate: '',
                  bank: '',
                  momoName: '',
                  momoReceiptNo: '',
                  momoAmount: '',
                  transactionID: '',
                  amountPaid: ''
                })
                
              })

          }
          else {
            alertify.set("notifier", "position", "bottom-right");
            alertify.warning("Unsuccessful, please try again");
            let newNotification = {
              id: Math.ceil(Math.random()*1000000),
              message: `${storage.name} Unsuccessful, please try again.`,
              time: new Date().toISOString(), type:'warning'
            }
            setNotifications([newNotification, ...notifications])
          }
        })
        .catch((error) => {
          alertify.set("notifier", "position", "bottom-right");
          alertify.error("Internal server error occured. Please contact admin");
          let newNotification = {
            id: Math.ceil(Math.random()*1000000),
            message: `${storage.name} Internal server error occured. Please contact admin.`,
            time: new Date().toISOString(), type:'error'
          }
          setNotifications([newNotification, ...notifications])
        })
        .finally(() => {
          setIsSaving(false)
          $('#reference').modal('show')
        })

    }
  }

  const handlePayment = () => {
    if (transactionType == "SP") {
      processPayment("Paid", true)
    }
    if (transactionType == "SO") {
      processPayment("Paid", false)
    }
    if (transactionType == "CP") {
      processPayment("Credit", true)
    }
    if (transactionType == "CO") {
      processPayment("Credit", false)
    }
    $('.modal').modal('hide')
  }

  const getInvoiceReceipt = (salesref) => {
    axios.get('/sales/getSaleReceipt/' + salesref)
      .then((res) => {
        let base64 = res.data.base64
        const blob = base64ToBlob(base64, 'application/pdf');
        const blobFile = `data:application/pdf;base64,${base64}`
        const url = URL.createObjectURL(blob);
        setReceiptFile(blobFile)
        $('#pdfViewer').modal('show')
      })

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

  const handleSalesTypeChange = (e) => {
    if (e.target.value == "Retail") {
      setSalesType("Retail")
    }
    else if (e.target.value == "Wholesale") {
      setSalesType("Wholesale")
    }
    else {
      setSalesType('')
    }
  }

  const handleSuspend = () => {
    setIsSaving(true)
    let payload = {
      customerId: selectedCustomer?.value,
      transDate: transDate,
      totalAmount: productGridData.reduce((total, item) => total + item.amount, 0),
      salesType: retailpriceTypeRef.current.checked == true ? "Retail" : "Wholesale",
      products: productGridData.map((product) => {
        return {
          name: product?.name,
          productId: product?.productId,
          batchNumber: product?.batchNumber,
          quantity: product?.quantity,
          expireDate: product?.expireDate.substring(0, 10),
          manufacturingDate: product?.manufacturingDate.substring(0, 10),
          unitPrice: product?.unitPrice,
          // priceType: salesType,
          priceType: retailpriceTypeRef.current.checked == true ? 'Retail' : 'Wholesale',
          amount: product?.amount
        }
      })
    }

    //  console.log(payload)

    axios.post(`/sales/suspend`, payload)
      .then((res) => {
        if (res.data.success) {
          setProductGridData([])
          setFormData({ quantity: '', amount: '', batchNumber: '', manuDate: '', expDate: '' })
          setSelectedProduct('')
          setInvoiceNo('')

          alertify.set("notifier", "position", "bottom-right");
          alertify.success("Suspended successfully");

          //delete proforma on suspend
          axios.delete(`/proforma/${id}`).then((res) => console.log(res))
          setReferenceData(res.data)

    
          let newNotification = {
            message: `${storage.name} completed a sale with reference ${res.data.reference}`,
            time: new Date().toISOString(), type:'success'
          }
          setNotifications([newNotification, ...notifications])

        }
        else {
          alertify.set("notifier", "position", "bottom-right");
          alertify.warning("Suspend unsuccessful");

          let newNotification = {
            id: Math.ceil(Math.random()*1000000),
            message: `${storage.name} Suspend unsuccessful`,
            time: new Date().toISOString(), type:'warning'
          }
          setNotifications([newNotification, ...notifications])
        }
      })
      .catch((error) => {
        alertify.set("notifier", "position", "bottom-right");
        alertify.error("Internal server error occured. Please contact admin");

        let newNotification = {
          id: Math.ceil(Math.random()*1000000),
          message: `${storage.name} Internal server error occured. Please contact admin.`,
          time: new Date().toISOString(), type:'error'
        }
        setNotifications([newNotification, ...notifications])
      })
      .finally(() => {
        setIsSaving(false)
        $('#reference').modal('show')
      }
      )

  }

  const handleAddItem = () => {

    let obj = {
      id: productGridData.length + 1,
      name: selectedProduct.label,
      productId: selectedProduct.value,
      batchNumber: formData.batchNumber?.value,
      quantity: formData.quantity,
      expireDate: formData.expDate.substring(0, 10),
      manufacturingDate: formData.manuDate.substring(0, 10),
      unitPrice: price,
      priceType: retailpriceTypeRef.current.checked == true ? 'Retail' : 'Wholesale',
      amount: formData.quantity * price
    }
    if (!obj.name) {
      alertify.set("notifier", "position", "bottom-right");
      alertify.warning("Please select a product.");
      let newNotification = {
        id: Math.ceil(Math.random()*1000000),
        message: `${storage.name} Please select a product`,
        time: new Date().toISOString(), type:'warning'
      }
      setNotifications([newNotification, ...notifications])
      $('#selectedProduct').css('border', '1px solid red')
      // setTimeout(() => {
      //   $('#selectedProduct').css('border', '1px solid rgba(145, 158, 171, 0.32)')
      // }, 3000)
    }

    else if (selectedCustomer == '' || selectedCustomer == null) {
      alertify.set("notifier", "position", "bottom-right");
      alertify.warning("Please select a customer.");
      let newNotification = {
        id: Math.ceil(Math.random()*1000000),
        message: `${storage.name} Please select a customer.`,
        time: new Date().toISOString(), type:'warning'
      }
      setNotifications([newNotification, ...notifications])
      $('#selectedCustomer').css('border', '1px solid red')
      // setTimeout(() => {
      //   $('#selectedCustomer').css('border', '1px solid rgba(145, 158, 171, 0.32)')
      // }, 3000)
    }

    else if ( obj.quantity == '') {
      alertify.set("notifier", "position", "bottom-right");
      alertify.warning("Please enter quantity.");
      let newNotification = {
        id: Math.ceil(Math.random()*1000000),
        message: `${storage.name} Please enter quantity.`,
        time: new Date().toISOString(), type:'warning'
      }
      setNotifications([newNotification, ...notifications])
      $('#quantity').css('border', '1px solid red')
      // setTimeout(() => {
      //   $('#quantity').css('border', '1px solid rgba(145, 158, 171, 0.32)')
      // }, 3000)
    }
    else {
      setProductGridData([...productGridData, obj])
      setFormData({ quantity: '', amount: '', batchNumber: '', manuDate: '', expDate: '' })
      setSelectedProduct({ remainingStock: '' })
      // retailpriceTypeRef.current.checked = false
      // wholesalepriceTypeRef.current.checked = false
      // specialpriceTypeRef.current.checked = false
      setWholesalePrice('')
      setSpecialPrice('')
      setRetailPrice('')
      setPrice(0)
    }


  }

  const handleProductSelect = (e) => {
    setSelectedProduct(e)
    setRetailPrice('(' + e.retailPrice + 'GHS)')
    setWholesalePrice('(' + e.wholeSalePrice + 'GHS)')
    setSpecialPrice('(' + e.specialPrice + 'GHS)')
    setIsBatchLoading(true)
    salesType == 'Retail' ? setPrice(e.retailPrice) : salesType == "Wholesale" ? setPrice(e.wholeSalePrice) : setPrice(e.specialPrice)
    //console.log(e)
  }

  const handleProductSelectEditMode = (e) => {
    setIsBatchLoading(true)
    setSelectedProductEditMode(e)
  }

  useEffect(() => {
    axios.get(`${BASE_URL}/purchase/product/${selectedProduct?.value}`).then((res) => {
      setIsLoading(true)
      if (res.data.success) {
        setIsLoading(false)
        setSelectedProductInfo(res.data.data)
        let x = res.data.data.batchNumber?.map((item) => {
          return { value: item.batchNumber, label: item?.batchNumber + '-(' + item?.Quantity + ')', expireDate: item?.expireDate, manufacturingDate: item?.manufacturingDate }
        })

        if (x.length > 0) {
          setFormData({ ...formData, batchNumber: x[0], manuDate: x[0].manufacturingDate, expDate: x[0].expireDate })
        }
        setIsBatchLoading(false)
        retailpriceTypeRef.current.checked = true
      }
    })
    $('#selectedProduct').css('border', '1px solid rgba(145, 158, 171, 0.32)')

  }, [selectedProduct])

  useEffect(() => {
    $('#quantity').css('border', '1px solid rgba(145, 158, 171, 0.32)')
  }, [formData.quantity])


  useEffect(() => {
    $('#selectedCustomer').css('border', '1px solid rgba(145, 158, 171, 0.32)')
  }, [selectedCustomer])

  useEffect(() => {
    setPaymentInfo({ ...paymentInfo, amountPaid: Number(paymentInfo.cashAmount) + Number(paymentInfo.chequeAmount) + Number(paymentInfo.momoAmount) })
  }, [paymentInfo.cashAmount, paymentInfo.chequeAmount, paymentInfo.momoAmount])


  useEffect(() => {
    if (!productsIsLoading && !customersIsLoading && !proformaIsLoading && !proformaDetailsLoading) {

      let mappedData = customers?.data.map((customer) => {
        return {
          value: customer?.id,
          label: customer?.name,
          customerType: customer?.customerType,
        }
      })
      setCustomerList(mappedData)
      let customer = mappedData.find((item) => item.value == proformaDetails?.data?.customerId)
      //console.log(customer)
      setSelectedCustomer(customer)


      let mappedData2 = products?.data.map((product) => {
        return {
          id: product?.id,
          value: product?.id,
          label: product?.name,
          retailPrice: product?.retailPrice,
          wholeSalePrice: product?.wholeSalePrice,
          specialPrice: product?.specialPrice,
          remainingStock: product?.stock_count,
          manuDate: product?.manufacturingDate,
          expDate: product?.expiryDate
        }
      })
      setProductsList(mappedData2)
      //retailRef.current.checked = true
      //retailpriceTypeRef.current.checked = true


    }
  }, [productsIsLoading, customersIsLoading, proformaIsLoading])

  if (isSaving) {
    return <LoadingSpinner message="Processing...please wait" />
  }


  if (productsIsLoading && customersIsLoading) {
    return <LoadingSpinner message="Loading...please wait" />
  }








  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Proforma Sale</h4>
            <h6>Sell your proforma </h6>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ width: '40%' }}>
            <div className="card" >
              <div className="card-body">
                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      <label> Date</label>
                      <div className="input-groupicon">
                        <input type="date" className="form-control" value={transDate} onChange={(e) => setTransDate(e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="form-group">
                      <label>Invoice no. (Hard Copy)</label>
                      <div className="input-groupicon">
                        <input type="text" placeholder="" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">

                  {/* <div className="col-12">
                    <div className="form-group">
                      <label>Sales Type</label>
                      <div className="row">
                          

                            <div className="col-lg-6">

                              <div className="input-group">
                                <div className="input-group-text">
                                  <input className="form-check-input" type="radio" ref={retailRef} name="salesType" value={'Retail'} onChange={handleSalesTypeChange}  />
                                </div>
                                <input type="text" className="form-control" aria-label="Text input with radio button" value={'Retail'} placeholder={`Retail`} />
                              </div>
                            
                            </div>

                            <div className="col-lg-6">
                              <div className="input-group">
                                <div className="input-group-text">
                                  <input className="form-check-input" type="radio" ref={wholesaleRef} name="salesType" value={'Wholesale'} onChange={handleSalesTypeChange} />
                                </div>
                                <input type="text" className="form-control" aria-label="Text input with radio button" value={'Wholesale'} placeholder={`Wholesale`} />
                              </div>
                            </div>

                            
                        </div>
                    </div>
                  </div> */}

                </div>
              </div>
            </div>

            <div className="card" >
              <div className="card-body">
                <div className="row">

                  <div className="col-12">
                    <div className="form-group">
                      <label>Customer</label>
                      <div className="row">
                        <div className="col-lg-12 col-sm-10 col-10">

                          <Select
                            id="selectedCustomer"
                            className="select"
                            options={customerList}
                            value={selectedCustomer}
                            onChange={(e) => setSelectedCustomer(e)}
                            isLoading={customersIsLoading}
                          // isDisabled
                          />

                        </div>

                      </div>
                    </div>
                  </div>

                  <div className="col-8">
                    <div className="form-group">
                      <label>Product Name</label>
                      <div className="input-groupicon">
                        <Select style={{ width: '100%' }}
                          id="selectedProduct"
                          options={productsList}
                          placeholder={'Select product'}
                          value={selectedProduct}
                          onChange={handleProductSelect}
                          isSearchable={true}
                          isLoading={productsIsLoading}

                        />

                      </div>
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group">
                      <label>Quantity Left</label>
                      <div className="input-groupicon">
                        <input

                          className="form-control"
                          type="text"
                          value={selectedProduct?.remainingStock}
                          disabled
                        />

                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                       <div style={{display:'flex', justifyContent: 'space-between'}}>
                          <label>Batch No.</label> 
                          {isBatchLoading && <div className="spinner-border text-primary me-1" role="status" style={{height:20, width:20}}>
                            <span className="sr-only">Loading...</span>
                          </div>}
                        </div>
                      <div className="input-groupicon">
                        <Select
                          isLoading={isLoading}
                          options={selectedProductInfo?.batchNumber?.map((item) => {
                            return { value: item.batchNumber, label: item?.batchNumber + '-(' + item?.Quantity + ')', expireDate: item?.expireDate, manufacturingDate: item?.manufacturingDate }
                          })}
                          placeholder=""
                          value={formData.batchNumber}
                          onChange={(e) => setFormData({ ...formData, batchNumber: (e), manuDate: e?.manufacturingDate, expDate: e?.expireDate })}
                        //onChange={(e) => console.log(e)}
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
                          value={formData?.manuDate.substring(0, 10)}
                          disabled

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
                          value={formData?.expDate.substring(0, 10)}
                          disabled

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
                              <input className="form-check-input" type="radio" ref={retailpriceTypeRef} name="priceType" value={selectedProduct?.retailPrice}
                                onChange={(e) => {
                                  setPrice(e.target.value)
                                  //setSalesType('Retail')
                                  //retailRef.current.checked = true
                                  //wholesaleRef.current.checked =false
                                  setDisableUnselectedPrice({ retail: false, wholesale: true, special: true })
                                }} />
                            </div>
                            <input type="text" className="form-control" aria-label="Text input with radio button" placeholder={`Retail ${retailprice}`} disabled={disabledUnselectedPrice.retail} />
                          </div>

                        </div>

                        <div className="col-lg-4">
                          <div className="input-group">
                            <div className="input-group-text">
                              <input className="form-check-input" type="radio" ref={wholesalepriceTypeRef} name="priceType" value={selectedProduct?.wholeSalePrice}
                                onChange={(e) => {
                                  setPrice(e.target.value)
                                  //setSalesType('Wholesale')
                                  //retailRef.current.checked = false
                                  //wholesaleRef.current.checked =true
                                  setDisableUnselectedPrice({ wholesale: false, retail: true, special: true })
                                }
                                } />
                            </div>
                            <input type="text" className="form-control" aria-label="Text input with radio button" placeholder={`Wholesale ${wholesaleprice}`} disabled={disabledUnselectedPrice.wholesale} />
                          </div>
                        </div>

                        <div className="col-lg-4">

                          <div className="input-group">
                            <div className="input-group-text">
                              <input className="form-check-input" type="radio" ref={specialpriceTypeRef} name="priceType" value={selectedProduct?.specialPrice} onChange={(e) => {
                                setPrice(e.target.value)
                                setDisableUnselectedPrice({ special: false, wholesale: true, retail: true })
                              }} />
                            </div>
                            <input type="text" className="form-control" aria-label="Text input with radio button" placeholder={`Special ${specialprice}`} disabled={disabledUnselectedPrice.special} />
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
                          id="quantity"
                          className="form-control"
                          type="text"
                          value={formData?.quantity}
                          onChange={(e) => {
                            if (e.target.value == '') {
                              setFormData({ ...formData, quantity: '' })
                            }
                            if (Number(e.target.value) > (selectedProduct?.remainingStock)) {
                              alertify.set("notifier", "position", "bottom-right");
                              alertify.warning('Quantity can not be greater than quantity in stock')
                            }
                            else if (isValidNumber(e.target.value)) {
                              setFormData({ ...formData, quantity: Number(e.target.value) })
                            }
                          }}
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
                          type="text"
                          value={formData.quantity ? formData.quantity * price : price * 1}
                        />

                      </div>
                    </div>
                  </div>



                  {/* <div className="col-6">
                  <div className="form-group">
                    <label>Balance</label>
                    <div className="input-groupicon">
                      <input
                        className="form-control"
                        type="number"
                      />
                      
                    </div>
                  </div>
                </div> */}

                  <div className="col-12" style={{ display: 'flex', justifyContent: 'flex-end' }}>

                    <label></label>
                    <Link to="#" className="btn btn-submit me-2" style={{ width: '100%', textAlign: 'center', marginTop: 8 }} onClick={handleAddItem}>
                      <FeatherIcon icon="shopping-cart" /> {" Add to Basket"}
                    </Link>


                  </div>
                </div>

              </div>

            </div>


          </div>



          <div style={{ width: '60%', height: 'auto' }}>
            <div className="card" >
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="row" >
                      <div className="table-responsive mb-3" style={{ height: 480, maxHeight: 500, overflow: 'auto' }}>
                        <table className="table">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Product Name</th>
                              <th>Batch #</th>
                              <th>Exp Date</th>
                              <th>QTY</th>
                              <th>Price</th>
                              <th>Subtotal</th>
                              <th>Action</th>
                              <th />
                            </tr>
                          </thead>
                          <tbody>
                            {
                              productGridData?.map((item, i) => {
                                return (
                                  <tr>
                                    <td>{i + 1}</td>
                                    <td>
                                      <Link to="#">{item.name}</Link>
                                    </td>
                                    <td>{item.batchNumber}</td>
                                    <td>{item?.expireDate.substring(0, 10)}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.unitPrice}</td>
                                    <td>{item.amount}</td>

                                    <td>
                                      <Link to="#" className="delete-set me-2" data-bs-toggle="modal" data-bs-target="#editproduct" onClick={() => handleEdit(item)}>
                                        <img src={EditIcon} alt="svg" />
                                      </Link>
                                      <Link to="#" className="delete-set" onClick={() => deleteRow(item)}>
                                        <img src={DeleteIcon} alt="svg" />
                                      </Link>
                                    </td>
                                  </tr>
                                )
                              })
                            }


                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-6 ">
                        <div className="total-order w-100 max-widthauto m-auto mb-4">
                          <ul>
                            <li>
                              <h4>Amount Given</h4>
                              <h5>GHS {moneyInTxt(paymentInfo?.amountPaid)} </h5>
                            </li>
                            <li>
                              <h4>Discount </h4>
                              <h5>GHS 0.00</h5>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="col-lg-6 ">
                        <div className="total-order w-100 max-widthauto m-auto mb-4">
                          <ul>
                            <li className="total">
                              <h4>Grand Total</h4>
                              <h5>GHS {moneyInTxt(productGridData.reduce((total, item) => total + item.amount, 0))}</h5>
                            </li>
                            <li style={{ border: Number(productGridData.reduce((total, item) => total + item.amount, 0)) - Number(paymentInfo.amountPaid) > 0 ? '2px solid red' : Number(productGridData.reduce((total, item) => total + item.amount, 0)) - Number(paymentInfo.amountPaid) < 0 ? '2px solid green' : null }}>
                              <h4>Balance</h4>
                              <h5>GHS {moneyInTxt(Math.abs(Number(productGridData.reduce((total, item) => total + item.amount, 0)) - Number(paymentInfo.amountPaid)))}</h5>
                            </li>

                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-12" >
                        <span className="btn btn-submit me-2" onClick={handleSuspend} style={{ width: '100%' }}>
                          <FeatherIcon icon="pause" />
                          Suspend Sale
                        </span>
                      </div>
                    </div>

                    <div className="row mt-2">
                      <div className="col-lg-12" style={{ display: 'flex', justifyContent: 'space-between' }} >
                        <button className="btn btn-info me-2" data-bs-toggle="modal" data-bs-target="#payment" onClick={() => setTransactionType("SP")} style={{ width: '20%' }}>
                          Sell and Print
                        </button>
                        <button className="btn btn-warning me-2" data-bs-toggle="modal" data-bs-target="#payment" onClick={() => setTransactionType("SO")} style={{ width: '20%' }}>
                          Sell Only
                        </button>
                        <button className="btn btn-danger me-2" data-bs-toggle="modal" data-bs-target="#payment" style={{ width: '20%' }} onClick={() => setTransactionType("CP")} >
                          Credit and Print
                        </button>
                        <button className="btn btn-cancel" data-bs-toggle="modal" data-bs-target="#payment" style={{ width: '20%' }} onClick={() => setTransactionType("CO")}>
                          Credit Only
                        </button>

                      </div>
                    </div>
                  </div>



                </div>
              </div>
            </div>


          </div>


        </div>

      </div>

      {/* Modal Edit */}
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

            {isLoadingDetails ? <LoadingOutlined style={{ color: "green", margin: 50 }} /> :
              (<div className="modal-body">
                <div className="row">

                  <div className="col-12">
                    <div className="form-group">
                      <label>Product Name</label>
                      <div className="input-groupicon">
                        <Select style={{ width: '100%' }}
                          options={productsList}
                          placeholder={'Select product'}
                          value={selectedProductEditMode}
                          onChange={handleProductSelectEditMode}
                          isSearchable={true}
                          isLoading={productsIsLoading}

                        />

                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group">
                      <div style={{display:'flex', justifyContent: 'space-between'}}>
                          <label>Batch No.</label> 
                         
                        </div>
                      <div className="input-groupicon">
                        <Select
                          options={selectedProductInfoEditMode?.batchNumber?.map((item) => {
                            return { value: item.batchNumber, label: item?.batchNumber + '-(' + item?.Quantity + ')', expireDate: item?.expireDate, manufacturingDate: item?.manufacturingDate }
                          })}
                          placeholder=""
                          value={editFormData.batchNumber}
                          onChange={(e) => setEditFormData({ ...editFormData, batchNumber: (e), manufacturingDate: e.manufacturingDate, expireDate: e.expireDate })}
                        //onChange={(e) => console.log(e)}
                        />

                      </div>
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
                            setEditFormData({ ...editFormData, quantity: e.target.value, amount: unitP * qty || unitP * 1 })
                          }
                        }
                        } />
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
                          setEditFormData({ ...editFormData, unitPrice: e.target.value, amount: unitP * qty || unitP * 1 })
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
              </div>)}
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

      {/*  Modal Payment  */}
      <div className="modal fade"
        id="payment"
        tabIndex={-1}
        aria-labelledby="payment"
        aria-hidden="true">

        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Payment Details </h5>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setPaymentInfo(init)}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">

              <div className="payment-div" >
                <ul className="nav nav-tabs">
                  <li className="nav-item" onClick={() => setActiveTab('Cash')}>
                    <a className={activeTab == 'Cash' ? `nav-link active` : `nav-link`} href="javascript:void(0);">Cash</a>
                  </li>

                  <li className="nav-item" onClick={() => setActiveTab('Cheque')}>
                    <a className={activeTab == 'Cheque' ? `nav-link active` : `nav-link`} href="javascript:void(0);">Cheque</a>
                  </li>

                  <li className="nav-item" onClick={() => setActiveTab('Momo')}>
                    <a className={activeTab == 'Momo' ? `nav-link active` : `nav-link`} href="javascript:void(0);">Mobile Money</a>
                  </li>

                </ul>


                {activeTab == 'Cash' ? <div id="cash-tab" style={{ marginTop: 20 }}>
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group">
                        <label>Waybill</label>
                        <div className="input-groupicon">
                          <input
                            type="text"
                            placeholder=""
                            value={paymentInfo.cashWaybill}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, cashWaybill: e.target.value })}
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
                            value={paymentInfo.cashAmount}
                            onChange={(e) => {
                              if (e.target.value == '') {
                                setPaymentInfo({ ...paymentInfo, cashAmount: '' })
                              }
                              else if (isValidNumber(e.target.value)) {
                                setPaymentInfo({ ...paymentInfo, cashAmount: Number(e.target.value) })
                              }

                            }}
                          />

                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="form-group">
                        <label>Receipt No </label>
                        <div className="input-groupicon">
                          <input
                            type="text"
                            placeholder=""
                            value={paymentInfo.cashReceiptNo}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, cashReceiptNo: e.target.value })}
                          />

                        </div>
                      </div>
                    </div>

                  </div>
                </div> : null}
                {activeTab == 'Cheque' ? <div id="cheque-tab" style={{ marginTop: 20 }}>
                  <div className="row">

                    <div className="col-6">
                      <div className="form-group">
                        <label>Waybill</label>
                        <div className="input-groupicon">
                          <input
                            type="text"
                            placeholder=""
                            value={paymentInfo.chequeWaybill}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, chequeWaybill: e.target.value })}
                          />

                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="form-group">
                        <label>Cheque No</label>
                        <div className="input-groupicon">
                          <input
                            type="text"
                            placeholder=""
                            value={paymentInfo.chequeNo}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, chequeNo: e.target.value })}
                          />

                        </div>
                      </div>
                    </div>


                    <div className="col-6">
                      <div className="form-group">
                        <label>Receipt No</label>
                        <div className="input-groupicon">
                          <input
                            type="text"
                            placeholder=""
                            value={paymentInfo.chequeReceiptNo}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, chequeReceiptNo: e.target.value })}
                          />

                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="form-group">
                        <label>Due Date</label>
                        <div className="input-groupicon">
                          <input
                            type="date"
                            placeholder=""
                            className="form-control"
                            value={paymentInfo.dueDate}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, dueDate: e.target.value })}
                          />

                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="form-group">
                        <label>Bank</label>
                        <div className="input-groupicon">
                          <input
                            type="text"
                            placeholder=""
                            value={paymentInfo.bank}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, bank: e.target.value })}
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
                            value={paymentInfo.chequeAmount}
                            onChange={(e) => {
                              if (e.target.value == '') {
                                setPaymentInfo({ ...paymentInfo, chequeAmount: '' })
                              }
                              else if (isValidNumber(e.target.value)) {
                                setPaymentInfo({ ...paymentInfo, chequeAmount: Number(e.target.value) })
                              }

                            }}
                          />

                        </div>
                      </div>
                    </div>
                  </div>

                </div> : null}
                {activeTab == 'Momo' ? <div id="momo-tab" style={{ marginTop: 20 }}>
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group">
                        <label>Receipt No</label>
                        <div className="input-groupicon">
                          <input
                            type="text"
                            placeholder=""
                            value={paymentInfo.momoReceiptNo}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, momoReceiptNo: e.target.value })}
                          />

                        </div>
                      </div>
                    </div>


                    <div className="col-6">
                      <div className="form-group">
                        <label>Name</label>
                        <div className="input-groupicon">
                          <input
                            type="text"
                            placeholder=""
                            value={paymentInfo.momoName}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, momoName: e.target.value })}
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
                            value={paymentInfo.momoAmount}
                            onChange={(e) => {
                              if (e.target.value == '') {
                                setPaymentInfo({ ...paymentInfo, momoAmount: '' })
                              }
                              else if (isValidNumber(e.target.value)) {
                                setPaymentInfo({ ...paymentInfo, momoAmount: Number(e.target.value) })
                              }

                            }}
                          />

                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="form-group">
                        <label>Transaction ID</label>
                        <div className="input-groupicon">
                          <input
                            type="text"
                            placeholder=""
                            value={paymentInfo.transactionID}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, transactionID: e.target.value })}
                          />

                        </div>
                      </div>
                    </div>
                  </div>

                </div> : null}
              </div>

            </div>
            <div className="modal-footer" style={{ justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-submit" onClick={handlePayment}>
                Complete Transaction
              </button>
            </div>
          </div>
        </div>


      </div>


      {/* Reference Modal */}
      <div
        className="modal fade"
        id="reference"
        tabIndex={-1}
        aria-labelledby="reference"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Reference Number - <span style={{ fontSize: 40 }}>{referenceData?.reference}</span> </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">

              <table>
                <tr>
                  <td> <span>Amount to Pay:</span></td>
                  <td> <span style={{ fontSize: 40 }}> GHS {recieptData?.amountToPay || referenceData.amountToPay}</span></td>
                </tr>
                <tr>
                  <td> <span>Amount Paid:</span></td>
                  <td> <span style={{ fontSize: 40 }}> GHS {recieptData?.amountPaid || 0}</span></td>
                </tr>
                <tr>
                  <td><span>Balance:</span></td>
                  <td><span style={{ fontSize: 40 }}> GHS {(recieptData?.balance) || 0}</span></td>
                </tr>
                <tr>
                  <td><span>Change:</span> </td>
                  <td><span style={{ fontSize: 40 }}> GHS {(recieptData?.change) || 0}</span></td>
                </tr>
              </table>
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
            <div className="modal-dialog modal-xl modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Sales Receipt</h5>
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
                  <iframe width='100%' height='800px' src={receiptFile}></iframe>            
                </div>
                
              </div>
            </div>
      </div>
    
    </div>

  );
};

export default ProformaSales;
