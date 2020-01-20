
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import store from "./js/store/index";
import App from "./js/components/App.jsx";
import { HashRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';


render(
  <CookiesProvider>
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </CookiesProvider>,
  document.getElementById("root")
);