import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { VehicleSearchRequestDto } from './schema/vehicle.shema';
import { AppService } from './services/app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getCarMakeAndModels: jest.fn(),
            getAvailableCars: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  it('should call getCarMakeAndModels of the service', () => {
    appController.getCarMakeAndModels();
    expect(appService.getCarMakeAndModels).toHaveBeenCalledTimes(1);
  });

  it('should call getAvailableCars of the service with correct dto', () => {
    const mockDto: VehicleSearchRequestDto = {
      make: 'Toyota',
      model: 'Camry',
      startDate: new Date(),
      endDate: new Date(),
      minPrice: '100',
      maxPrice: '200',
    };
    appController.getAvailableCars(mockDto);
    expect(appService.getAvailableCars).toHaveBeenCalledWith(mockDto);
  });
});
