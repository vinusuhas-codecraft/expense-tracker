import { IsEmail, IsString, Length, IsNotEmpty } from 'class-validator';
export class signInDto {
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'password has to be at between 3 and 20 chars' })
  public password: string;
}
