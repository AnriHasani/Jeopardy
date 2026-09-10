const ALL_CATEGORIES = [
  {
    name: "Food & Drink",
    color: ["#fdcb6e", "#e17055"],
    subcategories: [
      {
        name: "Italian",
        questions: [
          { q: "This Italian dish consists of flat bread with toppings", a: "pizza", alt: [] },
          { q: "This Italian pasta shape means 'little worms' in Italian", a: "vermicelli", alt: ["spaghetti"] },
          { q: "This Italian dessert is a coffee-flavored custard", a: "tiramisu", alt: [] },
          { q: "This Italian cheese is traditionally used on pizza", a: "mozzarella", alt: [] },
          { q: "This Italian cured meat is seasoned with black pepper", a: "prosciutto", alt: [] }
        ]
      },
      {
        name: "Japanese",
        questions: [
          { q: "This country is famous for sushi and ramen", a: "japan", alt: ["japanese"] },
          { q: "This Japanese dish consists of a breaded, deep-fried pork cutlet", a: "tonkatsu", alt: ["katsu"] },
          { q: "This Japanese noodle dish features wheat noodles in broth", a: "ramen", alt: [] },
          { q: "This Japanese rice dish is topped with raw fish slices", a: "sashimi", alt: ["nigiri"] },
          { q: "This Japanese term means 'grilled skewers of chicken'", a: "yakitori", alt: ["kushiyaki"] }
        ]
      },
      {
        name: "Beverages",
        questions: [
          { q: "This drink contains caffeine and is brewed from roasted beans", a: "coffee", alt: [] },
          { q: "This drink is made from fermented grapes", a: "wine", alt: ["red wine", "white wine"] },
          { q: "This carbonated soft drink was invented in Atlanta in 1886", a: "coca cola", alt: ["coke", "coca-cola"] },
          { q: "This yellow citrus fruit is often squeezed into lemonade", a: "lemon", alt: [] },
          { q: "This alcoholic drink is made from distilled fermented sugarcane", a: "rum", alt: [] }
        ]
      },
      {
        name: "Desserts",
        questions: [
          { q: "This popular chocolate bar was named after the Roman god of war", a: "mars bar", alt: ["mars"] },
          { q: "This French pastry is a thin, crisp cookie often shaped into a fan", a: "tuile", alt: ["fortune cookie"] },
          { q: "This frozen dessert is made from churned cream and sugar", a: "ice cream", alt: [] },
          { q: "This French dessert is a custard topped with caramelized sugar", a: "creme brulee", alt: ["creme brulee", "crème brûlée"] },
          { q: "This Italian frozen dessert is made with milk and cream", a: "gelato", alt: [] }
        ]
      },
      {
        name: "Spices & Herbs",
        questions: [
          { q: "This spice, harvested from crocus flowers, is the most expensive by weight", a: "saffron", alt: [] },
          { q: "This green herb is the key ingredient in traditional pesto sauce", a: "basil", alt: ["basil leaves"] },
          { q: "This red spice is made from dried and ground chili peppers", a: "paprika", alt: ["cayenne"] },
          { q: "This warm brown spice is commonly used in pumpkin pie", a: "cinnamon", alt: [] },
          { q: "This yellow spice gives curry its distinctive color", a: "turmeric", alt: [] }
        ]
      }
    ]
  },
  {
    name: "Science & Nature",
    color: ["#00cec9", "#0984e3"],
    subcategories: [
      {
        name: "Biology",
        questions: [
          { q: "This organ pumps blood through the body via the circulatory system", a: "heart", alt: [] },
          { q: "This vitamin is naturally produced when human skin is exposed to sunlight", a: "vitamin d", alt: ["d"] },
          { q: "This is the largest organ in the human body", a: "skin", alt: [] },
          { q: "This part of the cell contains the genetic material", a: "nucleus", alt: [] },
          { q: "This process converts food into energy inside cells", a: "metabolism", alt: ["cellular respiration"] }
        ]
      },
      {
        name: "Chemistry",
        questions: [
          { q: "This element has the chemical symbol 'O' and is essential for breathing", a: "oxygen", alt: [] },
          { q: "This is the hardest naturally occurring substance on Earth", a: "diamond", alt: [] },
          { q: "This element has the symbol 'Au' and is a precious metal", a: "gold", alt: [] },
          { q: "This gas is absorbed by plants from the atmosphere during photosynthesis", a: "carbon dioxide", alt: ["co2"] },
          { q: "This is the lightest element in the periodic table", a: "hydrogen", alt: [] }
        ]
      },
      {
        name: "Physics",
        questions: [
          { q: "This subatomic particle carries a positive electric charge", a: "proton", alt: [] },
          { q: "This force keeps us grounded on Earth", a: "gravity", alt: ["gravitational pull"] },
          { q: "This unit measures electrical resistance", a: "ohm", alt: [] },
          { q: "This particle has no electric charge and is found in the nucleus", a: "neutron", alt: [] },
          { q: "This law states that every action has an equal and opposite reaction", a: "newton's third law", alt: ["third law of motion"] }
        ]
      },
      {
        name: "Animals",
        questions: [
          { q: "This animal is the largest living creature ever known to have existed", a: "blue whale", alt: ["whale"] },
          { q: "This land animal is the fastest in the world", a: "cheetah", alt: [] },
          { q: "This mammal can fly and uses echolocation", a: "bat", alt: [] },
          { q: "This animal is known as the 'king of the jungle'", a: "lion", alt: [] },
          { q: "This sea creature has eight arms", a: "octopus", alt: [] }
        ]
      },
      {
        name: "Earth Science",
        questions: [
          { q: "This natural phenomenon is measured using the Richter scale", a: "earthquake", alt: ["seismic activity"] },
          { q: "This gas makes up approximately 78% of Earth's atmosphere", a: "nitrogen", alt: [] },
          { q: "This layer of the atmosphere protects us from UV radiation", a: "ozone layer", alt: ["ozone"] },
          { q: "This type of rock is formed from cooled lava or magma", a: "igneous rock", alt: ["igneous"] },
          { q: "This process describes how water cycles through the environment", a: "water cycle", alt: ["hydrological cycle"] }
        ]
      }
    ]
  },
  {
    name: "History & Geography",
    color: ["#fdcb6e", "#00b894"],
    subcategories: [
      {
        name: "World History",
        questions: [
          { q: "This wall fell in 1989, symbolizing the end of the Cold War", a: "berlin wall", alt: ["berlin"] },
          { q: "This global conflict lasted from 1939 to 1945", a: "world war 2", alt: ["wwii", "world war ii"] },
          { q: "This major revolution began in 1789 with the storming of the Bastille", a: "french revolution", alt: [] },
          { q: "This treaty ended World War I in 1919", a: "treaty of versailles", alt: ["versailles"] },
          { q: "This ancient trade route connected China to the Mediterranean", a: "silk road", alt: [] }
        ]
      },
      {
        name: "Capitals & Countries",
        questions: [
          { q: "This country is the largest by land area in the world", a: "russia", alt: ["russian federation"] },
          { q: "This city is the capital of Australia, not Sydney", a: "canberra", alt: [] },
          { q: "This country has the most people in the world", a: "china", alt: ["india"] },
          { q: "This city is the capital of Japan", a: "tokyo", alt: [] },
          { q: "This African country is famous for its pyramids and Nile River", a: "egypt", alt: ["egyptian"] }
        ]
      },
      {
        name: "Ancient Civilizations",
        questions: [
          { q: "This ancient civilization built the Great Pyramids of Giza", a: "ancient egyptians", alt: ["egyptians", "egypt"] },
          { q: "This empire was founded and expanded by Genghis Khan", a: "mongol empire", alt: ["mongolian empire"] },
          { q: "This civilization built Machu Picchu in the Andes Mountains", a: "incas", alt: ["inca"] },
          { q: "This ancient civilization independently developed the concept of zero", a: "mayans", alt: ["maya"] },
          { q: "This ancient civilization developed cuneiform writing", a: "sumerians", alt: ["mesopotamia"] }
        ]
      },
      {
        name: "Wars & Conflicts",
        questions: [
          { q: "This American civil war was fought between North and South", a: "american civil war", alt: ["civil war"] },
          { q: "This conflict was known as 'The Great War' before WWII", a: "world war 1", alt: ["wwi", "world war i"] },
          { q: "This 1066 battle decided who would rule England", a: "battle of hastings", alt: ["hastings"] },
          { q: "This cold war event involved the US and Soviet space race", a: "space race", alt: [] },
          { q: "This conflict lasted from 1950 to 1953 on the Korean peninsula", a: "korean war", alt: [] }
        ]
      },
      {
        name: "Explorers",
        questions: [
          { q: "This explorer reached the Americas in 1492 sailing for Spain", a: "columbus", alt: ["christopher columbus"] },
          { q: "This explorer was the first to circumnavigate the globe", a: "magellan", alt: ["ferdinand magellan"] },
          { q: "This explorer reached the South Pole in 1911", a: "amundsen", alt: ["roald amundsen"] },
          { q: "This explorer climbed Mount Everest for the first time in 1953", a: "edmund hillary", alt: ["hillary"] },
          { q: "This explorer led the first expedition to reach the North Pole", a: "peary", alt: ["robert peary"] }
        ]
      }
    ]
  },
  {
    name: "Technology",
    color: ["#00b894", "#00cec9"],
    subcategories: [
      {
        name: "Companies",
        questions: [
          { q: "This company created the iPhone", a: "apple", alt: ["apple inc"] },
          { q: "This search engine was founded by Larry Page and Sergey Brin", a: "google", alt: [] },
          { q: "This tech company makes the Galaxy line of phones", a: "samsung", alt: [] },
          { q: "This company's former motto was 'Don't be evil'", a: "google", alt: [] },
          { q: "This company owns Instagram and WhatsApp", a: "meta", alt: ["facebook"] }
        ]
      },
      {
        name: "Programming",
        questions: [
          { q: "This programming language was created by Guido van Rossum", a: "python", alt: [] },
          { q: "This language primarily runs inside web browsers", a: "javascript", alt: ["js"] },
          { q: "This language was developed by Bjarne Stroustrup in 1979", a: "c++", alt: ["cpp", "c plus plus"] },
          { q: "This markup language structures content on the web alongside JavaScript", a: "html", alt: [] },
          { q: "This programming language was created at Bell Labs in 1972", a: "c", alt: ["c language"] }
        ]
      },
      {
        name: "Internet",
        questions: [
          { q: "This social media platform uses a 280-character limit", a: "twitter", alt: ["x"] },
          { q: "This social platform is known for short-form videos and trends", a: "tiktok", alt: ["tik tok"] },
          { q: "This protocol is used to transfer web pages", a: "http", alt: ["https"] },
          { q: "This term describes a malicious program disguised as legitimate software", a: "trojan", alt: ["trojan horse"] },
          { q: "This network security protocol encrypts data in transit", a: "ssl", alt: ["tls"] }
        ]
      },
      {
        name: "Gadgets",
        questions: [
          { q: "This device was invented by Alexander Graham Bell in 1876", a: "telephone", alt: ["phone"] },
          { q: "This gadget measures heart rate using optical sensors", a: "smartwatch", alt: ["fitness tracker"] },
          { q: "This device was the first successful commercial hard drive", a: "ibm 350", alt: [] },
          { q: "This company made the first popular portable music player", a: "apple", alt: ["sony", "walkman"] },
          { q: "This device uses radio waves to heat food quickly", a: "microwave", alt: ["microwave oven"] }
        ]
      },
      {
        name: "AI",
        questions: [
          { q: "This AI chatbot was created by OpenAI", a: "chatgpt", alt: ["chat gpt", "gpt"] },
          { q: "This term describes machines that learn from data", a: "machine learning", alt: ["ml"] },
          { q: "This AI system beat a world champion at Go in 2016", a: "alphago", alt: ["alpha go"] },
          { q: "This neural network architecture is used for language tasks", a: "transformer", alt: [] },
          { q: "This term describes AI that matches human-level intelligence", a: "agi", alt: ["artificial general intelligence"] }
        ]
      }
    ]
  },
  {
    name: "Pop Culture",
    color: ["#e84393", "#fd79a8"],
    subcategories: [
      {
        name: "Movies",
        questions: [
          { q: "This movie franchise features a character named Darth Vader", a: "star wars", alt: [] },
          { q: "This movie features the famous quote 'Life is like a box of chocolates'", a: "forrest gump", alt: [] },
          { q: "This movie features a character named Jack who says 'I'm the king of the world'", a: "titanic", alt: [] },
          { q: "This superhero movie features the quote 'With great power comes great responsibility'", a: "spider-man", alt: ["spiderman"] },
          { q: "This movie features a character named Buzz Lightyear", a: "toy story", alt: [] }
        ]
      },
      {
        name: "TV Shows",
        questions: [
          { q: "This TV show features characters named Walter White and Jesse Pinkman", a: "breaking bad", alt: [] },
          { q: "This streaming platform created 'Stranger Things' and 'Squid Game'", a: "netflix", alt: [] },
          { q: "This TV show features dragons and the Iron Throne", a: "game of thrones", alt: ["got"] },
          { q: "This TV show is about a family living in an animated town called Springfield", a: "the simpsons", alt: ["simpsons"] },
          { q: "This TV show features a character named Eleven with telekinetic powers", a: "stranger things", alt: [] }
        ]
      },
      {
        name: "Music",
        questions: [
          { q: "This singer is known as the 'Queen of Pop' and hit songs like 'Material Girl'", a: "madonna", alt: [] },
          { q: "This rapper's real name is Marshall Bruce Mathers III", a: "eminem", alt: ["marshall mathers"] },
          { q: "This British rock band performed 'Bohemian Rhapsody' and 'We Will Rock You'", a: "queen", alt: [] },
          { q: "This pop artist released the chart-topping albums '1989' and 'Midnights'", a: "taylor swift", alt: ["swift"] },
          { q: "This 'King of Pop' was known for the moonwalk dance move", a: "michael jackson", alt: ["mj", "jackson"] }
        ]
      },
      {
        name: "Anime & Gaming",
        questions: [
          { q: "This anime series features a character named Goku who transforms into a Super Saiyan", a: "dragon ball", alt: ["dragonball", "dragon ball z"] },
          { q: "This video game features characters named Mario and Luigi", a: "super mario", alt: ["mario", "super mario bros"] },
          { q: "This anime features characters who fight titans to survive", a: "attack on titan", alt: ["aot"] },
          { q: "This video game features a character named Link who protects Hyrule", a: "zelda", alt: ["legend of zelda"] },
          { q: "This anime features pirates searching for the One Piece treasure", a: "one piece", alt: [] }
        ]
      },
      {
        name: "Celebrities",
        questions: [
          { q: "This Marvel superhero is known as the 'God of Thunder'", a: "thor", alt: [] },
          { q: "This actor played Iron Man in the Marvel Cinematic Universe", a: "robert downey jr", alt: ["downey", "rdj"] },
          { q: "This singer was known as 'The King of Rock and Roll'", a: "elvis presley", alt: ["elvis"] },
          { q: "This basketball player is known as 'His Airness'", a: "michael jordan", alt: ["jordan"] },
          { q: "This singer's real name is Stefani Joanne Angelina Germanotta", a: "lady gaga", alt: ["gaga"] }
        ]
      }
    ]
  },
  {
    name: "Sports & Games",
    color: ["#0984e3", "#6c5ce7"],
    subcategories: [
      {
        name: "Olympics",
        questions: [
          { q: "This Olympic sport combines swimming, cycling, and running", a: "triathlon", alt: [] },
          { q: "This city hosted the 2020 Summer Olympics", a: "tokyo", alt: [] },
          { q: "This country has won the most total Olympic medals", a: "united states", alt: ["usa", "us"] },
          { q: "This gymnastics event involves a long elastic rope", a: "rhythmic gymnastics", alt: [] },
          { q: "This winter sport involves sliding down an ice track in a small sled", a: "luge", alt: [] }
        ]
      },
      {
        name: "Football & Soccer",
        questions: [
          { q: "This country won the 2022 FIFA World Cup", a: "argentina", alt: ["argentinian"] },
          { q: "This football club is known as 'The Red Devils'", a: "manchester united", alt: ["man united"] },
          { q: "This Portuguese footballer holds the record for most international goals in football history", a: "cristiano ronaldo", alt: ["ronaldo", "cr7"] },
          { q: "This football competition is the top club competition in Europe", a: "champions league", alt: ["ucl"] },
          { q: "This position in football is the last line of defense", a: "goalkeeper", alt: ["goalie", "keeper"] }
        ]
      },
      {
        name: "Basketball",
        questions: [
          { q: "This NBA team has won the most championships in league history", a: "boston celtics", alt: ["celtics"] },
          { q: "This basketball move involves dribbling between your legs", a: "between the legs", alt: ["crossover"] },
          { q: "This basketball player is known as 'The King'", a: "lebron james", alt: ["lebron", "lbj"] },
          { q: "This is the name of the NBA championship trophy", a: "larry o'brien trophy", alt: ["larry o'brien"] },
          { q: "This is the maximum points you can score in one basketball play", a: "4 points", alt: ["four points"] }
        ]
      },
      {
        name: "Board Games",
        questions: [
          { q: "This classic board game involves buying properties and collecting rent", a: "monopoly", alt: [] },
          { q: "In chess, this piece can only move diagonally", a: "bishop", alt: [] },
          { q: "This board game involves placing tiles to match numbers", a: "dominoes", alt: ["scrabble"] },
          { q: "This strategy game involves placing stones to control territory", a: "go", alt: ["weiqi"] },
          { q: "This puzzle game involves filling a 9x9 grid with numbers 1-9", a: "sudoku", alt: [] }
        ]
      },
      {
        name: "Other Sports",
        questions: [
          { q: "This sport uses terms like 'birdie', 'eagle', and 'hole-in-one'", a: "golf", alt: [] },
          { q: "This tennis tournament is played on red clay in Paris", a: "french open", alt: ["roland garros"] },
          { q: "This racing series is the highest class of single-seater auto racing", a: "formula 1", alt: ["f1", "formula one"] },
          { q: "This boxer was known as 'The Greatest' and 'The People's Champion'", a: "muhammad ali", alt: ["ali", "cassius clay"] },
          { q: "This swimming stroke is also known as the front crawl", a: "freestyle", alt: ["front crawl"] }
        ]
      }
    ]
  },
  {
    name: "Literature & Arts",
    color: ["#e17055", "#d63031"],
    subcategories: [
      {
        name: "Classic Novels",
        questions: [
          { q: "This novel begins with 'Call me Ishmael'", a: "moby dick", alt: ["moby-dick"] },
          { q: "This novel features a character named Jay Gatsby", a: "the great gatsby", alt: ["great gatsby"] },
          { q: "This author wrote the Harry Potter series", a: "j.k. rowling", alt: ["jk rowling", "rowling"] },
          { q: "This novel features a dystopian society where 'Big Brother' watches everyone", a: "1984", alt: ["nineteen eighty-four"] },
          { q: "This novel begins with 'It was the best of times, it was the worst of times'", a: "a tale of two cities", alt: [] }
        ]
      },
      {
        name: "Painting & Sculpture",
        questions: [
          { q: "This artist painted the Mona Lisa", a: "leonardo da vinci", alt: ["da vinci", "leonardo"] },
          { q: "This sculptor created the statue of David", a: "michelangelo", alt: [] },
          { q: "This Dutch artist cut off part of his own ear", a: "van gogh", alt: ["vincent van gogh"] },
          { q: "This Vermeer painting depicts a girl wearing a pearl earring", a: "girl with a pearl earring", alt: ["vermeer"] },
          { q: "This artist is known for painting melting clocks", a: "dali", alt: ["salvador dali"] }
        ]
      },
      {
        name: "Poetry",
        questions: [
          { q: "This Shakespeare play features the line 'To be or not to be'", a: "hamlet", alt: [] },
          { q: "This poem starts with 'Two roads diverged in a yellow wood'", a: "the road not taken", alt: ["road not taken"] },
          { q: "This poet wrote 'The Raven' and 'The Tell-Tale Heart'", a: "edgar allan poe", alt: ["poe"] },
          { q: "This poet wrote 'I Know Why the Caged Bird Sings'", a: "maya angelou", alt: ["angelou"] },
          { q: "This poem begins with 'Shall I compare thee to a summer's day?'", a: "sonnet 18", alt: ["shakespeare sonnet 18"] }
        ]
      },
      {
        name: "Authors",
        questions: [
          { q: "This author wrote 'To Kill a Mockingbird'", a: "harper lee", alt: ["lee"] },
          { q: "This author created the character Sherlock Holmes", a: "arthur conan doyle", alt: ["conan doyle"] },
          { q: "This author wrote '1984' and 'Animal Farm'", a: "george orwell", alt: ["orwell"] },
          { q: "This author wrote the 'Lord of the Rings' trilogy", a: "j.r.r. tolkien", alt: ["tolkien"] },
          { q: "This author wrote 'Pride and Prejudice'", a: "jane austen", alt: ["austen"] }
        ]
      },
      {
        name: "Music Composers",
        questions: [
          { q: "This composer wrote 9 symphonies including the 'Choral'", a: "beethoven", alt: ["ludwig van beethoven"] },
          { q: "This composer wrote 'The Four Seasons'", a: "vivaldi", alt: ["antonio vivaldi"] },
          { q: "This composer wrote over 600 works including 'Eine kleine Nachtmusik'", a: "mozart", alt: ["wolfgang amadeus mozart"] },
          { q: "This composer is known for 'The Nutcracker' ballet", a: "tchaikovsky", alt: ["pyotr tchaikovsky"] },
          { q: "This composer wrote 'Clair de Lune' and 'Suite Bergamasque'", a: "debussy", alt: ["claude debussy"] }
        ]
      }
    ]
  },
  {
    name: "Space & Astronomy",
    color: ["#6c5ce7", "#a55eea"],
    subcategories: [
      {
        name: "Planets",
        questions: [
          { q: "This planet is known as the Red Planet", a: "mars", alt: ["red planet"] },
          { q: "This is the largest planet in our solar system", a: "jupiter", alt: [] },
          { q: "This planet has the most spectacular ring system", a: "saturn", alt: [] },
          { q: "This planet is the closest to the Sun in our solar system", a: "mercury", alt: [] },
          { q: "This planet is known for its extreme greenhouse effect and toxic clouds", a: "venus", alt: [] }
        ]
      },
      {
        name: "Stars & Galaxies",
        questions: [
          { q: "This star is closest to Earth (besides the Sun)", a: "proxima centauri", alt: ["alpha centauri"] },
          { q: "This galaxy is on a collision course with the Milky Way", a: "andromeda", alt: ["andromeda galaxy"] },
          { q: "This star is the brightest in the night sky", a: "sirius", alt: ["the dog star"] },
          { q: "This term describes a collapsed star with immense gravity", a: "black hole", alt: [] },
          { q: "This type of star is a massive, bright, blue-white star", a: "supergiant", alt: ["blue giant"] }
        ]
      },
      {
        name: "NASA Missions",
        questions: [
          { q: "This telescope, launched in 2021, orbits the Sun at L2", a: "james webb", alt: ["jwst", "james webb space telescope"] },
          { q: "This spacecraft took the famous 'Pale Blue Dot' photo", a: "voyager 1", alt: ["voyager"] },
          { q: "This Apollo mission first landed humans on the Moon", a: "apollo 11", alt: [] },
          { q: "This rover is exploring Mars and searching for signs of ancient life", a: "perseverance", alt: ["curiosity"] },
          { q: "This space station has been continuously inhabited since 2000", a: "iss", alt: ["international space station"] }
        ]
      },
      {
        name: "Constellations",
        questions: [
          { q: "This constellation contains the three stars of Orion's Belt", a: "orion", alt: ["the hunter"] },
          { q: "This constellation is known as 'The Bear' and is visible in the northern sky", a: "ursa major", alt: ["great bear"] },
          { q: "This constellation contains the North Star", a: "ursa minor", alt: ["little bear"] },
          { q: "This constellation is associated with the Greek myth of a man chained to a rock", a: "prometheus", alt: [] },
          { q: "This zodiac constellation is represented by the water bearer", a: "aquarius", alt: [] }
        ]
      },
      {
        name: "Space Facts",
        questions: [
          { q: "The speed of light is approximately this many km per second", a: "300000", alt: ["300,000", "300000 km", "300000 km/s"] },
          { q: "Apollo 11 landed on this celestial body", a: "the moon", alt: ["moon", "lunar surface"] },
          { q: "This planet is tilted on its axis and rotates on its side", a: "uranus", alt: [] },
          { q: "This planet is the farthest from the Sun and was reclassified as a dwarf planet", a: "pluto", alt: [] },
          { q: "This is the name of the boundary around a black hole beyond which nothing can escape", a: "event horizon", alt: [] }
        ]
      }
    ]
  }
];

const PRESET_MAP = {
  mixed: null,
  food: "Food & Drink",
  science: "Science & Nature",
  history: "History & Geography",
  tech: "Technology",
  pop: "Pop Culture",
  sports: "Sports & Games",
  arts: "Literature & Arts",
  space: "Space & Astronomy"
};
