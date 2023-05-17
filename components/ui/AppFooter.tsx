import {
  Anchor,
  Container,
  Footer,
  Group,
  Image,
  Text,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const SHOW_FOOTER_URLS = ["/"];

function AppFooter() {
  // const router = useRouter();

  // const theme = useMantineTheme();
  // const isDark = theme.colorScheme === "dark";

  return null;

  return (
    <Footer
      hidden={!SHOW_FOOTER_URLS.includes(router.pathname)}
      height="auto"
      py="xl"
      px="md"
      style={{
        position: "relative",
        marginLeft: "var(--mantine-navbar-width)",
        width: "calc(100vw - 18px - var(--mantine-navbar-width))",
      }}
    >
      <Container size="lg" p={0}>
        <Group position="apart" align="top">
          <Link href="/" passHref>
            <Anchor underline={false} c="inherit" miw={200}>
              <Group align="center" spacing="xs">
                <Image
                  radius={0}
                  src="/favicon.svg"
                  height="25px"
                  width="25px"
                  alt="Inkker logo"
                />
                <Text fw={600} size="lg" c={isDark ? "white" : "dark"}>
                  devtalk ai
                </Text>
              </Group>
            </Anchor>
          </Link>
          <div>
            <Group spacing="xl" align="top">
              <div>
                <Text fw="500">Contact</Text>
                <Anchor
                  c="dimmed"
                  href="mailto:hello@inkker.com"
                  display="block"
                >
                  hello@inkker.com
                </Anchor>
                <Anchor c="dimmed" href="tel:+14702359990" display="block">
                  +1 (470) 235-9990
                </Anchor>
              </div>
              <div>
                <Text fw="500">Legal</Text>
                <Anchor
                  c="dimmed"
                  href="/privacy-policy.pdf"
                  target="_blank"
                  display="block"
                >
                  Privacy Policy
                </Anchor>
                <Anchor
                  c="dimmed"
                  href="/terms-conditions.pdf"
                  target="_blank"
                  display="block"
                >
                  Terms and Conditions
                </Anchor>
              </div>
              <div>
                <Text fw="500">Socials</Text>
                <Anchor
                  c="dimmed"
                  href="https://blog.inkker.com"
                  target="_blank"
                  display="block"
                >
                  Blog
                </Anchor>
                <Anchor
                  c="dimmed"
                  href="https://instagram.com/useinkker"
                  target="_blank"
                  display="block"
                >
                  Instagram
                </Anchor>
                <Anchor
                  c="dimmed"
                  href="https://twitter.com/useinkker"
                  target="_blank"
                  display="block"
                >
                  Twitter
                </Anchor>
              </div>
            </Group>
          </div>
        </Group>
        <Group position="apart" mt="md">
          <Text c="dimmed">
            Copyright © {new Date().getFullYear()} Inkker. All rights reserved.
          </Text>
        </Group>
      </Container>
    </Footer>
  );
}

export default AppFooter;
