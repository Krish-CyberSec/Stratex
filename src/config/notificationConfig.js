export const notificationTypes = [
  "system",
  "notice",
  "event",
  "user",
  "program",
  "subject",
  "attendance",
  "exam",
  "result",
  "placement",
  "fee",
  "library",
];

export const notificationPriorities = ["low", "normal", "high", "urgent"];

export const priorityClasses = {
  low: "bg-[color-mix(in_srgb,var(--success)_12%,white)] text-[var(--success)]",
  normal:
    "bg-[color-mix(in_srgb,var(--university-blue)_10%,white)] text-[var(--university-blue-dark)]",
  high: "bg-[color-mix(in_srgb,var(--warning)_16%,white)] text-[var(--warning)]",
  urgent: "bg-[color-mix(in_srgb,var(--error)_12%,white)] text-[var(--error)]",
};

export const getNotificationId = (item = {}) =>
  item.notification?._id || item.notificationId || item._id;

export const getNotificationDocument = (item = {}) => item.notification || {};

export const formatNotificationDate = (date) => {
  if (!date) {
    return "Recently";
  }

  return new Date(date).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export const formatShortDate = (date) => {
  if (!date) {
    return "Recently";
  }

  return new Date(date).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const getSenderName = (sender) =>
  sender?.fullName ||
  [sender?.firstName, sender?.lastName].filter(Boolean).join(" ") ||
  "Administration";

export const getAudienceLabel = (audience = {}) => {
  if (audience.allUsers) {
    return "All tracks";
  }

  if (audience.roles?.length) {
    return audience.roles
      .map((role) => role.replace(/([A-Z])/g, " $1"))
      .join(", ");
  }

  return "Targeted audience";
};

export const getActionLabel = (type) => {
  if (type === "notice") {
    return "Read full notice";
  }

  if (type === "event") {
    return "Read full event";
  }

  return "Read full announcement";
};

export const getNotificationTags = (notification = {}) => {
  const tags = [];
  const type = notification.type || "system";

  tags.push(`${type.charAt(0).toUpperCase()}${type.slice(1)} update`);

  if (notification.audience?.roles?.length) {
    tags.push(
      ...notification.audience.roles.map(
        (role) => role.charAt(0).toUpperCase() + role.slice(1),
      ),
    );
  }

  tags.push(getAudienceLabel(notification.audience));

  return [...new Set(tags)].slice(0, 3);
};

export const truncateText = (text = "", maxLength = 260) => {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trim()}...`;
};
