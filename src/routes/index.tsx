import { createBrowserRouter } from "react-router";
import HookFormTutorial from "../components/HookFormTutorial";
import ProductList from "../components/ProductList";
import { AirbnbForm } from "../components/AirbnbForm/AirbnbForm";
import { LaunchList } from "../components/SpaceX/LaunchList";
import { LaunchListTanstack } from "../components/SpaceX/LaunchListTanstack";
import { LaunchDetail } from "../components/SpaceX/LaunchDetail";
import App from "../App";
import { Dashboard } from "../components/Dashboard";
import Auth from "../components/auth";
import ProtectedRoute from "../components/auth/protected-route";
import Profile from "../components/auth/profile";
import Swapy from "../components/swapy/swapy";
import Canvas from "../components/canvas/canvas";
import PhotoLite from "../components/photo-lite";
import Scroll from "@/components/Scroll/Scroll";
import Anime from "@/components/anime/Anime";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <ProductList />,
      },
      {
        path: "/hook-form",
        element: <HookFormTutorial />,
      },
      {
        path: "/airbnb-form",
        element: <AirbnbForm />,
      },
      {
        path: "/spacex",
        element: <LaunchList />,
      },
      {
        path: "/spacex-tanstack",
        element: <LaunchListTanstack />,
      },
      {
        path: "/spacex/launch/:id",
        element: <LaunchDetail />,
      },
      {
        path: "/finance",
        element: <Dashboard />,
      },
      {
        path: "/auth",
        element: <Auth />,
      },
      {
        path: "/profile",

        element: (
          <ProtectedRoute>
            <Profile />,
          </ProtectedRoute>
        ),
      },
      {
        path: "/swapy",
        element: <Swapy />,
      },
      {
        path: "/canvas",
        element: <Canvas />,
      },
      {
        path: "/photo-lite",
        element: <PhotoLite />,
      },
      {
        path: "/infinite-scroll",
        element: <Scroll />,
      },
      {
        path: "/animejs",
        element: <Anime />,
      },
    ],
  },
]);
