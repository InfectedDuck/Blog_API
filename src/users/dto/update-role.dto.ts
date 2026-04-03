import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiProperty({ enum: ['admin', 'author', 'reader'], example: 'author' })
  @IsIn(['admin', 'author', 'reader'])
  role: string;
}
