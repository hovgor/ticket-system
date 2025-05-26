// create-request.dto.ts
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRequestDto {
  @ApiProperty({ example: 'Проблема с сайтом', description: 'Тема обращения' })
  @IsString()
  subject: string;

  @ApiProperty({ example: 'Не работает форма обратной связи', description: 'Текст обращения' })
  @IsString()
  message: string;
}
