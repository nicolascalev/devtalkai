import { Center, Box, Text, Group, Button } from "@mantine/core";
import { IconMoodSad } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

function SubscriptionCancelPage() {
  return (
    <Center h="calc(100% - 60px)">
      <Box maw="500px" ta="center">
        <Group position="center" c="red">
          <IconMoodSad size={48} />
        </Group>
        <Text size="xl" fw={500} py="xs">
          We are sorry to see you leave
        </Text>
        <Text c="dimmed">
          Your account will be active until the last payment period
        </Text>
        <Group position="center" mt="xs">
          <Link href="/subscription" passHref>
            <Button variant="default" component="a">
              See subscription
            </Button>
          </Link>
        </Group>
      </Box>
    </Center>
  );
}

export default SubscriptionCancelPage;
