<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Stripe\Checkout\Session;
use Stripe\Stripe;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Symfony\Component\HttpFoundation\Response;

class StripeController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));
    }

    public function checkout(Request $request)
    {
        // Validate request data
        $request->validate([
            'booking_id' => 'required|exists:bookings,id',

        ]);

        $user = null;
        try {
            if (JWTAuth::getToken()) {
                $user = JWTAuth::parseToken()->authenticate();
            }
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token is invalid or expired.',
            ], Response::HTTP_UNAUTHORIZED);
        }
        $email = $user->email;



        $booking = Booking::with('service')->findOrFail($request->booking_id);

        // Create Stripe Checkout session
        $session = Session::create([
            'line_items' => [
                [
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => $booking->service->name
                        ],
                        'unit_amount' => round((float) $booking->service->price * 100),
                    ],
                    'quantity' => 1
                ]
            ],
            'mode' => 'payment',
            'success_url' => route('stripe.success') . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('stripe.cancel'),
            'customer_email' => $email,
            'metadata' => [
                'booking_id' => $booking->id
            ]
        ]);

        // Save the session ID to the booking
        $booking->update(['session_id' => $session->id]);

        // Return the checkout URL in the response
        return response()->json([
            'status' => 'success',
            'checkout_url' => $session->url
        ]);
    }

    public function checkPaymentStatus(Request $request)
    {
        $request->validate([
            'session_id' => 'required'
        ]);

        $session = Session::retrieve($request->session_id);

        return response()->json([
            'payment_status' => $session->payment_status,
            'booking_status' => $session->payment_status === 'paid' ? 'completed' : 'pending'
        ]);
    }

    public function checkoutSuccess(Request $request)
    {
        $sessionId = $request->query('session_id');
        $frontendUrl = env('FRONTEND_URL');

        if (!$sessionId) {
            return redirect($frontendUrl . '/payment/canceled');
        }

        try {
            $checkoutSession = Session::retrieve($sessionId);
            $bookingId = $checkoutSession->metadata->booking_id;
            $booking_id = (int) $bookingId;

            if ($checkoutSession->payment_status === 'paid') {
                $booking = Booking::find($booking_id);
                if ($booking) {
                    $booking->update(['payment_status' => 'paid']);
                    //here i will send the user
                    $email = $booking->user->email;
                    return redirect($frontendUrl . "/payment/success");
                } else {
                    return redirect($frontendUrl . '/payment/canceled');
                }
            } else {
                return redirect($frontendUrl . '/payment/canceled');
            }
        } catch (\Exception $e) {
            return redirect($frontendUrl . '/payment/canceled');
        }
    }

    public function checkoutCancel()
    {
        $frontendUrl = env('FRONTEND_URL');
        return redirect($frontendUrl . '/payment/canceled');
    }
}
