import { StyleSheet } from "react-native";

const css = StyleSheet.create({
  btnPrimaryEnabled: {
    backgroundColor: "darkviolet",
    borderRadius: 9,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimaryDisabled: {
    backgroundColor: "#999",
    borderRadius: 9,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 20,
    borderRadius: 12,
    maxHeight: 40,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  viewport: {
    flex: 1,
    backgroundColor: "lavender",
  },
  error: {
    color: "red",
    marginTop: 20,
  },
});

export default css;
