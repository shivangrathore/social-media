import React from "react";

export function RichPostContent({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const regex = /([@#][\w-]+)\b/g;
  const parts = content.split(regex);

  return (
    <div className={className}>
      {parts.map((part, index) => {
        if (part.startsWith("#")) {
          return (
            <a
              key={index}
              href={`/tags/${part.slice(1)}`}
              className="text-blue-500 hover:underline"
            >
              {part}
            </a>
          );
        } else if (part.startsWith("@")) {
          return (
            <a
              key={index}
              href={`/u/${part.slice(1)}`}
              className="text-blue-500 hover:underline"
            >
              {part}
            </a>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
}
