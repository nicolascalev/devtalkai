import { Card, Text, Group, Skeleton } from "@mantine/core";
import React from "react";
import type { CardProps } from "@mantine/core";
import { User } from "@prisma/client";

type AppUserCardProps = Omit<CardProps, "children"> & {
  user: User;
};

function AppUserCard(props: AppUserCardProps) {
  return (
    <Card withBorder {...props}>
      <Text fw={500}>{props.user.fullName}</Text>
      <Text c="dimmed" size="sm">
        {props.user.email}
      </Text>
      <Group align="center" position="apart" mt="xs">
        <Text c="dimmed" size="sm">
          Role
        </Text>
        <Text size="sm">{props.user.role || "-"}</Text>
      </Group>
    </Card>
  );
}

export default AppUserCard;

export function AppUserCardSkeleton() {
  return (
    <Card withBorder>
      <Skeleton height="8px" mb="sm" w="90%" radius="xl" />
      <Skeleton height="8px" mb="sm" w="90%" radius="xl" />
      <Skeleton height="8px" w="30%" radius="xl" />
    </Card>
  );
}
