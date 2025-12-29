// lib/store/slices/carsSlice.ts - UPDATED VERSION
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  registrationDate: string;
  dailyRate: number;
  status: 'available' | 'rented' | 'maintenance' | 'retired';
  imageUrl: string;
  rating: number;
  totalRevenue: number;
  totalExpenses: number;
  timelineEvents: TimelineEvent[];
  maintenanceRecords: MaintenanceRecord[];
  insurancePolicies: InsurancePolicy[];
  bookings: CarBooking[];
  // Additional properties for analytics
  vin?: string;
  licensePlate?: string;
  engineType?: string;
  transmission?: string;
  fuelType?: string;
  fuelCapacity?: number;
  mileage?: number;
  seatingCapacity?: number;
  features?: {
    wifi?: boolean;
    navigation?: boolean;
    premiumAudio?: boolean;
    voiceControl?: boolean;
    ac?: boolean;
    bluetooth?: boolean;
    sunroof?: boolean;
    leatherSeats?: boolean;
    backupCamera?: boolean;
    parkingSensors?: boolean;
  };
  lastServiceDate?: string;
  nextServiceDate?: string;
  notes?: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  type: 'revenue' | 'maintenance' | 'insurance' | 'accident' | 'other';
  title: string;
  description: string;
  amount?: number;
}

export interface MaintenanceRecord {
  id: string;
  date: string;
  type: string;
  cost: number;
  description: string;
  garage: string;
}

export interface InsurancePolicy {
  id: string;
  provider: string;
  policyNumber: string;
  startDate: string;
  endDate: string;
  premium: number;
  status: 'active' | 'expired' | 'pending';
}

export interface CarBooking {
  id: string;
  customerId: string;
  customerName: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: 'active' | 'completed' | 'cancelled';
}

interface CarsState {
  cars: Car[];
  selectedCar: Car | null;
  loading: boolean;
  error: string | null;
}

const initialState: CarsState = {
  cars: [
    {
      id: '1',
      make: 'Tesla',
      model: 'Model 3',
      year: 2023,
      color: '#3B82F6',
      registrationDate: '2023-01-15',
      dailyRate: 120,
      status: 'available',
      imageUrl: '/cars/tesla-model3.jpg',
      rating: 4.5,
      totalRevenue: 45000,
      totalExpenses: 12000,
      timelineEvents: [],
      maintenanceRecords: [],
      insurancePolicies: [],
      bookings: [],
      vin: '5YJ3E1EA0MF000001',
      licensePlate: 'TES-123',
      engineType: 'Electric',
      transmission: 'Automatic',
      fuelType: 'Electric',
      fuelCapacity: 0,
      mileage: 12500,
      seatingCapacity: 5,
      features: {
        wifi: true,
        navigation: true,
        premiumAudio: true,
        voiceControl: true,
        ac: true,
        bluetooth: true,
        sunroof: true,
        leatherSeats: false,
        backupCamera: true,
        parkingSensors: true,
      },
      lastServiceDate: '2023-10-15',
      nextServiceDate: '2024-04-15',
      notes: 'Premium electric vehicle with autopilot',
    },
    {
      id: '2',
      make: 'BMW',
      model: '5 Series',
      year: 2022,
      color: '#10B981',
      registrationDate: '2022-08-20',
      dailyRate: 150,
      status: 'rented',
      imageUrl: '/cars/bmw-5series.jpg',
      rating: 4.7,
      totalRevenue: 68000,
      totalExpenses: 18500,
      timelineEvents: [],
      maintenanceRecords: [],
      insurancePolicies: [],
      bookings: [],
      vin: 'WBA5B1C50EDZ12345',
      licensePlate: 'BMW-456',
      engineType: 'Hybrid',
      transmission: 'Automatic',
      fuelType: 'Petrol',
      fuelCapacity: 68,
      mileage: 18500,
      seatingCapacity: 5,
      features: {
        wifi: true,
        navigation: true,
        premiumAudio: true,
        voiceControl: true,
        ac: true,
        bluetooth: true,
        sunroof: true,
        leatherSeats: true,
        backupCamera: true,
        parkingSensors: true,
      },
      lastServiceDate: '2023-11-10',
      nextServiceDate: '2024-05-10',
      notes: 'Luxury sedan with premium package',
    },
    {
      id: '3',
      make: 'Ford',
      model: 'Explorer',
      year: 2023,
      color: '#EF4444',
      registrationDate: '2023-03-10',
      dailyRate: 110,
      status: 'available',
      imageUrl: '/cars/ford-explorer.jpg',
      rating: 4.2,
      totalRevenue: 32000,
      totalExpenses: 9500,
      timelineEvents: [],
      maintenanceRecords: [],
      insurancePolicies: [],
      bookings: [],
      vin: '1FM5K7D83PGA12345',
      licensePlate: 'FRD-789',
      engineType: 'Gasoline',
      transmission: 'Automatic',
      fuelType: 'Petrol',
      fuelCapacity: 73,
      mileage: 9500,
      seatingCapacity: 7,
      features: {
        wifi: true,
        navigation: true,
        premiumAudio: false,
        voiceControl: true,
        ac: true,
        bluetooth: true,
        sunroof: false,
        leatherSeats: false,
        backupCamera: true,
        parkingSensors: true,
      },
      lastServiceDate: '2023-09-25',
      nextServiceDate: '2024-03-25',
      notes: 'Family SUV with third-row seating',
    },
    {
      id: '4',
      make: 'Mercedes-Benz',
      model: 'E-Class',
      year: 2023,
      color: '#8B5CF6',
      registrationDate: '2023-05-22',
      dailyRate: 180,
      status: 'maintenance',
      imageUrl: '/cars/mercedes-eclass.jpg',
      rating: 4.8,
      totalRevenue: 52000,
      totalExpenses: 15000,
      timelineEvents: [],
      maintenanceRecords: [],
      insurancePolicies: [],
      bookings: [],
      vin: 'W1KHF7DB5RA123456',
      licensePlate: 'MBZ-012',
      engineType: 'Gasoline',
      transmission: 'Automatic',
      fuelType: 'Petrol',
      fuelCapacity: 66,
      mileage: 11200,
      seatingCapacity: 5,
      features: {
        wifi: true,
        navigation: true,
        premiumAudio: true,
        voiceControl: true,
        ac: true,
        bluetooth: true,
        sunroof: true,
        leatherSeats: true,
        backupCamera: true,
        parkingSensors: true,
      },
      lastServiceDate: '2023-10-30',
      nextServiceDate: '2024-04-30',
      notes: 'Executive luxury sedan - currently in for brake service',
    },
    {
      id: '5',
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      color: '#F59E0B',
      registrationDate: '2022-11-05',
      dailyRate: 75,
      status: 'available',
      imageUrl: '/cars/toyota-camry.jpg',
      rating: 4.3,
      totalRevenue: 28000,
      totalExpenses: 8500,
      timelineEvents: [],
      maintenanceRecords: [],
      insurancePolicies: [],
      bookings: [],
      vin: '4T1B11HK6JU123456',
      licensePlate: 'TOY-345',
      engineType: 'Hybrid',
      transmission: 'Automatic',
      fuelType: 'Petrol',
      fuelCapacity: 50,
      mileage: 24500,
      seatingCapacity: 5,
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
        parkingSensors: false,
      },
      lastServiceDate: '2023-11-15',
      nextServiceDate: '2024-05-15',
      notes: 'Reliable economy sedan - great fuel efficiency',
    },
    {
      id: '6',
      make: 'Jeep',
      model: 'Wrangler',
      year: 2023,
      color: '#DC2626',
      registrationDate: '2023-07-14',
      dailyRate: 130,
      status: 'available',
      imageUrl: '/cars/jeep-wrangler.jpg',
      rating: 4.4,
      totalRevenue: 38000,
      totalExpenses: 12000,
      timelineEvents: [],
      maintenanceRecords: [],
      insurancePolicies: [],
      bookings: [],
      vin: '1C4HJXDG7PW123456',
      licensePlate: 'JEP-678',
      engineType: 'Gasoline',
      transmission: 'Manual',
      fuelType: 'Petrol',
      fuelCapacity: 70,
      mileage: 8500,
      seatingCapacity: 5,
      features: {
        wifi: false,
        navigation: false,
        premiumAudio: true,
        voiceControl: false,
        ac: true,
        bluetooth: true,
        sunroof: true,
        leatherSeats: false,
        backupCamera: true,
        parkingSensors: false,
      },
      lastServiceDate: '2023-10-05',
      nextServiceDate: '2024-04-05',
      notes: 'Off-road capable SUV - removable roof',
    },
  ],
  selectedCar: null,
  loading: false,
  error: null,
};

