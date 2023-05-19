import {
  Badge,
  Button,
  Card,
  Group,
  Text,
  Skeleton,
  CardProps,
  Popover,
} from "@mantine/core";
import React, { useState } from "react";
import {
  InviteWithOrganization,
  UserWithNestedProperties,
} from "../types/types";
import api from "../hooks/api.client";
import { showNotification } from "@mantine/notifications";
import { IconInfoCircle } from "@tabler/icons-react";

type AppInviteCardProps = {
  invite: InviteWithOrganization;
  disabled: boolean;
  user: UserWithNestedProperties;
  onOrganizationChange: () => void;
} & Omit<CardProps, "children">;

function AppInviteCard({
  invite,
  disabled,
  user,
  onOrganizationChange,
  ...rest
}: AppInviteCardProps) {
  const [loadingJoinOrganization, setLoadingJoinOrganization] = useState(false);

  async function joinOrganization() {
    setLoadingJoinOrganization(true);
    try {
      await api.post("/api/profile/organization", { inviteId: invite.id });
      showNotification({
        message: "You joined an organization successfully",
      });
      onOrganizationChange();
    } catch (err) {
      const error: any = err;
      if (error.response.data) {
        showNotification({
          color: "red",
          message: error.response.data,
        });
        return;
      }
      showNotification({
        color: "red",
        title: "Please try again later",
        message: "There was an error accepting that invite",
      });
    } finally {
      setLoadingJoinOrganization(false);
    }
  }

  const [loadingLeaveOrganization, setLoadingLeaveOrganization] =
    useState(false);

  async function leaveOrganization() {
    setLoadingLeaveOrganization(true);
    try {
      await api.delete("/api/profile/organization");
      showNotification({
        message: "You left the organization successfully",
      });
      onOrganizationChange();
    } catch (err) {
      const error: any = err;
      if (error.response.data) {
        showNotification({
          color: "red",
          message: error.response.data,
        });
        return;
      }
      showNotification({
        color: "red",
        title: "Please try again later",
        message: "There was an error leaving the organization",
      });
    } finally {
      setLoadingLeaveOrganization(false);
    }
  }

  return (
    <Card withBorder style={{ overflow: "visible" }} {...rest}>
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
          <Popover width={200} withArrow shadow="md" position="top-end">
            <Popover.Target>
              <Button
                variant="default"
                disabled={
                  disabled === true ||
                  user.organization?.id === invite.organizationId
                }
                loading={loadingJoinOrganization}
              >
                Join
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <Text size="sm">
                Are you sure you want to join {invite.organization.name}?
              </Text>
              <Button
                fullWidth
                size="xs"
                mt="xs"
                disabled={
                  disabled === true ||
                  user.organization?.id === invite.organizationId
                }
                loading={loadingJoinOrganization}
                onClick={() => joinOrganization()}
              >
                Confirm
              </Button>
            </Popover.Dropdown>
          </Popover>

          {user.organization?.id === invite.organizationId &&
            user.adminOf?.id !== invite.organizationId && (
              <Popover width={200} withArrow shadow="md" position="top-end">
                <Popover.Target>
                  <Button variant="default" loading={loadingLeaveOrganization}>
                    Leave
                  </Button>
                </Popover.Target>
                <Popover.Dropdown>
                  <Text size="sm">
                    Are you sure you want to leave {invite.organization.name}?
                  </Text>
                  <Button
                    fullWidth
                    size="xs"
                    mt="xs"
                    color="red"
                    loading={loadingLeaveOrganization}
                    onClick={() => leaveOrganization()}
                  >
                    Confirm
                  </Button>
                </Popover.Dropdown>
              </Popover>
            )}
        </Group>
      </Group>
      {user.organization?.id === invite.organizationId && (
        <Group noWrap align="center" mt="sm" spacing={5}>
          <IconInfoCircle size={14} />
          <Text size="sm">You are a member in this organization</Text>
        </Group>
      )}
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
