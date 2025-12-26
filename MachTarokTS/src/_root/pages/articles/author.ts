// src/articles/authors.ts
export type Author = {
  id: string;
  name: string;
  avatarSrc: string;
  bio: string[];
};

export const authors: Record<string, Author> = {
  sam: {
    id: "sam",
    name: "Samuel Mach",
    avatarSrc: "/assets/profile-pictures/profile-17.png",
    bio: [
      "Sam Mach has been playing Taroky for nearly 10 years.",
      "He has been to several local Taroky tournaments and started MachTarok.com in July of 2022."
    ],
  },
  jamesBrezina: {
    id: "jamesBrezina",
    name: "James L. Brezina, Jr.",
    avatarSrc: "/assets/profile-pictures/profile-37.png",
    bio: [
      "Second author bio goes here."
    ]
  }
};
