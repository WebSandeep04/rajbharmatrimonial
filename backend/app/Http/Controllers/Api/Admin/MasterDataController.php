<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MasterDataController extends Controller
{
    private function getModelClass($type)
    {
        $className = Str::studly($type) . 'Master';
        $fullClass = "\\App\\Models\\{$className}";
        if (class_exists($fullClass)) {
            return $fullClass;
        }
        return null;
    }

    public function index($type)
    {
        $modelClass = $this->getModelClass($type);
        if (!$modelClass) {
            return response()->json(['message' => 'Invalid master type'], 404);
        }

        $query = $modelClass::query();

        if ($type === 'caste') {
            $query->with('religion');
        } elseif ($type === 'city') {
            $query->with('state');
        }

        return response()->json($query->orderBy('name')->get());
    }

    public function store(Request $request, $type)
    {
        $modelClass = $this->getModelClass($type);
        if (!$modelClass) {
            return response()->json(['message' => 'Invalid master type'], 404);
        }

        $rules = ['name' => 'required|string|max:255'];
        if ($type === 'caste') {
            $rules['religion_id'] = 'required|exists:religion_master,id';
        } elseif ($type === 'city') {
            $rules['state_id'] = 'required|exists:state_master,id';
        }

        $validated = $request->validate($rules);

        $entry = $modelClass::create($validated);
        
        if ($type === 'caste') {
            $entry->load('religion');
        } elseif ($type === 'city') {
            $entry->load('state');
        }

        return response()->json($entry, 201);
    }

    public function update(Request $request, $type, $id)
    {
        $modelClass = $this->getModelClass($type);
        if (!$modelClass) {
            return response()->json(['message' => 'Invalid master type'], 404);
        }

        $entry = $modelClass::find($id);
        if (!$entry) {
            return response()->json(['message' => 'Entry not found'], 404);
        }

        $rules = ['name' => 'required|string|max:255'];
        if ($type === 'caste') {
            $rules['religion_id'] = 'required|exists:religion_master,id';
        } elseif ($type === 'city') {
            $rules['state_id'] = 'required|exists:state_master,id';
        }

        $validated = $request->validate($rules);

        $entry->update($validated);

        if ($type === 'caste') {
            $entry->load('religion');
        } elseif ($type === 'city') {
            $entry->load('state');
        }

        return response()->json($entry);
    }

    public function destroy($type, $id)
    {
        $modelClass = $this->getModelClass($type);
        if (!$modelClass) {
            return response()->json(['message' => 'Invalid master type'], 404);
        }

        $entry = $modelClass::find($id);
        if (!$entry) {
            return response()->json(['message' => 'Entry not found'], 404);
        }

        $entry->delete();

        return response()->json(['message' => 'Entry deleted successfully']);
    }
}
