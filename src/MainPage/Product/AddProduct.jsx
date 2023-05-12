import React, { useState } from "react";
// import { Upload } from '../../EntryFile/imagePath';
// import Select2 from 'react-select2-wrapper';
import "react-select2-wrapper/css/select2.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import useCustomApi from "../../hooks/useCustomApi";
import { usePost } from "../../hooks/usePost";
import { usePut } from "../../hooks/usePut";
import { useEffect } from "react";
import alertify from "alertifyjs";
import "../../../node_modules/alertifyjs/build/css/alertify.css";
import "../../../node_modules/alertifyjs/build/css/themes/semantic.css";
import { resetServerContext } from "react-beautiful-dnd";

// const options = [
//     {id: 1, text: 'Choose Category', text: 'Choose Category' },
//     {id: 2, text: 'Computers', text: 'Computers' },
// ]
// const options1 = [
//     {id: 1, text: 'Choose Sub Category', text: 'Choose Sub Category' },
//     {id: 2, text: 'Fruits', text: 'Fruits' },
// ]


const AddProduct = (props) => {
  const [isEditMode, setisEditMode] = useState(false);
  const axios = useCustomApi();
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
      name: "",
      retailPrice: 0,
      wholeSalePrice: 0,
      specialPrice: 0,
      alert: 0,
    },
    resolver: yupResolver(validationSchema),
  });

  const { isLoading, data, isError, error, mutate } = usePost("/product");
  const { mutate: updateMutate } = usePut(`/product/${getValues()?.id}`);

  const onSubmit = (data) => {
    const { name, wholeSalePrice, retailPrice, specialPrice, alert } = data;
    isEditMode
      ? updateMutate({ name, wholeSalePrice, retailPrice, specialPrice, alert })
      : mutate(data);
  };

  useEffect(() => {
    if (isSubmitSuccessful && !isError) {
      reset();
      alertify.set("notifier", "position", "top-right");
      alertify.success("Product added successfully.");
    }
    return () => {};
  }, [isSubmitSuccessful, isError]);

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Product Add</h4>
              <h6>Create new product</h6>
            </div>
          </div>
          {/* /add */}
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Product Name (Designation)</label>
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
                  {/* <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Category</label>
                                        <Select2
                              className="select"
                              data={options}
                              options={{
                                placeholder: 'Choose Category',
                              }} />

                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Sub Category</label>
                                        <Select2
                              className="select"
                              data={options1}
                              options={{
                                placeholder: 'Choose Sub Category',
                              }} />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Brand</label>
                                        <Select2
                              className="select"
                              data={options2}
                              options={{
                                placeholder: 'Choose Brand',
                              }} />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Unit</label>
                                        <Select2
                              className="select"
                              data={options3}
                              options={{
                                placeholder: 'Choose Unit',
                              }} />
                                    </div>
                                </div> */}
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Retail Price</label>
                      <input
                        className={`form-control ${
                          errors.retailPrice ? "is-invalid" : ""
                        }`}
                        type="number"
                        {...register("retailPrice")}
                      />
                      <div className="invalid-feedback">
                        {errors.retailPrice?.message}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Wholesale Price</label>
                      <input
                        className={`form-control ${
                          errors.wholeSalePrice ? "is-invalid" : ""
                        }`}
                        type="number"
                        {...register("wholeSalePrice")}
                      />
                      <div className="invalid-feedback">
                        {errors.wholeSalePrice?.message}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Special Price</label>
                      <input
                        className={`form-control ${
                          errors.specialPrice ? "is-invalid" : ""
                        }`}
                        type="number"
                        {...register("specialPrice")}
                      />
                      <div className="invalid-feedback">
                        {errors.specialPrice?.message}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Alert</label>
                      <textarea className="form-control" defaultValue={""} />
                    </div>
                  </div>
                  {/* <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Tax</label>
                                        <Select2
                              className="select"
                              data={options4}
                              options={{
                                placeholder: 'Choose Tax',
                              }} />

                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Discount Type</label>
                                        <Select2
                              className="select"
                              data={options5}
                              options={{
                                placeholder: 'Percentage',
                              }} />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Price</label>
                                        <input type="text" />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label> Status</label>
                                        <Select2
                              className="select"
                              data={options6}
                              options={{
                                placeholder: 'Choose Product',
                              }} />
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
                                </div> */}
                  <div className="col-lg-12" style={{textAlign:'right'}}>
                    <button type="submit" className="btn btn-submit me-2">
                      {isEditMode ? "Update" : "Submit"}
                    </button>
                    <button type="button" className="btn btn-cancel" onClick={() => reset()}>
                      Clear
                    </button>
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
export default AddProduct;
