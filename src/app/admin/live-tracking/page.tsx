"use client"
import React, { useState, useEffect, useRef } from 'react';
import { LoadScript, GoogleMap, Marker, Polyline } from '@react-google-maps/api';
import { Play, Pause, Bus, Users, CheckCircle } from 'lucide-react';

type LatLng = { lat: number; lng: number };
type StudentPhase = 'walking' | 'waiting' | 'boarded';
type BusPhase = 'idle' | 'approaching' | 'boarding' | 'transit' | 'arrived';

type SimStudent = {
  id: string;
  stopIdx: number;
  pos: LatLng;
  phase: StudentPhase;
};

type BusConfig = {
  id: string;
  name: string;
  origin: string;
  color: string;
  start: LatLng;
  stops: LatLng[];
  students: SimStudent[];
};

const DEST: LatLng = { lat: 9.0150, lng: 7.3900 }; // Nile University
const MAP_CENTER: LatLng = { lat: 9.0480, lng: 7.4350 };

const BUS_CONFIGS: BusConfig[] = [
  {
    id: 'bus_a',
    name: 'Bus A',
    origin: 'Wuse 2',
    color: '#8B5CF6',
    start: { lat: 9.0765, lng: 7.4800 },
    stops: [
      { lat: 9.0680, lng: 7.4700 },
      { lat: 9.0450, lng: 7.4200 },
      { lat: 9.0250, lng: 7.4000 },
    ],
    students: [
      { id: 'a_s1', stopIdx: 0, pos: { lat: 9.0700, lng: 7.4720 }, phase: 'walking' },
      { id: 'a_s2', stopIdx: 0, pos: { lat: 9.0670, lng: 7.4680 }, phase: 'walking' },
      { id: 'a_s3', stopIdx: 1, pos: { lat: 9.0460, lng: 7.4220 }, phase: 'walking' },
      { id: 'a_s4', stopIdx: 2, pos: { lat: 9.0270, lng: 7.4020 }, phase: 'walking' },
    ],
  },
  {
    id: 'bus_b',
    name: 'Bus B',
    origin: 'Jabi',
    color: '#10B981',
    start: { lat: 9.0550, lng: 7.4250 },
    stops: [
      { lat: 9.0500, lng: 7.4100 },
      { lat: 9.0350, lng: 7.4050 },
    ],
    students: [
      { id: 'b_s1', stopIdx: 0, pos: { lat: 9.0520, lng: 7.4120 }, phase: 'walking' },
      { id: 'b_s2', stopIdx: 0, pos: { lat: 9.0510, lng: 7.4080 }, phase: 'walking' },
      { id: 'b_s3', stopIdx: 1, pos: { lat: 9.0370, lng: 7.4070 }, phase: 'walking' },
    ],
  },
  {
    id: 'bus_c',
    name: 'Bus C',
    origin: 'Garki',
    color: '#F59E0B',
    start: { lat: 9.0550, lng: 7.4800 },
    stops: [
      { lat: 9.0400, lng: 7.4500 },
      { lat: 9.0300, lng: 7.4200 },
      { lat: 9.0200, lng: 7.4050 },
    ],
    students: [
      { id: 'c_s1', stopIdx: 0, pos: { lat: 9.0420, lng: 7.4520 }, phase: 'walking' },
      { id: 'c_s2', stopIdx: 1, pos: { lat: 9.0320, lng: 7.4220 }, phase: 'walking' },
      { id: 'c_s3', stopIdx: 2, pos: { lat: 9.0210, lng: 7.4060 }, phase: 'walking' },
    ],
  },
  {
    id: 'bus_d',
    name: 'Bus D',
    origin: 'Maitama',
    color: '#EF4444',
    start: { lat: 9.0820, lng: 7.4950 },
    stops: [
      { lat: 9.0700, lng: 7.4600 },
      { lat: 9.0450, lng: 7.4300 },
    ],
    students: [
      { id: 'd_s1', stopIdx: 0, pos: { lat: 9.0720, lng: 7.4620 }, phase: 'walking' },
      { id: 'd_s2', stopIdx: 0, pos: { lat: 9.0690, lng: 7.4580 }, phase: 'walking' },
      { id: 'd_s3', stopIdx: 1, pos: { lat: 9.0460, lng: 7.4310 }, phase: 'walking' },
    ],
  },
];

const MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dadada' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9c9c9' }] },
];

