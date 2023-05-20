import React,{useState} from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Plus,
  Scanner,
  Product7,
  DeleteIcon,
  Calendar,
  Product8,
  Product1,
} from "../../EntryFile/imagePath";
import Select from "react-select";
import "react-select2-wrapper/css/select2.css";
import { useEffect } from "react";
import { useGet } from "../../hooks/useGet";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import { moneyInTxt } from "../../utility";
import { usePost } from "../../hooks/usePost";
import alertify from "alertifyjs";
import "../../../node_modules/alertifyjs/build/css/alertify.css";
import "../../../node_modules/alertifyjs/build/css/themes/semantic.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";


const AddProforma = () => {
  const [customerOptions, setCustomerOptions] = useState([])
  const [productOptions, setProductOptions] = useState([])

  const options1 = [
    { id: 1, text: "Choose", text: "Choose" },
    { id: 2, text: "Unit Price", text: "Unit Price" },
    { id: 2, text: "Retail Price", text: "Retail Price" },
    { id: 2, text: "Wholesale Price", text: "Wholesale Price" },
    { id: 2, text: "Special Price", text: "Special Price" },
  ];
  const options2 = [
    { id: 1, text: "Completed", text: "Completed" },
    { id: 2, text: "Inprogess", text: "Inprogess" },
  ];


  const {data: customers,isError,isLoading: isCustomerLoading,isSuccess} = useGet("customers", "/customer");
  const { data: products, isLoading: isProductLoading} = useGet("products", "/product");
  const { isLoading, data, isError: isPostError, error, mutate } = usePost("/proforma");

  const [selectedProduct, setSelectedProduct] = useState({})
  const [selectedCustomer, setSelectedCustomer] = useState({})
  const [formData, setFormData] = useState({amount:0, quantity:1, price:0})
  const [productGridData, setProductGridData] = useState([])
  const [transDate, setTransDate] = useState('');

  const validationSchema = Yup.object().shape({
    quantity: Yup.number().required("Quantity is required"),
  });
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      quantity: 0,
    },
    resolver: yupResolver(validationSchema),
  });




  useEffect(() => {
    if(!isProductLoading && !isCustomerLoading){
      let mappedData =  customers?.data.map((customer) => {
          return {
            id: customer?.id,
            label: customer?.name,
            value: customer?.id,
            
          }
        })
      setCustomerOptions(mappedData)

      let mappedData2 =  products?.data.map((product) => {
        return {
          id: product?.id,
          label: product?.name,
          value: product?.id,
          retailPrice: product?.retailPrice,
          wholeSalePrice : product?.wholeSalePrice,
          specialPrice: product?.specialPrice
        }
      })
      setProductOptions(mappedData2)
      console.log('loaded..')
    }
    else{
      console.log('loading...')
    }
  }, [isCustomerLoading, isProductLoading])

  useEffect(() => {
    $(document).on("click", ".delete-set", function () {
      $(this).parent().parent().hide();
    });
  });

  useEffect(() => {
    if (!isPostError && isSubmitSuccessful) {
      alertify.set("notifier", "position", "top-right");
      alertify.success("Proforma saved successfully.");
    }
    else if(isPostError){
      alertify.set("notifier", "position", "top-right");
      alertify.error("Error...Could not save.");
    }
    
    return () => {};
  }, [isPostError, isSubmitSuccessful]);

  const handleProductSelect = (e) => {
    if(products && !isProductLoading){
      // let item = products?.data.find((product) => product.id == e.target.value)
      setSelectedProduct(e)
    }
  }

  const handleCustomerSelect = (e) => {
    if(customers && !isCustomerLoading){
      // let item = customers?.data.find((customer) => customer.id == e.target.value)
      setSelectedCustomer(e)
    }
  }

  const handleAddItem = () => {
    //console.log(productFormData)
    // if(formData.expireDate == '' || formData.manufacturingDate == '' ){
    //   alertify.set("notifier", "position", "top-right");
    //   alertify.warning("Please make sure all fields are filled.");
    // }
    // else{
      let item = 
     
          {
            productId:selectedProduct.id,
            productName: selectedProduct.label,
            quantity:formData.quantity,
            unitPrice:formData?.price,
            amount: formData?.price * formData?.quantity
            
          }
    
      setProductGridData([...productGridData, item])
      setFormData({  quantity: 1, amount: 1})
      setSelectedProduct('')
      
   // }
   
  }

  const onSubmit = (data) => {
    let postBody = {
      customerId: selectedCustomer.id,
      transDate: transDate,
      products: productGridData
    }
    mutate(postBody)
    setSelectedCustomer({})
    setSelectedProduct({})
    setFormData({amount:0, quantity:1, price:0})
    setProductGridData([])
    setTransDate('')
  
  };


  useEffect(() => {
    setFormData({...formData,price:selectedProduct.retailPrice, amount: selectedProduct.retailPrice * formData.quantity})
    setFormData({...formData,price:selectedProduct.wholeSalePrice, amount: selectedProduct.wholeSalePrice * formData.quantity})
    setFormData({...formData, price:selectedProduct.specialPrice, amount: selectedProduct.specialPrice * formData.quantity})
  }, [formData.quantity, formData.retailPrice, formData.wholeSalePrice, formData.specialPrice])



  if(isProductLoading && isCustomerLoading){
    return <LoadingSpinner/>
  }

  if(isLoading){
    return <LoadingSpinner message="Saving Proforma.."/>
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Add Proforma</h4>
            <h6>Add your new proforma</h6>
          </div>
        </div>
      
      <div style={{display:'flex', gap:20}}>

        <div style={{display:'flex', flexDirection:'column', width:'35%', }}>
          <div className="card">
            {/* <form onSubmit={handleSubmit(onSubmit)}> */}
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-8 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Customer Name</label>
                      <div className="row">
                        <div className="col-lg-12 col-sm-12 col-12">
                          <Select
                            className="select"
                            options={customerOptions}
                            onChange={handleCustomerSelect}
                            value={selectedCustomer}
                          
                          />
                        </div>
                        
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-sm-6 col-12">
                    <div className="form-group">
                      <label> Date</label>
                      <div className="input-groupicon">
                        <DatePicker
                          selected={transDate}
                            onChange={(e) => {
                              setTransDate(e)
                            }
                            }
                        />
                        <Link className="addonset">
                          <img src={Calendar} alt="img" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                  <div className="col-lg-12 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Product Name (Designation)</label>
                      <Select
                        className="select"
                        options={productOptions}
                        onChange={handleProductSelect}
                        value={selectedProduct}
                      />
                    </div>
                  </div>
                
                  
                  <div className="col-lg-12 col-sm-12 col-12">
                    <div className="form-group">
                      <label>Unit Price </label>
                         <div className="row">
                          
                            <div class="col-lg-6">

                              <div class="input-group">
                                <div class="input-group-text">
                                  <input className="form-check-input" type="radio" name="customerType" value={selectedProduct?.retailPrice}
                                  onChange={(e) => {
                                    console.log(selectedProduct?.retailPrice, formData.quantity)
                                    setFormData({...formData,price:selectedProduct.retailPrice, amount: selectedProduct.retailPrice * formData.quantity})
                                  }} />
                                </div>
                                <input type="text" className="form-control" aria-label="Text input with radio button" value={'Retail Price'} />
                              </div>
                            
                            </div>

                            <div class="col-lg-6">
                              <div class="input-group">
                                <div class="input-group-text">
                                  <input className="form-check-input" type="radio" name="customerType" value={selectedProduct?.wholeSalePrice}
                                  onChange={(e) => {
                                    console.log(selectedProduct?.wholeSalePrice, formData.quantity)
                                    setFormData({...formData,price:selectedProduct.wholeSalePrice, amount: selectedProduct.wholeSalePrice * formData.quantity})
                                  }} />
                                </div>
                                <input type="text" className="form-control" aria-label="Text input with radio button" value={'Wholesale Price'}/>
                              </div>
                          </div>
                        </div>

                        <div className="row" style={{marginTop:20}}>
                            <div class="col-lg-6">

                              <div class="input-group">
                                <div class="input-group-text">
                                  <input className="form-check-input" type="radio" name="customerType" value={selectedProduct?.specialPrice} 
                                  onChange={(e) => {
                                    console.log(selectedProduct?.specialPrice, formData.quantity)
                                    setFormData({...formData, price:selectedProduct.specialPrice, amount: selectedProduct.specialPrice * formData.quantity})
                                  }} />
                                </div>
                                <input type="text" className="form-control" aria-label="Text input with radio button" value={'Special Price'} />
                              </div>
                            
                            </div>
                        </div>
                    
                    </div>
                  </div>

                  <div className="row">
                  <div className="col-lg-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Quantity</label>
                      <div className="input-groupicon">
                        <input
                          type="number"
                          min={1}
                          className="form-control"
                          value={formData.quantity}
                          // {...register("quantity")}
                          onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Amount</label>
                      <div className="input-groupicon">
                        <input
                          type="number"
                          className="form-control"
                          value={formData.amount}
                        
                        />
                      
                      </div>
                    </div>
                  </div>
                  </div>
                 
                  
                  <div className="col-lg-12 col-sm-6 col-12">
                    <div className="form-group">
                      <Link to="#" className="btn btn-submit me-2" onClick={handleAddItem}>
                        Add
                      </Link>
                      <Link to="#" className="btn btn-cancel">
                        Clear
                      </Link>
                    </div>
                    
                  </div>
              </div>
            </div>
        </div>


          <div className="card" style={{width:'65%'}} >
              <div className="card-body">
                <div className="row">
                  <div className="table-responsive mb-3">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Product Name</th>
                          <th>Quantity</th>
                          <th>Unit Price</th>
                          <th>Amount</th>
                          <th>Action</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {productGridData?.map((item, index) => {
                          return (
                            <tr key={item?.id}>
                              <td>{index + 1}</td>
                              <td className="productimgname">
                                {/* <Link className="product-img">
                                  <img src={Product7} alt="product" />
                                </Link> */}
                                <Link to="#">{item?.productName}</Link>
                              </td>
                              <td>{item?.quantity}</td>
                              <td>{item?.unitPrice}</td>
                              <td>{item?.amount}</td>
                            
                              <td>
                                <Link to="#" className="delete-set">
                                  <img src={DeleteIcon} alt="svg" />
                                </Link>
                              </td>
                        </tr>
                          )
                        })}
                      
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="row">
                  {/* <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Order Tax</label>
                      <input type="text" />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Discount</label>
                      <input type="text" />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Shipping</label>
                      <input type="text" />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Status</label>
                      <Select2
                        className="select"
                        data={options2}
                        options={{
                          placeholder: "Choose Status",
                        }}
                      />
                    </div>
                  </div> */}
                  <div className="row">
                    <div className="col-lg-6 ">
                      <div className="total-order w-100 max-widthauto m-auto mb-4">
                        {/* <ul>
                          <li>
                            <h4>Order Tax</h4>
                            <h5>$ 0.00 (0.00%)</h5>
                          </li>
                          <li>
                            <h4>Discount </h4>
                            <h5>$ 0.00</h5>
                          </li>
                        </ul> */}
                      </div>
                    </div>
                    <div className="col-lg-6 ">
                      <div className="total-order w-100 max-widthauto m-auto mb-4">
                        <ul>
                          
                          <li className="total">
                            <h4>Grand Total</h4>
                            <h5>GHS {moneyInTxt(
                              productGridData.reduce((total, item) => total + item.amount, 0)
                            )}</h5>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12" style={{textAlign:'right'}}>
                    <button type="submit" className="btn btn-submit me-2" onClick={onSubmit}>
                      Proforma
                    </button>
                    {/* <Link to="#" className="btn btn-cancel me-2" style={{backgroundColor:'#FF9F43'}}>
                      Refresh
                    </Link> */}
                    <Link to="#" className="btn btn-cancel">
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>
              {/* </form> */}
            </div>
          </div>

    
      </div>
    </div>
  );
};

export default AddProforma;
