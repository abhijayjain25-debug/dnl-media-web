/**
 * Delhi News Live — Data Store
 * Broadsheet single-scroll newspaper edition
 */

const SECTIONS = ['Nation', 'City', 'World', 'Politics', 'Business', 'Sport', 'Culture', 'Opinion'];

const DEFAULT_SETTINGS = {
    id: 1,
    paper_name: "Delhi News Live",
    tagline: "National English Daily",
    edition_line: "METRO CITY",
    website_line: "www.delhinewslive.co.in",
    rni_line: "RNI : DELENG2016/66892",
    date_mode: "auto",
    custom_date: "",
    masthead_url: "assets/logo.png",
    editor_name: "SYED WAJID",
    editor_title: "Executive Editor",
    editor_bio: `is a seasoned and veteran journalist with an experience of more than two decades. Writing with a flair and passion; crime and politics have been his forte. He has written more than 15000 pieces comprising articles, reports, features and editorials in the past 25 years.

Syed Wajid popularly known as Sufi, is a PIB accredited journalist who has contributed to various media houses including The Hindu, Times of India, Hindustan Times, National Herald, Uday India, Loksatya and Face Group.

He has been working as an executive editor for Delhi News Live, an English daily.

Besides, he has been editing several other english magazines and periodicals as well.`,
    editor_instagram: "https://www.instagram.com/sufijourno?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==",
    editor_twitter: "https://x.com/journo_sufi?s=20",
    editor_facebook: "https://www.facebook.com/sufijourno",
    editor_blog: "https://sufijourno.blogspot.com/"
};

/**
 * placement values:
 *   "lead"            → full-width banner lead with 3-col body (one per edition — front page)
 *   "front_secondary" → right-side-rail boxed story (image + head + excerpt)
 *   "col3"            → standard 3-column story in continuation scroll
 *   "col2"            → 2-column story in continuation scroll
 *   "col1"            → 1-column brief / sidebar in continuation scroll
 *
 * sort_order controls display sequence on the page scroll.
 */
