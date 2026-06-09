<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\IncomeRangeMaster;

class IncomeRangeMasterController extends Controller
{
    public function index()
    {
        $data = IncomeRangeMaster::query()->orderBy('name')->get();
        return response()->json($data);
    }

    public function store(Request $request)
    {
        $rules = ['name' => 'required|string|max:255'];
        
        $validated = $request->validate($rules);

        $entry = IncomeRangeMaster::create($validated);
        

        return response()->json($entry, 201);
    }

    public function update(Request $request, $id)
    {
        $entry = IncomeRangeMaster::find($id);
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
        $entry = IncomeRangeMaster::find($id);
        if (!$entry) {
            return response()->json(['message' => 'Entry not found'], 404);
        }

        $entry->delete();

        return response()->json(['message' => 'Entry deleted successfully']);
    }
}