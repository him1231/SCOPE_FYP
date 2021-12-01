import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MapView, {LatLng, Marker} from 'react-native-maps';
import {testGraph} from './pathRouting';

const App = () => {
  const [startCoordinate, setStartCoordinate] = useState<LatLng | undefined>(undefined);
  const [endCoordinate, setEndCoordinate] = useState<LatLng | undefined>(undefined);

  const onPressRoute = () => {
    console.log('onPressRoute');
  };

  useEffect(() => {
    testGraph();
  }, []);

  return (
    <View style={styles.container}>
      <Map onSelectStart={setStartCoordinate} onSelectEnd={setEndCoordinate} />
      <View style={styles.inputContainer}>
        <LocationInput
          title={'start:'}
          content={
            startCoordinate ? `${startCoordinate?.latitude.toFixed(5)},${startCoordinate?.longitude.toFixed(5)}` : ''
          }
        />
        <Separator />
        <LocationInput
          title={'end:'}
          content={endCoordinate ? `${endCoordinate?.latitude.toFixed(5)},${endCoordinate?.longitude.toFixed(5)}` : ''}
        />
        <Separator />
        <RouteButton onPress={onPressRoute} />
      </View>
    </View>
  );
};

const Map = React.memo(
  ({onSelectStart, onSelectEnd}: {onSelectStart?: (_: LatLng) => void; onSelectEnd?: (_: LatLng) => void}) => {
    const [currentSelection, setCurrentSelection] = useState<LatLng | undefined>(undefined);
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
          setCurrentSelection(e.nativeEvent.coordinate);
        }}>
        {currentSelection !== undefined && (
          <Marker coordinate={currentSelection}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'red',
                  padding: 5,
                  borderRadius: 5,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    if (onSelectStart) onSelectStart(currentSelection);
                    setCurrentSelection(undefined);
                  }}
                  style={{
                    width: 35,
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text>Start</Text>
                </TouchableOpacity>
                <Separator size={5} />
                <TouchableOpacity
                  onPress={() => {
                    if (onSelectEnd) onSelectEnd(currentSelection);
                    setCurrentSelection(undefined);
                  }}
                  style={{
                    width: 35,
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text>End</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.triangle} />
            </View>
            <Separator size={65} />
          </Marker>
        )}
      </MapView>
    );
  },
);

const LocationInput = React.memo((props: {title?: string; content?: string}) => {
  const {title, content} = props;
  return (
    <View style={[styles.input, styles.shadow]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{content}</Text>
    </View>
  );
});

const RouteButton = React.memo((props: {onPress?: () => void}) => {
  const {onPress} = props;
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>GO</Text>
    </TouchableOpacity>
  );
});

const Separator = React.memo(({size}: {size?: number}) => {
  return <View style={size ? {width: size, height: size} : styles.separator} />;
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
    borderRadius: 10,
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
    shadowOpacity: 0.5,
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
    backgroundColor: '#ED0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '800',
    color: 'white',
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'red',
    transform: [{rotate: '180deg'}],
  },
});

export default App;
