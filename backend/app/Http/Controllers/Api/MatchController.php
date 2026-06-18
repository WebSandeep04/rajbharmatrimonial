<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class MatchController extends Controller
{
    public function getRecommendedMatches(Request $request)
    {
        $currentUser = $request->user();

        // Fetch users except current user, ideally opposite gender, but we'll fetch all active for now
        $matches = User::with(['city', 'profession', 'highest_education'])
            ->where('id', '!=', $currentUser->id)
            ->where('is_active', true)
            ->limit(10)
            ->get()
            ->map(function ($user) {
                // Formatting data to match what the mobile app expects
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'age' => $user->age ?? 25, // Fallback if age isn't implemented
                    'city' => $user->city ? $user->city->name : 'Unknown',
                    'profession' => $user->profession ? $user->profession->name : 'Not Specified',
                    'education' => $user->highest_education ? $user->highest_education->name : 'Not Specified',
                    'matchPercentage' => rand(70, 99), // Mock percentage for now
                    'verified' => (bool)$user->verification,
                    'image' => $user->profile_photo ?: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
                ];
            });

        return response()->json($matches);
    }

    public function getUserProfile($id)
    {
        $user = User::with([
            'religion', 'caste', 'gotra', 'nakshatra', 'rashi', 'state', 'city',
            'highest_education', 'profession', 'income_range', 'body_type',
            'complexion', 'blood_group', 'diet', 'marital_status', 'family_type', 'profile_created_for'
        ])->findOrFail($id);

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'age' => $user->age ?? 25,
            'city' => $user->city ? $user->city->name : 'Not Specified',
            'state' => $user->state ? $user->state->name : 'Not Specified',
            'profession' => $user->profession ? $user->profession->name : 'Not Specified',
            'education' => $user->highest_education ? $user->highest_education->name : 'Not Specified',
            'income' => $user->income_range ? $user->income_range->name : 'Not Specified',
            
            'religion' => $user->religion ? $user->religion->name : 'Not Specified',
            'caste' => $user->caste ? $user->caste->name : 'Not Specified',
            'gotra' => $user->gotra ? $user->gotra->name : 'Not Specified',
            'nakshatra' => $user->nakshatra ? $user->nakshatra->name : 'Not Specified',
            'rashi' => $user->rashi ? $user->rashi->name : 'Not Specified',
            'manglik_status' => $user->manglik_status ? 'Yes' : 'No',

            'marital_status' => $user->marital_status ? $user->marital_status->name : 'Not Specified',
            'profile_created_for' => $user->profile_created_for ? $user->profile_created_for->name : 'Not Specified',
            
            'height' => $user->height ?: 'Not Specified',
            'weight' => $user->weight ?: 'Not Specified',
            'body_type' => $user->body_type ? $user->body_type->name : 'Not Specified',
            'complexion' => $user->complexion ? $user->complexion->name : 'Not Specified',
            'blood_group' => $user->blood_group ? $user->blood_group->name : 'Not Specified',

            'diet' => $user->diet ? $user->diet->name : 'Not Specified',
            'smoking' => $user->smoking ? 'Yes' : 'No',
            'drinking' => $user->drinking ? 'Yes' : 'No',

            'family_type' => $user->family_type ? $user->family_type->name : 'Not Specified',
            'father_name' => $user->father_name ?: 'Not Specified',
            'mother_name' => $user->mother_name ?: 'Not Specified',
            'father_occupation' => $user->father_occupation ?: 'Not Specified',
            'mother_occupation' => $user->mother_occupation ?: 'Not Specified',
            'no_of_brothers' => $user->no_of_brothers !== null ? (string)$user->no_of_brothers : 'Not Specified',
            'no_of_sisters' => $user->no_of_sisters !== null ? (string)$user->no_of_sisters : 'Not Specified',

            'bio' => $user->bio,
            'verified' => (bool)$user->verification,
            'image' => $user->profile_photo ?: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
        ]);
    }
}
