import { Controller, Get, Query } from '@nestjs/common';
import { VechicleSearchRequestPipe } from './pipes/vechicle-search-request.pipe';
import { Vehicle, VehicleSearchRequestDto } from './schema/vehicle.shema';
import { AppService } from './services/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('make-and-models')
  getCarMakeAndModels(): Record<string, string[]> {
    return this.appService.getCarMakeAndModels();
  }

  @Get('available-cars')
  getAvailableCars(
    @Query(new VechicleSearchRequestPipe())
    vehicleRequestDto: VehicleSearchRequestDto,
  ): Vehicle[] {
    return this.appService.getAvailableCars(vehicleRequestDto);
  }
}
