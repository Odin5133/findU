import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { setDefaults, geocode, RequestType } from "react-geocode";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function EditProfile({ googleAPIKey }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    photo: "",
    address: "",
    phoneNumber: "",
    email: "",
    owner: "",
  });
  const [lat, setLat] = useState(18.5204303);
  const [lng, setLng] = useState(73.8567437);
  const [center, setCenter] = useState({ lat: 18.5204303, lng: 73.8567437 });
  const [profilePic, setProfilePic] = useState(null);
  const [picChanged, setPicChanged] = useState(false);
  const profilePicRef = useRef(null);
  const [isNewAddressValid, setIsNewAddressValid] = useState(true);
  const [addressSearched, setAddressSearched] = useState(true); // New state variable
  const Navigate = useNavigate();
  const { id: userId } = useParams();

  setDefaults({
    key: googleAPIKey,
    language: "en",
    region: "es",
  });

  useEffect(() => {
    console.log(userId);
    axios
      .post(
        "http://localhost:3000/api/profiles/getProfileById",
        { id: userId },
        {
          headers: {
            // Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmFtZSI6ImFkbWluIiwiaWF0IjoxNzM3Mjk4ODI4LCJleHAiOjE3MzczMDI0Mjh9.rq0JjlYIzHDz_F3aOm8bXPucNeJ6ai0o71mfEX4F9vA`,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        const profile = res.data || {};

        // Safely set default values
        setFormData({
          name: profile.name ?? "",
          description: profile.description ?? "",
          photo: profile.photo ?? "",
          address: profile.address ?? "",
          phoneNumber: profile.phoneNumber ?? "",
          email: profile.email ?? "",
          owner: profile.owner ?? "",
        });

        // Safely set coordinates if they exist
        const lat = profile.coord?.lat ?? 0; // Default latitude if not provided
        const lng = profile.coord?.lng ?? 0; // Default longitude if not provided
        setLat(lat);
        setLng(lng);
        setCenter({ lat, lng });

        setProfilePic(profile.photo ? `../../Backend/${profile.photo}` : "");
      })
      .catch((err) => {
        console.error(err);
      });
  }, [userId]);

  useEffect(() => {
    setCenter({ lat, lng });
  }, [lat, lng]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "address") {
      setAddressSearched(false); // Reset addressSearched when address changes
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!addressSearched) {
      // alert("Please search for a valid address before submitting the form");
      toast.error(
        "Please search for a valid address before submitting the form"
      );
      return;
    }
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    if (picChanged) {
      const file = processImg(profilePic);
      data.append("photo", file);
    }
    data.append("coordinates", JSON.stringify({ lat, lng }));
    axios
      .put(`http://localhost:3000/api/profiles/${userId}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          // Authorization:
          //   "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmFtZSI6ImFkbWluIiwiaWF0IjoxNzM3Mjk4ODI4LCJleHAiOjE3MzczMDI0Mjh9.rq0JjlYIzHDz_F3aOm8bXPucNeJ6ai0o71mfEX4F9vA",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        toast.success("Profile Updated Successfully");
        Navigate("/manage-profiles");
      })
      .catch((err) => {
        toast.error("Error updating profile");
        console.log(err);
      });
  };

  const GeocodeandPlot = (e) => {
    e.preventDefault();
    geocode(RequestType.ADDRESS, formData.address)
      .then(({ results }) => {
        const { lat: la, lng: ln } = results[0].geometry.location;
        setLat(la);
        setLng(ln);
        setCenter({ lat: la, lng: ln });
        console.log(lat, ln);
        setIsNewAddressValid(true);
        setAddressSearched(true); // Set addressSearched to true after successful search
      })
      .catch((err) => {
        console.log(err);
        setIsNewAddressValid(false);
        toast.error("Invalid Address");
      });
  };

  const processImg = (image) => {
    const matches = image.match(/^data:(.*);base64,(.*)$/);
    if (!matches || matches.length !== 3) {
      console.error("Invalid base64 data URL");
      return;
    }
    const mimeType = matches[1];
    const base64Data = matches[2];

    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    let file = new File([blob], "uploaded_image.jpg", { type: mimeType });
    return file;
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "image/jpeg") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
      setPicChanged(true);
    } else {
      alert("Please select a JPEG image.");
    }
  };

  const handleButtonClick = () => {
    profilePicRef.current.click();
  };

  return (
    <div className="min-h-screen flex justify-center items-center  relative py-10">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 blur-3xl opacity-10 rounded-full"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 blur-3xl opacity-10 rounded-full"></div>

      <div className="bg-opacity-30 md:backdrop-filter md:backdrop-blur-lg md:border border-gray-200 md:border-opacity-30 rounded-lg md:shadow-lg w-full max-w-3xl p-8 text-white">
        <h2 className="text-3xl font-bold text-center mb-8">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between space-x-6">
            <div className="w-2/3 space-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium">Username:</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white bg-opacity-20 text-white rounded-md border border-gray-300 placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-opacity-40"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium">Email:</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white bg-opacity-20 text-white rounded-md border border-gray-300 placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-opacity-40"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium">Phone Number:</label>
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white bg-opacity-20 text-white rounded-md border border-gray-300 placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-opacity-40"
                />
              </div>
            </div>
            <div className="flex flex-col items-center justify-end space-y-4 w-1/3">
              <input
                type="file"
                ref={profilePicRef}
                style={{ display: "none" }}
                accept="image/jpeg"
                onChange={handleProfilePicChange}
              />

              {picChanged ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="mt-4 w-28 h-28 rounded-full border-4 border-blue-400 shadow-md"
                />
              ) : (
                <img
                  src={`../../Backend/${formData.photo}`}
                  alt="Profile"
                  className="mt-4 w-28 h-28 rounded-full border-4 border-blue-400 shadow-md"
                />
              )}
              <button
                type="button"
                onClick={handleButtonClick}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md hover:opacity-80 transition duration-300"
              >
                Upload Picture
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium">Address:</label>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white bg-opacity-20 text-white rounded-md border border-gray-300 placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-opacity-40"
                required
              />
              <button
                onClick={GeocodeandPlot}
                className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md hover:opacity-80 transition duration-300"
              >
                Search
              </button>
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
                  <Marker position={{ lat, lng }} />
                </Map>
              </APIProvider>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium">Description:</label>
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white bg-opacity-20 text-white rounded-md border border-gray-300 placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-opacity-40"
                required
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md hover:opacity-80 transition duration-300"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
