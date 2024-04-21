import React, { useState } from "react";
import "react-select2-wrapper/css/select2.css";
import useCustomApi from "../../hooks/useCustomApi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { usePost } from "../../hooks/usePost";
//import { usePut } from "../../hooks/usePut";
import { useEffect } from "react";
import alertify from "alertifyjs";
import "../../../node_modules/alertifyjs/build/css/alertify.css";
import "../../../node_modules/alertifyjs/build/css/themes/semantic.css";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import FeatherIcon from "feather-icons-react";

const AddCustomer = () => {
  const axios = useCustomApi();
  const [customerType, setCustomerType] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Customer name is required"),
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
      otherContact: "",
      location: "",
      customerType: 0,
      gpsAddress:""
      
    },
    resolver: yupResolver(validationSchema),
  });



  //const { isLoading, data, isError, error, mutate } = usePost("/customer", onPostSuccess, onPostError);
  // const { mutate: updateMutate } = usePut(`/product/${getValues()?.id}`);


  const onSubmit = (data) => {
    setIsLoading(true)
    let payload = {...data, customerType}
    try{
      axios.post("/customer", payload)
      .then((res) => {
        if(res.data){
        reset();
        alertify.set("notifier", "position", "bottom-right");
        alertify.success("Customer added successfully.");
        }
      })
      .catch((error) => {
        console.log(error)
        alertify.set("notifier", "position", "bottom-right");
        alertify.error(error.response.data.error || "Error. Failed to add Customer. Contact Admin");
      })
     .finally(() => setIsLoading(false))
    }
    catch(error){
      console.log(error)
      setIsLoading(false)
    }
   
  };


  if(isLoading){
    return <LoadingSpinner message={'Please wait, saving..'}/>
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Customer Management</h4>
              <h6>Add Customer</h6>
            </div>
          </div>
          {/* /add */}
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-lg-4 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Customer Name</label>
                    <input 
                     className={`form-control ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    type="text"
                    {...register("name")}
                  />
                  <div className="invalid-feedback">
                    {errors.name?.message}
                  </div>
                  </div>
                </div>

                <div className="col-lg-4 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Choose Type</label>
                    <div className="row">
                        <div class="col-lg-6">
                          <div class="input-group">
                            <div class="input-group-text">
                              <input className="form-check-input" type="radio" name="customerType" value="0" onChange = {(e) => setCustomerType(e.target.value)}/>
                            </div>
                            <input type="text" className="form-control" aria-label="Text input with radio button" value={'Company'}/>
                          </div>
                       </div>

                        <div class="col-lg-6">

                          <div class="input-group">
                            <div class="input-group-text">
                              <input className="form-check-input" type="radio" name="customerType" value="1" onChange = {(e) => setCustomerType(e.target.value)}/>
                            </div>
                            <input type="text" className="form-control" aria-label="Text input with radio button" value={'Individual'} />
                          </div>
                        
                        </div>
                    </div>
                     
                  </div>
                </div>

                <div className="col-lg-4 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Email</label>
                    <input 
                     placeholder="someone@gmail.com"
                     className={`form-control ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    type="text"
                    {...register("email")}
                  />
                 
                  </div>
                </div>

                
              </div>

            <div className="row">
                <div className="col-lg-4 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Contact</label>
                    <input  className={`form-control ${
                          errors.name ? "is-invalid" : ""
                        }`}
                        type="text"
                        {...register("contact")}
                      />
                      <div className="invalid-feedback">
                        {errors.name?.message}
                      </div>
                  </div>
                </div>

                <div className="col-lg-4 col-12">
                  <div className="form-group">
                    <label>Other Contact</label>
                    <input  className={`form-control ${
                          errors.name ? "is-invalid" : ""
                        }`}
                        type="text"
                        {...register("otherContact")}
                      />
                     
                  </div>
                </div>
              
            
                <div className="col-lg-4 col-12">
                  <div className="form-group">
                    <label>Location/Address</label>
                    <input className={`form-control ${
                          errors.name ? "is-invalid" : ""
                        }`}
                        type="text"
                        {...register("location")}/>
                  </div>
                </div>

                <div className="col-lg-4 col-12">
                  <div className="form-group">
                    <label>Ghana Post Address</label>
                    <input className={`form-control ${
                          errors.name ? "is-invalid" : ""
                        }`}
                        type="text"
                        placeholder="GZ-000-0000"
                        {...register("gpsAddress")}/>
                  </div>
                </div>
              
                <div className="col-lg-12" style={{textAlign:'right'}}>
                  <button type="submit" className="btn btn-submit me-2"><FeatherIcon icon="save"/> Save</button>
                  <button className="btn btn-cancel" onClick={() =>reset()}>Clear</button>
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

export default AddCustomer;
