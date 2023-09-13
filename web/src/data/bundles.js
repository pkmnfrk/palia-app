const bundles = {
    water: {
        name: "Vault of the Waves",
        celebrateHue: {
            min: 160,
            max: 220,
        },
        bundles: [
            {
                id: "spooky",
                name: "Spooky Bundle",
                items: [
                    { item: "Garden Mantis", description: "Kilima Village Coastline during morning and day (3:00am to 6:00pm)" },
                    { item: "Vampire Crab", description:"Bahari Bay Flooded Fortress during evening and night (6:00pm to 3:00am)" },
                    { item: "Mutated Angler", description: "Bahari Bay Pavel Mines using a Worm" },
                    { item: "Void Ray", description: "Bahari Bay Pavel Mines using a Glow Worm" },
                ]
            },
            {
                id: "beach",
                name: "Beach Bundle",
                items: [
                    { item:"Green Pearl", description: "3% chance when opening an Unopened Oyster" },
                    { item:"Stripeshell Snail", description: "Bahari Bay Coastline at night (6:00pm to 3:00am)" },
                    { item:"Blue Marlin", description: "Bahari Bay Coastline using a Worm" },
                    { item:"Sushi", description: "Recipe found by fishing in Mirror Pond using a Glow Worm" },
                ]
            },
            {
                id: "freshwater",
                name: "Freshwater Bundle",
                items: [
                    { item: "Inky Dragonfly", description: "Bahari Bay rivers and ponds" },
                    { item: "Trout Dinner", quality: true, description: "Recipe found in Einar's Cave (need Level 3 Friendship)" },
                    { item: "HydratePro Fertilizer", description: "Bought from General Store for 40 Gold" },
                    { item: "Giant Goldfish", description: "Kilima Village or Bahari Bay ponds using a Glow Worm" },
                ]
            },
            {
                id: "magic",
                name: "Magic Bundle",
                items: [
                    { item: "Fisherman's Brew", description: "Recipe bought from Einar for 1000 Gold at Fishing Level 5" },
                    { item: "Enchanted Pupfish", description: "Kilima Village Fisherman's Lagoon using a Glow Worm" },
                    { item: "Shimmerfin", description: "Kilima Village Fisherman's Lagoon using a Worm" },
                    { item: "Long Nosed Unicorn Fish", description: "Bahari Bay Coastline using a Glow Worm during the day (6:00am to 6:00pm)" },
                ]
            },
        ]
    },
    fire: {
        name: "Temple of the Flames",
        wip: true,
        celebrateHue: {
            min: 0,
            max: 40,
        },
        bundles: [
            {
                id: "searchef",
                name: "Sear-Chef Bundle",
                items: [
                    { item: "Chapaa Masala" , description: "Standard recipe" },
                    { item: "Chopped Heat Root" , description: "???" },
                    { item: "Stuffed Tomatoes" , description: "???" },
                    { item: "Dari Cloves" , description: "Bahari Bay northern half (rare)" },
                ]
            },
            {
                id: "emberseeker",
                name: "Emberseeker's Bundle",
                items: [
                    { item: "Emberseeker Medallion" , qty: 6 , description: "Bahari Bay Statue Garden (x6)" },
                ]
            },
            {
                id: "brightbug",
                name: "Brightbug Bundle",
                items: [
                    { item: "Paper Lantern Bug" , description: "Bahari Bay south during evening and night (6:00pm to 3:00am)" },
                    { item: "Bahari Glowbug" , description: "Bahari Bay south during evening and night (6:00pm to 3:00am)" },
                    { item: "Spitfire Cicada" , description: "Bahari Bay trees during morning and day (3:00am to 6:00pm)" },
                    { item: "Firebreathing Dragonfly" , description: "Kilima fields"},
                ]
            },
            {
                id: "flamerod",
                name: "Flamerod Bundle",
                items: [
                    { item: "Radiant Sunfish" , description: "Kilima Rivers using worms" },
                    { item: "Flametongue Ray", description: "Kilima Rivers using Glow Worms during morning and day (3:00am to 6:00pm)" },
                    { item: "Striped Sturgeon" , description: "Fisherman's Lagoon using Worms in the evening and night (6:00pm to 3:00am)"},
                    { item: "Dawnray" , description: "Bahari Bay Rivers without bait in the morning (3:00am to 12:00pm)" },
                ]
            },
        ]
    }
};

export default bundles;