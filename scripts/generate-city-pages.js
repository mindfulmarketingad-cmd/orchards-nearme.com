#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-');
}

// ---------- Per-category, per-state location counts ----------
// Mirrors the exact matching logic used client-side in js/app.js
// (KEYWORD_DEFS test functions + Garden Center category match) so the
// counts baked into titles/H1s/descriptions match what visitors see.

const KEYWORD_MATCHERS = {
  'apple-picking': (item, text) => {
    if (item.category === 'Orchard') return true;
    return text.includes('apple') && (text.includes('pick') || text.includes('orchard') || text.includes('u-pick') || text.includes('u pick'));
  },
  'cherry-picking': (item, text) => text.includes('cherry'),
  'berry-picking': (item, text) => text.includes('berry') || text.includes('berries') || text.includes('strawberr') || text.includes('blueberr') || text.includes('raspberr') || text.includes('blackberr'),
  'peach-picking': (item, text) => text.includes('peach'),
  'blueberry-picking': (item, text) => text.includes('blueberr'),
  'strawberry-patch': (item, text) => text.includes('strawberr'),
  'pumpkin-patch': (item, text) => text.includes('pumpkin'),
  'u-pick-farms': (item) => item.category === 'Farm' || item.category === 'Orchard',
  hayrides: (item, text) => text.includes('hayride') || text.includes('hay ride'),
};

function computeCategoryStateCounts() {
  const listingsPath = path.join(__dirname, '..', 'data', 'listings.json');
  const data = JSON.parse(fs.readFileSync(listingsPath, 'utf8'));
  const counts = {};
  for (const slug of Object.keys(KEYWORD_MATCHERS)) counts[slug] = {};
  counts['garden-centers'] = {};
  counts['all-orchards'] = {};
  counts['all-farms'] = {};

  for (const item of data.listings) {
    const state = item.state;
    if (!state) continue;
    const text = ((item.name || '') + ' ' + (item.review || '')).toLowerCase();
    for (const slug of Object.keys(KEYWORD_MATCHERS)) {
      if (KEYWORD_MATCHERS[slug](item, text)) {
        counts[slug][state] = (counts[slug][state] || 0) + 1;
      }
    }
    if (item.category === 'Garden Center') {
      counts['garden-centers'][state] = (counts['garden-centers'][state] || 0) + 1;
    }
    if (item.category === 'Orchard') {
      counts['all-orchards'][state] = (counts['all-orchards'][state] || 0) + 1;
    }
    if (item.category === 'Farm') {
      counts['all-farms'][state] = (counts['all-farms'][state] || 0) + 1;
    }
  }
  return counts;
}

const CATEGORY_STATE_COUNTS = computeCategoryStateCounts();

const capitals = [
  { city: 'Montgomery', state: 'Alabama', code: 'AL', region: 'southeast', cherryRegion: 'limited' },
  { city: 'Juneau', state: 'Alaska', code: 'AK', region: 'pacific', cherryRegion: 'limited' },
  { city: 'Phoenix', state: 'Arizona', code: 'AZ', region: 'southwest', cherryRegion: 'limited' },
  { city: 'Little Rock', state: 'Arkansas', code: 'AR', region: 'southeast', cherryRegion: 'limited' },
  { city: 'Sacramento', state: 'California', code: 'CA', region: 'pacific', cherryRegion: 'california' },
  { city: 'Denver', state: 'Colorado', code: 'CO', region: 'mountain', cherryRegion: 'mountain' },
  { city: 'Hartford', state: 'Connecticut', code: 'CT', region: 'new-england', cherryRegion: 'northeast' },
  { city: 'Dover', state: 'Delaware', code: 'DE', region: 'mid-atlantic', cherryRegion: 'mid-atlantic' },
  { city: 'Tallahassee', state: 'Florida', code: 'FL', region: 'southeast', cherryRegion: 'limited' },
  { city: 'Atlanta', state: 'Georgia', code: 'GA', region: 'southeast', cherryRegion: 'limited' },
  { city: 'Honolulu', state: 'Hawaii', code: 'HI', region: 'pacific', cherryRegion: 'limited' },
  { city: 'Boise', state: 'Idaho', code: 'ID', region: 'mountain', cherryRegion: 'mountain' },
  { city: 'Springfield', state: 'Illinois', code: 'IL', region: 'midwest', cherryRegion: 'limited' },
  { city: 'Indianapolis', state: 'Indiana', code: 'IN', region: 'midwest', cherryRegion: 'limited' },
  { city: 'Des Moines', state: 'Iowa', code: 'IA', region: 'midwest', cherryRegion: 'limited' },
  { city: 'Topeka', state: 'Kansas', code: 'KS', region: 'midwest', cherryRegion: 'limited' },
  { city: 'Frankfort', state: 'Kentucky', code: 'KY', region: 'southeast', cherryRegion: 'mid-atlantic' },
  { city: 'Baton Rouge', state: 'Louisiana', code: 'LA', region: 'south-central', cherryRegion: 'limited' },
  { city: 'Augusta', state: 'Maine', code: 'ME', region: 'new-england', cherryRegion: 'northeast' },
  { city: 'Annapolis', state: 'Maryland', code: 'MD', region: 'mid-atlantic', cherryRegion: 'mid-atlantic' },
  { city: 'Boston', state: 'Massachusetts', code: 'MA', region: 'new-england', cherryRegion: 'northeast' },
  { city: 'Lansing', state: 'Michigan', code: 'MI', region: 'midwest', cherryRegion: 'great-lakes' },
  { city: 'Saint Paul', state: 'Minnesota', code: 'MN', region: 'midwest', cherryRegion: 'great-lakes' },
  { city: 'Jackson', state: 'Mississippi', code: 'MS', region: 'southeast', cherryRegion: 'limited' },
  { city: 'Jefferson City', state: 'Missouri', code: 'MO', region: 'midwest', cherryRegion: 'limited' },
  { city: 'Helena', state: 'Montana', code: 'MT', region: 'mountain', cherryRegion: 'mountain' },
  { city: 'Lincoln', state: 'Nebraska', code: 'NE', region: 'midwest', cherryRegion: 'limited' },
  { city: 'Carson City', state: 'Nevada', code: 'NV', region: 'mountain', cherryRegion: 'mountain' },
  { city: 'Concord', state: 'New Hampshire', code: 'NH', region: 'new-england', cherryRegion: 'northeast' },
  { city: 'Trenton', state: 'New Jersey', code: 'NJ', region: 'mid-atlantic', cherryRegion: 'mid-atlantic' },
  { city: 'Santa Fe', state: 'New Mexico', code: 'NM', region: 'mountain', cherryRegion: 'mountain' },
  { city: 'Albany', state: 'New York', code: 'NY', region: 'mid-atlantic', cherryRegion: 'northeast' },
  { city: 'Raleigh', state: 'North Carolina', code: 'NC', region: 'southeast', cherryRegion: 'limited' },
  { city: 'Bismarck', state: 'North Dakota', code: 'ND', region: 'midwest', cherryRegion: 'limited' },
  { city: 'Columbus', state: 'Ohio', code: 'OH', region: 'midwest', cherryRegion: 'mid-atlantic' },
  { city: 'Oklahoma City', state: 'Oklahoma', code: 'OK', region: 'south-central', cherryRegion: 'limited' },
  { city: 'Salem', state: 'Oregon', code: 'OR', region: 'pacific', cherryRegion: 'pacific-nw' },
  { city: 'Harrisburg', state: 'Pennsylvania', code: 'PA', region: 'mid-atlantic', cherryRegion: 'mid-atlantic' },
  { city: 'Providence', state: 'Rhode Island', code: 'RI', region: 'new-england', cherryRegion: 'northeast' },
  { city: 'Columbia', state: 'South Carolina', code: 'SC', region: 'southeast', cherryRegion: 'limited' },
  { city: 'Pierre', state: 'South Dakota', code: 'SD', region: 'midwest', cherryRegion: 'limited' },
  { city: 'Nashville', state: 'Tennessee', code: 'TN', region: 'southeast', cherryRegion: 'limited' },
  { city: 'Austin', state: 'Texas', code: 'TX', region: 'south-central', cherryRegion: 'limited' },
  { city: 'Salt Lake City', state: 'Utah', code: 'UT', region: 'mountain', cherryRegion: 'mountain' },
  { city: 'Montpelier', state: 'Vermont', code: 'VT', region: 'new-england', cherryRegion: 'northeast' },
  { city: 'Richmond', state: 'Virginia', code: 'VA', region: 'mid-atlantic', cherryRegion: 'mid-atlantic' },
  { city: 'Olympia', state: 'Washington', code: 'WA', region: 'pacific', cherryRegion: 'pacific-nw' },
  { city: 'Charleston', state: 'West Virginia', code: 'WV', region: 'mid-atlantic', cherryRegion: 'mid-atlantic' },
  { city: 'Madison', state: 'Wisconsin', code: 'WI', region: 'midwest', cherryRegion: 'great-lakes' },
  { city: 'Cheyenne', state: 'Wyoming', code: 'WY', region: 'mountain', cherryRegion: 'limited' },
];

const allCategories = [
  { slug: 'apple-picking', label: 'Apple Picking', urlPrefix: 'apple-picking-orchards-near-', nearMeUrl: '/find/apple-picking-orchards-near-me', nearMeLabel: 'Apple Picking Orchards Near Me' },
  { slug: 'cherry-picking', label: 'Cherry Picking', urlPrefix: 'cherry-picking-orchards-near-', nearMeUrl: '/find/cherry-picking-orchards-near-me', nearMeLabel: 'Cherry Picking Orchards Near Me' },
  { slug: 'berry-picking', label: 'Berry Picking', urlPrefix: 'berry-picking-orchards-near-', nearMeUrl: '/find/berry-picking-orchards-near-me', nearMeLabel: 'Berry Picking Orchards Near Me' },
  { slug: 'peach-picking', label: 'Peach Picking', urlPrefix: 'peach-picking-orchards-near-', nearMeUrl: '/find/peach-picking-orchards-near-me', nearMeLabel: 'Peach Picking Orchards Near Me' },
  { slug: 'blueberry-picking', label: 'Blueberry Picking', urlPrefix: 'blueberry-picking-orchards-near-', nearMeUrl: '/find/blueberry-picking-orchards-near-me', nearMeLabel: 'Blueberry Picking Orchards Near Me' },
  { slug: 'garden-centers', label: 'Garden Centers', urlPrefix: 'garden-centers-near-', nearMeUrl: '/find/garden-centers-near-me', nearMeLabel: 'Garden Centers Near Me' },
  { slug: 'strawberry-patch', label: 'Strawberry Patch', urlPrefix: 'strawberry-patch-near-', nearMeUrl: '/find/strawberry-patch-near-me', nearMeLabel: 'Strawberry Patches Near Me' },
  { slug: 'pumpkin-patch', label: 'Pumpkin Patch', urlPrefix: 'pumpkin-patch-near-', nearMeUrl: '/find/pumpkin-patch-near-me', nearMeLabel: 'Pumpkin Patches Near Me' },
  { slug: 'u-pick-farms', label: 'U-Pick Farms', urlPrefix: 'u-pick-farms-near-', nearMeUrl: '/find/u-pick-farms-near-me', nearMeLabel: 'U-Pick Farms Near Me' },
];

function relatedLinksHtml(currentSlug, citySlug, stateSlug, city, state) {
  const items = allCategories
    .filter(function (c) { return c.slug !== currentSlug; })
    .map(function (c) {
      return `          <li><a href="/find/${c.urlPrefix}${citySlug}-${stateSlug}">${c.label} Near ${city}, ${state}</a></li>`;
    })
    .join('\n');
  const stateItems = Object.keys(STATE_CATEGORY_CONFIG)
    .map(function (c) {
      return `          <li><a href="/find/${STATE_CATEGORY_CONFIG[c].slugPrefix}${stateSlug}">All ${STATE_CATEGORY_CONFIG[c].label} in ${state}</a></li>`;
    })
    .join('\n');
  return `<section class="seo-content related-links">
      <div class="container">
        <h2>More to Explore Near ${city}, ${state}</h2>
        <ul class="related-links-list">
${items}
${stateItems}
        </ul>
        <p class="related-links-all"><a href="/find">Browse all pick-your-own categories and states</a></p>
      </div>
    </section>`;
}

// ---------- Unique city-level content ----------

const appleIntros = {
  'Montgomery': `Montgomery sits at the intersection of Alabama's rolling coastal plain and the southern edge of the Appalachian foothills, making it a natural base for exploring the apple orchards that cluster in the cooler hills to the north. The farms around Chilton County and the areas near Clanton, about an hour's drive away, have been producing remarkable apples for generations and welcome pick-your-own visitors each fall.`,
  'Juneau': `Juneau's dramatic setting between the Tongass National Forest and the Gastineau Channel doesn't immediately suggest orchard country, but Alaska's apple growers have developed cold-hardy varieties that thrive in the state's unique climate. The growing season is short and intense, and the orchards that exist near Alaskan communities produce fruit with concentrated flavor that reflects the long summer days.`,
  'Phoenix': `Phoenix itself is too warm for most commercial apple production, but the city serves as a gateway to some of Arizona's most surprising apple country. The high-elevation towns of Willcox, Sedona, and Jerome—all within a two-hour drive—sit at elevations where the temperature swings create excellent growing conditions from late August through October.`,
  'Little Rock': `Little Rock occupies a prime spot on the Arkansas River with the Ouachita Mountains to the southwest and the Ozark Plateau stretching north, both of which support thriving apple orchards. The numerous pick-your-own farms across Washington and Benton counties in northwest Arkansas make fall one of the best times to base a trip from the capital.`,
  'Sacramento': `Sacramento Valley's agricultural heart makes the city a natural hub for orchard exploration, with apple growing regions in Apple Hill near Placerville just over an hour east in the Sierra Nevada foothills. The Apple Hill region alone hosts dozens of family orchards open for pick-your-own visits from late August through the holiday season—one of California's most beloved agricultural traditions.`,
  'Denver': `Denver's position at the foot of the Rocky Mountains puts it within reach of the productive orchard country along the Western Slope, particularly around Palisade and Mesa County. The elevation difference between Denver and these orchard valleys creates dramatically different growing conditions that produce some of Colorado's finest apples each fall.`,
  'Hartford': `Hartford sits at the center of one of New England's most storied apple-growing landscapes, with the Connecticut River Valley producing exceptional apples that have been central to the state's agricultural identity for centuries. The orchards surrounding Hartford in towns like Glastonbury, Ellington, and Simsbury have been welcoming pick-your-own visitors for decades and represent the best of New England fall tradition.`,
  'Dover': `Dover's location at the heart of the Delmarva Peninsula places it within easy reach of the apple-growing areas that stretch from Delaware's northern border through the Maryland border counties. The small-scale orchards that dot Kent and New Castle Counties are a quiet local treasure, and the drive north to the larger Pennsylvania operations is a reasonable day trip from the capital.`,
  'Tallahassee': `Tallahassee's position in the Florida Panhandle, at a latitude and elevation that moderates the state's tropical heat, makes it one of the few places in Florida where apple orchards can realistically operate. While Florida isn't known for apple production, the orchards that exist in the hills around the capital produce early-ripening varieties ready as soon as late June—a genuinely unusual season for a Southern capital.`,
  'Atlanta': `Atlanta's greatest advantage for apple picking may be its proximity to the Blue Ridge Mountains, where the orchards of Ellijay—known as the Apple Capital of Georgia—produce hundreds of thousands of bushels each season just ninety minutes north of the city. The drive up from Atlanta through the foothills is itself part of the experience, with roadside stands and farm markets appearing with increasing frequency the further north you travel.`,
  'Honolulu': `Honolulu and Hawaii present a fascinating edge case for apple growing: the islands' tropical climate rules out conventional apple varieties, but several farms on the Big Island and Maui have experimented with low-chill varieties that produce in Hawaii's unique conditions. What you'll find near Honolulu is a fruit-forward agricultural tourism experience that offers something entirely its own—a reminder that picking fruit fresh from a tree is a universal pleasure regardless of latitude.`,
  'Boise': `Boise sits squarely in southern Idaho's orchard country, with the Snake River Plain and surrounding valleys producing exceptional apples in both commercial and pick-your-own scale. The drive along Highway 55 toward McCall passes through orchard valleys that are genuinely beautiful in autumn, and the pick-your-own operations in the Treasure Valley area are accessible and well-organized for family visits.`,
  'Springfield': `Springfield sits in central Illinois farm country where the flat terrain and rich prairie soil have historically favored row crops over orchards, but the family-run apple operations that have survived here do so by specializing in the pick-your-own experience. The rolling ground along the Sangamon River and into the surrounding counties hosts several farms worth seeking out on a fall weekend.`,
  'Indianapolis': `Indianapolis has excellent access to Indiana's orchard belt, which runs along the hilly southern tier of the state from the Ohio River northward into the knobstone escarpment. Brown County, about an hour south of the city, combines apple orchards with fall foliage in a setting that draws thousands of visitors each October and rewards them with some of the state's finest pick-your-own experiences.`,
  'Des Moines': `Des Moines occupies the center of Iowa's agricultural landscape, and while the state is better known for corn and soybeans, the river valleys and eastern bluffs host a surprising number of apple orchards. The farms along the Des Moines River valley and those east toward Iowa City offer accessible pick-your-own options through September and October for anyone willing to make the drive out of the capital.`,
  'Topeka': `Topeka's location in northeast Kansas puts it within reach of the apple orchards that grow in the more sheltered valleys along the Kansas River and its tributaries. Kansas isn't prime apple country by nature, but the state's orchards have adapted well to the plains climate, and the pick-your-own farms that operate here tend to have a warm, community-oriented character that makes a visit feel personal.`,
  'Frankfort': `Frankfort sits in the heart of Kentucky's Bluegrass region, where the gently rolling limestone country supports both the famous horse farms and a quieter tradition of orchard farming. The drive from Frankfort into the eastern Kentucky hills or toward the Knobs region to the south passes through landscapes where small family orchards have maintained a presence for generations.`,
  'Baton Rouge': `Baton Rouge's subtropical climate makes it one of the more challenging bases for apple picking in the country, but the northern parishes of Louisiana—reachable in a two-to-three hour drive—sit in a climatic zone that supports early-ripening apple varieties. The orchards that exist in this part of the South operate in a shorter and earlier window than their northern counterparts, but the experience is no less rewarding.`,
  'Augusta': `Augusta is the capital of one of America's great apple-producing states, with Maine's cool climate and granite-rich soils producing apples that are prized for their crispness and concentrated flavor. The orchards stretching south from Augusta toward Portland and along the Kennebec River valley represent some of the most accessible pick-your-own options in all of New England.`,
  'Annapolis': `Annapolis occupies one of the most apple-rich positions on the East Coast, with the western Maryland counties—Frederick, Washington, and Carroll—hosting dozens of orchards that take advantage of the Catoctin Mountains' ideal growing conditions. From Annapolis, the drive west into orchard country takes under two hours and rewards visitors with some of the region's finest pick-your-own destinations.`,
  'Boston': `Boston is surrounded by one of the densest concentrations of pick-your-own apple orchards in the country, with the hills of Worcester County, the Connecticut River Valley, and the North Shore all hosting farms within an hour of the city. Massachusetts apples are a genuine point of local pride, and the pick-your-own traditions here run deep—many orchards have been operated by the same families for three or four generations.`,
  'Lansing': `Lansing sits in a state that is genuinely one of the apple-growing capitals of North America, with Michigan's unique Great Lakes climate moderating temperatures in a way that produces exceptionally flavorful fruit. The orchards northwest of Lansing, stretching toward the Lake Michigan shoreline counties, are famous for their Honeycrisp, Gala, and Braeburn production and welcome pick-your-own visitors from late summer through fall.`,
  'Saint Paul': `Saint Paul's position along the Mississippi River bluffs puts it in the heart of Minnesota's apple-growing region, where the river valleys provide just enough microclimate protection for orchards to thrive in otherwise challenging territory. The Hastings and Red Wing areas, easily reached from the Twin Cities, are known for their well-established pick-your-own operations and draw visitors from across the metro area each autumn.`,
  'Jackson': `Jackson lies in central Mississippi where the warm climate limits apple variety options but doesn't eliminate orchard life entirely. The orchards that operate near Jackson tend to focus on early-season varieties and provide a pick-your-own experience that feels distinct from the fall harvest traditions further north—more summer than autumn in character, but genuinely rewarding for those who seek it out.`,
  'Jefferson City': `Jefferson City sits on the Missouri River in the center of a state that takes orchard growing seriously, with the Ozark Plateau to the south hosting a cluster of well-established apple farms. The drive from the capital south into the Missouri Ozarks passes through a landscape of cedar glades and rocky hillsides that are genuinely well-suited to apple growing and spectacularly beautiful in the fall.`,
  'Helena': `Helena is surrounded by the massive scale of the Rocky Mountain landscape, and while Montana is not a high-volume apple producer, the valleys around the capital and near Missoula and the Flathead Valley host small but productive orchard operations. The high elevation and dramatic temperature swings between day and night are precisely the conditions that concentrate flavor in the fruit.`,
  'Lincoln': `Lincoln is in the heart of Great Plains farm country, where orchards are less common than in the eastern states but those that exist tend to be well-maintained family operations adapted to the region's climate extremes. The pick-your-own farms east of Lincoln toward Iowa and southeast toward Kansas draw visitors who appreciate the laid-back, unhurried character of plains orchard life.`,
  'Carson City': `Carson City sits in the high desert of the Great Basin, but its position at the foot of the Sierra Nevada puts it surprisingly close to productive orchard country. The Lake Tahoe basin and communities along the eastern Sierra—including Minden and Gardnerville—support a handful of orchards that benefit from the intense sunshine and cool nights of the high desert, producing fruit with remarkable sweetness.`,
  'Concord': `Concord is perfectly positioned for apple picking, sitting in the southern tier of a state where apple orchards are deeply embedded in both the landscape and the culture. New Hampshire's granite hills and cool autumns produce apples with a character that reflects the rugged terrain, and the pick-your-own orchards around the capital and throughout Merrimack County are well-managed and beautiful to visit in season.`,
  'Trenton': `Trenton's location in the Delaware River valley puts it within reach of New Jersey's orchard heartland, which runs through Hunterdon County and the hills of Warren County to the north. New Jersey has a longer and more distinguished history as an apple-growing state than most people realize, and the pick-your-own farms near Trenton represent a tradition going back to the colonial era.`,
  'Santa Fe': `Santa Fe's elevation of seven thousand feet puts it at the high end of what apple orchards can handle, but the communities north and south of the capital—particularly the Rio Grande valley communities like Velarde and Dixon—host some of the most distinctive apple orchards in the Southwest. The New Mexico apple harvest runs from late August into October, producing varieties with flavors shaped by the intense sun and cool nights of the high desert.`,
  'Albany': `Albany stands at the gateway to the Hudson Valley, one of the most celebrated apple-growing regions in the country and the source of some of the finest pick-your-own orchard experiences on the East Coast. The orchards stretching south from Albany through Columbia and Dutchess Counties have been producing apples since the colonial era and continue to set a high standard for quality and variety.`,
  'Raleigh': `Raleigh's location in the Piedmont, roughly equidistant from the Appalachian Mountains and the coast, gives it excellent access to North Carolina's apple country in the west. The Blue Ridge Parkway region around Hendersonville—known as the Apple Capital of the Southeast—is about three hours from Raleigh and rewards the trip with some of the most scenic orchard picking in the eastern United States.`,
  'Bismarck': `Bismarck sits on the Missouri River in a climate that is genuinely challenging for orchard farming, but the hardier apple varieties developed for northern growing conditions have made small-scale operations possible. The orchard farms near Bismarck and throughout the eastern tier of North Dakota are a testament to agricultural persistence and a genuine expression of Great Plains farming culture.`,
  'Columbus': `Columbus is surrounded by Ohio's productive orchard belt, with the hills of southeastern Ohio, the Lake Erie shoreline counties, and the Miami River valleys all hosting established pick-your-own operations. Ohio has a long apple-growing tradition, and the farms within an hour's drive of Columbus include some of the state's most visited destinations for fall family outings.`,
  'Oklahoma City': `Oklahoma City's orchard options are more limited than those of neighboring states, but the rolling hills of eastern Oklahoma—particularly the Ozark region around Tahlequah and the Arkansas border counties—support apple orchards that offer genuine pick-your-own experiences. The drive from Oklahoma City east through the Cross Timbers and into the Ozarks is a striking change of scenery and well worth the journey.`,
  'Salem': `Salem sits in the Willamette Valley, one of the most productive agricultural regions in the western United States, and apple orchards are a significant part of the valley's agricultural fabric. The Hood River Valley to the east—about ninety minutes from Salem—is one of the premier apple-growing districts in the Pacific Northwest, and the orchards in Marion and Polk Counties surrounding Salem are equally worth exploring.`,
  'Harrisburg': `Harrisburg is at the center of Pennsylvania Dutch country, where orchards have been part of the agricultural landscape for three centuries and pick-your-own apple farming is a serious seasonal business. The orchards of Adams County, anchored near Gettysburg about an hour southwest of Harrisburg, collectively make this one of the densest pick-your-own orchard concentrations in the eastern United States.`,
  'Providence': `Providence may be in the smallest state in the union, but Rhode Island's apple orchards punch well above their weight in quality and accessibility. The orchards in Foster, Chepachet, and the hillsides of Providence and Kent Counties produce excellent apples in an intimate New England farm setting that feels genuinely removed from the urban density of the capital.`,
  'Columbia': `Columbia is centrally placed in a state with more orchard variety than most visitors expect, with the Upstate region's Blue Ridge foothills offering a genuine apple-picking culture that stands in contrast to the lowland coast. The orchards around Greenville and Spartanburg, about ninety minutes northwest of Columbia, produce a mix of early and mid-season varieties that draw visitors from across the Carolinas each fall.`,
  'Pierre': `Pierre occupies the geographical center of South Dakota, within driving distance of the Black Hills to the west, where a handful of orchards have established themselves in sheltered valleys and among ponderosa pine forests. The orchards near the Black Hills benefit from elevation and more moderate temperatures than the surrounding plains, producing a small but distinctive fruit harvest each season.`,
  'Nashville': `Nashville is within comfortable reach of Tennessee's apple-growing heartland in the eastern mountains, where the Blue Ridge and Unaka Mountain ranges create ideal conditions for orchard farming. The drive from Nashville east toward Cookeville and into the Cumberland Plateau leads through transitional landscapes where apple orchards become increasingly common the higher and further east you travel.`,
  'Austin': `Austin's location in the Texas Hill Country puts it at the edge of one of the more surprising apple-growing regions in the southern United States, where the Edwards Plateau's elevation moderates temperatures enough for orchard farming. The Medina Lake area and the orchards around Medina—the Apple Capital of Texas—are accessible from Austin in under two hours and offer a genuinely distinctive Southwestern orchard experience.`,
  'Salt Lake City': `Salt Lake City sits in a valley floor surrounded by the Wasatch Range, and the orchards that produce Utah's excellent fruit are found across the valley bench lands and in the communities to the south—Payson, Spanish Fork, and the Utah Valley area. The dry Utah climate, long summer days, and cool nights produce apples with exceptional sweetness and flavor concentration that makes a visit to these orchards particularly worthwhile.`,
  'Montpelier': `Montpelier is the capital of a state that takes apple growing as seriously as any in New England, with Vermont's combination of granite hills, cool climate, and deep agricultural traditions producing some of the finest pick-your-own experiences in the country. The orchards surrounding Montpelier in Washington County and spreading south toward the Connecticut River valley are among the state's most visited farms each autumn.`,
  'Richmond': `Richmond's location in the Virginia Piedmont puts it an easy hour from the Shenandoah Valley, one of the great apple-growing regions of the mid-Atlantic. The valley orchards around Winchester and the north Shenandoah have been supplying apples to cities from the Chesapeake to the Northeast for generations, and the pick-your-own operations there are sophisticated, scenic, and extremely well-run.`,
  'Olympia': `Olympia sits in the top apple-producing state in the nation, and while the rain-drenched Puget Sound area is more focused on evergreen forests than orchards, the drive east across the Cascades leads into the Yakima Valley and Wenatchee area—together responsible for roughly half of all American apple production. Washington orchards set the national standard for quality and variety selection.`,
  'Charleston': `Charleston is surrounded by the rugged Appalachian terrain that gives West Virginia its mountainous character, and the mountain farms and ridge-top orchards that dot the state host apple operations as tenacious as the landscape itself. The Eastern Panhandle orchards near Martinsburg represent a different but equally excellent orchard culture, closer to Washington DC in character and accessibility.`,
  'Madison': `Madison's position in southern Wisconsin gives it access to the orchard belt that runs through the state's lake country, with the communities in Waukesha, Jefferson, and Sauk Counties hosting pick-your-own operations that are reliably good each fall. The Door Peninsula's apple and cherry orchards, a longer drive north, represent the most celebrated of Wisconsin's fruit farming traditions.`,
  'Cheyenne': `Cheyenne sits at the southeast corner of Wyoming where the High Plains meet the Laramie Range, a landscape better known for cattle than for orchards. Wyoming's orchard scene is genuinely small, but the sheltered valleys along the North Platte River support small-scale fruit growing that produces apples with concentrated flavor that comes from growing at altitude in a dry, clear climate.`,
};

const cherryIntros = {
  'Montgomery': `Cherry picking near Montgomery is a limited prospect, as Alabama's warm and humid climate is outside the range that sweet cherry trees prefer for reliable commercial production. Those determined to find cherry picking will have the best luck heading north toward the Tennessee border or into the mountain communities of northeastern Alabama, where small orchards occasionally grow tart cherry varieties in the cooler summer months.`,
  'Juneau': `Alaska's extreme climate limits what's possible in cherry orchards, but the state's long summer days and some protected growing sites have enabled a handful of orchards to grow sour cherry varieties that are remarkably productive in good years. Cherry picking in Alaska is a genuine novelty, and what exists tends to be small-scale and community-focused, making it all the more memorable when you find it.`,
  'Phoenix': `The desert heat of Phoenix makes it unsuitable for conventional cherry growing, but the high-elevation communities of Willcox and the southeastern Arizona sky islands—at elevations above five thousand feet—can support sweet cherry production in a very short early-summer window. If you plan carefully and time a visit to mid-May through June, you may find a small cherry harvest in the mountain communities north and east of Phoenix.`,
  'Little Rock': `Cherry picking near Little Rock is uncommon, as Arkansas's climate sits on the warm edge of what cherry trees tolerate well. The tart cherry varieties grown in the Ozarks in northwestern Arkansas are the best bet, and some orchards in the Fayetteville and Bentonville area combine cherry and apple picking in a single orchard season that begins with cherries in late May before the summer heat sets in.`,
  'Sacramento': `Sacramento is positioned at the edge of some exceptional cherry country, with the orchards in the Brentwood area of Contra Costa County—about an hour's drive southwest—producing some of California's finest Bing and Rainier cherries. The San Joaquin Valley cherry season typically runs from late April through late June, making it an early-season destination that surprises visitors with its quality and the variety of what's available.`,
  'Denver': `Denver's proximity to the Western Slope makes it a reasonable base for cherry picking, with the Palisade and Cedaredge areas producing sweet cherries as well as the region's more famous peaches. Colorado cherries are harvested in late June and July, and the orchards along the Grand Valley welcome picking visitors throughout the season—a beautiful drive through canyon country that makes the trip worthwhile in itself.`,
  'Hartford': `Connecticut has a modest but genuine cherry picking tradition, with a handful of orchards in Litchfield County and the Connecticut River valley offering sweet and sour cherry picking in late June and early July. The cherry season is brief—often just two to three weeks—but catching a Connecticut cherry orchard in peak season is a treat that many state residents don't know to look for.`,
  'Dover': `Delaware's orchard scene includes a modest amount of cherry production, particularly in the northern tier of the state near the Pennsylvania border where the climate is slightly cooler and more amenable to stone fruits. Cherry picking options are limited compared to neighboring states, but the orchards that do grow cherries typically offer the experience alongside their larger apple operations, making it easy to combine both in a single visit.`,
  'Tallahassee': `Cherry picking in the traditional sense isn't really an option near Tallahassee, as sweet cherries require a cold winter rest period that Florida's climate doesn't provide. Those looking for the pick-your-own experience near the capital would do better exploring the strawberry farms that are a Florida specialty, or planning a trip to the cooler states to the north during June cherry season.`,
  'Atlanta': `Like much of the Deep South, the Atlanta area doesn't support sweet cherry production at commercial scale, but the mountain orchards north of the city—particularly in the Ellijay area—do grow some tart cherry varieties harvested in late spring. Cherry picking here is a secondary experience compared to the area's celebrated apple orchards, but worth seeking out if you can time a visit in late May or early June.`,
  'Honolulu': `Hawaii's tropical climate is incompatible with commercial sweet cherry growing, which requires a cold dormancy period that the islands simply don't experience. What you will find near Honolulu are tropical fruit farms producing remarkable alternatives, including varieties that don't exist anywhere on the mainland—offering a different but no less satisfying kind of fresh-from-the-tree picking experience.`,
  'Boise': `Boise sits in an area that produces good sweet cherries alongside its more famous apple and stone fruit crops, with the Snake River Plain and Treasure Valley supporting cherry orchards that are open for picking in late June and July. Idaho cherries benefit from the same intense sun and cool nights that produce the region's other exceptional fruit, and the pick-your-own season draws visitors who often don't realize Idaho grows such excellent cherries.`,
  'Springfield': `Cherry picking options near Springfield are limited, with Illinois's climate sitting at the edge of what sweet cherries prefer. Residents willing to make the drive to Wisconsin's Door Peninsula—a premier cherry-growing region—will find world-class pick-your-own cherry experiences. Some of the orchards in the Mississippi River counties of western Illinois also grow sour cherries used for pies and preserves that are worth seeking out closer to home.`,
  'Indianapolis': `Indiana has a limited cherry picking scene compared to its Great Lakes neighbors, but several northern Indiana farms and some operations in southern Indiana do grow cherry varieties that support pick-your-own visits. Michigan's world-famous cherry orchards near Traverse City are a popular destination for Indiana residents willing to make the longer drive north for the mid-summer cherry season.`,
  'Des Moines': `Iowa is not prime cherry country, but the orchards along the Mississippi River bluffs in the eastern part of the state and some operations in northwest Iowa do grow tart cherry varieties harvested in late June and early July. Cherry picking near Des Moines is a limited but real option, and the farms that do offer it tend to welcome visitors with the warm hospitality that characterizes Iowa agricultural tourism.`,
  'Topeka': `Cherry picking near Topeka is a fairly rare offering, with Kansas orchards more focused on apples and other tree fruits that handle the plains climate more reliably. The tart cherry varieties grown in some eastern Kansas county orchards are the most accessible option, typically harvested in June before the summer heat arrives. Calling ahead to confirm availability is essential given how brief and variable the cherry season can be in Kansas.`,
  'Frankfort': `Kentucky's moderate climate supports sweet cherry growing in the northern counties near the Ohio River, and a handful of orchards in the Bluegrass region produce cherries for pick-your-own visitors in late May and early June. The cherry season in Kentucky is brief but rewarding, and visiting an orchard during the state's early summer—when the horse farms are green and the countryside is at its most beautiful—adds a pleasant dimension to the trip.`,
  'Baton Rouge': `Louisiana's climate effectively rules out traditional sweet cherry growing, as the state's warm winters don't provide the cold dormancy period that cherry trees require. Residents of Baton Rouge looking for cherry picking would need to travel north into Mississippi or Tennessee to find orchards that support the experience, making it more of a destination trip than a local outing.`,
  'Augusta': `Maine's cherry orchards are a smaller but genuine part of the state's agricultural landscape, with orchards in the southwestern and central counties growing sweet and sour varieties that are ready in late July and August—later than in warmer states due to Maine's cool climate. The same orchards that welcome apple pickers in September often run cherry picking programs a couple of months earlier, making them twice-visited destinations for dedicated fruit pickers.`,
  'Annapolis': `Maryland's orchard belt in the western counties—Frederick, Washington, and Carroll—includes cherry orchards that are open for pick-your-own visits in late May and June. The cherries grown in this region include both sweet varieties like Bing and Rainier and sour varieties used for baking, and the season is brief enough that calling ahead to check ripeness before making the drive from Annapolis is highly recommended.`,
  'Boston': `Massachusetts has a genuine cherry picking tradition, with orchards in Worcester County and the Connecticut River valley growing sweet and sour cherries that are typically ready from mid-June through early July. The cherry season here is shorter than apple season but equally worth experiencing, particularly at the orchards that have been growing cherries for multiple generations and know exactly how to time their picking programs.`,
  'Lansing': `Lansing sits within striking distance of the cherry capital of the United States, with the Traverse City area—about three hours north—famous worldwide for its tart cherry production. Michigan grows approximately 75 percent of the nation's tart cherry crop, and the orchards of the Leelanau and Old Mission peninsulas welcome pick-your-own visitors in late June and early July for one of the most celebrated fruit-picking events in the Midwest.`,
  'Saint Paul': `Minnesota's cherry picking options are concentrated in the orchards of the Minnesota River valley and the areas along the North Shore of Lake Superior, where cold-hardy sour cherry varieties have been developed specifically for the state's demanding climate. The cherry season runs from mid-July through August in a growing zone that produces fruit with a tartness and intensity you won't find further south.`,
  'Jackson': `Cherry picking near Jackson is not a practical option given Mississippi's warm and humid climate, which falls well outside the range where cherry trees produce reliably. Mississippi's fruit farms focus on blueberries, peaches, and other warmth-loving crops, and residents who want a cherry picking experience would need to travel north toward the Tennessee border or beyond.`,
  'Jefferson City': `Missouri's moderate climate allows for cherry growing in several parts of the state, with orchards in the Ozark region and along the Missouri River corridor including some cherry production alongside their larger apple and peach operations. Cherry picking near Jefferson City is a June activity, and the farms that offer it typically post picking availability on their websites as the season approaches—worth checking in May so you're ready to move quickly when conditions are right.`,
  'Helena': `Montana's cherry orchards are clustered in the Flathead Valley near Polson and along the lower Flathead Lake shore, where the lake's moderating effect creates one of the best cherry-growing microclimates in the northern Rocky Mountains. The drive from Helena northwest to the Flathead is about two hours and leads into country that grows some of the finest sweet cherries in the West—the kind of trip that rewards planning.`,
  'Lincoln': `Cherry picking options near Lincoln are limited but not entirely absent, with orchards in eastern Nebraska growing tart cherry varieties harvested in late June. The cherry season in Nebraska is brief, and the farms that participate are typically small family operations that appreciate a phone call before you arrive. Residents who make the effort to find these orchards are often rewarded with fresh cherries and a quiet farm experience that feels genuinely off the beaten path.`,
  'Carson City': `The high desert climate around Carson City is challenging for cherries, but the higher elevations of the Sierra Nevada foothills and the Lake Tahoe basin support some sweet cherry production in sheltered locations. The orchards near Minden and Gardnerville in the Carson Valley occasionally offer cherry picking in late June when conditions align, and the setting—against the eastern Sierra Nevada escarpment—is one of the most scenic in the West.`,
  'Concord': `New Hampshire's cherry orchards are a smaller part of the state's fruit-growing landscape than the more prominent apple operations, but sweet and sour cherries do grow in the southern tier of the state and along the Connecticut River valley. Cherry picking near Concord is available at several farm operations from mid-June through early July, typically at the same farms that run their larger apple picking programs in fall.`,
  'Trenton': `New Jersey has a more robust cherry growing industry than most people realize, with the orchards of Hunterdon County and the Delaware Water Gap area producing sweet cherries in late May and June. The close proximity to the Delaware River valley and the agricultural areas of southeastern Pennsylvania means Trenton visitors have access to cherry orchards in multiple directions—a season that overlaps with the region's most beautiful spring weather.`,
  'Santa Fe': `New Mexico's high-elevation orchards, particularly those in the Rio Grande valley communities of Velarde, Dixon, and Alcalde north of Santa Fe, grow sweet cherry varieties harvested in early to mid-June. The cherry season here is brief—sometimes just two weeks—but the fruit produced at these elevations is extraordinary in its sweetness, and the setting in the sage-brushed canyon country is spectacularly beautiful during the early summer harvest.`,
  'Albany': `The Hudson Valley is one of the East Coast's premier cherry growing regions, with orchards from Albany south through Columbia and Dutchess Counties producing sweet and sour cherries from mid-June through early July. Albany's position at the northern end of the valley gives it convenient access to this cherry-rich corridor, and the orchards here often combine cherry picking in June with their better-known apple programs in fall.`,
  'Raleigh': `North Carolina's cherry picking is concentrated in the mountain counties of the western part of the state, where higher elevations and cooler temperatures support sweet and sour cherry growing. The orchards in Haywood, Henderson, and Transylvania Counties—about three hours from Raleigh—offer cherry picking in June, making them a viable spring-season destination for residents who also make the full mountain apple trip each October.`,
  'Bismarck': `Cherry picking near Bismarck is a genuinely rare and limited activity, as North Dakota's continental climate is challenging for most cherry varieties to bear consistently. The hardy sour cherry cultivars developed for northern growing conditions do exist in the state, but the commercial pick-your-own operations for cherry picking are scarce and typically very small in scale. This scarcity makes finding a North Dakota cherry operation a small adventure worth undertaking.`,
  'Columbus': `Ohio has a modest but genuine cherry picking tradition, with orchards in the Appalachian foothills of southeast Ohio and the Lake Erie shore counties growing sweet and sour cherries harvested in late June and early July. Columbus is within a couple of hours of both regions, making cherry picking a viable spring excursion from the capital and a pleasant way to experience Ohio's agricultural diversity before the fall apple season begins.`,
  'Oklahoma City': `Cherry picking near Oklahoma City is limited to the orchards in eastern Oklahoma's cooler hill country, where a handful of farms grow tart cherry varieties suited to the climate. The eastern Oklahoma orchards around Tahlequah and in the Ozark hills are the best bet, accessible in a two-to-three hour drive from the capital—a journey through one of the most scenic parts of the state.`,
  'Salem': `Oregon is one of the finest cherry-growing states in the nation, with the Willamette Valley's mild climate and the Hood River Valley's volcanic soil producing sweet cherries of exceptional quality. The cherry season near Salem runs from mid-May through July depending on variety, and the pick-your-own operations in Marion County and the Hood River Valley are accessible, well-organized, and produce fruit that represents some of the best cherries grown anywhere in the country.`,
  'Harrisburg': `Pennsylvania's cherry orchards are concentrated in the Adams County area and the southern tier of the state, where the climate moderates enough for sweet and sour cherry production in late May and June. The orchards near Gettysburg that are famous for apple picking in autumn also often run cherry picking programs earlier in the season—worth planning well in advance since the season can be brief and spots fill quickly.`,
  'Providence': `Rhode Island's cherry orchards share space with the state's apple operations in the western highlands of Providence and Kent Counties, with sweet cherries typically ready from mid-June through early July. The scale is small given Rhode Island's size, but the farms that do grow cherries are well-managed and the experience tends to be intimate and unhurried—exactly the kind of outing that the smallest state does particularly well.`,
  'Columbia': `Cherry picking options near Columbia are limited by the state's warm climate, which puts South Carolina at the southern boundary of where sweet cherries grow reliably. The mountain orchards in the Upstate—around Greenville and Spartanburg, about ninety minutes north of Columbia—are the best bet for cherry picking in the state, with a season that typically runs in late May and early June before the summer heat arrives.`,
  'Pierre': `Cherry picking in the Pierre area is limited, but the Black Hills region to the west harbors some cherry orchards in its sheltered valleys and among its ponderosa forests. Sour cherry varieties are more common than sweet in South Dakota, and the pick-your-own season, where it exists, runs in July when the high plains finally warm enough to bring the cherries to ripeness. Finding these orchards is part of the adventure.`,
  'Nashville': `Tennessee's cherry picking season runs in late May and early June in the mountain communities of the east, where the elevations are sufficient to moderate the state's heat long enough for cherries to develop properly. The orchards around Sparta, Cookeville, and the Cumberland Plateau produce cherry varieties that bridge the gap between northern and southern fruit farming traditions—worth visiting when you can time the trip to coincide with peak harvest.`,
  'Austin': `Cherry picking near Austin is a limited prospect, as Texas's climate is warm enough to challenge commercial cherry production in most of the state. The Texas Hill Country area west and southwest of Austin is worth exploring for stone fruits generally, and a handful of specialty orchards have trialed sweet cherry varieties that produce in the warmth of spring before the summer heat makes further growing impractical.`,
  'Salt Lake City': `Utah is an underrated cherry state, with the Wasatch Front communities producing both sweet and tart cherries that have been celebrated since the pioneer settlement era. The orchards in Davis and Weber Counties north of Salt Lake City and the communities along the Ogden Valley produce cherries harvested in late June and July, and the pick-your-own operations in this area are genuinely excellent—with a scenic mountain backdrop that makes the experience memorable.`,
  'Montpelier': `Vermont's cherry orchards are smaller than the state's apple operations but no less carefully tended, with sweet and sour cherry varieties grown in the Champlain Valley and the southern Connecticut River valley watershed. Cherry picking near Montpelier is available at a handful of farms from late June through mid-July, with some operations combining cherry and early apple picking in a single farm visit—a true New England summer experience.`,
  'Richmond': `Virginia's Shenandoah Valley is one of the mid-Atlantic's premier cherry growing regions, with orchards around Winchester and Berryville producing sweet and sour cherries harvested in late May and June. The cherry harvest in the Valley often coincides with the peak of spring wildflowers in the Blue Ridge, making a cherry picking trip from Richmond one of the most scenic spring outings in the entire region.`,
  'Olympia': `Washington State is the nation's leading producer of sweet cherries, and Olympia is the capital of the country's premier cherry-growing state. The main cherry-growing regions—the Yakima Valley, Wenatchee area, and Columbia River basin—are three to four hours east of Olympia across the Cascades, but the quality and variety of what you'll find there is unmatched anywhere in the United States, making the drive a genuine pilgrimage for fruit lovers.`,
  'Charleston': `West Virginia's cherry orchards are concentrated in the Eastern Panhandle and the river valley communities of the northern part of the state, where the climate moderates enough for sweet and sour cherry production. The orchards near Martinsburg and Berkeley Springs in the Eastern Panhandle produce cherries in late May and June and often welcome pick-your-own visitors alongside their larger farm operations.`,
  'Madison': `Wisconsin's Door Peninsula is one of the great cherry-growing regions in North America, producing tart cherries on a scale that rivals Michigan. From Madison, the Door Peninsula is about three hours north, and the experience of cherry picking in the peninsula's Scandinavian-influenced farming culture—during a late June picking season—is one of the state's most memorable agricultural tourism experiences, worth every mile of the drive.`,
  'Cheyenne': `Cherry picking near Cheyenne is extremely limited, as Wyoming's continental climate is challenging for most cherry varieties to produce reliably. The sheltered valleys in the Platte River country to the north and communities near Lingle do grow some sour cherry varieties, but residents seeking a genuine cherry picking experience would need to travel to Colorado's Western Slope or Utah's northern orchards for the most rewarding options.`,
};

