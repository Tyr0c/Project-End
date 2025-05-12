<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->foreignId('brand_id')->constrained('brands')->onDelete('cascade'); 
            $table->string('model');
            $table->year('year');
            $table->decimal('price', 10, 2);
            $table->text('description')->nullable();
            $table->string('color');
            $table->enum('transmission', ['manual', 'automatic']);
            $table->enum('fuel_type', ['gasoline', 'diesel', 'electric', 'hybrid'])->default('gasoline');
            $table->enum('status', ['approved', 'not approved'])->default('not approved');
            $table->integer('doors');  
            $table->integer('total_weight');
            $table->integer('trunk_capacity');   
            $table->integer('power'); 
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
