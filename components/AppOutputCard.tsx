import { ActionIcon, Card, Group, Spoiler, Text, useMantineTheme } from "@mantine/core";
import { IconBookmark, IconBookmarkOff } from "@tabler/icons-react";
import React, { useState } from "react";
import { OutputWithProject } from "../types/types";
import type { CardProps } from "@mantine/core";
import api from "../hooks/api.client";
import { showNotification } from "@mantine/notifications";

type AppOutputCardProps = Omit<CardProps, "children"> & {
  output: OutputWithProject;
  onUpdate?: () => void;
};

function AppOutputCard(props: AppOutputCardProps) {
  const theme = useMantineTheme();
  const [output, setOutput] = useState(props.output);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  async function toggleBookmark() {
    setBookmarkLoading(true);
    try {
      const outputData = await api
        .patch("/api/output/" + props.output.id)
        .then((res) => res.data);
      setOutput((prev) => ({
        ...prev,
        ...{ userBookmarked: outputData.userBookmarked },
      }));
      if (props.onUpdate) {
        props.onUpdate();
      }
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
    <Card withBorder {...props}>
      <Group noWrap align="center" position="apart">
        <Text c="dimmed">{output.project.label}</Text>
        <Group noWrap align="center">
          <ActionIcon
            variant="default"
            size="sm"
            loading={bookmarkLoading}
            onClick={() => toggleBookmark()}
          >
            {output.userBookmarked ? (
              <IconBookmarkOff size={14} />
            ) : (
              <IconBookmark size={14} />
            )}
          </ActionIcon>
        </Group>
      </Group>
      <Spoiler
        maxHeight={165}
        showLabel="Show more"
        hideLabel="Hide"
        transitionDuration={0.3}
        styles={{ control: { fontSize: theme.fontSizes.sm } }}
      >
        <Text mt="sm" style={{ whiteSpace: "pre-wrap" }}>{output.body}</Text>
      </Spoiler>
      <Group noWrap align="center" position="apart" mt="lg">
        <Text c="dimmed" size="sm">
          {output.markedAs}
        </Text>
        <Text c="dimmed" size="sm">
          {new Intl.DateTimeFormat("default", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          }).format(new Date(output.createdAt))}
        </Text>
      </Group>
    </Card>
  );
}

export default AppOutputCard;
