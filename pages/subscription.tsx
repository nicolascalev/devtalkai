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
import { IconEdit, IconInfoCircle } from "@tabler/icons-react";
import useMatchesMediaQuery from "../hooks/useMatchesMediaQuery";
import api from "../hooks/api.client";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { useProfile } from "../hooks/useProfile";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";

if (
  !process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID ||
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
) {
  throw new Error(
    "NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY env variables are required"
  );
}

export const getServerSideProps = withPageAuthRequired();
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
  const router = useRouter();
  if (!user) return null;

  if (!user) return null;
  if (!user.adminOf) {
    router.push("/403");
    return null;
  }

  return (
    <div style={{ paddingBottom: "50px" }}>
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
          <Container size="md" mb="md" p={0}>
            <Alert
              variant="light"
              color="gray"
              icon={<IconInfoCircle />}
              title="It can take a few minutes before your subscriptions is shown"
            >
              <Text>
                If you already got a subscription, you can refresh this page
                until your subscription is shown.
              </Text>
              <Group position="right" mt="sm">
                {process.browser && (
                  <Button
                    variant="default"
                    component="a"
                    href={window.location.href}
                  >
                    Refresh
                  </Button>
                )}
              </Group>
            </Alert>
          </Container>
          {isDark ? (
            <>
              <stripe-pricing-table
                pricing-table-id={
                  process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID
                }
                publishable-key={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
                client-reference-id={user.id}
                customer-email={user.email}
              ></stripe-pricing-table>
              {/* this is necesary because stripe table leaves a white line at the bottom */}
              <Box
                w="100%"
                h={10}
                bg={isDark ? "dark.7" : "gray.0"}
                style={{ marginTop: "-2px", position: "relative" }}
              ></Box>
            </>
          ) : (
            <stripe-pricing-table
              pricing-table-id={process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID}
              publishable-key={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
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
