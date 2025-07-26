// 1. Load and classify words
function parseEstonianWords(rawText) {
    const lines = rawText.split('\n').map(line => line.trim()).filter(Boolean);
    const words = [];
    for (const line of lines) {
        const [estonian, english] = line.split(' - ').map(s => s.trim());
        if (estonian && english) {
            words.push({ estonian, english });
        }
    }
    return words;
}

// Function to filter out different grammatical forms and keep only base forms
function filterBaseForms(words) {
    const baseForms = new Map(); // Map to store base forms
    const filteredWords = [];
    
    // Define specific words to exclude (grammatical forms)
    const excludeWords = new Set([
        // Forms of "uus" (new)
        'uut', 'uute', 'uusi', 'uude', 'uutes', 'uust', 'uutele', 'uutelt', 'uutena', 'uuteta',
        
        // Forms of "supp" (soup)
        'supi', 'suppi', 'supid', 'suppide', 'suppe', 'suppi', 'suppi', 'suppi',
        
        // Forms of "saabuma" (arrive)
        'saabun', 'saabud', 'saabub', 'saabume', 'saabute', 'saabuvad', 'saabunud', 'saabuvat',
        'saabumas', 'saabumast', 'saabumaks', 'saabumata', 'saabudes',
        
        // Forms of "pakkuma" (offer)
        'pakun', 'pakud', 'pakub', 'pakume', 'pakute', 'pakuva', 'pakutud', 'pakkudes',
        'pakkumas', 'pakkumast', 'pakkumaks', 'pakkumata', 'paku', 'pakkugul', 'pakkugem', 'pakutagu',
        
        // Forms of "vaatama" (look)
        'vaatan', 'vaatad', 'vaatab', 'vaatame', 'vaatate', 'vaatavad', 'vaadatud', 'vaadates',
        'vaatamas', 'vaatamast', 'vaatamaks', 'vaatamata', 'vaata', 'vaadakul', 'vaadakem', 'vaadatagu',
        
        // Forms of "tulema" (come)
        'tulen', 'tuled', 'tuleb', 'tuleme', 'tulete', 'tulevad', 'tulnud', 'tulevat',
        'tulemas', 'tulemast', 'tulemaks', 'tulemata', 'tule', 'tulgu', 'tulgem', 'tulgu',
        
        // Forms of "minema" (go)
        'lähen', 'lähed', 'läheb', 'läheme', 'lähete', 'lähevad', 'läinud', 'lähevat',
        'lähemas', 'lähemast', 'lähemaks', 'lähemata', 'mine', 'mingu', 'mingem', 'mingu',
        
        // Forms of "tegema" (do)
        'teen', 'teed', 'teeb', 'teeme', 'teete', 'teevad', 'tehtud', 'tehes',
        'tegemas', 'tegemast', 'tegemaks', 'tegemata', 'tee', 'tegu', 'tegem', 'tegu',
        
        // Forms of "nägema" (see) - including variants with different characters
        'näen', 'näed', 'näeb', 'näeme', 'näete', 'näevad', 'näinud', 'näevat',
        'nägemas', 'nägemast', 'nägemaks', 'nägemata', 'näe', 'nägu', 'nägem', 'nägu',
        'nàgema', 'nàha', 'nàen', 'nàed', 'nàeb', 'nàeme', 'nàete', 'nàevad', 'nàinud', 'nàevat',
        'nàgemas', 'nàgemast', 'nàgemaks', 'nàgemata', 'nàe', 'nàgu', 'nàgem', 'nàgu',
        
        // Forms of "leib" (bread)
        'leiba', 'leiva', 'leibu', 'leivad', 'leivade', 'leivast', 'leivasse', 'leival',
        
        // Forms of "vesi" (water)
        'vett', 'vee', 'vette', 'vees', 'veest', 'veel', 'veega', 'veeta',
        
        // Forms of "piim" (milk)
        'piima', 'piima', 'piimad', 'piimade', 'piimast', 'piimasse', 'piimal',
        
        // Forms of "raamat" (book)
        'raamatud', 'raamatu', 'raamatut', 'raamatud', 'raamatute', 'raamatust', 'raamatusse', 'raamatul',
        
        // Forms of "auto" (car)
        'autot', 'auto', 'autosid', 'autode', 'autost', 'autosse', 'autol',
        
        // Forms of "pruun" (brown)
        'pruuni', 'pruune', 'pruunid', 'pruunide', 'pruunist', 'pruunisse', 'pruunil',
        
        // Forms of "suur" (big)
        'suurt', 'suure', 'suuri', 'suurte', 'suurest', 'suurde', 'suurel',
        
        // Forms of "keel" (language)
        'keeli', 'keelte', 'keelt', 'keeles', 'keelest', 'keelde', 'keel',
        
        // Forms of "kana" (hen)
        'kanu', 'kana', 'kanad', 'kanade', 'kanast', 'kanasse', 'kanal',
        
        // Forms of "leht" (leaf)
        'lehte', 'lehe', 'lehti', 'lehtede', 'lehest', 'lehte', 'lehel',
        
        // Forms of "kask" (birch)
        'kaske', 'kase', 'kaski', 'kaskede', 'kaskest', 'kaskesse', 'kaskel',
        
        // Forms of "kuusk" (spruce)
        'kuuske', 'kuuse', 'kuuski', 'kuuskede', 'kuuskest', 'kuuskesse', 'kuuskel',
        
        // Forms of "pass" (passport)
        'passi', 'passi', 'passe', 'passide', 'passist', 'passi', 'passil',
        
        // Forms of "plaat" (plate)
        'plaati', 'plaadi', 'plaate', 'plaatide', 'plaatist', 'plaati', 'plaatil',
        
        // Forms of "kool" (school)
        'kooli', 'kooli', 'koolisid', 'koolide', 'koolist', 'kooli', 'koolil',
        
        // Forms of "kampsun" (sweater)
        'kampsuni', 'kampsuni', 'kampsuneid', 'kampsunite', 'kampsunist', 'kampsuni', 'kampsunil',
        
        // Forms of "tütar" (daughter)
        'tütre', 'tütre', 'tütred', 'tütarde', 'tütrest', 'tütart', 'tütrel',
        
        // Forms of "üks" (one)
        'ühte', 'ühe', 'üht', 'ühes', 'ühest', 'ühele', 'ühel',
        
        // Forms of "õlu" (beer) - including variants with different characters
        'õlud', 'õlle', 'õllesid', 'õlled', 'õllede', 'õllesse', 'õllest', 'õllete', 'õlletele', 'õlletelt', 'õlletesse', 'õlletest', 'õlletega', 'õlleteta', 'õlleteks',
        'olut', 'olud', 'olle', 'ollesid', 'olled', 'ollede', 'ollesse', 'ollest', 'ollete', 'olletele', 'olletelt', 'olletesse', 'olletest', 'olletega', 'olleteta', 'olleteks',
        
        // Other common grammatical forms
        'näinud', 'saabunud', 'läinud', 'pakutud', 'valitud', 'tekkinud',
        'armastan', 'õnnestub', 'maksab', 'istun', 'tähvat', 'räägitakse',
        'saabute', 'teie', 'onul', 'olevat', 'oodatav', 'puhtad', 'sõidab',
        'sügay', 'vaarikad', 'üheksakümmend', 'viiskümmend'
    ]);
    
    // Define patterns for different grammatical forms to exclude
    const excludePatterns = [
        // Verb conjugations (present tense forms)
        /^(.*)n$/, // -n ending (1st person singular)
        /^(.*)d$/, // -d ending (2nd person singular)
        /^(.*)b$/, // -b ending (3rd person singular)
        /^(.*)me$/, // -me ending (1st person plural)
        /^(.*)te$/, // -te ending (2nd person plural)
        /^(.*)vad$/, // -vad ending (3rd person plural)
        
        // Past participles
        /^(.*)nud$/, // -nud ending (past participle)
        /^(.*)tud$/, // -tud ending (past participle)
        /^(.*)dud$/, // -dud ending (past participle)
        
        // Present participles
        /^(.*)des$/, // -des ending (present participle)
        /^(.*)mas$/, // -mas ending (present participle)
        /^(.*)mast$/, // -mast ending (elative participle)
        /^(.*)maks$/, // -maks ending (translative participle)
        /^(.*)mata$/, // -mata ending (abessive participle)
        /^(.*)dus$/, // -dus ending (instructive participle)
        
        // Imperative forms
        /^(.*)gu$/, // -gu ending (imperative)
        /^(.*)kul$/, // -kul ending (imperative variant)
        /^(.*)gem$/, // -gem ending (1st person plural imperative)
        /^(.*)kem$/, // -kem ending (1st person plural imperative)
        
        // Noun declensions (case endings)
        /^(.*)i$/, // -i ending (genitive/partitive)
        /^(.*)a$/, // -a ending (genitive/partitive)
        /^(.*)t$/, // -t ending (partitive)
        /^(.*)d$/, // -d ending (plural)
        /^(.*)de$/, // -de ending (genitive plural)
        /^(.*)sse$/, // -sse ending (illative)
        /^(.*)s$/, // -s ending (inessive)
        /^(.*)st$/, // -st ending (elative)
        /^(.*)ga$/, // -ga ending (comitative)
        /^(.*)ta$/, // -ta ending (abessive)
        /^(.*)ks$/, // -ks ending (translative)
        /^(.*)lt$/, // -lt ending (ablative)
        /^(.*)le$/, // -le ending (allative)
        /^(.*)l$/, // -l ending (adessive)
        
        // Adjective forms
        /^(.*)m$/, // -m ending (comparative)
        /^(.*)mam$/, // -mam ending (superlative)
        /^(.*)e$/, // -e ending (genitive)
        /^(.*)t$/, // -t ending (partitive)
        
        // Adverb forms
        /^(.*)lt$/, // -lt ending (ablative adverb)
        /^(.*)sti$/, // -sti ending (adverb)
    ];
    
    // Helper function to check if a word is a base form
    function isBaseForm(word) {
        const lowerWord = word.toLowerCase();
        
        // Normalize special characters for comparison
        const normalizedWord = lowerWord
            .replace(/à/g, 'ä')
            .replace(/è/g, 'ë')
            .replace(/ì/g, 'ï')
            .replace(/ò/g, 'ö')
            .replace(/ù/g, 'ü');
        
        // Check against exclude words list (both original and normalized)
        if (excludeWords.has(lowerWord) || excludeWords.has(normalizedWord)) {
            return false;
        }
        
        // Check against exclude patterns
        for (const pattern of excludePatterns) {
            if (pattern.test(lowerWord) || pattern.test(normalizedWord)) {
                return false;
            }
        }
        
        // Additional checks for specific cases
        if (lowerWord.includes('õõ')) return false; // Usually indicates a form
        if (lowerWord.endsWith('ma') && lowerWord.length > 3) return true; // Infinitive form
        
        return true;
    }
    
    // Helper function to find the base form of a word
    function findBaseForm(word) {
        const lowerWord = word.toLowerCase();
        
        // For verbs, look for infinitive form (-ma ending)
        if (lowerWord.endsWith('ma') && lowerWord.length > 3) {
            return word;
        }
        
        // For nouns, try to find the nominative form
        // Remove common case endings
        const withoutEndings = lowerWord
            .replace(/i$/, '') // Remove -i
            .replace(/a$/, '') // Remove -a
            .replace(/t$/, '') // Remove -t
            .replace(/d$/, '') // Remove -d
            .replace(/de$/, '') // Remove -de
            .replace(/sse$/, '') // Remove -sse
            .replace(/s$/, '') // Remove -s
            .replace(/st$/, '') // Remove -st
            .replace(/ga$/, '') // Remove -ga
            .replace(/ta$/, '') // Remove -ta
            .replace(/ks$/, '') // Remove -ks
            .replace(/lt$/, '') // Remove -lt
            .replace(/le$/, '') // Remove -le
            .replace(/l$/, '') // Remove -l
            .replace(/e$/, '') // Remove -e
            .replace(/m$/, '') // Remove -m
            .replace(/mam$/, '') // Remove -mam
            .replace(/sti$/, '') // Remove -sti
            .replace(/õõ/, 'oo'); // Fix õõ to oo
        
        return withoutEndings;
    }
    
    // Process each word
    for (const wordObj of words) {
        const word = wordObj.estonian;
        const lowerWord = word.toLowerCase();
        
        // Normalize special characters for comparison
        const normalizedWord = lowerWord
            .replace(/à/g, 'ä')
            .replace(/è/g, 'ë')
            .replace(/ì/g, 'ï')
            .replace(/ò/g, 'ö')
            .replace(/ù/g, 'ü');
        
        // Skip if this word is in the exclude list (check both original and normalized)
        if (excludeWords.has(lowerWord) || excludeWords.has(normalizedWord)) {
            continue;
        }
        
        const baseForm = findBaseForm(word);
        
        // If this is a base form, add it
        if (isBaseForm(word)) {
            if (!baseForms.has(baseForm.toLowerCase())) {
                baseForms.set(baseForm.toLowerCase(), wordObj);
                filteredWords.push(wordObj);
            }
        } else {
            // This is a derived form, check if we already have the base form
            if (!baseForms.has(baseForm.toLowerCase())) {
                // We don't have the base form yet, so this might be the best we have
                baseForms.set(baseForm.toLowerCase(), wordObj);
                filteredWords.push(wordObj);
            }
        }
    }
    
    console.log(`Filtered ${words.length} words down to ${filteredWords.length} base forms`);
    return filteredWords;
}

