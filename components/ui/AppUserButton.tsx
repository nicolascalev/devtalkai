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
        borderTop: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
      }}
      mx="-xs"
      px="xs"
      pt="xs"
    >
      <UnstyledButton
        component={Link}
        href="/profile"
        sx={{
          display: "block",
          width: "100%",
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
        p="xs"
      >
        <Group noWrap>
          <Avatar
            src={`https://api.dicebear.com/5.x/initials/svg?seed=${user.fullName}&backgroundColor=25262b`}
          >
            {user.fullName}
          </Avatar>
          <Box sx={{ flex: 1, whiteSpace: "nowrap" }}>
            <Text size="sm" weight={500} lineClamp={1}>
              {user.fullName}
            </Text>
            <Text color="dimmed" size="xs" lineClamp={1}>
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
    </Box>
  );
}