export const carsSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    setCars: (state, action: PayloadAction<Car[]>) => {
      state.cars = action.payload;
    },
    setSelectedCar: (state, action: PayloadAction<Car | null>) => {
      state.selectedCar = action.payload;
    },
    addCar: (state, action: PayloadAction<Car>) => {
      state.cars.push(action.payload);
    },
    updateCar: (state, action: PayloadAction<Car>) => {
      const index = state.cars.findIndex(car => car.id === action.payload.id);
      if (index !== -1) {
        state.cars[index] = action.payload;
      }
    },
    deleteCar: (state, action: PayloadAction<string>) => {
      state.cars = state.cars.filter(car => car.id !== action.payload);
    },
    addCarBooking: (state, action: PayloadAction<{ carId: string; booking: CarBooking }>) => {
      const car = state.cars.find(c => c.id === action.payload.carId);
      if (car) {
        car.bookings.push(action.payload.booking);
        car.totalRevenue += action.payload.booking.totalAmount;
      }
    },
    updateCarStatus: (state, action: PayloadAction<{ carId: string; status: Car['status'] }>) => {
      const car = state.cars.find(c => c.id === action.payload.carId);
      if (car) {
        car.status = action.payload.status;
      }
    },
    addMaintenanceRecord: (state, action: PayloadAction<{ carId: string; record: MaintenanceRecord }>) => {
      const car = state.cars.find(c => c.id === action.payload.carId);
      if (car) {
        car.maintenanceRecords.push(action.payload.record);
        car.totalExpenses += action.payload.record.cost;
        car.status = 'maintenance';
      }
    },
    updateCarRating: (state, action: PayloadAction<{ carId: string; rating: number }>) => {
      const car = state.cars.find(c => c.id === action.payload.carId);
      if (car) {
        car.rating = action.payload.rating;
      }
    },
  },
});

export const { 
  setCars, 
  setSelectedCar, 
  addCar, 
  updateCar, 
  deleteCar,
  addCarBooking,
  updateCarStatus,
  addMaintenanceRecord,
  updateCarRating
} = carsSlice.actions;

export default carsSlice.reducer;