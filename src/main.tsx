import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { ApolloProvider } from "@apollo/client";
import "./index.css";
import { Toaster } from "./components/ui/sonner";
import { router } from "./routes";
import { client } from "./lib/apollo-client";
import { Providers } from "./lib/providers";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Providers>
      <ApolloProvider client={client}>
        <RouterProvider router={router} />
        <Toaster />
      </ApolloProvider>
    </Providers>
  </React.StrictMode>
);