// ---------- Apple tips (unique per city) ----------

const appleTips = {
  'Montgomery': `When planning your apple picking trip from Montgomery, aim for weekday mornings in September when the weather is coolest and the crowds are thinnest. Many of Alabama's orchards combine apple picking with other farm activities, so bring the whole family and plan to stay for lunch.`,
  'Juneau': `In Alaska, check orchard availability carefully before making the trip since the season can be abbreviated by early fall weather. Local growers are usually happy to discuss what varieties they're growing, and the experience of picking in the shadow of Alaskan peaks and forest is unlike anything available in the lower 48.`,
  'Phoenix': `From Phoenix, plan your orchard trip as a full-day excursion since the best apple country requires at least ninety minutes of driving. The elevation change means a jacket is wise even in October, and the views along the way through the Pinaleno Mountains or the Mingus Mountain area make the drive part of the experience.`,
  'Little Rock': `From Little Rock, the best apple picking is northwest in the Ozarks—set aside a full day and plan to combine orchard visits with some of the region's other attractions. Northwest Arkansas's food and arts scene has grown substantially in recent years, making an apple picking trip a natural anchor for a longer weekend in the area.`,
  'Sacramento': `The Apple Hill region east of Sacramento can get crowded on fall weekends, so consider visiting on a weekday or arriving early on weekends. Bring a cooler for your haul since the drive back can take an hour, and apples stay crisper when kept cool. Many Apple Hill farms also sell cider, jams, and baked goods that are excellent.`,
  'Denver': `The drive to the Western Slope for apple picking is best done as an overnight trip, allowing you to visit orchards on both sides of the divide without rushing. The passes through the Rockies are spectacular in fall, and timing your trip to when the aspens are turning means the orchard visit and the scenery reinforce each other perfectly.`,
  'Hartford': `Connecticut orchards tend to be well-organized for pick-your-own visits, with clear signage and staff on hand to guide visitors to the ready rows. Many offer hayrides to the picking area and farm stores with fresh cider, so plan to spend two to three hours rather than just picking and leaving. The experience is better when you slow down.`,
  'Dover': `Delaware's orchards are modest in scale, which means the pick-your-own experience here tends to be quieter and more personal than at larger regional destinations. Take advantage of that by talking to the farmers—many are happy to explain what varieties they grow and what makes their soil and climate distinct.`,
  'Tallahassee': `If you're picking apples in northern Florida, go early in the season and early in the morning since the heat can make orchard picking uncomfortable by midday. The farms near Tallahassee that grow early apple varieties tend to have a low-key, family-run character that rewards regular visitors who build a relationship with the farm over years.`,
  'Atlanta': `The drive from Atlanta to Ellijay through the foothills is itself a fall highlight, with the roadside stands and the transition from suburban sprawl to mountain farmland happening gradually and beautifully. Plan to spend the whole day—visit an orchard in the morning, have lunch in town, and return with as many apples as you can carry. The cider there is exceptional.`,
  'Honolulu': `For apple-adjacent fruit picking experiences near Honolulu, look for farms offering tropical fruit tours or u-pick operations for guava, starfruit, and papaya. The farming culture in Hawaii is warm and educational, and visiting a farm in the hills above Honolulu or on the Windward side gives a perspective on island agriculture that most tourists never see.`,
  'Boise': `Boise's orchard scene is well-developed and easy to navigate, with several pick-your-own operations within thirty to forty-five minutes of the city. Many farms in the Treasure Valley area sell fresh-pressed cider alongside their picking programs, and the Snake River Canyon scenery that frames the region makes the visit feel appropriately western and expansive.`,
  'Springfield': `The orchards near Springfield tend to be smaller and family-run, which is an advantage if you're looking for a relaxed, personalized experience. Bring more bags than you think you'll need—Illinois apples are plentiful once you start picking, and the varieties grown here for the prairie climate have robust flavors well-suited to pies and cider.`,
  'Indianapolis': `Brown County, Indiana is one of the most visited fall destinations in the Midwest, and combining an orchard visit with the covered bridges and artisan shops of Nashville, Indiana makes for a genuinely rich fall day trip. The apple orchards in the region typically pick from early September through October, so there's a long window to plan a visit.`,
  'Des Moines': `The drive from Des Moines to the Iowa apple orchards east of the city passes through pleasant rolling terrain that feels genuinely rural by Iowa standards. Many of these farms operate small farm stores in addition to their picking programs, and the jams, butters, and baked goods available are excellent—plan to leave room in your car for more than just apples.`,
  'Topeka': `Kansas apple orchards operate on a smaller scale than those in states further east, and the farms near Topeka tend to appreciate visitors who come with genuine curiosity about how fruit grows on the plains. Calling ahead to check what's ripe is especially important in Kansas, where the season can shift significantly from year to year based on spring weather.`,
  'Frankfort': `The drive from Frankfort into Kentucky's orchard country passes through some of the state's most beautiful landscape—the rolling Bluegrass in autumn is exceptional, and if you time your orchard visit to early October the foliage in the hills to the east adds an additional layer of beauty. Kentucky bourbon distilleries in the area make for natural companions to an apple picking trip.`,
  'Baton Rouge': `Given the distance required from Baton Rouge to reach good apple country, this is best treated as a destination trip—plan two or three days in northern Louisiana or southern Mississippi, combining the orchard visit with other regional attractions. The payoff is worth it, particularly if you've never experienced picking fruit that your local grocery won't carry.`,
  'Augusta': `Maine apple orchards are world-class, and Augusta puts you in the center of some of the best. Many farms near the capital offer pick-your-own in September and October, with the added atmosphere of the Kennebec River valley turning golden around you. Fresh Maine cider—pressed from local heritage varieties—is something you should bring home in quantity.`,
  'Annapolis': `The western Maryland orchards that Annapolis visitors should target are some of the most organized and visitor-friendly on the East Coast, with several farms offering pick-your-own access to dozens of varieties across multiple picking dates. The drive from Annapolis through the Maryland piedmont to the orchard country near Frederick and Thurmont is part of what makes the trip feel complete.`,
  'Boston': `With so many orchards within an hour of Boston, you have the luxury of finding one that matches your style—some are large operations with full farm parks, others are quiet family farms that feel like stepping back in time. Both have their appeal. A few Massachusetts orchards grow heritage varieties you simply can't find in any store, and those are worth seeking out specifically.`,
  'Lansing': `Michigan orchards near Lansing take their picking programs seriously, with clear rows, helpful staff, and well-maintained picking bags included in the admission. The best time to visit for variety selection is early to mid-September, when the early types are still finishing and the main-season varieties like Honeycrisp and Gala are at their peak.`,
  'Saint Paul': `The orchards south and east of Saint Paul tend to be beautiful in a distinctly Minnesota way—modest, hardworking, and thoroughly competent. Many serve fresh cider in the picking area and have small stores where you can buy preserves and cider donuts. The views across the Mississippi bluffs in September are a genuine bonus that feels like a reward for the drive.`,
  'Jackson': `Given the earlier and shorter season near Jackson, check orchard websites in late summer for opening dates—many Mississippi orchards begin picking in July and wrap up by September when the heat returns in force. The farms near Jackson that do operate are typically small and family-run, with a warmth and hospitality that makes the experience personal.`,
  'Jefferson City': `The Ozark apple country south of Jefferson City is well worth the drive, with the landscape growing more rugged and scenic as you head south toward the Springfield Plateau. Pack a lunch and make a day of it—the Ozarks in October are among Missouri's most beautiful places, and the apple orchards here are part of a broader agricultural heritage that the region takes seriously.`,
  'Helena': `Montana orchard visits require research and flexibility since operations can be smaller and more variable than in major apple-producing states. The reward is access to fruit grown in extraordinary terrain, and the farms that welcome visitors in the Helena area and in the Flathead Valley tend to have a character that reflects the independence and self-sufficiency of Montana agriculture.`,
  'Lincoln': `The plains orchards accessible from Lincoln operate on a scale that prioritizes quality over volume, and the farms that have survived here do so because they focus relentlessly on the pick-your-own experience. Go with low expectations for variety selection and high expectations for freshness and character—Great Plains apples have a flavor that reflects the extremes of the climate that produces them.`,
  'Carson City': `From Carson City, the orchard country in the Carson Valley and along the eastern Sierra is accessible in a short drive south on US-395. Many of Nevada's small orchards also produce pears and stone fruits, so a visit in late summer may offer several picking options at once. The Sierra Nevada backdrop makes even a modest orchard visit visually spectacular.`,
  'Concord': `New Hampshire orchards take their craft seriously, and Concord sits near several excellent operations that have been refining their pick-your-own programs for decades. Look for farms that grow heritage varieties alongside the mainstream Honeycrisp and Gala—the diversity of what New England breeders have developed over generations is part of what makes the region's orchard scene exceptional.`,
  'Trenton': `New Jersey's orchards may not have the famous reputation of New England's, but several Hunterdon County operations produce exceptional apples in a landscape that feels genuinely removed from the state's urban and suburban image. The drive from Trenton into orchard country takes you through rolling farmland that most Jersey residents never see, and that discovery is part of the reward.`,
  'Santa Fe': `The Rio Grande valley orchards north of Santa Fe—particularly around Velarde and Dixon—are a combination of agricultural tradition and extraordinary scenery that makes a visit feel essential rather than optional. Go in late September or early October when the cottonwoods along the river are turning gold alongside the fruit on the trees, and plan time to visit the local farm stands and the handful of wineries that share the valley.`,
  'Albany': `Hudson Valley orchards near Albany are some of the most visitor-friendly in the country, with many offering wagon rides, cider houses, and farm markets alongside their picking programs. The valley in late September and October is genuinely beautiful, with the Catskills visible to the west and the Hudson flowing alongside the orchard-covered hillsides. Don't leave without buying fresh-pressed Hudson Valley cider.`,
  'Raleigh': `The distance from Raleigh to the mountain apple country makes this a destination trip rather than a quick outing—plan an overnight in the Hendersonville or Asheville area to do it justice. The orchards in that region have excellent variety selection, and the mountain town culture of western North Carolina in fall, with its festivals and farm markets, amplifies what you get from the orchard visit itself.`,
  'Bismarck': `North Dakota apple picking rewards the patient visitor who calls ahead and is flexible about timing. The farmers who have made apple growing work here are doing something genuinely difficult, and their commitment to the craft comes through in the quality of their fruit. Go with curiosity and a willingness to try varieties you've never heard of—that's where the best North Dakota apple experiences live.`,
  'Columbus': `Ohio orchards accessible from Columbus offer excellent variety selection and well-organized pick-your-own programs. The region southeast of Columbus, heading toward Hocking Hills, combines apple orchards with beautiful fall scenery in one of Ohio's most popular day-trip corridors. Many farms there run full farm markets with cider, donuts, and pumpkins that make the visit feel complete.`,
  'Oklahoma City': `The drive from Oklahoma City east to the Ozark apple country is one of the state's better road trips, passing through the Cross Timbers and into the more forested eastern landscapes that most Oklahoma City residents never explore. The orchards at the end of that drive tend to be small and community-oriented, and the welcome is genuine in a way that reflects eastern Oklahoma's agricultural character.`,
  'Salem': `Salem is well-placed to visit multiple orchard zones without a long drive—the Willamette Valley farms are right outside the city, while the Hood River Valley orchards are an hour and a half east via the scenic Columbia River Gorge route. That gorge drive in October, with the orchards of Hood River visible against the backdrop of Mount Hood and Mount Adams, is one of the Pacific Northwest's great seasonal experiences.`,
  'Harrisburg': `The Adams County orchards around Gettysburg are among the most visited and well-organized pick-your-own destinations in the eastern United States, and for good reason—the quality is consistently excellent and the farms have invested in making the experience easy and memorable. Go on a weekday if you can; fall weekends in Adams County can be genuinely crowded but the orchards are big enough to absorb the visitors.`,
  'Providence': `Rhode Island's scale works in its favor for orchard visits—nothing is very far from anywhere, and the orchards west of Providence can be combined with visits to the state's other agricultural attractions in a single comfortable day. The farms in Foster and Gloucester have a quiet western Rhode Island character that feels worlds away from the bustle of the capital, which is part of what makes the outing refreshing.`,
  'Columbia': `The drive from Columbia northwest to the Upstate's apple country passes through the Piedmont and then up into the Blue Ridge foothills—a transition in landscape that is visually significant and makes the arrival at the orchard feel like a genuine arrival somewhere. The Upstate orchards are well-run and the picking season extends from mid-August through October, giving visitors a long window to find a good day.`,
  'Pierre': `Orchard visits from Pierre require some advance research since the Black Hills orchards that serve this region are small and seasonal. Call ahead, confirm hours, and go with a spirit of exploration—finding a working fruit farm in the Black Hills is a discovery worth making, and the farms that exist there tend to produce fruit of surprising quality given the challenging climate.`,
  'Nashville': `The best apple picking from Nashville requires committing to a drive of at least ninety minutes toward the east, but the Cumberland Plateau and the East Tennessee mountain country that you'll pass through is worth experiencing in its own right in October. Many of the orchards in that region also grow pumpkins and other fall produce, turning the visit into a comprehensive autumn experience.`,
  'Austin': `The Texas Hill Country apple orchards near Medina and Bandera are accessible from Austin in under two hours, and the drive through the cedar-covered limestone hills of the Edwards Plateau is beautiful in a distinctly Texan way. The farms in this area often operate as part of broader agritourism operations that include wine, lavender, and other specialty crops—the apple picking is the anchor of a larger Hill Country experience.`,
  'Salt Lake City': `Utah's valley-bench orchards are exceptionally accessible from Salt Lake City, with several pick-your-own operations within thirty to forty-five minutes of the city. The combination of the dry Utah climate, the Wasatch Range as a backdrop, and the quality of the fruit makes a Utah orchard visit feel like a premium experience. Fresh-pressed Utah apple cider is exceptional and not to be missed.`,
  'Montpelier': `Vermont's orchards are some of the most conscientiously run in New England, with many farms maintaining heritage varieties that have been grown in the state for generations. From Montpelier, several excellent orchards are within thirty minutes in multiple directions, and the timing of peak apple season—late September through mid-October—coincides with Vermont's famous fall foliage, making any visit doubly rewarding.`,
  'Richmond': `The Shenandoah Valley orchards from Winchester south through the north Valley are accessible from Richmond in about an hour, and several are large, sophisticated operations with extensive variety selection and well-organized picking programs. Going on the return trip from the Valley on a clear day, with the Blue Ridge on one side and the Massanuttin Ridge on the other, is one of the mid-Atlantic's great fall drives.`,
  'Olympia': `For residents of Olympia who want to visit Washington's apple country, the drive east through the Cascades via US-12 through White Pass or I-90 through Snoqualmie Pass leads to the Yakima Valley and Central Washington—some of the most productive agricultural land in the world. The scale of Washington's orchards is staggering, and the pick-your-own operations that welcome visitors offer a glimpse into the state's most important agricultural industry.`,
  'Charleston': `The mountain terrain around Charleston hosts a number of small orchards that are genuinely worth seeking out, and the Eastern Panhandle operations near Martinsburg represent a different but equally good option for apple picking from the capital. West Virginia apple season runs long in the mild valleys, and the farms in the state have a homegrown, perseverant character that reflects the best of Appalachian agricultural culture.`,
  'Madison': `Madison's proximity to Wisconsin's orchard belt makes fall weekends a prime time for pick-your-own visits, and several farms in Waukesha, Jefferson, and Sauk Counties are within an hour of the capital. The orchards near Madison tend to be modest in scale—well-managed family operations that offer fresh cider and a relaxed picking experience without the commercial feeling of some larger destinations.`,
  'Cheyenne': `Given Wyoming's limited orchard scene, the best apple picking from Cheyenne may require a drive into Colorado—the orchards along I-25 south toward Pueblo or the Western Slope operations accessible via I-70 are both feasible day trips. Wyoming residents who find local apple orchards—and they do exist—are rewarded with fruit grown in one of the most challenging agricultural environments in the country, which tends to produce something genuinely memorable.`,
};

const cherryTips = {
  'Montgomery': `For Alabama residents seeking cherry picking, the most practical approach is to monitor the orchard listings north of the state and plan a trip specifically timed to late May when tart cherry varieties in the mountain foothills come ripe. The reward for the planning and the drive is fresh cherries that no grocery store can match.`,
  'Juneau': `Alaskan cherry picking, where available, is best pursued by connecting with local growers through farmers markets and community boards rather than expecting commercial pick-your-own infrastructure. The small scale of what's possible here is a feature rather than a limitation—it's agricultural curiosity and community connection in its purest form.`,
  'Phoenix': `For cherry picking from Phoenix, the high-elevation orchards require a specific weather window in May and June before summer heat arrives at altitude. Call ahead and be prepared to go on short notice once orchards report readiness—the cherry harvest waits for no one and the window can be as short as ten days in some locations.`,
  'Little Rock': `The Ozark cherry picking near Fayetteville and Bentonville is best timed to late May, before the summer heat turns oppressive in the lower elevations. Northwest Arkansas has developed a strong agritourism culture around its fruit farms, and combining cherry picking with visits to Crystal Bridges Museum and the regional trail system makes for an excellent weekend trip.`,
  'Sacramento': `The Brentwood cherry orchards southwest of Sacramento are a June tradition for many Bay Area and Central Valley families, and rightfully so—the quality of Brentwood Bing and Rainier cherries is exceptional. Arrive early on weekdays to avoid crowds and bring a large cooler; you'll want to bring home more than you plan for.`,
  'Denver': `Colorado cherry picking on the Western Slope is best combined with a broader exploration of the area's fruit and wine scene. Palisade in June is a destination worthy of an overnight stay, with its combination of cherry orchards, peach farms, and wineries offering a full agricultural tourism experience that feels genuinely special.`,
  'Hartford': `Connecticut cherry season is short and variable—the best approach is to follow local orchard social media accounts in late May and June for real-time ripeness updates, then be ready to go on short notice. The farms in Litchfield County that offer cherries are beautiful places to spend a June morning, and the freshness of same-day cherries is worth the planning.`,
  'Dover': `Delaware's cherry picking options require some research to find, but the farms in northern Delaware that grow cherries tend to communicate picking days through local social media and farm websites. Going when they announce readiness rather than planning too far ahead ensures you find cherries at peak ripeness rather than past their best.`,
  'Tallahassee': `For Tallahassee residents who want the cherry picking experience, planning a trip to the mountain orchards of Tennessee or North Carolina in late May is the most practical route. That drive north into cooler elevation puts you into genuine cherry country and can be combined with other spring sightseeing for a complete weekend trip.`,
  'Atlanta': `The limited cherry options north of Atlanta in the Georgia mountains are best pursued as an early-season add-on to a mountain trip rather than as the primary destination. Call orchard websites or social media pages to check for cherry availability in late May, then go prepared for a brief picking window and perhaps move on to the area's hiking or waterfall destinations afterward.`,
  'Honolulu': `For Honolulu residents, the pick-your-own experience to pursue is the rich variety of tropical fruits available on the islands—lychee, starfruit, dragon fruit, and more. These offer the same satisfaction of picking fresh from a tree that mainland cherry orchards provide, but with flavors that reflect the extraordinary growing environment of the Hawaiian islands.`,
  'Boise': `Idaho cherry picking in the Treasure Valley is accessible and excellent—look for farms advertising Bing, Rainier, and Lapins varieties in late June and plan to go early in the day when the cherries are still cool from the night. Idaho cherries have the excellent sugar and acid balance that the region's long summer days and cool nights produce, and the farms that grow them take pride in quality.`,
  'Springfield': `For Illinois residents committed to cherry picking, Wisconsin's Door Peninsula—accessible from Springfield in about three and a half hours—is one of the premier destinations in North America. The peninsula's Scandinavian farming culture, the beautiful Lake Michigan scenery, and the quality of the tart cherries produced there make it a trip worth planning annually.`,
  'Indianapolis': `The Door Peninsula cherry run from Indianapolis is a full-day commitment but absolutely worth it for dedicated cherry enthusiasts. The six-hour drive north pays off with access to Michigan and Wisconsin's world-class cherry orchards—plan the trip in late June and allow for a night's stay to fully experience what the region offers.`,
  'Des Moines': `Iowa's limited cherry picking options reward the patient and persistent visitor who calls orchard listings in late June to check availability. The orchards along the Mississippi River bluffs that do grow cherries are in beautiful terrain, and the combination of fresh cherries and the bluff scenery makes a day trip from Des Moines feel like a genuine escape.`,
  'Topeka': `Kansas cherry picking is a brief and somewhat unpredictable season—check orchard listings as early as mid-May and be prepared to move quickly when availability is announced. The experience of finding and visiting a Kansas cherry orchard is a small adventure, and the freshness of the fruit at pick-your-own operations makes the effort worthwhile.`,
  'Frankfort': `Kentucky's cherry season in late May is one of the year's most pleasant times to be in the countryside—the bluegrass is green, the horse farms are beautiful, and the orchards are coming to life after the long winter. Combining a cherry picking trip with a visit to one of the area's bourbon distilleries makes for a day that captures a lot of what makes central Kentucky special.`,
  'Baton Rouge': `Louisiana cherry enthusiasts should treat a picking trip as an annual destination event—target the orchards in northern Mississippi or southern Tennessee in late May and plan a full weekend. The contrast between the subtropical landscape around Baton Rouge and the more temperate orchard country to the north is itself part of what makes the trip feel special.`,
  'Augusta': `Maine cherry picking runs later in the season than you might expect—late July and August in some locations, thanks to the state's cool climate that extends the fruit development period. This makes Maine cherry season a complement to the state's famous summer and early fall, and the orchards near Augusta that grow cherries are worth adding to any summer farm visit itinerary.`,
  'Annapolis': `The western Maryland cherry orchards near Frederick and Thurmont are accessible from Annapolis in about ninety minutes and are worth targeting in late May and June when the sweet varieties are at their peak. The same orchards often run blueberry picking in July and apple picking in fall, making them year-round destinations for Annapolis residents who discover them.`,
  'Boston': `Massachusetts cherry picking in mid-June is one of the less-publicized seasonal traditions of the Bay State, and the farms in Worcester County and the Pioneer Valley that do grow cherries tend to have loyal followings of locals who know to come back every year. Go early and on a weekday—the cherry harvest is shorter than apple season and the best picking goes quickly.`,
  'Lansing': `Traverse City cherry season is one of Michigan's most celebrated annual events, and residents of Lansing who haven't made the three-hour drive north should put it on their calendar. Late June in Leelanau County combines cherry picking with some of Michigan's most beautiful landscapes—the Old Mission and Leelanau Peninsulas, Lake Michigan vistas, and wine country that rivals anything in the Midwest.`,
  'Saint Paul': `Minnesota's cold-hardy cherry orchards produce fruit with a tartness and depth of flavor that reflects the climate's extremes. The orchards accessible from Saint Paul—both in the Minnesota River valley and further north along the Lake Superior shore—are worth visiting in mid-July when the season peaks, and bringing home a flat of sour cherries for preserves or pie is a Minnesota summer tradition worth adopting.`,
  'Jackson': `For Jackson residents who want cherry picking, the most realistic option is planning a trip north to Tennessee or beyond—either the Cumberland Plateau orchards or, for a full cherry-picking destination, continuing to Michigan or Wisconsin. The drive from Jackson to serious cherry country is long enough to make it an overnight trip rather than a day trip.`,
  'Jefferson City': `Missouri's cherry season is brief and the pick-your-own options are limited, but the farms in the Ozark region and along the Missouri River that do grow cherries are worth tracking down in late May. Calling ahead and being flexible about the exact timing is essential—Missouri cherry orchards don't always announce picking windows far in advance, so staying connected to their websites pays off.`,
  'Helena': `The Flathead Lake cherry orchards near Polson represent one of the genuinely special agricultural experiences available in Montana, and the two-hour drive from Helena is well rewarded. Mid-July brings both sweet cherry harvest and the dramatic blue of Flathead Lake in summer, and the small orchards along the lake's western shore offer an intimate picking experience that feels nothing like a commercial operation.`,
  'Lincoln': `Nebraska's limited cherry picking options reward persistence—find the farms through local agriculture listings or farmers market connections in late June and plan to go when they report readiness. The experience of picking fresh cherries in the plains states is a small but genuine pleasure, and the farms that make it possible are typically happy to have visitors who seek them out.`,
  'Carson City': `The cherry orchards accessible from Carson City via the Carson Valley south of town are worth a late June visit when sweet cherry varieties ripen in the high desert sun. The Sierra Nevada views from the Carson Valley's orchard rows are spectacular, and the intense flavor of cherries grown in that high-altitude, low-humidity environment is genuinely exceptional.`,
  'Concord': `New Hampshire cherry picking in June is a briefer experience than the state's famous fall apple season, but the farms that grow cherries tend to be excellent operations that manage the harvest carefully. Following their social media or email lists in late May gives you the advance notice you need to be there at peak ripeness rather than past it.`,
  'Trenton': `New Jersey's Hunterdon County cherry orchards in late May and June are accessible from Trenton in under an hour and offer a picking experience in some of New Jersey's most beautiful countryside. Many of the farms here welcome visitors for multiple seasons—cherries in spring, berries in summer, apples in fall—and becoming a regular customer means you'll know when to come back.`,
  'Santa Fe': `The Rio Grande valley cherry orchards north of Santa Fe—in Velarde and Dixon—are among the most scenically situated cherry orchards in the country. Go in early June before the heat of summer fully arrives, and plan to spend time in the village of Dixon and its artistic community alongside the orchard visit. The combination of culture, scenery, and fresh cherries is exceptional.`,
  'Albany': `Hudson Valley cherry picking in June is a wonderfully under-the-radar experience given how famous the valley's apple season has become. Many orchards that run large apple-picking operations in fall offer quiet, uncrowded cherry picking a few months earlier to visitors who know to look for it. The valley in June is lush and warm without the fall crowds—an excellent time to explore it.`,
  'Raleigh': `The mountain orchard drive from Raleigh to Henderson County's cherry orchards takes about three hours but combines beautifully with the area's other spring attractions. May and June in western North Carolina bring spring wildflowers, waterfalls at full flow, and the beginning of the orchard season—a combination that makes a cherry picking trip feel like a complete mountain experience.`,
  'Bismarck': `For Bismarck residents interested in cherry picking, Minnesota's orchard belt accessible on I-94 east offers the most practical options—the drive to the Twin Cities area or continuing further to Wisconsin's orchard regions is a viable weekend trip that connects Great Plains residents to the fruit-growing culture of the Upper Midwest.`,
  'Columbus': `Ohio's cherry orchards in the Lake Erie shore counties and the Hocking Hills region are accessible from Columbus in one to two hours and offer pick-your-own experiences in late June and early July. Many of the farms near Millersport and in the eastern Ohio hills that have Grange Fair traditions run cherry picking as an early-season warm-up to their larger fall apple programs.`,
  'Oklahoma City': `The Eastern Oklahoma Ozark orchards accessible from Oklahoma City are better known for apples than cherries, but a handful of operations do grow tart cherry varieties that support late May picking. The drive east to the Tahlequah area is pleasant and the orchards that operate there are welcoming, community-oriented farms that appreciate the visitors who find them.`,
  'Salem': `Oregon cherry picking is one of the Pacific Northwest's great seasonal pleasures, and Salem's central Willamette Valley location puts it close to multiple picking options. The Hood River Valley cherries—accessible via the stunning Columbia River Gorge drive east of Portland—are particularly famous, and the combination of Hood River's cherry season with the gorge scenery makes it one of the region's essential spring experiences.`,
  'Harrisburg': `The Adams County orchards near Harrisburg that run cherry picking programs in late May and June are worth targeting specifically before the better-known fall apple season crowds return. Sweet cherry picking at these farms is a quieter, more intimate experience than the autumn rush, and the Adams County countryside in late spring is beautiful in a way that even long-time residents often overlook.`,
  'Providence': `Rhode Island's small-scale cherry picking operations in the western part of the state are best found through local farm listings and farmers market connections. The brevity of the cherry season—typically two to three weeks in late June—means flexibility is essential, but the intimate character of picking in these small Rhode Island orchards is a genuine pleasure.`,
  'Columbia': `The Upstate South Carolina orchards near Greenville that offer cherry picking in late May are worth the ninety-minute drive from Columbia, particularly if you combine the trip with the area's other offerings. Greenville's food scene has grown remarkably, and a cherry picking morning followed by lunch in the city makes for an excellent day trip that makes the most of what the Upstate offers.`,
  'Pierre': `South Dakota cherry picking is limited enough that finding a farm requires research and direct outreach—look for listings through state agriculture directories and be prepared for small operations that may require advance scheduling. The Black Hills orchards that do grow cherries in their sheltered draws produce fruit with a character shaped by the high plains climate that is worth experiencing.`,
  'Nashville': `Tennessee cherry picking in the mountain communities to the east is a late May excursion that rewards early morning starts and flexibility about exact timing. The drive from Nashville into the Cumberland Plateau and eastern highlands passes through beautiful country, and the orchards there that do grow cherries appreciate visitors who have gone to the trouble of finding them.`,
  'Austin': `Texas cherry picking options are limited but not zero—some specialty orchards in the Hill Country have trialed cold-hardy cherry varieties with varying success, and a call to farm operations in the Fredericksburg or Medina area in April may turn up options. The Texas Hill Country in spring is extraordinarily beautiful regardless, and the journey is worthwhile even if the cherry harvest is small.`,
  'Salt Lake City': `Utah cherry picking north of Salt Lake City in Davis and Weber Counties is an excellent June tradition that more residents should discover. The orchards along the Wasatch Front bench lands are productive and well-organized, and the combination of fresh Utah cherries—some of the sweetest you'll find anywhere—with the mountain backdrop makes a visit feel like a proper seasonal celebration.`,
  'Montpelier': `Vermont's cherry season in late June and July runs alongside the beginning of the state's long agricultural summer, and the farms near Montpelier that grow cherries offer a quieter experience than the famous fall foliage and apple season. Go when the cherries are ripe rather than sticking to a fixed date—Vermont cherry orchards typically communicate ripeness weekly, and being responsive to their updates ensures you arrive at the right time.`,
  'Richmond': `The Shenandoah Valley cherry harvest from late May through June is one of the mid-Atlantic's more underappreciated seasonal experiences, and the drive from Richmond through the Blue Ridge via Skyline Drive or the parallel valley roads is beautiful in the warmth of late spring. The Winchester-area orchards that run cherry picking programs are professional operations with excellent fruit, and several also do apple picking, making them worth visiting twice a year.`,
  'Olympia': `Washington's Eastern Washington cherry harvest is one of the most impressive agricultural events in the country, and making the drive from Olympia across the Cascades to the Yakima or Wenatchee area in late June is an experience that changes your understanding of what cherries can taste like. The scale of what Washington grows, combined with the quality of its Bing and Rainier varieties, makes this drive-and-pick excursion one of the best agricultural tourism experiences in the Pacific Northwest.`,
  'Charleston': `West Virginia's Eastern Panhandle cherry orchards in late May represent a productive combination of the state's mountain character and the moderating influence of the lower Potomac watershed. The drive from Charleston east to the Martinsburg and Berkeley Springs area takes about two hours and leads into orchard country that also grows excellent apples and peaches—worth making it a full fruit-farm weekend rather than a single-day outing.`,
  'Madison': `Door Peninsula cherry picking from Madison is a destination trip rather than a quick excursion, but the three-hour drive north is justified by what you find at the end of it. The peninsula's orchards in June are some of the most beautiful agricultural landscapes in the Midwest, with cherry trees in full production against the backdrop of Green Bay and Lake Michigan. Plan two nights to do it properly.`,
  'Cheyenne': `For Cheyenne residents committed to cherry picking, the most practical options are Colorado's Western Slope orchards near Palisade—accessible via I-70 west—which offer both cherries in June and the broader agricultural diversity of Grand Valley. The drive through the Colorado Rockies on the way to the cherry country is a significant part of what makes the excursion memorable.`,
};

