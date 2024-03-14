import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Group,
  Text,
  Textarea,
  Transition,
  useMantineTheme,
} from "@mantine/core";
import { useElementSize, useScrollIntoView } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { Output } from "@prisma/client";
import {
  IconArrowUp,
  IconExternalLink,
  IconRefresh,
  IconTrash,
} from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AppAddOrganizationModal from "../components/AppAddOrganizationModal";
import AppOutputList from "../components/AppOutputList";
import AppPreferencesModal, {
  Preferences,
} from "../components/AppPreferencesModal";
import AppTitle from "../components/ui/AppTitle";
import api from "../hooks/api.client";
import { useStoreActions, useStoreState } from "../store";
import { OutputListItemType } from "../types/types";

type PromptResonseType = {
  output: Output;
  tokens: number | undefined;
};

function ChatPage() {
  const user = useStoreState((state) => state.user);
  const theme = useMantineTheme();

  const { ref: inputRef, height } = useElementSize();
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 10,
  });

  const [prompt, setPrompt] = useState("");

  const storeVoice = useStoreState((state) => state.voice);
  const storeMark = useStoreState((state) => state.mark);
  const storeProjectId = useStoreState((state) => state.projectId);
  const history = useStoreState((state) => state.history);
  const setHistory = useStoreActions((actions) => actions.setHistory);
  const [items, setItems] = useState<OutputListItemType[]>(history);
  useEffect(() => {
    setHistory(items);
  }, [items, setHistory]);

  const selectedRequiredSettings = useMemo(() => {
    return storeVoice && storeMark && storeProjectId;
  }, [storeVoice, storeMark, storeProjectId]);

  const [tokens, setTokens] = useState(0);
  const [loadingSendPrompt, setLoadingSendPrompt] = useState(false);

  useEffect(() => {
    const lastItem = items.at(-1);
    async function submitPrompt() {
      setLoadingSendPrompt(true);
      scrollIntoView();
      try {
        const data: PromptResonseType = await api
          .post("/api/prompt", {
            history: items,
            projectId: storeProjectId,
            voice: storeVoice,
            mark: storeMark,
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
    if (!storeProjectId) {
      return;
    }
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

  // store preferences in store
  const storeSetVoice = useStoreActions((actions) => actions.setVoice);
  const storeSetMark = useStoreActions((actions) => actions.setMark);
  const storeSetProjectId = useStoreActions((actions) => actions.setProjectId);
  function clickNewChat() {
    modals.openConfirmModal({
      title: "Start a new chat?",
      children: (
        <Text size="sm">
          If you start a new chat, your current chat history will reset.
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: () => {
        setItems([]);
        setHistory([]);
        storeSetVoice("");
        storeSetMark("");
        storeSetProjectId("");
      },
    });
  }
  if (!user) return null;

  return (
    <Container size="md" h="100%" p={0}>
      {!user.organization ? (
        <div>
          <AppTitle order={1} my="xl">
            Chat
          </AppTitle>
          <Card withBorder>
            <Text fw={500}>You are not part of an organization yet</Text>
            <Text c="dimmed">
              You can go to your profile and accept an invite, or add your own
              organization
            </Text>
            <Group align="center" mt="sm" spacing="xs">
              <Button variant="default" component={Link} href="/profile">
                Invites
              </Button>
              <AppAddOrganizationModal />
            </Group>
          </Card>
        </div>
      ) : (
        <div>
          <Group noWrap align="center" position="apart">
            <AppTitle order={1} my="xl">
              Chat
            </AppTitle>
            {selectedRequiredSettings && (
              <Button onClick={() => clickNewChat()}>New chat</Button>
            )}
          </Group>
          {!selectedRequiredSettings && <AppPreferencesModal />}
          {selectedRequiredSettings && (
            <>
              <AppPreferences
                preferences={{
                  project: {
                    label: "Project",
                    value: Number(storeProjectId),
                  },
                  voice: storeVoice,
                  mark: storeMark,
                }}
              />
              <Divider my="md" />
              <AppOutputList
                items={items}
                tokens={tokens}
                bottomRef={targetRef}
              />

              {/* Input and buttons for the prompt */}
              <div style={{ height: height + 8 }}></div>
              <Card
                ref={inputRef}
                bg={
                  theme.colorScheme == "light"
                    ? "white"
                    : "var(--mantine-color-dark-7)"
                }
                p="sm"
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
                <Container size="md" p={0}>
                  <Box
                    w="100"
                    style={{
                      position: "relative",
                    }}
                  >
                    <Textarea
                      w="100%"
                      minRows={1}
                      maxRows={10}
                      autosize
                      placeholder="Type your prompt..."
                      value={prompt}
                      onChange={(event) => setPrompt(event.currentTarget.value)}
                      disabled={loadingSendPrompt || tokens === 4096}
                    />
                    <ActionIcon
                      color="primary"
                      variant="filled"
                      disabled={
                        (prompt === "" && !loadingSendPrompt) || tokens === 4096
                      }
                      loading={loadingSendPrompt}
                      onClick={() => addItem()}
                      style={{
                        position: "absolute",
                        right: "var(--mantine-spacing-xs)",
                        bottom: "var(--mantine-spacing-xs)",
                      }}
                    >
                      <IconArrowUp size={16} />
                    </ActionIcon>
                  </Box>
                </Container>
              </Card>
            </>
          )}
        </div>
      )}
    </Container>
  );
}

export const getServerSideProps = withPageAuthRequired();

export default ChatPage;

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
            <ActionIcon
              size="sm"
              variant="light"
              color="gray"
              component={Link}
              href={"/project/" + preferences.project.value}
              target="_blank"
            >
              <IconExternalLink size={14} />
            </ActionIcon>
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
