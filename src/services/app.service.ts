import { Injectable } from '@nestjs/common';
import { Vehicle, VehicleSearchRequestDto } from '../schema/vehicle.shema';
import { vehicles as mockVehicles } from '../schema/vehicles-mock';

@Injectable()
export class AppService {
  // this returns mock vehicles, but in a real app it would return vehicles from a database
  private vehicles = mockVehicles;

  getCarMakeAndModels(): Record<string, string[]> {
    const vehicleMakeToModels: Record<string, string[]> = {};
    this.vehicles.forEach((vehicle) => {
      if (vehicleMakeToModels[vehicle.make]) {
        if (vehicleMakeToModels[vehicle.make].includes(vehicle.model)) return;
        vehicleMakeToModels[vehicle.make].push(vehicle.model);
      } else {
        vehicleMakeToModels[vehicle.make] = [vehicle.model];
      }
    });
    return vehicleMakeToModels;
  }

  getAvailableCars(vehicleRequestDto: VehicleSearchRequestDto): Vehicle[] {
    const { make, model, minPrice, maxPrice, startDate, endDate } =
      vehicleRequestDto;

    const matchesMake = (vehicle: Vehicle) =>
      make ? vehicle.make === make : true;
    const matchesModel = (vehicle: Vehicle) =>
      model ? vehicle.model === model : true;
    const aboveMinPrice = (vehicle: Vehicle) =>
      minPrice ? vehicle.price >= minPrice : true;
    const belowMaxPrice = (vehicle: Vehicle) =>
      maxPrice ? vehicle.price <= maxPrice : true;
    const isAvailableDuringDates = (vehicle: Vehicle) =>
      vehicle.bookings
        ? vehicle.bookings.every(
            (booking) =>
              startDate > booking.endDate || endDate < booking.startDate,
          )
        : true;

    const isVehicleAvailable = (vehicle: Vehicle) =>
      matchesMake(vehicle) &&
      matchesModel(vehicle) &&
      aboveMinPrice(vehicle) &&
      belowMaxPrice(vehicle) &&
      isAvailableDuringDates(vehicle);

    return this.vehicles
      .filter(isVehicleAvailable)
      .map(({ make, model, vin, price }) => ({ make, model, vin, price }));
  }
}
