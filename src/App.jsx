import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./Login/SignIn";
import bg from "/background1.jpg";
import Navbar from "./Navbar";
import ManageProfiles from "./AdminDashboard/ManageProfiles";
import AddNewProfile from "./AdminDashboard/AddNewProfile";
import Home from "./Home/Home";
import EditProfile from "./AdminDashboard/EditProfile";
import UserInfo from "./Home/UserInfo";
import toast, { Toaster } from "react-hot-toast";

export default function App() {
  const googleAPIKey = ""; // Enter google API key here
  return (
    <Router>
      <div
        className="min-h-screen h-full"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <Navbar />
        <Routes>
          <Route path="/" element={<Home googleAPIKey={googleAPIKey} />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/manage-profiles" element={<ManageProfiles />} />
          <Route
            path="/add-new-profile"
            element={<AddNewProfile googleAPIKey={googleAPIKey} />}
          />
          <Route
            path="/edit-profile/:id"
            element={<EditProfile googleAPIKey={googleAPIKey} />}
          />
          <Route
            path="user-info/:id"
            element={<UserInfo googleAPIKey={googleAPIKey} />}
          />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}
