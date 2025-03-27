"use client"

import React from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import AccountKYC from "../../components/dashboard/AccountKYC";

const AccountPage = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Account Information</h1>
        
        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 border mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Full Name</h3>
              <p className="font-medium">John Doe</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Email</h3>
              <p className="font-medium">john.doe@example.com</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Phone</h3>
              <p className="font-medium">+1 (555) 123-4567</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Member Since</h3>
              <p className="font-medium">March 2023</p>
            </div>
          </div>
          
          <div className="mt-6">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Edit Profile
            </button>
          </div>
        </div>
        
        {/* KYC Verification Section */}
        <h2 className="text-xl font-bold mb-4">KYC Verification</h2>
        <AccountKYC />
      </div>
    </DashboardLayout>
  );
};

export default AccountPage; 