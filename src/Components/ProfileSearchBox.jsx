import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { IconInputSearch, IconX } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import axios from "axios";

function ProfileSearchBox() {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [friendName, setFriendName] = useState("");
  const [friendObj, setFriendObj] = useState([]);
  const dropdownRef = useRef(null);

  // Hide dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setFriendObj([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFriendSearch = (e) => {
    setFriendName(e.target.value);
    if (e.target.value.length >= 3) {
      axios
        .post(
          "http://localhost:3000/api/profiles/search",
          {
            userField: e.target.value,
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          setFriendObj(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setFriendObj([]);
    }
  };

  return (
    <div className="relative flex items-center">
      <motion.span
        initial={{ x: 0 }}
        animate={isSearchVisible ? { x: -10 } : { x: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="z-20"
      >
        <IconInputSearch
          className="cursor-pointer"
          onClick={() => {
            setIsSearchVisible(!isSearchVisible);
            setFriendName("");
          }}
        />
      </motion.span>

      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={
          isSearchVisible
            ? { width: "auto", opacity: 1 }
            : { width: 0, opacity: 0 }
        }
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`relative`}
      >
        <input
          type="text"
          placeholder="Profile Name/Location"
          value={friendName}
          onChange={handleFriendSearch}
          className="w-full rounded-lg px-4 pr-12 bg-pseudobackground2 text-black placeholder-[#b9b9b9] py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-blue-500 transition duration-200 ease-in-out"
        />

        <span
          onClick={() => {
            setFriendName("");
            setFriendObj([]);
          }}
        >
          <IconX className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pseudobackground2 px-2 py-1 text-text cursor-pointer w-7" />
        </span>

        {friendName.length >= 3 && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 right-0 mt-2  border border-[#9e9e9e] rounded-lg  z-10 overflow-hidden shadow-text shadow-xl bg-gray-900 bg-opacity-80 backdrop-blur-lg text-white "
          >
            {friendObj.map((friend, index) => (
              <Link
                to={`/user-info/${friend._id}`}
                key={index}
                className="block px-4 py-2 hover:bg-gray-800 bg-background cursor-pointer transition duration-200 ease-in-out "
                onClick={() => {
                  setFriendName("");
                  setFriendObj([]);
                }}
              >
                {`${friend.name.charAt(0).toUpperCase()}${friend.name.slice(
                  1
                )}`}
              </Link>
            ))}
            {friendObj.length === 0 && (
              <div
                className="block px-4 py-2 hover:bg-pseudobackground bg-background cursor-pointer transition duration-200 ease-in-out"
                onClick={() => setFriendName("")}
              >
                No profiles found
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default ProfileSearchBox;
