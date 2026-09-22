import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { PressableScale } from "../components/PressableScale";
import { useAuth } from "../context/AuthProvider";
import { errorFeedback, selectionFeedback } from "../design/haptics";
import { color, radius, shadowRaised, space, type } from "../design/tokens";
import { ApiError } from "../lib/api";

type Mode = "signIn" | "signUp";

function Field({
  label,
  error,
  ...props
}: React.ComponentProps<typeof TextInput> & { label: string; error?: string }) {
  // A visible focus ring is the difference between a form that feels native and
  // one that feels like a web page in a shell.
  const [focused, setFocused] = useState(false);

  const borderColor = error ? color.destructive : focused ? color.brand : color.border;

  return (
    <View style={{ gap: space.sm }}>
      <Text style={{ ...type.meta, color: color.secondaryLabel }}>{label}</Text>
      <TextInput
        placeholderTextColor={color.tertiaryLabel}
        selectionColor={color.brand}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...type.body,
          color: color.label,
          backgroundColor: color.card,
          borderWidth: focused || error ? 1.5 : 1,
          borderColor,
          borderRadius: radius.md,
          paddingHorizontal: space.lg,
          height: 48,
        }}
        {...props}
      />
      {error ? (
        <Text style={{ ...type.micro, color: color.destructive, fontWeight: "400" }}>{error}</Text>
      ) : null}
    </View>
  );
}

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<Mode>("signIn");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const signingUp = mode === "signUp";

  /** Mirrors the server's Zod rules so the customer isn't told by a round trip. */
  function validate() {
    const next: { email?: string; password?: string } = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Enter a valid email address";
    }
    if (signingUp && password.length < 8) {
      next.password = "Password must be at least 8 characters";
    } else if (!password) {
      next.password = "Password is required";
    }
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit() {
    setFormError(null);
    if (!validate()) {
      errorFeedback();
      return;
    }

    setBusy(true);
    try {
      if (signingUp) {
        await signUp(email.trim(), password, name.trim() || undefined);
      } else {
        await signIn(email.trim(), password);
      }
      selectionFeedback();
      // back() rather than replace(): sign-in is a modal over whatever the
      // customer was doing, and they should land back there.
      if (router.canGoBack()) router.back();
      else router.replace("/(tabs)/(home)");
    } catch (err) {
      errorFeedback();
      setFormError(
        err instanceof ApiError
          ? err.isNetworkError
            ? "Can't reach VolteX. Check your connection."
            : err.message
          : "Something went wrong. Try again."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: color.canvas }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Stack.Screen options={{ title: signingUp ? "Create account" : "Sign in" }} />

      <ScrollView
        contentContainerStyle={{ padding: space.xl, gap: space.xl }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ gap: space.xs }}>
          <Text style={{ ...type.hero, color: color.label }}>
            {signingUp ? "Create your account" : "Welcome back"}
          </Text>
          <Text style={{ ...type.body, color: color.secondaryLabel }}>
            {signingUp
              ? "Save items, track orders and check out faster."
              : "Sign in to use your cart and wishlist."}
          </Text>
        </View>

        <View style={{ gap: space.lg }}>
          {signingUp ? (
            <Field
              label="Name (optional)"
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              autoCapitalize="words"
              textContentType="name"
              autoComplete="name"
            />
          ) : null}

          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={fieldErrors.email}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
            autoComplete="email"
          />

          <Field
            label="Password"
            value={password}
            onChangeText={setPassword}
            error={fieldErrors.password}
            placeholder={signingUp ? "At least 8 characters" : "Your password"}
            secureTextEntry
            autoCapitalize="none"
            // newPassword lets the OS offer to generate and save a strong one.
            textContentType={signingUp ? "newPassword" : "password"}
            autoComplete={signingUp ? "new-password" : "current-password"}
            onSubmitEditing={submit}
            returnKeyType="go"
          />
        </View>

        {formError ? (
          <View
            style={{
              backgroundColor: "#FDECEA",
              borderRadius: radius.md,
              padding: space.lg,
            }}
          >
            <Text style={{ ...type.meta, color: color.destructive }}>{formError}</Text>
          </View>
        ) : null}

        <PressableScale
          accessibilityRole="button"
          disabled={busy}
          onPress={submit}
          activeScale={0.97}
          style={{
            height: 50,
            borderRadius: radius.md,
            backgroundColor: busy ? color.tertiaryLabel : color.brand,
            alignItems: "center",
            justifyContent: "center",
            ...(busy ? {} : shadowRaised),
          }}
        >
          <Text style={{ ...type.action, color: color.onBrand }}>
            {busy ? "Please wait…" : signingUp ? "Create account" : "Sign in"}
          </Text>
        </PressableScale>

        <PressableScale
          accessibilityRole="button"
          activeScale={0.97}
          onPress={() => {
            setMode(signingUp ? "signIn" : "signUp");
            setFieldErrors({});
            setFormError(null);
          }}
          style={{ height: 40, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ ...type.meta, color: color.secondaryLabel }}>
            {signingUp ? "Already have an account? " : "New to VolteX? "}
            <Text style={{ color: color.brand, fontWeight: "700" }}>
              {signingUp ? "Sign in" : "Create one"}
            </Text>
          </Text>
        </PressableScale>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
