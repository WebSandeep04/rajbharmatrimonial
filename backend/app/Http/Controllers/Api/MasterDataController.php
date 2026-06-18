<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\ReligionMaster;
use App\Models\CasteMaster;
use App\Models\GotraMaster;
use App\Models\NakshatraMaster;
use App\Models\RashiMaster;
use App\Models\StateMaster;
use App\Models\CityMaster;
use App\Models\HighestEducationMaster;
use App\Models\ProfessionMaster;
use App\Models\IncomeRangeMaster;
use App\Models\BodyTypeMaster;
use App\Models\ComplexionMaster;
use App\Models\BloodGroupMaster;
use App\Models\DietMaster;
use App\Models\MaritalStatusMaster;
use App\Models\FamilyTypeMaster;
use App\Models\ProfileCreatedForMaster;

class MasterDataController extends Controller
{
    public function all()
    {
        return response()->json([
            'religion' => ReligionMaster::orderBy('name')->get(),
            'caste' => CasteMaster::orderBy('name')->get(),
            'gotra' => GotraMaster::orderBy('name')->get(),
            'nakshatra' => NakshatraMaster::orderBy('name')->get(),
            'rashi' => RashiMaster::orderBy('name')->get(),
            'state' => StateMaster::orderBy('name')->get(),
            'city' => CityMaster::orderBy('name')->get(),
            'highest_education' => HighestEducationMaster::orderBy('name')->get(),
            'profession' => ProfessionMaster::orderBy('name')->get(),
            'income_range' => IncomeRangeMaster::orderBy('name')->get(),
            'body_type' => BodyTypeMaster::orderBy('name')->get(),
            'complexion' => ComplexionMaster::orderBy('name')->get(),
            'blood_group' => BloodGroupMaster::orderBy('name')->get(),
            'diet' => DietMaster::orderBy('name')->get(),
            'marital_status' => MaritalStatusMaster::orderBy('name')->get(),
            'family_type' => FamilyTypeMaster::orderBy('name')->get(),
            'profile_created_for' => ProfileCreatedForMaster::orderBy('name')->get(),
        ]);
    }
}
