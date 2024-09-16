import conf from "conf";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player/youtube";
import { getModule } from "src/api/sanity";
import AppNavbar from "src/components/AppNavbar";
import Footer from "src/components/Footer";
import Loading from "src/components/Loading";
const debug = require("debug")("app:Module");

interface ModuleProps {}

export default function Module(props: ModuleProps) {
  const [module, setModule] = useState<Module | null>(null);
  const router = useRouter();

  const { id } = router.query;

  useEffect(() => {
    (async () => {
      console.log("GOT ID", id);
      const m = await getModule(id as string);
      setModule(m);
      console.log("Module", m);
    })();
  }, [id]);

  return (
    <div className="w-full">
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

      {module ? (
        <div className="flex flex-col justify-center items-center w-full my-8">
          <div className="text-4xl font-medium">{module?.title}</div>
          <div className="text-lg my-4">Video 1 of 2</div>
          {module?.video1 && <ReactPlayer url={module?.video1} />}
        </div>
      ) : (
        <Loading />
      )}
      <Footer />
    </div>
  );
}
