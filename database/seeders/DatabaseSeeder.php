<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Car;
use App\Models\CarImage;
use App\Models\CarPart;
use App\Models\CarPartImage;
use App\Models\Review;
use App\Models\Brand;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $brands = [
            'Toyota', 'Honda', 'Ford', 'BMW', 'Audi', 'Mercedes-Benz',
            'Volkswagen', 'Chevrolet', 'Nissan', 'Hyundai',
            'Kia', 'Peugeot', 'Renault', 'Skoda', 'Mazda',
            'Subaru', 'Volvo', 'Jeep', 'Fiat', 'Porsche'
        ];
    
        foreach ($brands as $brand) {
            Brand::create(['label' => $brand]);
        }
    
        // Egy admin user fix emaillel
        User::create([
            'name' => 'Test User',
            'email' => 'teszt@gmail.com',
            'password' => Hash::make('asd123'),
            'role' => 'admin',
        ]);
    
        // További adminok
        User::factory()->count(9)->create(['role' => 'admin']);
    
        // 40 sima felhasználó
        User::factory()->count(40)->create(['role' => 'user']);
    
        // 200 autó véletlenszerű márkákkal
        Car::factory()->count(200)->create([
            'brand_id' => fn () => Brand::inRandomOrder()->first()->id,
        ])->each(function ($car) {
            CarImage::factory()->count(rand(2, 4))->create(['car_id' => $car->id]);
        });
    
        // Alkatrészek képekkel
        CarPart::factory()->count(20)->create()->each(function ($part) {
            CarPartImage::factory()->count(2)->create(['car_part_id' => $part->id]);
        });
    }
}
