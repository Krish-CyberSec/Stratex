import {
  PersonFillIcon,
  InboxFillIcon,
  BookmarkFillIcon,
  NoteIcon,
  FileDirectoryOpenFillIcon,
  MegaphoneIcon,
  PeopleIcon,
  OrganizationIcon,
} from "@primer/octicons-react";

export const menuConfig = {
  superAdmin: [
    {
      name: "Profile",
      icon: PersonFillIcon,
      path: "/dashboard/profile",
    },
    {
      name: "Notifications",
      icon: InboxFillIcon,
      path: "/dashboard/notifications",
    },
    {
      name: "Users",
      icon: PeopleIcon,
      path: "/dashboard/users",
    },
    {
      name: "Schools",
      icon: OrganizationIcon,
      path: "/dashboard/schools",
    },
    {
      name: "Programs",
      icon: FileDirectoryOpenFillIcon,
      path: "/dashboard/programs",
    },
    {
      name: "Subjects",
      icon: BookmarkFillIcon,
      path: "/dashboard/subjects",
    },
    {
      name: "Notices",
      icon: NoteIcon,
      path: "/dashboard/notices",
    },
    {
      name: "Events",
      icon: MegaphoneIcon,
      path: "/dashboard/events",
    },
  ],

  schoolAdmin: [
    {
      name: "Profile",
      icon: PersonFillIcon,
      path: "/dashboard/profile",
    },
    {
      name: "Notifications",
      icon: InboxFillIcon,
      path: "/dashboard/notifications",
    },
    {
      name: "Users",
      icon: PeopleIcon,
      path: "/dashboard/users",
    },
    {
      name: "Programs",
      icon: FileDirectoryOpenFillIcon,
      path: "/dashboard/programs",
    },
    {
      name: "Subjects",
      icon: BookmarkFillIcon,
      path: "/dashboard/subjects",
    },
    {
      name: "Notices",
      icon: NoteIcon,
      path: "/dashboard/notices",
    },
    {
      name: "Events",
      icon: MegaphoneIcon,
      path: "/dashboard/events",
    },
  ],

  faculty: [
    {
      name: "Profile",
      icon: PersonFillIcon,
      path: "/dashboard/profile",
    },
    {
      name: "Notifications",
      icon: InboxFillIcon,
      path: "/dashboard/notifications",
    },
    {
      name: "Subjects",
      icon: BookmarkFillIcon,
      path: "/dashboard/subjects",
    },
    {
      name: "Notices",
      icon: NoteIcon,
      path: "/dashboard/notices",
    },
    {
      name: "Events",
      icon: MegaphoneIcon,
      path: "/dashboard/events",
    },
  ],

  student: [
    {
      name: "Profile",
      icon: PersonFillIcon,
      path: "/dashboard/profile",
    },
    {
      name: "Notifications",
      icon: InboxFillIcon,
      path: "/dashboard/notifications",
    },
    {
      name: "Notices",
      icon: NoteIcon,
      path: "/dashboard/notices",
    },
    {
      name: "Events",
      icon: MegaphoneIcon,
      path: "/dashboard/events",
    },
  ],

  examCell: [
    {
      name: "Profile",
      icon: PersonFillIcon,
      path: "/dashboard/profile",
    },
    {
      name: "Notifications",
      icon: InboxFillIcon,
      path: "/dashboard/notifications",
    },
    {
      name: "Notices",
      icon: NoteIcon,
      path: "/dashboard/notices",
    },
    {
      name: "Events",
      icon: MegaphoneIcon,
      path: "/dashboard/events",
    },
  ],
};