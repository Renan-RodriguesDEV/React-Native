import React, { useEffect, useState } from "react";

type Post = {
  id: string;
  title: string;
  content: string;
  author: string;
  community: string;
  createdAt: string;
};

const CheckMyPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = () => {
      try {
        const savedPosts = localStorage.getItem("posts");
        if (savedPosts) {
          const parsedPosts = JSON.parse(savedPosts);
          setPosts(parsedPosts);
        }
      } catch (error) {
        console.error("Erro ao carregar posts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <p>Carregando seus posts...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {posts.length === 0 ? (
        <div style={styles.emptyContainer}>
          <p style={styles.emptyText}>Você ainda não tem posts salvos</p>
        </div>
      ) : (
        <div>
          {posts.map((item) => (
            <div key={item.id} style={styles.postItem}>
              <p style={styles.community}>r/{item.community}</p>
              <h3 style={styles.postTitle}>{item.title}</h3>
              <p style={styles.postContent}>{item.content}</p>
              <p style={styles.postDate}>
                Postado por u/{item.author} em{" "}
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: "16px",
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: "18px",
    color: "#666",
  },
  postItem: {
    backgroundColor: "#fff",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "12px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  community: {
    color: "#0079d3",
    fontWeight: "bold",
    fontSize: "12px",
    marginBottom: "4px",
  },
  postTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  postContent: {
    fontSize: "14px",
    color: "#333",
    marginBottom: "8px",
    lineHeight: "20px",
  },
  postDate: {
    fontSize: "12px",
    color: "#666",
  },
};

export default CheckMyPosts;
