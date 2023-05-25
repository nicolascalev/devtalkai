import { Title, Text, TitleProps } from "@mantine/core";
import React from "react";
import useMatchesMediaQuery from "../../hooks/useMatchesMediaQuery";

function AppTitle(props: TitleProps) {
  const { ltExtraSmall } = useMatchesMediaQuery();

  if (ltExtraSmall) {
    return (
      <Text size="xl" fw={500} {...props}>
        {props.children}
      </Text>
    );
  } else {
    return <Title {...props}>{props.children}</Title>;
  }
}

export default AppTitle;
