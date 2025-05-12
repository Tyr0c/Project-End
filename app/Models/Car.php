<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Car extends Model
{
    use HasFactory;

    protected $fillable = [
        'brand_id',
        'model',
        'year',
        'price',
        'description',
        'color',
        'transmission',
        'fuel_type',
        'status',
        'doors',
        'total_weight',
        'trunk_capacity',
        'power',
    ];

    public function images(): HasMany
    {
        return $this->hasMany(CarImage::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class, 'brand_id');
    }
}
