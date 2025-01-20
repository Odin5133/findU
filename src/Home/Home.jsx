import React, { useState, useEffect } from "react";
import axios from "axios";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
// import ProfileCard from "./Components/ProfileCard";
import { IconMapPin, IconX, IconUserScan } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

function Home({ googleAPIKey }) {
  const [profiles, setProfiles] = useState([]);
  const [oneProfileSelected, setOneProfileSelected] = useState(-1);
  const [profilePositions, setProfilePositions] = useState([]);
  const [selectedProfileAddress, setSelectedProfileAddress] = useState("");
  const [closedialogue, setCloseDialogue] = useState(false);
  const Navigate = useNavigate();
  const center = { lat: 18.5204303, lng: 73.8567437 };

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/profiles")
      .then((res) => {
        console.log(res.data);
        setProfiles(res.data);
        const positions = res.data.map((dat) => ({
          lat: dat.coord.lat,
          lng: dat.coord.lng,
        }));
        setProfilePositions(positions);
        console.log(profilePositions);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleProfileSelect = (index) => {
    console.log(index, oneProfileSelected);
    if (oneProfileSelected !== index) {
      setOneProfileSelected(index);
      setSelectedProfileAddress(profiles[index].address);
    } else {
      setOneProfileSelected(-1);
      setSelectedProfileAddress("");
      setCloseDialogue(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-[92.5vh] overflow-hidden">
      {/* Sidebar */}
      <div className="md:w-1/4 md:min-w-96 w-full  h-[50vh] md:h-[93vh] bg-gray-900">
        <h1 className="text-2xl md:text-4xl text-white text-center py-4">
          Profiles
        </h1>
        <div className="md:pb-4 h-[90%] overflow-y-auto px-4">
          {profiles.length > 0 ? (
            profiles.map((prof, i) => (
              <div className="flex items-center border-b border-gray-700 shadow-lg bg-gray-800 bg-opacity-80 backdrop-blur-md text-white px-4 py-3 mb-3 rounded-lg">
                <img
                  className="w-16 h-16 md:w-20 md:h-20 object-cover object-center rounded-full"
                  src={`../../Backend/${prof.photo}`}
                  alt="profile"
                />
                <div className="p-4 w-full">
                  <div className="flex justify-between items-center pb-2">
                    <h2 className="font-bold text-sm md:text-xl">
                      {prof.name.length > 15
                        ? `${prof.name.substring(0, 15)}...`
                        : prof.name}
                    </h2>
                    <div
                      className={`border-2 border-gray-500 rounded-full p-1 cursor-pointer ${
                        oneProfileSelected === i && "bg-green-400"
                      }`}
                      onClick={() => handleProfileSelect(i)}
                    >
                      <IconMapPin
                        stroke={1}
                        color={oneProfileSelected === i ? "black" : undefined}
                      />
                    </div>
                  </div>
                  <hr className="w-full border-gray-500" />
                  <div className="flex justify-between items-center pt-2">
                    <p className="text-xs md:text-sm text-gray-300 truncate">
                      {prof.description.length > 25
                        ? `${prof.description.substring(0, 25)}...`
                        : prof.description}
                    </p>
                    <div
                      className="flex-shrink-0 border-2 border-gray-500 rounded-full p-1 cursor-pointer z-10 ml-2"
                      onClick={() => Navigate(`/user-info/${prof._id}`)}
                    >
                      <IconUserScan stroke={1} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-white mt-10">
              <p>No profiles found. Maybe add some profiles...</p>
            </div>
          )}
        </div>
      </div>

      <div className="md:w-3/4 w-full h-[50vh] md:h-full sticky top-0">
        <div className="relative w-full h-full">
          <APIProvider apiKey={googleAPIKey}>
            <Map
              className="w-full h-full"
              defaultCenter={center}
              defaultZoom={3}
              gestureHandling={"greedy"}
              disableDefaultUI={true}
            >
              {oneProfileSelected !== -1 ? (
                <Marker
                  position={{
                    lat: profiles[oneProfileSelected].coord.lat,
                    lng: profiles[oneProfileSelected].coord.lng,
                  }}
                  onClick={() => handleProfileSelect(oneProfileSelected)}
                />
              ) : (
                profilePositions.map((pos, index) => (
                  <Marker
                    key={index}
                    position={pos}
                    onClick={() => handleProfileSelect(index)}
                  />
                ))
              )}
            </Map>
            {oneProfileSelected !== -1 && !closedialogue && (
              <div className="absolute bottom-[5rem] left-1/2 transform -translate-x-1/2 p-4 z-10 rounded-lg shadow-xl bg-gray-900 bg-opacity-80 backdrop-blur-lg text-white duration-500 w-11/12 md:w-2/3 flex justify-between items-center">
                <p className="truncate">{selectedProfileAddress}</p>
                <div
                  className="border-2 border-gray-500 rounded-lg p-1 cursor-pointer"
                  onClick={() => setCloseDialogue(true)}
                >
                  <IconX />
                </div>
              </div>
            )}
          </APIProvider>
        </div>
      </div>
    </div>
  );
}

export default Home;
