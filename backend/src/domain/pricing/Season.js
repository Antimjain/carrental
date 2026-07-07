const PEAK = 'peak';
const MID = 'mid';
const OFF = 'off';

// Seasons are defined by the day of the year, not by a concrete year.
// peak: 1 Jun - 15 Sep
// mid:  1 Mar - 31 May and 16 Sep - 31 Oct
// off:  1 Nov - end of Feb
function seasonForDate(date) {
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  if (month >= 6 && month <= 8) return PEAK;
  if (month === 9 && day <= 15) return PEAK;

  if (month >= 3 && month <= 5) return MID;
  if (month === 9 && day >= 16) return MID;
  if (month === 10) return MID;

  return OFF;
}

module.exports = { PEAK, MID, OFF, seasonForDate };
