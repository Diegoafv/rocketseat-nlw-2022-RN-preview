import { Camera, CameraType } from "expo-camera";
import * as Sharing from "expo-sharing";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { captureRef } from "react-native-view-shot";

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { PositionChoice } from "../components/PositionChoice";

import { PositionProps, POSITIONS } from "../utils/positions";
import { styles } from "./styles";

export function Home() {
  const [photo, setPhotoURI] = useState<null | string>(null);
  const [hasCameraPersmission, setHasCameraPersmission] = useState(false);
  const [positionSelected, setPositionSelected] = useState<PositionProps>(
    POSITIONS[0]
  );

  const cameraRef = useRef<Camera>(null);
  const screenShotRef = useRef(null);

  async function handleTakePicture() {
    const photo = await cameraRef.current.takePictureAsync();
    setPhotoURI(photo.uri);
  }

  async function shareScreenShot() {
    const screenshot = await captureRef(screenShotRef);
    await Sharing.shareAsync("file://" + screenshot);
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
        <View ref={screenShotRef} style={styles.sticker}>
          <Header position={positionSelected} />

          <View style={styles.picture}>
            {hasCameraPersmission && !photo ? (
              <Camera
                ref={cameraRef}
                style={styles.camera}
                type={CameraType.front}
              />
            ) : (
              <Image
                source={{
                  uri: photo
                    ? photo
                    : "https://preview.redd.it/1iewg3rme8d61.png?width=1219&format=png&auto=webp&s=91b3296fcb07d98c9e8724cc091bd4994477293d",
                }}
                style={styles.camera}
                onLoad={shareScreenShot}
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

        <TouchableOpacity onPress={() => setPhotoURI(null)}>
          <Text style={styles.retry}>Nova Foto</Text>
        </TouchableOpacity>

        <Button title="Compartilhar" onPress={handleTakePicture} />
      </ScrollView>
    </SafeAreaView>
  );
}