// ---------- Regional middle content ----------

const appleRegion = {
  'new-england': {
    h2: 'New England Orchard Country',
    body: `New England has been growing apples since the first colonists arrived in the seventeenth century, and the orchards that operate today are descendants of that long tradition. The combination of cold winters, warm summers, and the granite-rich glaciated soils that characterize the region produces apples with a brightness and crispness that enthusiasts travel specifically to taste. The pick-your-own tradition is deeply embedded in New England culture—farms in this region have been welcoming families for generations, and many operate farm stores, cider mills, and bakeries alongside their picking programs. Varieties like McIntosh, Cortland, and Macoun are regional classics here, alongside newer arrivals like Honeycrisp and SweeTango that have found ideal growing conditions in the cool northeastern climate.`,
  },
  'mid-atlantic': {
    h2: 'Mid-Atlantic Orchard Heritage',
    body: `The mid-Atlantic states occupy a sweet spot for apple growing: far enough north for cold winters that the trees need to rest and set fruit, but warm enough that a long growing season produces apples with good size and sugar content. The Appalachian highlands that run through this region—from the Catskills and Poconos in the north through the Blue Ridge and Shenandoah Valley—create ideal orchard country, with the valley soils and mountain air circulation keeping both frost pests and disease pressure in check. The orchard culture here ranges from the organized commercial operations of the Pennsylvania Dutch country to the small farm-to-table orchards of the Hudson Valley, but all of them share a commitment to producing apples that reflect the specific character of their place.`,
  },
  'southeast': {
    h2: 'Apple Growing in the Southeast',
    body: `Apple growing in the southeastern United States is concentrated in the mountain counties where elevation moderates the regional heat enough for orchards to thrive. The Blue Ridge, Great Smoky Mountains, and Appalachian foothills that run through North Carolina, Tennessee, Virginia, and Georgia all host apple orchards, many of which have been family-operated for multiple generations. The season here runs slightly earlier than in the north—late August and September are typically peak—and the mountain setting adds a scenic dimension to pick-your-own visits that flat-country orchards can't match. Varieties grown in the Southeast tend toward those that can handle heat and humidity, including Stayman Winesap, Granny Smith, and some proprietary varieties developed specifically for southern growing conditions.`,
  },
  'midwest': {
    h2: 'Orchard Country in the Midwest',
    body: `The Midwest's apple orchards benefit from the Great Lakes' moderating influence in the northern tier of the region, while the river valleys and sheltered glacial terrain of states like Ohio, Indiana, and Illinois provide enough protection for productive orchards to operate successfully. Michigan is the agricultural powerhouse of the region, producing more apples than any state except Washington, but the orchards of Ohio, Minnesota, Wisconsin, and even the Great Plains states offer pick-your-own experiences that draw local families each fall. The varieties grown in the Midwest include Honeycrisp—developed at the University of Minnesota—alongside classics like Jonathan, Cortland, and Golden Delicious that thrive in the continental climate.`,
  },
  'mountain': {
    h2: 'High-Country Apple Orchards',
    body: `The mountain west's apple orchards produce fruit that is shaped by altitude, sunshine intensity, and the dramatic temperature swings between warm days and cool nights that characterize high-desert and alpine growing conditions. The result is apples with concentrated sugars, bright acidity, and a firmness that reflects the slow development the elevation imposes. Colorado's Western Slope, Idaho's Snake River Plain, Utah's Wasatch valleys, and Montana's Flathead Valley all host productive orchard regions, and the pick-your-own operations that welcome visitors in these areas offer a distinctly western experience—big skies, mountain backdrops, and a character of agricultural self-sufficiency that feels different from orchards in more densely populated regions.`,
  },
  'south-central': {
    h2: 'Apple Orchards in the South-Central States',
    body: `Apple growing in Texas, Louisiana, and Oklahoma is a story of adaptation and persistence. The climate in these states sits at the warm edge of what apple trees tolerate, and the orchards that succeed here do so through careful variety selection, site choice, and management. The result is a pick-your-own experience that differs from the northern norm in timing—many operations run in late summer or early fall rather than October—and in the varieties available, which skew toward low-chill heat-tolerant cultivars rather than the cold-hardy traditional varieties of New England. The orchards that have made apple growing work in this climate are genuinely interesting agricultural operations, and visiting them means learning something about what the species is capable of at the margins of its range.`,
  },
  'pacific': {
    h2: 'Pacific Coast Apple Country',
    body: `The Pacific states produce some of the finest apples in the world, with Washington State alone responsible for roughly sixty percent of American commercial apple production. Oregon's Willamette Valley and Hood River, California's high-elevation Sierra Nevada foothills, and even Alaska's sheltered growing sites all contribute to a Pacific apple culture that encompasses everything from industrial-scale commercial orchards to tiny artisan operations growing heirloom varieties for the farmers market trade. The climate along the Pacific coast—particularly in the inland valleys and foothill regions—provides the warm days and cool nights that produce exceptional apple flavor, and the pick-your-own operations that welcome visitors here tend to offer variety selection and quality that is hard to match anywhere else in the country.`,
  },
  'southwest': {
    h2: 'Arizona and Hawaii: Unexpected Apple Country',
    body: `Arizona and Hawaii represent the most unusual contexts for apple growing in the United States, and the orchards that do exist in these states are genuinely noteworthy for what they've accomplished at the margins of the apple's natural range. Arizona's high-elevation communities—Willcox, Sedona, Jerome, and the sky islands of the southeast—create pockets of temperate climate within the desert state, and the orchards there have developed a following among Arizona residents who drive hours for the experience. Hawaii's warm climate rules out traditional apple growing, but specialty farms have experimented with low-chill varieties that produce in tropical conditions, offering something novel for the fruit-curious visitor.`,
  },
};

const cherryRegion = {
  'pacific-nw': {
    h2: 'Pacific Northwest: Cherry Country',
    body: `The Pacific Northwest is the cherry-growing capital of the United States, producing the majority of the country's sweet cherry crop with a quality that sets the international standard. Washington's Columbia River basin and the Yakima and Wenatchee valleys grow Bing, Rainier, Chelan, and Lapins varieties in conditions that are essentially ideal—warm days, cool nights, low humidity, and volcanic soils with excellent drainage. Oregon's Willamette Valley and Hood River region contribute their own high-quality harvest, with some cherry varieties available from May through July depending on elevation and variety. Pick-your-own cherry operations in this region welcome visitors from around the country during the harvest window, and the experience of picking ripe Rainier cherries in a Washington orchard on a warm June morning is one of the country's finest agricultural tourism experiences.`,
  },
  'california': {
    h2: 'California Cherry Season',
    body: `California grows excellent sweet cherries in the San Joaquin Valley foothills and the areas around Stockton and Brentwood, with the harvest running from late April through late June depending on location and variety. The Brentwood cherry region in Contra Costa County is particularly well-developed for pick-your-own visitors, with a concentration of family orchards that have operated for generations and maintain a strong local following. California's cherry season is the earliest in the country, and the quality of the Bing and Rainier cherries produced here—fat, sweet, and deeply flavored from the California sun—draws visitors who time their spring trips specifically around the harvest window.`,
  },
  'great-lakes': {
    h2: 'Great Lakes Cherry Country',
    body: `The Great Lakes region produces more tart cherries than any other part of the world, with Michigan's Leelanau and Old Mission Peninsulas responsible for a remarkable seventy-five percent of the United States' tart cherry crop. The unique microclimate of the peninsulas—moderated by Lake Michigan on both sides—creates frost protection in spring and extended growing conditions in fall that make them uniquely suited to cherry production. Wisconsin's Door Peninsula offers a similarly lake-moderated growing environment, producing excellent tart cherries in a Scandinavian-influenced farming culture that has made cherry picking a regional tradition. The pick-your-own operations in both Michigan and Wisconsin are professional, well-organized, and celebrate the cherry harvest with festivals and community events that make a trip during season feel like a genuine occasion.`,
  },
  'northeast': {
    h2: 'New England and Northeast Cherry Picking',
    body: `The northeastern states grow both sweet and sour cherry varieties in their orchards, with the best operations concentrated in New York's Hudson Valley, Massachusetts's Connecticut River valley, and the highlands of Connecticut, New Hampshire, and Vermont. The cherry season in the Northeast runs from mid-June through early July—briefer than apple season but equally rewarding for those who plan for it. The same farms that run large apple picking programs in the fall often run quieter, more intimate cherry picking programs in early summer, offering a chance to experience orchard country when it's less crowded and the landscape is at its early-summer best. Heritage sweet varieties and old-fashioned sour pie cherries coexist at many of these farms, and the fresh-pressed cherry juice available at farm stands is worth seeking out specifically.`,
  },
  'mid-atlantic': {
    h2: 'Mid-Atlantic Cherry Season',
    body: `The mid-Atlantic states offer some of the best cherry picking access on the East Coast, with the orchards of Virginia's Shenandoah Valley, Maryland's western counties, New Jersey's Hunterdon County, and Pennsylvania's Adams County all growing sweet and sour cherries that support pick-your-own programs in late May and June. The cherry harvest in this region precedes the apple season by several months, providing an early-summer reason to visit the same orchard country that draws apple pickers each fall. Virginia's Shenandoah Valley is particularly notable for its cherry production, with the orchards around Winchester producing sweet varieties that rival anything grown in the Pacific Northwest for quality and flavor.`,
  },
  'mountain': {
    h2: 'Mountain West Cherry Orchards',
    body: `The mountain west's cherry orchards benefit from the same altitude and climate extremes that make the region exceptional for apples—the intense sunshine and cool nights of high-elevation growing produce cherries with concentrated sweetness and flavor that flat-country orchards can't match. Utah's Wasatch Front orchards, Colorado's Western Slope, Idaho's Treasure Valley, Montana's Flathead Lake region, and Nevada's Sierra Nevada foothills all host cherry growing operations that welcome pick-your-own visitors in late June and July. The scale is smaller than Pacific Northwest cherry production, but the quality is often exceptional, and the settings—against mountain backdrops with clear high-desert sky—make for some of the most beautiful orchard visits available anywhere.`,
  },
  'limited': {
    h2: 'Finding Cherry Picking Near You',
    body: `While this area isn't in the heart of traditional cherry-growing country, that doesn't mean a pick-your-own cherry experience is impossible to find. Sour or tart cherry varieties—used for pies, preserves, and juice—are hardier than sweet varieties and grow in a wider range of climates, meaning that small-scale orchards in unlikely locations sometimes offer cherry picking that even local residents don't know about. The best approach is to search local farm listings, check with your regional agriculture extension service, and follow local farm social media accounts that announce ripeness as it happens. When you do find a cherry orchard operating outside the traditional growing zones, you're finding something genuinely special: a farm that has made something work through persistence and ingenuity, producing fruit with a character shaped by the specific place where it grows.`,
  },
};

// ---------- State-level season timing ----------

const appleSeason = {
  Alabama: 'Late July through September, with early-ripening varieties like Lodi and Transparent ready in late summer and mid-season varieties like Fuji and Gala through September.',
  Alaska: 'Late August through September in most locations, compressed by the short growing season but intense due to the long summer days.',
  Arizona: 'Late August through October at elevation, with high-country varieties at their best in September when the temperature swings are most pronounced.',
  Arkansas: 'August through October, with the Ozark plateau orchards hitting their peak in September for most mid-season varieties.',
  California: 'August through November, with the season varying significantly by elevation—Apple Hill near Placerville peaks in September and October at higher elevation.',
  Colorado: 'August through October on the Western Slope, with the peak for most popular varieties falling in late September when the mountain nights bring out the best color and flavor.',
  Connecticut: 'Late August through October, with McIntosh, Cortland, and Macoun varieties typically at peak in mid-September.',
  Delaware: 'Late August through October, with the small orchard operations near the Pennsylvania border hitting their stride in September.',
  Florida: 'July through August for early-season varieties, considerably earlier than most apple-growing states due to Florida\'s warm and shorter winter dormancy period.',
  Georgia: 'August through October in the North Georgia mountain orchards, with the highest-elevation farms running their season deepest into fall.',
  Hawaii: 'Year-round picking of tropical and specialty varieties at the handful of farms that grow adapted apple cultivars.',
  Idaho: 'August through October in the Treasure Valley and Snake River Plain areas, with the high-country orchards north of Boise running slightly later.',
  Illinois: 'September through October for most mid-season varieties, with the orchards in southern Illinois starting slightly earlier due to the warmer climate.',
  Indiana: 'September through October, with the hilly southern Indiana orchards typically peaking in mid-September and holding through the end of the month.',
  Iowa: 'September through October for most varieties, with the eastern Iowa river bluff orchards often holding their fruit longest due to the moderating influence of the valley terrain.',
  Kansas: 'September through October, with the season running shorter than in more eastern states due to the plains climate variability.',
  Kentucky: 'August through October, with the eastern mountain counties producing varieties that run into mid-October and the Bluegrass region orchards peaking in September.',
  Louisiana: 'July through August for early-ripening varieties in the northern parishes, significantly earlier than the national norm.',
  Maine: 'Late August through October, with the Kennebec Valley and York County orchards often holding good variety selection deepest into fall.',
  Maryland: 'Late August through October in the western county orchards, with the Frederick and Washington County farms hitting peak variety selection in late September.',
  Massachusetts: 'Late August through October, with the Connecticut River valley orchards and Worcester County farms providing some of the best variety selection in the country throughout September.',
  Michigan: 'August through October, with the Lake Michigan shoreline counties typically running the longest season thanks to the lake\'s moderating influence.',
  Minnesota: 'September through October for most varieties, with the river valley orchards near the Twin Cities hitting peak selection in mid-September.',
  Mississippi: 'July through September for the farms in the northern part of the state that grow early-season varieties adapted to the warm climate.',
  Missouri: 'August through October, with the Ozark plateau orchards peaking in September and the Missouri River valley farms running slightly later.',
  Montana: 'August through September, with the Flathead Valley orchards running the longest season thanks to the lake\'s moderating influence.',
  Nebraska: 'September through October for most varieties, with the picking season running shorter and more compressed than in the more eastern Corn Belt states.',
  Nevada: 'August through October for the Carson Valley and Sierra Nevada foothill orchards, with the high elevation sites producing their best fruit in September.',
  'New Hampshire': 'Late August through October, with the Merrimack Valley and Monadnock region orchards offering excellent variety selection throughout September.',
  'New Jersey': 'Late August through October, with the Hunterdon County and Warren County farms offering one of the state\'s most underappreciated agricultural experiences.',
  'New Mexico': 'August through October for the Rio Grande valley orchards, with high-altitude locations near Velarde and Chimayo at their peak in September.',
  'New York': 'Late August through October, with the Hudson Valley and western New York orchards maintaining variety selection well into the fall.',
  'North Carolina': 'August through October in the mountain counties, with the Henderson County orchards peaking in September and some operations running into early November.',
  'North Dakota': 'September through October for the hardy varieties that have been developed for the northern plains climate, with the season running shorter than in southern states.',
  Ohio: 'Late August through October, with the Appalachian foothills and Lake Erie shore counties both offering excellent pick-your-own access through mid-October.',
  Oklahoma: 'August through September for the orchards in eastern Oklahoma, with the season running earlier than in northern states due to the warmer climate.',
  Oregon: 'August through November for the Willamette Valley and Hood River orchards, with the season\'s extended length a reflection of Oregon\'s mild and productive growing conditions.',
  Pennsylvania: 'Late August through October, with the Adams County orchards near Gettysburg offering some of the most variety-diverse pick-your-own programs in the mid-Atlantic.',
  'Rhode Island': 'Late August through October for the western Providence and Kent County orchards, with the season compressed but high-quality during its peak in September.',
  'South Carolina': 'August through October in the Upstate mountain orchards, with the foothills farms running slightly later than the valley operations at lower elevation.',
  'South Dakota': 'September through October for the Black Hills orchards, with the season shorter and more compressed than in neighboring Minnesota or Iowa.',
  Tennessee: 'August through October in the east Tennessee mountain counties, with some orchards in the Cumberland Plateau running their season into November.',
  Texas: 'July through September for the Hill Country orchards near Medina and Bandera, significantly earlier than northern states due to Texas\'s climate and the varieties grown there.',
  Utah: 'August through October for the Wasatch Front bench orchards, with the Utah Valley farms south of Salt Lake City typically offering the longest picking season.',
  Vermont: 'Late August through October, with the Champlain Valley and Connecticut River valley farms offering excellent access to heritage varieties through mid-October.',
  Virginia: 'Late August through October in the Shenandoah Valley, with the Winchester-area orchards known for their extended season and variety of both heritage and modern cultivars.',
  Washington: 'August through November in the Yakima and Wenatchee areas, with Washington\'s long season one of the reasons the state produces such a remarkable variety of apples.',
  'West Virginia': 'Late August through October in the Appalachian valley orchards, with the Eastern Panhandle farms often running the longest and most variety-diverse season in the state.',
  Wisconsin: 'September through October, with the Door Peninsula orchards running slightly later than the southern Wisconsin farms due to the lake-moderated microclimate.',
  Wyoming: 'August through September for the sheltered valley orchards, with the season shorter and more concentrated than in neighboring states due to the altitude and climate.',
};

const cherrySeason = {
  Alabama: 'May through June for the limited tart cherry options in the northern mountain counties, significantly earlier than the apple season that follows in late summer.',
  Alaska: 'July through August for the sour cherry varieties that have been adapted for Alaska\'s extreme climate, with the season varying significantly by location and year.',
  Arizona: 'May through June at elevation, with the high-country cherry orchards hitting their brief harvest window in mid-May through early June before summer heat arrives.',
  Arkansas: 'Late May through June for the Ozark cherry operations, with tart varieties typically ready before the summer heat sets in.',
  California: 'Late April through late June depending on location, with the Brentwood and San Joaquin Valley orchards starting earliest and the Sierra Nevada foothill farms running the season into late June.',
  Colorado: 'Late June through July on the Western Slope, with the Palisade and Cedaredge orchards producing their cherries in a window that precedes the famous peach harvest.',
  Connecticut: 'Mid-June through early July for the Litchfield County and Connecticut River valley cherry orchards, a brief but excellent season.',
  Delaware: 'Late May through June for the limited cherry operations near the Pennsylvania border, with the season aligning closely with neighboring Maryland\'s.',
  Florida: 'Cherry picking in the traditional sense isn\'t available in Florida; look for local blueberry or strawberry pick-your-own operations instead.',
  Georgia: 'Late May through June for the limited tart cherry options in the North Georgia mountain orchards, with availability varying significantly year to year.',
  Hawaii: 'Year-round for tropical cherry varieties on the Big Island and Maui; traditional sweet cherry picking isn\'t available in Hawaii.',
  Idaho: 'Late June through July for the Treasure Valley and Emmett area cherry orchards, with the season running a bit later than California due to Idaho\'s northern latitude.',
  Illinois: 'Late June through July for the limited cherry operations in western Illinois, with the season brief and availability variable enough to require advance communication with farms.',
  Indiana: 'Late June through July for the small number of Indiana orchards that grow cherry varieties, with the season brief and the options limited compared to neighboring Michigan.',
  Iowa: 'Late June through July for the tart cherry operations along the Mississippi River bluffs, with availability variable enough to require advance research.',
  Kansas: 'June for the limited tart cherry operations in eastern Kansas, with the season short and planning essential to arrive when the fruit is ready.',
  Kentucky: 'Late May through June for the northern Kentucky sweet cherry orchards, with the season running briefly but beautifully alongside the state\'s spring countryside.',
  Louisiana: 'Cherry picking isn\'t practically available near Baton Rouge; consider a trip north to Mississippi or Tennessee for the closest cherry orchard options.',
  Maine: 'Late July through August for Maine\'s cherry varieties, significantly later than in warmer states due to Maine\'s cool climate and shorter growing season.',
  Maryland: 'Late May through June for the Frederick and Washington County orchards, with sweet and sour varieties typically at their best in early June.',
  Massachusetts: 'Mid-June through early July for the Worcester County and Connecticut River valley cherry orchards, a brief and underappreciated season.',
  Michigan: 'Late June through July, with the Leelanau and Old Mission Peninsula tart cherry harvest typically at peak in the last week of June and first week of July.',
  Minnesota: 'Mid-July through August for the cold-hardy sour cherry varieties developed for Minnesota\'s demanding climate, later than in any state further south.',
  Mississippi: 'Cherry picking isn\'t practically available near Jackson; the most accessible cherry orchards require a drive to Tennessee or Alabama.',
  Missouri: 'Late May through June for the cherry operations in the Ozark region and along the Missouri River corridor, with the season brief and communication with farms essential.',
  Montana: 'Mid-July for the Flathead Lake orchards near Polson, with the lake\'s moderating influence producing a reliable but brief cherry harvest in this otherwise challenging climate.',
  Nebraska: 'Late June through July for the small number of tart cherry operations in eastern Nebraska, with the season variable enough to require advance communication with growers.',
  Nevada: 'Late June through July for the Carson Valley and Sierra Nevada foothill cherry orchards, with the high-desert climate producing a brief but high-quality harvest.',
  'New Hampshire': 'Mid-June through early July for the southern New Hampshire and Connecticut River valley cherry orchards, with the season running later than in the mid-Atlantic states.',
  'New Jersey': 'Late May through June for the Hunterdon County and Warren County cherry operations, with sweet varieties typically at their best in early June.',
  'New Mexico': 'Early through mid-June for the Rio Grande valley orchards near Velarde and Dixon, with the high-altitude harvest window brief and weather-dependent.',
  'New York': 'Mid-June through early July for the Hudson Valley cherry orchards, with the season offering both sweet and sour varieties across a two-to-three week window.',
  'North Carolina': 'Late May through June for the mountain county cherry orchards in Haywood, Henderson, and Transylvania Counties, before the area\'s more famous apple season begins.',
  'North Dakota': 'July through August for the hardy sour cherry varieties grown in North Dakota, with the season running late due to the northern climate and brief summers.',
  Ohio: 'Late June through early July for the Lake Erie shore county and Appalachian foothills cherry orchards, with the season brief but the quality generally excellent.',
  Oklahoma: 'Late May through June for the limited tart cherry operations in eastern Oklahoma\'s Ozark hill country, with the season shorter than in more northern states.',
  Oregon: 'Mid-May through July for the Willamette Valley and Hood River cherry orchards, with the Dalles area along the Columbia River typically producing the earliest and most productive harvests.',
  Pennsylvania: 'Late May through June for the Adams County and southern Pennsylvania orchards, with sweet varieties at peak in early June and sour varieties running slightly later.',
  'Rhode Island': 'Mid-June through early July for the small-scale cherry operations in western Rhode Island, with the season brief and picking typically organized by appointment.',
  'South Carolina': 'Late May through June for the limited Upstate cherry orchards near Greenville and Spartanburg, with the season brief at these latitudes.',
  'South Dakota': 'July through August for the Black Hills cherry orchards, with the season running later than in neighboring states due to the high elevation and continental climate.',
  Tennessee: 'Late May through June for the mountain county cherry orchards in the east, with the Cumberland Plateau farms typically ready by early June.',
  Texas: 'May for the very limited cherry options in the Hill Country, with the harvest window brief and availability highly variable year to year.',
  Utah: 'Late June through July for the Wasatch Front bench orchards north of Salt Lake City, with the season aligning closely with neighboring states at similar latitude.',
  Vermont: 'Late June through mid-July for the Champlain Valley and Connecticut River valley cherry orchards, with some farms combining early cherry picking with strawberry programs.',
  Virginia: 'Late May through June for the Shenandoah Valley orchards around Winchester and Berryville, one of the premier early-summer cherry destinations on the East Coast.',
  Washington: 'May through July depending on variety and elevation, with the Yakima Valley Bings typically ready in late May and the higher-elevation Rainiers peaking in late June.',
  'West Virginia': 'Late May through June for the Eastern Panhandle orchards near Martinsburg and Berkeley Springs, with the season brief and calling ahead highly recommended.',
  Wisconsin: 'Late June through mid-July for the Door Peninsula tart cherry orchards, with the lake-moderated climate making the season one of the most reliable in the Upper Midwest.',
  Wyoming: 'Cherry picking isn\'t practically available near Cheyenne; Colorado\'s Western Slope or Utah\'s Wasatch Front are the most accessible cherry orchard options.',
};

// ---------- Berry picking content ----------

const berryIntros = {
  'Montgomery': `Montgomery sits within reach of central Alabama's strawberry country, with the farms around Cullman and Chilton County offering pick-your-own strawberries each spring before the blueberry bushes in the same area come ripe in early summer. The two seasons back-to-back give Montgomery families two distinct reasons to head north for a berry-picking morning.`,
  'Juneau': `Juneau's surrounding forests are full of wild berries, and while commercial pick-your-own farms are scarce in southeast Alaska, salmonberries, blueberries, and huckleberries grow abundantly along the trails and muskegs around the city. Locals treat late-summer berry foraging as a cherished ritual, with bear awareness as essential gear as a bucket.`,
  'Phoenix': `Phoenix's desert floor isn't berry country, but the high-elevation communities around Flagstaff and Prescott, a few hours north, occasionally host small raspberry and strawberry operations that take advantage of the cooler mountain summers. A berry-picking day from Phoenix is best treated as part of a broader high-country getaway.`,
  'Little Rock': `Little Rock is a reasonable drive from Cave City, Arkansas, long celebrated for growing some of the sweetest strawberries in the South thanks to its sandy, mineral-rich soil. Blackberry season follows in early summer across the Ozark foothills, giving central Arkansas residents a full spring-into-summer berry-picking calendar.`,
  'Sacramento': `Sacramento sits at the edge of California's enormous strawberry industry, with u-pick strawberry fields scattered through the Central Valley and blueberry operations increasingly common in the foothills. California's growing season is long enough that berry picking near Sacramento can stretch from April through late summer depending on what's in season.`,
  'Denver': `Denver's berry-picking options lean toward the high-altitude raspberry and currant farms tucked into the foothills west of the city, where cool nights and intense sun produce fruit with concentrated flavor. A handful of u-pick operations near Boulder and along the Front Range make for an easy half-day trip.`,
  'Hartford': `Hartford is surrounded by Connecticut's strawberry and blueberry farms, with the Litchfield Hills and the lower Connecticut River valley both hosting well-established pick-your-own operations. Strawberries typically lead the season in June, followed by blueberries through July and August at many of the same family farms.`,
  'Dover': `Dover sits in the heart of the Delmarva Peninsula's berry country, where the sandy coastal-plain soil is well suited to strawberries and the high-bush blueberries that thrive in Delaware and Maryland's mild, humid summers. Several Kent County farms run both seasons back to back from May through August.`,
  'Tallahassee': `Tallahassee benefits from Florida's position as one of the nation's earliest strawberry producers, with farms in the Panhandle and nearby Georgia counties offering pick-your-own strawberries as early as March. Blueberries follow in late spring, giving the capital a genuinely early start to the national berry season.`,
  'Atlanta': `Atlanta has excellent access to both ends of Georgia's berry calendar, with blueberry farms concentrated in the southern part of the state and a smaller but growing number of strawberry and blackberry operations in the north Georgia foothills within an hour or two of the city.`,
  'Honolulu': `Honolulu's tropical climate doesn't support traditional berry crops, but a handful of farms on Oahu and the neighbor islands grow specialty crops like poha berries (Cape gooseberries) that offer a similar pick-your-own experience with a distinctly Hawaiian character unavailable anywhere on the mainland.`,
  'Boise': `Boise sits within reach of Idaho's raspberry and huckleberry country, with cultivated raspberry farms scattered through the Treasure Valley and wild huckleberries found at higher elevations toward McCall and the central Idaho mountains. Huckleberry picking remains largely a foraging tradition rather than a commercial pick-your-own industry.`,
  'Springfield': `Springfield's central Illinois farms grow strawberries and blueberries on a modest but reliable scale, with pick-your-own operations scattered through the counties surrounding the capital. Strawberry season typically runs through late May and June, with blueberries picking up as the strawberry rows wind down.`,
  'Indianapolis': `Indianapolis has good access to Indiana's strawberry and blueberry farms, many of which operate in the same southern Indiana hill country that hosts the state's famous apple orchards. The berry season here runs from late May through August, making it a natural complement to a fall orchard visit.`,
  'Des Moines': `Des Moines sits in a state where strawberry and raspberry farms dot the river valleys, with pick-your-own operations near the capital offering a brief but popular June strawberry season followed by raspberries through midsummer. Iowa's berry farms tend to be small, family-run operations with loyal local followings.`,
  'Topeka': `Topeka's surrounding farms grow strawberries and blackberries that thrive in the Kansas River valley's fertile bottomland, with several pick-your-own operations welcoming visitors from late May through midsummer. Kansas blackberries in particular have a reputation for intense flavor that reflects the region's hot, sunny summers.`,
  'Frankfort': `Frankfort is well positioned for Kentucky's blackberry and blueberry farms, many tucked into the rolling Bluegrass countryside and the hills toward eastern Kentucky. Blackberry season in June overlaps with the tail end of the region's strawberry crop, giving visitors a chance to pick two fruits in one trip.`,
  'Baton Rouge': `Baton Rouge sits less than an hour from Ponchatoula, Louisiana, long known as the strawberry capital of the state and home to a beloved annual strawberry festival each April. Blueberry farms across the Florida Parishes extend the local berry season into early summer.`,
  'Augusta': `Augusta is the capital of the wild Maine blueberry, one of the state's most iconic crops, and while most commercial wild blueberry barrens are harvested by machine, several pick-your-own operations near the capital let visitors rake or hand-pick their own berries each August in a tradition unique to Maine.`,
  'Annapolis': `Annapolis has strong access to Maryland's strawberry and blueberry farms, with operations scattered across the Eastern Shore and the rolling country west of the Chesapeake Bay. Strawberry season opens in May, and blueberries carry the pick-your-own season through the heart of summer.`,
  'Boston': `Boston is surrounded by a rich berry-picking tradition that includes strawberries and blueberries in the spring and summer and, distinctively, the cranberry bogs of southeastern Massachusetts that turn brilliant red each fall. Massachusetts remains one of the top cranberry-producing states in the country, and harvest-time bog visits are a beloved regional tradition.`,
  'Lansing': `Lansing sits in a major blueberry-producing state, with Michigan's western counties along Lake Michigan ranking among the top blueberry regions in the country. Strawberries and raspberries round out the calendar, giving Lansing-area families a long pick-your-own berry season that runs from June into August.`,
  'Saint Paul': `Saint Paul has good access to Minnesota's strawberry and raspberry farms, many clustered in the river valleys and lake country surrounding the Twin Cities. June strawberries give way to raspberries through midsummer, and several farms also grow cold-hardy blueberry varieties bred specifically for Minnesota's climate.`,
  'Jackson': `Jackson is well placed for Mississippi's blueberry farms, concentrated mostly in the southern part of the state where the warm, humid climate suits rabbiteye blueberry varieties especially well. The blueberry season runs from late May through July, making it the centerpiece of central Mississippi's pick-your-own calendar.`,
  'Jefferson City': `Jefferson City sits near Missouri's Ozark blackberry and strawberry farms, where the rocky, well-drained hillsides produce berries with notably concentrated flavor. The Ozark blackberry season in June is a regional highlight, and several farms combine it with the area's established apple-orchard tourism in fall.`,
  'Helena': `Helena is close to Montana's huckleberry country, where the wild fruit is so beloved it has become something of a state obsession, sold in everything from jam to ice cream. True huckleberry picking remains mostly a foraging tradition in the forests around Helena and further west toward Missoula and the Flathead Valley.`,
  'Lincoln': `Lincoln's surrounding farms grow strawberries on a modest scale, with several pick-your-own operations welcoming visitors each June across the eastern Nebraska river valleys. Berry farming here is a smaller industry than in neighboring states, but the farms that do operate tend to offer a personal, unhurried picking experience.`,
  'Carson City': `Carson City's high-desert surroundings limit traditional berry farming, but a handful of operations in the Carson Valley and toward Lake Tahoe grow strawberries and raspberries that benefit from the intense sun and cool nights of the region. These remain small, seasonal operations worth calling ahead to confirm.`,
  'Concord': `Concord sits in classic New England blueberry country, with wild lowbush blueberry fields and cultivated highbush varieties both well represented across central New Hampshire. Strawberry season opens the pick-your-own calendar in June, with blueberries carrying it through July and August at many of the same farms.`,
  'Trenton': `Trenton is close to one of the most significant blueberry-growing regions in the country, with the Pine Barrens around Hammonton, New Jersey—long known as the Blueberry Capital of the World—producing a substantial share of the nation's cultivated blueberries. Strawberry farms in Hunterdon County round out the spring season.`,
  'Santa Fe': `Santa Fe's high elevation supports a small but growing raspberry-farming community in the valleys north of the city, where cool nights and intense sunlight concentrate flavor in the fruit. Berry picking here is a niche but rewarding activity, typically running from midsummer into early fall.`,
  'Albany': `Albany sits at the edge of the Hudson Valley's strawberry, blueberry, and raspberry farms, many of which share land with the valley's famous apple orchards. The berry season opens with strawberries in June and continues through blueberries and raspberries into August, well before the fall apple rush begins.`,
  'Raleigh': `Raleigh has strong access to North Carolina's blueberry industry, one of the largest in the country, with farms concentrated in the southeastern part of the state as well as strawberry operations closer to the capital. The strawberry season in May is a Piedmont tradition, with blueberries following through summer.`,
  'Bismarck': `Bismarck's surroundings include wild chokecherries and juneberries that have long been part of North Dakota's foraging and preserving traditions, alongside a small number of cultivated strawberry and raspberry farms near the capital. Berry picking here tends to be a modest, community-oriented affair rather than a large commercial industry.`,
  'Columbus': `Columbus has good access to Ohio's strawberry, blueberry, and raspberry farms, many clustered in the counties surrounding the capital and offering a long pick-your-own season that opens in late May and continues through August. Several of these farms also run the state's well-known fall apple operations.`,
  'Oklahoma City': `Oklahoma City sits in the state that made the blackberry its official state fruit, and pick-your-own blackberry farms across central and eastern Oklahoma draw enthusiastic crowds each June. Strawberry farms closer to the capital open the season a few weeks earlier in May.`,
  'Salem': `Salem is at the heart of Oregon's exceptional berry country, home to the marionberry—a blackberry hybrid developed in Marion County and named for it—alongside major blueberry, raspberry, and boysenberry production throughout the Willamette Valley. Few places in the country offer the berry variety and quality found near Salem.`,
  'Harrisburg': `Harrisburg has excellent access to Pennsylvania's strawberry and blueberry farms, many concentrated in the fertile farmland surrounding the capital and the Cumberland Valley. The strawberry season in late May and June kicks off a pick-your-own calendar that continues with blueberries through the heart of summer.`,
  'Providence': `Providence sits close to Rhode Island's small but well-loved strawberry and blueberry farms, scattered across the western part of the state. The compact geography means no farm is ever far from the capital, and the relatively short season makes timing a visit with local farm updates worthwhile.`,
  'Columbia': `Columbia is well positioned for South Carolina's strawberry and blueberry farms, with the Upstate region's foothills hosting some of the state's most popular pick-your-own operations. Strawberry season in April and May is followed by blueberries through the early summer heat.`,
  'Pierre': `Pierre's surroundings include wild chokecherries and juneberries gathered from the riverbanks and draws of central South Dakota, a foraging tradition that predates commercial agriculture in the region. Cultivated berry farms are rare this far west, making local foraging knowledge especially valuable for anyone seeking a berry-picking outing.`,
  'Nashville': `Nashville has solid access to Tennessee's blackberry and blueberry farms, many tucked into the hills and valleys surrounding the capital. Blackberry season in June is a Middle Tennessee tradition, and several farms combine it with blueberry picking through July for an extended summer berry season.`,
  'Austin': `Austin is within reach of two distinct Texas berry traditions: the blackberry farms of the Hill Country and the strawberries of Poteet, the self-proclaimed Strawberry Capital of Texas, about an hour south of the city. Both seasons fall in the spring, before the Texas summer heat takes hold.`,
  'Salt Lake City': `Salt Lake City sits near Bear Lake, whose raspberries are so celebrated that the area hosts an annual raspberry festival drawing visitors from across the region. Strawberry and blueberry farms along the Wasatch Front round out a berry season that runs from June through August.`,
  'Montpelier': `Montpelier is surrounded by Vermont's wild and cultivated blueberry fields, alongside a strong strawberry-farming tradition that opens the pick-your-own season each June. Vermont's cool climate keeps the berry season running later into summer than in many neighboring states, extending the picking window into August.`,
  'Richmond': `Richmond has good access to Virginia's strawberry and blueberry farms, with operations scattered across the Piedmont and toward the Eastern Shore. The strawberry season in May is a central Virginia tradition, and blueberries carry the pick-your-own calendar through the summer months that follow.`,
  'Olympia': `Olympia sits near Washington's renowned raspberry country in Whatcom County, often called the Raspberry Capital of the World for its enormous commercial production, alongside excellent blueberry farms throughout the Puget Sound lowlands. Few regions in the country can match the Pacific Northwest's berry-growing pedigree.`,
  'Charleston': `Charleston has access to West Virginia's blackberry and blueberry farms, many found in the mountain valleys and hollows surrounding the capital. The wild and cultivated blackberries that grow throughout Appalachia have long been part of the region's food culture, and June picking trips remain a cherished local tradition.`,
  'Madison': `Madison sits in a state that leads the nation in cranberry production, with the marshes of central Wisconsin producing the majority of America's cranberry crop each fall. Strawberry and raspberry farms closer to Madison open the season in early summer, well before the dramatic cranberry harvest begins.`,
  'Cheyenne': `Cheyenne's high-plains surroundings are challenging for cultivated berries, but wild chokecherries and buffaloberries have long been gathered from the draws and riverbanks of southeastern Wyoming. Cultivated strawberry and raspberry operations are rare this far from major growing regions, making a successful local find feel like a genuine discovery.`,
};

