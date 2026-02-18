import { useMutation } from "@tanstack/react-query";
import { login } from "../api";
import type { LogInFormData } from "../types";

export const useLogin = () => {
    return useMutation({
        mutationFn: ({email, password}: LogInFormData) => login({email, password}),
    });
}