<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Car;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CarImage>
 */
class CarImageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'car_id' => Car::factory(),
            'image_url' => $this->faker->imageUrl(640, 480, 'cars'),
        ];
    }
}