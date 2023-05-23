import {
  Card,
  Container,
  SimpleGrid,
  Title,
  Text,
  Divider,
  Group,
  Popover,
  Box,
  ActionIcon,
  Menu,
  Alert,
  useMantineTheme,
  Button,
  Center,
  ThemeIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDots,
  IconEdit,
  IconInbox,
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
import { useProfile } from "../hooks/useProfile";
import AppAddOrganizationModal from "../components/AppAddOrganizationModal";
import AppTitle from "../components/ui/AppTitle";

export const getServerSideProps = withPageAuthRequired();

function ProfilePage() {
  const user = useStoreState((state) => state.user);
  const [opened, { open, close }] = useDisclosure(false);
  const { invites, invitesLoading, invitesLoadingError, invitesRevalidate } =
    useUserInvites();
  const { userRevalidate } = useProfile();

  function onAcceptInvite() {
    invitesRevalidate();
    userRevalidate();
  }

  if (!user) return null;

  return (
    <Container size="md" p={0}>
      <AppTitle order={1} my="xl">
        Profile
      </AppTitle>
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

              <Menu shadow="md" width={200} position="bottom-end">
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
          {user.adminOf && (
            <Card mb="md" withBorder>
              <Group noWrap align="center" mb="sm" spacing={5}>
                <IconInfoCircle size={16} />
                <Text fw={500}>
                  You are an organization&apos;s administrator
                </Text>
              </Group>
              <Text size="sm">
                You can not accept invites to join other organizations or leave
                your current one. If this is an issue please contact support
              </Text>
              <Group position="right" mt="xs">
                <Button
                  variant="default"
                  component="a"
                  href="mailto:nicolascalevg@gmail.com?subject=[ADMIN ORG CHANGE] I am an admin and want to leave my organization"
                >
                  Contact support
                </Button>
              </Group>
            </Card>
          )}
          {invitesLoading && <AppInviteCardSkeleton />}
          {invites?.map((invite) => (
            <Box key={invite.id}>
              <AppInviteCard
                invite={invite}
                disabled={user.adminOf !== null}
                user={user}
                onOrganizationChange={() => onAcceptInvite()}
                mb="sm"
              />
            </Box>
          ))}
          {!user.organization && (
            <Card withBorder>
              <Center mih="150px">
                <Box maw="90%">
                  <Group position="center" mb="sm">
                    <ThemeIcon size="xl" color="gray" variant="light">
                      <IconInbox />
                    </ThemeIcon>
                  </Group>
                  <Text ta="center" fw={500}>
                    Organization not set
                  </Text>
                  <Text ta="center" size="sm" c="dimmed">
                    When you get invites they will be shown here. You can also
                    add your own organization.
                  </Text>
                  <Group position="center" mt="sm">
                    <AppAddOrganizationModal />
                  </Group>
                </Box>
              </Center>
            </Card>
          )}
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
