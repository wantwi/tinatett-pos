import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Pdf,
  Excel,
  Product7,
  Printer,
  EditIcon,
  Calendar,
  Product8,
  Product1,
} from "../../EntryFile/imagePath";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { useGet } from "../../hooks/useGet";
import { moneyInTxt } from "../../utility";
import jsPDF from "jspdf";

const ProformaDetail = () => {


  const {state} = useLocation()
  console.log(state)
  const { data, isLoading } = useGet("proforma-product-details", `/proforma/products/${state?.id}`);
  const [products, setProducts] = useState([])


  useEffect(() => {
    if(!isLoading){
      //console.log("Products:", data)
      let mappedData = data.data.map((item) => {
        return {
          productName:  item?.product?.name,
          quantity: item?.quantity,
          unitPrice: item?.unitPrice,
          amount: item?.amount
        }
      })
      setProducts(mappedData)
    }
  }, [isLoading])


  const createPDF =  (id, title) => {
    const pdf = new jsPDF("landscape", "pt", "a4");
    const data =  document.getElementById(id);
    pdf.html(data).then(() => {
      pdf.save(`${title}.pdf`);
    });
  };


  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Proforma Details</h4>
            <h6>View proforma details</h6>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="card-sales-split">
              <h2>Proforma Ref : {state?.proformaRef}</h2>
              <ul>
                {/* <li>
                  <Link to="#">
                    <img src={EditIcon} alt="img" />
                  </Link>
                </li> */}
                <li>
                  <Link to="#">
                    <img src={Pdf} alt="img" onClick={() => createPDF("proformaDetails" , "Proforma")}/>
                  </Link>
                </li>
                <li>
                  {/* <Link to="#">
                    <img src={Excel} alt="img" />
                  </Link> */}
                </li>
                {/* <li>
                  <Link to="#">
                    <img src={Printer} alt="img" />
                  </Link>
                </li> */}
              </ul>
            </div>
          <div  id="proformaDetails">
            <div     
              className="invoice-box table-height"
              style={{
                maxWidth: 1600,
                width: "100%",
                overflow: "auto",
                margin: "15px auto",
                padding: 0,
                fontSize: 14,
                lineHeight: "24px",
                color: "#555",
              }}
            >
              <table
              
                cellPadding={0}
                cellSpacing={0}
                style={{
                  width: "100%",
                  lineHeight: "24px",
                  textAlign: "left",
                }}
              >
                <tbody>
                  <tr className="top">
                    <td
                      colSpan={6}
                      style={{ padding: 5, verticalAlign: "top" }}
                    >
                      <table
                        style={{
                          width: "100%",
                          lineHeight: "24px",
                          textAlign: "left",
                        }}
                      >
                        <tbody>
                          <tr>
                            <td
                              style={{
                                padding: 5,
                                verticalAlign: "top",
                                textAlign: "left",
                                paddingBottom: 20,
                              }}
                            >
                              <font
                                style={{
                                  verticalAlign: "top",
                                  marginBottom: 25,
                                }}
                              >
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#7367F0",
                                    fontWeight: 600,
                                    lineHeight: "35px",
                                  }}
                                >
                                  Customer Info
                                </font>
                              </font>
                              <br />
                              <font style={{ verticalAlign: "top" }}>
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#000",
                                    fontWeight: 400,
                                  }}
                                >
                                  {" "}
                                  {state?.customerName}
                                </font>
                              </font>
                              <br />
                              <font style={{ verticalAlign: "top" }}>
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#000",
                                    fontWeight: 400,
                                  }}
                                >
                                  {" "}
                                  walk-in-customer@example.com
                                </font>
                              </font>
                              <br />
                              <font style={{ verticalAlign: "top" }}>
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#000",
                                    fontWeight: 400,
                                  }}
                                >
                                  {" "}
                                  123456780
                                </font>
                              </font>
                              <br />
                              <font style={{ verticalAlign: "top" }}>
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#000",
                                    fontWeight: 400,
                                  }}
                                >
                                  {" "}
                                  N45 , Dhaka
                                </font>
                              </font>
                              <br />
                            </td>

                            {/* <td
                              style={{
                                padding: 5,
                                verticalAlign: "top",
                                textAlign: "left",
                                paddingBottom: 20,
                              }}
                            >
                              <font
                                style={{
                                  verticalAlign: "top",
                                  marginBottom: 25,
                                }}
                              >
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#7367F0",
                                    fontWeight: 600,
                                    lineHeight: "35px",
                                  }}
                                >
                                  Company Info
                                </font>
                              </font>
                              <br />
                              <font style={{ verticalAlign: "top" }}>
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#000",
                                    fontWeight: 400,
                                  }}
                                >
                                  {" "}
                                  DGT{" "}
                                </font>
                              </font>
                              <br />
                              <font style={{ verticalAlign: "top" }}>
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#000",
                                    fontWeight: 400,
                                  }}
                                >
                                  {" "}
                                  admin@example.com
                                </font>
                              </font>
                              <br />
                              <font style={{ verticalAlign: "top" }}>
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#000",
                                    fontWeight: 400,
                                  }}
                                >
                                  6315996770
                                </font>
                              </font>
                              <br />
                              <font style={{ verticalAlign: "top" }}>
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#000",
                                    fontWeight: 400,
                                  }}
                                >
                                  {" "}
                                  3618 Abia Martin Drive
                                </font>
                              </font>
                              <br />
                            </td>

                            <td
                              style={{
                                padding: 5,
                                verticalAlign: "top",
                                textAlign: "left",
                                paddingBottom: 20,
                              }}
                            >
                              <font
                                style={{
                                  verticalAlign: "top",
                                  marginBottom: 25,
                                }}
                              >
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#7367F0",
                                    fontWeight: 600,
                                    lineHeight: "35px",
                                  }}
                                >
                                  Invoice Info
                                </font>
                              </font>
                              <br />
                              <font style={{ verticalAlign: "top" }}>
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#000",
                                    fontWeight: 400,
                                  }}
                                >
                                  {" "}
                                  Reference{" "}
                                </font>
                              </font>
                              <br />
                              <font style={{ verticalAlign: "top" }}>
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#000",
                                    fontWeight: 400,
                                  }}
                                >
                                  {" "}
                                  Payment Status
                                </font>
                              </font>
                              <br />
                              <font style={{ verticalAlign: "top" }}>
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#000",
                                    fontWeight: 400,
                                  }}
                                >
                                  {" "}
                                  Status
                                </font>
                              </font>
                              <br />
                            </td>

                            <td
                              style={{
                                padding: 5,
                                verticalAlign: "top",
                                textAlign: "right",
                                paddingBottom: 20,
                              }}
                            >
                              <font
                                style={{
                                  verticalAlign: "top",
                                  marginBottom: 25,
                                }}
                              >
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#7367F0",
                                    fontWeight: 600,
                                    lineHeight: "35px",
                                  }}
                                >
                                  &nbsp;
                                </font>
                              </font>
                              <br />
                              <font style={{ verticalAlign: "top" }}>
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#000",
                                    fontWeight: 400,
                                  }}
                                >
                                  SL0101{" "}
                                </font>
                              </font>
                              <br />
                              <font style={{ verticalAlign: "top" }}>
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#2E7D32",
                                    fontWeight: 400,
                                  }}
                                >
                                  {" "}
                                  Paid
                                </font>
                              </font>
                              <br />
                              <font style={{ verticalAlign: "top" }}>
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#2E7D32",
                                    fontWeight: 400,
                                  }}
                                >
                                  {" "}
                                  Completed
                                </font>
                              </font>
                              <br />
                            </td> */}
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  {/* Product info */}
                  <tr className="heading " style={{ background: "#F3F2F7" }}>
                    <td
                      style={{
                        padding: 10,
                        verticalAlign: "middle",
                        fontWeight: 600,
                        color: "#5E5873",
                        fontSize: 14,
                      }}
                    >
                      Product Name
                    </td>
                    <td
                      style={{
                        padding: 10,
                        verticalAlign: "middle",
                        fontWeight: 600,
                        color: "#5E5873",
                        fontSize: 14,
                      }}
                    >
                      QTY
                    </td>
                    <td
                      style={{
                        padding: 10,
                        verticalAlign: "middle",
                        fontWeight: 600,
                        color: "#5E5873",
                        fontSize: 14,
                      }}
                    >
                      Price
                    </td>
                   
                    
                    <td
                      style={{
                        padding: 10,
                        verticalAlign: "middle",
                        fontWeight: 600,
                        color: "#5E5873",
                        fontSize: 14,
                      }}
                    >
                      Subtotal
                    </td>
                  </tr>
                  {products.map((product) => (
                    <tr
                    className="details"
                    style={{ borderBottom: "1px solid #E9ECEF" }}
                    key={product?.productId}
                  >
                    <td
                      style={{
                        padding: 10,
                        verticalAlign: "top",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      
                     {product?.productName}
                    </td>
                    <td style={{ padding: 10, verticalAlign: "top" }}>{product?.quantity}</td>
                    <td style={{ padding: 10, verticalAlign: "top" }}>
                      {moneyInTxt(product?.unitPrice)}
                    </td>
                    
                    <td style={{ padding: 10, verticalAlign: "top" }}>
                     {moneyInTxt(product?.amount)}
                    </td>
                  </tr>
                  ))}
                  
                
                </tbody>
              </table>
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
                    data={options}
                    options={{
                      placeholder: "Choose Status",
                    }}
                  />
                </div>
              </div> */}
              <div className="row">
                <div className="col-lg-6 ">
                  <div className="total-order w-100 max-widthauto m-auto mb-4">
                    <ul>
                      {/* <li>
                        <h4>Order Tax</h4>
                        <h5>$ 0.00 (0.00%)</h5>
                      </li>
                      <li>
                        <h4>Discount </h4>
                        <h5>$ 0.00</h5>
                      </li> */}
                    </ul>
                  </div>
                </div>
                <div className="col-lg-6 ">
                  <div className="total-order w-100 max-widthauto m-auto mb-4">
                    <ul>
                      <li>
                        <h4>Number of Products</h4>
                        <h5 style={{textAlign:'left'}}>{products.length}</h5>
                      </li>
                      <li className="total">
                        <h4>Grand Total</h4>
                        <h5 style={{textAlign:'left'}}>GHS {moneyInTxt(products.reduce((total, item) => total + item?.amount, 0))}</h5>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
          </div>
              <div className="col-lg-12">
                {/* <Link to="#" className="btn btn-submit me-2">
                  Update
                </Link>
                <Link to="#" className="btn btn-cancel">
                  Cancel
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProformaDetail;
