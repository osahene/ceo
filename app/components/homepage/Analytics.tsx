"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../lib/store/store";
import { useRouter } from "next/navigation";
import {
  Car,
  Wifi,
  Navigation,
  Music,
  Zap,
  ChevronLeft,
  ChevronRight,
  Star,
  Gauge,
  Fuel,
  Users,
  Calendar,
  TrendingUp,
} from "lucide-react";

export default function CarAnalytics() {
  const router = useRouter();
  const { cars } = useSelector((state: RootState) => state.cars);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (cars.length === 0) {
    return (
      <div className="bg-linear-to-br from-blue-900 to-indigo-900 rounded-2xl p-6 shadow-xl text-white">
        <div className="text-center py-8">
          <Car className="w-12 h-12 text-blue-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Vehicles Available</h3>
          <p className="text-blue-200">
            Add your first vehicle to see analytics
          </p>
        </div>
      </div>
    );
  }

  const currentCar = cars[currentIndex];
  const profit = currentCar.totalRevenue - currentCar.totalExpenses;

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? cars.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === cars.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleCarDetails = () => {
    router.push(`/dashboard/cars/${currentCar.id}`);
  };

  // Calculate utilization rate
  const utilizationRate = currentCar.bookings
    ? Math.round(
        ((currentCar.bookings.filter((b) => b.status === "completed").length *
          30) /
          365) *
          100
      )
    : 0;

  return (
    <div className="bg-linear-to-br from-blue-900 to-indigo-900 rounded-2xl p-6 shadow-xl text-white">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Featured Vehicle</h3>
          <div className="flex items-center space-x-4">
            <p className="text-sm text-blue-200">
              {currentCar.make} {currentCar.model} • {currentCar.year}
            </p>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(currentCar.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-blue-300"
                  }`}
                />
              ))}
              <span className="ml-1 text-sm">
                {currentCar.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevious}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm">
            {currentIndex + 1} / {cars.length}
          </span>
          <button
            onClick={handleNext}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Car Stats */}
      <div className="mb-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-blue-200">Status</p>
            <p className="text-2xl font-bold">
              <span
                className={`
                ${currentCar.status === "available" ? "text-green-400" : ""}
                ${currentCar.status === "rented" ? "text-yellow-400" : ""}
                ${currentCar.status === "maintenance" ? "text-red-400" : ""}
                ${currentCar.status === "retired" ? "text-gray-400" : ""}
              `}
              >
                {currentCar.status.charAt(0).toUpperCase() +
                  currentCar.status.slice(1)}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-200">Daily Rate</p>
            <p className="text-2xl font-bold">${currentCar.dailyRate}/day</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex items-center text-sm text-blue-200 mb-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              Revenue
            </div>
            <p className="text-xl font-bold">
              ${currentCar.totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end text-sm text-blue-200 mb-1">
              Expenses
            </div>
            <p className="text-xl font-bold">
              ${currentCar.totalExpenses.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Profit Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-blue-200">Net Profit</span>
            <span className={profit >= 0 ? "text-green-400" : "text-red-400"}>
              ${Math.abs(profit).toLocaleString()}{" "}
              {profit >= 0 ? "Profit" : "Loss"}
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                profit >= 0
                  ? "bg-linear-to-r from-green-400 to-emerald-400"
                  : "bg-linear-to-r from-red-400 to-orange-400"
              }`}
              style={{
                width: `${Math.min(
                  (Math.abs(profit) / (currentCar.totalRevenue || 1)) * 100,
                  100
                )}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
          <div className="flex items-center text-blue-200 mb-1">
            <Gauge className="w-4 h-4 mr-2" />
            <span className="text-sm">Utilization</span>
          </div>
          <p className="text-lg font-bold">{utilizationRate}%</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
          <div className="flex items-center text-blue-200 mb-1">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">Bookings</span>
          </div>
          <p className="text-lg font-bold">
            {currentCar.bookings?.length || 0}
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
          <div className="flex items-center text-blue-200 mb-1">
            <Users className="w-4 h-4 mr-2" />
            <span className="text-sm">Seats</span>
          </div>
          <p className="text-lg font-bold">{currentCar.seatingCapacity || 5}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
          <div className="flex items-center text-blue-200 mb-1">
            <Fuel className="w-4 h-4 mr-2" />
            <span className="text-sm">Type</span>
          </div>
          <p className="text-lg font-bold">{currentCar.fuelType || "Petrol"}</p>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-4">
        <h4 className="font-semibold text-blue-100">Key Features</h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Wifi, label: "WiFi", active: currentCar.features?.wifi },
            {
              icon: Navigation,
              label: "Navigation",
              active: currentCar.features?.navigation,
            },
            {
              icon: Music,
              label: "Premium Audio",
              active: currentCar.features?.premiumAudio,
            },
            {
              icon: Zap,
              label: "Voice Control",
              active: currentCar.features?.voiceControl,
            },
          ].map((feature) => (
            <div
              key={feature.label}
              className={`p-3 rounded-lg flex items-center ${
                feature.active
                  ? "bg-white/10 backdrop-blur-sm"
                  : "bg-white/5 opacity-50"
              }`}
            >
              <feature.icon
                className={`w-5 h-5 mr-2 ${
                  feature.active ? "text-cyan-300" : "text-blue-300"
                }`}
              />
              <span className="text-sm">{feature.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* View Details Button */}
      <div className="mt-6 pt-6 border-t border-blue-700">
        <button
          onClick={handleCarDetails}
          className="w-full py-3 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
        >
          <Car className="w-5 h-5 mr-2" />
          View Full Details
        </button>
      </div>
    </div>
  );
}
