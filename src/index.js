import React from "react";
import ReactDOM from "react-dom/client";
//START: bootstrap to use offline -> un comment cdn in index.html to use them for production instead to minimize application size
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap/dist/js/bootstrap.js'
//END.
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import configureAccountsStore from "./hooks-store/accounts-store";
import configureSliderImagessStore from "./hooks-store/slider-images-store";
import configureClinicServicesStore from "./hooks-store/clinic-services-store";
import configureArticlesStore from "./hooks-store/articles-store";
import configureNewsStore from "./hooks-store/news-store";
import configureVaccinsStore from "./hooks-store/vaccins-store";
import configureBookingsStore from "./hooks-store/bookings-store";
import configureMetaDataStore from "./hooks-store/meta-data-store";
import configureVisitsStore from "./hooks-store/visits-store";
import configureMedicinsStore from "./hooks-store/medicines-store";
import configureToolsStore from "./hooks-store/tools_store";
import configurePurchasesStore from "./hooks-store/purchases_store";
import configurePaymentsStore from "./hooks-store/payments_store";
configureAccountsStore();
configureSliderImagessStore();
configureClinicServicesStore();
configureArticlesStore();
configureNewsStore();
configureVaccinsStore();
configureBookingsStore();
configureMetaDataStore();
configureVisitsStore();
configureMedicinsStore();
configureToolsStore();
configurePurchasesStore();
configurePaymentsStore();
//

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
