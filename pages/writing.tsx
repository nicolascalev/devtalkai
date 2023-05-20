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
  Button,
  Popover,
  Transition,
} from "@mantine/core";
import React, { useState } from "react";
import AppPreferencesModal, {
  Preferences,
} from "../components/AppPreferencesModal";
import { IconRefresh, IconSend } from "@tabler/icons-react";
import { useElementSize, useScrollIntoView } from "@mantine/hooks";
import api from "../hooks/api.client";
import AppOutputList from "../components/AppOutputList";
import { showNotification } from "@mantine/notifications";
import { Output } from "@prisma/client";
import { OutputListItemType } from "../types/types";
import { ChatCompletionRequestMessage } from "openai/dist/api";

type PromptResonseType = {
  output: Output;
  tokens: number | undefined;
};

function WritingPage() {
  const theme = useMantineTheme();
  const isDark = theme.colorScheme === "dark";
  const { ref: inputRef, height } = useElementSize();
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 10,
  });

  const [preferences, setPreferences] = useState<Preferences>();

  const [prompt, setPrompt] = useState("");
  function onPreferencesChange(prefs: Preferences) {
    setPreferences(prefs);
  }

  const [items, setItems] = useState<OutputListItemType[]>([]);

  const [loadingSendPrompt, setLoadingSendPrompt] = useState(false);
  async function submitPrompt() {
    if (!preferences || !preferences.project) {
      showNotification({
        color: "yellow",
        title: "You need to select a project",
        message: "Go to Preferences > Project",
      });
      return;
    }
    setLoadingSendPrompt(true);
    setItems((prev) => [
      ...prev,
      {
        role: "user",
        content: prompt,
      },
    ]);
    scrollIntoView();
    try {
      const fixedItems: ChatCompletionRequestMessage[] = items.map((item) => ({
        role: item.role,
        content: item.content,
      }));
      const data: PromptResonseType = await api
        .post("/api/prompt", {
          history: fixedItems,
          prompt,
          projectId: preferences.project.value,
          voice: preferences.voice,
          mark: preferences.mark,
        })
        .then((res) => res.data);
      setItems((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.output.body,
          output: data.output,
        },
      ]);
      scrollIntoView();
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

  const showRegenerateButton =
    items.at(-1) !== undefined && items.at(-1)?.role === "assistant";

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
        {preferences && <AppPreferences preferences={preferences} />}
        <Divider my="md" />
      </div>
      <AppOutputList items={items} bottomRef={targetRef} />

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
        <Transition
          mounted={showRegenerateButton}
          transition="slide-up"
          duration={400}
          timingFunction="ease"
        >
          {(styles) => (
            <Button
            variant="default"
            style={{
              ...styles,
              position: "absolute",
              left: "50%",
              top: "-36px",
              transform: "translateY(-50%) translateX(-50%)",
            }}
            rightIcon={<IconRefresh size={16} />}
          >
            Regenerate
          </Button>
          )}
        </Transition>
        <Container size="md" p={0}>
          <Group noWrap align="top" pb="md" spacing="xs">
            <Textarea
              style={{ flexGrow: 1 }}
              minRows={1}
              maxRows={2}
              autosize
              placeholder="Type your prompt..."
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

function AppPreferences({ preferences }: { preferences: Preferences }) {
  return (
    <Group mt="md" spacing="xs">
      {preferences.project && (
        <AppPreferenceItem label={preferences.project.label} type="Project" />
      )}
      <AppPreferenceItem label={preferences.mark} type="Marked as" />
      <AppPreferenceItem label={preferences.voice} type="Voice" />
    </Group>
  );
}

function AppPreferenceItem(props: { label: string; type: string }) {
  return (
    <Popover withArrow shadow="md">
      <Popover.Target>
        <Button size="sm" color="gray" variant="light" aria-readonly>
          {props.label}
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Text size="sm" ta="center">
          {props.type}
        </Text>
      </Popover.Dropdown>
    </Popover>
  );
}
