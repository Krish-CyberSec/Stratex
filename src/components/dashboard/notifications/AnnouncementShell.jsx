import React from "react";

const AnnouncementShell = ({ children, maxWidth = "max-w-5xl" }) => {
  return (
    <section className={`mx-auto w-full ${maxWidth} px-1 pb-8`}>
      {children}
    </section>
  );
};

export default AnnouncementShell;
