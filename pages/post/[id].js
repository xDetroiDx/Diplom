import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import Header from "../../app/components/Header";
import "../../app/globals.css";
import { useRouter } from 'next/router';

const prisma = new PrismaClient();

export async function getServerSideProps({ params }) {
  const postId = parseInt(params.id);
  const post = await prisma.recipe.findUnique({
    where: { id: postId },
    include: {
      ingredients: true,
      steps: true,
    },
  });

  return {
    props: {
      post,
    },
  };
}

export default function PostPage({ post }) {
  const router = useRouter();

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <>
      <Header showBackButton={true} />
      <div className=" bg-[#22010141] w-full h-[3px]"></div>

      <div className="flex flex-col pt-5 h-auto items-center justify-center headtitle">
        <h2 className="text-3xl font-bold cyrillic">{post.title}</h2>
        <div className="flex flex-row items-center justify-center">
          <div className="w-1/2 pt-5">
            {post.imageUrl && (
              <div className="flex items-center justify-center pl-[20%]">
                <Image
                  src={`/uploads/${post.imageUrl}`}
                  width={400}
                  height={400}
                  alt={post.title}
                  className="rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col items-center justify-center w-1/2 pr-[20%]">
            <p className="text-lg">{post.body}</p><br/>

            
          </div>
        </div>
        <div className="spisok w-full pt-10 flex justify-center">
              <ul className="flex flex-col list-disc list-inside items-start">
                <div><h3>Что вам понадобится:</h3></div>
                {post.ingredients.map((ingredient) => (
                  <li key={ingredient.id} className="text-lg" style={{ textAlign: 'right', listStylePosition: 'inside' }}>
                    {ingredient.name}: {ingredient.quantity}
                  </li>
                ))}
              </ul>
            </div>
      </div>

      <div className="mt-8">
        <div className="grid gap-8">
          {post.steps.map((step, index) => (
            <div
              key={step.id}
              className={`${index % 2 === 0 ? "postodd" : "posteven"}`}
            >
              <div className="w-1/2 flex flex-col items-center justify-center">
                <h4 className="text-3xl text-center">Шаг {index + 1}</h4>
                <br />
                <Image
                  src={`/uploads/${step.imageUrl}`}
                  width={400}
                  height={400}
                  alt={`Step ${index + 1}`}
                  className="rounded-lg"
                />
              </div>
              <div className="flex items-center w-1/2 ">
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
