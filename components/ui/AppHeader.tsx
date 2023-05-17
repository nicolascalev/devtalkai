import {
  Anchor,
  Burger,
  Group,
  Header,
  MediaQuery,
  Image,
  Text,
  ActionIcon,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import React from "react";
import { AppLoginButton } from "./AppSessionButtons";
import { IconMoonStars, IconSun } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";

function AppHeader({ opened, setOpened, colorScheme, toggleColorScheme }: any) {
  const theme = useMantineTheme();
  const isDark = colorScheme === "dark";
  const matchesBiggerThanMedium = useMediaQuery(
    `(min-width: ${theme.breakpoints.md}px)`
  );
  const matchesBiggerThanLarge = useMediaQuery(
    `(min-width: ${theme.breakpoints.lg}px)`
  );


  return (
    <Header height={60} style={{ display: "flex", justifyContent: "center" }}>
      <Group
        sx={{ height: "100%" }}
        position="apart"
        w="100%"
        maw={ `calc(100% - ${matchesBiggerThanMedium ? "32px" : "16px"})`
        }
        p={matchesBiggerThanLarge ? 0 : "sm"}
      >
        <Group>
          <MediaQuery largerThan="md" styles={{ display: "none" }}>
            <Burger
              opened={opened}
              onClick={() => setOpened((o: boolean) => !o)}
              size="sm"
            />
          </MediaQuery>
          <Link href="/" passHref>
            <Anchor underline={false} c="inherit">
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
            </Anchor>
          </Link>
        </Group>

        <Group>
          {matchesBiggerThanMedium && <AppLoginButton />}
          <ActionIcon
            variant="default"
            onClick={() => toggleColorScheme()}
            size={30}
          >
            {colorScheme === "dark" ? (
              <IconSun size={16} />
            ) : (
              <IconMoonStars size={16} />
            )}
          </ActionIcon>
        </Group>
      </Group>
    </Header>
  );
}

export default AppHeader;
