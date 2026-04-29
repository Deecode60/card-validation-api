# Card Validation API

A REST API that validates card numbers using the Luhn algorithm. Built with Node.js, TypeScript, and NestJS.

## Tech Stack

- Node.js
- TypeScript (strict mode)
- NestJS
- Jest

## Getting Started

### Prerequisites

- Node.js v20 or higher
- npm

### Installation

```bash
git clone https://github.com/Deecode60/card-validation-api.git
cd card-validation-api
npm install
```

### Running the API

```bash
npm run start:dev
```

The server starts on `http://localhost:3000`

### Running Tests

```bash
npm run test
```

## API Reference

### POST /card/validate

Validates a card number using the Luhn algorithm and detects the card type.

**Request body:**
```json
{
  "cardNumber": "4111111111111111"
}
```

**Successful response (200):**
```json
{
  "valid": true,
  "message": "Card number is valid",
  "cardType": "Visa"
}
```

**Invalid card response (200):**
```json
{
  "valid": false,
  "message": "Card number is not valid",
  "cardType": "Mastercard"
}
```

**Incomplete card response (200):**
```json
{
  "valid": false,
  "message": "Card number is incomplete",
  "cardType": "Verve"
}
```

**Bad input response (400):**
```json
{
  "statusCode": 400,
  "message": ["Card number must contain only digits"],
  "error": "Bad Request"
}
```

## Validation Rules

- Must be a string of digits only — no spaces or letters
- Must be between 13 and 19 digits
- Must pass the Luhn checksum

## Supported Card Types

| Type | Prefix | Length |
|------|--------|--------|
| Visa | 4 | 13, 16 |
| Mastercard | 51–55, 2221–2720 | 16 |
| Verve | 5061, 650x | 16, 18, 19 |
| Amex | 34, 37 | 15 |
| Discover | 6011, 65 | 16 |

## Design Decisions

**Why NestJS over Express?**
NestJS enforces a modular structure out of the box which makes the codebase easier to navigate and maintain. For a project being assessed on code organisation, it made more sense than manually structuring an Express app.

**Why Luhn algorithm?**
It is the industry standard for card number validation used by every major card network. It catches most accidental input errors efficiently without needing network calls.

**Why return 200 for invalid cards?**
The request itself succeeded — the server received it, processed it, and returned a result. An invalid card is a business outcome, not an HTTP error. 400 is reserved for malformed requests (missing fields, non-numeric input).

**Why not return the card number in the response?**
Card numbers are sensitive financial data. Echoing them back in the response is a security risk and serves no purpose since the client already has the number they submitted.



