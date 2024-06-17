// my-app/app/post/[id]/Post.js
import { PrismaClient } from '@prisma/client';
import Image from 'next/image';
import styles from './Post.module.css';

const prisma = new PrismaClient();

export async function getStaticPaths() {
  // Define the paths based on available post IDs from your data source
  const posts = await prisma.recipe.findMany();
  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const postId = parseInt(params.id);
  const post = await prisma.recipe.findUnique({
    where: { id: postId },
  });

  return {
    props: {
      post,
    },
  };
}

export default function PostPage({ post }) {
  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className={styles.postContainer}>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      {post.imageUrl && (
        <Image
          src={`/uploads/${post.imageUrl}`}
          width={400}
          height={400}
          alt={post.title}
        />
      )}
    </div>
  );
}
