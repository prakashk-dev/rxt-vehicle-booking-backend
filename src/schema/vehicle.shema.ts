import { Type } from 'class-transformer';
import { IsDate, IsDefined, IsOptional, IsString } from 'class-validator';

export interface Vehicle {
  make: string;
  model: string;
  vin: string;
  //   price is per year and in USD
  price: string;

  bookings?: Booking[];
}

export interface Booking {
  startDate: Date;
  endDate: Date;
  customerId: string;
}

export class VehicleSearchRequestDto {
  @IsOptional()
  @IsString()
  make?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsDefined()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDefined()
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsOptional()
  @IsString()
  minPrice?: string;

  @IsOptional()
  @IsString()
  maxPrice?: string;
}
