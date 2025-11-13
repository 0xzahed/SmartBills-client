import { useContext, useState } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import { updateProfile } from "firebase/auth";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiCamera, FiEdit2, FiSave, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    photoURL: user?.photoURL || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      toast.loading("Updating profile...", { id: "update-profile" });

      await updateProfile(user, {
        displayName: formData.displayName,
        photoURL: formData.photoURL,
      });

      setUser({
        ...user,
        displayName: formData.displayName,
        photoURL: formData.photoURL,
      });

      setIsEditing(false);
      toast.success("Profile updated successfully!", { id: "update-profile" });

      Swal.fire({
        title: "Success!",
        text: "Your profile has been updated successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile. Please try again.", {
        id: "update-profile",
      });

      Swal.fire({
        title: "Error!",
        text: "Failed to update profile. Please try again.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: user?.displayName || "",
      photoURL: user?.photoURL || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#F9F5F3] py-6 sm:py-8 md:py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
                My Profile
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Manage your account information
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base w-full sm:w-auto"
                >
                  <FiEdit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  Edit
                </button>
              ) : (
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCancel}
                    className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm sm:text-base w-full sm:w-auto"
                  >
                    <FiX className="w-3 h-3 sm:w-4 sm:h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={
                    formData.photoURL ||
                    user?.photoURL ||
                    "https://i.postimg.cc/5y8zTvMg/default-avatar.png"
                  }
                  alt="Profile"
                  className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-[#E5CBB8] object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://i.postimg.cc/5y8zTvMg/default-avatar.png";
                  }}
                />
                <div className="absolute bottom-0 right-0 bg-[#E5CBB8] p-1.5 sm:p-2 rounded-full">
                  <FiCamera className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mt-3 sm:mt-4">
                {user?.displayName || "User"}
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                {user?.email}
              </p>
            </div>

            <div className="flex-1">
              <form
                onSubmit={handleUpdateProfile}
                className="space-y-4 sm:space-y-6"
              >
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    <FiUser className="inline w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E5CBB8] focus:border-transparent text-sm sm:text-base"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="w-full p-2 sm:p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 text-sm sm:text-base">
                      {user?.displayName || "Not set"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    <FiMail className="inline w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Email Address
                  </label>
                  <div className="w-full p-2 sm:p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-sm sm:text-base">
                    {user?.email}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    <FiCamera className="inline w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Profile Photo URL
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      name="photoURL"
                      value={formData.photoURL}
                      onChange={handleInputChange}
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E5CBB8] focus:border-transparent text-sm sm:text-base"
                      placeholder="Enter photo URL"
                    />
                  ) : (
                    <div className="w-full p-2 sm:p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 break-all text-sm sm:text-base">
                      {user?.photoURL || "No photo URL set"}
                    </div>
                  )}
                </div>

                {isEditing && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-[#E5CBB8] text-black rounded-lg hover:bg-[#d4b8a3] transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
                  >
                    <FiSave className="w-3 h-3 sm:w-4 sm:h-4" />
                    {loading ? "Updating..." : "Save Changes"}
                  </button>
                )}
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
