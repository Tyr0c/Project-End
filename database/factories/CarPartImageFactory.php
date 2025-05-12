<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\CarPart;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CarPartImage>
 */
class CarPartImageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'car_part_id' => CarPart::factory(),
            'image_url' => $this->faker->imageUrl(640, 480, 'parts'),
        ];
    }
}