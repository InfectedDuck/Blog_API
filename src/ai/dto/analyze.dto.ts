import { IsInt, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnalyzeDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  postId: number;

  @ApiProperty({
    enum: ['emotional-support', 'writing-feedback', 'topic-insights', 'content-summary'],
    example: 'writing-feedback',
  })
  @IsString()
  @IsIn(['emotional-support', 'writing-feedback', 'topic-insights', 'content-summary'])
  mode: string;
}
