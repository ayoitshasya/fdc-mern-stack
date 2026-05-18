import React, { useEffect, useRef, useState } from "react";
import Header from "../Components/Header";
import axios from "axios";
import toast from "react-hot-toast";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:4000/auth/profile", {
          withCredentials: true,
        });
        setProfile(res.data);
        setPreviewUrl(res.data.profilePicture || null);
      } catch (err) {
        console.error("Error fetching profile:", err);
        toast.error("Failed to load profile.");
      }
    };
    fetchProfile();
  }, []);

  const formatDate = (d) => {
    if (!d) return "—";
    const date = new Date(d);
    return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files[0];
    if (!file) {
      toast.error("Please select an image first.");
      return;
    }
    setUploading(true);
    const form = new FormData();
    form.append("profilePicture", file);
    try {
      const res = await axios.put("http://localhost:4000/auth/profile/picture", form, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPreviewUrl(res.data.profilePicture);
      toast.success("Profile picture updated successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload profile picture.");
    } finally {
      setUploading(false);
    }
  };

  if (!profile) {
    return (
      <div className="w-full h-full flex flex-col">
        <Header />
        <div className="flex justify-center items-center h-full">
          <div className="h-8 w-8 border-4 border-[#B7202E] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const fields = [
    { label: "First Name", value: profile.fname },
    { label: "Last Name", value: profile.lname },
    { label: "Employee ID", value: profile.e_id },
    { label: "Email", value: profile.email },
    { label: "Department", value: profile.department },
    { label: "Designation", value: profile.designation },
    { label: "Date of Appointment", value: formatDate(profile.date_of_appointment) },
    { label: "Date of Appointment (Present Post)", value: formatDate(profile.present_appointment) },
    { label: "Role", value: profile.user_type?.replace(/-/g, " ") },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <Header />
      <div className="bg-[url(/campus.jpg)] bg-cover w-full flex-1 flex justify-center items-start p-8">
        <div className="bg-white bg-opacity-95 rounded-3xl shadow-md p-8 w-full max-w-2xl">
          <h1 className="text-2xl font-semibold text-[#B7202E] mb-6 text-center">My Profile</h1>

          {/* Profile picture section */}
          <div className="flex flex-col items-center mb-8 gap-3">
            <div className="relative">
              <img
                src={previewUrl || "/user.png"}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-[#B7202E] shadow"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-[#B7202E] text-white rounded-full w-8 h-8 flex items-center justify-center text-lg shadow cursor-pointer hover:bg-[#d23646]"
                title="Change photo"
              >
                +
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`flex items-center gap-2 bg-[#B7202E] text-white px-5 py-2 rounded-full text-sm font-medium cursor-pointer hover:bg-[#d23646] ${uploading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {uploading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              {uploading ? "Uploading..." : "Save Profile Picture"}
            </button>
          </div>

          {/* Profile fields */}
          <div className="divide-y divide-gray-100">
            {fields.map(({ label, value }) => (
              <div key={label} className="flex justify-between py-3 text-sm">
                <span className="text-[#777777] font-medium w-1/2">{label}</span>
                <span className="text-[#3D3D3D] font-semibold w-1/2 text-right">{value || "—"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
