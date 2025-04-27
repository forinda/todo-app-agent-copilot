import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import { AppLayout } from "../layout/app-layout";
import HomePage from "../pages/HomePage";
import CreateTodoPage from "../pages/CreateTodoPage";
import EditTodoPage from "../pages/EditTodoPage";
import { ProtectedRoute } from "../components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "todos/create",
        element: <CreateTodoPage />,
      },
      {
        path: "todos/edit/:id",
        element: <EditTodoPage />,
      },
    ],
  },
])