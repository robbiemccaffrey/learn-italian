export interface PictureCard {
  id: string;
  italian: string;
  english: string;
  image: string;
  category: string;
}

export const CATEGORIES = [
  "Food",
  "Fruit & Veg",
  "Drinks",
  "Animals",
  "Clothing",
  "Body",
  "Household",
  "Kitchen",
  "Bathroom",
  "Transport",
  "Nature",
  "Office",
  "Sports",
  "Places",
  "Weather",
  "Tools",
  "Colours",
  "Everyday",
] as const;

export type Category = (typeof CATEGORIES)[number];

const px = (id: number, w = 600, h = 400) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;

export const pictureCards: PictureCard[] = [
  // ===========================
  // FOOD (25)
  // ===========================
  { id: "food-1", italian: "il pane", english: "Bread", image: px(1775043), category: "Food" },
  { id: "food-2", italian: "il formaggio", english: "Cheese", image: px(821365), category: "Food" },
  { id: "food-3", italian: "la pasta", english: "Pasta", image: px(1279330), category: "Food" },
  { id: "food-4", italian: "la pizza", english: "Pizza", image: px(315755), category: "Food" },
  { id: "food-5", italian: "il gelato", english: "Ice Cream", image: px(1625235), category: "Food" },
  { id: "food-6", italian: "l'uovo", english: "Egg", image: px(557659), category: "Food" },
  { id: "food-7", italian: "il riso", english: "Rice", image: px(723198), category: "Food" },
  { id: "food-8", italian: "il burro", english: "Butter", image: px(531334), category: "Food" },
  { id: "food-9", italian: "il pollo", english: "Chicken", image: px(2338407), category: "Food" },
  { id: "food-10", italian: "il pesce", english: "Fish", image: px(3296279), category: "Food" },
  { id: "food-11", italian: "la carne", english: "Meat", image: px(1251208), category: "Food" },
  { id: "food-12", italian: "la zuppa", english: "Soup", image: px(1731535), category: "Food" },
  { id: "food-13", italian: "l'insalata", english: "Salad", image: px(1640777), category: "Food" },
  { id: "food-14", italian: "il panino", english: "Sandwich", image: px(1647163), category: "Food" },
  { id: "food-15", italian: "la torta", english: "Cake", image: px(291528), category: "Food" },
  { id: "food-16", italian: "il biscotto", english: "Cookie", image: px(230325), category: "Food" },
  { id: "food-17", italian: "il cioccolato", english: "Chocolate", image: px(918327), category: "Food" },
  { id: "food-18", italian: "il miele", english: "Honey", image: px(1638280), category: "Food" },
  { id: "food-19", italian: "la salsiccia", english: "Sausage", image: px(929137), category: "Food" },
  { id: "food-20", italian: "il prosciutto", english: "Ham", image: px(3535383), category: "Food" },
  { id: "food-21", italian: "lo yogurt", english: "Yogurt", image: px(1435735), category: "Food" },
  { id: "food-22", italian: "i cereali", english: "Cereal", image: px(543730), category: "Food" },
  { id: "food-23", italian: "le patatine fritte", english: "French Fries", image: px(1583884), category: "Food" },
  { id: "food-24", italian: "il sale", english: "Salt", image: px(2589651), category: "Food" },
  { id: "food-25", italian: "il pepe", english: "Pepper", image: px(1340116), category: "Food" },

  // ===========================
  // FRUIT & VEG (25)
  // ===========================
  { id: "fv-1", italian: "la mela", english: "Apple", image: px(1510392), category: "Fruit & Veg" },
  { id: "fv-2", italian: "la banana", english: "Banana", image: px(2872755), category: "Fruit & Veg" },
  { id: "fv-3", italian: "il pomodoro", english: "Tomato", image: px(1327838), category: "Fruit & Veg" },
  { id: "fv-4", italian: "l'arancia", english: "Orange", image: px(2090903), category: "Fruit & Veg" },
  { id: "fv-5", italian: "il limone", english: "Lemon", image: px(1414110), category: "Fruit & Veg" },
  { id: "fv-6", italian: "la fragola", english: "Strawberry", image: px(934066), category: "Fruit & Veg" },
  { id: "fv-7", italian: "l'uva", english: "Grapes", image: px(708777), category: "Fruit & Veg" },
  { id: "fv-8", italian: "l'anguria", english: "Watermelon", image: px(1313267), category: "Fruit & Veg" },
  { id: "fv-9", italian: "la pesca", english: "Peach", image: px(1028599), category: "Fruit & Veg" },
  { id: "fv-10", italian: "la pera", english: "Pear", image: px(568471), category: "Fruit & Veg" },
  { id: "fv-11", italian: "l'ananas", english: "Pineapple", image: px(1071878), category: "Fruit & Veg" },
  { id: "fv-12", italian: "la ciliegia", english: "Cherry", image: px(175727), category: "Fruit & Veg" },
  { id: "fv-13", italian: "la carota", english: "Carrot", image: px(143133), category: "Fruit & Veg" },
  { id: "fv-14", italian: "la patata", english: "Potato", image: px(2286776), category: "Fruit & Veg" },
  { id: "fv-15", italian: "la cipolla", english: "Onion", image: px(4197447), category: "Fruit & Veg" },
  { id: "fv-16", italian: "l'aglio", english: "Garlic", image: px(1638524), category: "Fruit & Veg" },
  { id: "fv-17", italian: "il peperone", english: "Bell Pepper", image: px(594137), category: "Fruit & Veg" },
  { id: "fv-18", italian: "il cetriolo", english: "Cucumber", image: px(2329440), category: "Fruit & Veg" },
  { id: "fv-19", italian: "la lattuga", english: "Lettuce", image: px(1199562), category: "Fruit & Veg" },
  { id: "fv-20", italian: "il fungo", english: "Mushroom", image: px(1586947), category: "Fruit & Veg" },
  { id: "fv-21", italian: "i broccoli", english: "Broccoli", image: px(1640774), category: "Fruit & Veg" },
  { id: "fv-22", italian: "gli spinaci", english: "Spinach", image: px(2325843), category: "Fruit & Veg" },
  { id: "fv-23", italian: "il mais", english: "Corn", image: px(547263), category: "Fruit & Veg" },
  { id: "fv-24", italian: "la melanzana", english: "Eggplant", image: px(5765636), category: "Fruit & Veg" },
  { id: "fv-25", italian: "la zucca", english: "Pumpkin", image: px(1527010), category: "Fruit & Veg" },

  // ===========================
  // DRINKS (12)
  // ===========================
  { id: "drink-1", italian: "il caffè", english: "Coffee", image: px(312418), category: "Drinks" },
  { id: "drink-2", italian: "il vino", english: "Wine", image: px(391213), category: "Drinks" },
  { id: "drink-3", italian: "l'acqua", english: "Water", image: px(1000084), category: "Drinks" },
  { id: "drink-4", italian: "la birra", english: "Beer", image: px(1552630), category: "Drinks" },
  { id: "drink-5", italian: "il tè", english: "Tea", image: px(1417945), category: "Drinks" },
  { id: "drink-6", italian: "il succo d'arancia", english: "Orange Juice", image: px(1536868), category: "Drinks" },
  { id: "drink-7", italian: "il latte", english: "Milk", image: px(248412), category: "Drinks" },
  { id: "drink-8", italian: "la limonata", english: "Lemonade", image: px(2109099), category: "Drinks" },
  { id: "drink-9", italian: "il frullato", english: "Smoothie", image: px(1346347), category: "Drinks" },
  { id: "drink-10", italian: "la cioccolata calda", english: "Hot Chocolate", image: px(585750), category: "Drinks" },
  { id: "drink-11", italian: "il cappuccino", english: "Cappuccino", image: px(350478), category: "Drinks" },
  { id: "drink-12", italian: "lo spumante", english: "Sparkling Wine", image: px(1571613), category: "Drinks" },

  // ===========================
  // ANIMALS (20)
  // ===========================
  { id: "animal-1", italian: "il gatto", english: "Cat", image: px(416160), category: "Animals" },
  { id: "animal-2", italian: "il cane", english: "Dog", image: px(1108099), category: "Animals" },
  { id: "animal-3", italian: "il cavallo", english: "Horse", image: px(635499), category: "Animals" },
  { id: "animal-4", italian: "l'uccello", english: "Bird", image: px(1209978), category: "Animals" },
  { id: "animal-5", italian: "la farfalla", english: "Butterfly", image: px(672142), category: "Animals" },
  { id: "animal-6", italian: "la mucca", english: "Cow", image: px(422218), category: "Animals" },
  { id: "animal-7", italian: "il coniglio", english: "Rabbit", image: px(372166), category: "Animals" },
  { id: "animal-8", italian: "la tartaruga", english: "Turtle", image: px(847393), category: "Animals" },
  { id: "animal-9", italian: "l'elefante", english: "Elephant", image: px(133394), category: "Animals" },
  { id: "animal-10", italian: "il leone", english: "Lion", image: px(247502), category: "Animals" },
  { id: "animal-11", italian: "la pecora", english: "Sheep", image: px(693776), category: "Animals" },
  { id: "animal-12", italian: "il maiale", english: "Pig", image: px(110820), category: "Animals" },
  { id: "animal-13", italian: "la gallina", english: "Hen", image: px(1569076), category: "Animals" },
  { id: "animal-14", italian: "l'anatra", english: "Duck", image: px(1939485), category: "Animals" },
  { id: "animal-15", italian: "il pesce", english: "Fish", image: px(128756), category: "Animals" },
  { id: "animal-16", italian: "la rana", english: "Frog", image: px(461428), category: "Animals" },
  { id: "animal-17", italian: "il ragno", english: "Spider", image: px(1076429), category: "Animals" },
  { id: "animal-18", italian: "l'ape", english: "Bee", image: px(460961), category: "Animals" },
  { id: "animal-19", italian: "la giraffa", english: "Giraffe", image: px(802112), category: "Animals" },
  { id: "animal-20", italian: "la scimmia", english: "Monkey", image: px(321552), category: "Animals" },

  // ===========================
  // CLOTHING & ACCESSORIES (20)
  // ===========================
  { id: "cloth-1", italian: "la camicia", english: "Shirt", image: px(297933), category: "Clothing" },
  { id: "cloth-2", italian: "le scarpe", english: "Shoes", image: px(267242), category: "Clothing" },
  { id: "cloth-3", italian: "il cappello", english: "Hat", image: px(984619), category: "Clothing" },
  { id: "cloth-4", italian: "gli occhiali", english: "Glasses", image: px(975668), category: "Clothing" },
  { id: "cloth-5", italian: "la borsa", english: "Bag", image: px(1152077), category: "Clothing" },
  { id: "cloth-6", italian: "l'orologio", english: "Watch", image: px(190819), category: "Clothing" },
  { id: "cloth-7", italian: "i guanti", english: "Gloves", image: px(3687770), category: "Clothing" },
  { id: "cloth-8", italian: "la sciarpa", english: "Scarf", image: px(3098970), category: "Clothing" },
  { id: "cloth-9", italian: "i pantaloni", english: "Trousers", image: px(1598507), category: "Clothing" },
  { id: "cloth-10", italian: "la gonna", english: "Skirt", image: px(985635), category: "Clothing" },
  { id: "cloth-11", italian: "il vestito", english: "Dress", image: px(1126993), category: "Clothing" },
  { id: "cloth-12", italian: "la giacca", english: "Jacket", image: px(1124468), category: "Clothing" },
  { id: "cloth-13", italian: "il cappotto", english: "Coat", image: px(6764007), category: "Clothing" },
  { id: "cloth-14", italian: "la cravatta", english: "Tie", image: px(1340116), category: "Clothing" },
  { id: "cloth-15", italian: "i calzini", english: "Socks", image: px(6045342), category: "Clothing" },
  { id: "cloth-16", italian: "la cintura", english: "Belt", image: px(1152077), category: "Clothing" },
  { id: "cloth-17", italian: "gli stivali", english: "Boots", image: px(267202), category: "Clothing" },
  { id: "cloth-18", italian: "la maglietta", english: "T-Shirt", image: px(428340), category: "Clothing" },
  { id: "cloth-19", italian: "il maglione", english: "Sweater", image: px(4066293), category: "Clothing" },
  { id: "cloth-20", italian: "l'ombrello", english: "Umbrella", image: px(1755385), category: "Clothing" },

  // ===========================
  // BODY (20)
  // ===========================
  { id: "body-1", italian: "la mano", english: "Hand", image: px(2104044), category: "Body" },
  { id: "body-2", italian: "l'occhio", english: "Eye", image: px(1209978), category: "Body" },
  { id: "body-3", italian: "il cuore", english: "Heart", image: px(1174952), category: "Body" },
  { id: "body-4", italian: "il piede", english: "Foot", image: px(1249546), category: "Body" },
  { id: "body-5", italian: "la bocca", english: "Mouth", image: px(1191531), category: "Body" },
  { id: "body-6", italian: "l'orecchio", english: "Ear", image: px(3076899), category: "Body" },
  { id: "body-7", italian: "il dito", english: "Finger", image: px(1918290), category: "Body" },
  { id: "body-8", italian: "il braccio", english: "Arm", image: px(1552242), category: "Body" },
  { id: "body-9", italian: "la testa", english: "Head", image: px(1300402), category: "Body" },
  { id: "body-10", italian: "il naso", english: "Nose", image: px(1300402), category: "Body" },
  { id: "body-11", italian: "i capelli", english: "Hair", image: px(1319460), category: "Body" },
  { id: "body-12", italian: "la gamba", english: "Leg", image: px(3622614), category: "Body" },
  { id: "body-13", italian: "il ginocchio", english: "Knee", image: px(3622614), category: "Body" },
  { id: "body-14", italian: "la spalla", english: "Shoulder", image: px(1552242), category: "Body" },
  { id: "body-15", italian: "il collo", english: "Neck", image: px(1300402), category: "Body" },
  { id: "body-16", italian: "la schiena", english: "Back", image: px(3622614), category: "Body" },
  { id: "body-17", italian: "il dente", english: "Tooth", image: px(3845625), category: "Body" },
  { id: "body-18", italian: "la lingua", english: "Tongue", image: px(1191531), category: "Body" },
  { id: "body-19", italian: "il gomito", english: "Elbow", image: px(1552242), category: "Body" },
  { id: "body-20", italian: "il pollice", english: "Thumb", image: px(1918290), category: "Body" },

  // ===========================
  // HOUSEHOLD (25)
  // ===========================
  { id: "house-1", italian: "la sedia", english: "Chair", image: px(1350789), category: "Household" },
  { id: "house-2", italian: "il tavolo", english: "Table", image: px(1395964), category: "Household" },
  { id: "house-3", italian: "la lampada", english: "Lamp", image: px(1112598), category: "Household" },
  { id: "house-4", italian: "il letto", english: "Bed", image: px(1743229), category: "Household" },
  { id: "house-5", italian: "lo specchio", english: "Mirror", image: px(1528975), category: "Household" },
  { id: "house-6", italian: "la chiave", english: "Key", image: px(279810), category: "Household" },
  { id: "house-7", italian: "il libro", english: "Book", image: px(904620), category: "Household" },
  { id: "house-8", italian: "il telefono", english: "Phone", image: px(607812), category: "Household" },
  { id: "house-9", italian: "il divano", english: "Sofa", image: px(1866149), category: "Household" },
  { id: "house-10", italian: "il tappeto", english: "Carpet", image: px(6585759), category: "Household" },
  { id: "house-11", italian: "la porta", english: "Door", image: px(277559), category: "Household" },
  { id: "house-12", italian: "la finestra", english: "Window", image: px(1115804), category: "Household" },
  { id: "house-13", italian: "le scale", english: "Stairs", image: px(434645), category: "Household" },
  { id: "house-14", italian: "il cuscino", english: "Pillow", image: px(1556704), category: "Household" },
  { id: "house-15", italian: "la coperta", english: "Blanket", image: px(4210337), category: "Household" },
  { id: "house-16", italian: "l'armadio", english: "Wardrobe", image: px(3609080), category: "Household" },
  { id: "house-17", italian: "la scrivania", english: "Desk", image: px(667838), category: "Household" },
  { id: "house-18", italian: "la televisione", english: "Television", image: px(1201996), category: "Household" },
  { id: "house-19", italian: "l'orologio da parete", english: "Wall Clock", image: px(707582), category: "Household" },
  { id: "house-20", italian: "il vaso", english: "Vase", image: px(1563075), category: "Household" },
  { id: "house-21", italian: "la candela", english: "Candle", image: px(278549), category: "Household" },
  { id: "house-22", italian: "il quadro", english: "Painting", image: px(1579708), category: "Household" },
  { id: "house-23", italian: "la mensola", english: "Shelf", image: px(1090638), category: "Household" },
  { id: "house-24", italian: "il cassetto", english: "Drawer", image: px(3609080), category: "Household" },
  { id: "house-25", italian: "la cornice", english: "Picture Frame", image: px(1579708), category: "Household" },

  // ===========================
  // KITCHEN (20)
  // ===========================
  { id: "kit-1", italian: "la tazza", english: "Cup", image: px(1329711), category: "Kitchen" },
  { id: "kit-2", italian: "il piatto", english: "Plate", image: px(2736387), category: "Kitchen" },
  { id: "kit-3", italian: "il bicchiere", english: "Glass", image: px(1187766), category: "Kitchen" },
  { id: "kit-4", italian: "la forchetta", english: "Fork", image: px(699953), category: "Kitchen" },
  { id: "kit-5", italian: "il coltello", english: "Knife", image: px(3622479), category: "Kitchen" },
  { id: "kit-6", italian: "il cucchiaio", english: "Spoon", image: px(2264753), category: "Kitchen" },
  { id: "kit-7", italian: "la pentola", english: "Pot", image: px(2544829), category: "Kitchen" },
  { id: "kit-8", italian: "la padella", english: "Frying Pan", image: px(3296390), category: "Kitchen" },
  { id: "kit-9", italian: "il frigorifero", english: "Refrigerator", image: px(5825576), category: "Kitchen" },
  { id: "kit-10", italian: "il forno", english: "Oven", image: px(2062426), category: "Kitchen" },
  { id: "kit-11", italian: "la bottiglia", english: "Bottle", image: px(1000084), category: "Kitchen" },
  { id: "kit-12", italian: "il tagliere", english: "Cutting Board", image: px(1108117), category: "Kitchen" },
  { id: "kit-13", italian: "la ciotola", english: "Bowl", image: px(1693085), category: "Kitchen" },
  { id: "kit-14", italian: "il tovagliolo", english: "Napkin", image: px(2228553), category: "Kitchen" },
  { id: "kit-15", italian: "il cavatappi", english: "Corkscrew", image: px(391213), category: "Kitchen" },
  { id: "kit-16", italian: "il microonde", english: "Microwave", image: px(2062426), category: "Kitchen" },
  { id: "kit-17", italian: "il tostapane", english: "Toaster", image: px(2062426), category: "Kitchen" },
  { id: "kit-18", italian: "la lavastoviglie", english: "Dishwasher", image: px(2062426), category: "Kitchen" },
  { id: "kit-19", italian: "il grembiule", english: "Apron", image: px(3338681), category: "Kitchen" },
  { id: "kit-20", italian: "il vassoio", english: "Tray", image: px(2544829), category: "Kitchen" },

  // ===========================
  // BATHROOM (15)
  // ===========================
  { id: "bath-1", italian: "lo spazzolino", english: "Toothbrush", image: px(3737596), category: "Bathroom" },
  { id: "bath-2", italian: "il dentifricio", english: "Toothpaste", image: px(3737596), category: "Bathroom" },
  { id: "bath-3", italian: "il sapone", english: "Soap", image: px(3735218), category: "Bathroom" },
  { id: "bath-4", italian: "l'asciugamano", english: "Towel", image: px(2762171), category: "Bathroom" },
  { id: "bath-5", italian: "la doccia", english: "Shower", image: px(1549060), category: "Bathroom" },
  { id: "bath-6", italian: "la vasca da bagno", english: "Bathtub", image: px(1910472), category: "Bathroom" },
  { id: "bath-7", italian: "lo shampoo", english: "Shampoo", image: px(3735218), category: "Bathroom" },
  { id: "bath-8", italian: "il pettine", english: "Comb", image: px(1319460), category: "Bathroom" },
  { id: "bath-9", italian: "lo specchio", english: "Mirror", image: px(1528975), category: "Bathroom" },
  { id: "bath-10", italian: "il rasoio", english: "Razor", image: px(3737596), category: "Bathroom" },
  { id: "bath-11", italian: "l'asciugacapelli", english: "Hair Dryer", image: px(3993320), category: "Bathroom" },
  { id: "bath-12", italian: "la crema", english: "Cream", image: px(3735218), category: "Bathroom" },
  { id: "bath-13", italian: "il profumo", english: "Perfume", image: px(3059609), category: "Bathroom" },
  { id: "bath-14", italian: "la bilancia", english: "Scale", image: px(4474052), category: "Bathroom" },
  { id: "bath-15", italian: "la spazzola", english: "Brush", image: px(1319460), category: "Bathroom" },

  // ===========================
  // TRANSPORT (15)
  // ===========================
  { id: "trans-1", italian: "l'automobile", english: "Car", image: px(170811), category: "Transport" },
  { id: "trans-2", italian: "la bicicletta", english: "Bicycle", image: px(100582), category: "Transport" },
  { id: "trans-3", italian: "il treno", english: "Train", image: px(302428), category: "Transport" },
  { id: "trans-4", italian: "l'aereo", english: "Airplane", image: px(379419), category: "Transport" },
  { id: "trans-5", italian: "la barca", english: "Boat", image: px(273886), category: "Transport" },
  { id: "trans-6", italian: "l'autobus", english: "Bus", image: px(385998), category: "Transport" },
  { id: "trans-7", italian: "la moto", english: "Motorcycle", image: px(2116475), category: "Transport" },
  { id: "trans-8", italian: "il camion", english: "Truck", image: px(2199293), category: "Transport" },
  { id: "trans-9", italian: "il taxi", english: "Taxi", image: px(2526105), category: "Transport" },
  { id: "trans-10", italian: "l'elicottero", english: "Helicopter", image: px(237071), category: "Transport" },
  { id: "trans-11", italian: "la metropolitana", english: "Subway", image: px(1170187), category: "Transport" },
  { id: "trans-12", italian: "il tram", english: "Tram", image: px(1170187), category: "Transport" },
  { id: "trans-13", italian: "la nave", english: "Ship", image: px(813011), category: "Transport" },
  { id: "trans-14", italian: "il monopattino", english: "Scooter", image: px(2116475), category: "Transport" },
  { id: "trans-15", italian: "il semaforo", english: "Traffic Light", image: px(1036936), category: "Transport" },

  // ===========================
  // NATURE (20)
  // ===========================
  { id: "nat-1", italian: "il sole", english: "Sun", image: px(301599), category: "Nature" },
  { id: "nat-2", italian: "la luna", english: "Moon", image: px(975012), category: "Nature" },
  { id: "nat-3", italian: "il fiore", english: "Flower", image: px(736230), category: "Nature" },
  { id: "nat-4", italian: "l'albero", english: "Tree", image: px(1459495), category: "Nature" },
  { id: "nat-5", italian: "la montagna", english: "Mountain", image: px(417173), category: "Nature" },
  { id: "nat-6", italian: "il mare", english: "Sea", image: px(189349), category: "Nature" },
  { id: "nat-7", italian: "la pioggia", english: "Rain", image: px(110874), category: "Nature" },
  { id: "nat-8", italian: "la neve", english: "Snow", image: px(688660), category: "Nature" },
  { id: "nat-9", italian: "la stella", english: "Star", image: px(1257860), category: "Nature" },
  { id: "nat-10", italian: "la nuvola", english: "Cloud", image: px(2114014), category: "Nature" },
  { id: "nat-11", italian: "il lago", english: "Lake", image: px(346529), category: "Nature" },
  { id: "nat-12", italian: "il fiume", english: "River", image: px(221204), category: "Nature" },
  { id: "nat-13", italian: "la cascata", english: "Waterfall", image: px(358457), category: "Nature" },
  { id: "nat-14", italian: "la foresta", english: "Forest", image: px(338936), category: "Nature" },
  { id: "nat-15", italian: "il deserto", english: "Desert", image: px(847402), category: "Nature" },
  { id: "nat-16", italian: "la spiaggia", english: "Beach", image: px(1007657), category: "Nature" },
  { id: "nat-17", italian: "l'arcobaleno", english: "Rainbow", image: px(1542534), category: "Nature" },
  { id: "nat-18", italian: "il fulmine", english: "Lightning", image: px(1118869), category: "Nature" },
  { id: "nat-19", italian: "il vulcano", english: "Volcano", image: px(4022095), category: "Nature" },
  { id: "nat-20", italian: "l'isola", english: "Island", image: px(1450353), category: "Nature" },

  // ===========================
  // OFFICE & SCHOOL (18)
  // ===========================
  { id: "off-1", italian: "la penna", english: "Pen", image: px(1108572), category: "Office" },
  { id: "off-2", italian: "la matita", english: "Pencil", image: px(1093913), category: "Office" },
  { id: "off-3", italian: "il quaderno", english: "Notebook", image: px(733857), category: "Office" },
  { id: "off-4", italian: "il computer", english: "Computer", image: px(812264), category: "Office" },
  { id: "off-5", italian: "la tastiera", english: "Keyboard", image: px(1714208), category: "Office" },
  { id: "off-6", italian: "il mouse", english: "Mouse", image: px(2115257), category: "Office" },
  { id: "off-7", italian: "lo schermo", english: "Screen", image: px(1029757), category: "Office" },
  { id: "off-8", italian: "la stampante", english: "Printer", image: px(812264), category: "Office" },
  { id: "off-9", italian: "le forbici", english: "Scissors", image: px(1575936), category: "Office" },
  { id: "off-10", italian: "la gomma", english: "Eraser", image: px(1093913), category: "Office" },
  { id: "off-11", italian: "il righello", english: "Ruler", image: px(1093913), category: "Office" },
  { id: "off-12", italian: "la calcolatrice", english: "Calculator", image: px(5926382), category: "Office" },
  { id: "off-13", italian: "la cartella", english: "Folder", image: px(357514), category: "Office" },
  { id: "off-14", italian: "la graffetta", english: "Paper Clip", image: px(279618), category: "Office" },
  { id: "off-15", italian: "la busta", english: "Envelope", image: px(2289731), category: "Office" },
  { id: "off-16", italian: "il francobollo", english: "Stamp", image: px(2289731), category: "Office" },
  { id: "off-17", italian: "la lavagna", english: "Whiteboard", image: px(3184292), category: "Office" },
  { id: "off-18", italian: "lo zaino", english: "Backpack", image: px(2905238), category: "Office" },

  // ===========================
  // SPORTS & HOBBIES (15)
  // ===========================
  { id: "sport-1", italian: "il pallone", english: "Ball", image: px(209339), category: "Sports" },
  { id: "sport-2", italian: "la chitarra", english: "Guitar", image: px(164736), category: "Sports" },
  { id: "sport-3", italian: "il pianoforte", english: "Piano", image: px(164935), category: "Sports" },
  { id: "sport-4", italian: "la macchina fotografica", english: "Camera", image: px(243757), category: "Sports" },
  { id: "sport-5", italian: "la piscina", english: "Swimming Pool", image: px(261327), category: "Sports" },
  { id: "sport-6", italian: "gli sci", english: "Skis", image: px(848599), category: "Sports" },
  { id: "sport-7", italian: "la racchetta", english: "Racket", image: px(209977), category: "Sports" },
  { id: "sport-8", italian: "il pallone da calcio", english: "Football", image: px(461198), category: "Sports" },
  { id: "sport-9", italian: "il canestro", english: "Basketball Hoop", image: px(1752757), category: "Sports" },
  { id: "sport-10", italian: "la barca a vela", english: "Sailboat", image: px(273886), category: "Sports" },
  { id: "sport-11", italian: "il casco", english: "Helmet", image: px(2116475), category: "Sports" },
  { id: "sport-12", italian: "il violino", english: "Violin", image: px(164736), category: "Sports" },
  { id: "sport-13", italian: "il pennello", english: "Paintbrush", image: px(1579708), category: "Sports" },
  { id: "sport-14", italian: "la canna da pesca", english: "Fishing Rod", image: px(128756), category: "Sports" },
  { id: "sport-15", italian: "la bici da corsa", english: "Racing Bike", image: px(100582), category: "Sports" },

  // ===========================
  // PLACES & BUILDINGS (15)
  // ===========================
  { id: "place-1", italian: "la casa", english: "House", image: px(106399), category: "Places" },
  { id: "place-2", italian: "la chiesa", english: "Church", image: px(2159549), category: "Places" },
  { id: "place-3", italian: "il ristorante", english: "Restaurant", image: px(262978), category: "Places" },
  { id: "place-4", italian: "l'ospedale", english: "Hospital", image: px(668300), category: "Places" },
  { id: "place-5", italian: "la scuola", english: "School", image: px(256395), category: "Places" },
  { id: "place-6", italian: "il supermercato", english: "Supermarket", image: px(264636), category: "Places" },
  { id: "place-7", italian: "la farmacia", english: "Pharmacy", image: px(668300), category: "Places" },
  { id: "place-8", italian: "la stazione", english: "Station", image: px(302428), category: "Places" },
  { id: "place-9", italian: "l'aeroporto", english: "Airport", image: px(379419), category: "Places" },
  { id: "place-10", italian: "il parco", english: "Park", image: px(1459495), category: "Places" },
  { id: "place-11", italian: "la biblioteca", english: "Library", image: px(750225), category: "Places" },
  { id: "place-12", italian: "il museo", english: "Museum", image: px(2159549), category: "Places" },
  { id: "place-13", italian: "il ponte", english: "Bridge", image: px(814499), category: "Places" },
  { id: "place-14", italian: "il castello", english: "Castle", image: px(2159549), category: "Places" },
  { id: "place-15", italian: "la fontana", english: "Fountain", image: px(358457), category: "Places" },
  { id: "place-16", italian: "il cinema", english: "Cinema", image: px(1201996), category: "Places" },
  { id: "place-17", italian: "la palestra", english: "Gym", image: px(1552242), category: "Places" },
  { id: "place-18", italian: "la panetteria", english: "Bakery", image: px(1775043), category: "Places" },
  { id: "place-19", italian: "il mercato", english: "Market", image: px(264636), category: "Places" },
  { id: "place-20", italian: "la piazza", english: "Square", image: px(2159549), category: "Places" },

  // ===========================
  // WEATHER (15)
  // ===========================
  { id: "weather-1", italian: "il temporale", english: "Storm", image: px(1118869), category: "Weather" },
  { id: "weather-2", italian: "il vento", english: "Wind", image: px(1770706), category: "Weather" },
  { id: "weather-3", italian: "la nebbia", english: "Fog", image: px(1089930), category: "Weather" },
  { id: "weather-4", italian: "il ghiaccio", english: "Ice", image: px(688660), category: "Weather" },
  { id: "weather-5", italian: "la grandine", english: "Hail", image: px(688660), category: "Weather" },
  { id: "weather-6", italian: "il tuono", english: "Thunder", image: px(1118869), category: "Weather" },
  { id: "weather-7", italian: "la temperatura", english: "Temperature", image: px(4474052), category: "Weather" },
  { id: "weather-8", italian: "il tramonto", english: "Sunset", image: px(301599), category: "Weather" },
  { id: "weather-9", italian: "l'alba", english: "Sunrise", image: px(301599), category: "Weather" },
  { id: "weather-10", italian: "il cielo", english: "Sky", image: px(2114014), category: "Weather" },
  { id: "weather-11", italian: "la brezza", english: "Breeze", image: px(1770706), category: "Weather" },
  { id: "weather-12", italian: "la rugiada", english: "Dew", image: px(1459495), category: "Weather" },
  { id: "weather-13", italian: "l'ombra", english: "Shadow", image: px(1089930), category: "Weather" },
  { id: "weather-14", italian: "la siccità", english: "Drought", image: px(847402), category: "Weather" },
  { id: "weather-15", italian: "l'inondazione", english: "Flood", image: px(221204), category: "Weather" },

  // ===========================
  // TOOLS (15)
  // ===========================
  { id: "tool-1", italian: "il martello", english: "Hammer", image: px(1029141), category: "Tools" },
  { id: "tool-2", italian: "il cacciavite", english: "Screwdriver", image: px(1029141), category: "Tools" },
  { id: "tool-3", italian: "la sega", english: "Saw", image: px(1029141), category: "Tools" },
  { id: "tool-4", italian: "il chiodo", english: "Nail", image: px(1029141), category: "Tools" },
  { id: "tool-5", italian: "la vite", english: "Screw", image: px(1029141), category: "Tools" },
  { id: "tool-6", italian: "la scala", english: "Ladder", image: px(434645), category: "Tools" },
  { id: "tool-7", italian: "la corda", english: "Rope", image: px(273886), category: "Tools" },
  { id: "tool-8", italian: "il secchio", english: "Bucket", image: px(1563075), category: "Tools" },
  { id: "tool-9", italian: "la pala", english: "Shovel", image: px(1459495), category: "Tools" },
  { id: "tool-10", italian: "il pennello", english: "Paint Brush", image: px(1579708), category: "Tools" },
  { id: "tool-11", italian: "il nastro adesivo", english: "Tape", image: px(279618), category: "Tools" },
  { id: "tool-12", italian: "la pinza", english: "Pliers", image: px(1029141), category: "Tools" },
  { id: "tool-13", italian: "la chiave inglese", english: "Wrench", image: px(1029141), category: "Tools" },
  { id: "tool-14", italian: "il trapano", english: "Drill", image: px(1029141), category: "Tools" },
  { id: "tool-15", italian: "il metro", english: "Tape Measure", image: px(1029141), category: "Tools" },

  // ===========================
  // COLOURS (12)
  // ===========================
  { id: "colour-1", italian: "rosso", english: "Red", image: px(1310777), category: "Colours" },
  { id: "colour-2", italian: "blu", english: "Blue", image: px(2114014), category: "Colours" },
  { id: "colour-3", italian: "verde", english: "Green", image: px(1459495), category: "Colours" },
  { id: "colour-4", italian: "giallo", english: "Yellow", image: px(736230), category: "Colours" },
  { id: "colour-5", italian: "arancione", english: "Orange", image: px(2090903), category: "Colours" },
  { id: "colour-6", italian: "viola", english: "Purple", image: px(672142), category: "Colours" },
  { id: "colour-7", italian: "rosa", english: "Pink", image: px(736230), category: "Colours" },
  { id: "colour-8", italian: "nero", english: "Black", image: px(416160), category: "Colours" },
  { id: "colour-9", italian: "bianco", english: "White", image: px(688660), category: "Colours" },
  { id: "colour-10", italian: "grigio", english: "Grey", image: px(2114014), category: "Colours" },
  { id: "colour-11", italian: "marrone", english: "Brown", image: px(918327), category: "Colours" },
  { id: "colour-12", italian: "dorato", english: "Gold", image: px(1638280), category: "Colours" },

  // ===========================
  // EVERYDAY ITEMS (30)
  // ===========================
  { id: "every-1", italian: "il portafoglio", english: "Wallet", image: px(1152077), category: "Everyday" },
  { id: "every-2", italian: "le chiavi", english: "Keys", image: px(279810), category: "Everyday" },
  { id: "every-3", italian: "il cellulare", english: "Mobile Phone", image: px(607812), category: "Everyday" },
  { id: "every-4", italian: "gli auricolari", english: "Earphones", image: px(3807517), category: "Everyday" },
  { id: "every-5", italian: "la carta di credito", english: "Credit Card", image: px(4386373), category: "Everyday" },
  { id: "every-6", italian: "il giornale", english: "Newspaper", image: px(904620), category: "Everyday" },
  { id: "every-7", italian: "la rivista", english: "Magazine", image: px(904620), category: "Everyday" },
  { id: "every-8", italian: "la moneta", english: "Coin", image: px(1205651), category: "Everyday" },
  { id: "every-9", italian: "la banconota", english: "Banknote", image: px(1205651), category: "Everyday" },
  { id: "every-10", italian: "il passaporto", english: "Passport", image: px(2289731), category: "Everyday" },
  { id: "every-11", italian: "la valigia", english: "Suitcase", image: px(1170187), category: "Everyday" },
  { id: "every-12", italian: "la mappa", english: "Map", image: px(2007647), category: "Everyday" },
  { id: "every-13", italian: "il biglietto", english: "Ticket", image: px(2289731), category: "Everyday" },
  { id: "every-14", italian: "la batteria", english: "Battery", image: px(607812), category: "Everyday" },
  { id: "every-15", italian: "il caricatore", english: "Charger", image: px(607812), category: "Everyday" },
  { id: "every-16", italian: "la spina", english: "Plug", image: px(1112598), category: "Everyday" },
  { id: "every-17", italian: "l'interruttore", english: "Switch", image: px(1112598), category: "Everyday" },
  { id: "every-18", italian: "la lampadina", english: "Light Bulb", image: px(1112598), category: "Everyday" },
  { id: "every-19", italian: "la pila", english: "Torch", image: px(1112598), category: "Everyday" },
  { id: "every-20", italian: "il sacchetto", english: "Plastic Bag", image: px(1152077), category: "Everyday" },
  { id: "every-21", italian: "la scatola", english: "Box", image: px(3609080), category: "Everyday" },
  { id: "every-22", italian: "il pacco", english: "Parcel", image: px(3609080), category: "Everyday" },
  { id: "every-23", italian: "la lettera", english: "Letter", image: px(2289731), category: "Everyday" },
  { id: "every-24", italian: "il fazzoletto", english: "Tissue", image: px(2762171), category: "Everyday" },
  { id: "every-25", italian: "la medicina", english: "Medicine", image: px(3935702), category: "Everyday" },
  { id: "every-26", italian: "il cerotto", english: "Plaster", image: px(3935702), category: "Everyday" },
  { id: "every-27", italian: "gli occhiali da sole", english: "Sunglasses", image: px(975668), category: "Everyday" },
  { id: "every-28", italian: "il fiammifero", english: "Match", image: px(278549), category: "Everyday" },
  { id: "every-29", italian: "l'accendino", english: "Lighter", image: px(278549), category: "Everyday" },
  { id: "every-30", italian: "il cestino", english: "Bin", image: px(3609080), category: "Everyday" },

  // ===========================
  // MORE FOOD (15)
  // ===========================
  { id: "food-26", italian: "l'olio d'oliva", english: "Olive Oil", image: px(1108117), category: "Food" },
  { id: "food-27", italian: "l'aceto", english: "Vinegar", image: px(1108117), category: "Food" },
  { id: "food-28", italian: "la farina", english: "Flour", image: px(1775043), category: "Food" },
  { id: "food-29", italian: "lo zucchero", english: "Sugar", image: px(2589651), category: "Food" },
  { id: "food-30", italian: "la marmellata", english: "Jam", image: px(1638280), category: "Food" },
  { id: "food-31", italian: "le noci", english: "Walnuts", image: px(1295572), category: "Food" },
  { id: "food-32", italian: "le mandorle", english: "Almonds", image: px(1295572), category: "Food" },
  { id: "food-33", italian: "il tonno", english: "Tuna", image: px(3296279), category: "Food" },
  { id: "food-34", italian: "il gamberetto", english: "Shrimp", image: px(3296279), category: "Food" },
  { id: "food-35", italian: "il salmone", english: "Salmon", image: px(3296279), category: "Food" },
  { id: "food-36", italian: "la lasagna", english: "Lasagna", image: px(1279330), category: "Food" },
  { id: "food-37", italian: "il risotto", english: "Risotto", image: px(723198), category: "Food" },
  { id: "food-38", italian: "la focaccia", english: "Focaccia", image: px(1775043), category: "Food" },
  { id: "food-39", italian: "il pesto", english: "Pesto", image: px(1640777), category: "Food" },
  { id: "food-40", italian: "la mozzarella", english: "Mozzarella", image: px(821365), category: "Food" },

  // ===========================
  // MORE ANIMALS (15)
  // ===========================
  { id: "animal-21", italian: "il lupo", english: "Wolf", image: px(247502), category: "Animals" },
  { id: "animal-22", italian: "l'orso", english: "Bear", image: px(2253832), category: "Animals" },
  { id: "animal-23", italian: "il cervo", english: "Deer", image: px(1089842), category: "Animals" },
  { id: "animal-24", italian: "il pappagallo", english: "Parrot", image: px(1209978), category: "Animals" },
  { id: "animal-25", italian: "il gufo", english: "Owl", image: px(1209978), category: "Animals" },
  { id: "animal-26", italian: "il delfino", english: "Dolphin", image: px(128756), category: "Animals" },
  { id: "animal-27", italian: "la balena", english: "Whale", image: px(128756), category: "Animals" },
  { id: "animal-28", italian: "lo squalo", english: "Shark", image: px(128756), category: "Animals" },
  { id: "animal-29", italian: "il pinguino", english: "Penguin", image: px(1209978), category: "Animals" },
  { id: "animal-30", italian: "il serpente", english: "Snake", image: px(1076429), category: "Animals" },
  { id: "animal-31", italian: "la tigre", english: "Tiger", image: px(247502), category: "Animals" },
  { id: "animal-32", italian: "la zebra", english: "Zebra", image: px(802112), category: "Animals" },
  { id: "animal-33", italian: "il coccodrillo", english: "Crocodile", image: px(1076429), category: "Animals" },
  { id: "animal-34", italian: "la formica", english: "Ant", image: px(460961), category: "Animals" },
  { id: "animal-35", italian: "la lumaca", english: "Snail", image: px(1076429), category: "Animals" },

  // ===========================
  // MORE HOUSEHOLD (15)
  // ===========================
  { id: "house-26", italian: "il rubinetto", english: "Tap", image: px(1549060), category: "Household" },
  { id: "house-27", italian: "la presa", english: "Socket", image: px(1112598), category: "Household" },
  { id: "house-28", italian: "il termosifone", english: "Radiator", image: px(1743229), category: "Household" },
  { id: "house-29", italian: "il ventilatore", english: "Fan", image: px(1112598), category: "Household" },
  { id: "house-30", italian: "l'aspirapolvere", english: "Vacuum Cleaner", image: px(6585759), category: "Household" },
  { id: "house-31", italian: "la lavatrice", english: "Washing Machine", image: px(5825576), category: "Household" },
  { id: "house-32", italian: "il ferro da stiro", english: "Iron", image: px(3609080), category: "Household" },
  { id: "house-33", italian: "la scopa", english: "Broom", image: px(6585759), category: "Household" },
  { id: "house-34", italian: "il secchio", english: "Bucket", image: px(1563075), category: "Household" },
  { id: "house-35", italian: "la sveglia", english: "Alarm Clock", image: px(707582), category: "Household" },
  { id: "house-36", italian: "il telecomando", english: "Remote Control", image: px(1201996), category: "Household" },
  { id: "house-37", italian: "la pattumiera", english: "Bin", image: px(3609080), category: "Household" },
  { id: "house-38", italian: "il tetto", english: "Roof", image: px(106399), category: "Household" },
  { id: "house-39", italian: "il pavimento", english: "Floor", image: px(6585759), category: "Household" },
  { id: "house-40", italian: "il muro", english: "Wall", image: px(277559), category: "Household" },

  // ===========================
  // MORE BODY (10)
  // ===========================
  { id: "body-21", italian: "la caviglia", english: "Ankle", image: px(1249546), category: "Body" },
  { id: "body-22", italian: "il polso", english: "Wrist", image: px(2104044), category: "Body" },
  { id: "body-23", italian: "il petto", english: "Chest", image: px(1552242), category: "Body" },
  { id: "body-24", italian: "la pancia", english: "Belly", image: px(1552242), category: "Body" },
  { id: "body-25", italian: "il sopracciglio", english: "Eyebrow", image: px(1300402), category: "Body" },
  { id: "body-26", italian: "il mento", english: "Chin", image: px(1300402), category: "Body" },
  { id: "body-27", italian: "la fronte", english: "Forehead", image: px(1300402), category: "Body" },
  { id: "body-28", italian: "l'unghia", english: "Nail", image: px(2104044), category: "Body" },
  { id: "body-29", italian: "il labbro", english: "Lip", image: px(1191531), category: "Body" },
  { id: "body-30", italian: "la guancia", english: "Cheek", image: px(1300402), category: "Body" },

  // ===========================
  // MORE CLOTHING (10)
  // ===========================
  { id: "cloth-21", italian: "il pigiama", english: "Pyjamas", image: px(4210337), category: "Clothing" },
  { id: "cloth-22", italian: "il costume da bagno", english: "Swimsuit", image: px(261327), category: "Clothing" },
  { id: "cloth-23", italian: "la felpa", english: "Hoodie", image: px(4066293), category: "Clothing" },
  { id: "cloth-24", italian: "i jeans", english: "Jeans", image: px(1598507), category: "Clothing" },
  { id: "cloth-25", italian: "la tuta", english: "Tracksuit", image: px(1552242), category: "Clothing" },
  { id: "cloth-26", italian: "l'impermeabile", english: "Raincoat", image: px(1755385), category: "Clothing" },
  { id: "cloth-27", italian: "i sandali", english: "Sandals", image: px(267242), category: "Clothing" },
  { id: "cloth-28", italian: "la collana", english: "Necklace", image: px(1152077), category: "Clothing" },
  { id: "cloth-29", italian: "l'anello", english: "Ring", image: px(1152077), category: "Clothing" },
  { id: "cloth-30", italian: "il braccialetto", english: "Bracelet", image: px(1152077), category: "Clothing" },

  // ===========================
  // MORE NATURE (10)
  // ===========================
  { id: "nat-21", italian: "la foglia", english: "Leaf", image: px(1459495), category: "Nature" },
  { id: "nat-22", italian: "l'erba", english: "Grass", image: px(1459495), category: "Nature" },
  { id: "nat-23", italian: "la roccia", english: "Rock", image: px(417173), category: "Nature" },
  { id: "nat-24", italian: "la sabbia", english: "Sand", image: px(1007657), category: "Nature" },
  { id: "nat-25", italian: "il fango", english: "Mud", image: px(221204), category: "Nature" },
  { id: "nat-26", italian: "il ghiacciaio", english: "Glacier", image: px(688660), category: "Nature" },
  { id: "nat-27", italian: "la grotta", english: "Cave", image: px(417173), category: "Nature" },
  { id: "nat-28", italian: "la collina", english: "Hill", image: px(417173), category: "Nature" },
  { id: "nat-29", italian: "la valle", english: "Valley", image: px(417173), category: "Nature" },
  { id: "nat-30", italian: "il campo", english: "Field", image: px(1459495), category: "Nature" },

  // ===========================
  // MORE TRANSPORT (10)
  // ===========================
  { id: "trans-16", italian: "il furgone", english: "Van", image: px(2199293), category: "Transport" },
  { id: "trans-17", italian: "l'ambulanza", english: "Ambulance", image: px(668300), category: "Transport" },
  { id: "trans-18", italian: "i vigili del fuoco", english: "Fire Engine", image: px(2199293), category: "Transport" },
  { id: "trans-19", italian: "il trattore", english: "Tractor", image: px(2199293), category: "Transport" },
  { id: "trans-20", italian: "il parcheggio", english: "Car Park", image: px(170811), category: "Transport" },
  { id: "trans-21", italian: "la benzina", english: "Petrol", image: px(170811), category: "Transport" },
  { id: "trans-22", italian: "la ruota", english: "Wheel", image: px(170811), category: "Transport" },
  { id: "trans-23", italian: "il volante", english: "Steering Wheel", image: px(170811), category: "Transport" },
  { id: "trans-24", italian: "il finestrino", english: "Car Window", image: px(170811), category: "Transport" },
  { id: "trans-25", italian: "il bagagliaio", english: "Boot/Trunk", image: px(170811), category: "Transport" },

  // ===========================
  // MORE SPORTS (10)
  // ===========================
  { id: "sport-16", italian: "la pallavolo", english: "Volleyball", image: px(209339), category: "Sports" },
  { id: "sport-17", italian: "il nuoto", english: "Swimming", image: px(261327), category: "Sports" },
  { id: "sport-18", italian: "la corsa", english: "Running", image: px(3622614), category: "Sports" },
  { id: "sport-19", italian: "il golf", english: "Golf", image: px(209339), category: "Sports" },
  { id: "sport-20", italian: "il tennis", english: "Tennis", image: px(209977), category: "Sports" },
  { id: "sport-21", italian: "la batteria", english: "Drums", image: px(164736), category: "Sports" },
  { id: "sport-22", italian: "il flauto", english: "Flute", image: px(164736), category: "Sports" },
  { id: "sport-23", italian: "la tromba", english: "Trumpet", image: px(164736), category: "Sports" },
  { id: "sport-24", italian: "il surf", english: "Surfing", image: px(1007657), category: "Sports" },
  { id: "sport-25", italian: "l'arrampicata", english: "Climbing", image: px(417173), category: "Sports" },
];
