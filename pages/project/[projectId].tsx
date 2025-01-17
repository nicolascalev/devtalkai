import {
  Button,
  Container,
  Group,
  Title,
  Text,
  Skeleton,
  Box,
  SimpleGrid,
  List,
} from "@mantine/core";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import React, { useEffect } from "react";
import useProject from "../../hooks/useProject";
import { IconExternalLink } from "@tabler/icons-react";
import useMatchesMediaQuery from "../../hooks/useMatchesMediaQuery";
import Link from "next/link";
import { useRouter } from "next/router";
import AppEditProjectModal from "../../components/AppEditProjectModal";
import AppTitle from "../../components/ui/AppTitle";

function ProjectPage(props: { projectId: number }) {
  const router = useRouter();
  const { ltExtraSmall } = useMatchesMediaQuery();
  const { project, projectLoading, projectLoadingError, projectRevalidate } =
    useProject(props.projectId);

  // if the loading error is 404 or 403 then redirect
  useEffect(() => {
    if (
      projectLoadingError &&
      [404, 403].includes(projectLoadingError.response?.status || 500)
    ) {
      router.push("/" + projectLoadingError.response?.status);
    }
  }, [projectLoadingError, router]);
  function getDateString(date: string): string {
    const dateString = new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
    return dateString;
  }

  return (
    <Container size="md" p={0}>
      <Group noWrap align="center" position="apart">
        <AppTitle order={1} my="xl">
          Project
        </AppTitle>
        {project && (
          <AppEditProjectModal
            onProjectUpdated={projectRevalidate}
            project={project}
          />
        )}
      </Group>

      {projectLoading && <AppSingleProjectSkeleton />}
      {project && (
        <>
          <Group mb="xl" align="top" spacing="xs">
            <div>
              <Text size="lg" fw={500}>
                {project.label}
              </Text>
              <Text c="dimmed">
                Added on {getDateString(project.createdAt)}
              </Text>
            </div>
            {project.documentationLink && (
              <Group
                position="right"
                w={ltExtraSmall ? "100%" : undefined}
                style={{ flexGrow: 1 }}
              >
                <Button
                  component={Link}
                  href={project.documentationLink}
                  target="_blank"
                  variant="default"
                  fullWidth={ltExtraSmall}
                  rightIcon={<IconExternalLink size={16} />}
                >
                  Project documentation
                </Button>
              </Group>
            )}
          </Group>

          <Box mb="xl">
            <Text c="dimmed">Description</Text>
            <Text style={{ whiteSpace: "pre-wrap" }}>
              {project.description}
            </Text>
          </Box>

          <SimpleGrid
            cols={1}
            breakpoints={[
              { minWidth: "xs", cols: 2 },
              { minWidth: "lg", cols: 3 },
            ]}
          >
            <Box>
              <Text c="dimmed">Objectives</Text>
              {(project.objectives as string[]).length > 0 ? (
                <List>
                  {(project.objectives as string[]).map((item, i) => (
                    <List.Item key={i}>{item}</List.Item>
                  ))}
                </List>
              ) : (
                "-"
              )}
            </Box>
            <Box>
              <Text c="dimmed">Tech Stack</Text>
              {(project.technicalStack as string[]).length > 0 ? (
                <List>
                  {(project.technicalStack as string[]).map((item, i) => (
                    <List.Item key={i}>{item}</List.Item>
                  ))}
                </List>
              ) : (
                "-"
              )}
            </Box>
            <Box>
              <Text c="dimmed">Integrations</Text>
              {(project.integrations as string[]).length > 0 ? (
                <List>
                  {(project.integrations as string[]).map((item, i) => (
                    <List.Item key={i}>{item}</List.Item>
                  ))}
                </List>
              ) : (
                "-"
              )}
            </Box>
            <Box>
              <Text c="dimmed">Security Considerations</Text>
              {(project.securityConsiderations as string[]).length > 0 ? (
                <List>
                  {(project.securityConsiderations as string[]).map(
                    (item, i) => (
                      <List.Item key={i}>{item}</List.Item>
                    )
                  )}
                </List>
              ) : (
                "-"
              )}
            </Box>
            <Box>
              <Text c="dimmed">Time Constraints</Text>
              <Text style={{ whiteSpace: "pre-wrap" }}>
                {project.timeConstraints || "-"}
              </Text>
            </Box>
          </SimpleGrid>
        </>
      )}
    </Container>
  );
}

function AppSingleProjectSkeleton() {
  return (
    <>
      <Skeleton h={8} w="30%" radius="xl" mb="md" />
      <Skeleton h={8} w="90%" radius="xl" mb={30} />
      <Skeleton h={8} w="100%" radius="xl" mb="md" />
      <Skeleton h={8} w="100%" radius="xl" mb="md" />
      <Skeleton h={8} w="100%" radius="xl" mb="md" />
      <Skeleton h={8} w="100%" radius="xl" mb="md" />
      <Skeleton h={8} w="90%" radius="xl" />
    </>
  );
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    return {
      props: {
        projectId: Number(ctx.query.projectId),
      },
    };
  },
});

export default ProjectPage;
