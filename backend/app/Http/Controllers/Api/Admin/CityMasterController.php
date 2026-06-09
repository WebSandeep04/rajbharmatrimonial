<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CityMaster;

class CityMasterController extends Controller
{
    public function index()
    {
        $data = CityMaster::query()->with('state')->orderBy('name')->get();
        return response()->json($data);
    }

    public function store(Request $request)
    {
        $rules = ['name' => 'required|string|max:255'];
        $rules['state_id'] = 'required|exists:state_master,id';
        $validated = $request->validate($rules);

        $entry = CityMaster::create($validated);
        $entry->load('state');

        return response()->json($entry, 201);
    }

    public function update(Request $request, $id)
    {
        $entry = CityMaster::find($id);
        if (!$entry) {
            return response()->json(['message' => 'Entry not found'], 404);
        }

        $rules = ['name' => 'required|string|max:255'];
        $rules['state_id'] = 'required|exists:state_master,id';
        $validated = $request->validate($rules);

        $entry->update($validated);
        $entry->load('state');

        return response()->json($entry);
    }

    public function destroy($id)
    {
        $entry = CityMaster::find($id);
        if (!$entry) {
            return response()->json(['message' => 'Entry not found'], 404);
        }

        $entry->delete();

        return response()->json(['message' => 'Entry deleted successfully']);
    }
}