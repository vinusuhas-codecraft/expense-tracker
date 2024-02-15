import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class createAdddressDto {
  @IsString()
  @IsNotEmpty()
  public location: string;

  @IsString()
  @IsNotEmpty()
  public city: string;

  @IsString()
  @IsNotEmpty()
  public state: string;

  @IsNumber()
  @IsNotEmpty()
  public pincode: number;
}
