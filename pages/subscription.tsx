import React, { useEffect, useState } from "react";
import { useStoreState } from "../store";
import {
  Box,
  Text,
  Group,
  Button,
  Title,
  Container,
  Badge,
  SimpleGrid,
  Alert,
  ActionIcon,
  Modal,
  NumberInput,
  useMantineTheme,
} from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import useMatchesMediaQuery from "../hooks/useMatchesMediaQuery";
import api from "../hooks/api.client";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { useProfile } from "../hooks/useProfile";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-pricing-table": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

function SubscriptionPage() {
  const theme = useMantineTheme();
  const isDark = theme.colorScheme === "dark";
  const user = useStoreState((state) => state.user);
  const { ltExtraSmall } = useMatchesMediaQuery();
  const { userRevalidate } = useProfile();
  useEffect(() => {
    userRevalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!user) return null;

  return (
    <div>
      <Container size="md" mb="lg" p={0}>
        <Title order={1} my="xl">
          Subscription
        </Title>
        {user.stripeSub && (
          <Box>
            <div>
              <Text size="lg" fw={500}>
                Billing information
              </Text>
              <Text c="dimmed" mb="md">
                Personal details for application
              </Text>
            </div>
            <SimpleGrid cols={1} breakpoints={[{ minWidth: "xs", cols: 2 }]}>
              <Box>
                <Text c="dimmed">Stripe Customer</Text>
                <Text>{user.stripeCustomerId}</Text>
              </Box>
              <Box>
                <Text c="dimmed">Stripe Subscription</Text>
                <Group align="center" spacing={5}>
                  <Text>{user.stripeSub.stripeSubId}</Text>
                  <Badge>{user.stripeSub.stripeSubStatus}</Badge>
                </Group>
              </Box>
              <Box>
                <Text c="dimmed">Plan</Text>
                <Text>{user.stripeSub.stripeSubProductName}</Text>
              </Box>
              <Box>
                <Group noWrap align="center" spacing={5}>
                  <Text c="dimmed">Member limit</Text>
                  <AppUpdateMemberLimitModal
                    quantity={user.stripeSub.stripeSubQuantity}
                  />
                </Group>
                <Text>{user.stripeSub.stripeSubQuantity}</Text>
              </Box>
              <Box>
                <Text c="dimmed">Email Address</Text>
                <Text>{user.email}</Text>
              </Box>
            </SimpleGrid>
            <Button
              mt="sm"
              variant="default"
              fullWidth={ltExtraSmall}
              component="a"
              href="/api/stripe/billing"
            >
              Manage subscription
            </Button>
          </Box>
        )}
      </Container>

      {!user.stripeSub && (
        <div>
          <Container size="md" mb="md">
            <Alert
              variant="outline"
              title="It can take a few minutes before your subscriptions is shown"
            >
              <Text>
                If you already got a subscription, you can refresh this page
                until your subscription is shown.
              </Text>
              {process.browser && (
                <Button
                  variant="default"
                  component="a"
                  href={window.location.href}
                  mt="sm"
                >
                  Refresh
                </Button>
              )}
            </Alert>
          </Container>
          {isDark ? (
            <stripe-pricing-table
              pricing-table-id="prctbl_1N7TYABQSgJN6JQglw4mYIe1"
              publishable-key="pk_test_51N7PnyBQSgJN6JQgSYvB88KSyjpiOnfjju3PjWCp6gYw1YM1Z87vvdN1AR2YVAg3Qouyoej1BhYAfEF4c7JEUx4D00WBndmp8O"
              client-reference-id={user.id}
              customer-email={user.email}
            ></stripe-pricing-table>
            
            ) : (
            <stripe-pricing-table
              pricing-table-id="prctbl_1N9Au6BQSgJN6JQg7IRaTUx9"
              publishable-key="pk_test_51N7PnyBQSgJN6JQgSYvB88KSyjpiOnfjju3PjWCp6gYw1YM1Z87vvdN1AR2YVAg3Qouyoej1BhYAfEF4c7JEUx4D00WBndmp8O"
              client-reference-id={user.id}
              customer-email={user.email}
            ></stripe-pricing-table>

          )}
        </div>
      )}
    </div>
  );
}

function AppUpdateMemberLimitModal({ quantity }: { quantity: number }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [newQuantity, setNewQuantity] = useState<number | "">(quantity);
  const [loadingQuantity, setLoadingQuantity] = useState(false);

  async function submitIncreaseQuality(e: any) {
    e.preventDefault();
    setLoadingQuantity(true);
    try {
      await api
        .post("/api/stripe/quantity", { quantity: newQuantity })
        .then((res) => res.data);
      close();
      showNotification({
        color: "yellow",
        title: "Limit updated",
        message:
          "It can take a few minutes for the changes to show. Refresh the page",
        autoClose: false,
      });
    } catch (err) {
      const error = err as any;
      if (error.response.status === 400) {
        if (error.response.data.error) {
          showNotification({
            color: "red",
            title: "Quantity exceeds your plan limit",
            message: error.response.data.error,
          });
          return;
        }
      }
      showNotification({
        color: "red",
        title: "Please try again later",
        message: "There was an error updating  member limit",
      });
    } finally {
      setLoadingQuantity(false);
    }
  }
  return (
    <>
      <ActionIcon
        variant="default"
        size="sm"
        title="Edit member limit"
        onClick={() => open()}
        loading={loadingQuantity}
      >
        <IconEdit size={14} />
      </ActionIcon>

      <Modal opened={opened} onClose={close} title="Edit member limit">
        <form onSubmit={submitIncreaseQuality}>
          <NumberInput
            min={1}
            defaultValue={quantity}
            value={newQuantity}
            onChange={setNewQuantity}
          />
          <Group mt="sm" position="right">
            <Button
              type="submit"
              disabled={newQuantity === quantity}
              loading={loadingQuantity}
            >
              Submit
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
}

export default SubscriptionPage;
