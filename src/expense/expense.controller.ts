import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { editExpenseDto, insertExpenseDto } from './dto/expense.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AuthService } from 'src/auth/auth.service';

@Controller('expense')
@UseGuards(JwtAuthGuard)
export class ExpenseController {
  constructor(
    private authService: AuthService,
    private readonly expenseService: ExpenseService,
  ) {}

  @Post('/')
  async create(@Body() dto: insertExpenseDto, @Headers() headers) {
    const userId = await this.authService.validateToken(
      headers.authorization.split(' ')[1],
    );
    return this.expenseService.insert(dto, userId);
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findAll(@Headers() headers) {
    const userId = await this.authService.validateToken(
      headers.authorization.split(' ')[1],
    );
    return this.expenseService.findAll(userId);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @Headers() headers) {
    const userId = await this.authService.validateToken(
      headers.authorization.split(' ')[1],
    );
    return this.expenseService.findOne(parseInt(id), userId);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: editExpenseDto,
    @Headers() headers,
  ) {
    const userId = await this.authService.validateToken(
      headers.authorization.split(' ')[1],
    );
    return this.expenseService.update(parseInt(id), dto, userId);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Headers() headers) {
    const userId = await this.authService.validateToken(
      headers.authorization.split(' ')[1],
    );
    return this.expenseService.delete(parseInt(id), userId);
  }
}
