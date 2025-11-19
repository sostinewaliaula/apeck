import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEmail, IsString, IsEnum, IsBoolean, IsNumber } from 'class-validator';
import { CreateEmailRecipientDto, RecipientType } from './create-email-recipient.dto';

export class UpdateEmailRecipientDto extends PartialType(CreateEmailRecipientDto) {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(RecipientType)
  @IsOptional()
  type?: RecipientType;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  displayOrder?: number;
}

