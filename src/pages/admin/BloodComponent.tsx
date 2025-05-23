import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faEdit,
  faTrash,
  faPlus,
  faDroplet,
  faFlask,
  faWarning,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";

function BloodComponent() {
  // Mock data - replace with actual data fetching
  const [components, setComponents] = useState([
    {
      id: 1,
      name: "Red Blood Cells",
      source: "Whole Blood",
      inventory: 320,
      lastUpdated: "2023-06-15",
      expiryPeriod: "42 days",
      storageTemp: "1-6°C",
      status: "Adequate",
    },
    {
      id: 2,
      name: "Platelets",
      source: "Whole Blood",
      inventory: 75,
      lastUpdated: "2023-06-14",
      expiryPeriod: "5 days",
      storageTemp: "20-24°C",
      status: "Low",
    },
    {
      id: 3,
      name: "Plasma",
      source: "Whole Blood",
      inventory: 240,
      lastUpdated: "2023-06-15",
      expiryPeriod: "1 year (frozen)",
      storageTemp: "Below -18°C",
      status: "Adequate",
    },
    {
      id: 4,
      name: "Cryoprecipitate",
      source: "Plasma",
      inventory: 65,
      lastUpdated: "2023-06-13",
      expiryPeriod: "1 year (frozen)",
      storageTemp: "Below -18°C",
      status: "Low",
    },
    {
      id: 5,
      name: "Granulocytes",
      source: "Whole Blood",
      inventory: 30,
      lastUpdated: "2023-06-15",
      expiryPeriod: "24 hours",
      storageTemp: "20-24°C",
      status: "Critical",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredComponents = components.filter(
    (component) =>
      component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total inventory
  const totalInventory = components.reduce(
    (sum, component) => sum + component.inventory,
    0
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blood Component Management</h1>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center">
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Update Inventory
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Total Inventory</p>
              <p className="text-2xl font-bold">{totalInventory} units</p>
            </div>
            <div className="bg-red-100 p-2 rounded-full">
              <FontAwesomeIcon
                icon={faDroplet}
                className="text-red-500 text-xl"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Component Types</p>
              <p className="text-2xl font-bold">{components.length}</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-full">
              <FontAwesomeIcon
                icon={faFlask}
                className="text-purple-500 text-xl"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Low Supply</p>
              <p className="text-2xl font-bold">
                {components.filter((c) => c.status === "Low").length} types
              </p>
            </div>
            <div className="bg-yellow-100 p-2 rounded-full">
              <FontAwesomeIcon
                icon={faWarning}
                className="text-yellow-500 text-xl"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Critical Supply</p>
              <p className="text-2xl font-bold">
                {components.filter((c) => c.status === "Critical").length} types
              </p>
            </div>
            <div className="bg-orange-100 p-2 rounded-full">
              <FontAwesomeIcon
                icon={faWarning}
                className="text-orange-500 text-xl"
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
            placeholder="Search components by name, source or status..."
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
                  Component
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Source
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Inventory
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Expiry Period
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Storage Temp
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
              {filteredComponents.map((component) => (
                <tr key={component.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-red-50 flex items-center justify-center">
                        <FontAwesomeIcon
                          icon={faFlask}
                          className="text-red-600"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {component.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {component.source}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {component.inventory} units
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {component.expiryPeriod}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {component.storageTemp}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <FontAwesomeIcon
                        icon={faCalendarAlt}
                        className="text-gray-400 mr-2"
                      />
                      {component.lastUpdated}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        component.status === "Adequate"
                          ? "bg-green-100 text-green-800"
                          : component.status === "Low"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {component.status}
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

        {filteredComponents.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No blood components found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}

export default BloodComponent;
