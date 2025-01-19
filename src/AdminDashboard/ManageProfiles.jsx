import axios from "axios";
import React, { useState, useEffect } from "react";
import ProfileCard from "../Components/ProfileCard";
import ConfirmationDialog from "../Components/ConfirmationDialog";

function ManageProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/profiles")
      .then((res) => {
        console.log(res.data);
        setProfiles(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDeleteClick = (profile) => {
    setProfileToDelete(profile);
    setIsDialogOpen(true);
  };

  const confirmDelete = () => {
    axios
      .delete(`http://localhost:3000/api/profiles/${profileToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          // Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmFtZSI6ImFkbWluIiwiaWF0IjoxNzM3MjgzODU1LCJleHAiOjE3MzcyODc0NTV9.lzEnF5io04K_jYxBtjMM4-h_dfeXffQJwAmlBoinMGI`,
        },
      })
      .then(() => {
        setProfiles(
          profiles.filter((prof) => prof._id !== profileToDelete._id)
        );
        setIsDialogOpen(false);
        setProfileToDelete(null);
        console.log("Profile deleted");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const cancelDelete = () => {
    setIsDialogOpen(false);
    setProfileToDelete(null);
  };

  return (
    <div className="container mx-auto px-4">
      <div>
        <h1 className="text-2xl md:text-4xl text-white text-center py-10 md:py-20">
          Manage Profiles
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-16">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile._id}
            id={profile._id}
            photo={profile.photo}
            name={profile.name}
            description={profile.description}
            onDelete={() => handleDeleteClick(profile)}
          />
        ))}
        <ConfirmationDialog
          isOpen={isDialogOpen}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      </div>
    </div>
  );
}

export default ManageProfiles;
