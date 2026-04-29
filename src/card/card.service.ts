import { Injectable } from '@nestjs/common';
import { luhn } from '../common/luhn';

type CardType = 'Visa' | 'Mastercard' | 'Verve' | 'Amex' | 'Discover' | 'Unknown';

function detectCardType(cardNumber: string): CardType {
  if (/^4/.test(cardNumber)) return 'Visa';
  if (/^(5[1-5]|2(2[2-9][1-9]|[3-6]\d{2}|7[01]\d|720))/.test(cardNumber)) return 'Mastercard';
  if (/^(5061|6500|6501|6502|650)/.test(cardNumber)) return 'Verve';
  if (/^3[47]/.test(cardNumber)) return 'Amex';
  if (/^(6011|65)/.test(cardNumber)) return 'Discover';
  return 'Unknown';
}

const VALID_LENGTHS: Record<CardType, number[]> = {
  Visa: [13, 16],
  Mastercard: [16],
  Verve: [16, 18, 19],
  Amex: [15],
  Discover: [16],
  Unknown: [13, 14, 15, 16, 17, 18, 19],
};

@Injectable()
export class CardService {
  validateCard(cardNumber: string): {
    valid: boolean;
    message: string;
    cardType: CardType;
  } {
    const cardType = detectCardType(cardNumber);
    const validLengths = VALID_LENGTHS[cardType];

    if (!validLengths.includes(cardNumber.length)) {
      return {
        valid: false,
        message: 'Card number is incomplete',
        cardType,
      };
    }

    const valid = luhn(cardNumber);
    return {
      valid,
      message: valid ? 'Card number is valid' : 'Card number is not valid',
      cardType,
    };
  }
}