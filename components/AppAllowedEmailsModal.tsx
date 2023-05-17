import {
  Modal,
  Button,
  TextInput,
  Loader,
  Group,
  Text,
  Divider,
  ActionIcon,
  Alert,
} from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import useMatchesMediaQuery from "../hooks/useMatchesMediaQuery";
import Joi from "joi";
import { showNotification } from "@mantine/notifications";
import api from "../hooks/api.client";
import { useStoreState } from "../store";
import { Invite } from "@prisma/client";
import { IconUserX, IconX } from "@tabler/icons-react";
import useOrganizationInvites from "../hooks/useOrganizationInvites";

function AppAllowedEmailsModal({
  count,
}: {
  count: number | null | undefined;
}) {
  const user = useStoreState((state) => state.user);
  const [opened, { open, close }] = useDisclosure(false);
  const { ltExtraSmall } = useMatchesMediaQuery();

  const [emailFilter, setEmailFilter] = useState("");
  const [debouncedEmail] = useDebouncedValue(emailFilter, 500);
  const [page, setPage] = useState(1);
  const [isValidEmail, setIsValidEmail] = useState(false);

  const [invites, setInvites] = useState<Invite[]>([]);

  const {
    organizationInvitesResponse,
    organizationInvitesData,
    organizationInvitesLoading,
    organizationInvitesError,
  } = useOrganizationInvites(debouncedEmail, page);

  useEffect(() => {
    const validated = Joi.string().email({ tlds: false }).validate(emailFilter);
    if (validated.error || organizationInvitesLoading || invites.length > 0) {
      setIsValidEmail(false);
    } else {
      setIsValidEmail(true);
    }
  }, [emailFilter, invites.length, organizationInvitesLoading]);

  useEffect(() => {
    setInvites([]);
    setPage(1);
  }, [emailFilter]);

  useEffect(() => {
    if (organizationInvitesData) {
      setInvites((prev) => {
        const newInvites = [...prev, ...organizationInvitesData];
        const unique = Array.from(
          new Map(newInvites.map((m) => [m.id, m])).values()
        );
        return unique;
      });
    }
  }, [organizationInvitesData]);

  const [loadingAddEmail, setLoadingAddEmail] = useState(false);
  if (!user?.adminOf) return null;
  async function addEmail() {
    setLoadingAddEmail(true);
    try {
      const invite: Invite = await api
        .post(`/api/organization/${user!.adminOf!.id}/members`, {
          email: emailFilter,
        })
        .then((res) => res.data);
      setInvites((invCopy: Invite[]) => [invite, ...invCopy]);
      showNotification({
        message: "Email added to list",
      });
    } catch (err) {
      const error = err as any;
      if (error.response.data) {
        showNotification({
          message: error.response.data,
          color: "red",
        });
        return;
      }
      showNotification({
        title: "Please try again later",
        message: "There was an error adding that email",
        color: "red",
      });
    } finally {
      setLoadingAddEmail(false);
    }
  }

  return (
    <>
      <Button variant="default" onClick={() => open()}>
        Manage allowed emails
      </Button>

      <Modal
        opened={opened}
        onClose={() => close()}
        title={"Allowed emails " + count}
        fullScreen={ltExtraSmall}
        transitionProps={ltExtraSmall ? { transition: "slide-up" } : undefined}
      >
        <TextInput
          mb="sm"
          type="search"
          description="If the email is valid you will see a button to add it"
          placeholder="Search by email or add one"
          value={emailFilter}
          onChange={(event) => setEmailFilter(event.currentTarget.value)}
          rightSection={
            organizationInvitesLoading ? (
              <Loader size="xs" />
            ) : emailFilter ? (
              <ActionIcon
                size="sm"
                title="clear"
                onClick={() => setEmailFilter("")}
              >
                <IconX size={12} />
              </ActionIcon>
            ) : null
          }
        />
        {isValidEmail && (
          <Group noWrap align="center" position="apart" mb="sm">
            <Text size="sm" c="dimmed">
              The email {emailFilter} has not been added, do you want to add it?
            </Text>
            <Button
              variant="default"
              size="sm"
              onClick={() => addEmail()}
              loading={loadingAddEmail}
            >
              Add
            </Button>
          </Group>
        )}
        {invites.map((inv) => (
          <div key={inv.id}>
            <Group py="sm" position="apart" align="center" noWrap>
              <div>
                <Text size="sm">{inv.email}</Text>
                {inv.email === user.email && (
                  <Text size="xs" c="dimmed">
                    You are the admin so you can not be removed
                  </Text>
                )}
              </div>
              <ActionIcon disabled={inv.email === user.email}>
                <IconUserX size={16} />
              </ActionIcon>
            </Group>
            <Divider />
          </div>
        ))}
        {organizationInvitesError && !organizationInvitesLoading && (
          <Alert title="Please try again later" color="red" variant="outline">
            There was an error getting your emails
          </Alert>
        )}
        {!organizationInvitesLoading &&
          organizationInvitesResponse?.hasNextPage && (
            <Button
              variant="default"
              fullWidth
              mt="sm"
              onClick={() => setPage((prev) => prev + 1)}
            >
              Load more
            </Button>
          )}
        {invites.length === 0 && debouncedEmail && !isValidEmail && (
          <Text size="sm" c="dimmed">
            No results match &quot;{debouncedEmail}&quot;
          </Text>
        )}
      </Modal>
    </>
  );
}

export default AppAllowedEmailsModal;
