import { Camera, CameraType } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { Image, SafeAreaView, ScrollView, TextInput, View } from "react-native";

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { PositionChoice } from "../components/PositionChoice";

import { PositionProps, POSITIONS } from "../utils/positions";
import { styles } from "./styles";

export function Home() {
  const [hasCameraPersmission, setHasCameraPersmission] = useState(false);
  const [positionSelected, setPositionSelected] = useState<PositionProps>(
    POSITIONS[0]
  );

  const cameraRef = useRef<Camera>(null);

  async function handleTakePicture() {
    const photo = await cameraRef.current.takePictureAsync();
    console.log(photo);
  }

  useEffect(() => {
    Camera.requestCameraPermissionsAsync().then((response) =>
      setHasCameraPersmission(response.granted)
    );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Header position={positionSelected} />

          <View style={styles.picture}>
            {hasCameraPersmission ? (
              <Camera
                ref={cameraRef}
                style={styles.camera}
                type={CameraType.front}
              />
            ) : (
              <Image
                source={{
                  uri: "https://preview.redd.it/1iewg3rme8d61.png?width=1219&format=png&auto=webp&s=91b3296fcb07d98c9e8724cc091bd4994477293d",
                }}
                style={styles.camera}
              />
            )}

            <View style={styles.player}>
              <TextInput
                placeholder="Digite seu nome aqui"
                style={styles.name}
              />
            </View>
          </View>
        </View>

        <PositionChoice
          onChangePosition={setPositionSelected}
          positionSelected={positionSelected}
        />

        <Button title="Compartilhar" onPress={handleTakePicture} />
      </ScrollView>
    </SafeAreaView>
  );
}
