<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class productModel extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'price', 'quantity'];

    public function invoice() { return $this->belongsTo(Invoice::class); }
}
