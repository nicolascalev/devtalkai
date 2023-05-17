import {
  Box,
  Button,
  Container,
  Group,
  MultiSelect,
  Tabs,
  TextInput,
  Textarea,
  Title,
  Text,
  Alert,
  SimpleGrid,
  Card,
  ActionIcon,
  useMantineTheme,
} from "@mantine/core";
import React, { useState } from "react";
import AppDomainLiteracySelect from "../components/AppDomainLiteracySelect";
import { IconDots } from "@tabler/icons-react";
import AppAllowedEmailsModal from "../components/AppAllowedEmailsModal";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useStoreState } from "../store";
import { useRouter } from "next/router";
import useOrganizationCount from "../hooks/useOrganizationCount";
import AppUpdateOrganizationForm from "../components/AppUpdateOrganizationForm";

export const getServerSideProps = withPageAuthRequired();

function AdminPage() {
  const user = useStoreState((state) => state.user);
  const theme = useMantineTheme();
  const isDark = theme.colorScheme === "dark";
  const [data, setData] = useState<{ value: string; label: string }[]>([]);

  const { count, countRevalidate } = useOrganizationCount(user?.adminOf?.id);

  const router = useRouter();
  if (!user) return null;
  if (!user.adminOf) {
    router.push("/401");
    return null;
  }

  return (
    <Container size="md" p={0}>
      <Title order={1} my="xl">
        Admin Settings
      </Title>
      <Tabs variant="outline" defaultValue="organization">
        <Tabs.List>
          <Tabs.Tab value="organization">Organization</Tabs.Tab>
          <Tabs.Tab value="Members">Members</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="organization" pt="xs">
          <Box maw="600px">
            <AppUpdateOrganizationForm organization={user.organization} />
          </Box>
        </Tabs.Panel>

        <Tabs.Panel value="Members" pt="xs">
          <Alert mb="md" color={isDark ? "gray" : "dark"} variant="outline">
            <Text fw={500}>Allowed emails: {count?.inviteCount}</Text>
            <Group position="apart" spacing="xs">
              <Text>Your subscription is based on the allowed-emails list</Text>
              <Group position="right" style={{ flexGrow: 1 }}>
                <AppAllowedEmailsModal count={count?.inviteCount} />
              </Group>
            </Group>
          </Alert>

          <Text fw={500}>Members {count?.memberCount}</Text>
          <Text size="sm" c="dimmed" mb="md">
            Members who already joined your organization
          </Text>

          <SimpleGrid
            cols={1}
            breakpoints={[
              { minWidth: "xs", cols: 2 },
              { minWidth: "sm", cols: 3 },
            ]}
          >
            <div>
              <Card withBorder style={{ overflow: "visible" }}>
                <Text fw={500}>Jafeth Guillen</Text>
                <Text c="dimmed" size="sm">
                  jafeth@slack.com
                </Text>
                <Group align="center" position="apart" mt="xs">
                  <Text c="dimmed" size="sm">
                    Role
                  </Text>
                  <Text size="sm">Developer</Text>
                </Group>
              </Card>
            </div>
            <div>
              <Card withBorder style={{ overflow: "visible" }}>
                <Text fw={500}>Nicolas Guillen</Text>
                <Text c="dimmed" size="sm">
                  nicolas@slack.com
                </Text>
                <Group align="center" position="apart" mt="xs">
                  <Text c="dimmed" size="sm">
                    Role
                  </Text>
                  <Text size="sm">-</Text>
                </Group>
              </Card>
            </div>
          </SimpleGrid>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}

export default AdminPage;