function classifyWord(word) {
    // Simple heuristic: short and common = beginner, medium = elementary, long/abstract = intermediate
    if (word.estonian.length <= 4) return 'beginner';
    if (word.estonian.length <= 6) return 'elementary';
    return 'intermediate';
}

function groupWordsByLevel(words) {
    const levels = { beginner: [], elementary: [], intermediate: [] };
    for (const word of words) {
        const level = classifyWord(word);
        levels[level].push(word);
    }
    return levels;
}

// Explanations for Estonian words (expand as needed)
const ESTONIAN_EXPLANATIONS = {
    'odav': 'Something that does not cost much money',
    'pikk': 'Having a great distance from one end to the other',
    'leping': 'A formal agreement between two or more parties',
    'sepp': 'A person who makes or repairs things made of iron',
    'saun': 'A small room used as a hot-air or steam bath for cleaning and relaxing',
    'isa': 'A male parent who raises and cares for children',
    'supi': 'The genitive form of soup, meaning "of the soup"',
    'suppi': 'The illative form of soup, meaning "into the soup"',
    'supid': 'The plural form of soup, meaning "the soups"',
    'suppide': 'The inessive plural form of soup, meaning "in the soups"',
    'supp': 'A liquid dish, typically made by boiling meat, fish, or vegetables',
    'võõõad': 'People who are guests or visitors',
    'laua': 'The genitive form of table, meaning "of the table"',
    'mööda': 'Moving along or past something',
    'tänavat': 'The partitive form of street, meaning "of the street"',
    'ma': 'The pronoun "I" in Estonian',
    'ei': 'The word for "not" or negation',
    'ole': 'The imperative or indicative form of "to be"',
    'näinud': 'The past participle of "to see", meaning "seen"',
    'saabunud': 'Having arrived or reached a destination',
    'armastan': 'The first person singular of "to love"',
    'tantsida': 'The infinitive form of "to dance"',
    'õõpida': 'The infinitive form of "to study"',
    'õnnestub': 'To succeed or manage to do something',
    'maksab': 'To cost or be worth a certain value',
    'tul': 'An auxiliary verb meaning "ought"',
    'tärvise': 'A negative form meaning "shouldn\'t"',
    'raske': 'Something that is difficult or heavy',
    'hea': 'Something that is good or beneficial',
    'tore': 'Something that is nice or pleasant',
    'igav': 'Something that is boring or dull',
    'huvitav': 'Something that is interesting or engaging',
    'vajja': 'To need or require something',
    'taris': 'A modal verb meaning "must"',
    'vara': 'Something that is early or property',
    'pääsema': 'To escape or get free',
    'pääsedä': 'To get free or escape',
    'pääsen': 'To get rid of or escape',
    'ruutama': 'To hurry or rush',
    'ruitata': 'To hurry or rush',
    'ruitan': 'To hurry or rush',
    'saatma': 'To send something or someone',
    'saata': 'To see off or accompany',
    'saadaan': 'To send (variant)',
    'sattuma': 'To happen or occur by chance',
    'sattuda': 'To fall or end up somewhere',
    'sattuni': 'To get or reach a place',
    'sundma': 'To force or compel',
    'sundida': 'To make or force someone',
    'sunnin': 'To make or force',
    'sõima': 'To drive or scold',
    'sõida': 'To ride or travel',
    'sõden': 'To go or move',
    'tulema': 'To come or arrive',
    'tulla': 'To go or come',
    'tulen': 'I come or I arrive',
    'saabuma': 'To arrive at a place',
    'saabun': 'I arrive',
    'saabud': 'You arrive',
    'saabub': 'He/she/it arrives',
    'saabume': 'We arrive',
    'saabute': 'You (plural) arrive',
    'saabuvad': 'They arrive',
    'pakun': 'I offer',
    'vaatan': 'I look',
    'pakkudes': 'Offering (present participle)',
    'vaadates': 'Looking (present participle)',
    'paku': 'Offer (imperative)',
    'vaata': 'Look (imperative)',
    'pakkugul': 'Offer (variant imperative)',
    'vaadakul': 'Look (variant imperative)',
    'pakkugem': 'Let us offer',
    'vaadakem': 'Let us look',
    'pakutagu': 'Let it be offered',
    'vaadatagu': 'Let it be looked at',
    'c': 'Let it be',
    'läinud': 'Gone or left',
    'pakutud': 'Offered (past participle)',
    'saabuvat': 'Arriving (present participle)',
    'tähvat': 'To want',
    'räägitakse': 'It is spoken',
    'keeft': 'Language',
    'pakkuma': 'To offer',
    'vaatama': 'To look',
    'saabumas': 'Arriving (present participle)',
    'pakkumas': 'Offering (present participle)',
    'vaatamas': 'Looking (present participle)',
    'saabumast': 'Arriving (elative participle)',
    'pakkumast': 'Offering (elative participle)',
    'vaatamast': 'Looking (elative participle)',
    'saabumaks': 'Arriving (translative participle)',
    'pakkumaks': 'Offering (translative participle)',
    'vaatamaks': 'Looking (translative participle)',
    'saabumata': 'Arriving (abessive participle)',
    'pakkumata': 'Offering (abessive participle)',
    'vaatamata': 'Looking (abessive participle)',
    'saabudes': 'Arriving (instructive participle)',
    'valima': 'To choose or select',
    'valitud': 'Chosen or selected',
    'valitav': 'To be chosen',
    'ametikohi': 'A job position or post',
    'ametikoha': 'Of the job position',
    'ametikohasse': 'Into the job position',
    'ametikohas': 'In the job position',
    'tekkinud': 'Developed or arisen',
    'mehelik': 'Noble or manly',
    'kaks': 'The number two',
    'teine': 'The second or another',
    'sina': 'The pronoun "you" (singular)',
    'see': 'The pronoun "this" or "that"',
    'raamatud': 'Books (plural)',
    'õunapuu': 'An apple tree',
    'tootu': 'Food (variant)',
    'vett': 'Water (partitive)',
    'piima': 'Milk (partitive)',
    'televiisorit': 'Television (partitive)',
    'muusikat': 'Music (partitive)',
    'leiba': 'Bread (partitive)',
    'leiva': 'Bread (genitive)',
    'sadamasse': 'To the harbor',
    'linna': 'To the city',
    'vann': 'A bath or bathtub',
    'sadamas': 'In the harbor',
    'reisist': 'From the trip',
    'nahast': 'Made of leather',
    'esmaspäevast': 'From Monday',
    'koolivaheaeg': 'School vacation or holiday',
    'postmarke': 'Stamps (partitive)',
    'autot': 'Car (partitive)',
    'riiulilt': 'From the shelf',
    'rahvuselt': 'By nationality',
    'kohvrid': 'Suitcases (plural)',
    'arstiks': 'As a physician',
    'õppimiseks': 'For studying',
    'sügiseks': 'For autumn',
    'metsas': 'In the forest',
    'kingituseta': 'Without gifts',
    'koorega': 'With cream',
    'laevaga': 'With a ship',
    'noore': 'Younger',
    'ilusa': 'Beautiful (genitive)',
    'pruun': 'Brown',
    'pruuni': 'Brown (genitive)',
    'suuremasse': 'Into a larger one',
    'värskemat': 'Fresher (partitive)',
    'kõige': 'Most (superlative marker)',
    'lüusam': 'Most beautiful',
    'targem': 'Wiser',
    'keerulisem': 'More complex',
    'vanem': 'Older',
    'vanim': 'Oldest',
    'sada': 'The number one hundred',
    'tuhat': 'The number one thousand',
    'miljon': 'The number one million',
    'miljard': 'The number one billion',
    'üheksas': 'Ninth',
    'kümnes': 'Tenth',
    'sajad': 'Hundredth',
    'vaba': 'Free or not restricted',
    'kodu': 'A home or house',
    'ema': 'A mother',
    'takso': 'A taxi or cab',
    'abikaasa': 'A spouse or partner',
    'passi': 'A passport (partitive)',
    'pruune': 'Brown (plural partitive)',
    'plaati': 'A plate (partitive)',
    'jave': 'A foot',
    'lehte': 'A leaf (partitive)',
    'kaske': 'A birch tree (partitive)',
    'kuuske': 'A spruce tree (partitive)',
    'keeli': 'Languages (partitive)',
    'suurt': 'Big (partitive)',
    'uut': 'New (partitive)',
    'keelte': 'Languages (genitive)',
    'suurte': 'Big (genitive plural)',
    'uute': 'New (genitive plural)',
    'kodutalu': 'A home farmstead',
    'puulike': 'Tree species',
    'teineiteise': 'Each other',
    'üksteise': 'One another',
    'täna': 'Today',
    'nüüd': 'Now',
    'eile': 'Yesterday',
    'homme': 'Tomorrow',
    'üle-eile': 'The day before yesterday',
    'ülemorme': 'The day after tomorrow',
    'alati': 'Always',
    'varsti': 'Soon',
    'siis': 'Then',
    'hilja': 'Late',
    'palju': 'Much or many',
    'rohkem': 'More',
    'pisut': 'A little',
    'vähe': 'Little or few',
    'üsna': 'Rather or quite',
    'istun': 'I sit',
    'kooli': 'School (genitive or allative)',
    'tuli': 'Fire',
    'kampsuni': 'Sweater (genitive)',
    'lauri': 'A male given name',
    'harno': 'A proper noun',
    'eestlane': 'An Estonian person',
    'paris': 'Paris (the city)',
    'parislane': 'A person from Paris',
    'laulma': 'To sing',
    'laulja': 'A singer',
    'laulanna': 'A female singer',
    'lugeja': 'A reader',
    'muujaja': 'A seller',
    'aed': 'A garden',
    'kunst': 'Art',
    'ratsa': 'Horse (archaic or poetic)',
    'põgenema': 'To flee or escape',
    'kirjutama': 'To write',
    'aednik': 'A gardener',
    'kunstnik': 'An artist',
    'ratsanik': 'A rider',
    'põgenik': 'A fugitive',
    'kirjanik': 'A writer',
    'nàgema': 'To see',
    'nàha': 'To see (infinitive)',
    'näen': 'I see',
    'tegema': 'To do',
    'teha': 'To make',
    'teen': 'I make',
    'tooma': 'To bring',
    'jooma': 'To drink',
    'sôôma': 'To eat',
    'minema': 'To go',
    'minna': 'To go (infinitive)',
    'lähen': 'I go',
    'pea': 'A head',
    'juus': 'A hair',
    'süda': 'A heart',
    'aeglane': 'Slow',
    'algama': 'To begin',
    'algkool': 'An elementary school',
    'aliks': 'A source',
    'amet': 'A position or office',
    'ametnik': 'An official',
    'arvama': 'To think',
    'arve': 'A bill or invoice',
    'auto': 'A car',
    'autovabrik': 'A car factory',
    'drama': 'Drama',
    'ehteaajad': 'Jewelry (variant)',
    'ehteasja': 'Jewelry (variant)',
    'elama': 'To live',
    'haridus': 'Education',
    'harjuma': 'To get used to',
    'hiljemalt': 'At the latest',
    'hing': 'Breath or soul',
    'hotell': 'A hotel',
    'huvi': 'Interest',
    'igavus': 'Boredom',
    'ilma': 'Weather',
    'inimesed': 'People',
    'istuma': 'To sit',
    'jaama': 'To stay or a station',
    'jalutama': 'To walk',
    'jooksma': 'To run',
    'juhtuma': 'To happen',
    'jutt': 'A story',
    'jõudma': 'To reach',
    'kaheksa': 'Eight',
    'kallim': 'More expensive',
    'kallis': 'Expensive',
    'kampsun': 'A sweater',
    'kana': 'A hen',
    'kanu': 'Hens (partitive)',
    'kaart': 'A card',
    'kaartemäng': 'A card game',
    'kaheksakümmend': 'Eighty',
    'kaunis': 'Beautiful',
    'kell': 'A clock',
    'kelner': 'A waiter',
    'kena': 'Nice',
    'kiitma': 'To praise',
    'kindlasti': 'Certainly',
    'kingad': 'Shoes',
    'kirik': 'A church',
    'kitsaimast': 'Narrowest',
    'kleit': 'A dress',
    'kombödi': 'Comedy',
    'kommunistlik': 'Communist',
    'koori': 'A choir',
    'kopsud': 'Lungs',
    'kord': 'Order',
    'kosk': 'A waterfall',
    'kuduma': 'To knit',
    'kuld': 'Gold',
    'kuu': 'A month or the moon',
    'kuud': 'Months',
    'kuul': 'A bullet',
    'külastama': 'To visit',
    'küsimus': 'A question',
    'käekott': 'A handbag',
    'laev': 'A ship',
    'lahing': 'A battle',
    'laht': 'A leaf or a bay',
    'lai': 'Wide',
    'lasteaed': 'A kindergarten',
    'laul': 'A song',
    'lehm': 'A cow',
    'leht': 'A leaf',
    'linn': 'A city',
    'lips': 'A tie',
    'luba': 'Permission',
    'lugema': 'To read',
    'lumi': 'Snow',
    'maitsema': 'To taste',
    'maksab': 'To be worth',
    'mehelik': 'Noble or manly',
    'meri': 'The sea',
    'miljon': 'A million',
    'miljard': 'A billion',
    'mõistma': 'To understand',
    'müüja': 'A seller',
    'müüjanna': 'A saleswoman',
    'naaber': 'A neighbor',
    'nahast': 'Made of leather',
    'nüüd': 'Now',
    'odavam': 'Cheaper',
    'olema': 'To be',
    'olevat': 'To be (reported)',
    'olut': 'Beer',
    'on': 'Is',
    'onul': 'Uncle (adessive)',
    'oodatav': 'Expected',
    'ooper': 'Opera',
    'ostama': 'To buy',
    'otsa': 'End',
    'paar': 'A couple',
    'paarsada': 'A couple hundred',
    'paluma': 'To ask',
    'panema': 'To put',
    'part': 'A duck',
    'pealt': 'From',
    'peaminister': 'Prime minister',
    'pesema': 'To wash',
    'pikem': 'Longer',
    'pilet': 'A ticket',
    'poiss': 'A boy',
    'poolakas': 'A Pole (nationality)',
    'president': 'President',
    'puhtad': 'Clean',
    'püstitama': 'To erect',
    'raamat': 'A book',
    'raamatukogu': 'A library',
    'ratsa': 'Horse (archaic or poetic)',
    'ratsanik': 'A rider',
    'raudteejaam': 'A railway station',
    'reis': 'A trip',
    'restoran': 'A restaurant',
    'rukis': 'Rye',
    'rätsep': 'A tailor',
    'saama': 'To get',
    'sadama': 'Rain',
    'sadam': 'A harbor',
    'sajad': 'Hundredth',
    'seep': 'Soap',
    'sirk': 'A circus',
    'sõda': 'A war',
    'sõde': 'A sister',
    'sõidab': 'Travels',
    'sügay': 'Autumn',
    'süsta': 'A kayak',
    'suu': 'A mouth',
    'tall': 'A barn',
    'talu': 'A farm',
    'talve': 'Winter',
    'teater': 'A theater',
    'tegevus': 'An activity',
    'teie': 'You (plural or polite)',
    'tikku': 'A match',
    'toot': 'Food (variant)',
    'turg': 'A market',
    'tänan': 'Thank you',
    'tänav': 'A street',
    'tütar': 'A daughter',
    'tütre': 'Daughter (genitive)',
    'uisk': 'A skate',
    'uisutama': 'To skate',
    'uus': 'New',
    'vaarikad': 'Raspberries',
    'vahe': 'A difference',
    'vaidlema': 'To argue',
    'valik': 'A selection',
    'vana': 'Old',
    'varsti': 'Soon',
    'vett': 'Water',
    'viis': 'Five',
    'viiskümmend': 'Fifty',
    'õde': 'A sister',
    'õlu': 'Beer',
    'õpetaja': 'A teacher',
    'õppima': 'To learn',
    'üheksakümmend': 'Ninety',
    'ühte': 'One (partitive)',
    'ülikond': 'A suit',
    'ülikool': 'A university',
    'ürime': 'To rent',
};

