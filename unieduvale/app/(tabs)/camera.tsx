import React, { useEffect, useRef, useState } from "react";
import { View, Text, Button, StyleSheet, Image, Platform } from "react-native";
import { Camera } from "expo-camera";

export default function CameraScreen() {
  const [temPermissao, setTemPermissao] = useState<boolean | null>(null);
  const [foto, setFoto] = useState(null);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setTemPermissao(status === "granted");
    })();
  }, []);

  const tirarFoto = async () => {
    if (cameraRef.current) {
      const fotoTirada = await cameraRef.current.takePictureAsync();
      setFoto(fotoTirada.uri);
    }
  };

  if (Platform.OS === "web") {
    return <Text>O componente de câmera não funciona no navegador.</Text>;
  }

  if (temPermissao === null) {
    return <Text>Solicitando permissão...</Text>;
  }
  if (temPermissao === false) {
    return <Text>Permissão negada para usar a câmera.</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      {!foto ? (
        <Camera style={{ flex: 1 }} ref={cameraRef} />
      ) : (
        <Image source={{ uri: foto }} style={{ flex: 1 }} />
      )}
      <View style={styles.buttons}>
        <Button
          title={foto ? "Voltar para câmera" : "Tirar Foto"}
          onPress={() => {
            if (foto) {
              setFoto(null);
            } else {
              tirarFoto();
            }
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
});
