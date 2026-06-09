<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CityMaster extends Model
{
    protected $table = 'city_master';
    protected $fillable = ['state_id', 'name'];

    public function state()
    {
        return $this->belongsTo(StateMaster::class);
    }
}
