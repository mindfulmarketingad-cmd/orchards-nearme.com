#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'blog');

const STATES = [
  {
    slug: 'alabama', name: 'Alabama', capital: 'Montgomery', capitalSlug: 'montgomery',
    peak: 'late July through August',
    regions: 'the Chilton County area south of Birmingham, the Appalachian foothills in Cleburne and Calhoun counties, and scattered farms near Huntsville',
    varieties: 'Gala, Lodi, Summer Champion, and Granny Smith',
    intro: 'Apple picking season in Alabama runs from late July through August, driven by the state\'s warm climate that pushes harvest weeks ahead of most of the country.',
    seasonDetail: 'Alabama\'s heat accelerates ripening — Lodi and Gala varieties are often ready by late July, while later-season types like Granny Smith extend picking into August and occasionally early September in the higher elevations near Anniston and Gadsden.',
    tip: 'Go early in the morning when the heat is manageable, and call ahead to confirm which varieties are currently ripe.',
  },
  {
    slug: 'alaska', name: 'Alaska', capital: 'Juneau', capitalSlug: 'juneau',
    peak: 'August through September',
    regions: 'the Matanuska-Susitna Valley north of Anchorage, the Kenai Peninsula, and a handful of farms near Fairbanks',
    varieties: 'Rescue, Norland, Haralson, and other cold-hardy varieties bred for short growing seasons',
    intro: 'Apple picking season in Alaska runs from August through September, concentrated in the Matanuska-Susitna Valley where the legendary long summer daylight hours produce surprisingly sweet fruit.',
    seasonDetail: 'Alaska\'s growing season is short but intense — 18-hour summer days accelerate sugar development in cold-hardy varieties. The Mat-Su Valley, often called Alaska\'s salad bowl, is home to most of the state\'s u-pick orchards, with harvest typically peaking in late August.',
    tip: 'Alaska orchards often have limited picking days, so check ahead and plan your trip for late August when most varieties are simultaneously ready.',
  },
  {
    slug: 'arizona', name: 'Arizona', capital: 'Phoenix', capitalSlug: 'phoenix',
    peak: 'September through November',
    regions: 'the high-elevation areas around Sedona, Oak Creek Canyon, Wilcox in Cochise County, and the Prescott area',
    varieties: 'Fuji, Gala, Honeycrisp, Granny Smith, and Pink Lady',
    intro: 'Apple picking season in Arizona runs from September through November at high-elevation orchards where the mountain climate is cool enough to grow the fruit successfully.',
    seasonDetail: 'At elevations above 4,000 feet — in areas like Wilcox, Sedona, and Prescott — Arizona growers have carved out genuine apple country. Wilcox in particular produces commercially significant quantities of Fuji and Gala apples, with pick-your-own operations available in fall. The longer, milder autumn at altitude allows varieties like Honeycrisp and Pink Lady to develop full flavor.',
    tip: 'Wilcox is about 75 miles southeast of Tucson and hosts an Apple Annie\'s Orchard — confirm hours before making the drive as the season can be variable.',
  },
  {
    slug: 'arkansas', name: 'Arkansas', capital: 'Little Rock', capitalSlug: 'little-rock',
    peak: 'late August through October',
    regions: 'the Ozark Mountains in the northwest, Washington and Benton counties near Fayetteville, and the Arkansas River Valley',
    varieties: 'Arkansas Black (native heirloom), Jonathan, Fuji, Gala, and Cortland',
    intro: 'Apple picking season in Arkansas runs from late August through October, with the Ozark Mountains in the northwest producing some of the state\'s best pick-your-own fruit.',
    seasonDetail: 'Arkansas has a genuine apple heritage — the Arkansas Black apple is a heirloom variety that originated in Benton County in the 1800s and is still grown by specialty orchards across the state. Washington County near Fayetteville has the highest concentration of u-pick farms, with the Ozark elevation providing the cool nights needed for proper apple development.',
    tip: 'Look specifically for orchards that grow Arkansas Black — it is one of the few apple varieties you genuinely cannot find at a grocery store, and it is worth seeking out.',
  },
  {
    slug: 'california', name: 'California', capital: 'Sacramento', capitalSlug: 'sacramento',
    peak: 'August through November',
    regions: 'the Sebastopol area in Sonoma County, Apple Hill in El Dorado County near Placerville, Julian in San Diego County, and the Central Coast',
    varieties: 'Gravenstein, Fuji, Honeycrisp, Pink Lady, Braeburn, and heirloom varieties',
    intro: 'Apple picking season in California runs from August through November depending on region, with Apple Hill near Placerville and Sebastopol in Sonoma County offering the longest and most varied picking experiences in the state.',
    seasonDetail: 'California\'s apple geography is diverse. Sebastopol in Sonoma County is famous for Gravenstein apples — a thin-skinned, aromatic variety harvested in August that has essentially disappeared from commercial production everywhere else. Apple Hill east of Sacramento spans more than 50 farms at elevations between 2,000 and 3,500 feet, with picking that runs from late July through Thanksgiving. Julian in Southern California offers a desert-highland experience unique to any orchard in the country.',
    tip: 'Apple Hill gets very crowded on fall weekends — go on a weekday or arrive before 10am to get the best pick and avoid the parking backup.',
  },
  {
    slug: 'colorado', name: 'Colorado', capital: 'Denver', capitalSlug: 'denver',
    peak: 'late August through October',
    regions: 'Palisade on the Western Slope, the Roaring Fork Valley near Basalt, the Boulder-Longmont foothills, and Paonia in Delta County',
    varieties: 'Honeycrisp, Fuji, Jonagold, Gala, and McIntosh',
    intro: 'Apple picking season in Colorado runs from late August through October, with the orchards of Palisade on the Western Slope producing some of the most flavorful fruit in the Rocky Mountain region.',
    seasonDetail: 'Colorado\'s orchard country is dominated by the Western Slope, where the combination of warm days, cold nights, and low humidity creates exceptional flavor development in apples. Palisade is best known for peaches but hosts several apple orchards that follow the peach harvest. The Roaring Fork Valley near Aspen and Basalt has a number of smaller u-pick operations that get less traffic despite producing outstanding fruit.',
    tip: 'The altitude in Colorado\'s orchards can mean rapid weather changes — bring layers even in September, and check orchard websites for road conditions in October.',
  },
  {
    slug: 'connecticut', name: 'Connecticut', capital: 'Hartford', capitalSlug: 'hartford',
    peak: 'mid-August through October',
    regions: 'the Connecticut River Valley, Litchfield County in the northwest, and farms across Middlesex and New Haven counties',
    varieties: 'Zestar, McIntosh, Cortland, Macoun, Honeycrisp, and Empire',
    intro: 'Apple picking season in Connecticut runs from mid-August through October, with the Connecticut River Valley and Litchfield Hills hosting dozens of pick-your-own orchards within easy reach of Hartford and New Haven.',
    seasonDetail: 'Connecticut is one of the most orchard-dense states in the Northeast, with farms spread across most of the state\'s eight counties. The Litchfield Hills in the northwest offer particularly scenic picking with the rolling terrain and early foliage that arrives in late September. Macoun, a New York-bred variety that thrives in New England\'s cool climate, is a regional favorite that hits its peak in October.',
    tip: 'Connecticut orchards are very popular on October weekends — book ahead if any orchard requires reservations, and consider visiting in late September for smaller crowds and a wider variety selection.',
  },
  {
    slug: 'delaware', name: 'Delaware', capital: 'Dover', capitalSlug: 'dover',
    peak: 'mid-August through September',
    regions: 'Kent County in central Delaware and the farmland surrounding Dover and Milford',
    varieties: 'Gala, Honeycrisp, Fuji, and Cortland',
    intro: 'Apple picking season in Delaware runs from mid-August through September, with the state\'s small but active agricultural corridor in Kent County offering pick-your-own opportunities within a short drive of Dover.',
    seasonDetail: 'Delaware is a small state with a limited but genuine orchard tradition. The farmland of Kent and Sussex counties has historically grown tree fruit alongside the grain and vegetable crops more commonly associated with the region. A handful of u-pick operations open each fall, typically running Gala and Honeycrisp harvest through late September.',
    tip: 'Delaware\'s orchards are few and can fill up quickly on fall weekends — check listings and call ahead to confirm availability before making the trip.',
  },
  {
    slug: 'florida', name: 'Florida', capital: 'Tallahassee', capitalSlug: 'tallahassee',
    peak: 'June through July',
    regions: 'North Florida near the Georgia border, Ocala, and a handful of farms in the central highlands near Gainesville',
    varieties: 'TropicSweet, Anna, Dorsett Golden, and other low-chill varieties',
    intro: 'Apple picking season in Florida runs from June through July, limited to special low-chill varieties developed specifically for warm climates with minimal winter cold.',
    seasonDetail: 'Standard apples require hundreds of hours of winter temperatures below 45°F to break dormancy and produce fruit — Florida\'s winters simply do not provide this. However, breeders have developed low-chill varieties like Anna, Dorsett Golden, and TropicSweet that need far fewer cold hours. A small number of Florida farms grow these varieties, mostly in North Florida where winters are marginally cooler. The season is brief and the experience is unlike traditional apple picking elsewhere.',
    tip: 'If you find a Florida orchard offering u-pick apples in early summer, it is worth the trip as a genuinely unusual experience — but call first because production can vary significantly year to year based on winter temperatures.',
  },
  {
    slug: 'georgia', name: 'Georgia', capital: 'Atlanta', capitalSlug: 'atlanta',
    peak: 'late June through August',
    regions: 'Ellijay in Gilmer County (Georgia\'s apple capital), the Blue Ridge area, Dawsonville, and the North Georgia mountains',
    varieties: 'Gala, Red Delicious, Fuji, Jonagold, Stayman, and Winesap',
    intro: 'Apple picking season in Georgia runs from late June through August, with Ellijay — known as the apple capital of Georgia — producing the majority of the state\'s u-pick fruit in the North Georgia mountains.',
    seasonDetail: 'Georgia\'s apple country is concentrated in the Blue Ridge Mountain region north of Atlanta. Ellijay in Gilmer County hosts more apple orchards than anywhere else in the state, and the town celebrates with an Apple Festival each October. The mountain elevation provides the cold winters that apples need, while warm summers push the harvest earlier than northern states — Galas are often ready by early July, with heavier-bearing varieties following through August.',
    tip: 'Go on a weekday if you can — Ellijay\'s orchards draw large weekend crowds from Atlanta, and the drive up State Route 515 can be slow on fall Saturdays.',
  },
  {
    slug: 'hawaii', name: 'Hawaii', capital: 'Honolulu', capitalSlug: 'honolulu',
    peak: 'year-round at high elevations',
    regions: 'the Kula area on Maui at elevations above 3,000 feet, and very limited farms on the Big Island near Waimea',
    varieties: 'Anna, Dorsett Golden, and experimental varieties bred for tropical conditions',
    intro: 'Apple growing in Hawaii is rare but possible at elevations above 3,000 feet, where Maui\'s upcountry region around Kula provides enough temperature variation to coax fruit from low-chill apple varieties year-round.',
    seasonDetail: 'Hawaii is genuinely unusual apple territory — most of the islands are simply too warm for apple trees to break dormancy and bear fruit reliably. However, the upcountry areas of Maui around Kula, where nights can dip into the 40s and 50s year-round, have seen success with Anna and Dorsett Golden varieties. Traditional pick-your-own orchards are extremely limited, but the few farms that do grow apples in Hawaii offer a one-of-a-kind tropical orchard experience.',
    tip: 'Do not expect a traditional mainland apple picking experience in Hawaii — check current listings to see what u-pick options exist, as availability changes frequently.',
  },
  {
    slug: 'idaho', name: 'Idaho', capital: 'Boise', capitalSlug: 'boise',
    peak: 'August through October',
    regions: 'the Emmett Valley in Gem County, the Treasure Valley near Boise, and the Teton Valley in eastern Idaho',
    varieties: 'Fuji, Honeycrisp, Gala, Jonagold, and Braeburn',
    intro: 'Apple picking season in Idaho runs from August through October, with the Emmett Valley in Gem County — known as the Gem of the Hills — producing some of the most commercially significant apple crops in the Pacific Northwest.',
    seasonDetail: 'Idaho is a serious apple-producing state whose output often goes unrecognized because much of the crop is processed rather than sold fresh. The Emmett Valley, just 30 miles north of Boise, has a long orchard tradition, with the town itself celebrating its Cherry Festival (and adjacent orchard season) each June. By August, apple picking opens in earnest across the valley floor and lower foothills, running through October as heavier varieties come in.',
    tip: 'The drive from Boise to Emmett along State Highway 16 passes through orchard country — you can often spot u-pick signs from the road in August and September.',
  },
  {
    slug: 'illinois', name: 'Illinois', capital: 'Springfield', capitalSlug: 'springfield',
    peak: 'September through October',
    regions: 'the Galena area in the northwest, the Shawnee Hills wine and orchard country in the south, and farms scattered across the central prairie belt',
    varieties: 'Honeycrisp, Jonathan, Cortland, Fuji, and Golden Delicious',
    intro: 'Apple picking season in Illinois runs from September through October, with orchards scattered from the rolling hills near Galena in the northwest to the Shawnee Hills in the south.',
    seasonDetail: 'Illinois is not often associated with apple country, but the state has a genuine orchard tradition, particularly in the glacially shaped hills of the northwest near Galena and along the rugged terrain of the Shawnee National Forest in the south. Apple Holler near Sturtevant is one of the state\'s largest and most visited u-pick operations, offering a full farm experience alongside the picking.',
    tip: 'Honeycrisp has become the most in-demand variety at Illinois orchards — it typically peaks in mid-September, and popular farms can run out of picking rows on busy weekends.',
  },
  {
    slug: 'indiana', name: 'Indiana', capital: 'Indianapolis', capitalSlug: 'indianapolis',
    peak: 'late August through October',
    regions: 'Brown County in the south-central hills, the Upland areas near Martinsville, and orchards scattered across the northern tier near South Bend',
    varieties: 'Zestar, Honeycrisp, Jonathan, McIntosh, and Fuji',
    intro: 'Apple picking season in Indiana runs from late August through October, with the rolling hills of Brown County and the surrounding south-central region offering the best concentration of pick-your-own orchards.',
    seasonDetail: 'Brown County, famous for its fall foliage and artist colony in Nashville, Indiana, also has several well-established apple orchards that draw visitors from Indianapolis and beyond each autumn. The combination of leaf-peeping and apple picking makes September and October weekends here particularly memorable. Earlier varieties like Zestar and Honeycrisp open the season in late August, followed by Jonathan and late-season types through October.',
    tip: 'Combine a Brown County apple picking trip with a visit to the Brown County State Park for a full fall day — the park\'s leaf color typically peaks in mid-October alongside the apple harvest.',
  },
  {
    slug: 'iowa', name: 'Iowa', capital: 'Des Moines', capitalSlug: 'des-moines',
    peak: 'September through October',
    regions: 'the Glenwood area in Mills County in the southwest, Muscatine County along the Mississippi, and farms scattered across the central and northeast',
    varieties: 'Honeycrisp, Zestar, Jonathan, Cortland, and Haralson',
    intro: 'Apple picking season in Iowa runs from September through October, with u-pick orchards spread across the state providing a genuine fall tradition for families throughout the Midwest.',
    seasonDetail: 'Iowa\'s apple orchards are modest in scale but enthusiastically supported by local communities. The Glenwood area in southwest Iowa has a cluster of established farms, while the river bluff country along the Mississippi in eastern Iowa provides terrain and microclimates well-suited to tree fruit. Honeycrisp is the dominant variety at Iowa u-pick orchards, typically ready in mid-September.',
    tip: 'Iowa orchard visits pair well with fall corn maze attractions — many Iowa farms combine both, and October weekends become a full family day.',
  },
  {
    slug: 'kansas', name: 'Kansas', capital: 'Topeka', capitalSlug: 'topeka',
    peak: 'September',
    regions: 'the Wichita area in south-central Kansas, Shawnee County near Topeka, and the Flint Hills region',
    varieties: 'Gala, Fuji, Honeycrisp, and Jonathan',
    intro: 'Apple picking season in Kansas is concentrated in September, with a limited but dedicated group of orchards operating across the state\'s varied terrain.',
    seasonDetail: 'Kansas is not prime apple country — the combination of summer heat, spring hail storms, and highly variable temperatures makes consistent apple production challenging. However, a number of determined growers have established successful orchards, particularly on the east side of the state where rainfall is higher and temperatures slightly more moderate. Look for u-pick operations primarily in Shawnee, Douglas, and Butler counties.',
    tip: 'Kansas orchards often run a short season — check listings carefully and call ahead because the window can be compressed by summer heat or early frost.',
  },
  {
    slug: 'kentucky', name: 'Kentucky', capital: 'Frankfort', capitalSlug: 'frankfort',
    peak: 'late August through October',
    regions: 'Eastern Kentucky in the Appalachian foothills, Madison County near Berea, and the Bluegrass region surrounding Lexington',
    varieties: 'Honeycrisp, Fuji, Jonathan, Jonagold, and Arkansas Black',
    intro: 'Apple picking season in Kentucky runs from late August through October, with the state\'s Appalachian foothills in the east producing the largest concentration of pick-your-own orchards.',
    seasonDetail: 'Kentucky\'s orchard tradition draws on the Appalachian heritage of the eastern mountains, where apple growing has roots going back centuries. The elevation and climate of Madison, Estill, and Powell counties near Berea and Richmond provide good conditions for apple production, and a number of multi-generational farm operations run active u-pick programs. The Bluegrass region near Lexington also has several established orchards close to the urban population center.',
    tip: 'Berea makes an excellent base for apple picking in Eastern Kentucky — pair orchard visits with the city\'s thriving craft and folk art community for a full fall weekend.',
  },
  {
    slug: 'louisiana', name: 'Louisiana', capital: 'Baton Rouge', capitalSlug: 'baton-rouge',
    peak: 'July through August',
    regions: 'North Louisiana near Shreveport and Monroe, and a handful of farms in the piney hills region',
    varieties: 'Anna, Dorsett Golden, and low-chill Gala strains',
    intro: 'Apple picking in Louisiana is limited and seasonal, running July through August in the northern parishes where winters are just cold enough for low-chill apple varieties to produce fruit.',
    seasonDetail: 'Louisiana\'s subtropical climate makes traditional apple growing nearly impossible in most of the state. However, north Louisiana — where winters regularly drop below freezing — sees enough chilling hours for some low-chill varieties to produce modest crops. Pick-your-own apple operations in Louisiana are rare; check current listings carefully, as availability changes from season to season based on winter temperatures.',
    tip: 'Louisiana apple orchards are a novelty rather than a tradition — if you find one operating, visit more for the unique experience than for the expectation of a classic apple-picking day.',
  },
  {
    slug: 'maine', name: 'Maine', capital: 'Augusta', capitalSlug: 'augusta',
    peak: 'September through October',
    regions: 'York County in the south, the Kennebec Valley near Augusta, the Penobscot River region, and scattered farms across the western mountains',
    varieties: 'McIntosh, Cortland, Macoun, Honeycrisp, and Northern Spy',
    intro: 'Apple picking season in Maine runs from September through October, with the state\'s centuries-old orchard tradition producing McIntosh and Cortland varieties that are among the finest in New England.',
    seasonDetail: 'Maine has been growing apples since European settlement, and the state\'s cool maritime climate produces fruit with exceptional balance — the cold nights develop color and tartness while the long summer days build sugar. York County in the south has the densest concentration of u-pick operations, but farms are found across much of the state\'s agricultural regions. Northern Spy, one of the great pie apples, is a New England classic that peaks in October and is worth seeking out specifically.',
    tip: 'Maine apple picking in October coincides with spectacular fall foliage — timing your visit for the first two weeks of October captures both peak harvest and peak leaf color across the state.',
  },
  {
    slug: 'maryland', name: 'Maryland', capital: 'Annapolis', capitalSlug: 'annapolis',
    peak: 'late August through October',
    regions: 'Frederick County in the west, Washington County near Hagerstown, and Carroll County north of Baltimore',
    varieties: 'Honeycrisp, Fuji, Gala, Cortland, York Imperial, and Golden Delicious',
    intro: 'Apple picking season in Maryland runs from late August through October, with Frederick and Washington counties in the western part of the state producing the largest concentration of pick-your-own orchards.',
    seasonDetail: 'Maryland\'s orchard country clusters in the valleys and hills of the west, where the Ridge and Valley topography of the Appalachians provides the cold winters and warm summers that apples need. Frederick County has the highest density of farms, many of which have operated for decades. The area around Emmitsburg and Thurmont in northern Frederick County is particularly worth exploring, with several well-established u-pick operations.',
    tip: 'Make a day of it in Frederick County — pair apple picking with a visit to the historic town of Frederick itself, which has a strong food and restaurant scene worth exploring after the orchard.',
  },
  {
    slug: 'massachusetts', name: 'Massachusetts', capital: 'Boston', capitalSlug: 'boston',
    peak: 'late August through October',
    regions: 'Worcester County (the densest orchard concentration in the state), the Connecticut River Valley, the North Shore, and the South Shore',
    varieties: 'McIntosh, Cortland, Macoun, Honeycrisp, Empire, and Zestar',
    intro: 'Apple picking season in Massachusetts runs from late August through October, with Worcester County alone hosting more pick-your-own orchards than most entire states.',
    seasonDetail: 'Massachusetts has one of the richest apple picking traditions in America. The state\'s cool, humid climate is ideal for varieties like McIntosh, Cortland, and Macoun — all of which reach peak flavor in New England in a way they simply cannot elsewhere. Many Massachusetts orchards have operated for three or four generations, and the pick-your-own model has been a staple of family farming here since the 1970s. Orchards across the state also offer cider pressing, farm stands, and baked goods that make the experience genuinely complete.',
    tip: 'Cortland and Macoun are the standout varieties to look for in Massachusetts — they are regional classics not widely available elsewhere, and their flavor in late September and early October is exceptional.',
  },
  {
    slug: 'michigan', name: 'Michigan', capital: 'Lansing', capitalSlug: 'lansing',
    peak: 'late August through October',
    regions: 'the Fruit Belt along Lake Michigan\'s eastern shore (Berrien, Van Buren, Allegan counties), Traverse City in the north, and the Grand Rapids area',
    varieties: 'Honeycrisp, Gala, Fuji, McIntosh, Cortland, Golden Delicious, and Jonagold',
    intro: 'Apple picking season in Michigan runs from late August through October, with the state\'s famous Fruit Belt along Lake Michigan\'s eastern shore producing more apples than almost any state in the country.',
    seasonDetail: 'Michigan is one of the top apple-producing states in the nation, and the reason is Lake Michigan. The lake moderates temperatures year-round — warming springs, cooling summers, and delaying fall frost — creating ideal conditions for tree fruit in the narrow band of land along its eastern shore. The Fruit Belt counties of Berrien, Van Buren, and Allegan have dozens of pick-your-own operations, and the area around Fennville, South Haven, and Saugatuck is particularly rich in farms. Traverse City in the north adds a scenic cherry-and-apple vacation destination.',
    tip: 'Michigan orchards often sell apple cider pressed fresh on-site — it is one of the best ciders you will find anywhere in the country, and worth buying by the gallon to take home.',
  },
  {
    slug: 'minnesota', name: 'Minnesota', capital: 'Saint Paul', capitalSlug: 'saint-paul',
    peak: 'September through October',
    regions: 'the Twin Cities metro area (Stillwater, Afton, Hastings), the St. Croix River Valley, and farms across the southern tier',
    varieties: 'Honeycrisp (developed at the University of Minnesota), SweeTango, Zestar, Haralson, and Fireside',
    intro: 'Apple picking season in Minnesota runs from September through October, and the state holds a special place in apple history as the birthplace of the Honeycrisp — bred at the University of Minnesota and now the most popular apple variety in the country.',
    seasonDetail: 'Minnesota has arguably contributed more to modern apple genetics than any other state. The University of Minnesota\'s apple breeding program developed Honeycrisp, Zestar, and SweeTango, among others — varieties that have transformed what Americans expect from an apple. Minnesota orchards sit along the St. Croix and Mississippi river valleys east and south of the Twin Cities, with the Stillwater and Hastings areas particularly well-stocked with u-pick operations.',
    tip: 'SweeTango — the Honeycrisp\'s successor from the University of Minnesota program — is worth seeking out specifically if you have not tried it. It is sold at limited orchards and has an extraordinary crunch and flavor balance.',
  },
  {
    slug: 'mississippi', name: 'Mississippi', capital: 'Jackson', capitalSlug: 'jackson',
    peak: 'July through August',
    regions: 'the hill country of north Mississippi near Oxford and Pontotoc, and scattered farms in the Natchez Trace corridor',
    varieties: 'Gala, Fuji, Anna, and other early-ripening varieties',
    intro: 'Apple picking in Mississippi is limited to July through August, when early-ripening varieties in the northern hill country can produce fruit before the summer heat becomes too extreme.',
    seasonDetail: 'Mississippi\'s warm, humid climate is challenging for apple production, and pick-your-own orchards are sparse. The northern highlands — sometimes called the Mississippi Uplands — have somewhat cooler winters than the Delta or the Gulf Coast, allowing a small number of growers to establish viable orchards. Availability changes year to year, so always check current listings before planning a trip.',
    tip: 'Mississippi apple orchards are rare and small — check listings and call ahead, as farms may close or shift their open hours without widespread notice.',
  },
  {
    slug: 'missouri', name: 'Missouri', capital: 'Jefferson City', capitalSlug: 'jefferson-city',
    peak: 'late August through October',
    regions: 'the Ozark Highlands in the south-central region, the Kansas City metro area, and orchards in the Missouri River valley',
    varieties: 'Honeycrisp, Fuji, Jonathan, Jonagold, and Winesap',
    intro: 'Apple picking season in Missouri runs from late August through October, with the Ozark Highlands and the orchards of the Missouri River valley offering the most established pick-your-own operations.',
    seasonDetail: 'Missouri\'s apple growing benefits from the hill terrain of the Ozarks, where elevation provides cooler temperatures than the surrounding plains. The region around Ste. Genevieve, Hermann, and the Missouri River Wine Country has orchards that combine with the area\'s winery circuit for excellent fall day trips. Honeycrisp is increasingly dominant at Missouri u-pick operations but local heirloom varieties like Winesap are still grown at some older family farms.',
    tip: 'Combine Missouri apple picking with a visit to the Hermann Wine Trail — several orchards are clustered near the wine country and fall is peak season for both.',
  },
  {
    slug: 'montana', name: 'Montana', capital: 'Helena', capitalSlug: 'helena',
    peak: 'late August through September',
    regions: 'the Flathead Valley near Kalispell and Polson, the Bitterroot Valley south of Missoula, and the Bitterroot range near Hamilton',
    varieties: 'Honeycrisp, Fuji, Transparent, Lodi, and McIntosh',
    intro: 'Apple picking season in Montana runs from late August through September, centered in the Flathead and Bitterroot valleys where the mountain climate and long summer days produce uniquely flavorful fruit.',
    seasonDetail: 'Montana orchards produce apples that benefit from the state\'s wide daily temperature swings — warm days build sugar while cold nights slow ripening and develop complexity. The Flathead Valley, sheltered by mountains on multiple sides, is particularly suited to tree fruit, and a number of established orchards operate near Kalispell and Bigfork. The Bitterroot Valley south of Missoula adds another orchard corridor with a slightly longer season.',
    tip: 'Montana apple orchards are small and family-run — many are not well-advertised online, so ask locally when you arrive in the Flathead or Bitterroot area for current u-pick options.',
  },
  {
    slug: 'nebraska', name: 'Nebraska', capital: 'Lincoln', capitalSlug: 'lincoln',
    peak: 'September through October',
    regions: 'the Omaha metro area, the Platte River valley near Grand Island, and farms in the southeast corner of the state',
    varieties: 'Honeycrisp, Gala, Jonathan, and Cortland',
    intro: 'Apple picking season in Nebraska runs from September through October, with a modest but active group of orchards operating primarily in the eastern part of the state.',
    seasonDetail: 'Nebraska\'s Great Plains climate poses challenges for apple growing — strong winds, variable spring temperatures, and summer heat — but the eastern tier of the state, with somewhat more moisture and moderate terrain, supports a number of successful orchards. The area around Omaha and Lincoln has the highest concentration of pick-your-own operations, making it accessible to the largest population centers.',
    tip: 'Nebraska orchards often combine apple picking with pumpkin patches and corn mazes in fall — a single visit can become a full day of activities for families.',
  },
  {
    slug: 'nevada', name: 'Nevada', capital: 'Carson City', capitalSlug: 'carson-city',
    peak: 'September through October',
    regions: 'the Reno-Sparks area in the west, Carson Valley near Minden and Gardnerville, and a handful of farms in the Elko area',
    varieties: 'Honeycrisp, Gala, Fuji, and Granny Smith',
    intro: 'Apple picking season in Nevada runs from September through October, limited to the high valleys of the western part of the state where elevation and Sierra Nevada snowmelt create conditions unusual for this desert region.',
    seasonDetail: 'Nevada is not where most people picture apple orchards, but the Carson Valley and the Reno basin have a surprisingly productive agricultural tradition. The irrigation provided by Sierra Nevada snowmelt and the elevation — Carson City sits at over 4,700 feet — creates apple-growing conditions that defy the state\'s desert reputation. A small number of pick-your-own orchards operate in the western valleys, drawing visitors from Reno and the Lake Tahoe area.',
    tip: 'Pair a Nevada apple picking trip with a visit to Lake Tahoe — the orchards of the Carson Valley are a short drive from the lake\'s south shore, and fall foliage in the Sierra makes the combination spectacular.',
  },
  {
    slug: 'new-hampshire', name: 'New Hampshire', capital: 'Concord', capitalSlug: 'concord',
    peak: 'September through October',
    regions: 'Cheshire County in the southwest, the Lakes Region, Hillsborough County near Concord, and orchards throughout the Merrimack Valley',
    varieties: 'McIntosh, Cortland, Honeycrisp, Macoun, Empire, and Zestar',
    intro: 'Apple picking season in New Hampshire runs from September through October, with the state\'s rugged countryside offering dozens of pick-your-own orchards alongside some of the most spectacular fall foliage in New England.',
    seasonDetail: 'New Hampshire is deeply committed to its apple heritage. The state has a higher density of pick-your-own orchards per capita than almost any other state, with farms spread across every county. Alyson\'s Orchard near Walpole in Cheshire County is among the most celebrated in New England. The Monadnock region, the Lakes Region, and the upper Merrimack Valley all have concentrations of established farms. Fall here is a complete sensory experience — the smell of cider, the crunch of leaves, the view of the hills going red.',
    tip: 'New Hampshire orchard visits on Columbus Day weekend can get crowded with leaf-peepers combining the two activities — going the weekend before gets you both peak picking conditions and slightly less traffic.',
  },
  {
    slug: 'new-jersey', name: 'New Jersey', capital: 'Trenton', capitalSlug: 'trenton',
    peak: 'August through October',
    regions: 'Hunterdon County in the northwest, Burlington County in the south, and Warren County along the Delaware River',
    varieties: 'Zestar, Honeycrisp, Fuji, Cortland, and Stayman Winesap',
    intro: 'Apple picking season in New Jersey runs from August through October, with Hunterdon County in the northwest and the fertile farmland of Burlington County producing the state\'s most established pick-your-own operations.',
    seasonDetail: 'New Jersey\'s location between the Delaware River and the Atlantic gives it a longer and more varied growing season than neighboring Pennsylvania or New York. Hunterdon County, known as the heart of New Jersey\'s horse and farm country, has a strong apple growing tradition with several multi-generational family orchards. Zestar and Honeycrisp open the season in August, followed by Fuji, Cortland, and Stayman Winesap running through late October.',
    tip: 'Combine a Hunterdon County apple picking trip with a drive along the Delaware River on Route 29 for one of New Jersey\'s best fall drives — the orchards of Milford and Flemington are along the way.',
  },
  {
    slug: 'new-mexico', name: 'New Mexico', capital: 'Santa Fe', capitalSlug: 'santa-fe',
    peak: 'August through October',
    regions: 'the Alcalde-Dixon area in Rio Arriba County north of Española, the Manzano Mountains east of Albuquerque, and the La Cueva area in Mora County',
    varieties: 'Honeycrisp, Gala, Fuji, and heirloom varieties from Spanish colonial orchards',
    intro: 'Apple picking season in New Mexico runs from August through October, with the high-elevation orchards of the Alcalde and Dixon area north of Santa Fe producing fruit with a remarkable flavor concentration.',
    seasonDetail: 'New Mexico has an apple growing heritage that stretches back to Spanish colonial times — the Alcalde and Dixon communities in Rio Arriba County have orchards descended from trees planted centuries ago, alongside newer commercial plantings. The Manzano Mountains, whose name literally means "apple mountains" in Spanish, have been producing apples since the 1700s. The combination of high altitude, intense sunshine, and cold nights creates apples with exceptional sugar concentration and color.',
    tip: 'The Manzano Mountains and the Alcalde-Dixon area are worth a dedicated day trip from Albuquerque or Santa Fe — the landscape is extraordinary and the orchards have a cultural depth you will not find at commercial u-pick farms elsewhere.',
  },
  {
    slug: 'new-york', name: 'New York', capital: 'Albany', capitalSlug: 'albany',
    peak: 'late August through October',
    regions: 'the Hudson Valley (Columbia, Dutchess, Ulster, and Orange counties), the Finger Lakes region, Lake Ontario\'s south shore, and the Champlain Valley',
    varieties: 'McIntosh, Cortland, Macoun, Empire, Honeycrisp, Zestar, and Northern Spy',
    intro: 'Apple picking season in New York runs from late August through October, with the Hudson Valley alone hosting more pick-your-own orchards than most entire states — making New York one of the premier apple picking destinations in the country.',
    seasonDetail: 'New York is apple country on a grand scale. The Hudson Valley\'s cool microclimate, shaped by the river\'s temperature-moderating effect and the Catskill mountains to the west, has supported apple growing since Dutch colonial settlement. The Empire apple — one of the top commercial varieties — was bred in New York State. The Finger Lakes add another orchard corridor in central New York, and the Lake Ontario south shore near Niagara produces apples in the narrow belt warmed by lake-effect conditions. For pure variety and number of orchards, the Hudson Valley rivals any region in the country.',
    tip: 'The stretch of Route 9W through Orange County is one of the great apple picking drives in the East — orchard after orchard on both sides of the road, with the Hudson River as a backdrop on clear days.',
  },
  {
    slug: 'north-carolina', name: 'North Carolina', capital: 'Raleigh', capitalSlug: 'raleigh',
    peak: 'late June through October',
    regions: 'Henderson County near Hendersonville (America\'s Apple Capital), the Edneyville area, the Brevard region, and Polk County',
    varieties: 'Honeycrisp, Fuji, Gala, Jonagold, Rome, and Arkansas Black',
    intro: 'Apple picking season in North Carolina runs from late June through October, with Henderson County near Hendersonville — officially recognized as the Apple Capital of the United States — leading one of the most productive apple regions in the Eastern US.',
    seasonDetail: 'Henderson County produces more apples than any other county east of the Mississippi River. The combination of high elevation, warm days, and cool nights in the Blue Ridge Mountains creates conditions that extend the apple season to nearly five months — Lodi and early Galas arrive in late June, while late varieties like Fuji and Arkansas Black hold on into October and November. The area between Hendersonville and Flat Rock is particularly dense with u-pick operations, and NC Apple Festival in Hendersonville each Labor Day weekend is one of the largest in the Southeast.',
    tip: 'The area around Edneyville, just west of Hendersonville, is where most of the working commercial orchards and u-pick farms are concentrated — it is a different, quieter experience than the tourist-facing farms closer to town.',
  },
  {
    slug: 'north-dakota', name: 'North Dakota', capital: 'Bismarck', capitalSlug: 'bismarck',
    peak: 'September',
    regions: 'the Sheyenne River Valley near Valley City, the Red River Valley in the east, and a handful of farms near Bismarck',
    varieties: 'Haralson, Honeygold, Norland, and other cold-hardy varieties',
    intro: 'Apple picking season in North Dakota is concentrated in September, with cold-hardy varieties bred for the northern plains providing a brief but genuine harvest window.',
    seasonDetail: 'North Dakota\'s harsh winters — routinely reaching -20°F or colder — eliminate most standard apple varieties. However, the University of Minnesota\'s cold-hardy breeding program has produced varieties like Haralson, Honeygold, and Norland that survive and bear fruit reliably in the northern plains. Pick-your-own orchards are limited but present, primarily in the eastern and south-central parts of the state where the season is marginally longer.',
    tip: 'North Dakota orchards are few and may not be well-publicized — check current listings and call ahead before making a trip, as operations can change season to season.',
  },
  {
    slug: 'ohio', name: 'Ohio', capital: 'Columbus', capitalSlug: 'columbus',
    peak: 'late August through October',
    regions: 'the Licking County area east of Columbus, Wayne and Holmes counties in the Amish country, the Lake Erie shore counties, and the Cincinnati area',
    varieties: 'Honeycrisp, Fuji, Gala, Jonathan, Cortland, and McIntosh',
    intro: 'Apple picking season in Ohio runs from late August through October, with the state offering one of the widest geographic spreads of pick-your-own orchards in the Midwest.',
    seasonDetail: 'Ohio benefits from Lake Erie\'s moderating effect in the northern counties, which delays spring frost and extends the fall season — creating a de facto Fruit Belt along the lake\'s southern shore similar to Michigan\'s famous version. Inland, the rolling terrain of Licking, Wayne, and Holmes counties provides good orchard country, with the Amish agricultural community in particular maintaining a strong tradition of fruit growing. Zestar opens the season in late August, with Honeycrisp and Jonathan peaking in September and later varieties running into October.',
    tip: 'A visit to an orchard in Wayne or Holmes County pairs naturally with a drive through Ohio\'s Amish country — the same agricultural landscape that makes the area scenic also makes it ideal for orchards.',
  },
  {
    slug: 'oklahoma', name: 'Oklahoma', capital: 'Oklahoma City', capitalSlug: 'oklahoma-city',
    peak: 'August through September',
    regions: 'northeastern Oklahoma near Tahlequah and the Cherokee Nation lands, the Winding Stair Mountains, and farms near Tulsa',
    varieties: 'Gala, Fuji, Golden Delicious, and Jonathan',
    intro: 'Apple picking season in Oklahoma runs from August through September, concentrated in the northeastern corner of the state where Ozark Mountain terrain provides the elevation and cooler temperatures that apple trees require.',
    seasonDetail: 'Oklahoma\'s apple growing is limited to its greener, hillier northeast. The Ozark Plateau that extends into Adair and Cherokee counties has some of the state\'s most established orchards, with the area around Tahlequah in the Cherokee Nation being particularly notable. Summers are hot but the elevation provides some relief, and the apple season wraps up before the most extreme autumn heat arrives.',
    tip: 'Look for orchards in the Stilwell and Tahlequah areas of northeast Oklahoma — this part of the state is more forested and accessible than the rest of Oklahoma\'s agricultural heartland.',
  },
  {
    slug: 'oregon', name: 'Oregon', capital: 'Salem', capitalSlug: 'salem',
    peak: 'August through October',
    regions: 'Hood River Valley (the most celebrated apple and pear region), the Willamette Valley near Salem, the Rogue Valley near Medford, and the Milton-Freewater area',
    varieties: 'Honeycrisp, Fuji, Gala, Jonagold, Braeburn, and Newtown Pippin',
    intro: 'Apple picking season in Oregon runs from August through October, with the Hood River Valley — one of the most celebrated fruit-growing regions in the Pacific Northwest — offering some of the finest pick-your-own apple experiences in the country.',
    seasonDetail: 'Oregon\'s apple geography is dominated by the Hood River Valley, carved by the Columbia River\'s tributaries and sheltered by Mount Hood. The combination of volcanic soil, glacial melt irrigation, and consistent temperature swings between warm days and cold nights produces apples with exceptional color and flavor. The Willamette Valley near Salem and Eugene adds another orchard corridor, and the Rogue Valley in southern Oregon — more Mediterranean in character — extends the variety range to include Braeburn and other later-season types.',
    tip: 'The drive through Hood River on the Historic Columbia River Highway is one of the Pacific Northwest\'s great fall experiences — orchards on both sides of the road with Mount Hood as a backdrop and the Columbia River gorge below.',
  },
  {
    slug: 'pennsylvania', name: 'Pennsylvania', capital: 'Harrisburg', capitalSlug: 'harrisburg',
    peak: 'late August through October',
    regions: 'Adams County near Gettysburg (the state\'s apple capital), Cumberland and Franklin counties near Chambersburg, and Chester County in the southeast',
    varieties: 'Honeycrisp, Fuji, York Imperial, Golden Delicious, Gala, and Cortland',
    intro: 'Apple picking season in Pennsylvania runs from late August through October, with Adams County near Gettysburg producing more apples than almost any other county in the Eastern United States.',
    seasonDetail: 'Pennsylvania is one of the top apple-producing states in the country, and Adams County — where Gettysburg sits — is at the center of it. The Cumberland Valley floor and surrounding ridges provide ideal orchard conditions: fertile limestone soils, reliable rainfall, and the cold winters that apples need for proper dormancy. South Mountain Orchards, Knouse Foods, and dozens of family-owned pick-your-own operations make this one of the richest apple regions on the East Coast. The season begins with early Gala in late August and runs through late-season types like Fuji and Braeburn in October.',
    tip: 'Combine Adams County apple picking with a visit to the Gettysburg battlefield — the two are minutes apart, and both are at their best in the clear light of early October.',
  },
  {
    slug: 'rhode-island', name: 'Rhode Island', capital: 'Providence', capitalSlug: 'providence',
    peak: 'September through October',
    regions: 'the Sakonnet Valley in Newport County, the Scituate and Foster area in Providence County, and farms throughout the western part of the state',
    varieties: 'McIntosh, Cortland, Honeycrisp, Macoun, and Empire',
    intro: 'Apple picking season in Rhode Island runs from September through October, with the state\'s compact geography meaning every resident is within a short drive of at least one well-established pick-your-own orchard.',
    seasonDetail: 'Rhode Island may be the smallest state but it has a surprisingly active orchard community. Jaswell\'s Farm in Scituate has operated for generations and is one of the best-known u-pick destinations in New England. The Sakonnet Valley in Newport County offers scenic coastal-adjacent picking on a fall day. McIntosh and Cortland are the classic New England varieties available here, alongside more recent additions like Honeycrisp.',
    tip: 'Rhode Island\'s size means you can visit an orchard and still have time to explore Newport or Providence in the same day — consider it as part of a larger fall New England itinerary.',
  },
  {
    slug: 'south-carolina', name: 'South Carolina', capital: 'Columbia', capitalSlug: 'columbia',
    peak: 'late June through August',
    regions: 'the Upstate near Gaffney and Cherokee County (the Peach Capital but also grows apples), the Blue Ridge foothills near Landrum, and Oconee County',
    varieties: 'Gala, Fuji, Golden Delicious, and early-ripening varieties',
    intro: 'Apple picking season in South Carolina runs from late June through August, concentrated in the Blue Ridge foothills of the Upstate where elevation moderates the summer heat enough for apple production.',
    seasonDetail: 'South Carolina\'s apple season is driven by the state\'s warm climate — apples ripen weeks ahead of northern states because of the heat, and the season wraps up before the worst of summer arrives. Oconee and Pickens counties in the Blue Ridge foothills have the most established orchards, with some farms also operating in the rolling Piedmont terrain. The season is brief, so planning your visit for early July gives you the widest variety selection.',
    tip: 'Apple picking in South Carolina is often a family farm experience that is less polished than northeastern u-pick orchards — go for the freshness and the direct connection to the grower rather than for a curated farm park experience.',
  },
  {
    slug: 'south-dakota', name: 'South Dakota', capital: 'Pierre', capitalSlug: 'pierre',
    peak: 'September',
    regions: 'the Black Hills near Rapid City and Custer, the Sioux Falls area in the east, and scattered farms across the eastern tier',
    varieties: 'Haralson, Honeygold, and cold-hardy northern varieties',
    intro: 'Apple picking season in South Dakota is concentrated in September, with the Black Hills in the west and the eastern farmland producing limited but genuine u-pick opportunities with cold-hardy varieties.',
    seasonDetail: 'South Dakota\'s climate is challenging for apple growing — extreme cold winters, spring hail, and hot summers require specialized varieties to survive and produce. The Black Hills have a slightly more temperate microclimate than the surrounding plains, and a handful of orchards operate there. Cold-hardy varieties from the University of Minnesota breeding program — Haralson, Honeygold — are the staples of South Dakota orchards.',
    tip: 'South Dakota apple picking is a regional experience worth doing if you are visiting the Black Hills in September, but do not make a special trip expecting a classic orchard experience without checking listings and confirming operations first.',
  },
  {
    slug: 'tennessee', name: 'Tennessee', capital: 'Nashville', capitalSlug: 'nashville',
    peak: 'late July through October',
    regions: 'Grainger County in the northeast (Tennessee\'s tomato country that also grows apples), the Smoky Mountain foothills near Maryville, and Polk County near the Georgia border',
    varieties: 'Honeycrisp, Gala, Fuji, Jonagold, and Winesap',
    intro: 'Apple picking season in Tennessee runs from late July through October, with the state\'s Appalachian highlands in the northeast and southeast providing the elevation needed for quality apple production.',
    seasonDetail: 'Tennessee\'s orchard geography follows its mountain terrain. Grainger County in the northeast, better known for tomatoes, also hosts several apple orchards in its river valley setting. The counties surrounding Great Smoky Mountains National Park — Blount, Sevier, and Monroe — have farms that draw both locals and the millions of visitors who pass through the Smokies each year. The season opens with early Gala and Honeycrisp in late July and extends into October with later-ripening types.',
    tip: 'Apple picking near the Smokies pairs naturally with a day in the national park or a visit to Cades Cove — the combination makes for one of the best fall family days in the Southeast.',
  },
  {
    slug: 'texas', name: 'Texas', capital: 'Austin', capitalSlug: 'austin',
    peak: 'July through September',
    regions: 'Medina in Bandera County (the Apple Capital of Texas), the Texas Hill Country around Kerrville and Fredericksburg, and high-altitude orchards in far west Texas',
    varieties: 'Fuji, Gala, Honeycrisp, and low-chill varieties developed for warm climates',
    intro: 'Apple picking season in Texas runs from July through September, centered in the Texas Hill Country around Medina — officially recognized as the Apple Capital of Texas — where the combination of thin limestone soils and high summer elevation creates genuine apple country.',
    seasonDetail: 'Texas apple growing defies expectations. Medina, a tiny community in the Hill Country west of San Antonio, sits at about 2,000 feet elevation and has developed a genuine apple tradition. Love Creek Orchards in Medina is among the most celebrated pick-your-own destinations in the South. The limestone soils of the Hill Country drain well and stay warm at night, while the altitude provides marginally cooler summer temperatures. Fuji and Gala are the workhorses, with Honeycrisp increasingly available at Hill Country orchards.',
    tip: 'Combine a Medina apple picking visit with a drive through Fredericksburg and Kerrville — the Hill Country in summer and early fall is beautiful, and the German-heritage towns have excellent food and wineries alongside the orchards.',
  },
  {
    slug: 'utah', name: 'Utah', capital: 'Salt Lake City', capitalSlug: 'salt-lake-city',
    peak: 'August through September',
    regions: 'Cache Valley near Logan, the Provo-Springville area in Utah County, and the orchards above the Great Salt Lake in Davis County',
    varieties: 'Honeycrisp, Fuji, Gala, and McIntosh',
    intro: 'Apple picking season in Utah runs from August through September, with Cache Valley in the north and Utah County in the central part of the state offering the most established pick-your-own orchards.',
    seasonDetail: 'Utah\'s orchard tradition is tied closely to the state\'s pioneer heritage — the early settlers established fruit orchards across the mountain valleys, and the practice has continued in communities like Brigham City, Provo, and Logan. Cache Valley produces stone fruit and apples in its agricultural lowlands, while the bench land above the valley floor provides slightly elevated orchards with better drainage. The Provo-Orem area has several family orchards with u-pick programs.',
    tip: 'Brigham City hosts a Peach Days festival in early September, but apple orchards in the Cache and Utah Valley areas follow immediately after — the timing makes for a great two-week agricultural circuit in late summer.',
  },
  {
    slug: 'vermont', name: 'Vermont', capital: 'Montpelier', capitalSlug: 'montpelier',
    peak: 'September through October',
    regions: 'the Champlain Valley (the state\'s primary agricultural region), Addison and Chittenden counties, the Connecticut River Valley, and orchards throughout the Green Mountain landscape',
    varieties: 'McIntosh, Cortland, Macoun, Honeycrisp, Empire, and Northern Spy',
    intro: 'Apple picking season in Vermont runs from September through October, with the Champlain Valley — Vermont\'s warmest and most agricultural region — hosting dozens of pick-your-own orchards alongside some of the most spectacular fall foliage in New England.',
    seasonDetail: 'Vermont\'s apple growing is inseparable from the broader experience of fall in New England — the apple orchards dot a landscape that is simultaneously going gold and red with foliage change, making a farm visit in late September or early October one of the most beautiful agricultural experiences in the country. The Champlain Valley benefits from the lake\'s moderating effect, extending the season slightly. Cold Hollow Cider Mill near Waterbury produces fresh-pressed cider that has become a Vermont institution. McIntosh and Cortland remain the foundation varieties, but Honeycrisp and Macoun are increasingly available.',
    tip: 'Vermont orchard visits in early October are extraordinary — the foliage is near peak, the Honeycrisp are ripe, and the air has that clear fall quality that makes everything taste better. Cold Hollow Cider is worth a stop even if you are not picking.',
  },
  {
    slug: 'virginia', name: 'Virginia', capital: 'Richmond', capitalSlug: 'richmond',
    peak: 'late July through October',
    regions: 'the Shenandoah Valley (Frederick, Shenandoah, and Warren counties), the Blue Ridge Mountains, and the Northern Virginia orchard corridor near Winchester',
    varieties: 'Honeycrisp, Fuji, Gala, York Imperial, and Virginia Gold (a native heirloom)',
    intro: 'Apple picking season in Virginia runs from late July through October, with the Shenandoah Valley between the Blue Ridge and Allegheny mountains producing one of the most important apple regions in the Eastern United States.',
    seasonDetail: 'Virginia\'s apple country is anchored by Frederick County and the Winchester area at the northern end of the Shenandoah Valley — one of the oldest commercial apple-growing regions in the country, with orchards that predate the Civil War. The valley\'s limestone soils, reliable rainfall, and long growing season make it ideal for a succession of varieties from late July Lodi through October Fuji. Virginia Gold, a native heirloom rediscovered and promoted by orchardists in the region, is worth seeking out for its exceptional balance of sweet and tart.',
    tip: 'The area around Berryville and Clarke County, just east of Winchester, has several well-established u-pick orchards that draw less traffic than the larger commercial operations closer to I-81 — worth the extra few miles for a more personal farm experience.',
  },
  {
    slug: 'washington', name: 'Washington', capital: 'Olympia', capitalSlug: 'olympia',
    peak: 'August through October',
    regions: 'the Yakima Valley (the largest apple-producing region in the US), Wenatchee and the Chelan Valley, the Okanogan Highlands, and the Ellensburg area',
    varieties: 'Honeycrisp, Fuji, Gala, Cosmic Crisp (developed at WSU), Jonagold, and Granny Smith',
    intro: 'Apple picking season in Washington State runs from August through October, with the Yakima Valley and Wenatchee area producing more apples than any other region in the United States — Washington grows nearly 70% of the country\'s apple crop.',
    seasonDetail: 'Washington State IS apple country in America. The combination of volcanic soil, desert sunshine, and reliable irrigation from the Cascades creates conditions that have made the Yakima Valley and Wenatchee area the most productive apple-growing region on earth. Cosmic Crisp, developed by Washington State University specifically for the region\'s conditions, is now available at farm stands and u-pick operations across the state. The Yakima Valley offers the widest commercial scale, but Chelan and the Okanogan Highlands produce boutique varieties and more intimate u-pick experiences.',
    tip: 'If you visit one apple orchard in your life, make it in Washington\'s Chelan Valley or Okanogan Highlands — the setting, the fruit quality, and the variety selection are genuinely unmatched anywhere in the country.',
  },
  {
    slug: 'west-virginia', name: 'West Virginia', capital: 'Charleston', capitalSlug: 'charleston',
    peak: 'late August through October',
    regions: 'the Eastern Panhandle near Martinsburg and Shepherdstown (adjacent to the Virginia/Maryland apple belt), Berkeley and Morgan counties, and the Greenbrier Valley',
    varieties: 'Honeycrisp, Fuji, Gala, Golden Delicious (native to WV), and York Imperial',
    intro: 'Apple picking season in West Virginia runs from late August through October, with the Eastern Panhandle — geographically part of the same Shenandoah Valley apple country as Virginia and Maryland — offering the state\'s richest picking experiences.',
    seasonDetail: 'West Virginia has a special claim in apple history: Golden Delicious, one of the most widely planted apple varieties in the world, was discovered on a farm in Clay County, West Virginia in the early 1900s. The state has honored this heritage with a Golden Delicious Festival in Clay each fall. The Eastern Panhandle is commercially the most active apple-growing area, sharing the soil and climate of the Virginia-Maryland apple belt, but the Greenbrier Valley and central highlands also have productive orchards.',
    tip: 'Look for the Clay County Golden Delicious Festival in late September — it is a West Virginia tradition that celebrates the state\'s genuine contribution to American apple genetics.',
  },
  {
    slug: 'wisconsin', name: 'Wisconsin', capital: 'Madison', capitalSlug: 'madison',
    peak: 'September through October',
    regions: 'Door County on the Lake Michigan peninsula (Wisconsin\'s orchard heartland), the Geneva Lakes area in the south, and farms scattered across the southern tier',
    varieties: 'Honeycrisp, Zestar, McIntosh, Cortland, and Haralson',
    intro: 'Apple picking season in Wisconsin runs from September through October, with Door County — the narrow peninsula extending into Lake Michigan — providing the most celebrated orchard experiences in the state.',
    seasonDetail: 'Door County is to Wisconsin what Traverse City is to Michigan — a peninsula surrounded by large bodies of water whose temperatures moderate the climate enough to extend the growing season. Cherry orchards dominate Door County\'s agricultural identity, but apple orchards follow the same geography and run through fall long after the cherry season ends. The south end of the county near Sturgeon Bay has several established pick-your-own operations. Southern Wisconsin near the Geneva Lakes area also has active orchards closer to the Chicago metro population.',
    tip: 'A Door County fall weekend combines apple picking, fall foliage along the peninsula bluffs, and the exceptional food scene in Fish Creek and Ephraim — one of the Midwest\'s great autumn getaways.',
  },
  {
    slug: 'wyoming', name: 'Wyoming', capital: 'Cheyenne', capitalSlug: 'cheyenne',
    peak: 'September',
    regions: 'the Bighorn Basin near Lovell and Worland, the Star Valley in the west near Afton, and a handful of farms in Goshen County',
    varieties: 'Honeycrisp, Lodi, Transparent, and other cold-hardy varieties',
    intro: 'Apple picking season in Wyoming is concentrated in September, with the Bighorn Basin and Star Valley producing modest but genuine orchards in a state not often associated with fruit growing.',
    seasonDetail: 'Wyoming\'s harsh climate — early frosts, strong winds, and extreme cold — makes apple growing challenging everywhere in the state. The Bighorn Basin around Lovell and Worland sits in a rain shadow that provides more sunshine and slightly warmer temperatures than surrounding elevations, and the basin has a small but established orchard community. The Star Valley in the southwest, surrounded by mountains, also has some tree fruit production. Cold-hardy varieties specifically bred for short seasons are the foundation of Wyoming orchards.',
    tip: 'Wyoming apple orchards are a genuine discovery rather than a tourist destination — if you find one operating in September during travels through the state, stop in and support a grower who works hard against the climate to produce something rare.',
  },
];

