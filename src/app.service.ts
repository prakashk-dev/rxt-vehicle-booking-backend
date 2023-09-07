import { Injectable } from '@nestjs/common';
import { Vehicle, VehicleSearchRequestDto } from './schema/vehicle.shema';
import { vehicles } from './schema/vehicles-mock';

@Injectable()
export class AppService {
  getCarMakeAndModels(): Record<string, string[]> {
    const vehicleMakeToModels: Record<string, string[]> = {};
    vehicles.forEach((vehicle) => {
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

    const availableCars = vehicles.filter((vehicle) => {
      const {
        make: vehicleMake,
        model: vehicleModel,
        price,
        bookings,
      } = vehicle;
      const filterByMake = make ? vehicleMake === make : true;
      const filterByModel = model ? vehicleModel === model : true;
      const filterByMinPrice = minPrice ? price >= minPrice : true;
      const filterByMaxPrice = maxPrice ? price <= maxPrice : true;
      const filterByDate = bookings
        ? bookings.some(
            (booking) =>
              // if a vehicle is returned on the same day as the start date, it is ignored
              startDate > booking.endDate || endDate < booking.startDate,
          )
        : true;

      return (
        filterByMake &&
        filterByModel &&
        filterByMinPrice &&
        filterByMaxPrice &&
        filterByDate
      );
    });

    return availableCars;
  }
}
