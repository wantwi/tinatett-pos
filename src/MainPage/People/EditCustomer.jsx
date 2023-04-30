import React, { useState } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";

const options = [
  { id: 1, text: "United States", text: "United States" },
  { id: 2, text: "India", text: "India" },
];
const options1 = [
  { id: 1, text: "City1", text: "City1" },
  { id: 2, text: "City2", text: "City2" },
];

const EditCustomer = () => {
  const {state} = useLocation()
  const [formData, setFormData] = useState(state)

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Customer Management</h4>
              <h6>Edit/Update Customer</h6>
            </div>
          </div>
          {/* /add */}
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-lg-4 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Customer Name</label>
                    <input type="text" value={formData.customerName} />
                  </div>
                </div>
                <div className="col-lg-4 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Email</label>
                    <input type="text" value={formData?.email} />
                  </div>
                </div>
                <div className="col-lg-4 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="text" value={formData?.contact} />
                  </div>
                </div>
                {/* <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Choose Country</label>
                    <Select2
                      className="select"
                      data={options}
                      options={{
                        placeholder: "United States",
                      }}
                    />
                    </div> */}
                </div> 
                <div className="row">
                <div className="col-lg-4 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Choose Type</label>
                    <Select2
                      className="select"
                      data={options}
                      options={{
                        placeholder: "Choose Type of Customer",
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-8 col-12">
                  <div className="form-group">
                    <label>Location/Address</label>
                    <input type="text" value={formData?.location} />
                  </div>
                </div>
                {/* <div className="col-lg-12">
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      defaultValue={
                        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text "
                      }
                    />
                  </div>
                </div> */}
                <div className="col-lg-12">
                  <button className="btn btn-submit me-2">Update</button>
                  <button className="btn btn-cancel">Clear</button>
                </div>
              </div>
            </div>
          </div>
          {/* /add */}
        </div>
      </div>
    </>
  );
};

export default EditCustomer;
