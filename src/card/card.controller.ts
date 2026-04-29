import { Body, Controller,HttpCode, Post } from '@nestjs/common';
import { CardService } from './card.service';
import { ValidateCardDto } from './dto/validate-card.dto';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post('validate')
  @HttpCode(200)
  validate(@Body() dto: ValidateCardDto) {
    return this.cardService.validateCard(dto.cardNumber);
  }
}
