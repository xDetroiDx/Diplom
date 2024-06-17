// pages/post/[id].js
import { PrismaClient } from '@prisma/client';
import Image from 'next/image';
import Header from '../../app/components/Header'; // Импортируем компонент Header
import '../../app/globals.css'; // Импортируем глобальные стили

const prisma = new PrismaClient();

export async function getServerSideProps({ params }) {
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
    <>
      <Header />
      <div className="bg-[#22010141] w-full h-[3px]"></div>
      <div className="posteven flex w-full h-full">
        {post.imageUrl && (
          <div className="flex w-1/2 justify-center items-center">
            <Image
              src={`/uploads/${post.imageUrl}`}
              width={400}
              height={400}
              alt={post.title}
            />
          </div>
        )}
        <div className="flex w-1/2 flex-col justify-center">
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </div>
      </div>
    </>
  );
}
