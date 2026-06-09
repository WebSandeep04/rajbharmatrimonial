<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProfileCreatedForMaster extends Model
{
    protected $table = 'profile_created_for_master';
    protected $fillable = ['name'];
}
