<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory; // Importáld a HasFactory trait-et

class Brand extends Model
{
    use HasFactory; // Használhatod a HasFactory trait-et

    protected $fillable = [
        'label',
    ];

    /**
     * Egy márkához több autó is tartozhat.
     */
    public function cars()
    {
        return $this->hasMany(Car::class);
    }
}
