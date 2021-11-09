import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, {Callout, LatLng, Marker} from 'react-native-maps';
import Realm from 'realm';

const RouteFareSchema = {
  name: 'RouteFare',
  primaryKey: 'uid',
  properties: {
    uid: 'string',
    routeId: 'int',
    companyCode: 'string',
    district: 'string',
    routeNameC: 'string',
    routeNameS: 'string',
    routeNameE: 'string',
    routeType: 'int',
    serviceMode: 'string',
    specialType: 'int',
    journeyTime: 'int',
    locStartNameC: 'string',
    locStartNameS: 'string',
    locStartNameE: 'string',
    locEndNameC: 'string',
    locEndNameS: 'string',
    locEndNameE: 'string',
    hyperlinkC: 'string',
    hyperlinkS: 'string',
    hyperlinkE: 'string',
    fullFare: 'double',
    lastUpdateDate: 'string',
    routeSeq: 'int',
    stopSeq: 'int',
    stopId: 'int',
    stopPickDrop: 'int',
    stopNameC: 'string',
    stopNameS: 'string',
    stopNameE: 'string',

    coordinatesLat: 'int',
    coordinatesLon: 'int',
  },
};

const initRealm = () => {
  return new Realm({path: 'RouteFare', schema: [RouteFareSchema]});
};

const getBusData = async () => {
  try {
    const response = await fetch(
      'https://static.data.gov.hk/td/routes-fares-geojson/JSON_BUS.json',
    );
    const json = await response.json();
    return json.features;
  } catch (error) {
    console.error(error);
  }
};

const App = () => {
  const [initialing, setInitialing] = useState(true);
  const [realm, setRealm] = useState<Realm | undefined>(undefined);
  const [startCoordinate, setStartCoordinate] = useState<LatLng | undefined>(
    undefined,
  );
  const [endCoordinate, setEndCoordinate] = useState<LatLng | undefined>(
    undefined,
  );

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const realm = initRealm();
    setRealm(realm);
    let routeFare = realm?.objects('RouteFare');
    if (routeFare.length === 0) {
      await creatObject(realm);
    }

    setInitialing(false);

    console.log('routeFare', routeFare);
  };

  const creatObject = async (realm: Realm) => {
    console.log('get Data');
    const data = (await getBusData()) as any[];
    console.log('complete get Data');

    const objArr: Realm.Object[] = [];
    const dataLength = data.length;

    console.log('write Data');
    realm.write(() => {
      data.forEach((bus: any, index: number) => {
        console.log('creating: ', index, '/', dataLength);

        const task = realm.create(
          'RouteFare',
          {
            uid:
              '' +
              bus.properties.routeId +
              bus.properties.routeSeq +
              bus.properties.stopSeq +
              bus.properties.stopPickDrop,
            ...bus.properties,
            coordinatesLat: bus.geometry.coordinates[0],
            coordinatesLon: bus.geometry.coordinates[1],
          },
          'modified',
        );
        objArr.push(task);
      });
    });
    console.log('complete write Data');
  };

  const onSelectStart = (coordinate: LatLng) => {
    setStartCoordinate(coordinate);
  };

  const onSelectEnd = (coordinate: LatLng) => {
    setEndCoordinate(coordinate);
  };

  const onPressRoute = () => {
    if (realm && startCoordinate) {
      const routeFares = realm
        .objects('RouteFare')
        .filtered(
          `coordinatesLat > ${
            startCoordinate.latitude + 0.002
          } AND coordinatesLat < ${startCoordinate.latitude - 0.002}`,
        );
      console.log(routeFares);
    }
  };

  return (
    <View style={styles.container}>
      {initialing && <LoadingIndicator />}
      {!initialing && (
        <MapPage
          onSelectStart={onSelectStart}
          onSelectEnd={onSelectEnd}
          onPressRoute={onPressRoute}
        />
      )}
    </View>
  );
};

const LoadingIndicator = React.memo(() => {
  return (
    <ActivityIndicator
      color={'white'}
      style={{flex: 1, width: '100%', backgroundColor: '#0009'}}
    />
  );
});

const MapPage = ({
  onSelectStart,
  onSelectEnd,
  onPressRoute,
}: {
  onSelectStart?: (_: LatLng) => void;
  onSelectEnd?: (_: LatLng) => void;
  onPressRoute?: () => void;
}) => {
  return (
    <>
      <Map onSelectStart={onSelectStart} onSelectEnd={onSelectEnd} />
      <View style={styles.inputContainer}>
        <LocationInput title={'start:'} />
        <Separator />
        <LocationInput title={'end:'} />
        <Separator />
        <RouteButton onPress={onPressRoute} />
      </View>
    </>
  );
};

const Map = React.memo(
  ({
    onSelectStart,
    onSelectEnd,
  }: {
    onSelectStart?: (_: LatLng) => void;
    onSelectEnd?: (_: LatLng) => void;
  }) => {
    const [currentSelection, setCurrentSelection] = useState<
      LatLng | undefined
    >(undefined);
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
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                padding: 5,
                borderRadius: 5,
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (onSelectStart) onSelectStart(currentSelection);
                  setCurrentSelection(undefined);
                }}
                style={{
                  width: '100%',
                  backgroundColor: 'orange',
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
                  width: '100%',
                  backgroundColor: 'salmon',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>End</Text>
              </TouchableOpacity>
            </View>
          </Marker>
        )}
      </MapView>
    );
  },
);

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
