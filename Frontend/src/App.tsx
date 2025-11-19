import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layout/DashbroardLayout";
import DashboardHome from "./pages/DashbroardHome";
import Patients from "./pages/patients/Patients";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="patients" element={<Patients />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
