import { IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';

export class insertExpenseDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  public amount: number;

  @IsNotEmpty()
  @Length(1, 20, { message: 'Title should be atleast contain 1 character' })
  public title: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  public userID: number;

  //   @IsNotEmpty()
  //   @Min(1)
  //   @IsString()
  //   public token: string;
}

export class editExpenseDto {
  @IsNotEmpty() title;
  @IsNumber()
  @Min(0)
  public amount: number;

  @IsNotEmpty()
  @Length(1, 20, { message: 'Title should be atleast contain 1 character' })
  public: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  public userID: number;

  //   @IsNotEmpty()
  //   @Min(1)
  //   @IsString()
  //   public token: string;
}