const berryTips = {
  'Montgomery': `Strawberry season near Montgomery moves fast in the Alabama heat, so go early in the morning and call ahead to confirm fields are still open—a warm spring can compress the season into just a few weeks.`,
  'Juneau': `If you're foraging wild berries around Juneau, carry bear bells or make noise as you go, and never pick in dense brush where visibility is limited. Locals are usually happy to point newcomers toward safe, productive patches.`,
  'Phoenix': `Treat a high-country berry trip from Phoenix as part of a longer mountain getaway rather than a quick errand—farms are small and seasonal, so calling ahead before the drive north is essential.`,
  'Little Rock': `Cave City strawberries are worth the drive from Little Rock specifically during the peak two weeks of the season in late April and early May—ask locally or check farm social media for the exact window each year.`,
  'Sacramento': `Sacramento-area strawberry fields can be busy on spring weekends, so arrive at opening time and bring your own flats or buckets if the farm allows it, since California u-pick operations move large volumes of fruit quickly.`,
  'Denver': `Foothill raspberry farms near Denver tend to have short, weather-dependent picking windows, so following their social media updates in midsummer is the best way to time a visit precisely.`,
  'Hartford': `Connecticut strawberry season is brief and intense—plan to go within the first two weeks of opening for the best selection, and ask the farm about their blueberry timeline so you can return a few weeks later.`,
  'Dover': `Delaware's coastal-plain berry farms benefit from sandy soil that drains quickly after rain, so a Dover-area u-pick trip is often still viable the day after a storm when other regional farms might be closed.`,
  'Tallahassee': `Because Florida's strawberry season starts so early, check farm listings as early as February—Tallahassee-area visitors who wait until the traditional spring window may find the season already winding down.`,
  'Atlanta': `For the freshest pick from Atlanta, decide in advance whether you want south Georgia blueberries or north Georgia blackberries and strawberries—the two regions are in opposite directions and require different planning.`,
  'Honolulu': `When seeking poha berries or other island specialty fruit near Honolulu, look to farm stands and small agricultural tours rather than expecting a traditional u-pick berry-field experience.`,
  'Boise': `Cultivated raspberries near Boise ripen through midsummer, while wild huckleberries at higher elevations require more legwork—pack bear spray and check national forest regulations before heading into huckleberry country.`,
  'Springfield': `Springfield-area strawberry fields are best visited on weekday mornings when fruit is coolest and crowds are thinnest—Illinois berry farms tend to be small operations that can sell out of ripe rows by midday on busy weekends.`,
  'Indianapolis': `Many southern Indiana farms run both berry and apple picking seasons, so ask about a farm's full calendar when you visit in June—you may want to return to the same place in October.`,
  'Des Moines': `Iowa's brief strawberry season rewards visitors who go right when farms open for the year—check local listings in late May so you don't miss the narrow June window.`,
  'Topeka': `Kansas blackberry brambles can be thorny going, so wear long sleeves and sturdy shoes, and bring extra water since picking under the summer sun in the Kansas River valley gets hot quickly.`,
  'Frankfort': `Combine a Kentucky blackberry-picking trip with a stop at one of the Bluegrass region's farm markets, where local honey and baked goods pair perfectly with whatever berries you bring home.`,
  'Baton Rouge': `Time a Ponchatoula strawberry trip from Baton Rouge around the town's annual strawberry festival in April for the fullest experience, though the farms themselves are worth visiting throughout the season.`,
  'Augusta': `Wild Maine blueberry picking is different from cultivated highbush picking—you'll be raking low bushes close to the ground, so bring knee pads or a cushion and ask the farm to demonstrate proper raking technique.`,
  'Annapolis': `Maryland's berry farms post picking conditions online frequently during peak season—checking before the drive from Annapolis saves a wasted trip if recent rain has closed fields temporarily.`,
  'Boston': `Massachusetts cranberry bogs are typically viewed rather than hand-picked since the harvest is done by flooding and machine-raking, but several working cranberry farms offer fall tours that let visitors see the dramatic red-water harvest up close.`,
  'Lansing': `Michigan blueberry season near Lansing peaks in July—bring a cooler since blueberries hold their quality far better when kept cold on the drive home, especially during Michigan's humid midsummer days.`,
  'Saint Paul': `Minnesota's cold-hardy blueberry varieties ripen later than in warmer states, often into August, so don't assume the season is over just because July has ended—call ahead to check.`,
  'Jackson': `Mississippi's rabbiteye blueberries are larger and slightly tarter than northern varieties—they're excellent for baking, so plan to bring home more than you'll eat fresh if you're near Jackson during peak season.`,
  'Jefferson City': `Ozark blackberry brambles near Jefferson City can be picked alongside early apple varieties at some farms—ask if a single visit can cover both, since the seasons briefly overlap in early summer.`,
  'Helena': `True Montana huckleberry picking requires research into national forest land near Helena and a respect for bear country—going with someone who knows the area is the best way to find productive patches safely.`,
  'Lincoln': `Nebraska strawberry farms near Lincoln are small operations, so call ahead before driving out—fields can close on short notice once the limited crop is picked through.`,
  'Carson City': `Carson Valley berry farms are few and seasonal, so treat a visit as a bonus stop on a Lake Tahoe trip rather than a dedicated destination, and always confirm hours before you go.`,
  'Concord': `New Hampshire blueberry farms often offer both lowbush and highbush varieties—ask the farm which rows are which, since the smaller wild-type berries have a more intense, concentrated flavor that's worth seeking out.`,
  'Trenton': `Hammonton-area blueberry farms near Trenton can draw serious crowds during peak season in July, so arrive early and bring your own containers if the farm allows it to speed up the picking and checkout process.`,
  'Santa Fe': `High-altitude raspberry picking near Santa Fe means stronger sun even in mild temperatures—bring sunscreen and a hat, and check with the farm about which weeks produce the best fruit at elevation.`,
  'Albany': `Hudson Valley berry farms near Albany often run strawberries, blueberries, and raspberries in sequence at the same location—ask about a multi-visit pass if you plan to return across the summer.`,
  'Raleigh': `North Carolina blueberry farms in the southeastern part of the state are a longer drive from Raleigh, so consider combining the trip with a coastal visit to make the most of the distance.`,
  'Bismarck': `Foraging chokecherries and juneberries near Bismarck requires landowner permission on private land—stick to public lands or farms that explicitly welcome pickers, and bring gloves since the brambles can be thorny.`,
  'Columbus': `Ohio berry farms near Columbus often post real-time picking conditions on social media during peak season—following a few local farms before you go ensures you arrive when the rows are at their best.`,
  'Oklahoma City': `Oklahoma blackberry picking in June can be hot work, so go early in the day, wear long sleeves against the thorns, and bring plenty of water for the trip out from Oklahoma City.`,
  'Salem': `With so many berry types available near Salem, ask the farm what's currently ripe before you arrive—marionberries, blueberries, and raspberries often overlap in season but peak at slightly different times through the Willamette Valley summer.`,
  'Harrisburg': `Pennsylvania strawberry season near Harrisburg moves quickly in warm years, so don't wait too long into June—calling the farm directly is more reliable than assuming based on the calendar date.`,
  'Providence': `Rhode Island's small berry farms benefit from a personal visit—talk to the farmers about what's ripe that week, since the compact scale of these operations means picking windows can shift quickly.`,
  'Columbia': `South Carolina Upstate berry farms near Columbia are best visited in the cooler morning hours, both for picking comfort and because berries hold their quality better before the midday heat sets in.`,
  'Pierre': `Finding wild berries near Pierre takes some local knowledge—asking at farmers markets or county extension offices about good chokecherry and juneberry spots is more productive than searching blindly along the river.`,
  'Nashville': `Tennessee blackberry season near Nashville runs into the summer heat, so an early start and plenty of water make the picking experience far more comfortable in the Middle Tennessee humidity.`,
  'Austin': `Decide whether you're headed to Poteet for strawberries or the Hill Country for blackberries before you leave Austin, since the two regions are in different directions and best treated as separate trips.`,
  'Salt Lake City': `Bear Lake raspberry season from Salt Lake City peaks in August, and the area's raspberry festival is worth timing your visit around if you want the full regional experience beyond just picking.`,
  'Montpelier': `Vermont's later berry season means visitors from Montpelier can often still find good blueberry picking into August, well after many warmer states have wrapped up for the year.`,
  'Richmond': `Virginia strawberry farms near Richmond tend to sell out their best rows by midday on May weekends, so an early start gives you first access to the ripest fruit.`,
  'Olympia': `Whatcom County raspberry farms are a longer drive from Olympia, but the trip is worth it during peak July season—pair it with a visit to one of the area's blueberry farms for a full Pacific Northwest berry day.`,
  'Charleston': `West Virginia blackberry brambles in the hollows around Charleston can be steep going, so wear good footwear and watch your footing—the reward is some of the most flavorful wild blackberries in Appalachia.`,
  'Madison': `Wisconsin's dramatic cranberry harvest in the marshes outside Madison happens in fall and is best experienced as a guided farm tour rather than hands-on picking, since the flooded-bog method isn't a u-pick activity.`,
  'Cheyenne': `Wild berry foraging near Cheyenne rewards patience and local knowledge—ask at county extension offices or farmers markets about productive chokecherry and buffaloberry spots along the area's river draws.`,
};

const berryRegion = {
  'new-england': {
    h2: 'Berry Picking Across New England',
    body: `New England has a deep berry-picking tradition that spans the calendar from June strawberries through July and August blueberries, with the region's acidic, glacially-formed soils particularly well suited to both wild lowbush and cultivated highbush blueberry varieties. Massachusetts adds a distinctive regional specialty in its cranberry bogs, which turn brilliant red each September and October during harvest and represent one of the most visually striking agricultural traditions in the country. The pick-your-own farms throughout Connecticut, Maine, New Hampshire, Vermont, Rhode Island, and Massachusetts tend to be small, family-run operations that have cultivated loyal local followings, and many run strawberries and blueberries in sequence at the same location, giving visitors a reason to return across the summer.`,
  },
  'mid-atlantic': {
    h2: 'Mid-Atlantic Berry Farms',
    body: `The mid-Atlantic states host some of the most significant berry agriculture in the country, anchored by New Jersey's Pine Barrens region around Hammonton, long known as the Blueberry Capital of the World for its enormous cultivated blueberry production. Delaware, Maryland, Pennsylvania, Virginia, and West Virginia all contribute strong strawberry and blueberry industries of their own, benefiting from the sandy coastal-plain soils of the Delmarva Peninsula and the fertile valleys further inland. The berry season here typically opens with strawberries in May, continues with blueberries through the summer, and in many areas overlaps with the blackberry brambles that grow wild throughout the Appalachian foothills.`,
  },
  'southeast': {
    h2: 'Southeastern Berry Season',
    body: `The Southeast enjoys one of the earliest and longest berry seasons in the country, with Florida's strawberry farms often producing fruit as early as March, well ahead of the rest of the nation. Georgia and South Carolina contribute major blueberry industries, particularly the rabbiteye varieties that thrive in the region's warm, humid summers, while North Carolina ranks among the top blueberry-producing states nationally. Blackberries grow wild and cultivated throughout the Appalachian foothills from Tennessee through the Carolinas, giving the region a berry season that can run from early spring strawberries through midsummer blueberries and blackberries.`,
  },
  'midwest': {
    h2: 'Midwest Berry Picking',
    body: `The Midwest's berry season centers on strawberries and raspberries in June and July, with Michigan standing out as one of the country's leading blueberry producers thanks to the moderating influence of Lake Michigan on its western counties. Wisconsin contributes a dramatically different specialty in its cranberry marshes, which produce the majority of the nation's cranberry crop and put on a striking visual display during the fall flood-harvest. Ohio, Indiana, Illinois, Iowa, Minnesota, Missouri, and the Dakotas all support smaller-scale strawberry, raspberry, and blackberry farms, many of which share land with the region's well-known fall apple orchards.`,
  },
  'mountain': {
    h2: 'Mountain West Berries',
    body: `Berry picking in the mountain west is a more rugged and varied affair than in the country's major commercial berry regions, blending small cultivated raspberry and strawberry farms with a strong tradition of wild foraging for huckleberries, chokecherries, and buffaloberries. Montana's wild huckleberry is something close to a state obsession, found in everything from jam to ice cream, while Utah's Bear Lake raspberries have built a regional following strong enough to support an annual festival. Colorado, Idaho, Nevada, New Mexico, and Wyoming all contribute small but dedicated berry-growing communities that take advantage of the high-altitude sun and cool nights to concentrate flavor in whatever fruit they produce.`,
  },
  'south-central': {
    h2: 'Berry Picking in the South-Central States',
    body: `Texas, Oklahoma, and Louisiana each bring their own distinct berry tradition to the south-central region. Oklahoma has made the blackberry its official state fruit, and pick-your-own blackberry farms across the state draw enthusiastic crowds each June. Texas combines Hill Country blackberries with the strawberry farms of Poteet, the self-declared Strawberry Capital of Texas, while Louisiana's Ponchatoula strawberries are celebrated with an annual festival each April. The growing season across this region tends to run earlier than in northern states, with much of the berry harvest wrapped up before the most intense summer heat arrives.`,
  },
  'pacific': {
    h2: 'Pacific Coast Berry Country',
    body: `The Pacific Northwest is arguably the finest berry-growing region in the country, with Oregon's Willamette Valley home to the marionberry—a blackberry hybrid developed in Marion County and named for it—alongside major blueberry, raspberry, and boysenberry production. Washington's Whatcom County is often called the Raspberry Capital of the World for its enormous commercial output, and the Puget Sound lowlands support extensive blueberry farming as well. California contributes one of the largest strawberry industries on earth, with u-pick fields scattered through the Central Valley and coastal regions, while Alaska's wild salmonberries, blueberries, and huckleberries sustain a foraging culture distinct from the commercial farms further south.`,
  },
  'southwest': {
    h2: 'Berry Picking in Arizona and Hawaii',
    body: `Arizona and Hawaii present unusual contexts for berry picking, with both states' climates working against the cool, temperate conditions that most traditional berry crops require. Arizona's high-elevation communities around Flagstaff and Prescott occasionally support small raspberry and strawberry operations that benefit from cooler mountain summers, while Hawaii's tropical climate has led farmers to specialty crops like poha berries (Cape gooseberries) that offer a similar pick-your-own experience with a flavor profile found nowhere else in the country.`,
  },
};

const berrySeason = {
  Alabama: 'Strawberries from April through May in the Cullman and Chilton County area, followed by blueberries from late May through July.',
  Alaska: 'Wild salmonberries, blueberries, and huckleberries from July through September, mostly through foraging rather than commercial farms.',
  Arizona: 'June through August at the high-elevation farms near Flagstaff and Prescott, where cooler mountain summers support a brief raspberry and strawberry season.',
  Arkansas: 'Strawberries in late April and early May around Cave City, followed by blackberries through the Ozark foothills in June.',
  California: 'Strawberries nearly year-round in the mildest areas, with peak Central Valley and coastal picking from April through August; blueberries from May through July.',
  Colorado: 'July through August for the foothill raspberry and currant farms west of Denver, with the brief window driven by the region\'s high-altitude growing conditions.',
  Connecticut: 'Strawberries in June, followed immediately by blueberries through July and into August across Litchfield Hills and Connecticut River valley farms.',
  Delaware: 'Strawberries in May, followed by blueberries from June through August across the Delmarva Peninsula\'s sandy coastal-plain farms.',
  Florida: 'Strawberries from as early as December through March in the Panhandle and northern counties, among the earliest seasons in the country.',
  Georgia: 'Blueberries from late May through July in south Georgia, with strawberries and blackberries available in the north Georgia foothills closer to early summer.',
  Hawaii: 'Year-round for specialty crops like poha berries at the handful of farms that grow them; traditional berry picking isn\'t available in Hawaii.',
  Idaho: 'Cultivated raspberries from July through August in the Treasure Valley, with wild huckleberries found at higher elevations from late July into September.',
  Illinois: 'Strawberries through late May and June, with blueberries picking up as the strawberry season winds down through July.',
  Indiana: 'Strawberries and blueberries from late May through August, with many farms in southern Indiana running both seasons in sequence.',
  Iowa: 'A brief strawberry season in June, followed by raspberries through midsummer at farms scattered through the state\'s river valleys.',
  Kansas: 'Strawberries in late May, followed by blackberries through June and into July across the Kansas River valley.',
  Kentucky: 'Blackberries in June, overlapping with the tail end of the state\'s spring strawberry crop across the Bluegrass region.',
  Louisiana: 'Strawberries from March through April around Ponchatoula, followed by blueberries across the Florida Parishes into early summer.',
  Maine: 'Wild blueberries through August, the iconic centerpiece of the state\'s berry season, with strawberries available earlier in June.',
  Maryland: 'Strawberries in May, followed by blueberries from June through the heart of summer across the Eastern Shore and western counties.',
  Massachusetts: 'Strawberries and blueberries from June through August, with the state\'s distinctive cranberry harvest running September through October.',
  Michigan: 'Strawberries and raspberries from June through August, with blueberry season peaking in July across the Lake Michigan shoreline counties.',
  Minnesota: 'Strawberries in June, followed by raspberries through midsummer, with cold-hardy blueberry varieties often ripening into August.',
  Mississippi: 'Blueberries from late May through July, the centerpiece of the state\'s berry season, concentrated in the southern counties.',
  Missouri: 'Ozark blackberries in June, often overlapping with early apple varieties at the same farms in the southern part of the state.',
  Montana: 'Wild huckleberries from late July into September, found mostly through forest foraging rather than commercial farms.',
  Nebraska: 'A modest strawberry season in June at small farms scattered through the eastern river valleys.',
  Nevada: 'July through August at the small Carson Valley and Lake Tahoe-area farms that grow strawberries and raspberries.',
  'New Hampshire': 'Strawberries in June, followed by lowbush and highbush blueberries through July and August.',
  'New Jersey': 'Strawberries in May and June, followed by the Hammonton area\'s major blueberry harvest from June through July.',
  'New Mexico': 'Midsummer into early fall for the high-altitude raspberry farms in the valleys north of Santa Fe.',
  'New York': 'Strawberries in June, followed by blueberries and raspberries through August across the Hudson Valley and western New York.',
  'North Carolina': 'Strawberries in May, followed by one of the country\'s largest blueberry harvests from June through July in the southeastern counties.',
  'North Dakota': 'Wild chokecherries and juneberries from July through August, primarily through foraging along riverbanks and draws.',
  Ohio: 'Strawberries from late May, followed by blueberries and raspberries through the summer into August.',
  Oklahoma: 'Strawberries in May, followed by the state\'s celebrated blackberry season in June across central and eastern counties.',
  Oregon: 'May through August for the Willamette Valley\'s exceptional run of strawberries, marionberries, blueberries, raspberries, and boysenberries.',
  Pennsylvania: 'Strawberries in late May and June, followed by blueberries through the heart of summer.',
  'Rhode Island': 'Strawberries and blueberries from June through August at the state\'s small western-county farms.',
  'South Carolina': 'Strawberries in April and May, followed by blueberries through the early summer heat in the Upstate region.',
  'South Dakota': 'Wild chokecherries and juneberries from July through August, gathered mostly through local foraging knowledge.',
  Tennessee: 'Blackberries in June, followed by blueberries through July across the hills surrounding Nashville and Middle Tennessee.',
  Texas: 'Strawberries in April around Poteet, with Hill Country blackberries ripening in May and June before summer heat arrives.',
  Utah: 'June through August, anchored by the celebrated Bear Lake raspberry harvest in August alongside strawberries and blueberries along the Wasatch Front.',
  Vermont: 'Strawberries in June, followed by a blueberry season that runs later into August than in many neighboring states thanks to Vermont\'s cool climate.',
  Virginia: 'Strawberries in May, followed by blueberries through the summer months across the Piedmont and Eastern Shore.',
  Washington: 'June through August, led by Whatcom County\'s world-renowned raspberry harvest alongside extensive blueberry production around Puget Sound.',
  'West Virginia': 'Blackberries in June, gathered from the mountain valleys and hollows throughout Appalachia, alongside a smaller blueberry season.',
  Wisconsin: 'Strawberries and raspberries in early summer, with the state\'s massive cranberry harvest concentrated in central Wisconsin each fall.',
  Wyoming: 'Wild chokecherries and buffaloberries from July through August, found through local foraging along river draws in the southeastern plains.',
};

const peachIntros = {
  Montgomery: 'Chilton County, halfway between Montgomery and Birmingham, is the undisputed peach capital of Alabama, with Clanton\'s peach stands and orchards drawing visitors off I-65 every summer. Several pick-your-own operations within an hour of Montgomery let you fill a basket with peaches grown in the same sandy soil that has made Chilton County peaches a statewide point of pride for generations.',
  Juneau: 'Alaska\'s cool, short growing season makes commercial peach orchards essentially nonexistent, and most peaches sold in Juneau arrive by barge from warmer climates. A handful of dedicated growers experiment with hardy dwarf peach varieties in greenhouses or south-facing microclimates, but pick-your-own peach picking isn\'t part of the local agricultural picture the way it is farther south.',
  Phoenix: 'Phoenix\'s desert heat is actually well suited to certain low-chill peach varieties, and the irrigated valleys around the city support a number of small orchards that fruit earlier in the season than almost anywhere else in the country. Picking typically wraps up before the worst of the summer heat arrives, making late spring the prime window.',
  'Little Rock': 'Peach growing has a long history in Arkansas, particularly in the sandy-loam soils south and east of Little Rock, where small family orchards have supplied local farmers markets for generations. The state\'s peach season tends to run earlier than the Midwest\'s, giving Little Rock-area visitors a head start on the summer fruit calendar.',
  Sacramento: 'California grows more peaches than any other state by a wide margin, and the Central Valley surrounding Sacramento is home to some of the largest peach orchards in the country. Both clingstone peaches destined for canning and freestone varieties grown for fresh eating ripen in the orchards within easy driving distance of the capital.',
  Denver: 'The peaches Colorado is famous for grow on the Western Slope around Palisade, a solid four-hour drive from Denver, where the high desert sun and cool nights of the Grand Valley concentrate sugar in the fruit unlike almost anywhere else in the country. It\'s a worthwhile road trip for anyone serious about peach picking, and the Palisade Peach Festival each August draws crowds from across the state.',
  Hartford: 'Peach orchards are a minor but real part of Connecticut agriculture, with small family farms scattered around the Hartford area growing peaches alongside apples and other tree fruit. The state\'s shorter, cooler growing season means the peach window is brief, typically just a few weeks in August.',
  Dover: 'Delaware has a surprisingly deep peach history—in the nineteenth century it was one of the nation\'s leading peach-producing states, with railroads built specifically to ship Delaware peaches to East Coast cities. That legacy lives on in smaller form today, with orchards near Dover still growing peaches across the lower Delmarva Peninsula.',
  Tallahassee: 'Florida\'s heat and humidity rule out most traditional peach varieties, but University of Florida breeding programs have developed low-chill cultivars specifically suited to the state\'s mild winters. A small but growing number of orchards near Tallahassee now offer some of the earliest peach picking in the country, often starting in April.',
  Atlanta: 'Georgia\'s reputation as the Peach State is well earned, even though South Carolina actually grows more peaches by volume these days. The orchards of Peach County and Crawford County, a couple hours south of Atlanta, still produce some of the most celebrated peaches in the country, and pick-your-own operations within range of the capital draw visitors every summer.',
  Honolulu: 'Hawaii\'s tropical climate doesn\'t support traditional peach trees, which need a period of winter chill to fruit properly, so commercial peach orchards don\'t exist on the islands. Peaches sold in Honolulu are shipped in from the mainland, and pick-your-own peach picking isn\'t something visitors will find locally.',
  Boise: 'Idaho\'s peach orchards cluster in the warmer river valleys of the southwestern part of the state, not far from Boise, where the combination of irrigation and long summer days produces a respectable peach crop alongside the region\'s better-known apples and cherries. The season is shorter than in warmer states but the quality holds up well.',
  Springfield: 'Southern Illinois, particularly the Shawnee Hills region around Calhoun County, has grown peaches commercially for well over a century, and several orchards within range of Springfield offer pick-your-own peaches in mid- to late summer. The rolling terrain there creates air drainage that helps protect blossoms from spring frost.',
  Indianapolis: 'Southern Indiana\'s orchards, especially in the hill country near the Ohio River, have grown peaches successfully for generations thanks to the area\'s well-drained soils and relatively mild microclimates. Several of these family farms are within a reasonable drive of Indianapolis and open their peach rows to the public each summer.',
  'Des Moines': 'Iowa\'s continental climate with its harsh winters makes commercial peach growing a challenge, and most of the state\'s tree-fruit orchards focus on apples instead. A small number of dedicated growers near Des Moines do produce peaches on a limited scale, using hardier cultivars bred to survive Midwest winters.',
  Topeka: 'Peach orchards in Kansas are concentrated in the eastern part of the state, where slightly milder winters and better soil drainage give the trees a fighting chance against the state\'s notoriously unpredictable spring frosts. A handful of orchards near Topeka grow peaches alongside their main apple crop.',
  Frankfort: 'Kentucky\'s peach orchards tend to be small, family-run operations scattered across the central and western parts of the state, often grown alongside apples on farms that have been in the same family for generations. The Bluegrass region around Frankfort has a handful of these mixed orchards within driving distance.',
  'Baton Rouge': 'Ruston, Louisiana, well north of Baton Rouge, has built its identity around peaches, hosting the Louisiana Peach Festival every June and supplying much of the state\'s commercial peach crop. The sandy hills of north Louisiana are simply better suited to peach trees than the Mississippi River delta soils closer to the capital.',
  Augusta: 'Maine\'s cold winters and short growing season put it at the very edge of where peach trees can reliably survive, and commercial peach orchards are essentially nonexistent in the state. The handful of home growers who do attempt peaches near Augusta rely on the hardiest available cultivars and a fair amount of luck.',
  Annapolis: 'Maryland\'s Eastern Shore has grown peaches commercially since the nineteenth century, part of the same Delmarva Peninsula peach belt that once made Delaware famous, and several orchards within range of Annapolis still carry on that tradition with pick-your-own peach rows each summer.',
  Boston: 'Peach orchards are a smaller part of the picture in Massachusetts than apples, but a number of farms within driving distance of Boston do grow peaches successfully, particularly in the Connecticut River Valley where the soil and microclimate are more forgiving than along the coast. The peach window here is brief, usually just a few weeks in August.',
  Lansing: 'Michigan\'s western fruit belt, cooled and warmed by Lake Michigan in equal measure, supports peach orchards alongside the region\'s famous cherries and apples, and a number of farms within range of Lansing grow all three. The lake effect that protects blossoms from late frost is the same reason this stretch of the state became fruit country in the first place.',
  'Saint Paul': 'Minnesota\'s brutal winters make commercial peach growing rare, and most of the state\'s tree-fruit orchards stick to cold-hardy apples instead. A small number of growers near the Twin Cities experiment with the hardiest peach cultivars available, though yields and availability vary considerably year to year.',
  Jackson: 'Peach orchards dot the hill country of north and central Mississippi, where better drainage and slightly cooler nights give the trees an edge over the flatter Delta region. Several small family farms within range of Jackson open their peach rows to pick-your-own visitors each summer.',
  'Jefferson City': 'Missouri has a long peach-growing tradition, particularly in the Ozark foothills, where elevation and air drainage help protect blossoms from the late frosts that can wipe out a crop elsewhere in the state. A number of orchards within range of Jefferson City grow peaches as a summer follow-up to their spring strawberry season.',
  Helena: 'Montana\'s high elevation and severe winters put it well outside the range where commercial peach orchards can reliably operate, and the state has essentially no pick-your-own peach industry. What peach trees exist near Helena are typically backyard plantings of extremely cold-hardy cultivars rather than commercial operations.',
  Lincoln: 'Peach growing in Nebraska is a modest, mostly small-scale affair, with orchards near Lincoln relying on hardier cultivars to survive the state\'s wide temperature swings and unpredictable spring frosts. Yields can vary significantly from year to year depending on how the winter and spring weather cooperate.',
  'Carson City': 'Nevada\'s high desert climate and dramatic temperature swings make commercial peach orchards rare, though a handful of small growers in the irrigated valleys near Carson City do produce peaches on a limited scale. The dry air and intense sun can concentrate flavor in what fruit does make it to harvest.',
  Concord: 'New Hampshire\'s cool climate keeps peach orchards to a minimum, with most of the state\'s tree-fruit farms focused on apples instead. A small number of growers near Concord do cultivate peaches using hardy cultivars, offering a brief late-summer picking window for those willing to seek them out.',
  Trenton: 'New Jersey has been one of the country\'s significant peach-producing states for well over a century, and Gloucester County in the southern part of the state remains a major center of production. Orchards within range of Trenton grow peaches alongside the blueberries that have made the Garden State famous, giving visitors a full summer of pick-your-own options.',
  'Santa Fe': 'New Mexico\'s high desert valleys, particularly along the Rio Grande south of Santa Fe, have grown peaches for generations thanks to irrigation and the intense high-altitude sun that concentrates sugar in the fruit. The orchards here produce smaller crops than the major peach states but the flavor has a devoted local following.',
  Albany: 'New York\'s Hudson Valley, just south of Albany, has a peach-growing tradition that runs alongside its much larger apple industry, with several orchards offering pick-your-own peaches in August before the fall apple rush begins. The valley\'s combination of river-moderated temperatures and well-drained hillside soils suits peach trees well.',
  Raleigh: 'The Sandhills region around Candor, North Carolina—celebrated each July with its own peach festival—produces some of the best peaches in the Southeast, and several orchards within range of Raleigh carry on that tradition with pick-your-own rows each summer. The sandy soil here drains quickly, which peach trees particularly appreciate.',
  Bismarck: 'North Dakota\'s harsh winters put it well outside the range where commercial peach orchards can survive, and the state has essentially no pick-your-own peach industry. Most fruit growers in the Bismarck area focus on cold-hardy apples and chokecherries instead.',
  Columbus: 'Southern Ohio\'s orchards, particularly along the hills bordering the Ohio River, have grown peaches successfully for generations, and a number of farms within range of Columbus offer pick-your-own peaches as a midsummer counterpart to their fall apple season. The hillside terrain helps protect blossoms from the frost pockets that can damage flat-ground orchards.',
  'Oklahoma City': 'Porter, Oklahoma, east of Tulsa and a couple hours from Oklahoma City, has built its identity around peaches, hosting the Porter Peach Festival every July and supplying a meaningful share of the state\'s commercial crop. The orchards there take advantage of the rolling terrain and well-drained soil east of the Arkansas River valley.',
  Salem: 'Oregon\'s peach orchards are a smaller part of the state\'s fruit industry compared to its famous berries, but farms in the Willamette Valley near Salem do grow peaches successfully, particularly varieties bred to handle the region\'s cooler, wetter summers than California\'s Central Valley.',
  Harrisburg: 'Adams County, Pennsylvania, just southwest of Harrisburg, is one of the largest fruit-growing regions on the East Coast, producing peaches alongside the apples the area is best known for. The rolling hills and well-drained soil there have supported commercial orchards for well over a century.',
  Providence: 'Peach orchards are a minor but genuine part of Rhode Island agriculture, with a handful of small farms near Providence growing peaches alongside apples and other tree fruit. The state\'s compact size means most of these orchards are within easy reach of the capital.',
  Columbia: 'South Carolina now grows more peaches than any other state except California, and the Ridge area around Edgefield and Saluda counties, not far from Columbia, is the heart of that production. The Peach Capital of South Carolina, set by reputation in the Ridge towns, makes the area around the capital one of the best peach-picking destinations in the country.',
  Pierre: 'South Dakota\'s climate is generally too harsh for commercial peach orchards, and the state\'s tree-fruit growers focus almost entirely on cold-hardy apples instead. Peach trees near Pierre, where they exist at all, are typically backyard plantings rather than pick-your-own operations.',
  Nashville: 'Middle Tennessee\'s rolling hills support a number of small peach orchards within driving distance of Nashville, many of which grow peaches alongside the region\'s well-known apple crop. The area\'s elevation changes help create the air drainage that protects blossoms from the frost pockets that can damage a crop in low-lying spots.',
  Austin: 'The Hill Country town of Stonewall, just outside Fredericksburg and about an hour and a half from Austin, calls itself the Peach Capital of Texas, and the orchards there produce some of the most celebrated peaches in the South each June and July. It\'s one of the most popular pick-your-own destinations in the entire state.',
  'Salt Lake City': 'Utah County, just south of Salt Lake City, has grown peaches for generations in the orchards along the base of the Wasatch Range, where mountain runoff irrigation and intense high-altitude sun combine to produce notably flavorful fruit. Santaquin and the surrounding towns are well known locally for their peach orchards.',
  Montpelier: 'Vermont\'s cold winters and short growing season make commercial peach orchards rare, with most of the state\'s tree-fruit farms sticking to apples instead. A small number of growers near Montpelier experiment with the hardiest peach cultivars, though the picking window is brief and yields modest.',
  Richmond: 'The orchards of the Blue Ridge foothills and the Shenandoah Valley, both within range of Richmond, have grown peaches alongside apples for generations, with the elevation and air drainage of the hill country helping protect the trees from the frost pockets that can damage a crop on the flatter Piedmont. Carter Mountain Orchard near Charlottesville is one of the region\'s best-known pick-your-own destinations.',
  Olympia: 'Washington\'s major peach orchards are concentrated in the irrigated valleys east of the Cascades, particularly the Yakima Valley, a considerable drive from Olympia\'s much cooler, wetter climate on the western side of the state. Western Washington\'s growing conditions simply don\'t suit peaches the way they suit berries and apples.',
  Charleston: 'West Virginia\'s Eastern Panhandle, several hours from Charleston, is the heart of the state\'s tree-fruit industry, with orchards there growing peaches alongside the apples the region is better known for. The mountainous terrain closer to the capital is generally too cool and steep for commercial peach production.',
  Madison: 'Wisconsin\'s climate sits right at the edge of where peach trees can reliably survive, and most of the state\'s orchards focus on apples and cherries instead. A small number of growers near Madison do cultivate hardy peach cultivars, offering a brief picking window most years.',
  Cheyenne: 'Wyoming\'s high elevation and severe winters put it well outside the range where commercial peach orchards can operate, and the state has essentially no pick-your-own peach industry. Peach trees near Cheyenne, where they exist, are limited to a handful of hardy backyard plantings.',
};

const peachTips = {
  Montgomery: 'Call ahead before driving to Chilton County, since peach orchards post daily ripeness updates and a hot stretch can shift the harvest up by a week. Bring a cooler; peaches bruise and soften quickly in Alabama\'s summer heat.',
  Juneau: 'If you want true pick-your-own peaches, plan a trip outside Alaska during peach season instead—what\'s available locally comes from greenhouse experiments rather than commercial orchards. Farmers markets are the best bet for fresh peaches grown anywhere near the state.',
  Phoenix: 'Go early in the morning to beat the desert heat, both for your own comfort and because peaches picked in cooler temperatures hold up better on the drive home. Low-chill varieties here ripen earlier than almost anywhere else, so check orchard listings starting in May.',
  'Little Rock': 'Arkansas peach season often starts before the Midwest\'s, so don\'t wait for "summer" in the calendar sense—call orchards in late May to check on early varieties. Bring cash, as many of the smaller family stands don\'t take cards.',
  Sacramento: 'Go on a weekday morning if you can; California\'s major peach orchards draw big weekend crowds during peak season. Ask which block has been picked most recently, since a large commercial orchard can have rows in very different stages of ripeness.',
  Denver: 'Budget a half-day or more for the drive to Palisade—it\'s a genuine road trip, not a quick errand—and consider combining it with a stop at one of the Western Slope\'s wineries. Order ahead during the Palisade Peach Festival in August, when the best orchards sell out fast.',
  Hartford: 'Connecticut\'s peach window is short, often just two or three weeks in August, so call ahead rather than assuming an orchard will still be picking when you arrive. Many farms post weekly ripeness updates on social media.',
  Dover: 'The Delmarva Peninsula\'s peach season tends to peak in July; visit on a weekday morning for the best selection before weekend crowds thin out the ripest trees. Many of the historic orchards near Dover also sell peach preserves worth picking up at the farm stand.',
  Tallahassee: 'Florida\'s low-chill peaches ripen earlier than almost anywhere else in the country, often by April, so don\'t wait for traditional "peach season" timing. Bring sun protection; orchards here offer little shade during the hottest part of the day.',
  Atlanta: 'Georgia peaches peak in June and July; call ahead since the state\'s intense summer heat can push ripening earlier than the calendar suggests. If Peach County orchards are full, Crawford County farms nearby are often just as good and less crowded.',
  Honolulu: 'There\'s no local pick-your-own peach option in Hawaii, so satisfy a peach craving at a farmers market instead, where imported mainland fruit is sold fresh. If you\'re visiting the mainland later in the summer, save the orchard trip for then.',
  Boise: 'Idaho\'s peach season is shorter than warmer states\', typically just a few weeks in late summer, so call orchards in the Treasure Valley before making the drive. Many of the same farms growing peaches also have cherries and apples worth asking about.',
  Springfield: 'Calhoun County\'s hill orchards can have a different ripening schedule than flatter farms closer to Springfield, so call ahead to check which location has peaches ready. The area\'s apple orchards often double as peach farms in midsummer.',
  Indianapolis: 'Southern Indiana\'s peach orchards near the Ohio River ripen earlier than you might expect for the Midwest, often by mid-July, so don\'t wait until apple season to start checking. Bring a cooler for the drive back to Indianapolis.',
  'Des Moines': 'Iowa\'s peach crop is small and weather-dependent, so call ahead to confirm an orchard actually has fruit before making the trip—a late frost can wipe out the entire local crop in some years. Hardy cultivars here ripen later than in warmer states, often into September.',
  Topeka: 'Eastern Kansas orchards have a narrow window between spring frost risk and summer heat, so check in early to mid-summer for the best selection. Many of these farms grow peaches as a secondary crop to apples, so call to confirm availability.',
  Frankfort: 'Kentucky\'s small peach orchards sell out quickly since they don\'t produce on a large commercial scale, so call ahead rather than just showing up. Many of these farms are mixed orchards, so ask what else is ripe while you\'re there.',
  'Baton Rouge': 'Plan the drive north to Ruston around mid-June, when the Louisiana Peach Festival celebrates the height of the season, and expect crowds if you go festival weekend. Bring a cooler for the drive back south to keep the fruit from softening in Louisiana\'s heat and humidity.',
  Augusta: 'Peach picking isn\'t really part of the local agricultural scene in Maine—home growers with hardy cultivars are your best bet, and even they have unpredictable yields. Farmers markets are the more reliable source for fresh peaches in season.',
  Annapolis: 'Eastern Shore orchards peak in July; cross the Bay Bridge on a weekday morning if possible to beat both traffic and weekend crowds at the more popular pick-your-own farms. The historic peach belt here has been in production for well over a century, so ask the farmers about the area\'s history while you\'re picking.',
  Boston: 'Connecticut River Valley orchards, west of Boston, tend to have better peach crops than farms closer to the coast, so it\'s worth the extra drive. Call ahead, since the August window here is brief.',
  Lansing: 'West Michigan\'s fruit belt orchards often grow peaches, cherries, and apples on the same property, so ask what else is ripe when you call to check on peaches. Lake Michigan\'s moderating effect means the season here can run later into August than you\'d expect this far north.',
  'Saint Paul': 'Minnesota\'s peach crop is small and unpredictable, so always call ahead to confirm an orchard has fruit before making the drive—a hard winter can eliminate the local crop entirely some years. Cold-hardy cultivars here often ripen later than in warmer states.',
  Jackson: 'Mississippi\'s hill country orchards north of Jackson tend to have better peach crops than the flatter Delta farms, so it\'s worth seeking those out specifically. Bring a cooler; the state\'s summer humidity softens picked peaches quickly.',
  'Jefferson City': 'Ozark foothill orchards often run peaches as a follow-up to spring strawberry season, so ask farms you\'ve visited before about their summer peach offerings. The elevation here helps protect the crop from the late frosts that can be a problem elsewhere in Missouri.',
  Helena: 'Commercial peach picking isn\'t really available near Helena—Montana\'s climate is too harsh for orchards at any real scale. If you want fresh peaches, farmers markets selling fruit trucked in from warmer states are the more realistic option.',
  Lincoln: 'Nebraska\'s peach yields vary a lot year to year depending on spring frost timing, so call ahead before driving out, especially after a rough winter. Hardier cultivars here tend to ripen a bit later than in warmer peach states.',
  'Carson City': 'Nevada\'s small peach orchards are concentrated in irrigated valleys, so check with local farms before assuming peach picking is available—it\'s a much smaller industry here than apples or even some berries. The dry desert air can concentrate flavor in what fruit does ripen.',
  Concord: 'New Hampshire\'s peach season is brief and the supply limited, so call ahead to one of the small orchards near Concord rather than planning a trip around peaches alone—consider combining it with a visit to a farm that also grows apples or berries.',
  Trenton: 'Gloucester County orchards, south of Trenton, are worth the drive during peach season, and many of the same farms growing peaches also have blueberries ripe at the same time, making for a good combined trip. Call ahead during peak weeks in late July and August.',
  'Santa Fe': 'Rio Grande Valley orchards south of Santa Fe rely on irrigation, so check with farms directly since water availability can affect the size of a given year\'s crop. The high-altitude sun here makes for intensely flavored fruit worth the drive.',
  Albany: 'Hudson Valley orchards typically run their peach season in August, just ahead of the fall apple rush, so visit before Labor Day if peaches are the priority. Many farms offer both crops, so ask what else is in season.',
  Raleigh: 'The Sandhills region around Candor peaks with its peach festival in mid-July, and that\'s generally the best window for picking, though crowds are heaviest that particular weekend. Sandy soil orchards here drain quickly after rain, so picking conditions stay good even after a storm.',
  Bismarck: 'There\'s essentially no commercial peach picking near Bismarck—North Dakota\'s winters are too severe for the trees to reliably survive. Cold-hardy apple orchards are the better bet for a pick-your-own outing in this part of the state.',
  Columbus: 'Southern Ohio\'s hillside orchards along the river tend to have more reliable peach crops than flatter farms closer to Columbus, so it\'s worth the extra drive south. Many of these orchards run peaches in midsummer ahead of their fall apple season.',
  'Oklahoma City': 'Plan a trip to Porter around the Porter Peach Festival in mid-July for the best selection, though the orchards there pick well before and after the festival weekend too. It\'s about a two-hour drive from Oklahoma City, so call ahead to confirm hours.',
  Salem: 'Willamette Valley orchards growing peaches alongside Oregon\'s better-known berries tend to have a shorter, later season than California\'s—check in August rather than earlier summer. Expect smaller peaches with excellent flavor compared to mass-market varieties.',
  Harrisburg: 'Adams County orchards run a long fruit season, with peaches typically peaking in late July and into August before the area\'s famous apple harvest begins. Many farms offer both, so it\'s worth asking what\'s ripe on the day you visit.',
  Providence: 'Rhode Island\'s compact size means most peach orchards are within a short drive of Providence, but call ahead since the selection is smaller than in bigger agricultural states. Combine a peach trip with a stop at a farm stand for local preserves.',
  Columbia: 'The Ridge area around Edgefield and Saluda counties is one of the best peach destinations on the East Coast, and it\'s well worth the drive from Columbia—plan to arrive early since these orchards draw serious crowds in peak season. June through August covers most of the harvest here.',
  Pierre: 'Commercial peach orchards are essentially absent near Pierre—South Dakota\'s climate doesn\'t support them at any real scale. Cold-hardy apple orchards are the more realistic pick-your-own option in this part of the state.',
  Nashville: 'Middle Tennessee orchards growing peaches tend to be smaller operations than the region\'s apple farms, so call ahead to confirm availability before making the drive. Many of these farms grow both crops on the same property.',
  Austin: 'Plan ahead for a trip to Stonewall and Fredericksburg, since peak peach season in June draws heavy crowds and the best orchards can sell out by midday on weekends. Going on a weekday morning is the best way to beat both the heat and the lines.',
  'Salt Lake City': 'Utah County orchards near Santaquin peak in August, later than many other states, so don\'t assume peach season is over just because it\'s late summer. The mountain runoff irrigation here produces notably juicy, flavorful fruit.',
  Montpelier: 'Vermont\'s peach offerings are limited and the window brief, so call ahead to one of the small orchards near Montpelier rather than counting on a guaranteed crop—pairing the trip with a farm that also grows apples or berries is a good backup plan.',
  Richmond: 'Both the Blue Ridge foothills and Shenandoah Valley orchards are within range of Richmond and worth checking, since elevation differences mean one area may be riper than the other on a given week. Carter Mountain Orchard near Charlottesville is a popular and reliable choice.',
  Olympia: 'The real peach orchards are a long drive east in the Yakima Valley, well outside Olympia\'s much cooler, wetter climate, so plan for a multi-hour trip if peaches are the priority. Western Washington\'s farms are better bets for berries and apples instead.',
  Charleston: 'The Eastern Panhandle\'s orchards are several hours from Charleston, so this is a trip to plan rather than a casual outing—call ahead to confirm peach availability alongside the area\'s better-known apples.',
  Madison: 'Wisconsin\'s peach window is brief and yields modest, so call ahead before driving out to confirm a given orchard actually has ripe fruit. Many of these farms also grow cherries and apples worth asking about.',
  Cheyenne: 'Commercial peach picking isn\'t really available near Cheyenne—Wyoming\'s elevation and winters are too harsh for the trees to thrive at any real scale. Farmers markets selling fruit trucked in from warmer states are a more realistic source for fresh peaches.',
};

