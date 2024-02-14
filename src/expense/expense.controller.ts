import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { editExpenseDto, insertExpenseDto } from './dto/expense.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('expense')
@UseGuards(JwtAuthGuard)
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post('/')
  async create(@Body() dto: insertExpenseDto, @Req() req) {
    return this.expenseService.insert(dto, req.user.userId);
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req) {
    return this.expenseService.findAll(req.user.userId);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @Req() req) {
    return this.expenseService.findOne(parseInt(id), req.user.userId);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: editExpenseDto,
    @Req() req,
  ) {
    return this.expenseService.update(parseInt(id), dto, req.user.userId);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Req() req) {
    return this.expenseService.delete(parseInt(id), req.user.userId);
  }
}
