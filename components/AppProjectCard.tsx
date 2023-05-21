import { Anchor, Card, Group, Text, ThemeIcon } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import React from "react";
import type { CardProps } from "@mantine/core";
import { Project } from "@prisma/client";
import { IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";

type AppProjectCardProps = Omit<CardProps, "children"> & {
  project: Project;
};

function AppProjectCard({ project, ...rest }: AppProjectCardProps) {
  const { hovered, ref } = useHover();
  return (
    <Link href={"/project/" + project.id} passHref>
      <Anchor underline={false}>
        <Card
          ref={ref}
          withBorder
          {...rest}
          shadow={hovered ? "md" : "none"}
          style={{ transition: "box-shadow 0.5s" }}
        >
          <Group noWrap align="center" position="apart" spacing="xs">
            <div>
              <Text fw={500}>{project.label}</Text>
              <Text c="dimmed">{project.description}</Text>
            </div>
            <ThemeIcon color="gray" variant="subtle">
              <IconChevronRight size={16} />
            </ThemeIcon>
          </Group>
        </Card>
      </Anchor>
    </Link>
  );
}

export default AppProjectCard;