const peachRegion = {
  'new-england': {
    h2: 'Peach Picking in New England',
    body: `New England sits at the northern edge of where peach trees can reliably produce a commercial crop, and most of the region's tree-fruit orchards lean heavily toward apples instead. Still, a number of farms across Connecticut, Massachusetts, and the warmer river valleys of the other New England states grow peaches successfully, typically offering a brief picking window in August before turning their attention to the much larger fall apple harvest. The fruit that does ripen here tends to be prized precisely because it's scarce, and local orchards often sell out of peaches well before the apple season even begins.`,
  },
  'mid-atlantic': {
    h2: 'Mid-Atlantic Peach Country',
    body: `The mid-Atlantic has one of the deepest peach-growing traditions in the country, anchored by the historic Delmarva Peninsula peach belt that made Delaware a national leader in the nineteenth century and by New Jersey's Gloucester County, still a major producer today. Pennsylvania's Adams County grows peaches on a serious commercial scale alongside its famous apples, and Maryland, Virginia, and West Virginia all contribute their own orchards along the region's river valleys and hill country. The peach season here typically runs from July through August, often overlapping with the blueberry harvest at the same farms.`,
  },
  southeast: {
    h2: 'Southeastern Peach Orchards',
    body: `The Southeast is peach country in the truest sense—Georgia's reputation as the Peach State is part of American folklore, even though South Carolina's Ridge region around Edgefield and Saluda counties now produces more peaches by volume than any state besides California. North Carolina's Sandhills region around Candor and Alabama's Chilton County both add their own well-established peach traditions, with festivals celebrating the harvest in towns across the region each summer. The season here runs roughly from late May through August, giving the Southeast one of the longest and most reliable peach windows in the country.`,
  },
  midwest: {
    h2: 'Midwest Peach Picking',
    body: `Peaches are a smaller part of the Midwest's fruit-growing identity than apples or, in Michigan's case, cherries, but pockets of strong peach production exist throughout the region—particularly in the hill country along major rivers, where elevation changes create air drainage that protects blossoms from late frost. Southern Illinois, southern Indiana, southern Ohio, and Michigan's western fruit belt all support peach orchards that open to pick-your-own visitors each midsummer, often on the same farms that grow the region's better-known apples.`,
  },
  mountain: {
    h2: 'Mountain West Peach Orchards',
    body: `Mountain west peach growing concentrates in a handful of well-irrigated valleys where intense high-altitude sun and dramatic day-to-night temperature swings combine to produce remarkably flavorful fruit. Colorado's Palisade peaches, grown on the Western Slope's Grand Valley, are the region's signature crop and the centerpiece of an annual festival each August, while Utah County's orchards along the Wasatch Range and New Mexico's Rio Grande Valley farms each carry on their own smaller but well-loved peach traditions.`,
  },
  'south-central': {
    h2: 'Peach Picking in Texas, Oklahoma, and Louisiana',
    body: `Texas Hill Country, centered on the towns of Stonewall and Fredericksburg, calls itself the Peach Capital of Texas and draws visitors from across the state each June and July for some of the best pick-your-own peaches in the South. Oklahoma's own peach tradition centers on Porter, celebrated each summer with its own peach festival, while Louisiana's peach belt around Ruston in the northern part of the state produces much of that state's crop in sandy hill-country soil better suited to the fruit than the Mississippi River delta further south.`,
  },
  pacific: {
    h2: 'Pacific Coast Peach Orchards',
    body: `California dominates national peach production by a wide margin, with the Central Valley's vast orchards supplying both fresh-eating freestone peaches and clingstone varieties grown for canning. Washington's peach orchards cluster in the irrigated Yakima Valley east of the Cascades, a very different growing environment from the state's cooler, wetter western half, while Oregon's Willamette Valley produces a smaller peach crop alongside the berries the region is better known for. Alaska's climate rules out commercial peach growing almost entirely.`,
  },
  southwest: {
    h2: 'Peach Picking in Arizona and Hawaii',
    body: `Arizona's desert valleys, irrigated and intensely sunny, support a number of low-chill peach orchards that ripen earlier in the year than almost anywhere else in the country, often by May. Hawaii's tropical climate, by contrast, lacks the winter chill that peach trees need to fruit properly, so the islands have essentially no commercial peach industry, and pick-your-own peach picking isn't part of the local agricultural landscape.`,
  },
};

const peachSeason = {
  Alabama: 'Late May through August, with Chilton County\'s harvest typically peaking in June and July when the roadside stands along I-65 are busiest.',
  Alaska: 'No meaningful commercial peach season; if you find local peaches at all, they\'re likely to be small experimental harvests rather than a predictable annual crop.',
  Arizona: 'As early as April and May for low-chill varieties, making it one of the earliest peach seasons in the country, with most orchards finished well before the summer heat peaks.',
  Arkansas: 'June through August, with the earliest varieties often ready before the Fourth of July.',
  California: 'The longest peach season in the country, starting as early as May in the warmest parts of the Central Valley and running clear through September depending on variety and elevation.',
  Colorado: 'Mid-August through September for the famous Palisade peaches, later than most of the country, with the harvest peak coinciding with the Palisade Peach Festival each August.',
  Connecticut: 'A brief window, generally just a few weeks in August.',
  Delaware: 'July through August, continuing a harvest tradition on the Delmarva Peninsula that dates back over a century.',
  Florida: 'As early as April for low-chill varieties, giving the state one of the very earliest peach seasons anywhere in the country.',
  Georgia: 'May through August, with the peak typically falling in June and July when the state\'s famous orchards are at their busiest.',
  Hawaii: 'No commercial peach season; the climate doesn\'t support the winter chill peach trees require to fruit.',
  Idaho: 'Late July through August, shorter than warmer states but reliable in the irrigated valleys of the southwest.',
  Illinois: 'July through early September, with southern Illinois orchards usually a week or two ahead of those further north.',
  Indiana: 'Roughly mid-July through August, with southern Indiana orchards along the Ohio River often the first to ripen.',
  Iowa: 'August into September for the limited local crop, later than warmer peach-growing states.',
  Kansas: 'July into August, with eastern Kansas orchards typically having the most reliable crops.',
  Kentucky: 'July through August, on a similar schedule to the state\'s neighboring Appalachian orchards.',
  Louisiana: 'Peaking in June, celebrated each year with the Louisiana Peach Festival in Ruston at the height of the harvest.',
  Maine: 'No reliable commercial peach season given the state\'s cold winters and short growing season.',
  Maryland: 'July through August on the Eastern Shore, continuing the Delmarva Peninsula\'s long peach-growing history.',
  Massachusetts: 'A brief window in August, squeezed between the state\'s summer berry season and the start of fall apple picking.',
  Michigan: 'Late July through August, overlapping with the early part of the state\'s much larger cherry and apple harvests.',
  Minnesota: 'August into September for the small, cold-hardy-cultivar crop, later than in warmer states.',
  Mississippi: 'June through August, with hill-country orchards in the northern and central parts of the state usually leading the harvest.',
  Missouri: 'July through August, often following close behind the state\'s spring strawberry harvest at the same farms.',
  Montana: 'No commercial peach season; the state\'s harsh winters and high elevation make reliable peach production impractical.',
  Nebraska: 'Late July through August for the modest local crop, with yields varying considerably depending on the previous winter\'s severity.',
  Nevada: 'July through August for the small harvest concentrated in irrigated valleys.',
  'New Hampshire': 'A brief season running through August, a small counterpart to the state\'s much larger apple harvest later in the fall.',
  'New Jersey': 'July through August, often overlapping with the blueberry harvest at the same Garden State farms.',
  'New Mexico': 'July through August in the Rio Grande Valley, with the high-altitude sun helping concentrate flavor in the fruit.',
  'New York': 'Running through August in the Hudson Valley, finishing up just before the region\'s much larger apple harvest begins in September.',
  'North Carolina': 'June through August, with the Sandhills region around Candor typically at its peak in July.',
  'North Dakota': 'No commercial peach season given the state\'s severe winters.',
  Ohio: 'July through August, with the hillside orchards of the southern part of the state typically leading the harvest.',
  Oklahoma: 'Peaking in July, celebrated each year with the Porter Peach Festival at the height of the harvest.',
  Oregon: 'Running through August, generally later and shorter than California\'s much larger harvest to the south.',
  Pennsylvania: 'Late July through August, with Adams County orchards typically leading the state\'s harvest before the area\'s famous apple season takes over.',
  'Rhode Island': 'A brief season running through August at the state\'s small number of orchards.',
  'South Carolina': 'May through August, among the longest in the country outside California, with the Ridge region\'s harvest typically peaking in June and July.',
  'South Dakota': 'No commercial peach season given the state\'s harsh climate.',
  Tennessee: 'July through August, with Middle Tennessee orchards generally following a similar schedule to their Kentucky neighbors.',
  Texas: 'Peaking in June and July in the Hill Country, with the Fredericksburg and Stonewall orchards drawing the heaviest crowds during those peak weeks.',
  Utah: 'Late July through August, with Utah County orchards near Santaquin typically among the last in the country to wrap up their harvest.',
  Vermont: 'A limited season running through August, a small counterpart to the state\'s much larger fall apple harvest.',
  Virginia: 'July through August, with both the Blue Ridge foothills and Shenandoah Valley orchards typically ripening around the same time.',
  Washington: 'July through August in the Yakima Valley, entirely separate from the state\'s cooler, berry-focused western half.',
  'West Virginia': 'July through August in the Eastern Panhandle, alongside the region\'s better-known apple harvest.',
  Wisconsin: 'Typically ripening in August, a brief window at the edge of where the trees can reliably survive the state\'s winters.',
  Wyoming: 'No commercial peach season given the state\'s high elevation and severe winters.',
};

const blueberryIntros = {
  Montgomery: 'South Alabama\'s sandy, acidic soil is well suited to rabbiteye blueberries, and the farms clustered around Baldwin and Covington counties, a couple hours south of Montgomery, anchor the state\'s commercial blueberry industry. Several of these family operations open rows to pick-your-own visitors each early summer.',
  Juneau: 'Alaska has no commercial blueberry farms, but wild blueberries grow abundantly in the muskeg and mountainsides around Juneau, and foraging them each August is a genuine local tradition rather than a substitute for pick-your-own. Locals know exactly which south-facing slopes ripen first.',
  Phoenix: 'Phoenix\'s desert heat and alkaline soil are about as far from a blueberry bush\'s preferred conditions as it gets, and the state has essentially no commercial blueberry production. Specialty growers occasionally experiment with container-grown southern highbush varieties, but pick-your-own blueberry farms aren\'t part of the local landscape.',
  'Little Rock': 'Arkansas\'s blueberry farms are a modest but genuine part of the state\'s small-fruit agriculture, with highbush varieties grown on family farms within a couple hours of Little Rock. The sandy soils of the Gulf Coastal Plain in the southern part of the state suit the bushes especially well.',
  Sacramento: 'California\'s blueberry industry has grown quickly in recent decades, with southern highbush varieties bred specifically for the state\'s mild winters now grown throughout the Central Valley not far from Sacramento. The early harvest here often beats most of the rest of the country to market.',
  Denver: 'Colorado\'s high altitude and alkaline soil make commercial blueberry growing genuinely difficult, and the handful of growers near Denver who do attempt it amend their soil heavily and choose the hardiest available cultivars. It remains a small-scale, dedicated pursuit rather than an industry.',
  Hartford: 'Connecticut\'s blueberry farms are small, family-run operations scattered around the Hartford area, growing highbush varieties that thrive in the state\'s acidic, glacially-formed soils. Many of the same farms have grown blueberries for multiple generations.',
  Dover: 'Delaware\'s sandy coastal-plain soil, part of the same Delmarva Peninsula geology that supports the region\'s berry industry, gives blueberry growers near Dover a real advantage, and several pick-your-own farms have built loyal followings each July.',
  Tallahassee: 'Florida\'s blueberry growers, using southern highbush and rabbiteye varieties bred for the state\'s mild winters, produce some of the earliest blueberries in the entire country, often ready by April. Several u-pick farms within range of Tallahassee take advantage of North Florida\'s slightly cooler winters compared to the rest of the state.',
  Atlanta: 'Georgia is one of the nation\'s leading blueberry producers, with rabbiteye varieties thriving in the sandy soils of South Georgia, and the orchards within a couple hours of Atlanta produce some of the most celebrated blueberries in the Southeast each June.',
  Honolulu: 'Hawaii\'s tropical climate doesn\'t provide the winter chill blueberry bushes need to set fruit properly, so the islands have no commercial blueberry industry. Blueberries sold in Honolulu are shipped in from the mainland.',
  Boise: 'Idaho\'s blueberry farms are a small but real part of the Treasure Valley\'s fruit-growing scene near Boise, with highbush varieties grown alongside the region\'s better-known apples and cherries thanks to irrigation and long summer days.',
  Springfield: 'Illinois blueberry growers cluster in the sandier soils of the southern part of the state, with several u-pick farms within range of Springfield that have amended their ground specifically to lower the pH blueberry bushes demand.',
  Indianapolis: 'Indiana\'s blueberry farms, concentrated in the sandier soils of the northern and southern parts of the state, supply pick-your-own visitors near Indianapolis each July with highbush varieties grown on family farms.',
  'Des Moines': 'Iowa\'s heavy clay soils are a poor natural fit for blueberries, which demand acidic, well-drained ground, so the small number of growers near Des Moines who succeed do so through serious soil amendment rather than favorable starting conditions.',
  Topeka: 'Kansas blueberry farms are uncommon but real, with growers near Topeka amending the state\'s alkaline soil to grow highbush varieties on a small scale for local pick-your-own visitors each summer.',
  Frankfort: 'Kentucky\'s blueberry farms are small, family-run operations in the Bluegrass region around Frankfort, growing highbush varieties that benefit from the area\'s moderate climate and reasonably acidic soil.',
  'Baton Rouge': 'Louisiana\'s blueberry farms, using rabbiteye varieties suited to the Gulf South\'s heat and humidity, are concentrated in the hill country north of Baton Rouge, where the soil drains better than the flatter land closer to the Mississippi River.',
  Augusta: 'Maine is the wild blueberry capital of the country, and while the famous lowbush barrens of Washington and Hancock counties are well northeast of Augusta, the state\'s wild blueberry culture runs deep enough that foraging and small-scale picking opportunities exist throughout central Maine each August.',
  Annapolis: 'Maryland\'s Eastern Shore, part of the same Delmarva Peninsula peach-and-berry belt that runs through Delaware, supports a number of highbush blueberry farms within range of Annapolis that have grown the fruit commercially for generations.',
  Boston: 'Massachusetts blends commercial highbush blueberry farms with a strong wild lowbush tradition in the interior parts of the state, and several pick-your-own operations within driving distance of Boston offer both varieties each summer.',
  Lansing: 'Michigan is one of the top blueberry-producing states in the country, and the famous fruit belt along Lake Michigan\'s eastern shore, a few hours from Lansing, has built its identity around the crop for over a century thanks to the lake\'s moderating effect on the climate.',
  'Saint Paul': 'Minnesota\'s cold winters limit blueberry growing to the hardiest cultivars, and the small number of farms near the Twin Cities that grow them do so on carefully amended, acidic soil suited to the bushes\' specific needs.',
  Jackson: 'Mississippi has a genuine rabbiteye blueberry industry concentrated in the southern part of the state, and several u-pick farms within range of Jackson have grown the crop commercially for decades, taking advantage of the region\'s long, warm growing season.',
  'Jefferson City': 'Missouri\'s blueberry farms cluster in the Ozark foothills, where better drainage and slightly more acidic soil give the bushes an edge, and several u-pick operations within range of Jefferson City have built a loyal local following.',
  Helena: 'Montana\'s harsh winters and alkaline soil make commercial blueberry growing impractical, and the state has essentially no pick-your-own blueberry industry. Wild huckleberries, a different plant entirely, fill the role blueberries play farther east.',
  Lincoln: 'Nebraska blueberry farms are uncommon, with the handful of growers near Lincoln who succeed relying on heavily amended soil and cold-hardy cultivars to overcome the state\'s naturally alkaline ground.',
  'Carson City': 'Nevada\'s arid climate and alkaline soil make blueberry growing a real challenge, and the small number of growers in irrigated valleys near Carson City who attempt it do so on a limited, carefully managed scale.',
  Concord: 'New Hampshire\'s acidic, glacially-formed soil actually suits blueberries well, and a number of small highbush farms near Concord, along with wild lowbush patches in the hills, give visitors real pick-your-own options each summer.',
  Trenton: 'New Jersey is the blueberry capital of the country in cultural terms, and Hammonton, in the Pine Barrens not far from Trenton, has called itself the Blueberry Capital of the World for generations thanks to the area\'s enormous cultivated highbush production.',
  'Santa Fe': 'New Mexico\'s high desert climate and alkaline soil make blueberries a difficult crop, and commercial production near Santa Fe is essentially nonexistent, with what little growing happens limited to heavily amended raised beds.',
  Albany: 'New York\'s blueberry farms, particularly in the Hudson Valley near Albany, take advantage of the region\'s acidic soils and river-moderated climate, offering pick-your-own highbush blueberries each July before the valley\'s apple season begins.',
  Raleigh: 'North Carolina is a major blueberry-producing state, with highbush varieties grown extensively in the southeastern part of the state and additional farms within range of Raleigh that have made blueberries a significant summer crop.',
  Bismarck: 'North Dakota\'s severe winters and alkaline soil rule out commercial blueberry farming almost entirely, and what little blueberry growing happens near Bismarck is limited to a handful of dedicated home gardeners using raised, amended beds.',
  Columbus: 'Ohio blueberry farms, concentrated in the sandier soils of the northeastern and southern parts of the state, supply pick-your-own visitors within range of Columbus each July with highbush varieties grown on family farms.',
  'Oklahoma City': 'Oklahoma\'s blueberry farms are a small but growing part of the state\'s fruit industry, with highbush varieties grown in the eastern part of the state where rainfall and soil acidity are more favorable than the drier west, within range of Oklahoma City.',
  Salem: 'Oregon is one of the country\'s top blueberry-producing states, and the Willamette Valley around Salem, with its mild, wet climate and naturally acidic soil, is the heart of that production, supplying both fresh-market and processed blueberries nationwide.',
  Harrisburg: 'Pennsylvania\'s blueberry farms, including notable operations in the Pocono region and scattered family farms within range of Harrisburg, take advantage of the state\'s acidic soils in forested and former-forest areas.',
  Providence: 'Rhode Island\'s blueberry farms are small but well established, with highbush varieties grown on family farms within easy reach of Providence thanks to the state\'s naturally acidic, glacially-formed soil.',
  Columbia: 'South Carolina has a real blueberry industry, with both highbush and rabbiteye varieties grown across the state, and several u-pick farms within range of Columbia supply visitors each June with some of the earliest blueberries in the Southeast.',
  Pierre: 'South Dakota\'s harsh climate and alkaline soil make commercial blueberry farming impractical, and the state has essentially no pick-your-own blueberry industry near Pierre.',
  Nashville: 'Middle Tennessee\'s blueberry farms, grown on family operations within driving distance of Nashville, take advantage of the region\'s moderate climate and reasonably acidic soil to produce a respectable highbush crop each summer.',
  Austin: 'East Texas, with its sandier and more acidic soil than the Hill Country around Austin, is where the state\'s blueberry industry is concentrated, though a handful of growers closer to Austin amend their soil to grow the crop on a smaller scale.',
  'Salt Lake City': 'Utah\'s alkaline soil and arid climate make blueberry growing genuinely difficult, and the small number of growers near Salt Lake City who succeed do so through heavy soil amendment and careful irrigation.',
  Montpelier: 'Vermont\'s acidic, rocky soil suits blueberries reasonably well, and a number of small highbush farms near Montpelier, along with wild lowbush patches in the hills, give visitors real pick-your-own opportunities each summer.',
  Richmond: 'Virginia\'s blueberry farms, found in both the Piedmont and Tidewater regions within range of Richmond, take advantage of the state\'s naturally acidic soils to grow highbush varieties commercially.',
  Olympia: 'Washington is one of the top blueberry-producing states in the country, and while the largest operations are concentrated in Whatcom County in the northwest, the mild, wet climate around Olympia supports blueberry farming throughout western Washington.',
  Charleston: 'West Virginia\'s mountainous terrain limits large-scale blueberry farming, but the state\'s naturally acidic soil supports a number of small highbush farms in the hills surrounding Charleston.',
  Madison: 'Wisconsin\'s blueberry farms, smaller in scale than the state\'s famous cranberry marshes, are found on sandy, acidic soils in the central and northern parts of the state, with several u-pick operations within range of Madison.',
  Cheyenne: 'Wyoming\'s high elevation, harsh winters, and alkaline soil make commercial blueberry farming impractical, and the state has essentially no pick-your-own blueberry industry near Cheyenne.',
};

const blueberryTips = {
  Montgomery: 'Call ahead before driving to Baldwin or Covington counties, since rabbiteye blueberries ripen quickly in Alabama\'s early summer heat and the picking window can shift fast. Go in the cooler morning hours both for comfort and because berries hold up better off the bush before the day heats up.',
  Juneau: 'If you want to forage wild blueberries near Juneau, ask locally about south-facing slopes, which ripen earlier than shaded areas, and bring bear awareness gear since blueberry patches are popular with wildlife too. Early to mid-August is typically the peak window.',
  Phoenix: 'There isn\'t a realistic pick-your-own blueberry option near Phoenix, so satisfy a craving at a farmers market with fruit trucked in from California or Mexico instead. If you\'re traveling to a milder part of the state in early summer, ask about container-grown specialty farms.',
  'Little Rock': 'Arkansas blueberry season runs through the heat of early summer, so an early morning visit is more comfortable and yields firmer berries. Call ahead, since these family farms are smaller operations than what you\'d find in major blueberry states.',
  Sacramento: 'California\'s blueberry season starts earlier than most of the country, so check Central Valley farms beginning in April rather than waiting for a traditional summer timeline. Weekday mornings tend to have better selection before the day\'s heat sets in.',
  Denver: 'Blueberry picking near Denver is a niche pursuit, so call ahead to confirm a farm has a crop before making the trip — amended-soil operations can have unpredictable yields. Expect a much smaller selection than in major blueberry states.',
  Hartford: 'Connecticut\'s blueberry season is relatively short, typically peaking in July, so call ahead to small Hartford-area farms rather than assuming availability. Many of these farms have been growing blueberries for generations and are happy to talk about their methods.',
  Dover: 'Delmarva blueberry farms near Dover peak in July; visit on a weekday morning for the best selection before weekend crowds pick through the ripest bushes. Bring a cooler, since blueberries soften in the heat faster than people expect.',
  Tallahassee: 'Florida blueberry season starts remarkably early, often by April, so don\'t wait for a traditional summer mindset before checking local u-pick farms. North Florida\'s slightly cooler winters compared to the rest of the state give the area a real advantage.',
  Atlanta: 'Georgia blueberry season peaks in June; call ahead since intense summer heat can accelerate ripening beyond what the calendar suggests. South Georgia farms a couple hours from Atlanta tend to have the largest commercial operations.',
  Honolulu: 'There\'s no local blueberry picking option in Hawaii — buy fresh blueberries at a farmers market or grocery store instead, since all of it is shipped in from the mainland.',
  Boise: 'Idaho\'s blueberry season is shorter than warmer states\', typically a few weeks in midsummer, so call Treasure Valley farms ahead of a visit. Many of the same farms growing blueberries also have cherries and apples worth asking about.',
  Springfield: 'Southern Illinois blueberry farms tend to have more reliable crops than those further north, so it may be worth the extra drive from Springfield. Call ahead, since these are smaller operations than the Midwest\'s major apple orchards.',
  Indianapolis: 'Indiana blueberry season typically peaks in July; call ahead to farms in the sandier soils of the northern or southern part of the state before making the drive from Indianapolis.',
  'Des Moines': 'Iowa\'s blueberry crop is small and weather-dependent, so call ahead to confirm a farm actually has fruit before driving out — heavy clay soil makes yields less predictable than in major blueberry states.',
  Topeka: 'Kansas blueberry farms are uncommon, so call ahead to confirm availability before making a special trip from Topeka. These tend to be smaller, soil-amended operations rather than large commercial farms.',
  Frankfort: 'Kentucky\'s small blueberry farms sell out quickly since they don\'t produce at commercial scale, so call ahead rather than just showing up. Many of these farms are mixed operations, so ask what else is ripe.',
  'Baton Rouge': 'Plan a trip north into Louisiana\'s hill country for the best blueberry farms, since the soil there drains better than land closer to Baton Rouge. Bring a cooler for the drive back in the Gulf South\'s summer heat and humidity.',
  Augusta: 'For wild Maine blueberries, late July through August is the window — ask locally about foraging areas near Augusta, and consider a trip further Down East to Washington County for the full wild blueberry barren experience.',
  Annapolis: 'Eastern Shore blueberry farms near Annapolis peak in July; cross the Bay Bridge on a weekday morning to beat both traffic and weekend crowds. These farms have grown blueberries commercially for generations.',
  Boston: 'Ask whether a farm near Boston grows highbush, wild lowbush, or both — they ripen at slightly different times and offer different picking experiences. Late July through August covers most of the season here.',
  Lansing: 'Michigan\'s fruit belt along Lake Michigan, a few hours from Lansing, is genuinely worth the drive during blueberry season — the lake\'s moderating effect produces some of the best blueberries in the country. Late July is typically peak season.',
  'Saint Paul': 'Minnesota\'s blueberry crop is small and cold-hardy-cultivar dependent, so call ahead before driving out from the Twin Cities. Yields can vary considerably depending on how the winter treated the bushes.',
  Jackson: 'Mississippi\'s rabbiteye blueberry farms in the southern part of the state peak in June; call ahead before driving from Jackson, and bring a cooler for the humid Gulf South heat.',
  'Jefferson City': 'Ozark foothill blueberry farms near Jefferson City tend to have better drainage and more reliable crops than flatter parts of the state, so they\'re worth seeking out specifically.',
  Helena: 'There\'s no real blueberry picking option near Helena — Montana\'s climate and soil don\'t support it. If you want a similar experience, ask locally about wild huckleberry foraging instead, which is a genuine Montana tradition.',
  Lincoln: 'Nebraska blueberry farms are uncommon and small-scale, so call ahead before driving out from Lincoln to confirm a crop is actually available.',
  'Carson City': 'Blueberry picking near Carson City is a niche, limited option — call ahead to confirm availability, since Nevada\'s arid climate makes for unpredictable small-scale yields.',
  Concord: 'New Hampshire blueberry season runs through summer; ask whether a Concord-area farm has both cultivated highbush rows and wild lowbush patches, since many do and the lowbush berries ripen on a slightly different schedule.',
  Trenton: 'Make the drive to Hammonton during peak blueberry season in late June and July — it\'s genuinely one of the best blueberry destinations in the country, and arriving early on a weekday avoids the heaviest crowds.',
  'Santa Fe': 'Blueberry picking isn\'t realistically available near Santa Fe — New Mexico\'s alkaline soil and dry climate work against the crop. A farmers market is a more reliable way to find fresh blueberries locally.',
  Albany: 'Hudson Valley blueberry farms near Albany peak in July, just ahead of the region\'s apple season — visit on a weekday for a quieter trip and the best selection.',
  Raleigh: 'North Carolina blueberry season runs through June and into July; the southeastern part of the state has the largest commercial farms, though several u-pick operations exist within range of Raleigh too.',
  Bismarck: 'There\'s essentially no commercial blueberry picking near Bismarck — North Dakota\'s winters and soil are both working against the crop. Cold-hardy apple orchards are a more realistic pick-your-own option here.',
  Columbus: 'Ohio blueberry farms in the sandier soils of the northeast or south tend to have more reliable crops than other parts of the state — worth the extra drive from Columbus during peak season in July.',
  'Oklahoma City': 'Eastern Oklahoma has better blueberry-growing conditions than the drier west, so farms in that direction from Oklahoma City are worth seeking out specifically during the early summer season.',
  Salem: 'Willamette Valley blueberry farms near Salem are some of the best in the country — visit in July for peak season, and expect excellent selection given how significant Oregon\'s blueberry industry is nationally.',
  Harrisburg: 'Pennsylvania blueberry farms, including operations in the Pocono region, peak in July; call ahead to confirm picking hours since these are generally smaller operations than the state\'s famous apple orchards.',
  Providence: 'Rhode Island\'s compact size means most blueberry farms are a short drive from Providence — call ahead since the selection is smaller than in major blueberry states, but the quality from these family farms is excellent.',
  Columbia: 'South Carolina blueberry season starts in June, among the earliest in the Southeast outside Florida and Georgia — visit early in the month for the best selection near Columbia.',
  Pierre: 'There\'s no realistic blueberry picking option near Pierre — South Dakota\'s climate and soil don\'t support commercial production. Cold-hardy apple orchards are the better bet in this part of the state.',
  Nashville: 'Middle Tennessee blueberry farms near Nashville peak in summer; call ahead to confirm availability, since these tend to be smaller family operations than the region\'s apple farms.',
  Austin: 'East Texas has the state\'s real blueberry-growing conditions, so plan for a longer drive from Austin if you want the widest selection — though a few closer, soil-amended farms exist for a shorter trip.',
  'Salt Lake City': 'Blueberry picking near Salt Lake City is limited — call ahead to confirm a farm actually has fruit, since Utah\'s alkaline soil makes for smaller, less predictable yields than major blueberry states.',
  Montpelier: 'Vermont blueberry farms near Montpelier offer both cultivated highbush rows and wild lowbush patches in many cases — ask which is available, since they ripen on slightly different schedules through the summer.',
  Richmond: 'Both the Piedmont and Tidewater regions near Richmond have blueberry farms worth checking — call ahead since availability can vary by location and week during the June-into-July season.',
  Olympia: 'While Whatcom County in northwest Washington has the largest blueberry operations, farms closer to Olympia in western Washington\'s mild climate are also worth checking during peak season.',
  Charleston: 'West Virginia\'s small blueberry farms in the hills around Charleston are worth calling ahead to, since they don\'t produce at the scale of flatter-land operations elsewhere in the country.',
  Madison: 'Wisconsin blueberry farms near Madison are smaller than the state\'s famous cranberry operations — call ahead to confirm availability, typically in July, before making the drive.',
  Cheyenne: 'There\'s no realistic blueberry picking option near Cheyenne — Wyoming\'s elevation, winters, and alkaline soil all work against the crop. Farmers markets are a more reliable source for fresh blueberries here.',
};

const blueberryRegion = {
  'new-england': {
    h2: 'Blueberry Picking in New England',
    body: `New England has one of the deepest blueberry traditions in the country, blending commercial highbush farms with genuine wild lowbush blueberry patches in the hills and barrens of the interior. Maine is the undisputed center of that tradition — the wild blueberry barrens of Washington and Hancock counties make it the largest wild blueberry producer in the world — while Connecticut, Massachusetts, New Hampshire, Rhode Island, and Vermont all support smaller highbush farms suited to the region's naturally acidic, glacially-formed soil. The season typically runs from July through August, with wild and cultivated berries sometimes ripening on slightly different schedules at the same farm.`,
  },
  'mid-atlantic': {
    h2: 'Mid-Atlantic Blueberry Country',
    body: `New Jersey anchors the mid-Atlantic's blueberry identity, with Hammonton in the Pine Barrens calling itself the Blueberry Capital of the World on the strength of enormous highbush production that supplies fresh and processed berries nationwide. Delaware and Maryland's Eastern Shore share the same favorable sandy, acidic Delmarva soil, while Pennsylvania and Virginia contribute their own smaller commercial farms. The season here generally runs from late June through July, often overlapping with the region's peach harvest at the same farms.`,
  },
  southeast: {
    h2: 'Southeastern Blueberry Farms',
    body: `The Southeast is genuine blueberry country, with Georgia and North Carolina both ranking among the nation's leading producers thanks to rabbiteye and highbush varieties suited to the region's sandy, acidic soils and long growing season. South Carolina, Alabama, and Mississippi each contribute their own established industries, and Florida's southern highbush varieties, bred specifically for the state's mild winters, produce some of the earliest blueberries in the entire country, often ready by April. The harvest here stretches from spring into midsummer, one of the longest blueberry windows in the nation.`,
  },
  midwest: {
    h2: 'Midwest Blueberry Picking',
    body: `Michigan is one of the top blueberry-producing states in the country, and the fruit belt along Lake Michigan's eastern shore has built its identity around the crop for well over a century, helped enormously by the lake's moderating effect on the local climate. Illinois, Indiana, Ohio, and Wisconsin all support smaller highbush farms concentrated on the sandier, more acidic soils within their borders, while Iowa, Kansas, Minnesota, Missouri, Nebraska, and the Dakotas see only limited, soil-amended production given their generally heavier or more alkaline ground.`,
  },
  mountain: {
    h2: 'Mountain West Blueberry Growing',
    body: `True blueberry farming is genuinely difficult across the mountain west, where high elevation, alkaline soil, and harsh winters work against the crop's preference for acidic, well-drained ground. Colorado, Idaho, Montana, Nevada, New Mexico, Utah, and Wyoming each have only a small number of dedicated growers who succeed through heavy soil amendment, and several of these states see visitors turn instead to wild huckleberries — a different but beloved regional fruit — for a similar foraging experience.`,
  },
  'south-central': {
    h2: 'Blueberry Picking in Texas, Oklahoma, and Louisiana',
    body: `East Texas has the state's real blueberry country, with sandier, more acidic soil than the Hill Country supporting a genuine rabbiteye and highbush industry, while eastern Oklahoma's better rainfall and soil acidity, compared to the drier west, support a smaller but real crop. Louisiana's blueberry farms cluster in the hill country north of the Mississippi River delta, where drainage and soil conditions favor the bushes far more than the flatter land to the south.`,
  },
  pacific: {
    h2: 'Pacific Coast Blueberry Country',
    body: `Oregon and Washington both rank among the nation's top blueberry-producing states, with the Willamette Valley and the irrigated valleys of western Washington offering the mild, wet climate and naturally acidic soil blueberries thrive in. California's blueberry industry has expanded rapidly with southern highbush varieties bred for the state's mild winters, producing some of the earliest blueberries in the country, while Alaska has no commercial industry but supports a strong wild blueberry foraging culture in its coastal mountains.`,
  },
  southwest: {
    h2: 'Blueberry Picking in Arizona and Hawaii',
    body: `Arizona's desert heat and alkaline soil make commercial blueberry farming impractical, leaving the state with essentially no pick-your-own blueberry industry, while Hawaii's tropical climate lacks the winter chill blueberry bushes need to set fruit, ruling out commercial production there as well. Both states rely entirely on blueberries shipped in from elsewhere.`,
  },
};

