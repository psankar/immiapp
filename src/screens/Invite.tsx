import { NavigationProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { saxios } from "../context/AuthContext";
import t from "../localization/i18n";

type InviteProps = {
  navigation: NavigationProp<Record<string, object>>;
};

export const Invite = ({ navigation }: InviteProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [referralRemaining, setReferralRemaining] = useState(0);
  const [emailAddress, setEmailAddress] = useState("");
  var [error, setError] = useState<string | null>(null);

  useEffect(() => {
    saxios
      .get("/referrals-remaining")
      .then((response) => setReferralRemaining(parseInt(response.data)))
      .catch((error) => {
        // referralRemaining is init to 0 and
        // that will take care of conveying to the user
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const isValidEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleInvite = () => {
    if (isValidEmail(emailAddress)) {
      saxios
        .post("/refer-account", { email_address: emailAddress })
        .then(() => navigation.navigate(t("my_lists"), {}))
        .catch((error) => console.error(error));
    } else {
      setError(t("email_invalid"));
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View>
      {referralRemaining === 0 ? (
        <Text>{t("invite_impossible_now")}</Text>
      ) : (
        <>
          <Text style={styles.label}>{t("email_address")}</Text>
          <TextInput
            value={emailAddress}
            onChangeText={setEmailAddress}
            placeholder={t("email")}
            keyboardType="email-address"
            style={styles.input}
            placeholderTextColor={"#000"}
          />
          <Pressable onPress={handleInvite} style={styles.inviteButton}>
            <Text style={styles.inviteButtonText}>{t("invite")}</Text>
          </Pressable>
        </>
      )}
      {error ? <Text>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    width: "100%",
  },
  inviteButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: "center",
  },
  inviteButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
