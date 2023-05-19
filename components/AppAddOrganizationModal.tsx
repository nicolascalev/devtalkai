import {
  Button,
  Group,
  Modal,
  MultiSelect,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import React, { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import AppDomainLiteracySelect from "./AppDomainLiteracySelect";
import useMatchesMediaQuery from "../hooks/useMatchesMediaQuery";
import { joiResolver, useForm } from "@mantine/form";
import { organizationSchema } from "../types/joiSchemas";
import { showNotification } from "@mantine/notifications";
import api from "../hooks/api.client";
import { UserWithNestedProperties } from "../types/types";
import { useStoreActions } from "../store";
import { useRouter } from "next/router";

function AppAddOrganizationModal() {
  const router = useRouter();
  const setUser = useStoreActions((actions) => actions.setUser);
  const [opened, { open, close }] = useDisclosure(false);
  const { ltExtraSmall } = useMatchesMediaQuery();

  const form = useForm({
    validate: joiResolver(organizationSchema),
    initialValues: {
      name: "",
      about: "",
      trainingResourcesUrl: "",
      domainIndustry: "",
      domainLiteracy: "",
      roles: [],
    },
    validateInputOnChange: true,
  });

  const [roles, setRoles] = useState<{ value: string; label: string }[]>([]);

  const [loadingAddOrganization, setLoadingAddOrganization] = useState(false);
  async function onOrganizationSubmit(e: any) {
    e.preventDefault();
    if (form.validate().hasErrors) {
      showNotification({
        color: "red",
        message: "Your inputs have errors, please check and try again",
      });
    }
    setLoadingAddOrganization(true);
    try {
      await api.post("/api/organization", form.values);
      close();
      showNotification({
        title: "Organization added",
        message: "Now you can get a subscription",
      });
      const user: UserWithNestedProperties = await api
        .get("/api/profile/me")
        .then((res) => res.data);
      setUser(user);
      router.push("/subscription");
    } catch (err) {
      showNotification({
        color: "red",
        title: "Please try again later",
        message: "There was an error creating your organization",
      });
    } finally {
      setLoadingAddOrganization(false);
    }
  }

  return (
    <>
      <Button onClick={() => open()}>Add organization</Button>

      <Modal
        opened={opened}
        onClose={close}
        title="Add organization"
        fullScreen={ltExtraSmall}
        transitionProps={ltExtraSmall ? { transition: "slide-up" } : undefined}
      >
        <form onSubmit={onOrganizationSubmit}>
          <TextInput
            required
            name="Organization name"
            label="Organization name"
            placeholder="Organization name"
            {...form.getInputProps("name")}
          />
          <Textarea
            mt="sm"
            placeholder="Give a general idea"
            label="What does your organization do?"
            minRows={1}
            maxRows={5}
            autosize
            {...form.getInputProps("about")}
          />
          <TextInput
            mt="sm"
            name="Training resources link"
            label="Training resources link"
            description="Training reduces the communication gap in teams"
            placeholder="https://..."
            {...form.getInputProps("trainingResourcesUrl")}
          />
          <TextInput
            mt="sm"
            name="Domain / Industry"
            label="Domain / Industry"
            placeholder="Aerospace"
            description="Knowing the domain helps give more context"
            {...form.getInputProps("domainIndustry")}
          />
          <AppDomainLiteracySelect
            mt="xs"
            label="Domain literacy"
            {...form.getInputProps("domainLiteracy")}
            data={[
              {
                label: "Good",
                value: "Good",
                description:
                  "More than half of the organization knows a lot about the domain",
              },
              {
                label: "Medium",
                value: "Medium",
                description:
                  "Around half of the organization knows a lot about the domain",
              },
              {
                label: "Low",
                value: "Low",
                description:
                  "Less than half of the organization knows a lot about the domain",
              },
            ]}
          />
          <MultiSelect
            mt="xs"
            label="Roles"
            name="Roles"
            data={roles}
            {...form.getInputProps("roles")}
            placeholder="Web Developer, UX Developer..."
            description="Roles help you know what answers you can expect"
            searchable
            creatable
            getCreateLabel={(query) => `+ Create ${query}`}
            onCreate={(query) => {
              const item = { value: query, label: query };
              setRoles((current) => [...current, item]);
              return item;
            }}
          />
          <Group position="right" mt="sm">
            <Button type="submit" loading={loadingAddOrganization}>
              Create
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
}

export default AppAddOrganizationModal;
