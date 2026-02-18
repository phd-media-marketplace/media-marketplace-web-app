import { useMutation } from "@tanstack/react-query";
import  { Register } from "../api";
import type { RegisterData } from "@/types/api";

export const useRegister = () => {
    return useMutation({
        mutationFn: (formData: RegisterData) => Register(formData),
    });
}