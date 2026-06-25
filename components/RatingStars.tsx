import React from "react";

type RatingStarsProps = {
  rating: number; // 0 to 5
  maxRating?: number;
  className?: string;
  starClassName?: string;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
};

export default function RatingStars({
  rating,
  maxRating = 5,
  className = "",
  starClassName = "",
  size = 20,
  interactive = false,
  onRatingChange,
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = React.useState(0);

  const currentRating = hoverRating || rating;

  return (
    <div className={`flex items-center gap-1 ${className}`} onMouseLeave={() => setHoverRating(0)}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= currentRating;
        const isHalf = !isFilled && starValue - 0.5 <= currentRating;

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => {
              if (interactive && onRatingChange) onRatingChange(starValue);
            }}
            onMouseEnter={() => {
              if (interactive) setHoverRating(starValue);
            }}
            className={`${interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={size}
              height={size}
              fill={isFilled || isHalf ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`${
                isFilled || isHalf ? "text-yellow-400" : "text-slate-300"
              } ${starClassName}`}
            >
              {/* If it's a half star, you could use a clipPath to fill half, 
                  but for simplicity we'll just fill the whole star with a slightly different opacity if needed, 
                  or just stick to full integers. In our app rating is 1-5 integer so isHalf is rarely hit unless average is passed. */}
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
