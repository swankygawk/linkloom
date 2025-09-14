import { IsUrl } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateLinkDto {
  @ApiProperty({
    description: 'The original long URL to be shortened',
    example: 'https://example.com',
  })
  @IsUrl()
  longUrl: string;
}
