import { Card, Text } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import React from "react";
import type { CardProps } from "@mantine/core";
import { Project } from "@prisma/client";

type AppProjectCardProps = Omit<CardProps, 'children'> & {
  project: Project;
};

function AppProjectCard({ project, ...rest }: AppProjectCardProps) {
  const { hovered, ref } = useHover();
  return (
    <Card
      ref={ref}
      withBorder
      {...rest}
      shadow={hovered ? "md" : "none"}
      style={{ transition: "box-shadow 0.5s" }}
    >
      <Text fw={500}>
        {project.label}
      </Text>
      <Text c="dimmed">{project.description}</Text>
    </Card>
  );
}

export default AppProjectCard;
