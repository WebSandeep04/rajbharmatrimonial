<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Razorpay\Api\Api;
use App\Models\Payment;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function createOrder(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'description' => 'nullable|string'
        ]);

        $api = new Api(env('RAZORPAY_KEY'), env('RAZORPAY_SECRET'));

        try {
            // Amount is in paise for INR, so multiply by 100
            $orderData = [
                'receipt'         => 'rcptid_' . time(),
                'amount'          => $request->amount * 100, 
                'currency'        => 'INR',
                'payment_capture' => 1 // auto capture
            ];

            $razorpayOrder = $api->order->create($orderData);

            $payment = Payment::create([
                'user_id' => auth()->id() ?? null,
                'razorpay_order_id' => $razorpayOrder['id'],
                'amount' => $request->amount,
                'currency' => 'INR',
                'status' => 'created',
                'description' => $request->description ?? 'Premium Membership',
            ]);

            return response()->json([
                'success' => true,
                'order_id' => $razorpayOrder['id'],
                'amount' => $request->amount,
                'currency' => 'INR',
                'payment_id' => $payment->id,
                'key' => env('RAZORPAY_KEY')
            ]);

        } catch (\Exception $e) {
            Log::error('Razorpay order creation failed: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function verifyPayment(Request $request)
    {
        $request->validate([
            'razorpay_order_id' => 'required|string',
            'razorpay_payment_id' => 'required|string',
            'razorpay_signature' => 'required|string'
        ]);

        $api = new Api(env('RAZORPAY_KEY'), env('RAZORPAY_SECRET'));

        $attributes = [
            'razorpay_order_id' => $request->razorpay_order_id,
            'razorpay_payment_id' => $request->razorpay_payment_id,
            'razorpay_signature' => $request->razorpay_signature
        ];

        try {
            $api->utility->verifyPaymentSignature($attributes);
            
            // Signature is valid, update payment record
            $payment = Payment::where('razorpay_order_id', $request->razorpay_order_id)->first();
            
            if ($payment) {
                $payment->update([
                    'razorpay_payment_id' => $request->razorpay_payment_id,
                    'razorpay_signature' => $request->razorpay_signature,
                    'status' => 'successful'
                ]);
            }

            return response()->json(['success' => true, 'message' => 'Payment verified successfully']);

        } catch (\Exception $e) {
            Log::error('Razorpay signature verification failed: ' . $e->getMessage());
            
            $payment = Payment::where('razorpay_order_id', $request->razorpay_order_id)->first();
            if ($payment) {
                $payment->update(['status' => 'failed']);
            }

            return response()->json(['success' => false, 'message' => 'Payment verification failed'], 400);
        }
    }
}
