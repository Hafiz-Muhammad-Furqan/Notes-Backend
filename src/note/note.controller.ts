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

@Controller('api/notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post('/create')
  async create(@Body() createNoteDto: CreateNoteDto, @Request() req) {
    return await this.noteService.create(createNoteDto, req.user);
  }

  @Get('/all')
  findAll(@Request() req) {
    return this.noteService.findAll(req.user);
  }

  @Get('find/:id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.noteService.findOne(id, req.user.sub);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Request() req,
  ) {
    return this.noteService.update(id, updateNoteDto, req.user.sub);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string, @Request() req) {
    return this.noteService.remove(id, req.user.sub);
  }
}
