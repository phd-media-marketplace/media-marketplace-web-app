import { useNavigate } from "react-router-dom";
import { BellRing, CheckCheck, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Header from "@/components/universal/Header";
import { useMediaPartnerNotifications } from "../hooks/useMediaPartnerNotifications";
import { NotificationMonthSection } from "../components/NotificationMonthSection";

export default function MediaPartnerNotificationsPage() {
  const navigate = useNavigate();
  const {
    groupedPageItems,
    selectedIds,
    currentPage,
    totalPages,
    allPageSelected,
    pageItems,
    unreadCount,
    setCurrentPage,
    toggleSelectOne,
    toggleSelectAllOnPage,
    markSelectedAsRead,
    deleteSelected,
    deleteOne,
    approveWorkOrderNotification,
    markOneAsRead,
    notifications,
  } = useMediaPartnerNotifications();

  const handleApprove = (notificationId: string) => {
    approveWorkOrderNotification(notificationId);
    toast.success("Work order approved from notification.");
  };

  const handleViewWorkOrder = (workOrderId: string, notificationId: string) => {
    markOneAsRead(notificationId);
    navigate(`/media-partner/work-orders/${workOrderId}`);
  };

  const handleDeleteOne = (id: string) => {
    deleteOne(id);
    toast.success("Notification deleted.");
  };

  return (
    <div className="space-y-6 pb-10">
      <Header
        title="Notifications"
        description="Track work order updates, payment events, and system alerts."
        backbtnVisible={false}
      />

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <BellRing className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Notification Inbox</p>
              <p className="text-sm text-slate-500">
                {notifications.length} total notifications, {unreadCount} unread.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300"
                checked={allPageSelected}
                onChange={toggleSelectAllOnPage}
                aria-label="Select all notifications on current page"
              />
              Select All
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                markSelectedAsRead();
                toast.success("Selected notifications marked as read.");
              }}
              disabled={selectedIds.length === 0}
            >
              <CheckCheck className="h-4 w-4" />
              Mark as Read
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-rose-200 text-rose-700 hover:bg-rose-50"
              onClick={() => {
                deleteSelected();
                toast.success("Selected notifications deleted.");
              }}
              disabled={selectedIds.length === 0}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="space-y-6 px-4 py-4">
          {pageItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center text-slate-500">
              No notifications to display.
            </div>
          ) : (
            groupedPageItems.map((group) => (
              <NotificationMonthSection
                key={group.monthLabel}
                group={group}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelectOne}
                onApprove={handleApprove}
                onViewWorkOrder={handleViewWorkOrder}
                onMarkRead={markOneAsRead}
                onDeleteOne={handleDeleteOne}
              />
            ))
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
          <p className="text-sm text-slate-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage >= totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
