import { Group, Card, Text, ActionIcon, CopyButton } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import {
  IconBookmark,
  IconBookmarkOff,
  IconCheck,
  IconCopy,
} from "@tabler/icons-react";
import React, { useState } from "react";
import { OutputListItemType } from "../types/types";
import api from "../hooks/api.client";
import { Output } from "@prisma/client";

function AppOutputListAssistantItem({ item }: { item: OutputListItemType }) {
  const [output, setOutput] = useState(item.output as Output);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  async function toggleBookmark() {
    setBookmarkLoading(true);
    try {
      const outputData = await api
        .patch("/api/output/" + item.output!.id)
        .then((res) => res.data);
      setOutput((prev) => ({
        ...prev,
        ...{ userBookmarked: outputData.userBookmarked },
      }));
    } catch (err) {
      showNotification({
        color: "red",
        title: "Please try again later",
        message: "There was an error toggling your bookmark",
      });
    } finally {
      setBookmarkLoading(false);
    }
  }
  return (
    <Group mb="sm">
      <Card maw="90%" miw="300px" withBorder bg="inherit">
        <Text size="md" style={{ whiteSpace: "pre-wrap" }}>
          {item.content}
        </Text>
        <Group mt="xs" position="right">
          <Group noWrap align="center" spacing="xs">
            <CopyButton value={item.content}>
              {({ copied, copy }) => (
                <ActionIcon variant="default" onClick={copy} title="Copy">
                  {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                </ActionIcon>
              )}
            </CopyButton>
            <ActionIcon
              variant="default"
              loading={bookmarkLoading}
              onClick={() => toggleBookmark()}
            >
              {output.userBookmarked ? (
                <IconBookmarkOff size={16} />
              ) : (
                <IconBookmark size={16} />
              )}
            </ActionIcon>
          </Group>
        </Group>
      </Card>
    </Group>
  );
}

export default AppOutputListAssistantItem;
