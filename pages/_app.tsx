import "../styles/globals.css";
import { AppProps } from "next/app";
import Head from "next/head";
import {
  AppShell,
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AppRouterTransition } from "../components/ui/AppRouterTransition";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import AppNavbar from "../components/ui/AppNavbar";
import AppHeader from "../components/ui/AppHeader";
import { StoreProvider, useStoreRehydrated } from "easy-peasy";
import store from "../store";
import AppUserLoading from "../components/ui/AppUserLoading";
import Script from "next/script";

function WaitForStateRehydration({ children }: any) {
  const isRehydrated = useStoreRehydrated();
  return isRehydrated ? children : null;
}

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) => {
    const theme = value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(theme);
    localStorage.setItem("color-scheme", theme);
  };
  useEffect(() => {
    const storedTheme = localStorage.getItem(
      "color-scheme"
    ) as ColorScheme | null;
    if (storedTheme) {
      const parsedTheme: ColorScheme = storedTheme;
      setColorScheme(parsedTheme);
    } else {
      localStorage.setItem("color-scheme", "light");
    }
  }, []);
  const isDark = colorScheme === "dark";

  const router = useRouter();
  const [opened, setOpened] = useState(false);
  useEffect(() => {
    setOpened(false);
  }, [router.asPath]);

  return (
    <>
      <Head>
        <title>devtalk ai</title>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <Script async src="https://js.stripe.com/v3/pricing-table.js" />

      <StoreProvider store={store}>
        <WaitForStateRehydration>
          <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
          >
            <MantineProvider
              withGlobalStyles
              withNormalizeCSS
              theme={{
                colorScheme: colorScheme,
                primaryShade: 7,
                colors: {
                  brand: [
                    "#d6fe9a",
                    "#cefe85",
                    "#c6fe72",
                    "#bdfd5d",
                    "#adfd35",
                    "#9dfd0d",
                    "#92f202",
                    "#86de02",
                    "#7aca02",
                    "#6eb602",
                  ],
                },
                primaryColor: "lime",
                fontFamily:
                  "Inter, -apple-system, BlinkMacSystemFont, sans-serif !important",
              }}
            >
              <UserProvider>
                <AppRouterTransition />
                <ModalsProvider>
                  <Notifications position="bottom-center" />
                  <AppShell
                    padding="md"
                    navbar={<AppNavbar opened={opened} />}
                    header={
                      <AppHeader
                        opened={opened}
                        setOpened={setOpened}
                        colorScheme={colorScheme}
                        toggleColorScheme={toggleColorScheme}
                      />
                    }
                    styles={{
                      main: {
                        position: "relative",
                      },
                    }}
                  >
                    <AppUserLoading>
                      <Component {...pageProps} />
                    </AppUserLoading>
                  </AppShell>
                </ModalsProvider>
              </UserProvider>
            </MantineProvider>
          </ColorSchemeProvider>
        </WaitForStateRehydration>
      </StoreProvider>
    </>
  );
}