function getExplanation(word, english) {
    // Special cases for base forms only - no grammatical forms
    const specialCases = {
        'see': 'The pronoun "this" or "that"',
        'ma': 'The pronoun "I" in Estonian',
        'ei': 'The word for "not" or negation',
        'ole': 'The imperative or indicative form of "to be"',
        'raske': 'Something that is difficult or heavy',
        'hea': 'Something that is good or beneficial',
        'tore': 'Something that is nice or pleasant',
        'igav': 'Something that is boring or dull',
        'huvitav': 'Something that is interesting or engaging',
        'vajja': 'To need or require something',
        'taris': 'A modal verb meaning "must"',
        'vara': 'Something that is early or property',
        'pääsema': 'To escape or get free',
        'ruutama': 'To hurry or rush',
        'ruitata': 'To hurry or rush',
        'saatma': 'To send something or someone',
        'saata': 'To see off or accompany',
        'sattuma': 'To happen or occur by chance',
        'sattuda': 'To fall or end up somewhere',
        'sundma': 'To force or compel',
        'sundida': 'To make or force someone',
        'sõima': 'To drive or scold',
        'sõida': 'To ride or travel',
        'sõden': 'To go or move',
        'tulema': 'To come or arrive',
        'tulla': 'To go or come',
        'saabuma': 'To arrive at a place',
        'pakkuma': 'To offer',
        'vaatama': 'To look',
        'valima': 'To choose or select',
        'tekkinud': 'Developed or arisen',
        'mehelik': 'Noble or manly',
        'kaks': 'The number two',
        'teine': 'The second or another',
        'sina': 'The pronoun "you" (singular)',
        'õunapuu': 'An apple tree',
        'vann': 'A bath or bathtub',
        'koolivaheaeg': 'School vacation or holiday',
        'noore': 'Younger',
        'pruun': 'Brown',
        'kõige': 'Most (superlative marker)',
        'lüusam': 'Most beautiful',
        'targem': 'Wiser',
        'keerulisem': 'More complex',
        'vanem': 'Older',
        'vanim': 'Oldest',
        'sada': 'The number one hundred',
        'tuhat': 'The number one thousand',
        'miljon': 'The number one million',
        'miljard': 'The number one billion',
        'üheksas': 'Ninth',
        'kümnes': 'Tenth',
        'sajad': 'Hundredth',
        'vaba': 'Free or not restricted',
        'kodu': 'A home or house',
        'ema': 'A mother',
        'takso': 'A taxi or cab',
        'abikaasa': 'A spouse or partner',
        'jave': 'A foot',
        'kodutalu': 'A home farmstead',
        'puulike': 'Tree species',
        'teineiteise': 'Each other',
        'üksteise': 'One another',
        'täna': 'Today',
        'nüüd': 'Now',
        'eile': 'Yesterday',
        'homme': 'Tomorrow',
        'üle-eile': 'The day before yesterday',
        'ülemorme': 'The day after tomorrow',
        'alati': 'Always',
        'varsti': 'Soon',
        'siis': 'Then',
        'hilja': 'Late',
        'palju': 'Much or many',
        'rohkem': 'More',
        'pisut': 'A little',
        'vähe': 'Little or few',
        'üsna': 'Rather or quite',
        'tuli': 'Fire',
        'lauri': 'A male given name',
        'harno': 'A proper noun',
        'eestlane': 'An Estonian person',
        'paris': 'Paris (the city)',
        'parislane': 'A person from Paris',
        'laulma': 'To sing',
        'laulja': 'A singer',
        'laulanna': 'A female singer',
        'lugeja': 'A reader',
        'muujaja': 'A seller',
        'aed': 'A garden',
        'kunst': 'Art',
        'ratsa': 'Horse (archaic or poetic)',
        'põgenema': 'To flee or escape',
        'kirjutama': 'To write',
        'aednik': 'A gardener',
        'kunstnik': 'An artist',
        'ratsanik': 'A rider',
        'põgenik': 'A fugitive',
        'kirjanik': 'A writer',
        'tegema': 'To do',
        'teha': 'To make',
        'tooma': 'To bring',
        'jooma': 'To drink',
        'sôôma': 'To eat',
        'minema': 'To go',
        'minna': 'To go (infinitive)',
        'pea': 'A head',
        'juus': 'A hair',
        'süda': 'A heart',
        'aeglane': 'Slow',
        'algama': 'To begin',
        'algkool': 'An elementary school',
        'aliks': 'A source',
        'amet': 'A position or office',
        'ametnik': 'An official',
        'arvama': 'To think',
        'arve': 'A bill or invoice',
        'auto': 'A car',
        'autovabrik': 'A car factory',
        'drama': 'Drama',
        'ehteaajad': 'Jewelry (variant)',
        'ehteasja': 'Jewelry (variant)',
        'elama': 'To live',
        'haridus': 'Education',
        'harjuma': 'To get used to',
        'hiljemalt': 'At the latest',
        'hing': 'Breath or soul',
        'hotell': 'A hotel',
        'huvi': 'Interest',
        'igavus': 'Boredom',
        'ilma': 'Weather',
        'inimesed': 'People',
        'istuma': 'To sit',
        'jaama': 'To stay or a station',
        'jalutama': 'To walk',
        'jooksma': 'To run',
        'juhtuma': 'To happen',
        'jutt': 'A story',
        'jõudma': 'To reach',
        'kaheksa': 'Eight',
        'kallim': 'More expensive',
        'kallis': 'Expensive',
        'kampsun': 'A sweater',
        'kana': 'A hen',
        'kaart': 'A card',
        'kaartemäng': 'A card game',
        'kaheksakümmend': 'Eighty',
        'kaunis': 'Beautiful',
        'kell': 'A clock',
        'kelner': 'A waiter',
        'kena': 'Nice',
        'kiitma': 'To praise',
        'kindlasti': 'Certainly',
        'kingad': 'Shoes',
        'kirik': 'A church',
        'kitsaimast': 'Narrowest',
        'kleit': 'A dress',
        'kombödi': 'Comedy',
        'kommunistlik': 'Communist',
        'koori': 'A choir',
        'kopsud': 'Lungs',
        'kord': 'Order',
        'kosk': 'A waterfall',
        'kuduma': 'To knit',
        'kuld': 'Gold',
        'kuu': 'A month or the moon',
        'kuud': 'Months',
        'kuul': 'A bullet',
        'külastama': 'To visit',
        'küsimus': 'A question',
        'käekott': 'A handbag',
        'laev': 'A ship',
        'lahing': 'A battle',
        'laht': 'A leaf or a bay',
        'lai': 'Wide',
        'lasteaed': 'A kindergarten',
        'laul': 'A song',
        'lehm': 'A cow',
        'leht': 'A leaf',
        'linn': 'A city',
        'lips': 'A tie',
        'luba': 'Permission',
        'lugema': 'To read',
        'lumi': 'Snow',
        'maitsema': 'To taste',
        'maksab': 'To be worth',
        'mehelik': 'Noble or manly',
        'meri': 'The sea',
        'miljon': 'A million',
        'miljard': 'A billion',
        'mõistma': 'To understand',
        'müüja': 'A seller',
        'müüjanna': 'A saleswoman',
        'naaber': 'A neighbor',
        'nahast': 'Made of leather',
        'nüüd': 'Now',
        'odavam': 'Cheaper',
        'olema': 'To be',
        'olevat': 'To be (reported)',
        'olut': 'Beer',
        'on': 'Is',
        'onul': 'Uncle (adessive)',
        'oodatav': 'Expected',
        'ooper': 'Opera',
        'ostama': 'To buy',
        'otsa': 'End',
        'paar': 'A couple',
        'paarsada': 'A couple hundred',
        'paluma': 'To ask',
        'panema': 'To put',
        'part': 'A duck',
        'pealt': 'From',
        'peaminister': 'Prime minister',
        'pesema': 'To wash',
        'pikem': 'Longer',
        'pilet': 'A ticket',
        'poiss': 'A boy',
        'poolakas': 'A Pole (nationality)',
        'president': 'President',
        'puhtad': 'Clean',
        'püstitama': 'To erect',
        'raamat': 'A book',
        'raamatukogu': 'A library',
        'ratsa': 'Horse (archaic or poetic)',
        'ratsanik': 'A rider',
        'raudteejaam': 'A railway station',
        'reis': 'A trip',
        'restoran': 'A restaurant',
        'rukis': 'Rye',
        'rätsep': 'A tailor',
        'saama': 'To get',
        'sadama': 'Rain',
        'sadam': 'A harbor',
        'sajad': 'Hundredth',
        'seep': 'Soap',
        'sirk': 'A circus',
        'sõda': 'A war',
        'sõde': 'A sister',
        'sõidab': 'Travels',
        'sügay': 'Autumn',
        'süsta': 'A kayak',
        'suu': 'A mouth',
        'tall': 'A barn',
        'talu': 'A farm',
        'talve': 'Winter',
        'teater': 'A theater',
        'tegevus': 'An activity',
        'teie': 'You (plural or polite)',
        'tikku': 'A match',
        'toot': 'Food (variant)',
        'turg': 'A market',
        'tänan': 'Thank you',
        'tänav': 'A street',
        'tütar': 'A daughter',
        'uisk': 'A skate',
        'uisutama': 'To skate',
        'uus': 'New',
        'vaarikad': 'Raspberries',
        'vahe': 'A difference',
        'vaidlema': 'To argue',
        'valik': 'A selection',
        'vana': 'Old',
        'varsti': 'Soon',
        'vett': 'Water',
        'viis': 'Five',
        'viiskümmend': 'Fifty',
        'õde': 'A sister',
        'õlu': 'Beer',
        'õpetaja': 'A teacher',
        'õppima': 'To learn',
        'üheksakümmend': 'Ninety',
        'ühte': 'One (partitive)',
        'ülikond': 'A suit',
        'ülikool': 'A university',
        'ürime': 'To rent',
    };
    
    // Check if this word has a special case definition
    if (specialCases[word.toLowerCase()]) {
        return specialCases[word.toLowerCase()];
    }
    
    // Use explanation if available, otherwise fallback to english
    return ESTONIAN_EXPLANATIONS[word.toLowerCase()] || english;
}

