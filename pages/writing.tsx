import {
  Container,
  Title,
  Text,
  Group,
  Divider,
  Textarea,
  ActionIcon,
  Card,
  useMantineTheme,
  Button,
  Transition,
  Box,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import AppPreferencesModal, {
  Preferences,
} from "../components/AppPreferencesModal";
import {
  IconExternalLink,
  IconRefresh,
  IconSend,
  IconTrash,
} from "@tabler/icons-react";
import { useElementSize, useScrollIntoView } from "@mantine/hooks";
import api from "../hooks/api.client";
import AppOutputList from "../components/AppOutputList";
import { showNotification } from "@mantine/notifications";
import { Output } from "@prisma/client";
import { OutputListItemType } from "../types/types";
import { ChatCompletionRequestMessage } from "openai/dist/api";
import Link from "next/link";
import { useStoreActions, useStoreState } from "../store";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

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

  const history = useStoreState((state) => state.history);
  const setHistory = useStoreActions((actions) => actions.setHistory);
  const [items, setItems] = useState<OutputListItemType[]>(history);
  useEffect(() => {
    setHistory(items);
  }, [items, setHistory]);
  const [tokens, setTokens] = useState(0);
  const [loadingSendPrompt, setLoadingSendPrompt] = useState(false);

  useEffect(() => {
    const lastItem = items.at(-1);
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
      scrollIntoView();
      try {
        const fixedItems: ChatCompletionRequestMessage[] = items
          .map((item) => ({
            role: item.role,
            content: item.content,
          }))
          .slice(0, -1);
        const data: PromptResonseType = await api
          .post("/api/prompt", {
            history: fixedItems,
            prompt: lastItem?.content,
            projectId: preferences.project.value,
            voice: preferences.voice,
            mark: preferences.mark,
          })
          .then((res) => res.data);
        setTokens(data.tokens || 0);
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
    if (lastItem && lastItem.role === "user") {
      submitPrompt();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        role: "user",
        content: prompt,
      },
    ]);
  }

  const showRegenerateButton =
    items.at(-1) !== undefined && items.at(-1)?.role === "assistant";

  function onClickRegenerate() {
    setItems((prev) => prev.slice(0, -1));
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
        {preferences && <AppPreferences preferences={preferences} />}
        <Divider my="md" />
      </div>
      <AppOutputList items={items} tokens={tokens} bottomRef={targetRef} />

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
        <Group
          w="100%"
          position="center"
          style={{
            position: "absolute",
            top: "-48px",
          }}
        >
          <Group spacing="xs">
            <Transition
              mounted={showRegenerateButton}
              transition="slide-up"
              duration={400}
              timingFunction="ease"
            >
              {(styles) => (
                <Button
                  variant="default"
                  style={{ ...styles, boxShadow: theme.shadows.sm }}
                  rightIcon={<IconRefresh size={16} />}
                  onClick={() => onClickRegenerate()}
                >
                  Regenerate
                </Button>
              )}
            </Transition>
            <Transition
              mounted={items.length > 0 && !loadingSendPrompt}
              transition="slide-up"
              duration={400}
              timingFunction="ease"
            >
              {(styles) => (
                <Button
                  variant="default"
                  rightIcon={
                    <IconTrash size={16} color={theme.colors.red[6]} />
                  }
                  style={{ ...styles, boxShadow: theme.shadows.sm }}
                  onClick={() => setItems([])}
                >
                  Reset
                </Button>
              )}
            </Transition>
          </Group>
        </Group>
        {/* IMPORTANT: this works, sometimes it goes under navbar if you resize the window, 
        but the width is set on page load so that's not an issue */}
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
              disabled={loadingSendPrompt || tokens === 4096}
            />
            <div>
              <ActionIcon
                color="primary"
                variant="filled"
                disabled={
                  (prompt === "" && !loadingSendPrompt) || tokens === 4096
                }
                loading={loadingSendPrompt}
                onClick={() => addItem()}
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

export const getServerSideProps = withPageAuthRequired();

export default WritingPage;

function AppPreferences({ preferences }: { preferences: Preferences }) {
  return (
    <Group spacing="xs">
      <Box miw={125}>
        <Text c="dimmed" size="sm">
          Project
        </Text>
        <Group spacing={5} align="center">
          <Text>{preferences.project?.label || "-"}</Text>
          {preferences.project && (
            <Link href={"/project/" + preferences.project.value} passHref>
              <ActionIcon
                size="sm"
                variant="light"
                color="gray"
                component="a"
                target="_blank"
              >
                <IconExternalLink size={14} />
              </ActionIcon>
            </Link>
          )}
        </Group>
      </Box>
      <Box miw={125}>
        <Text c="dimmed" size="sm">
          Voice
        </Text>
        <Text>{preferences.voice}</Text>
      </Box>
      <Box miw={125}>
        <Text c="dimmed" size="sm">
          Marked as
        </Text>
        <Text>{preferences.mark}</Text>
      </Box>
    </Group>
  );
}
