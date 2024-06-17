"use client"; // Директива для использования хуков

import Image from "next/image";
import { useRouter, usePathname } from 'next/navigation'; // Используем next/navigation
import "../globals.css";
import Link from 'next/link';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="relative flex w-full flex-row pb-[1%] px-[15vw]">
      <div className="flex flex-row gap-1 w-4/12 justify-start items-center pl-5">
        {/* Условие для скрытия кнопки "New post" на странице, куда она ведет */}
        {pathname !== '/recipes/new' && (
          <Link href="./recipes/new">
            <Image
              src="/image/newPost.svg"
              alt="New post"
              width={34}
              height={20}
            />
          </Link>
        )}
      </div>

      <div className="flex w-4/12 justify-center">
        <Image
          src="/image/Logo4.svg"
          alt="Logo"
          width={154}
          height={72}
        />
      </div>

      <div className="flex flex-row w-4/12 items-center justify-end">
        <a href="https://dzen.ru/edavudovolstvie">
          <Image
            src="/image/Yandex_Zen_logo_icon.svg"
            alt="Dzen"
            width={65}
            height={65}
          />
        </a>
        {/* <a href="https://www.instagram.com/instagram/">
          <Image
            src="/image/imageInst.svg"
            alt="Instagram"
            width={65}
            height={65}
          />
        </a>
        <a href="https://ok.ru">
          <Image
            src="/image/imageOK.svg"
            alt="OK"
            width={65}
            height={65}
          />
        </a>
        <a href="https://web.telegram.org/">
          <Image
            src="/image/imageTG.svg"
            alt="Telegram"
            width={60}
            height={60}
          />
        </a> */}
      </div>

      {/* Button to go back */}
      {pathname !== '/' && (
        <div className="absolute top-10 left-5">
          <button onClick={() => router.push('/')} className="flex items-center">
            <Image
              src="/image/backArrow.svg"
              alt="Back"
              width={30}
              height={30}
            />
            <span className="ml-2">Назад</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
