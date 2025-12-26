import { introTutorial } from "@/content/tutorials/basics";
import { Tutorial } from "@/types";

export type TutorialMeta = {
  slug: string;
  title: string;
  authorId: string;
  index: number;
  published: string;
  description: string;
};

export const tutorials: Tutorial[] = [
    introTutorial,
]

export const tutorialsMeta: TutorialMeta[] = [
    {
        slug: 'intro-tutorial',
        title: 'Learn the Basics',
        authorId: 'sam',
        index: 0,
        published: 'June 2025',
        description: 'Take grandpa\'s place at the table and learn the basics of playing Taroky'
    }
]