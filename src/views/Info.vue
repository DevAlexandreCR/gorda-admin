<template>
  <div class="info-landing">
    <!-- Hero Section -->
    <header class="hero-section">
      <div class="container">
        <div class="row align-items-center min-vh-100">
          <div class="col-lg-6">
            <h1 class="display-4 fw-bold text-dark mb-4">
              Plataforma de Transporte <span style="color: #FCD34D;">RedBlanca</span>
            </h1>
            <p class="lead mb-4 text-dark">
              Conecta tu empresa de transporte con tus clientes a través de WhatsApp. 
              Gestión inteligente, comunicación directa y experiencia superior.
            </p>
            <div class="d-flex gap-3 flex-wrap">
              <button class="btn btn-warning btn-lg" @click="scrollToContact">
                Comenzar Ahora
              </button>
              <button class="btn btn-outline-warning btn-lg" @click="scrollToContact">
                Contactar Ventas
              </button>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="text-center">
              <img 
                src="/redblanca.ico" 
                alt="RedBlanca Logo" 
                class="img-fluid rounded-circle shadow"
                style="max-width: 300px; background: white; padding: 20px;"
              >
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Features Section -->
    <section class="features-section py-5" style="background-color: #FFFBEB;">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center mb-5">
            <h2 class="display-5 fw-bold text-dark mb-3">Características Principales</h2>
            <p class="lead text-muted">Descubre lo que hace especial a nuestra plataforma</p>
          </div>
        </div>
        <div class="row g-4">
          <div class="col-md-4">
            <div class="feature-card h-100 p-4 bg-white rounded-3 shadow text-center">
              <div class="mb-3">
                <div class="d-inline-flex align-items-center justify-content-center rounded-circle" 
                     style="width: 70px; height: 70px; background: #FCD34D; color: #111827;">
                  <span class="fs-1">🤖</span>
                </div>
              </div>
              <h4 class="fw-bold mb-3" style="color: #1F2937;">Chatbot IA</h4>
              <p class="text-muted">Asistente virtual inteligente que atiende a tus clientes 24/7 a través de WhatsApp. Procesa solicitudes, confirma viajes y mantiene informados a los usuarios automáticamente.</p>
              <div class="mt-3">
                <small class="text-muted d-block">✓ Procesamiento de lenguaje natural</small>
                <small class="text-muted d-block">✓ Respuestas automáticas inteligentes</small>
                <small class="text-muted d-block">✓ Integración completa con WhatsApp</small>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-card h-100 p-4 bg-white rounded-3 shadow text-center">
              <div class="mb-3">
                <div class="d-inline-flex align-items-center justify-content-center rounded-circle" 
                     style="width: 70px; height: 70px; background: #FCD34D; color: #111827;">
                  <span class="fs-1">📱</span>
                </div>
              </div>
              <h4 class="fw-bold mb-3" style="color: #1F2937;">App Móvil</h4>
              <p class="text-muted">Aplicación para conductores con GPS, gestión de viajes y comunicación directa. Interface intuitiva que facilita la operación diaria.</p>
              <div class="mt-3">
                <small class="text-muted d-block">✓ GPS y navegación en tiempo real</small>
                <small class="text-muted d-block">✓ Gestión de viajes y tarifas</small>
                <small class="text-muted d-block">✓ Chat directo con clientes</small>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-card h-100 p-4 bg-white rounded-3 shadow text-center">
              <div class="mb-3">
                <div class="d-inline-flex align-items-center justify-content-center rounded-circle" 
                     style="width: 70px; height: 70px; background: #FCD34D; color: #111827;">
                  <span class="fs-1">💻</span>
                </div>
              </div>
              <h4 class="fw-bold mb-3" style="color: #1F2937;">Panel Admin</h4>
              <p class="text-muted">Dashboard completo para gestionar conductores, clientes y servicios. Control total de tu operación desde una interfaz web moderna.</p>
              <div class="mt-3">
                <small class="text-muted d-block">✓ Monitoreo en tiempo real</small>
                <small class="text-muted d-block">✓ Reportes y analytics</small>
                <small class="text-muted d-block">✓ Gestión de tarifas y promociones</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it Works Section -->
    <section class="how-it-works-section py-5 bg-white">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center mb-5">
            <h2 class="display-5 fw-bold mb-3" style="color: #1F2937;">¿Cómo Funciona?</h2>
            <p class="lead text-muted">Proceso simple en 4 pasos para comenzar</p>
          </div>
        </div>
        <div class="row g-4">
          <div class="col-lg-3 col-md-6">
            <div class="step-card text-center p-4">
              <div class="step-number mb-3">
                <div class="d-inline-flex align-items-center justify-content-center rounded-circle fw-bold"
                     style="width: 70px; height: 70px; background: #FCD34D; color: #111827; font-size: 1.5rem;">
                  1
                </div>
              </div>
              <h5 class="fw-bold mb-3" style="color: #1F2937;">Registro</h5>
              <p class="text-muted">Crea tu cuenta y configura tu empresa en pocos minutos.</p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="step-card text-center p-4">
              <div class="step-number mb-3">
                <div class="d-inline-flex align-items-center justify-content-center rounded-circle fw-bold"
                     style="width: 70px; height: 70px; background: #FCD34D; color: #111827; font-size: 1.5rem;">
                  2
                </div>
              </div>
              <h5 class="fw-bold mb-3" style="color: #1F2937;">Configuración</h5>
              <p class="text-muted">Conecta tu número de WhatsApp Business y personaliza tu chatbot.</p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="step-card text-center p-4">
              <div class="step-number mb-3">
                <div class="d-inline-flex align-items-center justify-content-center rounded-circle fw-bold"
                     style="width: 70px; height: 70px; background: #FCD34D; color: #111827; font-size: 1.5rem;">
                  3
                </div>
              </div>
              <h5 class="fw-bold mb-3" style="color: #1F2937;">Conductores</h5>
              <p class="text-muted">Registra a tus conductores y descarga la app móvil.</p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="step-card text-center p-4">
              <div class="step-number mb-3">
                <div class="d-inline-flex align-items-center justify-content-center rounded-circle fw-bold"
                     style="width: 70px; height: 70px; background: #FCD34D; color: #111827; font-size: 1.5rem;">
                  4
                </div>
              </div>
              <h5 class="fw-bold mb-3" style="color: #1F2937;">¡Listo!</h5>
              <p class="text-muted">Comienza a recibir solicitudes de viaje por WhatsApp.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="benefits-section py-5 bg-white">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center mb-5">
            <h2 class="display-5 fw-bold mb-3" style="color: #1F2937;">¿Por qué elegir RedBlanca?</h2>
            <p class="lead text-muted">Ventajas que nos diferencian de la competencia</p>
          </div>
        </div>
        <div class="row g-4">
          <div class="col-lg-4">
            <div class="d-flex align-items-start">
              <div class="flex-shrink-0 me-3">
                <div class="d-inline-flex align-items-center justify-content-center rounded-circle" 
                     style="width: 50px; height: 50px; background: #FEF3C7; color: #F59E0B;">
                  <span class="fw-bold">✓</span>
                </div>
              </div>
              <div>
                <h5 class="fw-bold" style="color: #1F2937;">Fácil Implementación</h5>
                <p class="text-muted">Configuración rápida en menos de 24 horas. No necesitas conocimientos técnicos.</p>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="d-flex align-items-start">
              <div class="flex-shrink-0 me-3">
                <div class="d-inline-flex align-items-center justify-content-center rounded-circle" 
                     style="width: 50px; height: 50px; background: #FEF3C7; color: #F59E0B;">
                  <span class="fw-bold">✓</span>
                </div>
              </div>
              <div>
                <h5 class="fw-bold" style="color: #1F2937;">Soporte 24/7</h5>
                <p class="text-muted">Equipo técnico disponible las 24 horas para resolver cualquier inconveniente.</p>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="d-flex align-items-start">
              <div class="flex-shrink-0 me-3">
                <div class="d-inline-flex align-items-center justify-content-center rounded-circle" 
                     style="width: 50px; height: 50px; background: #FEF3C7; color: #F59E0B;">
                  <span class="fw-bold">✓</span>
                </div>
              </div>
              <div>
                <h5 class="fw-bold" style="color: #1F2937;">Escalabilidad</h5>
                <p class="text-muted">Crece con tu negocio. Maneja desde 10 hasta 10,000 viajes diarios sin problemas.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials-section py-5" style="background-color: #F8F9FA;">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center mb-5">
            <h2 class="display-5 fw-bold mb-3" style="color: #1F2937;">Lo Que Dicen Nuestros Clientes</h2>
            <p class="lead text-muted">Testimonios reales de empresas que confían en RedBlanca</p>
          </div>
        </div>
        <div class="row g-4">
          <div class="col-lg-4">
            <div class="bg-white p-4 rounded-3 shadow-sm h-100">
              <div class="mb-3">
                <div class="d-flex align-items-center">
                  <div class="d-inline-flex align-items-center justify-content-center rounded-circle me-3"
                       style="width: 50px; height: 50px; background: #FCD34D; color: #111827; font-weight: bold;">
                    JR
                  </div>
                  <div>
                    <h6 class="mb-0 fw-bold" style="color: #1F2937;">Juan Rodríguez</h6>
                    <small class="text-muted">CEO, TransBogotá</small>
                  </div>
                </div>
              </div>
              <p class="text-muted mb-3">"RedBlanca revolucionó nuestra operación. Pasamos de 50 a 200 viajes diarios en solo 3 meses. El chatbot atiende el 80% de las solicitudes automáticamente."</p>
              <div class="text-warning">
                ⭐⭐⭐⭐⭐
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="bg-white p-4 rounded-3 shadow-sm h-100">
              <div class="mb-3">
                <div class="d-flex align-items-center">
                  <div class="d-inline-flex align-items-center justify-content-center rounded-circle me-3"
                       style="width: 50px; height: 50px; background: #FCD34D; color: #111827; font-weight: bold;">
                    MG
                  </div>
                  <div>
                    <h6 class="mb-0 fw-bold" style="color: #1F2937;">María González</h6>
                    <small class="text-muted">Gerente, RápidoValle</small>
                  </div>
                </div>
              </div>
              <p class="text-muted mb-3">"La integración fue súper fácil. En una semana ya teníamos todo funcionando. Nuestros clientes aman poder pedir viajes por WhatsApp."</p>
              <div class="text-warning">
                ⭐⭐⭐⭐⭐
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="bg-white p-4 rounded-3 shadow-sm h-100">
              <div class="mb-3">
                <div class="d-flex align-items-center">
                  <div class="d-inline-flex align-items-center justify-content-center rounded-circle me-3"
                       style="width: 50px; height: 50px; background: #FCD34D; color: #111827; font-weight: bold;">
                    CP
                  </div>
                  <div>
                    <h6 class="mb-0 fw-bold" style="color: #1F2937;">Carlos Pérez</h6>
                    <small class="text-muted">Director, MoveExpress</small>
                  </div>
                </div>
              </div>
              <p class="text-muted mb-3">"El soporte técnico es excepcional. Cualquier duda se resuelve inmediatamente. La plataforma es muy estable y confiable."</p>
              <div class="text-warning">
                ⭐⭐⭐⭐⭐
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="stats-section py-5" style="background-color: #FFFBEB;">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center mb-5">
            <h2 class="display-5 fw-bold mb-3" style="color: #1F2937;">Resultados que Hablan</h2>
            <p class="lead text-muted">Números que demuestran nuestro impacto</p>
          </div>
        </div>
        <div class="row text-center">
          <div class="col-md-3">
            <div class="p-4">
              <h3 class="display-4 fw-bold" style="color: #F59E0B;">500+</h3>
              <p class="text-muted">Empresas Activas</p>
            </div>
          </div>
          <div class="col-md-3">
            <div class="p-4">
              <h3 class="display-4 fw-bold" style="color: #F59E0B;">50K+</h3>
              <p class="text-muted">Viajes Mensuales</p>
            </div>
          </div>
          <div class="col-md-3">
            <div class="p-4">
              <h3 class="display-4 fw-bold" style="color: #F59E0B;">98%</h3>
              <p class="text-muted">Satisfacción Cliente</p>
            </div>
          </div>
          <div class="col-md-3">
            <div class="p-4">
              <h3 class="display-4 fw-bold" style="color: #F59E0B;">24/7</h3>
              <p class="text-muted">Disponibilidad</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Technology Section -->
    <section class="technology-section py-5 bg-white">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center mb-5">
            <h2 class="display-5 fw-bold mb-3" style="color: #1F2937;">Tecnología de Vanguardia</h2>
            <p class="lead text-muted">Impulsado por las mejores tecnologías del mercado</p>
          </div>
        </div>
        <div class="row align-items-center">
          <div class="col-lg-6">
            <div class="technology-showcase p-4">
              <div class="bg-white rounded-3 shadow p-4">
                <h5 class="fw-bold mb-3" style="color: #1F2937;">Arquitectura de la Plataforma</h5>
                <div class="d-flex flex-column gap-3">
                  <div class="tech-item d-flex align-items-center">
                    <div class="d-inline-flex align-items-center justify-content-center me-3"
                         style="width: 40px; height: 40px; background: #25D366; border-radius: 50%;">
                      <span style="color: white; font-weight: bold;">W</span>
                    </div>
                    <span>WhatsApp Business API</span>
                  </div>
                  <div class="tech-item d-flex align-items-center">
                    <div class="d-inline-flex align-items-center justify-content-center me-3"
                         style="width: 40px; height: 40px; background: #FCD34D; border-radius: 50%;">
                      <span style="color: #111827; font-weight: bold;">🤖</span>
                    </div>
                    <span>Motor de IA y NLP</span>
                  </div>
                  <div class="tech-item d-flex align-items-center">
                    <div class="d-inline-flex align-items-center justify-content-center me-3"
                         style="width: 40px; height: 40px; background: #0EA5E9; border-radius: 50%;">
                      <span style="color: white; font-weight: bold;">☁️</span>
                    </div>
                    <span>Firebase Cloud Platform</span>
                  </div>
                  <div class="tech-item d-flex align-items-center">
                    <div class="d-inline-flex align-items-center justify-content-center me-3"
                         style="width: 40px; height: 40px; background: #F59E0B; border-radius: 50%;">
                      <span style="color: white; font-weight: bold;">📱</span>
                    </div>
                    <span>App Mobile Android</span>
                  </div>
                  <div class="tech-item d-flex align-items-center">
                    <div class="d-inline-flex align-items-center justify-content-center me-3"
                         style="width: 40px; height: 40px; background: #10B981; border-radius: 50%;">
                      <span style="color: white; font-weight: bold;">🗺️</span>
                    </div>
                    <span>Google Maps Integration</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="p-4">
              <h4 class="fw-bold mb-4" style="color: #1F2937;">Características Técnicas</h4>
              <ul class="list-unstyled">
                <li class="mb-3">
                  <div class="d-flex align-items-start">
                    <span class="me-2" style="color: #FCD34D;">✓</span>
                    <div>
                      <strong>API RESTful</strong> - Integración fácil con sistemas existentes
                    </div>
                  </div>
                </li>
                <li class="mb-3">
                  <div class="d-flex align-items-start">
                    <span class="me-2" style="color: #FCD34D;">✓</span>
                    <div>
                      <strong>Tiempo Real</strong> - Actualizaciones instantáneas de ubicación
                    </div>
                  </div>
                </li>
                <li class="mb-3">
                  <div class="d-flex align-items-start">
                    <span class="me-2" style="color: #FCD34D;">✓</span>
                    <div>
                      <strong>Seguridad</strong> - Encriptación end-to-end en todas las comunicaciones
                    </div>
                  </div>
                </li>
                <li class="mb-3">
                  <div class="d-flex align-items-start">
                    <span class="me-2" style="color: #FCD34D;">✓</span>
                    <div>
                      <strong>Escalabilidad</strong> - Arquitectura cloud que crece con tu negocio
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section py-5" style="background-color: #F8F9FA;">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center mb-5">
            <h2 class="display-5 fw-bold mb-3" style="color: #1F2937;">Preguntas Frecuentes</h2>
            <p class="lead text-muted">Resolvemos las dudas más comunes</p>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <div class="accordion" id="faqAccordion">
              <div class="accordion-item mb-3 border-0 shadow-sm">
                <h2 class="accordion-header">
                  <button class="accordion-button fw-bold" type="button" style="background-color: #FFFBEB; color: #1F2937;">
                    ¿Cuánto tiempo toma implementar RedBlanca?
                  </button>
                </h2>
                <div class="accordion-collapse collapse show">
                  <div class="accordion-body">
                    La implementación básica toma entre 24-48 horas. Esto incluye la configuración de WhatsApp Business, personalización del chatbot y capacitación del equipo.
                  </div>
                </div>
              </div>
              <div class="accordion-item mb-3 border-0 shadow-sm">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed fw-bold" type="button" style="background-color: #FFFBEB; color: #1F2937;">
                    ¿Necesito conocimientos técnicos?
                  </button>
                </h2>
                <div class="accordion-collapse collapse">
                  <div class="accordion-body">
                    No, RedBlanca está diseñado para ser usado por cualquier persona. Nuestro equipo se encarga de toda la configuración técnica y te capacitamos en el uso de la plataforma.
                  </div>
                </div>
              </div>
              <div class="accordion-item mb-3 border-0 shadow-sm">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed fw-bold" type="button" style="background-color: #FFFBEB; color: #1F2937;">
                    ¿Cuántos viajes puede manejar la plataforma?
                  </button>
                </h2>
                <div class="accordion-collapse collapse">
                  <div class="accordion-body">
                    RedBlanca puede escalar desde pequeñas operaciones (10-50 viajes/día) hasta grandes empresas (10,000+ viajes/día). La infraestructura cloud se adapta automáticamente.
                  </div>
                </div>
              </div>
              <div class="accordion-item mb-3 border-0 shadow-sm">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed fw-bold" type="button" style="background-color: #FFFBEB; color: #1F2937;">
                    ¿Qué sucede si tengo problemas técnicos?
                  </button>
                </h2>
                <div class="accordion-collapse collapse">
                  <div class="accordion-body">
                    Ofrecemos soporte técnico 24/7 a través de WhatsApp, email y teléfono. Nuestro equipo de ingenieros resuelve cualquier inconveniente en tiempo real.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact-section py-5">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center">
            <h2 class="display-5 fw-bold mb-3" style="color: #FCD34D;">¡Contáctanos Hoy!</h2>
            <p class="lead mb-4">¿Listo para revolucionar tu empresa de transporte?</p>
            <div class="d-flex justify-content-center gap-3 flex-wrap">
              <button class="btn btn-lg" 
                      style="background-color: #FCD34D; border-color: #FCD34D; color: #111827; font-weight: 600;">
                Solicitar Demo
              </button>
              <button class="btn btn-outline-light btn-lg" 
                      style="border-color: #FCD34D; color: #FCD34D; font-weight: 600;">
                Más Información
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer py-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-4 mb-4">
            <div class="d-flex align-items-center mb-3">
              <img src="/redblanca.ico" alt="RedBlanca" style="width: 40px; height: 40px;" class="me-2">
              <h5 class="mb-0 fw-bold" style="color: #FCD34D;">RedBlanca</h5>
            </div>
            <p class="text-light">Plataforma líder en gestión de transporte a través de WhatsApp. Conectamos empresas con sus clientes de manera inteligente.</p>
          </div>
          <div class="col-lg-2 col-md-6 mb-4">
            <h6 class="fw-bold mb-3" style="color: #FCD34D;">Producto</h6>
            <ul class="list-unstyled">
              <li><a href="#" class="text-light text-decoration-none">Características</a></li>
              <li><a href="#" class="text-light text-decoration-none">Precios</a></li>
              <li><a href="#" class="text-light text-decoration-none">Demo</a></li>
            </ul>
          </div>
          <div class="col-lg-2 col-md-6 mb-4">
            <h6 class="fw-bold mb-3" style="color: #FCD34D;">Soporte</h6>
            <ul class="list-unstyled">
              <li><a href="#" class="text-light text-decoration-none">Documentación</a></li>
              <li><a href="#" class="text-light text-decoration-none">Ayuda</a></li>
              <li><a href="#" class="text-light text-decoration-none">Contacto</a></li>
            </ul>
          </div>
          <div class="col-lg-4 mb-4">
            <h6 class="fw-bold mb-3" style="color: #FCD34D;">Contacto</h6>
            <p class="text-light mb-2">📧 info@redblanca.com</p>
            <p class="text-light mb-2">📱 WhatsApp: +57 300 123 4567</p>
            <p class="text-light">🏢 Bogotá, Colombia</p>
          </div>
        </div>
        <hr style="border-color: #FCD34D; opacity: 0.3;">
        <div class="row">
          <div class="col-12 text-center">
            <p class="mb-0 text-light">&copy; 2024 RedBlanca. Todos los derechos reservados. | Plataforma certificada por Meta Business</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Info',
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

