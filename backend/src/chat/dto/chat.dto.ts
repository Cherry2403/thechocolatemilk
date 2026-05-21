import { IsString, IsOptional } from 'class-validator';

export class SendMessageDto {
  @IsString()
  message: string;

  @IsString()
  contactId: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
