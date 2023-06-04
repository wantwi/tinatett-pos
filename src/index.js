import React from "react";
import ReactDOM from "react-dom";
import Main from './EntryFile/Main';
import * as serviceWorkerRegistration from '../serviceWorkerRegistration'

ReactDOM.render(<Main/>, document.getElementById('app'));

if (module.hot) { // enables hot module replacement if plugin is installed
 module.hot.accept();
}
serviceWorkerRegistration.register()
