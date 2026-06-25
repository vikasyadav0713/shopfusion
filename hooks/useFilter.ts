import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useFilter() {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams()!;

  // Create a new URLSearchParams object from current params
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      // Always reset to page 1 when a filter changes (unless the filter being changed IS the page)
      if (name !== "page") {
        params.delete("page");
      }
      
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const setFilter = (name: string, value: string) => {
    router.push(`${pathname}?${createQueryString(name, value)}`, { scroll: false });
  };

  const deleteFilter = (name: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(name);
    if (name !== "page") params.delete("page"); // Reset page on filter clear
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const toggleArrayFilter = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentValues = params.get(name)?.split(",") || [];
    
    if (currentValues.includes(value)) {
      // Remove it
      const newValues = currentValues.filter((v) => v !== value);
      if (newValues.length > 0) {
        params.set(name, newValues.join(","));
      } else {
        params.delete(name);
      }
    } else {
      // Add it
      currentValues.push(value);
      params.set(name, currentValues.join(","));
    }
    
    params.delete("page"); // Reset page
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    // Preserve search query if it exists
    const q = searchParams.get("q");
    if (q) {
      router.push(`${pathname}?q=${q}`, { scroll: false });
    } else {
      router.push(pathname, { scroll: false });
    }
  };

  return {
    searchParams,
    setFilter,
    deleteFilter,
    toggleArrayFilter,
    clearAllFilters,
    createQueryString,
  };
}
