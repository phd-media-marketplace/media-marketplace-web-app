export type MediaPartnerNotificationType = "WORK_ORDER" | "PAYMENT" | "SYSTEM";

export type MediaPartnerNotificationPriority = "LOW" | "MEDIUM" | "HIGH";

export type MediaPartnerNotification = {
	id: string;
	title: string;
	message: string;
	type: MediaPartnerNotificationType;
	priority: MediaPartnerNotificationPriority;
	createdAt: string;
	isRead: boolean;
	workOrderId?: string;
};

export type NotificationMonthGroup = {
	monthLabel: string;
	items: MediaPartnerNotification[];
};
