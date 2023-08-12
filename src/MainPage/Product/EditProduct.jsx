import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom"
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";

import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
//import { usePost } from "../../hooks/usePost";
import { usePut } from "../../hooks/usePut";
import alertify from "alertifyjs";
import "../../../node_modules/alertifyjs/build/css/alertify.css";
import "../../../node_modules/alertifyjs/build/css/themes/semantic.css";
import { useForm } from "react-hook-form";

const EditProduct = () => {

  const {state} = useLocation()
  //console.log(state)
  const [data, setData] = useState(state)

  const [ownershipType, setOwnershipType] = useState(state?.ownershipType)


  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Product name is required"),
    retailPrice: Yup.number()
      .required("Retail Price is required")
      .min(1, "Price must be greater than 0"),
    wholeSalePrice: Yup.number()
      .required("WholeSale Price is required")
      .min(1, "Price must be greater than 0"),
    specialPrice: Yup.number()
      .required("Special Price is required")
      .min(1, "Price must be greater than 0"),
  });

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      id: data?.id,
      name: data?.name,
      retailPrice: data?.retailPrice,
      wholeSalePrice: data?.wholeSalePrice,
      specialPrice: data?.specialPrice,
      alert: data?.alert,
    },
    resolver: yupResolver(validationSchema),
  });


  const { isLoading, isError, mutate: updateMutate } = usePut(`/product/${getValues()?.id}`);

  const onSubmit = (data) => {
    const { name, wholeSalePrice, retailPrice, specialPrice, alert } = data;
    updateMutate({ name, wholeSalePrice, retailPrice, specialPrice, alert: Number(alert), ownershipType })
     
  };

  useEffect(() => {
    if (isSubmitSuccessful && !isError) {
      reset();
      alertify.set("notifier", "position", "bottom-right");
      alertify.success("Product updated successfully.");
      setTimeout(() => {
        window.location = '/tinatett-pos/product/productlist'
      },1500)
    }
    else if(isError){
      alertify.set("notifier", "position", "bottom-right");
      alertify.warning("Failed to update");
    }
    return () => {};
  }, [isSubmitSuccessful, isError]);

  if(isLoading){
    return <LoadingSpinner message={'Please wait, updating..'}/>
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Product Edit</h4>
              <h6>Update your product</h6>
            </div>
          </div>
          {/* /add */}
          <div className="card">
            <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-lg-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Product Name</label>
                    <input type="text"  {...register("name")} disabled/>
                  </div>
                </div>
                <div className="col-lg-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Tinatett/Competitor Product</label>
                      <div className="row">
                          <div class="col-lg-6">
                            <div class="input-group">
                              <div class="input-group-text">
                                <input className="form-check-input" type="radio" name="customerType" checked={ownershipType == 'Tinatett' ? true : false} value="Tinatett" onChange = {(e) => setOwnershipType(e.target.value)}/>
                              </div>
                              <input type="text" className="form-control" aria-label="Text input with radio button" value={'Tinatett'}/>
                            </div>
                        </div>

                          <div class="col-lg-6">

                            <div class="input-group">
                              <div class="input-group-text">
                                <input className="form-check-input" type="radio" name="customerType" checked={ownershipType == 'Competitor' ? true : false} value="Competitor" onChange = {(e) => setOwnershipType(e.target.value)}/>
                              </div>
                              <input type="text" className="form-control" aria-label="Text input with radio button" value={'Competitor'} />
                            </div>
                          
                          </div>
                      </div>
                      
                    </div>
                </div>
                {/* <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Category</label>
                    <Select2
                      className="select"
                      data={options1}
                      options={{
                        placeholder: "Category",
                      }}
                    />
                  </div>
                </div> */}
                {/* <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Sub Category</label>
                    <Select2
                      className="select"
                      data={options2}
                      options={{
                        placeholder: "Sub Category",
                      }}
                    />
                  </div>
                </div> */}
                {/* <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Brand</label>
                    <Select2
                      className="select"
                      data={options2}
                      options={{
                        placeholder: "Brand",
                      }}
                    />
                  </div>
                </div> */}
                {/* <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Unit</label>
                    <Select2
                      className="select"
                      data={options4}
                      options={{
                        placeholder: "Unit",
                      }}
                    />
                  </div>
                </div> */}
                <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Retail Price</label>
                    <input type="text"  {...register("retailPrice")} />
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Wholesale Price</label>
                    <input type="text"  {...register("wholeSalePrice")} />
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Special Price</label>
                    <input type="text"  {...register("specialPrice")} />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="form-group">
                    <label>Alert</label>
                    <input type="text"
                      className="form-control"
                      {...register("alert")}
                    />
                  </div>
                </div>
                {/* <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Tax</label>
                    <Select2
                      className="select"
                      data={options5}
                      options={{
                        placeholder: "Tax",
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Discount Type</label>
                    <Select2
                      className="select"
                      data={options6}
                      options={{
                        placeholder: "Discount Type",
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Price</label>
                    <input type="text" defaultValue={1500.0} />
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label> Status</label>
                    <Select2
                      className="select"
                      data={options7}
                      options={{
                        placeholder: "Status",
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form-group">
                    <label> Product Image</label>
                    <div className="image-upload">
                      <input type="file" />
                      <div className="image-uploads">
                        <img src={Upload} alt="img" />
                        <h4>Drag and drop a file to upload</h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="product-list">
                    <ul className="row">
                      <li>
                        <div className="productviews">
                          <div className="productviewsimg">
                            <img src={Macbook} alt="img" />
                          </div>
                          <div className="productviewscontent">
                            <div className="productviewsname">
                              <h2>macbookpro.jpg</h2>
                              <h3>581kb</h3>
                            </div>
                            <a href="javascript:void(0);" className="hideset">
                              x
                            </a>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div> */}
                <div className="col-lg-12" style={{textAlign:'right'}}>
                  <button
                    href="javascript:void(0);"
                    className="btn btn-submit me-2"
                  >
                    Update
                  </button>
                  <Link to="/tinatett-pos/product/productlist" className="btn btn-cancel">
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

export default EditProduct;
