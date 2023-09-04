import React from 'react'
import { useEffect } from "react";
import alertify from "alertifyjs";
import "../../../node_modules/alertifyjs/build/css/alertify.css";
import "../../../node_modules/alertifyjs/build/css/themes/semantic.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { usePost } from "../../hooks/usePost";
import LoadingSpinner from '../../InitialPage/Sidebar/LoadingSpinner';

function NewBranch() {

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Branch name is required"),
        location: Yup.string().required("Location is required")
    });

    const {
        register,
        handleSubmit,
        reset,
        getValues,
        formState: { errors, isSubmitSuccessful },
    } = useForm({
        defaultValues: {
            "name": "",
            "contact": "",
            "location": "",
            "email": ""

        },
        resolver: yupResolver(validationSchema),
    });


    const { isLoading, data, isError, error, mutate } = usePost("/branch");

    const onSubmit = (data) => {
        mutate(data)
    };


    useEffect(() => {
        if (isSubmitSuccessful && !isError) {
          reset();
          alertify.set("notifier", "position", "bottom-right");
          alertify.success("Branch added successfully.");
        }
        return () => {};
      }, [isSubmitSuccessful, isError, data]);
    
      if(isLoading){
        return <LoadingSpinner message={'Please wait, saving..'}/>
      }

    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="page-title">
                            <h4>Branch Management</h4>
                            <h6>Add/Update Branch</h6>
                        </div>
                    </div>
                    {/* /add */}
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="row">
                                    <div className="col-lg-3 col-sm-6 col-12">
                                        <div className="form-group">
                                            <label>Branch Name</label>
                                            <input  className={`form-control ${errors.name ? "is-invalid" : "" }`} type="text" {...register("name")}/>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-sm-6 col-12">
                                        <div className="form-group">
                                            <label>Location</label>
                                            <input  className={`form-control ${errors.location ? "is-invalid" : "" }`} type="text" {...register("location")}/>
                                        </div>
                                    </div>

                                    <div className="col-lg-3 col-sm-6 col-12">
                                        <div className="form-group">
                                            <label>Contact</label>
                                            <input  className={`form-control ${errors.contact ? "is-invalid" : "" }`} type="text" {...register("contact")}/>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-sm-6 col-12">
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input  className={`form-control ${errors.email ? "is-invalid" : "" }`} type="text" {...register("email")}/>
                                        </div>
                                    </div>

                                    <div className="col-lg-12 mt-3">
                                        <button className="btn btn-submit me-2">Submit</button>
                                        {/* <button className="btn btn-cancel">Cancel</button> */}
                                    </div>
                                </div>
                            </form>

                        </div>
                    </div>
                    {/* /add */}
                </div>
            </div>
        </>
    )
}

export default NewBranch