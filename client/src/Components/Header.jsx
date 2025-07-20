import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";

function Header() {
  const {setUser, setLoggedIn, setLoading} = useUser();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState({ fname: "", lname: "", profilePicture: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:4000/auth/profile", {
          withCredentials: true,
        });
        const { fname, lname, profilePicture } = res.data;
        setProfileUser({ fname, lname, profilePicture });
      } catch (err) {
        console.error("Error fetching profile", err);
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:4000/auth/logout", {}, { withCredentials: true });
      setUser();
      setLoading(false);
      setLoggedIn(false);
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="w-full bg-white py-2 px-8 flex justify-between items-center sticky z-10 top-0">
      <div className="h-full flex items-center gap-8">
        <img src="/mini-logo.png" className="h-14" />
        <h1 className="font-inter font-light text-lg">
          Welcome, {profileUser.fname} {profileUser.lname}
        </h1>
      </div>
      <div className="h-full flex items-center gap-4">
        <button className="flex items-center gap-2 border rounded-4xl p-2 border-[#6F6F6F] cursor-pointer">
          <img src={profileUser.profilePicture || "/user.png"} className="h-6 w-6 rounded-full object-cover" />
          <span className="text-[1rem] font-light font-inter mr-1">
            Profile
          </span>
        </button>
        <button
          onClick={handleLogout}
          className="border rounded-full p-3 border-[#6F6F6F] cursor-pointer"
        >
          <img src="/logout.png" className="h-4" />
        </button>
      </div>
    </div>
  );
}

export default Header;
