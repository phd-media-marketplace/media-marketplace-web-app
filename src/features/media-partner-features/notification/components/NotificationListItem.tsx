import { useState } from "react";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  Eye,
  FileCheck2,
  FileText,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { MediaPartnerNotification } from "../types";

type NotificationListItemProps = {
  notification: MediaPartnerNotification;
  isLastInMonth: boolean;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onApprove: (id: string) => void;
  onViewWorkOrder: (workOrderId: string, notificationId: string) => void;
  onMarkRead: (id: string) => void;
  onDeleteOne: (id: string) => void;
};

const priorityClassByValue = {
  LOW: "bg-emerald-100 text-emerald-700 border-emerald-200",
  MEDIUM: "bg-amber-100 text-amber-700 border-amber-200",
  HIGH: "bg-rose-100 text-rose-700 border-rose-200",
};

function getTypeIconElement(type: MediaPartnerNotification["type"]) {
  if (type === "WORK_ORDER") {
    return <FileText className="h-4 w-4" />;
  }
  if (type === "PAYMENT") {
    return <CircleDollarSign className="h-4 w-4" />;
  }
  return <Bell className="h-4 w-4" />;
}

function formatTimeAgo(isoDate: string) {
  const date = new Date(isoDate);
  const diffMs = date.getTime() - Date.now();
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const minutes = Math.round(diffMs / (1000 * 60));
  if (Math.abs(minutes) < 60) {
    return rtf.format(minutes, "minute");
  }

  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) {
    return rtf.format(hours, "hour");
  }

  const days = Math.round(hours / 24);
  if (Math.abs(days) < 30) {
    return rtf.format(days, "day");
  }

  const months = Math.round(days / 30);
  return rtf.format(months, "month");
}

export function NotificationListItem({
  notification,
  isLastInMonth,
  isSelected,
  onToggleSelect,
  onApprove,
  onViewWorkOrder,
  onMarkRead,
  onDeleteOne,
}: NotificationListItemProps) {
  const [expanded, setExpanded] = useState(false);
  const isWorkOrderNotification = notification.type === "WORK_ORDER" && Boolean(notification.workOrderId);

  return (
    <li className="relative pl-12">
      {!isLastInMonth ? <span className="absolute left-4.5 top-10 -bottom-3 w-px bg-slate-200" /> : null}

      <div className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-primary shadow-sm">
        {getTypeIconElement(notification.type)}
      </div>

      <div className={`rounded-xl border px-4 py-3 transition ${notification.isRead ? "border-slate-200 bg-white" : "border-primary/25 bg-primary/5"}`}>
        <div className="flex items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-slate-300"
          checked={isSelected}
          onChange={() => onToggleSelect(notification.id)}
          aria-label={`Select notification ${notification.title}`}
        />

          <div className="min-w-0 flex-1">
            <button
              type="button"
              className="flex w-full items-start gap-3 text-left"
              onClick={() => setExpanded((prev) => !prev)}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-slate-900">{notification.title}</p>
                  {!notification.isRead ? <Badge className="bg-primary text-white">New</Badge> : null}
                  <Badge variant="outline" className={priorityClassByValue[notification.priority]}>
                    {notification.priority}
                  </Badge>
                </div>

                <p className="mt-1 truncate text-sm text-slate-600">{notification.message}</p>
              </div>

              <div className="flex shrink-0 items-center gap-2 pl-2">
                <span className="text-sm text-slate-500">{formatTimeAgo(notification.createdAt)}</span>
                {expanded ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
              </div>
            </button>

            {expanded ? (
              <div className="mt-3 space-y-3 border-t border-slate-200 pt-3">
                <p className="text-sm leading-relaxed text-slate-700">{notification.message}</p>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CalendarDays className="h-4 w-4" />
                  {new Date(notification.createdAt).toLocaleString()}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {isWorkOrderNotification ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        onClick={() => onApprove(notification.id)}
                      >
                        <FileCheck2 className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={() => onViewWorkOrder(notification.workOrderId as string, notification.id)}
                      >
                        <Eye className="h-4 w-4" />
                        View Work Order
                      </Button>
                    </>
                  ) : null}

                  {!notification.isRead ? (
                    <Button type="button" variant="ghost" size="sm" className="h-8" onClick={() => onMarkRead(notification.id)}>
                      <CheckCircle2 className="h-4 w-4" />
                      Mark Read
                    </Button>
                  ) : null}

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    onClick={() => onDeleteOne(notification.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </li>
  );
}
