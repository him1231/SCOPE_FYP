import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MapView, {Callout, LatLng, Marker} from 'react-native-maps';
import Realm, {UpdateMode} from 'realm';
import {getDistance} from 'geolib';
import Graph from 'node-dijkstra';

const RouteSchema = {
  name: 'Route',
  primaryKey: 'id',
  properties: {
    id: 'string',
    route: 'string',
    bound: 'string',
    service_type: 'string',
    orig_en: 'string',
    orig_tc: 'string',
    orig_sc: 'string',
    dest_en: 'string',
    dest_tc: 'string',
    dest_sc: 'string',
    route_stop: 'RouteStop[]',
  },
};

const RouteStopSchema = {
  name: 'RouteStop',
  primaryKey: 'id',
  properties: {
    id: 'string',
    route: 'string',
    routeObj: {
      type: 'linkingObjects',
      objectType: 'Route',
      property: 'route_stop',
    },
    bound: 'string',
    service_type: 'string',
    seq: 'string',
    stop: 'string',
    stopObj: {
      type: 'linkingObjects',
      objectType: 'Stop',
      property: 'route_stop',
    },
  },
};

const StopSchema = {
  name: 'Stop',
  primaryKey: 'stop',
  properties: {
    stop: 'string',
    name_en: 'string',
    name_tc: 'string',
    name_sc: 'string',
    lat: 'double',
    long: 'double',
    route_stop: 'RouteStop[]',
    nearby_stop: 'Stop[]',
  },
};

const walkDistance = 0.003;
const walkSpeedKMpH = 4;

const initRealm = () => {
  return new Realm({
    path: 'Routing_ver_0.14',
    schema: [RouteSchema, RouteStopSchema, StopSchema],
    schemaVersion: 0,
  });
};

const getJsonData = async (url: string) => {
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};

