import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
} from 'class-validator';

export enum RecipientType {
  MEMBERSHIP = 'membership',
  GENERAL = 'general',
}

export class CreateEmailRecipientDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(RecipientType)
  @IsNotEmpty()
  type: RecipientType;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  displayOrder?: number;
}
