import React, { useState } from "react";
import axios from "axios";
import { auth } from "../firebase";

const SosForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    description: "",
    petType: "",
    image: null,
    address: "",
  });
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setFormData({ ...formData, address: "" }); // Clear address field when using geolocation
          console.log("✅ Location fetched:", position.coords);
        },
        (err) => {
          setError(
            "Failed to get location. Please allow location access or enter an address."
          );
          console.error("❌ Geolocation error:", err);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      setError("Please sign in to submit an SOS report.");
      return;
    }
    if (!formData.address && (!location.latitude || !location.longitude)) {
      setError("Please provide an address or enable location access.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("userId", auth.currentUser.uid);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("petType", formData.petType);
    if (formData.address) formDataToSend.append("address", formData.address);
    if (location.latitude && location.longitude) {
      formDataToSend.append("latitude", location.latitude);
      formDataToSend.append("longitude", location.longitude);
    }
    if (formData.image) formDataToSend.append("image", formData.image);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/report",
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("✅ SOS report submitted:", response.data);
      alert(
        `SOS report submitted successfully! Address: ${response.data.address}`
      );
      setFormData({ description: "", petType: "", image: null, address: "" });
      setLocation({ latitude: null, longitude: null });
      onClose();
    } catch (error) {
      console.error("❌ Error submitting SOS report:", error.message);
      setError("Failed to submit SOS report. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-none flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Report an Animal
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Pet Type</label>
            <input
              type="text"
              name="petType"
              value={formData.petType}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500 bg-white/50"
              placeholder="e.g., Dog, Cat"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500 bg-white/50"
              placeholder="Describe the situation (e.g., injured, lost)"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              Address ( Select Get Location or Enter Manually )
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500 bg-white/50"
              placeholder="e.g., 123 Main St, City, Country"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              Image (Optional)
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded bg-white/50"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={getLocation}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Get Location
            </button>
            <div>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Submit SOS
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SosForm;
