import {
  Button,
  Group,
  Modal,
  MultiSelect,
  ScrollArea,
  Select,
  Text,
  TextInput,
  Textarea,
  ButtonProps,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import useMatchesMediaQuery from "../hooks/useMatchesMediaQuery";
import { joiResolver, useForm } from "@mantine/form";
import { projectSchema } from "../types/joiSchemas";
import { showNotification } from "@mantine/notifications";
import api from "../hooks/api.client";
import { IconEdit } from "@tabler/icons-react";
import { Project } from "@prisma/client";

type SelectItemType = { value: string; label: string };

type AppAddProjectModalProps = {
  onProjectUpdated: () => void;
  project: Project;
  buttonProps?: ButtonProps;
};

function getSelectItem(list: string[]): SelectItemType[] {
  return list.map((item) => ({ label: item, value: item }));
}

function AppEditProjectModal({
  onProjectUpdated,
  project,
  buttonProps,
}: AppAddProjectModalProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const { ltExtraSmall } = useMatchesMediaQuery();

  const currentObjectives = (project.objectives as string[]) || [];
  const currentTechnicalStack = (project.technicalStack as string[]) || [];
  const currentIntegrations = (project.integrations as string[]) || [];
  const currentSecurityConsiderations =
    (project.securityConsiderations as string[]) || [];

  const form = useForm({
    validate: joiResolver(projectSchema),
    initialValues: {
      label: project.label,
      description: project.description,
      objectives: currentObjectives,
      technicalStack: currentTechnicalStack,
      timeConstraints: project.timeConstraints,
      integrations: currentIntegrations,
      securityConsiderations: currentSecurityConsiderations,
      documentationLink: project.documentationLink,
    },
    validateInputOnChange: true,
  });

  const [objectives, setObjectives] = useState<SelectItemType[]>(
    getSelectItem(currentObjectives)
  );
  const [technicalStack, setTechnicalStack] = useState<SelectItemType[]>(
    getSelectItem(currentTechnicalStack)
  );
  const [integrations, setIntegrations] = useState<SelectItemType[]>(
    getSelectItem(currentIntegrations)
  );
  const [securityConsiderations, setSecurityConsiderations] = useState<
    SelectItemType[]
  >(getSelectItem(currentSecurityConsiderations));
  const [timeConstraints, setTimeConstraints] = useState([
    "Under 1 week",
    "1 - 2 weeks",
    "2 - 4 weeks",
    "4+ weeks",
  ]);

  // if current time constraint is not in option list, add it.
  useEffect(() => {
    if (project.timeConstraints) {
      if (!timeConstraints.includes(project.timeConstraints)) {
        setTimeConstraints((prev) =>
          Array.from(new Set([project.timeConstraints as string, ...prev]))
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [loadingUpdateProject, setLoadingUpdateProject] = useState(false);
  async function onProjectUpdate(e: any) {
    e.preventDefault();
    if (!form.isDirty()) {
      showNotification({
        message: "You haven't made changes to the project",
        color: "yellow",
      });
      return;
    }
    if (form.validate().hasErrors) {
      showNotification({
        color: "red",
        message: "Your inputs have errors, please check and try again",
      });
    }
    setLoadingUpdateProject(true);
    try {
      await api.patch("/api/project/" + project.id, form.values);
      close();
      showNotification({
        title: "Project updated",
        message: "Your project was updated successfully",
      });
      onProjectUpdated();
    } catch (err) {
      const error: any = err;
      if (error.response.data) {
        showNotification({
          color: "red",
          message: error.response.data,
        });
        return;
      }
      showNotification({
        color: "red",
        title: "Please try again later",
        message: "There was an error updating your project",
      });
    } finally {
      setLoadingUpdateProject(false);
    }
  }

  return (
    <>
      <Button
        variant="default"
        rightIcon={<IconEdit size={16} />}
        {...buttonProps}
        onClick={() => open()}
      >
        Edit
      </Button>

      <Modal
        opened={opened}
        onClose={close}
        title="Update project"
        fullScreen={ltExtraSmall}
        transitionProps={ltExtraSmall ? { transition: "slide-up" } : undefined}
        scrollAreaComponent={ScrollArea.Autosize}
      >
        <form onSubmit={onProjectUpdate}>
          <TextInput
            required
            name="Project label"
            label="Project label"
            placeholder="Project label"
            {...form.getInputProps("label")}
          />
          <Textarea
            mt="sm"
            required
            placeholder="Give a general description..."
            label="Description"
            minRows={1}
            maxRows={5}
            autosize
            {...form.getInputProps("description")}
          />
          <TextInput
            mt="sm"
            name="Documentation link"
            label="Documentation link"
            placeholder="https://..."
            {...form.getInputProps("documentationLink")}
          />
          <MultiSelect
            mt="xs"
            label="Objectives"
            name="Objectives"
            data={objectives}
            {...form.getInputProps("objectives")}
            placeholder="Create user, redirect to dashboard..."
            description="Type the desired behavior or effects"
            searchable
            creatable
            getCreateLabel={(query) => `+ Add ${query}`}
            onCreate={(query) => {
              const item = { value: query, label: query };
              setObjectives((current) => [...current, item]);
              return item;
            }}
          />
          <MultiSelect
            mt="xs"
            label="Technical stack"
            name="Technical stack"
            data={technicalStack}
            {...form.getInputProps("technicalStack")}
            placeholder="Vercel, Next js, Prisma..."
            searchable
            creatable
            getCreateLabel={(query) => `+ Add ${query}`}
            onCreate={(query) => {
              const item = { value: query, label: query };
              setTechnicalStack((current) => [...current, item]);
              return item;
            }}
          />
          <MultiSelect
            mt="xs"
            label="Integrations"
            name="Integrations"
            data={integrations}
            {...form.getInputProps("integrations")}
            placeholder="GitHub Actions, Slack..."
            searchable
            creatable
            getCreateLabel={(query) => `+ Add ${query}`}
            onCreate={(query) => {
              const item = { value: query, label: query };
              setIntegrations((current) => [...current, item]);
              return item;
            }}
          />
          <MultiSelect
            mt="xs"
            label="Security considerations"
            name="Security considerations"
            data={securityConsiderations}
            {...form.getInputProps("securityConsiderations")}
            placeholder="https only, cors config..."
            searchable
            creatable
            getCreateLabel={(query) => `+ Add ${query}`}
            onCreate={(query) => {
              const item = { value: query, label: query };
              setSecurityConsiderations((current) => [...current, item]);
              return item;
            }}
          />
          <Select
            mt="xs"
            label="Time constraints"
            placeholder="Pick or add one"
            searchable
            clearable
            creatable
            data={timeConstraints}
            getCreateLabel={(query) => `+ Add ${query}`}
            onCreate={(query) => {
              setTimeConstraints((current) => [...current, query]);
              return query;
            }}
            {...form.getInputProps("timeConstraints")}
          />
          <Group position="right" mt="sm">
            <Button type="submit" loading={loadingUpdateProject}>
              Update project
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
}

export default AppEditProjectModal;
