<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
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
            'verification' => 'required|boolean',
            'no_of_brothers' => 'required|integer',
            'no_of_sisters' => 'required|integer',
            'height' => 'required|string',
            'weight' => 'required|string',
            'mother_occupation' => 'required|string',
            'father_occupation' => 'required|string',
            'mother_name' => 'required|string',
            'father_name' => 'required|string',
            'bio' => 'required|string',
        ];

        $request->validate($rules);

        $data = $request->except('password');
        $data['password'] = Hash::make($request->password);
        $data['is_active'] = true;

        $user = User::create($data);

        return response()->json($user, 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
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
            'verification' => 'required|boolean',
            'no_of_brothers' => 'required|integer',
            'no_of_sisters' => 'required|integer',
            'height' => 'required|string',
            'weight' => 'required|string',
            'mother_occupation' => 'required|string',
            'father_occupation' => 'required|string',
            'mother_name' => 'required|string',
            'father_name' => 'required|string',
            'bio' => 'required|string',
        ];

        $request->validate($rules);

        $data = $request->except('password');
        
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return response()->json($user);
    }

    public function toggleStatus($id)
    {
        $user = User::findOrFail($id);
        $user->is_active = !$user->is_active;
        $user->save();

        return response()->json(['message' => 'Status updated successfully', 'user' => $user]);
    }
}
