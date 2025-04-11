import { useEffect, useRef, useState } from "react";
import { Card } from "../ui/card";
import { faker } from "@faker-js/faker";
import { motion } from "framer-motion";

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  date: Date;
  imageUrl: string;
}

const Scroll = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [visiblePosts, setVisiblePosts] = useState<Set<string>>(new Set());

  //   generate posts
  const generateFakeData = (count: number) => {
    return Array.from({ length: count }, () => ({
      id: faker.string.uuid(),
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(2),
      author: faker.person.fullName(),
      date: faker.date.recent(),
      imageUrl: faker.image.url(),
    }));
  };

  const loadMorePosts = async () => {
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1000));

      const newPosts = generateFakeData(10);
      setPosts((prev) => [...prev, ...newPosts]);

      if (posts.length >= 100) {
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadMorePosts();
        }
      },
      {
        rootMargin: "800px",
        threshold: 0.1,
      }
    );
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loading, hasMore]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisiblePosts((prev) => new Set([...prev, entry.target.id]));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.2,
    });

    const postElements = document.querySelectorAll(".post-card");
    postElements.forEach((e) => observer.observe(e));

    return () => observer.disconnect();
  }, [posts]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Infinite Scroll Demo</h1>

      <div className="space-y-4">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            id={post.id}
            className="post-card"
            initial={{ opacity: 0, y: 50 }}
            animate={visiblePosts.has(post.id) ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <Card key={post.id} className="p-4">
              <motion.div
                className="relative w-full h-48 mb-4"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover rounded-lg"
                  style={{
                    transform: visiblePosts.has(post.id)
                      ? "translateY(-5%)"
                      : "translateY(0)",
                    transition: "transform 0.3s ease-out",
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={visiblePosts.has(post.id) ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-muted-foreground mb-4">{post.content}</p>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{post.author}</span>
                  <span>{post.date.toLocaleDateString()}</span>
                </div>
              </motion.div>
            </Card>
          </motion.div>
        ))}

        {/* Observer target */}
        <div
          ref={observerTarget}
          className="h-10 flex items-center justify-center"
        >
          {loading && <div>Loading more posts...</div>}
          {!hasMore && <div>No more posts to load</div>}
        </div>
      </div>
    </div>
  );
};

export default Scroll;
