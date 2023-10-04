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
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import alertify from "alertifyjs";
import "../../../node_modules/alertifyjs/build/css/alertify.css";
import "../../../node_modules/alertifyjs/build/css/themes/semantic.css";
import { socket } from "../../InitialPage/Sidebar/Header";
import useAuth from "../../hooks/useAuth";
import { NotificationsContext } from "../../InitialPage/Sidebar/DefaultLayout";

const Addsales = () => {
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
  const [selectedProductInfo, setSelectedProductInfo] = useState()
  const [selectedProductInfoEditMode, setSelectedProductInfoEditMode] = useState()
  const [price, setPrice] = useState(0)
  const [retailprice, setRetailPrice] = useState('')
  const [wholesaleprice, setWholesalePrice] = useState('')
  const [specialprice, setSpecialPrice] = useState('')
  const [formData, setFormData] = useState({ quantity: '', amount: '', batchNumber: '', manuDate: '', expDate: '' })
  const [editFormData, setEditFormData] = useState({ name: '', quantity: '', amount: '', batchNumber: '', manuDate: '', expDate: '' })
  const [salesType, setSalesType] = useState('Retail')
  const [productGridData, setProductGridData] = useState([])
  const [transDate, setTransDate] = useState(new Date().toISOString().substring(0, 10))
  const [invoiceNo, setInvoiceNo] = useState('')
  const retailpriceTypeRef = useRef()
  const specialpriceTypeRef = useRef()
  const wholesalepriceTypeRef = useRef()
  const [referenceData, setReferenceData] = useState({ data: [], reference: '', amountToPay: '', balance:'' })
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [paymentInfo, setPaymentInfo] = useState(init)
  const [transactionType, setTransactionType] = useState('SP')
  const [recieptData, setReceiptData] = useState({})
  const [receiptFile, setReceiptFile] = useState(null)
  const [isBatchLoading, setIsBatchLoading] = useState(false)
  const [userType, setUserType] = useState('')

  const retailRef = useRef()
  const wholesaleRef = useRef()

  const { data: customers, isLoading: customersIsLoading } = useGet("customers", "/customer/combo");
  const { data: products, isLoading: productsIsLoading } = useGet("products", "/product");
  // const { isLoading, data, isError, error, mutate } = usePost("/sales/suspend");

  const {auth} = useAuth()

  
  const { notifications, setNotifications } = useContext(NotificationsContext)
  let storage = JSON.parse(localStorage.getItem("auth"))

   //add customer states
   const [customerType, setCustomerType] = useState(0)
   const validationSchema = Yup.object().shape({
     name: Yup.string().required("Customer name is required"),
     contact: Yup.string().required("Phone number is required"),
   });
 
   const {register,handleSubmit,reset,formState: { errors, isSubmitSuccessful }} = useForm({
     defaultValues: {
       name: "",
       email: "",
       contact: "",
       otherContact: "",
       location: "",
       customerType: 0,
       gpsAddress:""
       
     },
     resolver: yupResolver(validationSchema),
   });
 

   useEffect(() => {
    let userRole = localStorage.getItem('auth')
    let obj =JSON.parse(userRole)
    console.log("Role:", obj.role)
    setUserType(obj.role)
  }, [])

  const axios = useCustomApi()

    //save adhoc customer
  const onSubmit = (data) => {
      let payload = {...data, customerType}
  
      axios.post(`/customer`,  payload)
      .then((res) => {
       // console.log(res.data)
        if(res.data.success){
          let addedCustomer =  {
              id: res.data.data?.id,
              label: res.data.data?.name,
              value: res.data.data?.id,
              customerType: res.data.data?.customerType,
    
            }
            setCustomerList([addedCustomer,...customerList])
            reset();

            alertify.set("notifier", "position", "bottom-right");
            alertify.success("Customer added successfully.");
      $('.modal').modal('hide')
        }
        else{
          alertify.set("notifier", "position", "bottom-right");
          alertify.error("Error...Could not save customer.");

          let newNotification = {
            id: Math.ceil(Math.random()*1000000),
            message: `${storage.name} Error..could not save customer`,
            time: new Date().toISOString(),  type: 'error'
          }
          setNotifications([newNotification, ...notifications])
        }
        
      })
    };

  const deleteRow = (record) => {
    //console.log(record)
    // console.log(productGridData)
    let newGridData = productGridData.filter((item) => item.id !== record.id)
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

  const processPayment = (type, print) => {

    if (productGridData.length < 1) {
      alertify.set("notifier", "position", "bottom-right");
      alertify.warning("Please add at least one item to list before saving.");

      let newNotification = {
        id: Math.ceil(Math.random()*1000000),
        message: `${storage.name} Please add at least one item to list before saving.`,
        time: new Date().toISOString(), type: 'warning'
      }
      setNotifications([newNotification, ...notifications])
    }
    // else if ((paymentInfo.amountPaid == '' || paymentInfo.amountPaid < 1 || paymentInfo.amountPaid == null) && (transactionType == 'CP' || transactionType == 'CO') ) {
    //   alertify.set("notifier", "position", "bottom-right");
    //   alertify.message("Please provide payment amount before saving.");
    // }

    else if( (transactionType == 'SP' || transactionType == 'SO') && paymentInfo.amountPaid < (productGridData.reduce((total, item) => total + item.amount, 0))){
      alertify.set("notifier", "position", "bottom-right");
      alertify.warning("Please provide full payment amount before saving.");

      let newNotification = {
        id: Math.ceil(Math.random()*1000000),
        message: `${storage.name} Please provide full payment amount before saving.`,
        time: new Date().toISOString(),  type: 'warning'
      }
      setNotifications([newNotification, ...notifications])
    }
    else {
      $('#payment').modal('hide')
      //handle the suspend first and then use the reference to process payment
      setIsSaving(true)
      let payload = {
        customerId: selectedCustomer?.value,
        transDate: transDate,
        // totalAmount: (Number(paymentInfo.cashAmount) + Number(paymentInfo.momoAmount) + Number(paymentInfo.chequeAmount)) ,
        totalAmount: productGridData.reduce((total, item) => total + item.amount, 0),
        // salesType: salesType,
        // salesType: retailpriceTypeRef.current.checked == true ? "Retail" : "Wholesale",
        products: productGridData.map((item) => {
          return {
            "productId": item.productId,
            "name": item.name,
            "batchNumber": item.batchNumber,
            "manufacturingDate": item.manufacturingDate,
            "expireDate": item.expireDate,
            "quantity": item.quantity,
            "unitPrice": item.unitPrice,
            "priceType": item.priceType,
            "amount": item.amount
          }
        })
      }

      axios.post(`/sales/suspend`, payload)
        .then((res) => {
          if (res.data.success) {
            //console.log("Sales Ref", res.data)
            setProductGridData([])
            setFormData({ quantity: '', amount: '', batchNumber: '', manuDate: '', expDate: '' })
            setSelectedProduct({ remainingStock: '', wholeSalePrice:'', retailPrice:'', specialPrice:'' })
            setInvoiceNo('')
            setReferenceData(res.data)

            //emit suspend
            socket.emit("suspend", {room: auth?.branchId})

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
            let payload = {
              status: type,
              salesRef: res.data.reference,
              amount: (Number(paymentInfo.cashAmount) + Number(paymentInfo.momoAmount) + Number(paymentInfo.chequeAmount)) ,
              // amount: productGridData.reduce((total, item) => total + item.amount, 0),
              paymentType: pType,
              paymentInfo: [
                { "type": "Cash", waybill: paymentInfo.cashWaybill, amountPaid: paymentInfo.cashAmount },
                { "type": "Momo", name: paymentInfo.momoName, receiptNo: paymentInfo.momoReceiptNo, amountPaid: paymentInfo.momoAmount },
                { "type": "Cheque", waybill: paymentInfo.chequeWaybill, chequeNo: paymentInfo.chequeNo, chequeReceiptNo: paymentInfo.chequeReceiptNo, amountPaid: paymentInfo.chequeAmount, waybill: paymentInfo.chequeWaybill }
              ]
            }


            axios.post('/sales', payload)
              .then((res) => {
                if (res.data.success) {
                 // console.log("Receipt:", res.data)
                  setReceiptData((prev) => ({
                    
                    ...prev,
                    amountPaid:res.data.data?.amountPaid,
                    balance: res.data.data.balance,
                    change: res.data.data.change,
                    amountToPay: res.data.data.result?.totalAmount
                  }))
                  if (print) {
                    getInvoiceReceipt(payload.salesRef)
                  }
                  alertify.set("notifier", "position", "bottom-right");
                  alertify.success("Sale completed.");

                  let newNotification = {
                    message: `${storage.name} completed a sale with reference ${payload.salesRef}`,
                    time: new Date().toISOString(),  type: 'success'
                  }
                  setNotifications([newNotification, ...notifications])
                  retailpriceTypeRef.current.checked = true
                  setSelectedCustomer(customerList[0])

                }
              })
              .catch((error) => {
                alertify.set("notifier", "position", "bottom-right");
                alertify.error(error.response.data.error);

                let newNotification = {
                  id: Math.ceil(Math.random()*1000000),
                  message: `${storage.name} Error...Could not complete transaction`,
                  time: new Date().toISOString(),  type: 'error'
                }
                setNotifications([newNotification, ...notifications])
              })
              .finally(() => {
                //setSelectedCustomer(customerList[0])
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
                // setTimeout(() => {
                //   $('.modal').modal('hide')
                // }, 1500)
               
              })

          }
          else {
            alertify.set("notifier", "position", "bottom-right");
            alertify.error("Unsuccessful, please try again");

            let newNotification = {
              id: Math.ceil(Math.random()*1000000),
              message: `${storage.name} Unsuccessful, please try saving sales again`,
              time: new Date().toISOString(),  type: 'error'
            }
            setNotifications([newNotification, ...notifications])
          }
        })
        .catch((error) => {
          // alertify.set("notifier", "position", "bottom-right");
          // alertify.error("Internal server error occured. Please contact admin");

          let newNotification = {
            id: Math.ceil(Math.random()*1000000),
            message: `${storage.name} Internal server error occured. Please contact admin`,
            time: new Date().toISOString(),  type: 'error'
          }
          setNotifications([newNotification, ...notifications])
        })
        .finally(() => {
          setIsSaving(false)
          //retailRef.current.checked = true
          $('#reference').modal('show')
        }
        )

    }

  }

  const handlePayment = () => {
    if(transactionType == "SP"){
      processPayment("Paid", true)
    }
    if(transactionType == "SO"){
      processPayment("Paid", false)
    }
    if(transactionType == "CP"){
      processPayment("Credit", true)
    }
    if(transactionType == "CO"){
      processPayment("Credit", false)
    }
    
  }

  const getInvoiceReceipt = (salesref) => {
    axios.get('/sales/getSaleReceipt/' + salesref)
      .then((res) => {
        
        let base64 = res.data.base64
        const blob = base64ToBlob(base64, 'application/pdf');
        const blobFile = `data:application/pdf;base64,${base64}`
        const url = URL.createObjectURL(blob);
        setReceiptFile(blobFile)
        //window.open(url, "_blank", "width=600, height=600", 'modal=yes');
        // var newWindow = window.open(url, "_blank", "width=800, height=800");  
        //pdfWindow.document.write("<iframe width='100%' height='100%' src='" + url + "'></iframe>");
        
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

  const handleSuspend = () => {

    if (productGridData.length < 1) {
      alertify.set("notifier", "position", "bottom-right");
      alertify.warning("Please add at least one item to list before saving.");

      let newNotification = {
        id: Math.ceil(Math.random()*1000000),
        message: `${storage.name} Please add at least one item to list before saving.`,
        time: new Date().toISOString(),  type: 'warning'
      }
      setNotifications([newNotification, ...notifications])
    }
    else {
      setIsSaving(true)
      let payload = {
        customerId: selectedCustomer?.value,
        transDate: transDate,
        totalAmount: productGridData.reduce((total, item) => total + item.amount, 0),
        // salesType: salesType,
        // salesType: retailpriceTypeRef.current.checked == true ? "Retail" : "Wholesale", 
        products: productGridData.map((item) => {
          return {
            "productId": item.productId,
            "name": item.name,
            "batchNumber": item.batchNumber,
            "manufacturingDate": item.manufacturingDate,
            "expireDate": item.expireDate,
            "quantity": item.quantity,
            "unitPrice": item.unitPrice,
            "priceType": item.priceType,
            "amount": item.amount
          }
        })
      }

      axios.post(`/sales/suspend`, payload)
        .then((res) => {
    
          if (res.data.success) {
            setProductGridData([])
            setFormData({ quantity: '', amount: '', batchNumber: '', manuDate: '', expDate: '' })
            setSelectedProduct({ remainingStock: '', wholeSalePrice:'', retailPrice:'', specialPrice:'' })
            setInvoiceNo('')

            alertify.set("notifier", "position", "bottom-right");
            alertify.success("Suspended successfully");
            //setSelectedCustomer(customerList[0])
           
       
            setReferenceData(res.data)
                  let newNotification = {
                    message: `${storage.name} suspended a sale with reference ${res.data.reference}`,
                    time: new Date().toISOString(),  type: 'success'
                  }
                  setNotifications([newNotification, ...notifications])

            //emit suspend
            socket.emit("suspend", {room: auth?.branchId})

          }
          else {
            alertify.set("notifier", "position", "bottom-right");
            alertify.message("Suspend unsuccessful");
           
            let newNotification = {
              message: `${storage.name} encountered an error with Suspend`,
              time: new Date().toISOString(),  type: 'error'
            }
            setNotifications([newNotification, ...notifications])
          }
        })
        .catch((error) => {
          alertify.set("notifier", "position", "bottom-right");
          alertify.error(error.response.data.error);
          console.log("Errror", error)
          let newNotification = {
            message: `${storage.name} ${error.response.data.error};`,
            time: new Date().toISOString(),  type: 'error'
          }
          setNotifications([newNotification, ...notifications])
        })
        .finally(() => {
          setIsSaving(false)
          $('#reference').modal('show')
          if(customerList){
            setSelectedCustomer(customerList[0])
          }
           retailpriceTypeRef.current.checked = true
        }
        )
    }
  }
  const handleAddItem = () => {
    
    //console.log(selectedProduct)
    let obj = {
      id: productGridData.length + 1,
      name: selectedProduct.label,
      productId: selectedProduct.value,
      batchNumber: formData.batchNumber?.value,
      quantity: formData.quantity,
      expireDate: formData?.expDate.substring(0, 10),
      manufacturingDate: formData?.manuDate.substring(0, 10),
      unitPrice: price,
      // priceType: salesType,
      priceType: retailpriceTypeRef.current.checked == true ? 'retail' : 'wholesale',
      amount: formData.quantity * price
    }
    // if (obj.amount < 1 || obj.unitPrice == '' || obj.name == '' || obj.quantity == '' || selectedCustomer == null) { 
    //   alertify.set("notifier", "position", "bottom-right");
    //   alertify.message("Please make sure all fields are filled.");
    // }
    
    if (!obj.name) {
      alertify.set("notifier", "position", "bottom-right");
      alertify.message("Please select a product.");
      let newNotification = {
        id: Math.ceil(Math.random()*1000000),
        message: `${storage.name} Please select a product`,
        time: new Date().toISOString(),  type: 'warning'
      }
      setNotifications([newNotification, ...notifications])
      $('#selectedProduct').css('border', '1px solid red')
      // setTimeout(() => {
      //   $('#selectedProduct').css('border', '1px solid rgba(145, 158, 171, 0.32)')
      // }, 3000)
    }

    else if (selectedCustomer == '' || selectedCustomer == null) {
      alertify.set("notifier", "position", "bottom-right");
      alertify.message("Please select a customer.");
      let newNotification = {
        id: Math.ceil(Math.random()*1000000),
        message: `${storage.name} Please select a customer.`,
        time: new Date().toISOString(),  type: 'warning'
      }
      setNotifications([newNotification, ...notifications])
      $('#selectedCustomer').css('border', '1px solid red')
      // setTimeout(() => {
      //   $('#selectedCustomer').css('border', '1px solid rgba(145, 158, 171, 0.32)')
      // }, 3000)
    }

    else if ( obj.quantity == '') {
      alertify.set("notifier", "position", "bottom-right");
      alertify.message("Please enter quantity.");
      let newNotification = {
        id: Math.ceil(Math.random()*1000000),
        message: `${storage.name} Please enter quantity.`,
        time: new Date().toISOString(),  type: 'warning'
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
      setSelectedProduct({ remainingStock: '', wholeSalePrice:'', retailPrice:'', specialPrice:'' })
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
    salesType == 'Retail' ? setPrice(e.retailPrice) : salesType == "Wholesale" ? setPrice(e.wholeSalePrice) : setPrice(e.specialPrice)
    setIsBatchLoading(true)
  }

  useEffect(() => {
    // console.log("Selected Prod", selectedProduct)

    axios.get(`${BASE_URL}/purchase/product/${selectedProduct?.value}`).then((res) => {
      setIsLoading(true)
      if (res.data.success) {
        setIsLoading(false)
        //console.log(res.data.newProduct)
        setSelectedProductInfo(res.data.newProduct)
        setSelectedProductInfoEditMode(res.data.newProduct)
        let x = res.data.newProduct.batchNumber?.map((item) => {
          return { value: item.batchNumber, label: item?.availablequantity == 0 ? item?.batchNumber + '-(' + item?.Quantity + ')': item?.batchNumber + '-(' + item?.availablequantity + ')', expireDate: item?.expireDate, manufacturingDate: item?.manufacturingDate }
        })
        setIsBatchLoading(false)
         setFormData({ ...formData, batchNumber: x[0], manuDate: (x[0]?.manufacturingDate).substring(0,10), expDate: (x[0]?.expireDate).substring(0,10) })
         setEditFormData({...editFormData, batchNumber: x[0], manuDate: (x[0]?.manufacturingDate).substring(0,10), expDate: (x[0]?.expireDate).substring(0,10)})
        //retailpriceTypeRef.current.checked = true
      }
    })
    $('#selectedProduct').css('border', '1px solid rgba(145, 158, 171, 0.32)')

  }, [selectedProduct])

  useEffect(() => {
    setPaymentInfo({ ...paymentInfo, amountPaid: Number(paymentInfo.cashAmount) + Number(paymentInfo.chequeAmount) + Number(paymentInfo.momoAmount) })
  }, [paymentInfo.cashAmount, paymentInfo.chequeAmount, paymentInfo.momoAmount])

  useEffect(() => {
    $('#quantity').css('border', '1px solid rgba(145, 158, 171, 0.32)')
  }, [formData.quantity])

 



  useEffect(() => {
    if(selectedCustomer && selectedCustomer?.label.includes('Retail')){
      retailpriceTypeRef.current.checked = true
      wholesalepriceTypeRef.current.disabled = true
      retailpriceTypeRef.current.disabled = false
      if(selectedProduct != null || selectedProduct != '' || selectedProduct != {}){
        setSalesType('Retail')
      }
       
      setDisableUnselectedPrice({ wholesale: true, retail: false, special: true })
    }
    else if(selectedCustomer && selectedCustomer?.label.includes('Whole')){
      wholesalepriceTypeRef.current.checked = true
      retailpriceTypeRef.current.disabled = true
      wholesalepriceTypeRef.current.disabled = false
      if(selectedProduct != null || selectedProduct != '' || selectedProduct != {}){
        setSalesType('Wholesale')
      }
    
     

      setDisableUnselectedPrice({ wholesale: false, retail: true, special: true })
    }
    else if(selectedCustomer == null || selectedCustomer == undefined){
      setPrice(0)
    }

    else if(selectedCustomer && (!selectedCustomer?.label.includes('Whole')) && (!selectedCustomer?.label.includes('Retail'))){
      console.log('Not a wholesale nor Retail')
        wholesalepriceTypeRef.current.disabled = false
        retailpriceTypeRef.current.disabled = false
  
        setDisableUnselectedPrice({ wholesale: false, retail: false, special: false })
    }

    
    $('#selectedCustomer').css('border', '1px solid rgba(145, 158, 171, 0.32)')
  }, [selectedCustomer])


  useEffect(() => {
    salesType == 'Retail' ? setPrice(selectedProduct.retailPrice) : salesType == "Wholesale" ? setPrice(selectedProduct.wholeSalePrice) : setPrice(selectedProduct.specialPrice)
  }, [salesType])


  useEffect(() => {
    if (!productsIsLoading && !customersIsLoading) {

      let mappedData = customers?.data.map((customer) => {
        return {
          value: customer?.id,
          label: customer?.name,
          customerType: customer?.customerType,
        }
      })
      setCustomerList(mappedData)
      //console.log(customerList[0])
    
    


      let mappedData2 = products?.data.map((product) => {
        return {
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
      retailpriceTypeRef.current.checked = true

    }
  }, [productsIsLoading, customersIsLoading])

  useEffect(() => {
    //console.log(customerList[0])
    setSelectedCustomer(customerList[0])
  }, [customerList])

  if (productsIsLoading && customersIsLoading) {
    return <LoadingSpinner message="Loading...please wait" />
  }

  if (isSaving) {
    return <LoadingSpinner message="Processing...please wait" />
  }




  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Add Sale</h4>
            <h6>Add your new sale</h6>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ width: '40%', height: 'auto' }}>
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

                {/* <div className="row">

                  <div className="col-12">
                    <div className="form-group">
                      <label>Sales Type</label>
                      <div className="row">


                        <div className="col-lg-6">

                          <div className="input-group">
                            <div className="input-group-text">
                              <input className="form-check-input" type="radio" ref={retailRef} name="salesType" value={'Retail'} onChange={handleSalesTypeChange} />
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
                  </div>

                </div> */}
              </div>
            </div>

            <div className="card" >
              <div className="card-body">
                <div className="row">

                  <div className="col-12">
                    <div className="form-group">
                      <label>Customer</label>
                      <div className="row">
                        <div className="col-lg-10 col-sm-10 col-10">

                          <Select
                            id="selectedCustomer"
                            className="select"
                            options={customerList}
                            value={selectedCustomer}
                            onChange={(e) => {
                              setSelectedCustomer(e)}}
                            isLoading={customersIsLoading}
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
                          id = 'quantityLeft'
                          className="form-control"
                          type="text"
                          value={selectedProductInfo?.totalCount}
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
                            return { value: item.batchNumber, label: item?.availablequantity == 0 ? item?.batchNumber + '-(' + item?.Quantity + ')': item?.batchNumber + '-(' + item?.availablequantity + ')', expireDate: item?.expireDate, manufacturingDate: item?.manufacturingDate }
                          })}
                          placeholder=""
                          value={formData.batchNumber}
                          onChange={(e) => setFormData({ ...formData, batchNumber: (e), manuDate: e.manufacturingDate, expDate: e.expireDate })}
                        //onChange={(e) => console.log(e)}
                        />

                      </div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="form-group">
                      <label>Manufacturing Date</label>
                      <div className="input-groupicon">
                        <input type="date" className="form-control" value={formData?.manuDate} disabled/>
                        {/* <DatePicker
                          selected={startDate}
                          value={formData?.manuDate.substring(0, 10)}
                          disabled

                        />
                        <Link className="addonset">
                          <img src={Calendar} alt="img" />
                        </Link> */}
                      </div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="form-group">
                      <label>Exp. Date</label>
                      <div className="input-groupicon">
                      <input type="date" className="form-control" value={formData?.expDate} disabled/>
                        {/* <DatePicker
                          selected={startDate}
                          value={formData?.expDate.substring(0, 10)}
                          disabled

                        />
                        <Link className="addonset">
                          <img src={Calendar} alt="img" />
                        </Link> */}
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
                                onClick={(e) => {                                
                                  setPrice(e.target.value)
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
                                onClick={(e) => {
                                  setPrice(e.target.value)
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
                              <input className="form-check-input" type="radio" ref={specialpriceTypeRef} name="priceType" value={selectedProduct?.specialPrice} onClick={(e) => {
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
                          type="number"
                          value={formData?.quantity}
                          onChange={(e) => {
                            if (e.target.value == '') {
                              setFormData({ ...formData, quantity: '' })
                            }
                            if (Number(e.target.value) > (selectedProduct?.remainingStock)) {
                              alertify.set("notifier", "position", "bottom-right");
                              alertify.message('Quantity can not be greater than quantity in stock')
                              let newNotification = {
                                id: Math.ceil(Math.random()*1000000),
                                message: `${storage.name} Quantity can not be greater than quantity in stock.`,
                                time: new Date().toISOString(),
                                type: 'warning'
                              }
                              setNotifications([newNotification, ...notifications])
                            }
                            else {
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
                          value={formData.quantity ? Number(formData.quantity * price).toFixed(2) : Number(price * 1).toFixed(2) || 0}
                        />

                      </div>
                    </div>
                  </div>

                  <div className="col-12" style={{ display: 'flex', justifyContent: 'flex-end' }}>

                    <label></label>
                    <Link to="#" className="btn btn-submit me-2" style={{ width: '100%', textAlign: 'center', marginTop: 8 }} onClick={handleAddItem}>
                      <FeatherIcon icon="shopping-cart" /> {" Add to Basket"}
                    </Link>
                  </div>


                </div>

              </div>

            </div>

            {/* <div className="card">
            <div className="card-body">
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
                                    onChange={(e) => setPaymentInfo({...paymentInfo, cashWaybill: e.target.value})}
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
                                      if(e.target.value == ''){
                                        setPaymentInfo({...paymentInfo, cashAmount: ''})
                                      }
                                      else if(isValidNumber(e.target.value)){
                                        setPaymentInfo({...paymentInfo, cashAmount: Number(e.target.value)})
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
                                    onChange={(e) => setPaymentInfo({...paymentInfo, cashReceiptNo: e.target.value})}
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
                                    onChange={(e) => setPaymentInfo({...paymentInfo, chequeWaybill: e.target.value})}
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
                                    onChange={(e) => setPaymentInfo({...paymentInfo, chequeNo: e.target.value})}
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
                                    onChange={(e) => setPaymentInfo({...paymentInfo, chequeReceiptNo: e.target.value})}
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
                                    onChange={(e) => setPaymentInfo({...paymentInfo, dueDate: e.target.value})}
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
                                    onChange={(e) => setPaymentInfo({...paymentInfo, bank: e.target.value})}
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
                                      if(e.target.value == ''){
                                        setPaymentInfo({...paymentInfo, chequeAmount: ''})
                                      }
                                      else if(isValidNumber(e.target.value)){
                                        setPaymentInfo({...paymentInfo, chequeAmount: Number(e.target.value)})
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
                                    onChange={(e) => setPaymentInfo({...paymentInfo, momoReceiptNo: e.target.value})}
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
                                    onChange={(e) => setPaymentInfo({...paymentInfo, momoName: e.target.value})}
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
                                      if(e.target.value == ''){
                                        setPaymentInfo({...paymentInfo, momoAmount: ''})
                                      }
                                      else if(isValidNumber(e.target.value)){
                                        setPaymentInfo({...paymentInfo, momoAmount: Number(e.target.value)})
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
                                    onChange={(e) => setPaymentInfo({...paymentInfo, transactionID: e.target.value})}
                                  />

                                </div>
                              </div>
                            </div>
                          </div>

                        </div> : null}
                      </div>
            </div>
          </div> */}
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
                                    <td>{item?.expireDate}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.unitPrice}</td>
                                    <td>{item.amount}</td>
                                    
                                    <td>
                                      <Link to="#" className="delete-set me-2" data-bs-toggle="modal" data-bs-target="#editproduct" onClick={() => setEditFormData(item)}>
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
                         <li style={{border: Number(productGridData.reduce((total, item) => total + item.amount, 0)) - Number(paymentInfo.amountPaid) > 0 ? '2px solid red' : Number(productGridData.reduce((total, item) => total + item.amount, 0)) - Number(paymentInfo.amountPaid) < 0 ? '2px solid green' : null}}>
                          <h4>{Number(productGridData.reduce((total, item) => total + item.amount, 0)) - Number(paymentInfo.amountPaid) < 0 ? 'Change' : 'Balance'}</h4>
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

                {userType !== 'sales' && <div className="row mt-2">
                  <div className="col-lg-12" style={{ display: 'flex', justifyContent: 'space-between' }} >
                    <button className="btn btn-info me-2" data-bs-toggle="modal" data-bs-target="#payment" onClick={() => setTransactionType("SP")} style={{ width: '20%' }}>
                      Sell and Print
                    </button>
                    <button className="btn btn-warning me-2" data-bs-toggle="modal" data-bs-target="#payment"  onClick={() => setTransactionType("SO")} style={{ width: '20%' }}>
                      Sell Only
                    </button>
                    <button className="btn btn-danger me-2" data-bs-toggle="modal" data-bs-target="#payment"  style={{ width: '20%' }} onClick={() => setTransactionType("CP")} >
                      Credit and Print
                    </button>
                    <button className="btn btn-cancel" data-bs-toggle="modal" data-bs-target="#payment"  style={{ width: '20%' }} onClick={() => setTransactionType("CO")}>
                      Credit Only
                    </button>

                  </div>
                </div>}
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
            <div className="modal-body">
              <div className="row">
                <div className="col-lg-12 col-sm-12 col-12">
                  <div className="form-group">
                    <label>Product Name</label>
                    <div className="input-groupicon">
                      <input type="text" value={editFormData?.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} disabled />
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
                      <input type="text" value={editFormData?.batchNumber} onChange={(e) => setEditFormData({...editFormData, batchNumber: e.target.value})}/>
                        {/* <Select
                          options={selectedProductInfoEditMode?.batchNumber?.map((item) => {
                            return { value: item.batchNumber, label: item?.batchNumber + '-(' + item?.Quantity + ')', expireDate: item?.expireDate, manufacturingDate: item?.manufacturingDate }
                          })}
                          
                          placeholder=""
                          value={editFormData.batchNumber}
                          onChange={(e) => setEditFormData({ ...editFormData, batchNumber: (e), manufacturingDate: e.manufacturingDate, expireDate: e.expireDate })}
                        //onChange={(e) => console.log(e)}
                        /> */}

                      </div>
                    </div>
                  </div>

                <div className="col-lg-6 col-sm-12 col-12">
                  <div className="form-group">
                    <label>Quantity</label>
                    <input type="number" value={editFormData?.quantity}
                      onChange={(e) => {
                        if (e.target.value == '') {
                          setEditFormData({ ...editFormData, quantity: '' })
                        }
                        else {
                          let qty = Number(e.target.value) || 0
                          let unitP = Number(editFormData.unitPrice) || 0
                          //console.log(qty, unitP)

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
                    <input  type="number" value={editFormData?.amount} />
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
                                    onChange={(e) => setPaymentInfo({...paymentInfo, cashWaybill: e.target.value})}
                                  />

                                </div>
                              </div>
                            </div>

                            <div className="col-6">
                              <div className="form-group">
                                <label>Amount </label>
                                <div className="input-groupicon">
                                  <input
                                    type="number"
                                    placeholder=""
                                    className="form-control"
                                    value={paymentInfo.cashAmount}
                                    onChange={(e) => {
                                      if(e.target.value == ''){
                                        setPaymentInfo({...paymentInfo, cashAmount: ''})
                                      }
                                      else {
                                        setPaymentInfo({...paymentInfo, cashAmount: Number(e.target.value)})
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
                                    onChange={(e) => setPaymentInfo({...paymentInfo, cashReceiptNo: e.target.value})}
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
                                    onChange={(e) => setPaymentInfo({...paymentInfo, chequeWaybill: e.target.value})}
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
                                    className="form-control"
                                    value={paymentInfo.chequeNo}
                                    onChange={(e) => setPaymentInfo({...paymentInfo, chequeNo: e.target.value})}
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
                                    className="form-control"
                                    value={paymentInfo.chequeReceiptNo}
                                    onChange={(e) => setPaymentInfo({...paymentInfo, chequeReceiptNo: e.target.value})}
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
                                    onChange={(e) => setPaymentInfo({...paymentInfo, dueDate: e.target.value})}
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
                                    onChange={(e) => setPaymentInfo({...paymentInfo, bank: e.target.value})}
                                  />

                                </div>
                              </div>
                            </div>



                            <div className="col-6">
                              <div className="form-group">
                                <label>Amount</label>
                                <div className="input-groupicon">
                                  <input
                                    type="number"
                                    placeholder=""
                                    className="form-control"
                                    value={paymentInfo.chequeAmount}
                                    onChange={(e) => {
                                      if(e.target.value == ''){
                                        setPaymentInfo({...paymentInfo, chequeAmount: ''})
                                      }
                                      else {
                                        setPaymentInfo({...paymentInfo, chequeAmount: Number(e.target.value)})
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
                                    onChange={(e) => setPaymentInfo({...paymentInfo, momoReceiptNo: e.target.value})}
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
                                    onChange={(e) => setPaymentInfo({...paymentInfo, momoName: e.target.value})}
                                  />

                                </div>
                              </div>
                            </div>

                            <div className="col-6">
                              <div className="form-group">
                                <label>Amount</label>
                                <div className="input-groupicon">
                                  <input
                                    type="number"
                                    placeholder=""
                                    value={paymentInfo.momoAmount}
                                    onChange={(e) => {
                                      if(e.target.value == ''){
                                        setPaymentInfo({...paymentInfo, momoAmount: ''})
                                      }
                                      else {
                                        setPaymentInfo({...paymentInfo, momoAmount: Number(e.target.value)})
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
                                    onChange={(e) => setPaymentInfo({...paymentInfo, transactionID: e.target.value})}
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
                onClick={() => setReceiptData({})}
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
                          className={`form-control ${
                            errors.name ? "is-invalid" : ""
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
                                    <input className="form-check-input" type="radio" name="customerType" value="0" onChange = {(e) => setCustomerType(e.target.value)}/>
                                  </div>
                                  <input type="text" className="form-control" aria-label="Text input with radio button" value={'Company'}/>
                                </div>
                            </div>

                              <div class="col-lg-6">

                                <div class="input-group">
                                  <div class="input-group-text">
                                    <input className="form-check-input" type="radio" name="customerType" value="1" onChange = {(e) => setCustomerType(e.target.value)}/>
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
                          className={`form-control ${
                            errors.name ? "is-invalid" : ""
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
                          <input  className={`form-control ${
                                errors.name ? "is-invalid" : ""
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
                          <input  className={`form-control ${
                                errors.name ? "is-invalid" : ""
                              }`}
                              type="text"
                              {...register("otherContact")}
                            />
                          
                        </div>
                      </div>
                    
                  
                      <div className="col-lg-12 col-12">
                        <div className="form-group">
                          <label>Location/Address</label>
                          <input className={`form-control ${
                                errors.name ? "is-invalid" : ""
                              }`}
                              type="text"
                              {...register("location")}/>
                        </div>
                      </div>

                      <div className="col-lg-12 col-12">
                        <div className="form-group">
                          <label>Ghana Post Address</label>
                          <input className={`form-control ${
                                errors.name ? "is-invalid" : ""
                              }`}
                              type="text"
                              placeholder="GZ-000-0000"
                              {...register("gpsAddress")}/>
                        </div>
                      </div>
                    
                      <div className="col-lg-12" style={{textAlign:'right'}}>
                        <button type="submit" className="btn btn-submit me-2"><FeatherIcon icon="save"/> Save</button>
                        <button type="button" className="btn btn-cancel"  data-bs-dismiss="modal">Close</button>
                      </div>
                    </div>
              </form>
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

export default Addsales;
