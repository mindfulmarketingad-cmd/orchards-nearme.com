#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'fruits');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const SITE_URL = 'https://orchards-nearme.com';
const PUB_DATE = '2025-07-01';

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-');
}

function tasteChartHtml(ratings) {
  const rows = ratings.map(r => `        <div class="taste-chart-row">
          <span class="taste-chart-label">${r.label}</span>
          <span class="taste-chart-track"><span class="taste-chart-fill" style="width: ${r.score * 10}%;"></span></span>
          <span class="taste-chart-score">${r.score}/10</span>
        </div>`).join('\n');
  return `<div class="taste-chart" role="img" aria-label="Taste profile: ${ratings.map(r => `${r.label} ${r.score} out of 10`).join(', ')}">
${rows}
      </div>`;
}

const FRUITS = [
  {
    label: 'Granny Smith',
    slug: 'granny-smith-apples',
    image: { file: 'apple-orchard-harvest-crate.jpg', alt: 'A crate of harvested apples in an orchard' },
    taste: [
      { label: 'Sweetness', score: 3 },
      { label: 'Tartness', score: 9 },
      { label: 'Crispness', score: 9 },
      { label: 'Juiciness', score: 7 },
    ],
    tasteNote: `Granny Smith is the benchmark for a tart apple — bright, almost lemony acidity up front with very little sweetness to balance it, wrapped in flesh so firm and crisp it practically snaps when you bite in. It's the apple most likely to make first-time tasters pucker, and the one bakers reach for specifically because that sharp acidity holds its own against sugar, cinnamon, and butter rather than disappearing into a dish the way a sweeter apple can.`,
    history: `Granny Smith apples trace back to a single tree grown by Maria Ann Smith, a settler in Eastwood, near Sydney, Australia, around 1868. As the story goes, Smith — known locally as "Granny" Smith — discarded the remains of French crabapples near a creek on her property, and a chance seedling sprouted from the discarded fruit, likely a natural cross involving the European wild apple. The resulting tree produced a distinctly green, tart apple that impressed neighbors enough to propagate and sell locally. Commercial cultivation spread through Australia by the early 1900s, and the variety was exported internationally through the 20th century, eventually becoming one of the most widely grown and recognized apple varieties in the world. Today Granny Smith is grown commercially across the United States, especially in Washington State, as well as in New Zealand, South Africa, and its native Australia, making it one of the few apple varieties with truly global year-round production.`,
    season: `Granny Smith apples are typically harvested in the United States from late September through October, among the later-harvested varieties of the season. Because Granny Smith is also grown extensively in Southern Hemisphere countries like New Zealand, Australia, and South Africa, imported fruit fills the gap during the U.S. off-season, which is part of why Granny Smith is one of the few apple varieties reliably available in grocery stores essentially year-round. That said, fruit picked directly from a U.S. orchard in early-to-mid fall will have noticeably better flavor and crispness than off-season imported stock.`,
    nutrition: `Like other apple varieties, a medium Granny Smith (about 182 grams) contains roughly 95 calories, 25 grams of carbohydrates, and 4.4 grams of dietary fiber, along with about 14% of the daily value for vitamin C. Granny Smith specifically tends to test slightly lower in natural sugar content than sweeter varieties like Fuji or Gala, since its flavor profile leans almost entirely on acidity rather than sugar — this makes it a commonly recommended variety for anyone watching sugar intake while still wanting a satisfying, crisp apple. The skin, which carries a meaningful share of the apple's fiber and antioxidants, is thin enough to eat comfortably without peeling.`,
    uses: `Granny Smith's firm flesh and high acidity make it the standard choice for baking — pies, tarts, and crisps built with Granny Smith hold their shape through cooking rather than turning to mush, and the tartness balances the added sugar in a way a naturally sweet apple can't. It's also a favorite for caramel apples, since the acidity cuts through the sweetness of the coating, and for savory applications like slaws and salads, where its crunch and sharpness stand up well against dressings and other bold flavors. Fresh eating is a matter of taste — some people love the sharp bite, while others find it too tart on its own without a dip of caramel or peanut butter.`,
    growing: `Granny Smith trees perform best in warm-summer growing regions with a long frost-free season, which is part of why Washington State, California, and Virginia are major U.S. production areas alongside significant orchards in Australia, New Zealand, South Africa, and Chile. Because Granny Smith requires more heat to ripen fully than many other varieties, it's less commonly grown in the cooler apple-growing regions of the Northeast and upper Midwest compared to cold-hardy varieties like McIntosh. Its year-round global availability is largely a function of Southern Hemisphere growers harvesting during the U.S. off-season, allowing constant supply through coordinated international production.`,
    comparison: `Compared to sweeter varieties like Fuji, Gala, or Honeycrisp, Granny Smith sits at the opposite end of the flavor spectrum entirely — where those apples lead with sugar, Granny Smith leads with acid, and its sweetness score barely registers by comparison. It's most similar in overall firmness to Honeycrisp, though the two taste nothing alike, since Honeycrisp balances its crunch with real sweetness while Granny Smith stays sharply tart throughout. For anyone deciding between varieties at the store, Granny Smith is the clearest choice whenever a recipe or personal preference calls for tartness over sweetness.`,
    faqs: [
      { q: 'What does a Granny Smith apple taste like?', a: 'Granny Smith apples are notably tart and only mildly sweet, with very firm, crisp flesh. They\'re often described as having a bright, almost lemony acidity.' },
      { q: 'Are Granny Smith apples good for baking?', a: 'Yes — Granny Smith is one of the most recommended baking apples because its firm flesh holds its shape when cooked and its tartness balances the added sugar in pies and other baked goods.' },
      { q: 'When are Granny Smith apples in season?', a: 'In the United States, Granny Smith apples are typically harvested from late September through October, though imported fruit from the Southern Hemisphere keeps them available nearly year-round.' },
      { q: 'Where did Granny Smith apples come from?', a: 'Granny Smith apples originated from a chance seedling grown by Maria Ann Smith near Sydney, Australia, around 1868.' },
      { q: 'Where are Granny Smith apples grown today?', a: 'Major production regions include Washington State, California, and Virginia in the U.S., along with Australia, New Zealand, South Africa, and Chile internationally.' },
      { q: 'Is Granny Smith a good apple for people who dislike sweet apples?', a: 'Yes. Granny Smith is one of the tartest widely available apple varieties, making it a good choice for anyone who prefers a sharp, acidic flavor over a sweet one.' },
    ],
  },
  {
    label: 'McIntosh',
    slug: 'mcintosh-apples',
    image: { file: 'apple-picking-family-orchard.jpg', alt: 'A family picking apples together in an orchard' },
    taste: [
      { label: 'Sweetness', score: 6 },
      { label: 'Tartness', score: 6 },
      { label: 'Crispness', score: 5 },
      { label: 'Juiciness', score: 7 },
    ],
    tasteNote: `McIntosh strikes a genuine balance between sweet and tart, without leaning hard in either direction the way a Granny Smith or Fuji does. Its flesh is softer than most modern eating apples, with a tender bite rather than a hard crunch, and a fragrant, slightly perfumed flavor that's earned it a loyal following, especially in the Northeastern United States and Canada where it's grown extensively.`,
    history: `The McIntosh apple was discovered in 1811 by John McIntosh, a farmer in Dundela, Ontario, Canada, who found several young apple seedlings while clearing land on his property and transplanted them near his home rather than destroying them along with the rest of the cleared brush. One seedling produced fruit distinct enough that McIntosh began propagating it, and his son Allan later took over grafting and distributing the variety more widely starting in the 1830s. The original McIntosh tree reportedly survived until 1908, nearly a century after its discovery. The variety became a major commercial apple through the 20th century, particularly in eastern Canada and the northeastern United States, where its cold-hardiness suits the climate well, and it remains one of the most widely planted apple varieties in that region today.`,
    season: `McIntosh apples are harvested in the United States and Canada from early-to-mid September through early October, making it one of the earlier fall apple varieties available. Because McIntosh doesn't store quite as long as firmer, later-season varieties like Fuji or Granny Smith, fresh McIntosh is very much a fall-season fruit, with quality declining faster than many other varieties if held too long in storage — all the more reason to pick your own or buy it fresh during its relatively short peak window each September and October.`,
    nutrition: `A medium McIntosh apple provides roughly the same baseline nutrition as most apple varieties: about 95 calories, 25 grams of carbohydrates, 4 grams of fiber, and a solid dose of vitamin C, all packed into a fruit with essentially no fat or sodium. McIntosh's slightly higher moisture content compared to firmer varieties makes it a particularly hydrating snack choice, and its balanced sugar-acid profile means it doesn't carry the very high sugar content of some of the sweetest dessert varieties.`,
    uses: `McIntosh's soft, juicy flesh breaks down readily when cooked, which makes it an excellent choice for applesauce and apple butter — far better suited to those uses than firmer varieties that hold their shape too well to break into a smooth sauce. It's also a traditional choice for cider pressing, since its juice is flavorful and its softness makes it easy to process. For baking pies specifically, McIntosh is sometimes blended with a firmer variety like Granny Smith, since McIntosh alone can turn quite mushy in a pie, while the blend gets both good flavor and better texture. Fresh eating is very much a matter of preference — those who like a softer, more tender apple tend to prefer McIntosh strongly over crisper modern varieties.`,
    growing: `McIntosh thrives in the cold-winter climates of eastern Canada and the northeastern United States, with major production in Ontario, Quebec, New York, Michigan, and New England. Its excellent cold hardiness, a trait passed down to many of its descendant varieties, makes it especially well suited to regions with harsh winters that would damage less hardy apple trees. McIntosh remains one of the most widely planted apple varieties in eastern Canada specifically, where it has strong cultural significance as a homegrown, historically important variety rather than a newer commercial import.`,
    comparison: `McIntosh's soft texture sets it apart clearly from firmer modern varieties like Honeycrisp, Fuji, or Granny Smith, all of which prioritize a hard, crisp bite that McIntosh simply doesn't have. Its balanced sweet-tart flavor lands closest to Gala among the varieties covered here, though McIntosh's texture is noticeably softer and its flavor a touch more tart. McIntosh is also notable as a genetic ancestor of several other well-known varieties, including Cortland and Empire, both bred using McIntosh parentage to preserve some of its flavor while improving on its texture and storage life.`,
    faqs: [
      { q: 'What does a McIntosh apple taste like?', a: 'McIntosh apples have a balanced sweet-tart flavor with soft, tender flesh, distinct from the very crisp texture of newer apple varieties like Honeycrisp or Fuji.' },
      { q: 'Are McIntosh apples good for baking?', a: 'McIntosh works well for applesauce and cider because it breaks down easily when cooked. For pies, it\'s often blended with a firmer variety since McIntosh alone can turn quite soft.' },
      { q: 'When are McIntosh apples in season?', a: 'McIntosh apples are typically harvested from early-to-mid September through early October, one of the earlier varieties of the fall apple season.' },
      { q: 'Where did the McIntosh apple originate?', a: 'The McIntosh apple was discovered in 1811 by John McIntosh on his farm in Dundela, Ontario, Canada, from a chance seedling found while clearing land.' },
      { q: 'Where are McIntosh apples grown today?', a: 'McIntosh is grown extensively in Ontario, Quebec, New York, Michigan, and New England, all regions with the cold winters that suit the variety\'s excellent hardiness.' },
      { q: 'Does McIntosh store as well as other apple varieties?', a: 'No. McIntosh has a shorter storage life than firmer, later-season varieties like Fuji or Granny Smith, so it\'s best enjoyed fresh during its fall harvest window.' },
      { q: 'What varieties were bred from McIntosh?', a: 'McIntosh has been used as a parent variety for several well-known apples, including Cortland and Empire, both bred to build on its flavor while improving texture and storage life.' },
    ],
  },
  {
    label: 'Fuji',
    slug: 'fuji-apples',
    image: { file: 'apple-picking-kids-orchard.jpg', alt: 'Kids picking apples in an orchard' },
    taste: [
      { label: 'Sweetness', score: 9 },
      { label: 'Tartness', score: 2 },
      { label: 'Crispness', score: 8 },
      { label: 'Juiciness', score: 8 },
    ],
    tasteNote: `Fuji apples are among the sweetest widely available apple varieties, with very low acidity and a dense, crisp bite that holds up well over time in storage. The flavor is straightforwardly sugary rather than complex or tart, which is exactly why Fuji has become one of the best-selling apples for fresh eating, especially with people who want maximum sweetness and minimal tartness.`,
    history: `Fuji apples were developed at the Tohoku Research Station in Fujisaki, Aomori Prefecture, Japan, starting in the late 1930s, through a cross between the American Red Delicious and an old American variety called Ralls Janet. The cross was made in 1939, but the resulting variety wasn't released commercially until 1962, after more than two decades of testing and evaluation, a testament to how much patience apple breeding requires since new trees take years to mature and fruit. The name Fuji comes from the research station's location in Fujisaki, not directly from Mount Fuji as many assume. Fuji apples were introduced to the United States in the 1980s and quickly became popular for their exceptional sweetness and long storage life, eventually becoming one of the most widely grown apple varieties in the world, including major production regions in China, the U.S. Pacific Northwest, and Japan.`,
    season: `Fuji apples are one of the later-harvested varieties, typically picked in the United States from early-to-mid October through November. Fuji's dense flesh and low moisture loss give it one of the longest storage lives of any common apple variety — properly refrigerated Fuji apples can maintain good quality for several months, which is part of why they remain widely available in grocery stores well beyond their actual harvest season.`,
    nutrition: `A medium Fuji apple contains roughly 100 to 115 calories, slightly higher than some other varieties due to its higher natural sugar content, along with about 25 to 28 grams of carbohydrates and a good source of fiber and vitamin C. Because Fuji is one of the sweeter apple varieties, it also tends to have a higher natural sugar content than tarter apples like Granny Smith, which is worth keeping in mind for anyone monitoring sugar intake closely, though it remains a whole, fiber-rich fruit rather than an added-sugar food.`,
    uses: `Fuji's sweetness and crisp texture make it primarily a fresh-eating apple — it's a popular choice for lunchboxes, snacking, and fruit salads specifically because of its reliable sweetness and satisfying crunch. It holds its shape reasonably well when baked, though its low acidity means baked dishes made purely with Fuji can taste one-dimensionally sweet without a tarter variety blended in for balance. Fuji is also a good choice for fresh apple slices served with dips, since its dense flesh browns somewhat more slowly than softer varieties once cut.`,
    growing: `Fuji is grown extensively in China, which produces more Fuji apples than any other country by a wide margin, as well as in the United States — particularly Washington State — and in its native Japan. Fuji trees require a fairly long growing season to develop their full sweetness, which suits regions with warm, sunny falls. Its outstanding storage life has also made it a favorite for growers, since the fruit can be held in cold storage for months after harvest without major quality loss, supporting steady retail availability well beyond the actual harvest season.`,
    comparison: `Fuji and Gala are often compared since both are reliably sweet, low-acid, crowd-pleasing apples, but Fuji is noticeably sweeter and denser, while Gala has a lighter, less intense flavor and a slightly softer bite. Against Ambrosia, another very sweet, low-acid variety, Fuji is generally crisper and more widely available, though Ambrosia edges it out slightly in pure sweetness for those who find even Fuji not sweet enough. Compared to Honeycrisp, Fuji is sweeter overall but lacks the extreme, explosive crispness that makes Honeycrisp so distinctive.`,
    faqs: [
      { q: 'What does a Fuji apple taste like?', a: 'Fuji apples are very sweet with low acidity and a dense, crisp texture, making them one of the sweetest widely available apple varieties.' },
      { q: 'Are Fuji apples good for baking?', a: 'Fuji apples hold their shape reasonably well when baked, but their low acidity means dishes made purely with Fuji can taste one-dimensionally sweet unless blended with a tarter variety.' },
      { q: 'When are Fuji apples in season?', a: 'Fuji apples are typically harvested from early-to-mid October through November, one of the later varieties of the fall apple season.' },
      { q: 'Where did Fuji apples come from?', a: 'Fuji apples were developed in Fujisaki, Japan, starting in 1939, through a cross of Red Delicious and Ralls Janet apples, and released commercially in 1962.' },
      { q: 'Where are Fuji apples grown today?', a: 'China is the largest producer of Fuji apples worldwide, with significant production also in Washington State and Japan.' },
      { q: 'Why do Fuji apples last so long in storage?', a: 'Fuji\'s dense flesh and low moisture loss give it one of the longest storage lives of any common apple variety, often lasting several months under proper refrigeration.' },
      { q: 'Does the name Fuji come from Mount Fuji?', a: 'No, despite the common assumption. The name comes from Fujisaki, the town in Japan\'s Aomori Prefecture where the research station that developed the variety is located.' },
    ],
  },
  {
    label: 'Gala',
    slug: 'gala-apples',
    image: { file: 'apple-basket-farm-stand.webp', alt: 'A basket of freshly picked apples at a farm stand' },
    taste: [
      { label: 'Sweetness', score: 7 },
      { label: 'Tartness', score: 3 },
      { label: 'Crispness', score: 6 },
      { label: 'Juiciness', score: 6 },
    ],
    tasteNote: `Gala apples are mildly sweet with just a touch of tartness in the background, and a texture that's crisp without being as dense or hard as a Fuji or Honeycrisp. The overall effect is an easygoing, approachable apple — pleasant and reliably sweet without being intensely flavored in either direction, which is a big part of why it's such a popular everyday eating apple for kids and adults alike.`,
    history: `Gala apples originated in New Zealand, developed by orchardist J.H. Kidd in the 1930s through a cross of Golden Delicious and Kidd's Orange Red, itself a cross involving Cox's Orange Pippin. The variety was selected and refined over subsequent decades and introduced commercially in New Zealand before spreading internationally starting in the 1970s and 1980s. Gala reached the United States in the early 1970s and grew steadily in popularity through the following decades, eventually becoming one of the most widely planted apple varieties in the country. Its combination of reliable sweetness, attractive red-striped coloring, and relatively easy growing characteristics made it a favorite among both commercial growers and home orchardists.`,
    season: `Gala apples are among the earliest fall apple varieties to reach harvest, typically picked in the United States from early-to-mid August through September. This early harvest window means Gala is often the first "new crop" apple variety available each year, appearing in orchards and farm stands well before most other fall varieties are ready.`,
    nutrition: `A medium Gala apple provides approximately 90 to 100 calories, around 22 to 25 grams of carbohydrates, roughly 4 grams of fiber, and a meaningful dose of vitamin C, in line with typical apple nutrition overall. Gala's moderate sugar content sits between very tart varieties like Granny Smith and very sweet ones like Fuji, making it a reasonably balanced choice nutritionally as well as in flavor.`,
    uses: `Gala's mild sweetness and manageable crispness make it a strong all-purpose eating apple, popular for snacking, lunchboxes, and fruit salads where its approachable flavor appeals broadly. It's a common choice for applesauce as well, since its flesh softens reasonably well when cooked without becoming as mushy as McIntosh. For pies and baked dishes, Gala can work in a pinch but is generally considered a lesser choice than firmer, tarter varieties, since its subtle flavor can get lost under sugar and spice, and its texture holds up less well than a dedicated baking apple like Granny Smith.`,
    growing: `Gala is grown widely across the United States, with Washington State as the leading domestic producer, alongside significant orchards in Michigan, New York, and Pennsylvania. It's also grown extensively in New Zealand, its country of origin, as well as in Chile and other Southern Hemisphere countries that supply the U.S. market during the domestic off-season. Gala trees are relatively easy to grow and productive compared to some finickier varieties, which has helped it become one of the most widely planted apple varieties in the world.`,
    comparison: `Gala sits toward the milder end of the flavor spectrum compared to the other varieties on this list — sweeter and less tart than Granny Smith or McIntosh, but noticeably less intensely sweet and less crisp than Fuji, Ambrosia, or Honeycrisp. That middle-of-the-road profile is exactly why Gala has such broad appeal: it's an easy, unobjectionable apple that rarely surprises anyone, making it a common default choice in grocery stores and school lunches even among people who haven't given much thought to apple varieties at all.`,
    faqs: [
      { q: 'What does a Gala apple taste like?', a: 'Gala apples are mildly sweet with a hint of tartness and a moderately crisp texture, making them an approachable, easy-to-eat apple variety.' },
      { q: 'Are Gala apples good for baking?', a: 'Gala can work for baking in a pinch, but its mild flavor and moderate texture make it a lesser choice compared to firmer, tarter varieties like Granny Smith.' },
      { q: 'When are Gala apples in season?', a: 'Gala apples are typically harvested from early-to-mid August through September, making them one of the earliest fall apple varieties available.' },
      { q: 'Where did Gala apples originate?', a: 'Gala apples originated in New Zealand, developed by orchardist J.H. Kidd in the 1930s through a cross of Golden Delicious and Kidd\'s Orange Red.' },
      { q: 'Where are Gala apples grown today?', a: 'Washington State is the leading U.S. producer, with additional significant production in Michigan, New York, Pennsylvania, New Zealand, and Chile.' },
      { q: 'Why is Gala one of the most common grocery store apples?', a: 'Gala trees are relatively easy to grow and productive, and the apple\'s mild, approachable flavor appeals broadly, making it a reliable, high-volume commercial variety.' },
      { q: 'Is Gala a good apple for kids?', a: 'Yes. Gala\'s mild sweetness, manageable crispness, and lack of sharp tartness make it one of the more popular apple choices for kids and picky eaters.' },
      { q: 'Is Gala related to Honeycrisp?', a: 'No, they have separate breeding histories. Gala descends from Golden Delicious and Kidd\'s Orange Red in New Zealand, while Honeycrisp was bred independently at the University of Minnesota.' },
    ],
  },
  {
    label: 'Ambrosia',
    slug: 'ambrosia-apples',
    image: { file: 'apple-orchard-harvest-crate.jpg', alt: 'A crate of harvested apples in an orchard' },
    taste: [
      { label: 'Sweetness', score: 8 },
      { label: 'Tartness', score: 2 },
      { label: 'Crispness', score: 7 },
      { label: 'Juiciness', score: 7 },
    ],
    tasteNote: `Ambrosia apples are prized for a honey-like sweetness with very low acidity, giving them a soft, mellow flavor rather than any sharp or tangy edge. The flesh is crisp and fine-grained, and the low-acid profile is exactly what its name promises — a smooth, almost dessert-like eating experience without any of the tartness common in many other varieties.`,
    history: `Ambrosia apples were discovered as a chance seedling in the 1990s on the British Columbia, Canada orchard of Wilfrid and Sally Mennell, who noticed an unusual, unlabeled tree producing distinctive fruit growing among their Jonagold trees. Genetic testing later suggested the variety likely arose from a cross involving Golden Delicious, though its exact parentage was never conclusively confirmed since it appeared as a natural seedling rather than a deliberate breeding cross. The Mennell family propagated and trademarked the variety, and it was released commercially in the early 1990s. Ambrosia has since grown in popularity, particularly in Canada and the Pacific Northwest, prized specifically for its low acidity and honeyed sweetness, and it remains a relatively newer, premium variety compared to century-old cultivars like McIntosh or Granny Smith.`,
    season: `Ambrosia apples are typically harvested in the United States and Canada from mid-September through October, placing it among the mid-to-late-season varieties. Because Ambrosia is still a relatively newer and more specialized variety compared to mass-market apples, availability can be more limited and regional compared to ubiquitous varieties like Gala or Fuji, though it has expanded significantly since its commercial introduction.`,
    nutrition: `A medium Ambrosia apple contains roughly 95 to 105 calories, around 24 to 26 grams of carbohydrates, and a solid amount of dietary fiber and vitamin C, generally in line with other apple varieties. Its very low acidity and pronounced sweetness mean it carries a comparatively higher natural sugar content than tart varieties, similar to Fuji, though it remains a nutrient-dense whole fruit choice rather than a significant sugar contributor in a normal diet.`,
    uses: `Ambrosia's sweetness and low acidity make it best suited to fresh eating, where its honeyed flavor can be fully appreciated without competition from added sugar or spice. It's a popular choice for fruit platters, lunchboxes, and snacking specifically because of its mellow, crowd-pleasing flavor. Baking with Ambrosia is less common, since its low acidity means baked dishes can taste flat or overly sweet without a tarter variety blended in, and its premium price point compared to mass-market varieties also makes it a less practical everyday baking choice.`,
    growing: `Ambrosia is grown primarily in British Columbia, Canada, its place of origin, as well as in Washington State and other parts of the U.S. Pacific Northwest where growing conditions are similar. Because it remains a trademarked, more specialized variety compared to century-old cultivars, Ambrosia production is more concentrated among growers licensed to plant it rather than spread as broadly as ubiquitous varieties like Gala or Red Delicious, which contributes to its somewhat more limited and regional availability along with its premium pricing.`,
    comparison: `Ambrosia and Fuji are the two sweetest, lowest-acid varieties on this list, and taste testers often find them genuinely difficult to tell apart in a blind comparison, though Ambrosia tends to edge out Fuji slightly in perceived sweetness and has a somewhat finer, less dense flesh. Compared to Gala, Ambrosia is meaningfully sweeter and less tart, and compared to tart varieties like Granny Smith, there's essentially no overlap in flavor profile at all. Ambrosia's main practical distinction from its sweet-apple rivals is availability and price, since it remains a newer, more regionally limited variety.`,
    faqs: [
      { q: 'What does an Ambrosia apple taste like?', a: 'Ambrosia apples have a honey-like sweetness with very low acidity, giving them a mellow, smooth flavor without the tartness common in many other apple varieties.' },
      { q: 'Are Ambrosia apples good for baking?', a: 'Ambrosia is better suited to fresh eating than baking, since its low acidity can make baked dishes taste flat or overly sweet without a tarter apple blended in.' },
      { q: 'When are Ambrosia apples in season?', a: 'Ambrosia apples are typically harvested from mid-September through October, placing them among the mid-to-late-season apple varieties.' },
      { q: 'Where did Ambrosia apples come from?', a: 'Ambrosia apples were discovered as a chance seedling in the 1990s on a British Columbia, Canada orchard owned by the Mennell family.' },
      { q: 'Where are Ambrosia apples grown today?', a: 'Ambrosia is grown primarily in British Columbia, Canada, and in Washington State and other parts of the U.S. Pacific Northwest.' },
      { q: 'Why are Ambrosia apples harder to find than other varieties?', a: 'Ambrosia is a trademarked, more specialized variety grown by licensed producers, which makes it more regionally concentrated and less widely available than mass-market apples like Gala or Fuji.' },
      { q: 'Is Ambrosia a good apple for people who dislike tart flavors?', a: 'Yes. Ambrosia\'s very low acidity and pronounced honeyed sweetness make it one of the best choices available for anyone who prefers apples with essentially no tartness at all.' },
      { q: 'Was Ambrosia bred deliberately or discovered by accident?', a: 'It was discovered by accident, as a chance seedling growing unexpectedly among Jonagold trees on a British Columbia orchard, rather than the result of a deliberate breeding program.' },
    ],
  },
  {
    label: 'Honeycrisp',
    slug: 'honeycrisp-apples',
    image: { file: 'apple-picking-family-orchard.jpg', alt: 'A family picking apples together in an orchard' },
    taste: [
      { label: 'Sweetness', score: 7 },
      { label: 'Tartness', score: 4 },
      { label: 'Crispness', score: 10 },
      { label: 'Juiciness', score: 9 },
    ],
    tasteNote: `Honeycrisp is famous above all for its texture — an explosively crisp, juicy bite unlike almost any other apple variety, the result of unusually large cell structure that shatters cleanly with each bite rather than compressing the way most apples do. The flavor is well-balanced between sweet and tart, but it's the extreme crispness and juiciness that have made Honeycrisp a favorite, often commanding a noticeably higher price than other varieties as a result.`,
    history: `Honeycrisp was developed by the University of Minnesota's apple breeding program, with crosses made in 1960 as part of a long-running effort to develop cold-hardy apple varieties suited to Minnesota's harsh winters. The specific cross that produced Honeycrisp was originally thought to involve Macoun and Honeygold, though later genetic testing revealed its actual parentage was different, tracing to Keepsake and an unreleased breeding selection. Breeder David Bedford and the University of Minnesota team evaluated the seedling for decades before releasing it commercially in 1991. Honeycrisp's exceptional texture caught on quickly with consumers, and it went on to become one of the most commercially successful apple varieties introduced in the past half-century, eventually named Minnesota's state fruit and spawning several newer varieties bred from its genetics, including SweeTango and Cosmic Crisp.`,
    season: `Honeycrisp apples are typically harvested in the United States from early-to-mid September through late September, a relatively narrow window compared to some other varieties. Honeycrisp trees are also notoriously difficult to grow well — they're susceptible to certain physiological disorders and require careful management — which contributes to Honeycrisp's characteristically higher retail price compared to more easily grown varieties like Gala or Fuji.`,
    nutrition: `A medium Honeycrisp apple contains approximately 95 to 110 calories, about 24 to 27 grams of carbohydrates, and a good amount of fiber and vitamin C, broadly similar to other apple varieties nutritionally. Its balanced sugar-acid profile places it between very tart and very sweet varieties, and its high water content — part of what gives it that famous juicy crunch — also makes it a particularly hydrating and refreshing fruit choice.`,
    uses: `Honeycrisp is overwhelmingly a fresh-eating apple, prized specifically for a texture that's largely wasted once cooked, since baking softens the very crispness that makes the variety special in the first place. It's an excellent choice for fruit platters, lunchboxes, and salads where that signature crunch stands out. Some bakers do use Honeycrisp in pies for its balanced flavor, though given its premium price, many reserve it for fresh eating and use a more affordable, traditionally firm baking apple like Granny Smith for cooked applications instead.`,
    growing: `Honeycrisp is grown extensively across the northern United States and Canada, with Washington State, Michigan, New York, and Minnesota — home of the University breeding program that created it — all significant production regions. Its cold hardiness, inherited from its Minnesota breeding program roots, suits it well to northern climates, though the tree's susceptibility to certain physiological disorders and its demanding management requirements mean yields can be less consistent than hardier, easier-to-grow varieties, a major factor behind its higher retail price nationwide.`,
    comparison: `Honeycrisp stands apart from every other variety on this list primarily on texture rather than flavor — its crispness and juiciness score higher than Fuji, Gala, Ambrosia, McIntosh, or Granny Smith, even though its actual sweetness and tartness levels land in a fairly middle-of-the-road range similar to Gala. In other words, Honeycrisp isn't the sweetest or the tartest apple around, but it's widely considered the crispest and juiciest, which is the entire basis of its popularity and its price premium over more traditional varieties.`,
    faqs: [
      { q: 'What does a Honeycrisp apple taste like?', a: 'Honeycrisp apples have a balanced sweet-tart flavor, but they\'re best known for an extremely crisp, juicy texture unlike most other apple varieties.' },
      { q: 'Are Honeycrisp apples good for baking?', a: 'Honeycrisp can be baked, but its famous crisp texture is largely lost once cooked, and its higher price makes many bakers choose a more affordable variety like Granny Smith for baked dishes.' },
      { q: 'When are Honeycrisp apples in season?', a: 'Honeycrisp apples are typically harvested from early-to-mid September through late September, a relatively narrow harvest window.' },
      { q: 'Why are Honeycrisp apples more expensive than other varieties?', a: 'Honeycrisp trees are notoriously difficult to grow, susceptible to certain physiological disorders, and require more careful orchard management, which drives up production costs compared to easier-to-grow varieties.' },
      { q: 'Where are Honeycrisp apples grown today?', a: 'Major growing regions include Washington State, Michigan, New York, and Minnesota, where the variety was originally developed by the University of Minnesota.' },
      { q: 'What other apple varieties were bred from Honeycrisp?', a: 'Honeycrisp\'s genetics have been used to develop newer varieties including SweeTango and Cosmic Crisp, both aiming to capture similar crisp, juicy characteristics.' },
      { q: 'Is Honeycrisp Minnesota\'s official state fruit?', a: 'Yes. Honeycrisp was named Minnesota\'s official state fruit, reflecting its origin at the University of Minnesota\'s apple breeding program and its outsized commercial success.' },
      { q: 'How long did it take to develop Honeycrisp?', a: 'The original cross was made in 1960, but Honeycrisp wasn\'t released commercially until 1991, illustrating how many years of evaluation apple breeding typically requires.' },
    ],
  },
];

