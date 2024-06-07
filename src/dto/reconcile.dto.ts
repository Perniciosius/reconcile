import { IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';

export class ReconcileDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;
}
