import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './schemas/note.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from 'src/user/user.service';

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<Note>,
    private readonly userService: UserService,
  ) {}

  async create(
    createNoteDto: CreateNoteDto,
    reqUser: { email: string; sub: string },
  ) {
    const existingUser = await this.userService.getUserByEmail(reqUser.email);
    if (!existingUser) {
     throw new NotFoundException('User not found');
    }

    try {
      const createdNote = await this.noteModel.create({
        ...createNoteDto,
        userId: reqUser.sub,
      });

      return createdNote;
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return `This action returns all note`;
  }

  findOne(id: number) {
    return `This action returns a #${id} note`;
  }

  update(id: number, updateNoteDto: UpdateNoteDto) {
    return `This action updates a #${id} note`;
  }

  remove(id: number) {
    return `This action removes a #${id} note`;
  }
}
