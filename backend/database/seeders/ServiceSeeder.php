<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [];

        for ($i = 1; $i <= 30; $i++) {
            $services[] = [

                'name' => ucfirst(Str::random(5)) . ' ' . ucfirst(Str::random(5)),
                'description' => "This is a description for Service {$i}.",
                'price' => rand(100, 5000) + (rand(0, 99) / 100), // Random price like 1234.56
                'status' => rand(0, 1) ? 'active' : 'inactive', // Random active/inactive
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('services')->insert($services);
    }
}
