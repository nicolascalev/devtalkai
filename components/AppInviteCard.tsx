import {
  Badge,
  Button,
  Card,
  Group,
  Text,
  Skeleton,
  CardProps,
} from "@mantine/core";
import React from "react";
import { InviteWithOrganization } from "../types/types";

type AppInviteCardProps = {
  invite: InviteWithOrganization;
} & Omit<CardProps, "children">;

function AppInviteCard({ invite, ...rest }: AppInviteCardProps) {
  return (
    <Card withBorder {...rest}>
      <Group align="center" position="apart" spacing="sm">
        <div>
          <Text fw={500}>{invite.organization.name}</Text>
          <Text c="dimmed" size="sm">
            {new Intl.DateTimeFormat("default", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            }).format(new Date(invite.organization.createdAt))}
          </Text>
        </div>
        <Group
          align="center"
          position="right"
          spacing="xs"
          style={{ flexGrow: 1 }}
        >
          <Button variant="default">Join</Button>
        </Group>
      </Group>
    </Card>
  );
}

export default AppInviteCard;

export function AppInviteCardSkeleton() {
  return (
    <Card withBorder>
      <Skeleton h={8} mb="md" w="50%" radius="xl" />
      <Skeleton h={8} mb="md" w="100%" radius="xl" />
      <Skeleton h={8} w="100%" radius="xl" />
    </Card>
  );
}
