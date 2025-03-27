import React from "react";
import Link from "next/link";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/dashboard/account" className="block">
            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition">
              <h2 className="text-lg font-semibold mb-2">Account Info</h2>
              <p className="text-gray-600">Manage your profile and KYC verification</p>
            </div>
          </Link>
          
          {/* Add other dashboard cards */}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard; 