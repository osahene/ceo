"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../lib/store/store";
import {
  setSelectedCar,
  updateCar,
  deleteCar,
  Car,
  TimelineEvent,
} from "../../../lib/store/slices/carsSlice";
import { useRouter, useParams } from "next/navigation";

import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Wrench,
  Shield,
  TrendingUp,
  Plus,
  Edit,
  Download,
  ChevronRight,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Type for new event
interface NewEvent {
  type: "revenue" | "maintenance" | "insurance" | "accident" | "other";
  title: string;
  description: string;
  date: string;
  amount: number;
}

// Extracted Components
const DeleteConfirmationModal: React.FC<{
  car: Car;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ car, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 overflow-y-auto">
    <div className="flex items-center justify-center min-h-screen px-4">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Delete Vehicle
            </h3>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Are you sure you want to delete{" "}
            <strong>
              {car.make} {car.model}
            </strong>
            ? This action cannot be undone.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            All associated data including bookings, maintenance records, and
            insurance information will be permanently deleted.
          </p>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete Vehicle
          </button>
        </div>
      </div>
    </div>
  </div>
);

const TimelineEventItem: React.FC<{
  event: TimelineEvent;
  isLast: boolean;
}> = ({ event, isLast }) => {
  const getEventColor = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "revenue":
        return "bg-green-500";
      case "maintenance":
        return "bg-yellow-500";
      case "insurance":
        return "bg-blue-500";
      case "accident":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="flex items-start space-x-4">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full ${getEventColor(event.type)}`} />
        {!isLast && (
          <div className="w-px h-full bg-gray-300 dark:bg-gray-600 mt-1" />
        )}
      </div>
      <div className="flex-1 pb-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-800 dark:text-white">
            {event.title}
          </h4>
          <span className="text-sm text-gray-500">
            {new Date(event.date).toLocaleDateString()}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          {event.description}
        </p>
        {event.amount !== undefined && (
          <p className="text-sm font-medium mt-1">
            Amount: <span className="text-blue-600">${event.amount}</span>
          </p>
        )}
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusClasses = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rented":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "retired":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(
        status
      )}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const TabButton: React.FC<{
  tab: string;
  activeTab: string;
  onClick: (tab: string) => void;
}> = ({ tab, activeTab, onClick }) => (
  <button
    onClick={() => onClick(tab)}
    className={`
      py-2 px-1 border-b-2 font-medium text-sm transition-colors
      ${
        activeTab === tab
          ? "border-blue-500 text-blue-600 dark:text-blue-400"
          : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      }
    `}
  >
    {tab.charAt(0).toUpperCase() + tab.slice(1)}
  </button>
);

export default function CarDetailPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();

  // Get selected car from Redux store
  const { selectedCar, cars } = useSelector((state: RootState) => state.cars);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newEvent, setNewEvent] = useState<NewEvent>({
    type: "maintenance",
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    amount: 0,
  });

  // Sample data for charts - This should come from your Redux store in real app
  const revenueData = [
    { month: "Jan", revenue: 4500, expenses: 1200 },
    { month: "Feb", revenue: 5200, expenses: 1500 },
    { month: "Mar", revenue: 4800, expenses: 1800 },
    { month: "Apr", revenue: 6100, expenses: 2200 },
    { month: "May", revenue: 5500, expenses: 1900 },
    { month: "Jun", revenue: 6800, expenses: 2500 },
  ];

  // Sample timeline events - This should come from selectedCar.timelineEvents in real app
  const timelineEvents: TimelineEvent[] = selectedCar?.timelineEvents?.length
    ? selectedCar.timelineEvents
    : [
        {
          id: "1",
          date: "2023-01-15",
          type: "other",
          title: "Car Registered",
          description: "Vehicle added to fleet",
        },
        {
          id: "2",
          date: "2023-02-20",
          type: "revenue",
          title: "First Booking",
          description: "First rental completed",
          amount: 450,
        },
        {
          id: "3",
          date: "2023-03-15",
          type: "maintenance",
          title: "First Service",
          description: "Regular maintenance",
          amount: 300,
        },
      ];

  // Load car from cars list if selectedCar is null (when refreshing page)
  useEffect(() => {
    const carId = params.id as string;
    if (!selectedCar && carId) {
      const car = cars.find((c) => c.id === carId);
      if (car) {
        dispatch(setSelectedCar(car));
      }
    }
  }, [selectedCar, cars, params.id, dispatch]);

  if (!selectedCar) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
            Car not found
          </h3>
          <button
            onClick={() => router.push("/dashboard/cars")}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Go back to cars list
          </button>
        </div>
      </div>
    );
  }

  const getInsuranceStatus = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const daysRemaining = Math.ceil(
      (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysRemaining < 0)
      return { status: "expired", color: "bg-red-500", text: "Expired" };
    if (daysRemaining < 30)
      return {
        status: "warning",
        color: "bg-yellow-500",
        text: "Expiring Soon",
      };
    return { status: "active", color: "bg-green-500", text: "Active" };
  };

  const handleEditSubmit = () => {
    router.push(`/dashboard/cars/${selectedCar.id}/edit`);
  };

  const handleAddEvent = () => {
    if (!newEvent.title.trim() || !newEvent.date) {
      alert("Please fill in all required fields");
      return;
    }

    const event: TimelineEvent = {
      id: `EVT-${Date.now()}`,
      date: newEvent.date,
      type: newEvent.type,
      title: newEvent.title,
      description: newEvent.description,
      amount: newEvent.amount,
    };

    const updatedCar: Car = {
      ...selectedCar,
      timelineEvents: [...selectedCar.timelineEvents, event],
    };

    dispatch(updateCar(updatedCar));
    dispatch(setSelectedCar(updatedCar));
    setNewEvent({
      type: "maintenance",
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      amount: 0,
    });
    alert("Event added successfully!");
  };

  const handleDeleteCar = () => {
    dispatch(deleteCar(selectedCar.id));
    setShowDeleteModal(false);
    router.push("/dashboard/cars");
    alert("Car deleted successfully!");
  };

  const handleBack = () => {
    router.back();
  };

  const getUtilizationRate = () => {
    if (!selectedCar.bookings.length) return 0;
    const completedBookings = selectedCar.bookings.filter(
      (b) => b.status === "completed"
    ).length;
    return Math.round((completedBookings / selectedCar.bookings.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {selectedCar.make} {selectedCar.model} ({selectedCar.year})
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Vehicle ID: {selectedCar.id} • Registered:{" "}
              {new Date(selectedCar.registrationDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4 inline mr-2" />
            Delete
          </button>
          <button
            onClick={handleEditSubmit}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <Edit className="w-4 h-4 inline mr-2" />
            Edit
          </button>
          <button
            onClick={() =>
              router.push(`/dashboard/cars/${selectedCar.id}/addevent`)
            }
            className="px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Add Event
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          car={selectedCar}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteCar}
        />
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {[
            "overview",
            "analytics",
            "maintenance",
            "insurance",
            "bookings",
          ].map((tab) => (
            <TabButton
              key={tab}
              tab={tab}
              activeTab={activeTab}
              onClick={setActiveTab}
            />
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline */}
          {activeTab === "overview" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Vehicle Timeline
              </h3>
              <div className="space-y-4">
                {timelineEvents.map((event, index) => (
                  <TimelineEventItem
                    key={event.id || index}
                    event={event}
                    isLast={index === timelineEvents.length - 1}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Analytics Charts */}
          {activeTab === "analytics" && (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Revenue vs Expenses
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "0.5rem",
                        }}
                        labelStyle={{ color: "#F3F4F6" }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="expenses"
                        stroke="#EF4444"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Monthly Performance
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "0.5rem",
                        }}
                        labelStyle={{ color: "#F3F4F6" }}
                      />
                      <Bar
                        dataKey="revenue"
                        fill="#10B981"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="expenses"
                        fill="#EF4444"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {/* Maintenance Records */}
          {activeTab === "maintenance" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Maintenance Records
                </h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus className="w-4 h-4 inline mr-2" />
                  Add Record
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                        Type
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                        Description
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                        Cost
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                        Garage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCar.maintenanceRecords.map((record) => (
                      <tr
                        key={record.id}
                        className="border-b border-gray-100 dark:border-gray-700"
                      >
                        <td className="py-3 px-4">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">{record.type}</td>
                        <td className="py-3 px-4">{record.description}</td>
                        <td className="py-3 px-4 font-medium">
                          ${record.cost}
                        </td>
                        <td className="py-3 px-4">{record.garage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Insurance Policies */}
          {activeTab === "insurance" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Insurance Policies
                </h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus className="w-4 h-4 inline mr-2" />
                  Add Policy
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCar.insurancePolicies.map((policy) => {
                  const status = getInsuranceStatus(policy.endDate);
                  return (
                    <div
                      key={policy.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-800 dark:text-white">
                          {policy.provider}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${status.color} text-white`}
                        >
                          {status.text}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Policy #
                          </span>
                          <span className="font-medium">
                            {policy.policyNumber}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Coverage
                          </span>
                          <span className="font-medium">
                            {new Date(policy.startDate).toLocaleDateString()} -{" "}
                            {new Date(policy.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Premium
                          </span>
                          <span className="font-medium">
                            ${policy.premium}/year
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bookings */}
          {activeTab === "bookings" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Booking History
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                        Customer
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                        Period
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                        Duration
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCar.bookings.map((booking) => {
                      const duration = Math.ceil(
                        (new Date(booking.endDate).getTime() -
                          new Date(booking.startDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      );

                      return (
                        <tr
                          key={booking.id}
                          className="border-b border-gray-100 dark:border-gray-700"
                        >
                          <td className="py-3 px-4">{booking.customerName}</td>
                          <td className="py-3 px-4">
                            {new Date(booking.startDate).toLocaleDateString()} -{" "}
                            {new Date(booking.endDate).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">{duration} days</td>
                          <td className="py-3 px-4 font-medium">
                            ${booking.totalAmount}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`
                                px-2 py-1 rounded-full text-xs font-medium
                                ${
                                  booking.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : ""
                                }
                                ${
                                  booking.status === "active"
                                    ? "bg-blue-100 text-blue-800"
                                    : ""
                                }
                                ${
                                  booking.status === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : ""
                                }
                              `}
                            >
                              {booking.status.charAt(0).toUpperCase() +
                                booking.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          {/* Car Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Vehicle Summary
              </h3>
              <div
                className="w-8 h-8 rounded"
                style={{ backgroundColor: selectedCar.color }}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Daily Rate
                </span>
                <span className="font-medium text-gray-800 dark:text-white">
                  ${selectedCar.dailyRate}/day
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status</span>
                <StatusBadge status={selectedCar.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Total Bookings
                </span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {selectedCar.bookings.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Utilization Rate
                </span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {getUtilizationRate()}%
                </span>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Financial Summary
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Total Revenue
                  </span>
                </div>
                <span className="font-bold text-green-600">
                  ${selectedCar.totalRevenue.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Wrench className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Total Expenses
                  </span>
                </div>
                <span className="font-bold text-yellow-600">
                  ${selectedCar.totalExpenses.toLocaleString()}
                </span>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-gray-800 dark:text-white font-medium">
                    Net Profit
                  </span>
                  <span
                    className={`font-bold ${
                      selectedCar.totalRevenue - selectedCar.totalExpenses >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    $
                    {Math.abs(
                      selectedCar.totalRevenue - selectedCar.totalExpenses
                    ).toLocaleString()}
                    {selectedCar.totalRevenue - selectedCar.totalExpenses >= 0
                      ? " Profit"
                      : " Loss"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Quick Actions
            </h3>

            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-blue-500 mr-3" />
                  <span className="text-gray-800 dark:text-white">
                    Schedule Maintenance
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-purple-500 mr-3" />
                  <span className="text-gray-800 dark:text-white">
                    Renew Insurance
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-800 dark:text-white">
                    Generate Report
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center">
                  <Download className="w-5 h-5 text-gray-500 mr-3" />
                  <span className="text-gray-800 dark:text-white">
                    Export Data
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
