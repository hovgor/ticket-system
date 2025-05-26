// complete-request.dto.ts
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompleteRequestDto {
  @ApiProperty({ example: 'Проблема решена. Форма исправлена.', description: 'Решение проблемы' })
  @IsString()
  resolution: string;
}
