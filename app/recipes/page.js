import prisma from "../../lib/prisma";

export default async function Home() {
  const posts = await prisma.recipes.findMany();

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
              <Image src="/image/imageVK.svg" width={70} height={70} alt="VK" />
              <Image src="/image/imageTG.svg" width={70} height={70} alt="TG" />
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