const blueberrySeason = {
  Alabama: 'Late May through July, with rabbiteye varieties in Baldwin and Covington counties typically peaking in June.',
  Alaska: 'Wild blueberries ripen from late July through August in the mountains and muskeg around Juneau.',
  Arizona: 'No meaningful commercial blueberry season; the desert climate doesn\'t support the crop.',
  Arkansas: 'June through July, with farms in the southern Gulf Coastal Plain typically leading the harvest.',
  California: 'One of the earliest seasons in the country, often starting in April and running into June with southern highbush varieties.',
  Colorado: 'A short, limited season in July for the small number of amended-soil growers near Denver.',
  Connecticut: 'July, a relatively brief window at the state\'s small highbush farms.',
  Delaware: 'Late June through July on the Delmarva Peninsula\'s sandy coastal-plain soil.',
  Florida: 'As early as April for southern highbush and rabbiteye varieties, among the earliest blueberry seasons anywhere in the country.',
  Georgia: 'May through July, with the peak typically falling in June at the state\'s major rabbiteye farms.',
  Hawaii: 'No commercial blueberry season; the climate doesn\'t provide the winter chill the bushes require.',
  Idaho: 'July, a relatively short window in the irrigated valleys of the Treasure Valley.',
  Illinois: 'July, with southern Illinois farms on sandier soil typically having the most reliable crops.',
  Indiana: 'July, with farms in the sandier soils of the northern and southern parts of the state leading the harvest.',
  Iowa: 'A short, unpredictable window in July for the state\'s small amended-soil farms.',
  Kansas: 'July for the limited number of growers who have amended the state\'s naturally alkaline soil.',
  Kentucky: 'July, on a similar schedule to neighboring Appalachian states.',
  Louisiana: 'Late May through June, with rabbiteye varieties in the northern hill country leading the harvest.',
  Maine: 'Wild lowbush blueberries ripen from late July through August, peaking in the famous barrens of Washington and Hancock counties.',
  Maryland: 'Late June through July on the Eastern Shore, continuing the Delmarva Peninsula\'s berry-growing tradition.',
  Massachusetts: 'Late July through August, with cultivated highbush and wild lowbush varieties sometimes ripening on slightly different schedules.',
  Michigan: 'Mid-July through August, peaking along the Lake Michigan fruit belt that anchors the state\'s major blueberry industry.',
  Minnesota: 'A short window in late July for the state\'s small, cold-hardy-cultivar farms.',
  Mississippi: 'June, with the state\'s rabbiteye blueberry farms in the south leading the harvest.',
  Missouri: 'July, with Ozark foothill farms typically having the most reliable crops.',
  Montana: 'No meaningful commercial blueberry season; the climate and soil work against the crop.',
  Nebraska: 'A short, limited window in July for the state\'s small number of growers.',
  Nevada: 'A short, limited season in July for irrigated-valley growers near Carson City.',
  'New Hampshire': 'Summer through August, blending cultivated highbush rows with wild lowbush patches in the hills.',
  'New Jersey': 'Late June through July, peaking at Hammonton\'s enormous highbush operations.',
  'New Mexico': 'No meaningful commercial blueberry season given the state\'s alkaline soil and dry climate.',
  'New York': 'July in the Hudson Valley, just ahead of the region\'s much larger apple harvest.',
  'North Carolina': 'June into July, with the largest commercial farms in the southeastern part of the state.',
  'North Dakota': 'No meaningful commercial blueberry season given the state\'s severe winters and alkaline soil.',
  Ohio: 'July, with farms in the sandier soils of the northeast and south leading the harvest.',
  Oklahoma: 'Early summer, with farms in the wetter, more acidic eastern part of the state leading the harvest.',
  Oregon: 'July, peaking at the Willamette Valley\'s major commercial blueberry operations.',
  Pennsylvania: 'July, including notable harvests in the Pocono region.',
  'Rhode Island': 'July at the state\'s small but well-established highbush farms.',
  'South Carolina': 'June, among the earliest blueberry seasons in the Southeast outside Florida and Georgia.',
  'South Dakota': 'No meaningful commercial blueberry season given the state\'s harsh climate and alkaline soil.',
  Tennessee: 'Summer, with Middle Tennessee farms generally following a similar schedule to their Kentucky neighbors.',
  Texas: 'June, with East Texas\'s sandier, more acidic soil supporting the state\'s real blueberry industry.',
  Utah: 'A short, limited season in July for the state\'s small number of amended-soil growers.',
  Vermont: 'Summer through August, blending cultivated highbush rows with wild lowbush patches in the hills.',
  Virginia: 'June into July, with farms in both the Piedmont and Tidewater regions.',
  Washington: 'July through August, peaking in Whatcom County\'s major commercial operations alongside smaller farms statewide.',
  'West Virginia': 'July, with small highbush farms scattered through the mountains.',
  Wisconsin: 'July, smaller in scale than the state\'s famous cranberry marshes but genuine nonetheless.',
  Wyoming: 'No meaningful commercial blueberry season given the state\'s elevation, winters, and alkaline soil.',
};

// ---------- Featured images for keyword-based category pages ----------

const FRUIT_IMAGES = {
  'apple-picking': [
    { file: 'apple-basket-farm-stand.webp', alt: 'A basket of freshly picked apples at a farm stand' },
    { file: 'apple-orchard-harvest-crate.jpg', alt: 'A crate of harvested apples in an orchard' },
    { file: 'apple-picking-family-orchard.jpg', alt: 'A family picking apples together in an orchard' },
    { file: 'apple-picking-kids-orchard.jpg', alt: 'Kids picking apples in an orchard' },
  ],
  'cherry-picking': [
    { file: 'cherry-bucket-orchard-row.jpg', alt: 'A bucket of cherries in an orchard row' },
    { file: 'cherry-girl-holding-pair.jpg', alt: 'A girl holding a pair of freshly picked cherries' },
    { file: 'cherry-hands-cupped-harvest.jpg', alt: 'Hands cupped around freshly harvested cherries' },
    { file: 'cherry-workers-sorting-crate.jpg', alt: 'Workers sorting freshly picked cherries into a crate' },
  ],
  'berry-picking': [
    { file: 'strawberry-field-rows-texas.jpg', alt: 'Rows of ripening strawberry plants in a sunny field' },
    { file: 'strawberry-picking-kids-baskets.jpg', alt: 'Kids holding freshly picked strawberries with baskets' },
    { file: 'blueberry-basket-harvest.jpg', alt: 'A basket of freshly harvested blueberries' },
    { file: 'blueberry-farm-bucket-field.jpg', alt: 'A bucket of blueberries in a farm field' },
    { file: 'raspberry-bush-closeup.jpg', alt: 'Close-up of ripe and unripe raspberries on a bush' },
    { file: 'raspberry-market-crates.jpg', alt: 'Crates of freshly picked raspberries at a farm market' },
  ],
  'peach-picking': [
    { file: 'peach-hand-picking-tree-1.jpg', alt: 'A hand reaching to pick a ripe peach from a tree' },
    { file: 'peach-kids-crates-picking.jpg', alt: 'Kids sitting with crates of freshly picked peaches' },
    { file: 'peach-hand-picking-tree-2.jpg', alt: 'Ripe peaches hanging on a tree branch' },
  ],
  'blueberry-picking': [
    { file: 'blueberry-basket-harvest.jpg', alt: 'A basket of freshly harvested blueberries' },
    { file: 'blueberry-farm-bucket-field.jpg', alt: 'A bucket of blueberries in a farm field' },
    { file: 'blueberry-hands-picking-bush.jpg', alt: 'Hands picking blueberries from a bush' },
  ],
};

const FRUIT_IMAGE_DIR = {
  'apple-picking': 'blog',
  'cherry-picking': 'blog',
  'berry-picking': 'blog',
  'peach-picking': 'blog',
  'blueberry-picking': 'blog',
};

const U_PICK_FARM_IMAGES = [
  { file: 'apple-picking-family-orchard.jpg', dir: 'blog', alt: 'A family picking apples together on a u-pick farm' },
  { file: 'cherry-bucket-orchard-row.jpg', dir: 'blog', alt: 'A bucket of freshly picked cherries on a u-pick farm' },
  { file: 'pear-hand-picking-tree.jpg', dir: 'blog', alt: 'A hand picking a ripe pear from a tree on a u-pick farm' },
  { file: 'peach-hand-picking-tree-1.jpg', dir: 'blog', alt: 'A hand reaching to pick a ripe peach on a u-pick farm' },
];

const ORCHARD_STATE_IMAGES = [
  { file: 'apple-orchard-harvest-crate.jpg', dir: 'blog', alt: 'A crate of harvested apples in an orchard' },
  { file: 'cherry-bucket-orchard-row.jpg', dir: 'blog', alt: 'A bucket of cherries in an orchard row' },
  { file: 'pear-hand-picking-tree.jpg', dir: 'blog', alt: 'A hand picking a ripe pear from a tree in an orchard' },
];

const GARDEN_CENTER_IMAGE = { file: 'garden-center-flower-tables.jpg', dir: 'find', alt: 'Tables of colorful flowering plants at a garden center' };

// ---------- Page generator ----------

function generatePage({ city, state, code, fruit, fruitSlug, fruitLabel, imageIndex }) {
  const citySlug = slugify(city);
  const stateSlug = slugify(state);
  const urlSlug = `${fruitSlug}-orchards-near-${citySlug}-${stateSlug}`;
  const canonicalUrl = `https://orchards-nearme.com/find/${urlSlug}`;
  const locationCount = CATEGORY_STATE_COUNTS[fruitSlug][state] || 0;
  const titleTag = `${fruitLabel} Near ${city}, ${state} | ${locationCount} Locations`;
  const h1 = `${fruitLabel} Near ${city}, ${state} - ${locationCount} Locations`;
  const desc = `There are ${locationCount} ${fruitLabel.toLowerCase()} locations near ${city}, ${state}. Browse all u-pick farms and orchards on an interactive map. Search, filter and sort by ZIP code to find the closest location.`;
  const resultsHeading = `${fruitLabel} Near ${city}, ${code}`;
  const relatedLinks = relatedLinksHtml(fruitSlug, citySlug, stateSlug, city, state);

  const introsByFruit = { 'apple-picking': appleIntros, 'cherry-picking': cherryIntros, 'berry-picking': berryIntros, 'peach-picking': peachIntros, 'blueberry-picking': blueberryIntros };
  const tipsByFruit = { 'apple-picking': appleTips, 'cherry-picking': cherryTips, 'berry-picking': berryTips, 'peach-picking': peachTips, 'blueberry-picking': blueberryTips };
  const regionByFruit = { 'apple-picking': appleRegion, 'cherry-picking': cherryRegion, 'berry-picking': berryRegion, 'peach-picking': peachRegion, 'blueberry-picking': blueberryRegion };
  const seasonByFruit = { 'apple-picking': appleSeason, 'cherry-picking': cherrySeason, 'berry-picking': berrySeason, 'peach-picking': peachSeason, 'blueberry-picking': blueberrySeason };
  const regionKeyField = { 'apple-picking': 'region', 'cherry-picking': 'cherryRegion', 'berry-picking': 'region', 'peach-picking': 'region', 'blueberry-picking': 'region' };

  const defaultFilter = fruitSlug;
  const capital = capitals.find(c => c.city === city);
  const regionKey = capital ? capital[regionKeyField[fruitSlug]] : undefined;
  const regionData = regionByFruit[fruitSlug][regionKey];
  const intro = introsByFruit[fruitSlug][city];
  const tips = tipsByFruit[fruitSlug][city];
  const seasonText = seasonByFruit[fruitSlug][state];

  const seasonH2 = `Best Time to Go ${fruitLabel} Near ${city}`;

  const tipsH2 = `Tips for Your ${city} ${fruitLabel} Trip`;

  const mainH2 = `${fruitLabel} Near ${city}: What You Need to Know`;

  const filterChips = `<button class="filter-chip" data-cat="all">All Orchards</button>
          <button class="filter-chip active" data-cat="${fruitSlug}">${fruitLabel}</button>
          <button class="filter-chip" data-cat="Orchard">All Orchard Types</button>`;

  const imagePool = FRUIT_IMAGES[fruitSlug];
  const image = imagePool ? imagePool[imageIndex % imagePool.length] : null;
  const imageDir = FRUIT_IMAGE_DIR[fruitSlug] || 'find';
  const imageAlt = image ? `${image.alt} near ${city}, ${state}` : '';
  const ogImageTag = image ? `\n  <meta property="og:image" content="https://orchards-nearme.com/images/${imageDir}/${image.file}" />` : '';

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
  <title>${titleTag}</title>
  <meta name="description" content="${desc}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${titleTag}" />
  <meta property="og:description" content="Find ${fruitLabel.toLowerCase()} orchards near ${city}, ${state} on an interactive map." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonicalUrl}" />${ogImageTag}

  <link rel="icon" href="/logo.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="/vendor/leaflet/leaflet.css" />
  <link rel="stylesheet" href="/css/style.css" />
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9332749804326149" crossorigin="anonymous"></script>
</head>
<body>
  <a class="skip-link" href="#find">Skip to map</a>
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
        <a href="/find" class="cta">Find</a>
      </nav>
    </div>
  </header>

  <main class="find-page-full">
    <div class="find-stage">
      <h1 class="sr-only">${h1}</h1>
      <p class="find-page-desc sr-only">Discover ${fruitLabel.toLowerCase()} orchards near ${city}, ${state}. Search by ZIP code to find the closest orchard, check ratings, and read real visitor reviews before you go.</p>
      <div id="map" role="application" aria-label="Map of ${fruitLabel.toLowerCase()} orchards near ${city}, ${state}"></div>

      <div class="find-topbar">
        <form class="search-form" id="searchForm">
          <input type="text" id="zipInput" inputmode="numeric" placeholder="Enter your ZIP code (e.g. 05346)" aria-label="Search by ZIP code" />
          <button type="submit" class="btn">Search</button>
          <p id="zipError" hidden class="zip-error-msg" role="alert"></p>
        </form>
        <div class="filters-wrap">
          <button type="button" class="filters-toggle" id="filtersToggle" aria-haspopup="true" aria-expanded="false" aria-controls="filters">
            <span class="filters-toggle-icon" aria-hidden="true">&#9776;</span> Filters
          </button>
          <div class="filters" id="filters" role="group" aria-label="Filter by type" data-default-filter="${defaultFilter}" data-default-state="${state}">
            ${filterChips}
          </div>
        </div>
        <select class="state-select" id="stateSelect" aria-label="Filter by state">
          <option value="all">All states</option>
        </select>
        <div class="find-legend-float" aria-label="Map key">
          <span class="map-legend-item"><span class="map-legend-dot orchard"></span>Orchard</span>
          <span class="map-legend-item"><span class="map-legend-dot farm"></span>Farm</span>
          <span class="map-legend-item"><span class="map-legend-dot garden"></span>Garden Center</span>
        </div>
      </div>

      <button type="button" class="find-layers-btn" id="layersToggle" aria-pressed="false">
        <span aria-hidden="true">🛰️</span> Satellite
      </button>

      <div class="find-strip">
        <div class="find-strip-head">
          <h2>${resultsHeading}</h2>
          <span class="results-count" id="resultsCount">Loading...</span>
        </div>
        <div class="cards cards-horizontal" id="cards"></div>
      </div>
    </div>

    <section class="seo-content">
      <div class="container">
        <article class="seo-article">

          <h2>${mainH2}</h2>
          <p>${intro}</p>

          <h2>${regionData.h2}</h2>
          <p>${regionData.body}</p>

          <h2>${seasonH2}</h2>
          <p>${seasonText}</p>

          <h2>${tipsH2}</h2>
          <p>${tips}</p>

        </article>
      </div>
    </section>

    ${relatedLinks}
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

  <script src="/vendor/leaflet/leaflet.js"></script>
  <script src="/js/app.js"></script>
</body>
</html>
`;
}

// ---------- Garden center content ----------

const gardenCenterIntros = {
  Montgomery: 'Montgomery sits in USDA hardiness zone 8a, with a long, humid growing season that lets local garden centers keep camellias, azaleas, and crepe myrtles in stock for much of the year. The area\'s clay-heavy soil means good garden centers here are also a source of soil amendments and advice, not just plants.',
  Juneau: 'Juneau\'s maritime climate is milder than most of Alaska, sitting in a surprisingly temperate zone 7b pocket thanks to the moderating effect of the Pacific, which lets local garden centers stock a wider range of perennials than you\'d expect this far north. Heavy rainfall and limited daylight in winter shape what thrives here, and good local nurseries know exactly which varieties tolerate both.',
  Phoenix: 'Phoenix garden centers operate in zone 9b desert conditions, where xeriscaping with cacti, succulents, and drought-tolerant natives has become the practical standard rather than a trend. Extreme summer heat means the best local centers sell as much shade cloth and irrigation equipment as they do plants.',
  'Little Rock': 'Little Rock falls in zone 7b/8a, a humid subtropical climate where azaleas, dogwoods, and crepe myrtles are garden center staples each spring. The area gets enough winter chill for traditional perennials but a long enough growing season that local centers often run extended spring and fall planting promotions.',
  Sacramento: 'Sacramento\'s Mediterranean climate, zone 9b, supports nearly year-round gardening, and local garden centers reflect that with citrus trees, olive trees, and drought-tolerant California natives alongside the usual seasonal annuals. Water-wise landscaping has become a major focus given the state\'s recurring drought cycles.',
  Denver: 'Denver garden centers contend with zone 5b/6a conditions, high altitude sun, and a short growing season bracketed by late spring and early fall frosts, which makes timing advice from local staff especially valuable. Xeriscaping and drought-tolerant perennials have become increasingly central to what Denver-area centers stock given the region\'s dry climate.',
  Hartford: 'Hartford sits in zone 6b, with four distinct seasons that give local garden centers a predictable but compressed planting calendar—spring annuals and vegetables, summer perennials, and a strong fall season built around mums, pumpkins, and ornamental kale.',
  Dover: 'Dover\'s zone 7b climate and sandy coastal-plain soil support both traditional mid-Atlantic perennials and a number of native plants suited to the Delmarva Peninsula\'s sandy conditions. Local garden centers here often carry plants chosen specifically for the area\'s well-drained soil.',
  Tallahassee: 'Tallahassee garden centers operate in zone 8b/9a, a subtropical climate where camellias, azaleas, and gardenias thrive and the growing season runs nearly year-round. The area\'s clay soil and high humidity mean good local centers stock plants and amendments suited specifically to North Florida conditions rather than the sandier soil farther south in the state.',
  Atlanta: 'Atlanta sits in zone 7b/8a, classic Southern gardening territory where dogwoods, azaleas, and hydrangeas are garden center staples each spring. The metro area\'s red clay soil is notoriously difficult to work with, and good local centers are as much a source of soil amendment advice as they are of plants.',
  Honolulu: 'Honolulu\'s tropical zone 11/12 climate is entirely different from the mainland, and garden centers here specialize in orchids, plumeria, hibiscus, and other tropical and subtropical plants that simply can\'t survive most of the continental United States. Year-round growing means there\'s no real planting season here in the traditional sense.',
  Boise: 'Boise garden centers work within zone 6b/7a, an arid high-desert climate where irrigation is essential and drought-tolerant landscaping has become increasingly popular. The Treasure Valley\'s long, hot summers and cold winters give local centers a fairly compressed spring planting window.',
  Springfield: 'Springfield sits in zone 6a, classic Midwest growing conditions with cold winters and warm, humid summers that support a wide range of perennials, vegetables, and prairie natives. Local garden centers here run a strong spring rush followed by a smaller but loyal fall planting season.',
  Indianapolis: 'Indianapolis garden centers operate in zone 6a, similar to much of the Midwest, with a planting calendar built around a relatively short frost-free window each year. Prairie natives and pollinator-friendly perennials have become increasingly popular at local centers in recent years.',
  'Des Moines': 'Des Moines sits in zone 5b, where cold winters compress the growing season and local garden centers see an intense rush each spring once the frost risk passes. Iowa\'s prairie heritage shows up in the popularity of native grasses and perennials at local nurseries.',
  Topeka: 'Topeka garden centers work in zone 6b, Great Plains conditions where wind and periodic drought make hardy, low-water perennials a popular choice. Local centers here often stock plants bred specifically to handle Kansas\'s temperature swings and unpredictable rainfall.',
  Frankfort: 'Frankfort sits in zone 6b/7a, in the heart of Kentucky\'s Bluegrass region, where good soil and a moderate climate support a wide range of ornamentals alongside the turfgrass varieties the area is famous for. Local garden centers often double as a resource for the area\'s well-known horse farms and their extensive landscaping needs.',
  'Baton Rouge': 'Baton Rouge garden centers operate in zone 9a, a subtropical climate with heavy humidity that makes azaleas, camellias, and crepe myrtles reliable favorites. The long growing season here means local centers often stay busy nearly year-round rather than seeing the sharp seasonal swings common farther north.',
  Augusta: 'Augusta sits in zone 5a/5b, where Maine\'s short, cool growing season puts a premium on hardy perennials and a compressed but intense planting period each spring. Local garden centers here lean heavily on plants bred for cold tolerance and a short frost-free window.',
  Annapolis: 'Annapolis garden centers work in zone 7b, Chesapeake Bay region conditions that support both traditional ornamentals and a growing interest in native coastal plants that tolerate the area\'s humidity and occasional salt exposure near the water.',
  Boston: 'Boston sits in zone 6b/7a, with four well-defined seasons that give local garden centers a clear annual rhythm—spring bulbs and annuals, summer perennials, and a strong fall season built around New England\'s famous foliage colors and mum displays.',
  Lansing: 'Lansing garden centers operate in zone 5b/6a, shaped by Michigan\'s lake-effect climate, which moderates temperatures just enough to support a solid range of perennials and flowering shrubs. The state\'s strong horticultural tradition means local centers often carry an unusually deep selection for the zone.',
  'Saint Paul': 'Saint Paul sits in zone 4b, one of the harsher growing zones among state capitals, where winters are severe enough that local garden centers focus heavily on cold-hardy perennials and a short, intense spring planting rush once the ground finally thaws.',
  Jackson: 'Jackson garden centers work in zone 8a, Deep South conditions where azaleas, camellias, and crepe myrtles are mainstays and the growing season extends well into fall. Mississippi\'s heat and humidity mean local centers also stock plants chosen specifically for disease resistance in damp conditions.',
  'Jefferson City': 'Jefferson City sits in zone 6b, a transitional climate between the Midwest and the South that lets local garden centers stock a fairly wide range of perennials and ornamentals. The area\'s variable spring weather makes timing advice from local staff particularly useful.',
  Helena: 'Helena garden centers operate in zone 4b/5a, high-elevation conditions with a short growing season that puts a premium on extremely hardy perennials and native plants adapted to Montana\'s dramatic temperature swings. Local centers here see a compressed but enthusiastic spring rush.',
  Lincoln: 'Lincoln sits in zone 5b, Great Plains conditions where wind, periodic drought, and temperature extremes favor hardy, low-maintenance perennials. Nebraska\'s prairie heritage is reflected in the popularity of native grasses and pollinator gardens at local centers.',
  'Carson City': 'Carson City garden centers work in zone 6b/7a, a high-desert climate with low humidity and significant day-to-night temperature swings that make drought-tolerant, xeriscape-friendly plants the practical default. Irrigation planning is often as much a part of the conversation at local centers as plant selection itself.',
  Concord: 'Concord sits in zone 5b, New Hampshire\'s granite-soil terrain and cold winters shaping a planting calendar built around hardy perennials and a relatively short but reliable growing season each summer.',
  Trenton: 'Trenton garden centers operate in zone 7a, fittingly for the Garden State, which has one of the strongest commercial nursery industries on the East Coast. Local centers benefit from that infrastructure with deep inventories and a wide variety of both ornamentals and edible plants.',
  'Santa Fe': 'Santa Fe sits in zone 6a, a high desert climate where adobe-style xeriscaping and native Southwest plants like penstemon, chamisa, and piñon pine are garden center staples. Intense sun and low humidity at altitude mean local centers emphasize drought tolerance above almost everything else.',
  Albany: 'Albany garden centers work in zone 5b/6a, Hudson Valley conditions with four distinct seasons that support a wide range of perennials, and a strong fall season built around the region\'s well-known apple and pumpkin harvest displays.',
  Raleigh: 'Raleigh sits in zone 7b/8a, North Carolina Piedmont conditions where azaleas, dogwoods, and the region\'s native longleaf pine ecosystem all show up at local garden centers. The area\'s clay soil makes soil amendment advice a regular part of what good local centers offer.',
  Bismarck: 'Bismarck garden centers operate in one of the harshest zones among state capitals, 4a, where North Dakota\'s short, intense growing season and severe winters mean local centers stock almost exclusively cold-hardy perennials and natives bred to survive extreme temperature swings.',
  Columbus: 'Columbus sits in zone 6a, typical Midwest conditions with a clear seasonal rhythm—spring annuals and vegetables, summer perennials, and a strong fall season built around mums and ornamental gourds.',
  'Oklahoma City': 'Oklahoma City garden centers work in zone 7a, Great Plains conditions where wind, heat, and periodic drought make hardy, low-water natives a practical and increasingly popular choice. The region\'s red soil also shapes what local centers recommend for amendment and drainage.',
  Salem: 'Salem sits in the heart of Oregon\'s Willamette Valley, one of the most significant commercial nursery-growing regions in the entire country, and zone 8b\'s mild, wet winters support an exceptionally wide range of ornamentals, conifers, and perennials at local garden centers.',
  Harrisburg: 'Harrisburg garden centers operate in zone 6b/7a, mid-Atlantic conditions with four clear seasons and a strong fall tradition built around Pennsylvania\'s well-known apple and pumpkin harvests alongside the usual mum and ornamental kale displays.',
  Providence: 'Providence sits in zone 7a, coastal New England conditions where salt-tolerant plants are a consideration near the water and the state\'s compact size means most garden centers serve a tight-knit, loyal local customer base.',
  Columbia: 'Columbia garden centers work in zone 8a, classic Southern gardening territory where camellias, azaleas, and crepe myrtles dominate spring displays and the long growing season keeps local centers busy well into fall.',
  Pierre: 'Pierre sits in zone 4b, harsh Great Plains conditions where wind, drought, and severe winters make extremely hardy, low-water plants the practical standard. Local garden centers here see a short but intense spring rush once the frost risk finally passes.',
  Nashville: 'Nashville garden centers operate in zone 7a, a transitional climate between the Midwest and Deep South that supports both traditional Southern ornamentals like dogwoods and azaleas and a wide range of perennials more common farther north.',
  Austin: 'Austin sits in zone 8b/9a, Texas Hill Country conditions where heat and periodic drought have made native, low-water plants like Texas sage, lantana, and yaupon holly local garden center staples rather than a niche choice.',
  'Salt Lake City': 'Salt Lake City garden centers work in zone 6b/7a, a high-desert climate along the Wasatch Range where mountain runoff irrigation is essential and drought-tolerant landscaping has become increasingly standard given Utah\'s water concerns.',
  Montpelier: 'Montpelier sits in zone 4b/5a, Vermont\'s short, cool growing season and rocky, granite-influenced soil shaping a planting calendar built around hardy perennials and a compressed but well-loved spring rush at local garden centers.',
  Richmond: 'Richmond garden centers operate in zone 7a/7b, mid-Atlantic conditions with a strong horticultural tradition reflected in the area\'s historic gardens, and local centers here often carry an unusually deep selection of both ornamentals and native Virginia perennials.',
  Olympia: 'Olympia sits in zone 8a, the mild, wet Pacific Northwest climate that has made western Washington one of the country\'s major nursery-growing regions, and local garden centers benefit from that proximity with deep, well-priced inventories of conifers, rhododendrons, and perennials.',
  Charleston: 'Charleston garden centers work in zone 6b, Appalachian hill-country conditions where steep terrain and variable microclimates mean plant selection can differ significantly even within a short drive, and good local staff know the difference well.',
  Madison: 'Madison sits in zone 5a, where Wisconsin\'s cold winters and relatively short growing season put a premium on hardy perennials, and local garden centers see an intense, compressed spring rush each year once the frost risk passes.',
  Cheyenne: 'Cheyenne garden centers operate in zone 5a, high-plains conditions defined by relentless wind, low humidity, and a short growing season, all of which make extremely hardy, low-water perennials the practical default rather than a stylistic choice.',
};

const gardenCenterTips = {
  Montgomery: 'Visit in early spring for the widest selection of azaleas and camellias before the summer heat sets in. Ask staff about soil amendments for Montgomery\'s clay-heavy ground—most local gardeners need them.',
  Juneau: 'Check inventory before making a special trip, since Juneau\'s isolated location and shipping costs mean stock can be limited compared to mainland garden centers. Local staff are an especially good resource for which perennials actually handle the area\'s heavy rainfall.',
  Phoenix: 'Shop early in the morning during summer to avoid both the heat and the crowds, and ask about drip irrigation setup if you\'re new to desert gardening. Fall and winter are actually the better planting seasons here, not spring.',
  'Little Rock': 'Spring weekends get busy at the more popular centers, so a weekday visit usually means more attention from staff. Ask about fall planting too—Arkansas\'s mild autumns are an underrated time to put in trees and shrubs.',
  Sacramento: 'Take advantage of the area\'s long growing season by asking about succession planting for vegetables, since Sacramento\'s climate supports multiple plantings per year. Water-wise landscaping advice is worth asking for given the region\'s recurring drought restrictions.',
  Denver: 'Plant after the last frost date, which can run later than expected at altitude—ask local staff for the current year\'s estimate rather than relying on a general rule of thumb. Afternoon hailstorms are a real risk in late spring, so ask about protective options for new plantings.',
  Hartford: 'Fall is an underrated time to visit Hartford garden centers—perennials and shrubs planted then often establish better than spring plantings. Stock tends to be deepest in early May, right after the last frost risk passes.',
  Dover: 'Ask about salt-tolerant and wind-tolerant varieties if you\'re gardening near the coast, since Delaware\'s sandy soil and ocean proximity both affect plant selection. Spring and fall are the two strongest planting windows here.',
  Tallahassee: 'Take advantage of the area\'s long growing season—planting isn\'t limited to spring the way it is farther north, and fall is actually an excellent time for many ornamentals here. Ask about disease-resistant varieties given North Florida\'s humidity.',
  Atlanta: 'Visit on a weekday if possible; Atlanta\'s garden centers get genuinely crowded on spring weekends. Bring a soil sample if you can—staff can often give more specific amendment advice for the area\'s notorious red clay than a general recommendation would.',
  Honolulu: 'Ask staff about which plants are restricted from leaving the islands if you\'re hoping to bring anything home—Hawaii has strict agricultural rules to protect against invasive species. Year-round growing means there\'s rarely a bad time to visit.',
  Boise: 'Plan around Boise\'s relatively short frost-free window, and ask about drought-tolerant landscaping options given the Treasure Valley\'s dry summers. Early spring tends to have the best selection before the heat arrives.',
  Springfield: 'Spring weekends are the busiest time at Springfield-area centers, so a weekday trip usually means more one-on-one help from staff. Ask about pollinator-friendly natives—they\'ve become a popular and practical choice for Illinois gardens.',
  Indianapolis: 'Visit early in spring for the best perennial selection, since Indiana\'s relatively short frost-free window means inventory turns over fast. Fall is a good secondary window for trees and shrubs that benefit from establishing before winter.',
  'Des Moines': 'Iowa\'s spring rush can mean picked-over inventory by late May, so an early-season visit is worth it if you have specific varieties in mind. Ask about native prairie perennials, which tend to handle Iowa\'s weather swings better than many ornamentals.',
  Topeka: 'Ask about wind-tolerant and drought-resistant varieties—Kansas\'s open terrain and unpredictable rainfall make these practical considerations rather than nice-to-haves. Early spring and early fall are both good planting windows here.',
  Frankfort: 'Bluegrass-region soil tends to be better than much of the rest of the state, so don\'t assume you\'ll need the same heavy amendments other Kentucky gardeners discuss. Spring is the busiest season, but good centers restock through summer.',
  'Baton Rouge': 'Louisiana\'s long growing season means you\'re rarely too late to plant something—ask staff what works well for the current month rather than assuming spring is the only window. Humidity-related disease resistance is worth asking about for any new shrubs.',
  Augusta: 'Maine\'s short season means timing matters—ask staff for the realistic local planting window rather than a generic regional estimate, since microclimates vary even within central Maine. Stock up early; the best hardy perennials often sell out fast each spring.',
  Annapolis: 'Ask about salt and wind tolerance if you\'re gardening anywhere near the water, since the Chesapeake\'s coastal exposure affects plant choices more than people expect. Spring and early fall are both solid planting windows here.',
  Boston: 'New England\'s fall foliage season makes garden centers especially worth visiting in September and October for trees and shrubs chosen for color, not just spring bloom. Ask about microclimates—Boston\'s urban heat island can shift timing compared to the surrounding suburbs.',
  Lansing: 'Michigan\'s lake-effect climate creates real microclimate differences even within the state, so ask local staff rather than assuming a generic Midwest planting calendar applies exactly. Spring is busy, but the state\'s strong horticultural tradition means good centers restock all season.',
  'Saint Paul': 'Minnesota\'s spring rush is intense and short, so visit as soon as the frost risk passes if you want the best selection of hardy perennials. Ask about zone 4-rated varieties specifically, since some plants sold regionally aren\'t actually suited to Saint Paul\'s winters.',
  Jackson: 'Mississippi\'s heat and humidity make disease resistance a genuinely important factor—ask staff which varieties of azaleas and crepe myrtles hold up best locally. The growing season extends well into fall, so don\'t limit shopping to spring.',
  'Jefferson City': 'Missouri\'s spring weather can be unpredictable, so ask local staff about the current year\'s frost risk before planting tender annuals too early. Fall is a solid secondary window for trees and shrubs here.',
  Helena: 'Montana\'s short growing season rewards early planning—visit as soon as the frost risk passes for the best selection of hardy perennials. Ask about native plants specifically bred for the state\'s dramatic temperature swings.',
  Lincoln: 'Nebraska\'s wind and periodic drought make low-maintenance native perennials a practical choice worth asking about. Spring is the busiest season, but fall planting works well for trees and shrubs here too.',
  'Carson City': 'Ask about drip irrigation and xeriscape design if you\'re new to high-desert gardening—it\'s less about plant selection and more about water management in this climate. Spring and fall both offer more moderate planting conditions than the height of summer.',
  Concord: 'New Hampshire\'s granite soil often needs amendment, so bring questions about your specific site if you can. Spring is busy, but many of the hardiest perennials establish just as well with a fall planting.',
  Trenton: 'New Jersey\'s strong commercial nursery industry means local centers often have deeper inventory than you\'d find in a similarly sized city elsewhere—worth asking what\'s grown locally versus shipped in. Spring and fall are both strong planting windows here.',
  'Santa Fe': 'Ask about xeriscape design and native Southwest plants specifically—conventional water-hungry landscaping doesn\'t make sense in Santa Fe\'s climate and most good local centers will steer you toward better-adapted choices. Intense sun at altitude means afternoon shade considerations matter even for "full sun" plants.',
  Albany: 'Hudson Valley garden centers get busy in fall thanks to the region\'s apple and pumpkin season, so visit on a weekday if you want a quieter shopping trip during that window. Spring remains the primary planting season for most perennials.',
  Raleigh: 'Bring a soil sample if you can—Raleigh\'s clay soil varies enough by neighborhood that specific amendment advice is more useful than a general recommendation. Spring and fall are both solid planting windows in the Piedmont\'s mild climate.',
  Bismarck: 'North Dakota\'s growing season is short and intense, so visit as early as the frost risk allows if you want the best selection of cold-hardy perennials. Ask specifically about zone 4 ratings, since not everything sold regionally actually survives a Bismarck winter.',
  Columbus: 'Spring weekends are the busiest time at Columbus-area centers, so a weekday visit usually means more time with staff. Fall is an underrated season here for planting trees and shrubs that benefit from establishing before winter.',
  'Oklahoma City': 'Ask about wind-tolerant and drought-resistant natives—Oklahoma\'s open plains terrain makes these practical rather than optional considerations. Spring and fall both offer better planting conditions than the height of summer heat.',
  Salem: 'Take advantage of being in one of the country\'s major nursery-growing regions by asking staff what\'s grown right in the Willamette Valley versus shipped in from elsewhere—the local selection is often exceptional. Mild, wet winters mean fall planting works very well here too.',
  Harrisburg: 'Visit in fall for Pennsylvania\'s well-known apple and pumpkin display season alongside the usual mum selection. Spring remains the primary planting window for most perennials and vegetables.',
  Providence: 'Ask about salt tolerance if you\'re gardening anywhere near Narragansett Bay, since coastal exposure shapes plant selection more than people expect in a state this compact. Spring and early fall are both solid planting windows.',
  Columbia: 'Visit early in spring for the best selection of camellias and azaleas before the summer heat arrives. The long growing season here means fall planting works well too, not just spring.',
  Pierre: 'South Dakota\'s growing season is short and the spring rush intense, so visit as soon as frost risk passes for the best selection. Ask specifically about zone 4 hardiness ratings before buying anything not explicitly rated for the local climate.',
  Nashville: 'Spring weekends get busy, so a weekday visit usually means more attention from staff. Nashville\'s transitional climate supports a wide range of plants, so ask what performs best at the specific edge between Southern and Midwestern conditions.',
  Austin: 'Ask about native, low-water plants specifically—conventional landscaping struggles with Austin\'s heat and periodic drought, and most good local centers will steer you toward better-adapted choices. Fall is actually a better planting time here than spring, since plants establish before summer heat arrives.',
  'Salt Lake City': 'Ask about drought-tolerant landscaping given Utah\'s ongoing water concerns—it\'s become a central part of what local centers recommend rather than a niche request. Mountain runoff irrigation timing affects when certain plants are available.',
  Montpelier: 'Vermont\'s short season rewards early shopping—visit as soon as frost risk passes for the best selection of hardy perennials. Ask about soil amendments for the area\'s rocky, granite-influenced ground.',
  Richmond: 'Richmond\'s strong horticultural tradition means local centers often carry an unusually deep selection—worth asking staff for native Virginia perennial recommendations specifically. Spring and fall are both solid planting windows in this mild mid-Atlantic climate.',
  Olympia: 'Take advantage of being near one of the country\'s major nursery-growing regions by asking what\'s grown locally in western Washington versus shipped in—the selection of conifers and rhododendrons in particular tends to be excellent. Mild, wet winters mean fall planting works very well here too.',
  Charleston: 'Ask local staff about your specific microclimate—West Virginia\'s steep terrain means conditions can vary significantly even within a short drive of Charleston. Spring is the busiest season, but fall works well for trees and shrubs.',
  Madison: 'Wisconsin\'s spring rush is intense and short, so visit as soon as the frost risk passes for the best selection of hardy perennials. Ask about zone 5 ratings specifically before buying anything not explicitly suited to Madison\'s winters.',
  Cheyenne: 'Ask about wind-tolerant and extremely drought-resistant varieties—Wyoming\'s relentless high-plains wind makes this a practical necessity rather than a preference. Spring is short and intense here, so early shopping pays off.',
};

const gardenCenterRegion = {
  'new-england': {
    h2: 'Garden Centers Across New England',
    body: `New England's garden centers operate within a tightly defined growing season bracketed by a real winter on both ends, which gives the region's nurseries a clear and predictable annual rhythm: spring annuals and vegetable starts, a full summer of perennials and flowering shrubs, and a beloved fall season built around mums, pumpkins, and the trees and shrubs chosen specifically for their autumn color. Connecticut, Maine, Massachusetts, New Hampshire, Rhode Island, and Vermont each have their own pockets of hardiness zones depending on coastal proximity and elevation, and the best local centers know exactly which plants handle their particular corner of the region.`,
  },
  'mid-atlantic': {
    h2: 'Mid-Atlantic Garden Centers',
    body: `The mid-Atlantic supports one of the strongest commercial nursery industries in the country, anchored by New Jersey's deep horticultural infrastructure and complemented by Pennsylvania, Delaware, Maryland, Virginia, and West Virginia, each with their own well-established garden center traditions. The region's moderate climate and four distinct seasons give local centers a long and varied selling season, from spring bulbs and vegetable starts through a strong fall display built around the area's well-known apple and pumpkin harvests.`,
  },
  southeast: {
    h2: 'Southeastern Garden Centers',
    body: `The Southeast's warm, humid climate and long growing season make it one of the most forgiving regions in the country for gardening, with azaleas, camellias, dogwoods, and crepe myrtles serving as garden center staples from Georgia and the Carolinas through Alabama, Mississippi, Tennessee, and Florida. Many garden centers here stay busy nearly year-round rather than seeing the sharp seasonal swings common farther north, and disease-resistant plant varieties get particular attention given the region's heat and humidity.`,
  },
  midwest: {
    h2: 'Midwest Garden Centers',
    body: `Midwest garden centers work within a clear seasonal calendar shaped by cold winters and a relatively compressed growing season, which makes the spring rush especially intense across Illinois, Indiana, Iowa, Kansas, Michigan, Minnesota, Missouri, Nebraska, Ohio, North Dakota, South Dakota, and Wisconsin. Native prairie perennials and pollinator-friendly plantings have become an increasingly popular focus at local centers throughout the region, reflecting both the area's agricultural heritage and growing interest in low-maintenance landscaping.`,
  },
  mountain: {
    h2: 'Mountain West Garden Centers',
    body: `Mountain west garden centers contend with some of the most challenging growing conditions in the country—high altitude, intense sun, dramatic day-to-night temperature swings, and in many areas genuine aridity that makes water-wise landscaping a practical necessity rather than a stylistic choice. Colorado, Idaho, Montana, Nevada, New Mexico, Utah, and Wyoming each have their own hardy native plant traditions, and the best local centers across the region specialize in drought-tolerant perennials suited to short, intense growing seasons.`,
  },
  'south-central': {
    h2: 'Garden Centers in Texas, Oklahoma, and Louisiana',
    body: `Texas and Oklahoma share a climate defined by heat, wind, and periodic drought, which has made native, low-water plants like Texas sage, lantana, and yaupon holly into garden center staples rather than a niche choice, while Louisiana's humid subtropical climate supports the kind of long growing season and lush ornamental plantings—azaleas, camellias, crepe myrtles—more typical of the Deep South.`,
  },
  pacific: {
    h2: 'Pacific Coast Garden Centers',
    body: `The Pacific Northwest, particularly Oregon's Willamette Valley and western Washington, is home to one of the largest commercial nursery-growing regions in the entire country, and local garden centers benefit from that proximity with exceptionally deep, often locally grown inventories of conifers, rhododendrons, and perennials. California's Mediterranean climate supports nearly year-round gardening and a strong focus on drought-tolerant natives given the state's recurring water concerns, while Alaska's milder coastal pockets support a more limited but genuine gardening culture shaped by heavy rainfall and short winter daylight.`,
  },
  southwest: {
    h2: 'Garden Centers in Arizona and Hawaii',
    body: `Arizona's desert garden centers have built an entire business around xeriscaping, with cacti, succulents, and drought-tolerant natives as the practical default rather than a trend, given the region's extreme summer heat and limited rainfall. Hawaii's tropical climate is a different world entirely, with local garden centers specializing in orchids, plumeria, hibiscus, and other tropical plants that thrive in year-round warmth but couldn't survive almost anywhere else in the country.`,
  },
};

