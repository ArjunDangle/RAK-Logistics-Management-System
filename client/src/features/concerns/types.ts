export type ConcernStatus = "OPEN" | "IN_PROGRESS" | "SOLVED";

export type IssueType = 
  | "VAT&TAX&TARIFF payment" 
  | "Import Customs Clearance" 
  | "Others";

export interface Concern {
  id: string;
  orderId: string;
  orderNumber: string;
  issueType: IssueType;
  logisticsNotes: string;
  status: ConcernStatus;
  createdById: string;
  createdByName: string;
  assignedToId: string | null;
  assignedToName: string | null;
  cstNotes: string | null;
  externalTicketId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConcernInput {
  orderId: string;
  orderNumber: string;
  issueType: IssueType;
  logisticsNotes: string;
}

export interface UpdateConcernInput {
  assignedToId?: string;
  assignedToName?: string;
  cstNotes?: string;
  externalTicketId?: string;
  status?: ConcernStatus;
}
