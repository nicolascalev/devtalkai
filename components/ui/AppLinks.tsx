import {
  Group, Text, ThemeIcon,
  UnstyledButton,
  useMantineTheme
} from "@mantine/core";
import {
  IconBookmark,
  IconBuilding,
  IconCodeCircle,
  IconMessage, IconReceipt,
  IconSettings
} from "@tabler/icons-react";
import Link from "next/link";
import { useStoreState } from "../../store";

interface MainLinkProps {
  icon: any;
  label: string;
  url: string;
  target?: string;
}

export const loggedInLinks: MainLinkProps[] = [
  {
    url: "/",
    icon: <IconCodeCircle size={16} />,
    label: "Outputs",
  },
  {
    url: "/chat",
    icon: <IconMessage size={16} />,
    label: "Chat",
  },
  {
    url: "/organization",
    icon: <IconBuilding size={16} />,
    label: "Organization",
  },
  {
    url: "/bookmarks",
    icon: <IconBookmark size={16} />,
    label: "Bookmarks",
  },
];

export const adminLinks: MainLinkProps[] = [
  {
    url: "/admin",
    icon: <IconSettings size={16} />,
    label: "Admin",
  },
  {
    url: "/subscription",
    icon: <IconReceipt size={16} />,
    label: "Subscription",
  },
];

function MainLink({ icon, label, url, target }: MainLinkProps) {
  const theme = useMantineTheme();
  const isDark = theme.colorScheme == "dark";
  return (
    <UnstyledButton
      component={Link}
      href={url}
      target={target}
      sx={(theme) => ({
        display: "block",
        width: "calc(100% - var(--mantine-spacing-xs))",
        padding: "var(--mantine-spacing-xs)",
        borderRadius: theme.radius.sm,
        color: isDark ? theme.colors.dark[0] : theme.black,

        "&:hover": {
          backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
        },
      })}
    >
      <Group>
        <ThemeIcon color="gray" variant="light">
          {icon}
        </ThemeIcon>

        <Text size="sm" lineClamp={1}>
          {label}
        </Text>
      </Group>
    </UnstyledButton>
  );
}

export function AppLinks() {
  const user = useStoreState((state) => state.user);
  const loggedInLinkComponents = loggedInLinks.map((link) => (
    <MainLink {...link} key={link.label} />
  ));

  const adminLinksComponents = adminLinks.map((link) => (
    <MainLink {...link} key={link.label} />
  ));

  return (
    <div>
      {loggedInLinkComponents}
      {user?.adminOf ? (
        <>
          <Text p="xs" c="dimmed" size="xs">
            Admin
          </Text>
          {adminLinksComponents}
        </>
      ) : null}
    </div>
  );
}
