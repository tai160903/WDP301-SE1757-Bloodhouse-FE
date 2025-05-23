import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faEdit,
  faTrash,
  faPlus,
  faUser,
  faMapMarkerAlt,
  faEnvelope,
  faPhone,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";

function Staff() {
  // Mock data - replace with actual data fetching
  const [staffs, setStaffs] = useState([
    {
      id: 1,
      name: "Dr. James Wilson",
      position: "Medical Director",
      facility: "Central Blood Bank",
      email: "james.wilson@bloodhouse.org",
      phone: "(555) 123-4567",
      joinDate: "2018-03-12",
      status: "Active",
    },
    {
      id: 2,
      name: "Dr. Maria Rodriguez",
      position: "Senior Phlebotomist",
      facility: "East District Donation Center",
      email: "maria.r@bloodhouse.org",
      phone: "(555) 234-5678",
      joinDate: "2019-05-20",
      status: "Active",
    },
    {
      id: 3,
      name: "Thomas Jenkins",
      position: "Lab Technician",
      facility: "Central Blood Bank",
      email: "thomas.j@bloodhouse.org",
      phone: "(555) 345-6789",
      joinDate: "2020-08-15",
      status: "On Leave",
    },
    {
      id: 4,
      name: "Sarah Patel",
      position: "Nurse",
      facility: "West Wing Collection Center",
      email: "sarah.p@bloodhouse.org",
      phone: "(555) 456-7890",
      joinDate: "2021-02-10",
      status: "Active",
    },
    {
      id: 5,
      name: "Robert Chen",
      position: "Administrative Assistant",
      facility: "South Storage Facility",
      email: "robert.c@bloodhouse.org",
      phone: "(555) 567-8901",
      joinDate: "2021-10-05",
      status: "Inactive",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredStaffs = staffs.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.facility.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center">
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add New Staff
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Total Staff</p>
              <p className="text-2xl font-bold">{staffs.length}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <FontAwesomeIcon
                icon={faUser}
                className="text-blue-500 text-xl"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Active Staff</p>
              <p className="text-2xl font-bold">
                {staffs.filter((s) => s.status === "Active").length}
              </p>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <FontAwesomeIcon
                icon={faIdCard}
                className="text-green-500 text-xl"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Facilities Covered</p>
              <p className="text-2xl font-bold">4</p>
            </div>
            <div className="bg-yellow-100 p-2 rounded-full">
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="text-yellow-500 text-xl"
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
            placeholder="Search staff by name, position or facility..."
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
                  Staff Member
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Position
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Facility
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Contact
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Join Date
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
              {filteredStaffs.map((staff) => (
                <tr key={staff.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 font-bold">
                          {staff.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {staff.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {staff.position}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        className="text-red-500 mr-2"
                      />
                      {staff.facility}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      <div className="flex items-center mb-1">
                        <FontAwesomeIcon
                          icon={faEnvelope}
                          className="text-gray-400 mr-2"
                        />
                        {staff.email}
                      </div>
                      <div className="flex items-center">
                        <FontAwesomeIcon
                          icon={faPhone}
                          className="text-gray-400 mr-2"
                        />
                        {staff.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {staff.joinDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        staff.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : staff.status === "On Leave"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {staff.status}
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

        {filteredStaffs.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No staff members found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}

export default Staff;
