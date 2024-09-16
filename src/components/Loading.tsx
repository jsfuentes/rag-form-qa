import classNames from "classnames";
import conf from "conf";
import Image from "next/image";
import Logo from "public/logo.png";
import { useEffect, useState } from "react";

interface LoadingProps {
  full?: boolean;
  hasNoColor?: boolean;
  animateClass?: "heartBeat" | "animate-pulse";
}

Loading.defaultProps = {
  full: false,
  hasNoColor: false,
  animateClass: "heartBeat",
};

export default function Loading(props: LoadingProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => setShow(true), 400);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div
      className={classNames({
        "flex justify-center items-center bg-transparent": true,
        "w-full h-full": props.full,
        "w-screen h-screen": !props.full,
      })}
    >
      {show && (
        <Image
          className={`${props.animateClass}`}
          src={Logo}
          height={40}
          width={40}
          alt={`${conf.get("PROJECT_NAME")} Logo`}
          referrerPolicy="no-referrer"
        />
      )}
    </div>
  );
}
