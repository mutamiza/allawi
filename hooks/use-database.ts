
import { useCallback, useState } from "react";

export function useDatabase() {
  const [loading, setLoading] = useState(false);
  const [systemMode, setSystemMode] = useState("simulation");
  const [isConfigured, setIsConfigured] = useState(true);
  const [error, setError] = useState(null);
  const [dbConfig, setDbConfig] = useState(null);

  const mockUsers = [{ id: 1, name: "Test User" }];
  const mockPayments = [{ id: 1, amount: 1000 }];

  const getUsers = useCallback(async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setLoading(false);
    return mockUsers;
  }, []);

  const getPayments = useCallback(async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setLoading(false);
    return mockPayments;
  }, []);

  const getDashboardStats = useCallback(async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
    return {
      totalContracts: 0,
      totalPayments: 0,
    };
  }, []);

  return {
    loading,
    systemMode,
    isConfigured,
    error,
    dbConfig,
    getUsers,
    getPayments,
    getDashboardStats,
  };
}
