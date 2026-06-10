import { useQuery } from "@tanstack/react-query";
import {
  fetchGlobalData,
  fetchCoins,
  fetchCoinById,
  fetchMarketChart,
  fetchTrending,
  fetchTopMovers,
  searchCoins,
  fetchCategories,
} from "../lib/api";

export const useGlobalData = () =>
  useQuery({
    queryKey: ["global"],
    queryFn: fetchGlobalData,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 60 * 1000,
  });

export const useCoins = ({ currency = "usd", page = 1, perPage = 20, order = "market_cap_desc", sparkline = false, category } = {}) =>
  useQuery({
    queryKey: ["coins", currency, page, perPage, order, sparkline, category],
    queryFn: () =>
      fetchCoins({ currency, page, perPage, order, sparkline, category }),
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });

export const useCoinById = (id) =>
  useQuery({
    queryKey: ["coin", id],
    queryFn: () => fetchCoinById(id),
    enabled: !!id,
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  });

export const useMarketChart = (id, { currency = "usd", days = "7" } = {}) =>
  useQuery({
    queryKey: ["chart", id, currency, days],
    queryFn: () => fetchMarketChart(id, { currency, days }),
    enabled: !!id,
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });

export const useTrending = () =>
  useQuery({
    queryKey: ["trending"],
    queryFn: fetchTrending,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });

export const useTopMovers = ({ currency = "usd" } = {}) =>
  useQuery({
    queryKey: ["topMovers", currency],
    queryFn: () => fetchTopMovers({ currency }),
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });

export const useSearch = (query) =>
  useQuery({
    queryKey: ["search", query],
    queryFn: () => searchCoins(query),
    enabled: query?.length > 1,
    staleTime: 60 * 1000,
  });

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000,
  });
