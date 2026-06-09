<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CasteMaster extends Model
{
    protected $table = 'caste_master';
    protected $fillable = ['religion_id', 'name'];
}
