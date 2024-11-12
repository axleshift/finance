<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
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
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'status' => 'required|string',
        ]);

        $invoice = Invoice::create($validated);
        return response()->json($invoice, 201);
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
