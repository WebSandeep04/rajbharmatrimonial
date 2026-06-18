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

        $connection = Connection::create([
            'sender_id' => $senderId,
            'receiver_id' => $receiverId,
            'status' => 'pending'
        ]);

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
            if ($connection->sender_id === $currentUserId) {
                return response()->json(['status' => 'request_sent', 'connection_id' => $connection->id]);
            } else {
                return response()->json(['status' => 'request_received', 'connection_id' => $connection->id]);
            }
        }

        return response()->json(['status' => 'none']);
    }
}
