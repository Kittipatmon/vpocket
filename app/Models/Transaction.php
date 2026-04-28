<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'user_id',
        'account_id',
        'category_id',
        'category_name',
        'amount',
        'type',
        'description',
        'merchant',
        'payment_method',
        'tags',
        'status',
        'is_recurring',
        'attachment_path',
        'is_essential',
        'date',
        'to_account_id'
    ];

    protected $casts = [
        'date' => 'date',
        'amount' => 'decimal:2',
        'is_recurring' => 'boolean',
        'is_essential' => 'boolean',
        'tags' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function toAccount()
    {
        return $this->belongsTo(Account::class, 'to_account_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function receipt()
    {
        return $this->hasOne(Receipt::class);
    }
}
