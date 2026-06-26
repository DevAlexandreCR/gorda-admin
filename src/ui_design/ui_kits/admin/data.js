// Mock data for the Gorda admin UI kit — mirrors the shapes used in the Vue app.
window.GordaData = {
  user: { name: 'Red Blanca', role: 'Administrator' },

  nav: [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-gauge-high' },
    { id: 'services', label: 'Services', icon: 'fas fa-route' },
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
    { id: 6, date: '2026-06-18 09:14', status: 'terminated', start: 'Suba Av. Boyacá', end: 'Calle 100', phone: '+57 311 555 2030', name: 'Pedro Niño', driverName: 'José Marín', origin: 'bot' },
    { id: 7, date: '2026-06-18 08:52', status: 'canceled', start: 'Restrepo', end: 'N/A', phone: '+57 315 555 7781', name: 'Sofía Cano', driverName: '—', origin: 'bot' },
    { id: 8, date: '2026-06-18 08:30', status: 'terminated', start: 'Cl. 53 #25-40', end: 'Galerías', phone: '+57 305 555 6610', name: 'Miguel Ángel', driverName: 'Carlos Ruiz', origin: 'admin' },
    { id: 9, date: '2026-06-17 22:08', status: 'terminated', start: 'Modelia', end: 'Fontibón', phone: '+57 319 555 3344', name: 'Valentina Cruz', driverName: 'Ana López', origin: 'bot' },
  ],

  drivers: [
    { id: 'd1', name: 'Carlos Ruiz', email: 'carlos.ruiz@gorda.co', phone: '+57 301 222 1180', brand: 'Chevrolet', model: 'Spark GT', plate: 'KXT-482', enabled: true, created: '2025-11-03', last: '2 min ago', balance: '$48 000', status: 'online' },
    { id: 'd2', name: 'Ana López', email: 'ana.lopez@gorda.co', phone: '+57 312 884 0021', brand: 'Renault', model: 'Logan', plate: 'HJS-119', enabled: true, created: '2025-09-21', last: '6 min ago', balance: '$12 500', status: 'busy' },
    { id: 'd3', name: 'José Marín', email: 'jose.marin@gorda.co', phone: '+57 320 110 7754', brand: 'Kia', model: 'Picanto', plate: 'FBD-903', enabled: true, created: '2026-01-14', last: '1 h ago', balance: '$0', status: 'offline' },
    { id: 'd4', name: 'Lucía Torres', email: 'lucia.torres@gorda.co', phone: '+57 318 442 9087', brand: 'Hyundai', model: 'Atos', plate: 'GTR-220', enabled: false, created: '2025-07-08', last: '3 d ago', balance: '−$2 000', status: 'offline' },
    { id: 'd5', name: 'Andrés Beltrán', email: 'andres.beltran@gorda.co', phone: '+57 300 996 3310', brand: 'Mazda', model: '2', plate: 'LMN-558', enabled: true, created: '2026-03-22', last: '14 min ago', balance: '$31 200', status: 'online' },
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
