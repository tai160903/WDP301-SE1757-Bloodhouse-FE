import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faEdit,
  faTrash,
  faPlus,
  faDroplet,
  faWarning,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

function BloodGroup() {
  // Mock data - replace with actual data fetching
  const [bloodGroups, setBloodGroups] = useState([
    {
      id: 1,
      type: "A+",
      inventory: 450,
      donorsCount: 1254,
      lastUpdated: "2023-06-15",
      status: "Adequate",
    },
    {
      id: 2,
      type: "A-",
      inventory: 120,
      donorsCount: 382,
      lastUpdated: "2023-06-14",
      status: "Low",
    },
    {
      id: 3,
      type: "B+",
      inventory: 320,
      donorsCount: 978,
      lastUpdated: "2023-06-15",
      status: "Adequate",
    },
    {
      id: 4,
      type: "B-",
      inventory: 85,
      donorsCount: 214,
      lastUpdated: "2023-06-13",
      status: "Low",
    },
    {
      id: 5,
      type: "AB+",
      inventory: 110,
      donorsCount: 367,
      lastUpdated: "2023-06-15",
      status: "Adequate",
    },
    {
      id: 6,
      type: "AB-",
      inventory: 45,
      donorsCount: 126,
      lastUpdated: "2023-06-12",
      status: "Critical",
    },
    {
      id: 7,
      type: "O+",
      inventory: 480,
      donorsCount: 1567,
      lastUpdated: "2023-06-15",
      status: "Adequate",
    },
    {
      id: 8,
      type: "O-",
      inventory: 65,
      donorsCount: 198,
      lastUpdated: "2023-06-14",
      status: "Critical",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredBloodGroups = bloodGroups.filter(
    (group) =>
      group.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blood Group Management</h1>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center">
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Update Inventory
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Total Inventory</p>
              <p className="text-2xl font-bold">1,675 units</p>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <FontAwesomeIcon
                icon={faDroplet}
                className="text-green-500 text-xl"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Registered Donors</p>
              <p className="text-2xl font-bold">5,086</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <FontAwesomeIcon
                icon={faInfoCircle}
                className="text-blue-500 text-xl"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Low Supply</p>
              <p className="text-2xl font-bold">2 types</p>
            </div>
            <div className="bg-yellow-100 p-2 rounded-full">
              <FontAwesomeIcon
                icon={faWarning}
                className="text-yellow-500 text-xl"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Critical Supply</p>
              <p className="text-2xl font-bold">2 types</p>
            </div>
            <div className="bg-red-100 p-2 rounded-full">
              <FontAwesomeIcon
                icon={faWarning}
                className="text-red-500 text-xl"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search blood groups by type or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Blood Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Current Inventory
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Registered Donors
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Last Updated
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBloodGroups.map((group) => (
                <tr key={group.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-red-600 font-bold">
                          {group.type}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          Type {group.type}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {group.inventory} units
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {group.donorsCount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {group.lastUpdated}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        group.status === "Adequate"
                          ? "bg-green-100 text-green-800"
                          : group.status === "Low"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {group.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBloodGroups.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No blood groups found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}

export default BloodGroup;
