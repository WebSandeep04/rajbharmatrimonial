<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Connection;
use Illuminate\Http\Request;

class ConnectionController extends Controller
{
    public function sendRequest(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id'
        ]);

        $senderId = $request->user()->id;
        $receiverId = $request->receiver_id;

        if ($senderId == $receiverId) {
            return response()->json(['message' => 'You cannot send a request to yourself.'], 400);
        }

        // Check if connection already exists in either direction
        $existing = Connection::where(function($q) use ($senderId, $receiverId) {
            $q->where('sender_id', $senderId)->where('receiver_id', $receiverId);
        })->orWhere(function($q) use ($senderId, $receiverId) {
            $q->where('sender_id', $receiverId)->where('receiver_id', $senderId);
        })->first();

        if ($existing) {
            return response()->json(['message' => 'Connection request already exists.', 'status' => $existing->status], 400);
        }

        // Limit non-premium users to 2 connections/requests
        if (!$request->user()->is_premium) {
            $totalConnectionsAndRequests = Connection::where('sender_id', $senderId)
                ->orWhere(function($q) use ($senderId) {
                    $q->where('receiver_id', $senderId)->where('status', 'accepted');
                })->count();

            if ($totalConnectionsAndRequests >= 2) {
                return response()->json(['message' => 'Premium required to connect with more than 2 people', 'error_code' => 'PREMIUM_REQUIRED'], 403);
            }
        }

        $connection = Connection::create([
            'sender_id' => $senderId,
            'receiver_id' => $receiverId,
            'status' => 'pending'
        ]);

        // Send Push Notification
        $receiver = \App\Models\User::find($receiverId);
        $sender = $request->user();
        if ($receiver) {
            $firebaseService = new \App\Services\FirebaseService();
            $firebaseService->sendNotification(
                $receiver,
                'New Connection Request!',
                $sender->name . ' wants to connect with you.',
                ['type' => 'match', 'userId' => (string)$sender->id]
            );
        }

        return response()->json(['message' => 'Connection request sent.', 'connection' => $connection]);
    }

    public function respondRequest(Request $request, $id)
    {
        $request->validate([
            'action' => 'required|in:accept,reject'
        ]);

        $connection = Connection::where('id', $id)
            ->where('receiver_id', $request->user()->id)
            ->where('status', 'pending')
            ->firstOrFail();

        $connection->status = $request->action === 'accept' ? 'accepted' : 'rejected';
        $connection->save();

        if ($connection->status === 'accepted') {
            $sender = \App\Models\User::find($connection->sender_id);
            $receiver = $request->user();
            if ($sender) {
                $firebaseService = new \App\Services\FirebaseService();
                $firebaseService->sendNotification(
                    $sender,
                    'Connection Accepted! 🎉',
                    $receiver->name . ' accepted your request. You can now chat!',
                    ['type' => 'chat', 'userId' => (string)$receiver->id]
                );
            }
        }

        return response()->json(['message' => 'Request ' . $connection->status, 'connection' => $connection]);
    }

    public function getPendingRequests(Request $request)
    {
        $userId = $request->user()->id;

        $received = Connection::with('sender.city')->where('receiver_id', $userId)->where('status', 'pending')->get();
        $sent = Connection::with('receiver.city')->where('sender_id', $userId)->where('status', 'pending')->get();

        return response()->json([
            'received' => $received,
            'sent' => $sent
        ]);
    }

    public function getConnections(Request $request)
    {
        $userId = $request->user()->id;

        $connections = Connection::with(['sender.city', 'receiver.city'])
            ->where('status', 'accepted')
            ->where(function($q) use ($userId) {
                $q->where('sender_id', $userId)->orWhere('receiver_id', $userId);
            })->get()
            ->map(function($conn) use ($userId) {
                $user = $conn->sender_id === $userId ? $conn->receiver : $conn->sender;
                $user->connection_id = $conn->id;
                return $user;
            });

        return response()->json($connections);
    }

    public function getConnectionStatus(Request $request, $userId)
    {
        $currentUserId = $request->user()->id;

        $connection = Connection::where(function($q) use ($currentUserId, $userId) {
            $q->where('sender_id', $currentUserId)->where('receiver_id', $userId);
        })->orWhere(function($q) use ($currentUserId, $userId) {
            $q->where('sender_id', $userId)->where('receiver_id', $currentUserId);
        })->first();

        if (!$connection) {
            return response()->json(['status' => 'none']);
        }

        if ($connection->status === 'accepted') {
            return response()->json(['status' => 'connected', 'connection_id' => $connection->id]);
        }

        if ($connection->status === 'pending') {
            if ($connection->sender_id == $currentUserId) {
                return response()->json(['status' => 'request_sent', 'connection_id' => $connection->id]);
            } else {
                return response()->json(['status' => 'request_received', 'connection_id' => $connection->id]);
            }
        }

        return response()->json(['status' => 'none']);
    }
}
