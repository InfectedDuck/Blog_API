import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { PostsModule } from './posts/posts.module.js';
import { CommentsModule } from './comments/comments.module.js';
import { TagsModule } from './tags/tags.module.js';
import { LikesModule } from './likes/likes.module.js';
import { AiModule } from './ai/ai.module.js';
import { FollowsModule } from './follows/follows.module.js';
import { BookmarksModule } from './bookmarks/bookmarks.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'blog.db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    TagsModule,
    LikesModule,
    AiModule,
    NotificationsModule,
    FollowsModule,
    BookmarksModule,
  ],
})
export class AppModule {}
