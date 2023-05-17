import {
  Group,
  ThemeIcon,
  UnstyledButton,
  useMantineTheme,
  Text,
} from "@mantine/core";
import {
  IconBookmark,
  IconBuilding,
  IconCodeCircle,
  IconPennant,
  IconReceipt,
  IconSettings,
  IconWriting,
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
    url: "/writing",
    icon: <IconWriting size={16} />,
    label: "Writing",
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
    <Link passHref href={url}>
      <UnstyledButton
        component="a"
        target={target}
        sx={(theme) => ({
          display: "block",
          width: "100%",
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color: isDark ? theme.colors.dark[0] : theme.black,

          "&:hover": {
            backgroundColor: isDark
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
          },
        })}
      >
        <Group>
          <ThemeIcon color="gray" variant="light">
            {icon}
          </ThemeIcon>

          <Text size="sm">{label}</Text>
        </Group>
      </UnstyledButton>
    </Link>
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
