#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'fruits');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const SITE_URL = 'https://orchards-nearme.com';
const PUB_DATE = '2025-07-01';

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

const IMAGES = [
  { file: 'blueberry-basket-harvest.jpg', alt: 'A basket of freshly harvested blueberries' },
  { file: 'blueberry-farm-bucket-field.jpg', alt: 'A bucket of blueberries in a farm field' },
  { file: 'blueberry-hands-picking-bush.jpg', alt: 'Hands picking blueberries from a bush' },
];

const SPECIES_BY_LABEL = {
  Bluecrop: 'northern-highbush',
  Duke: 'northern-highbush',
  Chandler: 'northern-highbush',
  Legacy: 'northern-highbush',
  Patriot: 'northern-highbush',
  Spartan: 'northern-highbush',
  Elliott: 'northern-highbush',
  Liberty: 'northern-highbush',
  Toro: 'northern-highbush',
  Bluejay: 'northern-highbush',
  Emerald: 'southern-highbush',
  Jewel: 'southern-highbush',
  Misty: 'southern-highbush',
  'Sunshine Blue': 'southern-highbush',
  Sweetcrisp: 'southern-highbush',
  Brightwell: 'rabbiteye',
  Climax: 'rabbiteye',
  Premier: 'rabbiteye',
  Powderblue: 'rabbiteye',
  'Pink Lemonade': 'hybrid',
};

const POLLINATION_TEXT = {
  'northern-highbush': label => `Like most Northern highbush blueberries, ${label} is self-fertile and can produce a crop entirely on its own, but planting it alongside a second highbush variety with an overlapping bloom time reliably improves fruit set, average berry size, and overall yield through cross-pollination. Bees and other pollinators do the actual work of moving pollen between bushes, so a home garden or orchard block with at least two different highbush varieties blooming together tends to noticeably outperform a single-variety planting, even though ${label} doesn't strictly require a partner to fruit.`,
  'southern-highbush': label => `Southern highbush varieties like ${label} are generally self-fertile in the same way Northern highbush types are, but cross-pollination with a second Southern highbush variety blooming at a similar time still improves fruit set and berry size. Because Southern highbush types are specifically bred for low-chill, mild-winter climates, pairing ${label} with another variety suited to those same conditions tends to work best, both for pollination benefits and for spreading the harvest window across a slightly longer season.`,
  rabbiteye: label => `Unlike most highbush blueberries, rabbiteye varieties including ${label} genuinely require cross-pollination from a different rabbiteye variety to produce good yields — self-pollination alone typically results in small, sparse crops rather than a full harvest. Growers commonly pair ${label} with another rabbiteye variety that blooms around the same time specifically to ensure reliable pollination, which is why rabbiteye plantings are almost always established with at least two compatible varieties rather than a single one.`,
  hybrid: label => `As a highbush-rabbiteye hybrid, ${label} benefits from cross-pollination with a second variety blooming at a similar time, though it can produce some fruit on its own without one. Because it's grown more for its ornamental novelty than for commercial yield, many home gardeners plant it alongside a standard blue-fruited variety both for the pollination benefit and for the visual contrast between the two colors of fruit in the same garden bed.`,
};

