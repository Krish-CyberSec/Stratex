export const getNoticeText = (content = "") => {
  if (!content) return "";

  if (typeof window !== "undefined" && window.DOMParser) {
    const parsed = new window.DOMParser().parseFromString(content, "text/html");
    return parsed.body.textContent || "";
  }

  return String(content).replace(/<[^>]*>/g, "");
};

export const hasNoticeHtml = (content = "") => /<\/?[a-z][\s\S]*>/i.test(content);

export const sanitizeNoticeHtml = (content = "") => {
  if (!hasNoticeHtml(content)) return content;

  return String(content)
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
};
