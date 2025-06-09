"use client";

import { useState, useEffect } from "react";
import { Search, Eye, Trash2, Upload, Circle } from "lucide-react";
import { useRouter } from "next/navigation";
import { utils, writeFile } from "xlsx";
import { formatDateTime } from "@/helper/formatDateTime";
import { formatToEuro } from "@/helper/formatCurrencyToEuro";
import { toast } from "sonner";

const Customers = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;
  const [initialLoading, setInitialLoading] = useState(true);
  const [activeToggleId, setActiveToggleId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/user");
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
        // console.log("Fetched users:", data.data);
      } else {
        console.error("Failed to fetch users:", data.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / customersPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * customersPerPage,
    currentPage * customersPerPage
  );

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleToggle = async (user) => {
    setActiveToggleId(user._id);
    try {
      const res = await fetch(`/api/admin/user/${user._id}`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchUsers();
        toast.success("Status updated successfully!");
      } else {
        toast.error("Failed to update status: " + data.message);
      }
    } catch (error) {
      toast.error("Error updating user status: " + error.message);
    } finally {
      setActiveToggleId(null);
    }
  };

  const confirmDelete = async () => {
    try {
      // Replace with your actual delete API endpoint
      const res = await fetch(`/api/admin/user/${selectedId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.filter((user) => user._id !== selectedId));
      } else {
        alert("Failed to delete user: " + data.message);
      }
    } catch (error) {
      alert("Error deleting user: " + error.message);
    } finally {
      setShowModal(false);
      setSelectedId(null);
    }
  };

  // console.log("init load", initialLoading);
  // if (initialLoading) {
  //   return (
  //     <div className="m-4 p-6 bg-[#202020] text-white rounded-lg">
  //       Loading...
  //     </div>
  //   );
  // }

  // Export To Excel Function
  const exportToExcel = () => {
    const exportData = users.map((user) => ({
      Name: user.name,
      Email: user.email,
      Role: user.role,
      Status: user.isActive ? "Active" : "Inactive",
      "Joined Date": user.createdAt
        ? new Date(user.createdAt).toLocaleDateString()
        : "N/A",
      "Total Spent": user.totalSpent?.toFixed(2) || "0.00",
      "Orders Count": user.ordersCount || 0,
      Phone: user.phone || "N/A",
      Country: user.country || "N/A",
    }));

    const worksheet = utils.json_to_sheet(exportData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Customers");
    writeFile(workbook, "Customer_List.xlsx");
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="m-4 p-6 bg-[#202020] border border-gray-600 text-white rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">All Customer List</h2>
        <div className="flex gap-5">
          <div className="relative">
            <input
              type="text"
              placeholder="Search customers by name or email..."
              className="bg-[#202020] text-white border border-l-red-light-6 px-4 py-2 rounded-lg pl-10 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-2 text-gray-400" size={18} />
          </div>
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded flex items-center justify-center"
            onClick={exportToExcel}
          >
            <Upload size={17} className="mr-2" />
            Export to Excel
          </button>
        </div>
      </div>

      <table className="w-full text-left border-collapse">
        <thead className="border-b">
          <tr className="bg-gray-800 text-gray-300">
            <th className="p-3">Full Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3">Status</th>
            <th className="p-3">Joined Date</th>
            <th className="p-3">Total Spent</th>
            <th className="p-3">Orders Count</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Country</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr
              key={user._id}
              className="border-b border-dashed text-sm border-gray-500"
            >
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3 capitalize">{user.role}</td>
              <td className="p-3 flex items-center gap-3">
                <Circle
                  size={12}
                  className={user.isActive ? "text-green-500" : "text-red-500"}
                  fill={user.isActive ? "green" : "red"}
                />
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={user.isActive}
                    onChange={() => handleToggle(user)}
                    disabled={activeToggleId === user._id}
                  />

                  <div className="w-11 h-6 bg-gray-300 peer-checked:bg-green-500 rounded-full peer peer-focus:ring-2 ring-green-400 transition-all relative">
                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5" />
                  </div>
                </label>
              </td>
              <td className="p-3">
                {user.createdAt ? formatDateTime(user.createdAt) : "N/A"}
              </td>
              <td className="p-3">
                {formatToEuro(user.totalSpent?.toFixed(2)) || "0.00"}
              </td>
              <td className="p-3">{user.orders?.length || 0}</td>
              <td className="p-3">
                {user.address && user.address.length > 0
                  ? user.address[0].phone || "N/A"
                  : "N/A"}
              </td>
              <td className="p-3">
                {user.address && user.address.length > 0
                  ? user.address[0].country || "N/A"
                  : "N/A"}
              </td>

              <td className="p-3 flex space-x-2">
                <button
                  className="flex items-center justify-center rounded-lg w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    sessionStorage.setItem(
                      "selectedUser",
                      JSON.stringify(user)
                    );
                    router.push(`/admin/customer-details/${user._id}`);
                  }}
                >
                  <Eye size={16} />
                </button>
                <button
                  className="flex items-center justify-center rounded-lg w-9 h-9 bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleDeleteClick(user._id)}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-80 text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure?
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Do you really want to delete this user? This action cannot be
              undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-end mt-4 space-x-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-gray-800 rounded-lg">
          {currentPage} / {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Customers;
