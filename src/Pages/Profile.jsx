import { useContext, useState } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import { updateProfile } from "firebase/auth";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiCamera,
  FiEdit2,
  FiSave,
  FiX,
  FiUpload,
} from "react-icons/fi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
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
      });

      setUser({
        ...user,
        displayName: formData.displayName,
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

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "smartbills_profile");
    formData.append("cloud_name", "dvujgthwe");

    try {
      toast.loading("Uploading photo...", { id: "upload-photo" });

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dvujgthwe/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        await updateProfile(user, {
          photoURL: data.secure_url,
        });

        setUser({
          ...user,
          photoURL: data.secure_url,
        });

        setShowPhotoModal(false);
        toast.success("Photo updated successfully!", { id: "upload-photo" });
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Photo upload error:", error);
      toast.error("Failed to upload photo", { id: "upload-photo" });
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: user?.displayName || "",
    });
    setIsEditing(false);
  };

  return (
    <div
      className="min-h-screen py-6 sm:py-8 md:py-10 px-4 sm:px-6"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8"
          style={{ backgroundColor: "var(--card-bg)" }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
            <div>
              <h1
                className="text-2xl sm:text-3xl md:text-4xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                My Profile
              </h1>
              <p
                className="text-sm sm:text-base mt-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Manage your account information
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-emerald-500 text-black rounded-lg hover:bg-emerald-400 transition text-sm sm:text-base w-full sm:w-auto font-semibold"
                >
                  <FiEdit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCancel}
                    className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition text-sm sm:text-base w-full sm:w-auto border"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      color: "var(--text-primary)",
                      borderColor: "rgba(255,255,255,0.1)",
                    }}
                  >
                    <FiX className="w-3 h-3 sm:w-4 sm:h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
            <div className="flex flex-col items-center md:w-1/3">
              <div
                className="relative group cursor-pointer"
                onClick={() => setShowPhotoModal(true)}
              >
                <img
                  src={
                    user?.photoURL ||
                    "https://i.postimg.cc/5y8zTvMg/default-avatar.png"
                  }
                  alt="Profile"
                  className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full border-4 border-emerald-500 object-cover transition-all group-hover:brightness-75"
                  onError={(e) => {
                    e.target.src =
                      "https://i.postimg.cc/5y8zTvMg/default-avatar.png";
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-emerald-500 p-3 rounded-full">
                    <FiCamera className="w-6 h-6 text-black" />
                  </div>
                </div>
              </div>
              <h3
                className="text-lg sm:text-xl md:text-2xl font-semibold mt-4"
                style={{ color: "var(--text-primary)" }}
              >
                {user?.displayName || "User"}
              </h3>
              <p
                className="text-sm sm:text-base"
                style={{ color: "var(--text-secondary)" }}
              >
                {user?.email}
              </p>
              <button
                onClick={() => setShowPhotoModal(true)}
                className="mt-4 text-sm text-emerald-500 hover:text-emerald-400 flex items-center gap-1"
              >
                <FiCamera className="w-4 h-4" />
                Change Photo
              </button>
            </div>

            <div className="flex-1 md:w-2/3">
              <form
                onSubmit={handleUpdateProfile}
                className="space-y-4 sm:space-y-6"
              >
                <div>
                  <label
                    className="block text-xs sm:text-sm font-medium mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <FiUser className="inline w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      className="w-full p-2 sm:p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.05)",
                        borderColor: "rgba(255,255,255,0.1)",
                        color: "var(--text-primary)",
                      }}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div
                      className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        borderColor: "rgba(255,255,255,0.1)",
                        color: "var(--text-primary)",
                      }}
                    >
                      {user?.displayName || "Not set"}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    className="block text-xs sm:text-sm font-medium mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <FiMail className="inline w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Email Address
                  </label>
                  <div
                    className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      borderColor: "rgba(255,255,255,0.1)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {user?.email}
                  </div>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Email cannot be changed
                  </p>
                </div>

                {isEditing && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-emerald-500 text-black rounded-lg hover:bg-emerald-400 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm sm:text-base"
                  >
                    <FiSave className="w-3 h-3 sm:w-4 sm:h-4" />
                    {loading ? "Updating..." : "Save Changes"}
                  </button>
                )}
              </form>
            </div>
          </div>
        </motion.div>

        {/* Photo Upload Modal */}
        {showPhotoModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl shadow-2xl p-6 max-w-md w-full"
              style={{ backgroundColor: "var(--card-bg)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-xl font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Update Profile Photo
                </h3>
                <button
                  onClick={() => setShowPhotoModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-700/50 transition"
                >
                  <FiX
                    className="w-5 h-5"
                    style={{ color: "var(--text-primary)" }}
                  />
                </button>
              </div>

              <div className="mb-6">
                <img
                  src={
                    user?.photoURL ||
                    "https://i.postimg.cc/5y8zTvMg/default-avatar.png"
                  }
                  alt="Current"
                  className="w-32 h-32 rounded-full mx-auto border-4 border-emerald-500 object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://i.postimg.cc/5y8zTvMg/default-avatar.png";
                  }}
                />
              </div>

              <div className="space-y-4">
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center"
                  style={{ borderColor: "rgba(255,255,255,0.2)" }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="photo-upload"
                    className={`cursor-pointer ${
                      uploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-emerald-500/10 rounded-full">
                        <FiUpload className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div>
                        <p
                          className="font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {uploading ? "Uploading..." : "Click to upload"}
                        </p>
                        <p
                          className="text-sm mt-1"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          PNG, JPG, JPEG (Max 5MB)
                        </p>
                      </div>
                    </div>
                  </label>
                </div>

                <button
                  onClick={() => setShowPhotoModal(false)}
                  className="w-full px-4 py-3 rounded-lg border transition"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    borderColor: "rgba(255,255,255,0.1)",
                    color: "var(--text-primary)",
                  }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
