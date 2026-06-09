<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CasteMaster;

class CasteMasterController extends Controller
{
    public function index()
    {
        $data = CasteMaster::query()->with('religion')->orderBy('name')->get();
        return response()->json($data);
    }

    public function store(Request $request)
    {
        $rules = ['name' => 'required|string|max:255'];
        $rules['religion_id'] = 'required|exists:religion_master,id';
        $validated = $request->validate($rules);

        $entry = CasteMaster::create($validated);
        $entry->load('religion');

        return response()->json($entry, 201);
    }

    public function update(Request $request, $id)
    {
        $entry = CasteMaster::find($id);
        if (!$entry) {
            return response()->json(['message' => 'Entry not found'], 404);
        }

        $rules = ['name' => 'required|string|max:255'];
        $rules['religion_id'] = 'required|exists:religion_master,id';
        $validated = $request->validate($rules);

        $entry->update($validated);
        $entry->load('religion');

        return response()->json($entry);
    }

    public function destroy($id)
    {
        $entry = CasteMaster::find($id);
        if (!$entry) {
            return response()->json(['message' => 'Entry not found'], 404);
        }

        $entry->delete();

        return response()->json(['message' => 'Entry deleted successfully']);
    }
}