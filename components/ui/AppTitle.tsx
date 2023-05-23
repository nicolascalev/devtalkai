import { Title, TitleProps, useMantineTheme } from "@mantine/core";
import React from "react";
import useMatchesMediaQuery from "../../hooks/useMatchesMediaQuery";

function AppTitle(props: TitleProps) {
  const theme = useMantineTheme();
  const { ltExtraSmall } = useMatchesMediaQuery();

  return (
    <Title size={ltExtraSmall ? theme.fontSizes.xl : undefined} {...props}>
      {props.children}
    </Title>
  );
}

export default AppTitle;