// Progress bar update function
function updateProgressBar(currentLevel, totalLevels) {
  const progressBar = document.getElementById('level-progress-bar');
  const progressText = document.getElementById('level-progress-text');
  const progressContainer = document.getElementById('level-progress-container');
  if (!progressBar || !progressText || !progressContainer) return;
  const percent = Math.round((currentLevel / totalLevels) * 100);
  progressBar.style.width = percent + '%';
  progressText.textContent = `Level ${currentLevel} of ${totalLevels}`;
  progressContainer.setAttribute('aria-valuenow', currentLevel);
  progressContainer.setAttribute('aria-valuemax', totalLevels);
  progressContainer.setAttribute('aria-valuemin', 1);
}

// Round progress bar update function
function updateRoundProgressBar(currentLevel, levels, currentRound) {
  const roundProgressFill = document.getElementById('roundProgressFill');
  const roundProgressText = document.getElementById('roundProgressText');
  if (!roundProgressFill || !roundProgressText) return;
  // Find all levels in the current round
  const roundLevels = levels.filter(l => l.round === currentRound);
  const roundIndex = roundLevels.findIndex(l => l.level === currentLevel);
  const total = roundLevels.length;
  const current = roundIndex === -1 ? 1 : roundIndex + 1;
  const percent = Math.round((current / total) * 100);
  roundProgressFill.style.width = percent + '%';
  roundProgressText.textContent = `Round ${currentRound}: Level ${current} of ${total}`;
}

// 2. Refactor WordscapesGame to use dynamic levels/rounds
// (Add new methods and refactor constructor/init logic)
class WordscapesGame {
    constructor() {
        this.currentLevel = 1;
        this.currentRound = 1;
        this.score = 0;
        this.foundWords = [];
        this.bonusWords = [];
        this.selectedLetters = [];
        this.currentWord = '';
        this.rounds = [];
        this.levels = [];
        this.currentLevelData = null;
        this.isDragging = false;
        this.dragStartIndex = -1;
        this.completedRounds = [];
        this.completedLevels = 0;
        this.unlockedRounds = 1;
        this.usedLetterIndices = [];
        // Load and classify words from estonian_words.txt (async)
        this.loadWordsAndSetup();
    }

    async loadWordsAndSetup() {
        const response = await fetch('estonian_words.txt');
        const rawText = await response.text();
        const words = parseEstonianWords(rawText);
        
        // Filter to keep only base forms of words
        const filteredWords = filterBaseForms(words);
        
        const grouped = groupWordsByLevel(filteredWords);
        this.rounds = [
            { name: 'Beginner', level: 1, words: grouped.beginner },
            { name: 'Elementary', level: 2, words: grouped.elementary },
            { name: 'Intermediate', level: 3, words: grouped.intermediate }
        ];
        this.generateLevelsFromRounds();
        this.initializeGame();
        this.setupEventListeners();
    }

