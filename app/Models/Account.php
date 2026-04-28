<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    protected $fillable = ['user_id', 'name', 'type', 'balance', 'currency', 'color', 'icon', 'image_path'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function members()
    {
        return $this->belongsToMany(User::class, 'account_members')->withPivot('role')->withTimestamps();
    }
}
