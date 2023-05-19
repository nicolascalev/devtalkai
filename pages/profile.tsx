import {
  Card,
  Container,
  SimpleGrid,
  Title,
  Text,
  Divider,
  Group,
  Button,
  Popover,
  Box,
  ActionIcon,
  Badge,
  Menu,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDots,
  IconEdit,
  IconInfoCircle,
  IconLogout,
} from "@tabler/icons-react";
import React, { ReactNode } from "react";
import { useStoreState } from "../store";
import AppUpdateProfile from "../components/AppUpdateProfile";
import type { BoxProps } from "@mantine/core";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import useUserInvites from "../hooks/useUserInvites";
import AppInviteCard, {
  AppInviteCardSkeleton,
} from "../components/AppInviteCard";

export const getServerSideProps = withPageAuthRequired();

function ProfilePage() {
  const user = useStoreState((state) => state.user);
  const [opened, { open, close }] = useDisclosure(false);
  const { invites, invitesLoading, invitesLoadingError, invitesRevalidate } =
    useUserInvites();

  if (!user) return null;

  return (
    <Container size="md" p={0}>
      <Title order={1} my="xl">
        Profile
      </Title>
      <SimpleGrid
        cols={1}
        breakpoints={[{ minWidth: "sm", cols: 2, spacing: "xl" }]}
      >
        <div>
          <Card withBorder>
            <Group position="apart" noWrap align="top">
              <div>
                <Text size="xl" fw={500}>
                  {user.fullName}
                </Text>
                <Text c="dimmed">{user.email}</Text>
              </div>

              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon>
                    <IconDots size={16} />
                  </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    icon={<IconEdit size={14} />}
                    onClick={() => open()}
                  >
                    Edit profile
                  </Menu.Item>
                  <Menu.Item
                    icon={<IconLogout size={14} />}
                    color="red"
                    component="a"
                    href="/api/auth/logout"
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>

              <AppUpdateProfile opened={opened} close={close} user={user} />
            </Group>
            <Card.Section>
              <Divider my="md" />
            </Card.Section>
            <AppProfileAttribute
              mb="xs"
              label="Technical Proficiency"
              description="This helps us know how technical the answers can be"
            >
              {user.technicalProficiency || "-"}
            </AppProfileAttribute>
            <AppProfileAttribute
              mb="xs"
              label="Role"
              description="This is helps us give you bettwe answers"
            >
              {user.role || "-"}
            </AppProfileAttribute>
          </Card>
        </div>
        <div>
          <Group my="md" position="apart" align="center">
            <div>
              <Text size="xl" fw={500}>
                Invites
              </Text>
              <Text c="dimmed">Invites to join an organization</Text>
            </div>
            <Text c="dimmed" size="md" ml={5}>
              {invites?.length}
            </Text>
          </Group>
          {invitesLoading && <AppInviteCardSkeleton />}
          {invites?.map((invite) => (
            <Box key={invite.id}>
              <AppInviteCard invite={invite} />
            </Box>
          ))}
        </div>
      </SimpleGrid>
    </Container>
  );
}

export default ProfilePage;

function AppProfileAttribute({
  label,
  description,
  children,
  ...rest
}: {
  label: string;
  description: string;
  children: ReactNode;
} & BoxProps) {
  return (
    <Box {...rest}>
      <Group spacing={5} noWrap align="center" c="dimmed">
        <Text size="sm">{label}</Text>
        <Popover width={250} position="bottom" withArrow shadow="md">
          <Popover.Target>
            <IconInfoCircle size={14} />
          </Popover.Target>
          <Popover.Dropdown>
            <Text size="sm">{description}</Text>
          </Popover.Dropdown>
        </Popover>
      </Group>
      {children}
    </Box>
  );
}
