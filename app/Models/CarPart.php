<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CarPart extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'car_model',
        'price',
        'description',
        'stock_quantity',
    ];

    public function images()
    {
        return $this->hasMany(CarPartImage::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}