    generateLevelsFromRounds() {
        // Each round contains several levels, each level has 4-6 unique words
        this.levels = [];
        let levelNum = 1;
        for (const round of this.rounds) {
            const chunkSize = 5;
            // Remove counters and skipping logic to include all levels
            for (let i = 0; i < round.words.length; i += chunkSize) {
                const levelWords = round.words.slice(i, i + chunkSize);
                if (levelWords.length < 3) continue; // skip too small
                const letters = Array.from(new Set(levelWords.flatMap(w => w.estonian.toUpperCase().split(''))));
                this.levels.push({
                    round: round.level,
                    level: levelNum++,
                    words: levelWords.map(w => w.estonian.toUpperCase()),
                    hints: levelWords.map(w => getExplanation(w.estonian, w.english)),
                    letters
                });
            }
        }
    }

    loadEstonianWords() {
        // Estonian words with definitions (not direct translations)
        return {
            'ISA': {
                definition: 'A male parent who raises and cares for children',
                category: 'Family'
            },
            'EMA': {
                definition: 'A female parent who nurtures and protects her offspring',
                category: 'Family'
            },
            'MAA': {
                definition: 'Land or earth, the solid surface of the planet',
                category: 'Geography'
            },
            'AAS': {
                definition: 'A meadow or field where grass grows',
                category: 'Geography'
            },
            'LIND': {
                definition: 'A feathered creature that can fly',
                category: 'Animals'
            },
            'NÄGU': {
                definition: 'The front part of the head with eyes, nose, and mouth',
                category: 'Body'
            },
            'SÕNA': {
                definition: 'A unit of language that carries meaning',
                category: 'Language'
            },
            'SÕDA': {
                definition: 'A conflict between nations or groups',
                category: 'Society'
            },
            'KALA': {
                definition: 'A creature that lives in water and breathes through gills',
                category: 'Animals'
            },
            'LAPS': {
                definition: 'A young human being, a child',
                category: 'Family'
            },
            'LÕNA': {
                definition: 'The direction where the sun sets',
                category: 'Geography'
            },
            'TÕDE': {
                definition: 'A fact or reality that is true',
                category: 'Abstract'
            },
            'TALV': {
                definition: 'The coldest season of the year',
                category: 'Time'
            },
            'SUVI': {
                definition: 'The warmest season of the year',
                category: 'Time'
            },
            'KEVAD': {
                definition: 'The season when plants begin to grow',
                category: 'Time'
            },
            'KIRJANDUS': {
                definition: 'Written works of art, including books and poetry',
                category: 'Culture'
            },
            'TEATER': {
                definition: 'A form of entertainment where actors perform on stage',
                category: 'Culture'
            },
            'FILM': {
                definition: 'A series of moving images shown on screen',
                category: 'Culture'
            },
            'TEE': {
                definition: 'A path or road for traveling',
                category: 'Geography'
            },
            'NÕNA': {
                definition: 'A piece of advice or suggestion',
                category: 'Abstract'
            },
            'KODU': {
                definition: 'The place where you live and feel most comfortable',
                category: 'Home'
            },
            'LEIB': {
                definition: 'A staple food made from flour, water, and yeast',
                category: 'Food'
            },
            'VESI': {
                definition: 'A clear, colorless liquid essential for all living things',
                category: 'Nature'
            },
            'TULI': {
                definition: 'A chemical reaction that produces heat and light',
                category: 'Nature'
            },
            'KOOL': {
                definition: 'An institution where students learn and study',
                category: 'Education'
            },
            'RAAMAT': {
                definition: 'A collection of printed pages bound together',
                category: 'Education'
            },
            'AUTO': {
                definition: 'A four-wheeled vehicle that transports people',
                category: 'Transport'
            },
            'TAKSI': {
                definition: 'A car that you pay to ride in for transportation',
                category: 'Transport'
            },
            'KUNST': {
                definition: 'Creative expression through visual or performing mediums',
                category: 'Culture'
            },
            'MUUSIKA': {
                definition: 'Organized sounds that create melody and rhythm',
                category: 'Culture'
            },
            'AED': {
                definition: 'A piece of land where plants and flowers are grown',
                category: 'Nature'
            },
            'METS': {
                definition: 'A large area covered with trees and wildlife',
                category: 'Nature'
            },
            'LINN': {
                definition: 'A large human settlement with buildings and infrastructure',
                category: 'Geography'
            },
            'SADAM': {
                definition: 'A place where ships dock to load and unload',
                category: 'Geography'
            },
            'TÄNA': {
                definition: 'The current day, not yesterday or tomorrow',
                category: 'Time'
            },
            'HOMNE': {
                definition: 'The day that comes after today',
                category: 'Time'
            },
            'EILE': {
                definition: 'The day that came before today',
                category: 'Time'
            },
            'NÜÜD': {
                definition: 'At this moment, not in the past or future',
                category: 'Time'
            },
            'HEA': {
                definition: 'Having positive qualities or being beneficial',
                category: 'Quality'
            },
            'HALB': {
                definition: 'Having negative qualities or being harmful',
                category: 'Quality'
            },
            'SUUR': {
                definition: 'Having considerable size or extent',
                category: 'Size'
            },
            'VÄIKE': {
                definition: 'Having little size or extent',
                category: 'Size'
            },
            'NOOR': {
                definition: 'In the early period of life or existence',
                category: 'Age'
            },
            'VANA': {
                definition: 'Having lived for a long time or existing for many years',
                category: 'Age'
            },
            'ILUS': {
                definition: 'Pleasing to look at or aesthetically attractive',
                category: 'Appearance'
            },
            'KOLEDA': {
                definition: 'Unpleasant to look at or aesthetically unattractive',
                category: 'Appearance'
            },
            'PRUUN': {
                definition: 'A color between red and yellow, like earth or wood',
                category: 'Color'
            },
            'SININE': {
                definition: 'The color of the sky on a clear day',
                category: 'Color'
            },
            'VALGE': {
                definition: 'The color of snow or milk',
                category: 'Color'
            },
            'MUST': {
                definition: 'The darkest color, opposite of white',
                category: 'Color'
            },
            'KAKS': {
                definition: 'The number that comes after one and before three',
                category: 'Numbers'
            },
            'KOLM': {
                definition: 'The number that comes after two and before four',
                category: 'Numbers'
            },
            'NELI': {
                definition: 'The number that comes after three and before five',
                category: 'Numbers'
            },
            'VIIS': {
                definition: 'The number that comes after four and before six',
                category: 'Numbers'
            },
            'SADA': {
                definition: 'Ten times ten, a large round number',
                category: 'Numbers'
            },
            'TUHAT': {
                definition: 'One thousand, a very large number',
                category: 'Numbers'
            },
            'VABA': {
                definition: 'Not controlled by others, able to act independently',
                category: 'State'
            },
            'KINNI': {
                definition: 'Not open, fastened or secured',
                category: 'State'
            },
            'ALATI': {
                definition: 'On every occasion, without exception',
                category: 'Time'
            },
            'VARSTI': {
                definition: 'In a short time, not long from now',
                category: 'Time'
            },
            'HILJA': {
                definition: 'After the expected or usual time',
                category: 'Time'
            },
            'PALJU': {
                definition: 'A large amount or quantity',
                category: 'Quantity'
            },
            'VÄHE': {
                definition: 'A small amount or quantity',
                category: 'Quantity'
            },
            'ROHKEM': {
                definition: 'A greater amount than before or than something else',
                category: 'Quantity'
            },
            'PISUT': {
                definition: 'A small amount, just a little bit',
                category: 'Quantity'
            }
        };
    }

    generateLevels() {
        // Generate levels using Estonian words
        const estonianWordsList = Object.keys(this.estonianWords);
        
        return [
            {
                level: 1,
                letters: ['I', 'S', 'A', 'E', 'M', 'A', 'A', 'S'],
                words: ['ISA', 'EMA', 'MAA', 'AAS'],
                hints: [
                    'A male parent who raises and cares for children',
                    'A female parent who nurtures and protects her offspring',
                    'Land or earth, the solid surface of the planet',
                    'A meadow or field where grass grows'
                ]
            },
            {
                level: 2,
                letters: ['K', 'O', 'D', 'U', 'L', 'I', 'N', 'N', 'A', 'S'],
                words: ['KODU', 'LINN', 'LIND', 'NÄGU', 'SÕNA'],
                hints: [
                    'The place where you live and feel most comfortable',
                    'A large human settlement with buildings and infrastructure',
                    'A feathered creature that can fly',
                    'The front part of the head with eyes, nose, and mouth',
                    'A unit of language that carries meaning'
                ]
            },
            {
                level: 3,
                letters: ['L', 'E', 'I', 'B', 'V', 'E', 'S', 'I', 'A', 'K'],
                words: ['LEIB', 'VESI', 'SÕDA', 'KALA', 'LAPS'],
                hints: [
                    'A staple food made from flour, water, and yeast',
                    'A clear, colorless liquid essential for all living things',
                    'A conflict between nations or groups',
                    'A creature that lives in water and breathes through gills',
                    'A young human being, a child'
                ]
            },
            {
                level: 4,
                letters: ['T', 'U', 'L', 'I', 'K', 'O', 'O', 'L', 'A', 'S'],
                words: ['TULI', 'KOOL', 'LÕNA', 'SÕNA', 'TÕDE'],
                hints: [
                    'A chemical reaction that produces heat and light',
                    'An institution where students learn and study',
                    'The direction where the sun sets',
                    'A unit of language that carries meaning',
                    'A fact or reality that is true'
                ]
            },
            {
                level: 5,
                letters: ['A', 'U', 'T', 'O', 'T', 'A', 'K', 'S', 'I', 'L', 'N'],
                words: ['AUTO', 'TAKSI', 'TALV', 'SUVI', 'KEVAD'],
                hints: [
                    'A four-wheeled vehicle that transports people',
                    'A car that you pay to ride in for transportation',
                    'The coldest season of the year',
                    'The warmest season of the year',
                    'The season when plants begin to grow'
                ]
            },
            {
                level: 6,
                letters: ['K', 'U', 'N', 'S', 'T', 'M', 'U', 'U', 'S', 'I', 'K', 'A', 'L', 'E'],
                words: ['KUNST', 'MUUSIKA', 'KIRJANDUS', 'TEATER', 'FILM'],
                hints: [
                    'Creative expression through visual or performing mediums',
                    'Organized sounds that create melody and rhythm',
                    'Written works of art, including books and poetry',
                    'A form of entertainment where actors perform on stage',
                    'A series of moving images shown on screen'
                ]
            },
            {
                level: 7,
                letters: ['A', 'E', 'D', 'M', 'E', 'T', 'S', 'A', 'E', 'D', 'I', 'K'],
                words: ['AED', 'METS', 'SÕDA', 'KODU', 'TEE'],
                hints: [
                    'A piece of land where plants and flowers are grown',
                    'A large area covered with trees and wildlife',
                    'A conflict between nations or groups',
                    'The place where you live and feel most comfortable',
                    'A path or road for traveling'
                ]
            },
            {
                level: 8,
                letters: ['T', 'Ä', 'N', 'A', 'H', 'O', 'M', 'N', 'E', 'E', 'I', 'L', 'E', 'S', 'K'],
                words: ['TÄNA', 'HOMNE', 'EILE', 'SÕNA', 'KODU', 'TEE', 'METS', 'AED'],
                hints: [
                    'The current day, not yesterday or tomorrow',
                    'The day that comes after today',
                    'The day that came before today',
                    'A unit of language that carries meaning',
                    'The place where you live and feel most comfortable',
                    'A path or road for traveling',
                    'A large area covered with trees and wildlife',
                    'A piece of land where plants and flowers are grown'
                ]
            },
            {
                level: 9,
                letters: ['H', 'E', 'A', 'H', 'A', 'L', 'B', 'S', 'U', 'U', 'R', 'V', 'Ä', 'I', 'K', 'E', 'T', 'N'],
                words: ['HEA', 'HALB', 'SUUR', 'VÄIKE', 'TÕDE', 'NÕNA', 'KODU', 'TEE', 'METS', 'AED'],
                hints: [
                    'Having positive qualities or being beneficial',
                    'Having negative qualities or being harmful',
                    'Having considerable size or extent',
                    'Having little size or extent',
                    'A fact or reality that is true',
                    'A piece of advice or suggestion',
                    'The place where you live and feel most comfortable',
                    'A path or road for traveling',
                    'A large area covered with trees and wildlife',
                    'A piece of land where plants and flowers are grown'
                ]
            },
            {
                level: 10,
                letters: ['K', 'A', 'K', 'S', 'K', 'O', 'L', 'M', 'N', 'E', 'L', 'I', 'V', 'I', 'I', 'S', 'T', 'E'],
                words: ['KAKS', 'KOLM', 'NELI', 'VIIS', 'TEE', 'METS', 'KODU', 'SÕNA', 'TÕDE', 'NÕNA'],
                hints: [
                    'The number that comes after one and before three',
                    'The number that comes after two and before four',
                    'The number that comes after three and before five',
                    'The number that comes after four and before six',
                    'A path or road for traveling',
                    'A large area covered with trees and wildlife',
                    'The place where you live and feel most comfortable',
                    'A unit of language that carries meaning',
                    'A fact or reality that is true',
                    'A piece of advice or suggestion'
                ]
            }
        ];
    }

