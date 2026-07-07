const CarRepository = require('../../domain/car/CarRepository');
const Car = require('../../domain/car/Car');
const carsData = require('../data/cars');

class InMemoryCarRepository extends CarRepository {
  constructor() {
    super();
    this.cars = carsData.map((c) => new Car(c));
  }

  findAll() {
    return this.cars;
  }

  findById(id) {
    return this.cars.find((c) => c.id === id) || null;
  }
}

module.exports = InMemoryCarRepository;