function otherVarietiesHtml(currentSlug) {
  return FRUITS.filter(f => f.slug !== currentSlug)
    .map(f => `          <li><a href="/fruits/${f.slug}">${f.label} Apples</a></li>`)
    .join('\n');
}

function generateVarietyPage(fruit) {
  const title = `${fruit.label} Apples - Taste, Information and Facts`;
  const canonical = `${SITE_URL}/fruits/${fruit.slug}`;
  const imageUrl = `${SITE_URL}/images/blog/${fruit.image.file}`;
  const desc = `${fruit.label} apples ${fruit.tasteNote.split('.')[0].replace(/^[A-Z][a-z]+ [A-Za-z]+ (is|are)/, 'are').toLowerCase().startsWith('are') ? '' : ''}${fruit.tasteNote.split('.')[0]}. Learn about ${fruit.label} apple taste, history, season, nutrition, and best uses.`;

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": desc,
    "image": imageUrl,
    "url": canonical,
    "datePublished": PUB_DATE,
    "dateModified": PUB_DATE,
    "author": { "@type": "Organization", "name": "Orchards Near Me", "url": SITE_URL },
    "publisher": { "@type": "Organization", "name": "Orchards Near Me", "url": SITE_URL },
    "mainEntityOfPage": { "@type": "WebPage", "@id": canonical },
  }, null, 2);

  const faqJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": fruit.faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    })),
  }, null, 2);

  const faqHtml = fruit.faqs.map(f => `          <details class="faq-item">
            <summary>${f.q}</summary>
            <div class="faq-answer">
              <p>${f.a}</p>
            </div>
          </details>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-3CMJFS74HE"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-3CMJFS74HE');
  </script>

  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${desc.replace(/"/g, '&quot;')}" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />
  <meta property="og:description" content="${desc.replace(/"/g, '&quot;')}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="article:published_time" content="${PUB_DATE}" />

  <link rel="icon" href="/logo.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/css/style.css" />
  <script type="application/ld+json">
${jsonLd}
  </script>
  <script type="application/ld+json">
${faqJsonLd}
  </script>
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9332749804326149" crossorigin="anonymous"></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <button id="backToTop" class="back-to-top" type="button" tabindex="-1" aria-label="Back to top">&#8593;</button>
  <header class="site-header">
    <div class="container">
      <a class="brand" href="/" aria-label="Orchards Near Me home">
        <img src="/logo.svg" alt="" class="logo-icon" />
        Orchards Near Me
      </a>
      <nav class="main-nav" aria-label="Primary">
        <a href="/">Home</a>
        <a href="/about.html">About</a>
        <a href="/blog">Blog</a>
        <a href="/fruits">Fruits</a>
        <a href="/find" class="cta">Find</a>
      </nav>
    </div>
  </header>

  <main id="main" class="page">
    <div class="container">

      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true"> &rsaquo; </span>
        <a href="/fruits">Fruits</a>
        <span aria-hidden="true"> &rsaquo; </span>
        <span aria-current="page">${fruit.label} Apples</span>
      </nav>

      <article class="blog-post">
        <header class="blog-post-header">
          <h1>${title}</h1>
          <p class="blog-post-meta"><time datetime="${PUB_DATE}">July 1, 2025</time> &middot; Orchards Near Me</p>
          <img class="blog-post-featured-image" src="/images/blog/${fruit.image.file}" alt="${fruit.image.alt}" loading="lazy" width="1200" height="675" />
        </header>

        <div class="blog-post-body">
          <h2>Taste Profile</h2>
          <p>${fruit.tasteNote}</p>
          ${tasteChartHtml(fruit.taste)}

          <h2>History of ${fruit.label} Apples</h2>
          <p>${fruit.history}</p>

          <h2>Season and Availability</h2>
          <p>${fruit.season}</p>

          <h2>Nutritional Value</h2>
          <p>${fruit.nutrition}</p>

          <h2>Best Uses for ${fruit.label} Apples</h2>
          <p>${fruit.uses}</p>

          <h2>Where ${fruit.label} Apples Are Grown Today</h2>
          <p>${fruit.growing}</p>

          <h2>How ${fruit.label} Compares to Other Apple Varieties</h2>
          <p>${fruit.comparison}</p>

          <h2>How to Choose and Store ${fruit.label} Apples</h2>
          <p>Choose ${fruit.label} apples that feel firm with no give when pressed, and check for smooth skin free of soft spots, bruising, or shriveling. Once home, store them in the refrigerator crisper drawer, ideally in a perforated bag, where they'll keep for 4 to 6 weeks — far longer than the roughly one week they'll last at room temperature. For a full breakdown of apple storage, see our guide on <a href="/blog/how-to-store-fresh-picked-apples">how to store fresh picked apples</a>, and if you're ever unsure whether an apple has gone bad, check our guide on <a href="/blog/how-to-tell-if-apples-are-bad">how to tell if apples are bad</a>.</p>

          <h2>Frequently Asked Questions</h2>
          <div class="faq-list">
${faqHtml}
          </div>
        </div>
      </article>

      <section class="related-links seo-content" style="padding-top: 0;">
        <h2>Other Apple Varieties</h2>
        <ul class="related-links-list">
${otherVarietiesHtml(fruit.slug)}
        </ul>
      </section>

      <section class="related-links seo-content" style="padding-top: 0;">
        <h2>More From Orchards Near Me</h2>
        <ul class="related-links-list">
          <li><a href="/fruits">All Fruit Varieties</a></li>
          <li><a href="/find/apple-picking-orchards-near-me">Apple Picking Orchards Near Me</a></li>
          <li><a href="/blog/how-to-store-fresh-picked-apples">How to Store Fresh Picked Apples</a></li>
          <li><a href="/blog">All Picking Season Guides</a></li>
        </ul>
        <p class="related-links-all"><a href="/find">Browse all orchards and farms by state</a></p>
      </section>

    </div>
  </main>

  <footer class="site-footer">
    <div class="container">
      <ul class="footer-nav">
        <li><a href="/">Home</a></li>
        <li><a href="/about.html">About</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/contact.html">Contact</a></li>
        <li><a href="/claim.html">Claim Your Listing</a></li>
        <li><a href="/disclaimer.html">Disclaimer</a></li>
        <li><a href="/privacy.html">Privacy</a></li>
        <li><a href="/terms.html">Terms</a></li>
        <li><a href="/sitemap.html">Sitemap</a></li>
      </ul>
      <div class="footer-bottom">
        <p>Orchards Near Me &mdash; your friendly guide to orchards, farms, and garden centers across the USA. &copy; <span id="year"></span> orchards-nearme.com</p>
      </div>
    </div>
  </footer>
  <script>document.getElementById('year').textContent = new Date().getFullYear();</script>
  <script>(function(){var b=document.getElementById('backToTop');if(!b)return;window.addEventListener('scroll',function(){var s=window.scrollY>600;b.classList.toggle('visible',s);b.tabIndex=s?0:-1;});b.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});})();</script>
</body>
</html>`;
}

