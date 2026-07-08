// Mock data for the Gorda admin UI kit — mirrors the shapes used in the Vue app.
window.GordaData = {
  user: { name: 'Red Blanca', role: 'Administrator' },

  nav: [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-gauge-high' },
    { id: 'users', label: 'Usuarios', icon: 'fa-solid fa-users' },
    { id: 'drivers', label: 'Drivers', icon: 'fa-solid fa-car-side' },
    { id: 'vehicles', label: 'Vehicles', icon: 'fa-solid fa-car' },
    { id: 'places', label: 'Places', icon: 'fas fa-location-dot' },
    { id: 'whatsapp', label: 'WhatsApp', icon: 'fa-brands fa-whatsapp', status: true },
    { id: 'metrics', label: 'Metrics', icon: 'fa-solid fa-chart-pie' },
    { id: 'settings', label: 'Settings', icon: 'fa-solid fa-screwdriver-wrench' },
  ],

  // Services lifecycle — pending / in_progress / history(terminated|canceled)
  pendings: [
    { id: 1, a_go: '2 min', status: 'pending', start: 'Cra. 7 #45-12, Chapinero', end: 'Aeropuerto El Dorado', phone: '+57 301 555 0192', name: 'María Gómez', comment: 'Tiene dos maletas', origin: 'bot', applicants: 2 },
    { id: 2, a_go: '5 min', status: 'pending', start: 'Cl. 80 #14-20', end: 'N/A', phone: '+57 312 555 8841', name: 'Andrés Patiño', comment: 'N/A', origin: 'bot', applicants: 0 },
    { id: 3, a_go: '8 min', status: 'pending', start: 'Centro Comercial Andino', end: 'Usaquén', phone: '+57 320 555 1107', name: 'Laura Méndez', comment: 'Frente a la entrada norte', origin: 'admin', applicants: 1 },
  ],
  inProgress: [
    { id: 4, a_go: '12 min', status: 'in_progress', start: 'Cl. 26 #68-35', end: 'Terminal de Transportes', phone: '+57 318 555 4420', name: 'Jorge Salazar', comment: 'N/A', driver: 'Carlos Ruiz', origin: 'bot' },
    { id: 5, a_go: '18 min', status: 'in_progress', start: 'Parque de la 93', end: 'Zona T', phone: '+57 300 555 9963', name: 'Diana Rojas', comment: 'Pago en efectivo', driver: 'Ana López', origin: 'admin' },
  ],
  history: [
    {
      id: 6, date: '2026-06-18 09:14', status: 'terminated', start: 'Suba Av. Boyacá', end: 'Calle 100',
      phone: '+57 311 555 2030', name: 'Pedro Niño', comment: 'N/A', driverName: 'José Marín', origin: 'bot',
      originLabel: 'WhatsApp Bot', plate: 'FBD-903', time: '6min', distance: '5.2km', value: '9200COP',
      discounted: '920COP', multiplier: '1.0', assignedBy: 'Super Admin', createdBy: 'WhatsApp Bot',
      timeline: { hora: '09:14:02', llegada: '09:20:58', inicio: '09:21:26', fin: '09:27:05' },
    },
    {
      id: 7, date: '2026-06-18 08:52', status: 'canceled', start: 'Restrepo', end: 'N/A',
      phone: '+57 315 555 7781', name: 'Sofía Cano', comment: 'Cliente canceló el servicio', driverName: '—', origin: 'bot',
      originLabel: 'WhatsApp Bot', plate: 'N/A', time: 'N/A', distance: 'N/A', value: '0COP',
      discounted: '0COP', multiplier: '—', assignedBy: '—', createdBy: 'WhatsApp Bot',
      timeline: { hora: '08:52:00', llegada: null, inicio: null, fin: null },
    },
    {
      id: 8, date: '2026-06-18 08:30', status: 'terminated', start: 'Cl. 53 #25-40', end: 'Galerías',
      phone: '+57 305 555 6610', name: 'Miguel Ángel', comment: 'N/A', driverName: 'Carlos Ruiz', origin: 'admin',
      originLabel: 'Panel admin · Super Admin', plate: 'KXT-482', time: '4min', distance: '3.1km', value: '7400COP',
      discounted: '740COP', multiplier: '1.1', assignedBy: 'Super Admin', createdBy: 'Panel admin · Super Admin',
      timeline: { hora: '08:30:14', llegada: '08:34:40', inicio: '08:35:02', fin: '08:39:11' },
    },
    {
      id: 9, date: '2026-06-17 22:08', status: 'terminated', start: 'Modelia', end: 'Fontibón',
      phone: '+57 319 555 3344', name: 'Valentina Cruz', comment: 'Pago en efectivo', driverName: 'Ana López', origin: 'bot',
      originLabel: 'WhatsApp Bot', plate: 'HJS-119', time: '9min', distance: '6.4km', value: '11500COP',
      discounted: '1150COP', multiplier: '1.2', assignedBy: 'Super Admin', createdBy: 'WhatsApp Bot',
      timeline: { hora: '22:08:20', llegada: '22:16:47', inicio: '22:17:15', fin: '22:26:32' },
    },
  ],

  drivers: [
    { id: 'd1', name: 'Carlos Ruiz', email: 'carlos.ruiz@gorda.co', phone: '+57 301 222 1180', brand: 'Chevrolet', model: 'Spark GT', plate: 'KXT-482', enabled: true, created: '2025-11-03', last: '2 min ago', balance: '$48 000', status: 'online' },
    { id: 'd2', name: 'Ana López', email: 'ana.lopez@gorda.co', phone: '+57 312 884 0021', brand: 'Renault', model: 'Logan', plate: 'HJS-119', enabled: true, created: '2025-09-21', last: '6 min ago', balance: '$12 500', status: 'busy' },
    { id: 'd3', name: 'José Marín', email: 'jose.marin@gorda.co', phone: '+57 320 110 7754', brand: 'Kia', model: 'Picanto', plate: 'FBD-903', enabled: true, created: '2026-01-14', last: '1 h ago', balance: '$0', status: 'offline' },
    { id: 'd4', name: 'Lucía Torres', email: 'lucia.torres@gorda.co', phone: '+57 318 442 9087', brand: 'Hyundai', model: 'Atos', plate: 'GTR-220', enabled: false, created: '2025-07-08', last: '3 d ago', balance: '−$2 000', status: 'offline' },
    { id: 'd5', name: 'Andrés Beltrán', email: 'andres.beltran@gorda.co', phone: '+57 300 996 3310', brand: 'Mazda', model: '2', plate: 'LMN-558', enabled: true, created: '2026-03-22', last: '14 min ago', balance: '$31 200', status: 'online' },
  ],

  // WhatsApp/admin lines a service can be created from
  adminLines: [
    { id: 'l1', label: 'Admin · 5731731030' },
    { id: 'l2', label: 'Admin · 5731731031' },
    { id: 'l3', label: 'Soporte · 5731731040' },
  ],

  users: [
    { id: 'u1', name: 'Admin User',           email: 'admin@admin.com',              phone: '+1000000000',      role: 'Administrador', enabled: true,  created: '2026-06-28' },
    { id: 'u2', name: 'Natalia Central',       email: 'natalia2025@gmail.com',        phone: '+573113939002',    role: 'Operador',      enabled: false, created: '2025-05-02' },
    { id: 'u3', name: 'Dayana Central',        email: 'lopezdayana923@gmail.com',     phone: '+57 314 8066396',  role: 'Operador',      enabled: true,  created: '2025-04-29' },
    { id: 'u4', name: 'Rocío Central',         email: 'brocco2708@gmail.com',         phone: '+573105073146',    role: 'Operador',      enabled: true,  created: '2025-04-28' },
    { id: 'u5', name: 'Camilo Central',        email: 'camilo2025@gmail.com',         phone: '+573155914008',    role: 'Operador',      enabled: true,  created: '2025-04-28' },
    { id: 'u6', name: 'User Desarrolladores',  email: 'yoalecam@hotmail.com',         phone: '+573113113030',    role: 'Administrador', enabled: true,  created: '2025-02-16' },
    { id: 'u7', name: '511 Red Blanca Pop',    email: 'redblancapopayan2@gmail.com',  phone: '3202275367',       role: 'Administrador', enabled: true,  created: '2023-01-08' },
    { id: 'u8', name: 'Super Admin',           email: 'devalexandrecr@gmail.com',     phone: '3103794656',       role: 'Administrador', enabled: true,  created: '2022-07-03' },
  ],

  stats: [
    { label: 'Services today', value: '248', icon: 'fas fa-route', color: 'info', delta: '12%', up: true },
    { label: 'Active drivers', value: '36', icon: 'fa-solid fa-car-side', color: 'primary', delta: '3', up: true },
    { label: 'In progress', value: '7', icon: 'fas fa-spinner', color: 'warning', delta: '2', up: true },
    { label: 'Avg. wait', value: '4.2m', icon: 'fas fa-clock', color: 'success', delta: '0.8m', up: false },
  ],

  vehicles: [
    { id: 'v1',  plate: '421J',    brand: 'Kia',       model: 'Morning',      year: 2009, color: { name: 'white',  hex: '#FFFFFF' }, enabled: true,  linkedDrivers: [{ id: 'd1', name: 'Carlos Ruiz',      selectable: true  }], created: '2026-06-15', soat: '2025-03-12', tec: '2026-01-08', photoUrl: null },
    { id: 'v2',  plate: 'AAA123',  brand: 'Vehículo',  model: 'Xxx',          year: 2026, color: { name: 'black',  hex: '#000000' }, enabled: true,  linkedDrivers: [{ id: 'd2', name: 'Nombre Completo',   selectable: true  }, { id: 'd3', name: 'Alexander Camilo R', selectable: false }], created: '2026-06-15', soat: '2023-08-03', tec: '2026-02-03', photoUrl: null },
    { id: 'v3',  plate: 'AAK167',  brand: 'Chevrolet', model: 'Sail',         year: 2015, color: { name: 'red',    hex: '#EF233C' }, enabled: true,  linkedDrivers: [{ id: 'd4', name: 'Lucía Torres',      selectable: true  }], created: '2026-06-15', soat: '2026-05-20', tec: '2025-11-30', photoUrl: null },
    { id: 'v4',  plate: 'ABN530',  brand: 'Hyundai',   model: 'Getz',         year: 2010, color: { name: 'black',  hex: '#000000' }, enabled: true,  linkedDrivers: [{ id: 'd5', name: 'Andrés Beltrán',    selectable: true  }], created: '2026-06-15', soat: '2026-09-14', tec: '2026-04-22', photoUrl: null },
    { id: 'v5',  plate: 'ABN618',  brand: 'Kia',       model: 'Picanto',      year: 2025, color: { name: 'blue',   hex: '#2152FF' }, enabled: true,  linkedDrivers: [{ id: 'd1', name: 'Carlos Ruiz',      selectable: false }], created: '2026-06-15', soat: '2027-01-01', tec: '2027-01-01', photoUrl: null },
    { id: 'v6',  plate: 'ABP510',  brand: 'Chevrolet', model: 'Spark',        year: 2009, color: { name: 'blue',   hex: '#2152FF' }, enabled: true,  linkedDrivers: [{ id: 'd2', name: 'Ana López',         selectable: true  }], created: '2026-06-15', soat: '2025-07-18', tec: '2025-08-05', photoUrl: null },
    { id: 'v7',  plate: 'ABU004',  brand: 'Spark',     model: 'Go',           year: 2010, color: { name: 'silver', hex: '#C0C0C0' }, enabled: false, linkedDrivers: [],                                                                                                                                     created: '2026-06-15', soat: '2024-11-02', tec: '2024-09-17', photoUrl: null },
    { id: 'v8',  plate: 'AUT591J', brand: 'Chevrolet', model: 'Spartak Go',   year: 2007, color: { name: 'gray',   hex: '#808080' }, enabled: true,  linkedDrivers: [{ id: 'd3', name: 'José Marín',        selectable: true  }], created: '2026-06-15', soat: '2026-03-08', tec: '2026-06-01', photoUrl: null },
    { id: 'v9',  plate: 'BCR220',  brand: 'Renault',   model: 'Logan',        year: 2018, color: { name: 'white',  hex: '#FFFFFF' }, enabled: true,  linkedDrivers: [{ id: 'd5', name: 'Andrés Beltrán',    selectable: false }], created: '2026-06-14', soat: '2026-10-11', tec: '2026-07-25', photoUrl: null },
    { id: 'v10', plate: 'BDS441',  brand: 'Mazda',     model: 'Cx-3',         year: 2022, color: { name: 'red',    hex: '#EF233C' }, enabled: false, linkedDrivers: [{ id: 'd4', name: 'Lucía Torres',      selectable: false }], created: '2026-06-14', soat: '2023-12-31', tec: '2023-10-15', photoUrl: null },
  ],

  // Drivers currently online, shown on the Mapa tab
  mapDrivers: [
    { plate: 'COL253', name: 'Carlos Ruiz',      status: 'available' },
    { plate: 'CUM576', name: 'Ana López',        status: 'available' },
    { plate: 'DLR271', name: 'José Marín',       status: 'busy' },
    { plate: 'UGT137', name: 'Lucía Torres',     status: 'available' },
    { plate: 'RHM992', name: 'Andrés Beltrán',   status: 'busy' },
    { plate: 'KFL342', name: 'Camilo Restrepo',  status: 'available' },
    { plate: 'KDR542', name: 'Diana Rojas',      status: 'available' },
    { plate: 'JZW617', name: 'Jorge Salazar',    status: 'in_service' },
    { plate: 'KIS454', name: 'Laura Méndez',     status: 'available' },
    { plate: 'CP0991', name: 'Miguel Ángel',     status: 'in_service' },
    { plate: 'VAQ346', name: 'Sofía Cano',       status: 'available' },
    { plate: 'DCA350', name: 'Pedro Niño',       status: 'in_service' },
    { plate: 'KDS717', name: 'Valentina Cruz',   status: 'busy' },
    { plate: 'KPX617', name: 'Andrés Patiño',    status: 'available' },
    { plate: 'KXV590A', name: 'María Gómez',     status: 'available' },
    { plate: 'JBN173', name: 'Alexander Camilo', status: 'available' },
  ],

  // Places of interest pinned on the Places map (name, coords, category)
  places: [
    { id: 'p1',  name: 'Edificio Alcázar',              lat: 2.4489, lng: -76.6063, category: 'edificio' },
    { id: 'p2',  name: 'Mirador El Bosque',              lat: 2.4512, lng: -76.6021, category: 'foto' },
    { id: 'p3',  name: 'Chocolatería La Cascada',        lat: 2.4468, lng: -76.6098, category: 'comercio' },
    { id: 'p4',  name: 'Agroinsumos El Campo',           lat: 2.4441, lng: -76.6112, category: 'comercio' },
    { id: 'p5',  name: 'Galería San Nicolás',            lat: 2.4455, lng: -76.6135, category: 'foto' },
    { id: 'p6',  name: 'Conjunto Los Pinos',             lat: 2.4498, lng: -76.6145, category: 'edificio' },
    { id: 'p7',  name: 'Clínica Santa Victoria',         lat: 2.4523, lng: -76.6089, category: 'salud' },
    { id: 'p8',  name: "Gym Vitalfit",                   lat: 2.4479, lng: -76.6072, category: 'deporte' },
    { id: 'p9',  name: 'Panadería Los Kioskos',          lat: 2.4462, lng: -76.6055, category: 'restaurante' },
    { id: 'p10', name: 'Comando de Policía Norte',       lat: 2.4531, lng: -76.6118, category: 'seguridad' },
    { id: 'p11', name: 'Restaurante Las Brasas',         lat: 2.4447, lng: -76.6041, category: 'restaurante' },
    { id: 'p12', name: 'Hostal El Valle',                lat: 2.4507, lng: -76.6155, category: 'hotel' },
    { id: 'p13', name: 'Carrera 3 con Calle 1',          lat: 2.4419, lng: -76.6079, category: 'otro' },
    { id: 'p14', name: 'Granero Mercatodo',              lat: 2.4433, lng: -76.6132, category: 'comercio' },
    { id: 'p15', name: 'Asadero Santiago',               lat: 2.4491, lng: -76.6169, category: 'restaurante' },
    { id: 'p16', name: 'Finca Vista Hermosa',            lat: 2.4552, lng: -76.6098, category: 'finca' },
    { id: 'p17', name: 'Urbanización Los Álamos',        lat: 2.4405, lng: -76.6165, category: 'edificio' },
    { id: 'p18', name: 'Rincón del Río',                 lat: 2.4467, lng: -76.6188, category: 'foto' },
    { id: 'p19', name: 'Supertiendas El Ahorro',         lat: 2.4485, lng: -76.6202, category: 'comercio' },
    { id: 'p20', name: 'Colegio San Camilo',             lat: 2.4517, lng: -76.6045, category: 'educacion' },
  ],

  // Métricas view — monthly service volume, cancellation trend, top plates leaderboard
  metrics: {
    monthly: [
      { m: 'Ene', total: 29500, completed: 22200, canceled: 7300 },
      { m: 'Feb', total: 28100, completed: 21300, canceled: 6800 },
      { m: 'Mar', total: 32400, completed: 23700, canceled: 8700 },
      { m: 'Abr', total: 29800, completed: 22900, canceled: 6900 },
      { m: 'May', total: 31200, completed: 24100, canceled: 7100 },
      { m: 'Jun', total: 30500, completed: 23600, canceled: 6900 },
      { m: 'Jul', total: 2100,  completed: 1700,  canceled: 400  },
    ],
    topPlates: {
      diario:  [{ plate: 'FPK979', value: 18 },  { plate: 'IUA794', value: 14 },  { plate: 'DCA350', value: 11 },  { plate: 'LCI875', value: 9 },   { plate: 'CPO991', value: 7 }],
      semanal: [{ plate: 'FPK979', value: 92 },  { plate: 'LCI875', value: 81 },  { plate: 'IUA794', value: 77 },  { plate: 'CPO991', value: 69 },  { plate: 'DCA350', value: 58 }],
      mensual: [{ plate: 'FPK979', value: 340 }, { plate: 'IUA794', value: 305 }, { plate: 'LCI875', value: 298 }, { plate: 'DCA350', value: 276 }, { plate: 'CPO991', value: 240 }],
    },

    // Ingresos: comisión = % descontado por servicio a conductores SIN mensualidad;
    // mensualidad = cuota fija mensual de conductores que sí la pagan (no se les cobra por servicio).
    revenue: {
      monthly: [
        { m: 'Ene', comision: 4180000, mensualidad: 3750000 },
        { m: 'Feb', comision: 3960000, mensualidad: 3750000 },
        { m: 'Mar', comision: 4560000, mensualidad: 3900000 },
        { m: 'Abr', comision: 4190000, mensualidad: 3900000 },
        { m: 'May', comision: 4380000, mensualidad: 3900000 },
        { m: 'Jun', comision: 4270000, mensualidad: 3900000 },
        { m: 'Jul', comision: 310000,  mensualidad: 3900000 },
      ],
      comisionDrivers: 41,
      mensualidadDrivers: 26,
      mensualidadFee: 150000,
    },
  },

  confirmations: [
    { key: 'new_service', label: 'New service created', on: true },
    { key: 'driver_assigned', label: 'Driver assigned', on: true },
    { key: 'driver_arrived', label: 'Driver has arrived', on: false },
    { key: 'trip_ended', label: 'Trip completed', on: true },
  ],
  chatbot: [
    { key: 'welcome', label: 'Welcome message', on: true },
    { key: 'ask_pickup', label: 'Ask for pickup location', on: true },
    { key: 'ask_destination', label: 'Ask for destination', on: false },
    { key: 'assistant', label: 'AI Assistant replies', on: true },
  ],
};
