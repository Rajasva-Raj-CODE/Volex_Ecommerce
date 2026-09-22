import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Icon, type IconName } from "../design/Icon";
import { color, radius, space, type } from "../design/tokens";

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{ padding: space.xxl, gap: space.lg }}
      className="flex-1 items-center justify-center"
    >
      {children}
    </View>
  );
}

export function LoadingState({ label }: { label?: string }) {
  return (
    <Centered>
      <ActivityIndicator color={color.brand} />
      {label ? <Text style={{ ...type.meta, color: color.secondaryLabel }}>{label}</Text> : null}
    </Centered>
  );
}

function Illustration({ name }: { name: IconName }) {
  return (
    <View
      style={{
        width: 64,
        height: 64,
        borderRadius: radius.pill,
        backgroundColor: color.brandWash,
        borderWidth: 1,
        borderColor: color.separator,
      }}
      className="items-center justify-center"
    >
      <Icon name={name} size={26} color={color.brand} />
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <Centered>
      <Illustration name="warning" />
      <Text style={{ ...type.title, color: color.label }} className="text-center">
        Couldn&apos;t load this
      </Text>
      <Text style={{ ...type.body, color: color.secondaryLabel }} className="text-center">
        {message}
      </Text>
      {onRetry ? (
        <Pressable
          onPress={onRetry}
          android_ripple={{ color: color.brandDark }}
          style={({ pressed }) => ({
            paddingHorizontal: space.xxl,
            paddingVertical: space.lg,
            borderRadius: radius.md,
            backgroundColor: pressed ? color.brandDark : color.brand,
          })}
        >
          <Text style={{ ...type.action, color: color.onBrand }}>Try again</Text>
        </Pressable>
      ) : null}
    </Centered>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <Centered>
      <Illustration name="empty" />
      <Text style={{ ...type.title, color: color.label }} className="text-center">
        {title}
      </Text>
      {hint ? (
        <Text style={{ ...type.body, color: color.secondaryLabel }} className="text-center">
          {hint}
        </Text>
      ) : null}
    </Centered>
  );
}
