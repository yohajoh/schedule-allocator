import React from 'react';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <p className="text-lg text-gray-700">Welcome! You have successfully logged in to the Admin Dashboard.</p>
        <div className="mt-4">
          <h2 className="text-xl font-semibold text-gray-600">Dashboard Overview</h2>
          <p className="text-gray-500 mt-2">Manage your content, users, and settings from here.</p>
        </div>
      </div>
    </div>
  );
}