import Image from "next/image";
import "../globals.css";

const Header = () => {
  return (
    <div class="flex w-full flex-row pb-[1%] px-[15vw]">
      <div class="flex flex-row gap-1 w-4/12 justify-start pl-5">
        <Image
          src="/image/BurgerMenu.svg"
          alt="Vercel Logo"
          width={34}
          height={20}
        />
      </div>
      
      <div class="flex w-4/12 justify-center">
        <Image
          src="/image/Logo4.svg"
          alt="Vercel Logo"
          width={154}
          height={72}
        />
      </div>
      
      <div class="flex flex-row w-4/12 items-center justify-end">
      <a href="https://vk.com">
        <Image
          src="/image/imageVK.svg"
          alt="Vercel Logo"
          width={75}
          height={75}
        /></a>
      <a href="https://www.instagram.com/instagram/">
        <Image
          src="/image/imageInst.svg"
          alt="Vercel Logo"
          width={65}
          height={65}
        /></a>
      <a href="https://ok.ru">
        <Image
          src="/image/imageOK.svg"
          alt="Vercel Logo"
          width={65}
          height={65}
        /></a>
      <a href="https://web.telegram.org/">
        <Image
          src="/image/imageTG.svg"
          alt="Vercel Logo"
          width={60}
          height={60}
        /></a>
      </div>
    </div>
  );
};

export default Header;
