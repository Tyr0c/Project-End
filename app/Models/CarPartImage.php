<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CarPartImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'car_part_id',
        'image_url',
    ];

    public function carPart()
    {
        return $this->belongsTo(CarPart::class);
    }
}