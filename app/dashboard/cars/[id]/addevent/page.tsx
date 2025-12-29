// app/dashboard/cars/[id]/addevent/page.tsx - COMPLETE VERSION
"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../lib/store/store";
import {
  updateCar,
  setSelectedCar,
} from "../../../../lib/store/slices/carsSlice";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
  X,
  Calendar,
  Wrench,
  Shield,
  AlertTriangle,
  TrendingUp,
  Car,
} from "lucide-react";

export default function AddEventPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { cars, selectedCar } = useSelector((state: RootState) => state.cars);
  const [loading, setLoading] = useState(false);

  // Find the car by ID
  const carId = params.id as string;
  const currentCar = selectedCar || cars.find((car) => car.id === carId);

  const [eventData, setEventData] = useState({
    type: "maintenance",
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    amount: 0,
    garage: "",
    provider: "",
    policyNumber: "",
    severity: "low",
  });

  // Initialize car selection in Redux
  useEffect(() => {
    if (currentCar && !selectedCar) {
      dispatch(setSelectedCar(currentCar));
    }
  }, [currentCar, selectedCar, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!currentCar) {
        throw new Error("Car not found");
      }

      // Create the event object
      const event = {
        id: `EVT-${Date.now()}`,
        date: eventData.date,
        type: (eventData.type as string) || [],
        title: eventData.title,
        description: eventData.description,
        amount: eventData.amount,
      };

      // Create updated car with new event
      const updatedCar = {
        ...currentCar,
        timelineEvents: [...currentCar.timelineEvents, event],
      };

      // If it's a maintenance event, add to maintenance records
      if (eventData.type === "maintenance") {
        const maintenanceRecord = {
          id: `MAINT-${Date.now()}`,
          date: eventData.date,
          type: eventData.title,
          cost: eventData.amount,
          description: eventData.description,
          garage: eventData.garage || "Unknown",
        };
        updatedCar.maintenanceRecords = [
          ...currentCar.maintenanceRecords,
          maintenanceRecord,
        ];
        updatedCar.totalExpenses += eventData.amount;
      }

      // If it's an insurance event, add to insurance policies
      if (eventData.type === "insurance") {
        const endDate = new Date(eventData.date);
        endDate.setFullYear(endDate.getFullYear() + 1);

        const insurancePolicy = {
          id: `INS-${Date.now()}`,
          provider: eventData.provider || "Unknown",
          policyNumber: eventData.policyNumber || `POL-${Date.now()}`,
          startDate: eventData.date,
          endDate: endDate.toISOString().split("T")[0],
          premium: eventData.amount,
          status: "active" as const,
        };
        updatedCar.insurancePolicies = [
          ...currentCar.insurancePolicies,
          insurancePolicy,
        ];
        updatedCar.totalExpenses += eventData.amount;
      }

      // If it's a revenue event, add to revenue
      if (eventData.type === "revenue") {
        updatedCar.totalRevenue += eventData.amount;
      }

      // Update the car in Redux
      dispatch(updateCar(updatedCar));
      dispatch(setSelectedCar(updatedCar));

      alert("Event added successfully!");
      router.push(`/dashboard/cars/${currentCar.id}`);
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Failed to add event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "number") {
      setEventData((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : parseFloat(value),
      }));
    } else {
      setEventData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  if (!currentCar) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push(`/dashboard/cars/${currentCar.id}`)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Add New Event: {currentCar.make} {currentCar.model}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Record maintenance, revenue, insurance, or other events
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => router.push(`/dashboard/cars/${currentCar.id}`)}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <X className="w-4 h-4 inline mr-2" />
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            <Save className="w-4 h-4 inline mr-2" />
            {loading ? "Adding..." : "Add Event"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Event Details */}
          <div className="space-y-6">
            {/* Event Type Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="flex items-center mb-6">
                <Calendar className="w-6 h-6 text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Event Details
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Event Type *
                  </label>
                  <select
                    name="type"
                    value={eventData.type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
                  >
                    <option value="maintenance">Maintenance</option>
                    <option value="revenue">Revenue</option>
                    <option value="insurance">Insurance</option>
                    <option value="accident">Accident</option>
                    <option value="registration">Registration</option>
                    <option value="inspection">Inspection</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={eventData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
                    placeholder="e.g., Oil Change, Major Service, Insurance Renewal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={eventData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={eventData.amount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Description
              </h3>
              <textarea
                name="description"
                value={eventData.description}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white resize-none"
                placeholder="Provide details about the event..."
              />
            </div>
          </div>

          {/* Right Column - Additional Information */}
          <div className="space-y-6">
            {/* Type-Specific Fields */}
            {eventData.type === "maintenance" && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <div className="flex items-center mb-6">
                  <Wrench className="w-6 h-6 text-blue-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Maintenance Details
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Garage/Service Center
                    </label>
                    <input
                      type="text"
                      name="garage"
                      value={eventData.garage}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
                      placeholder="e.g., ABC Auto Services"
                    />
                  </div>
                </div>
              </div>
            )}

            {eventData.type === "insurance" && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <div className="flex items-center mb-6">
                  <Shield className="w-6 h-6 text-blue-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Insurance Details
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Insurance Provider
                    </label>
                    <input
                      type="text"
                      name="provider"
                      value={eventData.provider}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
                      placeholder="e.g., State Farm, Allstate"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Policy Number
                    </label>
                    <input
                      type="text"
                      name="policyNumber"
                      value={eventData.policyNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
                      placeholder="e.g., POL-123456789"
                    />
                  </div>
                </div>
              </div>
            )}

            {eventData.type === "accident" && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <div className="flex items-center mb-6">
                  <AlertTriangle className="w-6 h-6 text-blue-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Accident Details
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Severity
                    </label>
                    <select
                      name="severity"
                      value={eventData.severity}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
                    >
                      <option value="low">Minor (Scratches/Dents)</option>
                      <option value="medium">Moderate (Body Damage)</option>
                      <option value="high">Major (Structural Damage)</option>
                      <option value="total">Total Loss</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {eventData.type === "revenue" && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <div className="flex items-center mb-6">
                  <TrendingUp className="w-6 h-6 text-blue-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Revenue Details
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Source
                    </label>
                    <select className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white">
                      <option value="booking">Rental Booking</option>
                      <option value="service">Additional Service</option>
                      <option value="penalty">Late Return Penalty</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Event Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Event Preview
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Type:
                  </span>
                  <span className="font-medium capitalize">
                    {eventData.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Date:
                  </span>
                  <span className="font-medium">
                    {new Date(eventData.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Title:
                  </span>
                  <span className="font-medium">
                    {eventData.title || "No title"}
                  </span>
                </div>
                {eventData.amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Amount:
                    </span>
                    <span className="font-medium">
                      ${eventData.amount.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Vehicle Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Vehicle:
                  </span>
                  <span className="font-medium">
                    {currentCar.make} {currentCar.model}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Year:
                  </span>
                  <span className="font-medium">{currentCar.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Status:
                  </span>
                  <span
                    className={`font-medium ${
                      currentCar.status === "available"
                        ? "text-green-600"
                        : currentCar.status === "rented"
                        ? "text-blue-600"
                        : currentCar.status === "maintenance"
                        ? "text-yellow-600"
                        : "text-gray-600"
                    }`}
                  >
                    {currentCar.status.charAt(0).toUpperCase() +
                      currentCar.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
