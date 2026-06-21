<?php

namespace App\Services;

use Kreait\Firebase\Factory;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class FirebaseService
{
    protected $messaging;

    public function __construct()
    {
        try {
            $firebaseCredentialsPath = storage_path('app/firebase-auth.json');
            if (file_exists($firebaseCredentialsPath)) {
                $factory = (new Factory)->withServiceAccount($firebaseCredentialsPath);
                $this->messaging = $factory->createMessaging();
            }
        } catch (\Exception $e) {
            Log::error('FirebaseService Initialization Error: ' . $e->getMessage());
        }
    }

    /**
     * Send a notification to a specific user
     */
    public function sendNotification(User $user, $title, $body, $data = [])
    {
        if (!$this->messaging || !$user->fcm_token) {
            return false;
        }

        try {
            $message = CloudMessage::withTarget('token', $user->fcm_token)
                ->withNotification(Notification::create($title, $body))
                ->withData($data);

            $this->messaging->send($message);
            return true;
        } catch (\Exception $e) {
            Log::error('FCM Send Error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Send a notification to multiple tokens (multicast)
     */
    public function sendMulticast(array $tokens, $title, $body, $data = [])
    {
        if (!$this->messaging || empty($tokens)) {
            return false;
        }

        try {
            $message = CloudMessage::new()
                ->withNotification(Notification::create($title, $body))
                ->withData($data);

            $report = $this->messaging->sendMulticast($message, $tokens);
            
            return [
                'success' => $report->successes()->count(),
                'failures' => $report->failures()->count(),
            ];
        } catch (\Exception $e) {
            Log::error('FCM Multicast Error: ' . $e->getMessage());
            return false;
        }
    }
}
