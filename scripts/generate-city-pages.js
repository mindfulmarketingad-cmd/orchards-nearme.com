#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-');
}

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

// ---------- Page generator ----------

function generatePage({ city, state, code, fruit, fruitSlug, fruitLabel }) {
  const citySlug = slugify(city);
  const stateSlug = slugify(state);
  const urlSlug = `${fruitSlug}-orchards-near-${citySlug}-${stateSlug}`;
  const canonicalUrl = `https://orchards-nearme.com/find/${urlSlug}`;
  const titleTag = `${fruitLabel} Orchards Near ${city}, ${state} | Orchards Near Me`;
  const h1 = `${fruitLabel} Orchards Near ${city} ${state}`;
  const desc = `Find ${fruitLabel.toLowerCase()} orchards near ${city}, ${state}. Browse pick-your-own farms and orchards on an interactive map. Search by ZIP code to find the closest location.`;
  const resultsHeading = `${fruitLabel} Near ${city}, ${code}`;

  const introsByFruit = { 'apple-picking': appleIntros, 'cherry-picking': cherryIntros, 'berry-picking': berryIntros };
  const tipsByFruit = { 'apple-picking': appleTips, 'cherry-picking': cherryTips, 'berry-picking': berryTips };
  const regionByFruit = { 'apple-picking': appleRegion, 'cherry-picking': cherryRegion, 'berry-picking': berryRegion };
  const seasonByFruit = { 'apple-picking': appleSeason, 'cherry-picking': cherrySeason, 'berry-picking': berrySeason };
  const regionKeyField = { 'apple-picking': 'region', 'cherry-picking': 'cherryRegion', 'berry-picking': 'region' };

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
          <button class="filter-chip" data-cat="Orchard">All Orchard Types</button>
          <button class="filter-chip" data-cat="Farm">Farms</button>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${titleTag}</title>
  <meta name="description" content="${desc}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${titleTag}" />
  <meta property="og:description" content="Find ${fruitLabel.toLowerCase()} orchards near ${city}, ${state} on an interactive map." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonicalUrl}" />

  <link rel="icon" href="/logo.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="/vendor/leaflet/leaflet.css" />
  <link rel="stylesheet" href="/vendor/leaflet/MarkerCluster.css" />
  <link rel="stylesheet" href="/vendor/leaflet/MarkerCluster.Default.css" />
  <link rel="stylesheet" href="/css/style.css" />
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2173008413459742" crossorigin="anonymous"></script>
</head>
<body>
  <header class="site-header">
    <div class="container">
      <a class="brand" href="/" aria-label="Orchards Near Me home">
        <img src="/logo.svg" alt="" class="logo-icon" />
        Orchards Near Me
      </a>
      <nav class="main-nav" aria-label="Primary">
        <a href="/">Home</a>
        <a href="/about.html">About</a>
        <a href="/find" class="cta">Find</a>
      </nav>
    </div>
  </header>

  <main>
    <section class="hero">
      <div class="container">
        <h1>${h1}</h1>
        <p>Discover ${fruitLabel.toLowerCase()} orchards near ${city}, ${state}. Search by ZIP code to find the closest orchard, check ratings, and read real visitor reviews before you go.</p>
        <div class="pills">
          <span>${fruitLabel}</span>
          <span>Pick Your Own</span>
          <span>${state}</span>
        </div>
      </div>
    </section>

    <section class="controls" id="find">
      <div class="container">
        <form class="search-form" id="searchForm">
          <input type="text" id="zipInput" inputmode="numeric" placeholder="Enter your ZIP code (e.g. 05346)" aria-label="Search by ZIP code" />
          <button type="submit" class="btn">Search</button>
          <button type="button" class="btn btn-ghost" id="resetBtn">Reset</button>
        </form>
        <div class="filters" id="filters" role="group" aria-label="Filter by type" data-default-filter="${defaultFilter}" data-default-state="${state}">
          ${filterChips}
        </div>
        <select class="state-select" id="stateSelect" aria-label="Filter by state">
          <option value="all">All states</option>
        </select>
      </div>
    </section>

    <div class="container">
      <div class="view-toggle" id="viewToggle">
        <button class="active" data-view="map">Map</button>
        <button data-view="list">List</button>
      </div>
      <div class="find-layout">
        <div class="results-col">
          <div class="results-head">
            <h2>${resultsHeading}</h2>
            <span class="results-count" id="resultsCount">Loading...</span>
          </div>
          <div class="cards" id="cards"></div>
        </div>
        <div class="map-col">
          <div id="map" role="application" aria-label="Map of ${fruitLabel.toLowerCase()} orchards near ${city}, ${state}"></div>
          <div class="map-legend" aria-label="Map key">
            <span class="map-legend-item"><span class="map-legend-dot orchard"></span>Orchard</span>
            <span class="map-legend-item"><span class="map-legend-dot farm"></span>Farm</span>
            <span class="map-legend-item"><span class="map-legend-dot garden"></span>Garden Center</span>
          </div>
        </div>
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
  </main>

  <footer class="site-footer">
    <div class="container">
      <ul class="footer-nav">
        <li><a href="/">Home</a></li>
        <li><a href="/about.html">About</a></li>
        <li><a href="/contact.html">Contact</a></li>
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
  <script src="/vendor/leaflet/leaflet.markercluster.js"></script>
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
];

for (const fruit of fruits) {
  for (const cap of capitals) {
    const citySlug = slugify(cap.city);
    const stateSlug = slugify(cap.state);
    const filename = `${fruit.fruitSlug}-orchards-near-${citySlug}-${stateSlug}.html`;
    const filePath = path.join(findDir, filename);
    fs.writeFileSync(filePath, generatePage({ ...cap, ...fruit }), 'utf8');
    const url = `https://orchards-nearme.com/find/${fruit.fruitSlug}-orchards-near-${citySlug}-${stateSlug}`;
    allUrls.push(url);
    console.log('Generated:', filename);
  }
}

console.log(`\nDone. Generated ${allUrls.length} pages.`);
