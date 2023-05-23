import {
  Button,
  Container,
  Group,
  Title,
  Text,
  SimpleGrid,
  Card,
  ActionIcon,
  Pagination,
  Center,
  Box,
  ThemeIcon,
  Skeleton,
} from "@mantine/core";
import { IconBookmark, IconNote } from "@tabler/icons-react";
import Link from "next/link";

import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useState } from "react";
import useOutputs from "../hooks/useOutputs";
import AppOutputCard from "../components/AppOutputCard";
import AppTitle from "../components/ui/AppTitle";
export const getServerSideProps = withPageAuthRequired();

export default function IndexPage() {
  const [page, setPage] = useState(1);
  const { outputsResponse, outputsLoading, outputsError, outputsRevalidate } =
    useOutputs(page);

  return (
    <Container size="md" p={0}>
      <Group noWrap align="center" position="apart">
        <AppTitle order={1} my="xl">
          Outputs
        </AppTitle>
        <Link href="/writing" passHref>
          <Button>Create</Button>
        </Link>
      </Group>
      <Text size="lg" fw={500}>
        Recent content writing
      </Text>
      <Text c="dimmed">Keep track of your previous outputs</Text>

      <SimpleGrid
        mt="lg"
        cols={1}
        breakpoints={[
          { minWidth: "xs", cols: 2 },
          { minWidth: "sm", cols: 3 },
        ]}
      >
        {outputsResponse?.result.map((output) => (
          <div key={output.id}>
            <AppOutputCard output={output} onUpdate={() => outputsRevalidate()} />
          </div>
        ))}
        {outputsResponse?.result.length === 0 && (
          <Card withBorder mih="200px">
            <Center h="100%">
              <Box maw="90%">
                <Group position="center" mb="sm">
                  <ThemeIcon size="xl" color="gray" variant="light">
                    <IconNote />
                  </ThemeIcon>
                </Group>
                <Text ta="center" fw={500}>
                  Start writing
                </Text>
                <Text ta="center" size="sm" c="dimmed">
                  When you get started, the outputs will be shown here
                </Text>
              </Box>
            </Center>
          </Card>
        )}
        {outputsLoading && <AppOutputsLoader />}
      </SimpleGrid>
      <Group position="apart" align="center" mt="sm" mb="xl">
        <Text c="dimmed" size="sm">
          Total results: {outputsResponse?.count}
        </Text>
        <Pagination
          value={page}
          onChange={setPage}
          total={outputsResponse?.totalPages}
        />
      </Group>
    </Container>
  );
}

function AppOutputsLoader() {
  return (
    <>
      <div>
        <AppOutputSkeleton />
      </div>
      <div>
        <AppOutputSkeleton />
      </div>
      <div>
        <AppOutputSkeleton />
      </div>
    </>
  );
}

function AppOutputSkeleton() {
  return (
    <>
      <Skeleton height={8} width="20%" radius="xl" mb="md" />
      <Skeleton height={8} width="100%" radius="xl" mb="md" />
      <Skeleton height={8} width="100%" radius="xl" mb="md" />
      <Skeleton height={8} width="90%" radius="xl" mb="md" />
      <Skeleton height={8} width="20%" radius="md" />
    </>
  );
}
