import { 
  getMockConcerns, 
  getMockConcernsByOrderId, 
  getMockConcernById,
  createMockConcern,
  updateMockConcern 
} from "./mockData";
import { CreateConcernInput, UpdateConcernInput, Concern } from "./types";

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const concernsApi = {
  // Get all concerns
  getAll: async (): Promise<Concern[]> => {
    await delay(300);
    return getMockConcerns();
  },

  // Get concerns by order ID
  getByOrderId: async (orderId: string): Promise<Concern[]> => {
    await delay(200);
    return getMockConcernsByOrderId(orderId);
  },

  // Get single concern by ID
  getById: async (id: string): Promise<Concern | null> => {
    await delay(200);
    return getMockConcernById(id);
  },

  // Create new concern
  create: async (input: CreateConcernInput & { createdByName: string }): Promise<Concern> => {
    await delay(400);
    return createMockConcern(input);
  },

  // Update concern
  update: async (id: string, updates: UpdateConcernInput): Promise<Concern> => {
    await delay(400);
    const updated = updateMockConcern(id, updates);
    if (!updated) throw new Error("Concern not found");
    return updated;
  },
};
