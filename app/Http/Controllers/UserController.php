<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(User::all());
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
        //
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
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                'regex:/^([A-ZÁÉÍÓÖŐÚÜŰ][a-záéíóöőúüű]+)(\s[A-ZÁÉÍÓÖŐÚÜŰ][a-záéíóöőúüű]+)+$/u'
            ],
            'role' => [
                'required',
                'in:admin,user'
            ],
        ]);

        $user->name = $validated['name'];
        $user->role = $validated['role'];
        $user->save();

        return response()->json([
            'message' => 'User updated successfully.',
            'user' => $user
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::find($id);
    
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }
    
        $user->delete();
    
        return response()->json(['message' => 'User deleted successfully.'], 200);
    }

    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required|string',
            ]);

            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'error' => 'invalid_credentials'
                ], 401);
            }

            $token = $user->createToken('react-token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'server_error',
                'message' => 'Something went wrong on the server.'
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out']);
    }



    public function register(Request $request)
    {
        $data = $request->only(['name', 'email', 'password', 'password_confirmation']);

        // Email validáció
        if (!$data['email'] || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            return response()->json(['error' => 'invalid_email'], 422);
        }

        // Email már foglalt?
        if (User::where('email', $data['email'])->exists()) {
            return response()->json(['error' => 'email_exists'], 409);
        }

        // Név validáció
        if (
            !$data['name'] || strlen($data['name']) > 255 ||
            !preg_match('/^([A-ZÁÉÍÓÖŐÚÜŰ][a-záéíóöőúüű]+)(\s[A-ZÁÉÍÓÖŐÚÜŰ][a-záéíóöőúüű]+)+$/u', $data['name'])
        ) {
            return response()->json(['error' => 'invalid_name'], 422);
        }

        // Jelszó egyeztetés
        if ($data['password'] !== $data['password_confirmation']) {
            return response()->json(['error' => 'password_mismatch'], 422);
        }

        // Jelszó erősség ellenőrzés (kis-, nagybetű, szám, legalább 6 karakter)
        if (
            strlen($data['password']) < 8 ||
            !preg_match('/[a-z]/', $data['password']) ||
            !preg_match('/[A-Z]/', $data['password']) ||
            !preg_match('/[0-9]/', $data['password'])
        ) {
            return response()->json(['error' => 'weak_password'], 422);
        }

        // Felhasználó létrehozása
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'user' // alapértelmezett
        ]);

        // Token generálás
        $token = $user->createToken('react-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }
}
