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

export default function SignUpScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    // Handle sign-up logic here
    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <YStack flex={1} items="center" gap="$8" px="$10" pt="$5" bg="$background">
      <H2>Sign Up</H2>

      <Form onSubmit={handleSignUp} width="100%">
        <YStack gap="$4">
          <YStack>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your username"
              autoCapitalize="none"
            />
          </YStack>

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

          <Button onPress={handleSignUp}>Sign Up</Button>
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
        <Paragraph fontSize="$5">Already have an account?</Paragraph>
        <Link href="/signin" asChild>
          <Anchor fontSize="$5" color="$blue10">
            Sign In
          </Anchor>
        </Link>
      </XStack>
    </YStack>
  );
}
