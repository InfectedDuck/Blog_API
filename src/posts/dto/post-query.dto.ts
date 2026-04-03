import { IsOptional, IsString, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';

export class PostQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Search in title and content' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by tag slug' })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({ description: 'Filter by author ID' })
  @IsOptional()
  @IsInt()
  authorId?: number;

  @ApiPropertyOptional({ enum: ['draft', 'published'], description: 'Filter by status (admin/author only)' })
  @IsOptional()
  @IsString()
  status?: string;
}
