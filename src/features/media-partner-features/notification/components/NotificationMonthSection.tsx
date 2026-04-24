import type { NotificationMonthGroup } from "../types";
import { NotificationListItem } from "./NotificationListItem";

type NotificationMonthSectionProps = {
  group: NotificationMonthGroup;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onApprove: (id: string) => void;
  onViewWorkOrder: (workOrderId: string, notificationId: string) => void;
  onMarkRead: (id: string) => void;
  onDeleteOne: (id: string) => void;
};

export function NotificationMonthSection({
  group,
  selectedIds,
  onToggleSelect,
  onApprove,
  onViewWorkOrder,
  onMarkRead,
  onDeleteOne,
}: NotificationMonthSectionProps) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{group.monthLabel}</h3>
      <ul className="space-y-3">
        {group.items.map((notification, index) => (
          <NotificationListItem
            key={notification.id}
            notification={notification}
            isLastInMonth={index === group.items.length - 1}
            isSelected={selectedIds.includes(notification.id)}
            onToggleSelect={onToggleSelect}
            onApprove={onApprove}
            onViewWorkOrder={onViewWorkOrder}
            onMarkRead={onMarkRead}
            onDeleteOne={onDeleteOne}
          />
        ))}
      </ul>
    </section>
  );
}