const App = () => {
  const [initialing, setInitialing] = useState(true);
  const [realm, setRealm] = useState<Realm | undefined>(undefined);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const realm = initRealm();
    setRealm(realm);

    let stopList = realm?.objects<Stop>('Stop');
    let routeList = realm?.objects<Route>('Route');
    let routeStopList = realm?.objects<RouteStop>('RouteStop');

    // if (routeList.length !== 0) {
    //   console.log('routeList');
    //   console.log(routeList.length);
    //   console.log(routeList[0]);
    // }
    // if (routeStopList.length !== 0) {
    //   console.log('routeStopList');
    //   console.log(routeStopList.length);
    //   console.log(routeStopList[0]);
    // }
    // if (stopList.length !== 0) {
    //   console.log('stopList');
    //   console.log(stopList.length);
    //   console.log(stopList[0]);
    // }

    if (stopList.length === 0 || routeStopList.length === 0 || routeList.length === 0) {
      // console.log('creatObject');
      // await creatObject(realm);
    } else {
      // testRouting(realm);
      // testRoutingTwo(realm);
      // testRoutingMulti(realm);
      makeGraph();
    }

    // setInitialing(false);
  };

  const makeGraph = async () => {
    const startLocation: LatLng = {
      latitude: 22.3670368,
      longitude: 114.1796286,
    };
    const endLocation: LatLng = {
      latitude: 22.391128,
      longitude: 114.2081145,
    };

    console.log('makeGraph Data @ ', new Date());

    console.log('get Data @ ', new Date());

    const busRouteJsonData = (await getJsonData('https://data.etabus.gov.hk/v1/transport/kmb/route/')) as any;

    const busRouteData = (busRouteJsonData.data as Route[]).map(data => {
      return {...data, id: data.route + data.bound + data.service_type};
    }) as Route[];

    const busRouteStopJsonData = (await getJsonData('https://data.etabus.gov.hk/v1/transport/kmb/route-stop')) as any;

    const busRouteStopData = (busRouteStopJsonData.data as RouteStop[]).map(data => {
      return {
        ...data,
        id: data.route + data.bound + data.service_type + data.seq,
      };
    }) as RouteStop[];

    const busStopJsonData = (await getJsonData('https://data.etabus.gov.hk/v1/transport/kmb/stop')) as any;

    const busStopData = busStopJsonData.data.map((busStop: any) => {
      return {...busStop, lat: Number(busStop.lat), long: Number(busStop.long)};
    }) as Stop[];

    console.log('complete get Data @ ', new Date());

    let graph: {[key: string]: {[key: string]: number}} = {};

    busStopData.forEach(stop => {
      busStopData
        .filter(
          anotherstop =>
            Math.abs(stop.lat - anotherstop.lat) < walkDistance &&
            Math.abs(stop.long - anotherstop.long) < walkDistance,
        )
        .forEach(anotherstop => {
          if (graph[stop.stop] === undefined) {
            graph[stop.stop] = {};
          }

          if (graph[stop.stop][anotherstop.stop] === undefined) {
            if (graph[anotherstop.stop] === undefined) {
              graph[anotherstop.stop] = {};
            }
            const distance =
              getDistance({lat: stop.lat, lon: stop.long}, {lat: anotherstop.lat, lon: anotherstop.long}) + 1;
            const time = distance / 1000 / 4;
            graph[stop.stop][anotherstop.stop] = time;
            graph[anotherstop.stop][stop.stop] = time;
          }
        });
    });

    console.log('complete loop Data @ ', new Date());

    const route = new Graph(graph);

    console.log('complete make route Data @ ', new Date());

    const path = route.path(busStopData[0].stop, busStopData[200].stop);

    console.log('complete make path Data @ ', new Date(), path);

    console.log('complete makeGraph Data @ ', new Date());

    console.log('start test real routing Data @ ', new Date());

    // const newRoute = new Graph(graph);

    console.log('end test real routing Data @ ', new Date());
  };

  type Route = {
    id?: string;
    route: string;
    bound: string;
    service_type: string;
    orig_en: string;
    orig_tc: string;
    orig_sc: string;
    dest_en: string;
    dest_tc: string;
    dest_sc: string;
    route_stop?: Realm.Results<RouteStop & Realm.Object>;
  };

  type RouteStop = {
    id?: string;
    route: string;
    bound: string;
    service_type: string;
    seq: string;
    stop: string;
    routeObj?: Realm.Results<Route & Realm.Object>;
    stopObj?: Realm.Results<Stop & Realm.Object>;
  };

  type Stop = {
    stop: string;
    name_en: string;
    name_tc: string;
    name_sc: string;
    lat: number;
    long: number;
    nearby_stop?: Realm.Results<Stop & Realm.Object>;
    route_stop?: Realm.Results<RouteStop & Realm.Object>;
  };

  const creatObject = async (realm: Realm) => {
    console.log('get Data @ ', new Date());

    const busRouteJsonData = (await getJsonData('https://data.etabus.gov.hk/v1/transport/kmb/route/')) as any;

    const busRouteData = (busRouteJsonData.data as Route[]).map(data => {
      return {...data, id: data.route + data.bound + data.service_type};
    }) as Route[];

    console.log('got BusRouteData', ' @ ', new Date(), busRouteData[0]);

    const busRouteStopJsonData = (await getJsonData('https://data.etabus.gov.hk/v1/transport/kmb/route-stop')) as any;

    const busRouteStopData = (busRouteStopJsonData.data as RouteStop[]).map(data => {
      return {
        ...data,
        id: data.route + data.bound + data.service_type + data.seq,
      };
    }) as RouteStop[];

    console.log('got BusRouteStopData', ' @ ', new Date(), busRouteStopData[0]);

    const busStopJsonData = (await getJsonData('https://data.etabus.gov.hk/v1/transport/kmb/stop')) as any;

    const busStopData = busStopJsonData.data.map((busStop: any) => {
      return {...busStop, lat: Number(busStop.lat), long: Number(busStop.long)};
    }) as Stop[];

    console.log('got BusStopData', ' @ ', new Date(), busStopData[0]);

    console.log('start write Data', ' @ ', new Date());

    realm.write(() => {
      busRouteStopData.forEach((busRouteStop, index) => {
        if (index % 5000 === 0) {
          console.log(`${index} out of ${busRouteStopData.length} complete @ ${new Date()}`);
        }

        const routeStop = {
          ...busRouteStop,
        };

        realm.create<RouteStop>('RouteStop', routeStop, Realm.UpdateMode.Modified);
      });

      let routeStopList = realm?.objects<RouteStop>('RouteStop');
      console.log('routeStopList');
      console.log('routeStopList.length', routeStopList.length);
      console.log('routeStopList[0]', routeStopList[0]);
      // return;

      busRouteData.forEach((busRoute, index) => {
        if (index % 100 === 0) {
          console.log(`${index} out of ${busRouteData.length} complete @ ${new Date()}`);
        }

        const route = {
          ...busRoute,
          route_stop: routeStopList.filtered(
            `route == "${busRoute.route}" && bound == "${busRoute.bound}" && service_type == "${busRoute.service_type}"`,
          ),
        };

        realm.create<Route>('Route', route, Realm.UpdateMode.Modified);
      });

      busStopData.forEach((busStop, index) => {
        if (index % 1000 === 0) {
          console.log(`${index} out of ${busStopData.length} complete @ ${new Date()}`);
        }
        const stop: Stop = {
          ...busStop,
          // nearby_stop: busStopData.filter(
          //   compareStop =>
          //     getDistance(
          //       {lat: compareStop.lat, lon: compareStop.long},
          //       {lat: busStop.lat, lon: busStop.long},
          //     ) < 300,
          // ),
          route_stop: routeStopList.filtered(`stop == "${busStop.stop}"`),
        };
        realm.create<Stop>('Stop', stop, Realm.UpdateMode.Modified);
      });

      let stopList = realm?.objects<Stop>('Stop');

      stopList.forEach((stop, index) => {
        if (index % 1000 === 0) {
          console.log(`${index} out of ${stopList.length} complete @ ${new Date()}`);
        }
        const nearby_stop_query = `
        lat > ${stop.lat - walkDistance} &&
        lat < ${stop.lat + walkDistance} &&
        long > ${stop.long - walkDistance} &&
        long < ${stop.long + walkDistance}`;
        stop.nearby_stop = stopList.filtered(nearby_stop_query);
      });
    });

    console.log('complete write Data');
  };

  return (
    <View style={styles.container}>
      {initialing && <LoadingIndicator />}
      {!initialing && <MapPage realm={realm} />}
    </View>
  );
};

const LoadingIndicator = React.memo(() => {
  return <ActivityIndicator color={'white'} style={{flex: 1, width: '100%', backgroundColor: '#0009'}} />;
});

const MapPage = ({realm}: {realm?: Realm}) => {
  const [startCoordinate, setStartCoordinate] = useState<LatLng | undefined>(undefined);
  const [endCoordinate, setEndCoordinate] = useState<LatLng | undefined>(undefined);

  const onPressRoute = () => {
    if (realm && startCoordinate && endCoordinate) {
      console.log('startCoordinate', startCoordinate);
      console.log('endCoordinate', endCoordinate);
    }
  };

  return (
    <>
      <Map onSelectStart={setStartCoordinate} onSelectEnd={setEndCoordinate} />
      <View style={styles.inputContainer}>
        <LocationInput title={'start:'} content={`${startCoordinate?.latitude},${startCoordinate?.longitude}`} />
        <Separator />
        <LocationInput title={'end:'} content={`${endCoordinate?.latitude},${endCoordinate?.longitude}`} />
        <Separator />
        <RouteButton onPress={onPressRoute} />
      </View>
    </>
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
