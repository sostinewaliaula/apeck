import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendTestEmailDto {
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsOptional()
  subject?: string;
}