const SITE_URL = 'https://orchards-nearme.com';
const PUB_DATE = '2025-07-01';
const UPDATED_DATE = '2026-07-01';
const UPDATED_LABEL = 'July 2026';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Turns a natural-language peak-season string ("late July through August") into
// the set of month indexes (0-11) it spans, for rendering as a visual chart.
function parsePeakMonths(peak) {
  if (/year-round/i.test(peak)) {
    return { yearRound: true, months: MONTHS_FULL.map(function (_, i) { return i; }) };
  }
  var found = [];
  MONTHS_FULL.forEach(function (name, i) {
    var pos = peak.toLowerCase().indexOf(name.toLowerCase());
    if (pos !== -1) found.push({ i: i, pos: pos });
  });
  found.sort(function (a, b) { return a.pos - b.pos; });
  if (!found.length) return { yearRound: false, months: [] };
  var start = found[0].i;
  var end = found[found.length - 1].i;
  var months = [];
  for (var m = start; m <= end; m++) months.push(m);
  return { yearRound: false, months: months };
}

// Compact 12-cell month timeline for a single state's blog post.
function seasonMiniChartHtml(peak) {
  var parsed = parsePeakMonths(peak);
  var label = parsed.yearRound ? 'year-round' : parsed.months.map(function (i) { return MONTHS_FULL[i]; }).join(', ');
  var cells = MONTHS.map(function (m, i) {
    var active = parsed.yearRound || parsed.months.indexOf(i) !== -1;
    return '<div class="season-mini-cell' + (active ? ' is-active' : '') + '"><span class="season-mini-month">' + m + '</span></div>';
  }).join('');
  return '<div class="season-mini-chart" role="img" aria-label="Peak apple picking months: ' + label + '">' + cells + '</div>';
}

