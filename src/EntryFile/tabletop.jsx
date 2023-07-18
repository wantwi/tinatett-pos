import React, { useState } from "react";
import ReactTooltip from "react-tooltip";
import { Link } from "react-router-dom";
import {
  ClosesIcon,
  Excel,
  Filter,
  Pdf,
  Printer,
  Search
} from "../EntryFile/imagePath";
import { jsPDF } from 'jspdf'

const Tabletop = ({ inputfilter, togglefilter, data, title, handleSearch }) => {


  const createPDF =  (id) => {
    const pdf = new jsPDF("landscape", "pt", "a4");
    const data =  document.getElementById(id);
    pdf.html(data).then(() => {
      pdf.save(`${title}.pdf`);
    });
  };

  const convertToCSV = (objArray) => {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
        if (line != '') line += ','

        line += array[i][index];
      }

      str += line + '\r\n';
    }

    return str;
  }

  const exportToCSV = () => {
    console.log("Data", data)
    console.log("Report Title:", title)
    let headers
    let itemsFormatted = [];
    if (title == "Purchase List") {
      headers = {
        supplierName: 'Supplier Name'.replace(/,/g, ''), // remove commas to avoid errors
        reference: "Reference",
        date: "Purchase Date",
        numberOfProduct: "# of Products",
        branch: 'Branch',
        createdBy: 'Created By'
      }

     

      // format the data
      data.map((item) => {
        itemsFormatted.push({
          supplierName: item.supplierName.replace(/,/g, ''), // remove commas to avoid errors,
          reference: item.reference,
          date: item.date,
          numberOfProduct: item.numberOfProduct,
          branch: item.branch.replace(/,/g, ''),
          createdBy: item.createdBy
        });
      });
    }


    if (title == "Suppliers List") {
      headers = {
        name: 'Supplier Name'.replace(/,/g, ''), // remove commas to avoid errors
        customerType: "Supplier Type",
        // status: supplier.status,
        contact: "Contact",
        othercontact: "Other Contact",
        email: "Email",
        location: "Location",
        gpsAddress: "Ghana Post Address",
        creditPeriod: "Credit Period",
        product: "Products",
        paymentType: "Payment Type",
        accountNumber: "Account Number",
        branch: "Branch",
        serviceProvider: "Service Provider",
        createdBy: "Created By"
      }

     

      // format the data
      data.map((supplier) => {
        itemsFormatted.push({
          name: supplier.name,
          customerType: supplier?.customerType == 0 ? 'Individual' : 'Company',
          // status: supplier.status,
          contact: supplier.contact,
          othercontact: supplier.othercontact,
          email: supplier.email,
          location: supplier.location.replace(/,/g, ''),
          //customerType: supplier.customerType,
          gpsAddress: supplier.gpsAddress.replace(/,/g, ''),
          creditPeriod: supplier.creditPeriod,
          product: supplier.product.replace(/,/g, ''),
          paymentType: supplier.paymentInfo?.type || 'N/A',
          accountNumber: supplier.paymentInfo?.accountNumber || 'N/A',
          branch: supplier.paymentInfo?.branch || 'N/A',
          serviceProvider: supplier.paymentInfo?.serviceProvider || 'N/A',
          createdBy: supplier.createdBy
        });
      });

    }

    if (title == "Customers List") {
      headers = {
        customerName: 'Customer Name',
        // status: supplier.status,
        customerType: "Customer Type",
        contact: "Contact",
        othercontact: "Other Contact",
        email: "Email",
        location: "Location",
        gpsAddress: "Ghana Post Address",
        branch: "Branch",
        createdBy: "Created By"
      }

     

      // format the data
      data.map((customer) => {
        itemsFormatted.push({
            customerName: customer?.customerName,
            //status: customer?.status,
            customerType: customer?.customerType == 0 ? 'Individual' : 'Company',
            contact: customer?.contact,
            othercontact:customer?.othercontact || 'N/A',
            email: customer?.email,
            location: customer?.location.replace(/,/g, ''), // remove commas to avoid errors,
            gpsAddress: customer?.gpsAddress,
            branch: customer?.branch || 'N/A', 
            createdBy: customer?.createdBy,
        });
      });

    }

    if (title == "Products List") {
      headers = {
        name: 'Product Name',
        // status: supplier.status,
        retailPrice: "Retail Price",
        wholeSalePrice: "Wholesale Price",
        specialPrice: "Special Price",
        remainingStock: "Remaining Stock",
        createdBy: "Created By"
      }

     

      // format the data
      data.map((product) => {
        itemsFormatted.push({
          name: product?.name,
          //status: product?.status,
          //alert: product?.alert,
          retailPrice: product?.retailPrice,
          wholeSalePrice: product?.wholeSalePrice,
          specialPrice: product?.specialPrice,
          remainingStock: product?.remainingStock || 0,
          createdBy: product?.createdBy
        });
      });

    }


    if (title == "Proforma List") {
      headers = {
        customerName: "Customer Name",
        // status: proforma?.status,
        date:"Date",
        proformaRef: "Reference",
        numberOfProduct: "Number of Products",
        createdBy: "Created By"
      }

     
      // format the data
      data.map((proforma) => {
        itemsFormatted.push({
            customerName: proforma.customerName || 'N/A',
            //status: proforma?.status,
            date:proforma.date || 'N/A',
            proformaRef: proforma?.proformaRef,
            numberOfProduct: proforma?.numberOfProduct,
            createdBy: proforma?.createdBy || 'N/A'
        });
      });

    }

    itemsFormatted.unshift(headers);





    if(title !== ''){
      // Convert Object to JSON
      let jsonObject = JSON.stringify(itemsFormatted);
      //console.log(jsonObject)
      let csv = convertToCSV(jsonObject);
      let exportedFilenmae = title  + '.csv' || 'export.csv';

      let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
      } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
          // Browsers that support HTML5 download attribute
          var url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", exportedFilenmae);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }

    }
    else{
      alert('Unable to export')
    }

  }



  return (
    <div className="table-top">
      <div className="search-set">
        <div className="search-path">
          <a
            className={` btn ${inputfilter ? "btn-filter setclose" : "btn-filter"
              } `}
            id="filter_search"
            onClick={() => togglefilter(!inputfilter)}
          >
            <img src={Filter} alt="img" />
            <span>
              <img src={ClosesIcon} alt="img" />
            </span>
          </a>
        </div>
        <div className="search-input">
          <input
            className="form-control form-control-sm search-icon"
            type="text"
            placeholder="Search..."
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Link to="#" className="btn btn-searchset">
            <img src={Search} alt="img" />
          </Link>
        </div>
      </div>
      <div className="wordset">
        <ul>
          <ReactTooltip place="top" type="dark" effect="solid" />
          {/* <li onClick={() => createPDF(tableID)}>
            <a data-tip="Pdf">
              <img src={Pdf} alt="img" />
            </a>
          </li> */}
          <li onClick={() => exportToCSV()}>
            <a data-tip="Excel">
              <img src={Excel} alt="img" />
            </a>
          </li>
          {/* <li>
            <a data-tip="Print">
              <img src={Printer} alt="img" />
            </a>
          </li> */}
        </ul>
      </div>
    </div>
  );
};

export default Tabletop;
