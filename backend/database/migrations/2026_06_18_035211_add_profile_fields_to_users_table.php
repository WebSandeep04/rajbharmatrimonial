<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('religion_id')->nullable();
            $table->unsignedBigInteger('caste_id')->nullable();
            $table->unsignedBigInteger('gotra_id')->nullable();
            $table->unsignedBigInteger('nakshatra_id')->nullable();
            $table->unsignedBigInteger('rashi_id')->nullable();
            $table->unsignedBigInteger('state_id')->nullable();
            $table->unsignedBigInteger('city_id')->nullable();
            $table->unsignedBigInteger('highest_education_id')->nullable();
            $table->unsignedBigInteger('profession_id')->nullable();
            $table->unsignedBigInteger('income_range_id')->nullable();
            $table->unsignedBigInteger('body_type_id')->nullable();
            $table->unsignedBigInteger('complexion_id')->nullable();
            $table->unsignedBigInteger('blood_group_id')->nullable();
            $table->unsignedBigInteger('diet_id')->nullable();
            $table->unsignedBigInteger('marital_status_id')->nullable();
            $table->unsignedBigInteger('family_type_id')->nullable();
            $table->unsignedBigInteger('profile_created_for_id')->nullable();

            $table->boolean('smoking')->default(0);
            $table->boolean('drinking')->default(0);
            $table->boolean('manglik_status')->default(0);
            $table->boolean('verification')->default(0);

            $table->integer('no_of_brothers')->nullable();
            $table->integer('no_of_sisters')->nullable();
            $table->string('height')->nullable();
            $table->string('weight')->nullable();
            $table->string('mother_occupation')->nullable();
            $table->string('father_occupation')->nullable();
            $table->string('mother_name')->nullable();
            $table->string('father_name')->nullable();
            $table->text('bio')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'religion_id', 'caste_id', 'gotra_id', 'nakshatra_id', 'rashi_id',
                'state_id', 'city_id', 'highest_education_id', 'profession_id',
                'income_range_id', 'body_type_id', 'complexion_id', 'blood_group_id',
                'diet_id', 'marital_status_id', 'family_type_id', 'profile_created_for_id',
                'smoking', 'drinking', 'manglik_status', 'verification',
                'no_of_brothers', 'no_of_sisters', 'height', 'weight',
                'mother_occupation', 'father_occupation', 'mother_name', 'father_name', 'bio'
            ]);
        });
    }
};
