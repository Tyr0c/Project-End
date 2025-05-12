<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CarPart>
 */
class CarPartFactory extends Factory
{
    public function definition(): array
    {
        $brands = [
            'Toyota', 'Honda', 'Ford', 'BMW', 'Audi', 'Mercedes-Benz',
            'Volkswagen', 'Chevrolet', 'Nissan', 'Hyundai',
            'Kia', 'Peugeot', 'Renault', 'Skoda', 'Mazda',
            'Subaru', 'Volvo', 'Jeep', 'Fiat', 'Porsche'
        ];

        return [
            'name' => $this->faker->word(),
            'car_model' => $this->faker->randomElement($brands),
            'price' => $this->faker->numberBetween(50, 1000),
            'description' => $this->faker->sentence(),
            'stock_quantity' => $this->faker->numberBetween(1, 100),
        ];
    }
}
