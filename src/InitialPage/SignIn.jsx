import React, { useState } from "react";
import {
  LoginImage,
  Logo,
  MailIcon,
  GoogleIcon,
  FacebookIcon,
} from "../EntryFile/imagePath";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { LoginUser } from "../auth/auth";
import useAuth from "../hooks/useAuth";

const SignInPage = (props) => {
  const [eye, seteye] = useState(true);
  const { setAuth } = useAuth();

  const onEyeClick = () => {
    seteye(!eye);
  };

  const validationSchema = Yup.object().shape({
    userName: Yup.string().required("userName is required"),
    password: Yup.string().required("Password is required"),
    //   .min(6, "Password must be at least 6 characters")
    //   .max(20, "Password must not exceed 20 characters"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    console.log(JSON.stringify(data, null, 2));

    const user = await LoginUser(data);
    const { token, branchId, branchName, groupName } = user;
    console.log({ user });
    sessionStorage.setItem("auth", JSON.stringify(user));
    setAuth(user);

    props.history.push("/dream-pos/dashboard");
  };

  return (
    <>
      <div className="main-wrapper">
        <Helmet>
          <title>SignIn - Dream POS</title>
          <meta name="description" content="SignIn page" />
        </Helmet>
        <div className="account-content">
          <div className="login-wrapper">
            <div
              className="login-content"
              style={{ backgroundColor: "#008179" }}
            >
              <div className="login-userset">
                <form onSubmit={handleSubmit(onSubmit)} style={{ margin: 50 }}>
                  <div className="login-logo">
                    <img src={Logo} alt="img" />
                  </div>
                  <div className="login-userheading">
                    <h3>Sign In</h3>
                    <h4 style={{ color: "white" }}>
                      Please login to your account
                    </h4>
                  </div>
                  <div className="form-login">
                    <label style={{ color: "white" }}>userName</label>
                    <div className="form-addons">
                      <input
                        type="text"
                        {...register("userName")}
                        className={` ${errors.userName ? "is-invalid" : ""}`}
                        placeholder="Enter your userName"
                        defaultValue=""
                      />
                      <img src={MailIcon} alt="img" />
                      <div className="invalid-feedback">
                        {errors.userName?.message}
                      </div>
                    </div>
                  </div>
                  <div className="form-login">
                    <label style={{ color: "white" }}>Password</label>
                    <div className="pass-group">
                      <input
                        type={eye ? "password" : "text"}
                        className={` ${errors.password ? "is-invalid" : ""}`}
                        placeholder="Enter your password"
                        {...register("password")}
                        defaultValue={123456}
                      />
                      <span
                        onClick={onEyeClick}
                        className={`fas toggle-password ${
                          eye ? "fa-eye-slash" : "fa-eye"
                        } `}
                      />
                      <div className="invalid-feedback">
                        {errors.password?.message}
                      </div>
                    </div>
                  </div>
                  <div className="form-login">
                    <div className="alreadyuser">
                      <h4>
                        <Link to="/forgetPassword" className="hover-a">
                          Forgot Password?
                        </Link>
                      </h4>
                    </div>
                  </div>
                  <div className="form-login">
                    <button className="btn btn-login">Sign In</button>
                  </div>
                </form>
                <div className="signinform text-center">
                  <h4>
                    Don’t have an account?{" "}
                    <Link to="/signUp" className="hover-a">
                      Sign Up
                    </Link>
                  </h4>
                </div>
                <div className="form-setlogin">
                  <h4>Or sign up with</h4>
                </div>
                <div className="form-sociallink">
                  <ul>
                    <li>
                      <Link to="/signin">
                        <img src={GoogleIcon} className="me-2" alt="google" />
                        Sign Up using Google
                      </Link>
                    </li>
                    <li>
                      <Link to="/signin">
                        <img src={FacebookIcon} className="me-2" alt="google" />
                        Sign Up using Facebook
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="login-img">
              <img src={LoginImage} alt="img" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInPage;
