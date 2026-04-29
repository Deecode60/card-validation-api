import { Injectable } from '@nestjs/common';
import { luhn } from '../common/luhn';

@Injectable()
export class CardService {
  validateCard(cardNumber: string): { valid: boolean; cardNumber: string } {
    return {
      valid: luhn(cardNumber),
      cardNumber,
    };
  }
}
