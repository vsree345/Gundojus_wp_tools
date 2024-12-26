import React, { useState } from "react";
import theme from "theme";
import { Theme, Text, Section, Input, Box, Button } from "@quarkly/widgets";
import { Helmet } from "react-helmet";
import { GlobalQuarklyPageStyles } from "global-page-styles";
import { RawHtml, Override } from "@quarkly/components";
import { handleLogin } from "./firebaseConfig";
import { useHistory } from "react-router-dom";
import Footer from "./footer";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  const login = () => {
    handleLogin(email, password, setError, history);
  };

  return (
    <Theme theme={theme}>
      <GlobalQuarklyPageStyles pageUrl={"index"} />
      <Helmet>
        <title>Login</title>
        <link
          rel={"shortcut icon"}
          href={"https://i.imgur.com/crcVWqA.png"}
          type={"image/x-icon"}
        />
      </Helmet>
      <Section height="auto" background="--color-light" padding="0 0 0px 0">
        <Section padding="80px 0" sm-padding="40px 0">
          <Override slot="SectionContent" align-items="center" />
          <Text
            as="h2"
            font="--headline1"
            md-font="--headline2"
            margin="20px 0 0 0"
          >
            Gundoju's Website Tools
          </Text>
          <Text as="p" font="--lead" margin="0px 0 0px 0" text-align="center">
            Manager Login
          </Text>
        </Section>
      </Section>

      <Section
        background="--color-light"
        color="--dark"
        padding="0px 0 64px 0"
        text-align="left"
      >
        <Override
          slot="SectionContent"
          align-self="auto"
          display="flex"
          align-items="center"
        />
        <Box
          margin="16px 16px 16px 16px"
          display="inline-block"
          flex-wrap="wrap"
          overflow="visible"
          align-content="space-around"
          align-items="center"
          flex-direction="row"
          justify-content="center"
          align-self="center"
          text-align="left"
        >
          <Box width="100%" padding="8px 8px 8px 8px" lg-width="100%">
            <Box>
              <Box
                gap="16px"
                display="grid"
                flex-direction="row"
                flex-wrap="wrap"
                grid-gap="16px"
              >
                {/* Error Message */}
                {error && (
                  <Text color="red" text-align="center">
                    {error}
                  </Text>
                )}

                <Box
                  sm-width="100%"
                  display="flex"
                  flex-direction="column"
                  width="100%"
                  min-width="100%"
                >
                  <Text font="--base" margin="0 0 4px 0">
                    Email
                  </Text>
                  <Input
                    width="312px"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // Set email state
                    border-radius="7.5px"
                  />
                </Box>
                <br />
                <Box sm-width="100%" display="flex" flex-direction="column">
                  <Text font="--base" margin="0 0 4px 0">
                    Password
                  </Text>
                  <Input
                    width="100%"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // Set password state
                    border-radius="7.5px"
                  />
                </Box>

                <Box
                  display="flex"
                  flex-direction="column"
                  align-items="flex-start"
                  grid-column="1 / span 2"
                >
                  <Button onClick={login} border-radius="7.5px">
                    Login
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Section>

      <RawHtml>
        <style place={"endOfHead"} rawKey={"66f6d1359710450018a331b3"}>
          {
            ":root {\n  box-sizing: border-box;\n}\n\n* {\n  box-sizing: inherit;\n}"
          }
        </style>
      </RawHtml>
      <Footer />
    </Theme>
  );
}
