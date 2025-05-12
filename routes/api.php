<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\CarImageController;
use App\Http\Controllers\PartController;
use App\Http\Controllers\PartImageController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\BrandController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/users', [UserController::class, 'index']);
Route::middleware('auth:sanctum')->put('/users/{id}', [UserController::class, 'update']);
Route::middleware('auth:sanctum')->delete('/users/{id}', [UserController::class, 'destroy']);


Route::get('/brands', [BrandController::class, 'index']);


Route::get('/cars', [CarController::class, 'index']);
Route::middleware('auth:sanctum')->post('/cars', [CarController::class, 'store']);
Route::middleware('auth:sanctum')->delete('/cars/{id}', [CarController::class, 'destroy']);
Route::middleware('auth:sanctum')->put('/cars/{id}', [CarController::class, 'update']);


Route::get('/carsimage', [CarImageController::class, 'index']);

Route::get('/parts', [PartController::class, 'index']);
Route::middleware('auth:sanctum')->post('/parts', [PartController::class, 'store']);
Route::middleware('auth:sanctum')->put('/parts/{id}', [PartController::class, 'update']);
Route::middleware('auth:sanctum')->delete('/parts/{id}', [PartController::class, 'destroy']);

Route::get('/partsimage', [PartImageController::class, 'index']);


Route::post('/login', [UserController::class, 'login'])->middleware('throttle:5,1');
Route::middleware('auth:sanctum')->post('/logout', [UserController::class, 'logout']);
Route::post('/register', [UserController::class, 'register'])->middleware('throttle:10,1');

