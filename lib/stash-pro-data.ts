export type StashProduct = {
  name: string
  description: string
  features: string[]
}

export type StashCategory = {
  id: string
  label: string
  products: StashProduct[]
}

export const STASH_CATEGORIES: StashCategory[] = [
  {
    id: 'lighters',
    label: 'Lighters',
    products: [
      {
        name: 'Ez Flame Lighter',
        description:
          'A refillable utility lighter built for candles, kitchens, and everyday lighting. Top up the butane and reuse it again and again — reliable ignition, a comfortable grip, and a steady, adjustable flame make it a handy pick to keep around the house.',
        features: [
          'Refillable — top up with butane and reuse',
          'Reliable, easy ignition',
          'Adjustable flame and comfortable grip',
        ],
      },
      {
        name: 'Carlos Windproof Lighter',
        description:
          'A windproof flip-top lighter built for outdoor use. The solid metal body and reliable jet flame hold up in wind without flickering, making it a dependable companion for any setting.',
        features: ['Windproof jet flame', 'Flip-top metal body', 'Reliable outdoor ignition'],
      },
      {
        name: 'Osaka Refillable Lighter',
        description:
          'A compact lighter designed for everyday ignition, easy carry and repeated use. Its refillable format makes it practical for users who want a reusable lighter that fits comfortably into pockets, drawers, pouches and daily setups.',
        features: ['Refillable format', 'Compact, pocket-friendly size', 'Everyday reliable ignition'],
      },
      {
        name: 'Flex-E Flexible Lighter',
        description:
          'A flexible-neck utility lighter with a long reach, designed for candles, fireplaces and hard-to-reach spots. The bendable neck keeps your hand clear of the flame while delivering reliable ignition every time.',
        features: ['Flexible neck for hard-to-reach spots', 'Long reach design', 'Reliable ignition'],
      },
      {
        name: 'Fold-E Foldable Lighter',
        description:
          'A foldable lighter that collapses flat for ultra-compact storage. Open it up and you have a full-sized flame — fold it back and it disappears into any pocket or pouch.',
        features: ['Folds flat for compact storage', 'Full-sized flame when open', 'Pocket and pouch friendly'],
      },
      {
        name: 'Jetty Windproof Lighter',
        description:
          'A compact windproof jet flame lighter built for outdoor reliability. The focused jet flame resists wind effectively, delivering consistent ignition wherever you are.',
        features: ['Windproof jet flame', 'Compact metal body', 'Consistent outdoor ignition'],
      },
      {
        name: 'Premium Refillable Lighter',
        description:
          'A premium refillable lighter with a polished metal body and smooth ignition. Designed for users who want a dependable everyday lighter with a refined look and feel.',
        features: ['Premium polished metal body', 'Smooth, reliable ignition', 'Refillable for repeated use'],
      },
      {
        name: 'Flippy Jet Flame Lighter',
        description:
          'A compact jet flame lighter with a satisfying flip-top action. The focused flame is windproof and delivers precise ignition, while the sleek form factor fits naturally in hand or pocket.',
        features: ['Jet flame — windproof and precise', 'Satisfying flip-top action', 'Compact, ergonomic form'],
      },
    ],
  },
  {
    id: 'grinders',
    label: 'Grinders',
    products: [
      {
        name: 'UFO Herb Grinder',
        description:
          'A premium 4-part metal grinder with a distinctive domed UFO profile and a smooth, weighty feel. Precision teeth deliver an effortless grind, with a fine mesh screen and catcher chamber for collecting the fines.',
        features: ['Premium 4-part metal build', 'Distinctive domed UFO design', 'Fine mesh screen with catcher chamber'],
      },
      {
        name: 'Glow in the Dark Grinder — Large',
        description:
          'A full-size 4-part metal grinder with a glow-in-the-dark finish that charges under light and shines in the dark. Sharp teeth grind evenly, with a mesh screen and deep catcher chamber keeping the fines collected.',
        features: ['Large 4-part metal build', 'Glow-in-the-dark finish in 4 colours', 'Mesh screen with deep catcher chamber'],
      },
      {
        name: 'Large Neon Grinder',
        description:
          'A full-size 4-part metal grinder with a bold neon finish. Sharp teeth deliver an even grind, with a mesh screen and deep catcher chamber keeping the fines collected.',
        features: ['Large 4-part metal build', 'Bold neon finish in 5 colours', 'Mesh screen with deep catcher chamber'],
      },
      {
        name: 'Medium Neon Grinder',
        description:
          'A compact 4-part metal grinder with a bold neon finish. Sharp teeth deliver an even grind, with a mesh screen and catcher chamber keeping the fines collected.',
        features: ['Medium 4-part metal build', 'Bold neon finish in 5 colours', 'Mesh screen with catcher chamber'],
      },
      {
        name: 'Medium Spotty Grinder',
        description:
          'A compact 4-part metal grinder with a playful spotted finish. Sharp diamond teeth deliver a smooth, even grind, while the mesh screen and catcher chamber keep the fines collected. A magnetic lid keeps everything secure.',
        features: ['Medium 4-part metal build', 'Spotted finish in 4 colours', 'Mesh screen with catcher chamber'],
      },
      {
        name: 'Biodegradable Grinder',
        description:
          'A lightweight 2-part grinder made from biodegradable plastic. At under 55 grams it is easy to carry anywhere, with a smooth grinding action and a premium feel that belies its eco-friendly build.',
        features: ['Made from biodegradable plastic', 'Lightweight 2-part design, under 55g', 'Smooth, consistent grind'],
      },
      {
        name: 'Silicone Grinder — Large',
        description:
          'A 4-piece herb grinder with a flexible silicone exterior and a precision-cut metal grinding core. Built to handle daily use without the chipping or denting common to all-metal grinders.',
        features: ['4-piece construction with kief catcher and pollen screen', 'Sharp diamond-cut teeth', 'Flexible silicone exterior'],
      },
      {
        name: 'Zinc Herb Grinder — Small',
        description:
          'A compact 3-layer zinc alloy grinder from the country series, finished in Australian flag colours. Sharp teeth grind evenly, the mesh screen and catcher chamber collect the fines, and the magnetic lid keeps it secure in your pocket.',
        features: ['Compact 3-layer zinc alloy build', 'Australian flag country series', 'Mesh screen with catcher chamber and scraper'],
      },
      {
        name: 'Pink Grinder',
        description:
          'A full-size 4-part metal grinder in a bold pink finish. Sharp teeth deliver an even grind, with a mesh screen and deep catcher chamber keeping the fines collected. A magnetic lid keeps everything secure.',
        features: ['4-part metal build', 'Bold pink finish', 'Mesh screen with deep catcher chamber', 'Magnetic lid'],
      },
    ],
  },
  {
    id: 'ashtrays',
    label: 'Ashtrays',
    products: [
      {
        name: 'Aluminium Ashtray',
        description:
          'A heavy-duty round metal ashtray built for everyday use. The solid aluminium body resists heat and tipping, and the smooth finish wipes clean in seconds.',
        features: ['Heavy-duty solid aluminium build', 'Weighted base resists tipping', 'Heat-resistant, easy-clean finish', 'Available in 2 colours'],
      },
      {
        name: 'Cigar Ashtray',
        description:
          'A large-format ashtray with deep rests, built for longer sessions. The weighted body sits rock-solid on tables and bar tops, with a wide bowl that keeps ash contained and wipes clean easily.',
        features: ['Deep rests designed for cigars', 'Weighted, stable large-format body', 'Wide, easy-clean bowl', 'Available in 2 finishes'],
      },
      {
        name: 'Frosted Glass Ashtray',
        description:
          'A compact tabletop ashtray with a soft frosted finish that adds a clean, premium look to any setup. The sturdy glass body sits firmly on desks, balconies and side tables, and wipes clean in seconds.',
        features: ['Frosted glass finish with a smooth matte feel', 'Sturdy, weighted base for everyday tabletop use', 'Easy to rinse and wipe clean', 'Available in 3 colours'],
      },
      {
        name: 'Square Glass Ashtray',
        description:
          'A sturdy square-format tabletop ashtray with a bold printed base. The thick glass build gives it a solid, weighted feel, while the flat square profile makes it easy to place on desks, trays and side tables.',
        features: ['Square tempered-style glass body with printed base', 'Weighted, stable design for everyday use', 'Easy to wipe clean', 'Available in 3 designs'],
      },
      {
        name: 'Pocket Ashtray',
        description:
          'A compact, portable ashtray that fits in your pocket or bag. The flame-resistant lining lets you stub out and store ash and butts on the go — no litter, no smell leaking out, no looking for a bin.',
        features: ['Pocket-sized and lightweight', 'Flame-resistant inner lining', 'Snap-shut closure keeps ash and odour contained', 'Available in 3 designs'],
      },
      {
        name: 'Glass Ashtray',
        description:
          'A compact tabletop ashtray designed for everyday use, easy placement and simple cleaning. Its sturdy glass body gives it a solid feel, while the smooth printed base adds a clear design-led look to your setup.',
        features: ['Compact glass ashtray for desks and side tables', 'Sturdy glass body with printed base', 'Easy to wipe clean', 'Available in 10 design variants'],
      },
      {
        name: 'Metal Ashtray',
        description:
          'A compact, lightweight tabletop ashtray designed for everyday use, easy placement and simple cleaning. Its metal body gives it a sturdy feel, while the smooth finish makes it easy to wipe down after regular use.',
        features: ['Compact metal ashtray for desks and balconies', 'Lightweight, sturdy body with smooth finish', 'Easy to clean and store', 'Available in 8 colour variants'],
      },
    ],
  },
  {
    id: 'rolling-trays',
    label: 'Rolling Trays',
    products: [
      {
        name: 'Oval Metal Tray',
        description:
          'A compact oval-shaped metal tray with a smooth metallic finish and raised edges that keep your essentials contained. Lightweight and easy to wipe clean, it is the perfect size for desk or travel use.',
        features: ['Compact oval metal tray', 'Metallic finish in 4 colours', 'Raised edges, easy-clean surface', 'Ideal for desk or travel'],
      },
      {
        name: 'Small Rolling Tray',
        description:
          'A compact metal tray designed for clean, mess-free rolling on the go. Made from lightweight, durable metal with a smooth printed surface and rounded edges that keep your herbs, papers and filter tips contained while you roll.',
        features: ['Compact size, easy to slip into a bag or drawer', 'Lightweight metal construction with smooth printed finish', 'Rounded edges to keep contents from spilling', 'Wipe-clean surface'],
      },
      {
        name: 'Medium Rolling Tray — Thailand',
        description:
          'A mid-size metal tray finished in Thailand flag colours. Raised edges keep your essentials contained, and the smooth surface wipes clean in seconds.',
        features: ['Mid-size metal tray', 'Thailand flag design', 'Raised edges, easy-clean surface', 'Ideal for desk or session use'],
      },
      {
        name: 'Medium Rolling Tray — Classic',
        description:
          'A mid-size metal tray with a clean, timeless design. Raised edges keep your essentials contained while you work, and the smooth surface wipes clean in seconds.',
        features: ['Mid-size metal tray', 'Clean classic design', 'Raised edges, easy-clean surface', 'Ideal for desk or session use'],
      },
      {
        name: 'Medium Rolling Tray — Green',
        description:
          'A mid-size metal tray with a bold solid green finish. Raised edges keep your essentials contained, and the smooth surface wipes clean in seconds.',
        features: ['Mid-size metal tray', 'Bold green finish', 'Raised edges, easy-clean surface'],
      },
      {
        name: 'Premium Rolling Tray — Bold Edition',
        description:
          'Designed for users who want a larger, more statement-driven tray for everyday organisation. The sturdy surface gives you room to keep small essentials in place, while the raised edges help reduce mess during use.',
        features: ['Large statement-driven format', 'Sturdy surface with raised edges', 'Bold printed design', 'Wipe-clean finish'],
      },
      {
        name: 'Wooden Rolling Tray',
        description:
          'A natural wood rolling tray with a warm finish and smooth surface. Raised edges keep your essentials in place, and the wood build gives it a premium, tactile feel that stands apart from standard metal trays.',
        features: ['Natural wood construction', 'Smooth surface with raised edges', 'Premium tactile feel', 'Easy to wipe clean'],
      },
      {
        name: 'Toughened Glass Crushing Plate',
        description:
          'A toughened glass crushing plate designed for clean, precise preparation on a flat, non-stick surface. The smooth glass is easy to scrape and wipe clean, with a sturdy build that resists everyday wear.',
        features: ['Toughened glass surface', 'Non-stick, easy to scrape clean', 'Sturdy build for daily use', 'Available in 2 finishes'],
      },
    ],
  },
  {
    id: 'rolling-papers',
    label: 'Rolling Papers & Tips',
    products: [
      {
        name: 'Brown Rolling Papers',
        description:
          'Classic unbleached brown rolling papers crafted for a natural smoking experience. The slow, even burn and natural gum seal deliver a consistent roll every session.',
        features: ['Unbleached brown paper', 'Natural acacia gum seal', 'Slow, even burn', 'Classic king-size format'],
      },
      {
        name: 'White Rolling Papers',
        description:
          'Clean, classic white rolling papers made for everyday use. Designed in a compact 32-paper pack, these papers are crafted with natural acacia gum for easy sealing and a smooth rolling experience.',
        features: ['Natural acacia gum seal', '32-paper pack', 'Smooth, easy-to-roll format', 'Clean white finish'],
      },
      {
        name: 'Burning Desire Pink Rolling Papers',
        description:
          'Bold pink rolling papers designed for users who want a distinctive, compact and easy-to-carry booklet. The pink Burning Desire design gives the pack a strong visual identity while keeping everyday preparation simple.',
        features: ['Bold Burning Desire pink design', 'Compact and easy to carry', 'Smooth, consistent roll', 'Natural gum seal'],
      },
      {
        name: 'Ripper Tipper White — Papers with Filter Tips',
        description:
          'A compact rolling paper booklet that brings papers and filter tips together in one easy-to-carry format. Includes white rolling papers and perforated filter tips for convenient everyday preparation.',
        features: ['Papers and filter tips in one booklet', 'White rolling papers', 'Perforated filter tips', 'Compact, easy to carry'],
      },
      {
        name: 'Burning Desire Ripper Tipper Pink — Papers with Filter Tips',
        description:
          'A compact rolling paper booklet that brings rolling papers and filter tips together in one easy-to-carry format. The pink Burning Desire design gives the pack a bold visual identity while keeping everyday preparation simple.',
        features: ['Papers and filter tips in one booklet', 'Bold Burning Desire pink design', 'Perforated filter tips', 'Compact, easy to carry'],
      },
      {
        name: 'Super Slim Ripper Tipper Brown',
        description:
          'A compact super slim rolling paper booklet for users who prefer a cleaner, slimmer format. It brings rolling papers and filter tips together in one easy-to-carry pack for everyday convenience.',
        features: ['Super slim format', 'Papers and filter tips in one booklet', 'Unbleached brown paper', 'Compact, easy to carry'],
      },
      {
        name: 'White Filter Tip Booklet',
        description:
          'A compact pack of perforated filter tips designed for clean, organised everyday use. The booklet format keeps tips protected, easy to access and simple to carry in pockets, drawers, trays or travel-friendly setups.',
        features: ['Perforated filter tips', 'Booklet format — easy access', 'Compact and pocket-friendly', 'Clean white finish'],
      },
    ],
  },
  {
    id: 'pre-rolled-cones',
    label: 'Pre-Rolled Cones',
    products: [
      {
        name: 'Brown Pre-Rolled Cones — Pack of 5',
        description:
          'No Roll, No Problem. A shortcut to a perfect roll, every time. These empty pre-rolled brown paper cones are ideal for quick setups and consistent results. Just fill, pack, and you are ready.',
        features: ['Pack of 5 pre-rolled cones', 'Made from unbleached brown rolling paper', 'Ready-to-fill — no rolling skills needed', 'Consistent shape every time'],
      },
      {
        name: 'Brown Pre-Rolled Cones — Pack of 6',
        description:
          'A ready-to-fill pack of 6 unbleached brown cones for quick, consistent preparation. Just fill, pack and you are set — no rolling required.',
        features: ['Pack of 6 pre-rolled cones', 'Unbleached brown paper', 'Ready-to-fill format', 'Consistent shape'],
      },
      {
        name: 'Brown Pre-Rolled Cones — King Size Pack of 6',
        description:
          'King size ready-to-fill cones in unbleached brown paper. Larger format for those who prefer a more generous fill — same clean, consistent shape every time.',
        features: ['King size format', 'Pack of 6', 'Unbleached brown paper', 'Ready-to-fill'],
      },
      {
        name: 'Party Brown Pre-Rolled Cones — House Party Edition',
        description:
          'A ready-to-fill cone bundle made for get-togethers. Each cone is rolled from unbleached brown paper with a built-in tip, so there is no rolling, no mess and no waiting — just fill, twist and you are set.',
        features: ['Ready-to-fill unbleached brown cones with built-in tips', 'House party pack size', 'Even, consistent build', 'No rolling skills needed'],
      },
      {
        name: 'White Pre-Rolled Cones — Pack of 6',
        description:
          'Ready-to-fill king size cones in white paper designed for clean, quick and consistent everyday use. The white paper format gives the pack a simple, classic look while keeping prep easy.',
        features: ['Pack of 6', 'White paper format', 'King size', 'Ready-to-fill'],
      },
      {
        name: 'Pink Pre-Rolled Cones — Burning Desire',
        description:
          'Ready-to-fill pink cones from the Burning Desire collection. Same easy, no-roll format — just fill, pack and twist. The bold pink colour makes them stand out from the standard.',
        features: ['Burning Desire pink format', 'Ready-to-fill design', 'No rolling required', 'Bold visual appeal'],
      },
    ],
  },
  {
    id: 'sheesha',
    label: 'Sheesha & Hookah',
    products: [
      {
        name: 'Sheesha HR 08 Pink',
        description:
          'A stylish sheesha from the HR series, designed for smooth personal sessions at home. Stable base, clean draw and an easy-disassembly build for quick cleaning.',
        features: ['HR series design in Pink', 'Stable, balanced base', 'Smooth, consistent draw', 'Easy to assemble and clean'],
      },
      {
        name: 'Sheesha S6 Gold White',
        description:
          'A compact glass sheesha with an elegant two-tone finish, designed for smooth personal sessions at home. Stable weighted base, clean draw and easy-disassembly build.',
        features: ['Elegant gold and white finish', 'Stable, weighted base', 'Smooth, consistent draw', 'Easy to assemble and clean'],
      },
      {
        name: 'Sheesha HR 11 Blue',
        description:
          'A stylish sheesha from the HR series, designed for smooth personal sessions at home. Stable base, clean draw and an easy-disassembly build for quick cleaning.',
        features: ['HR series design in Blue', 'Stable, balanced base', 'Smooth, consistent draw', 'Easy to assemble and clean'],
      },
      {
        name: 'Sheesha HR 05 Magenta',
        description:
          'A stylish sheesha from the HR series, designed for smooth personal sessions at home. Stable base, clean draw and an easy-disassembly build for quick cleaning.',
        features: ['HR series design in Magenta', 'Stable, balanced base', 'Smooth, consistent draw', 'Easy to assemble and clean'],
      },
      {
        name: 'Sheesha HR 09 Portable Red',
        description:
          'A compact travel-ready sheesha from the HR series. Small enough to pack and carry, with a stable base, clean draw and quick-clean build.',
        features: ['Compact, travel-ready HR design', 'Portable Red finish', 'Stable base with smooth draw', 'Easy to assemble and clean'],
      },
      {
        name: 'Sheesha S1 Clear',
        description:
          'A minimal clear glass sheesha designed for clean everyday sessions. The transparent body lets you see the draw in action, while the stable weighted base and easy-clean build keep maintenance simple.',
        features: ['Clear glass body', 'Stable, weighted base', 'Smooth, consistent draw', 'Easy to disassemble and clean'],
      },
      {
        name: 'Coconut Coal — 30 Cubes',
        description:
          'Natural coconut shell charcoal for sheesha sessions. Burns clean and slow with minimal ash, delivering consistent heat without the harsh chemicals found in quick-light coals.',
        features: ['Natural coconut shell charcoal', '30 cube pack', 'Clean, slow burn with minimal ash', 'No harsh chemicals'],
      },
    ],
  },
  {
    id: 'storage-jars',
    label: 'Storage Jars',
    products: [
      {
        name: 'Airtight Storage Jar — Burning Desire',
        description:
          'A compact storage container with bold Burning Desire artwork. The airtight seal keeps contents fresh and odour contained, and the sturdy build makes it ideal for desks, shelves and travel bags.',
        features: ['Airtight, smell-resistant seal', 'Bold Burning Desire artwork', 'Compact size for desk or bag', 'Easy to open, close and clean'],
      },
      {
        name: 'Airtight Storage Jar — White Tiger',
        description:
          'A compact airtight storage container with bold White Tiger artwork. Keeps contents fresh and odour-contained with a secure seal, ideal for desks, shelves and drawers.',
        features: ['Airtight, smell-resistant seal', 'Bold White Tiger artwork', 'Compact, secure closure', 'Easy to clean'],
      },
      {
        name: 'Airtight Storage Jar — Blue Wolf',
        description:
          'A compact airtight storage container with bold Blue Wolf artwork. Keeps contents fresh and odour-contained with a secure seal, ideal for desks, shelves and drawers.',
        features: ['Airtight, smell-resistant seal', 'Bold Blue Wolf artwork', 'Compact, secure closure', 'Easy to clean'],
      },
      {
        name: 'Airtight Storage Jar — Dog Design',
        description:
          'A compact airtight storage container with a bold illustrated dog design. Keeps contents fresh and odour-contained, ideal for desks, shelves and drawers.',
        features: ['Airtight, smell-resistant seal', 'Bold dog illustration design', 'Compact and secure', 'Easy to clean'],
      },
      {
        name: 'Airtight Storage Jar — Black',
        description:
          'A compact airtight storage container in a clean matte black finish. Keeps contents protected and odour-contained, with a minimal premium look that works on any desk or shelf.',
        features: ['Airtight, smell-resistant seal', 'Matte black finish', 'Compact and secure', 'Easy to clean'],
      },
    ],
  },
]

