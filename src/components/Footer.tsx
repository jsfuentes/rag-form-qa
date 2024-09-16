import conf from "conf";
import Image from "next/image";
import HeartImg from "public/heart.png";
import Logo from "src/components/Logo";

export default function Footer() {
  return (
    <footer className="bg-gray-200 w-full h-auto py-12">
      <div className="container mx-auto">
        <div className="flex justify-center sm:justify-start">
          <Logo />
        </div>
        <div className="flex justify-center sm:justify-start items-center mt-4 mb-4 text-gray-700">
          <span>Made with</span>{" "}
          <div className="inline w-4 h-4 mx-1 relative">
            <Image src={HeartImg} alt="Heart" fill />
          </div>
          <span>in San Francisco, USA</span>
        </div>
        <p className="text-sm text-gray-500 text-center sm:text-left">
          © 2024 {conf.get("PROJECT_NAME")} Inc.
        </p>
      </div>
    </footer>
  );
}
