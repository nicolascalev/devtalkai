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
import React, { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import useMatchesMediaQuery from "../hooks/useMatchesMediaQuery";
import { joiResolver, useForm } from "@mantine/form";
import { projectSchema } from "../types/joiSchemas";
import { showNotification } from "@mantine/notifications";
import api from "../hooks/api.client";

type SelectItemType = { value: string; label: string };

type AppAddProjectModalProps = {
  onProjectAdded: () => void;
  buttonProps?: ButtonProps;
};

function AppAddProjectModal({
  onProjectAdded,
  buttonProps,
}: AppAddProjectModalProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const { ltExtraSmall } = useMatchesMediaQuery();

  const form = useForm({
    validate: joiResolver(projectSchema),
    initialValues: {
      label: "",
      description: "",
      objectives: [],
      technicalStack: [],
      timeConstraints: "",
      integrations: [],
      securityConsiderations: [],
      documentationLink: "",
    },
    validateInputOnChange: true,
  });

  const [objectives, setObjectives] = useState<SelectItemType[]>([]);
  const [technicalStack, setTechnicalStack] = useState<SelectItemType[]>([]);
  const [integrations, setIntegrations] = useState<SelectItemType[]>([]);
  const [securityConsiderations, setSecurityConsiderations] = useState<
    SelectItemType[]
  >([]);
  const [timeConstraints, setTimeConstraints] = useState(["uno", "fod"]);

  const [loadingAddProject, setLoadingAddProject] = useState(false);
  async function onOrganizationSubmit(e: any) {
    e.preventDefault();
    if (form.validate().hasErrors) {
      showNotification({
        color: "red",
        message: "Your inputs have errors, please check and try again",
      });
    }
    setLoadingAddProject(true);
    try {
      await api.post("/api/project", form.values);
      close();
      showNotification({
        title: "Organization added",
        message: "Now you can get a subscription",
      });
      form.reset();
      onProjectAdded();
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
        message: "There was an error creating your organization",
      });
    } finally {
      setLoadingAddProject(false);
    }
  }

  return (
    <>
      <Button {...buttonProps} onClick={() => open()}>
        Add
      </Button>

      <Modal
        opened={opened}
        onClose={close}
        title="Add project"
        fullScreen={ltExtraSmall}
        transitionProps={ltExtraSmall ? { transition: "slide-up" } : undefined}
        scrollAreaComponent={ScrollArea.Autosize}
      >
        <form onSubmit={onOrganizationSubmit}>
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
            placeholder="Pick one"
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
            <Button type="submit" loading={loadingAddProject}>
              Add project
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
}

export default AppAddProjectModal;
