import {
  Container,
  Title,
  Text,
  Group,
  Badge,
  Divider,
  Textarea,
  ActionIcon,
  Card,
  useMantineTheme,
} from "@mantine/core";
import React, { useState } from "react";
import AppPreferencesModal from "../components/AppPreferencesModal";
import {
  IconSend,
} from "@tabler/icons-react";
import { useElementSize } from "@mantine/hooks";
import api from "../hooks/api.client";
import AppOutputList from "../components/AppOutputList";
import { showNotification } from "@mantine/notifications";
import { Output } from "@prisma/client";
import { OutputListItemType } from "../types/types";

type PromptResonseType = {
  output: Output;
  tokens: number | undefined;
};

function WritingPage() {
  const theme = useMantineTheme();
  const isDark = theme.colorScheme === "dark";
  const { ref: inputRef, height } = useElementSize();
  const [preferences, setPreferences] = useState<string[]>([]);

  const [prompt, setPrompt] = useState("");
  function onPreferencesChange(prefs: string[]) {
    setPreferences(prefs);
  }

  const [items, setItems] = useState<OutputListItemType[]>([]);

  const [loadingSendPrompt, setLoadingSendPrompt] = useState(false);
  async function submitPrompt() {
    setLoadingSendPrompt(true);
    setItems((prev) => [
      ...prev,
      {
        role: "user",
        content: prompt,
      },
    ]);
    try {
      const data: PromptResonseType = await api
        .post("/api/prompt", { projectId: 3 })
        .then((res) => res.data);
      setItems((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.output.body,
          output: data.output,
        },
      ]);
      setPrompt("");
    } catch (err) {
      setItems((prev) => prev.slice(0, -1));
      showNotification({
        color: "red",
        title: "Please try again",
        message: "There was an error getting a response",
      });
      console.log(err);
    } finally {
      setLoadingSendPrompt(false);
    }
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
      <AppOutputList items={items} />

      <div style={{ height: height + 16 }}></div>
      <Card
        ref={inputRef}
        bg={isDark ? undefined : "gray.0"}
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
              value={prompt}
              onChange={(event) => setPrompt(event.currentTarget.value)}
              disabled={loadingSendPrompt}
            />
            <div>
              <ActionIcon
                color="primary"
                variant="filled"
                disabled={prompt === ""}
                loading={loadingSendPrompt}
                onClick={() => submitPrompt()}
              >
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
