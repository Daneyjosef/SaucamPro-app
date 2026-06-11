import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { serverApi } from "../lib/serverApi";
import { useAppStore } from "../store/useAppStore";

const KEY = ["alerts"];

export function useAlerts() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: KEY,
    queryFn: () => serverApi.get("/api/alerts").then((r) => r.alerts),
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
  });
}

export function useCreateAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => serverApi.post("/api/alerts", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Price alert created");
    },
    onError: (err) => toast.error(err.message || "Failed to create alert"),
  });
}

export function useDeleteAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => serverApi.delete(`/api/alerts/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Alert deleted");
    },
    onError: (err) => toast.error(err.message || "Failed to delete alert"),
  });
}
