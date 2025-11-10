import { Link, NavLink } from "react-router";

const Navbar = () => {
  const links = (
    <>
      <li>
        <NavLink
          to={"/"}
          className={({ isActive }) =>
            `px-3 py-2 transition ${
              isActive
                ? "text-[#422AD5] bg-[#EBE9FA] rounded-lg font-semibold"
                : "text-gray-700 hover:text-[#422AD5] bg-transparent"
            }`
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to={"/bills"}
          className={({ isActive }) =>
            `px-3 py-2 transition ${
              isActive
                ? "text-[#422AD5] bg-[#EBE9FA] rounded-lg font-semibold"
                : "text-gray-700 hover:text-[#422AD5] bg-transparent"
            }`
          }
        >
          Bills
        </NavLink>
      </li>
      <li>
        <NavLink
          to={"/login"}
          className={({ isActive }) =>
            `px-3 py-2 transition ${
              isActive
                ? "text-[#422AD5] bg-[#EBE9FA] rounded-lg font-semibold"
                : "text-gray-700 hover:text-[#422AD5] bg-transparent"
            }`
          }
        >
          Login
        </NavLink>
      </li>
      <li>
        <NavLink
          to={"/register"}
          className={({ isActive }) =>
            `px-3 py-2 transition ${
              isActive
                ? "text-[#422AD5] bg-[#EBE9FA] rounded-lg font-semibold"
                : "text-gray-700 hover:text-[#422AD5] bg-transparent"
            }`
          }
        >
          Register
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="px-10 navbar bg-base-100 shadow-sm sticky top-0 z-40">
      <div className="navbar-start flex items-center gap-2">
        <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow flex flex-col gap-2 "
          >
            {links}
          </ul>
        </div>

        <NavLink
          to="/"
          className="btn btn-ghost text-2xl font-bold text-[#422AD5]"
        >
          SmartBills
        </NavLink>
      </div>
      <div className="navbar-end hidden lg:flex">
        <ul className="menu menu-horizontal px-1 flex items-center gap-2 text-lg font-semibold">
          {links}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
