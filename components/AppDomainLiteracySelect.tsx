import { forwardRef } from "react";
import { Text, Select } from "@mantine/core";

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  label: string;
  description: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(function SelectItem(
  { label, description, ...others }: ItemProps,
  ref
) {
  return (
    <div ref={ref} {...others}>
      <Text size="sm">{label}</Text>
      <Text size="xs" opacity={0.80}>
        {description}
      </Text>
    </div>
  );
});

export default function AppDomainLiteracySelect(props: any) {
  return (
    <Select
      label="Domain Literacy"
      name="Domain Literacy"
      description="Familiarity in general with technical vocabulary in the organization"
      placeholder="Good"
      itemComponent={SelectItem}
      maxDropdownHeight={400}
      filter={(value, item) =>
        item.label!.toLowerCase().includes(value.toLowerCase().trim()) ||
        item.description.toLowerCase().includes(value.toLowerCase().trim())
      }
      {...props}
    />
  );
}
