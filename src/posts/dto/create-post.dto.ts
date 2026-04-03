import { IsString, IsOptional, IsArray, IsInt, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'Getting Started with NestJS' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'NestJS is a progressive Node.js framework...' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ example: 'A brief introduction to NestJS' })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiPropertyOptional({ enum: ['draft', 'published'], default: 'draft' })
  @IsOptional()
  @IsIn(['draft', 'published'])
  status?: string;

  @ApiPropertyOptional({ example: [1, 2], type: [Number] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tagIds?: number[];

  @ApiPropertyOptional({ example: ['typescript', 'backend'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagNames?: string[];
}
