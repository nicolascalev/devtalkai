import {
  Box,
  Button,
  Group,
  Modal,
  SegmentedControl,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { ReactElement, useEffect, useState } from "react";

interface AppPreferencesModalType {
  onPreferencesChange: (preferences: string[]) => void;
}

function AppPreferencesModal({ onPreferencesChange }: AppPreferencesModalType) {
  const [opened, { open, close }] = useDisclosure(false);
  const [voice, setVoice] = useState("Developer");
  const [mark, setMark] = useState("Issue");

  useEffect(() => {
    onPreferencesChange([voice, mark]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voice, mark]);

  return (
    <>
      <Button onClick={() => open()}>Preferences</Button>
      <Modal opened={opened} onClose={close} title="Output preferences">
        <Box>
          <Text size="sm" fw={500}>
            Voice
          </Text>
          <SegmentedControl
            value={voice}
            onChange={setVoice}
            data={[
              { label: "Developer", value: "Developer" },
              { label: "UX Designer", value: "UX Designer" },
              { label: "Non-Technical", value: "Non-Technical" },
            ]}
          />
        </Box>
        <Box mt="md">
          <Text size="sm" fw={500}>
            Mark as
          </Text>
          <SegmentedControl
            value={mark}
            onChange={setMark}
            data={[
              { label: "Issue", value: "Issue" },
              { label: "Feature", value: "Feature" },
              { label: "Process", value: "Process" },
              { label: "Default", value: "Default" },
            ]}
          />
        </Box>
        <Group position="right" mt="sm">
          <Button variant="default" onClick={() => close()}>
            Back
          </Button>
        </Group>
      </Modal>
    </>
  );
}

export default AppPreferencesModal;
