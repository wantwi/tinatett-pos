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
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import Select from "react-select";
import FeatherIcon from "feather-icons-react";

const options = [
  { id: 0, label: "Cash", value: "Cash" },
  { id: 1, label: "Bank", value: "Bank" },
  { id: 2, label: "Momo", value: "Momo" }
];

const AddSupplier = () => {
  const axios = useCustomApi();
  const [supplierType, setSupplierType] = useState(0)
  const [paymentType, selectedPaymentType] = useState('')

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Supplier name is required"),
    // email: Yup.string()
    //   .required("Email is required"),
    contact: Yup.string()
      .required("Phone number is required"),
    // location: Yup.string()
    //   .required("Location is required"),
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
      customerType: 0,
      type: 0,
      creditPeriod:"",
      othercontact:"",
      bankDetails:"",
      cashDetails:"",
      momoDetails:""

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
          //paymentInfo: {"type":paymentType.label, "accountNumber":data.accountNumber,"branch":data.branch,"serviceProvider":data.serviceProvider} 
      }
    
   mutate(payload)
   //console.log(payload)
  };

  useEffect(() => {
    if (isSubmitSuccessful && !isError) {
      reset();
      alertify.set("notifier", "position", "bottom-right");
      alertify.success("Supplier added successfully.");
    }
    return () => { };
  }, [isSubmitSuccessful, isError]);




  if(isLoading){
    return <LoadingSpinner message={'Please wait, saving..'}/>
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Supplier Management</h4>
              <h6>Add Supplier</h6>
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
                        placeholder="month, days, weeks..."
                        {...register("creditPeriod")} />
                    </div>
                  </div>

                </div>

                <div className="row">
                  <div className="col-lg-4 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Products Supplied</label>
                      <textarea className={`form-control ${errors.name ? "is-invalid" : ""
                        }`}
                        type="text"
                        placeholder="Enter products, separated by comma"
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
                      <label>Ghana Post Address</label>
                      <input className={`form-control ${errors.name ? "is-invalid" : ""
                        }`}
                        type="text"
                        placeholder="GZ-000-0000"
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
                      {/* <div className="col-lg-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Payment Type</label>
                          <Select
                            className="select"
                            options={options}
                            onChange={(e) => selectedPaymentType(e)}
                          />
                          
                        </div>
                      </div> */}

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


                      {/* {paymentType.label == 'Cheque' ?(<div className="col-lg-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Account Number</label>
                          <input className={`form-control ${errors.name ? "is-invalid" : ""
                            }`}
                            type="text"
                            {...register("accountNumber")} />
                        </div>
                      </div>) : null}

                      {paymentType.label == 'Momo' ? (<div className="col-lg-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Momo Number</label>
                          <input className={`form-control ${errors.name ? "is-invalid" : ""
                            }`}
                            type="text"
                            {...register("accountNumber")} />
                        </div>
                      </div>) : null}

                      {paymentType.label == 'Cash' ? (<div className="col-lg-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Waybill Number</label>
                          <input className={`form-control ${errors.name ? "is-invalid" : ""
                            }`}
                            type="text"
                            {...register("accountNumber")} />
                        </div>
                      </div>) : null}

                      {paymentType.label == 'Cheque' ? (<div className="col-lg-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Branch</label>
                          <input className={`form-control ${errors.name ? "is-invalid" : ""
                            }`}
                            type="text"
                            {...register("branch")} />
                        </div>
                      </div>) : null}

                      {paymentType.label == 'Momo' ? (<div className="col-lg-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Service Provider</label>
                          <input className={`form-control ${errors.name ? "is-invalid" : ""
                            }`}
                            type="text"
                            {...register("serviceProvider")} />
                        </div>
                      </div>) : null}
                      */}
                    </div> 
                  </fieldset>


                  <div className="col-lg-12" style={{ textAlign: 'right' }}>
                    <button type="submit" className="btn btn-submit me-2"><FeatherIcon icon="save"/>Save</button>
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