// Full states x months chart for the blog index, so visitors can compare peak
// timing across the country at a glance.
function seasonChartTable(states) {
  var header = MONTHS.map(function (m) { return '<th scope="col">' + m + '</th>'; }).join('');
  var rows = states.map(function (s) {
    var parsed = parsePeakMonths(s.peak);
    var cells = MONTHS.map(function (_, i) {
      var active = parsed.yearRound || parsed.months.indexOf(i) !== -1;
      return '<td class="season-cell' + (active ? ' is-active' : '') + '">' + (active ? '<span class="sr-only">Peak</span>' : '') + '</td>';
    }).join('');
    return '        <tr><th scope="row"><a href="/blog/apple-picking-season-' + s.slug + '">' + s.name + '</a></th>' + cells + '</tr>';
  }).join('\n');
  return `      <div class="season-chart-wrap">
        <table class="season-chart">
          <caption class="sr-only">Apple picking peak season by state, month by month</caption>
          <thead>
            <tr><th scope="col">State</th>${header}</tr>
          </thead>
          <tbody>
${rows}
          </tbody>
        </table>
      </div>
      <p class="season-chart-legend"><span class="season-cell is-active season-chart-legend-swatch" aria-hidden="true"></span> Peak apple picking window</p>`;
}

function stateSlugToFindSlug(stateSlug) {
  return stateSlug;
}

