<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MasterDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Religion Master
        $religionId = DB::table('religion_master')->insertGetId(['name' => 'Hindu', 'created_at' => now(), 'updated_at' => now()]);

        // 2. Caste Master
        DB::table('caste_master')->insert(['religion_id' => $religionId, 'name' => 'Rajbhar', 'created_at' => now(), 'updated_at' => now()]);

        // 3. Gotra Master
        $gotras = ['Kashyap', 'Bharadwaj', 'Gautam', 'Vashishtha'];
        foreach ($gotras as $g) {
            DB::table('gotra_master')->insert(['name' => $g, 'created_at' => now(), 'updated_at' => now()]);
        }

        // 4. Nakshatra Master
        $nakshatras = [
            'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 
            'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 
            'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 
            'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
        ];
        foreach ($nakshatras as $n) {
            DB::table('nakshatra_master')->insert(['name' => $n, 'created_at' => now(), 'updated_at' => now()]);
        }

        // 5. Rashi Master
        $rashis = ['Mesh', 'Vrishabh', 'Mithun', 'Kark', 'Singh', 'Kanya', 'Tula', 'Vrishchik', 'Dhanu', 'Makar', 'Kumbh', 'Meen'];
        foreach ($rashis as $r) {
            DB::table('rashi_master')->insert(['name' => $r, 'created_at' => now(), 'updated_at' => now()]);
        }

        // 6. State & City Master
        $statesAndCities = [
            'Maharashtra' => ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad'],
            'Delhi' => ['Delhi'],
            'Karnataka' => ['Bengaluru'],
            'Telangana' => ['Hyderabad'],
            'Tamil Nadu' => ['Chennai'],
            'West Bengal' => ['Kolkata'],
            'Gujarat' => ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
            'Rajasthan' => ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'],
            'Uttar Pradesh' => ['Lucknow', 'Kanpur', 'Noida', 'Ghaziabad', 'Agra', 'Varanasi', 'Prayagraj', 'Gorakhpur', 'Meerut', 'Bareilly'],
            'Bihar' => ['Patna'],
            'Jharkhand' => ['Ranchi'],
            'Madhya Pradesh' => ['Bhopal', 'Indore'],
            'Chandigarh' => ['Chandigarh'],
            'Punjab' => ['Ludhiana', 'Amritsar'],
            'Uttarakhand' => ['Dehradun', 'Haridwar'],
            'Jammu and Kashmir' => ['Jammu', 'Srinagar']
        ];
        
        $allStates = [
            'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
            'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 
            'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 
            'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
            'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 
            'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
        ];

        foreach ($allStates as $s) {
            $stateId = DB::table('state_master')->insertGetId(['name' => $s, 'created_at' => now(), 'updated_at' => now()]);
            if (isset($statesAndCities[$s])) {
                foreach ($statesAndCities[$s] as $city) {
                    DB::table('city_master')->insert(['state_id' => $stateId, 'name' => $city, 'created_at' => now(), 'updated_at' => now()]);
                }
            }
        }

        // 8. Highest Education Master
        $educations = ['High School', 'Intermediate', 'Diploma', 'ITI', 'BCA', 'B.Tech', 'B.Com', 'BA', 'B.Sc', 'MCA', 'MBA', 'M.Tech', 'MBBS', 'BDS', 'CA', 'CS', 'PhD', 'Other'];
        foreach ($educations as $e) {
            DB::table('highest_education_master')->insert(['name' => $e, 'created_at' => now(), 'updated_at' => now()]);
        }

        // 9. Profession Master
        $professions = ['Software Engineer', 'Developer', 'Doctor', 'Teacher', 'Government Employee', 'Banker', 'Lawyer', 'Accountant', 'Chartered Accountant', 'Business Owner', 'Entrepreneur', 'Farmer', 'Designer', 'Student', 'Police Officer', 'Army Personnel', 'Private Employee', 'Self Employed', 'Other'];
        foreach ($professions as $p) {
            DB::table('profession_master')->insert(['name' => $p, 'created_at' => now(), 'updated_at' => now()]);
        }

        // 10. Income Range Master
        $incomes = ['Below ₹3 LPA', '₹3–5 LPA', '₹5–10 LPA', '₹10–15 LPA', '₹15–20 LPA', '₹20–30 LPA', '₹30–50 LPA', '₹50 LPA+'];
        foreach ($incomes as $i) {
            DB::table('income_range_master')->insert(['name' => $i, 'created_at' => now(), 'updated_at' => now()]);
        }

        // 11. Body Type Master
        $bodyTypes = ['Slim', 'Average', 'Athletic', 'Heavy'];
        foreach ($bodyTypes as $b) {
            DB::table('body_type_master')->insert(['name' => $b, 'created_at' => now(), 'updated_at' => now()]);
        }

        // 12. Complexion Master
        $complexions = ['Very Fair', 'Fair', 'Wheatish', 'Wheatish Brown', 'Dark'];
        foreach ($complexions as $c) {
            DB::table('complexion_master')->insert(['name' => $c, 'created_at' => now(), 'updated_at' => now()]);
        }

        // 13. Blood Group Master
        $bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        foreach ($bloodGroups as $bg) {
            DB::table('blood_group_master')->insert(['name' => $bg, 'created_at' => now(), 'updated_at' => now()]);
        }

        // 14. Diet Master
        $diets = ['Vegetarian', 'Non Vegetarian', 'Eggetarian', 'Vegan', 'Jain'];
        foreach ($diets as $d) {
            DB::table('diet_master')->insert(['name' => $d, 'created_at' => now(), 'updated_at' => now()]);
        }

        // 15. Marital Status Master
        $maritalStatuses = ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'];
        foreach ($maritalStatuses as $ms) {
            DB::table('marital_status_master')->insert(['name' => $ms, 'created_at' => now(), 'updated_at' => now()]);
        }

        // 16. Family Type Master
        $familyTypes = ['Joint Family', 'Nuclear Family'];
        foreach ($familyTypes as $ft) {
            DB::table('family_type_master')->insert(['name' => $ft, 'created_at' => now(), 'updated_at' => now()]);
        }

        // 17. Profile Created For Master
        $profilesFor = ['Self', 'Son', 'Daughter', 'Brother', 'Sister', 'Relative', 'Friend'];
        foreach ($profilesFor as $pf) {
            DB::table('profile_created_for_master')->insert(['name' => $pf, 'created_at' => now(), 'updated_at' => now()]);
        }
    }
}