const INITIAL_ARTICLES = [
    /* ─── FRONT PAGE LEAD ─── */
    {
        id: "art-1-lead",
        slug: "a-leaderless-movement-forced-the-government-to-bend",
        headline: "A LEADERLESS MOVEMENT FORCED THE GOVERNMENT TO BEND",
        standfirst: "GOVERNMENT MISERABLY FAILED TO TERRORIZE THE CHARGED GENZ WITH ITS RELIGIOUS TRUMP CARD AND 'HINDU IN DANGER' NARRATIVE.",
        section: "Nation",
        body: `The CJP has kind of won the battle pitched well but Delhi is still a long way with tougher fights in the offing. It has undoubtedly made its presence felt across the country and world as a whole without getting crushed against the barbaric force of the government's police force. But nothing much has happened, it's too early to celebrate honeymoon times.

Prabhat Joshi is the new man in to helm the ministry and Dharmendra Pradhan will be accommodated and promoted onto a better berth as the high command does not even think of brushing the trump card aside seeing the assembly polls on the card and the general elections in 2029.

## A VICTORY FOR PEOPLE, LOKTANTRA NOT POLITICIANS

The resignation of Union Education Minister Dharmendra Pradhan marks a significant political setback for a government that had refused to yield despite weeks of sustained protests. For thousands of students and citizens who occupied the streets, it is a moment that reaffirms the strength of democratic resistance and the power of collective action. Yet, this triumph must remain the people's victory. The movement should guard itself against being hijacked by political parties eager to reclaim relevance after losing the public pedestal from which to harangue the government. The dais must belong only to the students not the white clads.

## QUESTIONS OVER POLICE CONDUCT

The protests also raised disturbing allegations of excessive force by the Delhi Police. Claims that Inspector Rathi shoved a baton into the back of a woman protester, allegations that Sandeep Lamba deputed in northeast district as additional DCP slapped a woman in full public view. One Honey Dagar alleged to be a Delhi Police constable assaulted students; he needs to be questioned and examined.

Equally, questions are being asked of Police Commissioner Anurag Kumar, who is expected to take cognizance of these allegations and ensure that any instances of brutality are impartially investigated for legit accountability.

## MEDIA'S CREDIBILITY UNDER SCRUTINY

The mainstream media, too, came under sharp criticism. Many protesters accused several television channels of presenting a one-sided narrative by running their agenda and acting as just the government's mouthpiece. The pent-up angst spilled over onto journalists on the ground, with some reporters allegedly being manhandled, abused and even thrashed badly because they were perceived as advancing the ruling establishment's agenda. Such attacks on media personnel remain unacceptable and acutely condemnable, irrespective of differences over editorial coverage or their ethics and culture.

## SOCIAL MEDIA KEPT THE FLAME ALIVE

Unlike conventional media, social media emerged as the principal force that transformed scattered protests into a nationwide movement. It amplified voices, mobilised support and ensured that the agitation remained in the public consciousness. Without these digital platforms, many believe the movement would have remained isolated and politically inconsequential.

## THE STRUGGLE IS FAR FROM OVER

The campaign's success owes much to activists including Abhijeet Dipke, Neha Bora, Sourav Das and student organisations such as AISA and SFI in particular from JNU, who remained committed from the outset. But even after securing a major concession, the larger fight for accountability and democratic rights is far from over. As supporters celebrate this milestone, they also recognise that the road ahead remains long and bumpy and for many, Delhi is only the beginning of a much larger democratic journey.`,
        image_url: "assets/main.jpg",
        image_caption: "Protesters raising slogans and waving the Indian flag at Jantar Mantar",
        image_layout: "top",
        is_breaking: true,
        views: 1420,
        author_name: "SYED WAJID",
        placement: "lead",
        sort_order: 0,
        published: true,
        published_at: "2026-08-29T07:11:05.617844+00:00"
    },

    /* ─── FRONT PAGE SIDE-RAIL (right column) ─── */
    {
        id: "art-2-genz",
        slug: "genz-awakens-to-reshape-and-redefine-politics",
        headline: "GENZ AWAKENS TO RESHAPE AND REDEFINE POLITICS",
        standfirst: "How India's youth broke traditional electoral orthodoxies through creative dissent.",
        section: "Nation",
        body: `The Jantar Mantar protest was not merely about forcing the resignation of Education Minister Dharmendra Pradhan; it marked the emergence of a new grammar of democratic resistance shaped by India's Gen Z. The movement demonstrated that political dissent today is expressed not only through marches and slogans but also through satire, memes, humour and viral digital content that can influence public opinion and compel those in power to respond.

## THE DIGITAL TOWN SQUARE

For weeks, hashtags outpaced prime-time television debates. Campus youth coordinated logistics, medical aid, legal support, and media fact-checking entirely through decentralized chat networks and open broadcasts. Traditional political strategists found themselves unable to anticipate the viral speed and decentralized nature of the youth mobilization.

## BEYOND PARTISAN DIVIDES

Unlike conventional party-led rallies where cadres are bused in from peripheral districts, this mobilization was spontaneous, self-funded, and distinctly non-partisan. It challenged stereotypes of young people as politically indifferent and proved that creativity can be as powerful as confrontation. Above all, the protest signalled that the language, strategy and platforms of Indian politics are undergoing a profound transition and transformation.`,
        image_url: "assets/center.jpg",
        image_caption: "A young protester holding the national flag at the historic mobilization",
        image_layout: "left",
        views: 940,
        author_name: "SYED WAJID",
        placement: "front_secondary",
        sort_order: 1,
        published: true,
        published_at: "2026-08-29T07:11:05.617844+00:00"
    },
    {
        id: "art-3-opinion",
        slug: "a-peoples-victory-that-must-not-become-a-political-stage",
        headline: "A PEOPLE'S VICTORY THAT MUST NOT BECOME A POLITICAL STAGE",
        standfirst: "Students must protect their civic autonomy from opportunist party machines.",
        section: "Opinion",
        body: `The resignation of Dharmendra Pradhan is being celebrated as a people's victory, but if the movement now becomes a political stage, it risks surrendering the moral authority that forced the government to blink.

## THE TEMPTATION OF CO-OPTATION

As the dust settles over central Delhi, prominent opposition figures have begun attempting to claim the victory for their own electoral platforms. Student organizers have rightly stood firm, refusing to yield the microphone or allow party flags on the public dias.

## PRESERVING MORAL HIGH GROUND

When a movement arises from authentic public grievance—unblemished by party tickets or backroom manifestos—it commands a moral clarity that no sitting government can ignore. The moment partisan interests take the steering wheel, that clarity dissipates into familiar political noise. The citizens who stood on the tarmac in the Delhi monsoon must remember why they won.`,
        image_url: "assets/pradhan.jpg",
        image_caption: "Union Education Minister Dharmendra Pradhan addressing a media conference",
        image_layout: "right",
        views: 620,
        author_name: "EDITORIAL BOARD",
        placement: "front_secondary",
        sort_order: 2,
        published: true,
        published_at: "2026-08-29T07:11:05.617844+00:00"
    },

    /* ─── CONTINUATION SCROLL — ROW 1 (3 columns) ─── */
    {
        id: "art-4-city",
        slug: "delhi-metro-expands-phase-iv-underground-corridors",
        headline: "DELHI METRO PHASE IV: TUNNELLING COMPLETE ON GOLDEN LINE",
        standfirst: "New 28-km underground link will cut transit time between Aerocity and Tughlakabad to just 22 minutes.",
        section: "City",
        body: `The Delhi Metro Rail Corporation has achieved a major milestone in its Phase IV expansion, completing tunneling operations for the Golden Line corridor connecting Aerocity to Tughlakabad.

## REDUCING CAPITAL CONGESTION

Urban transit analysts estimate that the line will take over 85,000 passenger vehicles off the Ring Road and Mehrauli-Badarpur corridors daily. With 15 new stations—including deep underground interchanges at Saket and Chhatarpur—the Golden Line provides high-speed transit for South and Outer Delhi residents.

## COMMITTED TO SUSTAINABILITY

DMRC Managing Director confirmed that all Phase IV stations will incorporate solar rooftop panels and 100% wastewater recycling systems, setting a new environmental benchmark for urban transit across Asia.`,
        image_url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80",
        image_caption: "DMRC technicians reviewing underground tracks in the Golden Line tunnel",
        image_layout: "banner",
        views: 1250,
        author_name: "PRIYA SHARMA",
        placement: "col3",
        sort_order: 10,
        published: true,
        published_at: "2026-08-29T08:00:00.000Z"
    },
    {
        id: "art-5-politics",
        slug: "parliament-standing-committee-debates-landmark-civic-reforms-bill",
        headline: "PARLIAMENT COMMITTEE TABLES LANDMARK CIVIC REFORMS BILL",
        standfirst: "Cross-party consensus emerges on strengthening municipal body financial autonomy across megacities.",
        section: "Politics",
        body: `In a rare display of bipartisan unity, the Parliamentary Standing Committee on Urban Development tabled recommendations for the National Urban Governance Charter yesterday afternoon.

## EMPOWERING LOCAL BODIES

The proposed legislation seeks to devolve direct tax collection powers and infrastructure bond issuance capabilities to municipal corporations representing cities with populations exceeding five million.

## HEATED DEBATE OVER AUDIT POWERS

While members agreed on the need for fiscal decentralization, intense debate centered on third-party digital audits and state government oversight. The draft bill is scheduled for debate during the upcoming winter session of Parliament.`,
        image_url: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80",
        image_caption: "Parliament House illuminated during the ongoing committee deliberations",
        author_name: "ROHIT MALHOTRA",
        placement: "col3",
        sort_order: 11,
        published: true,
        published_at: "2026-08-29T08:30:00.000Z"
    },
    {
        id: "art-6-business",
        slug: "ncr-startup-corridors-cross-12b-in-venture-financing",
        headline: "NCR STARTUP CORRIDORS CROSS $12B IN VENTURE FINANCING AMID TECH SURGE",
        standfirst: "Gurugram and Noida emerge as primary hubs for AI automation, green mobility, and enterprise SaaS.",
        section: "Business",
        body: `Venture capital investment into the National Capital Region has surged past $12 billion this calendar year, according to newly released industry data from the Indian Angel Network and Venture Intelligence.

## SURGE IN DEEP-TECH AND MOBILITY

Startups based in Cyber City and Greater Noida accounted for 44% of all series A and series B rounds in Northern India, with specialized AI applications and electric vehicle supply chains leading deal values.

## INSTITUTIONAL CAPITAL INFLOW

Global private equity funds have steadily expanded their on-ground desks in New Delhi, signaling strong international investor confidence in India's technology ecosystem and expanding domestic consumer base.`,
        image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80",
        image_caption: "High-rise commercial tech towers in Gurugram's bustling business district",
        author_name: "ANANYA SEN",
        placement: "col3",
        sort_order: 12,
        published: true,
        published_at: "2026-08-29T09:00:00.000Z"
    },

    /* ─── CONTINUATION SCROLL — ROW 2 (full-width 3-col with image) ─── */
    {
        id: "art-7-world",
        slug: "global-climate-summit-ratifies-carbon-offset-benchmarks",
        headline: "GLOBAL CLIMATE SUMMIT IN GENEVA RATIFIES CARBON OFFSET BENCHMARKS FOR MEGACITIES",
        standfirst: "Delegations from 68 nations agree on binding clean-air protocols and urban green canopy targets.",
        section: "World",
        body: `The United Nations Environmental Assembly concluded its five-day extraordinary summit in Geneva today with the formal ratification of the Urban Clean Air Framework. The agreement mandates binding greenhouse gas reduction schedules for all cities with populations above two million by 2030.

## TARGETS FOR DEVELOPING ECONOMIES

Under the agreement, a dedicated $40 billion global green transition fund will assist rapidly growing metropolitan areas in replacing diesel transport fleets and installing continuous air monitoring grids.

## INDIA'S LEADERSHIP ROLE

The Indian delegation was instrumental in drafting the climate adaptation clause, ensuring equitable technology transfers and financial support for municipal composting and green-belt expansions. India's Environment Minister described the accord as a generational compact for liveable cities.

## CARBON CREDIT MARKETS

The treaty also establishes the first binding international protocol for verified urban carbon credits, allowing certified cities to trade emissions offsets across national boundaries beginning in 2027.`,
        image_url: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80",
        image_caption: "Delegates at the UN Assembly Hall in Geneva for the final treaty signing ceremony",
        author_name: "DEVRAJ BANERJEE",
        placement: "col3",
        sort_order: 20,
        published: true,
        published_at: "2026-08-29T09:30:00.000Z"
    },
    {
        id: "art-8-sport",
        slug: "kotla-roars-as-capital-secures-historic-ranji-trophy-victory",
        headline: "KOTLA ROARS AS CAPITAL SECURES HISTORIC RANJI SEMI-FINAL VICTORY",
        standfirst: "Sensational final-day bowling spell by 21-year-old pacer bowls Delhi into the championship final against Karnataka.",
        section: "Sport",
        body: `Arun Jaitley Stadium witnessed pure drama this evening as Delhi clinched a thrilling 42-run victory against Mumbai on day four of the Ranji Trophy semi-final. A capacity crowd erupted as the last wicket fell with just three overs remaining.

## A FIERY SPELL OF FAST BOWLING

Chasing a modest target of 214 on a wearing fourth-day pitch, the visitors crumbled before a relentless opening spell that dismantled the middle order in under forty-five minutes. Six wickets fell for just 38 runs in a devastating passage of play.

## THE ROAD TO THE FINALS

With this victory, the Delhi squad heads into next week's grand final in Bengaluru with towering confidence and immense home fan support. Coach praised the discipline and temperament shown by the young bowling attack throughout the tournament.`,
        image_url: "https://images.unsplash.com/photo-1531415074868-036b1c57e3ce?w=800&auto=format&fit=crop&q=80",
        image_caption: "The Delhi cricket team celebrating after taking the final match-winning wicket at Kotla",
        author_name: "VIKRAM RATHORE",
        placement: "col3",
        sort_order: 21,
        published: true,
        published_at: "2026-08-29T10:00:00.000Z"
    },
    {
        id: "art-9-culture",
        slug: "heritage-restoration-of-shahjahanabad-havelis",
        headline: "HERITAGE RESTORATION BREATHES NEW LIFE INTO OLD DELHI'S HAVELIS",
        standfirst: "Architects and local families collaborate to restore 19th-century courtyards and Mughal stonework in Shahjahanabad.",
        section: "Culture",
        body: `In the winding alleys of Chandni Chowk and Ballimaran, a grassroots architectural renaissance is quietly transforming centuries-old residences into thriving cultural centers, artisan workshops, and public museums.

## PRESERVING THE WALLED CITY

Supported by the Delhi Heritage Preservation Trust, conservation architects are using traditional lime-plaster techniques and red sandstone masonry to restore cracked archways and ornate wooden jharokhas.

## LIVING HISTORY FOR NEW GENERATIONS

"These havelis are not dead monuments; they are living testaments to the composite culture and poetry of Shahjahanabad," explains lead historian Zoya Qureshi. The restored spaces will host free evening mushairas and heritage craft exhibitions starting this autumn.`,
        image_url: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80",
        image_caption: "Restored Mughal-era archway in Old Delhi's historic Ballimaran quarter",
        author_name: "MEERA KAPOOR",
        placement: "col3",
        sort_order: 22,
        published: true,
        published_at: "2026-08-29T10:30:00.000Z"
    },

    /* ─── CONTINUATION SCROLL — ROW 3 (2-col + 1-col briefs) ─── */
    {
        id: "art-10-city-yamuna",
        slug: "yamuna-cleanup-mission-mobilizes-citizen-volunteers",
        headline: "YAMUNA CLEANUP MOBILIZES 10,000 CITIZEN VOLUNTEERS ALONG 22-KM FLOODPLAIN",
        standfirst: "Weekend desilting and plantation drives clear 140 tons of non-biodegradable waste along the riverbank.",
        section: "City",
        body: `From Wazirabad down to the Okhla Barrage, thousands of college students, civil society members, and environmental groups joined hands for the largest community cleanup in the capital's recent history.

## COMMUNITY-LED CONSERVATION

Equipped with protective gear and bio-dredging nets, volunteer teams collected floating plastic debris while forest department officials planted over 15,000 native wetland saplings to restore natural riparian filtration.

## CALL FOR STRICTER INDUSTRIAL MONITORS

Community leaders reiterated demands for real-time digital monitoring at industrial drain outflows into the river, calling on civic regulators to enforce immediate closure of non-compliant electroplating and dyeing factories.`,
        image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
        image_caption: "Volunteers gathering along the Yamuna banks for the community ecological drive",
        author_name: "PRIYA SHARMA",
        placement: "col2",
        sort_order: 30,
        published: true,
        published_at: "2026-08-29T11:00:00.000Z"
    },
    {
        id: "art-12-business-retail",
        slug: "retail-inflation-dips-across-northern-corridors",
        headline: "RETAIL INFLATION DIPS AS HARVEST ARRIVALS STABILIZE PRICES",
        standfirst: "Vegetable and edible oil prices ease in Azadpur and Ghazipur wholesale markets.",
        section: "Business",
        body: `Consumer price inflation across the National Capital Region moderated to 4.1% this month, providing welcome relief to household budgets across Delhi, Gurgaon, and Noida.

## MANDI ARRIVALS BOOST SUPPLY

Fresh crop arrivals from Punjab, Haryana, and Western Uttar Pradesh have eased wholesale rates for staples including tomatoes, onions, and wheat at the Azadpur and Ghazipur agricultural markets.

## COMMODITY OUTLOOK

Market analysts project stable retail prices through the festive season, supported by efficient cold chain logistics and steady fuel prices along major freight transport corridors.`,
        image_url: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80",
        image_caption: "Traders and consumers at Azadpur Mandi during early morning wholesale trading",
        author_name: "ANANYA SEN",
        placement: "col1",
        sort_order: 31,
        published: true,
        published_at: "2026-08-29T12:00:00.000Z"
    },
    {
        id: "art-13-opinion-journalism",
        slug: "why-citizen-journalism-remains-the-defense-of-democracy",
        headline: "WHY CITIZEN JOURNALISM IS THE ULTIMATE DEFENSE OF DEMOCRACY",
        standfirst: "When television studios trade truth for access, ground reporting becomes a civic duty.",
        section: "Opinion",
        body: `Freedom of the press was never intended to be the exclusive preserve of well-funded media conglomerates or privileged studio anchors. Historically, some of the most consequential dispatches were printed in small basements by journalists driven solely by truth.

## THE STREET AS THE REAL EDITORIAL DESK

Today, when algorithmic feeds and corporate sponsors distort news agendas, the citizen reporter with a notepad and a phone camera on the street provides the vital counterweight.

## OUR EDITORIAL PROMISE

Delhi News Live was founded on the conviction that honest, uncompromising reportage belongs to the people. We remain dedicated to verifying facts, questioning authority, and providing a fearless platform for the issues that truly matter to everyday citizens.`,
        image_url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=80",
        image_caption: "Vintage newsroom press and modern mobile reporting tools side by side",
        author_name: "SYED WAJID",
        placement: "col1",
        sort_order: 32,
        published: true,
        published_at: "2026-08-29T11:30:00.000Z"
    },

    /* ─── CONTINUATION SCROLL — ROW 4 (3-col horizontal strip) ─── */
    {
        id: "art-14-nation-polls",
        slug: "five-state-assembly-polls-scheduled-for-november-december",
        headline: "ELECTION COMMISSION SCHEDULES FIVE STATE POLLS FOR NOVEMBER–DECEMBER",
        standfirst: "Bihar, Jharkhand, and three northeastern states to go to the polls in a staggered seven-phase schedule.",
        section: "Nation",
        body: `The Election Commission of India announced yesterday the formal schedule for assembly elections in five states, setting the stage for the most consequential sub-national electoral contests since the 2024 general elections.

## PHASE-WISE SCHEDULE

Voting will be conducted across seven phases between November 12 and December 9, with results to be declared on December 12. Security arrangements will involve over 400,000 central paramilitary personnel deployed across sensitive constituencies.

## POLITICAL REALIGNMENTS

Political parties have already begun intensive alliance negotiations. The ruling coalition at the centre faces stiff challenges in Bihar and Jharkhand, where local anti-incumbency and agrarian distress have reshuffled voter loyalties significantly since the last assembly polls.`,
        image_url: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&auto=format&fit=crop&q=80",
        image_caption: "Election Commission officials announcing the poll schedule at a press conference in New Delhi",
        author_name: "ROHIT MALHOTRA",
        placement: "col3",
        sort_order: 40,
        published: true,
        published_at: "2026-08-29T13:00:00.000Z"
    },
    {
        id: "art-15-world-india-us",
        slug: "india-us-sign-advanced-semiconductor-partnership-agreement",
        headline: "INDIA AND US SIGN ADVANCED SEMICONDUCTOR PARTNERSHIP AGREEMENT",
        standfirst: "Historic pact will see joint fabrication plants established in Telangana and Tamil Nadu by 2028.",
        section: "World",
        body: `India and the United States signed a landmark semiconductor technology partnership agreement at the White House yesterday, committing both nations to joint research, supply chain integration, and co-production of advanced chips.

## STRATEGIC TECHNOLOGY CORRIDOR

The agreement establishes a bilateral technology corridor that will see American semiconductor firms co-invest in greenfield fabrication plants in Hyderabad's Fab City and a dedicated electronics cluster near Chennai.

## GEOPOLITICAL SIGNIFICANCE

Senior officials described the agreement as a cornerstone of the broader India-US strategic partnership, reducing joint exposure to concentration risks in the East Asian semiconductor supply chain.`,
        image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
        image_caption: "Prime Minister and US President signing the semiconductor partnership agreement at the White House",
        author_name: "DEVRAJ BANERJEE",
        placement: "col3",
        sort_order: 41,
        published: true,
        published_at: "2026-08-29T13:30:00.000Z"
    },
    {
        id: "art-16-sport-badminton",
        slug: "sindhu-saina-mentor-new-generation-at-national-training-camp",
        headline: "SINDHU AND SAINA MENTOR NEW GENERATION AT NATIONAL BADMINTON CAMP",
        standfirst: "Two Olympic medallists lead a fortnight-long residential training camp preparing 24 juniors for the 2028 Games cycle.",
        section: "Sport",
        body: `The Pullela Gopichand Badminton Academy in Hyderabad is buzzing with renewed energy as PV Sindhu and Saina Nehwal have taken on mentoring roles for the national junior squad in a fortnight-long residential camp.

## BUILDING THE BENCH

Under the supervision of national coach Gopichand, the camp focuses on physical conditioning, technical stroke refinement, and competitive temperament—qualities that both Sindhu and Saina believe separated their generation from their predecessors.

## GRASSROOTS TRANSFORMATION

The camp is part of a broader government initiative to identify and nurture badminton talent from non-metropolitan districts, widening the national talent pipeline beyond the traditional strongholds of Hyderabad and Bengaluru.`,
        image_url: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80",
        image_caption: "National badminton champions conducting drills with junior players at Gopichand Academy",
        author_name: "VIKRAM RATHORE",
        placement: "col3",
        sort_order: 42,
        published: true,
        published_at: "2026-08-29T14:00:00.000Z"
    }
];

