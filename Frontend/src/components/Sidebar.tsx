import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const linkClass =
    "block px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition font-medium";

  return (
    <div className="w-64 h-screen bg-white border-r shadow-sm p-4">
      <h1 className="text-2xl font-bold mb-6 text-purple-600">Hospital</h1>

      <nav className="flex flex-col gap-2">
        <NavLink className={linkClass} to="/">Dashboard</NavLink>
        <NavLink className={linkClass} to="/patients">Patients</NavLink>
        <NavLink className={linkClass} to="/appointments">Appointments</NavLink>
        <NavLink className={linkClass} to="/doctors">Doctors</NavLink>
        <NavLink className={linkClass} to="/labs">Lab Orders</NavLink>
        <NavLink className={linkClass} to="/billing">Billing</NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