const FRUITS = [
  {
    label: 'Bluecrop',
    slug: 'bluecrop-blueberries',
    taste: [{ label: 'Sweetness', score: 6 }, { label: 'Tartness', score: 5 }, { label: 'Firmness', score: 7 }, { label: 'Juiciness', score: 7 }],
    tasteNote: `Bluecrop is the classic, well-balanced blueberry against which many other varieties are measured — a fairly even mix of sweetness and tartness with a firm bite and reliably juicy flesh. It doesn't lean heavily sweet or heavily tart the way some newer varieties do, which is part of why it remains a benchmark flavor for what a "regular" blueberry tastes like.`,
    history: `Bluecrop was developed by the USDA in cooperation with the New Jersey Agricultural Experiment Station and released in 1952, the product of a long-running highbush blueberry breeding program led by researchers including George Darrow and Stanley Johnston. It was bred from a cross of earlier cultivated highbush selections aimed at combining good flavor with strong productivity and cold hardiness. Bluecrop quickly became one of the most widely planted highbush blueberry varieties in North America, a position it still holds more than seventy years after its release, prized by commercial growers for its consistency and by home gardeners for its dependable performance across a wide range of climates.`,
    season: `Bluecrop ripens in the mid-season window, typically from late June through July in most Northern highbush growing regions, following earlier varieties like Duke and Spartan but ahead of late-season types like Elliott and Liberty. Its ripening window helps fill the middle of the blueberry season at u-pick farms that grow a spread of varieties to extend their picking season from June through August.`,
    nutrition: `Like other highbush blueberries, a cup of fresh Bluecrop berries contains roughly 84 calories, 21 grams of carbohydrates, and about 3.6 grams of fiber, along with a meaningful dose of vitamin C and vitamin K. Blueberries in general are well known for their high antioxidant content, particularly anthocyanins, the pigments responsible for their deep blue-purple color, and Bluecrop's medium-to-large berries deliver this nutritional profile in a classic, well-rounded package.`,
    uses: `Bluecrop's balanced flavor and firm texture make it genuinely versatile — equally at home eaten fresh by the handful, baked into muffins and pies, or frozen for later use, since the firm flesh holds up well to all three. Commercial growers favor it for fresh market sales specifically because the berries ship and display well without the softness issues that plague some other varieties, and its balanced flavor doesn't skew too sweet or too tart for widespread appeal.`,
    growing: `Bluecrop is grown across nearly every major highbush blueberry region in North America, including Michigan, Oregon, Washington, New Jersey, and British Columbia, a testament to its adaptability across different soil and climate conditions. It performs best in acidic, well-drained soil and requires a moderate number of winter chill hours to fruit reliably, making it well suited to temperate climates with real winters rather than the mild-winter regions where southern highbush varieties are grown instead.`,
    comparison: `Bluecrop sits squarely in the middle of the flavor spectrum compared to other highbush varieties — less intensely sweet than Toro or Duke, but less sharply tart than Elliott, which makes it a genuinely safe, crowd-pleasing choice when you're not sure what flavor profile you want. Its firmness is comparable to Chandler and Toro, though its berries run somewhat smaller than Chandler's notably oversized fruit.`,
    faqs: [
      { q: 'What does a Bluecrop blueberry taste like?', a: 'Bluecrop has a well-balanced flavor with roughly even sweetness and tartness, firm flesh, and good juiciness, making it a classic benchmark blueberry taste.' },
      { q: 'When is Bluecrop blueberry season?', a: 'Bluecrop ripens mid-season, typically from late June through July in most Northern highbush growing regions.' },
      { q: 'Where did the Bluecrop blueberry come from?', a: 'Bluecrop was developed by the USDA and the New Jersey Agricultural Experiment Station and released in 1952.' },
      { q: 'Is Bluecrop a good all-purpose blueberry?', a: 'Yes. Its balanced flavor and firm texture make it well suited to fresh eating, baking, and freezing alike.' },
      { q: 'Where is Bluecrop grown today?', a: 'Bluecrop is grown widely across Michigan, Oregon, Washington, New Jersey, and British Columbia.' },
      { q: 'How does Bluecrop compare to other highbush blueberries?', a: 'It\'s more balanced than sweeter varieties like Duke or tarter ones like Elliott, making it a dependable middle-of-the-road choice.' },
    ],
  },
  {
    label: 'Duke',
    slug: 'duke-blueberries',
    taste: [{ label: 'Sweetness', score: 5 }, { label: 'Tartness', score: 6 }, { label: 'Firmness', score: 8 }, { label: 'Juiciness', score: 6 }],
    tasteNote: `Duke has a mild, slightly tart flavor that leans less sweet than many modern varieties, paired with notably firm flesh that holds its shape well. It's not the boldest-flavored blueberry on this list, but its clean, mild taste and dependable firmness have made it a commercial favorite for early-season fruit.`,
    history: `Duke was developed through the Rutgers University and USDA blueberry breeding program and released in 1987, bred specifically to fill the gap for a reliable, very-early-ripening highbush variety with good firmness for shipping. It quickly became one of the most commercially significant early-season blueberry varieties in North America, valued by growers for its ability to reach market before most competing varieties are ready, commanding better prices during that early window.`,
    season: `Duke is one of the earliest-ripening highbush blueberry varieties, typically ready in mid-to-late June in most growing regions, sometimes even earlier in milder climates. This early ripening is Duke's defining commercial trait, letting growers and u-pick farms open their blueberry season weeks before later varieties are ready.`,
    nutrition: `A cup of Duke blueberries provides roughly 84 calories, about 21 grams of carbohydrates, and 3.6 grams of fiber, in line with typical highbush blueberry nutrition, along with a good source of vitamin C and the anthocyanin antioxidants responsible for blueberries' characteristic color and much of their health reputation.`,
    uses: `Duke's firm texture makes it an excellent choice for fresh market sales and for uses where berries need to hold their shape, including fruit salads, cereal toppings, and baking. Its milder, slightly tart flavor works well in recipes where you don't want an overly sweet blueberry note competing with other ingredients, and its firmness also makes it a strong performer in the freezer.`,
    growing: `Duke is grown extensively across Michigan, New Jersey, Oregon, Washington, and other major Northern highbush regions, valued by commercial operations specifically for its early ripening and reliable yields. Like most highbush varieties, it needs acidic, well-drained soil and a real winter chilling period to fruit well, and it's known for being relatively vigorous and easy to establish compared to some finickier varieties.`,
    comparison: `Duke's early ripening sets it apart from Bluecrop and Chandler, which follow weeks later, and its firmness rivals Toro's, though Duke's flavor runs milder and slightly more tart than Toro's sweeter profile. Compared to Patriot, another early variety, Duke tends to have firmer flesh but a less pronounced sweet-tart punch.`,
    faqs: [
      { q: 'What does a Duke blueberry taste like?', a: 'Duke has a mild, slightly tart flavor with firm flesh, less intensely sweet than many other blueberry varieties.' },
      { q: 'When is Duke blueberry season?', a: 'Duke is one of the earliest-ripening highbush varieties, typically ready in mid-to-late June.' },
      { q: 'Where did the Duke blueberry come from?', a: 'Duke was developed through the Rutgers University and USDA breeding program and released in 1987.' },
      { q: 'Is Duke a good blueberry for freezing?', a: 'Yes, its firm texture holds up especially well in the freezer compared to softer varieties.' },
      { q: 'Where is Duke grown today?', a: 'Duke is grown extensively in Michigan, New Jersey, Oregon, and Washington.' },
      { q: 'Why do growers favor Duke?', a: 'Its very early ripening lets growers reach market ahead of most competing varieties, often commanding better early-season prices.' },
    ],
  },
  {
    label: 'Chandler',
    slug: 'chandler-blueberries',
    taste: [{ label: 'Sweetness', score: 7 }, { label: 'Tartness', score: 4 }, { label: 'Firmness', score: 6 }, { label: 'Juiciness', score: 8 }],
    tasteNote: `Chandler is best known for producing the largest blueberries of any widely grown highbush variety — some berries approach the size of a small grape — paired with a mildly sweet flavor and juicy flesh. The size alone makes it a favorite at u-pick farms, since filling a bucket takes noticeably less time than with smaller-berried varieties.`,
    history: `Chandler was developed by the USDA blueberry breeding program and released in 1994, bred specifically to push berry size to new extremes while maintaining good flavor and an unusually long harvest window. It has since become one of the most popular varieties for u-pick and home garden use precisely because of that combination of enormous fruit size and an extended picking season that can stretch for many weeks rather than the tighter two-to-three-week window typical of most varieties.`,
    season: `Chandler has an unusually long harvest season, typically starting in mid-July and continuing for six to eight weeks in many regions, much longer than most highbush varieties. This extended ripening window means a single Chandler bush can be picked repeatedly across most of the summer rather than all at once, a major reason it's become a favorite for home gardens and u-pick operations alike.`,
    nutrition: `A cup of Chandler blueberries offers similar core nutrition to other highbush varieties — around 84 calories, 21 grams of carbohydrates, and 3.6 grams of fiber — though because individual berries are so much larger, a cup contains noticeably fewer berries than the same volume of a smaller-fruited variety. Chandler's size doesn't change its fundamental nutrient density, just how many berries it takes to reach it.`,
    uses: `Chandler's large size and juicy texture make it a favorite for fresh eating and for showy fruit platters where berry size matters visually. It's less ideal for baking applications where a firmer berry holds its shape better, since Chandler's larger size and juicier flesh can make it burst more readily in the oven, but it remains an excellent choice for smoothies, snacking, and fresh desserts.`,
    growing: `Chandler is widely grown in Oregon, Washington, Michigan, and other Pacific Northwest and Midwest highbush regions, and has become a particularly popular choice for home gardeners and u-pick farms because of its long harvest window and impressive berry size. It requires the same acidic, well-drained soil and winter chilling as other Northern highbush varieties, and its vigorous growth habit means it benefits from regular pruning to manage its size.`,
    comparison: `Chandler's defining trait compared to every other variety on this list is sheer berry size — noticeably larger than Bluecrop, Duke, or Toro — combined with one of the longest harvest windows of any highbush variety. Its flavor runs sweeter and juicier than firmer varieties like Duke, though its texture is softer than Toro's notably firm berries.`,
    faqs: [
      { q: 'What does a Chandler blueberry taste like?', a: 'Chandler has a mildly sweet, juicy flavor, but it\'s best known for producing unusually large berries rather than a distinctive taste.' },
      { q: 'When is Chandler blueberry season?', a: 'Chandler has an unusually long season, typically starting in mid-July and continuing for six to eight weeks.' },
      { q: 'Where did the Chandler blueberry come from?', a: 'Chandler was developed by the USDA breeding program and released in 1994.' },
      { q: 'Why are Chandler blueberries so large?', a: 'Chandler was specifically bred to maximize berry size, and its fruit is among the largest of any widely grown blueberry variety.' },
      { q: 'Is Chandler good for baking?', a: 'It works, but its softer, juicier texture holds up less well in the oven than firmer varieties like Duke or Toro.' },
      { q: 'Where is Chandler grown today?', a: 'Chandler is grown widely in Oregon, Washington, and Michigan, and is popular in home gardens for its long harvest window.' },
    ],
  },
  {
    label: 'Legacy',
    slug: 'legacy-blueberries',
    taste: [{ label: 'Sweetness', score: 7 }, { label: 'Tartness', score: 4 }, { label: 'Firmness', score: 7 }, { label: 'Juiciness', score: 7 }],
    tasteNote: `Legacy is widely regarded as one of the best-flavored blueberry varieties available, with a rich, well-rounded sweetness, low tartness, and firm, juicy flesh. It's often the variety flavor experts point to when asked which blueberry simply tastes the best.`,
    history: `Legacy was developed by the USDA and the New Jersey Agricultural Experiment Station and released in 1993, bred by crossing Northern highbush parentage with some Southern highbush genetics to combine excellent flavor with broader climate adaptability. This mixed heritage gives Legacy semi-evergreen foliage in milder climates, an unusual trait among Northern highbush types, and contributes to its reputation as a particularly well-rounded, widely adaptable variety.`,
    season: `Legacy ripens in the late-season window, typically from late July into August in most growing regions, extending the blueberry season after earlier varieties like Duke and Bluecrop have finished. Its late timing makes it a valuable variety for farms wanting to keep u-pick blueberry picking going later into summer.`,
    nutrition: `Legacy blueberries provide the same core nutritional profile typical of highbush varieties — about 84 calories, 21 grams of carbohydrates, and 3.6 grams of fiber per cup — along with the anthocyanin antioxidants blueberries are broadly known for. Its excellent flavor doesn't come from added sugar but from a naturally well-balanced sugar-acid ratio the variety was specifically bred to achieve.`,
    uses: `Legacy's excellent, well-rounded flavor makes it a top choice for fresh eating above almost any other application, since its taste is best appreciated on its own rather than blended into a recipe. It also performs well in baking and freezing thanks to its firm texture, making it a genuinely versatile variety that doesn't have an obvious weak point across different uses.`,
    growing: `Legacy is grown throughout New Jersey, Michigan, Oregon, Washington, and other major highbush regions, and its partial Southern highbush heritage gives it somewhat better adaptability to a range of climates than purebred Northern highbush varieties. It still requires acidic, well-drained soil, though it tends to be a bit more forgiving of variable winter conditions than older Northern-only cultivars.`,
    comparison: `Legacy is frequently rated as having better overall flavor than Bluecrop, Duke, or Chandler, thanks to its specifically bred sugar-acid balance, though its berry size runs smaller than Chandler's exceptionally large fruit. Its late-season timing complements early and mid-season varieties like Duke and Bluecrop rather than competing with them for harvest timing.`,
    faqs: [
      { q: 'What does a Legacy blueberry taste like?', a: 'Legacy has a rich, well-balanced sweetness with low tartness and firm, juicy flesh, often considered one of the best-flavored blueberry varieties.' },
      { q: 'When is Legacy blueberry season?', a: 'Legacy ripens late-season, typically from late July into August.' },
      { q: 'Where did the Legacy blueberry come from?', a: 'Legacy was developed by the USDA and the New Jersey Agricultural Experiment Station and released in 1993.' },
      { q: 'Why does Legacy have semi-evergreen leaves?', a: 'Legacy has some Southern highbush parentage mixed into its Northern highbush background, which gives it semi-evergreen foliage in milder climates.' },
      { q: 'Is Legacy a good all-purpose blueberry?', a: 'Yes, its firm texture and excellent flavor make it strong for fresh eating, baking, and freezing alike.' },
      { q: 'Where is Legacy grown today?', a: 'Legacy is grown throughout New Jersey, Michigan, Oregon, and Washington.' },
    ],
  },
  {
    label: 'Patriot',
    slug: 'patriot-blueberries',
    taste: [{ label: 'Sweetness', score: 6 }, { label: 'Tartness', score: 5 }, { label: 'Firmness', score: 6 }, { label: 'Juiciness', score: 7 }],
    tasteNote: `Patriot offers a good balanced flavor with moderate sweetness and tartness, large berries, and a juicy bite, all wrapped in one of the hardiest blueberry plants available. It's not the most intensely flavored variety here, but its dependable, pleasant taste combined with exceptional cold tolerance make it a favorite for colder growing regions.`,
    history: `Patriot was developed through a USDA breeding program in Maine and released in 1976, bred specifically to combine good flavor and large berry size with the extreme cold hardiness needed to survive harsh Northern winters. It also has an unusual tolerance for heavier, less well-drained soils compared to most highbush varieties, which typically demand very well-drained, sandy, acidic conditions to thrive.`,
    season: `Patriot ripens early-to-mid season, typically in late June through early July in most Northern growing regions, among the earlier blueberry varieties to reach harvest each year. Its early timing pairs well with its cold hardiness, since it's often grown in regions where the growing season itself starts and ends earlier than milder climates.`,
    nutrition: `A cup of Patriot blueberries delivers similar nutrition to other highbush varieties, roughly 84 calories, 21 grams of carbohydrates, and 3.6 grams of fiber, plus the antioxidant-rich anthocyanins that give blueberries their characteristic color and much of their nutritional reputation.`,
    uses: `Patriot's large, juicy berries work well for fresh eating, baking, and preserving alike, and its balanced flavor doesn't skew too sweet or tart for broad appeal in most recipes. It's a popular choice for home gardeners in colder climates specifically because it combines solid all-purpose usability with the ability to survive winters that would damage less hardy varieties.`,
    growing: `Patriot is especially popular in Maine, the upper Midwest, and other cold-winter regions where its exceptional hardiness lets it thrive where many other highbush varieties would struggle. Its tolerance for heavier soil also makes it a practical choice for growers without access to the ideal sandy, well-drained conditions most blueberries demand, broadening where it can be successfully planted.`,
    comparison: `Patriot's standout trait compared to Bluecrop, Duke, or Chandler is its exceptional cold hardiness and tolerance for heavier soils, making it the practical choice in growing regions too harsh for pickier varieties. Its flavor is comparable to Bluecrop's balanced profile, though Patriot's berries tend to run a bit larger.`,
    faqs: [
      { q: 'What does a Patriot blueberry taste like?', a: 'Patriot has a balanced, moderately sweet-tart flavor with large, juicy berries.' },
      { q: 'When is Patriot blueberry season?', a: 'Patriot ripens early-to-mid season, typically in late June through early July.' },
      { q: 'Where did the Patriot blueberry come from?', a: 'Patriot was developed through a USDA breeding program in Maine and released in 1976.' },
      { q: 'Why is Patriot popular in cold climates?', a: 'It was specifically bred for exceptional cold hardiness, letting it survive harsh Northern winters better than many other highbush varieties.' },
      { q: 'Can Patriot grow in heavier soil?', a: 'Yes, Patriot tolerates heavier, less well-drained soil better than most highbush blueberry varieties.' },
      { q: 'Where is Patriot grown today?', a: 'Patriot is especially popular in Maine and the upper Midwest, where its hardiness is a major advantage.' },
    ],
  },
  {
    label: 'Spartan',
    slug: 'spartan-blueberries',
    taste: [{ label: 'Sweetness', score: 7 }, { label: 'Tartness', score: 4 }, { label: 'Firmness', score: 6 }, { label: 'Juiciness', score: 7 }],
    tasteNote: `Spartan is widely considered one of the best-flavored early-season blueberries, with a bright, aromatic sweetness and large, juicy berries. Its flavor reputation is exceptional for how early in the season it ripens, since early varieties often sacrifice some flavor for speed.`,
    history: `Spartan was developed at Michigan State University and released in 1977, bred to bring genuinely excellent flavor to the early part of the blueberry season, a window where flavor quality had historically taken a back seat to simply being first to market. It quickly earned a reputation among growers and blueberry enthusiasts as one of the tastiest early varieties available, a reputation it has held for decades.`,
    season: `Spartan ripens early in the season, typically in mid-to-late June in most Northern highbush regions, arriving shortly after the very earliest varieties like Duke. Its combination of early timing and excellent flavor makes it a favorite opening act for u-pick farms building a season-long variety lineup.`,
    nutrition: `A cup of Spartan blueberries provides roughly the same core nutrition as other highbush varieties, about 84 calories, 21 grams of carbohydrates, and 3.6 grams of fiber, along with a strong dose of vitamin C and the anthocyanin antioxidants blueberries are known for.`,
    uses: `Spartan's bright, aromatic flavor makes it an excellent fresh-eating berry, arguably its best use given how highly regarded its raw flavor is. It also performs well in baking and preserves, though many growers and enthusiasts consider it something of a shame to cook away a flavor this good rather than simply enjoying it fresh by the handful.`,
    growing: `Spartan requires notably well-drained soil compared to some other highbush varieties, and it can be somewhat finicky to establish, which has limited its commercial spread compared to easier-growing varieties like Bluecrop. It's grown primarily in Michigan and other Midwest and Northeast highbush regions where growers are willing to manage its more particular soil requirements in exchange for its exceptional early-season flavor.`,
    comparison: `Spartan's early-season flavor rivals or exceeds later, more famously flavorful varieties like Legacy, an unusual achievement since early varieties typically compromise on taste. Compared to Duke, another early variety, Spartan offers noticeably more aromatic sweetness, though it demands better-drained soil to thrive.`,
    faqs: [
      { q: 'What does a Spartan blueberry taste like?', a: 'Spartan has a bright, aromatic sweetness with large, juicy berries, considered one of the best-flavored early-season blueberry varieties.' },
      { q: 'When is Spartan blueberry season?', a: 'Spartan ripens early, typically in mid-to-late June.' },
      { q: 'Where did the Spartan blueberry come from?', a: 'Spartan was developed at Michigan State University and released in 1977.' },
      { q: 'Is Spartan difficult to grow?', a: 'It requires notably well-drained soil and can be somewhat finicky to establish compared to easier-growing varieties like Bluecrop.' },
      { q: 'Why is Spartan\'s flavor notable?', a: 'It offers excellent, aromatic flavor unusually early in the blueberry season, a combination most early varieties don\'t achieve.' },
      { q: 'Where is Spartan grown today?', a: 'Spartan is grown primarily in Michigan and other Midwest and Northeast highbush regions.' },
    ],
  },
  {
    label: 'Elliott',
    slug: 'elliott-blueberries',
    taste: [{ label: 'Sweetness', score: 4 }, { label: 'Tartness', score: 7 }, { label: 'Firmness', score: 9 }, { label: 'Juiciness', score: 6 }],
    tasteNote: `Elliott is a notably tart, firm blueberry that ripens later than almost any other variety, extending the blueberry season well into fall. Its tartness is more pronounced than most highbush varieties, and its exceptional firmness makes it one of the best-storing and best-shipping blueberries grown.`,
    history: `Elliott was developed in Michigan and released in 1973, bred specifically to extend the commercial blueberry harvest season as late into the year as possible while maintaining good shipping and storage qualities. Its firmness and late ripening made it a valuable addition to the commercial blueberry industry, letting growers and retailers offer fresh blueberries well beyond the typical midsummer season.`,
    season: `Elliott is one of the latest-ripening blueberry varieties available, typically ready from late August into September, extending the blueberry season into early fall long after most other varieties have finished. This late timing is Elliott's signature commercial trait and the main reason growers plant it.`,
    nutrition: `A cup of Elliott blueberries offers the standard highbush blueberry nutritional profile — around 84 calories, 21 grams of carbohydrates, and 3.6 grams of fiber — along with the antioxidant-rich anthocyanins found across all blueberry varieties. Its more pronounced tartness doesn't reflect a different nutrient profile, just a different balance of natural sugars and acids.`,
    uses: `Elliott's tart flavor and exceptional firmness make it well suited to baking and preserves, where its tartness balances added sugar nicely and its firm texture holds up through cooking better than softer, sweeter varieties. Its firmness also makes it an excellent choice for freezing and for any use where a berry needs to survive handling and storage without turning to mush.`,
    growing: `Elliott is grown primarily in Michigan and other Northern highbush regions specifically for its late-season timing, which lets growers extend their blueberry harvest calendar well past when earlier varieties have finished. Like other Northern highbush types, it needs acidic, well-drained soil and a real winter chilling period.`,
    comparison: `Elliott stands apart from every other variety here for its notably late ripening and pronounced tartness — considerably more tart than Bluecrop or Legacy — combined with exceptional firmness that exceeds even Duke's firm texture. It has since been partly succeeded commercially by Liberty, a newer late-season variety bred as an improvement with better flavor.`,
    faqs: [
      { q: 'What does an Elliott blueberry taste like?', a: 'Elliott has a notably tart flavor with very firm flesh, less sweet than most other highbush blueberry varieties.' },
      { q: 'When is Elliott blueberry season?', a: 'Elliott is one of the latest-ripening blueberry varieties, typically ready from late August into September.' },
      { q: 'Where did the Elliott blueberry come from?', a: 'Elliott was developed in Michigan and released in 1973.' },
      { q: 'Is Elliott good for baking?', a: 'Yes, its tartness balances added sugar well, and its firm texture holds up better through baking than softer varieties.' },
      { q: 'Why is Elliott valued commercially?', a: 'Its very late ripening extends the blueberry harvest season into early fall, well past when most other varieties have finished.' },
      { q: 'Has Elliott been replaced by newer varieties?', a: 'It has been partly succeeded by Liberty, a newer late-season variety bred as an improvement with better flavor and similar firmness.' },
    ],
  },
  {
    label: 'Liberty',
    slug: 'liberty-blueberries',
    taste: [{ label: 'Sweetness', score: 6 }, { label: 'Tartness', score: 5 }, { label: 'Firmness', score: 9 }, { label: 'Juiciness', score: 7 }],
    tasteNote: `Liberty offers a better-balanced flavor than its predecessor Elliott, with more moderate tartness, good sweetness, and exceptional firmness, all while retaining Elliott's valuable late-season ripening. It's often described as what Elliott would taste like with the tartness dialed back.`,
    history: `Liberty was developed at Michigan State University and released in 2004, bred specifically as an improved successor to Elliott, aiming to keep that variety's valuable late-season timing and excellent firmness while improving on its more pronounced tartness. It has since become a preferred choice among growers looking for a late-season blueberry with broader consumer appeal than the tarter Elliott.`,
    season: `Liberty ripens in the very late season, typically from late August into September, similar timing to Elliott and among the latest of any commonly grown blueberry variety. This late ripening extends the commercial and u-pick blueberry season well into early fall.`,
    nutrition: `A cup of Liberty blueberries provides the typical highbush blueberry nutritional profile of about 84 calories, 21 grams of carbohydrates, and 3.6 grams of fiber, along with the antioxidant-rich anthocyanins blueberries are known for, delivered in a well-balanced, broadly appealing flavor package.`,
    uses: `Liberty's good flavor balance and exceptional firmness make it versatile across fresh eating, baking, and freezing alike, without the pronounced tartness that limits Elliott's appeal for fresh snacking. Its firmness makes it an excellent shipper and a strong performer in the freezer, while its improved sweetness makes it more enjoyable eaten straight from the bush than its predecessor.`,
    growing: `Liberty is grown primarily in Michigan and other Northern highbush regions as a preferred late-season alternative to Elliott, valued by commercial growers for combining that valuable late timing with broader consumer appeal. It requires the same acidic, well-drained soil and winter chilling as other Northern highbush varieties.`,
    comparison: `Liberty directly improves on Elliott's flavor while matching its late-season timing and firmness, making it the more broadly appealing choice between the two for anyone who wants a late blueberry without heavy tartness. Compared to Bluecrop, Liberty ripens dramatically later and holds up better in storage thanks to its exceptional firmness.`,
    faqs: [
      { q: 'What does a Liberty blueberry taste like?', a: 'Liberty has a good balance of sweetness and mild tartness with exceptional firmness, considered an improvement over the tarter Elliott variety.' },
      { q: 'When is Liberty blueberry season?', a: 'Liberty ripens very late-season, typically from late August into September.' },
      { q: 'Where did the Liberty blueberry come from?', a: 'Liberty was developed at Michigan State University and released in 2004.' },
      { q: 'How does Liberty compare to Elliott?', a: 'Liberty was bred as an improved successor to Elliott, keeping its late timing and firmness while offering better-balanced, less tart flavor.' },
      { q: 'Is Liberty good for freezing?', a: 'Yes, its exceptional firmness makes it one of the better blueberry varieties for freezing and storage.' },
      { q: 'Where is Liberty grown today?', a: 'Liberty is grown primarily in Michigan and other Northern highbush blueberry regions.' },
    ],
  },
  {
    label: 'Toro',
    slug: 'toro-blueberries',
    taste: [{ label: 'Sweetness', score: 7 }, { label: 'Tartness', score: 4 }, { label: 'Firmness', score: 8 }, { label: 'Juiciness', score: 7 }],
    tasteNote: `Toro combines good sweetness with notably firm flesh and large berry size, making it a favorite among growers who want a sweet-tasting blueberry that still ships and stores well. Its firmness sets it apart from other sweet varieties that tend to sacrifice texture for flavor.`,
    history: `Toro was developed by the USDA and the New Jersey Agricultural Experiment Station and released in 1987, bred to combine large berry size and good sweet flavor with the kind of firmness that commercial growers need for shipping and shelf life. It became a popular commercial variety specifically because it didn't force growers to choose between good flavor and good firmness the way some earlier varieties did.`,
    season: `Toro ripens in the early-to-mid season window, typically from late June through July, arriving around the same time as Bluecrop and shortly after the earliest varieties like Duke and Spartan. Its timing and firmness make it a strong mid-season commercial performer.`,
    nutrition: `A cup of Toro blueberries delivers standard highbush blueberry nutrition, roughly 84 calories, 21 grams of carbohydrates, and 3.6 grams of fiber, plus the antioxidant-rich anthocyanins found throughout the blueberry family, packaged in large, firm, sweet berries.`,
    uses: `Toro's combination of sweetness and firmness makes it excellent for fresh eating, since it holds its shape and texture well while still delivering good flavor. It also performs well in baking, where its firmness resists turning mushy, and its large size makes it popular for fresh fruit displays and platters.`,
    growing: `Toro is grown widely across Oregon, Washington, Michigan, and New Jersey, valued by commercial growers for its dependable combination of good flavor, large size, and shipping-friendly firmness. It requires the same acidic, well-drained soil and winter chilling as other Northern highbush varieties and is known for a vigorous, upright growth habit.`,
    comparison: `Toro's firmness rivals Duke's, while its flavor is noticeably sweeter, making it something of a best-of-both-worlds variety among Northern highbush types. Compared to Chandler, another large-berried variety, Toro holds its shape better and ships more reliably, though Chandler's berries can grow even larger.`,
    faqs: [
      { q: 'What does a Toro blueberry taste like?', a: 'Toro has a good sweet flavor with notably firm flesh and large berries, combining sweetness with excellent shipping and storage qualities.' },
      { q: 'When is Toro blueberry season?', a: 'Toro ripens early-to-mid season, typically from late June through July.' },
      { q: 'Where did the Toro blueberry come from?', a: 'Toro was developed by the USDA and the New Jersey Agricultural Experiment Station and released in 1987.' },
      { q: 'Is Toro a good all-purpose blueberry?', a: 'Yes, its combination of sweetness and firmness makes it strong for fresh eating, baking, and display alike.' },
      { q: 'Where is Toro grown today?', a: 'Toro is grown widely across Oregon, Washington, Michigan, and New Jersey.' },
      { q: 'How does Toro compare to Chandler?', a: 'Toro holds its shape and ships better, though Chandler produces even larger individual berries.' },
    ],
  },
  {
    label: 'Bluejay',
    slug: 'bluejay-blueberries',
    taste: [{ label: 'Sweetness', score: 6 }, { label: 'Tartness', score: 5 }, { label: 'Firmness', score: 6 }, { label: 'Juiciness', score: 6 }],
    tasteNote: `Bluejay has a mild, pleasant flavor with a light blue color and a texture that's easy to pick, though its taste is generally considered less distinctive than newer varieties bred specifically for flavor. It's a workhorse variety more valued for its growing characteristics than for standout taste.`,
    history: `Bluejay was developed at Michigan State University and released in 1952, the same year as Bluecrop, and bred with an emphasis on ease of mechanical harvesting alongside decent flavor and productivity. Its light blue color and the way its berries detach cleanly from the stem made it particularly well suited to the mechanical harvesting equipment that was becoming more common in commercial blueberry production during that era.`,
    season: `Bluejay ripens early-to-mid season, typically in late June through early July, similar timing to Bluecrop and Toro. Its timing places it in the middle of the pack among commonly grown highbush varieties.`,
    nutrition: `A cup of Bluejay blueberries provides the standard highbush nutritional profile of roughly 84 calories, 21 grams of carbohydrates, and 3.6 grams of fiber, along with the anthocyanin antioxidants common across the blueberry family, regardless of the specific variety's flavor profile.`,
    uses: `Bluejay's mild flavor and easy-picking berries make it well suited to baking and processing, where its straightforward taste doesn't overpower other ingredients. It's less commonly sought out specifically for fresh eating compared to more flavor-forward varieties like Legacy or Spartan, but it remains a solid, workmanlike choice for general use.`,
    growing: `Bluejay is grown in Michigan and other Midwest highbush regions, historically valued by commercial growers for its ease of mechanical harvesting, an important trait in large-scale blueberry operations. It requires the same acidic, well-drained soil and winter chilling as other Northern highbush varieties.`,
    comparison: `Bluejay's flavor is generally considered milder and less distinctive than Bluecrop, released the same year, or flavor-forward varieties like Legacy and Spartan, though its light color and clean-detaching berries made it historically valuable for mechanical harvesting. It has been increasingly replaced in new plantings by varieties with better flavor.`,
    faqs: [
      { q: 'What does a Bluejay blueberry taste like?', a: 'Bluejay has a mild, pleasant flavor, generally considered less distinctive than newer varieties bred specifically for taste.' },
      { q: 'When is Bluejay blueberry season?', a: 'Bluejay ripens early-to-mid season, typically in late June through early July.' },
      { q: 'Where did the Bluejay blueberry come from?', a: 'Bluejay was developed at Michigan State University and released in 1952.' },
      { q: 'Why was Bluejay historically popular?', a: 'Its light color and clean-detaching berries made it well suited to mechanical harvesting equipment used in commercial blueberry production.' },
      { q: 'Is Bluejay still commonly planted?', a: 'It has been increasingly replaced in new plantings by varieties bred for better flavor, though established plantings remain productive.' },
      { q: 'Where is Bluejay grown today?', a: 'Bluejay is grown in Michigan and other Midwest highbush blueberry regions.' },
    ],
  },
  {
    label: 'Emerald',
    slug: 'emerald-blueberries',
    taste: [{ label: 'Sweetness', score: 7 }, { label: 'Tartness', score: 3 }, { label: 'Firmness', score: 7 }, { label: 'Juiciness', score: 7 }],
    tasteNote: `Emerald is a Southern highbush variety with a mildly sweet, low-tartness flavor and large, firm berries, bred specifically to bring excellent Northern-style blueberry flavor to warm-winter climates. It's considered one of the better-flavored Southern highbush varieties available.`,
    history: `Emerald was developed by the University of Florida's blueberry breeding program in the early 2000s, part of a long-running effort to breed Southern highbush blueberries that could produce good fruit in Florida's mild winters, which don't provide the extended cold chilling that Northern highbush varieties require to fruit properly. Emerald addressed this by requiring a much lower number of winter chill hours while still delivering large, flavorful berries comparable to Northern varieties.`,
    season: `Emerald ripens early in the season for its region, typically from April through May in Florida and other warm-winter growing areas, well ahead of when Northern highbush varieties would even be blooming. This early Southern season lets growers reach markets before Northern blueberries become available.`,
    nutrition: `A cup of Emerald blueberries provides nutrition consistent with blueberries generally — around 84 calories, 21 grams of carbohydrates, and 3.6 grams of fiber — along with the anthocyanin antioxidants found across the blueberry family regardless of whether the variety is Northern or Southern highbush.`,
    uses: `Emerald's large size and good flavor make it well suited to fresh eating and fresh market sales, which is largely the point of breeding a Southern highbush variety with Northern-quality flavor. It also works well in baking and freezing thanks to its firm texture, giving it the same broad versatility as top Northern highbush varieties.`,
    growing: `Emerald is grown throughout Florida and other warm-winter Southern states where Northern highbush blueberries can't be grown due to insufficient winter chilling. It has a vigorous, upright, semi-evergreen growth habit and requires acidic soil, though its low chill requirement is what truly sets it apart, letting Southern growers produce genuinely good blueberries.`,
    comparison: `Emerald compares favorably in flavor to top Northern highbush varieties like Legacy, an impressive feat given how much harder it is to breed good flavor into low-chill Southern highbush types. Among Southern highbush varieties specifically, Emerald is often ranked alongside Jewel as one of the better-flavored, more productive options.`,
    faqs: [
      { q: 'What does an Emerald blueberry taste like?', a: 'Emerald has a mildly sweet, low-tartness flavor with large, firm berries, considered one of the better-flavored Southern highbush varieties.' },
      { q: 'When is Emerald blueberry season?', a: 'Emerald ripens early for its region, typically from April through May in Florida and other warm-winter areas.' },
      { q: 'Where did the Emerald blueberry come from?', a: 'Emerald was developed by the University of Florida\'s blueberry breeding program in the early 2000s.' },
      { q: 'What is a Southern highbush blueberry?', a: 'It\'s a type of blueberry bred to require far fewer winter chill hours than standard Northern highbush varieties, allowing it to fruit in mild-winter climates.' },
      { q: 'Where is Emerald grown today?', a: 'Emerald is grown throughout Florida and other warm-winter Southern states.' },
      { q: 'How does Emerald compare to Northern highbush varieties?', a: 'Its flavor compares favorably even to top Northern varieties like Legacy, unusual for a low-chill Southern highbush type.' },
    ],
  },
  {
    label: 'Jewel',
    slug: 'jewel-blueberries',
    taste: [{ label: 'Sweetness', score: 7 }, { label: 'Tartness', score: 3 }, { label: 'Firmness', score: 6 }, { label: 'Juiciness', score: 7 }],
    tasteNote: `Jewel is a Southern highbush variety with good sweetness, low tartness, and a reliably pleasant flavor, one of the more widely planted low-chill blueberry varieties for warm-climate growing. Its flavor is comparable to Emerald's, another top Southern highbush pick.`,
    history: `Jewel was developed by the University of Florida's blueberry breeding program and released in 1998, part of the same broader effort to bring good-flavored, low-chill blueberries to Southern growing regions where Northern highbush varieties can't thrive. Jewel became one of the more commercially successful early releases from this program, prized for its productivity as well as its flavor.`,
    season: `Jewel ripens early in the season for its Southern growing region, typically from April into May, similar timing to Emerald and other early Southern highbush varieties. This early season lets Florida growers reach markets well ahead of Northern blueberry availability.`,
    nutrition: `A cup of Jewel blueberries offers the same broad nutritional profile common to all blueberry varieties, roughly 84 calories, 21 grams of carbohydrates, and 3.6 grams of fiber, along with a strong dose of the anthocyanin antioxidants that make blueberries a well-known nutritional standout among fruits.`,
    uses: `Jewel's good flavor and productivity make it a strong choice for fresh market sales and fresh eating, the primary goal behind its development. It also holds up reasonably well in baking, though like many Southern highbush varieties it's generally favored more for fresh use than for cooking applications.`,
    growing: `Jewel is grown throughout Florida and other warm-winter Southern growing regions, valued by commercial growers for combining good flavor with strong productivity and a genuinely low chill requirement. It shares the semi-evergreen, vigorous growth habit typical of Southern highbush blueberries and requires the same acidic soil conditions as other highbush types.`,
    comparison: `Jewel and Emerald are frequently compared as two of the top Southern highbush varieties, with similar flavor profiles and overlapping harvest windows, though Emerald is sometimes considered to have a slight edge in berry size. Compared to Northern highbush varieties like Bluecrop, Jewel requires far fewer winter chill hours, making it viable in climates where Bluecrop simply wouldn't fruit.`,
    faqs: [
      { q: 'What does a Jewel blueberry taste like?', a: 'Jewel has good sweetness with low tartness, a reliably pleasant flavor comparable to Emerald, another top Southern highbush variety.' },
      { q: 'When is Jewel blueberry season?', a: 'Jewel ripens early for its Southern growing region, typically from April into May.' },
      { q: 'Where did the Jewel blueberry come from?', a: 'Jewel was developed by the University of Florida\'s blueberry breeding program and released in 1998.' },
      { q: 'How does Jewel compare to Emerald?', a: 'The two are frequently compared as top Southern highbush varieties with similar flavor and harvest timing, though Emerald sometimes has slightly larger berries.' },
      { q: 'Where is Jewel grown today?', a: 'Jewel is grown throughout Florida and other warm-winter Southern growing regions.' },
      { q: 'Can Jewel grow in cold climates?', a: 'No, it\'s bred as a low-chill Southern highbush variety and is best suited to mild-winter regions rather than areas with harsh winters.' },
    ],
  },
  {
    label: 'Misty',
    slug: 'misty-blueberries',
    taste: [{ label: 'Sweetness', score: 6 }, { label: 'Tartness', score: 4 }, { label: 'Firmness', score: 6 }, { label: 'Juiciness', score: 6 }],
    tasteNote: `Misty offers a mild, pleasant sweetness with low tartness, and its attractive pink new growth makes it as much a garden ornamental as a fruit-producing plant. Its flavor is solid but generally considered a step behind top-tier varieties like Emerald or Jewel.`,
    history: `Misty was developed by the University of Florida's blueberry breeding program in the 1990s, part of the same Southern highbush breeding effort that produced Emerald and Jewel, aimed at bringing low-chill blueberries with good garden characteristics to warm-climate growers. Misty became particularly popular with home gardeners thanks to its attractive appearance, including striking pink-tinged new leaf growth that stands out even before the plant fruits.`,
    season: `Misty ripens early-to-mid season for a Southern highbush variety, typically from April into May in most warm-winter growing regions, similar general timing to Emerald and Jewel.`,
    nutrition: `A cup of Misty blueberries provides the typical blueberry nutritional profile, around 84 calories, 21 grams of carbohydrates, and 3.6 grams of fiber, along with the anthocyanin antioxidants found across the blueberry family regardless of specific variety.`,
    uses: `Misty's mild, pleasant flavor makes it suitable for fresh eating and general kitchen use, though it's not typically singled out as a top choice for any one specific application. Its ornamental appeal makes it just as valuable planted for looks in a home garden as for its fruit production.`,
    growing: `Misty is popular specifically as a home garden and landscape plant thanks to its attractive pink new growth, in addition to being grown commercially throughout Florida and other warm-winter Southern regions. Like other Southern highbush varieties, it needs far fewer winter chill hours than Northern types and shares their semi-evergreen growth habit.`,
    comparison: `Misty's flavor generally ranks a step below top Southern highbush varieties like Emerald and Jewel, though its striking pink new growth gives it a distinct ornamental advantage that those varieties don't emphasize as strongly. It shares similar growing requirements and harvest timing with both.`,
    faqs: [
      { q: 'What does a Misty blueberry taste like?', a: 'Misty has a mild, pleasant sweetness with low tartness, generally considered solid but a step behind top varieties like Emerald or Jewel.' },
      { q: 'When is Misty blueberry season?', a: 'Misty ripens early-to-mid season, typically from April into May in warm-winter growing regions.' },
      { q: 'Where did the Misty blueberry come from?', a: 'Misty was developed by the University of Florida\'s blueberry breeding program in the 1990s.' },
      { q: 'Why is Misty popular with home gardeners?', a: 'Its striking pink-tinged new leaf growth makes it an attractive ornamental plant in addition to producing fruit.' },
      { q: 'Where is Misty grown today?', a: 'Misty is grown throughout Florida and other warm-winter Southern growing regions.' },
      { q: 'How does Misty compare to Emerald and Jewel?', a: 'Its flavor generally ranks a step below those two top Southern highbush varieties, though it offers more ornamental appeal.' },
    ],
  },
  {
    label: 'Sunshine Blue',
    slug: 'sunshine-blue-blueberries',
    taste: [{ label: 'Sweetness', score: 6 }, { label: 'Tartness', score: 4 }, { label: 'Firmness', score: 5 }, { label: 'Juiciness', score: 6 }],
    tasteNote: `Sunshine Blue has a mild, pleasant flavor typical of Southern highbush blueberries, but it's grown far more for its compact size and ornamental beauty than for standout taste. Its pink spring flowers and small, tidy growth habit make it a favorite for containers and small gardens.`,
    history: `Sunshine Blue is a Southern highbush variety bred specifically as a compact, self-fertile, low-chill blueberry suited to home gardens and container growing rather than large-scale commercial production. Its development focused on ornamental and practical garden qualities — dwarf size, attractive pink flowers, semi-evergreen foliage, and self-fertility so a single plant can produce fruit without a second variety for pollination — as much as on fruit flavor itself.`,
    season: `Sunshine Blue typically ripens from May into June in most warm-winter growing regions, a bit later than some other Southern highbush varieties like Emerald and Jewel, and its harvest is generally smaller in volume given the plant's compact, dwarf growth habit.`,
    nutrition: `A cup of Sunshine Blue blueberries provides nutrition consistent with the blueberry family broadly, roughly 84 calories, 21 grams of carbohydrates, and 3.6 grams of fiber, along with the anthocyanin antioxidants blueberries are known for, regardless of the variety's smaller-scale garden focus.`,
    uses: `Sunshine Blue's fruit works fine for fresh eating and general kitchen use, though given the plant's smaller yield, most gardeners grow it as much for its ornamental container-garden appeal as for a meaningful fruit harvest. It's a popular choice for patios and small-space gardens where a full-size highbush bush wouldn't fit.`,
    growing: `Sunshine Blue is specifically bred for container growing and small home gardens, with a compact, dwarf habit that rarely exceeds a few feet in height, unlike the much larger bushes typical of commercial highbush varieties. It's self-fertile, meaning a single plant can produce fruit on its own, and it requires far fewer winter chill hours than Northern highbush types, making it viable in a wide range of climates including mild-winter regions.`,
    comparison: `Unlike every other variety on this list, Sunshine Blue is grown primarily for its compact ornamental habit and container suitability rather than for commercial fruit production or peak flavor, setting it apart from flavor-focused varieties like Legacy or size-focused ones like Chandler. Its self-fertility is also a distinguishing practical advantage for gardeners with space for only one plant.`,
    faqs: [
      { q: 'What does a Sunshine Blue blueberry taste like?', a: 'Sunshine Blue has a mild, pleasant flavor typical of Southern highbush blueberries, though it\'s grown more for its compact size and ornamental appeal than standout taste.' },
      { q: 'When is Sunshine Blue blueberry season?', a: 'Sunshine Blue typically ripens from May into June in most warm-winter growing regions.' },
      { q: 'Is Sunshine Blue good for containers?', a: 'Yes, it was specifically bred as a compact, dwarf variety well suited to container growing and small home gardens.' },
      { q: 'Does Sunshine Blue need a second plant for pollination?', a: 'No, it\'s self-fertile, meaning a single plant can produce fruit on its own without a second variety nearby.' },
      { q: 'Where can Sunshine Blue be grown?', a: 'It requires far fewer winter chill hours than Northern highbush types, making it viable in a wide range of climates including mild-winter regions.' },
      { q: 'Why do gardeners choose Sunshine Blue?', a: 'Its compact size, attractive pink flowers, and self-fertility make it popular for small gardens and patios rather than large-scale fruit production.' },
    ],
  },
  {
    label: 'Sweetcrisp',
    slug: 'sweetcrisp-blueberries',
    taste: [{ label: 'Sweetness', score: 8 }, { label: 'Tartness', score: 2 }, { label: 'Firmness', score: 9 }, { label: 'Juiciness', score: 6 }],
    tasteNote: `Sweetcrisp lives up to its name with an unusually crisp, almost crunchy texture rarely found in blueberries, paired with notably high sweetness and very low tartness. It's one of the most distinctive-tasting varieties on this list simply because of how different its texture is from a typical soft, juicy blueberry.`,
    history: `Sweetcrisp was developed by the University of Florida's blueberry breeding program and released in the mid-2000s, bred specifically to introduce a genuinely novel, crisp texture into the Southern highbush blueberry lineup, a trait that set it apart immediately from virtually every other cultivated blueberry variety. Its unusual crunch, combined with high natural sweetness, quickly made it stand out among newer Southern highbush releases.`,
    season: `Sweetcrisp ripens in the early-to-mid season for a Southern highbush variety, typically from April into May in most warm-winter growing regions, similar general timing to other University of Florida releases like Emerald and Jewel.`,
    nutrition: `A cup of Sweetcrisp blueberries provides the standard blueberry nutritional profile, roughly 84 calories, 21 grams of carbohydrates, and 3.6 grams of fiber, along with the anthocyanin antioxidants found throughout the blueberry family, delivered in an unusually high-sweetness, low-tartness, crisp-textured package.`,
    uses: `Sweetcrisp's unusual crunch and high sweetness make it an outstanding fresh-eating berry, arguably its best use given how much of its appeal comes from that distinctive texture, which would be lost in most cooked applications. It's less commonly used for baking or preserves, since the whole point of the variety is enjoying its crisp bite fresh.`,
    growing: `Sweetcrisp is grown primarily in Florida and other warm-winter Southern growing regions as part of the broader University of Florida low-chill blueberry breeding program. It shares the general growing requirements of other Southern highbush varieties, including acidic soil and a much lower winter chill requirement than Northern highbush types.`,
    comparison: `Sweetcrisp's defining trait compared to every other variety here is its unusually crisp, crunchy texture, a genuine departure from the soft juiciness typical of Chandler or Legacy. Its sweetness rivals or exceeds Emerald and Jewel, while its low tartness places it among the mildest-tasting varieties on this list.`,
    faqs: [
      { q: 'What does a Sweetcrisp blueberry taste like?', a: 'Sweetcrisp has an unusually crisp, crunchy texture with high sweetness and very low tartness, distinct from most other blueberry varieties.' },
      { q: 'When is Sweetcrisp blueberry season?', a: 'Sweetcrisp ripens early-to-mid season, typically from April into May in warm-winter growing regions.' },
      { q: 'Where did the Sweetcrisp blueberry come from?', a: 'Sweetcrisp was developed by the University of Florida\'s blueberry breeding program and released in the mid-2000s.' },
      { q: 'Why is Sweetcrisp\'s texture unusual?', a: 'It was specifically bred to introduce a crisp, crunchy texture rarely found in blueberries, a genuine departure from the typical soft, juicy bite.' },
      { q: 'Is Sweetcrisp good for baking?', a: 'It\'s better suited to fresh eating, since its signature crisp texture is best appreciated raw rather than in cooked applications.' },
      { q: 'Where is Sweetcrisp grown today?', a: 'Sweetcrisp is grown primarily in Florida and other warm-winter Southern growing regions.' },
    ],
  },
  {
    label: 'Brightwell',
    slug: 'brightwell-blueberries',
    taste: [{ label: 'Sweetness', score: 6 }, { label: 'Tartness', score: 5 }, { label: 'Firmness', score: 6 }, { label: 'Juiciness', score: 7 }],
    tasteNote: `Brightwell is a rabbiteye blueberry with a good balanced flavor, moderate sweetness and tartness, and a texture typical of the rabbiteye species, which tends to have slightly thicker skins than highbush types. It's valued more for its exceptional productivity than for standout flavor.`,
    history: `Brightwell was developed by the University of Georgia's rabbiteye blueberry breeding program and released in 1983, bred to combine strong productivity with good adaptability to Southern growing conditions. Rabbiteye blueberries are a distinct species from highbush blueberries, native to the Southeastern United States and generally more heat-tolerant and less demanding of soil conditions, and Brightwell became one of the more widely planted rabbiteye varieties thanks to its reliable, heavy yields.`,
    season: `Brightwell ripens early-to-mid season for a rabbiteye variety, typically from late May into June in most Southeastern growing regions, among the earlier rabbiteye varieties to reach harvest each year.`,
    nutrition: `A cup of Brightwell blueberries offers nutrition consistent with blueberries generally, roughly 84 calories, 21 grams of carbohydrates, and 3.6 grams of fiber, along with the anthocyanin antioxidants found across both rabbiteye and highbush blueberry species alike.`,
    uses: `Brightwell's good all-around flavor and productivity make it suitable for fresh eating, baking, and processing alike, a genuinely versatile variety without an obvious specialized use. Its exceptional yields also make it a favorite for commercial operations focused on volume as much as any single specific application.`,
    growing: `Brightwell is grown throughout Georgia and other Southeastern states where rabbiteye blueberries thrive, valued specifically for its heavy, dependable production and good tolerance of Southern soil and heat conditions. Rabbiteye varieties like Brightwell generally require cross-pollination from a different rabbiteye variety to produce good yields, so it's typically planted alongside other rabbiteye cultivars.`,
    comparison: `As a rabbiteye variety, Brightwell differs fundamentally from highbush types like Bluecrop or Legacy in species and growing requirements, generally tolerating hotter, more variable Southern conditions better than highbush blueberries can. Among rabbiteye varieties specifically, Brightwell is valued for its early timing and heavy production compared to later types like Powderblue.`,
    faqs: [
      { q: 'What does a Brightwell blueberry taste like?', a: 'Brightwell has a balanced flavor with moderate sweetness and tartness, valued more for productivity than standout taste.' },
      { q: 'When is Brightwell blueberry season?', a: 'Brightwell ripens early-to-mid season for a rabbiteye variety, typically from late May into June.' },
      { q: 'Where did the Brightwell blueberry come from?', a: 'Brightwell was developed by the University of Georgia\'s rabbiteye blueberry breeding program and released in 1983.' },
      { q: 'What is a rabbiteye blueberry?', a: 'It\'s a distinct blueberry species native to the Southeastern United States, generally more heat-tolerant and less soil-demanding than highbush blueberries.' },
      { q: 'Does Brightwell need a second plant for pollination?', a: 'Yes, like most rabbiteye varieties it requires cross-pollination from a different rabbiteye cultivar to produce good yields.' },
      { q: 'Where is Brightwell grown today?', a: 'Brightwell is grown throughout Georgia and other Southeastern states where rabbiteye blueberries thrive.' },
    ],
  },
  {
    label: 'Climax',
    slug: 'climax-blueberries',
    taste: [{ label: 'Sweetness', score: 6 }, { label: 'Tartness', score: 5 }, { label: 'Firmness', score: 6 }, { label: 'Juiciness', score: 6 }],
    tasteNote: `Climax offers good, well-balanced rabbiteye flavor with moderate sweetness and tartness, and it remains one of the most widely planted rabbiteye varieties for its dependable overall quality. It's a solid, unremarkable-in-a-good-way flavor that's held up well over decades of commercial use, which is exactly the kind of consistency growers and consumers alike have come to expect from it.`,
    history: `Climax was developed by the University of Georgia's rabbiteye breeding program and released in 1974, among the earlier significant rabbiteye releases from that program, and it went on to become one of the most widely planted rabbiteye varieties in the Southeastern United States. Its combination of good flavor, early ripening, and dependable production has kept it commercially relevant for decades since its release.`,
    season: `Climax ripens early in the season for a rabbiteye variety, typically in late May, among the earliest rabbiteye types to reach harvest, similar to or slightly ahead of Brightwell.`,
    nutrition: `A cup of Climax blueberries provides the standard blueberry nutritional profile, roughly 84 calories, 21 grams of carbohydrates, and 3.6 grams of fiber, along with the anthocyanin antioxidants found broadly across both rabbiteye and highbush blueberry types.`,
    uses: `Climax's good, balanced flavor makes it well suited to fresh eating, baking, and general kitchen use without any particular limitation, a genuinely versatile rabbiteye variety. Its early ripening also makes it valuable for growers wanting to reach markets ahead of later-season rabbiteye types.`,
    growing: `Climax is grown extensively throughout Georgia and other Southeastern states, requiring cross-pollination from another rabbiteye variety like most types in this species, and it shares the general heat tolerance and adaptability to Southern soils typical of rabbiteye blueberries. It remains a staple variety in commercial rabbiteye plantings and is often among the first rabbiteye varieties recommended to new growers establishing a planting in the region, thanks to its long track record and dependable performance.`,
    comparison: `Climax and Brightwell are often planted together specifically because their similar early timing and rabbiteye species mean they can cross-pollinate each other effectively, while both offer broadly similar good, balanced flavor. Compared to later rabbiteye varieties like Powderblue, Climax reaches harvest notably earlier in the season.`,
    faqs: [
      { q: 'What does a Climax blueberry taste like?', a: 'Climax has good, well-balanced flavor with moderate sweetness and tartness, one of the most widely planted rabbiteye varieties.' },
      { q: 'When is Climax blueberry season?', a: 'Climax ripens early for a rabbiteye variety, typically in late May.' },
      { q: 'Where did the Climax blueberry come from?', a: 'Climax was developed by the University of Georgia\'s rabbiteye breeding program and released in 1974.' },
      { q: 'Does Climax need a second variety for pollination?', a: 'Yes, like most rabbiteye blueberries it requires cross-pollination from another rabbiteye cultivar to produce good yields.' },
      { q: 'Is Climax often planted with Brightwell?', a: 'Yes, the two are often planted together since their similar early timing allows them to cross-pollinate each other effectively.' },
      { q: 'Where is Climax grown today?', a: 'Climax is grown extensively throughout Georgia and other Southeastern states.' },
    ],
  },
  {
    label: 'Premier',
    slug: 'premier-blueberries',
    taste: [{ label: 'Sweetness', score: 6 }, { label: 'Tartness', score: 5 }, { label: 'Firmness', score: 6 }, { label: 'Juiciness', score: 7 }],
    tasteNote: `Premier offers a good, balanced rabbiteye flavor with large berry size and a vigorous, productive plant, making it a popular commercial choice similar in profile to Brightwell and Climax. Its flavor is solid without being particularly distinctive.`,
    history: `Premier was developed by the University of Georgia's rabbiteye breeding program and released in 1978, part of the same wave of significant rabbiteye releases that included Brightwell and Climax, aimed at giving Southern growers a range of good, reliable rabbiteye options with staggered ripening times. Premier became known specifically for its large berry size among rabbiteye varieties, which tend to run smaller than highbush types overall.`,
    season: `Premier ripens early in the season for a rabbiteye variety, typically in late May into early June, similar general timing to Climax and Brightwell, giving growers several good early rabbiteye options to choose from.`,
    nutrition: `A cup of Premier blueberries provides nutrition consistent with blueberries broadly, roughly 84 calories, 21 grams of carbohydrates, and 3.6 grams of fiber, along with the anthocyanin antioxidants found across the blueberry family regardless of species or variety.`,
    uses: `Premier's large berries and good balanced flavor make it suitable for fresh eating and general kitchen use, with its bigger size making it a nice option for fresh fruit displays among rabbiteye varieties, which otherwise tend to run smaller than highbush berries. It performs reasonably well in baking too.`,
    growing: `Premier is grown throughout Georgia and other Southeastern rabbiteye-growing states, valued for its vigorous, productive growth habit and notably large berries for a rabbiteye type. Like other rabbiteye varieties, it requires cross-pollination from a different rabbiteye cultivar and tolerates Southern heat and soil conditions well, including the sandy, well-drained soils common throughout its core growing region.`,
    comparison: `Premier's larger berry size sets it apart from Brightwell and Climax, its rough contemporaries from the same University of Georgia breeding program, though all three share broadly similar early-season timing and balanced flavor profiles. Among rabbiteye varieties generally, Premier is often chosen specifically when berry size is a priority.`,
    faqs: [
      { q: 'What does a Premier blueberry taste like?', a: 'Premier has good, balanced rabbiteye flavor, similar in profile to Brightwell and Climax, with notably large berries for a rabbiteye variety.' },
      { q: 'When is Premier blueberry season?', a: 'Premier ripens early for a rabbiteye variety, typically in late May into early June.' },
      { q: 'Where did the Premier blueberry come from?', a: 'Premier was developed by the University of Georgia\'s rabbiteye breeding program and released in 1978.' },
      { q: 'Why is Premier notable among rabbiteye varieties?', a: 'It\'s known for producing notably large berries compared to most other rabbiteye types, which generally run smaller than highbush blueberries.' },
      { q: 'Does Premier need a second variety for pollination?', a: 'Yes, like most rabbiteye blueberries it requires cross-pollination from a different rabbiteye cultivar.' },
      { q: 'Where is Premier grown today?', a: 'Premier is grown throughout Georgia and other Southeastern rabbiteye-growing states.' },
    ],
  },
  {
    label: 'Powderblue',
    slug: 'powderblue-blueberries',
    taste: [{ label: 'Sweetness', score: 6 }, { label: 'Tartness', score: 5 }, { label: 'Firmness', score: 7 }, { label: 'Juiciness', score: 6 }],
    tasteNote: `Powderblue has a good, balanced rabbiteye flavor and a distinctive light blue color from a heavy natural bloom, or waxy powder coating, on the skin, along with an upright growth habit well suited to mechanical harvesting. Its flavor is solid and typical of good late-season rabbiteye varieties, offering a dependable, satisfying option once earlier types have already finished producing for the year.`,
    history: `Powderblue was developed by the University of Georgia's rabbiteye breeding program and released in 1978, the same year as Premier, bred to extend the rabbiteye harvest season later while offering strong productivity and a growth habit suited to mechanical harvesting equipment increasingly used in commercial operations. Its heavy bloom and light color made it visually distinctive among rabbiteye varieties.`,
    season: `Powderblue ripens late in the season for a rabbiteye variety, typically in July, extending the rabbiteye blueberry harvest well past earlier types like Climax, Brightwell, and Premier.`,
    nutrition: `A cup of Powderblue blueberries offers the standard blueberry nutritional profile, roughly 84 calories, 21 grams of carbohydrates, and 3.6 grams of fiber, along with the anthocyanin antioxidants found across the blueberry family, delivered in a good, typically flavored late-season rabbiteye berry.`,
    uses: `Powderblue's good balanced flavor makes it suitable for fresh eating, baking, and general kitchen use, without any specific standout application beyond being a solid, dependable late-season rabbiteye choice. Its firmness holds up reasonably well for a rabbiteye variety.`,
    growing: `Powderblue is grown throughout Georgia and other Southeastern rabbiteye regions, valued for its upright growth habit that suits mechanical harvesting and its late-season timing that extends the rabbiteye harvest calendar. Like other rabbiteye varieties, it requires cross-pollination from a different rabbiteye cultivar to fruit well, and its tolerance for Southern heat and humidity makes it a dependable performer even in the hottest parts of the growing season.`,
    comparison: `Powderblue's late-season timing sets it apart from earlier rabbiteye releases from the same University of Georgia program, including Climax, Brightwell, and Premier, giving growers a way to spread their rabbiteye harvest across a longer window. Its light, heavily-bloomed color is also more pronounced than most other rabbiteye varieties.`,
    faqs: [
      { q: 'What does a Powderblue blueberry taste like?', a: 'Powderblue has good, balanced rabbiteye flavor, typical of quality late-season rabbiteye varieties.' },
      { q: 'When is Powderblue blueberry season?', a: 'Powderblue ripens late for a rabbiteye variety, typically in July.' },
      { q: 'Where did the Powderblue blueberry come from?', a: 'Powderblue was developed by the University of Georgia\'s rabbiteye breeding program and released in 1978.' },
      { q: 'Why is Powderblue named that?', a: 'It has a heavy natural bloom, or waxy powder coating, on its skin that gives it a distinctive light blue appearance.' },
      { q: 'Is Powderblue suited to mechanical harvesting?', a: 'Yes, its upright growth habit was specifically bred to suit mechanical harvesting equipment used in commercial operations.' },
      { q: 'Where is Powderblue grown today?', a: 'Powderblue is grown throughout Georgia and other Southeastern rabbiteye-growing regions.' },
    ],
  },
  {
    label: 'Pink Lemonade',
    slug: 'pink-lemonade-blueberries',
    taste: [{ label: 'Sweetness', score: 6 }, { label: 'Tartness', score: 4 }, { label: 'Firmness', score: 6 }, { label: 'Juiciness', score: 6 }],
    tasteNote: `Pink Lemonade is a genuine novelty among blueberries — its ripe berries turn a distinctive pink rather than the usual blue, though the flavor underneath that unusual color is a mild, pleasant sweetness comparable to many standard blueberry varieties. Its main appeal is visual rather than a dramatically different taste.`,
    history: `Pink Lemonade was developed by the USDA's Agricultural Research Service, with breeder Mark Ehlenfeldt playing a key role, through a hybrid cross combining highbush and rabbiteye blueberry species specifically aimed at producing an ornamental pink-fruited blueberry rather than a conventional blue one. It was released as a novelty and ornamental variety, quickly gaining popularity with home gardeners drawn to its unusual color as much as its edible fruit.`,
    season: `Pink Lemonade typically ripens in the mid-to-late season, from July into August in most growing regions, following a similar general timing window to other highbush-rabbiteye hybrid types.`,
    nutrition: `A cup of Pink Lemonade blueberries provides nutrition generally consistent with the blueberry family, roughly 84 calories, 21 grams of carbohydrates, and around 3 grams of fiber, though its distinctive pink color comes from different pigment compounds than the anthocyanins responsible for standard blueberries' deep blue-purple color, giving it a somewhat different antioxidant profile than typical blue varieties.`,
    uses: `Pink Lemonade's main draw is visual — its pink berries make striking additions to fruit platters, desserts, and garden displays where the novelty color is the point, while its mild, pleasant flavor works fine for fresh eating alongside more conventional blue blueberries. It's less commonly grown at commercial scale and more often found in home gardens and specialty markets.`,
    growing: `Pink Lemonade is popular specifically as an ornamental and novelty garden plant, valued for its unusual pink fruit, attractive fall foliage color, and reasonably compact growth habit suited to home landscapes. As a highbush-rabbiteye hybrid, it has decent adaptability across different climates, though it's generally grown in home gardens rather than large commercial operations.`,
    comparison: `Pink Lemonade stands apart from every other variety on this list for its genuinely unusual pink color, a trait no standard blue blueberry variety shares, making it fundamentally a novelty and ornamental choice rather than a flavor-focused or productivity-focused commercial variety like Bluecrop or Brightwell. Its flavor, while pleasant, isn't typically considered exceptional compared to top flavor varieties like Legacy or Spartan.`,
    faqs: [
      { q: 'What does a Pink Lemonade blueberry taste like?', a: 'Pink Lemonade has a mild, pleasant sweetness comparable to many standard blueberry varieties, with its main distinction being its unusual pink color rather than flavor.' },
      { q: 'Why are Pink Lemonade blueberries pink instead of blue?', a: 'It was specifically bred as a hybrid of highbush and rabbiteye blueberry species to produce pink fruit rather than the typical blue color, using different pigment compounds than standard blueberries.' },
      { q: 'When is Pink Lemonade blueberry season?', a: 'Pink Lemonade typically ripens mid-to-late season, from July into August.' },
      { q: 'Who developed the Pink Lemonade blueberry?', a: 'It was developed by the USDA\'s Agricultural Research Service, with breeder Mark Ehlenfeldt playing a key role in its creation.' },
      { q: 'Is Pink Lemonade grown commercially?', a: 'It\'s more commonly found in home gardens and specialty markets than large-scale commercial production, valued largely for its ornamental novelty.' },
      { q: 'Is Pink Lemonade a good garden plant?', a: 'Yes, it\'s popular for its unusual pink fruit, attractive fall foliage, and compact growth habit suited to home landscapes.' },
    ],
  },
];

