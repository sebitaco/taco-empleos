"use client";

import Navigation from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect } from "react";

export default function PoliticaPrivacidad() {
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
            Política de Privacidad
          </h1>
          
          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            
            {/* Sección 1 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4">
                1. NUESTRO COMROMISO CON LA PRIVACIDAD
              </h2>
              <div className="space-y-4 text-justify leading-relaxed">
                <p>
                En tacoempleos.com.mx (en adelante, "TACOEMPLEOS"), respetamos la privacidad de todo usuario que visite y/o utilice el sitio web tacoempleos.com.mx (en adelante, el "Sitio Web" o la "Plataforma"). Por favor, tome el tiempo suficiente para leer esta Política detenidamente.Al aceptar esta Política, Usted (el "Usuario") afirma:
                </p>
                <p>
                  que ha leído libremente todos los enunciados;
                </p>
                <p>
                que está de acuerdo en brindar su información personal y, cuando corresponda, presta su consentimiento previo, expreso e informado para el tratamiento que a continuación se describe; y
                </p>
                <p>
                que estos enunciados los tiene por notificados, entendidos y aceptados en cumplimiento con la normativa aplicable.
                </p>
                <p>
                En caso de no estar de acuerdo con los términos de esta Política de Privacidad, por favor no acepte esta Política ni utilice la Plataforma.
                </p>
                <p>
                Esta Política de Privacidad (la "Política") indica y establece la información que TACOEMPLEOS puede recopilar y el uso que le da a los datos personales. También informa y explica las medidas de control tomadas para proteger sus datos, la legitimidad del tratamiento realizado por parte de TACOEMPLEOS, y la forma en que se puede contactar con el responsable de tratamiento en caso de que existan preguntas o aclaraciones relacionadas con esta Política.
                </p>
              </div>
            </section>

            {/* Sección 2 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4">
                2. RECOPILACIÓN Y UTILIZACIÓN DE SU INFORMACIÓN
              </h2>
              <div className="space-y-4 text-justify leading-relaxed">
                <p>
                  <strong>2.1.</strong> Esta Política contempla la recopilación y uso de información personal en el Sitio Web
                </p>
                
                <p>
                  <strong>2.2.</strong> Cuando haya otorgado su consentimiento o cuando la ley aplicable lo autorice, TACOEMPLEOS, a través de la Plataforma, recopilará información sobre el Usuario que pueda identificarlo personalmente, como, por ejemplo, su nombre, dirección, número de teléfono, dirección de correo electrónico, antecedentes académicos y/o laborales (en adelante, la "Información Personal"), como requisito para su registración en la Plataforma. Si el Usuario no desea que recopilemos su Información Personal, le solicitamos que por favor se abstenga de proporcionarla y/o de utilizar la Plataforma y/o de aceptar la presente Política. Si bien la provisión de la Información Personal es completamente voluntaria, el Usuario deberá tener en cuenta que, en caso de no proporcionarnos su Información Personal a los fines indicados en los términos y condiciones de uso de la Plataforma, o de proporcionarnos datos falsos o inexactos, entonces el Usuario no podrá registrarse en la Plataforma ni acceder a utilizar los servicios e información disponibles a través de la Plataforma

                </p>

                <p>
                  <strong>2.3.</strong> En caso de que el Usuario nos brinde su Información Personal, le comunicamos que esa Información Personal será objeto de tratamiento automatizado e incorporada a la base de datos de TACOEMPLEOS.

                </p>

                <p>
                  <strong>2.4.</strong> TACOEMPLEOS en ningún momento recopilará información y/o datos sensibles sobre el Usuario, como ser: datos que revelen origen racial y étnico, opiniones políticas, convicciones religiosas, filosóficas o morales, afiliación sindical e información referente a su salud o la vida sexual, salvo que el Usuario opte por compartir esta información con TACOEMPLEOS y otorgue su consentimiento expreso a tal fin y/o cuando sea requerido bajo la legislación aplicable.
                </p>

                <p>
                  <strong>2.5.</strong> 2.5. La Información Personal que sea recabada mediante la Plataforma podrá ser utilizada para las siguientes finalidades:
                </p>

                <p>
                Atender la solicitud, proveer, analizar, cobrar, gestionar y en su caso formalizar los servicios o productos solicitados;
                </p>
                <p>
                Proporcionar información vía telefónica, WhatsApp o mensaje SMS, o electrónica, respecto al servicio o producto contratado, o por contratar;
                </p>
                <p>
                Llevar a cabo la transferencia de Información Personal y/o de información comercial recabados por TACOEMPLEOS en favor de empresas del grupo empresarial y de cualquier tercero (incluidos clientes y proveedores de servicios contratados por TACOEMPLEOS), para que puedan tratarla con las finalidades aquí descriptas;
                </p>
                <p>
                Preparar, implementar, promocionar y ofrecer nuevos productos y servicios, o bien, nuevos atributos, modalidades o características a los productos y servicios que ya están a su disposición;
                </p>
                <p>
                Gestionar el envío de comunicados con avisos, mensajes, novedades, invitación a eventos y reuniones, sea a través de medios impresos, electrónicos, telefónicos y/o presenciales con fines publicitarios, promocionales, de prospección comercial o de mercadotecnia, a menos que usted nos manifieste expresamente el deseo de no recibir los mismos;
                </p>
                <p>
                Efectuar estudios de mercado y de consumo a efectos de ofrecer productos y servicios personalizados, así como publicidad y contenidos más adecuados según las necesidades;
                </p>
                <p>
                Proteger, reconocer o defender los derechos y propiedad de TACOEMPLEOS, así como su información confidencial;
                </p>
                <p>
                  Mantener la seguridad de nuestra Plataforma, de nuestros Usuarios y/o clientes;
                </p>
                <p>
                  Con fines de marketing, mercadotécnicos, publicitarios o de prospección comercial, ya sea directamente por parte de TACOEMPLEOS, de empresas del grupo empresarial y de cualquier tercero (incluidos clientes, proveedores de servicios contratados por TACOEMPLEOS o colaboradores comerciales);
                </p>
                <p>
                  Proporcionar información a un futuro comprador de una entidad de TACOEMPLEOS en una adquisición o fusión, incluyendo permitir su acceso durante el proceso de debida diligencia;
                </p>
                <p>
                  Proporcionar información relevante a auditores externos, asesores legales, contables e investigadores; y
                </p>
                <p>
                  Ofrecer el servicio de nuestros aliados comerciales y prestadores de servicios.
                </p>
              </div>
            </section>

            {/* Sección 3 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4">
                3. INFORMACIÓN PERSONAL
              </h2>
              <div className="space-y-4 text-justify leading-relaxed">
                <p>
                  <strong>3.1.</strong> TACOEMPLEOS recopila Información Personal en línea cuando, entre otros casos:
                </p>
                <p>
                  El Usuario se registra en la Plataforma;
                </p>
                <p>
                  El Usuario utiliza la Plataforma y/o los servicios ofrecidos a través de la misma;
                </p>
                <p>
                  El Usuario nos envía preguntas, consultas o comentarios o se contacta con la Plataforma;
                </p>
                <p>
                  El Usuario solicita información o materiales;
                </p>
                <p>
                  El Usuario publica comentarios en la Plataforma o provee de cualquier forma información a la Plataforma (chats, foros, uploads, etc.); y/o
                </p>
                <p>
                  El Usuario utiliza el chatbot disponible en la Plataforma para cualquiera de los casos anteriores.
                </p>

                <p>
                  <strong>3.2.</strong> El tipo de información recopilada puede incluir su nombre, apellido, ciudad de origen y residencia, salario pretendido, tipo y número de documento, teléfono, dirección de correo electrónico, antecedentes académicos y/o laborales y/o cualquier otra información que permita individualizarlo y contactarlo, dentro del marco otorgado por su consentimiento y permitido por la legislación aplicable, como así también información sobre el uso que usted haga de la Plataforma, incluyendo cómo interactúa con la Plataforma y sus distintas funcionalidades. En todos los casos que el Usuario brinde Información Personal, y de acuerdo con la legislación vigente, el Usuario declara que la Información Personal brindada es correcta, completa, exacta, cierta y actual.
                </p>

                <p>
                  <strong>3.3.</strong> Consentimiento para tratamiento y compartición de datos
                </p>
                <p>
                  En los casos que nos brinde su Información Personal, el Usuario acepta y presta su consentimiento libre, incondicionado, previo, expreso e informado para que dicha Información Personal sea utilizada con las finalidades arriba mencionadas y autoriza a que la misma sea tratada, almacenada, recopilada en las bases de datos de propiedad de TACOEMPLEOS. En tal sentido, usted autoriza a que su Información Personal sea compartida con los clientes de TACOEMPLEOS según se indica en la cláusula 6 de esta Política, incluyendo todos los datos e información que proporcione en su perfil (por ejemplo: nombre, correo electrónico, experiencia, habilidades, educación, foto, currículum y cualquier otro contenido o archivo adjunto que suba). Asimismo, cuando corresponda, el Usuario acepta y presta su consentimiento libre, previo, expreso, incondicionado e informado con los términos de la presente Política.
                </p>

                <p>
                  <strong>3.4.</strong> Se deja constancia que:
                </p>
                <p>
                  el detalle de los terceros con acceso a los datos personales y cualquier variación de estos será actualizada en la Política;
                </p>
                <p>
                  la autorización del Usuario es necesaria para cumplir con las finalidades antes indicadas, cuando no exista otra base legal que permita el tratamiento de la Información Personal para dichas finalidades; y,
                </p>
                <p>
                  el Usuario podrá ejercer los derechos de acceso, rectificación, actualización y supresión de los datos personales, para lo cual puede enviar la solicitud de ejercicio de sus derechos reconocidos en la legislación aplicable, escribiendo Canal de Contacto (conforme se define en la cláusula 13.5 de esta Política).
                </p>
              </div>
            </section>

            {/* Sección 4 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4">
                4. CORREO ELECTRÓNICO
              </h2>
              <div className="space-y-4 text-justify leading-relaxed">
                <p>
                  <strong>4.1.</strong> Mediante su registración en la Plataforma el Usuario acepta, consiente y autoriza expresamente que TACOEMPLEOS le envíe espontáneamente correos electrónicos institucionales en relación con el contenido de la Plataforma, los servicios prestados por TACOEMPLEOS o sobre el estado de su cuenta, comunicaciones, notificaciones y en respuesta a sus preguntas, pedidos, consultas o comentarios.
                </p>

                <p>
                  <strong>4.2.</strong> Si el Usuario otorga su consentimiento expreso para el envío de publicidad, TACOEMPLEOS también le podrá enviar correos electrónicos publicitarios con información sobre productos, servicios y promociones ofrecidos por TACOEMPLEOS y/o terceros asociados comercialmente que le puedan resultar de interés, a menos que el Usuario indique expresamente que no desea recibir dichos correos electrónicos a través de los procesos implementados por TACOEMPLEOS a tal efecto
                </p>

                <p>
                  <strong>4.3.</strong> El Usuario podrá solicitar en cualquier momento el cese de envío de correos electrónicos informativos, escribiendo al Canal de Contacto indicado en la cláusula 13.5. de esa Política.
                </p>

                <p>
                  <strong>4.4.</strong> Todo correo electrónico publicitario que reciba de TACOEMPLEOS le informará el procedimiento para rechazar el envío de futuros correos electrónicos promocionales. Asimismo, el Usuario podrá cambiar sus preferencias de recepción de correos electrónicos publicitarios a través de la configuración de su cuenta en el propio Sitio Web en cualquier momento.
                </p>
              </div>
            </section>

            {/* Sección 5 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4">
                5. OTRA INFORMACIÓN - COOKIES (no corresponde a la aplicación, solo a la página web)
              </h2>
              <div className="space-y-4 text-justify leading-relaxed">
                <p>
                  <strong>5.1.</strong> TACOEMPLEOS puede utilizar varios métodos que recopilan información sobre el Usuario y/o información sobre la tecnología que está utilizando, por ejemplo, el tipo de navegador y el sistema operativo, en relación con nuestra Plataforma. Tales métodos incluyen las cookies, las cookies de destello, las web beacons, y otros dispositivos automatizados para la colección de información.
                </p>

                <p>
                  <strong>5.2.</strong> TACOEMPLEOS puede utilizar esta información para:
                </p>

                <p>
                  analizar las tendencias;
                </p>
                <p>
                  administrar la Plataforma;
                </p>
                <p>
                  realizar un seguimiento de los movimientos alrededor de la Plataforma;
                </p>
                <p>
                  recopilar información demográfica sobre nuestra base de usuarios como un todo;
                </p>
                <p>
                  la publicidad;
                </p>
                <p>
                  como sea necesario para conducir nuestro negocio; y
                </p>
                <p>
                  vincular estos datos recopilados automáticamente con su Información Personal.
                </p>

                <p>
                  <strong>5.3.</strong> Con la mayoría de los exploradores para Internet usted puede borrar las Cookies del disco rígido de su computadora, bloquear todas las Cookies o recibir un mensaje de alerta antes de que se almacene una Cookie. Por favor, consulte las instrucciones de su explorador para conocer más sobre estas funciones.
                </p>

                <p>
                  <strong>5.4.</strong> Las cookies que nuestra Plataforma utiliza son las siguientes:
                </p>

                <p>
                  Cookies de Autenticación: permiten mostrar la información adecuada y a personalizar la experiencia del usuario, ayudándonos a determinar si ha accedido o no a la cuenta de la Plataforma.
                </p>
                <p>
                  Cookies Analíticas (Analytics): supervisan el rendimiento de la Plataforma a medida que el usuario interactúa con ella;
                </p>
                <p>
                  Cookies Funcionales (Functional): garantizan el correcto funcionamiento de la Plataforma, proporcionando funcionalidades y contenidos personalizados
                </p>

                <p>
                  <strong>5.5.</strong> Las cookies de terceros que alojamos en nuestro Sitio Web son las siguientes:
                </p>

                <p>
                  Analíticas: permiten monitorizar el rendimiento de nuestros sitios webs y/o herramienta, tal y como se ha indicado anteriormente. Los terceros que podrían tener acceso a esta información son: Google Analytics.
                </p>
                <p>
                  Publicitarias: permiten gestionar y adaptar el contenido al servicio solicitado, y los espacios publicitarios ofertados en su caso, en nuestros sitios web. Así podemos analizar comportamientos de navegación en internet y mostrar al usuario los anuncios que mejor se adapten a sus intereses. Además, las cookies son necesarias para gestionar campañas publicitarias, mediante el seguimiento de diversas pautas como número de veces que se ha visto un anuncio, o para mejorar y gestionar la exposición de anuncios, evitando al usuario la publicidad que ya se le ha mostrado. También permiten informar, optimizar y reportar nuestras impresiones de anuncios, otros usos de los servicios de publicidad, las interacciones con estas impresiones y servicios de publicidad repercuten en las visitas al sitio, y ofrecer publicidad basada en anteriores visitas que el usuario ha realizado a nuestra web. Los terceros con los que trabajamos o podemos llegar a trabajar, que utilizan este tipo de cookies son:DoubleClick
                </p>

                <p>
                  Para consultar la política de privacidad acerca de las cookies de los referidos terceros, recomendamos acceder a sus condiciones legales a través de los anteriores enlaces. Asimismo, en caso de que desee conocer el detalle de las cookies que TACOEMPLEOS utiliza en el Sitio Web, el Usuario puede remitir un correo electrónico al Canal de Contacto, el cual será respondido por TACOEMPLEOS a la mayor brevedad posible a la casilla de correo consignada en el perfil del Usuario.
                </p>

                <p>
                  <strong>5.6.</strong> Asimismo, utilizamos Microsoft Clarity para evaluar cómo los Usuarios utilizan e interactúan con nuestra Plataforma a través de métricas de comportamiento, mapas de calor y reproducción de sesión, con el fin de mejorar y comercializar nuestros productos/servicios. Los datos de uso de la Plataforma se recopilan mediante cookies de origen, cookies de terceros y otras tecnologías de seguimiento, que permiten determinar la popularidad de los productos/servicios y la actividad en línea. Además, utilizamos esta información para la optimización de nuestra Plataforma, evitar fraudes, fines de seguridad y publicidad. Para obtener más información sobre cómo Microsoft recopila y utiliza sus datos, visite la Declaración de Privacidad de Microsoft.
                </p>
              </div>
            </section>

            {/* Sección 6 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4">
                6. COMPARTIENDO SU INFORMACIÓN. CONSENTIMIENTO PARA EL ENVÍO DE NOVEDADES Y PROMOCIONES
              </h2>
              <div className="space-y-4 text-justify leading-relaxed">
                <p>
                  La Información Personal que el Usuario suministre será reputada y tratada como confidencial. Sin perjuicio de lo expuesto, a los fines de ejecutar los Servicios, TACOEMPLEOS podrá compartir total o parcialmente la Información Personal suministrada por el Usuario, con:
                </p>

                <p>
                  Los clientes de TacoEmpleos que acceden directamente a los perfiles de los Usuarios registrados y pueden contactarlos directamente a través de los datos de contacto que éstos proporcionen. El Usuario autoriza que se compartan con dichos clientes todos los datos e información que proporcione en su perfil —incluyendo, sin limitarse a, nombre, correo electrónico, experiencia, habilidades, educación, foto, currículum y cualquier otro contenido o archivo adjunto que suba—. Estos clientes actuarán como responsables independientes y deberán cumplir con sus propias políticas de privacidad.
                </p>
                <p>
                  Autoridades judiciales, fiscales o administrativas competentes cuando nos requieran dicha información o se trate de una obligación legal.
                </p>
                <p>
                  Proveedores de Servicios: esto incluye, pero sin limitarse a, nuestros proveedores de servicios de pago y nuestro proveedor de servicios de hosting de la Plataforma, que es Google LLC, ubicada en Estados Unidos de América, a donde se hace transferencia internacional de datos para lo cual el Usuario presta expresa y totalmente su consentimiento y conformidad.
                </p>

                <p>
                  Consentimiento para el envío de Novedades y Promociones: Si el Usuario da su consentimiento expreso para el envío de Novedades y Promociones, su información podrá ser compartida con entidades financieras y compañías de seguro de primera línea, empresas del sector educativo de reconocida trayectoria, y clientes de TACOEMPLEOS. Asimismo, el Usuario, al otorgar expresamente este consentimiento, autoriza a TACOEMPLEOS a transferir y/o proporcionar su Información Personal a otras entidades de TACOEMPLEOS ubicadas en el exterior. Asimismo, el Usuario, al otorgar expresamente este consentimiento, autoriza a TACOEMPLEOS para que a su discreción pueda de ofrecerle servicios y productos de terceros basados en las preferencias que Usted indicó al momento de completar la solicitud de registro o en cualquier momento posterior; tales ofertas pueden ser efectuadas por TACOEMPLEOS o por terceros. En caso de que el Usuario desee dejar de compartir esos datos y/o dejar de recibir información de este estilo, deberá informar a TACOEMPLEOS de este particular por escrito al Canal de Contacto.

                </p>

                <p>
                  Además, TACOEMPLEOS podrá compartir registros de comportamiento y actividad en el Sitio Web, parámetros de interés de búsquedas, historial de búsqueda y preferencias, con terceros que anuncien u ofrezcan productos o servicios en el Sitio Web.
                </p>

                <p>
                  Por otra parte, en el evento de vender todo o parte del negocio de TACOEMPLEOS, el Usuario autoriza expresamente y presta su consentimiento para que TACOEMPLEOS pueda transferir al comprador las bases de datos que contiene su Información Personal. De ser el caso, se le comunicará de este hecho oportunamente. La Información Personal también podrá ser compartida con potenciales compradores a efectos de llevar a cabo procesos de debida diligencia.
                </p>

                <p>
                  TACOEMPLEOS será responsable del cumplimiento efectivo de las obligaciones referentes al tratamiento de Información Personal por sus empresas relacionadas, sin perjuicio de la responsabilidad que les quepa a éstas por cualquier incumplimiento de tales obligaciones. Del mismo modo, en caso de que el tratamiento de Información Personal se haya de efectuar por empresas proveedoras de servicios para TACOEMPLEOS, aliados comerciales o sus empresas relacionadas, dichas empresas deberán asumir compromisos de confidencialidad y adoptar medidas que aseguren el debido cumplimiento de las obligaciones establecidas en ley aplicable.

                </p>
              </div>
            </section>

            {/* Sección 7 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4">
                7. PROTEGIENDO SU INFORMACIÓN PERSONAL
              </h2>
              <div className="space-y-4 text-justify leading-relaxed">
                <p>
                  <strong>7.1.</strong> Para prevenir cualquier acceso no autorizado, mantener la precisión de los datos y asegurar el uso correcto de su Información Personal, TACOEMPLEOS ha puesto en uso ciertos medios físicos, electrónicos, administrativos y procedimientos de seguridad para resguardar y asegurar la Información Personal que recopilamos en línea de la mejor manera posible. TACOEMPLEOS resguarda la Información Personal de acuerdo con estándares y procedimientos de seguridad establecidos y comúnmente utilizados en la industria, y continuamente evaluamos nueva tecnología para proteger esa información de la mejor manera posible. 

                </p>

                <p>
                  <strong>7.2.</strong> Sin perjuicio de lo mencionado en el punto 7.1, el Usuario reconoce que los medios técnicos existentes que brindan seguridad no son inexpugnables ni infalibles y que aun cuando se adopten todos los recaudos razonables de seguridad es posible sufrir hackeos, manipulaciones, robos, destrucción y/o pérdida de información. De presentarse estos casos, TACOEMPLEOS procederá conforme las leyes de cada país en materia de privacidad y protección de datos lo requieran.
                </p>
              </div>
            </section>

            {/* Sección 8 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4">
                8. TRANSFERENCIA INTERNACIONAL
              </h2>
              <div className="space-y-4 text-justify leading-relaxed">
                <p>
                  Al crear y registrar su Usuario y aceptar los términos y condiciones de TACOEMPLEOS, el Usuario consiente, reconoce, autoriza, y acepta expresamente que su Información Personal sea almacenada en la jurisdicción donde opere TACOEMPLEOS o que la misma pueda ser transferida, almacenada y tratada fuera de su país de residencia, incluyendo países que no tengan la misma normativa de protección de datos que la existente en TACOEMPLEOS y, en consecuencia, contar con un menor nivel de protección. La Información Personal recabada a través de la Plataforma sólo podrá ser transferida a nuestras filiales, entidades asociadas, proveedores de servicios y demás terceros ubicados en otros países para los fines anteriormente descritos. Cuando transfiramos su Información Personal a otros países, la protegeremos en la forma descrita en este documento y de acuerdo con la legislación aplicable. Asimismo, hemos implementado salvaguardias que garantizan un nivel adecuado de protección de la Información Personal que se transfiere fuera de su país de residencia.
                </p>
              </div>
            </section>

            {/* Sección 9 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4">
                9. MENORES DE EDAD Y/O PERSONAS QUE LA LEGISLACIÓN APLICABLE RECONOZCA COMO INCAPACES
              </h2>
              <div className="space-y-4 text-justify leading-relaxed">
                <p>
                  <strong>9.1.</strong> TACOEMPLEOS no tiene intenciones de recopilar Información Personal de menores de edad ni de personas que la legislación aplicable reconozca como incapaces. Cuando corresponda, y siempre y cuando TACOEMPLEOS tome conocimiento de que la información pertenece a una persona menor de edad o que la legislación aplicable reconozca como incapaz TACOEMPLEOS le indicará específicamente que no brinde esa información Personal en nuestra Plataforma y/o tomará medidas razonables para obtener el consentimiento de los padres, tutor o representante legal para la entrega de esa Información Personal. Solo se podrá almacenar Información Personal de menores de edad o de personas que la legislación aplicable reconozca como incapaces que cuente con la autorización de los padres o representantes legales. TACOEMPLEOS no se responsabiliza de dicha autorización.
                </p>

                <p>
                  <strong>9.2.</strong> Le informamos que en su condición de padre, tutor legal o representante será el responsable de que sus hijos menores y/o las personas que la legislación aplicable reconozca como incapaces bajo su tutela accedan a la Plataforma, por lo que recomendamos enfáticamente tomar las precauciones oportunas durante la navegación en la Plataforma. A este fin, le informamos que algunos navegadores permiten configurarse para que los niños no puedan acceder a páginas determinadas.

                </p>
              </div>
            </section>

            {/* Sección 10 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4">
                10. LINKS EXTERNOS
              </h2>
              <div className="space-y-4 text-justify leading-relaxed">
                <p>
                  La Plataforma puede contener enlaces (links) hacia y provenientes de otros sitios de Internet. TACOEMPLEOS no es ni será responsable por el contenido, alcance ni las prácticas de privacidad ni el tratamiento de los datos personales de esos sitios y, por lo tanto, el Usuario utilizará y accederá a esos sitios a su propio riesgo. TACOEMPLEOS recomienda que consulte las prácticas de privacidad de dichos sitios de Internet antes de su utilización.
                </p>
              </div>
            </section>

            {/* Sección 11 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4">
                11. DERECHOS DEL USUARIO
              </h2>
              <div className="space-y-4 text-justify leading-relaxed">
                <p>
                  <strong>11.1.</strong> Si el Usuario ha proporcionado voluntariamente Información Personal a través de los servicios disponibles en la Plataforma, el Usuario podrá acceder a la misma, revisar, modificar, eliminar y actualizar su Información Personal en el momento que lo desee.
                </p>

                <p>
                  <strong>11.2.</strong> Si el Usuario desea acceder a su Información Personal o si tal Información Personal es incorrecta, desactualizada y/o desea que la misma sea suprimida, el Usuario podrá enviar su solicitud por correo electrónico dirigido al Canal de Contacto, con el asunto "Informar", "Rectificar", "Suprimir" y/o "Actualizar" y/o cualquier otro según corresponda, conjuntamente con el objeto de su requerimiento y con la documentación necesaria para acreditar su identidad.
                </p>

                <p>
                  <strong>11.3.</strong> Asimismo, si el Usuario se suscribe a alguno de los servicios o comunicaciones que ofrece TACOEMPLEOS podrá dar de baja su suscripción en cualquier momento siguiendo las instrucciones incluidas en cada comunicación y para cada servicio.
                </p>

                <p>
                  <strong>11.4.</strong> TACOEMPLEOS cooperará con las autoridades de cada país cuando éstas requieran formalmente cualquier información relacionada con nuestras bases de datos
                </p>
              </div>
            </section>

            {/* Sección 12 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4">
                12. CAMBIOS A ESTE AVISO DE PRIVACIDAD
              </h2>
              <div className="space-y-4 text-justify leading-relaxed">
                <p>
                TACOEMPLEOS se reserva el derecho a modificar y actualizar esta Política periódicamente, en cuyo caso la política actualizada se publicará en esta misma Plataforma, siendo obligación del Usuario revisar regularmente esta sección a fin de informarse de cualquier cambio que se pueda haber producido. De todos modos, TACOEMPLEOS podrá cursar una comunicación a su cuenta de correo electrónico registrada a efectos de informarle sobre el cambio en la Política, no siendo obligación de TACOEMPLEOS notificarle dichos cambios.
                </p>
              </div>
            </section>

            {/* Sección 13 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4">
                13. INFORMACIÓN GENERAL
              </h2>
              <div className="space-y-4 text-justify leading-relaxed">
                <p>
                  <strong>13.1.</strong> Responsable: A los fines de la presente Política de Privacidad, se considera responsable del tratamiento de los datos personales a TacoEmpleos. Para cualquier consulta, reclamo o solicitud vinculada al tratamiento de datos, podés contactarnos al correo: legales@tacoempleos.com.mx
                </p>
                <p>
                  Domicilio electrónico para oír y recibir notificaciones: legales@tacoempleos.com.mx
                </p>

                <p>
                  <strong>13.2.</strong> Ley aplicable y jurisdicción: Esta Política de Privacidad se rige por las leyes de la República Argentina. Ante cualquier controversia relacionada con su interpretación, aplicación o cumplimiento, las partes se someten a la jurisdicción de los tribunales ordinarios de la Ciudad Autónoma de Buenos Aires, con renuncia expresa a cualquier otro fuero que pudiera corresponder.
                </p>

                <p>
                  <strong>13.3</strong> La Plataforma y sus servicios están dirigidos exclusivamente a personas que residan habitualmente en México y sean mayores de edad. Al registrarse, el Usuario declara bajo protesta de decir verdad que cumple este requisito. TACOEMPLEOS no asume obligación alguna de cumplimiento de normativas de protección de datos de otras jurisdicciones.
                </p>

                <p>
                  <strong>13.4.</strong> Usted tiene derecho de acceder a la Información Personal que poseemos y a los detalles de su tratamiento, así como a rectificarlos en caso de ser inexactos o incompletos, cancelarlos u oponerse o limitar su tratamiento para fines específicos. Para ejercer los derechos de acceso, rectificación, cancelación u oposición, deberá cumplir con los requerimientos del artículo 29 de la Ley Federal de Protección de Datos en Posesión de los Particulares, para lo cual deberá presentar una solicitud por escrito debidamente firmada, a TACOEMPLEOS, y deberá identificarse a satisfacción de TACOEMPLEOS, mediante documento oficial. TACOEMPLEOS dará respuesta a cada solicitud dentro del plazo máximo que corresponda conforme a la legislación aplicable vigente a la fecha de la solicitud, a partir de que se reciba la solicitud que cumpla con los requerimientos del artículo 29 de la Ley Federal de Protección de Datos en Posesión de los Particulares y que se presente la mencionada solicitud e identificación en los términos indicados.

                </p>

                <p>
                  <strong>13.5.</strong> El contacto en México para ejercer los derechos de acceso, rectificación, cancelación u oposición de la Información Personal es: legales@tacoempleos.com.mx (el "Canal de Contacto").
                </p>

                <p className="font-semibold">
                  Esta Política de Privacidad fue actualizada por última vez el 22 de Julio de 2025.
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