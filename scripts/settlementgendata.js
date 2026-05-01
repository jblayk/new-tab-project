
	// --- DATA ARRAYS ---
	// Using objects with 'name' (for the module box) and 'desc' (for the final text)
	// This allows for more natural-sounding narrative construction.

	const namePrefixes = ['Stone', 'Iron', 'Bright', 'Clear', 'Old', 'New', 'North', 'South', 'East', 'West', 'Shadow', 'Silver', 'White', 'Green', 'Red', 'Black', 'Grey', 'River', 'High', 'Low', 'Fall', 'Sun', 'Moon', 'Star', 'King\'s', 'Queen\'s', 'Dragon\'s', 'Gryphon\'s', 'Elm', 'Oak', 'Pine', 'Ash', 'Willow', 'Ever'];
	const nameSuffixes = ['ford', 'wood', 'hollow', 'crest', 'brook', 'bridge', 'keep', 'water', 'town', 'stead', 'wick', 'moor', 'barrow', 'watch', 'rock', 'bend', 'field', 'haven', 'port', 'peak', 'pass', 'glade', 'vale', 'run', 'fell', 'guard', 'rest', 'spring', 'mire', 'point'];

	const settlementTypes = [
		{ name: 'Thorp (Dozens)', pop: '20-80', desc: 'humble thorp' },
		{ name: 'Hamlet (Hundreds)', pop: '80-400', desc: 'small hamlet' },
		{ name: 'Village (Up to 1,000)', pop: '400-1,000', desc: 'bustling village' },
		{ name: 'Small Town (Several Thousand)', pop: '1,000-4,000', desc: 'well-known town' },
		{ name: 'Large Town (Up to 10,000)', pop: '4,000-10,000', desc: 'large, fortified town' },
		{ name: 'Small City (Up to 25,000)', pop: '10,000-25,000', desc: 'sprawling city' },
		{ name: 'Large City (Up to 100,000)', pop: '25,000-100,000', desc: 'major city' },
		{ name: 'Metropolis (Vast)', pop: '100,000+', desc: 'vast metropolis' }
	];

	const locations = [
		{ name: 'Coastal', desc: 'clinging to the cliffs of a stormy coast' },
		{ name: 'Forest', desc: 'nestled deep within an ancient, whispering forest' },
		{ name: 'Mountain Pass', desc: 'built precariously in a vital mountain pass' },
		{ name: 'Riverlands', desc: 'sprawled along the fertile banks of a wide river' },
		{ name: 'Plains', desc: 'rising from the rolling hills of a vast plain' },
		{ name: 'Swamp', desc: 'built on stilts above a murky, fog-shrouded swamp' },
		{ name: 'Desert Oasis', desc: 'a verdant jewel surrounding a life-giving oasis in a harsh desert' },
		{ name: "Underdark", desc: "carved into the cavern walls of the Underdark, lit by bioluminescent fungi" },
		{ name: 'Volcanic', desc: 'huddled on the slopes of a smoking, rumbling volcano' },
		{ name: 'Tundra', desc: 'a hardy outpost surviving on the frozen, windswept tundra' },
		{ name: 'Floating Island', desc: 'perched atop a floating earthmote that drifts slowly through the sky' },
		{ name: 'Ancient Ruins', desc: 'built in and around the impressive ruins of a long-dead civilization' }
	];

	const populations = [
		{ name: 'Mostly Human', desc: 'a predominantly human population, with a few other races mixed in' },
		{ name: 'Dwarven Majority', desc: 'a hardy population of dwarves, with most business conducted underground' },
		{ name: 'Elven Enclave', desc: 'a graceful, quiet populace of elves, suspicious of outsiders' },
		{ name: 'Halfling Community', desc: 'a cheerful and bustling community of halflings, known for their food and hospitality' },
		{ name: 'Gnomish Warrens', desc: 'a bewildering, tinkered-together warren of gnomes' },
		{ name: 'Orcish Stronghold', desc: 'a rough-and-tumble settlement of orcs and half-orcs, valuing strength above all' },
		{ name: 'Dragonborn Clan', desc: 'a proud and regimented society of dragonborn, bound by honor' },
		{ name: 'Tiefling Slums', desc: 'a mistrusted and insular community of tieflings, surviving in the margins' },
		{ name: 'Cosmopolitan Mix', desc: 'a true melting pot, where dozens of races live, work, and scheme together' },
		{ name: 'Goblinoid Town', desc: 'a surprisingly organized (and dangerous) town run by goblins, hobgoblins, and bugbears' },
		{ name: 'Abandoned/Haunted', desc: 'an eerie, silent place, its original inhabitants vanished or lingering as spirits' }
	];

	const governments = [
		{ name: 'Elected Mayor', desc: 'is governed by an elected mayor, currently a popular (or corrupt) figure' },
		{ name: 'Noble\'s Rule', desc: 'is under the strict rule of a hereditary noble, who taxes the populace heavily' },
		{ name: 'Council of Elders', desc: 'is led by a council of elders, who value tradition above all else' },
		{ name: 'Theocracy', desc: 'is a theocracy, its laws dictated by the high priest of a powerful deity' },
		{ name: 'Magocracy', desc: 'is controlled by a cabal of powerful wizards from their isolated tower' },
		{ name: 'Military Junta', desc: 'is under martial law, enforced by a grim military governor' },
		{ name: 'Thieves\' Guild', desc: 'is secretly (or openly) run by a powerful thieves\' guild, its "tax" a price for protection' },
		{ name: 'Anarchy', desc: 'has no formal government, a chaotic place ruled by the strong and the cunning' },
		{ name: 'Corporate Control', desc: 'is owned and operated by a wealthy trading company or merchant guild' },
		{ name: 'Druidic Circle', desc: 'is guided by a circle of druids, who prioritize nature over commerce' }
	];

	const economies = [
		{ name: 'Farming', desc: 'prospers from its vast, fertile farmlands, feeding the region' },
		{ name: 'Mining (Gems/Ore)', desc: 'thrives on the rich veins of ore and gems mined from the nearby mountains' },
		{ name: 'Trade Hub', desc: 'bustles with activity as a major trade hub, its markets filled with exotic goods' },
		{ name: 'Fishing', desc: 'relies on the bountiful (or dwindling) harvest from the sea' },
		{ name: 'Logging/Lumber', desc: 'is built on the timber trade, its mills constantly at work' },
		{ name: 'Magic/Arcane', desc: 'is known for its arcane academy, exporting scrolls, potions, and enchanted items' },
		{ name: 'Pilgrimage Site', desc: 'survives on the pilgrims who flock to its holy shrine or sacred site' },
		{ name: 'Mercenaries', desc: 'is a hiring ground for mercenaries and adventurers, its taverns full of soldiers-for-hire' },
		{ name: 'Artisans', desc: 'is famous for its master artisans, who create priceless crafts' },
		{ name: 'Exotic Resource', desc: 'controls a rare and valuable resource, like dragon\'s-blood trees, shadow-silk, or Griffon eggs' }
	];

	const vibes = [
		{ name: 'Prosperous & Bright', desc: 'a sense of prosperity and optimism; the streets are clean and the people well-fed' },
		{ name: 'Poor & Desperate', desc: 'an air of desperation and poverty; the buildings are crumbling and people eye strangers with suspicion' },
		{ name: 'Oppressive & Paranoid', desc: 'a palpable feeling of paranoia; guards watch every corner and citizens speak in hushed tones' },
		{ name: 'Secretive & Insular', desc: 'an insular and secretive atmosphere; outsiders are unwelcome and traditions are guarded jealously' },
		{ name: 'Pious & Judgmental', desc: 'a devout and judgmental air; temples are everywhere, and public piety is expected' },
		{ name: 'Rowdy & Lawless', desc: 'a rowdy, chaotic, and lawless feeling; brawls spill from taverns and the city guard is a joke' },
		{ name: 'Peaceful & idyllic', desc: 'an idyllic and peaceful atmosphere, seemingly untouched by the world\'s troubles' },
		{ name: 'Decaying & Morbid', desc: 'a morbid sense of decay; the place is slowly dying, and many seem toH ave given up hope' },
		{ name: 'Magical & Ethereal', desc: 'an ethereal and wondrous feeling; motes of light drift in the air and magic is commonplace' },
		{ name: 'Suspicious & Wary', desc: 'a wary and suspicious mood; everyone seems to be hiding something' }
	];

	const landmarks = [
		{ name: 'Giant Statue', desc: 'dominated by a colossal statue of a forgotten god, which is said to weep blood' },
		{ name: 'Magical Spring', desc: 'centered around a bubbling spring whose waters have miraculous healing properties' },
		{ name: 'Ancient Ruin', desc: 'built in the shadow of an ancient, cyclopean ruin that predates the settlement' },
		{ name: 'Grand Library', desc: 'famous for the Great Library, which is said to hold a copy of every book ever written' },
		{ name: 'Massive Tree', desc: 'built in and around a truly colossal tree that touches the clouds' },
		{ name: 'Deep Chasm', desc: 'bisected by a seemingly bottomless chasm, spanned by a single, ancient bridge' },
		{ name: 'Floating Crystal', desc: 'hovering above the town square is a massive, slowly rotating crystal that hums with power' },
		{ name: 'Petrified Titan', desc: 'built on the corpse of a petrified titan, its stone fingers forming the city\'s highest peaks' },
		{ name: 'Planar Rift', desc: 'overshadowed by a shimmering, unstable rift to another plane of existence' },
		{ name: 'Mechanical Clocktower', desc: 'marked by a mechanical clocktower of gnomish design, its inner workings a mystery' }
	];

	const problems = [
		{ name: 'Monster Threat', desc: 'a recent and brutal series of monster attacks has the populace terrified' },
		{ name: 'Political Corruption', desc: 'rampant political corruption means the rich get richer while the poor starve' },
		{ name: 'Strange Plague', desc: 'a mysterious plague is sweeping through the settlement, baffling local healers' },
		{ name: 'Local Curse', desc: 'an ancient curse has befallen the town, causing crops to fail and livestock to sicken' },
		{ name: 'Gang War', desc: 'two rival gangs are fighting a bloody war in the streets for control' },
		{ name: 'Famine', desc: 'a harsh winter or recent drought has led to a severe famine' },
		{ name: 'Disappearances', desc: 'citizens are vanishing from their homes in the dead of night' },
		{ name: 'Religious Fanaticism', desc: 'a new, fanatical religious cult is gaining power and persecuting non-believers' },
		{ name: 'Magical Anomaly', desc: 'a wild magic anomaly is causing unpredictable and dangerous effects' },
		{ name: 'Noble\'s Tyranny', desc: 'the local ruler has become a tyrant, their edicts cruel and their guards brutal' }
	];
