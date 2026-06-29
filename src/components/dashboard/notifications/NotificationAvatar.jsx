import React from "react";
import {
  getInitials,
  getSenderImage,
  getSenderName,
} from "../../../config/notificationConfig";

const NotificationAvatar = ({ sender, size = "md", badge }) => {
  const senderName = getSenderName(sender);
  const image = getSenderImage(sender);
  const sizeClassName = size === "sm" ? "h-10 w-10" : "h-11 w-11";

  return (
    <div className="relative shrink-0">
      {image ? (
        <img
          src={image}
          alt={senderName}
          className={`${sizeClassName} rounded-full object-cover ring-2 ring-[var(--university-surface-soft)]`}
        />
      ) : (
        <div
          className={`${sizeClassName} flex items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--university-blue)_14%,white)] text-xs font-bold text-[var(--university-blue-dark)] ring-2 ring-[var(--university-surface-soft)]`}
          aria-label={senderName}
        >
          {getInitials(senderName)}
        </div>
      )}

      {badge && (
        <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--university-blue)] text-[9px] font-bold uppercase text-white ring-2 ring-white">
          {badge}
        </span>
      )}
    </div>
  );
};

export default NotificationAvatar;
