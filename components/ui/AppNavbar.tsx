import { Navbar, ScrollArea } from "@mantine/core";
import { AppLinks } from "./AppLinks";
import { AppUserButton } from "./AppUserButton";

function AppNavbar(props: any) {

  return (
    <Navbar
      hiddenBreakpoint="md"
      hidden={!props.opened}
      width={{ md: 300, lg: 300 }}
      p="xs"
      style={{ zIndex: 101 }}
      h="calc(100% - 60px)"
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
