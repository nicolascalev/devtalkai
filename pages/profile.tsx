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
import { useDisclosure, useHover } from "@mantine/hooks";
import {
  IconDots,
  IconEdit,
  IconExternalLink,
  IconInfoCircle,
  IconLogout,
} from "@tabler/icons-react";
import React, { ReactNode } from "react";
import { useStoreState } from "../store";
import AppUpdateProfile from "../components/AppUpdateProfile";

function ProfilePage() {
  const user = useStoreState((state) => state.user);
  const [opened, { open, close }] = useDisclosure(false);

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
                  <Menu.Item icon={<IconLogout size={14} />} color="red">
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>

              <AppUpdateProfile opened={opened} close={close} user={user} />
            </Group>
            <Card.Section>
              <Divider my="md" />
            </Card.Section>
            <AppOrganizationFeature
              mb="xs"
              label="Technical Proficiency"
              description="This helps us know how technical the answers can be"
            >
              {user.technicalProficiency || "-"}
            </AppOrganizationFeature>
            <AppOrganizationFeature
              mb="xs"
              label="Role"
              description="This is helps us give you bettwe answers"
            >
              {user.role || "-"}
            </AppOrganizationFeature>
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
              10
            </Text>
          </Group>
          <Card withBorder>
            <Group noWrap align="center" position="apart">
              <Text>Organization name</Text>
              <Badge variant="dot">Accepted</Badge>
            </Group>
            <Text c="dimmed">Feb 13</Text>
            <Group align="center" position="right" spacing="xs">
              <Button variant="default">Reject</Button>
              <Button>Accept</Button>
            </Group>
          </Card>
        </div>
      </SimpleGrid>
    </Container>
  );
}

export default ProfilePage;

function AppOrganizationFeature({
  label,
  description,
  children,
  ...rest
}: {
  label: string;
  description: string;
  children: ReactNode;
} & any) {
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
