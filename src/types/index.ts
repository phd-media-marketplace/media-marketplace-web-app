import type React from "react";

export interface items{
    title: string;
    url?: string;
}
export interface NavigationItem {
    title: string;
    url?: string;
    icon: React.ElementType;
    items?:items[];
}