import conf from "conf";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { getModules } from "src/api/sanity";
import AppNavbar from "src/components/AppNavbar";
import Footer from "src/components/Footer";
import UserContext from "src/contexts/UserContext";
import { useAppDispatch } from "src/redux/hooks";
import { useRequireLoggedIn } from "src/utils/auth";
const debug = require("debug")("app:Dashboard");

export default function Dashboard() {
  const { user } = useContext(UserContext);
  const [modules, setModules] = useState<Array<Module>>([]);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const assets = await getModules();
      console.log("Modules", assets);
      setModules(assets);
    })();
  }, []);

  useRequireLoggedIn();

  if (!user) return null;

  return (
    <>
      <Head>
        <title>{conf.get("PROJECT_NAME")}</title>
        <meta
          name="description"
          content="Learn & earn to solidify your financial future"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppNavbar />

      <div className="w-full p-8 container mx-auto">
        <div className="px-4 pb-4 flex flex-col justify-center items-center">
          <div className="text-4xl flex flex-row font-bold mb-4">
            <div className="bx bx-rocket animate-wiggle text-black mx-1" />{" "}
            Student Dashboard
          </div>
          {modules.map((module) => (
            <div
              className="flex flex-row border border-solid border-gray-500 w-full cursor-pointer xl:w-1/2 m-2 p-2 hover:border-primary-600"
              key={module._id}
              onClick={() => router.push(`/module/${module._id}`)}
            >
              {module.preview_image && (
                <Image
                  height={144 / 1.5}
                  width={256 / 1.5}
                  src={module.preview_image.asset.url}
                  alt={module.title}
                />
              )}
              <div className="flex flex-col ml-2 h-full justify-center">
                <div className="text-xl font-medium">{module.title}</div>
                <div>{module.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
