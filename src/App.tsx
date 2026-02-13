import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";
import { ScrollToTop } from "./components/common/ScrollToTop";

import SignIn from "./pages/AuthPages/SignIn";
import ResetPassword from "./pages/AuthPages/ResetPassword.tsx";


import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layout/AppLayout";

import Dashboard from "./pages/Dashboard/Home";
import UserProfiles from "./pages/UserProfiles";
import Calendar from "./pages/Calendar";
import Blank from "./pages/Blank";
import FormElements from "./pages/Forms/FormElements";
import BasicTables from "./pages/Tables/BasicTables";
import Alerts from "./pages/UiElements/Alerts";
import Avatars from "./pages/UiElements/Avatars";
import Badges from "./pages/UiElements/Badges";
import Buttons from "./pages/UiElements/Buttons";
import Images from "./pages/UiElements/Images";
import Videos from "./pages/UiElements/Videos";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import NotFound from "./pages/OtherPage/NotFound";
import PublicRoute from "./components/auth/PublicRoute.tsx";
import ResetPasswordConfirm from "./pages/AuthPages/ResetPasswordConfirm.tsx";
import {PermissionRoute} from "./components/auth/PermissionRoute.tsx";
import Roles from "./pages/RolesPermisos/Roles.tsx";
import Permisos from "./pages/RolesPermisos/Permisos.tsx";
import RolesPermisos from "./pages/RolesPermisos/RolesPermisos.tsx";
import PermisosTodos from "./pages/RolesPermisos/PermisosTodos.tsx";
import Usuarios from "./pages/RolesPermisos/Usuarios.tsx";
import CategoriasConfig from "./pages/Productos/Config/CategoriasConfig.tsx";

export default function App() {
    return (
      <>
        <Toaster
          position="top-right"
          containerStyle={{
            zIndex: 99999999, // Mayor que z-[9999] del header
          }}
          toastOptions={{
            duration: 3000,
            style: {
              zIndex: 99999999,
            },
            success: {
              style: {
                zIndex: 99999999,
              },
            },
            error: {
              style: {
                zIndex: 99999999,
              },
            },
          }}
        />

          <Router>
              <ScrollToTop />

              <Routes>
                  {/* RUTAS PÚBLICAS (login) */}
                  <Route element={<PublicRoute />}>
                      <Route path="/" element={<SignIn />} />
                      <Route path="/reset-password" element={<ResetPassword/>} />
                      <Route path="/admin/reset-password" element={<ResetPasswordConfirm/>} />

                  </Route>

                  {/* RUTAS PROTEGIDAS */}
                  <Route element={<ProtectedRoute />}>
                      <Route element={<AppLayout />}>
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/profile" element={<UserProfiles />} />


                          {/* Calendar con permiso específico */}
                          <Route
                              path="/calendar"
                              element={
                                  <PermissionRoute permission="admin.sidebar.roles.y.permisos">
                                      <Calendar />
                                  </PermissionRoute>
                              }
                          />


                          {/* ROLES */}
                          <Route
                            path="/admin/roles"
                            element={
                                <PermissionRoute >
                                    <Roles />
                                </PermissionRoute>
                            }
                          />
                         {/* ROLES -> PERMISOS */}
                          <Route
                              path="/admin/roles/:id/permisos"
                              element={<RolesPermisos />}
                          />
                          {/* LISTADO DE PERMISOS */}
                          <Route
                            path="/admin/permisos-todos"
                            element={
                              <PermissionRoute>
                                <PermisosTodos />
                              </PermissionRoute>
                            }
                          />


                          {/* LISTADO DE USUARIOS */}
                        <Route
                          path="/admin/usuarios"
                          element={
                            <PermissionRoute>
                              <Usuarios />
                            </PermissionRoute>
                          }
                        />

                        { /*CONFIGURACION PRODUCTOS */}
                        <Route
                          path="/admin/productos/config"
                          element={
                            <PermissionRoute>
                              <CategoriasConfig />
                            </PermissionRoute>
                          }
                        />





                          <Route path="/blank" element={<Blank />} />
                          <Route path="/form-elements" element={<FormElements />} />
                          <Route path="/basic-tables" element={<BasicTables />} />
                          <Route path="/alerts" element={<Alerts />} />
                          <Route path="/avatars" element={<Avatars />} />
                          <Route path="/badge" element={<Badges />} />
                          <Route path="/buttons" element={<Buttons />} />
                          <Route path="/images" element={<Images />} />
                          <Route path="/videos" element={<Videos />} />
                          <Route path="/line-chart" element={<LineChart />} />
                          <Route path="/bar-chart" element={<BarChart />} />
                      </Route>
                  </Route>

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
              </Routes>
          </Router>
      </>
    );
}
