<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RashiMaster;

class RashiMasterController extends Controller
{
    public function index()
    {
        $data = RashiMaster::query()->orderBy('name')->get();
        return response()->json($data);
    }

    public function store(Request $request)
    {
        $rules = ['name' => 'required|string|max:255'];
        
        $validated = $request->validate($rules);

        $entry = RashiMaster::create($validated);
        

        return response()->json($entry, 201);
    }

    public function update(Request $request, $id)
    {
        $entry = RashiMaster::find($id);
        if (!$entry) {
            return response()->json(['message' => 'Entry not found'], 404);
        }

        $rules = ['name' => 'required|string|max:255'];
        
        $validated = $request->validate($rules);

        $entry->update($validated);
        

        return response()->json($entry);
    }

    public function destroy($id)
    {
        $entry = RashiMaster::find($id);
        if (!$entry) {
            return response()->json(['message' => 'Entry not found'], 404);
        }

        $entry->delete();

        return response()->json(['message' => 'Entry deleted successfully']);
    }
}