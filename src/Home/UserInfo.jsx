import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

function UserInfo({ googleAPIKey }) {
  const { id } = useParams();
  const [userData, setUserData] = useState({
    name: "Loading...",
    description: "Loading...",
    photo: "",
    address: "Loading...",
    phoneNumber: "Loading...",
    email: "Loading...",
    coord: { lat: 0, lng: 0 },
  });
  const [center, setCenter] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/profiles/getProfileById",
          { id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const profile = response.data;
        console.log(profile);
        setUserData({
          name: profile.name || "info unavailable",
          description: profile.description || "info unavailable",
          photo: profile.photo || "info unavailable",
          address: profile.address || "info unavailable",
          phoneNumber: profile.phoneNumber || "info unavailable",
          email: profile.email || "info unavailable",
          coord: profile.coord || { lat: 0, lng: 0 },
        });
        setCenter(profile.coord || { lat: 0, lng: 0 });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  return (
    <div className="min-h-screen flex justify-center items-center relative py-10">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 blur-3xl opacity-10 rounded-full"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 blur-3xl opacity-10 rounded-full"></div>

      <div className="bg-opacity-30 backdrop-filter backdrop-blur-lg border border-gray-200 border-opacity-30 rounded-lg shadow-lg w-full max-w-3xl p-8 text-white">
        <h2 className="text-3xl font-bold text-center mb-8">User Info</h2>
        <div className="space-y-6">
          <div className="flex justify-between space-x-6">
            <div className="w-2/3 space-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium">Username:</label>
                <p className="w-full px-4 py-2 bg-white bg-opacity-20 text-white rounded-md border border-gray-300">
                  {userData.name}
                </p>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium">Email:</label>
                <p className="w-full px-4 py-2 bg-white bg-opacity-20 text-white rounded-md border border-gray-300">
                  {userData.email}
                </p>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium">Phone Number:</label>
                <p className="w-full px-4 py-2 bg-white bg-opacity-20 text-white rounded-md border border-gray-300">
                  {userData.phoneNumber}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center space-y-4 w-1/3">
              {userData.photo && (
                <img
                  src={`../../Backend/${userData.photo}`}
                  alt="Profile"
                  className="mt-4 w-32 h-32 rounded-full border-4 border-blue-400 shadow-md"
                />
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium">Address:</label>
              <p className="w-full px-4 py-2 bg-white bg-opacity-20 text-white rounded-md border border-gray-300">
                {userData.address}
              </p>
            </div>

            <div>
              <APIProvider apiKey={googleAPIKey}>
                <Map
                  style={{ width: "100%", height: "300px" }}
                  center={center}
                  defaultZoom={10}
                  gestureHandling={"greedy"}
                  disableDefaultUI={true}
                >
                  <Marker position={userData.coord} />
                </Map>
              </APIProvider>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium">Description:</label>
              <p className="w-full px-4 py-2 bg-white bg-opacity-20 text-white rounded-md border border-gray-300">
                {userData.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
