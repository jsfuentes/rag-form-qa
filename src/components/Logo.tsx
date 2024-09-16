import classNames from "classnames";
import conf from "conf";
import Image from "next/image";
import logo from "public/logo.png";
import logolong from "public/logo_long.png";

interface LogoProps {
  showName?: boolean;
  isWhite?: boolean;
  logo?: string;
  name?: string;
  className?: string;
  imgClassName?: string;
  unclickable?: boolean;
  urlOnClick?: string;
}

Logo.defaultProps = {
  showName: true,
  unclickable: false,
  urlOnClick: "/",
};

export default function Logo(props: LogoProps) {
  const className = classNames({
    "flex items-center": true,
    "text-white": props.isWhite,
    [props.className || ""]: props.className,
    "cursor-default": props.unclickable,
  });

  const logoSrc = props.logo ? props.logo : props.showName ? logolong : logo;

  return (
    <a className={className} href={props.unclickable ? "#" : props.urlOnClick}>
      <div
        className={props.showName ? "w-32 h-12 relative" : "w-12 h-12 relative"}
      >
        <Image
          className={classNames({
            [props.imgClassName || ""]: props.imgClassName,
          })}
          src={logoSrc}
          alt="Organizer Logo"
          referrerPolicy="no-referrer"
          fill
          style={{ objectFit: "contain" }}
        />
      </div>
    </a>
  );
}
