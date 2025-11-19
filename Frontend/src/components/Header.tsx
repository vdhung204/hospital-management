const Header = () => {
  return (
    <div className="h-16 bg-white border-b shadow-sm flex items-center justify-between px-6">
      <input
        placeholder="Search..."
        className="px-4 py-2 border rounded-lg w-1/3 focus:outline-none focus:ring-2 focus:ring-purple-400"
      />

      <div className="flex items-center gap-3">
        <span className="font-semibold text-gray-700">Dr. Admin</span>
        <img
          src="https://i.pravatar.cc/40"
          className="rounded-full w-10 h-10"
        />
      </div>
    </div>
  );
};

export default Header;
