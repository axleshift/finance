<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('firstName')->nullable();
            $table->string('lastName')->nullable();
            $table->string("email")->nullable();
            $table->string("phone")->nullable();
            $table->string('address')->nullable();
            $table->string('invoices')->nullable();
            $table->string('showReceipt')->nullable();
            $table->string('editInvoice')->nullable();
            $table->string('selectedCurrency')->nullable();
            $table->string('status')->nullable();
            $table->string('paymentMethod')->nullable();
            $table->json('products')->nullable();
            $table->integer('totalAmount')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
