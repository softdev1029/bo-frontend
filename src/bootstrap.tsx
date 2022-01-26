import React from "react";
import ReactDOM from "react-dom";
import { invariant } from "./exports";
import { Interceptor, Ioc } from "./internals";
import { store } from "./store-wrapper";
import { BrowserRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import { routes } from "./config";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { history } from "./exports";
import { delay, map } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { ToastContainer } from "./ui-components";

import _set from "lodash/set";
import { requestLogoutAction } from "./actions/auth.actions";

function loadTheme() {
  const elms = document.getElementsByTagName("body");
  const body = elms && elms.length ? elms[0] : null;

  if (body) {
    body.className = "dark-theme";
    // body.className = localStorage.getItem(THEME_KEY) || 'dark-theme'
  }
}

function onCompleted(element: HTMLDivElement) {
  ReactDOM.render(
    <React.Fragment>
      <BrowserRouter>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            {renderRoutes(routes)}
            <ToastContainer />
          </ConnectedRouter>
        </Provider>
      </BrowserRouter>
    </React.Fragment>,
    element
  );
}

function createApp(element: HTMLDivElement): Observable<HTMLDivElement> {
  invariant(!!element, `[app] need to provide an element but got: ${element}`);

  // I removed the promise since there is no HTTP in any part of this app
  // instead, I put an empty stream here, for any purpose in future

  return of({}).pipe(
    delay(0),
    map(() => element)
  );
}

export const App = {
  init(element) {
    console.log("-> ....version......->");
    // init theme from storage
    loadTheme();

    // register store to Ioc
    Ioc.singleton("Store", () => store);

    // register fetch interceptors
    registerInterceptors();
    // init ticker utils
    return createApp(element).subscribe(onCompleted);
  },
  getStore() {
    return Ioc.make("Store");
  },
};

export function getState(reducer: string, key: string, log?) {
  const store = Ioc.make("Store");
  if (store) {
    const state = store.getState();
    log && console.log("state", state, "reducer", reducer, "key", key);

    if (reducer) {
      if (state.hasOwnProperty(reducer)) {
        return key ? state[reducer][key] : state[reducer];
      } else {
        return undefined;
      }
    }

    return state;
  }

  return undefined;
}

function registerInterceptors() {
  Interceptor.register({
    onRequest: function (url, config) {
      // @todo remove api.binance
      const iKey = "Authorization";

      if (!url.includes("api.binance")) {
        const token = getState("user", "token");

        const nConfig = Object.assign({}, config);

        // clear token
        if (nConfig.headers[iKey]) {
          if (token && nConfig.headers[iKey] !== token) {
            nConfig.headers[iKey] = token;
          } else {
            delete nConfig.headers[iKey];
          }
        }

        // add Authorization to every requests
        if (nConfig && (!nConfig.headers || !nConfig.headers[iKey])) {
          _set(nConfig, ["headers", iKey], token);
        }

        return [url, nConfig];
      } else {
        config["headers"] = {};
      }

      // Modify the url or config here
      return [url, config];
    },
    onResponse: function (response) {
      // console.log('[interceptor] response', response);
      // Modify the reponse object
      return response;
    },
  });

  // must registerd separately if you wanna listen exception from previous Interceptor
  Interceptor.register({
    onResponseError: function (response) {
      console.warn("onResponseError", response);
    },
  });
}
