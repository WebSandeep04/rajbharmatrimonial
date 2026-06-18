<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'firebase_uid',
        'profile_photo',
        'is_active',
        'religion_id',
        'caste_id',
        'gotra_id',
        'nakshatra_id',
        'rashi_id',
        'state_id',
        'city_id',
        'highest_education_id',
        'profession_id',
        'income_range_id',
        'body_type_id',
        'complexion_id',
        'blood_group_id',
        'diet_id',
        'marital_status_id',
        'family_type_id',
        'profile_created_for_id',
        'smoking',
        'drinking',
        'manglik_status',
        'verification',
        'no_of_brothers',
        'no_of_sisters',
        'height',
        'weight',
        'mother_occupation',
        'father_occupation',
        'mother_name',
        'father_name',
        'bio',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'smoking' => 'boolean',
            'drinking' => 'boolean',
            'manglik_status' => 'boolean',
            'verification' => 'boolean',
        ];
    }
}
