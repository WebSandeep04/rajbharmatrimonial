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
        'fcm_token',
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
        'custom_profession',
        'custom_education',
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

    public function religion() { return $this->belongsTo(ReligionMaster::class); }
    public function caste() { return $this->belongsTo(CasteMaster::class); }
    public function gotra() { return $this->belongsTo(GotraMaster::class); }
    public function nakshatra() { return $this->belongsTo(NakshatraMaster::class); }
    public function rashi() { return $this->belongsTo(RashiMaster::class); }
    public function state() { return $this->belongsTo(StateMaster::class); }
    public function city() { return $this->belongsTo(CityMaster::class); }
    public function highest_education() { return $this->belongsTo(HighestEducationMaster::class); }
    public function profession() { return $this->belongsTo(ProfessionMaster::class); }
    public function income_range() { return $this->belongsTo(IncomeRangeMaster::class); }
    public function body_type() { return $this->belongsTo(BodyTypeMaster::class); }
    public function complexion() { return $this->belongsTo(ComplexionMaster::class); }
    public function blood_group() { return $this->belongsTo(BloodGroupMaster::class); }
    public function diet() { return $this->belongsTo(DietMaster::class); }
    public function marital_status() { return $this->belongsTo(MaritalStatusMaster::class); }
    public function family_type() { return $this->belongsTo(FamilyTypeMaster::class); }
    public function profile_created_for() { return $this->belongsTo(ProfileCreatedForMaster::class); }

    public function images()
    {
        return $this->hasMany(UserImage::class);
    }
}
