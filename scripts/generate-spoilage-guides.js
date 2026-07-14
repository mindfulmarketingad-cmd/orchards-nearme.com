#!/usr/bin/env node
'use strict';

const { spoilageChartHtml, mythFactHtml, generateGuideSeries } = require('./guide-blog-shared');

const MORE_GUIDES = [
  { href: '/find', label: 'Find Orchards, Farms, and Garden Centers Near You' },
  { href: '/blog', label: 'All Picking Season Guides' },
];

function relatedFor(currentSlug, fruits) {
  return fruits
    .filter(f => f.spoilageSlug !== currentSlug)
    .map(f => ({ href: `/blog/${f.spoilageSlug}`, label: `How to Tell If ${f.label} Are Bad` }));
}

const FRUITS = [
  {
    label: 'Strawberries',
    spoilageSlug: 'how-to-tell-if-strawberries-are-bad',
    storageSlug: 'how-to-store-fresh-picked-strawberries',
    image: { file: 'strawberry-field-rows-texas.jpg', alt: 'Rows of ripening strawberry plants in a sunny field' },
    desc: 'You can tell strawberries have gone bad by fuzzy white or gray mold, a dull or darkened color, a mushy or slimy texture, and a sour smell replacing their usual sweet fragrance.',
    chart: [
      { sign: 'Color', stillGood: 'Bright, even red', toss: 'Dull, dark red, or with white/green patches from mold' },
      { sign: 'Texture', stillGood: 'Firm with slight give', toss: 'Mushy, slimy, or leaking juice' },
      { sign: 'Surface', stillGood: 'Dry, matte skin', toss: 'Fuzzy white or gray mold spots' },
      { sign: 'Smell', stillGood: 'Sweet, fresh strawberry scent', toss: 'Sour, boozy, or fermented smell' },
    ],
    sections: [
      {
        h2: 'How to Tell If Strawberries Are Bad',
        html: `          <p>You can tell strawberries have gone bad by fuzzy white or gray mold, a dull or darkened color, a mushy or slimy texture, and a sour, fermented smell in place of their usual sweet fragrance. Strawberries are one of the most delicate fruits sold, and because they have no protective rind, the signs of spoilage tend to show up fast and clearly once they start.</p>
${spoilageChartHtml('Strawberries', [
          { sign: 'Color', stillGood: 'Bright, even red', toss: 'Dull, dark red, or with white/green patches from mold' },
          { sign: 'Texture', stillGood: 'Firm with slight give', toss: 'Mushy, slimy, or leaking juice' },
          { sign: 'Surface', stillGood: 'Dry, matte skin', toss: 'Fuzzy white or gray mold spots' },
          { sign: 'Smell', stillGood: 'Sweet, fresh strawberry scent', toss: 'Sour, boozy, or fermented smell' },
        ])}`,
      },
      {
        h2: 'Visual Signs of Spoilage',
        html: `          <p>The clearest visual sign is mold, which appears as a fuzzy white, gray, or occasionally greenish patch, often starting near the green cap or anywhere the skin has broken. Beyond mold, look for a dulling of the berry's color — a fresh strawberry has a bright, glossy red; one that's starting to spoil often looks darker, duller, and slightly sunken in spots. Juice pooling at the bottom of the container is another red flag, since it usually means at least one berry has already broken down and started leaking.</p>`,
      },
      {
        h2: 'The Smell Test',
        html: `          <p>A fresh strawberry smells sweet and slightly floral. Once a strawberry starts to spoil, that scent shifts toward something sour or distinctly alcoholic — a sign that natural yeasts and bacteria have started fermenting the sugars inside. If a berry smells "boozy" or sour when you bring the container close to your nose, treat that as a firm sign to toss it, even if it still looks mostly fine.</p>`,
      },
      {
        h2: 'The Texture Test',
        html: `          <p>Gently press a strawberry between two fingers. A good berry has some give but holds its shape; a spoiling one feels mushy, may leave juice on your fingers, or can even collapse slightly under light pressure. Any berry that feels slimy on the surface — as opposed to just naturally moist — is a strong indicator of bacterial or mold activity already underway beneath the skin.</p>`,
      },
      {
        h2: 'Mold: Cut It Off or Toss the Whole Berry?',
        html: `          <p>With strawberries, the answer is always to toss the whole berry — and check any berries touching it. Strawberries are a soft, high-moisture, porous fruit, and food safety guidance is consistent on this point: mold on soft fruit sends invisible root-like threads throughout the flesh well beyond the visible fuzzy patch, so cutting around a moldy spot doesn't remove the contamination the way it might on a firm, low-moisture food. This is different from a fruit like an apple, where a small mold spot on otherwise firm flesh can sometimes be cut away safely. Once you see mold on a strawberry, the whole berry goes in the trash, and it's worth a quick check of every other berry it was touching in the container, since mold spores spread easily between fruit in close contact.</p>`,
      },
      {
        h2: 'Is It Still Safe to Eat?',
        html: `          <p>A strawberry that's a bit soft, slightly duller in color, or missing some of its shine — but shows no mold, no sliminess, and no off smell — is still safe to eat, even if it's not at its absolute peak. These berries are perfectly good candidates for smoothies, baking, or a quick stovetop compote, where a little extra softness doesn't matter. The line to watch for isn't "not perfect," it's mold, sliminess, or a sour smell — any one of those means it's time to toss it rather than eat it.</p>`,
      },
      {
        h2: 'How to Pick Good Strawberries in the First Place',
        html: `          <p>At the farm or store, choose strawberries that are fully red from tip to cap — a white or pale green "shoulder" near the stem means the berry was picked before it fully ripened and won't develop more sweetness afterward. Look for a fresh, bright green cap rather than one that's wilted or browning, and check the bottom of the container for any juice staining, which suggests a berry has already started to break down before you've even bought it. Berries with a natural shine and no visible soft spots will hold up the longest once you get them home.</p>`,
      },
    ],
    faqs: [
      { q: 'How can you tell if strawberries have gone bad?', a: 'Look for fuzzy white or gray mold, a dull or darkened color, a mushy or slimy texture, and a sour or fermented smell in place of the usual sweet scent.' },
      { q: 'Can you cut mold off a strawberry and eat the rest?', a: 'No. Strawberries are soft and porous, so mold spreads invisible threads through the flesh well beyond the visible spot. Discard the whole berry.' },
      { q: 'Is it safe to eat a soft strawberry?', a: 'Yes, as long as there\'s no mold, sliminess, or sour smell. A softer berry is fine for smoothies or baking even if it\'s past its best for eating fresh.' },
      { q: 'Why do my strawberries smell like alcohol?', a: 'That fermented, boozy smell means natural yeasts and bacteria have started breaking down the sugars inside the berry. It\'s a clear sign to discard it.' },
      { q: 'How long do strawberries take to go bad?', a: 'Strawberries typically start showing signs of spoilage within 3 to 7 days of picking if refrigerated, or within a day at room temperature.' },
      { q: 'Do all the strawberries in a container spoil at the same time?', a: 'No. One moldy or leaking berry can speed up spoilage in the berries touching it, but the rest of the batch can still be perfectly good if checked and separated promptly.' },
      { q: 'Can washed strawberries still be eaten if stored wet?', a: 'Yes, but they\'ll spoil faster. If you\'ve already washed a batch, dry them thoroughly with a towel and plan to use them within a day or two rather than storing them for a full week.' },
    ],
  },
  {
    label: 'Blueberries',
    spoilageSlug: 'how-to-tell-if-blueberries-are-bad',
    storageSlug: 'how-to-store-fresh-picked-blueberries',
    image: { file: 'blueberry-hands-picking-bush.jpg', alt: 'Hands picking blueberries from a bush' },
    desc: 'You can tell blueberries have gone bad by shriveled or wrinkled skin, a mushy texture, visible mold, and a sour smell in place of their usual mild sweetness.',
    sections: [
      {
        h2: 'How to Tell If Blueberries Are Bad',
        html: `          <p>You can tell blueberries have gone bad by shriveled or wrinkled skin, a mushy texture, visible white or gray mold, and a sour smell replacing their normal mild, sweet scent. Blueberries hold up better than most berries, but once they start to turn, the signs are fairly easy to spot if you know what to look for.</p>
${spoilageChartHtml('Blueberries', [
          { sign: 'Skin', stillGood: 'Smooth, plump, with a natural whitish bloom', toss: 'Wrinkled, shriveled, or split skin' },
          { sign: 'Texture', stillGood: 'Firm with a slight snap', toss: 'Mushy or watery' },
          { sign: 'Surface', stillGood: 'Dry surface', toss: 'Visible mold or leaking juice staining the container' },
          { sign: 'Smell', stillGood: 'Mild, slightly sweet scent', toss: 'Sour or fermented smell' },
        ])}`,
      },
      {
        h2: 'Visual Signs of Spoilage',
        html: `          <p>Fresh blueberries are plump and firm with smooth, taut skin, often covered in a pale, dusty "bloom" that's completely natural and not a sign of anything wrong. As blueberries age, they start to wrinkle and shrivel as they lose moisture, and eventually develop soft spots or visible mold, usually a white or gray fuzz. Purple staining on the bottom of the container is a clear sign that at least one berry has already burst or broken down.</p>`,
      },
      {
        h2: 'The Smell Test',
        html: `          <p>Blueberries don't have an especially strong scent even when fresh, so any noticeable sour or fermented smell coming from the container is a meaningful warning sign. If you have to bring the container right up to your nose to smell anything unusual, that's often enough to warrant a closer look at the berries themselves before eating any of them.</p>`,
      },
      {
        h2: 'The Texture Test',
        html: `          <p>A fresh blueberry has a gentle snap when you bite into it and feels firm, not squishy, between your fingers. Berries that have started to spoil feel soft and give way easily, sometimes releasing juice at the slightest pressure. Wrinkled skin alone doesn't necessarily mean a blueberry is unsafe — it often just means the berry has lost moisture and is past its best — but wrinkled and mushy together is a clear sign to toss it.</p>`,
      },
      {
        h2: 'Mold: Cut It Off or Toss the Whole Berry?',
        html: `          <p>Discard any blueberry with visible mold, along with any berries it was touching in the container. Like strawberries, blueberries are a small, soft, high-moisture fruit, and mold can spread through the flesh in ways that aren't visible from the outside. There's no safe way to "cut around" mold on a blueberry the way you sometimes can with a firm, low-moisture fruit like an apple — the whole berry should go in the trash, and it's worth doing a quick visual sweep of the rest of the container for any other affected fruit.</p>`,
      },
      {
        h2: 'Is It Still Safe to Eat?',
        html: `          <p>Wrinkled but firm blueberries with no mold and no off smell are perfectly safe to eat, even if the texture is a bit less crisp than a fresh-picked berry. These are excellent candidates for baking, oatmeal toppings, or a quick stovetop compote, where a slightly softer texture blends right in. The signs that actually matter are mold, mushiness, leaking juice, and a sour smell — anything short of that is just a matter of quality, not safety.</p>`,
      },
      {
        h2: 'How to Pick Good Blueberries in the First Place',
        html: `          <p>Look for blueberries with a deep blue-purple color and a visible dusty bloom on the skin — that pale coating is a natural protective wax and actually a good sign, not something to avoid. Choose plump, firm berries over shriveled ones, and check the bottom of the container for any purple staining or crushed fruit before buying, since that usually signals a batch that won't hold up as long once you get it home.</p>`,
      },
      {
        h2: 'One Bad Blueberry Can Cost You the Whole Container',
        html: `          <p>Because blueberries are typically sold and stored in bulk, a single moldy or leaking berry poses a bigger risk than it might for a fruit you buy individually, like an apple or orange. Mold spores travel easily through direct contact, and a container of blueberries packs dozens of berries touching each other, which gives spoilage a fast path to spread if it isn't caught early. Get in the habit of giving a batch a quick visual scan every couple of days rather than waiting until you're ready to eat a handful — catching one bad berry early can save the rest of the container.</p>`,
      },
    ],
    faqs: [
      { q: 'How can you tell if blueberries have gone bad?', a: 'Look for shriveled or wrinkled skin, a mushy texture, visible mold, leaking juice, and a sour smell in place of their usual mild sweetness.' },
      { q: 'Is the white coating on blueberries a bad sign?', a: 'No. That pale, dusty coating is called the bloom, a natural protective wax the fruit produces. It\'s a good sign of freshness, not spoilage.' },
      { q: 'Can you eat wrinkled blueberries?', a: 'Yes, as long as there\'s no mold, mushiness, or sour smell. Wrinkled blueberries have just lost some moisture and are fine for baking or cooking.' },
      { q: 'Can you cut mold off a blueberry?', a: 'No. Blueberries are small and porous, so mold can spread through the flesh invisibly. Discard any moldy berries and check nearby fruit for contamination.' },
      { q: 'How long do fresh blueberries take to go bad?', a: 'Blueberries typically start showing spoilage after 1 to 2 weeks in the refrigerator, or within a day or two at room temperature.' },
      { q: 'Why do some blueberries in the same container spoil faster than others?', a: 'Berries that were bruised or had broken skin during picking or handling spoil first, since damaged skin gives mold and bacteria an easier entry point than intact skin.' },
      { q: 'Do frozen blueberries ever go bad?', a: 'Properly frozen blueberries stay safe indefinitely in a freezer, but quality declines after about 10 to 12 months, showing up as freezer burn, dull flavor, or a mushier texture once thawed.' },
    ],
  },
  {
    label: 'Peaches',
    spoilageSlug: 'how-to-tell-if-peaches-are-bad',
    storageSlug: 'how-to-store-fresh-picked-peaches',
    image: { file: 'peach-kids-crates-picking.jpg', alt: 'Kids sitting with crates of freshly picked peaches' },
    desc: 'You can tell a peach has gone bad by soft mushy spots, leaking juice, wrinkled skin, mold (often at the stem), and a sour or fermented smell replacing its usual sweet fragrance.',
    sections: [
      {
        h2: 'How to Tell If Peaches Are Bad',
        html: `          <p>You can tell a peach has gone bad by soft mushy spots, leaking juice, wrinkled skin, mold — often starting at the stem end — and a sour or fermented smell replacing its usual sweet fragrance. Because peaches are soft, juicy, and continue ripening after picking, the line between "perfectly ripe" and "starting to spoil" can pass quickly, especially in warm weather.</p>
${spoilageChartHtml('Peaches', [
          { sign: 'Texture', stillGood: 'Yields gently to pressure', toss: 'Mushy, collapsing, or leaking juice' },
          { sign: 'Skin', stillGood: 'Smooth with a slight fuzz', toss: 'Wrinkled, bruised, or with visible mold' },
          { sign: 'Stem end', stillGood: 'Dry and intact', toss: 'Soft, discolored, or moldy at the stem' },
          { sign: 'Smell', stillGood: 'Sweet, fragrant scent', toss: 'Sour, boozy, or fermented smell' },
        ])}`,
      },
      {
        h2: 'Visual Signs of Spoilage',
        html: `          <p>A ripe, good peach has smooth, taut skin with even coloring for its variety. As a peach spoils, look for soft brown spots (often called "bruising" but which can also indicate rot underneath), wrinkled or sagging skin, and mold, which tends to appear first at the stem end where moisture collects and the fruit's protective barrier is weakest. Any visible puncture or split in the skin is also a fast track to spoilage, since it gives mold and bacteria direct access to the fruit's interior.</p>`,
      },
      {
        h2: 'The Smell Test',
        html: `          <p>A ripe peach has a strong, unmistakably sweet fragrance — if you can smell it before you even pick it up, that's actually a good sign of ripeness. Once a peach starts to spoil, that sweetness turns sour or takes on an alcoholic, fermented edge as the sugars break down. A peach that smells "off" in this way should be checked closely for soft spots or mold before eating.</p>`,
      },
      {
        h2: 'The Texture Test',
        html: `          <p>Press gently near the peach's shoulder, not just the stem end. A ripe peach yields slightly under gentle pressure but springs back; a spoiling one feels mushy, may collapse under light pressure, or leaves a visible indentation that doesn't fill back in. Be aware that a mealy, cottony texture in a peach that was refrigerated too early (chill injury) is a quality problem rather than a safety one — it's unpleasant to eat but not the same as active spoilage from mold or bacteria.</p>`,
      },
      {
        h2: 'Mold: Cut It Off or Toss the Whole Peach?',
        html: `          <p>Discard the whole peach if you see mold. Peaches are a soft, high-moisture fruit, and like other soft fruits, mold can spread through the flesh well beyond what's visible on the surface. This is different from firmer, lower-moisture produce like apples, where a small mold spot on otherwise solid flesh can sometimes be cut away with a wide margin. With a peach's soft, juicy structure, that same approach isn't reliable, so the safest move is to throw out the whole fruit once mold appears anywhere on it.</p>`,
      },
      {
        h2: 'Is It Still Safe to Eat?',
        html: `          <p>A peach with a small bruise, a slightly soft spot, or a bit of mealy texture from early refrigeration is still safe to eat — just cut away the bruised section and use the rest right away, ideally in a cooked application like a cobbler or compote where texture matters less. The signs that mean it's time to toss the whole peach are mold, a fermented smell, or widespread mushiness rather than one localized soft spot.</p>`,
      },
      {
        h2: 'How to Pick Good Peaches in the First Place',
        html: `          <p>Choose peaches that give slightly to gentle pressure and smell fragrant — a peach with no scent at all was likely picked too green and may not ripen fully. Avoid any with visible bruising, punctures, or soft spots already present at the point of purchase, since those areas will spoil first and can spread mold to the rest of the fruit if left too long. A peach with good color for its variety and unbroken skin will generally hold up the longest once you bring it home.</p>`,
      },
    ],
    faqs: [
      { q: 'How can you tell if a peach has gone bad?', a: 'Look for soft mushy spots, leaking juice, wrinkled skin, mold (often starting at the stem end), and a sour or fermented smell.' },
      { q: 'Can you cut mold off a peach and eat the rest?', a: 'No. Peaches are soft and high in moisture, so mold spreads through the flesh beyond what\'s visible. Discard the whole peach if you see mold.' },
      { q: 'Is a mealy peach unsafe to eat?', a: 'Not necessarily. A mealy, cottony texture often results from refrigerating an unripe peach (chill injury), which is a quality issue rather than a safety issue, unlike mold or active rot.' },
      { q: 'Why does my peach smell like alcohol?', a: 'A fermented or alcoholic smell means the natural sugars in the peach have started breaking down, a sign of spoilage even if the fruit still looks mostly fine.' },
      { q: 'How long do ripe peaches take to go bad?', a: 'Once ripe, peaches typically last 3 to 5 days in the refrigerator before showing signs of spoilage, or just a day or two at room temperature.' },
      { q: 'Why does mold on a peach usually start at the stem?', a: 'The stem end has a small natural opening where the fruit was attached to the branch, which gives mold and bacteria an easier entry point than the rest of the smooth skin.' },
      { q: 'Can you tell if a peach is bad without touching it?', a: 'Often yes. Wrinkled skin, visible mold, and a sour or fermented smell are all signs you can catch without pressing on the fruit, though a gentle press near the shoulder confirms softness.' },
    ],
  },
  {
    label: 'Oranges',
    spoilageSlug: 'how-to-tell-if-oranges-are-bad',
    storageSlug: 'how-to-store-fresh-picked-oranges',
    image: { file: 'orange-hand-holding-fruit.jpg', alt: 'A hand holding a fresh orange' },
    desc: 'You can tell an orange has gone bad by soft mushy spots, mold that is often blue-green, a peel that has dried out or separated from the fruit, and a fermented or off smell.',
    sections: [
      {
        h2: 'How to Tell If Oranges Are Bad',
        html: `          <p>You can tell an orange has gone bad by soft mushy spots, mold that's often blue-green in color, a peel that's dried out or separated from the fruit, and a fermented or off smell. Because oranges have a thick protective peel, spoilage can sometimes be harder to spot from the outside than with thinner-skinned fruit, so it's worth checking a few different signals rather than relying on appearance alone.</p>
${spoilageChartHtml('Oranges', [
          { sign: 'Peel', stillGood: 'Firm, glossy, tight against the fruit', toss: 'Wrinkled, dry, or separated from the flesh' },
          { sign: 'Weight', stillGood: 'Feels heavy for its size', toss: 'Feels unusually light, a sign of internal drying' },
          { sign: 'Surface', stillGood: 'Clean, unblemished peel', toss: 'Blue-green mold or soft, sunken spots' },
          { sign: 'Smell', stillGood: 'Fresh, citrusy scent', toss: 'Sour, musty, or fermented smell' },
        ])}`,
      },
      {
        h2: 'Visual Signs of Spoilage',
        html: `          <p>A good orange has a firm, glossy peel that sits tight against the fruit underneath. Spoilage often shows up first as a soft, slightly sunken spot on the peel, which usually means the flesh underneath has started to break down even before mold becomes visible. Mold on citrus is commonly a blue-green fuzzy patch, quite distinct from the white or gray mold seen on most other fruit, and it tends to spread across the peel's surface fairly quickly once it appears.</p>`,
      },
      {
        h2: 'The Weight Test',
        html: `          <p>Pick the orange up and gauge its weight relative to its size. A fresh, juicy orange feels notably heavy for how big it is; one that's dried out inside — even if the peel still looks reasonably intact — will feel surprisingly light. This internal drying happens gradually as moisture escapes through the peel over time, and it's one of the more reliable ways to catch an orange that's past its prime before cutting into it.</p>`,
      },
      {
        h2: 'The Smell Test',
        html: `          <p>A fresh orange has a bright, clean citrus scent, especially noticeable near the stem end. A sour, musty, or fermented smell — sometimes only detectable once you've peeled the fruit — signals that spoilage has already set in, even if the outside looked fine. Trust your nose here as much as your eyes, since citrus can look deceptively normal on the outside while the interior has already started to break down.</p>`,
      },
      {
        h2: 'Mold: Cut It Off or Toss the Whole Orange?',
        html: `          <p>Discard the whole orange if you see mold anywhere on the peel. Even though citrus peel is firm and low in moisture — the kind of produce where cutting around a mold spot is sometimes considered safe — citrus mold specifically is known to send root-like threads through the fruit via the network of oil glands and pores in the peel, reaching the juicy flesh underneath well beyond the visible spot. Because of that, common food safety guidance treats moldy citrus the same as moldy soft fruit: the whole piece should be thrown out rather than trimmed.</p>`,
      },
      {
        h2: 'Is It Still Safe to Eat?',
        html: `          <p>An orange with a slightly dry or pithy texture but no mold, no soft spots, and no off smell is still safe to eat, even if it's not as juicy as a fresher one — it's a good candidate for juicing rather than eating in segments. The signs that mean it's time to throw the whole orange away are mold, soft or sunken spots on the peel, and any sour or fermented smell.</p>`,
      },
      {
        h2: 'How to Pick Good Oranges in the First Place',
        html: `          <p>Choose oranges that feel heavy for their size, a good sign of juiciness, with firm, glossy peels free of soft spots or blemishes. A bit of rough or textured peel doesn't affect quality, but any give when you press gently, or any peel that looks separated or shrunken away from the fruit, suggests the orange has already started to dry out or spoil internally.</p>`,
      },
      {
        h2: 'Why the Peel Can Be Misleading',
        html: `          <p>An orange's thick peel is protective, but that same thickness means it can mask what's happening underneath for longer than a thin-skinned fruit would allow. A peel can look perfectly normal for days after the flesh inside has actually started to dry out, ferment, or develop early mold, which is why weight and smell matter just as much as appearance when judging citrus freshness. If something about an orange feels off — lighter than expected, a faint sour note, slightly softer peel than usual — it's worth cutting it open to check rather than relying on a visual scan of the outside alone, especially with fruit that's been stored for a few weeks.</p>`,
      },
    ],
    faqs: [
      { q: 'How can you tell if an orange has gone bad?', a: 'Look for soft mushy spots, blue-green mold, a peel that\'s dried out or pulling away from the fruit, unusually light weight for its size, and a fermented or off smell.' },
      { q: 'Can you cut mold off an orange and eat the rest?', a: 'No. Citrus mold spreads through the peel\'s network of oil glands and pores into the flesh beyond what\'s visible, so the whole orange should be discarded.' },
      { q: 'Why does my orange feel light for its size?', a: 'That usually means moisture has escaped through the peel over time and the fruit has dried out internally, even if the outside still looks mostly normal.' },
      { q: 'Is a dry, pithy orange safe to eat?', a: 'Yes, as long as there\'s no mold, soft spots, or off smell. It just won\'t be very juicy — it\'s a good candidate for juicing rather than eating fresh.' },
      { q: 'How long do oranges take to go bad?', a: 'Oranges typically last 3 to 4 weeks at room temperature or 2 to 3 months refrigerated before showing clear signs of spoilage.' },
      { q: 'What does blue-green mold on citrus mean?', a: 'That coloring is typically Penicillium mold, one of the most common molds found on citrus fruit. It spreads through the peel\'s oil glands and pores, so the whole fruit should be discarded.' },
      { q: 'Can one moldy orange affect others in the same bag?', a: 'Yes. Mold spores spread easily through direct contact, so it\'s worth checking every orange that was touching a moldy one, not just the affected fruit itself.' },
    ],
  },
  {
    label: 'Cherries',
    spoilageSlug: 'how-to-tell-if-cherries-are-bad',
    storageSlug: 'how-to-store-fresh-picked-cherries',
    image: { file: 'cherry-girl-holding-pair.jpg', alt: 'A girl holding a pair of freshly picked cherries' },
    desc: 'You can tell cherries have gone bad by wrinkled or shriveled skin, soft brown spots, mold (often at the stem end), sticky leaking juice, and a sour smell.',
    sections: [
      {
        h2: 'How to Tell If Cherries Are Bad',
        html: `          <p>You can tell cherries have gone bad by wrinkled or shriveled skin, soft brown spots, mold — usually appearing at the stem end first — sticky or leaking juice, and a sour smell in place of their normal sweet scent. The condition of the stem itself is also one of the best early indicators of freshness, often signaling trouble before the cherry's body shows any obvious change.</p>
${spoilageChartHtml('Cherries', [
          { sign: 'Stem', stillGood: 'Green and pliable', toss: 'Dry, brown, or missing entirely' },
          { sign: 'Skin', stillGood: 'Smooth, glossy, taut', toss: 'Wrinkled, shriveled, or split' },
          { sign: 'Texture', stillGood: 'Firm with a slight give', toss: 'Soft, mushy, or leaking juice' },
          { sign: 'Smell', stillGood: 'Sweet, mild scent', toss: 'Sour or fermented smell' },
        ])}`,
      },
      {
        h2: 'Visual Signs of Spoilage',
        html: `          <p>Check the stem first — a fresh cherry has a green, flexible stem, while one that's dried out, browned, or has fallen off entirely suggests the fruit is past its prime, even if the cherry itself looks fine at a glance. On the fruit, look for wrinkled or shriveled skin, soft brown patches, and mold, which often shows up first as a fuzzy patch right where the stem meets the fruit, since that's the most vulnerable point in the skin.</p>`,
      },
      {
        h2: 'The Smell Test',
        html: `          <p>Good cherries have a mild, sweet smell that's easy to miss unless you bring the container close. A sour or fermented, slightly alcoholic smell is a clear sign of spoilage — it means the natural sugars have started breaking down, usually alongside other visible signs like soft spots or leaking juice.</p>`,
      },
      {
        h2: 'The Texture Test',
        html: `          <p>Fresh cherries feel firm with a slight give when pressed gently, similar to a ripe grape. Spoiling cherries feel soft, sometimes mushy, and may leave sticky juice on your fingers. Because cherries bruise easily under their own weight when piled deep, it's common to find a mix of firm and soft fruit in the same container — check each cherry individually rather than assuming the whole batch matches the ones on top.</p>`,
      },
      {
        h2: 'Mold: Cut It Off or Toss the Whole Cherry?',
        html: `          <p>Discard any cherry with visible mold, along with any cherries touching it. Cherries are small, soft, and high in moisture, which means mold can spread through the fruit in ways that aren't visible from the outside — there's no reliable way to "cut around" a mold spot on a cherry the way you sometimes can with a firmer, lower-moisture fruit. Because cherries are often stored piled together, it's worth checking the surrounding fruit closely any time you find a moldy one.</p>`,
      },
      {
        h2: 'Is It Still Safe to Eat?',
        html: `          <p>A cherry that's a bit soft or has lost some of its shine, but shows no mold, no sliminess, and no sour smell, is still safe to eat — these are good candidates for pitting and using in a cooked sauce or baked dish rather than eating fresh. The signals that mean it's time to toss a cherry are mold, mushiness, sticky leaking juice, or a sour smell, not just a slightly duller appearance.</p>`,
      },
      {
        h2: 'How to Pick Good Cherries in the First Place',
        html: `          <p>Look for cherries with smooth, glossy, taut skin and fresh green stems still attached — dry or missing stems are one of the fastest ways to spot fruit that's already a step behind fresher options. Choose plump cherries over shriveled ones, and avoid any container that already shows soft or leaking fruit at the bottom, since that usually means the rest of the batch won't be far behind.</p>`,
      },
      {
        h2: 'Why Cherries Spoil Faster Than You Might Expect',
        html: `          <p>Cherries are often sold and stored piled together in bags or clamshells, and their round shape means the fruit at the bottom of any pile bears the weight of everything stacked above it. That constant pressure bruises the skin even when nothing looks obviously wrong on the outside, and bruised tissue breaks down and molds noticeably faster than undamaged fruit. Combined with the fact that cherries are picked with a delicate stem attachment that's easy to disturb during handling, it's common for a batch of cherries to include a wider range of freshness than you'd expect from fruit that was all picked on the same day — which is exactly why checking individual cherries, rather than judging the whole bag at a glance, matters more here than with sturdier fruit.</p>`,
      },
    ],
    faqs: [
      { q: 'How can you tell if cherries have gone bad?', a: 'Look for wrinkled or shriveled skin, soft brown spots, mold near the stem end, sticky leaking juice, and a sour smell.' },
      { q: 'Why does the stem matter when checking cherry freshness?', a: 'A fresh cherry has a green, flexible stem. A dry, brown, or missing stem is often one of the earliest signs that the fruit is past its best, even before the cherry itself shows visible changes.' },
      { q: 'Can you cut mold off a cherry and eat the rest?', a: 'No. Cherries are small and high in moisture, so mold spreads through the flesh in ways you can\'t see. Discard any moldy cherries and check the ones touching them.' },
      { q: 'Is it safe to eat a soft cherry?', a: 'Yes, as long as there\'s no mold, sliminess, or sour smell. A soft cherry is fine pitted and used in a cooked sauce or baked dish.' },
      { q: 'How long do fresh cherries take to go bad?', a: 'Cherries with their stems intact typically last 1 to 2 weeks in the refrigerator, or just 1 to 2 days at room temperature.' },
      { q: 'Do cherries without stems spoil faster?', a: 'Yes. Removing the stem exposes a small wound in the skin to air and bacteria, which speeds up spoilage compared to cherries that still have their stems attached.' },
      { q: 'Is it normal for cherries to feel slightly sticky?', a: 'A little natural stickiness from the fruit\'s own sugars is normal, but noticeably wet, leaking, or slimy cherries usually indicate spoilage has already begun.' },
    ],
  },
  {
    label: 'Apples',
    spoilageSlug: 'how-to-tell-if-apples-are-bad',
    storageSlug: 'how-to-store-fresh-picked-apples',
    image: { file: 'apple-picking-kids-orchard.jpg', alt: 'Kids picking apples in an orchard' },
    desc: 'You can tell an apple has gone bad by soft or mealy flesh, brown spots when cut, wrinkled skin, mold, and a fermented, alcoholic smell.',
    sections: [
      {
        h2: 'How to Tell If Apples Are Bad',
        html: `          <p>You can tell an apple has gone bad by soft or mealy flesh, brown discoloration when cut open, wrinkled skin, visible mold, and a fermented, alcoholic smell. Apples last far longer than most fruit, so spoilage tends to be a gradual process — but there are clear signals once an apple has actually crossed the line from "past its peak" to "no longer good to eat."</p>
${spoilageChartHtml('Apples', [
          { sign: 'Skin', stillGood: 'Firm, smooth, taut', toss: 'Wrinkled, shriveled, or with soft bruised patches' },
          { sign: 'Flesh (cut open)', stillGood: 'Crisp, pale, juicy', toss: 'Brown, mushy, or dry and mealy throughout' },
          { sign: 'Surface', stillGood: 'Clean skin, no fuzz', toss: 'Visible mold, often near the stem or a bruise' },
          { sign: 'Smell', stillGood: 'Fresh, mildly sweet scent', toss: 'Sour or alcoholic, fermented smell' },
        ])}`,
      },
      {
        h2: 'Visual Signs of Spoilage',
        html: `          <p>A good apple has firm, smooth, taut skin without soft spots. As apples age, the skin starts to wrinkle, especially near the stem and blossom ends, and bruised areas turn brown and slightly sunken. Mold on an apple typically shows up as a fuzzy white, gray, or blue-green patch, often starting at a bruise, a puncture, or the stem, where the skin's protective barrier is weakest.</p>`,
      },
      {
        h2: 'The Smell Test',
        html: `          <p>Fresh apples have a mild, faintly sweet smell. A strong, sour, or distinctly alcoholic smell means the apple's natural sugars have started fermenting, a sign that spoilage is already underway even if the skin still looks mostly intact. This smell is usually most noticeable once you cut the apple open.</p>`,
      },
      {
        h2: 'The Texture Test',
        html: `          <p>Cut a suspect apple open and check the flesh. Fresh apple flesh is crisp, pale, and juicy; spoiling flesh turns soft, sometimes mushy, and often shows brown discoloration spreading out from the core or from a bruise. A mealy, dry, grainy texture throughout the apple is a different issue — usually a sign the apple is simply old or was stored too warm — and while unpleasant, it's more of a quality problem than an active safety concern, unlike mold or clear rot.</p>`,
      },
      {
        h2: 'Mold: Cut It Off or Toss the Whole Apple?',
        html: `          <p>Apples are one of the fruits where cutting around a small mold spot is often considered acceptable, provided the rest of the apple is still firm. Because apples are a dense, relatively low-moisture fruit, mold has a harder time spreading invisibly through the flesh the way it does in soft, high-moisture fruit like berries or peaches. If you find a small area of mold on an otherwise firm apple, common food-safety guidance suggests cutting away at least an inch of flesh around and below the moldy spot, using a clean knife, and using the rest of the apple normally. That said, if the apple is soft throughout, has mold in more than one spot, or smells fermented, it's better to discard the whole thing rather than trying to salvage it.</p>`,
      },
      {
        h2: 'Is It Still Safe to Eat?',
        html: `          <p>A mealy, less-crisp apple with no mold and no off smell is still safe to eat, even though the texture isn't ideal for eating fresh — it's a great candidate for applesauce, baking, or juicing, where the softer texture doesn't matter. A little bit of browning right under the skin from a minor bruise is also generally fine to cut away and eat around. The signs that mean it's time to throw the whole apple away are widespread softness, multiple mold spots, or a strong fermented smell throughout.</p>`,
      },
      {
        h2: 'How to Pick Good Apples in the First Place',
        html: `          <p>Choose apples that feel firm with no give when pressed, and check for smooth skin free of soft spots, punctures, or shriveling. A few small surface blemishes from the orchard don't affect quality, but avoid apples that already feel soft near the stem or have visible bruising, since those spots will spoil first and can spread if left in storage with other apples.</p>`,
      },
    ],
    faqs: [
      { q: 'How can you tell if an apple has gone bad?', a: 'Look for soft or mealy flesh, brown discoloration when cut open, wrinkled skin, visible mold, and a fermented, alcoholic smell.' },
      { q: 'Can you cut mold off an apple and eat the rest?', a: 'Often yes, if the apple is otherwise firm. Cut away at least an inch of flesh around and below the mold spot. If the apple is soft throughout or has mold in multiple spots, discard the whole thing.' },
      { q: 'Is a mealy apple safe to eat?', a: 'Yes, as long as there\'s no mold or fermented smell. A mealy texture is a quality issue from age or warm storage, not a safety concern, and works fine in applesauce or baking.' },
      { q: 'Why does my apple smell like alcohol?', a: 'A fermented, alcoholic smell means the apple\'s natural sugars have started breaking down, a sign of spoilage that\'s usually most noticeable once the apple is cut open.' },
      { q: 'How long do apples take to go bad?', a: 'Apples typically last 4 to 6 weeks in the refrigerator before showing significant signs of spoilage, far longer than most other fresh fruit.' },
      { q: 'Why does one bad apple spread to the rest of the bowl?', a: 'A rotting apple releases extra ethylene gas and can spread mold spores through direct contact, both of which speed up spoilage in nearby apples. Remove bad apples promptly.' },
      { q: 'Is brown flesh under an apple\'s skin always a sign of rot?', a: 'Not always. Small brown spots right under the skin from a minor bruise can usually be cut away safely, but widespread brown, mushy flesh throughout means the apple should be discarded.' },
    ],
  },
  {
    label: 'Pears',
    spoilageSlug: 'how-to-tell-if-pears-are-bad',
    storageSlug: 'how-to-store-fresh-picked-pears',
    image: { file: 'pear-crate-harvest.jpg', alt: 'A crate of freshly harvested pears' },
    desc: 'You can tell a pear has gone bad by soft brown mushy spots (especially at the core), a grainy or mealy texture throughout, mold, wrinkled skin, and a fermented smell.',
    sections: [
      {
        h2: 'How to Tell If Pears Are Bad',
        html: `          <p>You can tell a pear has gone bad by soft brown mushy spots — especially at the core — a grainy or mealy texture throughout, visible mold, wrinkled skin, and a fermented smell. Pears are unusual in that they can look completely fine on the outside while the inside has already started to break down, so a few different checks matter more here than with most fruit.</p>
${spoilageChartHtml('Pears', [
          { sign: 'Neck (near stem)', stillGood: 'Yields gently to pressure when ripe', toss: 'Soft and mushy well beyond the neck' },
          { sign: 'Core (cut open)', stillGood: 'Pale, only slightly grainy', toss: 'Brown, mushy, or fermented-looking' },
          { sign: 'Skin', stillGood: 'Smooth, taut', toss: 'Wrinkled, shriveled, or with mold' },
          { sign: 'Smell', stillGood: 'Sweet, mild scent', toss: 'Sour or fermented smell' },
        ])}`,
      },
      {
        h2: 'Visual Signs of Spoilage',
        html: `          <p>Look at the pear's skin for wrinkling, soft brown patches, or mold, which often appears as a fuzzy spot near the stem or anywhere the skin has been punctured. Because pears ripen from the neck downward, a pear that's soft and give-y across its entire body — not just near the stem — has likely gone past ripe into spoiled territory rather than simply being ready to eat.</p>`,
      },
      {
        h2: 'The Cut Test: Checking for Internal Breakdown',
        html: `          <p>Pears can suffer from a condition called internal breakdown, where the flesh near the core turns brown and mushy while the outside of the fruit still looks completely normal. If a pear feels odd — overly soft, oddly heavy, or simply "off" — despite looking fine externally, cutting it open is the most reliable way to check. Brown, mushy, or fermented-smelling flesh at the core means the pear should be discarded, even if the skin gave no warning.</p>`,
      },
      {
        h2: 'The Smell Test',
        html: `          <p>A good pear has a mild, sweet fragrance, most noticeable near the stem once it's ripe. A sour or clearly fermented smell — sometimes only apparent once the pear is cut open — signals that the fruit's sugars have started breaking down and it's no longer good to eat, regardless of how firm it may still feel in places.</p>`,
      },
      {
        h2: 'Mold: Cut It Off or Toss the Whole Pear?',
        html: `          <p>Pears fall into a middle category depending on their overall condition. If a pear is still mostly firm and has a single small mold spot, cutting away at least an inch of flesh around and below the mold — similar to the approach for a firm apple — is generally considered acceptable. However, if the pear is already soft throughout, or if you find mold combined with any sign of internal breakdown at the core, the safest choice is to discard the whole pear rather than trying to salvage part of it, since the fruit's structure has already broken down too far to trust a simple trim.</p>`,
      },
      {
        h2: 'Is It Still Safe to Eat?',
        html: `          <p>A pear with a slightly grainy texture and mild softness at the neck, but no mold, no brown mushy core, and no fermented smell, is perfectly safe to eat — this is often just a naturally ripe pear rather than a spoiling one. The signals that mean it's time to toss a pear are mold, softness spreading well beyond the neck, brown mushy flesh at the core, or a fermented smell.</p>`,
      },
      {
        h2: 'How to Pick Good Pears in the First Place',
        html: `          <p>Since most pears are sold underripe on purpose, focus less on firmness at purchase and more on avoiding fruit with visible bruising, punctures, or soft brown spots already present. A pear that feels rock-hard everywhere, including the neck, simply needs time to ripen at home; one with soft spots anywhere besides the neck at the point of purchase may already be past saving by the time it would otherwise ripen.</p>`,
      },
    ],
    faqs: [
      { q: 'How can you tell if a pear has gone bad?', a: 'Look for soft brown mushy spots (especially at the core), a grainy or mealy texture throughout, visible mold, wrinkled skin, and a fermented smell.' },
      { q: 'Why does my pear look fine outside but taste bad inside?', a: 'This is internal breakdown, where the flesh near the core turns brown and mushy before any external sign appears. Cutting the pear open is the most reliable way to check for it.' },
      { q: 'Can you cut mold off a pear and eat the rest?', a: 'Often yes, if the pear is still mostly firm — cut away at least an inch around and below the mold. If the pear is soft throughout or shows internal breakdown, discard the whole thing.' },
      { q: 'Is a grainy pear safe to eat?', a: 'Yes, a naturally grainy texture near the core is normal for pears and not a safety concern, as long as there\'s no mold, mushy browning, or fermented smell.' },
      { q: 'How long do ripe pears take to go bad?', a: 'Ripe pears typically last 2 to 3 weeks in the refrigerator, though the best quality is within the first 3 to 5 days after they reach ripeness.' },
      { q: 'Should I check the neck or the middle to know if a pear has spoiled?', a: 'Check both. The neck softens first as a pear ripens, but if the middle and body are also mushy or the neck has gone well past soft into wet or leaking, the pear has likely spoiled rather than simply ripened.' },
      { q: 'Can a pear look ripe but taste bad?', a: 'Yes, if it has internal breakdown at the core. Cutting the pear open is the most reliable way to catch this, since the outside can look completely normal while the inside has already gone bad.' },
    ],
  },
];

const configs = FRUITS.map(f => ({
  title: `How To Tell If ${f.label} Are Bad`,
  slug: f.spoilageSlug,
  desc: f.desc,
  image: f.image,
  sections: f.sections,
  faqs: f.faqs,
  relatedGuides: [{ href: `/blog/${f.storageSlug}`, label: `How to Store Fresh Picked ${f.label}` }, ...relatedFor(f.spoilageSlug, FRUITS)],
  moreGuides: MORE_GUIDES,
}));

generateGuideSeries(configs);

module.exports = { FRUITS };
