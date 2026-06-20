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
];
