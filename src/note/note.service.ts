import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async findAll(reqUser: { email: string; sub: string }) {
    try {
      const notes = await this.noteModel.find({ userId: reqUser.sub });
      if (notes.length === 0) {
        throw new NotFoundException('No notes found for this user');
      }
      return notes;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string, sub: string) {
    try {
      const note = await this.noteModel.findById(id);
      if (!note) {
        throw new NotFoundException('No notes found ');
      }
      if (note.userId.toString() !== sub) {
        throw new ForbiddenException(
          'You do not have permission to access this note',
        );
      }

      return note;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateNoteDto: UpdateNoteDto, sub: string) {
    try {
      const note = await this.noteModel.findById(id);
      if (!note) {
        throw new NotFoundException('No notes found ');
      }
      if (note.userId.toString() !== sub) {
        throw new ForbiddenException(
          'You do not have permission to access this note',
        );
      }
      const updatedNote = await this.noteModel.findByIdAndUpdate(
        id,
        updateNoteDto,
        {
          new: true,
        },
      );

      return updatedNote;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string, sub: string) {
    try {
      const note = await this.noteModel.findById(id);
      if (!note) {
        throw new NotFoundException('No notes found ');
      }
      if (note.userId.toString() !== sub) {
        throw new ForbiddenException(
          'You do not have permission to access this note',
        );
      }
      const deletedNote = await this.noteModel.findByIdAndDelete(id);
      if (!deletedNote) {
        throw new NotFoundException('No notes found ');
      }
      return deletedNote;
    } catch (error) {
      throw error;
    }
  }
}
