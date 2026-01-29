import { IsArray, IsEnum, IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQuestionDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  type: string;

  @IsInt()
  @Type(() => Number)
  userId: number;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
