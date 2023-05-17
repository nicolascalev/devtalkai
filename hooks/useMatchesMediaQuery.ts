import { useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export default function useMatchesMediaQuery() {
  const theme = useMantineTheme();
  const ltExtraSmall = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);

  return {
    ltExtraSmall,
  }
}