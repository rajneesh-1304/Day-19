import { IsEnum, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { QuestionType } from './question.entity';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(QuestionType)
  @IsOptional()
  type?: QuestionType;

  userId: number;

  @IsOptional()
  tags?: string[]; 
}
