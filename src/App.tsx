/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home";
import { Admission } from "./pages/Admission";
import { Dashboard } from "./pages/Dashboard";
import { Classes } from "./pages/Classes";
import { ComingSoon } from "./pages/ComingSoon";
import { ToastProvider } from "./components/ui/Toast";
import { AuthProvider } from "./components/auth/AuthContext";
import { ThemeProvider } from "./components/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<ComingSoon title="About Us" />} />
                <Route path="classes" element={<Classes />} />
                <Route path="admission" element={<Admission />} />
                <Route path="faculty" element={<ComingSoon title="Faculty" />} />
                <Route path="library" element={<ComingSoon title="Library" />} />
                <Route path="contact" element={<ComingSoon title="Contact Us" />} />
                {/* Mock Dashboard inside layout for prototype */}
                <Route path="dashboard" element={<Dashboard />} />
              </Route>
            </Routes>
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

