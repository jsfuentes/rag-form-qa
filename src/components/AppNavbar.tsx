import { useRouter } from "next/router";
import { useContext } from "react";
import Dropdown, { MenuContainer, MenuItem } from "src/components/Dropdown";
import Navbar from "src/components/Navbar";
import UserContext from "src/contexts/UserContext";
import Logo from "src/components/Logo";

const debug = require("debug")("app:AppNavbar");

interface AppNavbarProps {}

export default function AppNavbar(props: AppNavbarProps) {
  const router = useRouter();
  const { logout } = useContext(UserContext);

  return (
    <Navbar left={<Logo className="ml-4" />}>
      <Dropdown
        type="click"
        hoverPlace="bottom"
        outerCls="text-right"
        otherCls="text-right"
        className="top-7 right-0 shadow-xl"
        hoverSize="w-44"
        hoverElement={
          <MenuContainer>
            <MenuItem onClick={() => router.push("/profile")}>
              <div className="font-medium mx-2 my-1">Profile</div>
            </MenuItem>
            <MenuItem onClick={() => router.push("/profile")}>
              <div className="font-medium mx-2 my-1">Help and FAQ</div>
            </MenuItem>
            <MenuItem onClick={() => router.push("/profile")}>
              <div className="font-medium mx-2 my-1">Privacy Policy</div>
            </MenuItem>
            <MenuItem onClick={() => logout && logout(true)}>
              <div className="font-medium mx-2 my-1">Sign out</div>
            </MenuItem>
          </MenuContainer>
        }
      >
        <div className="rounded-md px-1 hover:bg-gray-100 flex items-center group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </div>
      </Dropdown>
    </Navbar>
  );
}
