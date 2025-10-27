import { Concern } from "./types";

// Mock data store (simulates backend state)
let concerns: Concern[] = [
  {
    id: "concern-1",
    orderId: "1",
    orderNumber: "SO-2024-001",
    issueType: "Import Customs Clearance",
    logisticsNotes: "Package held at customs. Customer requesting urgent clearance assistance.",
    status: "OPEN",
    createdById: "user-logistics-1",
    createdByName: "John Doe",
    assignedToId: null,
    assignedToName: null,
    cstNotes: null,
    externalTicketId: null,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "concern-2",
    orderId: "2",
    orderNumber: "SO-2024-002",
    issueType: "VAT&TAX&TARIFF payment",
    logisticsNotes: "Customer needs clarification on tariff charges. Amount seems incorrect.",
    status: "IN_PROGRESS",
    createdById: "user-logistics-2",
    createdByName: "Jane Smith",
    assignedToId: "user-support-1",
    assignedToName: "support",
    cstNotes: "Investigating with customs broker. Waiting for updated invoice.",
    externalTicketId: "ZD-12345",
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-16T14:20:00Z",
  },
  {
    id: "concern-3",
    orderId: "4",
    orderNumber: "SO-2024-004",
    issueType: "Others",
    logisticsNotes: "Delivery address incomplete. Need customer to provide full address details.",
    status: "OPEN",
    createdById: "user-logistics-1",
    createdByName: "John Doe",
    assignedToId: null,
    assignedToName: null,
    cstNotes: null,
    externalTicketId: null,
    createdAt: "2024-01-17T16:45:00Z",
    updatedAt: "2024-01-17T16:45:00Z",
  },
];

export const getMockConcerns = () => concerns;

export const getMockConcernsByOrderId = (orderId: string) => 
  concerns.filter(c => c.orderId === orderId);

export const getMockConcernById = (id: string) => 
  concerns.find(c => c.id === id);

export const createMockConcern = (input: {
  orderId: string;
  orderNumber: string;
  issueType: string;
  logisticsNotes: string;
  createdByName: string;
}): Concern => {
  const newConcern: Concern = {
    id: `concern-${Date.now()}`,
    orderId: input.orderId,
    orderNumber: input.orderNumber,
    issueType: input.issueType as Concern["issueType"],
    logisticsNotes: input.logisticsNotes,
    status: "OPEN",
    createdById: "current-user",
    createdByName: input.createdByName,
    assignedToId: null,
    assignedToName: null,
    cstNotes: null,
    externalTicketId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  concerns.push(newConcern);
  return newConcern;
};

export const updateMockConcern = (id: string, updates: Partial<Concern>): Concern | null => {
  const index = concerns.findIndex(c => c.id === id);
  if (index === -1) return null;
  
  concerns[index] = {
    ...concerns[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  return concerns[index];
};
