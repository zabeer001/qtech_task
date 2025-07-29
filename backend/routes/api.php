<?php



use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\GoogleController;
use App\Http\Controllers\NewPasswordController;

use App\Http\Controllers\ServiceController;
use App\Http\Controllers\StripeController;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

/* amit project */



Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::get('me', [AuthController::class, 'me'])->middleware('auth:api');
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');



// Password reset routes
Route::post('forget-password', [NewPasswordController::class, 'forgetPassword']);
Route::post('forget/password/reset', [NewPasswordController::class, 'reset'])->name('password.reset');

Route::post('password/email', [AuthController::class, 'sendResetOTP']);
Route::post('password/verify-otp', [AuthController::class, 'verifyResetOTP'])->name('password.verify-otp');
Route::post('password/reset', [AuthController::class, 'passwordReset'])->name('password.reset');
Route::post('password/reset-for-auth-user', [AuthController::class, 'passwordResetForAuthUser']);
Route::post('change-profile-details', [AuthController::class, 'changeProfileDetails']);

Route::post('google/auth/jwt-process', [GoogleController::class, 'process']);





//categories
Route::apiResource('services', ServiceController::class);
Route::post('services/status-update', [ServiceController::class, 'udpateStatus']);

Route::apiResource('bookings', BookingController::class);
Route::post('bookings/status-update', [BookingController::class, 'udpateStatus']);



/** Stripe Routes */
Route::post('stripe/checkout', [StripeController::class, 'checkout'])->name('stripe.checkout');
Route::get('stripe/success', [StripeController::class, 'checkoutSuccess'])->name('stripe.success');
Route::get('stripe/cancel', [StripeController::class, 'checkoutCancel'])->name('stripe.cancel');
