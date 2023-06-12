import axios from "axios";

export const moneyInTxt = (value, standard, dec = 2) => {
    var nf = new Intl.NumberFormat(standard, {
      minimumFractionDigits: dec,
      maximumFractionDigits: 2,
    })
    return nf.format(Number(value) ? value : 0.0)
  }

  
export const isValidNumber = (input) => {
    var p = new RegExp(/^[0-9]+([.][0-9]+)?$/);
    return p.test(input);
}; 


export const commaRemover = (value) => {
  value = value.replace(/,/g, '')
  return parseFloat(value)
}
  let token = JSON.parse(sessionStorage.getItem("auth"))

  export const getInvoiceReceipt = (salesref) => {
    axios.get('https://backendapi.akwaabaevolution.com/api/sales/getSaleReceipt/'+ salesref, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token.token}`
      },
      withCredentials: true,
    })
    .then((res) =>{
    console.log(res.data)
    var base64 = res.data.base64
    const blob = base64ToBlob( base64, 'application/pdf' );
    const url = URL.createObjectURL( blob );
    const pdfWindow = window.open("");
    pdfWindow.document.write("<iframe width='100%' height='100%' src='" + url + "'></iframe>");
    })
    
    function base64ToBlob( base64, type = "application/octet-stream" ) {
      const binStr = atob( base64 );
      const len = binStr.length;
      const arr = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        arr[ i ] = binStr.charCodeAt( i );
      }
      return new Blob( [ arr ], { type: type } );
    }
  }