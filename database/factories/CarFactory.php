<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Brand;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Car>
 */
class CarFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'brand_id' => Brand::inRandomOrder()->first()->id,
            'model' => $this->faker->word(),
            'year' => $this->faker->numberBetween(2000, 2023),
            'price' => $this->faker->randomFloat(2, 2000, 50000),
            'description' => $this->faker->sentence(),
            'color' => $this->faker->safeColorName(),
            'transmission' => $this->faker->randomElement(['manual', 'automatic']),
            'fuel_type' => $this->faker->randomElement(['gasoline', 'diesel', 'electric', 'hybrid']),
            'status' => $this->faker->randomElement(['approved', 'not approved']),
            'doors' => $this->faker->numberBetween(2, 5),
            'total_weight' => $this->faker->numberBetween(800, 3500),    
            'trunk_capacity' => $this->faker->numberBetween(200, 800),       
            'power' => $this->faker->numberBetween(70, 400),                  
        ];
    }
}
