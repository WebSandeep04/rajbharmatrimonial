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

    public function updateFcmToken(Request $request)
    {
        $request->validate([
            'fcm_token' => 'required|string',
        ]);

        $user = $request->user();
        $user->update(['fcm_token' => $request->fcm_token]);

        return response()->json(['message' => 'FCM token updated successfully']);
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

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $rules = [
            'religion_id' => 'required|integer',
            'caste_id' => 'required|integer',
            'gotra_id' => 'required|integer',
            'nakshatra_id' => 'required|integer',
            'rashi_id' => 'required|integer',
            'state_id' => 'required|integer',
            'city_id' => 'required|integer',
            'highest_education_id' => 'required|integer',
            'profession_id' => 'required|integer',
            'income_range_id' => 'required|integer',
            'body_type_id' => 'required|integer',
            'complexion_id' => 'required|integer',
            'blood_group_id' => 'required|integer',
            'diet_id' => 'required|integer',
            'marital_status_id' => 'required|integer',
            'family_type_id' => 'required|integer',
            'profile_created_for_id' => 'required|integer',
            'smoking' => 'required|boolean',
            'drinking' => 'required|boolean',
            'manglik_status' => 'required|boolean',
            'no_of_brothers' => 'required|integer',
            'no_of_sisters' => 'required|integer',
            'height' => 'required|string',
            'weight' => 'required|string',
            'mother_occupation' => 'required|string',
            'father_occupation' => 'required|string',
            'mother_name' => 'required|string',
            'father_name' => 'required|string',
            'bio' => 'required|string',
            'custom_profession' => 'nullable|string',
            'custom_education' => 'nullable|string',
        ];

        $validated = $request->validate($rules);
        $user->update($validated);

        return response()->json(['message' => 'Profile updated successfully', 'user' => $user]);
    }
}
