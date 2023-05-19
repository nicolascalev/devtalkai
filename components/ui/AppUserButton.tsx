import React from "react";
import { IconChevronRight, IconChevronLeft } from "@tabler/icons-react";
import {
  UnstyledButton,
  Group,
  Avatar,
  Text,
  Box,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import { useStoreState } from "../../store";

export function AppUserButton() {
  const theme = useMantineTheme();
  const user = useStoreState((state) => state.user);

  if (!user) {
    return null;
  }

  return (
    <Box
      sx={{
        paddingTop: theme.spacing.sm,
        borderTop: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
      }}
    >
      <Link passHref href="/profile">
        <UnstyledButton
          component="a"
          sx={{
            display: "block",
            width: "100%",
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color:
              theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

            "&:hover": {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
            },
          }}
        >
          <Group noWrap>
            <Avatar
              src={`https://api.dicebear.com/5.x/initials/svg?seed=${user.fullName}&backgroundColor=25262b`}
            >
              {user.fullName}
            </Avatar>
            <Box sx={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden" }}>
              <Text size="sm" weight={500}>
                {user.fullName}
              </Text>
              <Text color="dimmed" size="xs">
                {user.email}
              </Text>
            </Box>

            {theme.dir === "ltr" ? (
              <IconChevronRight size={18} />
            ) : (
              <IconChevronLeft size={18} />
            )}
          </Group>
        </UnstyledButton>
      </Link>
    </Box>
  );
}