function otherVarietiesHtml(currentSlug) {
  return FRUITS.filter(f => f.slug !== currentSlug)
    .map(f => `          <li><a href="/fruits/${f.slug}">${f.label} Blueberries</a></li>`)
    .join('\n');
}

const SPECIES_EXPLAINER = {
  'northern-highbush': label => `${label} is a Northern highbush blueberry, the most widely cultivated type in North America, bred from wild highbush blueberries native to the Eastern United States and adapted to regions with real winter cold. Northern highbush varieties generally need a substantial number of winter chill hours to break dormancy and fruit properly the following year, which is why they're grown throughout the Northeast, Midwest, and Pacific Northwest rather than in mild-winter climates.`,
  'southern-highbush': label => `${label} is a Southern highbush blueberry, bred by crossing traditional Northern highbush blueberries with wild Southern blueberry species specifically to reduce the number of winter chill hours needed to fruit. This makes Southern highbush varieties like ${label} viable in Florida and other mild-winter regions where standard Northern highbush blueberries would never accumulate enough winter cold to fruit reliably.`,
  rabbiteye: label => `${label} is a rabbiteye blueberry, a distinct species native to the Southeastern United States, named for the pinkish, eye-like appearance of the berries before they fully ripen to blue. Rabbiteye blueberries are generally more heat-tolerant and more adaptable to a range of soil conditions than highbush types, but nearly all rabbiteye varieties, including ${label}, require a second rabbiteye variety nearby for cross-pollination.`,
  hybrid: label => `${label} is a highbush-rabbiteye hybrid, combining genetics from both blueberry species in a single plant, developed specifically to create an ornamental novelty fruit rather than to optimize for commercial yield or classic flavor. This hybrid background is also why ${label} doesn't fit neatly into either the standard highbush or rabbiteye category most other cultivated blueberry varieties belong to.`,
};

