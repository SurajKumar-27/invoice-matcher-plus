const API_BASE = "http://localhost:8080";

export const api = {
  getInvoices: () =>
    fetch(`${API_BASE}/invoices`).then((r) => r.json()),

  getInvoiceData: (id: string) =>
    fetch(`${API_BASE}/invoice/${id}/data`).then((r) => r.json()),

  getInvoicePdfUrl: (id: string) =>
    `${API_BASE}/invoice/${id}/pdf`,

  fetchSapGr: (invoiceNo: string) =>
    fetch(`${API_BASE}/fetch-sap/${invoiceNo}`, { method: "POST" }).then((r) => r.json()),

  deleteInvoice: (id: number) =>
    fetch(`${API_BASE}/delete/${id}`).then((r) => {
      if (!r.ok) throw new Error("Delete failed");
      return r;
    }),

  uploadInvoice: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return fetch(`${API_BASE}/upload`, { method: "POST", body: formData }).then((r) => r.json());
  },
};
