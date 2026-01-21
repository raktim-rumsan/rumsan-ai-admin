"use client";

import { useCallback, useEffect, useState } from "react";

type UseHorizontalScrollOptions = {
  step?: number;
};

export function useHorizontalScroll(
  ref: React.RefObject<HTMLElement>,
  options: UseHorizontalScrollOptions = {}
) {
  const { step = 200 } = options;
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  const updateScrollState = useCallback(() => {
    if (!ref.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = ref.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    setHasOverflow(scrollWidth > clientWidth + 1);
  }, [ref]);

  const scrollLeft = useCallback(() => {
    ref.current?.scrollBy({ left: -step, behavior: "smooth" });
  }, [ref, step]);

  const scrollRight = useCallback(() => {
    ref.current?.scrollBy({ left: step, behavior: "smooth" });
  }, [ref, step]);

  useEffect(() => {
    updateScrollState();
    const element = ref.current;
    if (!element) return;

    const handleResize = () => updateScrollState();
    element.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", handleResize);

    return () => {
      element.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", handleResize);
    };
  }, [ref, updateScrollState]);

  return {
    canScrollLeft,
    canScrollRight,
    hasOverflow,
    scrollLeft,
    scrollRight,
  };
}

