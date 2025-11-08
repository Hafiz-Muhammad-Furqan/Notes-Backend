import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api/notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @UseGuards(AuthGuard)
  @Post('/create')
  async create(@Body() createNoteDto: CreateNoteDto, @Request() req) {
    return await this.noteService.create(createNoteDto, req.user);
  }

  @UseGuards(AuthGuard)
  @Get('/all')
  findAll(@Request() req) {
    return this.noteService.findAll(req.user);
  }

  @UseGuards(AuthGuard)
  @Get('find/:id')
  findOne(@Param('id') id: string) {
    return this.noteService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.noteService.update(+id, updateNoteDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.noteService.remove(+id);
  }
}