// Real product photography sourced from the original Stash Pro storefront (Shopify CDN).
// Keyed by exact product name so the gallery can render the correct image per product.
export const STASH_IMAGES: Record<string, string> = {
  'Ez Flame Lighter':
    '/products/ez2_3db9fcc5-b560-46df-a2ef-c8b775ac01f8.webp',
  'Carlos Windproof Lighter':
    '/products/L_IFGBTTRETRTRASGFDAJHFBASDA-copy-2_0003s_0004_Layer-112.png',
  'Osaka Refillable Lighter':
    '/products/L_IFGBTTRETRTRASGFDAJHFBASDA-copy-2_0001s_0004_Layer-122.png',
  'Flex-E Flexible Lighter':
    '/products/y2.png',
  'Fold-E Foldable Lighter':
    '/products/P3.png',
  'Jetty Windproof Lighter':
    '/products/lighter_0012s_0000_Layer-94.png',
  'Premium Refillable Lighter':
    '/products/p9.png',
  'Flippy Jet Flame Lighter':
    '/products/lighter_0001s_0003_1_FLIPPY.png',
  'UFO Herb Grinder':
    '/products/ufo3.1_9aabdd90-e595-4d4e-ab4d-08a9a7de299a.png',
  'Glow in the Dark Grinder — Large':
    '/products/dark3_66880328-b4de-402c-a476-c2e1abbab2f6.png',
  'Large Neon Grinder':
    '/products/neonl1.png',
  'Medium Neon Grinder':
    '/products/neonm2.1.png',
  'Medium Spotty Grinder':
    '/products/spotty3.2_613fbd33-7e4a-4d40-8ffb-2124a48c9979.png',
  'Biodegradable Grinder':
    '/products/bio2.png',
  'Silicone Grinder — Large':
    '/products/dwag3.png',
  'Zinc Herb Grinder — Small': '/products/grinder-au.png',
  'Pink Grinder':
    '/products/pink1.png',
  'Aluminium Ashtray':
    '/products/ASHTRAY_GUIDELINES.png1.png',
  'Cigar Ashtray':
    '/products/cigarashtray3.png',
  'Frosted Glass Ashtray':
    '/products/FROSTED3.2.png',
  'Square Glass Ashtray':
    '/products/9_1_d150f7aa-d868-4aca-b420-9a0e6bd1bb40.png',
  'Pocket Ashtray':
    '/products/2_7.png',
  'Glass Ashtray':
    '/products/4.1.png',
  'Metal Ashtray':
    '/products/rn-image_picker_lib_temp_4cd48db9-5ee5-4ada-9d1f-d76e069cd94c.png',
  'Oval Metal Tray':
    '/products/rn-image_picker_lib_temp_a3d21664-6bdc-4609-9c62-9c7f50b934f5.png',
  'Small Rolling Tray':
    '/products/S5.png',
  'Medium Rolling Tray — Thailand':
    '/products/thai_0.75x_1.png',
  'Medium Rolling Tray — Classic':
    '/products/MEDIUMTRAY4.png',
  'Medium Rolling Tray — Green':
    '/products/MEDIUMTRAY1.png',
  'Premium Rolling Tray — Bold Edition':
    '/products/cartel.png',
  'Wooden Rolling Tray':
    '/products/WOODS3_0.75x.png',
  'Toughened Glass Crushing Plate':
    '/products/80.png',
  'Brown Rolling Papers':
    '/products/greenRP-01.png',
  'White Rolling Papers':
    '/products/RPwhite-01.png',
  'Burning Desire Pink Rolling Papers':
    '/products/Pink_RP-01.png',
  'Ripper Tipper White — Papers with Filter Tips':
    '/products/RegularRTWhite-01.png',
  'Burning Desire Ripper Tipper Pink — Papers with Filter Tips':
    '/products/rippertipperbd5.png',
  'Super Slim Ripper Tipper Brown':
    '/products/SSRIPPERTIPPPERg6.png',
  'White Filter Tip Booklet':
    '/products/roach-3.png',
  'Brown Pre-Rolled Cones — Pack of 5':
    '/products/56CONEPACKOF5-01.png',
  'Brown Pre-Rolled Cones — Pack of 6':
    '/products/17.png',
  'Brown Pre-Rolled Cones — King Size Pack of 6':
    '/products/cone_1.3.png',
  'Party Brown Pre-Rolled Cones — House Party Edition':
    '/products/partycones.png',
  'White Pre-Rolled Cones — Pack of 6':
    '/products/whitecone1.3.png',
  'Pink Pre-Rolled Cones — Burning Desire':
    '/products/pinkcone1_24b23916-8046-4836-a591-e9bbfde172c0.png',
  'Sheesha HR 08 Pink':
    '/products/2_46092c06-8281-4460-a2bf-32a58fe35cfc.png',
  'Sheesha S6 Gold White':
    '/products/1_9e502a98-4a71-414a-9f72-63fedc13f92b.png',
  'Sheesha HR 11 Blue':
    '/products/hr11blue3.png',
  'Sheesha HR 05 Magenta':
    '/products/hr05r2.png',
  'Sheesha HR 09 Portable Red':
    '/products/1_3_2f2f080f-b219-42d5-880e-aafd32bc0973.png',
  'Sheesha S1 Clear':
    '/products/1_004e0827-c362-43c6-93d3-4a0b07623843.png',
  'Coconut Coal — 30 Cubes':
    '/products/3_d7f5c1f7-4286-4892-940d-bb7ee538fc85.png',
  'Airtight Storage Jar — Burning Desire':
    '/products/burningdisirestorragezar-01.png',
  'Airtight Storage Jar — White Tiger':
    '/products/STORREGE_BOX_B3-01-02.png',
  'Airtight Storage Jar — Blue Wolf':
    '/products/STORREGE_BOX_B3-01-03.png',
  'Airtight Storage Jar — Dog Design':
    '/products/Storagezar02-01.png',
  'Airtight Storage Jar — Black':
    '/products/Storagezar01-01.png',
}
