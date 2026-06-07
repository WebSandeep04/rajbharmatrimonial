<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Kreait\Firebase\Factory;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function googleLogin(Request $request)
    {
        $request->validate([
            'id_token' => 'required|string',
        ]);

        try {
            $firebaseCredentialsPath = storage_path('app/firebase-auth.json');
            
            if (!file_exists($firebaseCredentialsPath)) {
                Log::error('Firebase credentials file not found at: ' . $firebaseCredentialsPath);
                return response()->json(['message' => 'Server configuration error'], 500);
            }

            $factory = (new Factory)->withServiceAccount($firebaseCredentialsPath);
            $auth = $factory->createAuth();

            $verifiedIdToken = $auth->verifyIdToken($request->id_token);
            $claims = $verifiedIdToken->claims();
            
            $uid = $claims->get('sub');
            $email = $claims->get('email');
            $name = $claims->get('name');
            $picture = $claims->get('picture');

            if (!$email) {
                return response()->json(['message' => 'Email not provided by Google'], 400);
            }

            // Find or create user
            $user = User::where('firebase_uid', $uid)->orWhere('email', $email)->first();

            if (!$user) {
                $user = User::create([
                    'firebase_uid' => $uid,
                    'name' => $name ?? 'Unknown',
                    'email' => $email,
                    'profile_photo' => $picture,
                ]);
            } else {
                // Update user details if they changed
                $user->update([
                    'firebase_uid' => $uid, // Link in case we matched by email
                    'name' => $name ?? $user->name,
                    'profile_photo' => $picture ?? $user->profile_photo,
                ]);
            }

            // Create Sanctum Token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Firebase token verification failed: ' . $e->getMessage());
            return response()->json(['message' => 'Unauthorized or Invalid Token', 'error' => $e->getMessage()], 401);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function profile(Request $request)
    {
        return response()->json(['user' => $request->user()]);
    }
}
