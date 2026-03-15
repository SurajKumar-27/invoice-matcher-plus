

## Approval Workflow — Implementation Plan

### Understanding

The approver is a **separate user** (`approverinvoice@gmail.com`) who logs in from the **same Finance tab** on the login page. The system detects the role based on the email — no new login tab needed.

### Workflow

```text
Finance logs in → reviews invoice → clicks "Submit for Approval"
       ↓
Invoice status → "Pending Approval"
       ↓
Approver logs in (Finance tab, different email) → sees "Approval Queue"
       ↓
Opens invoice → clicks "Approve & Post to SAP" → MAIRO success
                  or "Reject" with reason → status = "Rejected"
```

### Changes

**1. `src/hooks/useAuth.tsx`**
- Add `"approver"` to `UserRole` union type
- Add approver credentials: `approverinvoice@gmail.com` / `1234`
- Login logic: if email matches approver creds (regardless of selected tab), assign role `"approver"`; keep existing vendor/finance logic otherwise

**2. `src/lib/api.ts`** — Add 4 new functions:
- `submitForApproval(id)` → `POST /submit-for-approval/:id`
- `getPendingApprovals()` → `GET /pending-approvals`
- `approveInvoice(id)` → `POST /approve/:id`
- `rejectInvoice(id, reason)` → `POST /reject/:id`

**3. `src/pages/auth/Login.tsx`**
- No UI changes — approver uses the Finance tab
- The auth hook handles role assignment by email

**4. `src/pages/invoices/InvoiceDetail.tsx`**
- **Finance role**: replace "Post to SAP" with **"Submit for Approval"** → navigates to `SubmissionSuccess` page
- **Approver role**: show **"Approve & Post to SAP"** and **"Reject"** buttons
  - Approve → calls `approveInvoice`, navigates to SAP success page
  - Reject → opens a dialog with reason textarea, calls `rejectInvoice`, navigates back to approvals

**5. `src/components/invoices/StatusBadge.tsx`**
- Add: `pending approval` (purple), `approved` (green), `rejected` (red)

**6. `src/components/layout/Sidebar.tsx`**
- Add "Approval Queue" nav item with `ClipboardCheck` icon, visible to `approver` role
- Approver sees: Dashboard, Approval Queue, Upload Invoice
- Update portal label to show "Approver Portal" for approver role

**7. `src/App.tsx`**
- Add `ApproverRoute` guard
- Add route `/approvals` → `ApprovalQueue`
- Allow approver to access `/invoices/:id` for review

**8. Create `src/pages/invoices/ApprovalQueue.tsx`**
- Table listing invoices with `Pending Approval` status (fetched from `GET /pending-approvals`)
- Columns: #, Invoice No, Submitted By, Date, Status, Review link

**9. Create `src/pages/invoices/SubmissionSuccess.tsx`**
- Confirmation page: "Invoice submitted for approval" with invoice number
- Button to go back to invoices list

### Backend Prompts (for your other chatbot)

**Prompt 1 — Submit for Approval:**
```
I have an Express.js backend with invoices in a database with a "status" field. Create POST /submit-for-approval/:id that updates the invoice status to "Pending Approval" and returns { success: true, message: "Invoice submitted for approval" }. Return 404 if not found.
```

**Prompt 2 — Get Pending Approvals:**
```
Create GET /pending-approvals that returns all invoices where status = "Pending Approval" as a JSON array, ordered by newest first.
```

**Prompt 3 — Approve Invoice:**
```
I have a working POST /post-sap/:id endpoint that posts to SAP and returns { sap_mairo_number }. Create POST /approve/:id that: updates status to "Approved", calls the SAP posting logic, saves the MAIRO number, updates status to "Submitted", and returns { success: true, sap_mairo_number }. On SAP failure, revert status to "Pending Approval" and return 500.
```

**Prompt 4 — Reject Invoice:**
```
Create POST /reject/:id that accepts { reason: string }, updates status to "Rejected", stores the rejection reason and timestamp, and returns { success: true }.
```

### Files Summary

| Action | File |
|--------|------|
| Modify | `src/hooks/useAuth.tsx` |
| Modify | `src/lib/api.ts` |
| Modify | `src/pages/invoices/InvoiceDetail.tsx` |
| Modify | `src/components/invoices/StatusBadge.tsx` |
| Modify | `src/components/layout/Sidebar.tsx` |
| Modify | `src/App.tsx` |
| Create | `src/pages/invoices/ApprovalQueue.tsx` |
| Create | `src/pages/invoices/SubmissionSuccess.tsx` |

