import { IsString, IsEmail, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateMembershipApplicationDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  idNumber: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  county: string;

  @IsString()
  @IsOptional()
  subCounty?: string;

  @IsString()
  @IsOptional()
  ward?: string;

  @IsString()
  @IsOptional()
  diasporaCountry?: string;

  @IsString()
  @IsOptional()
  mpesaCode?: string;

  @IsString()
  @IsNotEmpty()
  paymentReference: string;

  @IsString()
  @IsNotEmpty()
  paymentGateway: string;

  @IsNumber()
  @Min(0)
  amountPaid: number;

  @IsString()
  @IsNotEmpty()
  membershipTier: string;
}

