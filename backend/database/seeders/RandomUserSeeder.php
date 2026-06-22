<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RandomUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create('en_IN');
        $users = [];

        for ($i = 0; $i < 20; $i++) {
            $gender = $faker->randomElement(['Male', 'Female']);
            $profilePhoto = $gender === 'Male' 
                ? 'https://randomuser.me/api/portraits/men/' . $faker->numberBetween(1, 99) . '.jpg'
                : 'https://randomuser.me/api/portraits/women/' . $faker->numberBetween(1, 99) . '.jpg';

            $users[] = [
                'name' => $faker->name($gender),
                'email' => $faker->unique()->safeEmail(),
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'is_active' => true,
                'is_premium' => $faker->boolean(20), // 20% chance of being premium
                'height' => $faker->numberBetween(150, 190),
                'weight' => $faker->numberBetween(50, 90),
                'profile_photo' => $profilePhoto,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        \App\Models\User::insert($users);
    }
}
