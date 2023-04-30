import React, { useState } from "react";
import { Upload } from "../../EntryFile/imagePath";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import { useLocation } from "react-router-dom/cjs/react-router-dom";

const options = [
  { id: 1, text: "United States", text: "United States" },
  { id: 2, text: "India", text: "India" },
];
const options1 = [
  { id: 1, text: "City1", text: "City1" },
  { id: 2, text: "City2", text: "City2" },
];

const EditSupplier = () => {
  const {state} = useLocation()
  console.log(state)
  const [formData, setFormData] = useState(state)
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Supplier Management</h4>
              <h6>Edit/Update Customer</h6>
            </div>
          </div>
          {/* /add */}
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-lg-4 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Supplier Name</label>
                    <input type="text" value={formData?.name} />
                  </div>
                </div>
                <div className="col-lg-4 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="text"
                      value={formData?.email}
                    />
                  </div>
                </div>
                <div className="col-lg-4 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="text" value={formData?.contact} />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Choose Type</label>
                    <Select2
                      className="select"
                      data={options}
                      options={{
                        placeholder: "Choose Type of supplier",
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-8 col-12">
                  <div className="form-group">
                    <label>Location/Address</label>
                    <input type="text" value={formData.location}/>
                  </div>
                </div>
                {/* <div className="col-lg-12">
                  <div className="form-group">
                    <label>Description</label>
                    <textarea className="form-control" defaultValue={""} />
                  </div>
                </div> */}
                {/* <div className="col-lg-12">
                  <div className="form-group">
                    <label> Avatar</label>
                    <div className="image-upload">
                      <input type="file" />
                      <div className="image-uploads">
                        <img src={Upload} alt="img" />
                        <h4>Drag and drop a file to upload</h4>
                      </div>
                    </div>
                  </div>
                </div> */}
              
                <div className="col-lg-12">
                  <button className="btn btn-submit me-2">Update</button>
                  <button className="btn btn-cancel">Cancel</button>
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

export default EditSupplier;
