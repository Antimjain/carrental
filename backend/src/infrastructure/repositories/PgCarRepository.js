const CarRepository = require('../../domain/car/CarRepository');
const Car = require('../../domain/car/Car');

// A NUMERIC column comes back from pg as a string, so turn the prices back
// into numbers and rebuild the same Car object the domain expects.
function toCar(row) {
  return new Car({
    id: row.id,
    brand: row.brand,
    model: row.model,
    stock: row.stock,
    prices: {
      peak: Number(row.price_peak),
      mid: Number(row.price_mid),
      off: Number(row.price_off)
    }
  });
}

class PgCarRepository extends CarRepository {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  async findAll() {
    const { rows } = await this.pool.query('SELECT * FROM cars ORDER BY id');
    return rows.map(toCar);
  }

  async findById(id) {
    const { rows } = await this.pool.query('SELECT * FROM cars WHERE id = $1', [id]);
    return rows[0] ? toCar(rows[0]) : null;
  }
}

module.exports = PgCarRepository;
