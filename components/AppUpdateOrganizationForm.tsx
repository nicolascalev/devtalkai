import { Button, Group, MultiSelect, TextInput, Textarea } from "@mantine/core";
import React, { useState } from "react";
import AppDomainLiteracySelect from "./AppDomainLiteracySelect";
import { joiResolver, useForm } from "@mantine/form";
import { organizationSchema } from "../types/joiSchemas";
import { useProfile } from "../hooks/useProfile";
import { showNotification } from "@mantine/notifications";
import api from "../hooks/api.client";
import { Organization } from "@prisma/client";

type AppUpdateOrganizationForm = {
  organization: Organization | null;
};

function AppUpdateOrganizationForm({
  organization,
}: AppUpdateOrganizationForm) {
  const { userRevalidate } = useProfile();

  const currentRoles = organization
    ? JSON.parse(organization.roles as string)
    : [];

  const form = useForm({
    validate: joiResolver(organizationSchema),
    initialValues: {
      name: organization?.name,
      about: organization?.about,
      trainingResourcesUrl: organization?.trainingResourcesUrl,
      domainIndustry: organization?.domainIndustry,
      domainLiteracy: organization?.domainLiteracy,
      roles: currentRoles,
    },
    validateInputOnChange: true,
  });

  const fixedCurrentRoles = currentRoles.map((role: string) => ({
    value: role,
    label: role,
  }));

  const [roles, setRoles] =
    useState<{ value: string; label: string }[]>(fixedCurrentRoles);

  const [loadingUpdateOrganization, setLoadingUpdateOrganization] =
    useState(false);
  async function onOrganizationSubmit(e: any) {
    e.preventDefault();
    if (!form.isDirty()) {
      showNotification({
        message: "You haven't made changes to the organization",
        color: "yellow",
      })
      return
    }
    if (form.validate().hasErrors) {
      showNotification({
        color: "red",
        message: "Your inputs have errors, please check and try again",
      });
    }
    setLoadingUpdateOrganization(true);
    try {
      await api.patch("/api/organization/" + organization?.id, form.values);
      userRevalidate();
      close();
      showNotification({
        message: "Organization updated",
      });
    } catch (err) {
      showNotification({
        color: "red",
        title: "Please try again later",
        message: "There was an error updating your organization",
      });
    } finally {
      setLoadingUpdateOrganization(false);
    }
  }

  if (!organization) return null;

  return (
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
        <Button type="submit" loading={loadingUpdateOrganization}>
          Update
        </Button>
      </Group>
    </form>
  );
}

export default AppUpdateOrganizationForm;
