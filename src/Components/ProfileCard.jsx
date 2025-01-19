import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProfileCard({ photo, name, description, onDelete, id }) {
  // useEffect(() => {
  //   console.log(photo);
  // });
  const Navigate = useNavigate();
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-sm mx-auto">
      <div className="bg-zinc-400 rounded-lg px-3 py-1 shadow-lg overflow-hidden flex items-center">
        <img
          className="w-20 h-20 object-cover rounded-full object-center"
          src={`../../Backend/${photo}`}
          alt="avatar"
        />
        <div className="p-4 w-full">
          {/* <h2 className="font-bold text-xl text-gray-800">{name}</h2> */}
          <h2 className="font-bold text-xl">
            {name > 20 ? `${name.substring(0, 20)}...` : name}
          </h2>

          <div>
            <hr className="my-2 w-full" />
            <p className="text-sm text-gray-800">
              {description.length > 25
                ? `${description.substring(0, 25)}...`
                : description}
            </p>
          </div>
        </div>
      </div>
      <div className="px-2 pt-3 pb-2 gap-2 flex flex-col">
        <button
          className="bg-[#25214e] text-white py-2 px-4 rounded-md hover:bg-[#1e1b3f] transition duration-300"
          onClick={() => {
            Navigate(`/edit-profile/${id}`);
          }}
        >
          Edit Profile
        </button>
        <button
          className="bg-red-700 text-white py-2 px-4 rounded-md hover:bg-red-800 transition duration-300"
          onClick={onDelete}
        >
          Delete Profile
        </button>
      </div>
    </div>
  );
}

export default ProfileCard;
