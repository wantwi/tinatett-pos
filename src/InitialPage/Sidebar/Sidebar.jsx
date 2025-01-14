import React, { useEffect, useState } from "react";
import { withRouter, useHistory, useLocation } from "react-router-dom";
import {
  Dashboard,
  Expense,
  People,
  Places,
  Product,
  Time,
  Users1,
  settings,
  Purchase,
  Quotation,
  Return,
  Transfer,
  Sales1,
  cash,
  debitcard,
} from "../../EntryFile/imagePath";
import { Link } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";
import FeatherIcon from "feather-icons-react";

const Sidebar = (props) => {
  const [isSideMenu, setSideMenu] = useState("");
  const [path, setPath] = useState("");
  const history = useHistory();
  const [userType, setUserType] = useState('')

  const toggleSidebar = (value) => {
    setSideMenu(value);
  };
  const expandMenu = () => {
    document.body.classList.remove("expand-menu");
  };
  const expandMenuOpen = () => {
    document.body.classList.add("expand-menu");
  };
  const pageRefresh = (url, page) => {
    history.push(`/tinatett-pos/${url}/${page}`);
    window.location.reload();
  };
  const location = useLocation();
  let pathname = location.pathname;
  useEffect(() => {
    document.querySelector(".main-wrapper").classList.remove("slide-nav");
    document.querySelector(".sidebar-overlay").classList.remove("opened");
    document.querySelector(".sidebar-overlay").onclick = function () {
      this.classList.remove("opened");
      document.querySelector(".main-wrapper").classList.remove("slide-nav");
    };
  }, [pathname]);

  useEffect(() => {
    let userRole = localStorage.getItem('auth')
    let obj = JSON.parse(userRole)
    //console.log("Role:", obj.role)
    setUserType(obj.role)
  }, [])

  return (
    <div className="sidebar" id="sidebar" >
      <Scrollbars>
        <div className="sidebar-inner slimscroll">
          <div
            id="sidebar-menu"
            style={{ height: '93.5vh', overflowY: 'scroll' }}
            className="sidebar-menu"
            onMouseLeave={expandMenu}
            onMouseOver={expandMenuOpen}
          >
            <ul>
              {/* Dashboard */}
              <li className={pathname.includes("dashboard") ? "active" : ""}>
                <Link
                  to="/tinatett-pos/dashboard"
                  onClick={() => toggleSidebar(isSideMenu == "" ? "" : "")}
                >
                  <img src={Dashboard} alt="img" />
                  <span>Dashboard</span>
                </Link>
              </li>

              {/* Products */}
              {userType == 'admin' || userType == 'supervisor' ? (<li className="submenu">
                <a
                  href="#"
                  className={
                    pathname.includes("/tinatett-pos/product")
                      ? "active subdrop"
                      : "" || isSideMenu == "product"
                        ? "subdrop active"
                        : ""
                  }
                  onClick={() =>
                    toggleSidebar(isSideMenu == "product" ? "" : "product")
                  }
                >
                  <img src={Product} alt="img" />
                  <span> Products </span> <span className="menu-arrow" />
                </a>
                {isSideMenu == "product" ? (
                  <ul className="sidebar-ul">
                    <li>
                      <Link
                        className={
                          pathname.includes("addproduct-") ? "active" : ""
                        }
                        to="/tinatett-pos/product/addproduct"
                      >
                        Add Product
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={
                          pathname.includes("productlist-") ? "active" : ""
                        }
                        to="/tinatett-pos/product/productlist"
                      >
                        Product List
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={
                          pathname.includes("importproduct-") ? "active" : ""
                        }
                        to="/tinatett-pos/product/importproduct"
                      >
                        Import Products
                      </Link>
                    </li>

                    {/* <li>
                        <Link
                          className={
                            pathname.includes("categorylist-") ? "active" : ""
                          }
                          to="/tinatett-pos/product/categorylist-product"
                        >
                          Category List
                        </Link>
                      </li>
                      <li>
                        <Link
                          className={
                            pathname.includes("addcategory-") ? "active" : ""
                          }
                          to="/tinatett-pos/product/addcategory-product"
                        >
                          Add Category{" "}
                        </Link>
                      </li>
                      <li>
                        <Link
                          className={
                            pathname.includes("subcategorytable-")
                              ? "active"
                              : ""
                          }
                          to="/tinatett-pos/product/subcategorytable-product"
                        >
                          Sub Category List
                        </Link>
                      </li>
                      <li>
                        <Link
                          className={
                            pathname.includes("addsubcategory-") ? "active" : ""
                          }
                          to="/tinatett-pos/product/addsubcategory-product"
                        >
                          Add Sub Category{" "}
                        </Link>
                      </li>
                      <li>
                        <Link
                          className={
                            pathname.includes("brandlist-") ? "active" : ""
                          }
                          to="/tinatett-pos/product/brandlist-product"
                        >
                          Brand list{" "}
                        </Link>
                      </li>
                      <li>
                        <Link
                          className={
                            pathname.includes("addbrand-") ? "active" : ""
                          }
                          to="/tinatett-pos/product/addbrand-product"
                        >
                          Add Brand
                        </Link>
                      </li>
                      
                      <li>
                        <Link
                          className={
                            pathname.includes("printbarcode-") ? "active" : ""
                          }
                          to="/tinatett-pos/product/printbarcode-product"
                        >
                          Print Barcode
                        </Link>
                      </li> */}
                  </ul>
                ) : (
                  ""
                )}
              </li>) : null}

              {/* Customer */}
              {userType == 'admin' || userType == 'supervisor' ? (<li className="submenu">
                <a
                  href="#"
                  className={
                    pathname.includes("/tinatett-pos/customer")
                      ? "subdrop active"
                      : "" || isSideMenu == "customer"
                        ? "subdrop active"
                        : ""
                  }
                  onClick={() =>
                    toggleSidebar(isSideMenu == "customer" ? "" : "customer")
                  }
                >
                  {" "}
                  <img src={People} alt="img" /> <span>Customers</span>{" "}
                  <span className="menu-arrow"></span>
                </a>
                {isSideMenu == "customer" ? (
                  <ul>
                    <li>
                      <Link
                        className={
                          pathname.includes("addcustomer-") ? "active" : ""
                        }
                        to="/tinatett-pos/people/addcustomer"
                      >
                        Add Customer
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={
                          pathname.includes("customerlist-") ? "active" : ""
                        }
                        to="/tinatett-pos/people/customerlist"
                      >
                        Customer List
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={
                          pathname.includes("importproduct-") ? "active" : ""
                        }
                        to="/tinatett-pos/people/importcustomers"
                      >
                        Import Customers
                      </Link>
                    </li>



                    {/* <li>
                        <Link
                          className={
                            pathname.includes("userlist-") ? "active" : ""
                          }
                          to="/tinatett-pos/people/userlist-people"
                        >
                          User List
                        </Link>
                      </li>
                      <li>
                        <Link
                          className={
                            pathname.includes("adduser-") ? "active" : ""
                          }
                          to="/tinatett-pos/people/adduser-people"
                        >
                          Add User
                        </Link>
                      </li>
                      <li>
                        <Link
                          className={
                            pathname.includes("storelist-") ? "active" : ""
                          }
                          to="/tinatett-pos/people/storelist-people"
                        >
                          Store List
                        </Link>
                      </li>
                      <li>
                        <Link
                          className={
                            pathname.includes("addstore-") ? "active" : ""
                          }
                          to="/tinatett-pos/people/addstore-people"
                        >
                          Add Store
                        </Link>
                      </li> */}
                  </ul>
                ) : (
                  ""
                )}
              </li>) : null}

              {/* Supplier */}
              {userType == 'admin' || userType == 'supervisor' ? (<li className="submenu">
                <a
                  href="#"
                  className={
                    pathname.includes("/tinatett-pos/supplier")
                      ? "subdrop active"
                      : "" || isSideMenu == "supplier"
                        ? "subdrop active"
                        : ""
                  }
                  onClick={() =>
                    toggleSidebar(isSideMenu == "supplier" ? "" : "supplier")
                  }
                >
                  {" "}
                  <FeatherIcon icon="users" /> <span>Suppliers</span>{" "}
                  <span className="menu-arrow"></span>
                </a>
                {isSideMenu == "supplier" ? (
                  <ul>
                    <li>
                      <Link
                        className={
                          pathname.includes("addsupplier-") ? "active" : ""
                        }
                        to="/tinatett-pos/people/addsupplier"
                      >
                        Add Supplier
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={
                          pathname.includes("supplierlist-") ? "active" : ""
                        }
                        to="/tinatett-pos/people/supplierlist"
                      >
                        Supplier List
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={
                          pathname.includes("importproduct-") ? "active" : ""
                        }
                        to="/tinatett-pos/people/importsuppliers"
                      >
                        Import Suppliers
                      </Link>
                    </li>

                    {/* <li>
                        <Link
                          className={
                            pathname.includes("userlist-") ? "active" : ""
                          }
                          to="/tinatett-pos/people/userlist-people"
                        >
                          User List
                        </Link>
                      </li>
                      <li>
                        <Link
                          className={
                            pathname.includes("adduser-") ? "active" : ""
                          }
                          to="/tinatett-pos/people/adduser-people"
                        >
                          Add User
                        </Link>
                      </li>
                      <li>
                        <Link
                          className={
                            pathname.includes("storelist-") ? "active" : ""
                          }
                          to="/tinatett-pos/people/storelist-people"
                        >
                          Store List
                        </Link>
                      </li>
                      <li>
                        <Link
                          className={
                            pathname.includes("addstore-") ? "active" : ""
                          }
                          to="/tinatett-pos/people/addstore-people"
                        >
                          Add Store
                        </Link>
                      </li> */}
                  </ul>
                ) : (
                  ""
                )}
              </li>) : null}

              {/* Purchases */}
              {userType == 'admin' || userType == 'supervisor' ? (<li className="submenu">
                <a
                  href="#"
                  className={
                    pathname.includes("/tinatett-pos/purchase")
                      ? "subdrop active"
                      : "" || isSideMenu == "purchase"
                        ? "subdrop active"
                        : ""
                  }
                  onClick={() =>
                    toggleSidebar(isSideMenu == "purchase" ? "" : "purchase")
                  }
                >
                  {" "}
                  <i class="fa fa-window-restore" data-bs-toggle="tooltip" title="fa fa-window-restore"></i> <span>Purchase (Intake)</span>{" "}
                  <span className="menu-arrow"></span>
                </a>
                {isSideMenu == "purchase" ? (
                  <ul>
                    <li>
                      <Link
                        className={
                          pathname.includes("addpurchase-") ? "active" : ""
                        }
                        to="/tinatett-pos/purchase/addpurchase"
                      >
                        Add Purchase
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={
                          pathname.includes("purchaselist-") ? "active" : ""
                        }
                        to="/tinatett-pos/purchase/purchaselist"
                      >
                        Purchase List
                      </Link>
                    </li>

                    {/* <li>
                      <Link
                        className={
                          pathname.includes("importpurchase-") ? "active" : ""
                        }
                        to="/tinatett-pos/purchase/importpurchase-purchase"
                      >
                        Import Purchase
                      </Link>
                    </li> */}
                  </ul>
                ) : (
                  ""
                )}
              </li>) : null}

              {/* Proforma */}
              {userType == 'admin' || userType == 'supervisor' || userType == 'sales' ? (<li className="submenu">
                <a
                  href="#"
                  id="proform-submenu"
                  className={
                    pathname.includes("/tinatett-pos/proforma")
                      ? "active subdrop"
                      : "" || isSideMenu == "proforma"
                        ? "subdrop active"
                        : ""
                  }
                  onClick={() =>
                    toggleSidebar(isSideMenu == "proforma" ? "" : "proforma")
                  }
                >
                  <img src={Purchase} alt="img" />
                  <span> Proforma </span> <span className="menu-arrow" />
                </a>
                {isSideMenu == "proforma" ? (
                  <ul>
                    <li>
                      <Link
                        to="/tinatett-pos/proforma/add-proforma"
                        className={
                          pathname.includes("add-proforma") ? "active" : ""
                        }
                      >
                        New Proforma
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={
                          pathname.includes("proformalist") ? "active" : ""
                        }
                        to="/tinatett-pos/proforma/proformalist"
                      >
                        Proforma List
                      </Link>
                    </li>


                    {/* <li>
                        <Link
                          className={
                            pathname.includes("salesreturnlist") ? "active" : ""
                          }
                          to="/tinatett-pos/sales/salesreturnlist-return"
                        >
                          Sales Return List
                        </Link>
                      </li>
                      <li>
                        <Link
                          className={
                            pathname.includes("addsalesreturn") ? "active" : ""
                          }
                          to="/tinatett-pos/sales/addsalesreturn-return"
                        >
                          New Sales Return
                        </Link>
                      </li> */}
                  </ul>
                ) : (
                  ""
                )}
              </li>) : null}



              {/* Sales */}
              {userType == 'admin' || userType == 'supervisor' || userType == 'sales' ? (<li className="submenu">
                <a
                  href="#"
                  className={
                    pathname.includes("/tinatett-pos/sales")
                      ? "active subdrop"
                      : "" || isSideMenu == "sales"
                        ? "subdrop active"
                        : ""
                  }
                  onClick={() =>
                    toggleSidebar(isSideMenu == "sales" ? "" : "sales")
                  }
                >
                  <img src={Sales1} alt="img" />
                  <span> Sales </span> <span className="menu-arrow" />
                </a>
                {isSideMenu == "sales" ? (
                  <ul>
                    <li>
                      <Link
                        to="/tinatett-pos/sales/add-sales"
                        className={
                          pathname.includes("add-sales") ? "active" : ""
                        }
                      >
                        New Sales
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={
                          pathname.includes("sales/suspended") ? "active" : ""
                        }
                        to="/tinatett-pos/sales/suspended"
                      >
                        Suspended
                      </Link>
                    </li>

                    <li>
                      <Link
                        className={
                          pathname.includes("saleslist") ? "active" : ""
                        }
                        to="/tinatett-pos/sales/saleslist"
                      >
                        Sales List
                      </Link>
                    </li>
                    {/* <li>
                        <Link to="/pos">POS</Link>
                      </li> */}

                    {/* <li>
                        <Link
                          className={
                            pathname.includes("salesreturnlist") ? "active" : ""
                          }
                          to="/tinatett-pos/sales/salesreturnlist-return"
                        >
                          Sales Return List
                        </Link>
                      </li> */}
                    {/* <li>
                        <Link
                          className={
                            pathname.includes("addsalesreturn") ? "active" : ""
                          }
                          to="/tinatett-pos/sales/addsalesreturn-return"
                        >
                          New Sales Return
                        </Link>
                      </li> */}
                  </ul>
                ) : (
                  ""
                )}
              </li>) : null}



              {/* Cashier */}
              {userType == 'admin' || userType == 'supervisor' || userType == 'cashier' ? (<li className="submenu">
                <a
                  href="#"
                  className={
                    (pathname.includes("/sales-payment"))
                      ? "subdrop active"
                      : "" || isSideMenu == "cashier"
                        ? "subdrop active"
                        : ""
                  }
                  onClick={() =>
                    toggleSidebar(isSideMenu == "cashier" ? "" : "cashier")
                  }
                >
                  {" "}
                  <img src={debitcard} alt="img" /> <span>Cashier</span>{" "}
                  <span className="menu-arrow"></span>
                </a>
                {isSideMenu == "cashier" ? (
                  <ul>
                    <li>
                      <Link
                        className={
                          pathname.includes("/cashier/sales-payment") ? "active" : ""
                        }
                        to="/tinatett-pos/cashier/sales-payment"
                      >
                        Sales Payment
                      </Link>
                    </li>


                  </ul>
                ) : (
                  ""
                )}
              </li>) : null}


              {/* Credit Payment */}
              {userType == 'admin' || userType == 'supervisor' || userType == 'cashier' ? (<li className="submenu">
                <a
                  href="#"
                  className={
                    (pathname.includes("/credit-list") || pathname.includes("/credit-payment"))
                      ? "subdrop active"
                      : "" || isSideMenu == "credit"
                        ? "subdrop active"
                        : ""
                  }
                  onClick={() =>
                    toggleSidebar(isSideMenu == "credit" ? "" : "credit")
                  }
                >
                  {" "}
                  <img src={debitcard} alt="img" /> <span>Credit</span>{" "}
                  <span className="menu-arrow"></span>
                </a>
                {isSideMenu == "credit" ? (
                  <ul>

                    <li>
                      <Link
                        className={
                          pathname.includes("/cashier/credit-payment") ? "active" : ""
                        }
                        to="/tinatett-pos/cashier/credit-payment"
                      >
                        Credit Payments
                      </Link>
                    </li>

                    <li>
                      <Link
                        className={
                          pathname.includes("/cashier/credit-list") ? "active" : ""
                        }
                        to="/tinatett-pos/cashier/credit-list"
                        onClick={() => toggleSidebar(isSideMenu == "" ? "" : "")}
                      >
                        <span>Credit List </span>
                      </Link>
                    </li>




                  </ul>
                ) : (
                  ""
                )}
              </li>) : null}




              {/* Transfer */}
              {userType == 'admin' || userType == 'supervisor' ? (<li className="submenu">
                <a
                  href="#"
                  className={
                    pathname.includes("/tinatett-pos/transfer")
                      ? "subdrop active"
                      : "" || isSideMenu == "transfer"
                        ? "subdrop active"
                        : ""
                  }
                  onClick={() =>
                    toggleSidebar(isSideMenu == "transfer" ? "" : "transfer")
                  }
                >
                  {" "}
                  <img src={Transfer} alt="img" /> <span>Transfer</span>{" "}
                  <span className="menu-arrow"></span>
                </a>
                {isSideMenu == "transfer" ? (
                  <ul>
                    <li>
                      <Link
                        className={
                          pathname.includes("addtransfer-") ? "active" : ""
                        }
                        to="/tinatett-pos/transfer/addtransfer-transfer"
                      >
                        Add Transfer
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={
                          pathname.includes("transferlist-") ? "active" : ""
                        }
                        to="/tinatett-pos/transfer/transferlist-transfer"
                      >
                        Transfer List
                      </Link>
                    </li>

                    {/* <li>
                        <Link
                          className={
                            pathname.includes("importtransfer-") ? "active" : ""
                          }
                          to="/tinatett-pos/transfer/importtransfer-transfer"
                        >
                          Import Transfer
                        </Link>
                      </li> */}
                  </ul>
                ) : (
                  ""
                )}
              </li>) : null}

              {/* Expense */}
              {userType == 'admin' || userType == 'supervisor' || userType == 'cashier' ? (<li className="submenu">
                <a
                  href="#"
                  className={
                    pathname.includes("/tinatett-pos/expense")
                      ? "subdrop active"
                      : "" || isSideMenu == "expense"
                        ? "subdrop active"
                        : ""
                  }
                  onClick={() =>
                    toggleSidebar(isSideMenu == "expense" ? "" : "expense")
                  }
                >
                  {" "}
                  <img src={Expense} alt="img" /> <span>Expense</span>{" "}
                  <span className="menu-arrow"></span>
                </a>
                {isSideMenu == "expense" ? (
                  <ul>
                    <li>
                      <Link
                        className={
                          pathname.includes("addexpense") ? "active" : ""
                        }
                        to="/tinatett-pos/expense/addexpense"
                      >
                        Add Expense
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={
                          pathname.includes("expenselist") ? "active" : ""
                        }
                        to="/tinatett-pos/expense/expenselist"
                      >
                        Expense List
                      </Link>
                    </li>

                    {/* <li>
                        <Link
                          className={
                            pathname.includes("expensecategory-")
                              ? "active"
                              : ""
                          }
                          to="/tinatett-pos/expense/expensecategory-expense"
                        >
                          Expense Category
                        </Link>
                      </li> */}
                  </ul>
                ) : (
                  ""
                )}
              </li>) : null}

              {/* Product Transfer */}
              {userType == 'admin' || userType == 'supervisor' ? (<li className="submenu">
                <a
                  href="#"
                  className={
                    pathname.includes("/tinatett-pos/quotation")
                      ? "subdrop active"
                      : "" || isSideMenu == "quotation"
                        ? "subdrop active"
                        : ""
                  }
                  onClick={() =>
                    toggleSidebar(
                      isSideMenu == "quotation" ? "" : "quotation"
                    )
                  }
                >
                  {" "}
                  <img src={Quotation} alt="img" /> <span>Product Request</span>{" "}
                  <span className="menu-arrow"></span>
                </a>
                {isSideMenu == "quotation" ? (
                  <ul>

                    <li>
                      <Link
                        className={
                          pathname.includes("addquotation-") ? "active" : ""
                        }
                        to="/tinatett-pos/quotation/addquotation-quotation"
                      >
                        New Request
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={
                          pathname.includes("quotationlist-") ? "active" : ""
                        }
                        to="/tinatett-pos/quotation/quotationlist-quotation"
                      >
                        Request List
                      </Link>
                    </li>
                  </ul>
                ) : (
                  ""
                )}
              </li>) : null}


              {/* Reports */}
              {userType == 'admin' || userType == 'supervisor' ? (<li className="submenu">
                <Link
                  to="#"
                  className={
                    pathname.includes("/tinatett-pos/report")
                      ? "subdrop active"
                      : "" || isSideMenu == "Report"
                        ? "subdrop active"
                        : ""
                  }
                  onClick={() =>
                    toggleSidebar(isSideMenu == "Report" ? "" : "Report")
                  }
                >
                  <img src={Time} alt="img" />
                  <span> Reports</span> <span className="menu-arrow" />
                </Link>
                {isSideMenu == "Report" ? (
                  <ul>
                    <li>
                      <Link
                        to="/tinatett-pos/report/inventoryreport"
                        className={
                          pathname.includes("inventoryreport") ? "active" : ""
                        }
                      >
                        Product
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/tinatett-pos/report/purchaseorderreport"
                        className={
                          pathname.includes("purchaseorderreport")
                            ? "active"
                            : ""
                        }
                      >
                        Purchase
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/tinatett-pos/report/purchase-summary-report"
                        className={
                          pathname.includes("purchase-summary") ? "active" : ""
                        }
                      >
                        Purchase Summary
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/tinatett-pos/report/salesreport"
                        className={
                          pathname.includes("salesreport") ? "active" : ""
                        }
                      >
                        Sales
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/tinatett-pos/report/sales-summary-report"
                        className={
                          pathname.includes("sales-summary") ? "active" : ""
                        }
                      >
                        Sales Summary
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/tinatett-pos/report/stock-report"
                        className={
                          pathname.includes("stock-report") ? "active" : ""
                        }
                      >
                        Open and Close Stock
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/tinatett-pos/report/transfer-report"
                        className={
                          pathname.includes("transfer-report") ? "active" : ""
                        }
                      >
                        Transfer
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/tinatett-pos/report/transfer-summary-report"
                        className={
                          pathname.includes("transfer-summary-report") ? "active" : ""
                        }
                      >
                        Transfer Summary
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/tinatett-pos/report/product-movement"
                        className={
                          pathname.includes("product-movement") ? "active" : ""
                        }
                      >
                        Product Movement
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/tinatett-pos/report/weekly-summary"
                        className={
                          pathname.includes("/weekly-summary") ? "active" : ""
                        }
                      >
                        Weekly Sale Summary
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/tinatett-pos/report/expenses"
                        className={
                          pathname.includes("expenses") ? "active" : ""
                        }
                      >
                        Expenses
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/tinatett-pos/report/financialactivity"
                        className={
                          pathname.includes("financialactivity") ? "active" : ""
                        }
                      >
                        Financial Activity
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/tinatett-pos/report/deleted-report"
                        className={
                          pathname.includes("deleted-report") ? "active" : ""
                        }
                      >
                        Delete Report
                      </Link>
                    </li>



                    {/* <li>
                      <Link
                        to="/tinatett-pos/report/invoicereport"
                        className={
                          pathname.includes("invoicereport") ? "active" : ""
                        }
                      >
                        Invoice Report
                      </Link>
                    </li> */}

                    {/* <li>
                      <Link
                        to="/tinatett-pos/report/supplierreport"
                        className={
                          pathname.includes("supplierreport") ? "active" : ""
                        }
                      >
                        Supplier Report
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/tinatett-pos/report/customerreport"
                        className={
                          pathname.includes("customerreport") ? "active" : ""
                        }
                      >
                        Customer Report
                      </Link>
                    </li> */}
                  </ul>
                ) : (
                  ""
                )}
              </li>) : null}


              {/* Users */}
              {userType == 'admin' ? (<li className="submenu">
                <Link
                  to="#"
                  className={
                    pathname.includes("/tinatett-pos/users")
                      ? "subdrop active"
                      : "" || isSideMenu == "Users"
                        ? "subdrop active"
                        : ""
                  }
                  onClick={() =>
                    toggleSidebar(isSideMenu == "Users" ? "" : "Users")
                  }
                >
                  {/* <img src={Users1} alt="img" /> */}
                  <i className="fa fa-cog" />
                  <span> Admin</span> <span className="menu-arrow" />
                </Link>
                {isSideMenu == "Users" ? (
                  <ul>
                    <li>
                      <Link
                        to="/tinatett-pos/users/newuser"
                        className={
                          pathname.includes("newuser") ? "active" : ""
                        }
                      >
                        New User{" "}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/tinatett-pos/users/userlists"
                        className={
                          pathname.includes("userlists") ? "active" : ""
                        }
                      >
                        Users List
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/tinatett-pos/users/new-branch"
                        className={
                          pathname.includes("new-branch") ? "active" : ""
                        }
                      >
                        Add Branch
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/tinatett-pos/users/branch-list"
                        className={
                          pathname.includes("branch-list") ? "active" : ""
                        }
                      >
                        Branch List
                      </Link>
                    </li>
                  </ul>
                ) : (
                  ""
                )}
              </li>) : null}
              {/* <li className="submenu">
                  <a
                    href="#"
                    className={
                      pathname.includes("/tinatett-pos/return")
                        ? "subdrop active"
                        : "" || isSideMenu == "return"
                        ? "subdrop active"
                        : ""
                    }
                    onClick={() =>
                      toggleSidebar(isSideMenu == "return" ? "" : "return")
                    }
                  >
                    {" "}
                    <img src={Return} alt="img" /> <span>Return</span>{" "}
                    <span className="menu-arrow"></span>
                  </a>
                  {isSideMenu == "return" ? (
                    <ul>
                      <li>
                        <Link
                          className={
                            pathname.includes("salesreturnlist-")
                              ? "active"
                              : ""
                          }
                          to="/tinatett-pos/return/salesreturnlist-return"
                        >
                          Sales Return List
                        </Link>
                      </li>
                      <li>
                        <Link
                          className={
                            pathname.includes("addsalesreturn-") ? "active" : ""
                          }
                          to="/tinatett-pos/return/addsalesreturn-return"
                        >
                          Add Sales Return
                        </Link>
                      </li>
                      <li>
                        <Link
                          className={
                            pathname.includes("purchasereturnlist-")
                              ? "active"
                              : ""
                          }
                          to="/tinatett-pos/return/purchasereturnlist-return"
                        >
                          Purchase Return List
                        </Link>
                      </li>
                      <li>
                        <Link
                          className={
                            pathname.includes("addpurchasereturn-")
                              ? "active"
                              : ""
                          }
                          to="/tinatett-pos/return/addpurchasereturn-return"
                        >
                          Add Purchase Return
                        </Link>
                      </li>
                    </ul>
                  ) : (
                    ""
                  )}
                </li> */}


              {/* <li className="submenu">
                  <a
                    href="#"
                    className={
                      pathname.includes("/tinatett-pos/places")
                        ? "subdrop active"
                        : "" || isSideMenu == "places"
                        ? "subdrop active"
                        : ""
                    }
                    onClick={() =>
                      toggleSidebar(isSideMenu == "places" ? "" : "places")
                    }
                  >
                    {" "}
                    <img src={Places} alt="img" /> <span>Places</span>{" "}
                    <span className="menu-arrow"></span>
                  </a>
                  {isSideMenu == "places" ? (
                    <ul>
                      <li>
                        <Link
                          className={
                            pathname.includes("newcountry-") ? "active" : ""
                          }
                          to="/tinatett-pos/places/newcountry-places"
                        >
                          New Country
                        </Link>
                      </li>
                      <li>
                        <Link
                          className={
                            pathname.includes("countrylist-") ? "active" : ""
                          }
                          to="/tinatett-pos/places/countrylist-places"
                        >
                          Country List
                        </Link>
                      </li>
                      <li>
                        <Link
                          className={
                            pathname.includes("newstate-") ? "active" : ""
                          }
                          to="/tinatett-pos/places/newstate-places"
                        >
                          New State
                        </Link>
                      </li>
                      <li>
                        <Link
                          className={
                            pathname.includes("statelist-") ? "active" : ""
                          }
                          to="/tinatett-pos/places/statelist-places"
                        >
                          State List
                        </Link>
                      </li>
                    </ul>
                  ) : (
                    ""
                  )}
                </li> */}
              {/* <li className={pathname.includes("components") ? "active" : ""}>
                  <Link
                    to="/tinatett-pos/components"
                    onClick={() => toggleSidebar(isSideMenu == "" ? "" : "")}
                  >
                    {" "}
                    <FeatherIcon icon="layers" />
                    <span>Components</span>
                  </Link>
                </li> */}
              {/* <li className={pathname.includes("blankpage") ? "active" : ""}>
                  <Link
                    to="/tinatett-pos/blankpage"
                    onClick={() => toggleSidebar(isSideMenu == "" ? "" : "")}
                  >
                    {" "}
                    <FeatherIcon icon="file" />
                    <span>Blank Page</span>
                  </Link>
                </li> */}
              {/* <li className="submenu">
                  <a
                    href="#"
                    className={
                      isSideMenu == "error pages" ? "subdrop active" : ""
                    }
                    onClick={() =>
                      toggleSidebar(
                        isSideMenu == "error pages" ? "" : "error pages"
                      )
                    }
                  >
                    {" "}
                    <FeatherIcon icon="alert-octagon" />
                    <span> Error Pages </span> <span className="menu-arrow" />
                  </a>
                  {isSideMenu == "error pages" ? (
                    <ul>
                      <li>
                        <Link to="/error-404">404 Error </Link>
                      </li>
                      <li>
                        <Link to="/error-500">500 Error </Link>
                      </li>
                    </ul>
                  ) : (
                    ""
                  )}
                </li> */}
              {/* <li className="submenu">
                  <Link
                    to="#"
                    className={
                      pathname.includes("/tinatett-pos/elements")
                        ? "subdrop active"
                        : "" || isSideMenu == "elements"
                        ? "subdrop active"
                        : ""
                    }
                    onClick={() =>
                      toggleSidebar(isSideMenu == "elements" ? "" : "elements")
                    }
                  >
                    <FeatherIcon icon="box" />
                    <span>Elements </span> <span className="menu-arrow" />
                  </Link>
                  {isSideMenu == "elements" ? (
                    <ul>
                      <li>
                        <Link
                          to="/tinatett-pos/elements/sweetalerts"
                          className={
                            pathname.includes("sweetalerts") ? "active" : ""
                          }
                        >
                          Sweet Alerts
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/elements/tooltip"
                          className={
                            pathname.includes("tooltip") ? "active" : ""
                          }
                        >
                          Tooltip
                        </Link>
                      </li>
                      <li>
                        <Link
                          className={
                            pathname.includes("popover") ? "active" : ""
                          }
                          to="/tinatett-pos/elements/popover"
                        >
                          Popover
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/elements/ribbon"
                          className={
                            pathname.includes("ribbon") ? "active" : ""
                          }
                        >
                          Ribbon
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/elements/clipboard"
                          className={
                            pathname.includes("clipboard") ? "active" : ""
                          }
                        >
                          Clipboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/elements/drag-drop"
                          className={
                            pathname.includes("drag-drop") ? "active" : ""
                          }
                        >
                          Drag &amp; Drop
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/elements/rangeslider"
                          className={
                            pathname.includes("rangeslider") ? "active" : ""
                          }
                          onClick={(e) =>
                            pageRefresh("elements", "rangeslider")
                          }
                        >
                          Range Slider
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/elements/rating"
                          className={
                            pathname.includes("rating") ? "active" : ""
                          }
                        >
                          Rating
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/elements/toastr"
                          className={
                            pathname.includes("toastr") ? "active" : ""
                          }
                        >
                          Toastr
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/elements/text-editor"
                          className={
                            pathname.includes("text-editor") ? "active" : ""
                          }
                        >
                          Text Editor
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/elements/counter"
                          className={
                            pathname.includes("counter") ? "active" : ""
                          }
                        >
                          Counter
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/elements/scrollbar"
                          className={
                            pathname.includes("scrollbar") ? "active" : ""
                          }
                        >
                          Scrollbar
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/elements/spinner"
                          className={
                            pathname.includes("spinner") ? "active" : ""
                          }
                        >
                          Spinner
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/elements/notification"
                          className={
                            pathname.includes("notification") ? "active" : ""
                          }
                        >
                          Notification
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/elements/lightbox"
                          className={
                            pathname.includes("lightbox") ? "active" : ""
                          }
                        >
                          Lightbox
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/elements/stickynote"
                          className={
                            pathname.includes("stickynote") ? "active" : ""
                          }
                        >
                          Sticky Note
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/elements/timeline"
                          className={
                            pathname.includes("timeline") ? "active" : ""
                          }
                        >
                          Timeline
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/elements/form-wizard"
                          className={
                            pathname.includes("form-wizard") ? "active" : ""
                          }
                          onClick={(e) =>
                            pageRefresh("elements", "form-wizard")
                          }
                        >
                          Form Wizard
                        </Link>
                      </li>
                    </ul>
                  ) : (
                    ""
                  )}
                </li> */}
              {/* <li className="submenu">
                  <Link
                    to="#"
                    className={
                      pathname.includes("/tinatett-pos/charts")
                        ? "subdrop active"
                        : "" || isSideMenu == "Charts"
                        ? "subdrop active"
                        : ""
                    }
                    onClick={() =>
                      toggleSidebar(isSideMenu == "Charts" ? "" : "Charts")
                    }
                  >
                    <FeatherIcon icon="bar-chart-2" />
                    <span> Charts</span> <span className="menu-arrow" />
                  </Link>
                  {isSideMenu == "Charts" ? (
                    <ul>
                      <li>
                        <Link
                          to="/tinatett-pos/charts/chart-apex"
                          className={
                            pathname.includes("chart-apex") ? "active" : ""
                          }
                        >
                          Apex Charts
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/charts/chart-js"
                          className={
                            pathname.includes("chart-js") ? "active" : ""
                          }
                          onClick={(e) => pageRefresh("charts", "chart-js")}
                        >
                          Chart Js
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/charts/chart-morris"
                          className={
                            pathname.includes("chart-morris") ? "active" : ""
                          }
                        >
                          Morris Charts
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/charts/chart-flot"
                          className={
                            pathname.includes("chart-flot") ? "active" : ""
                          }
                          onClick={(e) => pageRefresh("charts", "chart-flot")}
                        >
                          Flot Charts
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/charts/chart-peity"
                          className={
                            pathname.includes("chart-peity") ? "active" : ""
                          }
                          onClick={(e) => pageRefresh("charts", "chart-peity")}
                        >
                          Peity Charts
                        </Link>
                      </li>
                    </ul>
                  ) : (
                    ""
                  )}
                </li> */}
              {/* <li className="submenu">
                  <Link
                    to="#"
                    className={
                      pathname.includes("/tinatett-pos/icons")
                        ? "subdrop active"
                        : "" || isSideMenu == "Icons"
                        ? "subdrop active"
                        : ""
                    }
                    onClick={() =>
                      toggleSidebar(isSideMenu == "Icons" ? "" : "Icons")
                    }
                  >
                    <FeatherIcon icon="award" />
                    <span> Icons</span> <span className="menu-arrow" />
                  </Link>
                  {isSideMenu == "Icons" ? (
                    <ul>
                      <li>
                        <Link
                          to="/tinatett-pos/icons/icon-fontawesome"
                          className={
                            pathname.includes("fontawesome") ? "active" : ""
                          }
                        >
                          Fontawesome Icons
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/icons/icon-feather"
                          className={
                            pathname.includes("feather") ? "active" : ""
                          }
                        >
                          Feather Icons
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/icons/icon-ionic"
                          className={pathname.includes("ionic") ? "active" : ""}
                        >
                          Ionic Icons
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/icons/icon-material"
                          className={
                            pathname.includes("material") ? "active" : ""
                          }
                        >
                          Material Icons
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/icons/icon-pe7"
                          className={
                            pathname.includes("icon-pe7") ? "active" : ""
                          }
                        >
                          Pe7 Icons
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/icons/icon-simpleline"
                          className={
                            pathname.includes("simpleline") ? "active" : ""
                          }
                        >
                          Simpleline Icons
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/icons/icon-themify"
                          className={
                            pathname.includes("themify") ? "active" : ""
                          }
                        >
                          Themify Icons
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/icons/icon-weather"
                          className={
                            pathname.includes("weather") ? "active" : ""
                          }
                        >
                          Weather Icons
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/icons/icon-typicon"
                          className={
                            pathname.includes("typicon") ? "active" : ""
                          }
                        >
                          Typicon Icons
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/icons/icon-flag"
                          className={
                            pathname.includes("icon-flag") ? "active" : ""
                          }
                        >
                          Flag Icons
                        </Link>
                      </li>
                    </ul>
                  ) : (
                    ""
                  )}
                </li> */}


              {/* Duplicates */}
              {/* <li className="submenu">
                <Link
                  to="#"
                  className={
                    pathname.includes("/tinatett-pos/application")
                      ? "subdrop active"
                      : "" || isSideMenu == "Application"
                        ? "subdrop active"
                        : ""
                  }
                  onClick={() =>
                    toggleSidebar(
                      isSideMenu == "Application" ? "" : "Application"
                    )
                  }
                >
                  <img src={Product} alt="img" />
                  <span> Duplicates</span> <span className="menu-arrow" />
                </Link>
                {isSideMenu == "Application" ? (
                  <ul>
                    <li>
                      <Link
                        to="/tinatett-pos/application/chat"
                        className={pathname.includes("chat") ? "active" : ""}
                      >
                        Chat
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/tinatett-pos/application/calendar"
                        className={
                          pathname.includes("calendar") ? "active" : ""
                        }
                      >
                        Calendar
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/tinatett-pos/application/email"
                        className={pathname.includes("email") ? "active" : ""}
                      >
                        Email
                      </Link>
                    </li>
                  </ul>
                ) : (
                  ""
                )}
              </li> */}

              {/* Updates */}
              {/* <li className="submenu">
                <Link
                  to="#"
                  className={
                    pathname.includes("/tinatett-pos/table")
                      ? "subdrop active"
                      : "" || isSideMenu == "Table"
                        ? "subdrop active"
                        : ""
                  }
                  onClick={() =>
                    toggleSidebar(isSideMenu == "Table" ? "" : "Table")
                  }
                >
                  <FeatherIcon icon="layout" />
                  <span> Updates</span> <span className="menu-arrow" />
                </Link>
                {isSideMenu == "Table" ? (
                  <ul>
                    <li>
                      <Link
                        to="/tinatett-pos/table/tables-basic"
                        className={
                          pathname.includes("tables-basic") ? "active" : ""
                        }
                      >
                        Basic Tables{" "}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/tinatett-pos/table/data-tables"
                        className={
                          pathname.includes("data-tables") ? "active" : ""
                        }
                      >
                        Data Table{" "}
                      </Link>
                    </li>
                  </ul>
                ) : (
                  ""
                )}
              </li> */}

              {/* Lists */}
              {/* <li className="submenu">
                <Link
                  to="#"
                  className={
                    pathname.includes("/tinatett-pos/forms")
                      ? "subdrop active"
                      : "" || isSideMenu == "Forms"
                        ? "subdrop active"
                        : ""
                  }
                  onClick={() =>
                    toggleSidebar(isSideMenu == "Forms" ? "" : "Forms")
                  }
                >
                  <FeatherIcon icon="columns" />
                  <span> Lists</span> <span className="menu-arrow" />
                </Link>
                {isSideMenu == "Forms" ? (
                  <ul>
                    <li>
                      <Link
                        to="/tinatett-pos/forms/form-basic-inputs"
                        className={
                          pathname.includes("form-basic-inputs")
                            ? "active"
                            : ""
                        }
                      >
                        Basic Inputs{" "}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/tinatett-pos/forms/form-input-groups"
                        className={
                          pathname.includes("form-input-groups")
                            ? "active"
                            : ""
                        }
                      >
                        Input Groups{" "}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/tinatett-pos/forms/form-horizontal"
                        className={
                          pathname.includes("horizontal") ? "active" : ""
                        }
                      >
                        Horizontal Form{" "}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/tinatett-pos/forms/form-vertical"
                        className={
                          pathname.includes("form-vertical") ? "active" : ""
                        }
                      >
                        {" "}
                        Vertical Form{" "}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/tinatett-pos/forms/form-mask"
                        className={
                          pathname.includes("form-mask") ? "active" : ""
                        }
                      >
                        Form Mask{" "}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/tinatett-pos/forms/form-validation"
                        className={
                          pathname.includes("validation") ? "active" : ""
                        }
                      >
                        Form Validation{" "}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/tinatett-pos/forms/form-select2"
                        className={
                          pathname.includes("form-select2") ? "active" : ""
                        }
                      >
                        Form Select2{" "}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/tinatett-pos/forms/form-fileupload"
                        className={
                          pathname.includes("fileupload") ? "active" : ""
                        }
                      >
                        File Upload{" "}
                      </Link>
                    </li>
                  </ul>
                ) : (
                  ""
                )}
              </li> */}






              {/* Settings */}
              {/* <li className="submenu">
                  <Link
                    to="#"
                    className={
                      pathname.includes("/tinatett-pos/settings")
                        ? "subdrop active"
                        : "" || isSideMenu == "Settings"
                        ? "subdrop active"
                        : ""
                    }
                    onClick={() =>
                      toggleSidebar(isSideMenu == "Settings" ? "" : "Settings")
                    }
                  >
                    <img src={settings} alt="img" />
                    <span> Settings</span> <span className="menu-arrow" />
                  </Link>
                  {isSideMenu == "Settings" ? (
                    <ul>
                      <li>
                        <Link
                          to="/tinatett-pos/settings/generalsettings"
                          className={
                            pathname.includes("generalsettings") ? "active" : ""
                          }
                        >
                          General Settings
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/settings/emailsettings"
                          className={
                            pathname.includes("emailsettings") ? "active" : ""
                          }
                        >
                          Email Settings
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/settings/paymentsettings"
                          className={
                            pathname.includes("paymentsettings") ? "active" : ""
                          }
                        >
                          Payment Settings
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/settings/currencysettings"
                          className={
                            pathname.includes("currencysettings")
                              ? "active"
                              : ""
                          }
                        >
                          Currency Settings
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/settings/grouppermissions"
                          className={
                            pathname.includes("permission") ? "active" : ""
                          }
                        >
                          Group Permissions
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tinatett-pos/settings/taxrates"
                          className={
                            pathname.includes("taxrates") ? "active" : ""
                          }
                        >
                          Tax Rates
                        </Link>
                      </li>
                    </ul>
                  ) : (
                    ""
                  )}
                </li> */}
            </ul>
          </div>
        </div>
      </Scrollbars>
    </div>
  );
};

export default withRouter(Sidebar);
