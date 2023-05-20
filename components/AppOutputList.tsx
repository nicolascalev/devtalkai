import {
  Group,
  Card,
  Text,
  Alert,
} from "@mantine/core";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import React from "react";
import { ChatCompletionRequestMessage } from "openai/dist/api";
import AppOutputListAssistantItem from "./AppOutputListAssistantItem";

type AppOutputListProps = {
  items: ChatCompletionRequestMessage[];
};

function AppOutputList(props: AppOutputListProps) {
  const [parent] = useAutoAnimate();

  return (
    <div ref={parent}>
      <Group mb="sm">
        <Card maw="90%" miw="300px" withBorder bg="inherit">
          <Text size="md">
            Here I will give some instructions and stuff like that
          </Text>
        </Card>
      </Group>
      {props.items.map((item, i) => {
        if (item.role === "assistant") {
          return (
            <AppOutputListAssistantItem key={i} item={item} />
          );
        } else {
          return (
            <Group key={i} mb="sm" position="right">
              <Alert maw="90%" variant="light" color="gray">
                <Text size="md" style={{ whiteSpace: "pre-wrap" }}>
                  {item.content}
                </Text>
              </Alert>
            </Group>
          );
        }
      })}
    </div>
  );
}

export default AppOutputList;
