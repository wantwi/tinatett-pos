import React from "react";

export default function LoadingSpinner() {
    return (
        <div id="global-loader" style={{display:'flex', justifyContent:'center', alignItems:'center', textAlign:'center'}}>
            <div className="whirly-loader"></div>
            <div style={{marginTop:150, marginLeft:-60}}>Tinatett loading...</div>
        </div>       
    );
}