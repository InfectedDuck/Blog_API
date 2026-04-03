import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../src/auth/auth.module';
import { UsersModule } from '../src/users/users.module';
import { PostsModule } from '../src/posts/posts.module';
import { CommentsModule } from '../src/comments/comments.module';
import { TagsModule } from '../src/tags/tags.module';
import { LikesModule } from '../src/likes/likes.module';
import { User } from '../src/users/entities/user.entity';
import { Post } from '../src/posts/entities/post.entity';
import { Comment } from '../src/comments/entities/comment.entity';
import { Tag } from '../src/tags/entities/tag.entity';
import { Like } from '../src/likes/entities/like.entity';
import { DataSource } from 'typeorm';

describe('Blog CMS API (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let authorToken: string;
  let readerToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          entities: [User, Post, Comment, Tag, Like],
          synchronize: true,
          dropSchema: true,
        }),
        AuthModule,
        UsersModule,
        PostsModule,
        CommentsModule,
        TagsModule,
        LikesModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    it('POST /api/auth/register - should register a user', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email: 'admin@test.com', username: 'admin', password: 'password123' })
        .expect(201);

      expect(res.body.accessToken).toBeDefined();
      expect(res.body.user.email).toBe('admin@test.com');
      adminToken = res.body.accessToken;
    });

    it('POST /api/auth/register - should register an author', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email: 'author@test.com', username: 'author', password: 'password123' })
        .expect(201);

      authorToken = res.body.accessToken;
    });

    it('POST /api/auth/register - should register a reader', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email: 'reader@test.com', username: 'reader', password: 'password123' })
        .expect(201);

      readerToken = res.body.accessToken;
    });

    it('POST /api/auth/register - should reject duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email: 'admin@test.com', username: 'admin2', password: 'password123' })
        .expect(409);
    });

    it('POST /api/auth/login - should login', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'admin@test.com', password: 'password123' })
        .expect(201);

      expect(res.body.accessToken).toBeDefined();
    });

    it('POST /api/auth/login - should reject wrong password', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'admin@test.com', password: 'wrongpassword' })
        .expect(401);
    });

    it('GET /api/auth/profile - should return profile', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.email).toBe('admin@test.com');
    });

    it('GET /api/auth/profile - should reject without token', async () => {
      await request(app.getHttpServer())
        .get('/api/auth/profile')
        .expect(401);
    });
  });

  describe('Users (admin)', () => {
    beforeAll(async () => {
      // Promote user 1 to admin via direct DB update
      const ds = app.get(DataSource);
      const userRepo = ds.getRepository(User);
      await userRepo.update({ id: 1 }, { role: 'admin' });

      // Re-login to get new token with admin role
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'admin@test.com', password: 'password123' });
      adminToken = res.body.accessToken;

      // Promote user 2 to author
      await userRepo.update({ id: 2 }, { role: 'author' });
      const res2 = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'author@test.com', password: 'password123' });
      authorToken = res2.body.accessToken;
    });

    it('GET /api/users - admin can list users', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.length).toBeGreaterThanOrEqual(3);
      expect(res.body.meta).toBeDefined();
    });

    it('GET /api/users - reader cannot list users', async () => {
      await request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${readerToken}`)
        .expect(403);
    });

    it('PATCH /api/users/:id/role - admin can change role', async () => {
      const res = await request(app.getHttpServer())
        .patch('/api/users/3/role')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'author' })
        .expect(200);

      expect(res.body.role).toBe('author');
    });
  });

  describe('Tags', () => {
    it('POST /api/tags - admin can create tag', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/tags')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'TypeScript' })
        .expect(201);

      expect(res.body.name).toBe('TypeScript');
      expect(res.body.slug).toBe('typescript');
    });

    it('POST /api/tags - reader cannot create tag', async () => {
      await request(app.getHttpServer())
        .post('/api/tags')
        .set('Authorization', `Bearer ${readerToken}`)
        .send({ name: 'JavaScript' })
        .expect(403);
    });

    it('GET /api/tags - anyone can list tags', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/tags')
        .expect(200);

      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Posts', () => {
    let postId: number;
    let postSlug: string;

    it('POST /api/posts - author can create post', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/posts')
        .set('Authorization', `Bearer ${authorToken}`)
        .send({
          title: 'My First Post',
          content: 'Hello world content here',
          status: 'published',
          tagIds: [1],
        })
        .expect(201);

      expect(res.body.title).toBe('My First Post');
      expect(res.body.slug).toBe('my-first-post');
      postId = res.body.id;
      postSlug = res.body.slug;
    });

    it('POST /api/posts - reader cannot create post', async () => {
      await request(app.getHttpServer())
        .post('/api/posts')
        .set('Authorization', `Bearer ${readerToken}`)
        .send({ title: 'Nope', content: 'Not allowed' })
        .expect(403);
    });

    it('GET /api/posts - should list published posts', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/posts')
        .expect(200);

      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.meta).toBeDefined();
    });

    it('GET /api/posts?search=First - should search posts', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/posts?search=First')
        .expect(200);

      expect(res.body.data.length).toBe(1);
    });

    it('GET /api/posts?tag=typescript - should filter by tag', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/posts?tag=typescript')
        .expect(200);

      expect(res.body.data.length).toBe(1);
    });

    it('GET /api/posts/:slug - should get post by slug', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/posts/${postSlug}`)
        .expect(200);

      expect(res.body.title).toBe('My First Post');
      expect(res.body.tags).toBeDefined();
    });

    it('PATCH /api/posts/:id - author can update own post', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${authorToken}`)
        .send({ title: 'Updated Title' })
        .expect(200);

      expect(res.body.title).toBe('Updated Title');
    });

    it('PATCH /api/posts/:id - reader cannot update post', async () => {
      await request(app.getHttpServer())
        .patch(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${readerToken}`)
        .send({ title: 'Nope' })
        .expect(403);
    });
  });

  describe('Comments', () => {
    let commentId: number;

    it('POST /api/posts/1/comments - auth user can comment', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/posts/1/comments')
        .set('Authorization', `Bearer ${readerToken}`)
        .send({ body: 'Great article!' })
        .expect(201);

      expect(res.body.body).toBe('Great article!');
      commentId = res.body.id;
    });

    it('POST /api/posts/1/comments - unauthenticated cannot comment', async () => {
      await request(app.getHttpServer())
        .post('/api/posts/1/comments')
        .send({ body: 'Nope' })
        .expect(401);
    });

    it('GET /api/posts/1/comments - should list comments', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/posts/1/comments')
        .expect(200);

      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('PATCH /api/comments/:id - owner can update', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/comments/${commentId}`)
        .set('Authorization', `Bearer ${readerToken}`)
        .send({ body: 'Updated comment' })
        .expect(200);

      expect(res.body.body).toBe('Updated comment');
    });

    it('DELETE /api/comments/:id - admin can delete any comment', async () => {
      await request(app.getHttpServer())
        .delete(`/api/comments/${commentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });
  });

  describe('Validation', () => {
    it('should reject invalid registration data', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email: 'not-an-email', username: 'ab', password: '12' })
        .expect(400);
    });

    it('should reject empty post body', async () => {
      await request(app.getHttpServer())
        .post('/api/posts')
        .set('Authorization', `Bearer ${authorToken}`)
        .send({})
        .expect(400);
    });
  });
});
