import { useQuery } from "@tanstack/react-query";
import { isAuthed } from "../api/auth-user";

export function useGetIsAuthed() {
  return useQuery({
    queryKey: ["auth", "isAuth"],
    queryFn: isAuthed,
  });
}
