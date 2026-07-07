const { seasonForDate, PEAK, MID, OFF } = require('../src/domain/pricing/Season');

describe('Season resolution', () => {
  it('treats mid June as peak season', () => {
    expect(seasonForDate(new Date('2026-06-15'))).toBe(PEAK);
  });

  it('treats the 15th of September as the last peak day', () => {
    expect(seasonForDate(new Date('2026-09-15'))).toBe(PEAK);
  });

  it('treats the 16th of September as mid season', () => {
    expect(seasonForDate(new Date('2026-09-16'))).toBe(MID);
  });

  it('treats April as mid season', () => {
    expect(seasonForDate(new Date('2026-04-10'))).toBe(MID);
  });

  it('treats January as off season', () => {
    expect(seasonForDate(new Date('2026-01-20'))).toBe(OFF);
  });

  it('treats the 1st of November as the first off day', () => {
    expect(seasonForDate(new Date('2026-11-01'))).toBe(OFF);
  });
});
