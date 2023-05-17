import { Navbar, ScrollArea, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
// import { useStoreState } from "../store";
import { AppLinks } from "./AppLinks";
import { AppUserButton } from "./AppUserButton";

function AppNavbar(props: any) {
  const theme = useMantineTheme();
  const matchesLargeScreen = useMediaQuery(
    `(min-width: ${theme.breakpoints.md}px)`
  );

  const [show, setShow] = useState(true);
  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <Navbar
      hiddenBreakpoint="md"
      hidden={!props.opened}
      width={{ md: 300, lg: 300 }}
      p="xs"
      style={{ zIndex: 101 }}
    >
      <Navbar.Section grow component={ScrollArea} mr="-xs">
        <AppLinks />
      </Navbar.Section>
      <Navbar.Section>
        <AppUserButton></AppUserButton>
      </Navbar.Section>
    </Navbar>
  );
}

export default AppNavbar;
