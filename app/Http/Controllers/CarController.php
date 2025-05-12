<?php

namespace App\Http\Controllers;
use App\Models\Car;
use Illuminate\Http\Request;

class CarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $cars = Car::query()
            ->join('brands', 'cars.brand_id', '=', 'brands.id')
            ->when($request->filled('brand_id'), function ($query) use ($request) {
                $query->where('brands.id', $request->brand_id);  
            })
            ->select('cars.*', 'brands.label as brand_label') 
            ->get();
    
        return response()->json($cars);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'brand_id' => 'required|exists:brands,id',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:' . date('Y'),
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'color' => 'required|string|max:255',
            'transmission' => 'required|in:manual,automatic',
            'fuel_type' => 'required|in:gasoline,diesel,electric,hybrid',
            'status' => 'nullable|in:approved,not approved',
            'doors' => 'required|integer|min:1',
            'total_weight' => 'required|integer|min:0',
            'trunk_capacity' => 'required|integer|min:0',
            'power' => 'required|integer|min:0',
        ]);
    
        $car = Car::create($validated);
    
        return response()->json([
            'message' => 'Car created successfully.',
            'car' => $car
        ], 201);
    }
    

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $car = Car::find($id);
    
        if (!$car) {
            return response()->json([
                'message' => 'Car not found.'
            ], 404);
        }
    
        $validated = $request->validate([
            'brand_id' => 'required|exists:brands,id',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:' . date('Y'),
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'color' => 'required|string|max:255',
            'transmission' => 'required|in:manual,automatic',
            'fuel_type' => 'required|in:gasoline,diesel,electric,hybrid',
            'status' => 'nullable|in:approved,not approved',
            'doors' => 'required|integer|min:1',
            'total_weight' => 'required|integer|min:0',
            'trunk_capacity' => 'required|integer|min:0',
            'power' => 'required|integer|min:0',
        ]);
    
        $car->update($validated);
    
        return response()->json([
            'message' => 'Car updated successfully.',
            'car' => $car
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $car = Car::find($id);

        if (!$car) {
            return response()->json([
                'message' => 'Car not found.'
            ], 404);
        }
    
        $car->delete(); // véglegesen törli az adatot
    
        return response()->json([
            'message' => 'Car deleted successfully.'
        ], 200);
    }
}
