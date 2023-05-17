import {
  Group,
  Modal,
  Image,
  Text,
  useMantineTheme,
  Loader,
  Alert,
  Button,
  Center,
} from "@mantine/core";
import React, { ReactElement, useEffect } from "react";
import { useStoreActions } from "../../store";
import { useProfile } from "../../hooks/useProfile";

function AppUserLoading({ children }: { children: ReactElement<any, any> }) {
  const theme = useMantineTheme();
  const isDark = theme.colorScheme === "dark";

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

  if (userLoading || userLoadingError || !user) {
    return (
      <Modal
        opened={true}
        onClose={() => {}}
        withCloseButton={false}
        title={
          <Group align="center" spacing="xs">
            <Image
              radius={0}
              src="/favicon.svg"
              height="25px"
              width="25px"
              alt="devtalk ai logo"
            />
            <Text fw={600} size="lg" c={isDark ? "white" : "dark"}>
              devtalk ai
            </Text>
          </Group>
        }
        fullScreen
      >
        <Center h="calc(100vh - 60px)">
          {userLoading && !userLoadingError ? (
            <Alert
              variant="outline"
              title="We are happy you are back"
              maw="700px"
              w="100%"
            >
              <Group noWrap align="center">
                <Loader size="sm" />
                Loading profile...
              </Group>
            </Alert>
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
