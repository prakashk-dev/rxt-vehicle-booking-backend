import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class VechicleSearchRequestPipe<VehicleSearchRequestDto>
  implements PipeTransform<VehicleSearchRequestDto>
{
  async transform(
    searchRequest: VehicleSearchRequestDto,
    { metatype }: ArgumentMetadata,
  ) {
    // Check if the base type of the parameter (value) can be validated.
    if (!metatype || !this.toValidate(metatype)) {
      return searchRequest;
    }
    // Convert plain JavaScript object to typed object.
    const object = plainToClass(metatype, searchRequest);
    // Validate object using class-validator decorators defined in the DTO
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException(errors, 'Validation failed');
    }
    return searchRequest;
  }

  // Simple JavaScript types (given in the types array), don't need further validation.
  // A Class (DTO) can use class-validator library to define property level decorator-based validation.
  private toValidate(metatype: CallableFunction): boolean {
    const types: CallableFunction[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