class DataStore {
    constructor() {
        this.STORAGE_KEY_ARTICLES = 'dnl_articles_v5_scroll';
        this.STORAGE_KEY_SETTINGS = 'dnl_settings_v5_scroll';
        this.STORAGE_KEY_INTERVIEWS = 'dnl_interviews_v1';
        this.STORAGE_KEY_CLIPPINGS = 'dnl_clippings_v1';
        this.STORAGE_KEY_AUTH = 'dnl_newsroom_auth';
        this.supabase = window.supabaseClient || null;
        this.isSyncing = false;
        this.init();
    }

    init() {
        // Ensure initial local cache is populated
        const storedArticles = localStorage.getItem(this.STORAGE_KEY_ARTICLES);
        if (!storedArticles || JSON.parse(storedArticles).length < INITIAL_ARTICLES.length) {
            localStorage.setItem(this.STORAGE_KEY_ARTICLES, JSON.stringify(INITIAL_ARTICLES));
        }
        if (!localStorage.getItem(this.STORAGE_KEY_SETTINGS)) {
            localStorage.setItem(this.STORAGE_KEY_SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
        }
        if (!localStorage.getItem(this.STORAGE_KEY_CLIPPINGS)) {
            localStorage.setItem(this.STORAGE_KEY_CLIPPINGS, JSON.stringify([]));
        }

        // Initialize Supabase sync and realtime listeners
        this.initSupabase();
    }

    async initSupabase() {
        if (!this.supabase && window.supabaseClient) {
            this.supabase = window.supabaseClient;
        }

        if (!this.supabase) {
            console.log('ℹ️ Running in local cache mode (Supabase client not initialized yet).');
            return;
        }

        console.log('⚡ Initializing Supabase backend connection...');
        await this.syncFromSupabase();
        this.initRealtime();
        this.initAuthListener();
    }

    /**
     * Synchronize all data from Supabase into memory and local storage
     */
    async syncFromSupabase() {
        if (!this.supabase || this.isSyncing) return;
        this.isSyncing = true;

        try {
            // 1. Sync Settings
            const { data: settingsData, error: settingsError } = await this.supabase
                .from('settings')
                .select('*')
                .eq('id', 1)
                .maybeSingle();

            if (!settingsError && settingsData) {
                const rawWebsite = settingsData.website_line;
                const website_line = (!rawWebsite || rawWebsite === 'www.delhinewslive.in') 
                    ? DEFAULT_SETTINGS.website_line 
                    : rawWebsite;

                const mergedSettings = {
                    ...DEFAULT_SETTINGS,
                    paper_name: settingsData.paper_name || DEFAULT_SETTINGS.paper_name,
                    tagline: settingsData.tagline || DEFAULT_SETTINGS.tagline,
                    edition_line: settingsData.edition_line || DEFAULT_SETTINGS.edition_line,
                    website_line: website_line,
                    rni_line: settingsData.rni_line || DEFAULT_SETTINGS.rni_line,
                    date_mode: settingsData.date_mode || DEFAULT_SETTINGS.date_mode,
                    custom_date: settingsData.custom_date || DEFAULT_SETTINGS.custom_date,
                    masthead_url: settingsData.masthead_url || DEFAULT_SETTINGS.masthead_url,
                    interviews_visible: typeof settingsData.interviews_visible === 'boolean' ? settingsData.interviews_visible : true,
                    editor_name: settingsData.editor_name || DEFAULT_SETTINGS.editor_name,
                    editor_title: settingsData.editor_title || DEFAULT_SETTINGS.editor_title,
                    editor_bio: settingsData.editor_bio || DEFAULT_SETTINGS.editor_bio,
                    editor_instagram: settingsData.editor_instagram || DEFAULT_SETTINGS.editor_instagram,
                    editor_twitter: settingsData.editor_twitter || DEFAULT_SETTINGS.editor_twitter,
                    editor_facebook: settingsData.editor_facebook || DEFAULT_SETTINGS.editor_facebook,
                    editor_blog: settingsData.editor_blog || DEFAULT_SETTINGS.editor_blog
                };
                localStorage.setItem(this.STORAGE_KEY_SETTINGS, JSON.stringify(mergedSettings));
                if (typeof settingsData.interviews_visible === 'boolean') {
                    localStorage.setItem('dnl_interviews_visible', String(settingsData.interviews_visible));
                }
            } else if (settingsError && settingsError.code === 'PGRST116') {
                // Table exists but no row with id=1, seed it
                await this.supabase.from('settings').upsert({ id: 1, ...DEFAULT_SETTINGS, interviews_visible: true });
            }

            // 2. Check native columns & Sync Articles
            if (this.supabase) {
                try {
                    const { error: testColErr } = await this.supabase
                        .from('articles')
                        .select('image_layout')
                        .limit(1);
                    this.schemaHasLayoutColumns = !testColErr;
                } catch (e) {
                    this.schemaHasLayoutColumns = false;
                }
            }

            const { data: articlesData, error: articlesError } = await this.supabase
                .from('articles')
                .select('*')
                .order('sort_order', { ascending: true });

            if (!articlesError && articlesData) {
                if (articlesData.length > 0) {
                    const localArticles = this.getArticles();
                    const formatted = articlesData.map(a => {
                        let layout = a.image_layout;
                        let breaking = a.is_breaking;
                        let views = a.views;
                        let caption = a.image_caption || '';

                        // If native columns were missing, check if caption had metadata
                        const metaMatch = caption.match(/<!--dnl:(.*?)-->/);
                        if (metaMatch) {
                            try {
                                const meta = JSON.parse(metaMatch[1]);
                                if (!layout && meta.layout) layout = meta.layout;
                                if (typeof breaking !== 'boolean' && typeof meta.breaking === 'boolean') breaking = meta.breaking;
                                if ((views === undefined || views === null) && meta.views !== undefined) views = meta.views;
                            } catch (e) {}
                            caption = caption.replace(/<!--dnl:.*?-->/g, '').trim();
                        }

                        // Preserving existing cached local layout if not found above
                        const loc = localArticles.find(l => l.id === a.id);
                        if (!layout && loc && loc.image_layout) {
                            layout = loc.image_layout;
                        }

                        return {
                            ...a,
                            image_caption: caption,
                            image_layout: layout || 'top',
                            is_breaking: !!breaking,
                            views: parseInt(views, 10) || 0
                        };
                    });

                    try {
                        localStorage.setItem(this.STORAGE_KEY_ARTICLES, JSON.stringify(formatted));
                    } catch (quotaErr) {
                        console.warn('⚠️ LocalStorage quota warning in sync:', quotaErr);
                    }
                } else {
                    // Supabase articles table is empty -> seed initial articles to Supabase
                    console.log('🌱 Seeding initial articles to Supabase backend...');
                    await this.seedArticlesToSupabase();
                }
            } else if (articlesError) {
                console.warn('⚠️ Could not fetch articles from Supabase (using local cache):', articlesError.message);
            }

            // 3. Sync Interviews / Video Clippings
            const { data: interviewsData, error: interviewsError } = await this.supabase
                .from('interviews')
                .select('*')
                .order('created_at', { ascending: false });

            if (!interviewsError && interviewsData) {
                // Map snake_case to camelCase if needed
                const formatted = interviewsData.map(iv => ({
                    ...iv,
                    videoUrl: iv.video_url || iv.videoUrl || ''
                }));
                localStorage.setItem(this.STORAGE_KEY_INTERVIEWS, JSON.stringify(formatted));
            } else if (interviewsError) {
                console.warn('⚠️ Could not fetch interviews from Supabase:', interviewsError.message);
            }

            // 4. Synchronize Clippings / Gallery from Supabase
            let clippingsData = null;
            let clippingsError = null;
            try {
                const res = await this.supabase
                    .from('clippings')
                    .select('*')
                    .order('edition_date', { ascending: false });
                clippingsData = res.data;
                clippingsError = res.error;
            } catch (cErr) {
                clippingsError = cErr;
            }

            if (!clippingsError && clippingsData) {
                const formatted = clippingsData.map(c => ({
                    id: c.id,
                    imageUrl: c.image_url || c.imageUrl || '',
                    editionDate: c.edition_date || c.editionDate || '',
                    caption: c.caption || '',
                    created_at: c.created_at || new Date().toISOString()
                }));
                localStorage.setItem(this.STORAGE_KEY_CLIPPINGS, JSON.stringify(formatted));
            } else if (clippingsError) {
                console.warn('⚠️ Could not fetch clippings from Supabase (table may not exist yet):', clippingsError.message || clippingsError);
            }

            console.log('✅ Supabase data synchronization complete.');

            // Trigger UI update if app is ready
            if (window.dnlApp && typeof window.dnlApp.render === 'function') {
                window.dnlApp.render();
            }
        } catch (err) {
            console.error('❌ Error during Supabase synchronization:', err);
        } finally {
            this.isSyncing = false;
        }
    }

    /**
     * Seeds default articles to Supabase if the table is empty
     */
    async seedArticlesToSupabase() {
        if (!this.supabase) return;
        try {
            let seedPayload = INITIAL_ARTICLES;
            if (this.schemaHasLayoutColumns === false) {
                seedPayload = INITIAL_ARTICLES.map(art => {
                    const clean = { ...art };
                    const metaTag = `<!--dnl:{"layout":"${art.image_layout || 'top'}","breaking":${!!art.is_breaking},"views":${art.views || 0}}-->`;
                    clean.image_caption = art.image_caption ? `${art.image_caption} ${metaTag}` : metaTag;
                    delete clean.image_layout;
                    delete clean.is_breaking;
                    delete clean.views;
                    return clean;
                });
            }

            const { error } = await this.supabase
                .from('articles')
                .upsert(seedPayload, { onConflict: 'id' });

            if (error) {
                console.warn('⚠️ Failed to seed initial articles to Supabase:', error.message);
            } else {
                console.log(`✅ Successfully seeded ${INITIAL_ARTICLES.length} articles to Supabase.`);
            }
        } catch (err) {
            console.warn('⚠️ Error seeding articles:', err);
        }
    }

    /**
     * Setup Realtime listeners for instant multi-device synchronisation
     */
    initRealtime() {
        if (!this.supabase) return;

        try {
            this.supabase
                .channel('dnl-realtime-sync')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'articles' }, () => {
                    console.log('🔄 Realtime update received: articles');
                    this.syncFromSupabase();
                })
                .on('postgres_changes', { event: '*', schema: 'public', table: 'interviews' }, () => {
                    console.log('🔄 Realtime update received: interviews');
                    this.syncFromSupabase();
                })
                .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, () => {
                    console.log('🔄 Realtime update received: settings');
                    this.syncFromSupabase();
                })
                .on('postgres_changes', { event: '*', schema: 'public', table: 'clippings' }, () => {
                    console.log('🔄 Realtime update received: clippings');
                    this.syncFromSupabase();
                })
                .subscribe();
        } catch (err) {
            console.warn('⚠️ Realtime subscription could not be established:', err);
        }
    }

    initAuthListener() {
        if (!this.supabase) return;

        try {
            this.supabase.auth.onAuthStateChange((event, session) => {
                if (session) {
                    const localSession = {
                        user: session.user,
                        token: session.access_token,
                        logged_in_at: new Date().toISOString()
                    };
                    localStorage.setItem(this.STORAGE_KEY_AUTH, JSON.stringify(localSession));
                } else if (event === 'SIGNED_OUT') {
                    localStorage.removeItem(this.STORAGE_KEY_AUTH);
                }
            });
        } catch (err) {
            console.warn('⚠️ Auth state listener setup notice:', err);
        }
    }

    /* ─────────────────────────────────────────
     * SETTINGS & FURNITURE
     * ───────────────────────────────────────── */
    getSettings() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY_SETTINGS);
            return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
        } catch (e) {
            return DEFAULT_SETTINGS;
        }
    }

    async updateSettings(newSettings) {
        const current = this.getSettings();
        const updated = { ...current, ...newSettings };
        localStorage.setItem(this.STORAGE_KEY_SETTINGS, JSON.stringify(updated));

        // Sync with Supabase
        if (this.supabase) {
            try {
                const dbPayload = {
                    id: 1,
                    paper_name: updated.paper_name,
                    tagline: updated.tagline,
                    edition_line: updated.edition_line,
                    website_line: updated.website_line,
                    rni_line: updated.rni_line,
                    date_mode: updated.date_mode || 'auto',
                    custom_date: updated.custom_date || '',
                    masthead_url: updated.masthead_url,
                    interviews_visible: this.getInterviewsVisible(),
                    editor_name: updated.editor_name || 'SYED WAJID',
                    editor_title: updated.editor_title || 'Editor-in-Chief & Founder',
                    editor_bio: updated.editor_bio || '',
                    editor_instagram: updated.editor_instagram || 'https://www.instagram.com/sufijourno?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==',
                    editor_twitter: updated.editor_twitter || 'https://x.com/journo_sufi?s=20',
                    editor_facebook: updated.editor_facebook || 'https://www.facebook.com/sufijourno',
                    editor_blog: updated.editor_blog || 'https://sufijourno.blogspot.com/',
                    updated_at: new Date().toISOString()
                };
                const { error: upsertErr } = await this.supabase.from('settings').upsert(dbPayload, { onConflict: 'id' });
                if (upsertErr) {
                    console.warn('⚠️ Supabase full settings upsert warning:', upsertErr.message);
                    // Fallback to base columns if extended columns are not yet in Supabase schema
                    const basePayload = {
                        id: 1,
                        paper_name: updated.paper_name,
                        tagline: updated.tagline,
                        edition_line: updated.edition_line,
                        website_line: updated.website_line,
                        rni_line: updated.rni_line,
                        masthead_url: updated.masthead_url,
                        interviews_visible: this.getInterviewsVisible(),
                        updated_at: new Date().toISOString()
                    };
                    await this.supabase.from('settings').upsert(basePayload, { onConflict: 'id' });
                }
            } catch (err) {
                console.warn('⚠️ Failed to save settings to Supabase:', err);
            }
        }

        return updated;
    }

    /* ─────────────────────────────────────────
     * ARTICLES
     * ───────────────────────────────────────── */
    getArticles() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY_ARTICLES);
            const articles = data ? JSON.parse(data) : INITIAL_ARTICLES;
            return articles.map(a => ({
                ...a,
                placement: (a.placement || 'col3').toString().trim().toLowerCase(),
                column_pin: (a.column_pin || 'auto').toString().trim().toLowerCase(),
                image_layout: a.image_layout || 'top',
                is_breaking: !!a.is_breaking,
                views: parseInt(a.views, 10) || 0
            })).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        } catch (e) {
            return INITIAL_ARTICLES;
        }
    }

    getPublishedArticles() {
        return this.getArticles().filter(a => a.published !== false);
    }

    getArticleBySlug(slug) {
        return this.getArticles().find(a => a.slug === slug) || null;
    }

    getArticlesBySection(section) {
        const secLower = section.toLowerCase();
        return this.getPublishedArticles().filter(a => a.section && a.section.toLowerCase() === secLower);
    }

    getBreakingArticle() {
        return this.getPublishedArticles().find(a => a.is_breaking === true) || null;
    }

    async setBreakingArticle(articleId, isBreaking) {
        const articles = this.getArticles();
        articles.forEach(a => {
            if (a.id === articleId) {
                a.is_breaking = !!isBreaking;
            } else if (isBreaking) {
                a.is_breaking = false;
            }
        });
        localStorage.setItem(this.STORAGE_KEY_ARTICLES, JSON.stringify(articles));

        if (this.supabase) {
            try {
                await this.supabase
                    .from('articles')
                    .update({ is_breaking: !!isBreaking })
                    .eq('id', articleId);

                if (isBreaking) {
                    await this.supabase
                        .from('articles')
                        .update({ is_breaking: false })
                        .neq('id', articleId);
                }
            } catch (err) {
                console.warn('⚠️ Supabase breaking status sync note:', err);
            }
        }
    }

    recordArticleView(articleId) {
        if (!articleId) return;
        const sessionKey = 'dnl_view_' + articleId;
        if (sessionStorage.getItem(sessionKey)) return;
        sessionStorage.setItem(sessionKey, '1');

        const articles = this.getArticles();
        const target = articles.find(a => a.id === articleId || a.slug === articleId);
        if (!target) return;

        target.views = (parseInt(target.views, 10) || 0) + 1;
        localStorage.setItem(this.STORAGE_KEY_ARTICLES, JSON.stringify(articles));

        if (this.supabase) {
            this.supabase
                .from('articles')
                .update({ views: target.views })
                .eq('id', target.id)
                .then(({ error }) => {
                    if (error) console.warn('⚠️ Supabase view count sync note:', error.message);
                });
        }
    }

    async saveArticle(article) {
        const articles = this.getArticles();
        let slug = article.slug ? this.slugify(article.slug) : this.slugify(article.headline);
        // Ensure slug does not collide with another existing article with a different id
        if (articles.some(a => a.slug === slug && a.id !== article.id)) {
            slug = `${slug}-${Math.random().toString(36).substr(2, 4)}`;
        }

        const normalizedPlacement = (article.placement || 'col3').toString().trim().toLowerCase();

        const toSave = {
            ...article,
            slug,
            placement: normalizedPlacement,
            column_pin: (article.column_pin || 'auto').toString().trim().toLowerCase(),
            image_layout: article.image_layout || 'top',
            is_breaking: !!article.is_breaking,
            views: parseInt(article.views, 10) || 0,
            updated_at: new Date().toISOString()
        };

        if (toSave.id) {
            const index = articles.findIndex(a => a.id === toSave.id);
            if (index !== -1) {
                articles[index] = toSave;
            } else {
                articles.push(toSave);
            }
        } else {
            toSave.id = 'art-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
            toSave.created_at = new Date().toISOString();
            toSave.published_at = toSave.published ? new Date().toISOString() : null;
            const maxOrder = Math.max(0, ...articles.map(a => a.sort_order || 0));
            toSave.sort_order = maxOrder + 10;
            articles.push(toSave);
        }

        // If this article is marked as breaking, unset others
        if (toSave.is_breaking) {
            articles.forEach(a => {
                if (a.id !== toSave.id) a.is_breaking = false;
            });
        }

        // If this article is marked as Lead Banner, demote any other lead to col3
        if (toSave.placement === 'lead') {
            articles.forEach(a => {
                if (a.id !== toSave.id && (a.placement || '').toString().trim().toLowerCase() === 'lead') {
                    a.placement = 'col3';
                }
            });
        }

        // 1. Optimistically update local storage safely
        try {
            localStorage.setItem(this.STORAGE_KEY_ARTICLES, JSON.stringify(articles));
        } catch (storageErr) {
            console.warn('⚠️ LocalStorage storage note in saveArticle:', storageErr);
        }

        // 2. Persist to Supabase
        if (this.supabase) {
            try {
                let dbArticle = {
                    id: toSave.id,
                    slug: toSave.slug,
                    headline: toSave.headline,
                    standfirst: toSave.standfirst || '',
                    section: toSave.section || 'Nation',
                    body: toSave.body || '',
                    image_url: toSave.image_url || '',
                    image_caption: toSave.image_caption || '',
                    author_name: toSave.author_name || 'SYED WAJID',
                    placement: toSave.placement || 'col3',
                    column_pin: toSave.column_pin || 'auto',
                    sort_order: toSave.sort_order || 0,
                    published: typeof toSave.published === 'boolean' ? toSave.published : true,
                    published_at: toSave.published_at || new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };

                // Attempt native columns if schema supports them or not yet known
                if (this.schemaHasLayoutColumns !== false) {
                    dbArticle.image_layout = toSave.image_layout || 'top';
                    dbArticle.is_breaking = !!toSave.is_breaking;
                    dbArticle.views = toSave.views || 0;
                }

                let { error } = await this.supabase
                    .from('articles')
                    .upsert(dbArticle, { onConflict: 'id' });

                // If native columns do not exist in Supabase, retry without them
                if (error && (error.message.includes('image_layout') || error.message.includes('column_pin') || error.code === '42703')) {
                    console.warn('ℹ️ One or more native columns not detected in Supabase, saving with metadata safety net...');
                    this.schemaHasLayoutColumns = false;
                    const cleanCap = (toSave.image_caption || '').replace(/<!--dnl:.*?-->/g, '').trim();
                    const metaTag = `<!--dnl:{"layout":"${toSave.image_layout || 'top'}","breaking":${!!toSave.is_breaking},"views":${toSave.views || 0},"pin":"${toSave.column_pin || 'auto'}"}-->`;
                    delete dbArticle.image_layout;
                    delete dbArticle.is_breaking;
                    delete dbArticle.views;
                    delete dbArticle.column_pin;
                    dbArticle.image_caption = cleanCap ? `${cleanCap} ${metaTag}` : metaTag;

                    const retry = await this.supabase
                        .from('articles')
                        .upsert(dbArticle, { onConflict: 'id' });
                    error = retry.error;
                } else if (!error) {
                    this.schemaHasLayoutColumns = true;
                }

                if (error) {
                    console.error('❌ Supabase article save error:', error.message);
                    throw new Error('Supabase save failed: ' + error.message);
                } else {
                    console.log('✅ Article successfully saved to Supabase:', toSave.headline);
                }

                // If this is lead banner, demote any other lead in Supabase
                if (toSave.placement === 'lead') {
                    await this.supabase
                        .from('articles')
                        .update({ placement: 'col3' })
                        .eq('placement', 'lead')
                        .neq('id', toSave.id);
                }

                if (toSave.is_breaking) {
                    await this.supabase
                        .from('articles')
                        .update({ is_breaking: false })
                        .neq('id', toSave.id);
                }
            } catch (err) {
                console.error('❌ Error saving article to Supabase:', err);
                throw err;
            }
        }

        return toSave;
    }

    async deleteArticle(id) {
        let articles = this.getArticles();
        articles = articles.filter(a => a.id !== id);
        localStorage.setItem(this.STORAGE_KEY_ARTICLES, JSON.stringify(articles));

        // Delete from Supabase
        if (this.supabase) {
            try {
                const { error } = await this.supabase
                    .from('articles')
                    .delete()
                    .eq('id', id);

                if (error) {
                    console.warn('⚠️ Supabase article delete error:', error.message);
                } else {
                    console.log('✅ Article deleted from Supabase:', id);
                }
            } catch (err) {
                console.error('❌ Error deleting article from Supabase:', err);
            }
        }

        return true;
    }

    /**
     * Swap sort_order between a story and its immediate neighbour.
     * direction: 'up' moves the story earlier (lower sort_order),
     *            'down' moves it later (higher sort_order).
     * Persists both swapped records to localStorage and Supabase.
     */
    async reorderArticle(id, direction) {
        const articles = this.getArticles(); // already sorted by sort_order
        const idx = articles.findIndex(a => a.id === id);
        if (idx === -1) return;

        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= articles.length) return;

        // Swap sort_order values
        const aOrder = articles[idx].sort_order || 0;
        const bOrder = articles[swapIdx].sort_order || 0;
        // If they happen to share the same sort_order, nudge them apart
        const newA = bOrder === aOrder ? (direction === 'up' ? bOrder - 1 : bOrder + 1) : bOrder;
        const newB = aOrder;

        // Capture IDs before re-sorting (indices will shift)
        const idA = articles[idx].id;
        const idB = articles[swapIdx].id;

        articles[idx].sort_order = newA;
        articles[swapIdx].sort_order = newB;

        // Re-sort so localStorage stays consistent
        articles.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        localStorage.setItem(this.STORAGE_KEY_ARTICLES, JSON.stringify(articles));

        // Persist both rows to Supabase (use IDs captured before re-sort)
        if (this.supabase) {
            const pairIds = [idA, idB];
            const pairArticles = this.getArticles().filter(a => pairIds.includes(a.id));
            for (const art of pairArticles) {
                try {
                    await this.supabase
                        .from('articles')
                        .update({ sort_order: art.sort_order })
                        .eq('id', art.id);
                } catch (err) {
                    console.warn('⚠️ Supabase sort_order sync warning:', err);
                }
            }
        }
    }

    slugify(text) {
        if (!text) return 'story-' + Date.now();
        return text
            .toLowerCase()
            .replace(/['']/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 80);
    }

    parseBody(bodyText) {
        if (!bodyText) return [];
        return bodyText
            .split(/\n{2,}/)
            .map(p => p.trim())
            .filter(Boolean)
            .map(p => {
                if (p.startsWith('## ')) {
                    return { type: 'head', text: p.slice(3).trim() };
                }
                return { type: 'para', text: p.replace(/\n/g, ' ') };
            });
    }

    /* ─────────────────────────────────────────
     * AUTHENTICATION (SUPABASE AUTH + LOCAL)
     * ───────────────────────────────────────── */
    getAuthSession() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEY_AUTH)) || null;
        } catch (e) {
            return null;
        }
    }

    async login(email, password) {
        if (!email || !password) {
            throw new Error('Please enter both email and password.');
        }

        // Standard Supabase Auth sign-in
        if (this.supabase && this.supabase.auth) {
            try {
                const { data, error } = await this.supabase.auth.signInWithPassword({
                    email: email.trim(),
                    password: password
                });

                if (error) {
                    throw error;
                }

                if (data && data.session) {
                    const session = {
                        user: data.session.user,
                        token: data.session.access_token,
                        logged_in_at: new Date().toISOString()
                    };
                    localStorage.setItem(this.STORAGE_KEY_AUTH, JSON.stringify(session));
                    console.log('✅ Logged in via Supabase Auth as:', data.session.user.email);
                    return { success: true, session };
                }
            } catch (authErr) {
                console.warn('⚠️ Supabase Auth sign-in failed:', authErr.message || authErr);
                throw authErr;
            }
        }

        throw new Error('Supabase client is not connected.');
    }

    async logout() {
        if (this.supabase && this.supabase.auth) {
            try {
                await this.supabase.auth.signOut();
            } catch (err) {
                console.warn('⚠️ Supabase sign out error:', err);
            }
        }
        localStorage.removeItem(this.STORAGE_KEY_AUTH);
    }

    /* ─────────────────────────────────────────
     * INTERVIEWS / VIDEO CLIPPINGS
     * ───────────────────────────────────────── */
    getInterviewsVisible() {
        try {
            const val = localStorage.getItem('dnl_interviews_visible');
            return val === null ? true : val === 'true';
        } catch (e) {
            return true;
        }
    }

    async setInterviewsVisible(bool) {
        localStorage.setItem('dnl_interviews_visible', String(bool));

        if (this.supabase) {
            try {
                await this.supabase
                    .from('settings')
                    .upsert({ id: 1, interviews_visible: bool, updated_at: new Date().toISOString() }, { onConflict: 'id' });
            } catch (err) {
                console.warn('⚠️ Failed to sync interview visibility to Supabase:', err);
            }
        }
    }

    getInterviews() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY_INTERVIEWS);
            const clips = data ? JSON.parse(data) : [];
            return clips.map(c => ({
                ...c,
                videoUrl: c.videoUrl || c.video_url || ''
            }));
        } catch (e) {
            return [];
        }
    }

    async saveInterview(clip) {
        const clips = this.getInterviews();
        const toSave = {
            ...clip,
            id: clip.id || ('iv-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4)),
            videoUrl: clip.videoUrl || clip.video_url || '',
            created_at: clip.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const idx = clips.findIndex(c => c.id === toSave.id);
        if (idx !== -1) {
            clips[idx] = toSave;
        } else {
            clips.unshift(toSave);
        }

        // 1. Optimistic local update
        localStorage.setItem(this.STORAGE_KEY_INTERVIEWS, JSON.stringify(clips));

        // 2. Persist to Supabase
        if (this.supabase) {
            try {
                const dbClip = {
                    id: toSave.id,
                    title: toSave.title,
                    guest: toSave.guest || '',
                    description: toSave.description || '',
                    video_url: toSave.videoUrl || toSave.video_url || '',
                    thumbnail: toSave.thumbnail || '',
                    date: toSave.date || '',
                    published: typeof toSave.published === 'boolean' ? toSave.published : true,
                    created_at: toSave.created_at,
                    updated_at: new Date().toISOString()
                };

                const { error } = await this.supabase
                    .from('interviews')
                    .upsert(dbClip, { onConflict: 'id' });

                if (error) {
                    console.warn('⚠️ Supabase interview save error:', error.message);
                } else {
                    console.log('✅ Video clip successfully saved to Supabase:', toSave.title);
                }
            } catch (err) {
                console.error('❌ Error saving interview to Supabase:', err);
            }
        }

        return toSave;
    }

    async deleteInterview(id) {
        let clips = this.getInterviews();
        clips = clips.filter(c => c.id !== id);
        localStorage.setItem(this.STORAGE_KEY_INTERVIEWS, JSON.stringify(clips));

        if (this.supabase) {
            try {
                const { error } = await this.supabase
                    .from('interviews')
                    .delete()
                    .eq('id', id);

                if (error) {
                    console.warn('⚠️ Supabase interview delete error:', error.message);
                } else {
                    console.log('✅ Video clip deleted from Supabase:', id);
                }
            } catch (err) {
                console.error('❌ Error deleting interview from Supabase:', err);
            }
        }

        return true;
    }

    async clearAllInterviews() {
        localStorage.removeItem(this.STORAGE_KEY_INTERVIEWS);

        if (this.supabase) {
            try {
                await this.supabase
                    .from('interviews')
                    .delete()
                    .neq('id', '');
                console.log('✅ All video clips cleared from Supabase');
            } catch (err) {
                console.error('❌ Error clearing interviews from Supabase:', err);
            }
        }
    }

    /* ═══════════════════════════════════════════════════════════════
     * GALLERY / CLIPPINGS METHODS
     * ═══════════════════════════════════════════════════════════════ */

    getClippings() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY_CLIPPINGS);
            const items = data ? JSON.parse(data) : [];
            return items.map(c => ({
                id: c.id,
                imageUrl: c.imageUrl || c.image_url || '',
                editionDate: c.editionDate || c.edition_date || '',
                caption: c.caption || '',
                created_at: c.created_at || ''
            })).sort((a, b) => {
                const dateA = new Date(a.editionDate).getTime() || 0;
                const dateB = new Date(b.editionDate).getTime() || 0;
                if (dateB !== dateA) return dateB - dateA;
                const createdA = new Date(a.created_at).getTime() || 0;
                const createdB = new Date(b.created_at).getTime() || 0;
                return createdB - createdA;
            });
        } catch (e) {
            return [];
        }
    }

    async saveClipping(clipping) {
        const items = this.getClippings();
        const toSave = {
            id: clipping.id || ('clip-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4)),
            imageUrl: clipping.imageUrl || clipping.image_url || '',
            editionDate: clipping.editionDate || clipping.edition_date || new Date().toISOString().split('T')[0],
            caption: clipping.caption || '',
            created_at: clipping.created_at || new Date().toISOString()
        };

        const idx = items.findIndex(c => c.id === toSave.id);
        if (idx !== -1) {
            items[idx] = toSave;
        } else {
            items.unshift(toSave);
        }

        // 1. Optimistic local update
        localStorage.setItem(this.STORAGE_KEY_CLIPPINGS, JSON.stringify(items));

        // 2. Persist to Supabase
        if (this.supabase) {
            try {
                const dbRecord = {
                    id: toSave.id,
                    image_url: toSave.imageUrl,
                    edition_date: toSave.editionDate,
                    caption: toSave.caption,
                    created_at: toSave.created_at
                };

                const { error } = await this.supabase
                    .from('clippings')
                    .upsert(dbRecord, { onConflict: 'id' });

                if (error) {
                    console.warn('⚠️ Supabase clipping save error:', error.message);
                } else {
                    console.log('✅ Clipping successfully saved to Supabase:', toSave.id);
                }
            } catch (err) {
                console.error('❌ Error saving clipping to Supabase:', err);
            }
        }

        return toSave;
    }

    async deleteClipping(id) {
        let items = this.getClippings();
        items = items.filter(c => c.id !== id);
        localStorage.setItem(this.STORAGE_KEY_CLIPPINGS, JSON.stringify(items));

        if (this.supabase) {
            try {
                const { error } = await this.supabase
                    .from('clippings')
                    .delete()
                    .eq('id', id);

                if (error) {
                    console.warn('⚠️ Supabase clipping delete error:', error.message);
                } else {
                    console.log('✅ Clipping deleted from Supabase:', id);
                }
            } catch (err) {
                console.error('❌ Error deleting clipping from Supabase:', err);
            }
        }

        return true;
    }

    async compressImageFile(file, maxWidth = 1280, maxHeight = 1280, quality = 0.78) {
        if (!file || !file.type || !file.type.startsWith('image/')) return null;
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    let { width, height } = img;
                    if (width > maxWidth || height > maxHeight) {
                        if (width > height) {
                            height = Math.round((height * maxWidth) / width);
                            width = maxWidth;
                        } else {
                            width = Math.round((width * maxHeight) / height);
                            height = maxHeight;
                        }
                    }
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
                img.onerror = () => resolve(e.target.result || '');
                img.src = e.target.result;
            };
            reader.onerror = () => resolve('');
            reader.readAsDataURL(file);
        });
    }

    /**
     * Upload a binary file (Video / Image) directly to Supabase Storage bucket 'media'.
     * Returns permanent public CDN HTTPS URL.
     */
    async uploadMediaFile(file, folder = 'videos') {
        if (!file) return '';

        if (this.supabase && this.supabase.storage) {
            try {
                const cleanName = (file.name || 'file').replace(/[^a-zA-Z0-9.-]/g, '_');
                const filePath = `${folder}/${Date.now()}_${Math.random().toString(36).substr(2, 6)}_${cleanName}`;

                const { data, error } = await this.supabase.storage
                    .from('media')
                    .upload(filePath, file, {
                        cacheControl: '3600',
                        upsert: true
                    });

                if (!error && data) {
                    const { data: pubData } = this.supabase.storage
                        .from('media')
                        .getPublicUrl(filePath);

                    if (pubData && pubData.publicUrl) {
                        console.log('✅ File uploaded to Supabase Storage bucket (media):', pubData.publicUrl);
                        return pubData.publicUrl;
                    }
                } else if (error) {
                    console.warn('⚠️ Supabase Storage upload note (falling back to compressed storage):', error.message);
                }
            } catch (err) {
                console.warn('⚠️ Supabase Storage exception:', err);
            }
        }

        // For photos/images, compress before returning data URL to guarantee it never exceeds localStorage quota
        if (file.type && file.type.startsWith('image/')) {
            const compressed = await this.compressImageFile(file);
            if (compressed) return compressed;
        }

        return await this.fileToDataUrl(file);
    }

    fileToDataUrl(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result || '');
            reader.onerror = () => resolve('');
            reader.readAsDataURL(file);
        });
    }
}

window.DNLDataStore = new DataStore();

