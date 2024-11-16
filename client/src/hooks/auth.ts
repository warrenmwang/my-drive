import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  apiCreateUser,
  apiDeleteUser,
  apiLoginUser,
  apiLogoutUser,
  isAuthed,
} from "../api/auth-user";
import { BasicLoginInfo } from "../schema";

export const useGetIsAuthed = () => {
  return useQuery({
    queryKey: ["auth", "isAuth"],
    queryFn: isAuthed,
  });
};

export const useMutateLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (loginInfo: BasicLoginInfo) => apiLoginUser(loginInfo),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};

export const useMutationLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiLogoutUser,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};

export const useMutationDeleteAcc = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiDeleteUser,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};

export const useMutateCreateAcc = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (loginInfo: BasicLoginInfo) => apiCreateUser(loginInfo),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};