function generatePage(state) {
  const { slug, name, capital, capitalSlug, peak, regions, varieties, intro, seasonDetail, tip } = state;
  const title = `Apple Picking Season ${name} | Granny Smith, Honeycrisp Apples Peak Times`;
  const desc = `${intro} Find pick-your-own apple orchards near ${capital}, ${name} on an interactive map.`;
  const canonical = `${SITE_URL}/blog/apple-picking-season-${slug}`;
  const findLink = `/find/apple-picking-orchards-near-${capitalSlug}-${slug.replace(/-/g, '-')}`;

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": `Apple Picking Season ${name}`,
    "description": desc,
    "url": canonical,
    "datePublished": PUB_DATE,
    "dateModified": UPDATED_DATE,
    "author": {
      "@type": "Organization",
      "name": "Orchards Near Me",
      "url": SITE_URL
    },
    "publisher": {
      "@type": "Organization",
      "name": "Orchards Near Me",
      "url": SITE_URL
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonical
    },
    "keywords": `apple picking season ${name}, apple picking ${name}, pick your own apples ${name}, apple orchards ${name}, best time to pick apples ${name}`,
  }, null, 2);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${desc.replace(/"/g, '&quot;')}" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />
  <meta property="og:description" content="${desc.replace(/"/g, '&quot;')}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${canonical}" />
  <meta property="article:published_time" content="${PUB_DATE}" />

  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32" />
  <link rel="icon" href="/favicon-192.png" type="image/png" sizes="192x192" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/css/style.css" />
  <script type="application/ld+json">
