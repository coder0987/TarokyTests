export type Article = {
  slug: string;
  title: string;
  authorId: string;
  content: string;
  published: string;
  description: string;
};

export const articles: Article[] = [
  {
    slug: "calling-contra",
    title: "Calling Contra",
    authorId: "sam",
    content: "/content/contra.md",
    published: "December 2025",
    description: "Take a look at the underused strategy of calling contra"
  },
  {
    slug: "first-trick",
    title: "Playing the First Trick",
    authorId: "sam",
    content: "/content/first-trick.md",
    published: "March 25, 2025",
    description: "Learn the intricacies behind leading the first trick"
  },
  {
    slug: "second-hand",
    title: "Playing Second Hand Low or High",
    authorId: "jamesBrezina",
    content: "/content/second-hand.md",
    published: "August 2025",
    description: "Play the proper trump \"Second Hand\""
  }
];
