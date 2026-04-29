import { Test, TestingModule } from '@nestjs/testing';
import { CardService } from './card.service';

describe('CardService', () => {
  let service: CardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardService],
    }).compile();

    service = module.get<CardService>(CardService);
  });

  // ─── Valid card numbers ────────────────────────────────────────────────────

  describe('valid card numbers — returns valid: true and correct message', () => {
    it('accepts a valid 16-digit Visa card', () => {
      expect(service.validateCard('4111111111111111')).toEqual({
        valid: true,
        message: 'Card number is valid',
        cardType: 'Visa',
      });
    });

    it('accepts a valid 13-digit Visa card', () => {
      expect(service.validateCard('4222222222222')).toEqual({
        valid: true,
        message: 'Card number is valid',
        cardType: 'Visa',
      });
    });

    it('accepts a valid Mastercard', () => {
      expect(service.validateCard('5105105105105100')).toEqual({
        valid: true,
        message: 'Card number is valid',
        cardType: 'Mastercard',
      });
    });

    it('accepts a valid Verve card', () => {
      // 5061265061265066 — Luhn sum = 40
      expect(service.validateCard('5061265061265066')).toEqual({
        valid: true,
        message: 'Card number is valid',
        cardType: 'Verve',
      });
    });

    it('accepts a valid Amex card', () => {
      expect(service.validateCard('378282246310005')).toEqual({
        valid: true,
        message: 'Card number is valid',
        cardType: 'Amex',
      });
    });

    it('accepts a valid Discover card', () => {
      expect(service.validateCard('6011111111111117')).toEqual({
        valid: true,
        message: 'Card number is valid',
        cardType: 'Discover',
      });
    });

    it('accepts an Unknown card type that passes the Luhn check', () => {
      // 9123456789012348 — prefix 9 matches no known type; Luhn sum = 80
      expect(service.validateCard('9123456789012348')).toEqual({
        valid: true,
        message: 'Card number is valid',
        cardType: 'Unknown',
      });
    });
  });

  // ─── Invalid Luhn checksum ─────────────────────────────────────────────────

  describe('invalid card numbers — returns valid: false and correct message', () => {
    it('rejects a Visa with a bad Luhn checksum', () => {
      // 4111111111111112 — last digit changed so Luhn sum = 31
      expect(service.validateCard('4111111111111112')).toEqual({
        valid: false,
        message: 'Card number is not valid',
        cardType: 'Visa',
      });
    });

    it('rejects a Mastercard with a bad Luhn checksum', () => {
      // 5105105105105101 — last digit changed so Luhn sum = 21
      expect(service.validateCard('5105105105105101')).toEqual({
        valid: false,
        message: 'Card number is not valid',
        cardType: 'Mastercard',
      });
    });

    it('rejects a Verve card with a bad Luhn checksum', () => {
      // 5061265061265061 — Luhn sum = 35
      expect(service.validateCard('5061265061265061')).toEqual({
        valid: false,
        message: 'Card number is not valid',
        cardType: 'Verve',
      });
    });

    it('rejects an Unknown card type that fails the Luhn check', () => {
      // 9123456789012345 — Luhn sum = 77
      expect(service.validateCard('9123456789012345')).toEqual({
        valid: false,
        message: 'Card number is not valid',
        cardType: 'Unknown',
      });
    });
  });

  // ─── Incomplete card numbers ───────────────────────────────────────────────

  describe('incomplete card number for a detected type — returns Card number is incomplete', () => {
    it('rejects a Visa number with 12 digits (valid lengths: 13 or 16)', () => {
      expect(service.validateCard('411111111111')).toEqual({
        valid: false,
        message: 'Card number is incomplete',
        cardType: 'Visa',
      });
    });

    it('rejects a Mastercard number with 15 digits (valid length: 16)', () => {
      expect(service.validateCard('510510510510510')).toEqual({
        valid: false,
        message: 'Card number is incomplete',
        cardType: 'Mastercard',
      });
    });

    it('rejects a Verve number with 15 digits (valid lengths: 16, 18, 19)', () => {
      expect(service.validateCard('506126506126506')).toEqual({
        valid: false,
        message: 'Card number is incomplete',
        cardType: 'Verve',
      });
    });

    it('rejects an Amex number with 14 digits (valid length: 15)', () => {
      expect(service.validateCard('37828224631000')).toEqual({
        valid: false,
        message: 'Card number is incomplete',
        cardType: 'Amex',
      });
    });
  });

  // ─── Card type detection ───────────────────────────────────────────────────

  describe('card type detection', () => {
    it('detects Visa for a number starting with 4', () => {
      expect(service.validateCard('4111111111111111').cardType).toBe('Visa');
    });

    it('detects Mastercard for a number starting with 51–55', () => {
      expect(service.validateCard('5105105105105100').cardType).toBe('Mastercard');
    });

    it('detects Mastercard for a 2-series number (2720 prefix)', () => {
      // 2720 falls in the 2221–2720 Mastercard range
      expect(service.validateCard('2720000000000000').cardType).toBe('Mastercard');
    });

    it('detects Verve for a number starting with 5061', () => {
      expect(service.validateCard('5061265061265066').cardType).toBe('Verve');
    });

    it('detects Verve for a number starting with 650', () => {
      expect(service.validateCard('6503000000000000').cardType).toBe('Verve');
    });

    it('detects Amex for a number starting with 34', () => {
      expect(service.validateCard('341111111111111').cardType).toBe('Amex');
    });

    it('detects Amex for a number starting with 37', () => {
      expect(service.validateCard('378282246310005').cardType).toBe('Amex');
    });

    it('detects Discover for a number starting with 6011', () => {
      expect(service.validateCard('6011111111111117').cardType).toBe('Discover');
    });

    it('returns Unknown for a prefix that matches no known card scheme', () => {
      expect(service.validateCard('9123456789012348').cardType).toBe('Unknown');
    });
  });

  // ─── Unknown card type with valid length ───────────────────────────────────

  describe('Unknown card type with a valid length still processes correctly', () => {
    it('runs the Luhn check and returns valid: true when checksum passes', () => {
      const result = service.validateCard('9123456789012348');
      expect(result.cardType).toBe('Unknown');
      expect(result.valid).toBe(true);
      expect(result.message).toBe('Card number is valid');
    });

    it('runs the Luhn check and returns valid: false when checksum fails', () => {
      const result = service.validateCard('9123456789012345');
      expect(result.cardType).toBe('Unknown');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Card number is not valid');
    });
  });
});
