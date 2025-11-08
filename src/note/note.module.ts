import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from './schemas/note.schema';
import { UserModule } from 'src/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
  ],
  controllers: [NoteController],
  providers: [
    NoteService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class NoteModule {}
