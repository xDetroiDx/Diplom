import Image from "next/image";
import prisma from "../lib/prisma";
import Link from 'next/link';

export default async function Home() {
  const posts = await prisma.recipe.findMany({
    orderBy: {
      id: 'desc', // Сортировка по полю id по убыванию
    },
  });

  return (
    <div>
      {posts.map((el, index) => (
        <Link key={el.id} href={`/post/${el.id}`}>
          <div className={`post ${index % 2 === 0 ? "posteven" : "postodd"} w-full`}>
            <div className="flex w-1/2 items-center justify-center">
              {el.imageUrl && (
                <Image
                  src={`/uploads/${el.imageUrl}`}
                  width={400}
                  height={400}
                  alt={el.title}
                />
              )}
            </div>
            <div className="flex flex-col w-1/2 justify-center">
              <h2>{el.title}</h2>
              <p>{el.body}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
