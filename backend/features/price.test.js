const PriceCalculator = require('../src/domain/pricing/PriceCalculator');

const yaris = { prices: { peak: 98.43, mid: 76.89, off: 53.65 } };

describe('Price calculation', () => {
  const calculator = new PriceCalculator();

  it('charges the season day price for every day in the slot', () => {
    const total = calculator.totalPrice(yaris, new Date('2026-06-10'), new Date('2026-06-13'));
    expect(total).toBe(295.29); // 3 peak days
  });

  it('mixes season prices when the slot crosses a season change', () => {
    const total = calculator.totalPrice(yaris, new Date('2026-09-14'), new Date('2026-09-17'));
    expect(total).toBe(273.75); // 2 peak days + 1 mid day
  });

  it('returns the average price per day', () => {
    const avg = calculator.averageDayPrice(273.75, new Date('2026-09-14'), new Date('2026-09-17'));
    expect(avg).toBe(91.25);
  });
});
