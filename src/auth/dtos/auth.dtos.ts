import {
  IsEmail,
  IsString,
  Length,
  IsNotEmpty,
  Matches,
  MinLength,
  IsOptional,
} from 'class-validator';
export class signInDto {
  @IsNotEmpty()
  @IsEmail()
  public email: string;
  // @IsNotEmpty()
  // public username: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'password has to be at between 3 and 20 chars' })
  public password: string;
}

export class registerDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;

  @IsString()
  @MinLength(3)
  @Matches(/^[a-zA-Z]/, {
    message: 'username should always start with alphabet',
  })
  name: string;

  @IsString()
  @MinLength(4)
  username: string;

  @IsString()
  @IsOptional()
  image: string;
}
