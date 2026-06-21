<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Services\FirebaseService;

class NotificationController extends Controller
{
    public function broadcast(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        $firebaseService = new FirebaseService();
        
        $totalSuccess = 0;
        $totalFailures = 0;

        // Chunk users to prevent memory issues and fit within Firebase Multicast limits (500 per request)
        User::whereNotNull('fcm_token')->chunk(500, function ($users) use ($firebaseService, $request, &$totalSuccess, &$totalFailures) {
            $tokens = $users->pluck('fcm_token')->filter()->toArray();
            
            if (!empty($tokens)) {
                $result = $firebaseService->sendMulticast(
                    $tokens,
                    $request->title,
                    $request->body,
                    ['type' => 'broadcast']
                );

                if ($result) {
                    $totalSuccess += $result['success'];
                    $totalFailures += $result['failures'];
                }
            }
        });

        return response()->json([
            'message' => 'Broadcast completed',
            'success_count' => $totalSuccess,
            'failure_count' => $totalFailures
        ]);
    }
}
