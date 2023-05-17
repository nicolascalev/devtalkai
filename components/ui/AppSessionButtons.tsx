import { Button } from "@mantine/core";
import { useRouter } from "next/router";
// import { useStoreActions, useStoreState } from "../store";

export const LOGOUT_URL = `${process.env.NEXT_PUBLIC_AUTH0_URL}/v2/logout?client_id=${process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}&returnTo=${process.env.NEXT_PUBLIC_BASE_URL}`;
export const LOGIN_URL = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/connect/auth0`;

export function AppLogoutButton(props: any) {
  const router = useRouter();
  // const setUser = useStoreActions((actions) => actions.setUser);

  // if (!isLogged) return null;

  function logout() {
    localStorage.removeItem("user");
    // setUser(null);
    router.push(LOGOUT_URL);
  }

  return (
    <Button onClick={logout} color="red" {...props}>
      Logout
    </Button>
  );
}

export function AppLoginButton(props: any) {
  // const isLogged = useStoreState((state) => state.isLogged);

  // if (isLogged) return null;

  return (
    <Button component="a" href={LOGIN_URL} {...props}>
      Login
    </Button>
  );
}
