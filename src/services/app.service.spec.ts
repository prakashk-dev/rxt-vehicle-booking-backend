jest.mock('../schema/vehicles-mock', () => ({ vehicles: mockVehicles }));

import { Test, TestingModule } from '@nestjs/testing';
import { Vehicle, VehicleSearchRequestDto } from 'src/schema/vehicle.shema';
import { AppService } from './app.service';

export const mockVehicles: Vehicle[] = [
  {
    make: 'Mitsubishi',
    model: 'Montero',
    vin: 'SAJWJ0FF3F8321657',
    price: '2814',
    bookings: [
      {
        startDate: new Date('2023-09-15'),
        endDate: new Date('2023-09-20'),
        customerId: '123',
      },
    ],
  },
  {
    make: 'Mitsubishi',
    model: 'Lancer Evolution',
    vin: 'WAU2GBFCXDN339713',
    price: '3849',
  },
  {
    make: 'Volkswagen',
    model: 'Passat',
    vin: 'WBANV9C51AC203320',
    price: '1731',
    bookings: [
      {
        startDate: new Date('2023-09-20'),
        endDate: new Date('2023-09-25'),
        customerId: '234',
      },
    ],
  },
  {
    make: 'Volkswagen',
    model: 'Eurovan',
    vin: 'WAUUL78E45A616915',
    price: '1645',
  },
];

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
    service['vehicles'] = mockVehicles;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return car make and models', () => {
    expect(service.getCarMakeAndModels()).toEqual({
      Mitsubishi: ['Montero', 'Lancer Evolution'],
      Volkswagen: ['Passat', 'Eurovan'],
    });
  });

  it('should return available cars', () => {
    const searchFilter: VehicleSearchRequestDto = {
      make: 'Mitsubishi',
      model: 'Montero',
      startDate: new Date('2023-09-10'),
      endDate: new Date('2023-09-14'),
    };
    const expectedAvailableCars: Vehicle[] = [
      {
        make: 'Mitsubishi',
        model: 'Montero',
        vin: 'SAJWJ0FF3F8321657',
        price: '2814',
      },
    ];
    expect(service.getAvailableCars(searchFilter)).toEqual(
      expectedAvailableCars,
    );
  });

  it('should not return cars that are booked', () => {
    const searchFilter: VehicleSearchRequestDto = {
      make: 'Volkswagen',
      model: 'Passat',
      startDate: new Date('2023-09-19'),
      endDate: new Date('2023-09-21'),
    };
    expect(service.getAvailableCars(searchFilter)).toEqual([]);
  });
});
