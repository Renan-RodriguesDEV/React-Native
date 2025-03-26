import React from "react";
import { View, Text, StyleSheet } from "react-native";
const Footer = ({
    children,
    customText = "Renan | Yan | João\nUnieduvale - (Desenv. Mobile)",
    containerStyle,
    textStyle,
}: {
    children?: React.ReactNode;
    customText?: string;
    containerStyle?: object;
    textStyle?: object;
}) => {
    return (
        <View style={[styles.footerContainer, containerStyle]}>
            {children ? (
                children
            ) : (
                <Text style={[styles.footerText, textStyle]}>{customText}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    footerContainer: {
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1e1e1e",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },
    footerText: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
    },
});

export default Footer;