<style>
.info-landing {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.hero-section {
  background: linear-gradient(135deg, #FFFBEB 0%, #FFFFFF 100%);
  min-height: 100vh;
  padding: 2rem 0;
}

.feature-card {
  border: 1px solid #dee2e6;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(252, 211, 77, 0.2);
  border-color: #FCD34D;
}

.contact-section {
  background: linear-gradient(135deg, #1F2937 0%, #111827 100%);
  color: white;
}

.footer {
  background-color: #111827;
  color: white;
  border-top: 3px solid #FCD34D;
}

/* Botones personalizados */
.btn-redblanca {
  background-color: #FCD34D;
  border-color: #FCD34D;
  color: #111827;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-redblanca:hover {
  background-color: #F59E0B;
  border-color: #F59E0B;
  color: #111827;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(252, 211, 77, 0.3);
}

.btn-outline-redblanca {
  border: 2px solid #FCD34D;
  color: #FCD34D;
  background: transparent;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-outline-redblanca:hover {
  background-color: #FCD34D;
  color: #1F2937;
  transform: translateY(-2px);
}

/* Animaciones */
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

.feature-card,
.step-card,
.testimonials-section .bg-white {
  animation: fadeInUp 0.6s ease-out;
}

/* Technology section */
.tech-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid #f8f9fa;
}

.tech-item:last-child {
  border-bottom: none;
}

/* Testimonials */
.testimonials-section .bg-white:hover {
  transform: translateY(-3px);
  transition: transform 0.3s ease;
}

/* FAQ Accordion */
.accordion-button:not(.collapsed) {
  background-color: #FCD34D !important;
  color: #111827 !important;
}

.accordion-button:focus {
  border-color: #FCD34D;
  box-shadow: 0 0 0 0.25rem rgba(252, 211, 77, 0.25);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-section .display-4 {
    font-size: 2.5rem;
  }
  
  .display-5 {
    font-size: 2rem;
  }
}
</style>