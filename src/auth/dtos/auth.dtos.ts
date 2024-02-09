import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

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
}
