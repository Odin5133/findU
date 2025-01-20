import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  IconCircleCheckFilled,
  IconExclamationCircleFilled,
  IconSquareRoundedXFilled,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { nav } from "framer-motion/client";

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const Navigate = useNavigate();
  //   const [signOps, setSignOps] = useState(1); // Added definition
  //   const [forgotPassword, setForgotPassword] = useState(false); // Added definition
  //   const Navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    console.log(`Bearer ${Cookies.get("accessToken")}`);
    if (Cookies.get("accessToken") !== undefined) {
      fetch("http://127.0.0.1:8000/api/user/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          //   Navigate("/feed");
          return response.json();
        })
        .then((data) => console.log(data))
        .catch((error) =>
          console.error(
            "There has been a problem with your fetch operation:",
            error
          )
        );
    }
  }, []);

  const handleSignIn = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/api/admin/login", {
        uname: username,
        pword: password,
      })
      .then((res) => {
        console.log(res.data.token);
        if (res.data.hasOwnProperty("token")) {
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${res.data["token"]}`;
          localStorage.setItem("token", res.data["token"]);
          // console.log("res.token:", res.token);
          toast.success("Login Successful");
          Navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Invalid Credentials");
      });
    // fetch("http://127.0.0.1:8000/api/login/", {
    //   method: "POST",
    //   credentials: "include", // Necessary for cookies to be sent with requests
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     email: username,
    //     password: password,
    //   }),
    // })
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error("Network response was not ok");
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //     if (data.hasOwnProperty("token")) {
    //       axios.defaults.headers.common[
    //         "Authorization"
    //       ] = `Bearer ${data["token"]}`;
    //       //   Navigate("/feed");
    //     } else {
    //       setInvalidCredentials(true);
    //       setUsername("");
    //       setPassword("");
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("Login error:", error);
    //   });
    // createAccessToken();
  };

  return (
    <div>
      <div className="flex justify-center items-center h-screen">
        <div className=" md:shadow-2xl md:bg-gray-700 bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-xl text-white min-w-96 px-4 flex flex-col justify-center">
          {/* <motion.div> */}
          <div>
            <div className="text-5xl text-center font-bold mt-10">
              Admin Sign In
            </div>
          </div>
          <div className="mt-10 text-text">
            <form onSubmit={handleSignIn}>
              <div className="">Username</div>
              <div className="flex mt-2 items-center w-full">
                <input
                  type="text"
                  className="rounded-md px-2 py-1 w-full bg-background border-2 border-primary text-black focus:outline-none focus:border-accent"
                  placeholder="admin"
                  value={username}
                  onChange={handleUsernameChange}
                  required
                />
                {invalidCredentials && (
                  <IconSquareRoundedXFilled
                    height={40}
                    className="mx-2 m-0 text-[#ff2d2d]"
                  />
                )}
              </div>
              <div className="mt-8">Password</div>
              <div className="flex mt-2 items-center w-full">
                <input
                  type="password"
                  className="rounded-md px-2 py-1 w-full bg-background border-2 border-primary text-black focus:outline-none focus:border-accent"
                  placeholder="admin"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                {invalidCredentials && (
                  <IconSquareRoundedXFilled
                    height={40}
                    className="mx-2 m-0 text-[#ff2d2d]"
                  />
                )}
              </div>
              <div className="mt-12 w-full flex justify-center items-center">
                <motion.button
                  className="rounded-lg bg-purple-600 px-4 py-1 text-xl border-2 text-text hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent duration-500 ease-in-out"
                  type="submit"
                >
                  Sign In
                </motion.button>
              </div>
              <br />
            </form>
          </div>
          {/* </motion.div> */}
        </div>
      </div>
      {/* <Toaster /> */}
    </div>
  );
}

export default SignIn;
