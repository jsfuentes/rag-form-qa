import conf from "conf";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Provider } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import ErrorBoundary from "src/components/ErrorBoundary";
import ErrorManager from "src/components/ErrorManager";
import { store } from "src/redux/store";
import "src/styles/globals.css";

const debug = require("debug")("app:pages:_app");

//not actually sure this works
if (typeof localStorage !== "undefined") {
  setTimeout(() => {
    console.log("Debugging enabledd");
    localStorage.debug = "app:*";
  }, 3000);
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ErrorManager>
          <Head>
            <title>{conf.get("PROJECT_NAME")}</title>
            <meta
              name="description"
              content="Learn & earn to solidify your financial future"
            />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <meta
              property="og:title"
              content={conf.get("PROJECT_NAME")}
              key="title"
            />
            <link rel="icon" href="/favicon.ico" />
            <link
              href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
              rel="stylesheet"
            />
          </Head>

          <ToastContainer
            bodyClassName="px-2 text-white font-medium w-full relative min-w-full "
            toastClassName="py-3 rounded bg-gray-900 flex items-center justify-center min-h-0 shadow-md " //disable default min height
            closeButton={false}
            position={toast.POSITION.TOP_CENTER}
            autoClose={4000} //false to disable
            closeOnClick={true}
            pauseOnHover={true}
            pauseOnFocusLoss={false}
          />

          <Component {...pageProps} />
        </ErrorManager>
      </Provider>
    </ErrorBoundary>
  );
}
