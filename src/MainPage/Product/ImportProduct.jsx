import React, {useCallback, useEffect, useState} from 'react'
import { EditIcon, Upload } from '../../EntryFile/imagePath';
import { read, utils} from 'xlsx'
import { useDropzone } from 'react-dropzone'
import Table from "../../EntryFile/datatable";
import { moneyInTxt } from '../../utility';
import { Link } from "react-router-dom";
import alertify from "alertifyjs";
import "../../../node_modules/alertifyjs/build/css/alertify.css"; 
import "../../../node_modules/alertifyjs/build/css/themes/semantic.css";
import { usePost } from '../../hooks/usePost';
import LoadingSpinner from '../../InitialPage/Sidebar/LoadingSpinner';
// import {excelFile} from '../../../public/xcelTemplates/ProductsTemplate.xlsx'

const ImportProduct = () => {

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
    const excelData = utils.sheet_to_json(xdt);


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

 

    // setimportedRecords(excelSheets[0].Data)
    setimportedRecords(excelData)
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
      //console.log("RESULTS", results)
      const renderData = importedRecords.map((value) => ({
        name: value.PRODUCT_NAME,
        retailPrice: Number(value.RETAIL_PRICE) || 0,
        wholeSalePrice: Number(value.WHOLESALE_PRICE) || 0,
        specialPrice: Number(value.SPECIAL_PRICE) || 0,
        alert: Number(value.ALERT),
        ownershipType: value.IS_TINATETT_PRODUCT == 'Yes' ? 'Tinatett' : 'Competitor'
      }))

      console.log(renderData, "Results")
      

      setProductsList(renderData)
      
    }
  }

  const onSuccess = (data) => {
    if(data)
    alertify.set("notifier", "position", "bottom-right");
    alertify.success("Products uploaded successfully.");
    setProductsList([])
  }

  const onError = () => {
    alertify.set("notifier", "position", "bottom-right");
    alertify.error("Unable to upload products.");
  }


  const { isLoading, mutate } = usePost("/product/bulk", 'uploadProducts', onSuccess, onError);

  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      render: (text, record) => (
        <div className="productimgname">
          {/* <Link className="product-img">
            <img alt="" src={record.image} />
          </Link> */}
          <Link style={{ fontSize: "15px", marginLeft: "10px" }}>
            {record.name}
          </Link>
        </div>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Retail Price",
      dataIndex: "retailPrice",
      sorter: (a, b) => a.retailPrice - b.retailPrice,
      render: (text, record) => <p>{moneyInTxt(record?.retailPrice)}</p> 
    },
    {
      title: "Wholesale Price",
      dataIndex: "wholeSalePrice",
      sorter: (a, b) => a.wholeSalePrice - b.wholeSalePrice,
      render: (text, record) => <p>{moneyInTxt(record?.wholeSalePrice)}</p> 
    },
    {
      title: "Special Price",
      dataIndex: "specialPrice",
      sorter: (a, b) => a.specialPrice - b.specialPrice,
      render: (text, record) => <p>{moneyInTxt(record?.specialPrice)}</p> 
    },
    {
      title: "Alert",
      dataIndex: "alert",
    },
    {
      title: "Tinatett/Competitor",
      dataIndex: "ownershipType",
    },
   
    // {
    //   title: "Action",
    //   render: (text, record) => (
    //     <>
    //       <>
    //         {/* <Link className="me-3" to="/tinatett-pos/product/product-details">
    //           <img src={EyeIcon} alt="img" />
    //         </Link> */}
    //         <Link className="me-3" to={{ pathname:`/tinatett-pos/product/editproduct`, state:record}} title="Edit Product">
    //           <img src={EditIcon} alt="img" />
    //         </Link>
    //         {/* <Link className="confirm-text" to="#" onClick={confirmText} title="Delete Product">
    //           <img src={DeleteIcon} alt="img" />
    //         </Link> */}
    //       </>
    //     </>
    //   ),
    // },
  ];

  const submit = () => {
      let payload = {
        products: productsList
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
              <h4>Import Products</h4>
              <h6>Bulk upload your products</h6>
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
                      <a href={`https://akwaabaevolution.com/xcelTemplates/ProductsTemplate.xlsx`} className="btn btn-submit w-100">Download Sample File</a>
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
                          <h4>Product Name</h4>
                          <h6 className="manitorygreen">This Field is required</h6>
                        </li>
                        <li>
                          <h4>Retail Price</h4>
                          <h6 className="manitorygreen">This Field is required</h6>
                        </li>
                        <li>
                          <h4>Wholesale Price</h4>
                          <h6 className="manitorygreen">This Field is required</h6>
                        </li>
                        <li>
                          <h4>Special Price</h4>
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

export default ImportProduct;