<template>
  <div class="info-landing">
    <!-- Header Section -->
    <header class="hero-section">
      <div class="container">
        <div class="row align-items-center min-vh-100">
          <div class="col-lg-6">
            <h1 class="display-4 fw-bold text-primary mb-4">
              Revoluciona tu Servicio de Transporte con WhatsApp
            </h1>
            <p class="lead mb-4">
              La plataforma completa que integra IA, aplicaciones móviles y gestión web para empresas de transporte como Uber e InDriver a través de WhatsApp.
            </p>
            <div class="d-flex flex-wrap gap-3">
              <button class="btn btn-primary btn-lg" @click="scrollToContact">
                <i class="fas fa-play me-2"></i>Solicitar Demo
              </button>
              <button class="btn btn-outline-primary btn-lg" @click="scrollToContact">
                <i class="fas fa-info-circle me-2"></i>Más Información
              </button>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="hero-image-container">
              <img src="/logo.ico" alt="Gorda Driver Platform" class="img-fluid rounded-3 shadow-lg">
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Features Section -->
    <section class="features-section py-5 bg-light">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center mb-5">
            <h2 class="display-5 fw-bold text-dark">¿Qué Ofrecemos?</h2>
            <p class="lead text-muted">Una solución integral para modernizar tu servicio de transporte</p>
          </div>
        </div>
        <div class="row g-4">
          <div class="col-md-4">
            <div class="feature-card h-100 p-4 bg-white rounded-3 shadow-sm">
              <div class="feature-icon mb-3">
                <div class="display-1 text-primary">🤖</div>
              </div>
              <h4 class="fw-bold mb-3">Chatbot con IA</h4>
              <p class="text-muted mb-3">
                Nuestro bot inteligente procesa automáticamente los mensajes de WhatsApp, extrae información del destino usando IA y crea servicios instantáneamente.
              </p>
              <ul class="list-unstyled">
                <li><span class="text-success me-2">✅</span>Procesamiento automático de mensajes</li>
                <li><span class="text-success me-2">✅</span>Extracción inteligente de ubicaciones</li>
                <li><span class="text-success me-2">✅</span>Respuestas automáticas 24/7</li>
              </ul>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-card h-100 p-4 bg-white rounded-3 shadow-sm">
              <div class="feature-icon mb-3">
                <div class="display-1 text-primary">📱</div>
              </div>
              <h4 class="fw-bold mb-3">App Móvil para Conductores</h4>
              <p class="text-muted mb-3">
                Aplicación Android optimizada para que los conductores reciban, acepten y gestionen servicios en tiempo real.
              </p>
              <ul class="list-unstyled">
                <li><span class="text-success me-2">✅</span>Notificaciones push en tiempo real</li>
                <li><span class="text-success me-2">✅</span>GPS integrado y navegación</li>
                <li><span class="text-success me-2">✅</span>Gestión de estado de servicios</li>
              </ul>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-card h-100 p-4 bg-white rounded-3 shadow-sm">
              <div class="feature-icon mb-3">
                <div class="display-1 text-primary">💻</div>
              </div>
              <h4 class="fw-bold mb-3">Panel Web Administrativo</h4>
              <p class="text-muted mb-3">
                Plataforma web completa para gestionar conductores, servicios, métricas y configuraciones de tu empresa.
              </p>
              <ul class="list-unstyled">
                <li><span class="text-success me-2">✅</span>Dashboard con métricas en tiempo real</li>
                <li><span class="text-success me-2">✅</span>Gestión de conductores y usuarios</li>
                <li><span class="text-success me-2">✅</span>Reportes y análisis detallados</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it Works Section -->
    <section class="how-it-works py-5">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center mb-5">
            <h2 class="display-5 fw-bold text-dark">¿Cómo Funciona?</h2>
            <p class="lead text-muted">Un flujo automatizado que simplifica todo el proceso</p>
          </div>
        </div>
        <div class="row g-4">
          <div class="col-lg-3 col-md-6">
            <div class="step-card text-center p-4">
              <div class="step-number mb-3">
                <span class="badge bg-primary fs-4 rounded-circle p-3">1</span>
              </div>
              <h5 class="fw-bold mb-3">Cliente Envía Mensaje</h5>
              <p class="text-muted">
                "Hola, quiero un servicio para el barrio centro"
              </p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="step-card text-center p-4">
              <div class="step-number mb-3">
                <span class="badge bg-primary fs-4 rounded-circle p-3">2</span>
              </div>
              <h5 class="fw-bold mb-3">IA Procesa Solicitud</h5>
              <p class="text-muted">
                Nuestro bot extrae automáticamente la ubicación y crea el servicio
              </p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="step-card text-center p-4">
              <div class="step-number mb-3">
                <span class="badge bg-primary fs-4 rounded-circle p-3">3</span>
              </div>
              <h5 class="fw-bold mb-3">Conductor Acepta</h5>
              <p class="text-muted">
                El servicio aparece en la app y el conductor más cercano lo acepta
              </p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="step-card text-center p-4">
              <div class="step-number mb-3">
                <span class="badge bg-primary fs-4 rounded-circle p-3">4</span>
              </div>
              <h5 class="fw-bold mb-3">Notificación Automática</h5>
              <p class="text-muted">
                El cliente recibe por WhatsApp la placa, color del vehículo y tiempo de llegada
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="benefits-section py-5 bg-primary text-white">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center">
            <h2 class="display-5 fw-bold mb-4">¿Por Qué Elegir Nuestra Plataforma?</h2>
            <p class="lead mb-5">
              Optimiza tu operación y mejora la experiencia de tus clientes con tecnología de vanguardia
            </p>
          </div>
        </div>
        <div class="row g-4">
          <div class="col-md-4 text-center">
            <div class="benefit-item">
              <i class="fas fa-clock display-1 mb-3"></i>
              <h4 class="fw-bold mb-3">Respuesta Instantánea</h4>
              <p>Eliminamos tiempos de espera con respuestas automáticas las 24 horas del día</p>
            </div>
          </div>
          <div class="col-md-4 text-center">
            <div class="benefit-item">
              <i class="fas fa-chart-bar display-1 mb-3"></i>
              <h4 class="fw-bold mb-3">Aumenta Eficiencia</h4>
              <p>Reduce costos operativos y aumenta la productividad de tu flota</p>
            </div>
          </div>
          <div class="col-md-4 text-center">
            <div class="benefit-item">
              <i class="fas fa-comments display-1 mb-3"></i>
              <h4 class="fw-bold mb-3">WhatsApp Nativo</h4>
              <p>Aprovecha la plataforma que tus clientes ya conocen y usan diariamente</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="stats-section py-5">
      <div class="container">
        <div class="row g-4 text-center">
          <div class="col-md-3">
            <div class="stat-item">
              <h3 class="display-4 fw-bold text-primary mb-2">95%</h3>
              <p class="text-muted">Reducción en tiempo de respuesta</p>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-item">
              <h3 class="display-4 fw-bold text-primary mb-2">24/7</h3>
              <p class="text-muted">Disponibilidad del servicio</p>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-item">
              <h3 class="display-4 fw-bold text-primary mb-2">100%</h3>
              <p class="text-muted">Automatización de solicitudes</p>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-item">
              <h3 class="display-4 fw-bold text-primary mb-2">∞</h3>
              <p class="text-muted">Escalabilidad de operaciones</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Technology Section -->
    <section class="technology-section py-5 bg-light">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h2 class="display-5 fw-bold text-dark mb-4">Tecnología de Vanguardia</h2>
            <p class="lead mb-4">
              Desarrollada por expertos en tecnología para empresas de transporte modernas
            </p>
            <ul class="list-unstyled">
              <li class="mb-3">
                <i class="fas fa-check-circle text-success me-3"></i>
                <strong>Inteligencia Artificial:</strong> Procesamiento natural de lenguaje para entender solicitudes
              </li>
              <li class="mb-3">
                <i class="fas fa-check-circle text-success me-3"></i>
                <strong>Cloud Firebase:</strong> Infraestructura escalable y confiable
              </li>
              <li class="mb-3">
                <i class="fas fa-check-circle text-success me-3"></i>
                <strong>API WhatsApp Business:</strong> Integración oficial y certificada
              </li>
              <li class="mb-3">
                <i class="fas fa-check-circle text-success me-3"></i>
                <strong>Tiempo Real:</strong> Sincronización instantánea entre todos los dispositivos
              </li>
            </ul>
          </div>
          <div class="col-lg-6">
            <div class="technology-showcase p-4">
              <div class="bg-white rounded-3 shadow p-4">
                <h5 class="fw-bold mb-3">Arquitectura de la Plataforma</h5>
                <div class="d-flex flex-column gap-3">
                  <div class="tech-item d-flex align-items-center">
                    <i class="fas fa-comments text-success me-3"></i>
                    <span>WhatsApp Business API</span>
                  </div>
                  <div class="tech-item d-flex align-items-center">
                    <i class="fas fa-cog text-primary me-3"></i>
                    <span>Motor de IA y NLP</span>
                  </div>
                  <div class="tech-item d-flex align-items-center">
                    <i class="fas fa-cloud text-info me-3"></i>
                    <span>Firebase Cloud Platform</span>
                  </div>
                  <div class="tech-item d-flex align-items-center">
                    <i class="fas fa-mobile text-warning me-3"></i>
                    <span>App Mobile Android</span>
                  </div>
                  <div class="tech-item d-flex align-items-center">
                    <i class="fas fa-desktop text-secondary me-3"></i>
                    <span>Panel Web Administrativo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact-section py-5 bg-dark text-white">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center">
            <h2 class="display-5 fw-bold mb-4">¿Listo para Revolucionar tu Negocio?</h2>
            <p class="lead mb-5">
              Únete a las empresas que ya están transformando su servicio de transporte con nuestra plataforma
            </p>
            <div class="d-flex flex-wrap justify-content-center gap-3">
              <button class="btn btn-primary btn-lg" @click="scrollToContact">
                <i class="fas fa-phone me-2"></i>Contactar Ventas
              </button>
              <button class="btn btn-outline-light btn-lg">
                <i class="fas fa-envelope me-2"></i>Solicitar Información
              </button>
            </div>
          </div>
        </div>
        <div class="row mt-5 pt-5 border-top border-secondary">
          <div class="col-md-6">
            <h5 class="fw-bold mb-3">Información de Contacto</h5>
            <p class="text-light">
              Estamos aquí para ayudarte a implementar la mejor solución para tu empresa de transporte.
            </p>
            <ul class="list-unstyled">
              <li class="mb-2">
                <i class="fas fa-envelope me-2"></i>
                <span>devalexandrecr@gmail.com</span>
              </li>
              <li class="mb-2">
                <i class="fas fa-phone me-2"></i>
                <span>+57 310 379 4656</span>
              </li>
              <li class="mb-2">
                <i class="fas fa-map-marker me-2"></i>
                <span>Colombia</span>
              </li>
            </ul>
          </div>
          <div class="col-md-6">
            <h5 class="fw-bold mb-3">Características Técnicas</h5>
            <ul class="list-unstyled">
              <li class="mb-2">
                <i class="fas fa-shield me-2 text-success"></i>
                <span>Certificación Meta Tech Provider</span>
              </li>
              <li class="mb-2">
                <i class="fas fa-cloud me-2 text-success"></i>
                <span>Infraestructura Cloud Escalable</span>
              </li>
              <li class="mb-2">
                <i class="fas fa-lock me-2 text-success"></i>
                <span>Seguridad y Encriptación Avanzada</span>
              </li>
              <li class="mb-2">
                <i class="fas fa-chart-bar me-2 text-success"></i>
                <span>Analytics y Reportes en Tiempo Real</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer py-4 bg-black text-white text-center">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <p class="mb-2">&copy; {{ new Date().getFullYear() }} Gorda Driver Platform. Todos los derechos reservados.</p>
            <p class="text-muted small">
              Plataforma certificada para empresas de transporte | WhatsApp Business API Official Partner
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'InfoLanding',
  methods: {
    scrollToContact() {
      const element = document.getElementById('contact')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }
})
</script>