const LiveTrackingPage = () => {
  const [scenarioActive, setScenarioActive] = useState(false);
  const [simPhases, setSimPhases] = useState<Record<string, BusPhase>>({});
  const [simPaths, setSimPaths] = useState<Record<string, LatLng[]>>({});
  const [simStopIndices, setSimStopIndices] = useState<Record<string, number[]>>({});
  const [simLoaded, setSimLoaded] = useState<Record<string, boolean>>({});
  const [mapCenter, setMapCenter] = useState(MAP_CENTER);
  const [mapZoom, setMapZoom] = useState(12);

  const busMarkersRef = useRef<Record<string, google.maps.Marker | null>>({});
  const studentMarkersRef = useRef<Record<string, google.maps.Marker>>({});
  const animationFrameRef = useRef<number>();
  const lastPhaseRef = useRef<Record<string, BusPhase>>({});

  // Load all 4 routes via Directions API
  useEffect(() => {
    if (!scenarioActive) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      busMarkersRef.current = {};
      studentMarkersRef.current = {};
      lastPhaseRef.current = {};
      setSimLoaded({});
      setSimPaths({});
      setSimStopIndices({});
      setSimPhases({});
      return;
    }

    let isMounted = true;
    const loadAll = async () => {
      if (!window.google?.maps) { setTimeout(loadAll, 100); return; }
      const ds = new window.google.maps.DirectionsService();
      const results = await Promise.allSettled(
        BUS_CONFIGS.map(cfg =>
          ds.route({
            origin: cfg.start,
            destination: DEST,
            waypoints: cfg.stops.map(s => ({ location: s, stopover: true })),
            travelMode: window.google.maps.TravelMode.DRIVING,
          })
        )
      );
      if (!isMounted) return;

      const newPaths: Record<string, LatLng[]> = {};
      const newStopIndices: Record<string, number[]> = {};
      const newLoaded: Record<string, boolean> = {};
      const initPhases: Record<string, BusPhase> = {};

      BUS_CONFIGS.forEach((cfg, i) => {
        const res = results[i];
        let path: LatLng[];
        if (res.status === 'fulfilled' && res.value.routes?.[0]) {
          path = res.value.routes[0].overview_path.map(p => ({ lat: p.lat(), lng: p.lng() }));
        } else {
          path = [cfg.start, ...cfg.stops, DEST];
        }
        const stopIndices = cfg.stops.map(stop => {
          let ci = 0, minD = Infinity;
          path.forEach((p, idx) => {
            const d = Math.hypot(p.lat - stop.lat, p.lng - stop.lng);
            if (d < minD) { minD = d; ci = idx; }
          });
          return ci;
        });
        newPaths[cfg.id] = path;
        newStopIndices[cfg.id] = stopIndices;
        newLoaded[cfg.id] = true;
        initPhases[cfg.id] = 'approaching';
        lastPhaseRef.current[cfg.id] = 'approaching';
      });

      setSimPaths(newPaths);
      setSimStopIndices(newStopIndices);
      setSimLoaded(newLoaded);
      setSimPhases(initPhases);
    };
    loadAll();
    return () => { isMounted = false; };
  }, [scenarioActive]);

  // Main animation loop
  useEffect(() => {
    const allLoaded = BUS_CONFIGS.every(cfg => simLoaded[cfg.id]);
    if (!scenarioActive || !allLoaded) return;

    type BusRT = {
      pos: LatLng;
      targetIdx: number;
      stopIdx: number;
      phase: BusPhase;
      boardingLeft: number;
      students: SimStudent[];
    };

    const rts: Record<string, BusRT> = {};
    BUS_CONFIGS.forEach(cfg => {
      rts[cfg.id] = {
        pos: { ...cfg.start },
        targetIdx: 1,
        stopIdx: 0,
        phase: 'approaching',
        boardingLeft: 0,
        students: cfg.students.map(s => ({ ...s, pos: { ...s.pos } })),
      };
    });

    let lastTime = performance.now();
    const BUS_SPD = 0.0012;
    const STU_SPD = 0.0008;

    const animate = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;
      const changed: Record<string, BusPhase> = {};

      BUS_CONFIGS.forEach(cfg => {
        const rt = rts[cfg.id];
        const path = simPaths[cfg.id];
        const si = simStopIndices[cfg.id];
        if (!path || !si || rt.phase === 'arrived') return;

        // Move students
        rt.students.forEach(std => {
          if (std.phase === 'walking') {
            const tgt = cfg.stops[std.stopIdx];
            if (!tgt) return;
            const d = Math.hypot(tgt.lat - std.pos.lat, tgt.lng - std.pos.lng);
            if (d > 0.0001) {
              std.pos = {
                lat: std.pos.lat + ((tgt.lat - std.pos.lat) / d) * STU_SPD * dt,
                lng: std.pos.lng + ((tgt.lng - std.pos.lng) / d) * STU_SPD * dt,
              };
            } else {
              std.pos = { ...tgt };
              std.phase = 'waiting';
            }
          }
          const m = studentMarkersRef.current[std.id];
          if (m) {
            if (std.phase === 'boarded') {
              if (m.getVisible()) m.setVisible(false);
            } else {
              if (!m.getVisible()) m.setVisible(true);
              m.setPosition(new window.google.maps.LatLng(std.pos.lat, std.pos.lng));
            }
          }
        });

        // Move bus
        if (rt.phase === 'approaching' || rt.phase === 'transit') {
          if (rt.targetIdx < path.length) {
            const tp = path[rt.targetIdx];
            const d = Math.hypot(tp.lat - rt.pos.lat, tp.lng - rt.pos.lng);
            if (d > 0.00005) {
              rt.pos = {
                lat: rt.pos.lat + (tp.lat - rt.pos.lat) / d * BUS_SPD * dt,
                lng: rt.pos.lng + (tp.lng - rt.pos.lng) / d * BUS_SPD * dt,
              };
            } else {
              rt.pos = { ...tp };
              if (rt.stopIdx < si.length && rt.targetIdx === si[rt.stopIdx]) {
                rt.phase = 'boarding';
                rt.boardingLeft = 2.0;
              } else {
                rt.targetIdx++;
              }
            }
          } else {
            rt.phase = 'arrived';
          }
          const bm = busMarkersRef.current[cfg.id];
          if (bm) bm.setPosition(new window.google.maps.LatLng(rt.pos.lat, rt.pos.lng));
        } else if (rt.phase === 'boarding') {
          const atStop = rt.students.filter(s => s.stopIdx === rt.stopIdx);
          const allWaiting = atStop.every(s => s.phase === 'waiting' || s.phase === 'boarded');
          if (allWaiting) {
            rt.boardingLeft -= dt;
            if (rt.boardingLeft <= 0) {
              atStop.forEach(s => { s.phase = 'boarded'; });
              rt.phase = 'transit';
              rt.stopIdx++;
              rt.targetIdx++;
            }
          }
        }

        if (lastPhaseRef.current[cfg.id] !== rt.phase) {
          lastPhaseRef.current[cfg.id] = rt.phase;
          changed[cfg.id] = rt.phase;
        }
      });

      if (Object.keys(changed).length > 0) {
        setSimPhases(prev => ({ ...prev, ...changed }));
      }

      const anyRunning = BUS_CONFIGS.some(cfg => rts[cfg.id]?.phase !== 'arrived');
      if (anyRunning) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  }, [scenarioActive, simLoaded, simPaths, simStopIndices]);

  const handleToggle = () => {
    setScenarioActive(v => !v);
    if (!scenarioActive) {
      setMapCenter(MAP_CENTER);
      setMapZoom(12);
    }
  };

  const allArrived = scenarioActive && BUS_CONFIGS.every(cfg => simPhases[cfg.id] === 'arrived');
  const totalStudents = BUS_CONFIGS.reduce((sum, c) => sum + c.students.length, 0);

  const phaseLabel = (phase: BusPhase | undefined, loaded: boolean) => {
    if (!loaded) return '⏳ Loading route...';
    switch (phase) {
      case 'approaching': return '🚌 En route';
      case 'boarding': return '🧍 Boarding students';
      case 'transit': return '⚡ In transit';
      case 'arrived': return '✅ Arrived!';
      default: return '⏳ Waiting';
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Tracking — 4-Bus Simulation</h1>
          <p className="text-gray-500">
            Wuse 2 · Jabi · Garki · Maitama &rarr; <span className="font-semibold text-blue-600">Nile University</span> &bull; {totalStudents} Students
          </p>
        </div>
        <button
          onClick={handleToggle}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold shadow-sm transition-all ${
            scenarioActive
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-[#0066CC] text-white hover:bg-blue-700'
          }`}
        >
          {scenarioActive ? <Pause size={18} /> : <Play size={18} />}
          {scenarioActive ? 'Stop Simulation' : 'Start Simulation'}
        </button>
      </div>

      {/* Bus Status Cards */}
      {scenarioActive && (
        <div className="mb-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BUS_CONFIGS.map(cfg => {
            const phase = simPhases[cfg.id];
            const loaded = !!simLoaded[cfg.id];
            return (
              <div
                key={cfg.id}
                className="p-3 rounded-xl border-2 transition-all"
                style={{ borderColor: cfg.color + '50', backgroundColor: cfg.color + '0D' }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: cfg.color }} />
                  <span className="text-sm font-bold text-gray-800">{cfg.name}</span>
                  <span className="ml-auto text-xs text-gray-400 flex items-center gap-1">
                    <Users size={11} /> {cfg.students.length}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-1">From <strong>{cfg.origin}</strong></p>
                <p className="text-xs font-semibold" style={{ color: cfg.color }}>
                  {phaseLabel(phase, loaded)}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* All Arrived Banner */}
      {allArrived && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center gap-3">
          <CheckCircle className="text-green-600" size={22} />
          <span className="text-green-800 font-bold text-sm">
            All 4 buses have arrived at Nile University! Journey complete.
          </span>
        </div>
      )}

      {/* Map */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyBjpTeVMERj4TPGN8RU6UOmCtt6nnYVVqk'}
          libraries={['places']}
        >
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: 'calc(100vh - 280px)', minHeight: '600px' }}
            center={mapCenter}
            zoom={mapZoom}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: true,
              zoomControl: true,
              styles: MAP_STYLES,
            }}
          >
            {/* Destination — Nile University */}
            <Marker
              position={DEST}
              icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' }}
              label={{ text: 'Nile Univ.', color: 'white', fontSize: '10px', fontWeight: 'bold' }}
              zIndex={50}
            />

            {scenarioActive && BUS_CONFIGS.map(cfg => (
              <React.Fragment key={cfg.id}>
                {/* Route polyline */}
                {simPaths[cfg.id]?.length > 0 && (
                  <Polyline
                    path={simPaths[cfg.id]}
                    options={{
                      strokeColor: cfg.color,
                      strokeOpacity: 0.65,
                      strokeWeight: 5,
                      geodesic: true,
                      zIndex: 3,
                    }}
                  />
                )}

                {/* Origin marker */}
                <Marker
                  position={cfg.start}
                  icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' }}
                  label={{ text: cfg.origin, color: 'white', fontSize: '9px', fontWeight: 'bold' }}
                  zIndex={10}
                />

                {/* Stop markers */}
                {cfg.stops.map((stop, idx) => (
                  <Marker
                    key={`${cfg.id}_stop_${idx}`}
                    position={stop}
                    icon={
                      typeof window !== 'undefined' && window.google
                        ? {
                            path: window.google.maps.SymbolPath.CIRCLE,
                            fillColor: cfg.color,
                            fillOpacity: 1,
                            strokeWeight: 2,
                            strokeColor: '#FFFFFF',
                            scale: 7,
                          }
                        : undefined
                    }
                    label={{ text: `${idx + 1}`, color: 'white', fontSize: '10px', fontWeight: 'bold' }}
                    zIndex={15}
                  />
                ))}

                {/* Student markers */}
                {cfg.students.map(std => (
                  <Marker
                    key={std.id}
                    position={std.pos}
                    onLoad={m => { if (m) studentMarkersRef.current[std.id] = m; }}
                    icon={
                      typeof window !== 'undefined' && window.google
                        ? {
                            url: '/avatar.png',
                            scaledSize: new window.google.maps.Size(26, 26),
                          }
                        : undefined
                    }
                    zIndex={20}
                  />
                ))}

                {/* Bus marker — starts at origin, moved imperatively */}
                <Marker
                  position={cfg.start}
                  onLoad={m => { if (m) busMarkersRef.current[cfg.id] = m; }}
                  icon={
                    typeof window !== 'undefined' && window.google
                      ? {
                          url: '/bus-marker.png',
                          scaledSize: new window.google.maps.Size(48, 48),
                        }
                      : undefined
                  }
                  zIndex={30}
                />
              </React.Fragment>
            ))}
          </GoogleMap>
        </LoadScript>
      </div>

      {/* Legend */}
      {scenarioActive && (
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          {BUS_CONFIGS.map(cfg => (
            <div key={cfg.id} className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-4 h-1.5 rounded-full" style={{ backgroundColor: cfg.color }} />
              <Bus size={13} style={{ color: cfg.color }} />
              <span>{cfg.name} ({cfg.origin})</span>
            </div>
          ))}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Nile University (Destination)</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveTrackingPage;