<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\productModel;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    // Get all invoices
    public function index()
    {
        return response()->json(Invoice::all());
    }

    // Create a new invoice
    public function store(Request $request)
    {
        // Convert 'products' array to JSON
        $invoiceData = $request->all();
        $invoiceData['products'] = json_encode($invoiceData['products']); // Convert products array to JSON

        // Create the invoice
        $invoice = Invoice::create($invoiceData);

        return response()->json(['success' => true, 'invoice' => $invoice], 201);
    }



    // Get a single invoice by ID
    public function show($id)
    {
        $invoice = Invoice::findOrFail($id);
        return response()->json($invoice);
    }

    public function update(Request $request, $id)
    {
        // Validate the incoming data
        $validatedData = $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:15',
            'paymentMethod' => 'required|string|max:255',
            'selectedCurrency' => 'required|string|max:10',
            'status' => 'required|string',
            'products' => 'required|array|min:1',  // Ensure products are provided and not empty
            'products.*.name' => 'required|string|max:255',  // Validate each product's name
            'products.*.price' => 'required|numeric|min:0',  // Validate price as a number
            'products.*.quantity' => 'required|integer|min:1',  // Validate quantity as an integer
        ]);

        // Find the existing invoice
        $invoice = Invoice::findOrFail($id);

        // Calculate the total amount based on products
        $totalAmount = 0;
        foreach ($validatedData['products'] as $product) {
            $totalAmount += $product['price'] * $product['quantity'];  // Price * Quantity
        }

        // Include the totalAmount in the data
        $validatedData['totalAmount'] = $totalAmount;

        // Convert 'products' array to JSON for storage
        $validatedData['products'] = json_encode($validatedData['products']);

        // Update the invoice with the new data
        $invoice->update($validatedData);

        return response()->json(['success' => true, 'invoice' => $invoice]);
    }


    // Delete an invoice
    public function destroy($id)
    {
        $invoice = Invoice::findOrFail($id);
        $invoice->delete();
        return response()->json(null, 200);
    }


    public function statusUpdate(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string'
        ]);

        $invoice = Invoice::findOrFail($id);
        $invoice->update($validated);

        return response()->json($invoice);
    }
}
