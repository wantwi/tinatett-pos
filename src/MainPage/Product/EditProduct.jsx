import React, { useEffect, useState } from "react";
import { Macbook, Upload } from "../../EntryFile/imagePath";
import {Link} from "react-router-dom"
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useGet } from "../../hooks/useGet";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
const options1 = [
  { id: 1, text: "Computers", text: "Computers" },
  { id: 2, text: "Mac", text: "Mac" },
];
const options2 = [
  { id: 1, text: "None", text: "None" },
  { id: 2, text: "Option1", text: "Option1" },
];
const options4 = [
  { id: 1, text: "Piece", text: "Piece" },
  { id: 2, text: "Kg", text: "Kg" },
];
const options5 = [
  { id: 1, text: "Choose Tax", text: "Choose Tax" },
  { id: 2, text: "2%", text: "2%" },
];
const options6 = [
  { id: 1, text: "Percentage", text: "Percentage" },
  { id: 2, text: "10%", text: "10%" },
  { id: 2, text: "20%", text: "20%" },
];
const options7 = [
  { id: 1, text: "Active", text: "Active" },
  { id: 2, text: "Open", text: "Open" },
];

const EditProduct = () => {

  const {id} = useParams()
  console.log(id)

  const {data:product, isLoading, isError}  = useGet("product", `/product/${id}`);
  const [data, setData] = useState({})
  
  useEffect(() => {
    if(!isLoading){
      setData(product.data)
      console.log('loaded..')
    }
    else{
      console.log('loading...')
    }
  }, [isLoading])

  if(isLoading){
    return <LoadingSpinner/>
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
              <div className="row">
                <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Product Name</label>
                    <input type="text" value={data?.name} />
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
                    <input type="text" value={data?.retailPrice} />
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Wholesale Price</label>
                    <input type="text" value={data?.wholeSalePrice} />
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Special Price</label>
                    <input type="text" value={data?.specialPrice} />
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form-group">
                    <label>Alert</label>
                    <textarea
                      className="form-control"
                      value={data?.alert}
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
                <div className="col-lg-12">
                  <button
                    href="javascript:void(0);"
                    className="btn btn-submit me-2"
                  >
                    Update
                  </button>
                  <Link to="/productlist" className="btn btn-cancel">
                    Cancel
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* /add */}
        </div>
      </div>
    </>
  );
};

export default EditProduct;
