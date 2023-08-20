import axios from "axios";
import { BASE_URL } from "./api/CustomAxios";

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
  let token = JSON.parse(localStorage.getItem("auth"))
  //console.log(token)

  export const getInvoiceReceipt = (salesref) => {
    axios.get(`${BASE_URL}/sales/getSaleReceipt/`+ salesref, {
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
    //window.print(url)
    const pdfWindow = window.open("");
    pdfWindow.document.write("<iframe width='100%' height='100%' src='" + url + "'></iframe>");
    //window.print()
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


  export const timeAgo = (input)  => {
    const date = (input instanceof Date) ? input : new Date(input);
    const formatter = new Intl.RelativeTimeFormat('en');
    const ranges = {
      years: 3600 * 24 * 365,
      months: 3600 * 24 * 30,
      weeks: 3600 * 24 * 7,
      days: 3600 * 24,
      hours: 3600,
      minutes: 60,
      seconds: 1
    };
    const secondsElapsed = (date.getTime() - Date.now()) / 1000;
    for (let key in ranges) {
      if (ranges[key] < Math.abs(secondsElapsed)) {
        const delta = secondsElapsed / ranges[key];
        return formatter.format(Math.round(delta), key);
      }
    }
  }


  export function base64ToBlob( base64, type = "application/octet-stream" ) {
    const binStr = atob( base64 );
    const len = binStr.length;
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      arr[ i ] = binStr.charCodeAt( i );
    }
    return new Blob( [ arr ], { type: type } );
  }