"use client";

import { useState } from "react";

export const useShare = (text: string, title: string) => {
  const [shareText, setShareText] = useState("Share my score");

  const handleShare = async () => {
    const url = window.location.href;

    const shareData = {
      title: title,
      text: text,
      url: url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Share error:", err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setShareText("Copied!");
        setTimeout(() => {
          setShareText("Share my score");
        }, 2000);
      } catch (err) {
        console.error("Copy error:", err);
      }
    }
  };

  return { shareText, handleShare };
};
