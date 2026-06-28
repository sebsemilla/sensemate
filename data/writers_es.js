// data/writers_es.js — Escritores y textos en español (contenido curado)
// Textos en dominio público o extractos breves (fair use educativo)

window.writers_es = {
    es: {
        writers: [
            { id: 'sor_juana',  name: 'Sor Juana Inés de la Cruz', image: '🪶', country: 'mx', years: '1648–1695', genres: ['poema', 'fragmento'] },
            { id: 'cervantes',  name: 'Miguel de Cervantes',        image: '📖', country: 'es', years: '1547–1616', genres: ['fragmento'] },
            { id: 'quiroga',    name: 'Horacio Quiroga',            image: '🐍', country: 'uy', years: '1878–1937', genres: ['cuento', 'fragmento'] },
            { id: 'storni',     name: 'Alfonsina Storni',           image: '🌊', country: 'ar', years: '1892–1938', genres: ['poema'] },
            { id: 'lorca',      name: 'Federico García Lorca',      image: '🌹', country: 'es', years: '1898–1936', genres: ['poema', 'fragmento'] },
            { id: 'mistral',    name: 'Gabriela Mistral',           image: '✨', country: 'cl', years: '1889–1957', genres: ['poema'] },
            { id: 'borges',     name: 'Jorge Luis Borges',          image: '📚', country: 'ar', years: '1899–1986', genres: ['frase', 'fragmento'] },
            { id: 'neruda',     name: 'Pablo Neruda',               image: '🌹', country: 'cl', years: '1904–1973', genres: ['poema', 'frase'] },
            { id: 'benedetti',  name: 'Mario Benedetti',            image: '💙', country: 'uy', years: '1920–2009', genres: ['poema', 'frase'] },
        ],
        texts: {
            sor_juana: [
                {
                    id: 'sj_redondillas',
                    title: 'Hombres necios (fragmento)',
                    type: 'poema',
                    original: `Hombres necios que acusáis
a la mujer sin razón,
sin ver que sois la ocasión
de lo mismo que culpáis.`,
                    translation: `Foolish men who accuse
women without reason,
not seeing you are the cause
of the very thing you blame.`,
                    lang: 'es', targetLang: 'en', country: 'mx'
                },
                {
                    id: 'sj_amor',
                    title: 'Este que ves (soneto)',
                    type: 'poema',
                    original: `Este que ves, engaño colorido,
que del arte ostentando los primores,
con falsos silogismos de colores
es cauteloso engaño del sentido.`,
                    translation: `This thing you see, a painted illusion,
displaying art's most flattering skill,
with false syllogisms drawn in color,
is cautious trickery of the senses.`,
                    lang: 'es', targetLang: 'en', country: 'mx'
                },
            ],
            cervantes: [
                {
                    id: 'quijote_inicio',
                    title: 'Don Quijote — inicio',
                    type: 'fragmento',
                    original: `En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor.`,
                    translation: `In a village of La Mancha, the name of which I have no desire to call to mind, there lived not long since one of those gentlemen that keep a lance in the lance-rack, an old buckler, a lean hack, and a greyhound for coursing.`,
                    lang: 'es', targetLang: 'en', country: 'es'
                },
                {
                    id: 'quijote_frase',
                    title: 'La libertad (Don Quijote)',
                    type: 'frase',
                    original: `La libertad, Sancho, es uno de los más preciosos dones que a los hombres dieron los cielos.`,
                    translation: `Freedom, Sancho, is one of the most precious gifts that heaven has bestowed upon men.`,
                    lang: 'es', targetLang: 'en', country: 'es'
                },
            ],
            quiroga: [
                {
                    id: 'quiroga_decalogo',
                    title: 'Decálogo del perfecto cuentista (extracto)',
                    type: 'fragmento',
                    original: `Cree en un maestro —Poe, Maupassant, Kipling, Chéjov— como en Dios mismo. No los imites, sino a través de largas asimilaciones, y tan íntimamente cuanto puedas.`,
                    translation: `Believe in a master — Poe, Maupassant, Kipling, Chekhov — as you would believe in God himself. Do not imitate them, but absorb them through long assimilation, as deeply as you can.`,
                    lang: 'es', targetLang: 'en', country: 'uy'
                },
                {
                    id: 'quiroga_amor_locura',
                    title: 'A la deriva — apertura',
                    type: 'fragmento',
                    original: `El hombre pisó algo blanduzco, y en seguida sintió la mordedura en el pie. Saltó adelante, y al volverse con un juramento vio una yaracacusú que, arrollada sobre sí misma, esperaba otro ataque.`,
                    translation: `The man stepped on something soft, and immediately felt the bite on his foot. He jumped forward, and turning around with an oath, saw a yaracacusú snake coiled upon itself, waiting for another strike.`,
                    lang: 'es', targetLang: 'en', country: 'uy'
                },
            ],
            storni: [
                {
                    id: 'storni_tu_me_quieres',
                    title: 'Tú me quieres blanca',
                    type: 'poema',
                    original: `Tú me quieres alba,
me quieres de espumas,
me quieres de nácar.
Que sea azucena,
sobre todas, casta.
De perfume tenue,
corola cerrada.`,
                    translation: `You want me white,
you want me foamy,
you want me pearlescent.
That I be a lily,
above all, chaste.
Of soft perfume,
a closed corolla.`,
                    lang: 'es', targetLang: 'en', country: 'ar'
                },
                {
                    id: 'storni_cuadrados',
                    title: 'Cuadrados y ángulos (fragmento)',
                    type: 'poema',
                    original: `Casas enfiladas, casas enfiladas,
casas enfiladas.
Cuadrados, cuadrados, cuadrados.
Los hombres ¿cuándo supieron lo que era el cielo?`,
                    translation: `Houses in a row, houses in a row,
houses in a row.
Squares, squares, squares.
Men, when did you learn what the sky was?`,
                    lang: 'es', targetLang: 'en', country: 'ar'
                },
            ],
            lorca: [
                {
                    id: 'lorca_verde',
                    title: 'Romance sonámbulo (fragmento)',
                    type: 'poema',
                    original: `Verde que te quiero verde.
Verde viento. Verdes ramas.
El barco sobre la mar
y el caballo en la montaña.`,
                    translation: `Green, how I want you green.
Green wind. Green branches.
The ship out on the sea
and the horse on the mountain.`,
                    lang: 'es', targetLang: 'en', country: 'es'
                },
                {
                    id: 'lorca_malagueña',
                    title: 'La muerte (Malagueña)',
                    type: 'poema',
                    original: `La muerte
entra y sale
de la taberna.
Pasan caballos negros
y gente siniestra
por los hondos caminos
de la guitarra.`,
                    translation: `Death
enters and leaves
the tavern.
Black horses pass
and sinister people
down the deep roads
of the guitar.`,
                    lang: 'es', targetLang: 'en', country: 'es'
                },
            ],
            mistral: [
                {
                    id: 'mistral_piececitos',
                    title: 'Piececitos',
                    type: 'poema',
                    original: `Piececitos de niño,
azulosos de frío,
¡cómo os ven y no os cubren,
Dios mío!`,
                    translation: `Little feet of a child,
bluish with cold,
how they see you and don't cover you,
my God!`,
                    lang: 'es', targetLang: 'en', country: 'cl'
                },
                {
                    id: 'mistral_mariposa',
                    title: 'La mariposa (fragmento)',
                    type: 'poema',
                    original: `Mariposa del aire,
qué hermosa y qué ligera.
Mariposa del aire
dorada y verde.
Luz del candil,
mariposa del aire,
¡quédate ahí, ahí, ahí!`,
                    translation: `Butterfly of the air,
how beautiful and light.
Butterfly of the air,
golden and green.
Candlelight,
butterfly of the air,
stay there, there, there!`,
                    lang: 'es', targetLang: 'en', country: 'cl'
                },
            ],
            borges: [
                {
                    id: 'borges_tiempo',
                    title: 'El tiempo (frase)',
                    type: 'frase',
                    original: `El tiempo es el problema fundamental de la metafísica. No somos: estamos siendo.`,
                    translation: `Time is the fundamental problem of metaphysics. We do not exist: we are in the process of existing.`,
                    lang: 'es', targetLang: 'en', country: 'ar'
                },
                {
                    id: 'borges_laberintos',
                    title: 'El jardín de senderos (fragmento)',
                    type: 'fragmento',
                    original: `Creía en infinitas series de tiempos, en una red creciente y vertiginosa de tiempos divergentes, convergentes y paralelos. Esa trama de tiempos que se aproximan, se bifurcan, se cortan o que secularmente se ignoran, abarca todas las posibilidades.`,
                    translation: `He believed in infinite series of times, in a growing, dizzying web of divergent, convergent, and parallel times. That web of times which approached one another, forked, broke off, or were unaware of one another for centuries, embraces all possibilities.`,
                    lang: 'es', targetLang: 'en', country: 'ar'
                },
                {
                    id: 'borges_lectura',
                    title: 'Sobre la lectura (frase)',
                    type: 'frase',
                    original: `Que otros se jacten de las páginas que han escrito; a mí me enorgullecen las que he leído.`,
                    translation: `Let others boast of the pages they have written; I take pride in those I have read.`,
                    lang: 'es', targetLang: 'en', country: 'ar'
                },
            ],
            neruda: [
                {
                    id: 'neruda_puedo',
                    title: 'Poema 20 (fragmento)',
                    type: 'poema',
                    original: `Puedo escribir los versos más tristes esta noche.
Escribir, por ejemplo: «La noche está estrellada,
y tiritan, azules, los astros, a lo lejos.»`,
                    translation: `Tonight I can write the saddest lines.
Write, for example, "The night is starry,
and the stars, blue, shiver in the distance."`,
                    lang: 'es', targetLang: 'en', country: 'cl'
                },
                {
                    id: 'neruda_oda_libro',
                    title: 'Oda al libro (fragmento)',
                    type: 'poema',
                    original: `Libro hermoso,
libro mínimo,
grano de pimienta de la sabiduría,
milagro portátil.`,
                    translation: `Beautiful book,
smallest of books,
peppercorn of wisdom,
portable miracle.`,
                    lang: 'es', targetLang: 'en', country: 'cl'
                },
            ],
            benedetti: [
                {
                    id: 'benedetti_no_te_rindas',
                    title: 'No te rindas (fragmento)',
                    type: 'poema',
                    original: `No te rindas, aún estás a tiempo
de alcanzar y comenzar de nuevo,
aceptar tus sombras,
enterrar tus miedos,
liberar el lastre,
retomar el vuelo.`,
                    translation: `Don't give up, there is still time
to reach out and start anew,
accept your shadows,
bury your fears,
free the ballast,
take flight again.`,
                    lang: 'es', targetLang: 'en', country: 'uy'
                },
                {
                    id: 'benedetti_tactic',
                    title: 'La táctica y el arte (frase)',
                    type: 'frase',
                    original: `La táctica del enemigo es empujarte hacia el desánimo. La táctica tuya es no dejarte.`,
                    translation: `The enemy's tactic is to push you toward discouragement. Your tactic is not to let them.`,
                    lang: 'es', targetLang: 'en', country: 'uy'
                },
            ],
        }
    }
};
