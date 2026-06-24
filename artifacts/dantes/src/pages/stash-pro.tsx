import { useState, useRef, useEffect } from "react";

interface Product {
  title: string;
  desc: string;
  bullets: string[];
  img: string;
  handle: string;
}

const CATALOG: Record<string, Product[]> = {
  "Lighters": [
    { title: "Ez Flame Lighter", desc: "A refillable utility lighter built for candles, kitchens, and everyday lighting. Top up the butane and reuse it again and again — reliable ignition, a comfortable grip, and a steady, adjustable flame make it a handy pick to keep around the house.", bullets: ["Refillable — top up with butane and reuse", "Reliable, easy ignition", "Adjustable flame and comfortable grip", "Available in 5 colourways"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/ez2_3db9fcc5-b560-46df-a2ef-c8b775ac01f8.webp?v=1782113366", handle: "stash-pro-ez-flame-lighter" },
    { title: "Carlos Windproof Lighter", desc: "A windproof flip-top lighter built for outdoor use. The solid metal body and reliable jet flame hold up in wind without flickering, making it a dependable companion for any setting.", bullets: ["Windproof jet flame", "Flip-top metal body", "Reliable outdoor ignition", "Refillable"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/L_IFGBTTRETRTRASGFDAJHFBASDA-copy-2_0003s_0004_Layer-112.png?v=1763459740", handle: "carlos-windproof-lighter" },
    { title: "Osaka Refillable Lighter", desc: "A compact lighter designed for everyday ignition, easy carry and repeated use. Its refillable format makes it practical for users who want a reusable lighter that fits comfortably into pockets, drawers, pouches and daily setups.", bullets: ["Refillable format", "Compact, pocket-friendly size", "Everyday reliable ignition", "Easy to carry"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/L_IFGBTTRETRTRASGFDAJHFBASDA-copy-2_0001s_0004_Layer-122.png?v=1763726435", handle: "refillable-osaka-lighter" },
    { title: "Flex-E Flexible Lighter", desc: "A flexible-neck utility lighter with a long reach, designed for candles, fireplaces and hard-to-reach spots. The bendable neck keeps your hand clear of the flame while delivering reliable ignition every time.", bullets: ["Flexible neck for hard-to-reach spots", "Long reach design", "Reliable ignition", "Refillable"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/y2.png?v=1760688113", handle: "flex-e" },
    { title: "Fold-E Foldable Lighter", desc: "A foldable lighter that collapses flat for ultra-compact storage. Open it up and you have a full-sized flame — fold it back and it disappears into any pocket or pouch.", bullets: ["Folds flat for compact storage", "Full-sized flame when open", "Pocket and pouch friendly", "Refillable"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/P3.png?v=1763455938", handle: "pocket-friendly-foldable-lighter" },
    { title: "Jetty Windproof Lighter", desc: "A compact windproof jet flame lighter built for outdoor reliability. The focused jet flame resists wind effectively, delivering consistent ignition wherever you are.", bullets: ["Windproof jet flame", "Compact metal body", "Consistent outdoor ignition", "Refillable"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/lighter_0012s_0000_Layer-94.png?v=1763462082", handle: "windproof-flame-lighter" },
    { title: "Premium Refillable Lighter", desc: "A premium refillable lighter with a polished metal body and smooth ignition. Designed for users who want a dependable everyday lighter with a refined look and feel.", bullets: ["Premium polished metal body", "Smooth, reliable ignition", "Refillable for repeated use", "Adjustable flame"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/p9.png?v=1763446767", handle: "premium-cigarette-lighter" },
    { title: "Flippy Jet Flame Lighter", desc: "A compact jet flame lighter with a satisfying flip-top action. The focused flame is windproof and delivers precise ignition, while the sleek form factor fits naturally in hand or pocket.", bullets: ["Jet flame — windproof and precise", "Satisfying flip-top action", "Compact, ergonomic form", "Refillable"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/lighter_0001s_0003_1_FLIPPY.png?v=1763460553", handle: "flippy-series-lighters" },
  ],
  "Grinders": [
    { title: "UFO Herb Grinder", desc: "A premium 4-part metal grinder with a distinctive domed UFO profile and a smooth, weighty feel. Precision teeth deliver an effortless grind, with a fine mesh screen and catcher chamber for collecting the fines.", bullets: ["Premium 4-part metal build", "Distinctive domed UFO design", "Fine mesh screen with catcher chamber", "Available in 2 finishes"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/ufo3.1_9aabdd90-e595-4d4e-ab4d-08a9a7de299a.png?v=1781324407", handle: "stash-pro-ufo-herb-grinder" },
    { title: "Glow in the Dark Grinder — Large", desc: "A full-size 4-part metal grinder with a glow-in-the-dark finish that charges under light and shines in the dark. Sharp teeth grind evenly, with a mesh screen and deep catcher chamber keeping the fines collected.", bullets: ["Large 4-part metal build", "Glow-in-the-dark finish in 4 colours", "Mesh screen with deep catcher chamber", "Magnetic lid"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/dark3_66880328-b4de-402c-a476-c2e1abbab2f6.png?v=1781324407", handle: "stash-pro-glow-in-the-dark-grinder-large" },
    { title: "Large Neon Grinder", desc: "A full-size 4-part metal grinder with a bold neon finish. Sharp teeth deliver an even grind, with a mesh screen and deep catcher chamber keeping the fines collected.", bullets: ["Large 4-part metal build", "Bold neon finish in 5 colours", "Mesh screen with deep catcher chamber", "Magnetic lid"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/neonl1.png?v=1762937003", handle: "stash-pro-large-neon-grinder" },
    { title: "Medium Neon Grinder", desc: "A compact 4-part metal grinder with a bold neon finish. Sharp teeth deliver an even grind, with a mesh screen and catcher chamber keeping the fines collected.", bullets: ["Medium 4-part metal build", "Bold neon finish in 5 colours", "Mesh screen with catcher chamber", "Magnetic lid"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/neonm2.1.png?v=1762936244", handle: "stash-pro-medium-neon-grinder" },
    { title: "Medium Spotty Grinder", desc: "A compact 4-part metal grinder with a playful spotted finish. Sharp diamond teeth deliver a smooth, even grind, while the mesh screen and catcher chamber keep the fines collected. A magnetic lid keeps everything secure.", bullets: ["Medium 4-part metal build", "Spotted finish in 4 colours", "Mesh screen with catcher chamber", "Magnetic lid"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/spotty3.2_613fbd33-7e4a-4d40-8ffb-2124a48c9979.png?v=1781324407", handle: "stash-pro-medium-spotty-grinder" },
    { title: "Biodegradable Grinder", desc: "A lightweight 2-part grinder made from biodegradable plastic. At under 55 grams it is easy to carry anywhere, with a smooth grinding action and a premium feel that belies its eco-friendly build.", bullets: ["Made from biodegradable plastic", "Lightweight 2-part design, under 55g", "Smooth, consistent grind", "Available in 3 colours"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/bio2.png?v=1762938115", handle: "stash-pro-biodegradable-grinder" },
    { title: "Silicone Grinder — Large", desc: "A 4-piece herb grinder with a flexible silicone exterior and a precision-cut metal grinding core. Built to handle daily use without the chipping or denting common to all-metal grinders.", bullets: ["4-piece construction with kief catcher and pollen screen", "Sharp diamond-cut teeth", "Flexible silicone exterior", "Available in 3 colourway designs"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/dwag3.png?v=1762937352", handle: "stash-pro-silicone-grinder-large" },
    { title: "Zinc Herb Grinder — Small", desc: "A compact 3-layer zinc alloy grinder from the country series, finished in national flag colours. Sharp teeth grind evenly, the mesh screen and catcher chamber collect the fines, and the magnetic lid keeps it secure in your pocket.", bullets: ["Compact 3-layer zinc alloy build", "Country series flag designs", "Mesh screen with catcher chamber and scraper", "Magnetic lid, pocket-friendly"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/fs1.png?v=1762948629", handle: "stash-pro-zinc-herb-grinder-small" },
    { title: "Pink Grinder", desc: "A full-size 4-part metal grinder in a bold pink finish. Sharp teeth deliver an even grind, with a mesh screen and deep catcher chamber keeping the fines collected. A magnetic lid keeps everything secure.", bullets: ["4-part metal build", "Bold pink finish", "Mesh screen with deep catcher chamber", "Magnetic lid"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/pink1.png?v=1762934376", handle: "pink-medium-grinder-large" },
  ],
  "Ashtrays": [
    { title: "Aluminium Ashtray", desc: "A heavy-duty round metal ashtray built for everyday use. The solid aluminium body resists heat and tipping, and the smooth finish wipes clean in seconds.", bullets: ["Heavy-duty solid aluminium build", "Weighted base resists tipping", "Heat-resistant, easy-clean finish", "Available in 2 colours"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/ASHTRAY_GUIDELINES.png1.png?v=1763637094", handle: "stash-pro-aluminium-ashtray" },
    { title: "Cigar Ashtray", desc: "A large-format ashtray with deep rests, built for longer sessions. The weighted body sits rock-solid on tables and bar tops, with a wide bowl that keeps ash contained and wipes clean easily.", bullets: ["Deep rests designed for cigars", "Weighted, stable large-format body", "Wide, easy-clean bowl", "Available in 2 finishes"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/cigarashtray3.png?v=1767009444", handle: "stash-pro-cigar-ashtray" },
    { title: "Frosted Glass Ashtray", desc: "A compact tabletop ashtray with a soft frosted finish that adds a clean, premium look to any setup. The sturdy glass body sits firmly on desks, balconies and side tables, and wipes clean in seconds.", bullets: ["Frosted glass finish with a smooth matte feel", "Sturdy, weighted base for everyday tabletop use", "Easy to rinse and wipe clean", "Available in 3 colours"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/FROSTED3.2.png?v=1762846357", handle: "stash-pro-frosted-glass-ashtray" },
    { title: "Square Glass Ashtray", desc: "A sturdy square-format tabletop ashtray with a bold printed base. The thick glass build gives it a solid, weighted feel, while the flat square profile makes it easy to place on desks, trays and side tables.", bullets: ["Square tempered-style glass body with printed base", "Weighted, stable design for everyday use", "Easy to wipe clean", "Available in 3 designs"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/9_1_d150f7aa-d868-4aca-b420-9a0e6bd1bb40.png?v=1759144467", handle: "stash-pro-square-glass-ashtray" },
    { title: "Pocket Ashtray", desc: "A compact, portable ashtray that fits in your pocket or bag. The flame-resistant lining lets you stub out and store ash and butts on the go — no litter, no smell leaking out, no looking for a bin.", bullets: ["Pocket-sized and lightweight", "Flame-resistant inner lining", "Snap-shut closure keeps ash and odour contained", "Available in 3 designs"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/2_7.png?v=1750148709", handle: "stash-pro-pocket-ashtray" },
    { title: "Glass Ashtray", desc: "A compact tabletop ashtray designed for everyday use, easy placement and simple cleaning. Its sturdy glass body gives it a solid feel, while the smooth printed base adds a clear design-led look to your setup.", bullets: ["Compact glass ashtray for desks and side tables", "Sturdy glass body with printed base", "Easy to wipe clean", "Available in 10 design variants"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/4.1.png?v=1762844869", handle: "stash-pro-glass-ashtray" },
    { title: "Metal Ashtray", desc: "A compact, lightweight tabletop ashtray designed for everyday use, easy placement and simple cleaning. Its metal body gives it a sturdy feel, while the smooth finish makes it easy to wipe down after regular use.", bullets: ["Compact metal ashtray for desks and balconies", "Lightweight, sturdy body with smooth finish", "Easy to clean and store", "Available in 8 colour variants"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/rn-image_picker_lib_temp_4cd48db9-5ee5-4ada-9d1f-d76e069cd94c.png?v=1759830860", handle: "stash-pro-metal-ashtray" },
  ],
  "Rolling Trays": [
    { title: "Oval Metal Tray", desc: "A compact oval-shaped metal tray with a smooth metallic finish and raised edges that keep your essentials contained. Lightweight and easy to wipe clean, it is the perfect size for desk or travel use.", bullets: ["Compact oval metal tray", "Metallic finish in 4 colours", "Raised edges, easy-clean surface", "Ideal for desk or travel"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/rn-image_picker_lib_temp_a3d21664-6bdc-4609-9c62-9c7f50b934f5.png?v=1781324553", handle: "stash-pro-oval-metal-tray" },
    { title: "Small Rolling Tray", desc: "A compact metal tray designed for clean, mess-free rolling on the go. Made from lightweight, durable metal with a smooth printed surface and rounded edges that keep your herbs, papers and filter tips contained while you roll.", bullets: ["Compact size, easy to slip into a bag or drawer", "Lightweight metal construction with smooth printed finish", "Rounded edges to keep contents from spilling", "Wipe-clean surface", "Available in 6 designs"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/S5.png?v=1762849323", handle: "stash-pro-rolling-tray-small" },
    { title: "Medium Rolling Tray — Thailand", desc: "A mid-size metal tray finished in Thailand flag colours. Raised edges keep your essentials contained, and the smooth surface wipes clean in seconds.", bullets: ["Mid-size metal tray", "Thailand flag design", "Raised edges, easy-clean surface", "Ideal for desk or session use"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/thai_0.75x_1.png?v=1762864854", handle: "stash-pro-medium-rolling-tray-thailand" },
    { title: "Medium Rolling Tray — Classic", desc: "A mid-size metal tray with a clean, timeless design. Raised edges keep your essentials contained while you work, and the smooth surface wipes clean in seconds.", bullets: ["Mid-size metal tray", "Clean classic design", "Raised edges, easy-clean surface", "Ideal for desk or session use"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/MEDIUMTRAY4.png?v=1762847785", handle: "stash-pro-medium-rolling-tray-classic" },
    { title: "Medium Rolling Tray — Green", desc: "A mid-size metal tray with a bold solid green finish. Raised edges keep your essentials contained, and the smooth surface wipes clean in seconds.", bullets: ["Mid-size metal tray", "Bold green finish", "Raised edges, easy-clean surface"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/MEDIUMTRAY1.png?v=1762847682", handle: "stash-pro-medium-rolling-tray-green" },
    { title: "Premium Rolling Tray — Bold Edition", desc: "Designed for users who want a larger, more statement-driven tray for everyday organisation. The sturdy surface gives you room to keep small essentials in place, while the raised edges help reduce mess during use.", bullets: ["Large statement-driven format", "Sturdy surface with raised edges", "Bold printed design", "Wipe-clean finish"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/cartel.png?v=1767165615", handle: "premium-rolling-tray-bold-edition" },
    { title: "Wooden Rolling Tray", desc: "A natural wood rolling tray with a warm finish and smooth surface. Raised edges keep your essentials in place, and the wood build gives it a premium, tactile feel that stands apart from standard metal trays.", bullets: ["Natural wood construction", "Smooth surface with raised edges", "Premium tactile feel", "Easy to wipe clean"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/wdt3.png?v=1762849099", handle: "stash-pro-wooden-rolling-tray" },
    { title: "Toughened Glass Crushing Plate", desc: "A toughened glass crushing plate designed for clean, precise preparation on a flat, non-stick surface. The smooth glass is easy to scrape and wipe clean, with a sturdy build that resists everyday wear.", bullets: ["Toughened glass surface", "Non-stick, easy to scrape clean", "Sturdy build for daily use", "Available in 2 finishes"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/80.png?v=1763719719", handle: "stash-pro-crushing-plate-toughened-glass-white" },
  ],
  "Rolling Papers & Tips": [
    { title: "Brown Rolling Papers", desc: "Classic unbleached brown rolling papers crafted for a natural smoking experience. The slow, even burn and natural gum seal deliver a consistent roll every session.", bullets: ["Unbleached brown paper", "Natural acacia gum seal", "Slow, even burn", "Classic king-size format"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/greenRP-01.png?v=1744026022", handle: "brown-rolling-papers" },
    { title: "White Rolling Papers", desc: "Clean, classic white rolling papers made for everyday use. Designed in a compact 32-paper pack, these papers are crafted with natural acacia gum for easy sealing and a smooth rolling experience.", bullets: ["Natural acacia gum seal", "32-paper pack", "Smooth, easy-to-roll format", "Clean white finish"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/RPwhite-01.png?v=1744026104", handle: "stash-pro-white-rolling-paper" },
    { title: "Burning Desire Pink Rolling Papers", desc: "Bold pink rolling papers designed for users who want a distinctive, compact and easy-to-carry booklet. The pink Burning Desire design gives the pack a strong visual identity while keeping everyday preparation simple.", bullets: ["Bold Burning Desire pink design", "Compact and easy to carry", "Smooth, consistent roll", "Natural gum seal"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/Pink_RP-01.png?v=1744020171", handle: "burning-desire-pink-rolling-paper" },
    { title: "Ripper Tipper White — Papers with Filter Tips", desc: "A compact rolling paper booklet that brings papers and filter tips together in one easy-to-carry format. Includes white rolling papers and perforated filter tips for convenient everyday preparation.", bullets: ["Papers and tips in one booklet", "Perforated filter tips included", "Compact, pocket-friendly format", "Natural gum seal"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/RegularRTWhite-01.png?v=1744108769", handle: "ripper-tipper-white" },
    { title: "Burning Desire Ripper Tipper Pink — Papers with Filter Tips", desc: "A compact rolling paper booklet that brings rolling papers and filter tips together in one easy-to-carry format. The pink Burning Desire design gives the pack a bold visual identity while keeping everyday preparation simple.", bullets: ["Papers and tips in one booklet", "Bold pink Burning Desire design", "Perforated filter tips included", "Compact format"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/rippertipperbd5.png?v=1767594630", handle: "burning-desire-ripper-tipper-pink" },
    { title: "Super Slim Ripper Tipper Brown", desc: "A compact super slim rolling paper booklet for users who prefer a cleaner, slimmer format. It brings rolling papers and filter tips together in one easy-to-carry pack for everyday convenience.", bullets: ["Super slim paper format", "Papers and tips together", "Compact, easy carry", "Natural brown finish"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/SSRIPPERTIPPPERg6.png?v=1767596352", handle: "super-slim-ripper-tipper-brown" },
    { title: "White Filter Tip Booklet", desc: "A compact pack of perforated filter tips designed for clean, organised everyday use. The booklet format keeps tips protected, easy to access and simple to carry in pockets, drawers, trays or travel-friendly setups.", bullets: ["Perforated filter tips", "Booklet format — easy access", "Compact and pocket-friendly", "Clean white finish"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/roach-3.png?v=1767468421", handle: "stash-pro-white-roach-book" },
  ],
  "Pre-Rolled Cones": [
    { title: "Brown Pre-Rolled Cones — Pack of 5", desc: "No Roll, No Problem. A shortcut to a perfect roll, every time. These empty pre-rolled brown paper cones are ideal for quick setups and consistent results. Just fill, pack, and you are ready.", bullets: ["Pack of 5 pre-rolled cones", "Made from unbleached brown rolling paper", "Ready-to-fill — no rolling skills needed", "Consistent shape every time"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/56CONEPACKOF5-01.png?v=1742902044", handle: "brown-pre-rolled-cones-5-pack" },
    { title: "Brown Pre-Rolled Cones — Pack of 6", desc: "A ready-to-fill pack of 6 unbleached brown cones for quick, consistent preparation. Just fill, pack and you are set — no rolling required.", bullets: ["Pack of 6 pre-rolled cones", "Unbleached brown paper", "Ready-to-fill format", "Consistent shape"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/17.png?v=1763622907", handle: "brown-6-cones-84-mm" },
    { title: "Brown Pre-Rolled Cones — King Size Pack of 6", desc: "King size ready-to-fill cones in unbleached brown paper. Larger format for those who prefer a more generous fill — same clean, consistent shape every time.", bullets: ["King size format", "Pack of 6", "Unbleached brown paper", "Ready-to-fill"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/coneKS.png?v=1762857002", handle: "pre-rolled-cones-brown-king-size-pack-of-6" },
    { title: "Party Brown Pre-Rolled Cones — House Party Edition", desc: "A ready-to-fill cone bundle made for get-togethers. Each cone is rolled from unbleached brown paper with a built-in tip, so there is no rolling, no mess and no waiting — just fill, twist and you are set.", bullets: ["Ready-to-fill unbleached brown cones with built-in tips", "House party pack size", "Even, consistent build", "No rolling skills needed"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/partycones.png?v=1762857029", handle: "pre-rolled-cones-brown" },
    { title: "White Pre-Rolled Cones — Pack of 6", desc: "Ready-to-fill king size cones in white paper designed for clean, quick and consistent everyday use. The white paper format gives the pack a simple, classic look while keeping prep easy.", bullets: ["Pack of 6", "White paper format", "King size", "Ready-to-fill"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/whitecone1.3.png?v=1762857102", handle: "pre-rolled-cones-white" },
    { title: "Pink Pre-Rolled Cones — Burning Desire", desc: "Ready-to-fill pink cones from the Burning Desire collection. Same easy, no-roll format — just fill, pack and twist. The bold pink colour makes them stand out from the standard.", bullets: ["Burning Desire pink format", "Ready-to-fill design", "No rolling required", "Bold visual appeal"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/pinkcone.png?v=1762857084", handle: "stash-pro-pink-pre-rolled-cones" },
  ],
  "Sheesha & Hookah": [
    { title: "Sheesha HR 08 Pink", desc: "A stylish sheesha from the HR series, designed for smooth personal sessions at home. Stable base, clean draw and an easy-disassembly build for quick cleaning.", bullets: ["HR series design in Pink", "Stable, balanced base", "Smooth, consistent draw", "Easy to assemble and clean"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/2_46092c06-8281-4460-a2bf-32a58fe35cfc.png?v=1762500790", handle: "stash-pro-sheesha-12" },
    { title: "Sheesha S6 Gold White", desc: "A compact glass sheesha with an elegant two-tone finish, designed for smooth personal sessions at home. Stable weighted base, clean draw and easy-disassembly build.", bullets: ["Elegant gold and white finish", "Stable, weighted base", "Smooth, consistent draw", "Easy to assemble and clean"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/1_9e502a98-4a71-414a-9f72-63fedc13f92b.png?v=1762770026", handle: "stash-pro-sheesha-31" },
    { title: "Sheesha HR 11 Blue", desc: "A stylish sheesha from the HR series, designed for smooth personal sessions at home. Stable base, clean draw and an easy-disassembly build for quick cleaning.", bullets: ["HR series design in Blue", "Stable, balanced base", "Smooth, consistent draw", "Easy to assemble and clean"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/hr11blue3.png?v=1762763226", handle: "stash-pro-sheesha-28" },
    { title: "Sheesha HR 05 Magenta", desc: "A stylish sheesha from the HR series, designed for smooth personal sessions at home. Stable base, clean draw and an easy-disassembly build for quick cleaning.", bullets: ["HR series design in Magenta", "Stable, balanced base", "Smooth, consistent draw", "Easy to assemble and clean"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/hr05r2.png?v=1762767114", handle: "stash-pro-sheesha-32" },
    { title: "Sheesha HR 09 Portable Red", desc: "A compact travel-ready sheesha from the HR series. Small enough to pack and carry, with a stable base, clean draw and quick-clean build.", bullets: ["Compact, travel-ready HR design", "Portable Red finish", "Stable base with smooth draw", "Easy to assemble and clean"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/1_3_2f2f080f-b219-42d5-880e-aafd32bc0973.png?v=1762762085", handle: "stash-pro-sheesha-26" },
    { title: "Sheesha S1 Clear", desc: "A minimal clear glass sheesha designed for clean everyday sessions. The transparent body lets you see the draw in action, while the stable weighted base and easy-clean build keep maintenance simple.", bullets: ["Clear glass body", "Stable, weighted base", "Smooth, consistent draw", "Easy to disassemble and clean"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/S1CLEAR2.png?v=1762770380", handle: "stash-pro-sheesha-7" },
    { title: "Coconut Coal — 30 Cubes", desc: "Natural coconut shell charcoal for sheesha sessions. Burns clean and slow with minimal ash, delivering consistent heat without the harsh chemicals found in quick-light coals.", bullets: ["Natural coconut shell charcoal", "30 cube pack", "Clean, slow burn with minimal ash", "No harsh chemicals"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/cc30.png?v=1762863428", handle: "stash-pro-coconut-coal-30-cubes" },
  ],
  "Storage Jars": [
    { title: "Airtight Storage Jar — Burning Desire", desc: "A compact storage container with bold Burning Desire artwork. The airtight seal keeps contents fresh and odour contained, and the sturdy build makes it ideal for desks, shelves and travel bags.", bullets: ["Airtight, smell-resistant seal", "Bold Burning Desire artwork", "Compact size for desk or bag", "Easy to open, close and clean"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/burningdisirestorragezar-01.png?v=1743078930", handle: "airtight-smell-proof-storage-jar-2" },
    { title: "Airtight Storage Jar — White Tiger", desc: "A compact airtight storage container with bold White Tiger artwork. Keeps contents fresh and odour-contained with a secure seal, ideal for desks, shelves and drawers.", bullets: ["Airtight, smell-resistant seal", "Bold White Tiger artwork", "Compact, secure closure", "Easy to clean"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/STORREGE_BOX_B3-01-02.png?v=1742990282", handle: "airtight-smell-proof-storage-jar-white" },
    { title: "Airtight Storage Jar — Blue Wolf", desc: "A compact airtight storage container with bold Blue Wolf artwork. Keeps contents fresh and odour-contained with a secure seal, ideal for desks, shelves and drawers.", bullets: ["Airtight, smell-resistant seal", "Bold Blue Wolf artwork", "Compact, secure closure", "Easy to clean"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/STORREGE_BOX_B3-01-03.png?v=1742990282", handle: "airtight-smell-proof-storage-jar-blue" },
    { title: "Airtight Storage Jar — Dog Design", desc: "A compact airtight storage container with a bold illustrated dog design. Keeps contents fresh and odour-contained, ideal for desks, shelves and drawers.", bullets: ["Airtight, smell-resistant seal", "Bold dog illustration design", "Compact and secure", "Easy to clean"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/Storagezar02-01.png?v=1744914522", handle: "airtight-smell-proof-storage-jar-dog" },
    { title: "Airtight Storage Jar — Black", desc: "A compact airtight storage container in a clean matte black finish. Keeps contents protected and odour-contained, with a minimal premium look that works on any desk or shelf.", bullets: ["Airtight, smell-resistant seal", "Matte black finish", "Compact and secure", "Easy to clean"], img: "https://cdn.shopify.com/s/files/1/0674/4159/0448/files/Storagezar01-01.png?v=1744914552", handle: "airtight-smell-proof-storage-jar" },
  ],
};

const CATEGORY_ICONS: Record<string, string> = {
  "Lighters": "🔥",
  "Grinders": "⚙️",
  "Ashtrays": "🪣",
  "Rolling Trays": "🗂️",
  "Rolling Papers & Tips": "📄",
  "Pre-Rolled Cones": "🎯",
  "Sheesha & Hookah": "💨",
  "Storage Jars": "🫙",
};

const ALL_CATEGORIES = Object.keys(CATALOG);

function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;
    for (let i = 0; i < 60; i++) {
      particles.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.3, vy: -Math.random() * 0.5 - 0.1, size: Math.random() * 2 + 0.5, alpha: Math.random() * 0.5 + 0.1 });
    }
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(52,211,153,${p.alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

function ProductCard({ product }: { product: Product }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="group relative bg-[#0a120a] border border-emerald-900/30 rounded-lg overflow-hidden hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(52,211,153,0.12)]">
      <div className="relative h-56 bg-[#060e06] overflow-hidden">
        {!imgError ? (
          <img
            src={product.img}
            alt={product.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl opacity-30">📦</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a120a] via-transparent to-transparent opacity-60" />
      </div>
      <div className="p-5">
        <h3 className="text-white font-semibold text-sm mb-2 leading-snug group-hover:text-emerald-300 transition-colors">{product.title}</h3>
        <p className="text-emerald-900/80 text-[11px] leading-relaxed mb-4 line-clamp-3" style={{ color: "#5a8a6a" }}>{product.desc}</p>
        {product.bullets.length > 0 && (
          <ul className="space-y-1">
            {product.bullets.slice(0, 4).map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-[10px]" style={{ color: "#3d7a55" }}>
                <span className="text-emerald-500 mt-0.5 shrink-0">◆</span>
                <span>{b.trim()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function StashProPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const displayedCategories = activeCategory === "All"
    ? ALL_CATEGORIES
    : [activeCategory];

  const filteredCatalog: Record<string, Product[]> = {};
  for (const cat of displayedCategories) {
    const products = (CATALOG[cat] || []).filter(p =>
      !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (products.length > 0) filteredCatalog[cat] = products;
  }

  const totalProducts = Object.values(CATALOG).reduce((sum, prods) => sum + prods.length, 0);

  return (
    <div className="min-h-screen" style={{ background: "#040c04", fontFamily: "'Inter', sans-serif" }}>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ minHeight: "520px" }}>
        <HeroParticles />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(52,211,153,0.07) 0%, transparent 70%)" }} />
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-16 bg-emerald-500/30" />
            <span className="text-[9px] font-mono tracking-[0.5em]" style={{ color: "#34d399" }}>OFFICIAL PRODUCT SHOWCASE</span>
            <div className="h-px w-16 bg-emerald-500/30" />
          </div>
          <div className="mb-6">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-sm mb-4" style={{ border: "1px solid rgba(52,211,153,0.3)", background: "rgba(52,211,153,0.05)" }}>
              <span className="text-emerald-400 font-mono font-black text-3xl tracking-widest">STASH</span>
              <div className="w-px h-8" style={{ background: "rgba(52,211,153,0.3)" }} />
              <span className="text-white font-mono font-black text-3xl tracking-widest">PRO</span>
            </div>
            <p className="text-[10px] font-mono tracking-[0.35em]" style={{ color: "#34d399", opacity: 0.6 }}>PREMIUM SMOKING ACCESSORIES</p>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 leading-tight max-w-3xl">
            Crafted for Every<br />
            <span style={{ color: "#34d399" }}>Session.</span>
          </h1>
          <p className="max-w-xl text-base leading-relaxed mb-10" style={{ color: "#4a7a5a" }}>
            From windproof lighters and precision grinders to glass ashtrays, rolling trays, pre-rolled cones, and sheesha essentials — the complete Stash Pro range.
          </p>
          <div className="flex items-center gap-6 text-[10px] font-mono" style={{ color: "#2d5a3d" }}>
            <span><span style={{ color: "#34d399" }}>{totalProducts}+</span> Products</span>
            <span style={{ color: "rgba(52,211,153,0.2)" }}>|</span>
            <span><span style={{ color: "#34d399" }}>{ALL_CATEGORIES.length}</span> Categories</span>
            <span style={{ color: "rgba(52,211,153,0.2)" }}>|</span>
            <span>Premium Quality</span>
          </div>
        </div>
      </div>

      {/* Sticky Nav */}
      <div className="sticky top-0 z-40 border-b" style={{ background: "rgba(4,12,4,0.95)", backdropFilter: "blur(12px)", borderColor: "rgba(52,211,153,0.08)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative max-w-sm">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "#34d399", opacity: 0.5 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs font-mono text-white rounded-sm outline-none focus:ring-1 focus:ring-emerald-500/50"
                style={{ background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.15)", color: "white" }}
              />
            </div>
            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none flex-wrap">
              <button
                onClick={() => setActiveCategory("All")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm font-mono text-[10px] tracking-wider whitespace-nowrap transition-all"
                style={{
                  background: activeCategory === "All" ? "rgba(52,211,153,0.15)" : "transparent",
                  border: `1px solid ${activeCategory === "All" ? "rgba(52,211,153,0.4)" : "rgba(52,211,153,0.1)"}`,
                  color: activeCategory === "All" ? "#34d399" : "#2d5a3d",
                }}
              >
                ALL
              </button>
              {ALL_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm font-mono text-[10px] tracking-wider whitespace-nowrap transition-all"
                  style={{
                    background: activeCategory === cat ? "rgba(52,211,153,0.15)" : "transparent",
                    border: `1px solid ${activeCategory === cat ? "rgba(52,211,153,0.4)" : "rgba(52,211,153,0.1)"}`,
                    color: activeCategory === cat ? "#34d399" : "#2d5a3d",
                  }}
                >
                  <span>{CATEGORY_ICONS[cat] || "◈"}</span>
                  <span>{cat.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        {Object.entries(filteredCatalog).map(([cat, products]) => (
          <section key={cat}>
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1" style={{ background: "rgba(52,211,153,0.08)" }} />
              <div className="flex items-center gap-3">
                <span className="text-2xl">{CATEGORY_ICONS[cat] || "◈"}</span>
                <div>
                  <p className="text-[9px] font-mono tracking-[0.4em]" style={{ color: "rgba(52,211,153,0.4)" }}>STASH PRO</p>
                  <h2 className="text-white font-black text-xl tracking-tight">{cat}</h2>
                </div>
              </div>
              <div className="h-px flex-1" style={{ background: "rgba(52,211,153,0.08)" }} />
              <span className="text-[9px] font-mono" style={{ color: "rgba(52,211,153,0.3)" }}>{products.length} products</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map(product => (
                <ProductCard key={product.handle} product={product} />
              ))}
            </div>
          </section>
        ))}

        {Object.keys(filteredCatalog).length === 0 && (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">🔍</p>
            <p className="font-mono text-sm" style={{ color: "#2d5a3d" }}>No products match "{searchQuery}"</p>
            <button onClick={() => setSearchQuery("")} className="mt-4 text-xs font-mono" style={{ color: "#34d399" }}>Clear search</button>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="border-t" style={{ borderColor: "rgba(52,211,153,0.06)" }}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="rounded-sm p-6" style={{ background: "rgba(52,211,153,0.03)", border: "1px solid rgba(52,211,153,0.08)" }}>
            <p className="text-[9px] font-mono tracking-[0.3em] mb-3" style={{ color: "rgba(52,211,153,0.4)" }}>DISCLAIMER</p>
            <p className="text-[11px] leading-relaxed" style={{ color: "#2d5a3d" }}>
              All Stash Pro products are intended for legal adult use only. Products are designed for tobacco, herbal, and personal lifestyle use in accordance with applicable local laws. Users are responsible for complying with the laws of their jurisdiction. Stash Pro does not promote or endorse illegal activities. Product availability, specifications, and colours may vary. Images are for reference purposes only.
            </p>
          </div>
          <div className="mt-8 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-sm" style={{ border: "1px solid rgba(52,211,153,0.2)", background: "rgba(52,211,153,0.05)" }}>
                <span className="text-emerald-400 font-mono font-black text-sm tracking-widest">STASH</span>
                <span className="text-white font-mono font-black text-sm tracking-widest"> PRO</span>
              </div>
              <span className="text-[9px] font-mono" style={{ color: "#1a3a26" }}>Premium Smoking Accessories</span>
            </div>
            <p className="text-[9px] font-mono" style={{ color: "#1a3a26" }}>
              Showcase presented by <span style={{ color: "rgba(52,211,153,0.4)" }}>Dantès · The Bloom Society</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
