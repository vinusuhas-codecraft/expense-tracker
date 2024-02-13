import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { editExpenseDto, insertExpenseDto } from './dto/expense.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('expense')
@UseGuards(AuthGuard('localStrategy'))
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  create(@Body() dto: insertExpenseDto) {
    return this.expenseService.insert(dto);
  }

  @Get()
  findAll() {
    return this.expenseService.findAll({ id: 3 });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expenseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: editExpenseDto) {
    return this.expenseService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expenseService.delete(+id);
  }
}
