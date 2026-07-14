#!/usr/bin/env node
'use strict';

const { slugify, chartHtml, proTipHtml, mythFactHtml, generateGuideSeries } = require('./guide-blog-shared');

const MORE_GUIDES = [
  { href: '/find', label: 'Find Orchards, Farms, and Garden Centers Near You' },
  { href: '/blog', label: 'All Picking Season Guides' },
];

function relatedFor(currentSlug, fruits) {
  return fruits
    .filter(f => f.storageSlug !== currentSlug)
    .map(f => ({ href: `/blog/${f.storageSlug}`, label: `How to Store Fresh Picked ${f.label}` }));
}

const FRUITS = [
  {
    label: 'Strawberries',
    fruitLower: 'strawberries',
    storageSlug: 'how-to-store-fresh-picked-strawberries',
    image: { file: 'strawberry-picking-kids-baskets.jpg', alt: 'Freshly picked strawberries in baskets' },
    desc: 'Fresh-picked strawberries last 3 to 7 days in the refrigerator when stored unwashed, or up to a year in the freezer — here is exactly how to store, clean, and freeze them for the longest shelf life.',
    chart: [
      { method: 'Countertop', life: 'A few hours only', how: 'Not recommended — strawberries soften and mold fast in warm, open air.' },
      { method: 'Refrigerator', life: '3–7 days', how: 'Unwashed, in a single layer, in a ventilated container lined with a dry paper towel.' },
      { method: 'Freezer', life: '10–12 months', how: 'Washed, hulled, flash-frozen on a tray, then transferred to a sealed bag.' },
    ],
    sections: [
      {
        h2: 'How Long Do Fresh Strawberries Last?',
        html: `          <p>Fresh-picked strawberries last 3 to 7 days in the refrigerator when stored unwashed, and up to a year in the freezer if you take a few extra minutes to prep them properly. At room temperature, though, strawberries are one of the shortest-lived fruits you can bring home — they're built for immediate ripeness, not for sitting on a counter, and a warm kitchen will turn a firm, fragrant berry into a soft, moldy one within a day.</p>
${chartHtml('Strawberries', [
          { method: 'Countertop', life: 'A few hours only', how: 'Not recommended — strawberries soften and mold fast in warm, open air.' },
          { method: 'Refrigerator', life: '3–7 days', how: 'Unwashed, in a single layer, in a ventilated container lined with a dry paper towel.' },
          { method: 'Freezer', life: '10–12 months', how: 'Washed, hulled, flash-frozen on a tray, then transferred to a sealed bag.' },
        ])}`,
      },
      {
        h2: 'Countertop Storage: Why It Doesn\'t Work',
        html: `          <p>Strawberries have thin skins, a high water content, and no protective rind, which means room-temperature air speeds up both moisture loss and mold growth almost immediately. Unlike apples or oranges, there's no real benefit to counter-ripening a strawberry — once picked, it stops developing sugar and only degrades from there. If you plan to eat a batch within a few hours of picking, the counter is fine, but anything you're not eating that day belongs in the refrigerator right away.</p>`,
      },
      {
        h2: 'Refrigerator Storage: The Right Way',
        html: `          <p>The single biggest factor in strawberry shelf life is moisture control. Strawberries mold from the outside in, and any dampness sitting against the skin — from rinsing, from condensation, or from being packed too tightly — gives mold spores exactly what they need to take hold. Store berries unwashed, in a single layer if possible, in a container lined with a dry paper towel that can absorb ambient moisture. The paper towel should be swapped out if it becomes noticeably damp.</p>
          <p>Leave the green caps on until you're ready to eat or use the berries. The cap and stem act as a small seal over the fruit's most vulnerable point, and removing it early exposes that spot to air and bacteria sooner than necessary.</p>
${proTipHtml(' A quick vinegar bath can roughly double fridge life. Mix 1 part white vinegar to 3 parts water, submerge the berries for about 5 minutes, then rinse well and dry completely before storing. The vinegar kills surface mold spores without leaving a noticeable taste once rinsed.')}`,
      },
      {
        h2: 'Freezer Storage for the Long Haul',
        html: `          <p>Freezing is the best option if you've picked more strawberries than you can realistically eat within a week. Wash the berries, hull them (removing the green cap and the small white core underneath), and dry them thoroughly with a towel — any leftover surface water will form ice crystals that make for a mushier thawed berry. Spread the hulled berries in a single layer on a parchment-lined tray and freeze for a few hours until solid, then transfer them to a freezer bag or airtight container. This "flash freeze first" step keeps the berries from clumping into one solid block, so you can pour out just what you need later. Properly frozen strawberries hold their flavor for 10 to 12 months, though texture-wise they're best used in smoothies, baking, or jam rather than eaten fresh, since freezing breaks down the cell walls that give a fresh berry its firm bite.</p>`,
      },
      {
        h2: 'How to Clean Strawberries the Right Way',
        html: `          <p>Rinse strawberries under cool running water right before you plan to eat or use them — not before storing. A quick rinse under the tap is enough for most home use; there's no need to soak them, since strawberries are porous enough that soaking can pull water in through the hull scar and make the fruit noticeably soggier. If you're washing a large batch for a event or for freezing, a gentle swish in a bowl of cool water followed by a spin in a salad spinner works well and gets them dry fast.</p>`,
      },
      {
        h2: 'What to Do With Extra Strawberries Before They Turn',
        html: `          <p>If you've picked more than you can eat within a few days, don't wait for softness to force your hand. Overripe strawberries that are still free of mold work well cooked down into a quick jam or compote, blended into a smoothie base and frozen in portions, or simmered with a little sugar into a syrup for pancakes and cocktails. Slightly bruised berries that you'd hesitate to serve whole are often perfectly fine once cut up and macerated with sugar, which draws out juice and masks minor soft spots. Using up a batch this way before it turns is usually a better outcome than letting good fruit go to waste waiting for a "perfect" moment to eat it fresh.</p>`,
      },
      {
        h2: 'Common Storage Myths',
        html: `${mythFactHtml('Wash strawberries as soon as you bring them home so they\'re ready to grab.', 'Washing introduces moisture that speeds up mold significantly. Store them unwashed and rinse only right before eating.')}
${mythFactHtml('Strawberries keep just as well in a sealed plastic bag as any other container.', 'Sealed bags trap humidity against the fruit. A ventilated container or one lined with a paper towel keeps air moving and moisture in check.')}`,
      },
      {
        h2: 'Why Strawberries Spoil So Quickly',
        html: `          <p>Strawberries have the thinnest skin and highest surface-area-to-volume ratio of almost any fruit sold, which means water moves in and out of them faster than it does with a thicker-skinned fruit like an apple or orange. That same thin skin offers very little defense against mold spores, which are present in the air essentially everywhere and only need a bit of surface moisture and a break in the skin to take hold. Strawberries are also non-climacteric, meaning they don't continue ripening after being picked the way a peach or pear does — whatever sugar and softness they had at the moment of picking is roughly what you get, so there's no "ripening window" working in your favor the way there is with some other fruits. All of this adds up to a fruit that's genuinely built for a short shelf life, which is exactly why moisture control during storage matters so much more with strawberries than with almost anything else in the produce aisle.</p>`,
      },
      {
        h2: 'Signs Your Strawberries Have Gone Bad',
        html: `          <p>Watch for white or gray fuzzy mold, a dull or darkened color, a mushy or leaking texture, and any sour, fermented smell. Because mold spreads quickly through a container of berries, check the whole batch daily and remove any questionable berries immediately rather than waiting — a single soft or moldy strawberry left in with the rest will shorten the life of every berry around it. For a full breakdown of exactly what to look for, see our guide on <a href="/blog/how-to-tell-if-strawberries-are-bad">how to tell if strawberries are bad</a>.</p>`,
      },
    ],
    faqs: [
      { q: 'How long do fresh strawberries last in the fridge?', a: 'Unwashed strawberries stored in a ventilated container typically last 3 to 7 days in the refrigerator, depending on how ripe they were when picked.' },
      { q: 'Should you wash strawberries before refrigerating them?', a: 'No. Washing before storing introduces moisture that speeds up mold growth. Rinse strawberries only right before you plan to eat or use them.' },
      { q: 'Can you freeze fresh strawberries?', a: 'Yes. Wash, hull, and dry the berries, flash-freeze them in a single layer on a tray, then transfer to a sealed bag. Frozen strawberries keep for 10 to 12 months.' },
      { q: 'Do strawberries ripen after picking?', a: 'No. Strawberries stop developing sugar once picked, unlike fruits such as peaches or pears, so there\'s no benefit to leaving them on the counter to ripen further.' },
    ],
  },
  {
    label: 'Apples',
    fruitLower: 'apples',
    storageSlug: 'how-to-store-fresh-picked-apples',
    image: { file: 'apple-orchard-harvest-crate.jpg', alt: 'A crate of freshly harvested apples' },
    desc: 'Fresh-picked apples last about a week at room temperature but 4 to 6 weeks in the refrigerator crisper drawer — here is how to store them properly and why apples need to be kept away from other produce.',
    sections: [
      {
        h2: 'How Long Do Fresh Apples Last?',
        html: `          <p>Fresh-picked apples last about a week at room temperature, but 4 to 6 weeks in the refrigerator crisper drawer, making them one of the longest-lasting fresh fruits when stored cold. Commercial cold storage facilities can keep apples edible for close to a year at near-freezing temperatures with controlled humidity, which is part of why grocery store apples are often months old by the time you buy them — a genuine advantage of picking your own is starting that clock much later.</p>
${chartHtml('Apples', [
          { method: 'Countertop', life: '5–7 days', how: 'Kept cool and out of direct sun; ripens and softens quickly at room temperature.' },
          { method: 'Refrigerator', life: '4–6 weeks', how: 'In the crisper drawer inside a perforated plastic bag to manage humidity.' },
          { method: 'Freezer (sliced)', life: '8–12 months', how: 'Peeled, sliced, and tossed in lemon juice before freezing; best for cooking, not eating fresh.' },
        ])}`,
      },
      {
        h2: 'Countertop Storage',
        html: `          <p>A week on the counter is fine for apples you plan to eat soon, but apples are climacteric fruit, meaning they continue to ripen and release ethylene gas after picking. At room temperature that ripening happens roughly ten times faster than in the refrigerator, which is why a firm, crisp apple can turn soft and mealy within a matter of days if left out. Keep countertop apples out of direct sunlight and away from a heat source like the stove.</p>`,
      },
      {
        h2: 'Refrigerator Storage: The Right Way',
        html: `          <p>Cold storage is what makes apples special among fruits — the crisper drawer of a home refrigerator, set as close to 32–35°F as your fridge allows, dramatically slows both ripening and moisture loss. Store apples in a perforated plastic bag or the crisper drawer itself, which is designed to hold in humidity while still allowing some air exchange. Too little humidity and apples shrivel; too much trapped moisture and they're more prone to rot, so a loosely closed bag with a few holes strikes the right balance.</p>
${proTipHtml(' Apples are one of the highest ethylene-producing fruits there is. Store them away from other produce, especially leafy vegetables and unripe fruit like avocados or bananas, which will ripen or spoil faster sitting near a bowl of apples than they would otherwise.')}`,
      },
      {
        h2: 'Freezer Storage',
        html: `          <p>Whole apples don't freeze well — the high water content forms ice crystals that rupture cell walls, leaving a mushy, watery texture once thawed that's unpleasant to eat fresh but fine for cooking. If you want to freeze apples, peel and slice them first, then toss the slices in lemon juice or a diluted ascorbic acid solution to prevent browning before freezing on a tray and transferring to a bag. Frozen apple slices are ideal for pies, crisps, and sauce and will keep for 8 to 12 months.</p>`,
      },
      {
        h2: 'How to Clean Apples the Right Way',
        html: `          <p>Wash apples under cool running water right before eating, gently rubbing the skin with your hands or a soft produce brush. The natural waxy coating on apple skin, sometimes supplemented with a thin edible wax at commercial packing houses, is safe to eat, but a quick rinse removes any surface dust or residue. A mix of water with a splash of vinegar can help remove waxy buildup if you prefer to eat the skin bare.</p>`,
      },
      {
        h2: 'Common Storage Myths',
        html: `${mythFactHtml('One bad apple in the bowl won\'t affect the rest.', 'It absolutely will — a rotting apple releases extra ethylene gas and can spread mold spores by direct contact, accelerating spoilage in every apple around it. Remove bad apples immediately.')}
${mythFactHtml('Apples are fine stored loose with other fruits and vegetables.', 'Apples\' high ethylene output speeds up ripening and spoilage in nearby produce, especially leafy greens, herbs, and unripe fruit. Store apples in their own drawer or bag when possible.')}`,
      },
      {
        h2: 'What to Do With Extra Apples Before They Turn',
        html: `          <p>Apples that have gone soft but aren't yet moldy are excellent candidates for cooking rather than fresh eating — applesauce, baked apples, and pie filling all benefit from softer fruit, since the cooking process breaks down texture anyway. A batch of aging apples can be quartered, cored, and simmered with a splash of water and cinnamon into a simple sauce that freezes well for months. Slightly wrinkled apples that still taste fine but look unappealing raw are also good candidates for juicing or for drying into apple chips in a low oven, both of which extend their usefulness well past the point you'd want to eat them out of hand.</p>`,
      },
      {
        h2: 'Why Apples Last So Much Longer Than Other Fruit',
        html: `          <p>Apples owe their unusually long shelf life to a combination of low respiration rate, dense flesh, and a waxy skin that limits moisture loss. Respiration rate refers to how quickly a fruit "burns through" its own stored sugars and consumes oxygen after picking — soft fruits like strawberries and raspberries have very high respiration rates and exhaust themselves within days, while apples respire slowly enough that commercial growers can hold them in controlled-atmosphere cold storage, with reduced oxygen and elevated carbon dioxide, for up to a year without major quality loss. At home, a simple refrigerator can't replicate that level of control, but the same underlying biology is why apples in your crisper drawer will comfortably outlast almost anything else in the produce bin. The tradeoff is that apples are prolific ethylene producers, and that same gas that helps other fruit ripen will accelerate spoilage in the apples themselves if storage temperatures run too warm, which is why the cold, high-humidity environment of a crisper drawer matters so much.</p>`,
      },
      {
        h2: 'Signs Your Apples Have Gone Bad',
        html: `          <p>Look for soft, mealy flesh, brown discoloration when cut, wrinkled skin, visible brown spots, and a fermented or alcoholic smell that signals the sugars have started to break down. A little softness near the stem is normal on an otherwise good apple, but widespread softness or a spongy feel means it's past its prime. See our full guide on <a href="/blog/how-to-tell-if-apples-are-bad">how to tell if apples are bad</a> for a complete breakdown.</p>`,
      },
    ],
    faqs: [
      { q: 'How long do fresh apples last in the fridge?', a: 'Apples typically last 4 to 6 weeks in the refrigerator crisper drawer, far longer than the roughly one week they last at room temperature.' },
      { q: 'Should apples be stored away from other produce?', a: 'Yes. Apples release a significant amount of ethylene gas, which speeds up ripening and spoilage in nearby fruits and vegetables, so it\'s best to store them separately.' },
      { q: 'Can you freeze whole apples?', a: 'Whole apples don\'t freeze well because their high water content causes a mushy texture once thawed. Peeled, sliced apples treated with lemon juice freeze much better and work well for baking.' },
      { q: 'Why do apples last longer than most fruit?', a: 'Apples have a dense structure and low respiration rate compared to softer fruits, plus commercial and home cold storage significantly slows the ripening process, letting them last weeks rather than days.' },
    ],
  },
  {
    label: 'Peaches',
    fruitLower: 'peaches',
    storageSlug: 'how-to-store-fresh-picked-peaches',
    image: { file: 'peach-hand-picking-tree-2.jpg', alt: 'Ripe peaches hanging on a tree branch' },
    desc: 'Fresh peaches need 2 to 4 days at room temperature to finish ripening before refrigeration, and refrigerating them too early causes a mealy texture — here is exactly how and when to store them.',
    sections: [
      {
        h2: 'How Long Do Fresh Peaches Last?',
        html: `          <p>Fresh peaches need 2 to 4 days at room temperature to finish ripening if picked slightly firm, and once ripe they'll keep another 3 to 5 days in the refrigerator, for about a week to ten days total from pick to plate. The timing matters more with peaches than almost any other fruit, because refrigerating a peach before it's ripe causes a specific kind of damage called chill injury that no amount of later ripening can fix.</p>
${chartHtml('Peaches', [
          { method: 'Countertop (unripe)', life: '2–4 days to ripen', how: 'In a paper bag, ideally with an apple or banana to speed ripening via ethylene gas.' },
          { method: 'Refrigerator (ripe)', life: '3–5 days', how: 'Once the peach yields to gentle pressure and smells fragrant, refrigerate to slow further ripening.' },
          { method: 'Freezer', life: '8–12 months', how: 'Peeled, sliced, and tossed in lemon juice before freezing.' },
        ])}`,
      },
      {
        h2: 'Countertop Storage: Ripening First',
        html: `          <p>If your peaches are firm when picked — common with fruit that was harvested slightly early to survive handling — leave them at room temperature in a single layer, or in a paper bag to trap the ethylene gas they naturally release and speed things along. A peach is ripe when it yields gently to pressure near the stem end and gives off a strong, sweet fragrance. Check daily, since the window between "not quite ready" and "overripe" can be surprisingly short in warm weather.</p>`,
      },
      {
        h2: 'Refrigerator Storage: Timing Is Everything',
        html: `          <p>This is the step most people get wrong. Refrigerating an unripe peach doesn't just pause the ripening process — it damages the fruit's cell structure in a way that shows up later as a dry, cottony, mealy texture even after the peach looks ripe on the outside. This is called chill injury, and it's irreversible. Only refrigerate peaches once they're already ripe and you're trying to slow things down for a few extra days before eating.</p>
${proTipHtml(' Store ripening peaches stem-side down on a folded towel rather than stacked in a bowl. This takes pressure off the more delicate shoulder of the fruit near the stem, which bruises easily and is often where rot first sets in.')}`,
      },
      {
        h2: 'Freezer Storage',
        html: `          <p>To freeze peaches, blanch them briefly in boiling water for about 30 seconds to loosen the skins, then peel, pit, and slice. Toss the slices in lemon juice or a light sugar syrup to prevent browning, then freeze on a tray before transferring to a bag. Frozen peaches keep for 8 to 12 months and are excellent in smoothies, cobblers, and baking, though the texture softens considerably compared to fresh.</p>`,
      },
      {
        h2: 'How to Clean Peaches the Right Way',
        html: `          <p>Rinse peaches under cool water right before eating, gently rubbing the skin to remove the fine fuzz if it bothers you — a soft produce brush works well for this. Dry the peaches fully before storing any that you're not eating immediately, since leftover surface moisture speeds up rot, especially around the stem end where mold most often begins.</p>`,
      },
      {
        h2: 'Common Storage Myths',
        html: `${mythFactHtml('Refrigerate peaches right away to keep them fresh longer.', 'Refrigerating an unripe peach causes chill injury — a dry, mealy texture that never resolves, even once the peach appears ripe. Only refrigerate peaches that are already ripe.')}
${mythFactHtml('A peach that\'s hard as a rock will still ripen fine on the counter.', 'Peaches picked too green sometimes never develop full sweetness or softness off the tree. A peach that feels rock-hard and shows no fragrance after several days likely won\'t ripen properly.')}`,
      },
      {
        h2: 'What to Do With Extra Peaches Before They Turn',
        html: `          <p>Peaches that have ripened past the point you want to eat them fresh are ideal for baking — cobbler, crisp, and galette recipes all benefit from very ripe, juicy fruit, and the sugar and heat mask any texture that's gotten a bit soft. Overripe peaches also purée well into a quick sauce for pancakes or ice cream, or can be simmered down with sugar into a peach syrup for cocktails and lemonade. If a peach has a small soft or bruised spot but is otherwise sound, simply cutting that section away and using the rest immediately in a cooked application is a reasonable way to avoid waste.</p>`,
      },
      {
        h2: 'The Science Behind Chill Injury',
        html: `          <p>Peaches are climacteric fruit, meaning they continue ripening after picking through a burst of ethylene production and increased respiration. That process depends on enzymes that work properly only within a certain temperature range. When an unripe peach is exposed to cold temperatures too early, those ripening enzymes are disrupted in a way that doesn't reverse once the fruit warms back up — the result is a peach that may eventually soften on the outside but never develops the juicy, tender flesh of a properly ripened one, and often develops a dry, woolly texture instead. This is why produce guides consistently emphasize ripening peaches at room temperature first: it isn't a matter of preference, it's avoiding a specific, irreversible form of damage. Once a peach has fully ripened through its natural process at room temperature, the cold no longer poses the same risk, and refrigeration simply slows the fruit down without harming its texture.</p>`,
      },
      {
        h2: 'Signs Your Peaches Have Gone Bad',
        html: `          <p>Look for soft, mushy spots, visible mold (often starting at the stem end), leaking juice, noticeably wrinkled skin, and a fermented smell instead of the fresh, sweet fragrance of a ripe peach. See our full guide on <a href="/blog/how-to-tell-if-peaches-are-bad">how to tell if peaches are bad</a> for more detail.</p>`,
      },
    ],
    faqs: [
      { q: 'Should you refrigerate peaches right away?', a: 'No, not unless they\'re already ripe. Refrigerating an unripe peach causes chill injury, a permanent mealy texture. Let peaches ripen at room temperature first.' },
      { q: 'How do you know when a peach is ripe?', a: 'A ripe peach yields gently to pressure near the stem end and gives off a strong, sweet fragrance. If it\'s still firm and has little smell, it needs more time on the counter.' },
      { q: 'How long do ripe peaches last in the fridge?', a: 'Once ripe, peaches typically last 3 to 5 days in the refrigerator before quality starts to decline.' },
      { q: 'Can you freeze fresh peaches?', a: 'Yes. Blanch to loosen the skins, then peel, pit, slice, and toss in lemon juice before freezing. Frozen peaches keep for 8 to 12 months.' },
      { q: 'Can chill injury in peaches be reversed?', a: 'No. Once an unripe peach has been damaged by cold storage, the mealy, cottony texture it develops does not resolve, even after the fruit warms back up and appears ripe.' },
      { q: 'Should peaches be washed before storing?', a: 'Wash peaches right before eating, not before storing. Leftover surface moisture from washing can speed up rot, especially around the stem end.' },
    ],
  },
  {
    label: 'Pears',
    fruitLower: 'pears',
    storageSlug: 'how-to-store-fresh-picked-pears',
    image: { file: 'pear-hand-picking-tree.jpg', alt: 'A hand picking a ripe pear from a tree' },
    desc: 'Pears are almost always picked underripe on purpose, needing 2 to 5 days at room temperature to ripen before they last 2 to 3 weeks in the fridge — here is how to store and ripen them correctly.',
    sections: [
      {
        h2: 'How Long Do Fresh Pears Last?',
        html: `          <p>Pears are almost always picked underripe on purpose, needing 2 to 5 days at room temperature to finish ripening before they'll last another 2 to 3 weeks in the refrigerator. This is unusual among fruit — pears actually ripen better off the tree than on it, since ripening on the branch tends to produce a grainy, mealy texture near the core, so orchards deliberately harvest them hard and let the ripening happen afterward.</p>
${chartHtml('Pears', [
          { method: 'Countertop (unripe)', life: '2–5 days to ripen', how: 'At room temperature; check daily by pressing gently at the stem end.' },
          { method: 'Refrigerator (ripe)', life: '2–3 weeks', how: 'Once ripe, refrigerate to slow further softening; best quality within 3–5 days.' },
          { method: 'Freezer', life: '8–12 months', how: 'Peeled, cored, sliced, and packed in light syrup or juice.' },
        ])}`,
      },
      {
        h2: 'Countertop Storage: The Ripening Window',
        html: `          <p>Leave pears at room temperature, ideally in a single layer or a loosely closed paper bag, and check them daily. The trick to testing pear ripeness is different from most fruit: press gently at the stem end, or "the neck," rather than the middle or bottom. Pears ripen from the inside out and from the top down, so the neck softens first while the body can still feel firm even when the pear is genuinely ready to eat.</p>
${proTipHtml(' Put pears in a paper bag with an apple or banana to speed up ripening. The ethylene gas released by those fruits accelerates the process, often cutting the ripening window by a day or two.')}`,
      },
      {
        h2: 'Refrigerator Storage: The Right Way',
        html: `          <p>Once a pear yields to gentle pressure at the neck, move it to the refrigerator to slow further ripening and preserve peak texture. Refrigerated ripe pears keep for 2 to 3 weeks, though for the best eating experience, plan to use them within the first 3 to 5 days after they reach ripeness — pears continue to soften even in the cold, just more slowly.</p>`,
      },
      {
        h2: 'Freezer Storage',
        html: `          <p>To freeze pears, peel, core, and slice them, then pack the slices in a light sugar syrup or fruit juice to help preserve texture and prevent browning. Freeze in a single layer before transferring to a sealed container. Frozen pears keep for 8 to 12 months and work best in baked goods, sauces, and compotes rather than eaten raw, since the texture softens noticeably after thawing.</p>`,
      },
      {
        h2: 'How to Clean Pears the Right Way',
        html: `          <p>Rinse pears under cool water just before eating. The skin is edible and holds much of the fruit's fiber and nutrients, so a gentle rinse rather than peeling is usually the better choice if you plan to eat it whole. A soft produce brush can help remove any residue near the stem.</p>`,
      },
      {
        h2: 'Common Storage Myths',
        html: `${mythFactHtml('Check pear ripeness by pressing the bottom or middle, like you would with most fruit.', 'Pears ripen from the neck down, and the area near the stem softens first. The body of the pear can stay firm even when the fruit is fully ripe, so pressing the middle gives a false reading.')}
${mythFactHtml('A pear that\'s soft all over is perfectly ripe.', 'A pear that\'s uniformly soft, especially with soft spots away from the neck, has likely gone past ripe into overripe or spoiled territory. Ripe pears give at the neck while the body stays only slightly firm.')}`,
      },
      {
        h2: 'What to Do With Extra Pears Before They Turn',
        html: `          <p>Pears that have ripened further than you'd like for fresh eating work well poached whole in wine or spiced syrup, sliced into a tart or crumble, or roasted alongside meat as a savory-sweet side. A very ripe pear also purées easily into a simple sauce or butter that freezes well, similar to applesauce. If only the core has gone mealy while the rest of the flesh is fine, cutting it out and using the remaining pear in a cooked dish is a practical way to salvage fruit that's past its best for eating out of hand.</p>`,
      },
      {
        h2: 'Why Pears Ripen Backward Compared to Other Fruit',
        html: `          <p>Most tree fruit ripens fastest at the point where it's thickest and holds the most stored sugar, which is usually the middle or bottom of the fruit. Pears are unusual because their core has a much higher concentration of stone cells — the same gritty cells responsible for a pear's characteristic slightly grainy texture — and these cells break down more slowly than the surrounding flesh. If left on the tree to ripen fully, that core tissue often turns mushy and fermented before the rest of the pear is ready, which is why growers pick pears hard and let them finish ripening off the tree, where the process happens more evenly from the neck downward. This is also why the "press test" for pears focuses on the neck rather than the body: that's simply where ripening becomes noticeable first, well before the denser core catches up.</p>`,
      },
      {
        h2: 'Signs Your Pears Have Gone Bad',
        html: `          <p>Watch for soft brown mushy patches, a grainy or mealy texture, visible mold, wrinkled skin, and a fermented smell. Pears can also suffer from internal breakdown, where the flesh turns brown and mushy at the core while the outside still looks fine, so a quick cut-test is worthwhile if a pear feels off despite looking normal. See our full guide on <a href="/blog/how-to-tell-if-pears-are-bad">how to tell if pears are bad</a> for more.</p>`,
      },
    ],
    faqs: [
      { q: 'Do pears ripen after picking?', a: 'Yes, and better than on the tree. Pears are typically harvested underripe on purpose since ripening on the branch tends to produce a grainy texture near the core.' },
      { q: 'How do you know when a pear is ripe?', a: 'Press gently at the stem end, or "neck," of the pear. If it yields slightly to pressure there, the pear is ripe, even if the body still feels a bit firm.' },
      { q: 'How long do ripe pears last in the fridge?', a: 'Ripe pears typically last 2 to 3 weeks in the refrigerator, though the best texture and flavor are within the first 3 to 5 days after they ripen.' },
      { q: 'Can you freeze fresh pears?', a: 'Yes. Peel, core, and slice the pears, then pack them in a light syrup or juice before freezing. They keep for 8 to 12 months and work well in baked dishes.' },
      { q: 'Why does the inside of my pear look brown even though the outside looks fine?', a: 'This is internal breakdown, where the flesh softens and browns from the core outward, sometimes before any external sign appears. It usually results from over-ripening or storage at the wrong temperature, and affected pears should be discarded.' },
      { q: 'Can you speed up pear ripening?', a: 'Yes. Place pears in a loosely closed paper bag, ideally with an apple or banana, to trap the ethylene gas that speeds ripening. Check daily by pressing gently at the neck.' },
    ],
  },
  {
    label: 'Blueberries',
    fruitLower: 'blueberries',
    storageSlug: 'how-to-store-fresh-picked-blueberries',
    image: { file: 'blueberry-basket-harvest.jpg', alt: 'A basket of freshly harvested blueberries' },
    desc: 'Fresh-picked blueberries last 1 to 2 weeks in the refrigerator when stored unwashed, or up to a year in the freezer — here is how to store them and why the white bloom on the skin should be left alone.',
    sections: [
      {
        h2: 'How Long Do Fresh Blueberries Last?',
        html: `          <p>Fresh-picked blueberries last 1 to 2 weeks in the refrigerator when stored unwashed, or up to 10 to 12 months in the freezer, making them one of the more forgiving berries to store — provided you handle them the right way. Left out at room temperature, though, blueberries soften and mold within a day or two, so the fridge is the right home for them almost immediately after picking.</p>
${chartHtml('Blueberries', [
          { method: 'Countertop', life: 'A few hours only', how: 'Not recommended beyond same-day eating; they soften quickly in warm air.' },
          { method: 'Refrigerator', life: '1–2 weeks', how: 'Unwashed, in the original ventilated container or one lined with a paper towel.' },
          { method: 'Freezer', life: '10–12 months', how: 'Washed, dried thoroughly, flash-frozen on a tray, then bagged.' },
        ])}`,
      },
      {
        h2: 'Countertop Storage',
        html: `          <p>Blueberries don't hold up well at room temperature for more than a few hours — the warm air softens their skins and speeds mold growth, especially in humid weather. If you're planning to eat a batch the same day you pick them, the counter is fine, but anything beyond that should go straight into the refrigerator.</p>`,
      },
      {
        h2: 'Refrigerator Storage: The Right Way',
        html: `          <p>Store blueberries unwashed in their original ventilated clamshell container, or transfer them to a container lined with a dry paper towel to absorb ambient moisture. Sort through the batch before storing and remove any soft, split, or moldy berries, since a single bad berry can spread mold spores to the rest of the container surprisingly fast.</p>
${proTipHtml(' The same vinegar-water soak that works for strawberries (1 part vinegar to 3 parts water, soak 5 minutes, then rinse and dry thoroughly) can meaningfully extend blueberry shelf life by killing surface mold spores before they get a chance to spread.')}`,
      },
      {
        h2: 'Freezer Storage',
        html: `          <p>Blueberries freeze exceptionally well compared to most berries. Wash them, dry them completely, then spread them in a single layer on a parchment-lined tray and freeze until solid before transferring to a bag — this keeps the berries loose rather than clumped into a block. Frozen blueberries can go directly into batter or oatmeal without thawing, and they'll keep good flavor and texture for 10 to 12 months.</p>`,
      },
      {
        h2: 'How to Clean Blueberries the Right Way',
        html: `          <p>Rinse blueberries under cool water right before eating, not before storing. You may notice a dusty, pale-gray coating on the skin called the "bloom" — this is a natural, harmless wax the plant produces to protect the fruit from moisture loss and isn't dirt or pesticide residue. Rinsing removes it, which is fine right before eating, but there's no need to scrub it off or worry about it while the berries are in storage.</p>`,
      },
      {
        h2: 'Common Storage Myths',
        html: `${mythFactHtml('The white, dusty coating on blueberries is dirt or chemical residue that needs washing off right away.', 'That coating, called the bloom, is a natural protective wax the fruit produces itself. It\'s harmless, edible, and actually helps protect the berries from moisture loss during storage.')}
${mythFactHtml('Wash blueberries before putting them in the fridge so they\'re ready to eat.', 'Washing before storing adds moisture that speeds up mold. Store them unwashed and rinse only right before eating.')}`,
      },
      {
        h2: 'What to Do With Extra Blueberries Before They Turn',
        html: `          <p>Softer blueberries that are past their prime for snacking fresh are perfect for baking into muffins, pancakes, or a quick compote, where a little extra softness and released juice actually work in the recipe's favor. A batch that's gotten a bit wrinkled can also be simmered with a touch of sugar and lemon into a simple sauce for yogurt or oatmeal, or blended into a smoothie where texture doesn't matter. As with any berry, sort out anything showing mold before cooking with the rest, since heat won't reliably neutralize mold toxins in the way some people assume.</p>`,
      },
      {
        h2: 'What the Bloom Actually Does',
        html: `          <p>The powdery, pale coating on fresh blueberries is a natural wax the fruit produces called epicuticular wax, and it's genuinely functional rather than cosmetic. It creates a hydrophobic surface that helps the berry retain internal moisture and slows water loss through the skin, which is a big part of why intact, unwashed blueberries with their bloom still visible last noticeably longer than berries that have already been rinsed. It also has a mild natural antimicrobial effect, providing a first line of defense against mold before it ever reaches the fruit's flesh. Rinsing removes the bloom along with any surface dust, which is exactly why the right move is to leave it in place during storage and wash the berries only at the point you're ready to eat them — every day the bloom stays intact is a day of extra protection against moisture loss and early spoilage.</p>`,
      },
      {
        h2: 'Signs Your Blueberries Have Gone Bad',
        html: `          <p>Look for shriveled or wrinkled skin, a mushy texture, visible white or gray mold, leaking juice that stains the container, and a sour or fermented smell. See our full guide on <a href="/blog/how-to-tell-if-blueberries-are-bad">how to tell if blueberries are bad</a> for more detail.</p>`,
      },
    ],
    faqs: [
      { q: 'How long do fresh blueberries last in the fridge?', a: 'Unwashed blueberries stored in a ventilated container typically last 1 to 2 weeks in the refrigerator.' },
      { q: 'What is the white coating on blueberries?', a: 'It\'s called the bloom, a natural protective wax the fruit produces itself. It\'s harmless and not a sign of dirt or pesticide residue.' },
      { q: 'Should you wash blueberries before refrigerating?', a: 'No. Washing before storing adds moisture that speeds up mold growth. Rinse blueberries only right before you plan to eat them.' },
      { q: 'Can you freeze fresh blueberries?', a: 'Yes, and they freeze very well. Wash, dry thoroughly, flash-freeze on a tray, then transfer to a bag. Frozen blueberries keep for 10 to 12 months.' },
      { q: 'Do blueberries need to be sorted before storing?', a: 'Yes. Pick through the batch and remove any soft, split, or moldy berries before refrigerating, since a single bad berry can spread mold to the rest of the container quickly.' },
      { q: 'Do frozen blueberries need to be thawed before baking?', a: 'No. Frozen blueberries can go directly into batter, oatmeal, or baked goods without thawing first, which also helps prevent them from bleeding color into the batter.' },
    ],
  },
  {
    label: 'Cherries',
    fruitLower: 'cherries',
    storageSlug: 'how-to-store-fresh-picked-cherries',
    image: { file: 'cherry-bucket-orchard-row.jpg', alt: 'A bucket of freshly picked cherries' },
    desc: 'Fresh-picked cherries last 1 to 2 weeks in the refrigerator with their stems left on, but only 1 to 2 days at room temperature — here is how to store them and why removing the stems early shortens their life.',
    sections: [
      {
        h2: 'How Long Do Fresh Cherries Last?',
        html: `          <p>Fresh-picked cherries last 1 to 2 weeks in the refrigerator when their stems are left on, but only 1 to 2 days at room temperature, where they soften and lose flavor quickly. The stem plays a bigger role in cherry shelf life than most people realize — it seals the small wound left where the fruit was attached to the branch, and removing it early opens a path for bacteria and mold.</p>
${chartHtml('Cherries', [
          { method: 'Countertop', life: '1–2 days', how: 'Only for same-day or next-day eating; cherries soften quickly in warm air.' },
          { method: 'Refrigerator', life: '1–2 weeks', how: 'Unwashed, stems on, in a shallow, breathable container rather than piled deep.' },
          { method: 'Freezer', life: '8–12 months', how: 'Pitted, frozen on a tray, then transferred to a bag.' },
        ])}`,
      },
      {
        h2: 'Countertop Storage',
        html: `          <p>Cherries left at room temperature hold their quality for only about 1 to 2 days before they start to soften and lose their snap. If you're eating them the same day or the next, the counter is fine, but for anything longer, refrigerate right away.</p>`,
      },
      {
        h2: 'Refrigerator Storage: The Right Way',
        html: `          <p>Store cherries unwashed with their stems still attached, in a shallow container rather than a deep bowl — the weight of cherries piled several inches deep bruises the fruit underneath, and bruised cherries spoil faster. A loosely covered container in the crisper drawer works well, allowing some air exchange without letting the fruit dry out.</p>
${proTipHtml(' Sort through cherries before storing and set aside any that are split, soft, or have damaged stems. These spoil first and, left in with the rest, can spread mold to otherwise good fruit within a day or two.')}`,
      },
      {
        h2: 'Freezer Storage',
        html: `          <p>To freeze cherries, wash and dry them, then remove the pits with a cherry pitter or a small knife. Spread the pitted cherries on a tray in a single layer and freeze until solid before transferring to a bag. Frozen cherries keep for 8 to 12 months and are great in smoothies, baking, and sauces, though the texture is noticeably softer than fresh once thawed.</p>`,
      },
      {
        h2: 'How to Clean Cherries the Right Way',
        html: `          <p>Rinse cherries under cool water right before eating. A vinegar-water soak (the same 1-to-3 ratio used for berries) can help remove surface residue and any lingering mold spores if you plan to store them a while longer afterward — just be sure to dry them thoroughly before returning them to the fridge.</p>`,
      },
      {
        h2: 'Common Storage Myths',
        html: `${mythFactHtml('Pull the stems off right away to make snacking easier.', 'Removing the stem opens the small wound at the top of the cherry to air and bacteria, which speeds up spoilage. Leave stems on until you\'re ready to eat.')}
${mythFactHtml('Cherries can be piled deep in a bowl without any issue.', 'The weight of cherries stacked several inches deep bruises the fruit at the bottom of the pile, and bruised cherries spoil noticeably faster than undamaged ones.')}`,
      },
      {
        h2: 'What to Do With Extra Cherries Before They Turn',
        html: `          <p>Cherries that have softened past the point of good fresh eating are well suited to pitting and cooking into a compote, sauce, or pie filling, where the heat and sugar make texture a non-issue. A batch of softer cherries also blends well into a smoothie or purées into a quick syrup for cocktails and desserts. Because cherries bruise easily under their own weight, it's common to end up with a mix of perfect and slightly soft fruit from the same batch — sorting them by firmness as soon as you get home and earmarking the softer ones for cooking sooner rather than later helps avoid waste.</p>`,
      },
      {
        h2: 'Why the Stem Matters More Than You\'d Think',
        html: `          <p>The point where a cherry attaches to its stem is the single weakest spot in the fruit's skin, and it's also the entry point that mold and bacteria exploit first. As long as the stem stays attached, it partially plugs that opening and slows moisture loss and microbial entry at the same time. Pull the stem off early, even gently, and you leave that small wound exposed to open air, which speeds up both dehydration and the earliest stages of decay — often invisibly, well before any obvious softness or discoloration shows up elsewhere on the fruit. This is also why cherries with stems that have already dried out and browned are usually a step behind fresher-looking fruit with green, pliable stems still attached, even if the cherries themselves look identical: the stem condition is often the earliest visible signal of how much longer a batch will hold up.</p>`,
      },
      {
        h2: 'Signs Your Cherries Have Gone Bad',
        html: `          <p>Look for wrinkled or shriveled skin, soft brown spots, mold at the stem end, sticky or leaking juice, a sour smell, and stems that have dried out and turned dark brown or black — a sign the fruit is past its best even if it still looks decent otherwise. See our full guide on <a href="/blog/how-to-tell-if-cherries-are-bad">how to tell if cherries are bad</a> for more.</p>`,
      },
    ],
    faqs: [
      { q: 'Should you remove cherry stems before storing them?', a: 'No. Leaving the stem on helps seal the small wound where the cherry was attached to the branch, which slows spoilage. Remove stems only right before eating.' },
      { q: 'How long do fresh cherries last in the fridge?', a: 'Cherries stored with their stems on typically last 1 to 2 weeks in the refrigerator.' },
      { q: 'Can you freeze fresh cherries?', a: 'Yes. Wash, dry, and pit the cherries, freeze them on a tray until solid, then transfer to a bag. Frozen cherries keep for 8 to 12 months.' },
      { q: 'Why do my cherries spoil faster than expected?', a: 'Cherries piled deep in a bowl bruise easily under their own weight, and bruised fruit spoils much faster. Store them in a shallow container instead.' },
      { q: 'Should cherries be washed before refrigerating?', a: 'No. Wash cherries only right before eating. Washing before storing adds moisture that speeds up spoilage, the same as with other berries and stone fruit.' },
      { q: 'What is the best container for storing cherries?', a: 'A shallow container that keeps the fruit in one or two layers works best, since piling cherries deep bruises the ones on the bottom under the weight of the fruit above them.' },
    ],
  },
  {
    label: 'Oranges',
    fruitLower: 'oranges',
    storageSlug: 'how-to-store-fresh-picked-oranges',
    image: { file: 'orange-tree-closeup.jpg', alt: 'Ripe oranges on a tree' },
    desc: 'Fresh oranges last 3 to 4 weeks at room temperature or 2 to 3 months in the refrigerator, making them one of the longest-lasting fresh fruits — here is how to store them and when refrigeration is actually necessary.',
    sections: [
      {
        h2: 'How Long Do Fresh Oranges Last?',
        html: `          <p>Fresh oranges last 3 to 4 weeks at room temperature, or 2 to 3 months in the refrigerator, making them one of the longest-lasting fresh fruits you can bring home — no rush to refrigerate the moment you get inside. Their thick, protective peel does a lot of the work that thinner-skinned fruits like berries can't do on their own, sealing in moisture and keeping air and bacteria out.</p>
${chartHtml('Oranges', [
          { method: 'Countertop', life: '3–4 weeks', how: 'In a cool spot out of direct sunlight, in a single layer for good air circulation.' },
          { method: 'Refrigerator', life: '2–3 months', how: 'In the crisper drawer, ideally in a mesh or perforated bag rather than sealed plastic.' },
          { method: 'Freezer (segments/juice)', life: '4–6 months', how: 'Whole oranges don\'t freeze well; segments or juice hold up better.' },
        ])}`,
      },
      {
        h2: 'Countertop Storage',
        html: `          <p>Oranges do just fine sitting at cool room temperature for weeks at a time, which is longer than most people assume. Keep them out of direct sunlight and in a single layer or shallow bowl rather than a deep pile, so air can circulate around each piece of fruit. There's no real downside to countertop storage if you're planning to eat your oranges within the next few weeks.</p>`,
      },
      {
        h2: 'Refrigerator Storage: When It Actually Matters',
        html: `          <p>Refrigeration extends orange shelf life to 2 to 3 months, which is worth it if you've picked or bought more than you'll eat in the next month. Store them in the crisper drawer, ideally in a mesh or perforated bag rather than a sealed plastic bag, which traps moisture against the peel and encourages mold.</p>
${proTipHtml(' Don\'t feel obligated to refrigerate oranges the moment you bring them home. Many people over-refrigerate citrus out of habit and lose valuable fridge space for no real benefit if the fruit will be eaten within a few weeks anyway.')}`,
      },
      {
        h2: 'Freezer Storage',
        html: `          <p>Whole oranges don't freeze well — the peel and membrane structure breaks down in a way that makes thawed fruit mushy and watery. Instead, freeze peeled segments or fresh-squeezed juice, both of which hold up reasonably well for 4 to 6 months and are useful for smoothies, baking, or drinks later on.</p>`,
      },
      {
        h2: 'How to Clean Oranges the Right Way',
        html: `          <p>Wash oranges under running water before eating or, especially, before zesting — commercial citrus is often treated with a thin food-safe wax and sometimes a fungicide to extend shelf life during shipping, and both sit on the surface of the peel. A produce brush and a firm scrub does a better job than a quick rinse alone, particularly if you're using the zest in cooking or baking.</p>`,
      },
      {
        h2: 'Common Storage Myths',
        html: `${mythFactHtml('Oranges need to be refrigerated immediately to stay fresh.', 'Oranges actually keep well at cool room temperature for 3 to 4 weeks thanks to their thick peel. Refrigeration extends life further but isn\'t urgent for fruit you\'ll eat soon.')}
${mythFactHtml('Store oranges in a sealed plastic bag to keep them fresh longer.', 'A sealed bag traps moisture against the peel and promotes mold. A mesh or perforated bag that allows some airflow works much better.')}`,
      },
      {
        h2: 'What to Do With Extra Oranges Before They Turn',
        html: `          <p>Oranges that are getting soft or a little dry are still usually fine for juicing, even if you wouldn't want to eat them by hand — the juice inside often holds up better than the segments look from the outside. Softer oranges also work well zested and juiced into marinades, dressings, or baked goods, where a slightly diminished fresh texture doesn't matter. If you have a large batch nearing the end of its shelf life, juicing the whole lot and freezing the juice in an ice cube tray or small containers is an easy way to use it all before any goes to waste.</p>`,
      },
      {
        h2: 'Why Oranges Outlast Almost Every Other Fresh Fruit',
        html: `          <p>An orange's peel is doing far more work than it gets credit for. That thick, spongy layer — called the albedo just underneath the colored rind — is packed with oils and structural fiber that dramatically slow moisture loss compared to a thin-skinned fruit like a grape or berry. Oranges are also non-climacteric, meaning they stop ripening the moment they're picked, so there's no ongoing ripening process pushing the fruit toward softness and decay the way there is with a peach or pear. The combination of a low respiration rate, minimal moisture loss through the peel, and no continued ripening after harvest is exactly why oranges can sit at room temperature for weeks without much visible change, and why refrigeration — while it helps — isn't nearly as urgent for citrus as it is for almost any other fresh fruit you'll bring home from an orchard or farm.</p>`,
      },
      {
        h2: 'Signs Your Oranges Have Gone Bad',
        html: `          <p>Look for soft, mushy patches, mold (often blue-green in color, a common citrus mold), peel that has dried out and separated from the fruit, a fermented or off smell, and fruit that feels unusually light for its size, which often means it has dried out internally. See our full guide on <a href="/blog/how-to-tell-if-oranges-are-bad">how to tell if oranges are bad</a> for more.</p>`,
      },
    ],
    faqs: [
      { q: 'Do oranges need to be refrigerated?', a: 'Not immediately. Oranges keep well at cool room temperature for 3 to 4 weeks. Refrigeration extends that to 2 to 3 months and is worth it for larger batches.' },
      { q: 'How long do oranges last in the fridge?', a: 'Oranges typically last 2 to 3 months in the refrigerator crisper drawer, longer than almost any other common fresh fruit.' },
      { q: 'Can you freeze whole oranges?', a: 'Not well. Whole oranges turn mushy and watery once thawed. Peeled segments or fresh-squeezed juice freeze better and keep for 4 to 6 months.' },
      { q: 'Why is there mold on my orange?', a: 'Citrus mold, often blue-green in color, spreads easily through contact and spores. Check nearby fruit for signs of spread and discard any moldy oranges promptly.' },
      { q: 'Should oranges be washed before storing?', a: 'It\'s fine either way for storage, but always wash oranges before zesting or eating the peel, since commercial citrus is often treated with a food-safe wax and sometimes a fungicide during shipping.' },
      { q: 'Do oranges ripen after picking?', a: 'No. Oranges are non-climacteric, meaning they stop ripening the moment they\'re picked. An orange won\'t get any sweeter sitting on the counter than it was the day it was harvested.' },
    ],
  },
];

const configs = FRUITS.map(f => ({
  title: `How to Store Fresh Picked ${f.label}`,
  slug: f.storageSlug,
  desc: f.desc,
  image: f.image,
  sections: f.sections,
  faqs: f.faqs,
  relatedGuides: relatedFor(f.storageSlug, FRUITS),
  moreGuides: MORE_GUIDES,
}));

generateGuideSeries(configs);

module.exports = { FRUITS };