const gardenCenterSeason = {
  Alabama: 'Spring is the busiest planting season, but Alabama\'s long, mild fall is an underrated second window for trees and shrubs, and many garden centers stay active well into November.',
  Alaska: 'A short but intense window from late spring through midsummer, shaped by Juneau\'s mild coastal climate and long summer daylight hours.',
  Arizona: 'Fall and winter are actually the better planting seasons in Phoenix\'s desert climate, letting roots establish before the extreme heat of summer arrives.',
  Arkansas: 'Spring is the primary rush, but Arkansas\'s mild autumns make fall an excellent and underused time to plant trees and shrubs.',
  California: 'Sacramento\'s Mediterranean climate supports planting across most of the year, with spring and fall as the two most active seasons at local centers.',
  Colorado: 'A compressed window between the last spring frost and the first fall frost, both of which can arrive earlier than expected at Denver\'s altitude.',
  Connecticut: 'Spring is the main rush, but fall planting often produces better-established perennials and shrubs by the following summer.',
  Delaware: 'Both spring and fall offer strong planting windows on the Delmarva Peninsula\'s sandy coastal-plain soil.',
  Florida: 'A long growing season that extends well beyond spring, with fall actually preferred for many ornamentals around Tallahassee.',
  Georgia: 'Spring is the peak season for azaleas and dogwoods, with a long growing season extending well into fall around Atlanta.',
  Hawaii: 'Year-round growing means there\'s no traditional planting season in Honolulu—local centers stay active every month.',
  Idaho: 'A relatively short, hot-summer window bracketed by Boise\'s spring and fall frost dates.',
  Illinois: 'Spring is the busiest rush, with a secondary fall window for trees and shrubs around Springfield.',
  Indiana: 'A fairly short frost-free season centered on spring, with fall as a solid secondary window for trees and shrubs.',
  Iowa: 'An intense, compressed spring rush around Des Moines once the frost risk passes, given Iowa\'s cold winters.',
  Kansas: 'Both early spring and early fall offer good planting conditions around Topeka, avoiding the extremes of summer heat and winter wind.',
  Kentucky: 'Spring is the busiest season in the Bluegrass region, with good centers restocking through summer and into fall.',
  Louisiana: 'A long growing season around Baton Rouge that rarely closes entirely—something can usually be planted nearly any month.',
  Maine: 'A short, intense window each spring once Augusta\'s frost risk passes, with the hardiest perennials selling out fast.',
  Maryland: 'Both spring and early fall are solid planting windows around the Chesapeake Bay region near Annapolis.',
  Massachusetts: 'Spring is the main season, with September and October drawing visitors for New England\'s famous fall foliage trees and shrubs.',
  Michigan: 'Spring is the primary rush around Lansing, moderated somewhat by Michigan\'s lake-effect climate extending the season slightly.',
  Minnesota: 'A short, intense spring rush around Saint Paul once the frost risk finally passes after Minnesota\'s severe winters.',
  Mississippi: 'A long growing season around Jackson extending well into fall, beyond the traditional spring rush.',
  Missouri: 'Spring is the primary season around Jefferson City, with fall as a solid secondary window for trees and shrubs.',
  Montana: 'A short, intense growing season around Helena bracketed by Montana\'s long winters on both ends.',
  Nebraska: 'Both spring and fall offer good planting windows around Lincoln, avoiding the extremes of Nebraska\'s summer heat and winter cold.',
  Nevada: 'Spring and fall offer more moderate planting conditions than summer\'s extreme heat in the high-desert valleys near Carson City.',
  'New Hampshire': 'A short but reliable summer growing season around Concord, with fall planting working well for hardy perennials and shrubs.',
  'New Jersey': 'Spring and fall are both strong planting windows in the Garden State\'s moderate mid-Atlantic climate near Trenton.',
  'New Mexico': 'Spring and fall offer the most moderate conditions around Santa Fe, avoiding the intense midday sun of summer at altitude.',
  'New York': 'Spring is the main season in the Hudson Valley near Albany, with fall drawing visitors for the region\'s apple and pumpkin displays.',
  'North Carolina': 'Spring and fall are both excellent planting windows in the Piedmont\'s mild climate around Raleigh.',
  'North Dakota': 'A short, intense spring rush around Bismarck once the frost risk passes after North Dakota\'s severe winters.',
  Ohio: 'Spring is the primary rush around Columbus, with fall as an underrated window for planting trees and shrubs before winter.',
  Oklahoma: 'Spring and fall both offer better conditions than the height of summer heat in the Great Plains climate near Oklahoma City.',
  Oregon: 'Mild, wet winters around Salem mean the planting season extends well beyond spring, with fall working particularly well here.',
  Pennsylvania: 'Spring is the primary season near Harrisburg, with fall drawing visitors for Pennsylvania\'s well-known apple and pumpkin harvest displays.',
  'Rhode Island': 'Spring and early fall are both solid planting windows in Rhode Island\'s compact coastal climate near Providence.',
  'South Carolina': 'A long growing season around Columbia that extends well into fall, beyond the traditional spring rush for camellias and azaleas.',
  'South Dakota': 'A short, intense spring rush around Pierre once the frost risk passes after South Dakota\'s harsh winters.',
  Tennessee: 'Spring is the busiest season around Nashville, with the state\'s transitional climate supporting planting into early fall as well.',
  Texas: 'Fall is actually a better planting time than spring around Austin, letting roots establish before the intense summer heat arrives.',
  Utah: 'Spring and fall offer the most moderate planting conditions around Salt Lake City, tied closely to mountain runoff irrigation timing.',
  Vermont: 'A short, intense spring rush around Montpelier once Vermont\'s frost risk finally passes.',
  Virginia: 'Spring and fall are both solid planting windows in Richmond\'s mild mid-Atlantic climate.',
  Washington: 'Mild, wet winters around Olympia mean the planting season extends well beyond spring, much like neighboring Oregon.',
  'West Virginia': 'Spring is the busiest season around Charleston, with fall working well for trees and shrubs in the Appalachian hill country.',
  Wisconsin: 'A short, intense spring rush around Madison once the frost risk passes after Wisconsin\'s cold winters.',
  Wyoming: 'A short growing season around Cheyenne shaped by high-plains wind and a narrow frost-free window each summer.',
};

// ---------- Strawberry patch / pumpkin patch content ----------

const regionLabels = {
  'new-england': 'New England',
  'mid-atlantic': 'the Mid-Atlantic',
  southeast: 'the Southeast',
  midwest: 'the Midwest',
  mountain: 'the Mountain West',
  'south-central': 'Texas, Oklahoma, and Louisiana',
  pacific: 'the Pacific Coast',
  southwest: 'Arizona and Hawaii',
};

const strawberryPatchRegion = {
  'new-england': {
    h2: 'Strawberry Patches Across New England',
    body: `New England's strawberry season is short, intense, and beloved—typically running from early June through early July across Connecticut, Maine, Massachusetts, New Hampshire, Rhode Island, and Vermont before the summer heat pushes plants past their prime. Local u-pick farms tend to open and close within just a few weeks, so it pays to call ahead or check a farm's social media before making the trip.`,
  },
  'mid-atlantic': {
    h2: 'Mid-Atlantic Strawberry Patches',
    body: `The mid-Atlantic's strawberry season runs from mid-May into June across New Jersey, Pennsylvania, Delaware, Maryland, Virginia, and West Virginia, aided by the region's sandy coastal-plain soils that many growers favor for berries. New Jersey in particular has a long commercial strawberry-growing tradition that supports plenty of u-pick options each spring.`,
  },
  southeast: {
    h2: 'Southeastern Strawberry Patches',
    body: `The Southeast enjoys one of the earliest strawberry seasons in the country, often starting in March and running through May across Georgia, Alabama, Mississippi, Tennessee, Florida, North Carolina, South Carolina, Arkansas, Kentucky, and Louisiana. Florida's central growing region is especially known for winter and early-spring berries, while the rest of the region follows a few weeks behind.`,
  },
  midwest: {
    h2: 'Midwest Strawberry Patches',
    body: `Midwest strawberry patches have a compact June season across Illinois, Indiana, Iowa, Kansas, Michigan, Minnesota, Missouri, Nebraska, Ohio, North Dakota, South Dakota, and Wisconsin, squeezed between the last spring frost and the region's hot midsummer stretch. Because the window is so short, popular farms can sell out of picking slots on weekends, so weekday visits are worth considering.`,
  },
  mountain: {
    h2: 'Mountain West Strawberry Patches',
    body: `High altitude and cool nights give Mountain West strawberry patches a later, shorter season—typically late June into July—across Colorado, Idaho, Montana, Nevada, New Mexico, Utah, and Wyoming. The region's intense daytime sun combined with cold nights actually concentrates sugars in the berries, and local growers are often happy to talk about their high-altitude growing techniques.`,
  },
  'south-central': {
    h2: 'Strawberry Patches in Texas, Oklahoma, and Louisiana',
    body: `Texas and Louisiana see some of the earliest strawberries in the country, with picking often starting in March and wrapping up by May before summer heat takes over, while Oklahoma's season runs a few weeks later. Louisiana in particular has a long-standing strawberry tradition, especially around its southeastern parishes, with festivals built around the spring harvest.`,
  },
  pacific: {
    h2: 'Pacific Coast Strawberry Patches',
    body: `California grows more strawberries than any other state in the country, and its mild coastal climate supports an extended season that can run from spring well into fall in some areas, while Oregon and Washington have a shorter, more traditional June-into-July window. Alaska's limited but genuine strawberry patches take advantage of the state's long summer daylight hours for a brief midsummer season.`,
  },
  southwest: {
    h2: 'Strawberry Patches in Arizona and Hawaii',
    body: `Arizona's desert strawberry patches favor the cooler months, with picking typically running from winter into early spring before summer heat arrives, a very different rhythm from most of the country. Hawaii's tropical climate supports strawberry growing nearly year-round, though local patches tend to be smaller and less common than in mainland states.`,
  },
};

const strawberryPatchSeason = {
  'new-england': 'Late spring into early summer, typically a tight window from early June through early July before the season wraps up quickly.',
  'mid-atlantic': 'Mid-spring into early summer, generally mid-May through June in the region\'s sandy coastal-plain soils.',
  southeast: 'One of the earliest seasons in the country, generally running from March through May depending on how far south you are.',
  midwest: 'A short, intense June window between the last spring frost and the region\'s midsummer heat.',
  mountain: 'A later, shorter season shaped by altitude, typically running from late June into July.',
  'south-central': 'An early season, generally March through May in Texas and Louisiana, with Oklahoma running a few weeks behind.',
  pacific: 'California\'s mild coastal climate supports a long season into fall, while Oregon and Washington see a shorter June-into-July window.',
  southwest: 'Arizona favors winter into early spring picking, while Hawaii\'s tropical climate supports growing nearly year-round.',
};

const strawberryPatchTips = {
  'new-england': 'Call ahead or check a farm\'s social media before visiting—New England\'s strawberry season is short and popular farms can pick out fast on weekends. Bring your own containers if the farm allows it, and arrive earlier in the day when berries are cooler and firmer.',
  'mid-atlantic': 'Weekday mornings tend to be quieter than weekend afternoons at popular mid-Atlantic patches. Look low in the plant for fully red berries, since the reddest fruit is often hidden beneath the leaves rather than sitting on top.',
  southeast: 'Since the Southeast\'s season starts earlier than almost anywhere else in the country, check with individual farms in late winter to confirm their opening date. Morning visits help you beat both the crowds and the heat later in the day.',
  midwest: 'Midwest strawberry season moves fast, so don\'t wait too long to plan your visit once picking opens. Bring a wide, shallow container rather than a deep bucket to avoid crushing the berries at the bottom.',
  mountain: 'Mountain patches often open later than you\'d expect given the altitude, so call ahead to confirm timing rather than assuming an early-June start. Sun protection matters even on a cool morning at elevation.',
  'south-central': 'Louisiana and Texas patches move through their season quickly given the early heat, so plan a visit as soon as you hear picking has started. Many farms in the region pair picking with a small festival or market day worth checking for.',
  pacific: 'California\'s long season means less urgency about timing than elsewhere, but coastal farms can still get busy on weekends. In Oregon and Washington, a rainy spring can shift the opening date, so a quick call ahead is worth it.',
  southwest: 'Arizona\'s cooler-season picking means dressing warmer than you might expect for a desert visit. Hawaii patches are less common, so calling ahead to confirm hours is especially useful.',
};

const pumpkinPatchRegion = {
  'new-england': {
    h2: 'Pumpkin Patches Across New England',
    body: `New England's pumpkin patches hit their stride in late September and October, often timed alongside the region's famous fall foliage, with hayrides, corn mazes, and cider offerings rounding out a visit to farms across Connecticut, Maine, Massachusetts, New Hampshire, Rhode Island, and Vermont. Weekends in mid-October tend to be the busiest, so a weekday trip usually means shorter lines.`,
  },
  'mid-atlantic': {
    h2: 'Mid-Atlantic Pumpkin Patches',
    body: `Pumpkin patches across New Jersey, Pennsylvania, Delaware, Maryland, Virginia, and West Virginia often share space with the region's well-known apple orchards each fall, letting visitors combine both in a single trip through late September and October. Pennsylvania and New Jersey in particular have deep agricultural traditions that support large, well-established patches with extensive fall activities.`,
  },
  southeast: {
    h2: 'Southeastern Pumpkin Patches',
    body: `Southeastern pumpkin patches across Georgia, Alabama, Mississippi, Tennessee, Florida, North Carolina, South Carolina, Arkansas, Kentucky, and Louisiana typically run from late September through October, with the region's milder fall weather extending comfortable picking conditions later into the season than farther north. Many farms in hotter, lower-lying areas bring in pumpkins from cooler-climate growers to supplement their own harvest.`,
  },
  midwest: {
    h2: 'Midwest Pumpkin Patches',
    body: `The Midwest is the heart of the country's pumpkin industry—Illinois alone grows more pumpkins than any other state—and patches across Indiana, Iowa, Kansas, Michigan, Minnesota, Missouri, Nebraska, Ohio, North Dakota, South Dakota, and Wisconsin turn the September-through-October season into a major regional tradition complete with corn mazes and harvest festivals.`,
  },
  mountain: {
    h2: 'Mountain West Pumpkin Patches',
    body: `Mountain West pumpkin patches across Colorado, Idaho, Montana, Nevada, New Mexico, Utah, and Wyoming run a slightly compressed season from mid-September into October, shaped by the region's earlier-arriving fall frosts at altitude. Cool, sunny days make for pleasant picking conditions even later in the season.`,
  },
  'south-central': {
    h2: 'Pumpkin Patches in Texas, Oklahoma, and Louisiana',
    body: `Texas, Oklahoma, and Louisiana pumpkin patches generally get going in late September once the worst of the summer heat has broken, running through October and into early November in the warmer parts of the region. Many patches double as full fall festivals with hayrides and corn mazes alongside the pumpkins themselves.`,
  },
  pacific: {
    h2: 'Pacific Coast Pumpkin Patches',
    body: `Oregon and Washington are known for large, well-developed pumpkin patches with elaborate corn mazes, typically running from late September through October in the Willamette Valley and around Puget Sound. California's mild climate supports a similar fall season, while Alaska's shorter, cooler autumn means an earlier and more compressed picking window.`,
  },
  southwest: {
    h2: 'Pumpkin Patches in Arizona and Hawaii',
    body: `Arizona pumpkin patches typically wait until October or even November to open, letting the desert's summer heat fully break before pumpkins and visitors alike can handle a day in the field. Hawaii's tropical climate makes traditional pumpkin patches uncommon, though some farms and markets still offer pumpkins and fall-themed activities around Halloween.`,
  },
};

const pumpkinPatchSeason = {
  'new-england': 'Late September through October, often timed alongside the region\'s peak fall foliage.',
  'mid-atlantic': 'Late September through October, frequently paired with the region\'s apple harvest at the same farms.',
  southeast: 'Late September through October, with the region\'s milder fall weather extending the season later than farther north.',
  midwest: 'September through October, the heart of the country\'s pumpkin-growing season and a major regional tradition.',
  mountain: 'Mid-September into October, slightly compressed by earlier-arriving fall frosts at altitude.',
  'south-central': 'Late September through October, sometimes stretching into early November in the warmer parts of the region.',
  pacific: 'Late September through October in Oregon and Washington, with Alaska\'s season arriving earlier and wrapping up sooner.',
  southwest: 'October into November in Arizona, once summer heat has fully broken; less traditional and more limited in Hawaii.',
};

const pumpkinPatchTips = {
  'new-england': 'Mid-October weekends are the busiest time at New England patches thanks to overlapping leaf-peeping traffic, so a weekday visit usually means shorter lines. Bring cash or check ahead, since some smaller farm stands don\'t take cards.',
  'mid-atlantic': 'Many mid-Atlantic farms combine pumpkin picking with apple picking in the same visit, so check what else is in season before you go. Wagons or carts are often available for hauling larger pumpkins back to the car.',
  southeast: 'Southeastern patches can stay comfortable well into October thanks to the region\'s milder fall weather, making it a good time for a relaxed weekday visit. Ask whether pumpkins are grown on-site or brought in, since many farms in hotter areas do both.',
  midwest: 'Midwest patches get busy on fall weekends with school groups and families, so a weekday morning tends to be quieter. Many farms combine a pumpkin patch with a corn maze, so plan extra time if you want to do both.',
  mountain: 'Layer up for cool mornings even in early fall at higher elevations. Patches here can sell out of larger pumpkins earlier than expected, so visiting midseason rather than waiting for late October is a safe bet.',
  'south-central': 'Wait until late September or later for cooler, more comfortable picking conditions in Texas, Oklahoma, and Louisiana. Many patches double as full fall festivals, so check what activities are included before you go.',
  pacific: 'Oregon and Washington patches with elaborate corn mazes can take a full afternoon, so plan accordingly if you want to see everything. California\'s milder climate means less time pressure if you\'d rather visit on a quieter weekday.',
  southwest: 'Wait for October or November in Arizona rather than visiting during the tail end of summer heat. In Hawaii, call ahead since traditional pumpkin patches are far less common than on the mainland.',
};

// ---------- State-level "All X in [State]" content ----------

const orchardStateRegion = {
  'new-england': { h2: 'Orchards Across New England', body: `New England's orchards are best known for apples, with a long fall harvest that draws visitors for weeks, though many properties across Connecticut, Maine, Massachusetts, New Hampshire, Rhode Island, and Vermont also grow peaches, cherries, and berries earlier in the season.` },
  'mid-atlantic': { h2: 'Mid-Atlantic Orchards', body: `New Jersey and Pennsylvania anchor a strong mid-Atlantic orchard tradition spanning apples, peaches, and cherries, complemented by farms throughout Delaware, Maryland, Virginia, and West Virginia.` },
  southeast: { h2: 'Southeastern Orchards', body: `Southeastern orchards across Georgia, Alabama, Mississippi, Tennessee, Florida, North Carolina, South Carolina, Arkansas, Kentucky, and Louisiana take advantage of a long growing season, with higher-elevation areas particularly well suited to apples and peaches.` },
  midwest: { h2: 'Midwest Orchards', body: `Midwest orchards across Illinois, Indiana, Iowa, Kansas, Michigan, Minnesota, Missouri, Nebraska, Ohio, North Dakota, South Dakota, and Wisconsin are known especially for apples and cherries, with Michigan in particular a major national producer of both.` },
  mountain: { h2: 'Mountain West Orchards', body: `High altitude and intense sun across Colorado, Idaho, Montana, Nevada, New Mexico, Utah, and Wyoming concentrate flavor in orchard fruit, with apples and cherries as the region's most common crops.` },
  'south-central': { h2: 'Orchards in Texas, Oklahoma, and Louisiana', body: `Orchards across Texas, Oklahoma, and Louisiana grow peaches and citrus in the warmer areas, with apples more common in Texas's cooler high-elevation pockets.` },
  pacific: { h2: 'Pacific Coast Orchards', body: `Washington and Oregon are national leaders in apple and cherry production, while California's orchards span everything from citrus to stone fruit, and Alaska's limited orchards make the most of a short growing season.` },
  southwest: { h2: 'Orchards in Arizona and Hawaii', body: `Arizona's orchards favor apples and stone fruit at higher, cooler elevations, while Hawaii's tropical climate supports orchards growing fruit found almost nowhere else in the country.` },
};

const orchardStateSeason = {
  'new-england': 'A long fall apple season from September through October, with peaches and cherries earlier in summer.',
  'mid-atlantic': 'Peaches and cherries in summer, building to a well-known apple season from September through October.',
  southeast: 'An early peach season in summer, with apples following in fall, especially at higher elevations.',
  midwest: 'Cherries in midsummer, apples from September through October.',
  mountain: 'A shorter, later season shaped by altitude, with apples and cherries in late summer and early fall.',
  'south-central': 'Peaches in early summer, citrus in winter, and apples in fall where the climate allows.',
  pacific: 'Cherries in early-to-mid summer, apples from late summer through fall, and citrus through winter in California.',
  southwest: 'Stone fruit and apples in the cooler months at elevation; citrus through the winter.',
};

const orchardStateTips = {
  'new-england': 'Fall weekends get busy fast once peak apple season hits, so a weekday visit usually means shorter lines. Call ahead in summer to check what stone fruit or berries are currently ready.',
  'mid-atlantic': 'Many orchards here grow several fruits across the season, so ask what else is ready when you call about one crop in particular.',
  southeast: 'Visit early in the day during peach season to beat both the crowds and the heat; higher-elevation apple orchards stay comfortable later into fall.',
  midwest: 'Cherry season moves fast, so don\'t wait too long once picking opens; apple season runs longer and is more forgiving to plan around.',
  mountain: 'Call ahead to confirm timing, since Mountain West orchards often run later and shorter than lower-elevation regions.',
  'south-central': 'Plan around the region\'s heat — early morning visits are especially worthwhile for summer peach picking.',
  pacific: 'Washington and Oregon cherry season is short and popular, so check availability before making the trip; California\'s long season allows more flexibility.',
  southwest: 'Visit at elevation for the most comfortable stone fruit and apple picking; citrus season in the lower desert runs through winter.',
};

const farmStateRegion = {
  'new-england': { h2: 'Farms Across New England', body: `New England's small, family-run farms across Connecticut, Maine, Massachusetts, New Hampshire, Rhode Island, and Vermont grow everything from spring strawberries through summer vegetables to a well-known fall harvest of pumpkins and other produce.` },
  'mid-atlantic': { h2: 'Mid-Atlantic Farms', body: `The mid-Atlantic's strong agricultural tradition, especially in New Jersey and Pennsylvania, supports farms growing produce across the calendar throughout Delaware, Maryland, Virginia, and West Virginia as well.` },
  southeast: { h2: 'Southeastern Farms', body: `The Southeast's long growing season keeps farms across Georgia, Alabama, Mississippi, Tennessee, Florida, North Carolina, South Carolina, Arkansas, Kentucky, and Louisiana active for much of the year, from early strawberries through summer produce into a mild fall.` },
  midwest: { h2: 'Midwest Farms', body: `Midwest farms across Illinois, Indiana, Iowa, Kansas, Michigan, Minnesota, Missouri, Nebraska, Ohio, North Dakota, South Dakota, and Wisconsin reflect the region's deep agricultural roots, with a compact summer season building toward a major fall pumpkin harvest.` },
  mountain: { h2: 'Mountain West Farms', body: `Farms across Colorado, Idaho, Montana, Nevada, New Mexico, Utah, and Wyoming work within a short, intense growing season shaped by altitude, often specializing in produce suited to cool nights and strong sun.` },
  'south-central': { h2: 'Farms in Texas, Oklahoma, and Louisiana', body: `Farms across Texas, Oklahoma, and Louisiana see an early spring start with strawberries and vegetables, running through summer into a fall pumpkin season once the heat breaks.` },
  pacific: { h2: 'Pacific Coast Farms', body: `California's Mediterranean climate supports farms growing produce nearly year-round, while Oregon and Washington farms follow the Pacific Northwest's mild, wet-winter growing calendar, and Alaska's farms make the most of long summer daylight hours.` },
  southwest: { h2: 'Farms in Arizona and Hawaii', body: `Arizona's desert farms favor cooler-season produce in winter and early spring, while Hawaii's tropical climate supports small-scale, nearly year-round farming unlike anywhere else in the country.` },
};

const farmStateSeason = {
  'new-england': 'Strawberries in June, summer vegetables, and a fall pumpkin harvest.',
  'mid-atlantic': 'Spring and summer produce building toward a well-known fall pumpkin season.',
  southeast: 'An early spring start, active through summer, with a mild extended fall.',
  midwest: 'A compact summer season leading into the region\'s major fall pumpkin harvest.',
  mountain: 'A short, intense midsummer-through-early-fall growing season.',
  'south-central': 'An early spring start, summer produce, and a fall pumpkin season once the heat breaks.',
  pacific: 'California supports nearly year-round farming; Oregon and Washington follow a summer-into-fall calendar.',
  southwest: 'Arizona favors winter and early spring; Hawaii supports farming nearly year-round.',
};

const farmStateTips = {
  'new-england': 'Check what\'s in season before visiting, since farms here rotate through several different crops across the year. Weekday visits are usually quieter.',
  'mid-atlantic': 'Many farms grow several crops on the same property, so ask what else is ready when you call ahead about one in particular.',
  southeast: 'Morning visits help beat both crowds and heat, especially during the region\'s early spring and summer growing months.',
  midwest: 'Plan visits promptly once a crop is announced as ready, since Midwest picking windows can move quickly.',
  mountain: 'Call ahead to confirm timing, since farms here often open later than lower-elevation regions given the shorter season.',
  'south-central': 'Early spring and mid-to-late fall tend to be the most comfortable times to visit farms in this region.',
  pacific: 'California\'s long season allows more flexibility; in Oregon and Washington, check ahead since a wet spring can shift timing.',
  southwest: 'Dress warmer than expected for Arizona\'s cooler-season farm visits; call ahead for Hawaii farms since they are less common.',
};

const STATE_CATEGORY_CONFIG = {
  Orchard: {
    slugPrefix: 'all-orchards-in-',
    label: 'Orchards',
    labelSingular: 'Orchard',
    region: orchardStateRegion,
    season: orchardStateSeason,
    tips: orchardStateTips,
  },
  'Garden Center': {
    slugPrefix: 'all-garden-centers-in-',
    label: 'Garden Centers',
    labelSingular: 'Garden Center',
    region: gardenCenterRegion,
    season: gardenCenterSeason,
    tips: null, // uses per-city gardenCenterTips; state pages use region-only tips fallback below
  },
  Farm: {
    slugPrefix: 'all-farms-in-',
    label: 'Farms',
    labelSingular: 'Farm',
    region: farmStateRegion,
    season: farmStateSeason,
    tips: farmStateTips,
  },
};

const gardenCenterStateTips = {
  'new-england': 'Visit as soon as the frost risk passes in spring for the best selection of hardy perennials, and consider a fall trip for trees and shrubs.',
  'mid-atlantic': 'Ask staff what\'s grown locally versus shipped in — the region\'s strong nursery industry means the answer varies more than you\'d expect.',
  southeast: 'Garden centers here stay busy nearly year-round rather than seeing sharp seasonal swings common farther north.',
  midwest: 'The spring rush is intense and short, so visit early for the best selection of hardy perennials.',
  mountain: 'Ask about drought-tolerant and native plants suited to high altitude, intense sun, and dramatic temperature swings.',
  'south-central': 'Ask about wind-tolerant, low-water natives in Texas and Oklahoma; Louisiana\'s long season supports a wider range of ornamentals.',
  pacific: 'The Pacific Northwest\'s nursery-growing region means exceptionally deep local inventory worth asking about specifically.',
  southwest: 'Arizona centers specialize in xeriscaping; Hawaii centers focus on tropical plants suited to year-round warmth.',
};

function getStateCategoryTips(categoryValue, regionKey) {
  const config = STATE_CATEGORY_CONFIG[categoryValue];
  if (config.tips) return config.tips[regionKey];
  return gardenCenterStateTips[regionKey];
}

// ---------- State-level "All X in [State]" page generator ----------

function generateStateCategoryPage({ state, code, capitalCity, categoryValue, imageIndex }) {
  const config = STATE_CATEGORY_CONFIG[categoryValue];
  const stateSlug = slugify(state);
  const urlSlug = `${config.slugPrefix}${stateSlug}`;
  const canonicalUrl = `https://orchards-nearme.com/find/${urlSlug}`;
  const locationCount = CATEGORY_STATE_COUNTS[categoryValue === 'Garden Center' ? 'garden-centers' : (categoryValue === 'Orchard' ? 'all-orchards' : 'all-farms')][state] || 0;
  const titleTag = `All ${config.label} in ${state} | ${locationCount} Locations`;
  const h1 = `All ${config.label} in ${state} - ${locationCount} Locations`;
  const desc = `There are ${locationCount} ${config.labelSingular.toLowerCase()} locations in ${state}. Browse all ${config.label.toLowerCase()} on an interactive map. Search, filter and sort by ZIP code to find the closest location.`;
  const resultsHeading = `All ${config.label} in ${state}`;

  const capital = capitals.find(c => c.state === state);
  const regionKey = capital ? capital.region : undefined;
  const regionData = config.region[regionKey];
  const seasonText = config.season[state] || config.season[regionKey];
  const tips = getStateCategoryTips(categoryValue, regionKey);
  const regionLabel = regionLabels[regionKey] || 'the region';

  const intro = `${state} sits within ${regionLabel}, and visitors across the state have access to ${config.label.toLowerCase()} reflecting the area's growing conditions and seasonal calendar. Whether you're near ${capitalCity} or elsewhere in ${state}, use the map below to find the closest location and check current ratings before you go.`;

  const seasonH2 = `Best Time to Visit ${categoryValue === 'Garden Center' ? 'a Garden Center' : `a ${config.labelSingular}`} in ${state}`;
  const tipsH2 = `Tips for Visiting ${config.label} in ${state}`;
  const mainH2 = `${config.label} in ${state}: What You Need to Know`;

  const otherCats = ['Orchard', 'Farm', 'Garden Center'].filter(c => c !== categoryValue);
  const filterChips = `<button class="filter-chip" data-cat="all">All Listings</button>
          <button class="filter-chip active" data-cat="${categoryValue}">${config.label}</button>
          <button class="filter-chip" data-cat="${otherCats[0]}">${STATE_CATEGORY_CONFIG[otherCats[0]].label}</button>`;

  const otherStatePages = Object.keys(STATE_CATEGORY_CONFIG)
    .filter(c => c !== categoryValue)
    .map(c => `          <li><a href="/find/${STATE_CATEGORY_CONFIG[c].slugPrefix}${stateSlug}">All ${STATE_CATEGORY_CONFIG[c].label} in ${state}</a></li>`)
    .join('\n');

  const relatedLinks = `<section class="seo-content related-links">
      <div class="container">
        <h2>More to Explore in ${state}</h2>
        <ul class="related-links-list">
${otherStatePages}
        </ul>
        <p class="related-links-all"><a href="/find">Browse all pick-your-own categories and states</a></p>
      </div>
    </section>`;

  const imagePool = categoryValue === 'Garden Center' ? [GARDEN_CENTER_IMAGE] : (categoryValue === 'Orchard' ? ORCHARD_STATE_IMAGES : U_PICK_FARM_IMAGES);
  const image = imagePool[imageIndex % imagePool.length];
  const imageAlt = `${image.alt} in ${state}`;
  const ogImageTag = `\n  <meta property="og:image" content="https://orchards-nearme.com/images/${image.dir}/${image.file}" />`;

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
  <title>${titleTag}</title>
  <meta name="description" content="${desc}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${titleTag}" />
  <meta property="og:description" content="Find ${config.label.toLowerCase()} across ${state} on an interactive map." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonicalUrl}" />${ogImageTag}

  <link rel="icon" href="/logo.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="/vendor/leaflet/leaflet.css" />
  <link rel="stylesheet" href="/css/style.css" />
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9332749804326149" crossorigin="anonymous"></script>
</head>
<body>
  <a class="skip-link" href="#find">Skip to map</a>
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
        <a href="/find" class="cta">Find</a>
      </nav>
    </div>
  </header>

  <main class="find-page-full">
    <div class="find-stage">
      <h1 class="sr-only">${h1}</h1>
      <p class="find-page-desc sr-only">Discover ${config.label.toLowerCase()} across ${state}. Search by ZIP code to find the closest one, check ratings, and read real visitor reviews before you go.</p>
      <div id="map" role="application" aria-label="Map of ${config.label.toLowerCase()} in ${state}"></div>

      <div class="find-topbar">
        <form class="search-form" id="searchForm">
          <input type="text" id="zipInput" inputmode="numeric" placeholder="Enter your ZIP code (e.g. 05346)" aria-label="Search by ZIP code" />
          <button type="submit" class="btn">Search</button>
          <p id="zipError" hidden class="zip-error-msg" role="alert"></p>
        </form>
        <div class="filters-wrap">
          <button type="button" class="filters-toggle" id="filtersToggle" aria-haspopup="true" aria-expanded="false" aria-controls="filters">
            <span class="filters-toggle-icon" aria-hidden="true">&#9776;</span> Filters
          </button>
          <div class="filters" id="filters" role="group" aria-label="Filter by type" data-default-filter="${categoryValue}" data-default-state="${state}">
            ${filterChips}
          </div>
        </div>
        <select class="state-select" id="stateSelect" aria-label="Filter by state">
          <option value="all">All states</option>
        </select>
        <div class="find-legend-float" aria-label="Map key">
          <span class="map-legend-item"><span class="map-legend-dot orchard"></span>Orchard</span>
          <span class="map-legend-item"><span class="map-legend-dot farm"></span>Farm</span>
          <span class="map-legend-item"><span class="map-legend-dot garden"></span>Garden Center</span>
        </div>
      </div>

      <button type="button" class="find-layers-btn" id="layersToggle" aria-pressed="false">
        <span aria-hidden="true">🛰️</span> Satellite
      </button>

      <div class="find-strip">
        <div class="find-strip-head">
          <h2>${resultsHeading}</h2>
          <span class="results-count" id="resultsCount">Loading...</span>
        </div>
        <div class="cards cards-horizontal" id="cards"></div>
      </div>
    </div>

    <section class="seo-content">
      <div class="container">
        <article class="seo-article">

          <h2>${mainH2}</h2>
          <p>${intro}</p>

          <h2>${regionData.h2}</h2>
          <p>${regionData.body}</p>

          <h2>${seasonH2}</h2>
          <p>${seasonText}</p>

          <h2>${tipsH2}</h2>
          <p>${tips}</p>

        </article>
      </div>
    </section>

    ${relatedLinks}
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

  <script src="/vendor/leaflet/leaflet.js"></script>
  <script src="/js/app.js"></script>
