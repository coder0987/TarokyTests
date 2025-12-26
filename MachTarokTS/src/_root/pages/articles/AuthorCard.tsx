// src/articles/AuthorCard.tsx
import React from "react";
import { Author } from "./author";

const AuthorCard: React.FC<{ author: Author, published?: string }> = ({ author, published }) => {
  return (
    <div className="border-t border-gray-300 pt-4 mt-4 flex flex-col md:flex-row items-start md:items-center">
      <div className="md:w-1/6 w-1/4">
        <img src={author.avatarSrc} alt={author.name} className="rounded-full w-full" />
      </div>
      <div className="md:w-5/6 w-3/4 md:pl-4 mt-2 md:mt-0">
        <h2 className="text-xl font-semibold mb-2">About the Author</h2>
        {author.bio.map((value: string) => (
            <p>{value}</p>
        ))}
        {published && <p>This article was published {published}</p>}
      </div>
    </div>
  );
};

export default AuthorCard;
