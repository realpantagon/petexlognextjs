// models/Rate.js
export class Rate {
    constructor(id, cur, currency, rate, flags) {
      this.id = id;
      this.cur = cur;
      this.currency = currency;
      this.rate = rate;
      this.flags = flags;
    }
  
    // Validate if the amount is a valid positive number
  static validateAmount(amount) {
    const amountWithoutCommas = amount.replace(/,/g, '');
    return amountWithoutCommas !== '' && parseFloat(amountWithoutCommas) > 0;
  }

  // Calculate the total (Rate * Amount)
  static calculateTotal(rate, amount) {
    const rateWithoutCommas = parseFloat(rate.replace(/,/g, ''));
    const amountWithoutCommas = parseFloat(amount.replace(/,/g, ''));
    return rateWithoutCommas * amountWithoutCommas;
  }
  }
  