import React, { lazy, Suspense, useEffect, ReactNode } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { MantineProvider, LoadingOverlay } from "@mantine/core";
import { CarProvider } from "./context/CarContext";
import { authService } from "./services/api";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";

const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const Dashboard = lazy(() => import("./pages/Admin/Dashboard"));
const CarsAdmin = lazy(() => import("./pages/Admin/Cars"));
const UsersAdmin = lazy(() => import("./pages/Admin/Users"));
const PartsAdmin = lazy(() => import("./pages/Admin/Parts"));
const SubmissionsAdmin = lazy(() => import("./pages/Admin/Submissions"));

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const navigate = useNavigate();

  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate("/");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  return isAuthenticated && isAdmin ? (
    children
  ) : (
    <LoadingOverlay visible={true} />
  );
};

const App: React.FC = () => {
  return (
    <MantineProvider>
      <Router>
        <CarProvider>
          <Routes>
            <Route
              path="/mainpage"
              element={
                <MainLayout>
                  <HomePage />
                </MainLayout>
              }
            />
            <Route path="/" element={<LandingPage />} />

            <Route
              path="/admin/*"
              element={
                <Suspense fallback={<LoadingOverlay visible={true} />}>
                  <AdminRoute>
                    <Routes>
                      <Route path="/" element={<AdminLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="cars" element={<CarsAdmin />} />
                        <Route path="users" element={<UsersAdmin />} />
                        <Route path="parts" element={<PartsAdmin />} />
                        <Route
                          path="submissions"
                          element={<SubmissionsAdmin />}
                        />
                      </Route>
                    </Routes>
                  </AdminRoute>
                </Suspense>
              }
            />

            <Route path="*" element={<LandingPage />} />
          </Routes>
        </CarProvider>
      </Router>
    </MantineProvider>
  );
};

export default App;