    initializeGame() {
        this.renderRoundsUI();
        this.loadLevel(this.currentLevel);
        this.updateUI();
        // Update progress bar for levels (per round)
        const roundLevels = this.levels.filter(l => l.round === this.currentRound);
        const roundIndex = roundLevels.findIndex(l => l.level === this.currentLevel);
        updateProgressBar(roundIndex + 1, roundLevels.length);
        // Update round progress bar
        updateRoundProgressBar(this.currentLevel, this.levels, this.currentRound);
    }

    renderRoundsUI() {
        let roundBar = document.getElementById('roundBar');
        roundBar.className = 'round-bar';
        roundBar.innerHTML = '';
        this.rounds.forEach((round, idx) => {
            const isUnlocked = idx < this.unlockedRounds;
            const isCompleted = this.completedRounds.includes(round.level);
            const isCurrent = this.currentRound === round.level && !isCompleted;
            let btnClass = 'round-btn';
            if (isUnlocked) btnClass += '';
            else btnClass += ' locked';
            if (isCompleted) btnClass += ' completed';
            else if (isCurrent) btnClass += ' current';
            const btn = document.createElement('button');
            btn.className = btnClass;
            btn.innerHTML = isCompleted
                ? `<span style="margin-right:8px;color:#28a745;font-size:1.3em;vertical-align:middle;">✓</span> ${round.name}`
                : (isUnlocked ? ` ${round.name}` : `🔒 ${round.name}`);
            btn.disabled = !isUnlocked || isCompleted;
            btn.addEventListener('click', () => {
                if (isUnlocked && !isCompleted) {
                    this.currentRound = round.level;
                    this.currentLevel = this.levels.find(l => l.round === round.level).level;
                    this.loadLevel(this.currentLevel);
                    this.updateUI();
                }
            });
            roundBar.appendChild(btn);
        });
    }

    loadLevel(levelNumber) {
        this.currentLevelData = this.levels.find(l => l.level === levelNumber);
        if (!this.currentLevelData) {
            // If no more levels, loop back to first level
            this.currentLevelData = this.levels[0];
            this.currentLevel = 1;
        }
        
        this.foundWords = [];
        this.bonusWords = [];
        this.selectedLetters = [];
        this.currentWord = '';
        this.usedLetterIndices = []; // Reset used letter indices for new level
        
        // Clear input field and reset its styling
        const answerInput = document.getElementById('answerInput');
        answerInput.value = '';
        this.resetInputStyling();
        
        this.createCrosswordGrid();
        this.createLetterWheel();
        this.updateUI();
        // Update progress bar for levels (per round)
        const roundLevels = this.levels.filter(l => l.round === this.currentRound);
        const roundIndex = roundLevels.findIndex(l => l.level === this.currentLevel);
        updateProgressBar(roundIndex + 1, roundLevels.length);
        // Update round progress bar
        updateRoundProgressBar(this.currentLevel, this.levels, this.currentRound);
    }

