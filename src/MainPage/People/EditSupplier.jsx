import React, { useEffect, useState } from "react";
import { Upload } from "../../EntryFile/imagePath";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import { Link, useLocation } from "react-router-dom/cjs/react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
//import { usePost } from "../../hooks/usePost";
import { usePut } from "../../hooks/usePut";
import alertify from "alertifyjs";
import "../../../node_modules/alertifyjs/build/css/alertify.css";
import "../../../node_modules/alertifyjs/build/css/themes/semantic.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useForm } from "react-hook-form";
import Select from "react-select";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";

const options = [
  { id: 0, label: "Cash", value: "Cash" },
  { id: 1, label: "Cheque", value: "Cheque" },
  { id: 2, label: "Momo", value: "Momo" }
];

const EditSupplier = () => {
  const { state } = useLocation()
  console.log(state)
  const [formData, setFormData] = useState(state)

  const [customerType, setCustomerType] = useState(formData?.customerType)



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
      id: formData.id,
      name: formData.name,
      email: formData.email,
      contact: formData.contact,
      location: formData.location,
      othercontact: formData.othercontact,
      creditPeriod: formData.creditPeriod,
      gpsAddress: formData.gpsAddress,
      product: formData.product,
      type: formData.paymentInfo.type,
      branch: formData.paymentInfo.branch,
      accountNumber: formData.paymentInfo.accountNumber,
      serviceProvider: formData.paymentInfo.serviceProvider,
      customerType: customerType,
      bankDetails:formData?.bankDetails,
      cashDetails:formData?.cashDetails,
      momoDetails: formData?.momoDetails

    },
    resolver: yupResolver(validationSchema),
  });


  const { isLoading, isError, mutate: updateMutate } = usePut(`/supplier/${getValues()?.id}`);



  const onSubmit = (data) => {
    //console.log({ ...data, customerType: supplierType, paymentInfo: {"type": data.type, "accountNumber":data.accountNumber,"branch":data.branch,"serviceProvider":null} })
    let payload = {
      "name": data.name,
      "contact": data.contact,
      "othercontact": data.othercontact,
      "location": data.location,
      "customerType": customerType,
      "email": data.email,
      "gpsAddress": data.gpsAddress,
      "creditPeriod": data.creditPeriod,
      "product": data.product,
      paymentInfo: [
        {
          type: 'cash',
          details: data.cashDetails
        },
        {
          type: 'momo',
          details: data.momoDetails
        },
        {
          type: 'bank',
          details: data.bankDetails
        },

      ]
      //paymentInfo: {"type": data.type, "accountNumber":data.accountNumber,"branch":data.branch,"serviceProvider":data.serviceProvider} 
    }

    console.log(payload)
    updateMutate(payload)
  };

  useEffect(() => {
    if (isSubmitSuccessful && !isError && !isLoading) {
      reset();
      alertify.set("notifier", "position", "top-right");
      alertify.success("Supplier updated successfully.");
      setTimeout(() => {
        history.push('/tinatett-pos/people/supplierlist')
      }, 100)
    }
    else if (isError) {
      alertify.set("notifier", "position", "top-right");
      alertify.warning("Failed to update");
    }
    return () => { };
  }, [isSubmitSuccessful, isError, isLoading]);

  if (isLoading) {
    return <LoadingSpinner message={'Please wait, updating..'} />
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Supplier Management</h4>
              <h6>Update Supplier</h6>
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
                        {...register("name")} disabled />
                    </div>
                  </div>

                  <div className="col-lg-4 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Supplier Type</label>
                      <div className="row">
                        <div class="col-lg-6">
                          <div class="input-group">
                            <div class="input-group-text">
                              <input className="form-check-input" type="radio" name="customerType" value="0" checked={customerType == 0} onChange={(e) => setCustomerType(e.target.value)} />
                            </div>
                            <input type="text" className="form-control" aria-label="Text input with radio button" value={'Company'} />
                          </div>
                        </div>

                        <div class="col-lg-6">

                          <div class="input-group">
                            <div class="input-group-text">
                              <input className="form-check-input" type="radio" name="customerType" value="1" checked={customerType == 1} onChange={(e) => setCustomerType(e.target.value)} />
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


                    <div className="row">
                    <div className="col-lg-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Cash Details</label>
                          <textarea className={`form-control ${errors.name ? "is-invalid" : ""
                            }`}
                            type="text"
                            {...register("cashDetails")} ></textarea>
                        </div>
                      </div>

                      <div className="col-lg-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Bank Details</label>
                          <textarea className={`form-control ${errors.name ? "is-invalid" : ""
                            }`}
                            type="text"
                            {...register("bankDetails")} ></textarea>
                        </div>
                      </div>

                      <div className="col-lg-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Momo Details</label>
                          <textarea className={`form-control ${errors.name ? "is-invalid" : ""
                            }`}
                            type="text"
                            {...register("momoDetails")} ></textarea>
                        </div>
                      </div>

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

                    </div>
                  </fieldset>


                  <div className="col-lg-12" style={{ textAlign: 'right' }}>
                    <button type="submit" className="btn btn-submit me-2">Update</button>
                    <Link to="/tinatett-pos/people/supplierlist" className="btn btn-cancel">
                      Cancel
                    </Link>
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

export default EditSupplier;
