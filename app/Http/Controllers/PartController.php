<?php

namespace App\Http\Controllers;
use App\Models\CarPart;
use Illuminate\Http\Request;

class PartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(CarPart::all());
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
            'name' => 'required|string|max:255',
            'car_model' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        $part = CarPart::create($validated);

        return response()->json([
            'message' => 'Part created successfully.',
            'part' => $part
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
        $part = CarPart::find($id);

        if (!$part) {
            return response()->json(['message' => 'Part not found.'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'car_model' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        $part->update($validated);

        return response()->json([
            'message' => 'Part updated successfully.',
            'part' => $part
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $part = CarPart::find($id);

        if (!$part) {
            return response()->json(['message' => 'Part not found.'], 404);
        }

        $part->delete();

        return response()->json(['message' => 'Part deleted successfully.'], 200);
    }
}
