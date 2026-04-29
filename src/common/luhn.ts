export function luhn(cardNumber: string): boolean {
  let sum = 0;
  let shouldDouble = false;

  // Remove any spaces from the string
  cardNumber = cardNumber.replace(/\s/g, '');

  // Iterate through each digit from right to left
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  // The number is valid if the sum is divisible by 10
  return sum % 10 === 0;
}