import React, { useContext, useEffect, useState } from "react";
import Table from "../../EntryFile/datatable";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import Tabletop from "../../EntryFile/tabletop";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import { useMutation } from '@tanstack/react-query'
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import { useGet } from "../../hooks/useGet";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import { commaRemover, isValidNumber, moneyInTxt } from "../../utility";
import useCustomApi from "../../hooks/useCustomApi";
import { usePost } from "../../hooks/usePost";
import alertify from "alertifyjs";
import "../../../node_modules/alertifyjs/build/css/alertify.css";
import "../../../node_modules/alertifyjs/build/css/themes/semantic.css";
import { Button } from "antd";
import FeatherIcon from 'feather-icons-react'
import { socket } from "../../InitialPage/Sidebar/Header";
import useAuth from "../../hooks/useAuth";
import { NotificationsContext } from "../../InitialPage/Sidebar/DefaultLayout";
import { Purchase } from "../../EntryFile/imagePath";

const CreditPayments = () => {
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

  const [inputfilter, setInputfilter] = useState(true);
  const [activeTab, setActiveTab] = useState('Cash')
  const [modalData, setModalData] = useState(null)
  const [isCredit, setIsCredit] = useState(false)
  const [paymentInfo, setPaymentInfo] = useState(init)
  const [filter, setFilter] = useState('All')
  const [productGridData, setProductGridData] = useState([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [receiptFile, setReceiptFile] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isLoadingPDF, setIsLoadingPDF] = useState(false)

  const { notifications, setNotifications } = useContext(NotificationsContext)
  let storage = JSON.parse(localStorage.getItem("auth"))


  const onSuccess = (data) => {

    setData([])

    let mappedData = data?.data.map((sale) => {
      return {
        id: sale?.id,
        Date: sale?.transactionDate,
        Name: sale?.customerName || 'N/A',
        Status: sale?.transactionStatus,
        Reference: sale?.reference,
        Payment: sale?.transactionType,
        Total: (sale?.totalAmount),
        Paid: sale?.amountPaid,
        Due: sale?.balance,
        Biller: sale?.cashierName,
        salestype: sale?.salesType
      }
    })
    setData(mappedData)

  }

  useEffect(() => {
    setPaymentInfo({ ...paymentInfo, amountPaid: Number(paymentInfo.cashAmount) + Number(paymentInfo.chequeAmount) + Number(paymentInfo.momoAmount) })
  }, [paymentInfo.cashAmount, paymentInfo.chequeAmount, paymentInfo.momoAmount])

  const {
    data: sales,
    isError,
    isLoading,
    refetch,
    isFetching
  } = useGet("suspend", `/sales/credit/payments?startDate=${startDate}&endDate=${endDate}`, onSuccess);

  const [data, setData] = useState([])
  const [isUpdate, setIsUpdate] = useState(false)
  const [comment, setComment] = useState('')


  const togglefilter = (value) => {
    setInputfilter(value);
  };

  const confirmText = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      html: 
      `<div> 
        <h4>Please provide a reason for Reversal</h4><br/>
        <textarea type='text' class="form-control" id="reason"></textarea>
       </div>`,
      showCancelButton: !0,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reverse it!",
      confirmButtonClass: "btn btn-primary",
      cancelButtonClass: "btn btn-danger ml-1",
      buttonsStyling: !1,
    }).then(async (t) => {

      if (t.isConfirmed) {
        setIsDeleting(true)


        let payload = {
          "id": id,
          "reason": $('#reason').val()
        }

        console.log(payload, "Payload")

        let data = await axios.post(`/sales/payment-reverse`, payload)
        if (data.status < 205) {
          setIsDeleting(false)
          Swal.fire({
            type: "success",
            title: "Reversed!",
            text: "Your sale item has been reversed.",
            confirmButtonClass: "btn btn-success",
          });
          refetch()

        }
        else {
          Swal.fire({
            type: "danger",
            title: "Error!",
            text: data.response.data.message,
            confirmButtonClass: "btn btn-danger",
          });
        }
       }


      t.dismiss === Swal.DismissReason.cancel &&
        Swal.fire({
          title: "Cancelled",
          text: "You cancelled the reverse action",
          type: "error",
          confirmButtonClass: "btn btn-success",
        });
    })
      .catch((error) => {
        Swal.fire({
          type: "danger",
          title: "Error!",
          text: error,
          confirmButtonClass: "btn btn-danger",
        });
      })
      .finally(() => {
        setIsDeleting(false)
      });
  };

  const axios = useCustomApi()

  const processPayment = (type, print) => {

    if ((Number(paymentInfo.cashAmount) + Number(paymentInfo.cashAmount) + Number(paymentInfo.cashAmount) > 0) || type == 'Credit') {
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
      //   transDate: new Date().toISOString(),
      //   salesRef: modalData.Reference,
      //   amount: (Number(paymentInfo.cashAmount) + Number(paymentInfo.momoAmount) + Number(paymentInfo.chequeAmount)),
      //   paymentInfo: [
      //     { "type": "Cash", waybill: paymentInfo.cashWaybill, amountPaid: paymentInfo.cashAmount },
      //     { "type": "Momo", name: paymentInfo.momoName, receiptNo: paymentInfo.momoReceiptNo, amountPaid: paymentInfo.momoAmount },
      //     { "type": "Cheque", waybill: paymentInfo.chequeWaybill, chequeNo: paymentInfo.chequeNo, chequeReceiptNo: paymentInfo.chequeReceiptNo, amountPaid: paymentInfo.chequeAmount, waybill: paymentInfo.chequeWaybill }
      //   ]
      // }


      let payload = {
        "salesRef": modalData.Reference,
        "amount":(Number(paymentInfo.cashAmount) + Number(paymentInfo.momoAmount) + Number(paymentInfo.chequeAmount)),
        "transDate":  new Date().toISOString(),
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
         ],
         commnet: comment
    }

        let apiUrl = ''
        if(isUpdate){
          apiUrl = `/sales/credit/payment/${modalData.id}`
        }
        else{
          apiUrl = `/sales/credit/payment`
        }
        setIsSaving(true)
        // console.log(payload)
        axios.put(apiUrl, payload)
          .then((res) => {

            //console.log(res.data.success)
            if (res.data.success) {
              if (print) {
                getInvoiceReceipt(modalData.Reference)
              }
              alertify.set("notifier", "position", "bottom-right");
              alertify.success("Sale completed.");
              refetch()
              $('.modal').modal('hide')
              $('body').removeClass('modal-open');
              $('.modal-backdrop').remove();
            }
          })
          .catch((error) => {
            console.log(error)
            alertify.set("notifier", "position", "bottom-right");
            alertify.error(error.response.data.error);

            let newNotification = {
              id: Math.ceil(Math.random() * 1000000),
              message: `${storage.name} ${error.response.data.error}`,
              time: new Date().toISOString(), type: 'error'
            }
            setNotifications([newNotification, ...notifications])
          })
          .finally(() => {
            setIsSaving(false)
            setIsCredit(false)
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

   // }

    else {
      alertify.set("notifier", "position", "bottom-right");
      alertify.warning("Please enter an amount first");

      let newNotification = {
        id: Math.ceil(Math.random() * 1000000),
        message: `${storage.name} Please enter an amount first`,
        time: new Date().toISOString(), type: 'warning'
      }
      setNotifications([newNotification, ...notifications])
    }


  }

  const getInvoiceReceipt = (salesref) => {
    setIsLoadingPDF(true)
    $('#pdfViewer').modal('show')
    axios.get('/sales/getSaleReceipt/' + salesref)
      .then((res) => {
        if(res.status == 201){
          let base64 = res.data.base64
          const blob = base64ToBlob(base64, 'application/pdf');
          const blobFile = `data:application/pdf;base64,${base64}`
          const url = URL.createObjectURL(blob);
          setReceiptFile(blobFile)
          //window.open(url, "_blank", "width=600, height=600", 'modal=yes');
          // var newWindow = window.open(url, "_blank", "width=800, height=800");  
          //pdfWindow.document.write("<iframe width='100%' height='100%' src='" + url + "'></iframe>");
  
         
        }
        else{
          alertify.set("notifier", "position", "bottom-right");
          alertify.warning("No Invoice Available for this Transaction.");
          setIsError(true)
          // $('#pdfViewer').html(`<h1>No Invoice Available for this Transaction`)
        }
       
      })
      .catch((err) => {
        alertify.set("notifier", "position", "bottom-right");
        alertify.warning("No Invoice Available for this Transaction.");
        $('#pdfViewer').hide()
        $('#errorMessage').modal('show')

       
      })
      .finally(() => {
        setIsLoadingPDF(false)
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


  const options = [
    { id: 'Retail', text: "Retail", text: "Retail" },
    { id: 'Wholesale', text: "Wholesale", text: "Wholesale" },
    { id: 'All', text: "All", text: "All" },
  ];
  const options1 = [
    { id: 1, text: "Cash", text: "Cash" },
    { id: 2, text: "Online", text: "Online" },
    { id: 2, text: "Inprogess", text: "Inprogess" },
  ];


  //
  useEffect(() => {
    // refetch()
    if (sales) {
      let mappedData = sales?.data.map((sale) => {
        return {
          id: sale?.id,
          Date: sale?.transactionDate,
          Name: sale?.customerName || 'N/A',
          Status: sale?.transactionStatus,
          Reference: sale?.reference,
          Payment: sale?.transactionType,
          Total: (sale?.totalAmount),
          Paid: sale?.amountPaid,
          Due: sale?.balance,
          Biller: sale?.cashierName,
          salestype: sale?.salesType
        }
      })
      setData(mappedData)
      console.log('loaded..')
    }
    else {
      console.log('loading...')
    }
  }, [sales])


  socket.on("receive_message", (data) => {
    try {

      let mappedData = data?.response.map((sale) => {
        return {
          id: sale?.id,
          Date: sale?.transactionDate,
          Name: sale?.customerName || 'N/A',
          Status: sale?.transactionStatus,
          Reference: sale?.reference,
          Payment: sale?.transactionType,
          Total: (sale?.totalAmount),
          Paid: sale?.amountPaid,
          Due: sale?.balance,
          Biller: sale?.cashierName,
          salestype: sale?.salesType
        }
      }).sort((a,b) => new Date(b.Date) - new Date(a.Date))

      setData([])
      setData(mappedData)

      console.log({ receive_message: data });
      return
    } catch (error) {

    }


  })




  useEffect(() => {
    if (!isLoading) {
      let mappedData = sales?.data.map((sale) => {
        return {
          id: sale?.id,
          Date: sale?.transactionDate,
          Name: sale?.customerName || 'N/A',
          Status: sale?.transactionStatus,
          Reference: sale?.reference,
          Payment: sale?.transactionType,
          Total: (sale?.totalAmount),
          Paid: sale?.amountPaid,
          Due: sale?.balance,
          Biller: sale?.cashierName,
          salestype: sale?.salesType
        }
      }).sort((a,b) => new Date(b.Date) - new Date(a.Date))
      if (filter == 'All') {
        setData(mappedData)
      }
      else {
        setData(mappedData?.filter((item) => item?.salestype == filter))
      }

    }
  }, [filter])


  // useEffect(() => {
  //   refetch()
  // }, [startDate, endDate])



  const columns = [
    {
      title: "Date",
      dataIndex: "Date",
      sorter: (a, b) => a.Date.length - b.Date.length,
    },
    {
      title: "Customer name",
      dataIndex: "Name",
      
    },

    {
      title: "Reference",
      dataIndex: "Reference",
      sorter: (a, b) => a.Reference.length - b.Reference.length,
    },
    {
      title: "Total Amt (GHS)",
      dataIndex: "Total",
      sorter: (a, b) => a.Total.length - b.Total.length,
    },
    {
      title: "Amt Paid (GHS)",
      dataIndex: "Paid",
      sorter: (a, b) => a.Paid.length - b.Paid.length,
    },

    {
      title: "Amt Due (GHS)",
      dataIndex: "Due",
      sorter: (a, b) => a.Due.length - b.Due.length,
    },
    {
      title: "Sales Type",
      dataIndex: "salestype",
      render: (text, record) => (
        <>
          <p>{text}</p>
        </>
      ),
      sorter: (a, b) => a.salestype.length - b.salestype.length,
    },
    {
      title: "Biller",
      dataIndex: "Biller",
      sorter: (a, b) => a.Biller.length - b.Biller.length,
    },
    {
      title: "Action",
      render: (text, record) => (
        <>
     
         
          <Link
              to="#"  data-bs-toggle="modal"
              data-bs-target="#showpayment"
              onClick={() => { 
                console.log("Record", record)
                setModalData(record)
                setIsUpdate(true)
                setPaymentInfo({ ...paymentInfo, cashAmount: (record?.Paid)})
               }}
             
              title={'Edit Payment'}
            >

              <span className="badges bg-lightgreen me-2"><FeatherIcon icon="edit" /> Edit</span>
             
          </Link>
          <Link
              to="#"  data-bs-toggle="modal"
              onClick={() => getInvoiceReceipt(record?.Reference)}
              // data-bs-target="#pdfViewer"
              // onClick={() => { setModalData(record), setIsUpdate(false), getInvoiceReceipt(record?.Reference) }}
             
              title={'View Invoice'}
            >

              <span className="badges btn-cancel me-2"><FeatherIcon icon="eye" /> View Invoice</span>
             
          </Link>
         
          <Link
              to="#"
              // className="dropdown-item confirm-text"
              onClick={() => confirmText(record.id)}
              title={'Reverse Payment'}
            >

              <span className="badges bg-lightred"><FeatherIcon icon="repeat" /> Reverse </span>
             
          </Link>
      
         


        </>
      ),
    },
  ];


  if (isLoading) {
    return (<LoadingSpinner message="Fetching Credited sales.." />)
  }

  if (isFetching) {
    return (<LoadingSpinner message="Fetching Credited sales.." />)
  }


  if (isDeleting) {
    return (<LoadingSpinner />)
  }

  if (isSaving) {
    return <LoadingSpinner message="Processing...please wait" />
  }


  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Credit Payments</h4>
              <h6>Manage your credit payments </h6>
            </div>
            <div className="page-btn">
              {/* <Link to="/tinatett-pos/sales/add-sales" className="btn btn-added">
                <img src={PlusIcon} alt="img" className="me-1" />
                Go to Sales
              </Link> */}
            </div>
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-body">
              <Tabletop inputfilter={inputfilter} togglefilter={togglefilter} showSearch={false}/>
            
              {/* /Filter */}
              <div
                className={`card mb-0 ${inputfilter ? "toggleCls" : ""}`}
                id="filter_inputs"
                style={{ display: inputfilter ? "block" : "none" }}
              >
                <div className="card-body pb-0">
                  <div className="row">

                    <div className="col-lg-3 col-sm-6 col-12" hidden>
                      <div className="form-group">
                      <label>Filter By</label>
                        <Select2
                          className="select"
                          data={options}
                          options={{
                            placeholder: "Filter by Sales Type",
                          }}
                          value={filter}
                          onChange={(e) => setFilter(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="form-group">
                        <label>Start Date</label>
                        <input className="form-control"  type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
                      </div>
                    </div>

                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="form-group">
                        <label>End Date</label>
                        <input className="form-control" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
                      </div>
                    </div>

                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="form-group">
                        <label>&nbsp;</label>
                        <button className="btn btn-success" type="submit" onClick={refetch}>Apply</button>
                      </div>
                    </div>
                  
                  </div>

                
                </div>
              </div>
              {/* /Filter */}
              <div className="table-responsive">
                <Table columns={columns} dataSource={data} />
                <div className="row">
                    <div className="col-lg-3">
                    </div>
                    <div className="col-lg-2 ">
                      <div className="form-group">
                      <span style={{fontWeight:900}}>Total Amount: {moneyInTxt(data.reduce((total, item) =>  Number(total) + Number(item?.Total), 0))}</span>
                      </div>
                    </div>
                    <div className="col-lg-2 ">
                      <div className="form-group">
                      <span style={{fontWeight:900}}>Total Paid: {moneyInTxt(data.reduce((total, item) =>  Number(total) + Number(item?.Paid), 0))}</span>
                      </div>
                    </div>
                    <div className="col-lg-2 ">
                      <div className="form-group">
                      <span style={{fontWeight:900}}>Remaining Amount: {moneyInTxt(data.reduce((total, item) =>  Number(total) + Number(item?.Due), 0))}</span>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>
      </div>
      <>
        {/* show payment Modal */}
        <div
          className="modal fade"
          id="showpayment"
          tabIndex={-1}
          aria-labelledby="showpayment"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Sales Ref: {modalData?.Reference}</h5>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => { setIsCredit(false), setPaymentInfo(init), setIsUpdate(false) }}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '4fr 1fr' }}>
                  <div className="card" style={{ border: '1px solid #252525' }}>
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
                                    type="number"
                                    min={0}
                                    className="form-control"
                                    placeholder=""
                                    value={paymentInfo.cashAmount}
                                    onChange={(e) => {
                                      if (e.target.value == '') {
                                        setPaymentInfo({ ...paymentInfo, cashAmount: '' })
                                      }
                                      else {
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
                                    type="number"
                                    min={0}
                                    placeholder=""
                                    className="form-control"
                                    value={paymentInfo.chequeAmount}

                                    onChange={(e) => {
                                      if (e.target.value == '') {
                                        setPaymentInfo({ ...paymentInfo, chequeAmount: '' })
                                      }
                                      else {
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
                                    type="number"
                                    min={0}
                                    className="form-control"
                                    placeholder=""
                                    value={paymentInfo.momoAmount}
                                    onChange={(e) => {
                                      if (e.target.value == '') {
                                        setPaymentInfo({ ...paymentInfo, momoAmount: '' })
                                      }
                                      else {
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

                      <div className="row">
                      <div className="col-lg-12 ">
                          <div className="total-order w-100 max-widthauto m-auto mb-4">
                            <ul>
                              <li>
                                 <label>Comment</label>
                              </li>
                              <li>
                                <input className="form-control" type="text" placeholder="Type comment here.." value={comment} onChange={(e) => setComment(e.target.value)}/>
                             </li>
                            </ul>
                          </div>
                        </div>
                        <div className="col-lg-6 ">
                          <div className="total-order w-100 max-widthauto m-auto mb-4">
                            <ul>
                              <li>
                                <h4>Updated Amount</h4>
                                <h5>GHS {moneyInTxt(paymentInfo?.amountPaid)} </h5>
                              </li>
                              <li>
                                <h4>Amount Prev Paid </h4>
                                <h5>GHS {moneyInTxt(modalData?.Paid)}</h5>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="col-lg-6 ">
                          <div className="total-order w-100 max-widthauto m-auto mb-4">
                            <ul>
                              <li className="total">
                                <h4>Grand Total</h4>
                                <h5>GHS {moneyInTxt(modalData?.Total)}</h5>
                              </li>
                              <li>
                                <h4>Balance</h4>
                                <h5>GHS {moneyInTxt(Number(modalData?.Total) - Number(paymentInfo?.amountPaid))}</h5>
                              </li>

                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontWeight: 900 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '90%', gap: 10 }}>
                      <Button data-bs-dismiss="modal" color="#3085d6">{' Hold '} </Button>
                      <Button data-bs-dismiss="modal" color="#252525">Remove</Button>
                    </div>
                    <span style={{ fontSize: 20, marginTop: 180, marginBottom: 180 }}>GHS {modalData?.Total}</span>
                  </div>
                </div>

                <div className="row mt-2">
                  <div className="col-lg-12" style={{ display: 'flex', justifyContent: 'flex-start' }} >
                    {!isCredit && !isUpdate && (<button className="btn btn-info me-2" data-bs-toggle="modal" data-bs-target="#confirmPaymentSellPrint" style={{ width: '20%' }}>
                      Pay
                    </button>)}
                    {isUpdate && (<button className="btn btn-success me-2" data-bs-toggle="modal" data-bs-target="#confirmPaymentUpdate" style={{ width: '20%' }}>
                     Update Payment
                    </button>)}
                    {/* <button className="btn btn-danger me-2" style={{ width: '20%' }} data-bs-toggle="modal" data-bs-target="#confirmPaymentCreditPrint" >
                      Credit and Print
                    </button> */}
                    {/* <button className="btn btn-cancel" style={{ width: '20%' }} onClick={() => processPayment("Credit", false)}>
                      Credit Only
                    </button> */}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* cash payment Modal */}
        <div
          className="modal fade"
          id="cashpayment"
          tabIndex={-1}
          aria-labelledby="cashpayment"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Sales Type: {modalData?.salestype}</h5>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => { setIsCredit(false), setPaymentInfo(init) }}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '4fr 1fr' }}>
                  <div className="card" style={{ border: '1px solid #252525' }}>
                    <div className="card-body">
                      <div className="payment-div" >
                        <ul className="nav nav-tabs">
                          <li className="nav-item" onClick={() => setActiveTab('Cash')}>
                            <a className={activeTab == 'Cash' ? `nav-link active` : `nav-link`} href="javascript:void(0);">Cash</a>
                          </li>

                        </ul>

                        <div id="cash-tab" style={{ marginTop: 20 }}>
                          <div className="row">


                            <div className="col-12">
                              <div className="form-group">
                                <label>Amount </label>
                                <div className="input-groupicon">
                                  <input
                                    type="number"
                                    min={0}
                                    className="form-control"
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
                                <h5>GHS {moneyInTxt(modalData?.Total)}</h5>
                              </li>
                              <li style={{ border: Number(modalData?.Total) - Number(paymentInfo.amountPaid) > 0 ? '2px solid red' : Number(modalData?.Total) - Number(paymentInfo.amountPaid) < 0 ? '2px solid green' : null }}>
                                <h4>{Number(modalData?.Total) - Number(paymentInfo.amountPaid) < 0 ? 'Change' : 'Balance'}</h4>
                                <h5>GHS {moneyInTxt(Math.abs(Number(modalData?.Total) - Number(paymentInfo.amountPaid)))}</h5>
                              </li>

                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontWeight: 900 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '90%', gap: 10 }}>
                      <Button data-bs-dismiss="modal" color="#3085d6">{' Hold '} </Button>
                      <Button data-bs-dismiss="modal" color="#252525">Remove</Button>
                    </div>
                    <span style={{ fontSize: 20, marginTop: 180, marginBottom: 180 }}>GHS {modalData?.Total}</span>
                  </div>
                </div>

                <div className="row mt-2">
                  <div className="col-lg-12" style={{ display: 'flex', justifyContent: 'flex-start' }} >
                    {!isCredit && (<button className="btn btn-info me-2" data-bs-toggle="modal" data-bs-target="#confirmPaymentSellPrint" style={{ width: '20%' }}>
                      Sell and Print
                    </button>)}
                    {/* {!isCredit && (<button className="btn btn-warning me-2" onClick={() => processPayment("Paid", false)} style={{ width: '20%' }}>
                      Sell Only
                    </button>)} */}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Confirm Modal */}

        <div
          className="modal fade"
          id="confirmPaymentSellPrint"
          tabIndex={-1}
          aria-labelledby="confirmPaymentSellPrint"
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
                Are you sure you want to save this payment Transaction?
              </div>
              <div className="modal-footer">
                <Link to="#" className="btn btn-submit me-2" data-bs-dismiss="modal" onClick={() => processPayment("Paid", true)}>
                  Yes
                </Link>
                <Link to="#" className="btn btn-cancel" data-bs-dismiss="modal">
                  No
                </Link>
              </div>
            </div>
          </div>

        </div>


        <div
          className="modal fade"
          id="confirmPaymentUpdate"
          tabIndex={-1}
          aria-labelledby="confirmPaymentUpdate"
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
                Are you sure you want to Update this payment Transaction?
              </div>
              <div className="modal-footer">
                <Link to="#" className="btn btn-submit me-2" data-bs-dismiss="modal" onClick={() => processPayment("Credit", true)}>
                  Yes
                </Link>
                <Link to="#" className="btn btn-cancel" data-bs-dismiss="modal">
                  No
                </Link>
              </div>
            </div>
          </div>

        </div>


        {/* Credit Modal */}
        <div
          className="modal fade"
          id="creditpayment"
          tabIndex={-1}
          aria-labelledby=""
          aria-hidden="true"
        >
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Sales Type: {modalData?.salestype}</h5>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => { setPaymentInfo(init) }}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <h3 style={{ textAlign: 'center' }}>Do you want to do a full credit? </h3>
              </div>
              <div className="modal-footer">
                <div className="col-lg-12" style={{ display: 'flex', justifyContent: 'flex-end' }} >
                  <button className="btn btn-success me-2" onClick={() => processPayment("Credit", true)} style={{ width: '20%' }}>
                    Yes
                  </button>
                  <button className="btn btn-danger me-2" data-bs-dismiss="modal">
                    No
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div>


        {/* View Products Modal */}
        <div
          className="modal fade"
          id="showproducts"
          tabIndex={-1}
          aria-labelledby=""
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Sales Ref - {productGridData[0]?.salesRef || 'N/A'}</h5>
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
                  <div className="table-responsive mb-3">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Product Name</th>
                          <th>Quantity</th>
                          <th>Unit Price</th>
                          <th>Amount</th>

                        </tr>
                      </thead>
                      <tbody>
                        {productGridData.length > 0 ? productGridData?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <Link to="#">{item?.name}</Link>
                              </td>
                              <td>{item?.quantity}</td>
                              <td>{item?.unitPrice}</td>
                              <td>{item?.amount}</td>


                            </tr>
                          )
                        }) : 'No Data'}

                      </tbody>
                    </table>
                  </div>
                </div>

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
                  onClick={() => $('.modal').modal('hide')}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                {isLoadingPDF ? <p>Loading...</p> : <iframe width='100%' height='800px' src={receiptFile}></iframe>}
                {isError ? <p>Error</p>: null}
              </div>

            </div>
          </div>
        </div>


        
        {/* Error Modal */}
        <div
          className="modal fade"
          id="errorMessage"
          tabIndex={-1}
          aria-labelledby="errorMessage"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Notice</h5>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => $('.modal').modal('hide')}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <p>No Invoice found for this Transaction</p>
              </div>

            </div>
          </div>
        </div>

       
      </>
    </>
  );
};

export default CreditPayments;
