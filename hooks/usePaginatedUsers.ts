import { useAuth } from "@/lib/zustand/useAuth";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export const usePaginatedUsers = () => {
  const {
    user: { Faculty, Department, id },
  } = useAuth();
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.user.getAllUsers,
    {
      faculty: Faculty,
      department: Department,
      loggedInUser: id,
    },
    {
      initialNumItems: 40,
    },
  );
  const formatedResults = results.map((result) => ({
    name: result?.name,
    id: result?._id,
    image: result?.image,
    userId: result?.userId,
  }));
  return { formatedResults, status, loadMore, isLoading };
};
