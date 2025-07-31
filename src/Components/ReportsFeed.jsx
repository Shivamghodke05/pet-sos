import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../firebase";

const ReportsFeed = () => {
  const [reports, setReports] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        name: currentUser.displayName,
        email: currentUser.email,
        photo: currentUser.photoURL,
        uid: currentUser.uid,
      });
    }

    const fetchReports = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/reports");
        setReports(response.data);
        console.log("✅ Reports fetched:", response.data);
      } catch (err) {
        console.error("❌ Error fetching reports:", err.message);
        setError("Failed to load reports. Please try again.");
      }
    };

    fetchReports();
  }, []);

  const handleDelete = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/report/${reportId}`, {
        params: { email: user?.email }, // Add email as query parameter
      });
      setReports(reports.filter((report) => report.id !== reportId));
      console.log("✅ Report deleted:", reportId);
    } catch (err) {
      console.error("❌ Error deleting report:", err.message);
      setError("Failed to delete report. Please try again.");
    }
  };

  return (
    <section className="py-10 bg-gray-100">
      <div className="container mx-auto px-4" id="reports">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Recent SOS Reports
        </h2>
        {user ? (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-md flex items-center">
            <img
              src={user.photo || "https://via.placeholder.com/50"}
              alt="User Profile"
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h3 className="text-xl font-medium text-gray-800">
                Welcome, {user.name || "User"}
              </h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 mb-8 text-center">
            Please sign in to view your profile.
          </p>
        )}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-lg shadow-md overflow-hidden relative"
              >
                {report.image_url && (
                  <img
                    src={report.image_url}
                    alt="Pet"
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <img
                      src={
                        report.user_photo || "https://via.placeholder.com/40"
                      }
                      alt="User"
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <p className="font-medium text-gray-800">
                      {report.user_name || "Anonymous"}
                    </p>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    {report.pet_type}
                  </h3>
                  <p className="text-gray-600 mb-2">{report.description}</p>
                  <p className="text-gray-500 text-sm mb-2">
                    Location:{" "}
                    {report.address ||
                      `${report.latitude}, ${report.longitude}`}
                  </p>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        report.address ||
                          `${report.latitude}, ${report.longitude}`
                      )
                    }
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Copy Address
                  </button>
                  <p className="text-gray-500 text-sm mt-2">
                    Posted: {new Date(report.created_at).toLocaleString()}
                  </p>
                </div>
                {user?.email === "shivamghodke05@gmail.com" && (
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    title="Delete Report"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center col-span-full">
              No reports found.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReportsFeed;