</body>
</html>
`;
}

// ---------- Hayrides content ----------

const HAYRIDE_STATES = ['California', 'Connecticut', 'Georgia', 'Hawaii', 'Indiana', 'Iowa', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'New Jersey', 'New York', 'North Dakota', 'Ohio', 'Oklahoma', 'South Carolina', 'Virginia', 'Washington', 'West Virginia', 'Wyoming'];

const hayrideRegion = {
  'new-england': { h2: 'Hayrides Across New England', body: `New England's hayrides run alongside the region's well-known fall foliage and apple season, with farms across Connecticut and Maine pairing a wagon ride with pumpkin picking, cider, and doughnuts each October.` },
  'mid-atlantic': { h2: 'Mid-Atlantic Hayrides', body: `Mid-Atlantic hayrides are a fall staple at farms across New Jersey, New York, Maryland, Virginia, and West Virginia, often bundled with a corn maze or pumpkin patch visit as part of a full day trip.` },
  southeast: { h2: 'Southeastern Hayrides', body: `Southeastern hayrides across Georgia, Kentucky, and South Carolina take advantage of a mild fall that extends comfortably into late October and November, longer than many parts of the country.` },
  midwest: { h2: 'Midwest Hayrides', body: `Midwest hayrides across Indiana, Iowa, North Dakota, and Ohio are deeply tied to the region's fall harvest tradition, with tractor-pulled wagons a familiar sight at farms throughout September and October.` },
  mountain: { h2: 'Mountain West Hayrides', body: `Hayrides in Wyoming and the wider Mountain West run on a shorter fall window, shaped by an early arriving winter, so farms here tend to schedule wagon rides earlier in the season than farms farther south.` },
  'south-central': { h2: 'Hayrides in Louisiana and Oklahoma', body: `Hayrides in Louisiana and Oklahoma typically wait until late September or October once the worst of the summer heat has broken, often as part of a larger fall festival with a pumpkin patch and corn maze.` },
  pacific: { h2: 'Pacific Coast Hayrides', body: `Pacific Coast hayrides in California, Washington, and Hawaii vary widely — California and Washington farms run a fairly traditional fall wagon-ride season, while Hawaii's hayride offerings are rare and tied to a small number of agritourism farms.` },
};

const hayrideRegionKey = {
  California: 'pacific', Connecticut: 'new-england', Georgia: 'southeast', Hawaii: 'pacific',
  Indiana: 'midwest', Iowa: 'midwest', Kentucky: 'southeast', Louisiana: 'south-central',
  Maine: 'new-england', Maryland: 'mid-atlantic', 'New Jersey': 'mid-atlantic', 'New York': 'mid-atlantic',
  'North Dakota': 'midwest', Ohio: 'midwest', Oklahoma: 'south-central', 'South Carolina': 'southeast',
  Virginia: 'mid-atlantic', Washington: 'pacific', 'West Virginia': 'mid-atlantic', Wyoming: 'mountain',
};

const hayrideSeason = {
  California: 'Hayrides run through the fall harvest season, roughly September through early November, at farms across the state.',
  Connecticut: 'Peak hayride season runs through October, alongside Connecticut\'s apple picking and fall foliage.',
  Georgia: 'Georgia\'s mild fall lets hayrides run comfortably from late September through November.',
  Hawaii: 'Hayrides are uncommon in Hawaii and offered by only a small number of agritourism farms, generally available year-round rather than tied to a fall season.',
  Indiana: 'Hayrides run through the fall harvest, typically late September through October.',
  Iowa: 'Peak hayride season is September and October, tied to the state\'s pumpkin and harvest festivals.',
  Kentucky: 'Kentucky\'s hayride season runs from late September through November thanks to the state\'s mild fall.',
  Louisiana: 'Hayrides typically start in October once the worst of the summer heat has passed, running into November.',
  Maine: 'Peak hayride season runs through October, alongside Maine\'s apple harvest and fall foliage.',
  Maryland: 'Hayrides run September through October, often paired with pumpkin patches.',
  'New Jersey': 'Peak hayride season is late September through October, alongside the state\'s well-known fall harvest farms.',
  'New York': 'Hayrides run through October, often paired with apple and pumpkin picking upstate.',
  'North Dakota': 'A shorter fall window, typically September into early October, before winter weather arrives.',
  Ohio: 'Peak hayride season is late September through October, a major fall tradition at farms statewide.',
  Oklahoma: 'Hayrides typically run October through November once the heat has broken.',
  'South Carolina': 'South Carolina\'s mild fall supports hayrides from late September into November.',
  Virginia: 'Peak hayride season is late September through October, often paired with a pumpkin patch visit.',
  Washington: 'Hayrides run through the fall harvest season, typically late September through October.',
  'West Virginia': 'Hayrides run September through October in the Appalachian hill country.',
  Wyoming: 'A shorter fall window than most of the country, typically September into early October.',
};

const hayrideTips = {
  California: 'Ask whether the hayride is a standalone activity or bundled with pumpkin picking, since pricing and timing vary a lot by farm.',
  Connecticut: 'Weekends get busy fast in October, so a weekday visit usually means a shorter wait for the wagon.',
  Georgia: 'Georgia\'s longer season means less rush than farther north — a November visit can still catch a hayride comfortably.',
  Hawaii: 'Call ahead, since hayride offerings are limited to a handful of farms and availability can vary.',
  Indiana: 'Dress warmly for an open-air wagon ride, especially on cool fall evenings.',
  Iowa: 'Many Iowa hayrides are part of a larger harvest festival, so check what else is included before you go.',
  Kentucky: 'Kentucky\'s mild fall means later-season visits are still comfortable for an open-air ride.',
  Louisiana: 'Wait for cooler weather in October or November for a more comfortable ride.',
  Maine: 'Combine a hayride with Maine\'s fall foliage drive for a fuller day trip.',
  Maryland: 'Weekday visits mean shorter waits during Maryland\'s busy October pumpkin season.',
  'New Jersey': 'Many New Jersey farms sell timed tickets for hayrides during peak fall weekends, so check ahead.',
  'New York': 'Upstate hayrides are often paired with apple orchards, so ask what else is in season.',
  'North Dakota': 'Visit earlier in the fall window before the season wraps up ahead of winter weather.',
  Ohio: 'Ohio hayrides are a major fall draw, so expect weekend crowds and consider a weekday visit.',
  Oklahoma: 'Wait for cooler October or November weather for the most comfortable ride.',
  'South Carolina': 'The state\'s mild fall means a late-season visit is still a good option.',
  Virginia: 'Many Virginia farms combine a hayride with a corn maze, so plan extra time if you want to do both.',
  Washington: 'Check the weather, since a wet fall can affect field conditions for the wagon.',
  'West Virginia': 'Dress for cooler mountain evenings on an open-air hayride.',
  Wyoming: 'Visit earlier in the fall rather than waiting for late October, given the state\'s shorter season.',
};

// ---------- Hayrides page generator ----------

function generateHayridesPage({ city, state, code, imageIndex }) {
  const citySlug = slugify(city);
  const stateSlug = slugify(state);
  const urlSlug = `hayrides-near-${citySlug}-${stateSlug}`;
  const canonicalUrl = `https://orchards-nearme.com/find/${urlSlug}`;
  const locationCount = CATEGORY_STATE_COUNTS['hayrides'][state] || 0;
  const titleTag = `Hayrides Near ${city}, ${state} | ${locationCount} Locations`;
  const h1 = `Hayrides Near ${city}, ${state} - ${locationCount} Locations`;
  const desc = `There are ${locationCount} hayride providers near ${city}, ${state}. Browse all farms offering hayrides on an interactive map. Search, filter and sort by ZIP code to find the closest location.`;
  const resultsHeading = `Hayrides Near ${city}, ${code}`;
  const relatedLinks = relatedLinksHtml('hayrides', citySlug, stateSlug, city, state);

  const regionKey = hayrideRegionKey[state];
  const regionData = hayrideRegion[regionKey];
  const seasonText = hayrideSeason[state];
  const tips = hayrideTips[state];
  const regionLabel = regionLabels[regionKey] || 'the region';

  const intro = `Hayrides near ${city}, ${state} are offered by a handful of farms that pull a wagon of hay bales through their fields, typically as part of a fall visit alongside pumpkin picking or a corn maze. ${city} sits within ${regionLabel}, and the farms below offer this as a specific service worth checking for before you go.`;

  const seasonH2 = `Best Time for a Hayride Near ${city}`;
  const tipsH2 = `Tips for Your ${city} Hayride`;
  const mainH2 = `Hayrides Near ${city}: What You Need to Know`;

  const filterChips = `<button class="filter-chip" data-cat="all">All Listings</button>
          <button class="filter-chip active" data-cat="hayrides">Hayrides</button>
          <button class="filter-chip" data-cat="Farm">Farms</button>`;

  const images = [
    { file: 'hayride-covered-wagon-nursery.jpg', alt: 'A covered hayride wagon decorated with fall leaves outside a nursery' },
    { file: 'hayride-horse-drawn-pumpkin-patch.jpg', alt: 'A horse-drawn hayride wagon at a pumpkin patch' },
    { file: 'hayride-tractor-wagon-hay-bales.jpg', alt: 'A tractor pulling a hay bale wagon with riders' },
  ];
  const image = images[imageIndex % images.length];
  const imageAlt = `${image.alt} near ${city}, ${state}`;
  const ogImageTag = `\n  <meta property="og:image" content="https://orchards-nearme.com/images/find/${image.file}" />`;

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
  <title>${titleTag}</title>
  <meta name="description" content="${desc}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${titleTag}" />
  <meta property="og:description" content="Find farms offering hayrides near ${city}, ${state} on an interactive map." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonicalUrl}" />${ogImageTag}

  <link rel="icon" href="/logo.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="/vendor/leaflet/leaflet.css" />
  <link rel="stylesheet" href="/css/style.css" />
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9332749804326149" crossorigin="anonymous"></script>
</head>
<body>
  <a class="skip-link" href="#find">Skip to map</a>
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
        <a href="/find" class="cta">Find</a>
      </nav>
    </div>
  </header>

  <main class="find-page-full">
    <div class="find-stage">
      <h1 class="sr-only">${h1}</h1>
      <p class="find-page-desc sr-only">Discover farms offering hayrides near ${city}, ${state}. Search by ZIP code to find the closest one, check ratings, and read real visitor reviews before you go.</p>
      <div id="map" role="application" aria-label="Map of hayride providers near ${city}, ${state}"></div>

      <div class="find-topbar">
        <form class="search-form" id="searchForm">
          <input type="text" id="zipInput" inputmode="numeric" placeholder="Enter your ZIP code (e.g. 05346)" aria-label="Search by ZIP code" />
          <button type="submit" class="btn">Search</button>
          <p id="zipError" hidden class="zip-error-msg" role="alert"></p>
        </form>
        <div class="filters-wrap">
          <button type="button" class="filters-toggle" id="filtersToggle" aria-haspopup="true" aria-expanded="false" aria-controls="filters">
            <span class="filters-toggle-icon" aria-hidden="true">&#9776;</span> Filters
          </button>
          <div class="filters" id="filters" role="group" aria-label="Filter by type" data-default-filter="hayrides" data-default-state="${state}">
            ${filterChips}
          </div>
        </div>
        <select class="state-select" id="stateSelect" aria-label="Filter by state">
          <option value="all">All states</option>
        </select>
        <div class="find-legend-float" aria-label="Map key">
          <span class="map-legend-item"><span class="map-legend-dot orchard"></span>Orchard</span>
          <span class="map-legend-item"><span class="map-legend-dot farm"></span>Farm</span>
          <span class="map-legend-item"><span class="map-legend-dot garden"></span>Garden Center</span>
        </div>
      </div>

      <button type="button" class="find-layers-btn" id="layersToggle" aria-pressed="false">
        <span aria-hidden="true">🛰️</span> Satellite
      </button>

      <div class="find-strip">
        <div class="find-strip-head">
          <h2>${resultsHeading}</h2>
          <span class="results-count" id="resultsCount">Loading...</span>
        </div>
        <div class="cards cards-horizontal" id="cards"></div>
      </div>
    </div>

    <section class="seo-content">
      <div class="container">
        <article class="seo-article">

          <h2>${mainH2}</h2>
          <p>${intro}</p>

          <h2>${regionData.h2}</h2>
          <p>${regionData.body}</p>

          <h2>${seasonH2}</h2>
          <p>${seasonText}</p>

          <h2>${tipsH2}</h2>
          <p>${tips}</p>

        </article>
      </div>
    </section>

    ${relatedLinks}
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

  <script src="/vendor/leaflet/leaflet.js"></script>
  <script src="/js/app.js"></script>
</body>
</html>
`;
}

// ---------- U-Pick Farms content ----------

const uPickFarmsRegion = {
  'new-england': {
    h2: 'U-Pick Farms Across New England',
    body: `New England's u-pick calendar runs from June strawberries through summer blueberries and raspberries into a long, beloved apple and pumpkin season each fall across Connecticut, Maine, Massachusetts, New Hampshire, Rhode Island, and Vermont. Many farms here have been family-run for generations, and it's common for one property to offer several different crops across the season rather than just one.`,
  },
  'mid-atlantic': {
    h2: 'Mid-Atlantic U-Pick Farms',
    body: `The mid-Atlantic's strong commercial agricultural tradition, especially in New Jersey and Pennsylvania, supports u-pick farms growing everything from spring strawberries through summer peaches and blueberries to a well-known fall apple and pumpkin season across Delaware, Maryland, Virginia, and West Virginia as well.`,
  },
  southeast: {
    h2: 'Southeastern U-Pick Farms',
    body: `The Southeast's long growing season means u-pick farms across Georgia, Alabama, Mississippi, Tennessee, Florida, North Carolina, South Carolina, Arkansas, Kentucky, and Louisiana stay active for much of the year, starting with some of the earliest strawberries in the country and running through summer peaches and blueberries into a mild, extended fall season.`,
  },
  midwest: {
    h2: 'Midwest U-Pick Farms',
    body: `Midwest u-pick farms across Illinois, Indiana, Iowa, Kansas, Michigan, Minnesota, Missouri, Nebraska, Ohio, North Dakota, South Dakota, and Wisconsin work within a clear seasonal rhythm shaped by cold winters, with a compact strawberry and berry season in early summer building toward the region's famous apple and pumpkin harvests each fall.`,
  },
  mountain: {
    h2: 'Mountain West U-Pick Farms',
    body: `High altitude and a short growing season across Colorado, Idaho, Montana, Nevada, New Mexico, Utah, and Wyoming concentrate most u-pick activity into a compressed window from midsummer through early fall, though the region's intense sun and cool nights often produce especially flavorful fruit.`,
  },
  'south-central': {
    h2: 'U-Pick Farms in Texas, Oklahoma, and Louisiana',
    body: `Texas, Oklahoma, and Louisiana see u-pick season start early with spring strawberries and citrus in the warmest areas, continuing through summer peaches and blueberries before wrapping up with a fall pumpkin season once the worst of the heat has broken.`,
  },
  pacific: {
    h2: 'Pacific Coast U-Pick Farms',
    body: `California's Mediterranean climate supports one of the longest u-pick seasons in the country, while Oregon and Washington are known for berries, cherries, and pumpkins tied to the Pacific Northwest's mild, wet-winter climate, and Alaska's limited but genuine farms make the most of long summer daylight hours.`,
  },
  southwest: {
    h2: 'U-Pick Farms in Arizona and Hawaii',
    body: `Arizona's desert u-pick farms favor cooler-season crops like citrus and winter strawberries, a different rhythm from most of the country, while Hawaii's tropical climate supports smaller-scale, nearly year-round growing quite unlike anywhere else on this list.`,
  },
};

const uPickFarmsSeason = {
  'new-england': 'Something is usually in season from June strawberries through a long fall apple and pumpkin harvest, though any single crop has a short window.',
  'mid-atlantic': 'A long season running from spring strawberries through summer peaches and blueberries into a well-known fall apple and pumpkin harvest.',
  southeast: 'One of the longest u-pick seasons in the country, starting with early spring strawberries and running through summer and into a mild fall.',
  midwest: 'A compact but full season, from early summer berries through the region\'s famous fall apple and pumpkin harvests.',
  mountain: 'A compressed midsummer-through-early-fall window shaped by altitude and a shorter growing season.',
  'south-central': 'An early start with spring strawberries and citrus, continuing through summer produce into a fall pumpkin season.',
  pacific: 'California supports nearly year-round picking, while Oregon and Washington follow a more traditional summer-into-fall calendar.',
  southwest: 'Arizona favors cooler-season crops in winter and early spring; Hawaii supports smaller-scale growing nearly year-round.',
};

const uPickFarmsTips = {
  'new-england': 'Check what\'s currently in season before you go, since New England farms rotate through several different crops across spring, summer, and fall. Popular farms can sell out of picking slots on nice weekends, so a weekday visit is often less crowded.',
  'mid-atlantic': 'Many mid-Atlantic farms grow several crops on the same property, so ask what else is ready when you call ahead about one in particular. Weekday mornings tend to be quieter than weekend afternoons.',
  southeast: 'Since the Southeast\'s season starts earlier and runs longer than most of the country, check with individual farms directly rather than assuming a single national timeline applies. Morning visits help beat both crowds and heat.',
  midwest: 'Midwest picking windows move fast, so don\'t wait too long once a farm announces a crop is ready. Many farms combine a visit with a corn maze or other fall activities once pumpkin season arrives.',
  mountain: 'Call ahead to confirm timing, since Mountain West farms often open later than lower-elevation regions given the shorter growing season. Dress for cool mornings even in summer at higher elevations.',
  'south-central': 'Plan around the region\'s heat — early spring and mid-to-late fall tend to be the most comfortable times to visit u-pick farms in Texas, Oklahoma, and Louisiana.',
  pacific: 'California\'s long season means less time pressure than elsewhere, but coastal farms can still get busy on weekends. In Oregon and Washington, check ahead since a wet spring can shift opening dates.',
  southwest: 'Arizona\'s cooler-season picking means dressing warmer than you\'d expect for a desert visit. Hawaii farms are less common, so calling ahead to confirm hours is especially useful.',
};

// ---------- U-Pick Farms page generator ----------

function generateUPickFarmsPage({ city, state, code, imageIndex }) {
  const citySlug = slugify(city);
  const stateSlug = slugify(state);
  const urlSlug = `u-pick-farms-near-${citySlug}-${stateSlug}`;
  const canonicalUrl = `https://orchards-nearme.com/find/${urlSlug}`;
  const locationCount = CATEGORY_STATE_COUNTS['u-pick-farms'][state] || 0;
  const titleTag = `U-Pick Farms Near ${city}, ${state} | ${locationCount} Locations`;
  const h1 = `U-Pick Farms Near ${city}, ${state} - ${locationCount} Locations`;
  const desc = `There are ${locationCount} u-pick farm locations near ${city}, ${state}. Browse all u-pick farms and orchards on an interactive map. Search, filter and sort by ZIP code to find the closest location.`;
  const resultsHeading = `U-Pick Farms Near ${city}, ${code}`;
  const relatedLinks = relatedLinksHtml('u-pick-farms', citySlug, stateSlug, city, state);

  const capital = capitals.find(c => c.city === city);
  const regionKey = capital ? capital.region : undefined;
  const regionData = uPickFarmsRegion[regionKey];
  const seasonText = uPickFarmsSeason[regionKey];
  const tips = uPickFarmsTips[regionKey];
  const regionLabel = regionLabels[regionKey] || 'the region';

  const intro = `${city} sits within ${regionLabel}, giving visitors access to a range of u-pick farms and orchards growing everything from berries and stone fruit to apples and pumpkins depending on the season. Whether you're looking for a single afternoon outing or planning multiple visits across the year, the farms near ${city}, ${state} offer a genuine hands-on harvest experience.`;

  const seasonH2 = `Best Time to Visit a U-Pick Farm Near ${city}`;
  const tipsH2 = `Tips for Your ${city} U-Pick Farm Visit`;
  const mainH2 = `U-Pick Farms Near ${city}: What You Need to Know`;

  const filterChips = `<button class="filter-chip" data-cat="all">All Listings</button>
          <button class="filter-chip active" data-cat="u-pick-farms">U-Pick Farms</button>
          <button class="filter-chip" data-cat="Orchard">Orchards</button>`;

  const image = U_PICK_FARM_IMAGES[imageIndex % U_PICK_FARM_IMAGES.length];
  const imageAlt = `${image.alt} near ${city}, ${state}`;
  const ogImageTag = `\n  <meta property="og:image" content="https://orchards-nearme.com/images/${image.dir}/${image.file}" />`;

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
  <title>${titleTag}</title>
  <meta name="description" content="${desc}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${titleTag}" />
  <meta property="og:description" content="Find u-pick farms near ${city}, ${state} on an interactive map." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonicalUrl}" />${ogImageTag}

  <link rel="icon" href="/logo.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="/vendor/leaflet/leaflet.css" />
  <link rel="stylesheet" href="/css/style.css" />
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9332749804326149" crossorigin="anonymous"></script>
</head>
<body>
  <a class="skip-link" href="#find">Skip to map</a>
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
        <a href="/find" class="cta">Find</a>
      </nav>
    </div>
  </header>

  <main class="find-page-full">
    <div class="find-stage">
      <h1 class="sr-only">${h1}</h1>
      <p class="find-page-desc sr-only">Discover u-pick farms and orchards near ${city}, ${state}. Search by ZIP code to find the closest one, check ratings, and read real visitor reviews before you go.</p>
      <div id="map" role="application" aria-label="Map of u-pick farms near ${city}, ${state}"></div>

      <div class="find-topbar">
        <form class="search-form" id="searchForm">
          <input type="text" id="zipInput" inputmode="numeric" placeholder="Enter your ZIP code (e.g. 05346)" aria-label="Search by ZIP code" />
          <button type="submit" class="btn">Search</button>
          <p id="zipError" hidden class="zip-error-msg" role="alert"></p>
        </form>
        <div class="filters-wrap">
          <button type="button" class="filters-toggle" id="filtersToggle" aria-haspopup="true" aria-expanded="false" aria-controls="filters">
            <span class="filters-toggle-icon" aria-hidden="true">&#9776;</span> Filters
          </button>
          <div class="filters" id="filters" role="group" aria-label="Filter by type" data-default-filter="u-pick-farms" data-default-state="${state}">
            ${filterChips}
          </div>
        </div>
        <select class="state-select" id="stateSelect" aria-label="Filter by state">
          <option value="all">All states</option>
        </select>
        <div class="find-legend-float" aria-label="Map key">
          <span class="map-legend-item"><span class="map-legend-dot orchard"></span>Orchard</span>
          <span class="map-legend-item"><span class="map-legend-dot farm"></span>Farm</span>
          <span class="map-legend-item"><span class="map-legend-dot garden"></span>Garden Center</span>
        </div>
      </div>

      <button type="button" class="find-layers-btn" id="layersToggle" aria-pressed="false">
        <span aria-hidden="true">🛰️</span> Satellite
      </button>

      <div class="find-strip">
        <div class="find-strip-head">
          <h2>${resultsHeading}</h2>
          <span class="results-count" id="resultsCount">Loading...</span>
        </div>
        <div class="cards cards-horizontal" id="cards"></div>
      </div>
    </div>

    <section class="seo-content">
      <div class="container">
        <article class="seo-article">

          <h2>${mainH2}</h2>
          <p>${intro}</p>

          <h2>${regionData.h2}</h2>
          <p>${regionData.body}</p>

          <h2>${seasonH2}</h2>
          <p>${seasonText}</p>

          <h2>${tipsH2}</h2>
          <p>${tips}</p>

        </article>
      </div>
    </section>

    ${relatedLinks}
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

  <script src="/vendor/leaflet/leaflet.js"></script>
  <script src="/js/app.js"></script>
</body>
</html>
`;
}

// ---------- Strawberry patch / pumpkin patch page generator ----------

function generatePatchPage({ city, state, code, patchSlug, patchLabel, imageSrc, imageAlt, regionData: regionMap, seasonData, tipsData }) {
  const citySlug = slugify(city);
  const stateSlug = slugify(state);
  const urlSlug = `${patchSlug}-near-${citySlug}-${stateSlug}`;
  const canonicalUrl = `https://orchards-nearme.com/find/${urlSlug}`;
  const locationCount = CATEGORY_STATE_COUNTS[patchSlug][state] || 0;
  const titleTag = `${patchLabel} Near ${city}, ${state} | ${locationCount} Locations`;
  const h1 = `${patchLabel} Near ${city}, ${state} - ${locationCount} Locations`;
  const desc = `There are ${locationCount} ${patchLabel.toLowerCase()} locations near ${city}, ${state}. Browse all u-pick farms and orchards on an interactive map. Search, filter and sort by ZIP code to find the closest location.`;
  const resultsHeading = `${patchLabel} Near ${city}, ${code}`;
  const relatedLinks = relatedLinksHtml(patchSlug, citySlug, stateSlug, city, state);

  const capital = capitals.find(c => c.city === city);
  const regionKey = capital ? capital.region : undefined;
  const regionData = regionMap[regionKey];
  const seasonText = seasonData[regionKey];
  const tips = tipsData[regionKey];
  const regionLabel = regionLabels[regionKey] || 'the region';

  const intro = `${city} sits within ${regionLabel}, giving visitors easy access to ${patchLabel.toLowerCase()}s that reflect the area's growing conditions and picking calendar. Whether you're looking for a weekend outing with the family or a quick stop to stock up, the farms near ${city}, ${state} offer a genuine u-pick experience with real seasonal produce.`;

  const seasonH2 = `Best Time to Visit a ${patchLabel} Near ${city}`;
  const tipsH2 = `Tips for Your ${city} ${patchLabel} Visit`;
  const mainH2 = `${patchLabel}s Near ${city}: What You Need to Know`;

  const filterChips = `<button class="filter-chip" data-cat="all">All Listings</button>
          <button class="filter-chip active" data-cat="${patchSlug}">${patchLabel}</button>
          <button class="filter-chip" data-cat="Farm">Farms</button>`;

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
  <title>${titleTag}</title>
  <meta name="description" content="${desc}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${titleTag}" />
  <meta property="og:description" content="Find a ${patchLabel.toLowerCase()} near ${city}, ${state} on an interactive map." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:image" content="https://orchards-nearme.com${imageSrc}" />

  <link rel="icon" href="/logo.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="/vendor/leaflet/leaflet.css" />
  <link rel="stylesheet" href="/css/style.css" />
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9332749804326149" crossorigin="anonymous"></script>
</head>
<body>
  <a class="skip-link" href="#find">Skip to map</a>
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
        <a href="/find" class="cta">Find</a>
      </nav>
    </div>
  </header>

  <main class="find-page-full">
    <div class="find-stage">
      <h1 class="sr-only">${h1}</h1>
      <p class="find-page-desc sr-only">Discover a ${patchLabel.toLowerCase()} near ${city}, ${state}. Search by ZIP code to find the closest farm, check ratings, and read real visitor reviews before you go.</p>
      <div id="map" role="application" aria-label="Map of ${patchLabel.toLowerCase()}s near ${city}, ${state}"></div>

      <div class="find-topbar">
        <form class="search-form" id="searchForm">
          <input type="text" id="zipInput" inputmode="numeric" placeholder="Enter your ZIP code (e.g. 05346)" aria-label="Search by ZIP code" />
          <button type="submit" class="btn">Search</button>
          <p id="zipError" hidden class="zip-error-msg" role="alert"></p>
        </form>
        <div class="filters-wrap">
          <button type="button" class="filters-toggle" id="filtersToggle" aria-haspopup="true" aria-expanded="false" aria-controls="filters">
            <span class="filters-toggle-icon" aria-hidden="true">&#9776;</span> Filters
          </button>
          <div class="filters" id="filters" role="group" aria-label="Filter by type" data-default-filter="${patchSlug}" data-default-state="${state}">
            ${filterChips}
          </div>
        </div>
        <select class="state-select" id="stateSelect" aria-label="Filter by state">
          <option value="all">All states</option>
        </select>
        <div class="find-legend-float" aria-label="Map key">
          <span class="map-legend-item"><span class="map-legend-dot orchard"></span>Orchard</span>
          <span class="map-legend-item"><span class="map-legend-dot farm"></span>Farm</span>
          <span class="map-legend-item"><span class="map-legend-dot garden"></span>Garden Center</span>
        </div>
      </div>

      <button type="button" class="find-layers-btn" id="layersToggle" aria-pressed="false">
        <span aria-hidden="true">🛰️</span> Satellite
      </button>

      <div class="find-strip">
        <div class="find-strip-head">
          <h2>${resultsHeading}</h2>
          <span class="results-count" id="resultsCount">Loading...</span>
        </div>
        <div class="cards cards-horizontal" id="cards"></div>
      </div>
    </div>

    <section class="seo-content">
      <div class="container">
        <article class="seo-article">

          <h2>${mainH2}</h2>
          <p>${intro}</p>

          <h2>${regionData.h2}</h2>
          <p>${regionData.body}</p>

          <h2>${seasonH2}</h2>
          <p>${seasonText}</p>

          <h2>${tipsH2}</h2>
          <p>${tips}</p>

        </article>
      </div>
    </section>

    ${relatedLinks}
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

  <script src="/vendor/leaflet/leaflet.js"></script>
  <script src="/js/app.js"></script>
</body>
</html>
`;
}

// ---------- Garden center page generator ----------

function generateGardenCenterPage({ city, state, code }) {
  const citySlug = slugify(city);
  const stateSlug = slugify(state);
  const urlSlug = `garden-centers-near-${citySlug}-${stateSlug}`;
  const canonicalUrl = `https://orchards-nearme.com/find/${urlSlug}`;
  const locationCount = CATEGORY_STATE_COUNTS['garden-centers'][state] || 0;
  const titleTag = `Garden Centers Near ${city}, ${state} | ${locationCount} Locations`;
  const h1 = `Garden Centers Near ${city}, ${state} - ${locationCount} Locations`;
  const desc = `There are ${locationCount} garden center locations near ${city}, ${state}. Browse all garden centers and plant nurseries on an interactive map. Search, filter and sort by ZIP code to find the closest location.`;
  const resultsHeading = `Garden Centers Near ${city}, ${code}`;
  const relatedLinks = relatedLinksHtml('garden-centers', citySlug, stateSlug, city, state);

  const capital = capitals.find(c => c.city === city);
  const regionKey = capital ? capital.region : undefined;
  const regionData = gardenCenterRegion[regionKey];
  const intro = gardenCenterIntros[city];
  const tips = gardenCenterTips[city];
  const seasonText = gardenCenterSeason[state];

  const seasonH2 = `Best Time to Visit a Garden Center Near ${city}`;
  const tipsH2 = `Tips for Your ${city} Garden Center Visit`;
  const mainH2 = `Garden Centers Near ${city}: What You Need to Know`;

  const filterChips = `<button class="filter-chip" data-cat="all">All Listings</button>
          <button class="filter-chip active" data-cat="Garden Center">Garden Centers</button>
          <button class="filter-chip" data-cat="Orchard">Orchards</button>`;

  const image = GARDEN_CENTER_IMAGE;
  const imageAlt = `${image.alt} near ${city}, ${state}`;
  const ogImageTag = `\n  <meta property="og:image" content="https://orchards-nearme.com/images/${image.dir}/${image.file}" />`;

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
  <title>${titleTag}</title>
  <meta name="description" content="${desc}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${titleTag}" />
  <meta property="og:description" content="Find garden centers near ${city}, ${state} on an interactive map." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonicalUrl}" />${ogImageTag}

  <link rel="icon" href="/logo.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="/vendor/leaflet/leaflet.css" />
  <link rel="stylesheet" href="/css/style.css" />
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9332749804326149" crossorigin="anonymous"></script>
</head>
<body>
  <a class="skip-link" href="#find">Skip to map</a>
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
        <a href="/find" class="cta">Find</a>
      </nav>
    </div>
  </header>

  <main class="find-page-full">
    <div class="find-stage">
      <h1 class="sr-only">${h1}</h1>
      <p class="find-page-desc sr-only">Discover garden centers near ${city}, ${state}. Search by ZIP code to find the closest nursery, check ratings, and read real visitor reviews before you go.</p>
      <div id="map" role="application" aria-label="Map of garden centers near ${city}, ${state}"></div>

      <div class="find-topbar">
        <form class="search-form" id="searchForm">
          <input type="text" id="zipInput" inputmode="numeric" placeholder="Enter your ZIP code (e.g. 05346)" aria-label="Search by ZIP code" />
          <button type="submit" class="btn">Search</button>
          <p id="zipError" hidden class="zip-error-msg" role="alert"></p>
        </form>
        <div class="filters-wrap">
          <button type="button" class="filters-toggle" id="filtersToggle" aria-haspopup="true" aria-expanded="false" aria-controls="filters">
            <span class="filters-toggle-icon" aria-hidden="true">&#9776;</span> Filters
          </button>
          <div class="filters" id="filters" role="group" aria-label="Filter by type" data-default-filter="Garden Center" data-default-state="${state}">
            ${filterChips}
          </div>
        </div>
        <select class="state-select" id="stateSelect" aria-label="Filter by state">
          <option value="all">All states</option>
        </select>
        <div class="find-legend-float" aria-label="Map key">
          <span class="map-legend-item"><span class="map-legend-dot orchard"></span>Orchard</span>
          <span class="map-legend-item"><span class="map-legend-dot farm"></span>Farm</span>
          <span class="map-legend-item"><span class="map-legend-dot garden"></span>Garden Center</span>
        </div>
      </div>

      <button type="button" class="find-layers-btn" id="layersToggle" aria-pressed="false">
        <span aria-hidden="true">🛰️</span> Satellite
      </button>

      <div class="find-strip">
        <div class="find-strip-head">
          <h2>${resultsHeading}</h2>
          <span class="results-count" id="resultsCount">Loading...</span>
        </div>
        <div class="cards cards-horizontal" id="cards"></div>
      </div>
    </div>

    <section class="seo-content">
      <div class="container">
        <article class="seo-article">

          <h2>${mainH2}</h2>
          <p>${intro}</p>

          <h2>${regionData.h2}</h2>
          <p>${regionData.body}</p>

          <h2>${seasonH2}</h2>
          <p>${seasonText}</p>

          <h2>${tipsH2}</h2>
          <p>${tips}</p>

        </article>
      </div>
    </section>

    ${relatedLinks}
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

  <script src="/vendor/leaflet/leaflet.js"></script>
  <script src="/js/app.js"></script>
</body>
</html>
`;
}

// ---------- Main execution ----------

const findDir = path.join(__dirname, '..', 'find');
if (!fs.existsSync(findDir)) fs.mkdirSync(findDir, { recursive: true });

const allUrls = [];

const fruits = [
  { fruitSlug: 'apple-picking', fruitLabel: 'Apple Picking' },
  { fruitSlug: 'cherry-picking', fruitLabel: 'Cherry Picking' },
  { fruitSlug: 'berry-picking', fruitLabel: 'Berry Picking' },
  { fruitSlug: 'peach-picking', fruitLabel: 'Peach Picking' },
  { fruitSlug: 'blueberry-picking', fruitLabel: 'Blueberry Picking' },
];

for (const fruit of fruits) {
  capitals.forEach((cap, imageIndex) => {
    const citySlug = slugify(cap.city);
    const stateSlug = slugify(cap.state);
    const filename = `${fruit.fruitSlug}-orchards-near-${citySlug}-${stateSlug}.html`;
    const filePath = path.join(findDir, filename);
    fs.writeFileSync(filePath, generatePage({ ...cap, ...fruit, imageIndex }), 'utf8');
    const url = `https://orchards-nearme.com/find/${fruit.fruitSlug}-orchards-near-${citySlug}-${stateSlug}`;
    allUrls.push(url);
    console.log('Generated:', filename);
  });
}

for (const cap of capitals) {
  const citySlug = slugify(cap.city);
  const stateSlug = slugify(cap.state);
  const filename = `garden-centers-near-${citySlug}-${stateSlug}.html`;
  const filePath = path.join(findDir, filename);
  fs.writeFileSync(filePath, generateGardenCenterPage(cap), 'utf8');
  const url = `https://orchards-nearme.com/find/garden-centers-near-${citySlug}-${stateSlug}`;
  allUrls.push(url);
  console.log('Generated:', filename);
}

const patches = [
  {
    patchSlug: 'strawberry-patch',
    patchLabel: 'Strawberry Patch',
    imageSrc: '/images/find/strawberry-field-rows.jpg',
    imageAlt: 'Rows of strawberry plants in a u-pick strawberry patch',
    regionData: strawberryPatchRegion,
    seasonData: strawberryPatchSeason,
    tipsData: strawberryPatchTips,
  },
  {
    patchSlug: 'pumpkin-patch',
    patchLabel: 'Pumpkin Patch',
    imageSrc: '/images/find/pumpkin-patch-field.jpg',
    imageAlt: 'Pumpkins growing in a fall pumpkin patch field',
    regionData: pumpkinPatchRegion,
    seasonData: pumpkinPatchSeason,
    tipsData: pumpkinPatchTips,
  },
];

for (const patch of patches) {
  for (const cap of capitals) {
    const citySlug = slugify(cap.city);
    const stateSlug = slugify(cap.state);
    const filename = `${patch.patchSlug}-near-${citySlug}-${stateSlug}.html`;
    const filePath = path.join(findDir, filename);
    const imageAlt = `${patch.imageAlt} near ${cap.city}, ${cap.state}`;
    fs.writeFileSync(filePath, generatePatchPage({ ...cap, ...patch, imageAlt }), 'utf8');
    const url = `https://orchards-nearme.com/find/${patch.patchSlug}-near-${citySlug}-${stateSlug}`;
    allUrls.push(url);
    console.log('Generated:', filename);
  }
}

capitals.forEach((cap, imageIndex) => {
  const citySlug = slugify(cap.city);
  const stateSlug = slugify(cap.state);
  const filename = `u-pick-farms-near-${citySlug}-${stateSlug}.html`;
  const filePath = path.join(findDir, filename);
  fs.writeFileSync(filePath, generateUPickFarmsPage({ ...cap, imageIndex }), 'utf8');
  const url = `https://orchards-nearme.com/find/u-pick-farms-near-${citySlug}-${stateSlug}`;
  allUrls.push(url);
  console.log('Generated:', filename);
});

for (const categoryValue of Object.keys(STATE_CATEGORY_CONFIG)) {
  capitals.forEach((cap, imageIndex) => {
    const stateSlug = slugify(cap.state);
    const config = STATE_CATEGORY_CONFIG[categoryValue];
    const filename = `${config.slugPrefix}${stateSlug}.html`;
    const filePath = path.join(findDir, filename);
    fs.writeFileSync(filePath, generateStateCategoryPage({ state: cap.state, code: cap.code, capitalCity: cap.city, categoryValue, imageIndex }), 'utf8');
    const url = `https://orchards-nearme.com/find/${config.slugPrefix}${stateSlug}`;
    allUrls.push(url);
    console.log('Generated:', filename);
  });
}

const hayrideCapitals = capitals.filter(cap => HAYRIDE_STATES.includes(cap.state));
hayrideCapitals.forEach((cap, imageIndex) => {
  const citySlug = slugify(cap.city);
  const stateSlug = slugify(cap.state);
  const filename = `hayrides-near-${citySlug}-${stateSlug}.html`;
  const filePath = path.join(findDir, filename);
  fs.writeFileSync(filePath, generateHayridesPage({ ...cap, imageIndex }), 'utf8');
  const url = `https://orchards-nearme.com/find/hayrides-near-${citySlug}-${stateSlug}`;
  allUrls.push(url);
  console.log('Generated:', filename);
});

console.log(`\nDone. Generated ${allUrls.length} pages.`);
