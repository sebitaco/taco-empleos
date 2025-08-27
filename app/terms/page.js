"use client";

import Navigation from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect } from "react";

export default function TerminosCondiciones() {
  // Anti-bot and anti-indexing protection
  useEffect(() => {
    // Set meta tags to prevent indexing
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow, noarchive, nosnippet, noimageindex, nocache';
    document.head.appendChild(metaRobots);

    // Block common bot user agents
    const userAgent = navigator.userAgent.toLowerCase();
    const botPatterns = [
      'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider', 
      'yandexbot', 'facebookexternalhit', 'twitterbot', 'linkedinbot',
      'whatsapp', 'crawler', 'spider', 'scraper', 'bot'
    ];
    
    if (botPatterns.some(pattern => userAgent.includes(pattern))) {
      window.location.href = '/';
      return;
    }

    // Disable right-click context menu
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    // Disable text selection
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    // Cleanup function
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      if (metaRobots.parentNode) {
        metaRobots.parentNode.removeChild(metaRobots);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Términos y Condiciones
          </h1>
          
          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            {/* Introducción */}
            <section className="space-y-4">
              <div className="space-y-4 text-justify leading-relaxed">
                <p>
                  Esta sección establece los términos y condiciones (en
                  adelante, los "Términos y Condiciones") para el uso de los
                  contenidos y servicios (en adelante, los "Servicios") del
                  sitio web www.tacoempleos.com.mx (en adelante, el "Sitio
                  Web"). El Sitio Web y los Servicios son prestados por
                  TacoEmpleos (en adelante, "TACOEMPLEOS"). Por favor, tome el
                  tiempo suficiente para leer estos Términos y Condiciones
                  detenidamente.
                </p>
                <p>
                  Al aceptar estos Términos y Condiciones, Usted (el "Usuario"):
                  a) afirma que libremente ha leído todos los enunciados, y b)
                  que estos enunciados los tiene por notificados, entendidos y
                  aceptados en cumplimiento con la normativa aplicable.
                </p>
                <p>
                  En caso de no estar de acuerdo con los Términos y Condiciones,
                  le solicitamos que por favor abandone el Sitio Web y se
                  abstenga de utilizar los Servicios que se ofrecen allí. La
                  registración por el usuario en el Sitio Web requiere la
                  aceptación plena y sin reservas de los Términos y Condiciones
                  aquí establecidos, y su adhesión irrestricta a los mismos.
                </p>
                <p>
                  En adelante, los términos "Usted" y "Usuario" serán utilizados
                  para hacer referencia a todas las personas físicas y/o
                  jurídicas que por cualquier razón accedan al Sitio Web. El
                  término "Servicios" se refiere a todos los servicios y/o
                  productos ofrecidos por TACOEMPLEOS o cualquier compañía
                  relacionada al Usuario.
                </p>
              </div>
            </section>

            {/* Sección 1 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4">
                1. TÉRMINOS Y CONDICIONES Y SU ACEPTACIÓN
              </h2>
              <div className="space-y-4 text-justify leading-relaxed">
                <p>
                  <strong>1.1. Acceso al Sitio Web</strong>
                </p>
                <p>
                  El acceso y utilización del Sitio Web no exige la previa
                  suscripción o registro del Usuario. Sin embargo, es posible
                  que la utilización de algunos de los Servicios ofrecidos a
                  través del Sitio Web requiera la suscripción o registro del
                  Usuario y/o el pago de un precio como contraprestación por el
                  Servicio.
                </p>

                <p>
                  <strong>1.2. Utilización del Sitio Web</strong>
                </p>
                <p>
                  <strong>1.2.1.</strong> El Usuario se compromete a utilizar el
                  Sitio Web de conformidad con estos Términos y Condiciones y
                  los demás documentos detallados en la cláusula 10.3 de estos
                  Términos y Condiciones, las leyes aplicables conforme la
                  cláusula 12 y con la moral y buenas costumbres.
                </p>
                <p>
                  <strong>1.2.2.</strong> El Usuario se obliga a abstenerse de
                  utilizar el Sitio Web con fines o efectos ilícitos, contrarios
                  a lo establecido en los Términos y Condiciones, inmorales,
                  lesivos de los derechos e intereses de terceros, o que de
                  cualquier forma puedan dañar, inutilizar, sobrecargar o
                  deteriorar el Sitio Web o a terceros y/o su propiedad, o
                  impedir la normal utilización y correcto funcionamiento del
                  Sitio Web por parte de los Usuarios.
                </p>

                <p>
                  <strong>1.3. Contenido del Sitio Web</strong>
                </p>
                <p>
                  <strong>1.3.1.</strong> Todos los contenidos de este Sitio
                  Web, tales como texto, información, gráficos, imágenes, logos,
                  marcas, programas de computación, bases de datos, diseños,
                  arquitectura funcional y cualquier otro material, incluyendo
                  pero sin limitarse, comentarios, calificaciones de empresas
                  y/o publicaciones realizadas en foros y medios de comunicación
                  del Sitio Web (en adelante, el "Contenido") están protegidos
                  por la legislación aplicable conforme la cláusula 12 de estos
                  Términos y Condiciones incluyendo, pero sin limitación, las
                  leyes sobre derechos de autor, patentes, marcas, modelos de
                  utilidad, diseños industriales y nombres de dominio.
                </p>
                <p>
                  <strong>1.3.2.</strong> Todo el Contenido es propiedad
                  exclusiva de TACOEMPLEOS y/o de cualquier otra sociedad
                  vinculada y/o de sus proveedores de contenido, según
                  correspondiere. La compilación, interconexión, operatividad y
                  disposición de los contenidos del Sitio Web es de propiedad
                  exclusiva de TACOEMPLEOS y/o de sus empresas vinculadas. El
                  uso, adaptación, modificación, supresión, reproducción y/o
                  comercialización no autorizada del Contenido puede encontrarse
                  penado por la legislación vigente en cada jurisdicción.
                </p>
                <p>
                  <strong>1.3.3.</strong> Usted no copiará ni adaptará el código
                  de programación, ni código objeto ni fuente, desarrollado por,
                  o por cuenta de, TACOEMPLEOS para generar y operar sus
                  páginas, el cual se encuentra protegido por la legislación
                  aplicable y vigente en cada jurisdicción.
                </p>

                <p>
                  <strong>1.4. Uso permitido del Sitio</strong>
                </p>
                <p>
                  <strong>1.4.1. Reglas generales:</strong> Los Usuarios tienen
                  prohibido utilizar el Sitio Web para transmitir, distribuir,
                  almacenar o destruir material
                </p>
                <p>• en violación de la normativa vigente,</p>
                <p>
                  • de forma que se infrinjan derechos de terceros o se viole la
                  confidencialidad, sensibilidad, honor, privacidad, imagen u
                  otros derechos personales de otras personas, y
                </p>
                <p>
                  • que infrinja o viole estos Términos y Condiciones y/o los
                  demás documentos detallados en la cláusula 10.3 de estos
                  Términos y Condiciones.
                </p>
                <p>
                  <strong>1.4.2. Reglas de Seguridad del Sitio Web:</strong> Los
                  Usuarios tienen prohibido violar o intentar violar la
                  seguridad del Sitio Web, incluyendo pero no limitándose a:
                </p>
                <p>
                  • el acceso a datos que no estén destinados a tales usuarios o
                  entrar en un servidor o cuenta o portal cuyo acceso no está
                  expresamente autorizado al Usuario,
                </p>
                <p>
                  • evaluar o probar la vulnerabilidad de un sistema o red, o
                  violar las medidas de seguridad,
                </p>
                <p>
                  • impedir o intentar impedir (total o parcialmente) la
                  prestación del Servicio a cualquier Usuario, anfitrión o red,
                  incluyendo, pero sin limitación, mediante el envío de virus al
                  Sitio Web, o mediante saturación o ataques de denegación de
                  Servicio, o de cualquier otra manera,
                </p>
                <p>
                  • enviar correos no pedidos (spam), incluyendo pero sin
                  limitarse promociones y/o publicidad de productos o servicios,
                  o
                </p>
                <p>
                  • falsificar cualquier cabecera de paquete TCP/IP o cualquier
                  parte de la información de la cabecera de cualquier correo
                  electrónico o en mensajes de foros de debate, y
                </p>
                <p>
                  • cualquier otra acción, omisión o maniobra tendiente a
                  afectar el normal y correcto funcionamiento del Sitio Web y la
                  prestación de los Servicios, y/o que tenga por finalidad o
                  resultado causar algún daño a cualquier tercero.
                </p>
                <p>
                  <strong>1.4.3.</strong> Las violaciones de la seguridad del
                  sistema o de la red constituyen delitos penales y civiles,
                  pasibles de sanciones y multas. Por lo que, desde ya el
                  Usuario autoriza a TACOEMPLEOS a investigar los posibles casos
                  de violaciones a (e intentos vulnerar) la seguridad del
                  sistema, los Servicios y el Sitio Web, pudiendo dirigirse a la
                  autoridad judicial o administrativa competente a los efectos
                  de perseguir civil y penalmente a los Usuarios involucrados en
                  tales violaciones.
                </p>

                <p>
                  <strong>1.5. Usos prohibidos</strong>
                </p>
                <p>
                  <strong>1.5.1.</strong> El Sitio Web sólo podrá ser utilizado con fines lícitos, para acceder a información referida a los Servicios disponibles a través del mismo y para utilizar dichos Servicios. Sin perjuicio de las demás prohibiciones de uso indicadas en estos Términos y Condiciones, TACOEMPLEOS prohíbe específicamente cualquier utilización del Sitio Web para:
                </p>
                <p>
                  • Anunciar datos biográficos incompletos, falsos o inexactos.
                </p>
                <p>
                  • Registrar más de una cuenta correspondiente a un mismo usuario.
                </p>
                <p>
                  • Usar cualquier mecanismo para impedir o intentar impedir el adecuado funcionamiento de este Sitio Web o cualquier actividad que se esté realizando en este Sitio Web.
                </p>
                <p>
                  • Revelar o compartir su contraseña con terceras personas, o usar su contraseña para propósitos no autorizados.
                </p>
                <p>
                  • El uso o intento de uso de cualquier máquina, software, herramienta, agente u otro mecanismo para navegar o buscar en este Sitio Web que sean distintos a las herramientas de búsqueda provistos por TACOEMPLEOS en este Sitio Web.
                </p>
                <p>
                  • Intentar descifrar, descompilar, hacer ingeniería inversa, u obtener el código fuente de cualquier programa de software de este Sitio Web.
                </p>
                <p>
                  • Utilizar el Sitio Web y los Servicios de una manera contraria o en violación a estos Términos y Condiciones.
                </p>
                <p>
                  <strong>1.5.2.</strong> TACOEMPLEOS se reserva el derecho de
                  suspender o dar de baja unilateral e inmediatamente a
                  cualquier Usuario que, a exclusivo criterio de TACOEMPLEOS, no
                  cumpla con los estándares definidos en estos Términos y
                  Condiciones o con las políticas vigentes de TACOEMPLEOS o que
                  incurra en alguna de los usos prohibidos indicados en estos
                  Términos y Condiciones, sin que ello genere derecho a
                  resarcimiento alguno por parte de TACOEMPLEOS.
                </p>

                <p>
                  <strong>
                    1.6. Canales de comunicación disponibles para los Usuarios
                  </strong>
                </p>
                <p>
                  <strong>1.6.1.</strong> El Usuario deberá utilizar los canales
                  de comunicación disponibles —como canales de comunicación en
                  tiempo real de la red (chats) y foros de discusión, entre
                  otros— (en adelante, los "Canales") de forma responsable,
                  respetuosa, correcta y dando fiel cumplimiento a la normativa
                  vigente y estos Términos y Condiciones.
                </p>
                <p>
                  <strong>1.6.2.</strong> El contenido de cada mensaje enviado
                  por el Usuario a través de los Canales es de única y exclusiva
                  responsabilidad del Usuario. TACOEMPLEOS no garantiza la
                  veracidad de los datos personales y/o contenidos de cada
                  mensaje efectuados y/o publicados en los Canales por el
                  Usuario. El Usuario acepta voluntariamente que el acceso a y/o
                  el uso de los Canales tiene lugar, en todo caso, bajo su
                  exclusiva y única responsabilidad. Por lo tanto, cada Usuario
                  es único y exclusivo responsable de sus manifestaciones,
                  dichos, opiniones y todo acto que realice a través de los
                  Canales.
                </p>
                <p>
                  <strong>1.6.3.</strong> El Usuario reconoce y acepta que las
                  siguientes conductas se encuentran terminantemente prohibidas
                  de ser utilizadas en el Sitio Web o en cualquier Servicio de
                  TACOEMPLEOS, y que su realización constituirá un
                  incumplimiento esencial y grave de estos Términos y
                  Condiciones, y, por lo tanto, se abstendrá de realizarlas:
                </p>
                <p>
                  a) utilizar lenguaje vulgar /obsceno, discriminatorio y/u
                  ofensivo;
                </p>
                <p>
                  b) todo tipo de ataque personal contra Usuarios y/o terceros,
                  mediante acoso, amenazas, insultos;
                </p>
                <p>
                  c) todo acto contrario a la legislación aplicable, la moral y
                  las buenas costumbres y estos Términos y Condiciones;
                </p>
                <p>
                  d) publicar mensajes, imágenes e hipervínculos agraviantes,
                  ofensivos, difamatorios, calumniosos, injuriosos, falsos,
                  discriminatorios, pornográficos, de contenido violento,
                  insultantes, amenazantes, incitantes a conductas ilícitas o
                  peligrosas para la salud, y/o que vulneren de cualquier forma
                  la privacidad de cualquier tercero como así también la
                  violación directa o indirecta de los derechos de propiedad
                  intelectual de TACOEMPLEOS y/o de cualquier tercero,
                  incluyendo clientes de TACOEMPLEOS;
                </p>
                <p>
                  e) publicar mensajes que puedan herir y/o afectar la
                  sensibilidad del resto de los Usuarios y/o de cualquier
                  tercero, incluyendo clientes de TACOEMPLEOS;
                </p>
                <p>
                  f) promocionar, comercializar, vender, publicar y/u ofrecer
                  cualquier clase de productos, servicios y/o actividades por
                  intermedio de o a través de la utilización de los Canales,
                  excepto aquellas expresamente permitidas por TACOEMPLEOS;
                </p>
                <p>
                  g) la venta, locación o cesión, ya sea a título oneroso o
                  gratuito, del espacio de comunicación de los Canales;
                </p>
                <p>
                  h) publicar mensajes que de cualquier forma contengan
                  publicidad, y/o propaganda política de cualquier tipo;
                </p>
                <p>
                  i) el uso o envío de virus informáticos, malware, spyware,
                  ransomware y/o la realización de todo acto que cause o pudiera
                  causar daños o perjuicios al normal funcionamiento de los
                  Servicios y/o los Canales, o de los equipos informáticos o
                  software de TACOEMPLEOS y/o de cualquier tercero, incluyendo
                  clientes de TACOEMPLEOS;
                </p>
                <p>
                  j) todo acto dirigido a enmascarar y/o falsificar o disimular
                  direcciones IP, correos electrónicos y/o cualquier otro medio
                  técnico de identificación de los Usuarios o sus equipos
                  informáticos;
                </p>
                <p>
                  k) todo acto que viole la privacidad de otros Usuarios, o que
                  viole cualquiera de sus derechos bajo la legislación aplicable
                  y complementarias;
                </p>
                <p>
                  l) la publicación de datos personales sin el consentimiento
                  expreso del titular de los mismos;
                </p>
                <p>
                  m) la transmisión o divulgación de material que viole la
                  legislación en vigor en el país y/o que pudiera herir la
                  sensibilidad del resto de los Usuarios y/o de cualquier
                  tercero, incluyendo clientes de TACOEMPLEOS;
                </p>
                <p>
                  n) la publicación de cualquier tipo de contenido en violación
                  de estos Términos y Condiciones y/o derechos de terceros,
                  incluyendo sin limitación los derechos de propiedad
                  intelectual y/o industrial.
                </p>
                <p>
                  <strong>1.6.4.</strong> TACOEMPLEOS no tiene obligación de
                  controlar ni controla la utilización que el Usuario haga de
                  los Canales. No obstante ello, TACOEMPLEOS se reserva el
                  derecho de no publicar o remover luego de ser publicados todos
                  aquellos contenidos y/o mensajes propuestos y/o publicados por
                  el Usuario que, a exclusivo criterio de TACOEMPLEOS, no
                  respondan estrictamente a las disposiciones contenidas en
                  estos Términos y Condiciones y/o resulten impropios y/o
                  inadecuados a las características, finalidad y/o calidad de
                  los Servicios, y/o atenten contra lo indicado en la
                  legislación aplicable. Asimismo, TACOEMPLEOS se reserva el
                  derecho a suspender unilateral, temporal o definitivamente el
                  acceso a los Canales y/o de los Servicios sin previo aviso, a
                  quien, a discreción de TACOEMPLEOS, no respete los presentes
                  Términos y Condiciones o realice actos que atenten contra el
                  normal funcionamiento de los Servicios y/o de los Canales y/o
                  del Sitio Web o que no cumpla con cualquiera de los términos
                  de estos Términos y Condiciones
                </p>
                <p>
                  <strong>1.6.5.</strong> TACOEMPLEOS no garantiza la
                  disponibilidad y continuidad del funcionamiento de los
                  Canales, ni su funcionamiento libre de errores.
                </p>
                <p>
                  <strong>1.6.6.</strong> TACOEMPLEOS no es en ningún caso
                  responsable de la destrucción, alteración o eliminación del
                  contenido o información que cada Usuario incluya en sus
                  mensajes.
                </p>
                <p>
                  <strong>1.6.7.</strong> Cada Usuario es único y exclusivo
                  responsable de sus manifestaciones, dichos, opiniones y todo
                  acto que realice a través de los Canales.
                </p>

                <p>
                  <strong>1.7. Espacios de Calificación de Empresas</strong>
                </p>
                <p>
                  <strong>1.7.1.</strong> TACOEMPLEOS podrá habilitar espacios
                  de calificación de empresas, donde los Usuarios – en base a su
                  experiencia personal por trabajar o haber trabajado en una
                  determinada empresa– podrán evaluar y calificar la experiencia
                  en general, el ambiente de trabajo, beneficios, desarrollo
                  personal, salario, gestión y liderazgo, balance entre vida
                  personal y laboral, entre otros aspectos, y emitir una
                  recomendación sobre trabajar allí (los"Espacios de
                  Calificación de Empresas"). En base a dichas calificaciones,
                  TACOEMPLEOS podrá publicar en el Sitio Web (o donde estime
                  pertinente) resultados, promedios de calificación,
                  estadísticas, etc.
                </p>
                <p>
                  <strong>1.7.2.</strong> Al realizar calificaciones y/o
                  recomendaciones, los Usuarios deben abstenerse de emitir
                  calificaciones y/o recomendaciones ofensivas, injuriosas y/o
                  difamatorias, y, en general, cumplir con todas las reglas y
                  obligaciones establecidas en estos Términos y Condiciones.
                  Cada Usuario del Sitio Web es y será el único y exclusivo
                  responsable de sus manifestaciones, dichos, opiniones y todo
                  acto que realice a través de los Espacios de Calificación de
                  Empresas.
                </p>
                <p>
                  <strong>1.7.3.</strong> Toda calificación y/o comentario
                  realizado por un Usuario debe representar su propia opinión,
                  siempre y cuando cumpla con las reglas y obligaciones
                  establecidas en los presentes Términos y Condiciones.
                  Asimismo, debe ser una manifestación libre de cualquier
                  coacción o instrucciones de terceros. No está permitido que
                  los Usuarios soliciten incentivos ni recompensas a cambio de
                  publicar calificaciones y/o comentarios.
                </p>
                <p>
                  <strong>1.7.4.</strong> TACOEMPLEOS se reserva el derecho de
                  impedir la publicación o remover luego de ser publicados todos
                  aquellos contenidos y/o calificaciones propuestas y/o
                  publicadas por el Usuario que, a exclusivo criterio de
                  TACOEMPLEOS, no respondan estrictamente a las disposiciones
                  contenidas en estas Condiciones y/o resulten impropios y/o
                  inadecuados a las características, finalidad y/o calidad de
                  los Servicios. Asimismo, TACOEMPLEOS se reserva el derecho a
                  suspender temporal o definitivamente de los Espacios de
                  Calificación de Empresas y/o de los Servicios sin previo
                  aviso, al Solicitante que no respete las presentes Condiciones
                  o realice actos que atenten contra el normal funcionamiento de
                  los Servicios y/o de los Espacios de Calificación de Empresas
                  y/o del Sitio Web y/o que utilice los Espacios de Calificación
                  de Empresas y/o Servicios en forma contraria a estas
                  Condiciones.
                </p>
                <p>
                  <strong>1.7.5.</strong> TACOEMPLEOS no garantiza la
                  disponibilidad y continuidad del funcionamiento ininterrumpido
                  y/o libre de errores de los Espacios de Calificación de
                  Empresas.
                </p>

                <p>
                  <strong>1.8. Ofertas de Empleo de Múltiples Fuentes y Limitación de Responsabilidad</strong>
                </p>
                <p>
                  <strong>1.8.1.</strong> TACOEMPLEOS recopila ofertas de empleo de múltiples fuentes incluyendo redes sociales, sitios web, y otras plataformas digitales. Si bien realizamos esfuerzos razonables para verificar estas ofertas, TACOEMPLEOS no garantiza la exactitud, veracidad, legitimidad o vigencia de las mismas.
                </p>
                <p>
                  <strong>1.8.2.</strong> TACOEMPLEOS no puede confirmar la identidad real de los empleadores, la existencia de las vacantes publicadas, o que las personas que publican ofertas estén autorizadas para representar a las empresas mencionadas.
                </p>
                <p>
                  <strong>1.8.3.</strong> El Usuario reconoce que debe ejercer precaución al interactuar con empleadores y verificar independientemente la legitimidad de todas las ofertas de empleo. TACOEMPLEOS recomienda tomar medidas de seguridad apropiadas durante el proceso de búsqueda de empleo.
                </p>
                <p>
                  <strong>1.8.4.</strong> TACOEMPLEOS actúa únicamente como plataforma de difusión de información y no establece, garantiza o supervisa ninguna relación laboral entre Usuario y empleadores. El Usuario asume toda la responsabilidad de verificar independientemente la legitimidad de cualquier oportunidad laboral y empleador.
                </p>
                <p>
                  <strong>1.8.5.</strong> TACOEMPLEOS no será responsable por cualquier consecuencia derivada de la interacción del Usuario con terceros empleadores, incluyendo pero sin limitarse a disputas laborales, incumplimientos contractuales, condiciones laborales inadecuadas, o cualquier daño económico o personal.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  2. DATOS PERSONALES DEL USUARIO. REGISTRO EN EL SITIO WEB
                </h2>
                <p>
                  Cuando se registre en el Sitio Web, se le pedirá que cargue a
                  nuestra base de datos y aporte a TACOEMPLEOS cierta
                  información que incluirá, entre otras, nombre y apellido,
                  dirección y una dirección válida de correo electrónico,
                  antecedentes académicos y laborales (de corresponder), entre
                  otros. Dicha información será utilizada para los propósitos
                  estipulados en la Política de Privacidad. Para conocer la
                  información que TACOEMPLEOS puede recopilar y el uso que le da
                  a los datos personales, las medidas de control tomadas para
                  proteger sus datos, la legitimidad del tratamiento realizado
                  por parte de TACOEMPLEOS, la información que pudiera ser
                  compartida y los terceros con quien podría ser compartida, y
                  la forma en que se puede contactar con el responsable de
                  tratamiento en caso de ser necesario, por favor lea la
                  Política de Privacidad del Sitio Web.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  3. MENORES DE EDAD Y/O PERSONAS QUE LA LEGISLACIÓN APLICABLE
                  RECONOZCA COMO INCAPACES
                </h2>
                <p>
                  <strong>3.1.</strong> Queda prohibida la utilización del Sitio
                  Web y/o de los Servicios ofrecidos a través del mismo por
                  personas que carezcan de capacidad legal para contratar o
                  menores de edad según la legislación aplicable conforme la
                  cláusula 12. En caso de que ello ocurra, los menores de edad o
                  incapaces deben obtener previamente permiso por escrito de sus
                  padres, tutores o representantes legales, quienes serán
                  considerados responsables de todos los actos realizados por
                  las personas a su cargo. TACOEMPLEOS no se responsabiliza de
                  dichas contrataciones bajo ningún concepto. Asimismo, no se
                  responsabiliza respecto de dicho permiso.
                </p>
                <p>
                  <strong>3.2.</strong> El Sitio Web es una comunidad en
                  constante desarrollo y evolución que incluye una enorme
                  cantidad de diversos usuarios con diferentes experiencias,
                  educación y antecedentes. TACOEMPLEOS no tiene la obligación
                  de monitorear y/o supervisar la conducta de los Usuarios, ni
                  la exactitud y/o veracidad de la información suministrada por
                  los mismos. A pesar de que TACOEMPLEOS pueda ocasionalmente
                  monitorear y tomar acción sobre la conducta inapropiada de
                  algún usuario o algunos terceros, en el Sitio Web o el acceso
                  o utilización de cualquiera de los Servicios ofrecidos,
                  incluidas salas de chat y foros públicos y eventualmente tomar
                  las medidas del caso, resulta imposible controlar
                  constantemente y en forma ininterrumpida y total todo el
                  contenido vertido por los Usuarios en los mismos, por lo
                  tanto, es posible que en cualquier momento pueda presentarse
                  un lenguaje u otros materiales accesibles en o a través de
                  tales que puedan ser inapropiados para menores de edad u
                  ofensivos para otros Usuarios, y/o que hieran su sensibilidad.
                  TACOEMPLEOS depende exclusivamente de las denuncias que puedan
                  formular los Usuarios de eventuales inconductas y/o la
                  publicación de material inapropiado para tomar conocimiento de
                  la existencia de los mismos, por lo tanto, en tales casos,
                  será responsabilidad y obligación de los Usuarios reportar
                  dichas inconductas por las vías dispuestas por TACOEMPLEOS a
                  tal fin, a efectos de que se puedan tomar las medidas
                  correspondientes. Los presentes Términos y Condiciones señalan
                  normas de conducta para los Usuarios, pero TACOEMPLEOS no
                  puede garantizar que el resto de los usuarios cumplan con los
                  mismos.
                </p>
                <p>
                  <strong>3.3.</strong> Al acceder al Sitio Web y utilizar los
                  Servicios el Usuario declara y garantiza y confirma que es
                  mayor de edad y plenamente capaz para operar el mismo y que
                  todas las declaraciones e información que acompaña es veraz,
                  completa y exacta.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  4. RESPONSABILIDAD DEL USUARIO
                </h2>
                <p>
                  El Usuario declara, garantiza y acepta en forma incondicionada
                  que el uso del Sitio Web sus Servicios y los Contenidos se
                  efectúan bajo su única y exclusiva responsabilidad.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  5. EXCLUSIÓN DE GARANTÍAS Y DE RESPONSABILIDAD
                </h2>
                <p>
                  <strong>5.1.</strong> Atento al estado de la técnica y a la
                  estructura y funcionamiento de las redes, el Sitio Web no
                  puede confirmar que cada Usuario es quien dice ser ni la
                  veracidad y/o exactitud de la información ingresada al mismo.
                </p>
                <p>
                  <strong>5.2.</strong> TACOEMPLEOS no garantiza la constante
                  disponibilidad y continuidad del funcionamiento del Sitio Web
                  y de los Servicios ofrecidos, libre de errores. No todos los
                  Servicios y contenidos en general se encuentran disponibles
                  para todas las áreas geográficas donde se encuentren los
                  Usuarios. Asimismo, TACOEMPLEOS no garantiza la utilidad del
                  Sitio Web y de los Servicios para la realización de ninguna
                  actividad en particular, ni su infalibilidad y, en particular,
                  aunque no de modo exclusivo, que los Usuarios puedan
                  efectivamente utilizar el Sitio Web, conseguir una determinada
                  finalidad o resultado, acceder a las distintas páginas web que
                  forman el Sitio Web o a aquéllas desde las que se prestan los
                  Servicios, ni a los mismos.
                </p>
                <p>
                  <strong>5.3.</strong> TACOEMPLEOS no garantiza que el Sitio
                  Web funcione libre de errores o que el Sitio Web y su servidor
                  estén libres de virus informáticos u otros mecanismos lesivos.
                </p>
                <p>
                  <strong>5.4.</strong> El Sitio Web y los Servicios se
                  suministran tal como están, sin garantías de ninguna clase.
                </p>
                <p>
                  <strong>5.5.</strong> TACOEMPLEOS no garantiza la exactitud,
                  la veracidad, la exhaustividad o la actualización de los
                  contenidos, los Servicios, el software, los textos, los
                  gráficos y los vínculos y de la demás información obrante en
                  los mismos.
                </p>
                <p>
                  <strong>5.6.</strong> En ningún caso TACOEMPLEOS será
                  responsable de cualquier daño incluyendo, pero sin limitación,
                  daños directos y/o indirectos, lucro cesante o pérdida de
                  chance que resulten del uso o de la imposibilidad (total o
                  parcial) de uso del Sitio Web, sin perjuicio de que
                  TACOEMPLEOS haya sido advertido sobre la posibilidad de que
                  tales daños ocurran.
                </p>
                <p>
                  <strong>5.7.</strong> TACOEMPLEOS no será responsable por los
                  daños y perjuicios de cualquier naturaleza que pudieran
                  derivar del accionar de terceros no autorizados respecto de
                  los Datos Personales de los Usuarios, así como de los
                  Servicios ofrecidos en el Sitio Web, y/o por cualquier daño
                  incluyendo, pero sin limitación, daños directos y/o
                  indirectos, lucro cesante o pérdida de chance que cause un
                  Usuario a otro Usuario.
                </p>
                <p>
                  <strong>5.8.</strong> El Usuario reconoce expresamente que TACOEMPLEOS obtiene contenido de fuentes externas y que no tiene control total sobre la veracidad del mismo. Cualquier confianza depositada en la información publicada es bajo el propio riesgo del Usuario. TACOEMPLEOS no será responsable por pérdidas económicas, daños personales, o cualquier otro perjuicio resultante de información inexacta o fraudulenta de terceros.
                </p>
                <p>
                  <strong>5.9.</strong> TACOEMPLEOS no garantiza que las empresas mencionadas en las ofertas de empleo hayan autorizado la publicación de dichas ofertas o que las personas que las publican tengan facultades para representarlas.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  6. VÍNCULOS A OTROS SITIOS
                </h2>
                <p>
                  El Sitio Web contiene vínculos y enlaces a otros sitios de
                  Internet. TACOEMPLEOS no respalda ni controla ni administra
                  los contenidos ni servicios de estos sitios web. TACOEMPLEOS
                  no es responsable del contenido de los sitios web de terceros,
                  ni de los servicios prestados en los mismos, y no hace ninguna
                  afirmación ni representación relativa al contenido o su
                  exactitud en estos sitios web de terceros ni de los servicios
                  allí prestados. Si Usted decide acceder a sitios web de
                  terceras partes vinculados, lo hace a su propio riesgo, y bajo
                  su propia responsabilidad, debiendo respetar los términos y
                  condiciones y políticas de privacidad de los mismos.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  7. CESIÓN O USO COMERCIAL NO AUTORIZADO
                </h2>
                <p>
                  <strong>7.1.</strong> Usted acepta y se obliga a no ceder
                  (total ni parcialmente), bajo ningún título, sus derechos u
                  obligaciones bajo estos Términos y Condiciones. Usted también
                  acepta no realizar ningún uso comercial no autorizado del
                  Sitio Web, y/o contrario a estos Términos y Condiciones.
                </p>
                <p>
                  <strong>7.2.</strong> Asimismo, el Usuario se compromete a
                  utilizar el Sitio Web y los Servicios diligentemente y de
                  conformidad con la legislación aplicable y vigente y con estos
                  Términos y Condiciones.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  8. SANCIONES DISCIPLINARIAS. CANCELACIÓN
                </h2>
                <p>
                  <strong>8.1.</strong> TACOEMPLEOS tiene la facultad, y no la
                  obligación, de emitir advertencias, suspensiones temporales y
                  cancelaciones permanentes (baja) de las cuentas de los
                  Usuarios registrados por infracciones a los presentes Términos
                  y Condiciones, y/o la ley y/o cualquier aviso, reglamento de
                  uso e instrucción puestos en conocimiento del Usuario por
                  TACOEMPLEOS. A tal fin, en caso de haber tomado conocimiento
                  de la existencia de una infracción, TACOEMPLEOS podrá dentro
                  del plazo que estime pertinente, tomar las medidas
                  disciplinarias que considere apropiadas en cada caso.
                </p>
                <p>
                  <strong>8.2.</strong> Sin perjuicio de lo indicado en el
                  punto anterior, TACOEMPLEOS se reserva el derecho, a su
                  exclusivo criterio, de emplear todos los medios legales a su
                  alcance para obtener la sanción y/o resarcimiento
                  correspondiente en caso de que Usted infrinja cualquiera de
                  estos Términos y Condiciones.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  9. INDEMNIZACIÓN
                </h2>
                <p>
                  Usted acepta mantener indemne a TACOEMPLEOS, sus accionistas,
                  su compañía matriz, sus subsidiarias o afiliadas, controladas
                  y controlantes, sus directores, funcionarios, empleados y
                  agentes, de y contra cualquier reclamo, cargo, acción o
                  demanda, incluyendo, pero no limitándose a, los gastos legales
                  razonables, que resulten del uso que Usted haga del Sitio Web,
                  de los Contenidos y de los Servicios. Usted acepta y reconoce
                  que TacoEmpleos es un mero intermediario, ajeno a cualquier
                  relación que pudiera entablarse entre Usted y las empresas
                  reclutadoras que accedan a su perfil y se pongan en contacto
                  con Usted. En tal sentido, TACOEMPLEOS no es parte en dichas
                  relaciones, y por lo tanto, Usted acepta no reclamar a
                  TACOEMPLEOS por ningún tipo de consecuencia disvaliosa y/o
                  daño derivada de tales relaciones.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  10. GENERAL
                </h2>
                <p>
                  <strong>10.1.</strong> TACOEMPLEOS se reserva el derecho a
                  modificar unilateralmente total o parcialmente estos Términos
                  y Condiciones en cualquier momento. En caso de llevar a cabo
                  alguna modificación, TACOEMPLEOS podrá notificarla al Usuario
                  a la dirección de correo electrónico registrada para utilizar
                  el Sitio Web y los Servicios. El Usuario acepta que la
                  notificación por parte de TACOEMPLEOS a dicha dirección de
                  correo electrónico tendrá plena validez como notificación
                  suficiente, y que su recepción implica el conocimiento y la
                  aceptación total e incondicionada de dichos Términos y
                  Condiciones. Asimismo, si el Usuario persiste en la
                  utilización de los Servicios y/o el Sitio Web, se considerará
                  que conoce y ha aceptado implícitamente los nuevos Términos y
                  Condiciones.
                </p>
                <p>
                  <strong>10.2.</strong> Estos términos no limitarán las
                  garantías no renunciables ni los derechos de protección al
                  consumidor a los que usted tenga derecho bajo las leyes
                  imperativas de su país de residencia. En caso de declararse la
                  nulidad de alguna de las cláusulas de estos Términos y
                  Condiciones, tal nulidad no afectará a la validez de las
                  restantes, las cuales mantendrán su plena vigencia y efecto.
                </p>
                <p>
                  <strong>10.3.</strong> Estos Términos y Condiciones, la
                  Política de Privacidad, y en caso de que contrate los
                  servicios ofrecidos en el Sitio Web, las Condiciones de
                  Contratación, y, de corresponder, la orden de contratación
                  donde se acuerden condiciones particulares, así como sus
                  eventuales modificaciones, constituyen íntegramente el
                  contrato que rige la relación contractual entre TACOEMPLEOS y
                  el Usuario.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  11. DURACIÓN Y TERMINACIÓN
                </h2>
                <p>
                  La prestación del Servicio del Sitio Web tiene una duración
                  indeterminada. Sin perjuicio de lo anterior, TACOEMPLEOS está
                  autorizada para rescindir o suspender unilateralmente la
                  prestación del Servicio del Sitio Web y/o de cualquiera de los
                  Contenidos en cualquier momento, en la medida que no afecte
                  las obligaciones establecidas en los términos de contratación
                  particular suscrita por las partes.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  12. MISCELÁNEOS
                </h2>
                <p>
                  <strong>12.1.</strong> TACOEMPLEOS se refiere a la plataforma
                  tacoempleos.com.mx, cuyo domicilio electrónico para oír y
                  recibir notificaciones es legales@tacoempleos.com.mx.
                </p>
                <p>
                  <strong>12.2. Ley aplicable y jurisdicción.</strong> Estos
                  Términos y Condiciones se rigen por las leyes de la República
                  Argentina. El Usuario se somete a la jurisdicción de los
                  tribunales ordinarios de la Ciudad Autónoma de Buenos Aires,
                  con renuncia expresa a cualquier otro fuero y/o jurisdicción,
                  para la resolución de cualquier conflicto relacionado con
                  estos Términos y Condiciones.
                </p>
                <p className="text-sm text-gray-600 mt-6">
                  Estos Términos y Condiciones fueron actualizados por última
                  vez el 22 de julio de 2025.
                </p>
              </div>
            </section>


          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}