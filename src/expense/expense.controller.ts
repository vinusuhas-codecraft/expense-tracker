// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
// } from '@nestjs/common';
// import { ExpenseService } from './expense.service';
// import { expenseDto } from './dto/expense.dto';

// @Controller('expense')
// export class ExpenseController {
//   constructor(private readonly expenseService: ExpenseService) {}

//   @Post()
//   create(@Body() dto: expenseDto) {
//     return this.expenseService.create(dto);
//   }

//   @Get()
//   findAll() {
//     return this.expenseService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.expenseService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() dto: expenseDto) {
//     return this.expenseService.update(+id, dto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.expenseService.delete(+id);
//   }
// }
