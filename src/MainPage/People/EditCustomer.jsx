import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom/cjs/react-router-dom";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
//import { usePost } from "../../hooks/usePost";
import { usePut } from "../../hooks/usePut";
import { useEffect } from "react";
import alertify from "alertifyjs";
import "../../../node_modules/alertifyjs/build/css/alertify.css";
import "../../../node_modules/alertifyjs/build/css/themes/semantic.css";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";



const EditCustomer = () => {
  const {state} = useLocation()


  const [formData, setFormData] = useState(state)
  const [customerType, setCustomerType] = useState(formData?.customerType)
  const [userType, setUserType] = useState(null)

  useEffect(() => {
    let userRole = localStorage.getItem('auth')
    let obj =JSON.parse(userRole)
    //console.log("Role:", obj.role)
    setUserType(obj.role)
  }, [])


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
      id: formData?.id,
      name: formData?.customerName,
      email: formData?.email,
      contact: formData?.contact,
      otherContact: formData?.otherContact,
      location: formData?.location,
      customerType: formData?.customerType,
      gpsAddress: formData?.gpsAddress
      
    },
    resolver: yupResolver(validationSchema),
  });

  const { isLoading, isError, mutate: updateMutate } = usePut(`/customer/${getValues()?.id}`);


  const onSubmit = (data) => {
    //console.log({...data, customerType})
    updateMutate({...data, customerType})
  };

  useEffect(() => {
    if (isSubmitSuccessful && !isError && !isLoading) {
      reset();
      alertify.set("notifier", "position", "bottom-right");
      alertify.success("Customer updated successfully.");
      setTimeout(() => {
        window.location = '/tinatett-pos/people/customerlist'
      },1000)
    }
    return () => {};
  }, [isSubmitSuccessful, isError, isLoading]);

  if(isLoading){
    return <LoadingSpinner message={'Please wait, updating..'}/>
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Customer Management</h4>
              {state?.mode == 'view' ? <h6>View Customer</h6> : <h6>Update Customer</h6>}
            </div>
          </div>
          {/* /edit */}
          <div className="card">
            <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-lg-4 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Customer Name</label>
                      <input type="text"  {...register("name")} disabled={userType == 'admin' || userType == 'supervisor' ? false : true}/>
                    </div>
                  </div>

                  <div className="col-lg-4 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Choose Type</label>
                      <div className="row">
                          <div class="col-lg-6">
                            <div class="input-group">
                              <div class="input-group-text">
                                <input className="form-check-input" type="radio" name="customerType" value="0" checked={customerType == 0} onChange = {(e) => setCustomerType(e.target.value)}/>
                              </div>
                              <input type="text" className="form-control" aria-label="Text input with radio button" value={'Company'}/>
                            </div>
                        </div>

                          <div class="col-lg-6">

                            <div class="input-group">
                              <div class="input-group-text">
                                <input className="form-check-input" type="radio" name="customerType" value="1" checked={customerType == 1} onChange = {(e) => setCustomerType(e.target.value)}/>
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
                      <input type="text"  {...register("email")}/>
                    </div>
                  </div>
              
                </div> 
                <div className="row">

                <div className="col-lg-4 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Contact</label>
                    <input type="text"  {...register("contact")}/>
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
                    <input type="text"  {...register("location")}/>
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

                
                {state?.mode == 'edit' ? 
                <div className="col-lg-12" style={{textAlign:'right'}}>
                  <button  type="submit" className="btn btn-submit me-2">Update</button>
                  <Link to="/tinatett-pos/people/customerlist" className="btn btn-cancel">
                    Cancel
                  </Link>
                </div> : null}
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

export default EditCustomer;
