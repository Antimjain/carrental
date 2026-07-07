const { seasonForDate } = require('./Season');

function round(value) {
  return Math.round(value * 100) / 100;
}

class PriceCalculator {
  totalPrice(car, startDate, endDate) {
    let total = 0;
    const day = new Date(startDate);
    while (day < endDate) {
      total += car.prices[seasonForDate(day)];
      day.setUTCDate(day.getUTCDate() + 1);
    }
    return round(total);
  }

  averageDayPrice(total, startDate, endDate) {
    const days = this.daysBetween(startDate, endDate);
    if (days === 0) return 0;
    return round(total / days);
  }

  daysBetween(startDate, endDate) {
    return Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
  }
}

module.exports = PriceCalculator;
