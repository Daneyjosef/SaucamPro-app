import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { serverApi } from "../lib/serverApi";
import { useAppStore } from "../store/useAppStore";

const KEY = ["portfolio"];

export function usePortfolio() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: KEY,
    queryFn: () => serverApi.get("/api/portfolio").then((r) => r.portfolio),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });
}

export function useAddHolding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => serverApi.post("/api/portfolio", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Holding added");
    },
    onError: (err) => toast.error(err.message || "Failed to add holding"),
  });
}

export function useRemoveHolding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => serverApi.delete(`/api/portfolio/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
    onError: (err) => toast.error(err.message || "Failed to remove holding"),
  });
}

export function useUpdateHolding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => serverApi.put(`/api/portfolio/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
    onError: (err) => toast.error(err.message || "Failed to update holding"),
  });
}
