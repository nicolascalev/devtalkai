import {
  Container,
  Title,
  Text,
  Group,
  Badge,
  Divider,
  Textarea,
  ActionIcon,
  Alert,
  Card,
  useMantineTheme,
} from "@mantine/core";
import React, { useState } from "react";
import AppPreferencesModal from "../components/AppPreferencesModal";
import {
  IconBookmark,
  IconCopy,
  IconRefresh,
  IconSend,
} from "@tabler/icons-react";
import { useElementSize } from "@mantine/hooks";

function WritingPage() {
  const theme = useMantineTheme();
  const { ref: inputRef, height } = useElementSize();
  const isDark = theme.colorScheme === "dark";
  const [preferences, setPreferences] = useState<string[]>([]);

  function onPreferencesChange(prefs: string[]) {
    setPreferences(prefs);
  }

  return (
    <Container size="md" h="100%" p={0}>
      <div>
        <Group noWrap align="center" position="apart">
          <Title order={1} my="xl">
            Writing
          </Title>
          <AppPreferencesModal onPreferencesChange={onPreferencesChange} />
        </Group>
        <Text size="lg" fw={500}>
          Generate snippets
        </Text>
        <Text c="dimmed">Select your preferences for context first</Text>
        <Group mt="md" spacing="xs">
          {preferences.map((pref) => (
            <Badge
              key={pref}
              size="lg"
              radius="sm"
              variant="outline"
              style={{ textTransform: "none" }}
            >
              {pref}
            </Badge>
          ))}
        </Group>
        <Divider my="md" />
      </div>
      <div>
        <Group mb="sm">
          <Card maw="90%" miw="300px" withBorder bg="inherit">
            <Text size="md">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illum,
              nobis. Animi recusandae alias voluptatum, ex, magni et temporibus
              soluta aperiam, accusamus quaerat facere. Ducimus aspernatur sit
              tempore numquam. Repellat, harum.
            </Text>
            <Group mt="xs" position="right">
              <Group noWrap align="center" spacing="xs">
                <ActionIcon variant="default">
                  <IconRefresh size={16} />
                </ActionIcon>
                <ActionIcon variant="default">
                  <IconBookmark size={16} />
                </ActionIcon>
                <ActionIcon variant="default">
                  <IconCopy size={16} />
                </ActionIcon>
              </Group>
            </Group>
          </Card>
        </Group>
        <Group mb="sm" position="right">
          <Alert maw="90%" variant="outline" color={isDark ? "gray" : "dark"}>
            <Text size="md">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illum,
              nobis. Animi recusandae alias voluptatum, ex, magni et temporibus
              soluta aperiam, accusamus quaerat facere. Ducimus aspernatur sit
              tempore numquam. Repellat, harum.
            </Text>
          </Alert>
        </Group>
      </div>

      <div style={{ height: height + 16 }}></div>
      <Card
        ref={inputRef}
        p="sm"
        withBorder
        radius={0}
        style={{
          overflow: "visible",
          position: "fixed",
          right: 1,
          bottom: 0,
          width: "calc(100vw - var(--mantine-navbar-width))",
        }}
      >
        <Container size="md" p={0}>
          <Group noWrap align="top" pb="md" spacing="xs">
            <Textarea
              style={{ flexGrow: 1 }}
              minRows={1}
              maxRows={2}
              autosize
              placeholder="Send signals to my house to water my plants..."
            />
            <div>
              <ActionIcon color="primary" variant="filled">
                <IconSend size={16} />
              </ActionIcon>
            </div>
          </Group>
        </Container>
      </Card>
    </Container>
  );
}

export default WritingPage;
