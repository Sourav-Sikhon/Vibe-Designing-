/** Demonstration data for the network map. Nothing here is connected to real vehicles or fleets. */
export type Layer = "drone" | "robot" | "vehicle" | "warehouse";

export type Pt = [number, number];

export type Route = {
  id: string;
  layer: "drone" | "robot" | "vehicle";
  from: string;
  path: Pt[];
  marker: Pt;
  status: string;
  eta: string;
  payload: string;
  dur: number;
};

export const WAREHOUSES: Array<{ id: string; name: string; at: Pt; load: string }> = [
  { id: "W1", name: "Hub W1 · North Quay", at: [192, 192], load: "Sorting 38 parcels" },
  { id: "W2", name: "Hub W2 · Central", at: [512, 112], load: "Dispatching 12 routes" },
  { id: "W3", name: "Hub W3 · Eastside", at: [912, 192], load: "Sorting 21 parcels" },
  { id: "W4", name: "Hub W4 · Harbour", at: [272, 512], load: "Loading 4 vehicles" },
  { id: "W5", name: "Hub W5 · Midtown", at: [672, 512], load: "Dispatching 9 routes" },
  { id: "W6", name: "Hub W6 · Southgate", at: [1072, 432], load: "Idle · capacity open" },
];

export const ROUTES: Route[] = [
  { id: "V-101", layer: "vehicle", from: "W1", path: [[192, 192], [192, 352], [432, 352], [432, 432]], marker: [352, 352], status: "En route", eta: "11 min", payload: "14 parcels", dur: 14 },
  { id: "V-102", layer: "vehicle", from: "W2", path: [[512, 112], [512, 272], [752, 272], [752, 352]], marker: [592, 272], status: "En route", eta: "8 min", payload: "9 parcels", dur: 13 },
  { id: "V-103", layer: "vehicle", from: "W5", path: [[672, 512], [672, 432], [912, 432], [912, 352]], marker: [832, 432], status: "Delivering", eta: "3 min", payload: "6 parcels", dur: 12 },
  { id: "V-104", layer: "vehicle", from: "W4", path: [[272, 512], [432, 512], [432, 592], [592, 592]], marker: [432, 552], status: "En route", eta: "9 min", payload: "11 parcels", dur: 12 },
  { id: "V-105", layer: "vehicle", from: "W3", path: [[912, 192], [912, 272], [1072, 272], [1072, 352]], marker: [992, 272], status: "En route", eta: "6 min", payload: "7 parcels", dur: 11 },
  { id: "D-201", layer: "drone", from: "W2", path: [[512, 112], [272, 112]], marker: [392, 112], status: "In flight", eta: "4 min", payload: "1 parcel", dur: 7 },
  { id: "D-202", layer: "drone", from: "W5", path: [[672, 512], [912, 592]], marker: [792, 552], status: "In flight", eta: "5 min", payload: "1 parcel", dur: 8 },
  { id: "D-203", layer: "drone", from: "W3", path: [[912, 192], [1072, 112]], marker: [992, 152], status: "Departing", eta: "3 min", payload: "1 parcel", dur: 6 },
  { id: "R-301", layer: "robot", from: "W1", path: [[192, 192], [112, 192], [112, 272]], marker: [112, 232], status: "Sidewalk route", eta: "7 min", payload: "1 parcel", dur: 9 },
  { id: "R-302", layer: "robot", from: "W4", path: [[272, 512], [192, 512], [192, 432]], marker: [192, 472], status: "Sidewalk route", eta: "6 min", payload: "1 parcel", dur: 9 },
  { id: "R-303", layer: "robot", from: "W6", path: [[1072, 432], [1152, 432], [1152, 512]], marker: [1152, 472], status: "Arriving", eta: "1 min", payload: "1 parcel", dur: 8 },
  { id: "R-304", layer: "robot", from: "W5", path: [[672, 512], [592, 512], [592, 432]], marker: [592, 472], status: "Sidewalk route", eta: "5 min", payload: "1 parcel", dur: 9 },
];

export const FEED: string[] = [
  "Package PKG-48213 picked up at Hub W2",
  "Drone D-201 departed Hub W2",
  "Vehicle V-103 handed parcel to Robot R-304",
  "Route recalculated around sample road closure",
  "Package PKG-48177 delivered · confirmation sent",
  "Hub W5 sorted 24 parcels",
  "Robot R-303 arriving at destination",
  "Vehicle V-105 left Hub W3",
  "Drone D-203 completed pre-flight check",
  "Hub W6 capacity opened for new orders",
  "Package PKG-48240 scanned at Hub W1",
  "Vehicle V-102 on schedule",
];

export const DEMO_STATS = [
  { k: "Active fleet", v: "248" },
  { k: "Deliveries in progress", v: "1,284" },
  { k: "Connected hubs", v: "36" },
  { k: "Network status", v: "Operational" },
];

export const pathD = (p: Pt[]) => p.map((pt, i) => `${i ? "L" : "M"}${pt[0]} ${pt[1]}`).join(" ");
