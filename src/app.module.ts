import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { configModuleValidationSchema } from './configs/env-validation.config';
import { typeOrmModuleOptions } from './configs/database.config';
import { GroupsModule } from './modules/groups/groups.module';
// import { GroupChatsModule } from './group-chats/group-chats.module';
import { NoticesModule } from './modules/notices/notices.module';
import { PostsModule } from './modules/posts/posts.module';
import { SerizesModule } from './modules/serizes/serizes.module';
import { ImagesModule } from './modules/images/images.module';
import { CommentsModule } from './modules/comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configModuleValidationSchema,
    }),

    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    AuthModule,
    UsersModule,
    GroupsModule,
    // GroupChatsModule,
    NoticesModule,
    PostsModule,
    SerizesModule,
    ImagesModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
