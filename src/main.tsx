import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { ApolloProvider } from "@apollo/client";
import "./index.css";
import { Toaster } from "./components/ui/sonner";
import { router } from "./routes";
import { client } from "./lib/apollo-client";
import { Providers } from "./lib/providers";
import { Auth0Provider } from "@auth0/auth0-react";
import { auth0Config } from "./config/auth0-config";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Providers>
      <ApolloProvider client={client}>
        <Auth0Provider
          domain={auth0Config.domain}
          clientId={auth0Config.clientId}
          authorizationParams={auth0Config.authorizationParams}
        >
          <RouterProvider router={router} />
          <Toaster />
        </Auth0Provider>
      </ApolloProvider>
    </Providers>
  </React.StrictMode>
);
