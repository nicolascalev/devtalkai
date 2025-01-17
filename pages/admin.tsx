import {
  Box,
  Container,
  Group,
  Tabs,
  Title,
  Text,
  Alert,
  SimpleGrid,
  useMantineTheme,
  Pagination,
  Card,
} from "@mantine/core";
import React, { useState } from "react";
import AppAllowedEmailsModal from "../components/AppAllowedEmailsModal";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useStoreState } from "../store";
import { useRouter } from "next/router";
import useOrganizationCount from "../hooks/useOrganizationCount";
import AppUpdateOrganizationForm from "../components/AppUpdateOrganizationForm";
import AppUserCard, { AppUserCardSkeleton } from "../components/AppUserCard";
import useOrganizationMembers from "../hooks/useOrganizationMembers";
import AppTitle from "../components/ui/AppTitle";
import { IconInfoCircle } from "@tabler/icons-react";

export const getServerSideProps = withPageAuthRequired();

function AdminPage() {
  const user = useStoreState((state) => state.user);
  const { count, countRevalidate } = useOrganizationCount(user?.adminOf?.id);

  const {
    membersResponse,
    membersLoading,
    membersLoadingError,
    membersRevalidate,
  } = useOrganizationMembers(user?.adminOf?.id);
  const [page, setPage] = useState(1);

  const router = useRouter();
  if (!user) return null;
  if (!user.adminOf) {
    router.push("/403");
    return null;
  }

  return (
    <Container size="md" p={0}>
      <AppTitle order={1} my="xl">
        Admin Settings
      </AppTitle>
      <Tabs defaultValue="Members">
        <Tabs.List>
          <Tabs.Tab value="Members">Members</Tabs.Tab>
          <Tabs.Tab value="organization">Organization</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="organization" pt="xs">
          <Box maw="600px">
            <AppUpdateOrganizationForm organization={user.organization} />
          </Box>
        </Tabs.Panel>

        <Tabs.Panel value="Members" pt="xs">
          <Card mb="md" withBorder>
            <Group noWrap align="center" spacing={5}>
              <IconInfoCircle size={16} />
              <Text fw={500}>Allowed emails in list: {count?.inviteCount}</Text>
            </Group>
            <Text size="sm">
              Your subscription is based on the allowed-emails list
            </Text>
            <Group position="right">
              <AppAllowedEmailsModal
                count={count?.inviteCount}
                onRemoveMember={() => membersRevalidate()}
              />
            </Group>
          </Card>

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
            {membersLoading && <AppOrganizationMembersSkeleton />}
            {membersResponse?.result.map((user) => (
              <div key={user.id}>
                <AppUserCard user={user} />
              </div>
            ))}
          </SimpleGrid>

          <Group position="apart" align="center" mt="sm" mb="xl">
            <Text c="dimmed" size="sm">
              Total results: {membersResponse?.count}
            </Text>
            <Pagination
              value={page}
              onChange={setPage}
              total={membersResponse?.totalPages}
            />
          </Group>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}

export default AdminPage;

function AppOrganizationMembersSkeleton() {
  return (
    <>
      <div>
        <AppUserCardSkeleton />
      </div>
      <div>
        <AppUserCardSkeleton />
      </div>
      <div>
        <AppUserCardSkeleton />
      </div>
    </>
  );
}
