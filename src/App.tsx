import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";

import SignIn from "./pages/AuthPages/SignIn";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./components/ProtectedRoute";


import Dashboard from "./pages/Dashboard/Home";




import NotFound from "./pages/OtherPage/NotFound";

import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
//import Home from "./pages/Dashboard/Home";

export default function App() {
    const auth = localStorage.getItem("auth");

    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        fontSize: '16px',
                        padding: '16px',
                        minWidth: '250px',
                        maxWidth: '500px',
                    },
                }}
            />
            <Router>
                <ScrollToTop />
                <Routes>
                    {/* Auth Layout - Redirige al dashboard si ya tiene auth */}
                    <Route
                        path="/"
                        element={auth ? <Navigate to="/dashboard" replace /> : <SignIn />}
                    />

                    {/* Dashboard Layout - Protegido */}
                    <Route
                        element={
                            <ProtectedRoute>
                                <AppLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/profile" element={<UserProfiles />} />
                        <Route path="/calendar" element={<Calendar />} />
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

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </>
    );
}
