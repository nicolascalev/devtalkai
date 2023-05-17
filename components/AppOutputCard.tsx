import { ActionIcon, Card, Group, Text } from "@mantine/core";
import { IconBookmark } from "@tabler/icons-react";
import React from "react";
import { OutputWithProject } from "../types/types";
import type { CardProps } from "@mantine/core";

type AppOutputCardProps = Omit<CardProps, 'children'> & {
  output: OutputWithProject;
};

function AppOutputCard(props: AppOutputCardProps) {
  return (
    <Card withBorder {...props}>
      <Group noWrap align="center" position="apart">
        <Text c="dimmed">{props.output.project.label}</Text>
        <Group noWrap align="center">
          <ActionIcon variant="default" size="sm">
            <IconBookmark size={14} />
          </ActionIcon>
        </Group>
      </Group>
      <Text my="sm">{props.output.body}</Text>
      <Group noWrap align="center" position="apart">
        <Text c="dimmed" size="sm">
          {props.output.markedAs}
        </Text>
        <Text c="dimmed" size="sm">
          {new Intl.DateTimeFormat("default", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          }).format(new Date(props.output.createdAt))}
        </Text>
      </Group>
    </Card>
  );
}

export default AppOutputCard;
