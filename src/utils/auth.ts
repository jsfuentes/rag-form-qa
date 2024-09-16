import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import UserContext from "src/contexts/UserContext";
import { useAppDispatch } from "src/redux/hooks";
import { logErrorMessage } from "src/redux/notification";
const debug = require("debug")("app:Dashboard");

export function useRequireLoggedIn() {
  const { user, userLoading } = useContext(UserContext);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!userLoading && (!user || user.type === "anon")) {
      dispatch(logErrorMessage("You need to be logged in to view this page"));
      router.push("/login");
    }
  }, [dispatch, router, user, userLoading]);
}
