import React, { useState, useEffect } from "react";
import { Upload } from "../../EntryFile/imagePath";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import { usePost } from "../../hooks/usePost";
import alertify from "alertifyjs";
import "../../../node_modules/alertifyjs/build/css/alertify.css";
import "../../../node_modules/alertifyjs/build/css/themes/semantic.css";
import useCustomApi from "../../hooks/useCustomApi";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";

const options = [
  { id: 0, text: "Company", text: "Company" },
  { id: 1, text: "Individual", text: "Individual" },
];

const AddSupplier = () => {
  const axios = useCustomApi();
  const [supplierType, setSupplierType] = useState(0)
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Supplier name is required"),
    email: Yup.string()
      .required("Email is required"),
    contact: Yup.string()
      .required("Phone number is required"),
    location: Yup.string()
      .required("Location is required"),
  });


  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      contact: "",
      location: "",
      customerType: 0

    },
    resolver: yupResolver(validationSchema),
  });

  const { isLoading, data, isError, error, mutate } = usePost("/supplier");
  // const { mutate: updateMutate } = usePut(`/product/${getValues()?.id}`);



  const onSubmit = (data) => {
    //console.log({ ...data, customerType: supplierType, paymentInfo: {"type": data.type, "accountNumber":data.accountNumber,"branch":data.branch,"serviceProvider":null} })
    let payload = {
          "name":data.name,
          "contact": data.contact,
          "othercontact": data.othercontact,
          "location": data.location,
          "customerType": supplierType,
          "email":data.email,
          "gpsAddress":data.gpsAddress,
          "creditPeriod":data.creditPeriod,
          "product":data.product,
          paymentInfo: {"type": data.type, "accountNumber":data.accountNumber,"branch":data.branch,"serviceProvider":data.serviceProvider} 
      }
    
    console.log(payload)
    mutate(payload)
  };

  useEffect(() => {
    if (isSubmitSuccessful && !isError && !isLoading) {
      reset();
      alertify.set("notifier", "position", "top-right");
      alertify.success("Supplier added successfully.");
    }
    return () => { };
  }, [isSubmitSuccessful, isError, isLoading]);

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Supplier Management</h4>
              <h6>Add/Update Supplier</h6>
            </div>
          </div>
          {/* /add */}
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-lg-4 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Supplier Name</label>
                      <input className={`form-control ${errors.name ? "is-invalid" : ""
                        }`}
                        type="text"
                        {...register("name")} />
                    </div>
                  </div>

                  <div className="col-lg-4 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Supplier Type</label>
                      <div className="row">
                        <div class="col-lg-6">
                          <div class="input-group">
                            <div class="input-group-text">
                              <input className="form-check-input" type="radio" name="customerType" value="Company" onChange={(e) => setSupplierType(e.target.value)} />
                            </div>
                            <input type="text" className="form-control" aria-label="Text input with radio button" value={'Company'} />
                          </div>
                        </div>

                        <div class="col-lg-6">

                          <div class="input-group">
                            <div class="input-group-text">
                              <input className="form-check-input" type="radio" name="customerType" value="Individual" onChange={(e) => setSupplierType(e.target.value)} />
                            </div>
                            <input type="text" className="form-control" aria-label="Text input with radio button" value={'Individual'} />
                          </div>

                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="col-lg-4 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Credit Period</label>
                      <input className={`form-control ${errors.name ? "is-invalid" : ""
                        }`}
                        type="text"
                        {...register("creditPeriod")} />
                    </div>
                  </div>

                </div>

                <div className="row">
                  <div className="col-lg-4 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Product</label>
                      <input className={`form-control ${errors.name ? "is-invalid" : ""
                        }`}
                        type="text"
                        {...register("product")} />
                    </div>
                  </div>

                  <div className="col-lg-4 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Email</label>
                      <input className={`form-control ${errors.name ? "is-invalid" : ""
                        }`}
                        type="text"
                        {...register("email")} />
                    </div>
                  </div>

                  <div className="col-lg-4 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Contact No</label>
                      <input className={`form-control ${errors.name ? "is-invalid" : ""
                        }`}
                        type="text"
                        {...register("contact")} />
                    </div>
                  </div>

                  <div className="col-lg-4 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Other Contact No</label>
                      <input className={`form-control ${errors.name ? "is-invalid" : ""
                        }`}
                        type="text"
                        {...register("othercontact")} />
                    </div>
                  </div>

                  <div className="col-lg-4 col-12">
                    <div className="form-group">
                      <label>Location/Address</label>
                      <input className={`form-control ${errors.name ? "is-invalid" : ""
                        }`}
                        type="text"
                        {...register("location")} />
                    </div>
                  </div>

                  <div className="col-lg-4 col-12">
                    <div className="form-group">
                      <label>GPS Address</label>
                      <input className={`form-control ${errors.name ? "is-invalid" : ""
                        }`}
                        type="text"
                        {...register("gpsAddress")} />
                    </div>
                  </div>


                  <fieldset>
                   
                    {/* <div className="col-lg-12">
                      <div className="form-group">
                        <label>Description</label>
                        <textarea className="form-control" defaultValue={""} />
                      </div>
                    </div>  */}
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

                    <div className="row">
                      <div className="col-lg-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Payment Type</label>
                          <input className={`form-control ${errors.name ? "is-invalid" : ""
                            }`}
                            type="text"
                            {...register("type")} />
                        </div>
                      </div>

                      <div className="col-lg-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Account Number</label>
                          <input className={`form-control ${errors.name ? "is-invalid" : ""
                            }`}
                            type="text"
                            {...register("accountNumber")} />
                        </div>
                      </div>

                      <div className="col-lg-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Branch</label>
                          <input className={`form-control ${errors.name ? "is-invalid" : ""
                            }`}
                            type="text"
                            {...register("branch")} />
                        </div>
                      </div>

                      <div className="col-lg-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Service Provider</label>
                          <input className={`form-control ${errors.name ? "is-invalid" : ""
                            }`}
                            type="text"
                            {...register("serviceProvider")} />
                        </div>
                      </div>
                    </div>
                  </fieldset>


                  <div className="col-lg-12" style={{ textAlign: 'right' }}>
                    <button type="submit" className="btn btn-submit me-2">Submit</button>
                    <button className="btn btn-cancel" onClick={() => reset()}>Clear</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          {/* /add */}
        </div>
      </div>
    </>
  );
};

export default AddSupplier;
