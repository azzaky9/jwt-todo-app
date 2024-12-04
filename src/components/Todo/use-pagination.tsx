"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import type {
  HashMapPagination,
  TodoResponse,
  TPaginationInfo,
  TPaginationOption
} from "~/types";

export function useTodoPagination(todos: TodoResponse[], limit: number) {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const transformArrayasKeyPagination = () => {
    const result = {} as HashMapPagination;

    const totalPage = Math.ceil(todos.length / limit);

    for (let i = 1; i <= totalPage; i++) {
      const start = i === 1 ? 0 : (i - 1) * limit;
      const end = i * limit;
      result[i] = todos.slice(start, end);
    }

    return result;
  };

  const paginationData = useMemo(
    () => transformArrayasKeyPagination(),
    [todos, limit]
  );

  const getSize = (): TPaginationInfo => {
    const info = {
      pageSize: Object.keys(paginationData).length,
      totalDataSize: todos.length
    };

    return info;
  };

  const getOption = (): TPaginationOption => {
    const currentOption = {
      page: Number(params.get("page") ?? 1),
      limit: Number(params.get("limit") ?? 5)
    };

    return currentOption;
  };

  const updateOption = (page: number, limit: number) => {
    const url = `${pathname}?limit=${limit}&page=${page}`;
    router.replace(url, { scroll: false });
  };

  const initializeOption = () => {
    const limit = params.get("limit");
    if (!limit) updateOption(1, 10);
  };

  useEffect(() => {
    initializeOption();
  }, []);

  return {
    paginationData,
    transformArrayasKeyPagination,
    updateOption,
    getSize,
    getOption
  };
}
