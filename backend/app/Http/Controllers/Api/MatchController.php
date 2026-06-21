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

        // Fetch users except current user, and exclude those who already have a connection
        $matches = User::with(['city', 'profession', 'highest_education'])
            ->where('id', '!=', $currentUser->id)
            ->where('is_active', true)
            ->whereNotIn('id', function($query) use ($currentUser) {
                $query->select('receiver_id')->from('connections')->where('sender_id', $currentUser->id)
                      ->union(
                          \Illuminate\Support\Facades\DB::table('connections')->select('sender_id')->where('receiver_id', $currentUser->id)
                      );
            })
            ->limit(10)
            ->get()
            ->map(function ($user) {
                // Formatting data to match what the mobile app expects
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'age' => $user->age ?? 25, // Fallback if age isn't implemented
                    'city' => $user->city ? $user->city->name : 'Unknown',
                    'profession' => $user->profession ? (strtolower($user->profession->name) === 'other' && $user->custom_profession ? $user->custom_profession : $user->profession->name) : 'Not Specified',
                    'education' => $user->highest_education ? (strtolower($user->highest_education->name) === 'other' && $user->custom_education ? $user->custom_education : $user->highest_education->name) : 'Not Specified',
                    'matchPercentage' => rand(70, 99), // Mock percentage for now
                    'verified' => (bool)$user->verification,
                    'image' => $user->profile_photo ?: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
                ];
            });

        return response()->json($matches);
    }

    public function search(Request $request)
    {
        $currentUser = $request->user();

        $query = User::with(['city', 'profession', 'highest_education'])
            ->where('id', '!=', $currentUser->id)
            ->where('is_active', true);

        // Apply filters
        $query->when($request->religion_id, function ($q, $v) { $q->where('religion_id', $v); })
              ->when($request->caste_id, function ($q, $v) { $q->where('caste_id', $v); })
              ->when($request->gotra_id, function ($q, $v) { $q->where('gotra_id', $v); })
              ->when($request->nakshatra_id, function ($q, $v) { $q->where('nakshatra_id', $v); })
              ->when($request->rashi_id, function ($q, $v) { $q->where('rashi_id', $v); })
              ->when($request->state_id, function ($q, $v) { $q->where('state_id', $v); })
              ->when($request->city_id, function ($q, $v) { $q->where('city_id', $v); })
              ->when($request->marital_status_id, function ($q, $v) { $q->where('marital_status_id', $v); })
              ->when($request->profession_id, function ($q, $v) { $q->where('profession_id', $v); })
              ->when($request->highest_education_id, function ($q, $v) { $q->where('highest_education_id', $v); })
              ->when($request->income_range_id, function ($q, $v) { $q->where('income_range_id', $v); })
              ->when($request->body_type_id, function ($q, $v) { $q->where('body_type_id', $v); })
              ->when($request->complexion_id, function ($q, $v) { $q->where('complexion_id', $v); })
              ->when($request->blood_group_id, function ($q, $v) { $q->where('blood_group_id', $v); })
              ->when($request->diet_id, function ($q, $v) { $q->where('diet_id', $v); })
              ->when($request->family_type_id, function ($q, $v) { $q->where('family_type_id', $v); })
              ->when($request->profile_created_for_id, function ($q, $v) { $q->where('profile_created_for_id', $v); })
              ->when($request->smoking, function ($q, $v) { $q->where('smoking', $v === 'yes' || $v === '1' || $v === true ? 1 : 0); })
              ->when($request->drinking, function ($q, $v) { $q->where('drinking', $v === 'yes' || $v === '1' || $v === true ? 1 : 0); })
              ->when($request->manglik_status, function ($q, $v) { $q->where('manglik_status', $v === 'yes' || $v === '1' || $v === true ? 1 : 0); });

        $matches = $query->limit(50)->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'age' => $user->age ?? 25,
                'city' => $user->city ? $user->city->name : 'Unknown',
                'profession' => $user->profession ? (strtolower($user->profession->name) === 'other' && $user->custom_profession ? $user->custom_profession : $user->profession->name) : 'Not Specified',
                'education' => $user->highest_education ? (strtolower($user->highest_education->name) === 'other' && $user->custom_education ? $user->custom_education : $user->highest_education->name) : 'Not Specified',
                'matchPercentage' => rand(70, 99),
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
            'complexion', 'blood_group', 'diet', 'marital_status', 'family_type', 'profile_created_for', 'images'
        ])->findOrFail($id);

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'age' => $user->age ?? 25,
            'city' => $user->city ? $user->city->name : 'Not Specified',
            'state' => $user->state ? $user->state->name : 'Not Specified',
            'profession' => $user->profession ? (strtolower($user->profession->name) === 'other' && $user->custom_profession ? $user->custom_profession : $user->profession->name) : 'Not Specified',
            'education' => $user->highest_education ? (strtolower($user->highest_education->name) === 'other' && $user->custom_education ? $user->custom_education : $user->highest_education->name) : 'Not Specified',
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
            'gallery' => $user->images->map(function($img) { return $img->image_path; }),
        ]);
    }

    public function notifyChat(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string|max:255',
        ]);

        $sender = $request->user();
        $receiver = User::find($request->receiver_id);

        if ($receiver) {
            $firebaseService = new \App\Services\FirebaseService();
            $firebaseService->sendNotification(
                $receiver,
                $sender->name,
                $request->message,
                ['type' => 'chat', 'userId' => (string)$sender->id]
            );
        }

        return response()->json(['message' => 'Chat notification sent']);
    }
}
