import { IsOptional, IsString, IsBoolean, IsIn, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  displayName?: string;

  @ApiPropertyOptional({ example: 'I love writing about tech' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  bio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  darkMode?: boolean;

  @ApiPropertyOptional({ enum: ['pink', 'blue', 'lavender', 'mint'] })
  @IsOptional()
  @IsString()
  @IsIn(['pink', 'blue', 'lavender', 'mint'])
  accentColor?: string;
}
