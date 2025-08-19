import React, { useEffect, useState } from "react";

type ChatScrollProps = {
  topRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  loadMore: () => void;
  count: boolean;
  shouldLoadMore: boolean;
};

export function useChatScroll({
  topRef,
  bottomRef,
  loadMore,
  count,
  shouldLoadMore,
}: ChatScrollProps) {
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const topRefDiv = topRef?.current;

    if (!topRefDiv) {
      return; // Exit if the ref is not assigned yet
    }

    const handleScroll = () => {
      const scrollTop = topRefDiv?.scrollTop;
      if (scrollTop === 0 && shouldLoadMore) {
        loadMore();
      }
    };

    topRefDiv.addEventListener("scroll", handleScroll);

    // Cleanup function to remove the event listener.
    return () => {
      topRefDiv.removeEventListener("scroll", handleScroll);
    };
  }, [topRef, loadMore, shouldLoadMore]);

  useEffect(() => {
    const bottomCurrent = bottomRef?.current;
    const topDiv = topRef?.current;
    const shouldScroll = () => {
      if (!hasStarted && bottomCurrent) {
        setHasStarted(true);
        return true;
      }

      if (!topDiv) return false;

      const distanceFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;

      return distanceFromBottom <= 100;
    };

    if (shouldScroll()) {
      setTimeout(() => {
        bottomCurrent?.scrollIntoView({
          behavior: "smooth",
        });
      }, 200);
    }
  }, [bottomRef, topRef, count, hasStarted]);
}
