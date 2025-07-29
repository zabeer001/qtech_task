<?php

namespace Database\Seeders;

use App\Helpers\HelperMethods;
use Illuminate\Database\Seeder;
use App\Models\Service;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        // Get all service IDs (real services seeded already)
        $serviceIds = Service::pluck('id')->toArray();

        // Get all user IDs (assuming you have users)
        $userIds = User::pluck('id')->toArray();

        // Generate 30 random bookings
        for ($i = 1; $i <= 30; $i++) {
            DB::table('bookings')->insert([
                'user_id'        => $userIds[array_rand($userIds)],
                'uniq_id'         => HelperMethods::generateUniqueId(),
                'service_id'     => $serviceIds[array_rand($serviceIds)],
                'booking_date'   => Carbon::now()->addDays(rand(0, 30)),
                'status'         => collect(['pending', 'confirmed', 'cancelled'])->random(),
                'payment_status' => collect(['unpaid', 'paid', 'refunded'])->random(),
                'created_at'     => now(),
                'updated_at'     => now(),
            ]);
        }
    }
}
