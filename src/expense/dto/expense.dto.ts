import { IsNotEmpty, IsNumber, Length, Min } from 'class-validator';

export class insertExpenseDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  public amount: number;

  @IsNotEmpty()
  @Length(1, 20, { message: 'Title should be atleast contain 1 character' })
  public title: string;
}

export class editExpenseDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  public amount: number;

  @IsNotEmpty()
  @Length(1, 20000, { message: 'Title should be atleast contain 1 character' })
  public title: string;
}
