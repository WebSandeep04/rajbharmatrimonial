<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaritalStatusMaster extends Model
{
    protected $table = 'marital_status_master';
    protected $fillable = ['name'];
}
