import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAnswerDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  questionId: number;

  @IsOptional()
  @IsNumber()
  parentAnswerId?: number;
}
