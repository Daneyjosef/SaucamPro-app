import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { serverApi } from "../lib/serverApi";
import { useAppStore } from "../store/useAppStore";

const KEY = ["watchlist"];

export function useWatchlist() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: KEY,
    queryFn: () =>
      serverApi
        .get("/api/watchlist")
        .then((r) => r.watchlist.map((w) => w.coin_id)),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });

  const mutation = useMutation({
    mutationFn: async ({ coinId, coinSymbol, willBeWatched }) => {
      if (!willBeWatched) {
        await serverApi.delete(`/api/watchlist/${coinId}`);
      } else {
        await serverApi.post("/api/watchlist", {
          coin_id: coinId,
          coin_symbol: coinSymbol,
        });
      }
    },
    onMutate: async ({ coinId, willBeWatched }) => {
      await qc.cancelQueries({ queryKey: KEY });
      const prev = qc.getQueryData(KEY) ?? [];
      qc.setQueryData(
        KEY,
        willBeWatched
          ? [...prev, coinId]
          : prev.filter((id) => id !== coinId)
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      qc.setQueryData(KEY, ctx.prev);
      toast.error("Failed to update watchlist");
    },
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const ids = query.data ?? [];

  const toggle = ({ coinId, coinSymbol }) => {
    const isCurrentlyWatched = ids.includes(coinId);
    mutation.mutate({ coinId, coinSymbol, willBeWatched: !isCurrentlyWatched });
  };

  const isWatched = (coinId) => ids.includes(coinId);

  return {
    watchlistIds: ids,
    isWatched,
    toggle,
    isLoading: query.isLoading,
  };
}
