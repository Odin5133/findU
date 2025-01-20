import React, { useState, useEffect } from "react";
import { IconLocation, IconArrowRight, IconLogout } from "@tabler/icons-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ProfileSearchBox from "./Components/ProfileSearchBox";

function Navbar() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const Navigate = useNavigate();
  const location = useLocation(); // Get the current location

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Check if token is present or not in localstorage
    if (!token) {
      return;
    }
    console.log(token);

    axios
      .get("http://localhost:3000/api/profiles/is-admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.isAdmin) {
          setIsSignedIn(true);
          console.log("authorised");
        } else {
          setIsSignedIn(false);
          console.log("unauthorised");
          Navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [location]);

  return (
    <div className="w-full shadow-2xl bg-gray-100 bg-opacity-10 backdrop-filter backdrop-blur-lg text-white flex justify-between items-center border-b border-zinc-200 sticky top-0 z-10">
      <div
        className="flex p-5 gap-2 cursor-pointer"
        onClick={() => {
          Navigate("/");
        }}
      >
        <IconLocation stroke={2} />
        <span>FindU</span>
        {/* <ProfileSearchBox /> */}
      </div>
      <div className="flex justify-between items-center h-16 text-white gap-4">
        <div className="px-5 hidden md:flex">
          <ProfileSearchBox />
        </div>

        <div className="flex items-center h-full">
          {isSignedIn ? (
            <div className="flex h-full">
              <div
                className="flex items-center bg-green-400 text-black h-full px-4 cursor-pointer hover:bg-green-500 hover:text-white transition duration-300 group border-r-2 border-gray-300 md:text-base text-sm"
                onClick={() => {
                  Navigate("/add-new-profile");
                }}
              >
                Add New Profile
              </div>
              <div
                className="flex items-center bg-green-400 text-black h-full px-4 cursor-pointer hover:bg-green-500 hover:text-white transition duration-300 group border-r-2 border-gray-300 md:text-base text-sm"
                onClick={() => {
                  Navigate("/manage-profiles");
                }}
              >
                <span>Admin Dashboard</span>
              </div>
              <div
                className="flex items-center bg-red-600 text-black h-full px-4 cursor-pointer hover:bg-red-700 hover:text-white transition duration-300 group md:text-base text-sm"
                onClick={() => {
                  Navigate("/");
                  localStorage.removeItem("token");
                  setIsSignedIn(false);
                }}
              >
                <span>Logout</span>
                <IconLogout className="ml-1 transform transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          ) : (
            <div
              className="flex items-center bg-green-400 text-black h-full px-4 cursor-pointer hover:bg-green-500 hover:text-white transition duration-300 group"
              onClick={() => {
                Navigate("/signin");
              }}
            >
              <span>Sign In</span>
              <IconArrowRight className="ml-1 transform transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