function generateHubPage() {
  const cards = FRUITS.map(f => `        <a class="blog-card" href="/fruits/${f.slug}">
          <h3 class="blog-card-title">${f.label} Apples</h3>
          <p class="blog-card-meta">Taste, Information and Facts</p>
          <p class="blog-card-excerpt">${f.tasteNote.split('.')[0]}.</p>
          <span class="blog-card-cta">Read more &rarr;</span>
        </a>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-3CMJFS74HE"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-3CMJFS74HE');
  </script>

  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Fruit Varieties | Orchards Near Me</title>
  <meta name="description" content="Explore fruit varieties in depth — taste profiles, history, season and availability, nutrition, and best uses for popular apple varieties and more." />
  <link rel="canonical" href="https://orchards-nearme.com/fruits" />
  <meta property="og:title" content="Fruit Varieties | Orchards Near Me" />
  <meta property="og:description" content="Explore fruit varieties in depth — taste, history, season, nutrition, and best uses." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://orchards-nearme.com/fruits" />

  <link rel="icon" href="/logo.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/css/style.css" />
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9332749804326149" crossorigin="anonymous"></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <button id="backToTop" class="back-to-top" type="button" tabindex="-1" aria-label="Back to top">&#8593;</button>
  <header class="site-header">
    <div class="container">
      <a class="brand" href="/" aria-label="Orchards Near Me home">
        <img src="/logo.svg" alt="" class="logo-icon" />
        Orchards Near Me
      </a>
      <nav class="main-nav" aria-label="Primary">
        <a href="/">Home</a>
        <a href="/about.html">About</a>
        <a href="/blog">Blog</a>
        <a href="/fruits" class="active">Fruits</a>
        <a href="/find" class="cta">Find</a>
      </nav>
    </div>
  </header>

  <main id="main" class="page">
    <div class="container">
      <h1>Fruit Varieties</h1>
      <p class="lead">Deep dives into specific fruit varieties — taste profiles, history, season and availability, nutrition, and the best uses for each one.</p>

      <h2 class="blog-region-heading">Apple Varieties</h2>
      <div class="blog-grid">
${cards}
      </div>
    </div>
  </main>

  <footer class="site-footer">
    <div class="container">
      <ul class="footer-nav">
        <li><a href="/">Home</a></li>
        <li><a href="/about.html">About</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/contact.html">Contact</a></li>
        <li><a href="/claim.html">Claim Your Listing</a></li>
        <li><a href="/disclaimer.html">Disclaimer</a></li>
        <li><a href="/privacy.html">Privacy</a></li>
        <li><a href="/terms.html">Terms</a></li>
        <li><a href="/sitemap.html">Sitemap</a></li>
      </ul>
      <div class="footer-bottom">
        <p>Orchards Near Me &mdash; your friendly guide to orchards, farms, and garden centers across the USA. &copy; <span id="year"></span> orchards-nearme.com</p>
      </div>
    </div>
  </footer>
  <script>document.getElementById('year').textContent = new Date().getFullYear();</script>
  <script>(function(){var b=document.getElementById('backToTop');if(!b)return;window.addEventListener('scroll',function(){var s=window.scrollY>600;b.classList.toggle('visible',s);b.tabIndex=s?0:-1;});b.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});})();</script>
</body>
</html>`;
}

for (const fruit of FRUITS) {
  fs.writeFileSync(path.join(OUT_DIR, `${fruit.slug}.html`), generateVarietyPage(fruit), 'utf8');
  console.log('Generated:', `${fruit.slug}.html`);
}
fs.writeFileSync(path.join(OUT_DIR, 'index.html'), generateHubPage(), 'utf8');
console.log('Generated: fruits/index.html');

module.exports = { FRUITS };
