import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, View, useWindowDimensions } from "react-native";
import Animated, { FadeIn, useReducedMotion } from "react-native-reanimated";
import { ProductCard } from "../../../components/ProductCard";
import { ProductGridSkeleton } from "../../../components/Skeleton";
import { EmptyState, ErrorState } from "../../../components/States";
import { duration } from "../../../design/motion";
import { color, space, type } from "../../../design/tokens";
import { useAsync } from "../../../hooks/useAsync";
import { listProducts } from "../../../lib/catalog-api";

const PAGE_SIZE = 20;

export default function SearchScreen() {
  const { width } = useWindowDimensions();
  const reduced = useReducedMotion();
  const cardWidth = (width - space.xl * 2 - space.lg) / 2;

  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  // Debounce so a fast typist doesn't fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 350);
    return () => clearTimeout(t);
  }, [query]);

  const results = useAsync(
    (signal) => listProducts({ limit: PAGE_SIZE, search: debounced || undefined }, signal),
    [debounced]
  );

  const products = results.data?.products ?? [];
  const total = results.data?.pagination.total ?? 0;

  return (
    <View style={{ flex: 1, backgroundColor: color.canvas }}>
      {/*
        The real platform search control — UISearchController on iOS, which
        expands on focus and animates its own cancel button. A styled TextInput
        gets none of that.
      */}
      <Stack.Screen
        options={{
          headerSearchBarOptions: {
            placeholder: "Phones, laptops, TVs…",
            onChangeText: (e) => setQuery(e.nativeEvent.text),
            onCancelButtonPress: () => setQuery(""),
            hideWhenScrolling: false,
            autoCapitalize: "none",
            textColor: color.label,
            tintColor: color.brand,
            hintTextColor: color.tertiaryLabel,
            headerIconColor: color.secondaryLabel,
          },
        }}
      />

      {results.loading && !results.data ? (
        <ProductGridSkeleton width={cardWidth} />
      ) : results.error ? (
        <ErrorState message={results.error} onRetry={results.reload} />
      ) : products.length === 0 ? (
        <EmptyState
          title={debounced ? "No results" : "Search VolteX"}
          hint={
            debounced
              ? `Nothing matched “${debounced}”. Try a different term.`
              : "Find phones, laptops, TVs and more."
          }
        />
      ) : (
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: space.lg, paddingHorizontal: space.xl }}
          contentContainerStyle={{ gap: space.lg, paddingVertical: space.lg }}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            debounced ? (
              <Text
                style={{
                  ...type.meta,
                  color: color.secondaryLabel,
                  paddingHorizontal: space.xl,
                }}
              >
                {total} {total === 1 ? "result" : "results"}
              </Text>
            ) : null
          }
          renderItem={({ item, index }) => (
            <Animated.View
              // Cap the stagger: past the first screenful the delay would be
              // felt as lag rather than read as sequence.
              entering={
                reduced
                  ? undefined
                  : FadeIn.duration(duration.quick).delay(Math.min(index, 7) * 40)
              }
            >
              <ProductCard product={item} width={cardWidth} />
            </Animated.View>
          )}
        />
      )}
    </View>
  );
}
