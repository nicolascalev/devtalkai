import {
  Alert,
  Avatar,
  Button,
  Center,
  Group,
  Loader,
  Modal,
  Text,
} from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import { useStoreActions } from "../../store";

const PUBLIC_PAGES = [
  "/subscription/success",
  "/subscription/cancel",
  "/404",
  "/403",
];

function AppUserLoading({ children }: { children: ReactElement<any, any> }) {
  const router = useRouter();

  const setUser = useStoreActions((actions) => actions.setUser);
  const { user, userLoading, userLoadingError } = useProfile();

  useEffect(() => {
    setUser(user);
  }, [setUser, user]);

  useEffect(() => {
    if (userLoadingError) {
      if (userLoadingError.response) {
        console.error(userLoadingError.response);
      } else {
        console.error(userLoadingError);
      }
    }
  }, [userLoadingError]);

  const [isPublicPage, setIsPublicPage] = useState(false);
  useEffect(() => {
    if (PUBLIC_PAGES.includes(router.pathname)) {
      setIsPublicPage(true);
    }
    console.log(router.pathname);
  }, [router.pathname]);

  if (!isPublicPage && (userLoading || userLoadingError || !user)) {
    return (
      <Modal
        opened={true}
        onClose={() => {}}
        withCloseButton={false}
        title={
          <Avatar color="lime" component={Link} href="/" radius="xl">
            DT
          </Avatar>
        }
        fullScreen
      >
        <Center h="calc(100dvh - 60px)">
          {userLoading && !userLoadingError ? (
            <Group noWrap align="center">
              <Loader size="sm" color="gray" />
              Loading profile...
            </Group>
          ) : (
            <Alert
              variant="outline"
              color="red"
              title="There was an error getting your profile"
              maw="700px"
            >
              <Text>
                We are sorry for the inconvenience, please try to login again or
                contact support and we will assist you as soon as possible
              </Text>
              <Group mt="sm">
                <Button variant="default" component="a" href="/api/auth/login">
                  Login
                </Button>
                <Button
                  variant="default"
                  component="a"
                  href="mailto:nicolascalevg@gmail.com?subject=[URGENT LOGIN] I can not login to my account"
                >
                  Contact support
                </Button>
              </Group>
            </Alert>
          )}
        </Center>
      </Modal>
    );
  }
  return children;
}

export default AppUserLoading;
