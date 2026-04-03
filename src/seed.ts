import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { AppModule } from './app.module.js';
import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity.js';
import { Tag } from './tags/entities/tag.entity.js';
import { Post } from './posts/entities/post.entity.js';
import { Comment } from './comments/entities/comment.entity.js';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const ds = app.get(DataSource);

  const userRepo = ds.getRepository(User);
  const tagRepo = ds.getRepository(Tag);
  const postRepo = ds.getRepository(Post);
  const commentRepo = ds.getRepository(Comment);

  // Create users
  const password = await bcrypt.hash('password123', 10);

  const admin = await userRepo.save(
    userRepo.create({ email: 'admin@blog.com', username: 'admin', password, role: 'admin', bio: 'Platform administrator' }),
  );

  const author1 = await userRepo.save(
    userRepo.create({ email: 'alice@blog.com', username: 'alice', password, role: 'author', bio: 'Tech writer and TypeScript enthusiast' }),
  );

  const author2 = await userRepo.save(
    userRepo.create({ email: 'bob@blog.com', username: 'bob', password, role: 'author', bio: 'Backend developer sharing knowledge' }),
  );

  const reader = await userRepo.save(
    userRepo.create({ email: 'charlie@blog.com', username: 'charlie', password, role: 'reader', bio: 'Avid reader' }),
  );

  // Create tags
  const typescript = await tagRepo.save(tagRepo.create({ name: 'TypeScript', slug: 'typescript' }));
  const nestjs = await tagRepo.save(tagRepo.create({ name: 'NestJS', slug: 'nestjs' }));
  const nodejs = await tagRepo.save(tagRepo.create({ name: 'Node.js', slug: 'nodejs' }));
  const api = await tagRepo.save(tagRepo.create({ name: 'API Design', slug: 'api-design' }));
  const testing = await tagRepo.save(tagRepo.create({ name: 'Testing', slug: 'testing' }));

  // Create posts
  const post1 = await postRepo.save(
    postRepo.create({
      title: 'Getting Started with NestJS',
      slug: 'getting-started-with-nestjs',
      content: 'NestJS is a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. It uses TypeScript by default and combines elements of OOP, FP, and FRP.\n\nIn this guide, we will walk through setting up a new NestJS project, understanding modules, controllers, and services, and building your first REST API endpoint.',
      excerpt: 'A comprehensive introduction to the NestJS framework',
      status: 'published',
      publishedAt: new Date(),
      author: author1,
      tags: [nestjs, typescript, nodejs],
    }),
  );

  const post2 = await postRepo.save(
    postRepo.create({
      title: 'RESTful API Design Best Practices',
      slug: 'restful-api-design-best-practices',
      content: 'Designing a good REST API is crucial for developer experience. Here are key principles:\n\n1. Use nouns for resource URLs\n2. Use HTTP methods correctly\n3. Return proper status codes\n4. Implement pagination for collections\n5. Version your API\n6. Use consistent error responses\n\nFollowing these practices ensures your API is intuitive and maintainable.',
      excerpt: 'Key principles for designing clean and maintainable REST APIs',
      status: 'published',
      publishedAt: new Date(),
      author: author2,
      tags: [api, nodejs],
    }),
  );

  const post3 = await postRepo.save(
    postRepo.create({
      title: 'Testing Strategies for NestJS Applications',
      slug: 'testing-strategies-nestjs',
      content: 'Testing is essential for maintaining code quality. NestJS provides excellent testing utilities out of the box.\n\nUnit tests verify individual service methods with mocked dependencies. E2E tests spin up the full application and test complete request/response cycles.\n\nWe recommend using Jest with supertest for a comprehensive testing strategy.',
      excerpt: 'How to effectively test your NestJS applications',
      status: 'published',
      publishedAt: new Date(),
      author: author1,
      tags: [nestjs, testing, typescript],
    }),
  );

  await postRepo.save(
    postRepo.create({
      title: 'Advanced TypeORM Patterns (Draft)',
      slug: 'advanced-typeorm-patterns',
      content: 'Work in progress: This post will cover advanced TypeORM patterns including custom repositories, query builders, and migration strategies.',
      status: 'draft',
      author: author2,
      tags: [typescript, nodejs],
    }),
  );

  // Create comments
  await commentRepo.save(
    commentRepo.create({ body: 'Great introduction! This helped me get started with NestJS quickly.', post: post1, author: reader }),
  );

  await commentRepo.save(
    commentRepo.create({ body: 'Very clear explanation of the core concepts. Thanks!', post: post1, author: author2 }),
  );

  await commentRepo.save(
    commentRepo.create({ body: 'The pagination section was particularly useful for my project.', post: post2, author: reader }),
  );

  await commentRepo.save(
    commentRepo.create({ body: 'I would add that using OpenAPI/Swagger for documentation is also a best practice.', post: post2, author: author1 }),
  );

  await commentRepo.save(
    commentRepo.create({ body: 'The e2e testing approach described here saved me hours of debugging.', post: post3, author: reader }),
  );

  console.log('Seed data created successfully!');
  console.log('');
  console.log('Users (all passwords: "password123"):');
  console.log('  admin@blog.com   (admin)');
  console.log('  alice@blog.com   (author)');
  console.log('  bob@blog.com     (author)');
  console.log('  charlie@blog.com (reader)');

  await app.close();
}

seed();
