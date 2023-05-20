import {
  Box,
  Button,
  Group,
  Modal,
  SegmentedControl,
  Select,
  SelectItem,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import { useStoreState } from "../store";
import useOrganizationProjects from "../hooks/useOrganizationProjects";

export type Preferences = {
  voice: string;
  mark: string;
  project?: { value: number; label: string };
};
interface AppPreferencesModalType {
  onPreferencesChange: (preferences: Preferences) => void;
}

function AppPreferencesModal({ onPreferencesChange }: AppPreferencesModalType) {
  const [opened, { open, close }] = useDisclosure(false);
  const user = useStoreState((state) => state.user);

  // load the organization projects
  const { projects, projectsLoading, projectsError } = useOrganizationProjects(
    user?.organizationId as number | undefined
  );
  // custom array for select
  const projectItems =
    projects?.map((pro) => ({
      value: pro.id.toString(),
      label: pro.label,
    })) || [];
  const [projectId, setProjectId] = useState<null | string>(null);
  // when load select the first one
  useEffect(() => {
    if (projects && projects[0]) {
      setProjectId(projects[0].id.toString());
    }
  }, [projects]);

  const currentRoles = (user?.organization?.roles as string[]) || [
    "Developer",
    "QA Engineer",
    "Designer",
    "Marketing Team",
  ];
  const fixedCurrentRoles = currentRoles.map((role: string) => ({
    value: role,
    label: role,
  }));
  const [roles, setRoles] =
    useState<{ value: string; label: string }[]>(fixedCurrentRoles);

  const [voice, setVoice] = useState<string>(currentRoles[0]);
  const [mark, setMark] = useState("Issue");

  useEffect(() => {
    const selectedProject = projectId
      ? projectItems.find((item) => item.value === projectId)
      : undefined;
    onPreferencesChange({
      voice,
      mark,
      project: selectedProject
        ? { value: Number(selectedProject.value), label: selectedProject.label }
        : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voice, mark, projectId]);

  return (
    <>
      <Button onClick={() => open()} loading={projectsLoading}>
        Preferences
      </Button>
      <Modal opened={opened} onClose={close} title="Output preferences">
        <Box>
          <Select
            label="Project"
            placeholder="Select a project"
            data={projectItems}
            value={projectId}
            onChange={setProjectId}
            searchable
            maxDropdownHeight={200}
            error={projectsError && "There was an error loading the projects"}
          />
        </Box>
        <Box mt="sm">
          <Select
            value={voice}
            onChange={(value: string) => setVoice(value)}
            dropdownPosition="bottom"
            maxDropdownHeight={200}
            label="Voice"
            placeholder="Select voice"
            data={roles}
            searchable
            creatable
            getCreateLabel={(query) => `+ Add ${query}`}
            onCreate={(query) => {
              const item = { value: query, label: query };
              setRoles((current) => [...current, item]);
              return item;
            }}
          />
        </Box>
        <Box mt="sm">
          <Text size="sm" fw={500}>
            Mark as
          </Text>
          <SegmentedControl
            fullWidth
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
        <Group position="right" mt={100}>
          <Button variant="default" onClick={() => close()}>
            Back
          </Button>
        </Group>
      </Modal>
    </>
  );
}

export default AppPreferencesModal;
