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
  Skeleton,
  Center,
  ThemeIcon,
  Alert,
} from "@mantine/core";
import {
  IconExternalLink,
  IconInfoCircle,
  IconPackage,
} from "@tabler/icons-react";
import React, { ReactNode } from "react";
import { useStoreState } from "../store";
import AppAddOrganizationModal from "../components/AppAddOrganizationModal";

import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import useOrganizationProjects from "../hooks/useOrganizationProjects";
import AppProjectCard from "../components/AppProjectCard";
import AppAddProjectModal from "../components/AppAddProjectModal";
import useOrganizationSubscription from "../hooks/useOrganizationSubscription";
import Link from "next/link";
export const getServerSideProps = withPageAuthRequired();

function OrganizationPage() {
  const user = useStoreState((state) => state.user);
  const { subscription, subscriptionLoading } = useOrganizationSubscription(
    user?.organizationId
  );

  const { projects, projectsLoading, projectsError, projectsRevalidate } =
    useOrganizationProjects(user?.organization?.id);

  if (!user) return null;

  return (
    <Container size="md" p={0}>
      <Title order={1} my="xl">
        Organization
      </Title>
      {!user!.organization ? (
        <Card withBorder>
          <Text fw={500}>You are not part of an organization yet</Text>
          <Text c="dimmed">
            You can go to your profile and accept an invite, or add your own
            organization
          </Text>
          <Group align="center" mt="sm" spacing="xs">
            <Link href="/profile" passHref>
              <Button variant="default" component="a">
                Invites
              </Button>
            </Link>
            <AppAddOrganizationModal />
          </Group>
        </Card>
      ) : (
        <SimpleGrid
          cols={1}
          breakpoints={[{ minWidth: "xs", cols: 2, spacing: "xl" }]}
        >
          <div>
            <Card withBorder>
              <Text size="xl" fw={500} ta="center" mb="sm">
                {user.organization.name}
              </Text>
              <Text>{user.organization.about}</Text>
              {user.organization.trainingResourcesUrl && (
                <>
                  <Card.Section>
                    <Divider my="md" />
                  </Card.Section>
                  <Button
                    fullWidth
                    rightIcon={<IconExternalLink size={16} />}
                    component="a"
                    href={user.organization.trainingResourcesUrl}
                    target="_blank"
                  >
                    Training resources
                  </Button>
                  <Text size="sm" c="dimmed" ta="center" mt="xs">
                    Your organization training resources
                  </Text>
                  <Card.Section>
                    <Divider my="md" />
                  </Card.Section>
                </>
              )}
              <AppOrganizationFeature
                mb="xs"
                label="Domain / Industry"
                description="Knowing the domain helps give more context"
              >
                {user.organization.domainIndustry}
              </AppOrganizationFeature>
              <AppOrganizationFeature
                mb="xs"
                label="Domain Literacy"
                description="Familiarity in general with technical vocabulary in the organization"
              >
                {user.organization.domainLiteracy}
              </AppOrganizationFeature>
              <AppOrganizationFeature
                mb="xs"
                label="Roles"
                description="Roles help you know what answers you can expect"
              >
                {(user.organization.roles as string[]).join(", ") || "-"}
              </AppOrganizationFeature>
            </Card>
          </div>
          <div>
            <Group my="md" position="apart" align="center">
              <Text size="xl" fw={500}>
                Projects
                <Text c="dimmed" component="span" size="md" ml={5}>
                  {projects?.length || ""}
                </Text>
              </Text>
              <AppAddProjectModal
                onProjectAdded={() => projectsRevalidate()}
                buttonProps={{
                  loading: subscriptionLoading,
                  disabled:
                    subscriptionLoading ||
                    subscription?.projectLimit === projects?.length,
                }}
              />
            </Group>
            {subscription?.projectLimit === projects?.length && (
              <Alert
                variant="light"
                color="gray"
                title="Reached project limit"
                mb="sm"
                icon={<IconInfoCircle />}
              >
                The organization has reached the limit of projects for this
                plan. Please contact the organization administrator to consider
                a plan upgrade.
              </Alert>
            )}
            {projects?.map((project) => (
              <AppProjectCard mb="sm" key={project.id} project={project} />
            ))}
            {projectsLoading && (
              <Card withBorder>
                <Skeleton height={8} w="30%" radius="xl" mb="md" />
                <Skeleton height={8} w="100%" radius="xl" mb="md" />
                <Skeleton height={8} w="100%" radius="xl" mb="md" />
                <Skeleton height={8} w="100%" radius="xl" />
              </Card>
            )}
            {projects?.length === 0 && (
              <Card withBorder>
                <Center mih="150px">
                  <Box maw="90%">
                    <Group position="center" mb="sm">
                      <ThemeIcon size="xl" color="gray" variant="light">
                        <IconPackage />
                      </ThemeIcon>
                    </Group>
                    <Text ta="center" fw={500}>
                      Add a project
                    </Text>
                    <Text ta="center" size="sm" c="dimmed">
                      When you add a project, you will see it here
                    </Text>
                  </Box>
                </Center>
              </Card>
            )}
          </div>
        </SimpleGrid>
      )}
    </Container>
  );
}

export default OrganizationPage;

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
