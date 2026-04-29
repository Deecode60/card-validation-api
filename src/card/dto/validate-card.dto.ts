import { IsNotEmpty, IsString, Matches, MinLength, MaxLength } from 'class-validator';

export class ValidateCardDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(13, { message: 'cardNumber is incomplete.'} )
  @MaxLength(19)
  @Matches(/^\d+$/, { message: 'cardNumber must contain only digits.' })
  cardNumber!: string;
}