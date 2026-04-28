<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WalletType extends Model
{
    protected $fillable = ['user_id', 'name', 'icon', 'color'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
