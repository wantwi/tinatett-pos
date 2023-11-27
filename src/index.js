import React from "react";
import ReactDOM from "react-dom";
import Main from './EntryFile/Main';
import { registerLicense } from '@syncfusion/ej2-base';

// Registering Syncfusion license key
registerLicense('ORg4AjUWIQA/Gnt2VlhiQlVPd11dXmJWd1p/THNYflR1fV9DaUwxOX1dQl9gSH9RcEVrXX5beXFdT2M=');


ReactDOM.render(<Main />, document.getElementById('app'));

if (module.hot) { // enables hot module replacement if plugin is installed
    module.hot.accept();
}
