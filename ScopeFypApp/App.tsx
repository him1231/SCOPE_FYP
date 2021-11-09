import React, {useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView from 'react-native-maps';

const App = () => {
  const [initialing, setInitialing] = useState(false);

  return (
    <View style={styles.container}>
      {initialing && <LoadingIndicator />}
      {!initialing && <MapPage />}
    </View>
  );
};

const LoadingIndicator = React.memo(() => {
  return <ActivityIndicator style={{flex: 1}} />;
});

const MapPage = () => {
  return (
    <>
      <Map />
      <View style={styles.inputContainer}>
        <LocationInput title={'start:'} />
        <Separator />
        <LocationInput title={'end:'} />
        <Separator />
        <RouteButton />
      </View>
    </>
  );
};

const Map = React.memo(() => {
  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: 22.3193,
        longitude: 114.1694,
        latitudeDelta: 0.0461,
        longitudeDelta: 0.021,
      }}
      onPress={e => {
        console.log('onPress: ', e.nativeEvent.coordinate);
      }}
    />
  );
});

const LocationInput = React.memo(
  (props: {title?: string; content?: string}) => {
    const {title, content} = props;
    return (
      <View style={[styles.input, styles.shadow]}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.content}>{content}</Text>
      </View>
    );
  },
);

const RouteButton = React.memo((props: {onPress?: () => void}) => {
  const {onPress} = props;
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>GO</Text>
    </TouchableOpacity>
  );
});

const Separator = React.memo(() => {
  return <View style={styles.separator} />;
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1, //the container will fill the whole screen.
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  inputContainer: {
    position: 'absolute',
    top: '8%',
    width: '100%',
    padding: 20,
    alignItems: 'flex-end',
  },
  input: {
    backgroundColor: 'white',
    width: '100%',
    height: 40,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {marginEnd: 10},
  content: {
    flex: 1,
  },
  shadow: {
    shadowColor: '#939393',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 5,

    elevation: 3,
  },
  separator: {
    width: 20,
    height: 20,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '800',
    color: 'white',
  },
});

export default App;