    createCrosswordGrid() {
        const grid = document.getElementById('crosswordGrid');
        grid.innerHTML = '';

        const levelData = this.currentLevelData;
        const words = levelData.words;

        // Render each word as a separate row
        words.forEach((word, rowIndex) => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'crossword-row';
            rowDiv.dataset.row = rowIndex;
            for (let colIndex = 0; colIndex < word.length; colIndex++) {
                const cellElement = document.createElement('div');
                cellElement.className = 'crossword-cell empty';
                cellElement.dataset.row = rowIndex;
                cellElement.dataset.col = colIndex;
                if (colIndex === 0) {
                    cellElement.textContent = word[0];
                    cellElement.classList.remove('empty');
                }
                rowDiv.appendChild(cellElement);
            }
            grid.appendChild(rowDiv);
        });
    }

    createLetterWheel() {
        const wheel = document.getElementById('letterWheel');
        wheel.innerHTML = '';
        
        const letters = [...this.currentLevelData.letters];
        this.shuffleArray(letters);
        
        letters.forEach((letter, index) => {
            const letterElement = document.createElement('button');
            letterElement.className = 'letter';
            letterElement.textContent = letter;
            letterElement.dataset.index = index;
            letterElement.dataset.letter = letter;
            // Only keep click event for letter selection
            letterElement.addEventListener('click', (e) => this.handleLetterClick(e, index));
            wheel.appendChild(letterElement);
        });
    }

    handleLetterMouseDown(e, index) {
        e.preventDefault();
        this.isDragging = true;
        this.dragStartIndex = index;
        this.selectLetter(index);
    }

    handleLetterMouseEnter(e, index) {
        if (this.isDragging && this.dragStartIndex !== -1) {
            this.selectLetter(index);
        }
    }

    handleLetterMouseUp(e) {
        this.isDragging = false;
        this.submitWord();
    }

    handleLetterTouchStart(e, index) {
        e.preventDefault();
        this.isDragging = true;
        this.dragStartIndex = index;
        this.selectLetter(index);
    }

    handleLetterTouchMove(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (element && element.classList.contains('letter')) {
            const index = parseInt(element.dataset.index);
            if (index !== this.dragStartIndex) {
                this.selectLetter(index);
            }
        }
    }

    handleLetterTouchEnd(e) {
        this.isDragging = false;
        this.submitWord();
    }

    handleLetterClick(e, index) {
        this.selectLetter(index);
    }

    selectLetter(index) {
        const letters = document.querySelectorAll('.letter');
        const letter = letters[index];
        const answerInput = document.getElementById('answerInput');
        // Allow selecting the same letter multiple times
        this.usedLetterIndices.push(index); // Still track for highlighting
        letter.classList.add('selected'); // Highlight for feedback
        // Do NOT disable the button, so it can be clicked again
        if (answerInput) {
            answerInput.value += letter.dataset.letter;
            this.currentWord = answerInput.value;
            // Check if the word is valid and submit if so
            if (this.currentWord.length >= 2) {
                this.checkInputWord(this.currentWord);
            }
        }
    }

    updateCurrentWord() {
        this.currentWord = this.selectedLetters.map(item => item.letter).join('');
    }

    submitWord() {
        if (this.currentWord.length < 2) {
            this.clearSelection();
            return;
        }

        const word = this.currentWord.toUpperCase();
        
        // Check if it's a valid word in the level
        if (this.currentLevelData.words.includes(word)) {
            if (!this.foundWords.includes(word)) {
                this.foundWords.push(word);
                this.score += word.length * 10;
                this.fillCrosswordGrid(word);
                this.addWordTag(word, false);
            }
        } else if (this.isValidEstonianWord(word) && !this.bonusWords.includes(word)) {
            this.bonusWords.push(word);
            this.score += word.length * 5;
            this.addWordTag(word, true);
        }

        this.clearSelection(); // Always clear selection after submitting a word
        this.updateUI();
        this.checkLevelComplete();
    }

    clearSelection() {
        this.selectedLetters = [];
        this.currentWord = '';
        this.usedLetterIndices = [];
        // Reset all letter buttons
        const letters = document.querySelectorAll('.letter');
        letters.forEach(letter => {
            letter.classList.remove('selected');
            // Do NOT disable the button, so it can be clicked again
        });
        const answerInput = document.getElementById('answerInput');
        if (answerInput) {
            answerInput.value = '';
        }
    }

    fillCrosswordGrid(word) {
        // Find the word's position in the words array to determine which row it should fill
        const wordIndex = this.currentLevelData.words.indexOf(word);
        if (wordIndex === -1) return;
        
        const row = wordIndex; // Each word gets its own row
        
        // Fill the row with exactly the number of letters in the word
        for (let col = 0; col < word.length; col++) {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (cell) {
                cell.textContent = word[col];
                cell.classList.add('filled');
                cell.classList.remove('empty');
            }
        }
    }

    findWordPositions(word, gridData) {
        // This method is no longer needed with the new approach
        // Each word gets its own dedicated row
        const wordIndex = this.currentLevelData.words.indexOf(word);
        if (wordIndex === -1) return null;
        
        const positions = [];
        for (let i = 0; i < word.length; i++) {
            positions.push({
                row: wordIndex,
                col: i
            });
        }
        return positions;
    }

    addWordTag(word, isBonus) {
        // Since we removed the foundWordsList element, we'll just log the word instead
        // This prevents JavaScript errors while maintaining the game logic
        console.log(`Found word: ${word} ${isBonus ? '(bonus)' : ''}`);
        
        // If you want to add the found words list back later, uncomment this code:
        /*
        const wordsList = document.getElementById('foundWordsList');
        if (wordsList) {
            const wordTag = document.createElement('div');
            wordTag.className = `word-tag ${isBonus ? 'bonus' : ''}`;
            
            if (isBonus && this.estonianWords[word]) {
                wordTag.textContent = `${word} (${this.estonianWords[word].definition})`;
            } else {
                wordTag.textContent = word;
            }
            
            wordsList.appendChild(wordTag);
        }
        */
    }

    isValidEstonianWord(word) {
        return this.estonianWords.hasOwnProperty(word);
    }

    checkInputWord(word) {
        // Check if the word is valid and provide visual feedback
        const answerInput = document.getElementById('answerInput');
        
        if (this.currentLevelData.words.includes(word)) {
            if (!this.foundWords.includes(word)) {
                // Correct answer - show green styling and checkmark
                answerInput.style.borderColor = '#28a745';
                answerInput.style.background = 'rgba(40, 167, 69, 0.15)';
                this.showCheckmark();
                
                // Automatically submit the correct answer after a short delay
                setTimeout(() => {
                    this.submitInputWord(word);
                }, 500);
            } else {
                // Word already found
                answerInput.style.borderColor = '#ffc107';
                answerInput.style.background = 'rgba(255, 193, 7, 0.1)';
                this.hideCheckmark();
            }
        } else if (this.isValidEstonianWord(word) && !this.bonusWords.includes(word)) {
            // Valid bonus word
            answerInput.style.borderColor = '#17a2b8';
            answerInput.style.background = 'rgba(23, 162, 184, 0.1)';
            this.hideCheckmark();
        } else {
            // Invalid word
            answerInput.style.borderColor = '#667eea';
            answerInput.style.background = 'rgba(102, 126, 234, 0.1)';
            this.hideCheckmark();
        }
    }

    submitInputWord(word) {
        const answerInput = document.getElementById('answerInput');
        
        // Check if it's a valid word in the level
        if (this.currentLevelData.words.includes(word)) {
            if (!this.foundWords.includes(word)) {
                this.foundWords.push(word);
                this.score += word.length * 10;
                this.fillCrosswordGrid(word);
                this.addWordTag(word, false);
                answerInput.value = '';
                this.resetInputStyling();
            } else {
                // Word already found
                answerInput.style.borderColor = '#ffc107';
                answerInput.style.background = 'rgba(255, 193, 7, 0.1)';
                setTimeout(() => {
                    this.resetInputStyling();
                }, 1000);
            }
        } else if (this.isValidEstonianWord(word) && !this.bonusWords.includes(word)) {
            this.bonusWords.push(word);
            this.score += word.length * 5;
            this.addWordTag(word, true);
            answerInput.value = '';
            this.resetInputStyling();
        } else {
            // Invalid word
            answerInput.style.borderColor = '#dc3545';
            answerInput.style.background = 'rgba(220, 53, 69, 0.1)';
            setTimeout(() => {
                this.resetInputStyling();
            }, 1000);
        }

        this.clearSelection(); // Always clear selection after submitting a word
        this.updateUI();
        this.checkLevelComplete();
    }

    showCheckmark() {
        const answerInput = document.getElementById('answerInput');
        
        // Remove existing checkmark if any
        this.hideCheckmark();
        
        // Create checkmark element
        const checkmark = document.createElement('div');
        checkmark.className = 'input-checkmark';
        checkmark.innerHTML = '✓';
        checkmark.style.cssText = `
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: #28a745;
            font-size: 1.2rem;
            font-weight: bold;
            pointer-events: none;
            z-index: 10;
        `;
        
        // Make input container relative for absolute positioning
        const wordDisplay = answerInput.parentElement;
        wordDisplay.style.position = 'relative';
        
        wordDisplay.appendChild(checkmark);
    }

    hideCheckmark() {
        const existingCheckmark = document.querySelector('.input-checkmark');
        if (existingCheckmark) {
            existingCheckmark.remove();
        }
    }

    resetInputStyling() {
        const answerInput = document.getElementById('answerInput');
        answerInput.style.borderColor = '#667eea';
        answerInput.style.background = 'rgba(102, 126, 234, 0.1)';
        this.hideCheckmark();
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    shuffleLetters() {
        this.createLetterWheel();
    }

    showHint() {
        // Get words that are not found yet
        const unfoundWords = this.currentLevelData.words.filter(word => 
            !this.foundWords.includes(word)
        );
        
        if (unfoundWords.length > 0) {
            // Show all remaining words instead of just one random word
            this.showAllRemainingWordsModal(unfoundWords);
        } else {
            // All words found - don't show any message, just let player complete the grid
            // this.showAllWordsFoundModal(); // Removed this message
        }
    }

    showAllRemainingWordsModal(unfoundWords) {
        // Create a modal showing all remaining words with their hints (without revealing the words)
        const modal = document.createElement('div');
        modal.className = 'hint-modal';
        
        let wordsList = '';
        unfoundWords.forEach(word => {
            const wordIndex = this.currentLevelData.words.indexOf(word);
            const hint = this.currentLevelData.hints[wordIndex];
            wordsList += `
                <div class="word-hint-item">
                    <h4>??? (${word.length} letters)</h4>
                    <p><strong>Definition:</strong> ${hint}</p>
                </div>
            `;
        });
        
        modal.innerHTML = `
            <div class="hint-content">
                <h3>💡 Remaining Words</h3>
                <p>You still need to find ${unfoundWords.length} word(s):</p>
                <div class="words-hint-list">
                    ${wordsList}
                </div>
                <button class="close-hint-btn">Got it!</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add styles for the modal
        const style = document.createElement('style');
        style.textContent = `
            .hint-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
                animation: fadeIn 0.3s ease;
            }
            .hint-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
            .hint-content h3 {
                color: #667eea;
                margin-bottom: 20px;
                font-size: 1.5rem;
            }
            .hint-content p {
                margin-bottom: 15px;
                line-height: 1.5;
            }
            .words-hint-list {
                margin: 20px 0;
                text-align: left;
            }
            .word-hint-item {
                background: #f8f9fa;
                padding: 15px;
                margin-bottom: 15px;
                border-radius: 10px;
                border-left: 4px solid #667eea;
            }
            .word-hint-item h4 {
                color: #667eea;
                margin-bottom: 10px;
                font-size: 1.2rem;
            }
            .word-hint-item p {
                margin-bottom: 8px;
                font-size: 0.9rem;
            }
            .close-hint-btn {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 20px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 10px;
            }
            .close-hint-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
            }
        `;
        document.head.appendChild(style);
        
        // Close modal functionality
        modal.querySelector('.close-hint-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
            document.head.removeChild(style);
        });
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                document.head.removeChild(style);
            }
        });
    }

    showAllWordsFoundModal() {
        // Create a modal for when all words are found
        const modal = document.createElement('div');
        modal.className = 'hint-modal';
        modal.innerHTML = `
            <div class="hint-content">
                <h3>🎉 All Words Found!</h3>
                <p>Congratulations! You have found all the words for this level:</p>
                <div class="found-words-list">
                    ${this.foundWords.map(word => `<span class="found-word-tag">${word}</span>`).join('')}
                </div>
                <p>Now complete the crossword grid to finish the level!</p>
                <button class="close-hint-btn">Got it!</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add styles for the modal
        const style = document.createElement('style');
        style.textContent = `
            .hint-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
                animation: fadeIn 0.3s ease;
            }
            .hint-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                max-width: 400px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
            .hint-content h3 {
                color: #28a745;
                margin-bottom: 20px;
                font-size: 1.5rem;
            }
            .hint-content p {
                margin-bottom: 15px;
                line-height: 1.5;
            }
            .found-words-list {
                margin: 20px 0;
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 10px;
            }
            .found-word-tag {
                background: linear-gradient(135deg, #28a745, #20c997);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-weight: 600;
                font-size: 0.9rem;
            }
            .close-hint-btn {
                background: linear-gradient(135deg, #28a745, #20c997);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 20px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 10px;
            }
            .close-hint-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 12px rgba(40, 167, 69, 0.4);
            }
        `;
        document.head.appendChild(style);
        
        // Close modal functionality
        modal.querySelector('.close-hint-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
            document.head.removeChild(style);
        });
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                document.head.removeChild(style);
            }
        });
    }





    checkLevelComplete() {
        // Check if all required words are found
        const allWordsFound = this.foundWords.length === this.currentLevelData.words.length;
        
        // Check if all empty cells in the grid are filled
        const allGridCellsFilled = this.areAllGridCellsFilled();
        
        if (allWordsFound && allGridCellsFilled) {
            setTimeout(() => {
                this.showLevelComplete();
            }, 500);
        }
    }

    areAllGridCellsFilled() {
        // Check if all empty cells in the crossword grid have been filled
        const gridCells = document.querySelectorAll('.crossword-cell:not(.hidden)');
        
        for (let cell of gridCells) {
            // Check if the cell is empty (has the 'empty' class) and has no text content
            // This means it's a cell that should be filled by the player
            if (cell.classList.contains('empty') && cell.textContent.trim() === '') {
                return false;
            }
        }
        
        return true;
    }

    showLevelComplete() {
        // Double-check that the level is actually complete before showing the overlay
        if (!this.areAllGridCellsFilled()) {
            this.showIncompleteLevelMessage();
            return;
        }
        // Check if this is the last level in the round
        const roundLevels = this.levels.filter(l => l.round === this.currentRound);
        const roundIndex = roundLevels.findIndex(l => l.level === this.currentLevel);
        if (roundIndex === roundLevels.length - 1) {
            // Last level in round: show only round complete modal
            this.handleRoundComplete();
            return;
        }
        const overlay = document.getElementById('gameOverlay');
        const title = document.getElementById('overlayTitle');
        const message = document.getElementById('overlayMessage');
        const wordsFoundStat = document.getElementById('wordsFoundStat');
        const finalScoreStat = document.getElementById('finalScoreStat');
        title.textContent = 'Level Complete!';
        message.textContent = 'Great job! You found all the Estonian words and completed the crossword grid.';
        wordsFoundStat.textContent = this.foundWords.length;
        finalScoreStat.textContent = this.score;
        overlay.classList.add('show');
    }

    nextLevel() {
        // Additional safety check to ensure level is actually complete
        if (!this.areAllGridCellsFilled()) {
            this.showIncompleteLevelMessage();
            return;
        }
        // Find all levels in the current round
        const roundLevels = this.levels.filter(l => l.round === this.currentRound);
        const roundIndex = roundLevels.findIndex(l => l.level === this.currentLevel);
        if (roundIndex === roundLevels.length - 1) {
            // Last level in round completed
            this.handleRoundComplete();
            return;
        }
        this.currentLevel++;
        const overlay = document.getElementById('gameOverlay');
        overlay.classList.remove('show');
        this.loadLevel(this.currentLevel);
        // Update progress bar for levels (per round)
        const roundLevels2 = this.levels.filter(l => l.round === this.currentRound);
        const roundIndex2 = roundLevels2.findIndex(l => l.level === this.currentLevel);
        updateProgressBar(roundIndex2 + 1, roundLevels2.length);
        // Update round progress bar
        updateRoundProgressBar(this.currentLevel, this.levels, this.currentRound);
    }

    handleRoundComplete() {
        // Mark round as completed
        if (!this.completedRounds.includes(this.currentRound)) {
            this.completedRounds.push(this.currentRound);
        }
        // Unlock next round if available
        if (this.unlockedRounds < this.rounds.length) {
            this.unlockedRounds++;
        }
        this.renderRoundsUI();
        // If this was the last round, show final congratulations modal
        if (this.currentRound === this.rounds.length) {
            this.showAllRoundsCompleteModal();
            return;
        }
        // Show round complete modal
        this.showRoundCompleteModal();
    }

    showRoundCompleteModal() {
        const roundName = this.rounds.find(r => r.level === this.currentRound).name;
        const modal = document.createElement('div');
        modal.className = 'hint-modal';
        modal.innerHTML = `
            <div class="hint-content">
                <h3>🎉 Congratulations!</h3>
                <p>You completed <strong>${roundName}</strong> round successfully.</p>
                <button class="close-hint-btn">Go to Next Round</button>
            </div>
        `;
        document.body.appendChild(modal);
        // Add styles for the modal
        const style = document.createElement('style');
        style.textContent = `
            .hint-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
                animation: fadeIn 0.3s ease;
            }
            .hint-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                max-width: 400px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
            .hint-content h3 {
                color: #28a745;
                margin-bottom: 20px;
                font-size: 1.5rem;
            }
            .hint-content p {
                margin-bottom: 15px;
                line-height: 1.5;
            }
            .close-hint-btn {
                background: linear-gradient(135deg, #28a745, #20c997);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 20px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 10px;
            }
            .close-hint-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 12px rgba(40, 167, 69, 0.4);
            }
        `;
        document.head.appendChild(style);
        // Close modal and go to next round
        modal.querySelector('.close-hint-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
            document.head.removeChild(style);
            // Go to next round if available
            if (this.currentRound < this.rounds.length) {
                this.currentRound++;
                // Set currentLevel to first level of new round
                const firstLevel = this.levels.find(l => l.round === this.currentRound);
                if (firstLevel) {
                    this.currentLevel = firstLevel.level;
                    this.loadLevel(this.currentLevel);
                    this.updateUI();
                }
            }
        });
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                document.head.removeChild(style);
                if (this.currentRound < this.rounds.length) {
                    this.currentRound++;
                    const firstLevel = this.levels.find(l => l.round === this.currentRound);
                    if (firstLevel) {
                        this.currentLevel = firstLevel.level;
                        this.loadLevel(this.currentLevel);
                        this.updateUI();
                    }
                }
            }
        });
    }

    showIncompleteLevelMessage() {
        // Create a temporary message to inform the player they need to complete all grids
        const message = document.createElement('div');
        message.className = 'incomplete-level-message';
        
        // Count how many cells still need to be filled
        const unfilledCells = this.countUnfilledCells();
        
        message.innerHTML = `
            <div class="message-content">
                <h3>⚠️ Level Not Complete</h3>
                <p>You need to complete all crossword grids before proceeding to the next level.</p>
                <p><strong>Cells remaining: ${unfilledCells}</strong></p>
                <p>Look for the highlighted cells that are pulsing - these need to be filled!</p>
                <button class="close-message-btn">OK</button>
            </div>
        `;
        
        document.body.appendChild(message);
        
        // Add styles for the message
        const style = document.createElement('style');
        style.textContent = `
            .incomplete-level-message {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
                animation: fadeIn 0.3s ease;
            }
            .message-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                max-width: 400px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
            .message-content h3 {
                color: #dc3545;
                margin-bottom: 20px;
                font-size: 1.5rem;
            }
            .message-content p {
                margin-bottom: 15px;
                line-height: 1.5;
                color: #666;
            }
            .close-message-btn {
                background: linear-gradient(135deg, #dc3545, #c82333);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 20px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 10px;
            }
            .close-message-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 12px rgba(220, 53, 69, 0.4);
            }
        `;
        document.head.appendChild(style);
        
        // Close message functionality
        message.querySelector('.close-message-btn').addEventListener('click', () => {
            document.body.removeChild(message);
            document.head.removeChild(style);
        });
        
        // Close on outside click
        message.addEventListener('click', (e) => {
            if (e.target === message) {
                document.body.removeChild(message);
                document.head.removeChild(style);
            }
        });
        
        // Auto-remove after 8 seconds
        setTimeout(() => {
            if (document.body.contains(message)) {
                document.body.removeChild(message);
                document.head.removeChild(style);
            }
        }, 8000);
    }

    countUnfilledCells() {
        // Count how many cells still need to be filled
        const gridCells = document.querySelectorAll('.crossword-cell:not(.hidden)');
        let count = 0;
        
        gridCells.forEach(cell => {
            if (cell.classList.contains('empty') && cell.textContent.trim() === '') {
                count++;
            }
        });
        
        return count;
    }

    updateUI() {
        // Update round/level display
        const levelNumber = document.getElementById('levelNumber');
        if (levelNumber) {
            levelNumber.textContent = `${this.currentLevel} (Round ${this.currentRound})`;
        }
        // Optionally update roundBar to reflect current round
        const roundBtns = document.querySelectorAll('.round-btn');
        roundBtns.forEach((btn, idx) => {
            // Remove both 'active' and 'current' classes first
            btn.classList.remove('active', 'current');
            // Add 'current' class only to the active round
            if (this.rounds[idx].level === this.currentRound) {
                btn.classList.add('current');
            }
        });
        document.getElementById('scoreNumber').textContent = this.score;
        
        const progress = this.foundWords.length / this.currentLevelData.words.length;
        document.getElementById('progressFill').style.width = `${progress * 100}%`;
        document.getElementById('progressText').textContent = 
            `${this.foundWords.length}/${this.currentLevelData.words.length}`;
        
        // Update visual feedback for incomplete grids
        this.updateGridVisualFeedback();
    }

    updateGridVisualFeedback() {
        // Add visual feedback to show which cells still need to be filled
        const gridCells = document.querySelectorAll('.crossword-cell:not(.hidden)');
        
        gridCells.forEach(cell => {
            // Remove any existing visual feedback classes
            cell.classList.remove('needs-filling', 'complete');
            
            if (cell.classList.contains('empty') && cell.textContent.trim() === '') {
                // Cell needs to be filled - add pulsing animation
                cell.classList.add('needs-filling');
            } else if (cell.classList.contains('filled') || 
                      (cell.textContent.trim() !== '' && !cell.classList.contains('empty'))) {
                // Cell is complete
                cell.classList.add('complete');
            }
        });
    }

    setupEventListeners() {
        document.getElementById('shuffleBtn').addEventListener('click', () => {
            this.shuffleLetters();
        });
        
        document.getElementById('hintBtn').addEventListener('click', () => {
            this.showHint();
        });
        
        document.getElementById('nextLevelBtn').addEventListener('click', () => {
            this.nextLevel();
        });
        
        // Input field for desktop users
        const answerInput = document.getElementById('answerInput');
        answerInput.addEventListener('input', (e) => {
            // Convert to uppercase and remove non-letters
            const value = e.target.value.toUpperCase().replace(/[^A-ZÄÖÜÕŠŽ]/g, '');
            // If user pressed backspace, remove last used letter
            if (value.length < this.currentWord.length) {
                // Remove last used letter
                if (this.usedLetterIndices.length > 0) {
                    const lastIndex = this.usedLetterIndices.pop();
                    const letters = document.querySelectorAll('.letter');
                    const letter = letters[lastIndex];
                    if (letter) {
                        letter.classList.remove('selected');
                        letter.disabled = false;
                    }
                }
            }
            e.target.value = value;
            this.currentWord = value;
            // Keep selectedLetters in sync with input (for keyboard typing)
            this.selectedLetters = value.split('').map((letter, idx) => ({
                index: idx, // index is not used for keyboard, but kept for compatibility
                letter
            }));
            // Check if the word is valid when user stops typing
            if (value.length >= 2) {
                this.checkInputWord(value);
            } else {
                // Reset styling for short words
                this.resetInputStyling();
            }
        });
        
        // Prevent context menu on letter wheel
        document.getElementById('letterWheel').addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        // Global mouse up to handle edge cases
        document.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.submitWord();
            }
        });
        
        document.addEventListener('touchend', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.submitWord();
            }
        });
    }

    showAllRoundsCompleteModal() {
        const modal = document.createElement('div');
        modal.className = 'hint-modal';
        modal.innerHTML = `
            <div class="hint-content">
                <h3>🏆 Congratulations!</h3>
                <p>You have already completed all rounds with <strong>${this.score}</strong> points!</p>
                <button class="close-hint-btn">OK</button>
            </div>
        `;
        document.body.appendChild(modal);
        // Add styles for the modal
        const style = document.createElement('style');
        style.textContent = `
            .hint-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
                animation: fadeIn 0.3s ease;
            }
            .hint-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                max-width: 400px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
            .hint-content h3 {
                color: #28a745;
                margin-bottom: 20px;
                font-size: 1.5rem;
            }
            .hint-content p {
                margin-bottom: 15px;
                line-height: 1.5;
            }
            .close-hint-btn {
                background: linear-gradient(135deg, #28a745, #20c997);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 20px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 10px;
            }
            .close-hint-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 12px rgba(40, 167, 69, 0.4);
            }
        `;
        document.head.appendChild(style);
        // Close modal on button click or outside click
        modal.querySelector('.close-hint-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
            document.head.removeChild(style);
            this.resetGame();
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                document.head.removeChild(style);
                this.resetGame();
            }
        });
    }

    resetGame() {
        // Reset all game state and start from the beginning
        this.currentLevel = 1;
        this.currentRound = 1;
        this.score = 0;
        this.foundWords = [];
        this.bonusWords = [];
        this.selectedLetters = [];
        this.currentWord = '';
        this.completedRounds = [];
        this.completedLevels = 0;
        this.unlockedRounds = 1;
        this.usedLetterIndices = [];
        this.loadWordsAndSetup();
        this.updateUI();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new WordscapesGame();
    // The progress bars will be updated by the game class
}); 