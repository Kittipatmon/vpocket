<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Receipt extends Model
{
    protected $fillable = ['transaction_id', 'file_path', 'storage_driver', 'ocr_data'];

    protected $casts = [
        'ocr_data' => 'array',
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }
}
