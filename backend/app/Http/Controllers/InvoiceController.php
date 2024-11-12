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

    // Update an existing invoice
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric',
            'description' => 'required|string',
            'status' => 'required|string',
        ]);

        $invoice = Invoice::findOrFail($id);
        $invoice->update($validated);
        return response()->json($invoice);
    }

    // Delete an invoice
    public function destroy($id)
    {
        $invoice = Invoice::findOrFail($id);
        $invoice->delete();
        return response()->json(null, 204);
    }
}
