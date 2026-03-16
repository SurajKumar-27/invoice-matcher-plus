const API_BASE = "http://localhost:8080";

export type InvoiceType = "material" | "service" | "others";

const uploadEndpoints: Record<InvoiceType, string> = {
  material: "/upload/material",
  service: "/upload/service",
  others: "/upload/others",
};

export const api = {
  getInvoices: () =>
    fetch(`${API_BASE}/invoices`).then((r) => r.json()),

  getInvoiceData: (id: string) =>
    fetch(`${API_BASE}/invoice/${id}/data`).then((r) => r.json()),

  getInvoicePdfUrl: (id: string) =>
    `${API_BASE}/invoice/${id}/pdf`,

  fetchSapGr: (invoiceNo: string) =>
    fetch(`${API_BASE}/fetch-sap/${invoiceNo}`, { method: "POST" }).then((r) => r.json()),

  fetchSes: (invoiceNo: string) =>
    fetch(`${API_BASE}/fetch-ses/${invoiceNo}`, { method: "POST" }).then((r) => r.json()),

  deleteInvoice: (id: number) =>
    fetch(`${API_BASE}/delete/${id}`).then((r) => {
      if (!r.ok) throw new Error("Delete failed");
      return r;
    }),

  uploadInvoice: (file: File, type: InvoiceType = "material") => {
    const formData = new FormData();
    formData.append("file", file);
    return fetch(`${API_BASE}${uploadEndpoints[type]}`, { method: "POST", body: formData }).then((r) => {
      if (!r.ok) throw new Error("Upload failed");
      const contentType = r.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return r.json();
      }
      return r.text().then((text) => {
        try { return JSON.parse(text); } catch { return { success: true, message: text }; }
      });
    });
  },

  getServiceInvoiceData: (id: string) =>
    fetch(`${API_BASE}/invoice/${id}/service-data`).then((r) => r.json()),

  submitForApproval: (id: string) =>
    fetch(`${API_BASE}/submit-for-approval/${id}`, { method: "POST" }).then((r) => {
      if (!r.ok) throw new Error("Submission failed");
      return r.json();
    }),

  getPendingApprovals: () =>
    fetch(`${API_BASE}/pending-approvals`).then((r) => r.json()),

  approveInvoice: (id: string) =>
    fetch(`${API_BASE}/approve/${id}`, { method: "POST" }).then((r) => {
      if (!r.ok) throw new Error("Approval failed");
      return r.json();
    }),

  rejectInvoice: (id: string, reason: string) =>
    fetch(`${API_BASE}/reject/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    }).then((r) => {
      if (!r.ok) throw new Error("Rejection failed");
      return r.json();
    }),
};
