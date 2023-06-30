import React from "react";

export default function LoadingSpinner({message = 'Tinatett loading...'}) {
    return (
        <div id="global-loader" style={{display:'flex', flexDirection:'column', gap:50, textAlign:'center'}}>
            <div className="whirly-loader"></div>
            <div>{message}</div>
        </div>       
    );
}