${jsonLd}
  </script>
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2173008413459742" crossorigin="anonymous"></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="container">
      <a class="brand" href="/" aria-label="Orchards Near Me home">
        <img src="/logo.png" alt="" class="logo-icon" />
        Orchards Near Me
      </a>
      <nav class="main-nav" aria-label="Primary">
        <a href="/">Home</a>
        <a href="/about.html">About</a>
        <a href="/blog" class="active">Blog</a>
        <a href="/listings">Listings</a>
        <a href="/find" class="cta">Find</a>
      </nav>
      <button type="button" class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="mobileNav" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
    </div>
    <nav class="mobile-nav" id="mobileNav" aria-label="Primary mobile">
      <a href="/">Home</a>
      <a href="/about.html">About</a>
      <a href="/blog" class="active">Blog</a>
      <a href="/listings">Listings</a>
      <a href="/find" class="cta">Find</a>
    </nav>
  </header>
  <script>
    (function () {
      var toggle = document.getElementById('navToggle');
      var menu = document.getElementById('mobileNav');
      if (!toggle || !menu) return;
      toggle.addEventListener('click', function () {
        var isOpen = menu.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
      menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          menu.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    })();
  </script>

  <main id="main" class="page">
    <div class="container">

      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true"> &rsaquo; </span>
        <a href="/blog">Blog</a>
        <span aria-hidden="true"> &rsaquo; </span>
        <span aria-current="page">Apple Picking Season ${name}</span>
      </nav>

      <article class="blog-post">
        <header class="blog-post-header">
          <h1>Apple Picking Season ${name}</h1>
          <p class="blog-post-lead">${intro}</p>
          <p class="blog-post-meta">Last updated: ${UPDATED_LABEL} &middot; Orchards Near Me</p>
        </header>

        <section class="season-snapshot" aria-labelledby="season-snapshot-heading-${slug}">
          <h2 id="season-snapshot-heading-${slug}" class="season-snapshot-title">Peak Season at a Glance</h2>
          ${seasonMiniChartHtml(peak)}
          <p class="season-snapshot-caption">Peak: <strong>${peak}</strong></p>
        </section>

        <div class="blog-post-body">
          <h2>When Is Apple Picking Season in ${name}?</h2>
          <p>${seasonDetail}</p>

          <h2>Where to Pick Apples in ${name}</h2>
          <p>The best apple picking in ${name} is concentrated in ${regions}. These areas combine the climate, soil, and agricultural tradition that makes pick-your-own orchards viable and worthwhile as a destination.</p>
          <p>Use the map on our <a href="${findLink}">apple picking near ${capital}, ${name}</a> page to find specific orchards by ZIP code and read visitor reviews before you go.</p>

          <h2>Best Apple Varieties in ${name}</h2>
          <p>${name} orchards commonly grow ${varieties}. Availability varies by farm and time of season — earlier varieties like Gala and Zestar kick things off, while Honeycrisp, Fuji, and later-ripening types extend the season toward its close. When you arrive, ask the farm staff which rows are currently at peak — that guidance is worth more than any printed list.</p>

          <h2>Tips for Apple Picking in ${name}</h2>
          <p>${tip}</p>
          <p>General tips that apply everywhere: bring a bag or use the farm's containers, wear closed-toe shoes (fallen apples make the ground soft and uneven), dress in layers since orchard mornings can be cool even in September, and bring cash — many smaller farms are not set up for card payments at the stand.</p>

          <h2>Find Apple Orchards Near You in ${name}</h2>
          <p>Our interactive map pulls from hundreds of orchards across the state. <a href="${findLink}">Search apple picking near ${capital}</a> to see what is closest to you, or browse the full <a href="/find/apple-picking-orchards-near-me">Apple Picking Near Me</a> directory for the whole country.</p>
        </div>
      </article>

      <section class="related-links seo-content" style="padding-top: 0;">
        <h2>More Apple Picking Guides</h2>
        <ul class="related-links-list">
          <li><a href="/find/apple-picking-orchards-near-me">Apple Picking Orchards Near Me</a></li>
          <li><a href="/find/cherry-picking-orchards-near-me">Cherry Picking Orchards Near Me</a></li>
          <li><a href="/find/berry-picking-orchards-near-me">Berry Picking Orchards Near Me</a></li>
          <li><a href="/find/peach-picking-orchards-near-me">Peach Picking Orchards Near Me</a></li>
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
</body>
</html>`;
}

function generateIndex(states) {
  const cards = states.map(s => `      <a class="blog-card" href="/blog/apple-picking-season-${s.slug}">
        <div class="blog-card-body">
          <h2 class="blog-card-title">Apple Picking Season ${s.name}</h2>
          <p class="blog-card-meta">Peak season: ${s.peak}</p>
          <p class="blog-card-excerpt">${s.intro}</p>
          <span class="blog-card-cta">Read guide &rarr;</span>
        </div>
      </a>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Apple Picking Season Guides by State | Orchards Near Me Blog</title>
  <meta name="description" content="Find out when apple picking season starts in every state. State-by-state guides to peak apple harvest times, best orchards, and top apple varieties across all 50 states." />
  <link rel="canonical" href="https://orchards-nearme.com/blog" />
  <meta property="og:title" content="Apple Picking Season Guides by State | Orchards Near Me Blog" />
  <meta property="og:description" content="State-by-state guides to apple picking season timing, best orchards, and top apple varieties across all 50 states." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://orchards-nearme.com/blog" />

  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32" />
  <link rel="icon" href="/favicon-192.png" type="image/png" sizes="192x192" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/css/style.css" />
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2173008413459742" crossorigin="anonymous"></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="container">
      <a class="brand" href="/" aria-label="Orchards Near Me home">
        <img src="/logo.png" alt="" class="logo-icon" />
        Orchards Near Me
      </a>
      <nav class="main-nav" aria-label="Primary">
        <a href="/">Home</a>
        <a href="/about.html">About</a>
        <a href="/blog" class="active">Blog</a>
        <a href="/listings">Listings</a>
        <a href="/find" class="cta">Find</a>
      </nav>
      <button type="button" class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="mobileNav" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
    </div>
    <nav class="mobile-nav" id="mobileNav" aria-label="Primary mobile">
      <a href="/">Home</a>
      <a href="/about.html">About</a>
      <a href="/blog" class="active">Blog</a>
      <a href="/listings">Listings</a>
      <a href="/find" class="cta">Find</a>
    </nav>
  </header>
  <script>
    (function () {
      var toggle = document.getElementById('navToggle');
      var menu = document.getElementById('mobileNav');
      if (!toggle || !menu) return;
      toggle.addEventListener('click', function () {
        var isOpen = menu.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
      menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          menu.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    })();
  </script>

  <main id="main" class="page">
    <div class="container">
      <h1>Apple Picking Season Guides</h1>
      <p class="lead">When does apple picking season start in your state? Browse our state-by-state guides to peak harvest timing, the best regions, top varieties, and tips for planning your visit.</p>
      <p class="blog-post-meta">Last updated: ${UPDATED_LABEL} &middot; Orchards Near Me</p>

      <h2 class="season-chart-heading">Apple Picking Season by State: Peak Months at a Glance</h2>
      <p>Every state's peak window, side by side. Find your state's row to see which months to plan around, then click through for the full guide.</p>
${seasonChartTable(states)}

      <h2 class="season-chart-heading">Tips &amp; Guides</h2>
      <div class="blog-grid">
      <a class="blog-card" href="/blog/how-to-store-fresh-picked-strawberries">
        <div class="blog-card-body">
          <h2 class="blog-card-title">How to Store Fresh-Picked Strawberries So They Last All Week</h2>
          <p class="blog-card-meta">Storage tips</p>
          <p class="blog-card-excerpt">A flat of fresh-picked strawberries can go from perfect to moldy in two days if you store it wrong. Here's the vinegar-rinse method, the right container, and the mistakes to avoid.</p>
          <span class="blog-card-cta">Read guide &rarr;</span>
        </div>
      </a>
      </div>

      <h2 class="season-chart-heading">State-by-State Apple Picking Guides</h2>
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
</body>
</html>`;
}

// Generate all files
let count = 0;
for (const state of STATES) {
  const html = generatePage(state);
  const outPath = path.join(OUT_DIR, `apple-picking-season-${state.slug}.html`);
  fs.writeFileSync(outPath, html, 'utf8');
  count++;
}
console.log(`Generated ${count} state blog pages.`);

const indexHtml = generateIndex(STATES);
fs.writeFileSync(path.join(OUT_DIR, 'index.html'), indexHtml, 'utf8');
console.log('Generated blog/index.html');
