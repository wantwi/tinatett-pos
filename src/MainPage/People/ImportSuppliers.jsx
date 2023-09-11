import React, {useCallback, useEffect, useState} from 'react'
import { EditIcon, Upload } from '../../EntryFile/imagePath';
import { read} from 'xlsx'
import { useDropzone } from 'react-dropzone'
import Table from "../../EntryFile/datatable";
import { moneyInTxt } from '../../utility';
import { Link } from "react-router-dom";
import alertify from "alertifyjs";
import "../../../node_modules/alertifyjs/build/css/alertify.css"; 
import "../../../node_modules/alertifyjs/build/css/themes/semantic.css";
import { usePost } from '../../hooks/usePost';
import LoadingSpinner from '../../InitialPage/Sidebar/LoadingSpinner';
//import {excelFile} from '../../assets/xcelTemplates/Template.xlsx'

const ImportSuppliers = () => {

  const onDrop = useCallback((acceptedFiles) => {

    setData(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    )
    
  }, [])

  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({ accept: '.xlsx,.xls,.csv', maxFiles: 1, onDrop})
  const [uploadedData, setData] = useState([])
  const [importedRecords, setimportedRecords] = useState([])
  const [last, setLast] = useState(0)
  const [selectedSheet, setSelectedSheet] = useState('')
  const [productsList, setProductsList] =useState([])

  useEffect(() =>{
    
    if (uploadedData.length > 0) {
     
      const reader = new FileReader()
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = (e) => {
        // Do whatever you want with the file contents
        let data = e.target.result
        let workbook = read(data, {
          type: 'binary',
        })

        //console.log("Workbook:", workbook)
        setData(workbook)
      
        //get sheet Data
        
      }
      reader.readAsArrayBuffer(uploadedData[0], 'utf-8')
    }
  }, [uploadedData])
  
 const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ))


  const getSheetData = (e) => {
    let sheetName = e.target.value
    let xdt = uploadedData.Sheets[sheetName]
    let xData = Object.keys(xdt).map((key) => {
      return [key, xdt[key].v]
    })
    //console.log(xData)

    let xCells = [],
      vCells = [],
      xRows = [],
      xColums = [],
      vCell = {}

    for (let x = 0; x < xData.length; x++) {
      if (xData[x][1]) {
        let row = xData[x][0].replace(/[^\d.]/g, '')
        xRows.push(row)

        let col = xData[x][0].replace(row, '')
        xColums.push(col)
        vCell[`${xData[x][0]}`] = xData[x][1]
        vCells.push(vCell)

        xCells.push({
          Row: row,
          Column: col,
          Cell: xData[x][0],
          Value: xData[x][1],
        })
      }
    }

    let excelSheets = []
    excelSheets.push({
      Data: xCells,
      Cells: vCell,
      Name: sheetName,
      First: xCells[0],
      Last: xCells[xCells.length - 1],
      Rows: xRows.filter((v, i, a) => a.indexOf(v) === i),
      Columns: xColums.filter((v, i, a) => a.indexOf(v) === i),
    })

 

    setimportedRecords(excelSheets[0].Data)
    setLast(Number(excelSheets[0].Last.Row))
  }

  const processUpload = () => {
    $('#processUpload').css('border', 'none')
    if(selectedSheet == ''){
      alertify.set("notifier", "position", "bottom-right");
      alertify.warning("Please select a sheet");
      $('#sheetName').css('border', '1px solid red')
    }
    else{
      let arr = importedRecords
      let keys = [...new Set(arr)]
    
      let col1 = keys.filter((item) => item.Column === 'A')
      let col2 = keys.filter((item) => item.Column === 'B')
      let col3 = keys.filter((item) => item.Column === 'C')
      let col4 = keys.filter((item) => item.Column === 'D')
      let col5 = keys.filter((item) => item.Column === 'E')
      let col6 = keys.filter((item) => item.Column === 'F')
      let col7 = keys.filter((item) => item.Column === 'G')
      let col8 = keys.filter((item) => item.Column === 'H')
      let col9 = keys.filter((item) => item.Column === 'I')
      let col10 = keys.filter((item) => item.Column === 'J')
      let col11 = keys.filter((item) => item.Column === 'K')

      // console.log(col1, col2, col3, col4, col5)


      let NamesArr = []
      let EmailsArr = []
      let ContactArr = []
      let OtherContactArr = []
      let LocationArr = []
      let GPSAddressArr = []
      let ProductsArr = []
      let CreditPeriodArr = []
      let CashDetailsArr = []
      let BankDetailsArr = []
      let MomoDetailsArr = []
 


      col1.forEach((item) => NamesArr.push(item.Value))
      col2.forEach((item) => EmailsArr.push(item.Value))
      col3.forEach((item) => ContactArr.push(item.Value))
      col4.forEach((item) => OtherContactArr.push(item.Value))
      col5.forEach((item) => LocationArr.push(item.Value))
      col6.forEach((item) => GPSAddressArr.push(item.Value))
      col7.forEach((item) => ProductsArr.push(item.Value))
      col8.forEach((item) => CreditPeriodArr.push(item.Value))
      col9.forEach((item) => CashDetailsArr.push(item.Value))
      col10.forEach((item) => BankDetailsArr.push(item.Value))
      col11.forEach((item) => MomoDetailsArr.push(item.Value))
    

      let finalData = []
      finalData.push(
        NamesArr,
        EmailsArr,
        ContactArr,
        OtherContactArr,
        LocationArr,
        GPSAddressArr, ProductsArr, CreditPeriodArr, CashDetailsArr, BankDetailsArr, MomoDetailsArr
      )

    // console.log(finalData, "DATA")

      let postData = []
      let res = []

      let obj = {}
      for (let i = 1; i < last; i++) {
        finalData.map((item, ix) => {
          obj[item[0]] = item[i]
          let ob = { [item[0]]: item[i] }
          res.push(ob)
        })
        postData = [...postData, obj]

        postData.push([obj][0])
      }

      
      let chunkSize = 11
      let chunks = []
      for (let i = 0; i < res.length; i += chunkSize) {
        const chunk = res.slice(i, i + chunkSize)
        // do whatever
        chunks.push(chunk)
      }

      let results = []
      chunks.map((item) => {
        let newObject = {}
        item.map((value) => {
          newObject[`${Object.keys(value)}`] = `${Object.values(value)}`
        })

        results.push(newObject)
      })

    
      const renderData = results.map((value) => ({
        name: value.SupplierName,
        email: value.Email,
        contact: value.Contact,
        otherContact: value.OtherContact,
        location: value.Location,
        customerType: 0,
        gpsAddress: value.GhanaPostAddress,
        creditPeriod: value.CreditPeriod,
        product: value.ProductSupplied,
        paymentInfo: [
          {
            type: 'cash',
            details: value.CashDetails
          },
          {
            type: 'momo',
            details: value.MomoDetails
          },
          {
            type: 'bank',
            details: value.BankDetails
          },
        ]
      }))

      console.log(renderData, "Results")
      

      setProductsList(renderData)
      
    }
  }

  const onSuccess = (data) => {
    if(data)
    alertify.set("notifier", "position", "bottom-right");
    alertify.success("Suppliers uploaded successfully.");
    setProductsList([])
  }

  const onError = () => {
    alertify.set("notifier", "position", "bottom-right");
    alertify.error("Unable to upload suppliers.");
  }


  const { isLoading, mutate } = usePost("/supplier/bulk", 'uploadSuppliers', onSuccess, onError);

  const columns = [
    {
      title: "Supplier Name",
      dataIndex: "name",
      render: (text, record) => (
        <div className="productimgname">
          <Link to="#">{text}</Link>
        </div>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
      width: "250px",
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: "Location",
      dataIndex: "location",
      sorter: (a, b) => a.location.length - b.location.length,
    },
    {
      title: "Phone",
      dataIndex: "contact",
      sorter: (a, b) => a.contact.length - b.contact.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a, b) => a.status.length - b.status.length,
      render: (text, record) => (record.status == 1 ? <span className="badges bg-lightgreen">Active</span> : <span className="badges bg-lightred">Inctive</span> )

    },
  ];

  const submit = () => {
      let payload = {
        suppliers: productsList
      }

      if(selectedSheet == ''){
        alertify.set("notifier", "position", "bottom-right");
        alertify.warning("Please select a sheet");
        $('#sheetName').css('border', '1px solid red')
      }

      else if(productsList.length < 1){
        $('#processUpload').css('border', '1px solid red')
        alertify.set("notifier", "position", "bottom-right");
        alertify.warning("Please process your uploaded document first");
      }
      else{
        mutate(payload)
      }

      
  }

  useEffect(() => {
    $('#sheetName').css('border', '1px solid rgba(145, 158, 171, 0.32)')
  }, [selectedSheet])

  if(isLoading){
    return <LoadingSpinner message='saving...'/>
  }


  return (
    <>
      <div className="page-wrapper">
        <div className="content" >
          <div className="page-header">
            <div className="page-title">
              <h4>Import Suppliers</h4>
              <h6>Bulk upload your suppliers</h6>
            </div>
          </div>
          {/* /product list */}
          <div style={{display:'grid', gap:20, gridTemplateColumns: '2fr 3fr'}}>
            <div className="card">
              <div className="card-body">
                <div className="requiredfield">
                  <h4>Field must be in csv format</h4>
                </div>
                <div className="row">
                  <div className="col-lg-12 col-sm-6 col-12">
                    <div className="form-group">
                      <a href={`https://akwaabaevolution.com/xcelTemplates/SuppliersTemplate.xlsx`} className="btn btn-submit w-100">Download Sample File</a>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label> Upload CSV File</label>
                      <div  {...getRootProps({className: 'dropzone'})} style={{border: '2px dashed #008179', height:200, textAlign:'center'}}>
                        <input {...getInputProps()} />
                        <div className="image-uploads">
                          <img src={Upload} alt="img" />
                          <h4>Click or Drag and drop a file to upload</h4>
                        </div>
                      </div>

                      <div style={{display:'flex', flexDirection:'column'}}>
                        <aside>
                          <label>File Name:</label>
                          <ul style={{ color: 'green' }}>{files}</ul>
                        </aside>

                        <aside style={{marginTop: 10}}>
                        
                          <select
                            className='form-control col-lg-12'
                            id='sheetName'
                            onChange={(e) => {
                              getSheetData(e)
                              setSelectedSheet(e.target.value)
                            }}
                            value={selectedSheet}
                          >
                            <option>Select Sheet</option>
                            {uploadedData?.SheetNames?.map((sheetname, index) => {
                              return <option key={index}>{sheetname}</option>
                            })}
                          </select>
                        </aside>
                      </div>
                      
                    </div>
                  </div>
                  <div className="col-lg-12 col-sm-12" style={{marginTop:10}}>
                    <div className="productdetails productdetailnew">
                      <ul className="product-bar">
                        <li>
                          <h4>Supplier Name</h4>
                          <h6 className="manitorygreen">This Field is required</h6>
                        </li>
                        <li>
                          <h4>Contact</h4>
                          <h6 className="manitorygreen">This Field is required</h6>
                        </li>
                        <li>
                          <h4>Products Supplied</h4>
                          <h6 className="manitorygreen">This Field is required</h6>
                        </li>
                      
                       
                      </ul>
                    </div>
                  </div>
                
                  <div className="col-lg-12">
                    <div className="form-group mb-0" id='processUpload'>
                      <button className="btn btn-submit me-2"  onClick={processUpload}>
                        Process Upload
                      </button>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='card'>
                <div className="col-lg-12 col-sm-12"  style={{marginTop:10}}>
                    <div className="table-responsive" style={{height:680}}>
                      <Table columns={columns} dataSource={productsList} />
                    </div>

                    <div className="col-lg-12">                    
                        <button className="btn btn-submit me-2 col-lg-12" onClick={submit}>
                           Submit
                        </button>
                  </div>
                </div>
            </div>
          </div>
        
          {/* /product list */}
        </div>
      </div>
    </>
  )
}

export default ImportSuppliers;