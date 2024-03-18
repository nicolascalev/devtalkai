import { Badge, Button, Card, Center, Group, Text } from "@mantine/core";
import Link from "next/link";

type AppErrorProps = {
  status: number;
  label: string;
  message: string;
  redirectUrl: string;
  redirectButtonLabel: string;
};

function AppError(props: AppErrorProps) {
  return (
    <Center mih="calc(100dvh - 100px)">
      <Card withBorder w="full" maw={450}>
        <Badge variant="dot" color="red">
          {props.status}
        </Badge>
        <Text mt="md">{props.label}</Text>
        <Text c="dimmed" size="sm">
          {props.message}
        </Text>
        <Group w="100%" mt="md" position="right">
          <Button component={Link} href={props.redirectUrl} variant="default">
            {props.redirectButtonLabel}
          </Button>
        </Group>
      </Card>
    </Center>
  );
}

export default AppError;
