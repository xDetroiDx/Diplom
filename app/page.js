import Image from "next/image";
import prisma from "../lib/prisma";

export default async function Home() {
  const posts = await prisma.recipe.findMany({
    orderBy: {
      id: 'desc', // Сортировка по полю id по убыванию
    },
  });

  return (
    <div>
      <div className=" bg-[#22010141] w-full h-[3px]"></div>
      <div className=" w-full h-[5px]"></div>
      <div>
        {posts.map((el, index) => (
          <div
            key={el.id}
            className={`post ${index % 2 === 0 ? "posteven" : "postodd"} w-full`}
          >
            <div className="flex w-1/2 items-center justify-center">
              {/* Здесь формируем путь к изображению */}
              {el.imageUrl && (
                <Image
                  src={`/uploads/${el.imageUrl}`}  // Путь к изображению
                  width={400}
                  height={400}
                  alt={el.title}  // Замените на подходящий текст
                />
              )}
            </div>
            <div className="flex flex-col w-1/2 justify-center">
              <h2>{el.title}</h2>
              <p>{el.body}</p>
            </div>
            {/* <Link href={`/post/` + el.id}>Детальнее</Link> */}
          </div>
        ))}
      </div>
    </div>
  );
}
