import { useMemo, useState } from "react";
import { mediaPartnerNotificationDummyData } from "../dummy-data";
import type { MediaPartnerNotification, NotificationMonthGroup } from "../types";

const ITEMS_PER_PAGE = 6;

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

function sortNotificationsByDateDesc(items: MediaPartnerNotification[]) {
  return [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function groupNotificationsByMonth(items: MediaPartnerNotification[]): NotificationMonthGroup[] {
  const map = new Map<string, MediaPartnerNotification[]>();

  items.forEach((item) => {
    const key = monthFormatter.format(new Date(item.createdAt));
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)?.push(item);
  });

  return Array.from(map.entries()).map(([monthLabel, groupedItems]) => ({
    monthLabel,
    items: groupedItems,
  }));
}

export function useMediaPartnerNotifications() {
  const [notifications, setNotifications] = useState<MediaPartnerNotification[]>(() =>
    sortNotificationsByDateDesc(mediaPartnerNotificationDummyData),
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(notifications.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const setClampedCurrentPage = (action: number | ((prev: number) => number)) => {
    setCurrentPage((prev) => {
      const nextValue = typeof action === "function" ? action(prev) : action;
      return Math.max(1, Math.min(nextValue, totalPages));
    });
  };

  const pageItems = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return notifications.slice(start, start + ITEMS_PER_PAGE);
  }, [notifications, safeCurrentPage]);

  const groupedPageItems = useMemo(() => groupNotificationsByMonth(pageItems), [pageItems]);

  const allPageSelected = pageItems.length > 0 && pageItems.every((item) => selectedIds.includes(item.id));

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleSelectAllOnPage = () => {
    setSelectedIds((prev) => {
      if (allPageSelected) {
        const pageIds = new Set(pageItems.map((item) => item.id));
        return prev.filter((id) => !pageIds.has(id));
      }

      const merged = new Set(prev);
      pageItems.forEach((item) => merged.add(item.id));
      return Array.from(merged);
    });
  };

  const markSelectedAsRead = () => {
    if (selectedIds.length === 0) {
      return;
    }

    const selectedSet = new Set(selectedIds);
    setNotifications((prev) => prev.map((item) => (selectedSet.has(item.id) ? { ...item, isRead: true } : item)));
  };

  const deleteSelected = () => {
    if (selectedIds.length === 0) {
      return;
    }

    const selectedSet = new Set(selectedIds);
    setNotifications((prev) => prev.filter((item) => !selectedSet.has(item.id)));
    setSelectedIds([]);
  };

  const deleteOne = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
    setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
  };

  const approveWorkOrderNotification = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === notificationId ? { ...item, isRead: true, title: "Work Order Approved" } : item)),
    );
  };

  const markOneAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((item) => (item.id === notificationId ? { ...item, isRead: true } : item)));
  };

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return {
    notifications,
    unreadCount,
    groupedPageItems,
    selectedIds,
    currentPage: safeCurrentPage,
    totalPages,
    allPageSelected,
    pageItems,
    setCurrentPage: setClampedCurrentPage,
    toggleSelectOne,
    toggleSelectAllOnPage,
    markSelectedAsRead,
    deleteSelected,
    deleteOne,
    approveWorkOrderNotification,
    markOneAsRead,
  };
}
