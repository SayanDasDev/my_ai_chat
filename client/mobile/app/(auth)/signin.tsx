import { Link } from "expo-router";
import { useState } from "react";
import {
  Anchor,
  Button,
  Form,
  H2,
  Input,
  Label,
  Paragraph,
  XStack,
  YStack,
} from "tamagui";

export default function TabOneScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    // Handle sign-in logic here
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <YStack flex={1} items="center" gap="$8" px="$10" pt="$5" bg="$background">
      <H2>Sign In</H2>

      <Form onSubmit={handleSignIn} width="100%">
        <YStack gap="$4">
          <YStack>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </YStack>

          <YStack>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              autoCapitalize="none"
            />
          </YStack>

          <Button onPress={handleSignIn}>Sign In</Button>
        </YStack>
      </Form>

      <XStack
        items="center"
        justify="center"
        flexWrap="wrap"
        gap="$1.5"
        position="absolute"
        b="$8"
      >
        <Paragraph fontSize="$5">Don't have an account?</Paragraph>
        <Link href="/signup" asChild>
          <Anchor fontSize="$5" color="$blue10">
            Sign Up
          </Anchor>
        </Link>
      </XStack>
    </YStack>
  );
}
