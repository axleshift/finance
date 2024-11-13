<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;


    protected $fillable = [
        'firstName',
        'lastName',
        'quantity',
        'price',
        'products',
        'address',
        'selectedCurrency',
        'status',
        'products',
        'email',
        'phone',
        'totalAmount',
        'paymentMethod'
    ];


    protected $casts = [
        'products' => 'array'
    ];
}
