import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { concernsApi } from "./api";
import { CreateConcernInput, UpdateConcernInput } from "./types";
import { toast } from "sonner";

const QUERY_KEYS = {
  all: ["concerns"],
  byOrderId: (orderId: string) => ["concerns", "order", orderId],
  byId: (id: string) => ["concerns", id],
};

export const useGetConcerns = () => {
  return useQuery({
    queryKey: QUERY_KEYS.all,
    queryFn: concernsApi.getAll,
  });
};

export const useGetConcernsByOrderId = (orderId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.byOrderId(orderId),
    queryFn: () => concernsApi.getByOrderId(orderId),
  });
};

export const useGetConcernById = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.byId(id),
    queryFn: () => concernsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateConcern = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateConcernInput & { createdByName: string }) => 
      concernsApi.create(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.byOrderId(data.orderId) });
      toast.success("Concern created successfully");
    },
    onError: () => {
      toast.error("Failed to create concern");
    },
  });
};

export const useUpdateConcern = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateConcernInput }) =>
      concernsApi.update(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.byOrderId(data.orderId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.byId(data.id) });
      toast.success("Concern updated successfully");
    },
    onError: () => {
      toast.error("Failed to update concern");
    },
  });
};