function extraFaqs(fruit) {
  const species = SPECIES_BY_LABEL[fruit.label];
  const needsPartner = species === 'rabbiteye';
  return [
    {
      q: `How many ${fruit.label} bushes should I plant?`,
      a: needsPartner
        ? `At least two, since ${fruit.label} is a rabbiteye variety that requires cross-pollination from a different rabbiteye variety to produce a good crop.`
        : `One ${fruit.label} bush can produce fruit on its own, but planting a second variety with an overlapping bloom time improves fruit set and yield through cross-pollination.`,
    },
    {
      q: `Is ${fruit.label} a good choice for home gardeners?`,
      a: species === 'rabbiteye'
        ? `Yes, though home gardeners should plan to plant it alongside a second rabbiteye variety for pollination, and should have space for the relatively large, vigorous bushes typical of the species.`
        : `Yes, ${fruit.label} is a solid choice for home gardens, producing fruit reliably on its own while benefiting from a second variety planted nearby for improved yield.`,
    },
    {
      q: `What type of blueberry is ${fruit.label}?`,
      a: SPECIES_EXPLAINER[species](fruit.label),
    },
    {
      q: `Can ${fruit.label} be grown in a container?`,
      a: species === 'rabbiteye'
        ? `It's possible but not ideal — rabbiteye varieties like ${fruit.label} tend to grow into large, vigorous bushes better suited to open ground than container life.`
        : `Yes, ${fruit.label} can be grown in a large container with acidic potting mix, though it will need more frequent watering than an in-ground planting and a pot roomy enough for its root system to mature.`,
    },
  ];
}