<style scoped>
.info-landing {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.hero-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
}

.hero-image-container {
  position: relative;
}

.hero-image-container::before {
  content: '';
  position: absolute;
  top: -20px;
  left: -20px;
  right: 20px;
  bottom: 20px;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  border-radius: 1rem;
  z-index: -1;
}

.feature-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #e9ecef;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
}

.step-card {
  position: relative;
}

.step-number .badge {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.benefit-item i {
  opacity: 0.9;
}

.stat-item h3 {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.technology-showcase .tech-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid #f8f9fa;
}

.technology-showcase .tech-item:last-child {
  border-bottom: none;
}

.contact-section {
  background: linear-gradient(135deg, #343a40 0%, #212529 100%);
}

.footer {
  border-top: 1px solid #495057;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-section .display-4 {
    font-size: 2.5rem;
  }
  
  .display-5 {
    font-size: 2rem;
  }
  
  .step-card {
    margin-bottom: 2rem;
  }
}

/* Animation for scroll reveal */
.feature-card,
.step-card,
.benefit-item,
.stat-item {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Font Awesome custom sizing */
.fa, .fas, .fab {
  line-height: 1;
}

/* Custom button styles */
.btn-lg {
  padding: 0.75rem 2rem;
  font-weight: 600;
  border-radius: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
}

.btn-outline-primary {
  border: 2px solid #007bff;
  font-weight: 600;
}

.btn-outline-light {
  border: 2px solid #ffffff;
  font-weight: 600;
}
</style>