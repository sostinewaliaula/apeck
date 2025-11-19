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
  @IsOptional()
  churchName?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  titleOther?: string;

  @IsString()
  @IsOptional()
  referralName?: string;

  @IsString()
  @IsOptional()
  referralApeckNumber?: string;

  @IsString()
  @IsOptional()
  referralPhone?: string;

  @IsString()
  @IsOptional()
  signature?: string;

  @IsString()
  @IsOptional()
  declarationDate?: string;

  @IsString()
  @IsOptional()
  organizationName?: string;

  @IsString()
  @IsOptional()
  organizationRegistrationNumber?: string;

  @IsString()
  @IsOptional()
  organizationKraPin?: string;

  @IsString()
  @IsOptional()
  headquartersLocation?: string;

  @IsEmail()
  @IsOptional()
  organizationEmail?: string;

  @IsString()
  @IsOptional()
  organizationPhone?: string;

  @IsString()
  @IsOptional()
  chairpersonName?: string;

  @IsString()
  @IsOptional()
  chairpersonIdNumber?: string;

  @IsString()
  @IsOptional()
  chairpersonKraPin?: string;

  @IsString()
  @IsOptional()
  chairpersonPhone?: string;

  @IsEmail()
  @IsOptional()
  chairpersonEmail?: string;

  @IsString()
  @IsOptional()
  secretaryName?: string;

  @IsString()
  @IsOptional()
  secretaryIdNumber?: string;

  @IsString()
  @IsOptional()
  secretaryKraPin?: string;

  @IsString()
  @IsOptional()
  secretaryPhone?: string;

  @IsEmail()
  @IsOptional()
  secretaryEmail?: string;

  @IsString()
  @IsOptional()
  treasurerName?: string;

  @IsString()
  @IsOptional()
  treasurerIdNumber?: string;

  @IsString()
  @IsOptional()
  treasurerKraPin?: string;

  @IsString()
  @IsOptional()
  treasurerPhone?: string;

  @IsEmail()
  @IsOptional()
  treasurerEmail?: string;

  @IsString()
  @IsOptional()
  paymentReference?: string;

  @IsString()
  @IsOptional()
  paymentGateway?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  amountPaid?: number;

  @IsString()
  @IsNotEmpty()
  membershipTier: string;
}

