import { Button, Modal, TextInput } from "@mantine/core";
import React, { useState } from "react";
import useMatchesMediaQuery from "../hooks/useMatchesMediaQuery";
import { UserWithNestedProperties } from "../types/types";
import AppDomainLiteracySelect from "./AppDomainLiteracySelect";
import { joiResolver, useForm } from "@mantine/form";
import { profileSchema } from "../types/joiSchemas";
import { useProfile } from "../hooks/useProfile";
import { showNotification } from "@mantine/notifications";
import api from "../hooks/api.client";

type AppUpdateProfileProps = {
  opened: boolean;
  close: () => void;
  user: UserWithNestedProperties;
};

function AppUpdateProfile({ opened, close, user }: AppUpdateProfileProps) {
  const { ltExtraSmall } = useMatchesMediaQuery();
  const { userRevalidate } = useProfile();
  const form = useForm({
    validate: joiResolver(profileSchema),
    initialValues: {
      fullName: user.fullName,
      technicalProficiency: user.technicalProficiency,
      role: user.role,
    },
    validateInputOnChange: true,
  });

  const [loadingUpdateProfile, setLoadingUpdateProfile] = useState(false);
  async function onSubmitUpdateProfile(e: any) {
    e.preventDefault();
    if (form.validate().hasErrors) {
      showNotification({
        message: "Your form has errors",
        color: "red",
      });
      return;
    }
    if (!form.isDirty()) {
      showNotification({
        message: "You haven't made changes to your profile",
      });
      return;
    }
    setLoadingUpdateProfile(true);
    try {
      await api.patch("/api/profile", form.values);
      userRevalidate();
      showNotification({
        message: "Profile updated successfully",
      });
      close();
    } catch (err) {
      showNotification({
        title: "Please try again",
        message: "There was an error updating your profile",
        color: "red",
      });
    } finally {
      setLoadingUpdateProfile(false);
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={() => close()}
      title="Update profile"
      fullScreen={ltExtraSmall}
      transitionProps={ltExtraSmall ? { transition: "slide-up" } : undefined}
    >
      <form onSubmit={onSubmitUpdateProfile}>
        <TextInput
          label="Full name"
          name="Full Name"
          placeholder="John Doe"
          required
          mb="sm"
          {...form.getInputProps("fullName")}
        />
        <AppDomainLiteracySelect
          mb="sm"
          label="Technical Proficiency"
          name="Technical Proficiency"
          placeholder="Good"
          dropdownPosition="bottom"
          {...form.getInputProps("technicalProficiency")}
          data={[
            {
              label: "Good",
              value: "Good",
              description: "You know most of the vocabulary needed",
            },
            {
              label: "Medium",
              value: "Medium",
              description: "You know some of the vocabulary needed",
            },
            {
              label: "Low",
              value: "Low",
              description: "You know little about the vocabulary needed",
            },
          ]}
        />
        <TextInput
          label="Role"
          name="Role"
          placeholder="e.g Developer"
          {...form.getInputProps("role")}
          mb={ltExtraSmall ? "md" : 80}
        />
        <Button type="submit" fullWidth loading={loadingUpdateProfile}>
          Update profile
        </Button>
      </form>
    </Modal>
  );
}

export default AppUpdateProfile;
