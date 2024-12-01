import { useState, useEffect, useRef } from "react";

const useInfiniteScroll = (callback, hasMore) => {
  const [page, setPage] = useState(1);
  const observer = useRef();

  const lastElementRef = (node) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  };

  useEffect(() => {
    if (page > 1) {
      callback(page);
    }
  }, [page, callback]);

  return [lastElementRef];
};

export default useInfiniteScroll;
