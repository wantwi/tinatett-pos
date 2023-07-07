import React, { useEffect, useState } from "react";
import {
  AvocatImage,
  Dash1,
  Dash2,
  Dash3,
  Dash4,
  Dropdown,
  OrangeImage,
  PineappleImage,
  EarpodIcon,
  StawberryImage,
  IphoneIcon,
  SamsungIcon,
  MacbookIcon,
} from "../EntryFile/imagePath";
import { Table } from "antd";
import "antd/dist/antd.css";
import Chart from "react-apexcharts";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import CountUp from "react-countup";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { useGet } from "../hooks/useGet";
import { moneyInTxt } from "../utility";
import useAuth from "../hooks/useAuth";
import LoadingSpinner from "../InitialPage/Sidebar/LoadingSpinner";


const Dashboard = (props) => {

  const expiredProductColumns = [
    {
      title: "Batch No.",
      dataIndex: "batchNumber",
      sorter: (a, b) => a.batchNumber.length - b.batchNumber.length,
    },
    {
      title: "Product",
      dataIndex: "productName",
      render: (text, record) => (
        <Link to="#" style={{ fontSize: "14px" }}>
          {text}
        </Link>
      ),
      sorter: (a, b) => a.productName.length - b.productName.length,
    },
   
    {
      title: "Manufacturing Date",
      dataIndex: "manufacturingDate",
      render: (text, record) => <div style={{ fontSize: "14px" }}>{text.substring(0,10)}</div>,
      sorter: (a, b) => a.manufacturingDate.length - b.manufacturingDate.length,
    },
    {
      title: "Expiry Date",
      dataIndex: "expireDate",
      render: (text, record) => <div style={{ fontSize: "14px" }}>{text.substring(0,10)}</div>,
      sorter: (a, b) => a.expireDate.length - b.expireDate.length,
    },
    {
      title: "Days Left",
      dataIndex: "expirationStatus",
      render: (text, record) => <div style={{ fontSize: "14px" }}>{text}</div>,
      sorter: (a, b) => a.expirationStatus.length - b.expirationStatus.length,
    },
  ];

  const recentDataColumns = [
    {
      title: "Product",
      dataIndex: "productName",
      sorter: (a, b) => a.productName.length - b.productName.length,
      
    },
    {
      title: "QTY Sold",
      dataIndex: "QTY",
      render: (text, record) => (
        <div className="productimgname">
          <Link to="#" style={{ fontSize: "14px" }}>
            {text}
          </Link>
        </div>
      ),
     
    },
    {
      title: "Amount Sold",
      dataIndex: "Amount",
      render: (text, record) => <div style={{ fontSize: "14px" }}>{moneyInTxt(text)}</div>,
    },
  ];

  const alertDataColumns = [
    {
      title: "Product",
      dataIndex: "productName",
      sorter: (a, b) => a.productName.length - b.productName.length,
     
    },
    {
      title: "Avail. Stock",
      dataIndex: "stock",
      render: (text, record) => (
        <div className="productimgname">
          <Link to="#" style={{ fontSize: "14px" }}>
            {text}
          </Link>
        </div>
      ),
     
    },
   
  ];

  const customerDataColumns = [
    {
      title: "Name",
      dataIndex: "name",
      // sorter: (a, b) => a.key.length - b.key.length,
    },
    {
      title: "Contact",
      dataIndex: "contact",
      render: (text, record) => (
        <div className="productimgname">
          <Link to="#" style={{ fontSize: "14px" }}>
            {record.contact}
          </Link>
        </div>
      ),
      sorter: (a, b) => a.products.length - b.products.length,
    },
    {
      title: "No. Of Trans.",
      dataIndex: "transactionCount",
      render: (text, record) => (
        <div style={{ fontSize: "14px" }}>{(text)}</div>
      ),
      sorter: (a, b) => a.price - b.price,
    },
  ];
  const [data, setData] = useState(null)
  const [expiredData, setExpiredData] = useState([])
  const [topProductsData, settopProductsData] = useState([])
  const [topcustomersData, settopcustomersData] = useState([])
  
  const {data: dashboardSummary,isLoading} = useGet("dashboardSummary", "/dashboard/salesAndpurchase");
  const {data: expiring, isLoading: expLoading} = useGet("expiring", "/dashboard/productExpirationStatus");
  const {data: topproducts, isLoading: topproductsLoading} = useGet("topproducts", "/dashboard/topproducts");
  const {data: topcustomers, isLoading: topcustomersLoading} = useGet("topcustomers", "/dashboard/topcustomers");
  const {data: alertList} = useGet("productalert", "/dashboard/productAlert");


  useEffect(() => {
    if (!isLoading && !expLoading && !topcustomersLoading && !topproductsLoading) {
      setData(dashboardSummary?.data[0])
      setExpiredData(expiring?.data)
      settopProductsData(topproducts?.data)
      settopcustomersData(topcustomers?.data)
    }
  
  }, [isLoading, expLoading, topproductsLoading, topcustomersLoading])

  if(isLoading || topproductsLoading || topcustomersLoading){
    return <LoadingSpinner/>
  }

  return (
    <>
      <div className="page-wrapper">
        <Helmet>
          <title>Tinatett POS</title>
          <meta name="description" content="Dashboard page" />
        </Helmet>
     
        <div className="content">
          <div className="row">
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="dash-widget">
                <div className="dash-widgetimg">
                  <span>
                    <img src={Dash1} alt="img" />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    GHS {' '} 
                    <span className="counters">
                      <CountUp end={data?.monthlySales || 0} />
                    </span>
                  </h5>
                  <h6>Total Monthly Sales</h6>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="dash-widget dash3">
                <div className="dash-widgetimg">
                  <span>
                    <img src={Dash4} alt="img" />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                  GHS {' '} 
                    <span className="counters">
                      <CountUp end={data?.dailySales} />
                    </span>
                  </h5>
                  <h6>Daily Sales Amount</h6>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="dash-widget dash1">
                <div className="dash-widgetimg">
                  <span>
                    <img src={Dash2} alt="img" />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    GHS {' '} 
                    <span className="counters">
                      <CountUp end={data?.monthlyPurchase || 0} />
                    </span>
                  </h5>
                  <h6>Total Monthly Purchase</h6>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="dash-widget dash3">
                <div className="dash-widgetimg">
                  <span>
                    <img src={Dash4} alt="img" />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                  GHS {' '} 
                    <span className="counters">
                      <CountUp end={data?.numberofSales} />
                    </span>
                  </h5>
                  <h6>Daily Purchase Amount</h6>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6 col-12">
              <div className="dash-widget dash2">
                <div className="dash-widgetimg">
                  <span>
                    <img src={Dash3} alt="img" />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                  GHS {' '} 
                    <span className="counters">
                      <CountUp end={data?.numberofPurchase} />
                    </span>
                  </h5>
                  <h6>Total Stock Value</h6>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="dash-widget dash3">
                <div className="dash-widgetimg">
                  <span>
                    <img src={Dash4} alt="img" />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                  
                    <span className="counters">
                      <CountUp end={data?.numberofSales} />
                    </span>
                  </h5>
                  <h6>No of Invoices</h6>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="dash-widget dash3">
                <div className="dash-widgetimg">
                  <span>
                    <img src={Dash4} alt="img" />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                  
                    <span className="counters">
                      <CountUp end={data?.dailyNumberOfProductSold || 0} />
                    </span>
                  </h5>
                  <h6>Total Quantity of Products Sold (Daily)</h6>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="dash-widget dash3">
                <div className="dash-widgetimg">
                  <span>
                    <img src={Dash4} alt="img" />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                  
                    <span className="counters">
                      <CountUp end={data?.monthlyNumberOfProductSold} />
                    </span>
                  </h5>
                  <h6>Total Quantity of Products Sold (Monthly)</h6>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="dash-widget dash3">
                <div className="dash-widgetimg">
                  <span>
                    <img src={Dash4} alt="img" />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                   GHS {' '}
                    <span className="counters">
                      <CountUp end={data?.numberofSales} />
                    </span>
                  </h5>
                  <h6>Total Profit Margin (Daily)</h6>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="dash-widget dash3">
                <div className="dash-widgetimg">
                  <span>
                    <img src={Dash4} alt="img" />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    GHS {' '}
                    <span className="counters">
                      <CountUp end={data?.numberofSales} />
                    </span>
                  </h5>
                  <h6>Total Profit Margin (Monthly)</h6>
                </div>
              </div>
            </div>
         
           
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="dash-widget dash3">
                <div className="dash-widgetimg">
                  <span>
                    <img src={Dash4} alt="img" />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                  GHS {' '} 
                    <span className="counters">
                      <CountUp end={data?.dailyExpenses || 0} />
                    </span>
                  </h5>
                  <h6>Total Expenses (Daily)</h6>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="dash-widget dash3">
                <div className="dash-widgetimg">
                  <span>
                    <img src={Dash4} alt="img" />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                  GHS {' '} 
                    <span className="counters">
                      <CountUp end={data?.monthlyExpenses || 0} />
                    </span>
                  </h5>
                  <h6>Total Expenses (Monthly)</h6>
                </div>
              </div>
            </div>
            {/* <div className="col-lg-3 col-sm-6 col-12 d-flex">
              <div className="dash-count">
                <div className="dash-counts">
                  <h4>{data?.total_customers}</h4>
                  <h5>Customers</h5>
                </div>
                <div className="dash-imgs">
                  <FeatherIcon icon="user" />
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12 d-flex">
              <div className="dash-count das1">
                <div className="dash-counts">
                  <h4>{data?.total_suppliers}</h4>
                  <h5>Suppliers</h5>
                </div>
                <div className="dash-imgs">
                  <FeatherIcon icon="user-check" />
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12 d-flex">
              <div className="dash-count das2">
                <div className="dash-counts">
                  <h4>{data?.pruchase_invoice}</h4>
                  <h5>Purchase Invoice</h5>
                </div>
                <div className="dash-imgs">
                  <FeatherIcon icon="file-text" />
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12 d-flex">
              <div className="dash-count das3">
                <div className="dash-counts">
                <h4>{data?.sales_invoice}</h4>
                  <h5>Sales Invoice</h5>
                </div>
                <div className="dash-imgs">
                  <FeatherIcon icon="file" />
                </div>
              </div>
            </div> */}
          </div>

          <div className="row">
            <div className="col-lg-4 col-sm-12 col-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header pb-0 d-flex justify-content-between align-items-center">
                  <h4 className="card-title mb-0">Top 20 Customers</h4>
                  <div className="dropdown dropdown-action profile-action">
                    <Link
                      to="#"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      className="dropset"
                    >
                      <i className="fa fa-ellipsis-v" />
                    </Link>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton"
                    >
                      <li>
                        <Link
                          to="/tinatett-pos/people/customerlist"
                          className="dropdown-item"
                        >
                          Customer List
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/people/addcustomer"
                          className="dropdown-item"
                        >
                          Customer Add
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive dataview">
                    <Table
                      className="table datatable"
                      key={props}
                      columns={customerDataColumns}
                      dataSource={topcustomersData}
                      pagination={false}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-sm-12 col-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header pb-0 d-flex justify-content-between align-items-center">
                  <h4 className="card-title mb-0">Top 20 Selling Items</h4>
                  <div className="dropdown dropdown-action profile-action">
                    <Link
                      to="#"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      className="dropset"
                    >
                      <i className="fa fa-ellipsis-v" />
                    </Link>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton"
                    >
                      <li>
                        <Link
                          to="/tinatett-pos/product/productlist"
                          className="dropdown-item"
                        >
                          Product List
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/product/addproduct"
                          className="dropdown-item"
                        >
                          Product Add
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive dataview">
                    <Table
                      className="table datatable"
                      key={props}
                      columns={recentDataColumns}
                      dataSource={topProductsData}
                      pagination={false}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-sm-12 col-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header pb-0 d-flex justify-content-between align-items-center">
                  <h4 className="card-title mb-0">Product Alert</h4>
                  <div className="dropdown dropdown-action profile-action">
                    <Link
                      to="#"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      className="dropset"
                    >
                      <i className="fa fa-ellipsis-v" />
                    </Link>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton"
                    >
                      <li>
                        <Link
                          to="/tinatett-pos/product/productlist"
                          className="dropdown-item"
                        >
                          Product List
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/product/addproduct"
                          className="dropdown-item"
                        >
                          Product Add
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive dataview">
                    <Table
                      className="table datatable"
                      key={props}
                      columns={alertDataColumns}
                      dataSource={alertList}
                      pagination={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card mb-0">
            <div className="card-body">
              <h4 className="card-title">Expiring Products</h4>
              <div className="table-responsive dataview">
                <Table
                  className="table datatable"
                  key={props}
                  columns={expiredProductColumns}
                  dataSource={expiredData}
                  rowKey={(record) => record.id}
                  pagination={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
