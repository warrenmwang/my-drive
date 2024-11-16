import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FILE_ORIGIN } from "../config";
import { DeleteFileAPIRes, DeleteFileAPIResSchema } from "../schema";

export const useDeleteFileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (fileID: string): Promise<DeleteFileAPIRes> => {
      return axios
        .delete(`${FILE_ORIGIN}/delete/${fileID}`, {
          withCredentials: true,
          headers: {
            Accept: "application/json",
          },
        })
        .then((res) => res.data)
        .then((data) => DeleteFileAPIResSchema.parse(data));
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["drive"],
      });
    },
  });
};
