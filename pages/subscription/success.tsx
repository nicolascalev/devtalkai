import { Center, Box, Text, Group, Button } from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

function SubscriptionSuccessPage() {
  return (
    <Center h="calc(100% - 60px)">
      <Box maw="500px" ta="center">
        <Group position="center" c="teal">
          <IconCircleCheck size={48} />
        </Group>
        <Text size="xl" fw={500} py="xs">
          Thanks for subscribing
        </Text>
        <Text c="dimmed">
          A payment from Devtalk AI will show on your statement.
        </Text>
        <Group position="center" mt="xs">
          <Button variant="default" component={Link} href="/subscription">
            See subscription
          </Button>
        </Group>
      </Box>
    </Center>
  );
}

export default SubscriptionSuccessPage;
