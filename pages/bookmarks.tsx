import {
  Button,
  Container,
  Group,
  Title,
  Text,
  SimpleGrid,
  Card,
  ActionIcon,
} from "@mantine/core";
import { IconBookmark } from "@tabler/icons-react";
import Link from "next/link";

export default function BookmarksPage() {
  return (
    <Container size="md" p={0}>
      <Group noWrap align="center" position="apart">
        <Title order={1} my="xl">
          Bookmarks
        </Title>
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
        <div>
          <AppSnippetCard />
        </div>
        <div>
          <AppSnippetCard />
        </div>
        <div>
          <AppSnippetCard />
        </div>
      </SimpleGrid>
    </Container>
  );
}

function AppSnippetCard() {
  return (
    <Card withBorder>
      <Group noWrap align="center" position="apart">
        <Text c="dimmed">Project name</Text>
        <Group noWrap align="center">
          <ActionIcon variant="default" size="sm">
            <IconBookmark size={14} />
          </ActionIcon>
        </Group>
      </Group>
      <Text my="sm">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Atque, hic.
        Perferendis ducimus rem amet explicabo tenetur odio laudantium natus quo
        porro dolores commodi nesciunt soluta enim magni, voluptatibus quas
        perspiciatis?
      </Text>
      <Group noWrap align="center" position="apart">
        <Text c="dimmed" size="sm">
          Issue
        </Text>
        <Text c="dimmed" size="sm">
          13d ago
        </Text>
      </Group>
    </Card>
  );
}
