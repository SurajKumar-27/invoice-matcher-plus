

## Plan: Direct Invoice Type — Simplified Detail View

### What Changes

**`src/pages/invoices/InvoiceDetail.tsx`** — Conditionally render based on `invoice_type`:

- **Direct invoices** (`invoice_type === "direct"`):
  - Header badge: show "Ready for SAP" always (no match logic needed)
  - Remove "3-Way Match Verification Report" subtitle — show "Direct Invoice" instead
  - Hide OCR Confidence and Validation stats
  - Hide GR Number and SES Number from the sidebar info card
  - Simplify the items table: show only Item Code, Description, OCR Qty, OCR Rate, PO/Item — no SAP Qty, SAP Rate, or Result columns
  - "Submit for Approval" button always available for finance (no `allMatch` gate)
  - Skip SAP sync on load — no need to call the endpoint expecting GR/SES data; still call `getInvoiceData` for OCR data but skip the "Synchronizing with SAP" message, show "Loading invoice..." instead
  - Approver buttons remain the same

- **Material/Service invoices**: no changes, keep existing 3-way match behavior

**`src/pages/invoices/InvoiceList.tsx`** — Already correct: no Fetch GR/SES buttons for direct type.

### Backend Prompts

**Direct Invoice Upload Endpoint:**
```
Create POST /upload/direct that accepts a PDF file upload, runs OCR extraction to get invoice_no, invoice_date, total, and line items (item_code, description, quantity, rate, po_number, po_item). Store the result with invoice_type = "direct". Do NOT fetch any GR or SES data. Return { success: true, id: <invoice_id> }.
```

**Direct Invoice Data Endpoint (if different from existing):**
```
For GET /invoice/{id}/data — when the invoice has invoice_type = "direct", skip the SAP GR/SES sync step. Just return the OCR-extracted data directly from the database without calling SAP. The response format stays the same but sap_quantity and sap_price fields will be empty/null.
```

### Files to Modify

| Action | File |
|--------|------|
| Modify | `src/pages/invoices/InvoiceDetail.tsx` |

