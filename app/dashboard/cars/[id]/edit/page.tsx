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
  Car,
  Calendar,
  DollarSign,
  Wifi,
  Navigation,
  Music,
  Zap,
  Settings,
  AlertCircle,
} from "lucide-react";

export default function EditCarPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { cars, selectedCar } = useSelector((state: RootState) => state.cars);
  const [loading, setLoading] = useState(false);

  // Find the car by ID if not already selected
  const carId = params.id as string;
  const currentCar = selectedCar || cars.find((car) => car.id === carId);

  const [formData, setFormData] = useState({
    // Basic Information
    make: "",
    model: "",
    year: new Date().getFullYear(),
    color: "#3B82F6",
    vin: "",
    licensePlate: "",

    // Specifications
    engineType: "Gasoline",
    transmission: "Automatic",
    fuelType: "Petrol",
    fuelCapacity: 0,
    mileage: 0,
    seatingCapacity: 5,

    // Rental Information
    dailyRate: 0,
    weeklyRate: 0,
    monthlyRate: 0,
    securityDeposit: 0,

    // Status
    status: "available" as "available" | "rented" | "maintenance" | "retired",

    // Features
    features: {
      wifi: false,
      navigation: false,
      premiumAudio: false,
      voiceControl: false,
      ac: true,
      bluetooth: true,
      sunroof: false,
      leatherSeats: false,
      backupCamera: true,
      parkingSensors: true,
    },

    // Service Information
    registrationDate: new Date().toISOString().split("T")[0],
    lastServiceDate: new Date().toISOString().split("T")[0],
    nextServiceDate: new Date().toISOString().split("T")[0],

    // Notes
    notes: "",
  });

  // Initialize form data when car is loaded
  useEffect(() => {
    if (currentCar) {
      setFormData({
        make: currentCar.make || "",
        model: currentCar.model || "",
        year: currentCar.year || new Date().getFullYear(),
        color: currentCar.color || "#3B82F6",
        vin: currentCar.vin || "",
        licensePlate: currentCar.licensePlate || "",
        engineType: currentCar.engineType || "Gasoline",
        transmission: currentCar.transmission || "Automatic",
        fuelType: currentCar.fuelType || "Petrol",
        fuelCapacity: currentCar.fuelCapacity || 0,
        mileage: currentCar.mileage || 0,
        seatingCapacity: currentCar.seatingCapacity || 5,
        dailyRate: currentCar.dailyRate || 0,
        weeklyRate: 0, // Add to Car interface if needed
        monthlyRate: 0, // Add to Car interface if needed
        securityDeposit: 0, // Add to Car interface if needed
        status: currentCar.status || "available",
        features: currentCar.features || {
          wifi: false,
          navigation: false,
          premiumAudio: false,
          voiceControl: false,
          ac: true,
          bluetooth: true,
          sunroof: false,
          leatherSeats: false,
          backupCamera: true,
          parkingSensors: true,
        },
        registrationDate:
          currentCar.registrationDate || new Date().toISOString().split("T")[0],
        lastServiceDate:
          currentCar.lastServiceDate || new Date().toISOString().split("T")[0],
        nextServiceDate:
          currentCar.nextServiceDate || new Date().toISOString().split("T")[0],
        notes: currentCar.notes || "",
      });

      // Ensure the car is selected in Redux
      if (!selectedCar && currentCar) {
        dispatch(setSelectedCar(currentCar));
      }
    }
  }, [currentCar, selectedCar, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!currentCar) {
        throw new Error("Car not found");
      }

      const updatedCar = {
        ...currentCar,
        ...formData,
        id: currentCar.id,
        imageUrl: currentCar.imageUrl,
        rating: currentCar.rating,
        totalRevenue: currentCar.totalRevenue,
        totalExpenses: currentCar.totalExpenses,
        timelineEvents: currentCar.timelineEvents,
        maintenanceRecords: currentCar.maintenanceRecords,
        insurancePolicies: currentCar.insurancePolicies,
        bookings: currentCar.bookings,
      };

      dispatch(updateCar(updatedCar));
      dispatch(setSelectedCar(updatedCar));

      alert("Car updated successfully!");
      router.push(`/dashboard/cars/${currentCar.id}`);
    } catch (error) {
      console.error("Error updating car:", error);
      alert("Failed to update car. Please try again.");
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

    if (name.includes("features.")) {
      const featureName = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        features: {
          ...prev.features,
          [featureName]: (e.target as HTMLInputElement).checked,
        },
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : parseFloat(value),
      }));
    } else {
      setFormData((prev) => ({
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
              Edit Vehicle: {currentCar.make} {currentCar.model}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Update vehicle information and specifications
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
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="flex items-center mb-6">
                <Car className="w-6 h-6 text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Basic Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Make *
                  </label>
                  <input
                    type="text"
                    name="make"
                    value={formData.make}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Model *
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Year *
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    min="2000"
                    max={new Date().getFullYear() + 1}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      readOnly
                      className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    VIN
                  </label>
                  <input
                    type="text"
                    name="vin"
                    value={formData.vin}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    License Plate
                  </label>
                  <input
                    type="text"
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Specifications Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="flex items-center mb-6">
                <Settings className="w-6 h-6 text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Specifications
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Engine Type
                  </label>
                  <select
                    name="engineType"
                    value={formData.engineType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
                  >
                    <option value="Gasoline">Gasoline</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Transmission
                  </label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fuel Type
                  </label>
                  <select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fuel Capacity (Liters)
                  </label>
                  <input
                    type="number"
                    name="fuelCapacity"
                    value={formData.fuelCapacity}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mileage (KM)
                  </label>
                  <input
                    type="number"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Seating Capacity
                  </label>
                  <input
                    type="number"
                    name="seatingCapacity"
                    value={formData.seatingCapacity}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Features Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="flex items-center mb-6">
                <AlertCircle className="w-6 h-6 text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Features
                </h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="features.wifi"
                    checked={formData.features.wifi}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Wifi className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    WiFi
                  </span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="features.navigation"
                    checked={formData.features.navigation}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Navigation className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Navigation
                  </span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="features.premiumAudio"
                    checked={formData.features.premiumAudio}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Music className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Premium Audio
                  </span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="features.voiceControl"
                    checked={formData.features.voiceControl}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Zap className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Voice Control
                  </span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="features.ac"
                    checked={formData.features.ac}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Air Conditioning
                  </span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="features.bluetooth"
                    checked={formData.features.bluetooth}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Bluetooth
                  </span>
                </label>
              </div>
            </div>

            {/* Notes Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Notes
              </h3>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white resize-none"
                placeholder="Any additional notes about the vehicle..."
              />
            </div>
          </div>

          {/* Right Column - Rental & Service */}
          <div className="space-y-6">
            {/* Rental Information Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="flex items-center mb-6">
                <DollarSign className="w-6 h-6 text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Rental Information
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Daily Rate ($) *
                  </label>
                  <input
                    type="number"
                    name="dailyRate"
                    value={formData.dailyRate}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
                  >
                    <option value="available">Available</option>
                    <option value="rented">Rented</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="retired">Retired</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Service Information Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="flex items-center mb-6">
                <Calendar className="w-6 h-6 text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Service Information
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Registration Date
                  </label>
                  <input
                    type="date"
                    name="registrationDate"
                    value={formData.registrationDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Service Date
                  </label>
                  <input
                    type="date"
                    name="lastServiceDate"
                    value={formData.lastServiceDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Next Service Date
                  </label>
                  <input
                    type="date"
                    name="nextServiceDate"
                    value={formData.nextServiceDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Preview
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Vehicle:
                  </span>
                  <span className="font-medium">
                    {formData.make} {formData.model}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Year:
                  </span>
                  <span className="font-medium">{formData.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Status:
                  </span>
                  <span
                    className={`font-medium ${
                      formData.status === "available"
                        ? "text-green-600"
                        : formData.status === "rented"
                        ? "text-blue-600"
                        : formData.status === "maintenance"
                        ? "text-yellow-600"
                        : "text-gray-600"
                    }`}
                  >
                    {formData.status.charAt(0).toUpperCase() +
                      formData.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Daily Rate:
                  </span>
                  <span className="font-medium">${formData.dailyRate}/day</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
