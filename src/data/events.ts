import { GameEvent } from '../types';

export const EVENTS: GameEvent[] = [
  // ─── CRISIS ───────────────────────────────────────────────
  {
    id: 'crisis_prod_friday',
    category: 'crisis',
    title: 'Producción caída. Son las 5pm del viernes.',
    body: 'El CEO está en el Slack. El cliente está en el Slack. Tu jefe está en el Slack. Tú estabas a punto de cerrar la laptop.',
    weight: 9,
    choices: [
      {
        id: 'a',
        text: 'Te quedas y lo resuelves tú solo',
        effects: { stress: +25, energy: -20, skill: +5, money: +5 },
        followUpText: 'Lo arreglaste a las 9pm. El CEO puso un 👍 en el mensaje.',
      },
      {
        id: 'b',
        text: 'Mandas un "lo veo" y apagas el teléfono',
        effects: { stress: -10, energy: +10, money: -15 },
        followUpText: 'El lunes fue… tenso.',
      },
      {
        id: 'c',
        text: 'Culpas al deploy del backend',
        effects: { stress: +5, skill: -5, money: -5 },
        followUpText: 'Nadie te creyó. El backend dev lo sabe.',
      },
    ],
  },
  {
    id: 'crisis_database_wipe',
    category: 'crisis',
    title: 'Alguien corrió DROP TABLE en producción.',
    body: 'Hay silencio en el canal de #general. Un silencio muy específico.',
    weight: 5,
    weekMin: 2,
    choices: [
      {
        id: 'a',
        text: 'Revisar si hay backup',
        effects: { stress: +15, energy: -15, skill: +10 },
        requiresMinStat: { skill: 40 },
        followUpText: 'Había backup de hace 6 horas. Podría ser peor.',
      },
      {
        id: 'b',
        text: 'Entrar en modo pánico y mandar mensajes a todos',
        effects: { stress: +30, energy: -20, money: -10 },
        followUpText: 'El canal de Slack nunca se recuperó.',
      },
      {
        id: 'c',
        text: 'Guardar silencio y esperar que alguien más lo vea',
        effects: { stress: +20, skill: -10, money: -20 },
        followUpText: 'El CEO lo vio antes que tú lo reportaras.',
      },
    ],
  },
  {
    id: 'crisis_npm_broken',
    category: 'crisis',
    title: '"npm install" lleva 40 minutos corriendo.',
    body: 'Node modules tiene 847 dependencias. Alguna rompe el build. No sabes cuál.',
    weight: 8,
    choices: [
      {
        id: 'a',
        text: 'Borrar node_modules y volver a instalar',
        effects: { stress: +10, energy: -10 },
        followUpText: 'Tardó otros 40 minutos. Funcionó.',
      },
      {
        id: 'b',
        text: 'Googlear el error exacto',
        effects: { stress: +5, skill: +5, energy: -5 },
        followUpText: 'Stack Overflow tenía la respuesta. De 2019.',
      },
      {
        id: 'c',
        text: 'Declarar que "en mi máquina funciona" y cerrar el issue',
        effects: { stress: -10, skill: -10, money: -5 },
        followUpText: 'El issue fue reabierto 3 veces.',
      },
    ],
  },

  // ─── CLIENT ───────────────────────────────────────────────
  {
    id: 'client_move_button',
    category: 'client',
    title: '"¿Pueden mover el botón 2px a la izquierda?"',
    body: 'El cliente tiene una presentación mañana. Necesita el cambio "urgente". El botón ya está centrado matemáticamente.',
    weight: 9,
    choices: [
      {
        id: 'a',
        text: 'Hacerlo sin decir nada',
        effects: { stress: +5, energy: -5, money: +5 },
        followUpText: 'Al día siguiente pidió moverlo 2px a la derecha.',
      },
      {
        id: 'b',
        text: 'Explicar por qué ya está bien centrado',
        effects: { stress: +15, skill: +5, energy: -10 },
        followUpText: 'No te entendió. Pero lo respetó.',
      },
      {
        id: 'c',
        text: 'Cobrar por el cambio como "consultoría de diseño"',
        effects: { stress: -5, money: +10, skill: +5 },
        followUpText: '...funcionó.',
      },
    ],
  },
  {
    id: 'client_scope_creep',
    category: 'client',
    title: '"Ya que están, ¿pueden agregar esto también?"',
    body: 'Son las 4pm del jueves. El entregable es mañana. El cliente acaba de agregar "un pequeño feature" que toma 2 semanas.',
    weight: 9,
    choices: [
      {
        id: 'a',
        text: 'Decir que sí y quedarte toda la noche',
        effects: { stress: +30, energy: -30, money: +10 },
        followUpText: 'Lo entregaste. No te dieron las gracias.',
      },
      {
        id: 'b',
        text: 'Explicar que eso requiere un nuevo sprint',
        effects: { stress: +10, skill: +10, money: -5 },
        followUpText: 'El cliente no estaba feliz. Pero el PM te agradeció.',
      },
      {
        id: 'c',
        text: 'Ignorar el mensaje hasta mañana',
        effects: { stress: -5, energy: +5, money: -15 },
        followUpText: 'El cliente llamó directamente al CEO.',
      },
    ],
  },
  {
    id: 'client_redesign',
    category: 'client',
    title: '"Quiero rediseñar todo. El logo también."',
    body: 'Llevan 3 meses construyendo el producto. El cliente vio la web de un competidor y ya no le gusta nada.',
    weight: 7,
    choices: [
      {
        id: 'a',
        text: 'Presentar un plan de transición con costos',
        effects: { stress: +10, skill: +10, money: +15 },
        requiresMinStat: { skill: 50 },
        followUpText: 'El cliente aprobó el presupuesto extra.',
      },
      {
        id: 'b',
        text: 'Aceptar todo sin negociar',
        effects: { stress: +25, energy: -20, money: -10 },
        followUpText: 'Tres semanas de trabajo tiradas. El nuevo diseño tampoco gustó.',
      },
      {
        id: 'c',
        text: 'Renunciar al proyecto',
        effects: { stress: -20, money: -30, energy: +15 },
        followUpText: 'La mejor decisión de tu carrera. Por ahora.',
      },
    ],
  },

  // ─── TECHNICAL ────────────────────────────────────────────
  {
    id: 'tech_merge_conflict',
    category: 'technical',
    title: 'Merge conflict en 47 archivos.',
    body: 'Tu compañero trabajó directo en main. Tú también. Nadie habló con nadie.',
    weight: 8,
    choices: [
      {
        id: 'a',
        text: 'Resolver conflict por conflict con calma',
        effects: { stress: +15, energy: -15, skill: +5 },
        followUpText: 'Tardaste 2 horas pero quedó limpio.',
      },
      {
        id: 'b',
        text: 'Aceptar "theirs" en todo y rezar',
        effects: { stress: +5, energy: -5, skill: -10 },
        followUpText: 'Se fueron 3 features tuyas. Nadie notó por una semana.',
      },
      {
        id: 'c',
        text: 'Crear una rama nueva y copiar tus cambios a mano',
        effects: { stress: +20, energy: -20, skill: +10 },
        followUpText: 'Tardaste 3 horas pero entendiste qué pasó.',
      },
    ],
  },
  {
    id: 'tech_mysterious_bug',
    category: 'technical',
    title: 'Un bug apareció. No tocaste ese código en 6 meses.',
    body: 'El error dice "undefined is not a function". El stack trace lleva a un archivo de librería. Los usuarios están reportando.',
    weight: 8,
    choices: [
      {
        id: 'a',
        text: 'Debuggear paso a paso hasta encontrarlo',
        effects: { stress: +20, energy: -20, skill: +15 },
        followUpText: 'Era una actualización de librería. Lo marcaste en el changelog.',
      },
      {
        id: 'b',
        text: 'Rollback inmediato del último deploy',
        effects: { stress: -5, energy: -10, money: -5 },
        followUpText: 'Funcionó. El bug sigue ahí para el próximo sprint.',
      },
      {
        id: 'c',
        text: 'Cerrar los reportes como "no reproducible"',
        effects: { stress: -10, skill: -15, money: -10 },
        followUpText: 'El bug volvió. Pero peor.',
      },
    ],
  },
  {
    id: 'tech_legacy_code',
    category: 'technical',
    title: 'Te asignaron mantener código legacy de 2015.',
    body: 'Sin tests. Sin documentación. El dev original ya no trabaja aquí. Los comentarios dicen "TODO: fix this".',
    weight: 7,
    choices: [
      {
        id: 'a',
        text: 'Escribir tests primero antes de tocar nada',
        effects: { stress: +10, energy: -15, skill: +20 },
        requiresMinStat: { energy: 30 },
        followUpText: 'Doloroso pero profesional. El equipo lo agradeció después.',
      },
      {
        id: 'b',
        text: 'Reescribir todo "rápido"',
        effects: { stress: +35, energy: -30, money: -15 },
        followUpText: 'Duró 3 semanas, no 2 días. El nuevo código tiene otros bugs.',
      },
      {
        id: 'c',
        text: 'Solo tocar lo mínimo necesario y salir corriendo',
        effects: { stress: +5, energy: -5, skill: -5 },
        followUpText: 'Funciona. Más o menos.',
      },
    ],
  },

  // ─── SOCIAL ───────────────────────────────────────────────
  {
    id: 'social_daily',
    category: 'social',
    title: 'Daily de 15 minutos que lleva 1 hora.',
    body: 'El PM preguntó "¿alguna duda?" y alguien dijo que sí. Ahora estás viendo el techo.',
    weight: 9,
    choices: [
      {
        id: 'a',
        text: 'Poner la cámara apagada y silenciarte',
        effects: { stress: -5, energy: +5 },
        followUpText: 'Revisaste 40 notificaciones de Slack en ese tiempo.',
      },
      {
        id: 'b',
        text: 'Proponer mover la discusión a un thread',
        effects: { stress: -10, skill: +5, energy: -5 },
        followUpText: 'El PM no quedó feliz. El equipo sí.',
      },
      {
        id: 'c',
        text: 'Participar activamente para quedar bien',
        effects: { stress: +10, energy: -15, money: +5 },
        followUpText: 'El jefe lo notó. Pero perdiste 1 hora de trabajo.',
      },
    ],
  },
  {
    id: 'social_performance_review',
    category: 'social',
    title: 'Performance review con tu jefe.',
    body: 'Llevas todo el año trabajando fuerte. Llegó la hora de la verdad.',
    weight: 6,
    weekMin: 3,
    choices: [
      {
        id: 'a',
        text: 'Presentar tus logros con métricas',
        effects: { stress: +10, money: +20, skill: +5 },
        requiresMinStat: { skill: 55 },
        followUpText: 'Conseguiste el aumento. Merecido.',
      },
      {
        id: 'b',
        text: 'Esperar a que tu jefe hable primero',
        effects: { stress: +15, money: +5 },
        followUpText: 'Te dieron el mínimo. "Para el próximo año."',
      },
      {
        id: 'c',
        text: 'Aprovechar para pedir trabajo remoto',
        effects: { stress: -10, energy: +15, money: -5 },
        followUpText: 'No aceptaron el remoto pero el ambiente mejoró.',
      },
    ],
  },

  // ─── CAREER ───────────────────────────────────────────────
  {
    id: 'career_job_offer',
    category: 'career',
    title: 'Un recruiter de LinkedIn te ofrece el doble de sueldo.',
    body: 'La empresa suena bien. El rol suena bien. Pero llevas 2 años en el equipo actual y hay un lanzamiento en 3 semanas.',
    weight: 6,
    weekMin: 2,
    choices: [
      {
        id: 'a',
        text: 'Aceptar la oferta',
        effects: { money: +30, stress: +20, energy: -10 },
        followUpText: 'Más dinero, más estrés, mismos problemas diferentes stack.',
      },
      {
        id: 'b',
        text: 'Usar la oferta para negociar con tu empresa actual',
        effects: { money: +15, stress: +15, skill: +5 },
        followUpText: 'Te dieron el 70% de la oferta. Quedaste.',
      },
      {
        id: 'c',
        text: 'Ignorarla. Ahora no es el momento.',
        effects: { stress: -5, energy: +5 },
        followUpText: 'Tranquilidad por ahora. El recruiter volvió a escribir al mes.',
      },
    ],
  },
  {
    id: 'career_side_project',
    category: 'career',
    title: 'Tienes una idea de side project increíble.',
    body: 'Podría ser el próximo unicornio. O podrías perder los fines de semana por 6 meses.',
    weight: 5,
    choices: [
      {
        id: 'a',
        text: 'Empezar este fin de semana',
        effects: { stress: +10, energy: -20, skill: +15, money: -5 },
        followUpText: 'Lo construiste. Nadie lo usó. Aprendiste mucho.',
      },
      {
        id: 'b',
        text: 'Guardarlo en Notion para "cuando tenga tiempo"',
        effects: { stress: -5 },
        followUpText: 'Está en Notion junto a las otras 12 ideas.',
      },
      {
        id: 'c',
        text: 'Buscar un cofundador primero',
        effects: { stress: +5, energy: -10, money: -5 },
        followUpText: 'Encontraste a alguien. La reunión de kick-off fue bien.',
      },
    ],
  },

  // ─── RANDOM ───────────────────────────────────────────────
  {
    id: 'random_no_coffee',
    category: 'random',
    title: 'La cafetera de la oficina está rota.',
    body: 'Son las 9am. Tienes una demo a las 10am. No dormiste bien.',
    weight: 8,
    choices: [
      {
        id: 'a',
        text: 'Ir a la cafetería de abajo',
        effects: { stress: -10, energy: +15, money: -3 },
        followUpText: 'El café estuvo bueno. Llegaste 5 minutos tarde a la demo.',
      },
      {
        id: 'b',
        text: 'Tomar agua y sobrevivir',
        effects: { stress: +10, energy: -10 },
        followUpText: 'La demo salió... decente.',
      },
      {
        id: 'c',
        text: 'Pedir a alguien que traiga café para todos',
        effects: { stress: -5, energy: +10, money: -5 },
        followUpText: 'Eres el héroe de la oficina por hoy.',
      },
    ],
  },
  {
    id: 'random_internet_down',
    category: 'random',
    title: 'Internet de la oficina caído. 2 horas.',
    body: 'Tienes un deadline hoy. El hotspot del celular va lento. El equipo de IT "está trabajando en ello".',
    weight: 7,
    choices: [
      {
        id: 'a',
        text: 'Trabajar en lo que puedas offline',
        effects: { stress: +5, energy: -5, skill: +5 },
        followUpText: 'Avanzaste más de lo esperado sin distracciones.',
      },
      {
        id: 'b',
        text: 'Irte a trabajar desde un café',
        effects: { stress: -10, energy: +5, money: -8 },
        followUpText: 'Productividad 200%. Internet del café mejor que el de la oficina.',
      },
      {
        id: 'c',
        text: 'Declarar el día perdido y ver YouTube en 4G',
        effects: { stress: -15, energy: +10, money: -5 },
        followUpText: 'Mañana vas a sufrir. Pero hoy fue bien.',
      },
    ],
  },
  {
    id: 'random_standup_camera',
    category: 'random',
    title: 'Tu cámara se activó sola en el standup.',
    body: 'Estabas en pijama. Comiendo cereal. El CEO estaba en la llamada.',
    weight: 6,
    choices: [
      {
        id: 'a',
        text: 'Apagar la cámara inmediatamente y pretender que nada',
        effects: { stress: +15 },
        followUpText: 'El CEO mandó un emoji de 😂 en el chat. No sabes si es bueno.',
      },
      {
        id: 'b',
        text: 'Reírte del momento y hacer un comentario',
        effects: { stress: -5, energy: -5 },
        followUpText: 'Todos se rieron. Quedaste como el cool del equipo.',
      },
      {
        id: 'c',
        text: 'Decir que "estás trabajando remoto desde casa"',
        effects: { stress: +5, skill: +5 },
        followUpText: 'El CEO aprobó trabajo remoto para todos esa semana.',
      },
    ],
  },

  // ─── EXISTENTIAL ──────────────────────────────────────────
  {
    id: 'exist_ai_replace',
    category: 'existential',
    title: '"¿Pueden hacer esto con ChatGPT en vez de contratar?"',
    body: 'El CEO leyó un artículo sobre IA. Ahora tiene preguntas. Tú tienes ansiedad.',
    weight: 7,
    weekMin: 2,
    choices: [
      {
        id: 'a',
        text: 'Demostrar lo que haces que la IA no puede',
        effects: { stress: +15, skill: +15, money: +10 },
        requiresMinStat: { skill: 50 },
        followUpText: 'El CEO quedó impresionado. Por ahora estás seguro.',
      },
      {
        id: 'b',
        text: 'Abrazar la IA y usarla como herramienta',
        effects: { stress: -5, skill: +10, energy: +5 },
        followUpText: 'Tu productividad se duplicó. Eres el "AI champion" del equipo.',
      },
      {
        id: 'c',
        text: 'Entrar en crisis existencial silenciosa',
        effects: { stress: +25, energy: -15 },
        followUpText: 'Actualizaste tu LinkedIn esa noche.',
      },
    ],
  },
  {
    id: 'exist_burnout_edge',
    category: 'existential',
    title: 'Llevas 3 semanas sin un día libre real.',
    body: 'Abres el código y no sientes nada. Cierras el código y tampoco. El cursor parpadea.',
    weight: 6,
    weekMin: 3,
    choices: [
      {
        id: 'a',
        text: 'Pedir un día de descanso',
        effects: { stress: -20, energy: +25, money: -5 },
        followUpText: 'Un día. Pero lo necesitabas.',
      },
      {
        id: 'b',
        text: 'Empujar un poco más',
        effects: { stress: +30, energy: -25 },
        followUpText: 'Llegaste al límite. El código de esa semana tuvo 6 bugs.',
      },
      {
        id: 'c',
        text: 'Hablar con tu jefe sobre la carga de trabajo',
        effects: { stress: -10, skill: +5, energy: +10 },
        requiresMinStat: { energy: 25 },
        followUpText: 'No cambió todo, pero algo mejoró.',
      },
    ],
  },

  // ─── CRISIS (más) ─────────────────────────────────────────
  {
    id: 'crisis_wrong_env',
    category: 'crisis',
    title: 'Hiciste deploy a producción en vez de staging.',
    body: 'El comando era casi idéntico. Todos los usuarios están viendo los datos de prueba. Uno de esos datos de prueba dice "CLIENTE TONTO".',
    weight: 6,
    weekMin: 2,
    choices: [
      {
        id: 'a',
        text: 'Rollback inmediato y avisar al equipo',
        effects: { stress: +20, energy: -15, skill: +5 },
        followUpText: 'Estuvo caído 8 minutos. El "CLIENTE TONTO" no lo vio. Probablemente.',
      },
      {
        id: 'b',
        text: 'Intentar corregir los datos en vivo',
        effects: { stress: +35, energy: -25, money: -10 },
        followUpText: 'Lo empeoraste. El rollback fue inevitable igual.',
      },
      {
        id: 'c',
        text: 'Pretender que fue un "test de resiliencia planificado"',
        effects: { stress: +10, skill: -10 },
        followUpText: 'El CEO preguntó por el documento del test. No existía.',
      },
    ],
  },
  {
    id: 'crisis_deleted_branch',
    category: 'crisis',
    title: 'Borraste la rama main del repositorio.',
    body: '`git push --force` parecía buena idea en ese momento. Ahora el repo está vacío.',
    weight: 4,
    weekMin: 1,
    choices: [
      {
        id: 'a',
        text: 'Buscar en el historial local cómo recuperarlo',
        effects: { stress: +25, energy: -20, skill: +15 },
        requiresMinStat: { skill: 45 },
        followUpText: 'git reflog al rescate. Perdiste 2 commits. Pudo ser peor.',
      },
      {
        id: 'b',
        text: 'Confesar inmediatamente al equipo',
        effects: { stress: +30, money: -10 },
        followUpText: 'El equipo tenía clones locales. Recuperaron todo. La vergüenza, no.',
      },
      {
        id: 'c',
        text: 'Esperar a que alguien más lo note',
        effects: { stress: +40, money: -20, skill: -10 },
        followUpText: 'Lo notaron en el standup. Todos sabían que fuiste tú.',
      },
    ],
  },
  {
    id: 'crisis_infinite_loop',
    category: 'crisis',
    title: 'Tu código entró en un loop infinito en producción.',
    body: 'El servidor lleva 20 minutos al 100% de CPU. Los logs dicen "request received" 400.000 veces.',
    weight: 6,
    choices: [
      {
        id: 'a',
        text: 'Matar el proceso y hacer hotfix',
        effects: { stress: +20, energy: -15, skill: +10 },
        followUpText: 'Servicio restaurado en 15 minutos. El fix fue una sola línea.',
      },
      {
        id: 'b',
        text: 'Escalar más servidores para aguantar la carga',
        effects: { stress: +10, money: -20 },
        followUpText: 'La factura de AWS de ese día fue épica.',
      },
      {
        id: 'c',
        text: 'Reiniciar todo y rezar',
        effects: { stress: +15, energy: -10, skill: -5 },
        followUpText: 'Funcionó. El bug sigue en el código.',
      },
    ],
  },

  // ─── CLIENT (más) ──────────────────────────────────────────
  {
    id: 'client_unpaid_invoice',
    category: 'client',
    title: 'El cliente lleva 60 días sin pagar.',
    body: 'La app está funcionando perfectamente en producción. Sus usuarios la usan todos los días. Tu cuenta bancaria, no tanto.',
    weight: 7,
    weekMin: 2,
    choices: [
      {
        id: 'a',
        text: 'Mandar email formal con ultimátum',
        effects: { stress: +15, money: +20, skill: +5 },
        followUpText: 'Pagaron al día siguiente. La relación sobrevivió.',
      },
      {
        id: 'b',
        text: 'Desactivar el acceso hasta recibir el pago',
        effects: { stress: +20, money: +30, skill: -5 },
        followUpText: 'Pagaron en 2 horas. También amenazaron con demandarte.',
      },
      {
        id: 'c',
        text: 'Seguir esperando para no crear conflicto',
        effects: { stress: +10, money: -10 },
        followUpText: 'Pagaron a los 90 días. Con un descuento que tú no pediste.',
      },
    ],
  },
  {
    id: 'client_copy_competitor',
    category: 'client',
    title: '"Quiero exactamente esto, pero diferente."',
    body: 'El cliente te mandó 3 screenshots del producto del competidor y dice que quiere "algo así pero que sea nuestro".',
    weight: 7,
    choices: [
      {
        id: 'a',
        text: 'Pedirle que defina qué es "nuestro"',
        effects: { stress: +10, skill: +5, energy: -5 },
        followUpText: 'La reunión duró 2 horas. Saliste con un brief claro.',
      },
      {
        id: 'b',
        text: 'Copiar el diseño y cambiar los colores',
        effects: { stress: -5, money: +5, skill: -10 },
        followUpText: 'El cliente quedó feliz. Tu portafolio, menos.',
      },
      {
        id: 'c',
        text: 'Proponer algo completamente diferente y original',
        effects: { stress: +15, energy: -10, skill: +15, money: -5 },
        requiresMinStat: { skill: 50 },
        followUpText: 'Le encantó. Ahora te pide que lo cambies "un poco".',
      },
    ],
  },
  {
    id: 'client_last_minute_meeting',
    category: 'client',
    title: 'Reunión sorpresa con el cliente en 30 minutos.',
    body: 'No hay agenda. No hay contexto. Solo un mensaje: "¿Pueden hacer una llamada ahorita?"',
    weight: 8,
    choices: [
      {
        id: 'a',
        text: 'Prepararte rápido con lo que puedas',
        effects: { stress: +15, energy: -10, skill: +5 },
        followUpText: 'Solo querían mostrar el producto a alguien. Fue fácil.',
      },
      {
        id: 'b',
        text: 'Entrar a la reunión sin preparación',
        effects: { stress: +20, energy: -5 },
        followUpText: 'Te preguntaron algo que no sabías. "Te lo confirmo después."',
      },
      {
        id: 'c',
        text: 'Posponer para el día siguiente con agenda',
        effects: { stress: -10, skill: +10, money: -5 },
        followUpText: 'El cliente se molestó un poco, pero la reunión del día siguiente fue productiva.',
      },
    ],
  },

  // ─── TECHNICAL (más) ───────────────────────────────────────
  {
    id: 'tech_outdated_deps',
    category: 'technical',
    title: '47 dependencias desactualizadas. 12 con vulnerabilidades críticas.',
    body: 'El reporte de seguridad llegó por email. El cliente lo vio antes que tú.',
    weight: 7,
    choices: [
      {
        id: 'a',
        text: 'Actualizar todo esta semana',
        effects: { stress: +20, energy: -20, skill: +10 },
        followUpText: 'Rompiste 3 cosas. Las arreglaste. El reporte quedó limpio.',
      },
      {
        id: 'b',
        text: 'Actualizar solo las críticas',
        effects: { stress: +10, energy: -10, skill: +5 },
        followUpText: 'Razonable. El cliente quedó satisfecho con la respuesta.',
      },
      {
        id: 'c',
        text: 'Marcar el reporte como "falso positivo"',
        effects: { stress: +5, skill: -15, money: -10 },
        followUpText: 'El auditor no estuvo de acuerdo.',
      },
    ],
  },
  {
    id: 'tech_no_tests',
    category: 'technical',
    title: 'Te piden agregar tests. El código tiene 0% de cobertura.',
    body: 'El proyecto lleva 2 años sin un solo test. El jefe dice que "ahora sí hay que hacerlo".',
    weight: 6,
    choices: [
      {
        id: 'a',
        text: 'Estimar el tiempo real y presentarlo',
        effects: { stress: +10, skill: +10, money: +5 },
        requiresMinStat: { skill: 40 },
        followUpText: 'El jefe no esperaba ese número. Pero lo aprobó.',
      },
      {
        id: 'b',
        text: 'Escribir tests superficiales rápido para "cumplir"',
        effects: { stress: +5, skill: -10, money: -5 },
        followUpText: '40% de cobertura. 0% de utilidad real.',
      },
      {
        id: 'c',
        text: 'Refactorizar primero para que sea testeable',
        effects: { stress: +25, energy: -20, skill: +20 },
        requiresMinStat: { energy: 40 },
        followUpText: 'Tardó el doble, pero el código quedó mucho mejor.',
      },
    ],
  },
  {
    id: 'tech_wrong_timezone',
    category: 'technical',
    title: 'Tu app no maneja timezones. En producción.',
    body: 'Los usuarios de otro país ven las fechas desfasadas. Los eventos del calendario aparecen un día antes.',
    weight: 6,
    weekMin: 2,
    choices: [
      {
        id: 'a',
        text: 'Arreglarlo correctamente con UTC en toda la app',
        effects: { stress: +25, energy: -20, skill: +15 },
        requiresMinStat: { skill: 55 },
        followUpText: 'Doloroso. Pero quedó bien. Fuiste el héroe silencioso.',
      },
      {
        id: 'b',
        text: 'Avisar a los usuarios que "es una limitación conocida"',
        effects: { stress: +5, money: -10, skill: -5 },
        followUpText: 'Los reviews en la tienda lo mencionan.',
      },
      {
        id: 'c',
        text: 'Agregar +1 día en el frontend como parche',
        effects: { stress: +10, skill: -15, money: -5 },
        followUpText: 'Funciona para el 80%. El 20% restante está confundido.',
      },
    ],
  },

  // ─── SOCIAL (más) ──────────────────────────────────────────
  {
    id: 'social_slack_mistake',
    category: 'social',
    title: 'Mandaste un mensaje al canal equivocado.',
    body: 'Querías decirle algo a tu amigo sobre tu jefe. Lo mandaste al canal #general con el jefe adentro.',
    weight: 7,
    choices: [
      {
        id: 'a',
        text: 'Borrarlo inmediatamente y pretender que nada',
        effects: { stress: +20 },
        followUpText: 'Todo el mundo ya lo había visto. Slack no tiene "unsend" real.',
      },
      {
        id: 'b',
        text: 'Disculparte públicamente con humor',
        effects: { stress: +10, energy: -5 },
        followUpText: 'El equipo se rió. Tu jefe también, pero con una sonrisa extraña.',
      },
      {
        id: 'c',
        text: 'Hablar directamente con tu jefe en privado',
        effects: { stress: +15, skill: +10 },
        followUpText: 'Conversación incómoda pero honesta. La respetó.',
      },
    ],
  },
  {
    id: 'social_pair_programming',
    category: 'social',
    title: 'Sesión de pair programming con el dev más senior.',
    body: 'Están mirando tu código. En tiempo real. Acabas de ver que tienes 3 `console.log` olvidados.',
    weight: 7,
    choices: [
      {
        id: 'a',
        text: 'Borrarlos antes de que los vea',
        effects: { stress: +10, energy: -5 },
        followUpText: 'Los vio de todos modos. "No importa, yo también los dejo."',
      },
      {
        id: 'b',
        text: 'Reírte y borrarlo con calma',
        effects: { stress: -5, skill: +5 },
        followUpText: 'Le cayó bien tu actitud. Terminaron bien la sesión.',
      },
      {
        id: 'c',
        text: 'Fingir que son logs intencionales de debugging',
        effects: { stress: +15, skill: -5 },
        followUpText: '"¿Y qué debuggeas con console.log(\'aquí\')?"',
      },
    ],
  },
  {
    id: 'social_new_teammate',
    category: 'social',
    title: 'Entra un nuevo dev al equipo. Te toca hacer onboarding.',
    body: 'El proyecto no tiene documentación. El setup tarda 4 horas si sabes lo que haces.',
    weight: 6,
    choices: [
      {
        id: 'a',
        text: 'Documentar el proceso mientras haces el onboarding',
        effects: { stress: +10, energy: -15, skill: +10 },
        followUpText: 'Dolor de corto plazo. El equipo te lo agradeció por meses.',
      },
      {
        id: 'b',
        text: 'Decirle "pregúntame si tienes dudas" y seguir con lo tuyo',
        effects: { stress: -5, energy: +5 },
        followUpText: 'Te preguntó 30 veces. Cada vez que estabas en flow.',
      },
      {
        id: 'c',
        text: 'Dedicarle el día completo para que arranque bien',
        effects: { stress: +5, energy: -20, skill: +5, money: +5 },
        followUpText: 'Arrancó bien. El jefe notó que perdiste productividad ese día.',
      },
    ],
  },

  // ─── CAREER (más) ──────────────────────────────────────────
  {
    id: 'career_conference_talk',
    category: 'career',
    title: 'Te invitaron a dar una charla en una conferencia de tech.',
    body: 'El tema lo dominas. Pero son 300 personas. Y te grabaron en la última que diste tartamudeando.',
    weight: 5,
    weekMin: 2,
    choices: [
      {
        id: 'a',
        text: 'Aceptar y prepararte bien',
        effects: { stress: +20, energy: -15, skill: +20, money: +10 },
        requiresMinStat: { energy: 35 },
        followUpText: 'Salió bien. Tres personas te escribieron por LinkedIn ese día.',
      },
      {
        id: 'b',
        text: 'Declinar educadamente',
        effects: { stress: -10 },
        followUpText: 'Sin estrés. Pero la oportunidad no volvió ese mes.',
      },
      {
        id: 'c',
        text: 'Aceptar y prepararte lo mínimo',
        effects: { stress: +30, energy: -20, skill: +5 },
        followUpText: 'La charla fue mediocre. Aprendiste qué no hacer.',
      },
    ],
  },
  {
    id: 'career_freelance_client',
    category: 'career',
    title: 'Un cliente nuevo te ofrece un proyecto freelance urgente.',
    body: 'Buena paga. Deadline apretado. Tienes trabajo full-time. El proyecto es "sencillo" (palabras del cliente).',
    weight: 6,
    choices: [
      {
        id: 'a',
        text: 'Aceptarlo y trabajar noches y fines de semana',
        effects: { stress: +30, energy: -25, money: +25 },
        followUpText: 'El dinero entró. Tu cuerpo, no te lo perdonó.',
      },
      {
        id: 'b',
        text: 'Cobrar el doble por la urgencia',
        effects: { stress: +10, money: +15, skill: +5 },
        followUpText: 'Aceptaron. El proyecto era el doble de complejo de lo prometido.',
      },
      {
        id: 'c',
        text: 'Rechazarlo. Tienes suficiente en el plato.',
        effects: { stress: -10, energy: +10 },
        followUpText: 'Decisión correcta. Pudiste dormir bien esa semana.',
      },
    ],
  },

  // ─── RANDOM (más) ──────────────────────────────────────────
  {
    id: 'random_stackoverflow_down',
    category: 'random',
    title: 'Stack Overflow está caído.',
    body: 'Tienes un bug que nunca habías visto. Sin Stack Overflow. Sin respuestas. Solo tú y la documentación oficial.',
    weight: 7,
    choices: [
      {
        id: 'a',
        text: 'Leer la documentación oficial desde el principio',
        effects: { stress: +10, energy: -15, skill: +20 },
        requiresMinStat: { energy: 30 },
        followUpText: 'Lo resolviste. Y ahora entiendes la librería de verdad.',
      },
      {
        id: 'b',
        text: 'Buscar en Reddit y GitHub Issues',
        effects: { stress: +5, energy: -10, skill: +10 },
        followUpText: 'Un issue de hace 3 años tenía exactamente tu problema.',
      },
      {
        id: 'c',
        text: 'Pausar esa tarea y hacer algo más mientras vuelve',
        effects: { stress: -5, energy: +5 },
        followUpText: 'Stack Overflow volvió en 2 horas. El bug también.',
      },
    ],
  },
  {
    id: 'random_keyboard_broken',
    category: 'random',
    title: 'Se rompió la tecla "e" de tu teclado.',
    body: '"e" es la letra más común del español y del inglés. Tienes un code review en 1 hora.',
    weight: 5,
    choices: [
      {
        id: 'a',
        text: 'Usar copy-paste de una "e" de otro lado',
        effects: { stress: +15, energy: -20 },
        followUpText: 'Productividad: 15%. El code review lo pospusiste.',
      },
      {
        id: 'b',
        text: 'Conectar un teclado viejo de USB que tenías guardado',
        effects: { stress: +5, energy: -5 },
        followUpText: 'Funcionó. El teclado era de 2009 y hacía un ruido increíble.',
      },
      {
        id: 'c',
        text: 'Trabajar desde el teclado en pantalla del sistema',
        effects: { stress: +25, energy: -25, skill: -5 },
        followUpText: 'El peor día de tu vida profesional.',
      },
    ],
  },
  {
    id: 'random_wrong_git_email',
    category: 'random',
    title: 'Llevas 2 semanas commiteando con el email equivocado.',
    body: 'Tu git config tenía el email del trabajo anterior. Todos los commits dicen "dev@exempresa.com".',
    weight: 5,
    choices: [
      {
        id: 'a',
        text: 'Hacer git rebase para corregir el historial',
        effects: { stress: +15, energy: -10, skill: +10 },
        requiresMinStat: { skill: 50 },
        followUpText: 'Quedó limpio. Solo tardaste 1 hora y un poco de dignidad.',
      },
      {
        id: 'b',
        text: 'Dejar el historial como está y solo corregir de aquí en adelante',
        effects: { stress: -5 },
        followUpText: 'Nadie notó. El código funciona igual.',
      },
      {
        id: 'c',
        text: 'Borrarlo todo y hacer squash de todo en un solo commit',
        effects: { stress: +10, skill: -10 },
        followUpText: '"Initial commit — todo el trabajo de 2 semanas." El PM preguntó por el historial.',
      },
    ],
  },

  // ─── EXISTENTIAL (más) ─────────────────────────────────────
  {
    id: 'exist_imposter_syndrome',
    category: 'existential',
    title: 'Síndrome del impostor al máximo.',
    body: 'Estás en una reunión técnica. Alguien menciona un término que no conoces. Todos asienten. Tú también asientes.',
    weight: 8,
    choices: [
      {
        id: 'a',
        text: 'Preguntar qué significa aunque te dé vergüenza',
        effects: { stress: +10, skill: +15, energy: -5 },
        followUpText: 'Dos personas más también lo preguntaron. Todos lo agradecieron.',
      },
      {
        id: 'b',
        text: 'Buscarlo en Google durante la reunión',
        effects: { stress: +5, skill: +5 },
        followUpText: 'Lo entendiste a medias. Suficiente para no perderte lo que siguió.',
      },
      {
        id: 'c',
        text: 'Seguir asintiendo y aprenderlo después',
        effects: { stress: +15, skill: -5 },
        followUpText: 'Lo olvidaste. El término apareció de nuevo en 2 días.',
      },
    ],
  },
  {
    id: 'exist_work_life_balance',
    category: 'existential',
    title: 'Tu familia no sabe en qué trabajas exactamente.',
    body: 'En la cena te preguntaron de nuevo. La última vez que intentaste explicarlo alguien sacó el celular.',
    weight: 5,
    choices: [
      {
        id: 'a',
        text: 'Intentar explicarlo con una analogía simple',
        effects: { stress: -10, energy: +5 },
        followUpText: '"Ah, como los de la tele que hackean en 30 segundos." — Sí. Exactamente.',
      },
      {
        id: 'b',
        text: 'Decir "arreglo computadoras" y cambiar el tema',
        effects: { stress: -15, energy: +10 },
        followUpText: 'Tu tía te preguntó si puedes arreglarle su impresora.',
      },
      {
        id: 'c',
        text: 'Explicar todo con detalle técnico completo',
        effects: { stress: +10, energy: -10, skill: +5 },
        followUpText: 'Todos se fueron a ver el partido. Terminaste solo con el perro.',
      },
    ],
  },
];
