<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserImage;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class UserImageController extends Controller
{
    public function index(Request $request)
    {
        $images = $request->user()->images()->orderBy('created_at', 'desc')->get();
        return response()->json($images);
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB max
        ]);

        $user = $request->user();
        
        // Check limits: Max 5 gallery images
        if ($user->images()->count() >= 5) {
            return response()->json(['message' => 'Maximum limit of 5 gallery images reached.'], 400);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('user_images', 'public');
            $fullUrl = url('storage/' . $path);

            $image = $user->images()->create([
                'image_path' => $fullUrl,
            ]);

            return response()->json(['message' => 'Image uploaded successfully.', 'image' => $image], 201);
        }

        return response()->json(['message' => 'Image upload failed.'], 400);
    }



    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $image = $user->images()->findOrFail($id);

        // Delete from storage
        // Since we stored full URL, we extract the path
        $path = str_replace(url('storage/') . '/', '', $image->image_path);
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }

        $image->delete();

        return response()->json(['message' => 'Image deleted successfully.']);
    }

    public function uploadProfilePhoto(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $user = $request->user();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('profile_photos', 'public');
            $fullUrl = url('storage/' . $path);

            $user->update(['profile_photo' => $fullUrl]);

            return response()->json(['message' => 'Profile photo updated successfully.', 'profile_photo' => $fullUrl], 200);
        }

        return response()->json(['message' => 'Profile photo upload failed.'], 400);
    }
}