function generateVarietyPage(fruit, imageIndex) {
  const image = IMAGES[imageIndex % IMAGES.length];
  const title = `${fruit.label} Blueberries - Taste, Information and Facts`;
  const canonical = `${SITE_URL}/fruits/${fruit.slug}`;
  const imageUrl = `${SITE_URL}/images/blog/${image.file}`;
  const desc = `${fruit.tasteNote.split('.')[0]}. Learn about ${fruit.label} blueberry taste, history, season, nutrition, and best uses.`;
  const allFaqs = fruit.faqs.concat(extraFaqs(fruit));

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
    "mainEntity": allFaqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    })),
  }, null, 2);

  const faqHtml = allFaqs.map(f => `          <details class="faq-item">
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
        <span aria-current="page">${fruit.label} Blueberries</span>
      </nav>

      <article class="blog-post">
        <header class="blog-post-header">
          <h1>${title}</h1>
          <p class="blog-post-meta"><time datetime="${PUB_DATE}">July 1, 2025</time> &middot; Orchards Near Me</p>
          <img class="blog-post-featured-image" src="/images/blog/${image.file}" alt="${image.alt}" loading="lazy" width="1200" height="675" />
        </header>

        <div class="blog-post-body">
          <h2>Taste Profile</h2>
          <p>${fruit.tasteNote}</p>
          ${tasteChartHtml(fruit.taste)}

          <h2>History of ${fruit.label} Blueberries</h2>
          <p>${fruit.history}</p>

          <h2>Season and Availability</h2>
          <p>${fruit.season}</p>

          <h2>Nutritional Value</h2>
          <p>${fruit.nutrition}</p>

          <h2>Best Uses for ${fruit.label} Blueberries</h2>
          <p>${fruit.uses}</p>

          <h2>Where ${fruit.label} Blueberries Are Grown Today</h2>
          <p>${fruit.growing}</p>

          <h2>How ${fruit.label} Compares to Other Blueberry Varieties</h2>
          <p>${fruit.comparison}</p>

          <h2>Pollination Needs for ${fruit.label}</h2>
          <p>${POLLINATION_TEXT[SPECIES_BY_LABEL[fruit.label]](fruit.label)}</p>

          <h2>How to Choose and Store ${fruit.label} Blueberries</h2>
          <p>Choose ${fruit.label} blueberries that are plump and firm with a visible natural bloom, avoiding any that look shriveled or show soft spots. Store them unwashed in the refrigerator, where they'll keep for 1 to 2 weeks, and rinse only right before eating. For a full breakdown of blueberry storage, see our guide on <a href="/blog/how-to-store-fresh-picked-blueberries">how to store fresh picked blueberries</a>, and if you're ever unsure whether blueberries have gone bad, check our guide on <a href="/blog/how-to-tell-if-blueberries-are-bad">how to tell if blueberries are bad</a>.</p>

          <h2>Frequently Asked Questions</h2>
          <div class="faq-list">
${faqHtml}
          </div>
        </div>
      </article>

      <section class="related-links seo-content" style="padding-top: 0;">
        <h2>Other Blueberry Varieties</h2>
        <ul class="related-links-list">
${otherVarietiesHtml(fruit.slug)}
        </ul>
      </section>

      <section class="related-links seo-content" style="padding-top: 0;">
        <h2>More From Orchards Near Me</h2>
        <ul class="related-links-list">
          <li><a href="/fruits">All Fruit Varieties</a></li>
          <li><a href="/find/blueberry-picking-orchards-near-me">Blueberry Picking Orchards Near Me</a></li>
          <li><a href="/blog/how-to-store-fresh-picked-blueberries">How to Store Fresh Picked Blueberries</a></li>
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

FRUITS.forEach((fruit, i) => {
  fs.writeFileSync(path.join(OUT_DIR, `${fruit.slug}.html`), generateVarietyPage(fruit, i), 'utf8');
  console.log('Generated:', `${fruit.slug}.html`);
});

module.exports = { FRUITS };
