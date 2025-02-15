import React, { useState } from "react";
import Select from "react-select";
import "react-select2-wrapper/css/select2.css";
import { Upload } from "../../EntryFile/imagePath";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { usePost } from "../../hooks/usePost";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import alertify from "alertifyjs";
import "../../../node_modules/alertifyjs/build/css/alertify.css";
import "../../../node_modules/alertifyjs/build/css/themes/semantic.css";
import { useGet } from "../../hooks/useGet";

const Newuser = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordShown1, setPasswordShown1] = useState(false);
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
  const togglePassword1 = () => {
    setPasswordShown1(!passwordShown1);
  };
  const options = [
    { id: 1, label: "Sales Only", value: "sales" },
    { id: 2, label: "Cashier", value: "cashier" },
    { id: 3, label: "Employee", value: "supervisor" },
    { id: 4, label: "Administrator", value: "admin" },
    { id: 5, label: "Owner", value: "admin" },
  ];


  const onSuccess = (data) => {
    console.log("Branches", data)
    let mappedData = data?.data.map((item) => {
      return {
        id: item?.id,
        label: item?.name,
        value: item?.id
      }
    })

    setBranches(mappedData)
  }

  const [role, setRole] = useState(null)
  const [branches, setBranches] = useState([])
  const [selectedBranch, setSelectedBranch] = useState(null)
  
  const { isLoading, data, isError, error, mutate } = usePost("/user");
  const { } = useGet("branch", "/branch", onSuccess);

  const validationSchema = Yup.object().shape({
    userName: Yup.string().required("user name is required"),
    password: Yup.string().required("Password is required"),
   // role: Yup.string().required("Role is required"),
  });

  let storage = JSON.parse(localStorage.getItem('auth'))

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      "firstName": "",
      "lastName": "",
      "userName": "",
      "password": "",
      "role": "",
    },
    resolver: yupResolver(validationSchema),
  });


  const onSubmit = (data) => {
   
    mutate({...data, branchId:selectedBranch?.id, role: role.value})
    alertify.set("notifier", "position", "bottom-right");
    alertify.success("User successfully created");
    reset()
    setSelectedBranch(null)
    setRole(null)
   
  };

  if(isLoading){
    return <LoadingSpinner message="saving.."/>
  }

  if(isError){
    alertify.set("notifier", "position", "bottom-right");
    alertify.error("Error saving user");
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>User Management</h4>
            <h6>Add/Update User</h6>
          </div>
        </div>
        {/* /add */}
        <div className="card">
          <div className="card-body">

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>First Name</label>
                    <input type="text"  className={`form-control ${
                      errors.firstName ? "is-invalid" : ""
                    }`}    {...register("firstName")}/>
                  </div>
                </div>

                <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" {...register("lastName")}/>
                  </div>
                </div>

                <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>User Name</label>
                    <input type="text"  className={`form-control ${
                      errors.userName ? "is-invalid" : ""
                    }`} {...register("userName")}/>
                  </div>
                </div>

              </div>

              <div className="row">
               

                <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Password</label>
                    <div className="pass-group">
                      <input
                        type={passwordShown ? "text" : "password"}
                        className=" pass-input" {...register("password")}
                      />
                      <span
                        className={`fas toggle-password ${passwordShown ? "fa-eye" : "fa-eye-slash"
                          }`}
                        onClick={togglePassword}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <div className="pass-group">
                      <input
                        type={passwordShown1 ? "text" : "password"}
                        className=" pass-input"
                      />
                      <span
                        className={`fas toggle-password ${passwordShown1 ? "fa-eye" : "fa-eye-slash"
                          }`}
                        onClick={togglePassword1}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-lg-3 col-sm-6 col-12">

                  <div className="form-group">
                    <label>Branch</label>
                    <Select
                      className="select"
                      options={branches}
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e)}
                    />
                  </div>
                </div>

              </div>


              <div className="row">
               


                <div className="col-lg-3 col-sm-6 col-12">

                  <div className="form-group">
                    <label>Role</label>
                    <Select
                      className="select"
                      options={options}
                      value={role}
                      onChange={(e) => setRole(e)}
                    />
                  </div>





                </div>

                {/* <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label> Profile Picture</label>
                    <div className="image-upload image-upload-new">
                      <input type="file" />
                      <div className="image-uploads">
                        <img src={Upload} alt="img" />
                        <h4>Drag and drop a file to upload</h4>
                      </div>
                    </div>
                  </div>
                 </div> */}

              </div>


              <div className="col-lg-6">
                <button type="submit" className="btn btn-submit me-2">
                  Submit
                </button>
                <button className="btn btn-cancel" onClick={() =>reset()}>Clear</button>
              </div>

            </form>

          </div>
        </div>

        {/* /add */}
      </div>
    </div>
  );
};

export default Newuser;
