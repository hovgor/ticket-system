// cancel-request.dto.ts
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CancelRequestDto {
  @ApiProperty({ example: 'Проблема утратила актуальность', description: 'Причина отмены' })
  @IsString()
  cancelReason: string;
}
