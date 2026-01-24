/* eslint-disable react-hooks/set-state-in-effect */
import { PAGINATION } from "@/features/workflows/server/constants";
import { useEffect, useState } from "react";

interface EntitySearchProps<
  T extends {
    search: string;
    page: number;
  },
> {
  params: T;
  setParams: (params: T) => void;
  debounceMs?: number;
}

function useEntitySearch<
  T extends {
    search: string;
    page: number;
  },
>({ params, setParams, debounceMs = 500 }: EntitySearchProps<T>) {
  const [localSearch, setLocalSearch] = useState(params.search);

  useEffect(() => {
    if (localSearch == "" && params.search !== "") {
      setParams({
        ...params,
        search: "",
        page: PAGINATION.page,
      });
    }

    const timer = setTimeout(() => {
      if (localSearch !== params.search) {
        setParams({
          ...params,
          search: localSearch,
          page: PAGINATION.page,
        });
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [params, setParams, localSearch, debounceMs]);

  useEffect(() => {
    setLocalSearch(params.search);
  }, [params.search]);

  return {
    searchValue: localSearch,
    setSearch: setLocalSearch,
  };
}

export default useEntitySearch;
