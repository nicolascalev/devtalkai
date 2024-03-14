import {
  Box,
  Button,
  Group,
  SegmentedControl,
  Select,
  SelectItem,
  Stack,
  Text,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import api from "../hooks/api.client";
import useOrganizationProjects from "../hooks/useOrganizationProjects";
import { useStoreActions, useStoreState } from "../store";

export type Preferences = {
  voice: string;
  mark: string;
  project?: { value: number; label: string };
};

function AppPreferencesModal() {
  const user = useStoreState((state) => state.user);
  const storeVoice = useStoreState((state) => state.voice);
  const storeMark = useStoreState((state) => state.mark);
  const storeProjectId = useStoreState((state) => state.projectId);

  // load the organization projects
  const { projects, projectsLoading, projectsError } = useOrganizationProjects(
    user?.organizationId as number | undefined
  );
  // custom array for select
  const [projectItems, setProjectItems] = useState<SelectItem[]>([]);
  useEffect(() => {
    if (projects) {
      setProjectItems(
        projects.map((pro) => ({
          value: pro.id.toString(),
          label: pro.label,
        }))
      );
    }
  }, [projects]);

  const [projectId, setProjectId] = useState<null | string>(
    storeProjectId || null
  );

  // use organization roles for voice or add your own
  const organizationRoles = user?.organization?.roles as string[];
  const currentRoles =
    organizationRoles.length === 0
      ? [
          "Developer",
          "QA Engineer",
          "Designer",
          "Marketing",
          "Sales",
          "Product Design",
        ]
      : organizationRoles;
  const fixedCurrentRoles = currentRoles.map((role: string) => ({
    value: role,
    label: role,
  }));
  const [roles, setRoles] =
    useState<{ value: string; label: string }[]>(fixedCurrentRoles);

  const [voice, setVoice] = useState<string>(currentRoles[0]);
  const [mark, setMark] = useState("Issue");

  // store preferences in store
  const storeSetVoice = useStoreActions((actions) => actions.setVoice);
  const storeSetMark = useStoreActions((actions) => actions.setMark);
  const storeSetProjectId = useStoreActions((actions) => actions.setProjectId);
  const storeSetHistory = useStoreActions((actions) => actions.setHistory);

  const [loading, setLoading] = useState(false);
  async function startNewChat() {
    if (!projectId || !mark || !voice) {
      showNotification({
        title: "Select all required fields",
        message: "Please select a project, voice and mark",
        color: "red",
      });
      return;
    }
    setLoading(true);
    try {
      const project = await api
        .get(`/project/${projectId}`)
        .then((res) => res.data);
      storeSetHistory([
        {
          role: "assistant",
          content: `I am an AI assistant that explains technical topics to non-technical people. My tone for this project is set to ${voice}. I have to explain an item marked as ${mark}. The json object for the project is ${JSON.stringify(
            project
          )}. You can ask me anything like security considerations, UX, and more and I will explain it in the selected tone`,
        },
      ]);
      storeSetVoice(voice);
      storeSetMark(mark);
      storeSetProjectId(projectId);
    } catch (err) {
      showNotification({
        title: "Error, please try again later",
        message: "There was an error starting the chat",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }

  // when component is mounted set the preferences from the store
  useEffect(() => {
    setVoice(storeVoice);
    setMark(storeMark || "Default");
    setProjectId(storeProjectId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getProjectsError(): string {
    if (projectsError) {
      return "There was an error loading the projects";
    }
    if (projects && projects.length === 0) {
      return "You need to add a project Organization > Add Project";
    }
    return "";
  }

  return (
    <>
      <Stack>
        <Text fw={500}>Start new chat</Text>
        <Select
          label="Project"
          placeholder="Select a project"
          data={projectItems}
          value={projectId}
          onChange={setProjectId}
          searchable
          clearable
          maxDropdownHeight={200}
          error={getProjectsError()}
        />
        <Select
          value={voice}
          onChange={(value: string) => setVoice(value)}
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
        <Box>
          <Text size="sm">Mark as</Text>
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
        <Group position="right">
          <Button
            variant="light"
            onClick={() => startNewChat()}
            loading={loading}
          >
            Start
          </Button>
        </Group>
      </Stack>
    </>
  );
}

export default AppPreferencesModal;
