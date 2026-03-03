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

export const pictureCards: PictureCard[] = [
  // ===========================
  // FOOD (40)
  // ===========================
  { id: "food-1", italian: "il pane", english: "Bread", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Korb_mit_Br%C3%B6tchen.JPG/600px-Korb_mit_Br%C3%B6tchen.JPG", category: "Food" },
  { id: "food-2", italian: "il formaggio", english: "Cheese", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Cheese_platter.jpg/600px-Cheese_platter.jpg", category: "Food" },
  { id: "food-3", italian: "la pasta", english: "Pasta", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/%28Pasta%29_by_David_Adam_Kess_%28pic.2%29.jpg/600px-%28Pasta%29_by_David_Adam_Kess_%28pic.2%29.jpg", category: "Food" },
  { id: "food-4", italian: "la pizza", english: "Pizza", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Pizza-3007395.jpg/600px-Pizza-3007395.jpg", category: "Food" },
  { id: "food-5", italian: "il gelato", english: "Ice Cream", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Ice_cream_with_whipped_cream%2C_chocolate_syrup%2C_and_a_wafer_%28cropped%29.jpg/600px-Ice_cream_with_whipped_cream%2C_chocolate_syrup%2C_and_a_wafer_%28cropped%29.jpg", category: "Food" },
  { id: "food-6", italian: "l'uovo", english: "Egg", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Adolphe_Millot_oeufs-fixed.jpg/600px-Adolphe_Millot_oeufs-fixed.jpg", category: "Food" },
  { id: "food-7", italian: "il riso", english: "Rice", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/20201102.Hengnan.Hybrid_rice_Sanyou-1.6.jpg/600px-20201102.Hengnan.Hybrid_rice_Sanyou-1.6.jpg", category: "Food" },
  { id: "food-8", italian: "il burro", english: "Butter", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/%C5%A0v%C3%A9dsk%C3%BD_kol%C3%A1%C4%8D_naruby_904_%28cropped%29.JPG/600px-%C5%A0v%C3%A9dsk%C3%BD_kol%C3%A1%C4%8D_naruby_904_%28cropped%29.JPG", category: "Food" },
  { id: "food-9", italian: "il pollo", english: "Chicken", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Male_and_female_chicken_sitting_together.jpg/600px-Male_and_female_chicken_sitting_together.jpg", category: "Food" },
  { id: "food-10", italian: "il pesce", english: "Fish", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Balantiocheilos_melanopterus_-_Karlsruhe_Zoo_02_%28cropped%29.jpg/600px-Balantiocheilos_melanopterus_-_Karlsruhe_Zoo_02_%28cropped%29.jpg", category: "Food" },
  { id: "food-11", italian: "la carne", english: "Meat", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/FoodMeat.jpg/600px-FoodMeat.jpg", category: "Food" },
  { id: "food-12", italian: "la zuppa", english: "Soup", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Asparagus_soup_%28spargelsuppe%29.jpg/600px-Asparagus_soup_%28spargelsuppe%29.jpg", category: "Food" },
  { id: "food-13", italian: "l'insalata", english: "Salad", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Salad_platter.jpg/600px-Salad_platter.jpg", category: "Food" },
  { id: "food-14", italian: "il panino", english: "Sandwich", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Bacon%2C_lettuce%2C_tomato%2C_and_avocado.jpg/600px-Bacon%2C_lettuce%2C_tomato%2C_and_avocado.jpg", category: "Food" },
  { id: "food-15", italian: "la torta", english: "Cake", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Pound_layer_cake.jpg/600px-Pound_layer_cake.jpg", category: "Food" },
  { id: "food-16", italian: "il biscotto", english: "Cookie", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Choco_chip_cookie.png/600px-Choco_chip_cookie.png", category: "Food" },
  { id: "food-17", italian: "il cioccolato", english: "Chocolate", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Three_Bars_%281%29.jpg/600px-Three_Bars_%281%29.jpg", category: "Food" },
  { id: "food-18", italian: "il miele", english: "Honey", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Runny_hunny.jpg/600px-Runny_hunny.jpg", category: "Food" },
  { id: "food-19", italian: "la salsiccia", english: "Sausage", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Wurstplatte.jpg/600px-Wurstplatte.jpg", category: "Food" },
  { id: "food-20", italian: "il prosciutto", english: "Ham", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Ham_%284%29.jpg/600px-Ham_%284%29.jpg", category: "Food" },
  { id: "food-21", italian: "lo yogurt", english: "Yogurt", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Joghurt.jpg/600px-Joghurt.jpg", category: "Food" },
  { id: "food-22", italian: "i cereali", english: "Cereal", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Les_Plantes_Cultivades._Cereals._Imatge_119.jpg/600px-Les_Plantes_Cultivades._Cereals._Imatge_119.jpg", category: "Food" },
  { id: "food-23", italian: "le patatine fritte", english: "French Fries", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/French_Fries.JPG/600px-French_Fries.JPG", category: "Food" },
  { id: "food-24", italian: "il sale", english: "Salt", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Rock_salt_%28halitite%29_%28Billianwala_Salt_Member%2C_Salt_Range_Formation%2C_Ediacaran_to_Lower_Cambrian%3B_Khewra_Salt_Mine%2C_Salt_Range%2C_Pakistan%29_14.jpg/600px-Rock_salt_%28halitite%29_%28Billianwala_Salt_Member%2C_Salt_Range_Formation%2C_Ediacaran_to_Lower_Cambrian%3B_Khewra_Salt_Mine%2C_Salt_Range%2C_Pakistan%29_14.jpg", category: "Food" },
  { id: "food-25", italian: "il pepe", english: "Pepper", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Piper_nigrum_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-107.jpg/600px-Piper_nigrum_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-107.jpg", category: "Food" },

  // ===========================
  // FRUIT & VEG (25)
  // ===========================
  { id: "fv-1", italian: "la mela", english: "Apple", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Pink_lady_and_cross_section.jpg/600px-Pink_lady_and_cross_section.jpg", category: "Fruit & Veg" },
  { id: "fv-2", italian: "la banana", english: "Banana", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Bananavarieties.jpg/600px-Bananavarieties.jpg", category: "Fruit & Veg" },
  { id: "fv-3", italian: "il pomodoro", english: "Tomato", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Tomato_je.jpg/600px-Tomato_je.jpg", category: "Fruit & Veg" },
  { id: "fv-4", italian: "l'arancia", english: "Orange", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Oranges_-_whole-halved-segment.jpg/600px-Oranges_-_whole-halved-segment.jpg", category: "Fruit & Veg" },
  { id: "fv-5", italian: "il limone", english: "Lemon", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/P1030323.JPG/600px-P1030323.JPG", category: "Fruit & Veg" },
  { id: "fv-6", italian: "la fragola", english: "Strawberry", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Garden_strawberry_%28Fragaria_%C3%97_ananassa%29_single2.jpg/600px-Garden_strawberry_%28Fragaria_%C3%97_ananassa%29_single2.jpg", category: "Fruit & Veg" },
  { id: "fv-7", italian: "l'uva", english: "Grapes", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Grapes%2C_Rostov-on-Don%2C_Russia.jpg/600px-Grapes%2C_Rostov-on-Don%2C_Russia.jpg", category: "Fruit & Veg" },
  { id: "fv-8", italian: "l'anguria", english: "Watermelon", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Taiwan_2009_Tainan_City_Organic_Farm_Watermelon_FRD_7962.jpg/600px-Taiwan_2009_Tainan_City_Organic_Farm_Watermelon_FRD_7962.jpg", category: "Fruit & Veg" },
  { id: "fv-9", italian: "la pesca", english: "Peach", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Illustration_Prunus_persica_clean_no_descr.jpg/600px-Illustration_Prunus_persica_clean_no_descr.jpg", category: "Fruit & Veg" },
  { id: "fv-10", italian: "la pera", english: "Pear", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Pears.jpg/600px-Pears.jpg", category: "Fruit & Veg" },
  { id: "fv-11", italian: "l'ananas", english: "Pineapple", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/%E0%B4%95%E0%B5%88%E0%B4%A4%E0%B4%9A%E0%B5%8D%E0%B4%9A%E0%B4%95%E0%B5%8D%E0%B4%95.jpg/600px-%E0%B4%95%E0%B5%88%E0%B4%A4%E0%B4%9A%E0%B5%8D%E0%B4%9A%E0%B4%95%E0%B5%8D%E0%B4%95.jpg", category: "Fruit & Veg" },
  { id: "fv-12", italian: "la ciliegia", english: "Cherry", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Cherry_season_%2848216568227%29.jpg/600px-Cherry_season_%2848216568227%29.jpg", category: "Fruit & Veg" },
  { id: "fv-13", italian: "la carota", english: "Carrot", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Vegetable-Carrot-Bundle-wStalks.jpg/600px-Vegetable-Carrot-Bundle-wStalks.jpg", category: "Fruit & Veg" },
  { id: "fv-14", italian: "la patata", english: "Potato", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Patates.jpg/600px-Patates.jpg", category: "Fruit & Veg" },
  { id: "fv-15", italian: "la cipolla", english: "Onion", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Mixed_onions.jpg/600px-Mixed_onions.jpg", category: "Fruit & Veg" },
  { id: "fv-16", italian: "l'aglio", english: "Garlic", image: "https://upload.wikimedia.org/wikipedia/commons/3/39/Allium_sativum_Woodwill_1793.jpg", category: "Fruit & Veg" },
  { id: "fv-17", italian: "il peperone", english: "Bell Pepper", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Green-Yellow-Red-Pepper-2009.jpg/600px-Green-Yellow-Red-Pepper-2009.jpg", category: "Fruit & Veg" },
  { id: "fv-18", italian: "il cetriolo", english: "Cucumber", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/ARS_cucumber.jpg/600px-ARS_cucumber.jpg", category: "Fruit & Veg" },
  { id: "fv-19", italian: "la lattuga", english: "Lettuce", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Iceberg_lettuce_in_SB.jpg/600px-Iceberg_lettuce_in_SB.jpg", category: "Fruit & Veg" },
  { id: "fv-20", italian: "il fungo", english: "Mushroom", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Sparrige_Sch%C3%BCppling_%28Pholiota_squarrosa%29.jpg/600px-Sparrige_Sch%C3%BCppling_%28Pholiota_squarrosa%29.jpg", category: "Fruit & Veg" },
  { id: "fv-21", italian: "i broccoli", english: "Broccoli", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Broccoli_and_cross_section_edit.jpg/600px-Broccoli_and_cross_section_edit.jpg", category: "Fruit & Veg" },
  { id: "fv-22", italian: "gli spinaci", english: "Spinach", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Spinacia_oleracea_Spinazie_bloeiend.jpg/600px-Spinacia_oleracea_Spinazie_bloeiend.jpg", category: "Fruit & Veg" },
  { id: "fv-23", italian: "il mais", english: "Corn", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Zea_mays_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-283.jpg/600px-Zea_mays_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-283.jpg", category: "Fruit & Veg" },
  { id: "fv-24", italian: "la melanzana", english: "Eggplant", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Solanum_melongena_24_08_2012_%281%29.JPG/600px-Solanum_melongena_24_08_2012_%281%29.JPG", category: "Fruit & Veg" },
  { id: "fv-25", italian: "la zucca", english: "Pumpkin", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/FrenchMarketPumpkinsB.jpg/600px-FrenchMarketPumpkinsB.jpg", category: "Fruit & Veg" },

  // ===========================
  // DRINKS (12)
  // ===========================
  { id: "drink-1", italian: "il caffè", english: "Coffee", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Latte_and_dark_coffee.jpg/600px-Latte_and_dark_coffee.jpg", category: "Drinks" },
  { id: "drink-2", italian: "il vino", english: "Wine", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Red_and_white_wine_in_glass.jpg/600px-Red_and_white_wine_in_glass.jpg", category: "Drinks" },
  { id: "drink-3", italian: "l'acqua", english: "Water", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/H2O_2D_labelled.svg/600px-H2O_2D_labelled.svg.png", category: "Drinks" },
  { id: "drink-4", italian: "la birra", english: "Beer", image: "https://upload.wikimedia.org/wikipedia/commons/7/78/GravityTap.jpg", category: "Drinks" },
  { id: "drink-5", italian: "il tè", english: "Tea", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Longjing_tea_steeping_in_gaiwan.jpg/600px-Longjing_tea_steeping_in_gaiwan.jpg", category: "Drinks" },
  { id: "drink-6", italian: "il succo d'arancia", english: "Orange Juice", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Orangejuice.jpg/600px-Orangejuice.jpg", category: "Drinks" },
  { id: "drink-7", italian: "il latte", english: "Milk", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Glass_of_Milk_%2833657535532%29.jpg/600px-Glass_of_Milk_%2833657535532%29.jpg", category: "Drinks" },
  { id: "drink-8", italian: "la limonata", english: "Lemonade", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Lemonade_-_27682817724.jpg/600px-Lemonade_-_27682817724.jpg", category: "Drinks" },
  { id: "drink-9", italian: "il frullato", english: "Smoothie", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Kiwi_Smoothie.jpg/600px-Kiwi_Smoothie.jpg", category: "Drinks" },
  { id: "drink-10", italian: "la cioccolata calda", english: "Hot Chocolate", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/After_The_St._Patrick%27s_Parade_Late_Lunch_%40_Lemon%2C_Dawson_Street%2C_Dublin%2C_Rep._Of_Ireland_A_Fine_Tradition%21_%286992614913%29.jpg/600px-After_The_St._Patrick%27s_Parade_Late_Lunch_%40_Lemon%2C_Dawson_Street%2C_Dublin%2C_Rep._Of_Ireland_A_Fine_Tradition%21_%286992614913%29.jpg", category: "Drinks" },
  { id: "drink-11", italian: "il cappuccino", english: "Cappuccino", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Cappuccino_in_original.jpg/600px-Cappuccino_in_original.jpg", category: "Drinks" },
  { id: "drink-12", italian: "lo spumante", english: "Sparkling Wine", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Glass_of_champagne.jpg/600px-Glass_of_champagne.jpg", category: "Drinks" },

  // ===========================
  // ANIMALS (35)
  // ===========================
  { id: "animal-1", italian: "il gatto", english: "Cat", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Cat_August_2010-4.jpg/600px-Cat_August_2010-4.jpg", category: "Animals" },
  { id: "animal-2", italian: "il cane", english: "Dog", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Huskiesatrest.jpg/600px-Huskiesatrest.jpg", category: "Animals" },
  { id: "animal-3", italian: "il cavallo", english: "Horse", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Nokota_Horses_cropped.jpg/600px-Nokota_Horses_cropped.jpg", category: "Animals" },
  { id: "animal-4", italian: "l'uccello", english: "Bird", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Bird_Diversity_2013.png/600px-Bird_Diversity_2013.png", category: "Animals" },
  { id: "animal-5", italian: "la farfalla", english: "Butterfly", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Fesoj_-_Papilio_machaon_%28by%29.jpg/600px-Fesoj_-_Papilio_machaon_%28by%29.jpg", category: "Animals" },
  { id: "animal-6", italian: "la mucca", english: "Cow", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Cow_%28Fleckvieh_breed%29_Oeschinensee_Slaunger_2009-07-07.jpg/600px-Cow_%28Fleckvieh_breed%29_Oeschinensee_Slaunger_2009-07-07.jpg", category: "Animals" },
  { id: "animal-7", italian: "il coniglio", english: "Rabbit", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Oryctolagus_cuniculus_Rcdo.jpg/600px-Oryctolagus_cuniculus_Rcdo.jpg", category: "Animals" },
  { id: "animal-8", italian: "la tartaruga", english: "Turtle", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Turtle_diversity.jpg/600px-Turtle_diversity.jpg", category: "Animals" },
  { id: "animal-9", italian: "l'elefante", english: "Elephant", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/African_Bush_Elephant.jpg/600px-African_Bush_Elephant.jpg", category: "Animals" },
  { id: "animal-10", italian: "il leone", english: "Lion", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/020_The_lion_king_Snyggve_in_the_Serengeti_National_Park_Photo_by_Giles_Laurent.jpg/600px-020_The_lion_king_Snyggve_in_the_Serengeti_National_Park_Photo_by_Giles_Laurent.jpg", category: "Animals" },
  { id: "animal-11", italian: "la pecora", english: "Sheep", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Flock_of_sheep.jpg/600px-Flock_of_sheep.jpg", category: "Animals" },
  { id: "animal-12", italian: "il maiale", english: "Pig", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Pig_farm_Vampula_1.jpg/600px-Pig_farm_Vampula_1.jpg", category: "Animals" },
  { id: "animal-13", italian: "la gallina", english: "Hen", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Male_and_female_chicken_sitting_together.jpg/600px-Male_and_female_chicken_sitting_together.jpg", category: "Animals" },
  { id: "animal-14", italian: "l'anatra", english: "Duck", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Bucephala-albeola-010.jpg/600px-Bucephala-albeola-010.jpg", category: "Animals" },
  { id: "animal-15", italian: "il pesce", english: "Fish", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Balantiocheilos_melanopterus_-_Karlsruhe_Zoo_02_%28cropped%29.jpg/600px-Balantiocheilos_melanopterus_-_Karlsruhe_Zoo_02_%28cropped%29.jpg", category: "Animals" },
  { id: "animal-16", italian: "la rana", english: "Frog", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Red-eyed_Leaf_Frog_%2849661076226%29.jpg/600px-Red-eyed_Leaf_Frog_%2849661076226%29.jpg", category: "Animals" },
  { id: "animal-17", italian: "il ragno", english: "Spider", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Araneae3.jpg/600px-Araneae3.jpg", category: "Animals" },
  { id: "animal-18", italian: "l'ape", english: "Bee", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Tetragonula_carbonaria_%2814521993792%29.jpg/600px-Tetragonula_carbonaria_%2814521993792%29.jpg", category: "Animals" },
  { id: "animal-19", italian: "la giraffa", english: "Giraffe", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Giraffe_Mikumi_National_Park.jpg/600px-Giraffe_Mikumi_National_Park.jpg", category: "Animals" },
  { id: "animal-20", italian: "la scimmia", english: "Monkey", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/BrownSpiderMonkey_%28edit2%29.jpg/600px-BrownSpiderMonkey_%28edit2%29.jpg", category: "Animals" },

  // ===========================
  // CLOTHING (30)
  // ===========================
  { id: "cloth-1", italian: "la camicia", english: "Shirt", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Charvet_shirt.jpg/600px-Charvet_shirt.jpg", category: "Clothing" },
  { id: "cloth-2", italian: "le scarpe", english: "Shoes", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Skor_fr%C3%A5n_1700-_till_1960-talet_-_Nordiska_Museet_-_NMA.0056302.jpg/600px-Skor_fr%C3%A5n_1700-_till_1960-talet_-_Nordiska_Museet_-_NMA.0056302.jpg", category: "Clothing" },
  { id: "cloth-3", italian: "il cappello", english: "Hat", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Chapeaux_en_peau_de_castor.jpg/600px-Chapeaux_en_peau_de_castor.jpg", category: "Clothing" },
  { id: "cloth-4", italian: "gli occhiali", english: "Glasses", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/2023_Okulary_korekcyjne.jpg/600px-2023_Okulary_korekcyjne.jpg", category: "Clothing" },
  { id: "cloth-5", italian: "la borsa", english: "Bag", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Bolsas-de-asa-plana-interior-bolsapubli.jpg/600px-Bolsas-de-asa-plana-interior-bolsapubli.jpg", category: "Clothing" },
  { id: "cloth-6", italian: "l'orologio", english: "Watch", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Casio_OCEANUS_OCW-S1350PC-1AJR_01.JPG/600px-Casio_OCEANUS_OCW-S1350PC-1AJR_01.JPG", category: "Clothing" },
  { id: "cloth-7", italian: "i guanti", english: "Gloves", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Centre_de_Documentaci%C3%B3_Museu_T%C3%A8xtil_de_Terrassa-_Reserves-_Teixits-_Guants002.JPG/600px-Centre_de_Documentaci%C3%B3_Museu_T%C3%A8xtil_de_Terrassa-_Reserves-_Teixits-_Guants002.JPG", category: "Clothing" },
  { id: "cloth-8", italian: "la sciarpa", english: "Scarf", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/100%25_Kaschmir_Wolle_vonk_kaschmirprodukte.de.jpg/600px-100%25_Kaschmir_Wolle_vonk_kaschmirprodukte.de.jpg", category: "Clothing" },
  { id: "cloth-9", italian: "i pantaloni", english: "Trousers", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Trousers-colourisolated.jpg/600px-Trousers-colourisolated.jpg", category: "Clothing" },
  { id: "cloth-10", italian: "la gonna", english: "Skirt", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Skirt.jpg/600px-Skirt.jpg", category: "Clothing" },
  { id: "cloth-11", italian: "il vestito", english: "Dress", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Afternoon_ensemble_MET_63.212a-b_CP4.jpg/600px-Afternoon_ensemble_MET_63.212a-b_CP4.jpg", category: "Clothing" },
  { id: "cloth-12", italian: "la giacca", english: "Jacket", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Jacket2-1.jpg/600px-Jacket2-1.jpg", category: "Clothing" },
  { id: "cloth-13", italian: "il cappotto", english: "Coat", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/FalatJulian.PortretAntoniegoWodzickiego.1900.ws.jpg/600px-FalatJulian.PortretAntoniegoWodzickiego.1900.ws.jpg", category: "Clothing" },
  { id: "cloth-14", italian: "la cravatta", english: "Tie", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Memphis_tie_1A.JPG/600px-Memphis_tie_1A.JPG", category: "Clothing" },
  { id: "cloth-15", italian: "i calzini", english: "Socks", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/HandKnittedWhiteLaceSock.jpg/600px-HandKnittedWhiteLaceSock.jpg", category: "Clothing" },
  { id: "cloth-16", italian: "la cintura", english: "Belt", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Germany_Belt-and-Buckle-02.jpg/600px-Germany_Belt-and-Buckle-02.jpg", category: "Clothing" },
  { id: "cloth-17", italian: "gli stivali", english: "Boots", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Michael_Kors_Bryn_Bootie_Ankleboot_-_Stiefelette_mit_Nieten_40F4BRHE6L_Kalbsleder_schwarz_%282%29_%2816612274402%29.jpg/600px-Michael_Kors_Bryn_Bootie_Ankleboot_-_Stiefelette_mit_Nieten_40F4BRHE6L_Kalbsleder_schwarz_%282%29_%2816612274402%29.jpg", category: "Clothing" },
  { id: "cloth-18", italian: "la maglietta", english: "T-Shirt", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Leipzig2012.jpg/600px-Leipzig2012.jpg", category: "Clothing" },
  { id: "cloth-19", italian: "il maglione", english: "Sweater", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Selburose-sweater.jpg/600px-Selburose-sweater.jpg", category: "Clothing" },
  { id: "cloth-20", italian: "l'ombrello", english: "Umbrella", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/M0354_000727-005_1.jpg/600px-M0354_000727-005_1.jpg", category: "Clothing" },

  // ===========================
  // BODY (30)
  // ===========================
  { id: "body-1", italian: "la mano", english: "Hand", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Hand%2C_fingers_-_back.jpg/600px-Hand%2C_fingers_-_back.jpg", category: "Body" },
  { id: "body-2", italian: "l'occhio", english: "Eye", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Krilleyekils.jpg/600px-Krilleyekils.jpg", category: "Body" },
  { id: "body-3", italian: "il cuore", english: "Heart", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Heart_anterior_exterior_view.png/600px-Heart_anterior_exterior_view.png", category: "Body" },
  { id: "body-4", italian: "il piede", english: "Foot", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Foot_on_white_background.jpg/600px-Foot_on_white_background.jpg", category: "Body" },
  { id: "body-5", italian: "la bocca", english: "Mouth", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Lion_Showing_off_His_Mouth_%2821454262492%29.jpg/600px-Lion_Showing_off_His_Mouth_%2821454262492%29.jpg", category: "Body" },
  { id: "body-6", italian: "l'orecchio", english: "Ear", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Human_right_ear_%28cropped%29.jpg/600px-Human_right_ear_%28cropped%29.jpg", category: "Body" },
  { id: "body-7", italian: "il dito", english: "Finger", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Human_fingers_both_sides_2.jpg/600px-Human_fingers_both_sides_2.jpg", category: "Body" },
  { id: "body-8", italian: "il braccio", english: "Arm", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Extended_arm.jpg/600px-Extended_arm.jpg", category: "Body" },
  { id: "body-9", italian: "la testa", english: "Head", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Portrait_of_a_Meerkat.jpg/600px-Portrait_of_a_Meerkat.jpg", category: "Body" },
  { id: "body-10", italian: "il naso", english: "Nose", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Canine_Nose_Macro_Photo.png/600px-Canine_Nose_Macro_Photo.png", category: "Body" },
  { id: "body-11", italian: "i capelli", english: "Hair", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Gray945.png/600px-Gray945.png", category: "Body" },
  { id: "body-12", italian: "la gamba", english: "Leg", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/InsectLeg.svg/600px-InsectLeg.svg.png", category: "Body" },
  { id: "body-13", italian: "il ginocchio", english: "Knee", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Human_knees.jpg/600px-Human_knees.jpg", category: "Body" },
  { id: "body-14", italian: "la spalla", english: "Shoulder", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Left_shoulder.jpg/600px-Left_shoulder.jpg", category: "Body" },
  { id: "body-15", italian: "il collo", english: "Neck", image: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Neck.png", category: "Body" },
  { id: "body-16", italian: "la schiena", english: "Back", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Posterior_view_of_human_female_and_male_backs_%28cropped%29.jpg/600px-Posterior_view_of_human_female_and_male_backs_%28cropped%29.jpg", category: "Body" },
  { id: "body-17", italian: "il dente", english: "Tooth", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/06-10-06smile.jpg/600px-06-10-06smile.jpg", category: "Body" },
  { id: "body-18", italian: "la lingua", english: "Tongue", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/%D8%B2%D8%A8%D8%A7%D9%86_tongue.jpg/600px-%D8%B2%D8%A8%D8%A7%D9%86_tongue.jpg", category: "Body" },
  { id: "body-19", italian: "il gomito", english: "Elbow", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Elbow_on_gray_background.jpg/600px-Elbow_on_gray_background.jpg", category: "Body" },
  { id: "body-20", italian: "il pollice", english: "Thumb", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Liam_Thumb.jpg/600px-Liam_Thumb.jpg", category: "Body" },

  // ===========================
  // HOUSEHOLD (40)
  // ===========================
  { id: "house-1", italian: "la sedia", english: "Chair", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Set_of_fourteen_side_chairs_MET_DP110780.jpg/600px-Set_of_fourteen_side_chairs_MET_DP110780.jpg", category: "Household" },
  { id: "house-2", italian: "il tavolo", english: "Table", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Beautiful_Baroque_gilded_table_from_the_Cinquantenaire_Museum_%28Bruxelles%2C_Belgium%29.jpg/600px-Beautiful_Baroque_gilded_table_from_the_Cinquantenaire_Museum_%28Bruxelles%2C_Belgium%29.jpg", category: "Household" },
  { id: "house-3", italian: "la lampada", english: "Lamp", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Light-bulbs.jpg/600px-Light-bulbs.jpg", category: "Household" },
  { id: "house-4", italian: "il letto", english: "Bed", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/2008-04-12_Freilichtmuseum_Detmold_%2811%29.jpg/600px-2008-04-12_Freilichtmuseum_Detmold_%2811%29.jpg", category: "Household" },
  { id: "house-5", italian: "lo specchio", english: "Mirror", image: "https://upload.wikimedia.org/wikipedia/commons/5/52/Mirror.jpg", category: "Household" },
  { id: "house-6", italian: "la chiave", english: "Key", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Solex_99_30_padlock_with_keys_%28DSCF2659%29.jpg/600px-Solex_99_30_padlock_with_keys_%28DSCF2659%29.jpg", category: "Household" },
  { id: "house-7", italian: "il libro", english: "Book", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Gutenberg_Bible%2C_Lenox_Copy%2C_New_York_Public_Library%2C_2009._Pic_01.jpg/600px-Gutenberg_Bible%2C_Lenox_Copy%2C_New_York_Public_Library%2C_2009._Pic_01.jpg", category: "Household" },
  { id: "house-8", italian: "il telefono", english: "Phone", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Telefon_BW_2012-02-18_13-44-32.JPG/600px-Telefon_BW_2012-02-18_13-44-32.JPG", category: "Household" },
  { id: "house-9", italian: "il divano", english: "Sofa", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/2009-05-16_Main_office_lobby_at_Hampton_Forest_Apartments.jpg/600px-2009-05-16_Main_office_lobby_at_Hampton_Forest_Apartments.jpg", category: "Household" },
  { id: "house-10", italian: "il tappeto", english: "Carpet", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Wollteppich_1.jpg/600px-Wollteppich_1.jpg", category: "Household" },
  { id: "house-11", italian: "la porta", english: "Door", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/L-door.png/600px-L-door.png", category: "Household" },
  { id: "house-12", italian: "la finestra", english: "Window", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Atua_Kosua_shrine4.jpg/600px-Atua_Kosua_shrine4.jpg", category: "Household" },
  { id: "house-13", italian: "le scale", english: "Stairs", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Opera_Garnier_Stairway_2008.JPG/600px-Opera_Garnier_Stairway_2008.JPG", category: "Household" },
  { id: "house-14", italian: "il cuscino", english: "Pillow", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Pillows_on_a_hotel_bed.jpg/600px-Pillows_on_a_hotel_bed.jpg", category: "Household" },
  { id: "house-15", italian: "la coperta", english: "Blanket", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Lautrec_in_bed_1893.jpg/600px-Lautrec_in_bed_1893.jpg", category: "Household" },
  { id: "house-16", italian: "l'armadio", english: "Wardrobe", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Old_Jefferson_Louisiana_2016_-_Coolidge_Street_58.jpg/600px-Old_Jefferson_Louisiana_2016_-_Coolidge_Street_58.jpg", category: "Household" },
  { id: "house-17", italian: "la scrivania", english: "Desk", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Bureau_table_MET_DP108643.jpg/600px-Bureau_table_MET_DP108643.jpg", category: "Household" },
  { id: "house-18", italian: "la televisione", english: "Television", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Cptvdisplay.jpg/600px-Cptvdisplay.jpg", category: "Household" },
  { id: "house-19", italian: "l'orologio da parete", english: "Wall Clock", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Pendulum_clock_by_Jacob_Kock%2C_antique_furniture_photography%2C_IMG_0931_edit.jpg/600px-Pendulum_clock_by_Jacob_Kock%2C_antique_furniture_photography%2C_IMG_0931_edit.jpg", category: "Household" },
  { id: "house-20", italian: "il vaso", english: "Vase", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Portland_Vase_V%26A.jpg/600px-Portland_Vase_V%26A.jpg", category: "Household" },
  { id: "house-21", italian: "la candela", english: "Candle", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/LA2_Skultuna_kontorsljusstake.jpg/600px-LA2_Skultuna_kontorsljusstake.jpg", category: "Household" },
  { id: "house-22", italian: "il quadro", english: "Painting", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/600px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg", category: "Household" },
  { id: "house-23", italian: "la mensola", english: "Shelf", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Atifells_de_cuina_andalusins%2C_Museu_Arqueol%C3%B2gic_Municipal_d%27Alcoi.JPG/600px-Atifells_de_cuina_andalusins%2C_Museu_Arqueol%C3%B2gic_Municipal_d%27Alcoi.JPG", category: "Household" },
  { id: "house-24", italian: "il cassetto", english: "Drawer", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Drawer.agr.jpg/600px-Drawer.agr.jpg", category: "Household" },
  { id: "house-25", italian: "la cornice", english: "Picture Frame", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Carved_frame_01_%2827133614537%29.jpg/600px-Carved_frame_01_%2827133614537%29.jpg", category: "Household" },

  // ===========================
  // KITCHEN (20)
  // ===========================
  { id: "kit-1", italian: "la tazza", english: "Cup", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Cup_and_Saucer_LACMA_47.35.6a-b_%281_of_3%29.jpg/600px-Cup_and_Saucer_LACMA_47.35.6a-b_%281_of_3%29.jpg", category: "Kitchen" },
  { id: "kit-2", italian: "il piatto", english: "Plate", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Botanical_plate_with_spray_of_fruiting_Indian_Bean_Tree_MET_DP-1687-038_%28cropped%29.jpg/600px-Botanical_plate_with_spray_of_fruiting_Indian_Bean_Tree_MET_DP-1687-038_%28cropped%29.jpg", category: "Kitchen" },
  { id: "kit-3", italian: "il bicchiere", english: "Glass", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Fassade_Wilhelmstrasse_65%2C_Berlin-Mitte%2C_160417%2C_ako.jpg/600px-Fassade_Wilhelmstrasse_65%2C_Berlin-Mitte%2C_160417%2C_ako.jpg", category: "Kitchen" },
  { id: "kit-4", italian: "la forchetta", english: "Fork", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Assorted_forks.jpg/600px-Assorted_forks.jpg", category: "Kitchen" },
  { id: "kit-5", italian: "il coltello", english: "Knife", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Damascus_Bowie.jpg/600px-Damascus_Bowie.jpg", category: "Kitchen" },
  { id: "kit-6", italian: "il cucchiaio", english: "Spoon", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Soup_Spoon.jpg/600px-Soup_Spoon.jpg", category: "Kitchen" },
  { id: "kit-7", italian: "la pentola", english: "Pot", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Pans_%28113563802%29.jpg/600px-Pans_%28113563802%29.jpg", category: "Kitchen" },
  { id: "kit-8", italian: "la padella", english: "Frying Pan", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Pfanne_%28Edelstahl%29.jpg/600px-Pfanne_%28Edelstahl%29.jpg", category: "Kitchen" },
  { id: "kit-9", italian: "il frigorifero", english: "Refrigerator", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Open_refrigerator_with_food_at_night.jpg/600px-Open_refrigerator_with_food_at_night.jpg", category: "Kitchen" },
  { id: "kit-10", italian: "il forno", english: "Oven", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Four_%C3%A0_c%C3%A9ramique_-_Japan_Aur%C3%A9a_-_2011-0403-_P1070446.JPG/600px-Four_%C3%A0_c%C3%A9ramique_-_Japan_Aur%C3%A9a_-_2011-0403-_P1070446.JPG", category: "Kitchen" },
  { id: "kit-11", italian: "la bottiglia", english: "Bottle", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Bouteille.jpg/600px-Bouteille.jpg", category: "Kitchen" },
  { id: "kit-12", italian: "il tagliere", english: "Cutting Board", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Chopping_Board.jpg/600px-Chopping_Board.jpg", category: "Kitchen" },
  { id: "kit-13", italian: "la ciotola", english: "Bowl", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/China%2C_Jiangxi_province%2C_Jingdezhen%2C_Ming_dynasty_%281368-1644%29%2C_Xuande_mark_-_Bowl_with_Decoration_of_the_%22Three_Friends%22_-_1953.631_-_Cleveland_Museum_of_Art.tif/lossy-page1-330px-thumbnail.tif.jpg", category: "Kitchen" },
  { id: "kit-14", italian: "il tovagliolo", english: "Napkin", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Napkin_ring.jpg/600px-Napkin_ring.jpg", category: "Kitchen" },
  { id: "kit-15", italian: "il cavatappi", english: "Corkscrew", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Corkscrews_December_2014-1.jpg/600px-Corkscrews_December_2014-1.jpg", category: "Kitchen" },
  { id: "kit-16", italian: "il microonde", english: "Microwave", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Frazier_Peak%2C_tower_and_Honda_Element.jpg/600px-Frazier_Peak%2C_tower_and_Honda_Element.jpg", category: "Kitchen" },
  { id: "kit-17", italian: "il tostapane", english: "Toaster", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Consumer_Reports_-_Hamilton_Beach_Digital_toaster.tiff/lossless-page1-330px-Consumer_Reports_-_Hamilton_Beach_Digital_toaster.tiff.png", category: "Kitchen" },
  { id: "kit-18", italian: "la lavastoviglie", english: "Dishwasher", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Dishwasher_with_dishes.JPG/600px-Dishwasher_with_dishes.JPG", category: "Kitchen" },
  { id: "kit-19", italian: "il grembiule", english: "Apron", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Preparing_the_Cake_%285285262061%29.jpg/600px-Preparing_the_Cake_%285285262061%29.jpg", category: "Kitchen" },
  { id: "kit-20", italian: "il vassoio", english: "Tray", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Brass_tray_inlaid_with_silver%2C_Egypt_or_Syria%2C_19th_century%2C_HAA_I.JPG/600px-Brass_tray_inlaid_with_silver%2C_Egypt_or_Syria%2C_19th_century%2C_HAA_I.JPG", category: "Kitchen" },

  // ===========================
  // BATHROOM (15)
  // ===========================
  { id: "bath-1", italian: "lo spazzolino", english: "Toothbrush", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Toothbrush_20050716_004.jpg/600px-Toothbrush_20050716_004.jpg", category: "Bathroom" },
  { id: "bath-2", italian: "il dentifricio", english: "Toothpaste", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Toothpasteonbrush.jpg/600px-Toothpasteonbrush.jpg", category: "Bathroom" },
  { id: "bath-3", italian: "il sapone", english: "Soap", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Handmade_soap_cropped_and_simplified.jpg/600px-Handmade_soap_cropped_and_simplified.jpg", category: "Bathroom" },
  { id: "bath-4", italian: "l'asciugamano", english: "Towel", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Zusammengelegte_Handt%C3%BCcher.jpg/600px-Zusammengelegte_Handt%C3%BCcher.jpg", category: "Bathroom" },
  { id: "bath-5", italian: "la doccia", english: "Shower", image: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Dusche-cut-w025-h025.jpg", category: "Bathroom" },
  { id: "bath-6", italian: "la vasca da bagno", english: "Bathtub", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Clawfoot_bathtub.jpg/600px-Clawfoot_bathtub.jpg", category: "Bathroom" },
  { id: "bath-7", italian: "lo shampoo", english: "Shampoo", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Hair_wash_with_shampoo.jpg/600px-Hair_wash_with_shampoo.jpg", category: "Bathroom" },
  { id: "bath-8", italian: "il pettine", english: "Comb", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Plastic_comb%2C_2015-06-07.jpg/600px-Plastic_comb%2C_2015-06-07.jpg", category: "Bathroom" },
  { id: "bath-9", italian: "lo specchio", english: "Mirror", image: "https://upload.wikimedia.org/wikipedia/commons/5/52/Mirror.jpg", category: "Bathroom" },
  { id: "bath-10", italian: "il rasoio", english: "Razor", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Quattro_Titanium_Energy.jpg/600px-Quattro_Titanium_Energy.jpg", category: "Bathroom" },
  { id: "bath-11", italian: "l'asciugacapelli", english: "Hair Dryer", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Braun_hair_dryer.jpg/600px-Braun_hair_dryer.jpg", category: "Bathroom" },
  { id: "bath-12", italian: "la crema", english: "Cream", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/01_Mmm..._Apple_Crisp_with_Whipped_Cream.jpg/600px-01_Mmm..._Apple_Crisp_with_Whipped_Cream.jpg", category: "Bathroom" },
  { id: "bath-13", italian: "il profumo", english: "Perfume", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Bottles_of_Eau_de_Toilette.jpg/600px-Bottles_of_Eau_de_Toilette.jpg", category: "Bathroom" },
  { id: "bath-14", italian: "la bilancia", english: "Scale", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Balance_%C3%A0_tabac_1850.JPG/600px-Balance_%C3%A0_tabac_1850.JPG", category: "Bathroom" },
  { id: "bath-15", italian: "la spazzola", english: "Brush", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/BurglaryIsrael2.jpg/600px-BurglaryIsrael2.jpg", category: "Bathroom" },

  // ===========================
  // TRANSPORT (25)
  // ===========================
  { id: "trans-1", italian: "l'automobile", english: "Car", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/1925_Ford_Model_T_touring.jpg/600px-1925_Ford_Model_T_touring.jpg", category: "Transport" },
  { id: "trans-2", italian: "la bicicletta", english: "Bicycle", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Left_side_of_Flying_Pigeon.jpg/600px-Left_side_of_Flying_Pigeon.jpg", category: "Transport" },
  { id: "trans-3", italian: "il treno", english: "Train", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/%D0%9F%D0%BE%D0%B5%D0%B7%D0%B4_%D0%BD%D0%B0_%D1%84%D0%BE%D0%BD%D0%B5_%D0%B3%D0%BE%D1%80%D1%8B_%D0%A8%D0%B0%D1%82%D1%80%D0%B8%D1%89%D0%B5._%D0%92%D0%BE%D1%80%D0%BE%D0%BD%D0%B5%D0%B6%D1%81%D0%BA%D0%B0%D1%8F_%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C.jpg/600px-%D0%9F%D0%BE%D0%B5%D0%B7%D0%B4_%D0%BD%D0%B0_%D1%84%D0%BE%D0%BD%D0%B5_%D0%B3%D0%BE%D1%80%D1%8B_%D0%A8%D0%B0%D1%82%D1%80%D0%B8%D1%89%D0%B5._%D0%92%D0%BE%D1%80%D0%BE%D0%BD%D0%B5%D0%B6%D1%81%D0%BA%D0%B0%D1%8F_%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C.jpg", category: "Transport" },
  { id: "trans-4", italian: "l'aereo", english: "Airplane", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/United_Airlines_Boeing_777-200_Meulemans.jpg/600px-United_Airlines_Boeing_777-200_Meulemans.jpg", category: "Transport" },
  { id: "trans-5", italian: "la barca", english: "Boat", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Motorboat_at_Kankaria_lake.JPG/600px-Motorboat_at_Kankaria_lake.JPG", category: "Transport" },
  { id: "trans-6", italian: "l'autobus", english: "Bus", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/LTZ1328-19-20241030-160332.jpg/600px-LTZ1328-19-20241030-160332.jpg", category: "Transport" },
  { id: "trans-7", italian: "la moto", english: "Motorcycle", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Kawasaki_Ninja_400_KRT_Edition_%28facelift_model%29_right_side.jpg/600px-Kawasaki_Ninja_400_KRT_Edition_%28facelift_model%29_right_side.jpg", category: "Transport" },
  { id: "trans-8", italian: "il camion", english: "Truck", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Freightliner_M2_106_6x4_2014_%2814240376744%29.jpg/600px-Freightliner_M2_106_6x4_2014_%2814240376744%29.jpg", category: "Transport" },
  { id: "trans-9", italian: "il taxi", english: "Taxi", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Cabs.jpg/600px-Cabs.jpg", category: "Transport" },
  { id: "trans-10", italian: "l'elicottero", english: "Helicopter", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/LAPD_Bell_206_Jetranger.jpg/600px-LAPD_Bell_206_Jetranger.jpg", category: "Transport" },
  { id: "trans-11", italian: "la metropolitana", english: "Subway", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/R211_A_train_approaching_80th_Street_August_2025.jpg/600px-R211_A_train_approaching_80th_Street_August_2025.jpg", category: "Transport" },
  { id: "trans-12", italian: "il tram", english: "Tram", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Muzeum_MHD%2C_tramvaje_T3_8084_a_6149%2C_zep%C5%99edu.jpg/600px-Muzeum_MHD%2C_tramvaje_T3_8084_a_6149%2C_zep%C5%99edu.jpg", category: "Transport" },
  { id: "trans-13", italian: "la nave", english: "Ship", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Containerterminal_Altenwerder_%28Hamburg-Altenwerder%29.Iris_Bolten.4.phb.ajb.jpg/600px-Containerterminal_Altenwerder_%28Hamburg-Altenwerder%29.Iris_Bolten.4.phb.ajb.jpg", category: "Transport" },
  { id: "trans-14", italian: "il monopattino", english: "Scooter", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Kickboards_Jahrhunderthalle_Probe_Zauberfl%C3%B6te_04-09-03.JPG/600px-Kickboards_Jahrhunderthalle_Probe_Zauberfl%C3%B6te_04-09-03.JPG", category: "Transport" },
  { id: "trans-15", italian: "il semaforo", english: "Traffic Light", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Modern_British_LED_Traffic_Light.jpg/600px-Modern_British_LED_Traffic_Light.jpg", category: "Transport" },

  // ===========================
  // NATURE (30)
  // ===========================
  { id: "nat-1", italian: "il sole", english: "Sun", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/The_Sun_in_white_light.jpg/600px-The_Sun_in_white_light.jpg", category: "Nature" },
  { id: "nat-2", italian: "la luna", english: "Moon", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/600px-FullMoon2010.jpg", category: "Nature" },
  { id: "nat-3", italian: "il fiore", english: "Flower", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Magnolia_grandiflora_-_flower_1.jpg/600px-Magnolia_grandiflora_-_flower_1.jpg", category: "Nature" },
  { id: "nat-4", italian: "l'albero", english: "Tree", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Usamljeni_jasen_-_panoramio_%28cropped%29.jpg/600px-Usamljeni_jasen_-_panoramio_%28cropped%29.jpg", category: "Nature" },
  { id: "nat-5", italian: "la montagna", english: "Mountain", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg/600px-Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg", category: "Nature" },
  { id: "nat-6", italian: "il mare", english: "Sea", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Mediterranean_Sea_16.61811E_38.99124N.jpg/600px-Mediterranean_Sea_16.61811E_38.99124N.jpg", category: "Nature" },
  { id: "nat-7", italian: "la pioggia", english: "Rain", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Hard_rain_on_a_roof.jpg/600px-Hard_rain_on_a_roof.jpg", category: "Nature" },
  { id: "nat-8", italian: "la neve", english: "Snow", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/CargoNet_Di_12_Euro_4000_L%C3%B8nsdal_-_Bolna.jpg/600px-CargoNet_Di_12_Euro_4000_L%C3%B8nsdal_-_Bolna.jpg", category: "Nature" },
  { id: "nat-9", italian: "la stella", english: "Star", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/The_Sun_in_white_light.jpg/600px-The_Sun_in_white_light.jpg", category: "Nature" },
  { id: "nat-10", italian: "la nuvola", english: "Cloud", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/ISS-40_Thunderheads_near_Borneo.jpg/600px-ISS-40_Thunderheads_near_Borneo.jpg", category: "Nature" },
  { id: "nat-11", italian: "il lago", english: "Lake", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Lake_Idro_Italy_2005-08-16.jpg/600px-Lake_Idro_Italy_2005-08-16.jpg", category: "Nature" },
  { id: "nat-12", italian: "il fiume", english: "River", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Pirogue_running_on_the_Mekong_at_golden_hour_between_Don_Det_and_Don_Khon_Laos.jpg/600px-Pirogue_running_on_the_Mekong_at_golden_hour_between_Don_Det_and_Don_Khon_Laos.jpg", category: "Nature" },
  { id: "nat-13", italian: "la cascata", english: "Waterfall", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Cascada_Dynjandi%2C_Vestfir%C3%B0ir%2C_Islandia%2C_2014-08-14%2C_DD_136-138_HDR.JPG/600px-Cascada_Dynjandi%2C_Vestfir%C3%B0ir%2C_Islandia%2C_2014-08-14%2C_DD_136-138_HDR.JPG", category: "Nature" },
  { id: "nat-14", italian: "la foresta", english: "Forest", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Aerial_view_of_the_Amazon_Rainforest.jpg/600px-Aerial_view_of_the_Amazon_Rainforest.jpg", category: "Nature" },
  { id: "nat-15", italian: "il deserto", english: "Desert", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Rub_al_Khali_002.JPG/600px-Rub_al_Khali_002.JPG", category: "Nature" },
  { id: "nat-16", italian: "la spiaggia", english: "Beach", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Beach_at_Fort_Lauderdale.jpg/600px-Beach_at_Fort_Lauderdale.jpg", category: "Nature" },
  { id: "nat-17", italian: "l'arcobaleno", english: "Rainbow", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Double-alaskan-rainbow.jpg/600px-Double-alaskan-rainbow.jpg", category: "Nature" },
  { id: "nat-18", italian: "il fulmine", english: "Lightning", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Port_and_lighthouse_overnight_storm_with_lightning_in_Port-la-Nouvelle.jpg/600px-Port_and_lighthouse_overnight_storm_with_lightning_in_Port-la-Nouvelle.jpg", category: "Nature" },
  { id: "nat-19", italian: "il vulcano", english: "Volcano", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Augustine_volcano_Jan_24_2006_-_Cyrus_Read.jpg/600px-Augustine_volcano_Jan_24_2006_-_Cyrus_Read.jpg", category: "Nature" },
  { id: "nat-20", italian: "l'isola", english: "Island", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Hawaje-NoRedLine.jpg/600px-Hawaje-NoRedLine.jpg", category: "Nature" },

  // ===========================
  // OFFICE (18)
  // ===========================
  { id: "off-1", italian: "la penna", english: "Pen", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Carandache_Ecridor.jpg/600px-Carandache_Ecridor.jpg", category: "Office" },
  { id: "off-2", italian: "la matita", english: "Pencil", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Pencils_hb.jpg/600px-Pencils_hb.jpg", category: "Office" },
  { id: "off-3", italian: "il quaderno", english: "Notebook", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Notebooks.jpg/600px-Notebooks.jpg", category: "Office" },
  { id: "off-4", italian: "il computer", english: "Computer", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/ENIAC-changing_a_tube_%28cropped%29.jpg/600px-ENIAC-changing_a_tube_%28cropped%29.jpg", category: "Office" },
  { id: "off-5", italian: "la tastiera", english: "Keyboard", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Typing_example.ogv/600px--Typing_example.ogv.jpg", category: "Office" },
  { id: "off-6", italian: "il mouse", english: "Mouse", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/%D0%9C%D1%8B%D1%88%D1%8C_2.jpg/600px-%D0%9C%D1%8B%D1%88%D1%8C_2.jpg", category: "Office" },
  { id: "off-7", italian: "lo schermo", english: "Screen", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/MonitorLCDlcd.svg/600px-MonitorLCDlcd.svg.png", category: "Office" },
  { id: "off-8", italian: "la stampante", english: "Printer", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/HP_Laserjet_5_DN_1.jpg/600px-HP_Laserjet_5_DN_1.jpg", category: "Office" },
  { id: "off-9", italian: "le forbici", english: "Scissors", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Standard_household_scissors.jpg/600px-Standard_household_scissors.jpg", category: "Office" },
  { id: "off-10", italian: "la gomma", english: "Eraser", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Office-pink-erasers.jpg/600px-Office-pink-erasers.jpg", category: "Office" },
  { id: "off-11", italian: "il righello", english: "Ruler", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Diverse%C2%B7Ma%C3%9Fst%C3%A4be%2C15.365.jpg/600px-Diverse%C2%B7Ma%C3%9Fst%C3%A4be%2C15.365.jpg", category: "Office" },
  { id: "off-12", italian: "la calcolatrice", english: "Calculator", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Casio_calculator_JS-20WK_in_201901_002.jpg/600px-Casio_calculator_JS-20WK_in_201901_002.jpg", category: "Office" },
  { id: "off-13", italian: "la cartella", english: "Folder", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Yellow_folder.JPG/600px-Yellow_folder.JPG", category: "Office" },
  { id: "off-14", italian: "la graffetta", english: "Paper Clip", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Wanzijia.jpg/600px-Wanzijia.jpg", category: "Office" },
  { id: "off-15", italian: "la busta", english: "Envelope", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Envelope_-_Boonville_Address-000.jpg/600px-Envelope_-_Boonville_Address-000.jpg", category: "Office" },
  { id: "off-16", italian: "il francobollo", english: "Stamp", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Nicaragua1_1913.jpg/600px-Nicaragua1_1913.jpg", category: "Office" },
  { id: "off-17", italian: "la lavagna", english: "Whiteboard", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/NCTR_Intern_Claire_Boyle_%2815558843862%29.jpg/600px-NCTR_Intern_Claire_Boyle_%2815558843862%29.jpg", category: "Office" },
  { id: "off-18", italian: "lo zaino", english: "Backpack", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Rucksack1.jpg/600px-Rucksack1.jpg", category: "Office" },

  // ===========================
  // SPORTS (24)
  // ===========================
  { id: "sport-1", italian: "il pallone", english: "Ball", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Many_balls.jpg/600px-Many_balls.jpg", category: "Sports" },
  { id: "sport-2", italian: "la chitarra", english: "Guitar", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/GuitareClassique5.png/600px-GuitareClassique5.png", category: "Sports" },
  { id: "sport-3", italian: "il pianoforte", english: "Piano", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Steinway_Vienna_002.JPG/600px-Steinway_Vienna_002.JPG", category: "Sports" },
  { id: "sport-4", italian: "la macchina fotografica", english: "Camera", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/LEI0440_Leica_IIIf_chrom_-_Sn._580566_1951-52-M39_Blitzsynchron_front_view-6531_hf-.jpg/600px-LEI0440_Leica_IIIf_chrom_-_Sn._580566_1951-52-M39_Blitzsynchron_front_view-6531_hf-.jpg", category: "Sports" },
  { id: "sport-5", italian: "la piscina", english: "Swimming Pool", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Backyardpool.jpg/600px-Backyardpool.jpg", category: "Sports" },
  { id: "sport-6", italian: "gli sci", english: "Skis", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Ski_Famille_-_Family_Ski_Holidays.jpg/600px-Ski_Famille_-_Family_Ski_Holidays.jpg", category: "Sports" },
  { id: "sport-7", italian: "la racchetta", english: "Racket", image: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Squash-racquet-and-ball.jpg", category: "Sports" },
  { id: "sport-8", italian: "il pallone da calcio", english: "Football", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Olga_Mat%C4%ABsa_LVA.jpg/600px-Olga_Mat%C4%ABsa_LVA.jpg", category: "Sports" },
  { id: "sport-9", italian: "il canestro", english: "Basketball Hoop", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Steph_Curry_%2851915116957%29.jpg/600px-Steph_Curry_%2851915116957%29.jpg", category: "Sports" },
  { id: "sport-10", italian: "la barca a vela", english: "Sailboat", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Sloop_Example.svg/600px-Sloop_Example.svg.png", category: "Sports" },
  { id: "sport-11", italian: "il casco", english: "Helmet", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/A_Wide_Variety_Of_Helmets.png/600px-A_Wide_Variety_Of_Helmets.png", category: "Sports" },
  { id: "sport-12", italian: "il violino", english: "Violin", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Violin_VL100.png/600px-Violin_VL100.png", category: "Sports" },
  { id: "sport-14", italian: "la canna da pesca", english: "Fishing Rod", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Fishing_Rods.jpg/600px-Fishing_Rods.jpg", category: "Sports" },
  { id: "sport-15", italian: "la bici da corsa", english: "Racing Bike", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Look_795_30th_Anniversary_Dura-Ace_9100-Mavic_Custom_Build_%2830636542393%29.jpg/600px-Look_795_30th_Anniversary_Dura-Ace_9100-Mavic_Custom_Build_%2830636542393%29.jpg", category: "Sports" },

  // ===========================
  // PLACES (20)
  // ===========================
  { id: "place-1", italian: "la casa", english: "House", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Katsura_Imperial_Villa_in_Spring.jpg/600px-Katsura_Imperial_Villa_in_Spring.jpg", category: "Places" },
  { id: "place-2", italian: "la chiesa", english: "Church", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Basilica_cattedrale_di_San_Giusto_Martire_%28IV%29_%2839452708702%29.jpg/600px-Basilica_cattedrale_di_San_Giusto_Martire_%28IV%29_%2839452708702%29.jpg", category: "Places" },
  { id: "place-3", italian: "il ristorante", english: "Restaurant", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Barbieri_-_ViaSophia25668.jpg/600px-Barbieri_-_ViaSophia25668.jpg", category: "Places" },
  { id: "place-4", italian: "l'ospedale", english: "Hospital", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Hospital-de-Bellvitge.jpg/600px-Hospital-de-Bellvitge.jpg", category: "Places" },
  { id: "place-5", italian: "la scuola", english: "School", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/First_primary_school_building_in_Nigeria_in_Badagry%2C_Nigeria.jpg/600px-First_primary_school_building_in_Nigeria_in_Badagry%2C_Nigeria.jpg", category: "Places" },
  { id: "place-6", italian: "il supermercato", english: "Supermarket", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Stop%26Shop.jpg/600px-Stop%26Shop.jpg", category: "Places" },
  { id: "place-7", italian: "la farmacia", english: "Pharmacy", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/PharmacistsMortar.svg/600px-PharmacistsMortar.svg.png", category: "Places" },
  { id: "place-8", italian: "la stazione", english: "Station", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Milan_CentralStation_016_4294.jpg/600px-Milan_CentralStation_016_4294.jpg", category: "Places" },
  { id: "place-9", italian: "l'aeroporto", english: "Airport", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Airport_infrastructure.png/600px-Airport_infrastructure.png", category: "Places" },
  { id: "place-10", italian: "il parco", english: "Park", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Halleyparknovember_b_%28cropped%29.jpg/600px-Halleyparknovember_b_%28cropped%29.jpg", category: "Places" },
  { id: "place-11", italian: "la biblioteca", english: "Library", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/SanDiegoCityCollegeLearningResource_-_bookshelf.jpg/600px-SanDiegoCityCollegeLearningResource_-_bookshelf.jpg", category: "Places" },
  { id: "place-12", italian: "il museo", english: "Museum", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Museo_Chileno_de_Arte_Precolombino_-_2020_-_10.jpg/600px-Museo_Chileno_de_Arte_Precolombino_-_2020_-_10.jpg", category: "Places" },
  { id: "place-13", italian: "il ponte", english: "Bridge", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Bridge_Alcantara.JPG/600px-Bridge_Alcantara.JPG", category: "Places" },
  { id: "place-14", italian: "il castello", english: "Castle", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Panor%C3%A1mica_Oto%C3%B1o_Alc%C3%A1zar_de_Segovia.jpg/600px-Panor%C3%A1mica_Oto%C3%B1o_Alc%C3%A1zar_de_Segovia.jpg", category: "Places" },
  { id: "place-15", italian: "la fontana", english: "Fountain", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Fountains_Collage.jpg/600px-Fountains_Collage.jpg", category: "Places" },
  { id: "place-16", italian: "il cinema", english: "Cinema", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Ptuj%2C_city_cinema.jpg/600px-Ptuj%2C_city_cinema.jpg", category: "Places" },
  { id: "place-17", italian: "la palestra", english: "Gym", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Amsterdam_-_Gymnasium_-_0591.jpg/600px-Amsterdam_-_Gymnasium_-_0591.jpg", category: "Places" },
  { id: "place-18", italian: "la panetteria", english: "Bakery", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Belgium_2013_%2811620905224%29.jpg/600px-Belgium_2013_%2811620905224%29.jpg", category: "Places" },
  { id: "place-19", italian: "il mercato", english: "Market", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/The_Moorish_Bazaar.jpg/600px-The_Moorish_Bazaar.jpg", category: "Places" },
  { id: "place-20", italian: "la piazza", english: "Square", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Square_with_offset_tick_marks.svg/600px-Square_with_offset_tick_marks.svg.png", category: "Places" },

  // ===========================
  // WEATHER (15)
  // ===========================
  { id: "weather-1", italian: "il temporale", english: "Storm", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Cloud_cumulonimbus_at_baltic_sea%281%29.jpg/600px-Cloud_cumulonimbus_at_baltic_sea%281%29.jpg", category: "Weather" },
  { id: "weather-2", italian: "il vento", english: "Wind", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Cherry_tree_moving_in_the_wind_1.gif/600px-Cherry_tree_moving_in_the_wind_1.gif", category: "Weather" },
  { id: "weather-3", italian: "la nebbia", english: "Fog", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/A_foggy_winter_morning.jpg/600px-A_foggy_winter_morning.jpg", category: "Weather" },
  { id: "weather-4", italian: "il ghiaccio", english: "Ice", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Ice_Block%2C_Canal_Park%2C_Duluth_%2832752478892%29.jpg/600px-Ice_Block%2C_Canal_Park%2C_Duluth_%2832752478892%29.jpg", category: "Weather" },
  { id: "weather-5", italian: "la grandine", english: "Hail", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Granizo.jpg/600px-Granizo.jpg", category: "Weather" },
  { id: "weather-6", italian: "il tuono", english: "Thunder", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Lightning_Pritzerbe_01_%28MK%29.jpg/600px-Lightning_Pritzerbe_01_%28MK%29.jpg", category: "Weather" },
  { id: "weather-7", italian: "la temperatura", english: "Temperature", image: "https://upload.wikimedia.org/wikipedia/commons/2/23/Thermally_Agitated_Molecule.gif", category: "Weather" },
  { id: "weather-8", italian: "il tramonto", english: "Sunset", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Full_cycle_of_a_Sunset_on_the_high_plains_of_the_Mojave_Desert.jpg/600px-Full_cycle_of_a_Sunset_on_the_high_plains_of_the_Mojave_Desert.jpg", category: "Weather" },
  { id: "weather-9", italian: "l'alba", english: "Sunrise", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Spring_Lake%2C_New_Jersey_Beach_at_Sunrise.jpg/600px-Spring_Lake%2C_New_Jersey_Beach_at_Sunrise.jpg", category: "Weather" },
  { id: "weather-10", italian: "il cielo", english: "Sky", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/July_night_sky_%2835972569256%29.jpg/600px-July_night_sky_%2835972569256%29.jpg", category: "Weather" },
  { id: "weather-11", italian: "la brezza", english: "Breeze", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Cherry_tree_moving_in_the_wind_1.gif/600px-Cherry_tree_moving_in_the_wind_1.gif", category: "Weather" },
  { id: "weather-12", italian: "la rugiada", english: "Dew", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/A_drop_of_dew_on_a_clover.jpg/600px-A_drop_of_dew_on_a_clover.jpg", category: "Weather" },
  { id: "weather-13", italian: "l'ombra", english: "Shadow", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/The_shadow_of_a_musician_playing_transverse_flute.jpg/600px-The_shadow_of_a_musician_playing_transverse_flute.jpg", category: "Weather" },
  { id: "weather-14", italian: "la siccità", english: "Drought", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Lac_de_l%27Entonnoir_-_img_49473.jpg/600px-Lac_de_l%27Entonnoir_-_img_49473.jpg", category: "Weather" },
  { id: "weather-15", italian: "l'inondazione", english: "Flood", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Urban_flood_cropped.jpg/600px-Urban_flood_cropped.jpg", category: "Weather" },

  // ===========================
  // TOOLS (15)
  // ===========================
  { id: "tool-1", italian: "il martello", english: "Hammer", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/OHM_-_Streithammer.jpg/600px-OHM_-_Streithammer.jpg", category: "Tools" },
  { id: "tool-2", italian: "il cacciavite", english: "Screwdriver", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Screw_Driver_display.jpg/600px-Screw_Driver_display.jpg", category: "Tools" },
  { id: "tool-3", italian: "la sega", english: "Saw", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Pily_rozplatnice.jpg/600px-Pily_rozplatnice.jpg", category: "Tools" },
  { id: "tool-4", italian: "il chiodo", english: "Nail", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Clou_127.jpg/600px-Clou_127.jpg", category: "Tools" },
  { id: "tool-5", italian: "la vite", english: "Screw", image: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Screws.jpg", category: "Tools" },
  { id: "tool-6", italian: "la scala", english: "Ladder", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Ladder.webp/600px-Ladder.webp.png", category: "Tools" },
  { id: "tool-7", italian: "la corda", english: "Rope", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Cordage_en_chanvre.jpg/600px-Cordage_en_chanvre.jpg", category: "Tools" },
  { id: "tool-8", italian: "il secchio", english: "Bucket", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Gotland-Bottarve_Museumshof_07.jpg/600px-Gotland-Bottarve_Museumshof_07.jpg", category: "Tools" },
  { id: "tool-9", italian: "la pala", english: "Shovel", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Skovl.jpg/600px-Skovl.jpg", category: "Tools" },
  { id: "tool-10", italian: "il pennello", english: "Paint Brush", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Paintbrushes.jpg/600px-Paintbrushes.jpg", category: "Tools" },
  { id: "tool-11", italian: "il nastro adesivo", english: "Tape", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Adhesive_tapes_clear.JPG/600px-Adhesive_tapes_clear.JPG", category: "Tools" },
  { id: "tool-12", italian: "la pinza", english: "Pliers", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Ferreiro_ou_metal%C3%BArgico_tradicional.jpg/600px-Ferreiro_ou_metal%C3%BArgico_tradicional.jpg", category: "Tools" },
  { id: "tool-13", italian: "la chiave inglese", english: "Wrench", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Gedore_No._7_combination_wrenches_6%E2%80%9319_mm.jpg/600px-Gedore_No._7_combination_wrenches_6%E2%80%9319_mm.jpg", category: "Tools" },
  { id: "tool-14", italian: "il trapano", english: "Drill", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Drill_scheme.svg/600px-Drill_scheme.svg.png", category: "Tools" },
  { id: "tool-15", italian: "il metro", english: "Tape Measure", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Tape_Measure_25%27_Klein_Tools.jpg/600px-Tape_Measure_25%27_Klein_Tools.jpg", category: "Tools" },

  // ===========================
  // COLOURS (12)
  // ===========================
  { id: "colour-1", italian: "rosso", english: "Red", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Strawberries.jpg/600px-Strawberries.jpg", category: "Colours" },
  { id: "colour-2", italian: "blu", english: "Blue", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Ocean_world_Earth.jpg/600px-Ocean_world_Earth.jpg", category: "Colours" },
  { id: "colour-3", italian: "verde", english: "Green", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Champ_de_bl%C3%A9_C%C3%B4te-d%27Or_Bourgogne_avril_2014.jpg/600px-Champ_de_bl%C3%A9_C%C3%B4te-d%27Or_Bourgogne_avril_2014.jpg", category: "Colours" },
  { id: "colour-4", italian: "giallo", english: "Yellow", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Cornwall_Daffodils.jpg/600px-Cornwall_Daffodils.jpg", category: "Colours" },
  { id: "colour-5", italian: "arancione", english: "Orange", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Oranges_-_whole-halved-segment.jpg/600px-Oranges_-_whole-halved-segment.jpg", category: "Colours" },
  { id: "colour-6", italian: "viola", english: "Purple", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Iris_sanguinea_cultivar%2C_Wakehurst_Place%2C_UK_-_Diliff.jpg/600px-Iris_sanguinea_cultivar%2C_Wakehurst_Place%2C_UK_-_Diliff.jpg", category: "Colours" },
  { id: "colour-7", italian: "rosa", english: "Pink", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Pink_sapphire_ring.jpg/600px-Pink_sapphire_ring.jpg", category: "Colours" },
  { id: "colour-8", italian: "nero", english: "Black", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Tutankhamun_jackal_%28blacked%29.png/600px-Tutankhamun_jackal_%28blacked%29.png", category: "Colours" },
  { id: "colour-9", italian: "bianco", english: "White", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Delphinapterus_leucas_2.jpg/600px-Delphinapterus_leucas_2.jpg", category: "Colours" },
  { id: "colour-10", italian: "grigio", english: "Grey", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Eruption_column_from_Crater_Peak_vent.jpg/600px-Eruption_column_from_Crater_Peak_vent.jpg", category: "Colours" },
  { id: "colour-11", italian: "marrone", english: "Brown", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Espresso-roasted_coffee_beans.jpg/600px-Espresso-roasted_coffee_beans.jpg", category: "Colours" },
  { id: "colour-12", italian: "dorato", english: "Gold", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Gold-crystals.jpg/600px-Gold-crystals.jpg", category: "Colours" },

  // ===========================
  // EVERYDAY (30)
  // ===========================
  { id: "every-1", italian: "il portafoglio", english: "Wallet", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/WalletMpegMan.jpg/600px-WalletMpegMan.jpg", category: "Everyday" },
  { id: "every-2", italian: "le chiavi", english: "Keys", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Solex_99_30_padlock_with_keys_%28DSCF2659%29.jpg/600px-Solex_99_30_padlock_with_keys_%28DSCF2659%29.jpg", category: "Everyday" },
  { id: "every-3", italian: "il cellulare", english: "Mobile Phone", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Mobile_Phone_Evolution_1992_-_2014.jpg/600px-Mobile_Phone_Evolution_1992_-_2014.jpg", category: "Everyday" },
  { id: "every-4", italian: "gli auricolari", english: "Earphones", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/S%C5%82uchawki_referencyjne_K-701_firmy_AKG.jpg/600px-S%C5%82uchawki_referencyjne_K-701_firmy_AKG.jpg", category: "Everyday" },
  { id: "every-5", italian: "la carta di credito", english: "Credit Card", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Credit-cards.jpg/600px-Credit-cards.jpg", category: "Everyday" },
  { id: "every-6", italian: "il giornale", english: "Newspaper", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/NYTimes-Page1-11-11-1918.jpg/600px-NYTimes-Page1-11-11-1918.jpg", category: "Everyday" },
  { id: "every-7", italian: "la rivista", english: "Magazine", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Harper%27s_January.png/600px-Harper%27s_January.png", category: "Everyday" },
  { id: "every-8", italian: "la moneta", english: "Coin", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Kiloware.JPG/600px-Kiloware.JPG", category: "Everyday" },
  { id: "every-9", italian: "la banconota", english: "Banknote", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Vereinigte_Ostindische_Compagnie_bond_-_Middelburg_-_Amsterdam_-_1622.jpg/600px-Vereinigte_Ostindische_Compagnie_bond_-_Middelburg_-_Amsterdam_-_1622.jpg", category: "Everyday" },
  { id: "every-10", italian: "il passaporto", english: "Passport", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Passports-assorted.jpg/600px-Passports-assorted.jpg", category: "Everyday" },
  { id: "every-11", italian: "la valigia", english: "Suitcase", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Suitcase1.jpg/600px-Suitcase1.jpg", category: "Everyday" },
  { id: "every-12", italian: "la mappa", english: "Map", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/World_Map_1689.JPG/600px-World_Map_1689.JPG", category: "Everyday" },
  { id: "every-13", italian: "il biglietto", english: "Ticket", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Ticket_%28unseparated%29_Kurkino-Berchtesgaden.JPG/600px-Ticket_%28unseparated%29_Kurkino-Berchtesgaden.JPG", category: "Everyday" },
  { id: "every-14", italian: "la batteria", english: "Battery", image: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Batteries.jpg", category: "Everyday" },
  { id: "every-15", italian: "il caricatore", english: "Charger", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Car_Battery_Charger.jpg/600px-Car_Battery_Charger.jpg", category: "Everyday" },
  { id: "every-16", italian: "la spina", english: "Plug", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/French-power-socket.jpg/600px-French-power-socket.jpg", category: "Everyday" },
  { id: "every-17", italian: "l'interruttore", english: "Switch", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Switches-electrical.agr.jpg/600px-Switches-electrical.agr.jpg", category: "Everyday" },
  { id: "every-18", italian: "la lampadina", english: "Light Bulb", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Gluehlampe_01_KMJ.png/600px-Gluehlampe_01_KMJ.png", category: "Everyday" },
  { id: "every-19", italian: "la pila", english: "Torch", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lewes_Bonfire%2C_discarded_torch.jpg/600px-Lewes_Bonfire%2C_discarded_torch.jpg", category: "Everyday" },
  { id: "every-20", italian: "il sacchetto", english: "Plastic Bag", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Trash_bin_in_Paris.jpg/600px-Trash_bin_in_Paris.jpg", category: "Everyday" },
  { id: "every-21", italian: "la scatola", english: "Box", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/L%C3%A5da_-_Livrustkammaren_-_107142.tif/lossy-page1-330px-L%C3%A5da_-_Livrustkammaren_-_107142.tif.jpg", category: "Everyday" },
  { id: "every-22", italian: "il pacco", english: "Parcel", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/TV_set_%2846_inch%29_in_self-customized_box_for_sending_via_parcel_service_N.3.jpg/600px-TV_set_%2846_inch%29_in_self-customized_box_for_sending_via_parcel_service_N.3.jpg", category: "Everyday" },
  { id: "every-23", italian: "la lettera", english: "Letter", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/James_Campbell_-_News_from_My_Lad_-_Google_Art_Project.jpg/600px-James_Campbell_-_News_from_My_Lad_-_Google_Art_Project.jpg", category: "Everyday" },
  { id: "every-24", italian: "il fazzoletto", english: "Tissue", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Box_of_Scotties_tissues.jpg/600px-Box_of_Scotties_tissues.jpg", category: "Everyday" },
  { id: "every-25", italian: "la medicina", english: "Medicine", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/The_Doctor_Luke_Fildes_crop.jpg/600px-The_Doctor_Luke_Fildes_crop.jpg", category: "Everyday" },
  { id: "every-26", italian: "il cerotto", english: "Plaster", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Fontainebleau_escalier_roi5.jpg/600px-Fontainebleau_escalier_roi5.jpg", category: "Everyday" },
  { id: "every-27", italian: "gli occhiali da sole", english: "Sunglasses", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Sunglasses_pic17.jpg/600px-Sunglasses_pic17.jpg", category: "Everyday" },
  { id: "every-28", italian: "il fiammifero", english: "Match", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Friction_d%27une_allumette.jpg/600px-Friction_d%27une_allumette.jpg", category: "Everyday" },
  { id: "every-29", italian: "l'accendino", english: "Lighter", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/White_lighter_with_flame.JPG/600px-White_lighter_with_flame.JPG", category: "Everyday" },
  { id: "every-30", italian: "il cestino", english: "Bin", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Waste_container_in_Japan.jpg/600px-Waste_container_in_Japan.jpg", category: "Everyday" },

  // ===========================
  // FOOD (40)
  // ===========================
  { id: "food-26", italian: "l'olio d'oliva", english: "Olive Oil", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Oliven_V1.jpg/600px-Oliven_V1.jpg", category: "Food" },
  { id: "food-27", italian: "l'aceto", english: "Vinegar", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Eguilles_20110828_14.jpg/600px-Eguilles_20110828_14.jpg", category: "Food" },
  { id: "food-28", italian: "la farina", english: "Flour", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Soy_powder.jpg/600px-Soy_powder.jpg", category: "Food" },
  { id: "food-29", italian: "lo zucchero", english: "Sugar", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Sucre_blanc_cassonade_complet_rapadura.jpg/600px-Sucre_blanc_cassonade_complet_rapadura.jpg", category: "Food" },
  { id: "food-30", italian: "la marmellata", english: "Jam", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Fruits_jam_variants.jpg/600px-Fruits_jam_variants.jpg", category: "Food" },
  { id: "food-31", italian: "le noci", english: "Walnuts", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Walnuts_-_whole_and_open_with_halved_kernel.jpg/600px-Walnuts_-_whole_and_open_with_halved_kernel.jpg", category: "Food" },
  { id: "food-32", italian: "le mandorle", english: "Almonds", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Almonds_-_in_shell%2C_shell_cracked_open%2C_shelled%2C_blanched.jpg/600px-Almonds_-_in_shell%2C_shell_cracked_open%2C_shelled%2C_blanched.jpg", category: "Food" },
  { id: "food-33", italian: "il tonno", english: "Tuna", image: "https://upload.wikimedia.org/wikipedia/commons/2/21/Tuna_assortment.png", category: "Food" },
  { id: "food-34", italian: "il gamberetto", english: "Shrimp", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Palaemon_serratus_Croazia.jpg/600px-Palaemon_serratus_Croazia.jpg", category: "Food" },
  { id: "food-35", italian: "il salmone", english: "Salmon", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Salmo_salar.jpg/600px-Salmo_salar.jpg", category: "Food" },
  { id: "food-36", italian: "la lasagna", english: "Lasagna", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Lasagna_bolognese.jpg/600px-Lasagna_bolognese.jpg", category: "Food" },
  { id: "food-37", italian: "il risotto", english: "Risotto", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Risotto_con_l%27ossobuco%2C_Editathon_Vegnii_a_ved%C3%A8_se_l%27%C3%B2rghen_el_gh%27%C3%A8%2C_Baggio%2C_Milano_01.jpg/600px-Risotto_con_l%27ossobuco%2C_Editathon_Vegnii_a_ved%C3%A8_se_l%27%C3%B2rghen_el_gh%27%C3%A8%2C_Baggio%2C_Milano_01.jpg", category: "Food" },
  { id: "food-38", italian: "la focaccia", english: "Focaccia", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Focaccia_with_Crumb.jpg/600px-Focaccia_with_Crumb.jpg", category: "Food" },
  { id: "food-39", italian: "il pesto", english: "Pesto", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/BasilPesto.JPG/600px-BasilPesto.JPG", category: "Food" },
  { id: "food-40", italian: "la mozzarella", english: "Mozzarella", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Mozzarella_di_bufala3.jpg/600px-Mozzarella_di_bufala3.jpg", category: "Food" },

  // ===========================
  // ANIMALS (35)
  // ===========================
  { id: "animal-21", italian: "il lupo", english: "Wolf", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Eurasian_wolf_2.jpg/600px-Eurasian_wolf_2.jpg", category: "Animals" },
  { id: "animal-22", italian: "l'orso", english: "Bear", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ours_brun_parcanimalierpyrenees_1.jpg/600px-Ours_brun_parcanimalierpyrenees_1.jpg", category: "Animals" },
  { id: "animal-23", italian: "il cervo", english: "Deer", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Family_Cervidae_five_species.jpg/600px-Family_Cervidae_five_species.jpg", category: "Animals" },
  { id: "animal-24", italian: "il pappagallo", english: "Parrot", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Rainbow_lorikeet_%28Trichoglossus_moluccanus_moluccanus%29_Sydney.jpg/600px-Rainbow_lorikeet_%28Trichoglossus_moluccanus_moluccanus%29_Sydney.jpg", category: "Animals" },
  { id: "animal-25", italian: "il gufo", english: "Owl", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Bubo_bubo_sibiricus_-_01.JPG/600px-Bubo_bubo_sibiricus_-_01.JPG", category: "Animals" },
  { id: "animal-26", italian: "il delfino", english: "Dolphin", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Tursiops_truncatus_01.jpg/600px-Tursiops_truncatus_01.jpg", category: "Animals" },
  { id: "animal-27", italian: "la balena", english: "Whale", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Southern_right_whale.jpg/600px-Southern_right_whale.jpg", category: "Animals" },
  { id: "animal-28", italian: "lo squalo", english: "Shark", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Corl0207_%2828225976491%29.jpg/600px-Corl0207_%2828225976491%29.jpg", category: "Animals" },
  { id: "animal-29", italian: "il pinguino", english: "Penguin", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Aptenodytes_forsteri_-Snow_Hill_Island%2C_Antarctica_-adults_and_juvenile-8.jpg/600px-Aptenodytes_forsteri_-Snow_Hill_Island%2C_Antarctica_-adults_and_juvenile-8.jpg", category: "Animals" },
  { id: "animal-30", italian: "il serpente", english: "Snake", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Trimeresurus_sabahi_fucatus%2C_Banded_pit_viper_-_Takua_Pa_District%2C_Phang-nga_Province_%2846710893582%29.jpg/600px-Trimeresurus_sabahi_fucatus%2C_Banded_pit_viper_-_Takua_Pa_District%2C_Phang-nga_Province_%2846710893582%29.jpg", category: "Animals" },
  { id: "animal-31", italian: "la tigre", english: "Tiger", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Bengal_tiger_%28Panthera_tigris_tigris%29_female_3_crop.jpg/600px-Bengal_tiger_%28Panthera_tigris_tigris%29_female_3_crop.jpg", category: "Animals" },
  { id: "animal-32", italian: "la zebra", english: "Zebra", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Plains_Zebra_Equus_quagga_cropped.jpg/600px-Plains_Zebra_Equus_quagga_cropped.jpg", category: "Animals" },
  { id: "animal-33", italian: "il coccodrillo", english: "Crocodile", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Nile_crocodile_head.jpg/600px-Nile_crocodile_head.jpg", category: "Animals" },
  { id: "animal-34", italian: "la formica", english: "Ant", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Red_Ant_-_March_2025.jpg/600px-Red_Ant_-_March_2025.jpg", category: "Animals" },
  { id: "animal-35", italian: "la lumaca", english: "Snail", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Snail.jpg/600px-Snail.jpg", category: "Animals" },

  // ===========================
  // HOUSEHOLD (40)
  // ===========================
  { id: "house-26", italian: "il rubinetto", english: "Tap", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Wasserhahn.jpg/600px-Wasserhahn.jpg", category: "Household" },
  { id: "house-27", italian: "la presa", english: "Socket", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/French-power-socket.jpg/600px-French-power-socket.jpg", category: "Household" },
  { id: "house-28", italian: "il termosifone", english: "Radiator", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Automobile_radiator.jpg/600px-Automobile_radiator.jpg", category: "Household" },
  { id: "house-29", italian: "il ventilatore", english: "Fan", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Ventilatore_a_piantana_3.jpg/600px-Ventilatore_a_piantana_3.jpg", category: "Household" },
  { id: "house-30", italian: "l'aspirapolvere", english: "Vacuum Cleaner", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Numatic_Henry_vacuum_cleaner_%283308986870%29_%28cropped%29.jpg/600px-Numatic_Henry_vacuum_cleaner_%283308986870%29_%28cropped%29.jpg", category: "Household" },
  { id: "house-31", italian: "la lavatrice", english: "Washing Machine", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/LG_%EB%93%9C%EB%9F%BC%EC%84%B8%ED%83%81%EA%B8%B0%EC%99%80_%EC%8B%9D%EA%B8%B0%EC%84%B8%EC%B2%99%EA%B8%B0%2C_%EC%98%81%EA%B5%AD%EC%84%9C_%EB%AC%BC%EC%82%AC%EC%9A%A9_%ED%9A%A8%EC%9C%A8_%EC%B5%9C%EC%9A%B0%EC%88%98_%EC%A0%9C%ED%92%88_%EC%88%98%EC%83%81.jpg/600px-LG_%EB%93%9C%EB%9F%BC%EC%84%B8%ED%83%81%EA%B8%B0%EC%99%80_%EC%8B%9D%EA%B8%B0%EC%84%B8%EC%B2%99%EA%B8%B0%2C_%EC%98%81%EA%B5%AD%EC%84%9C_%EB%AC%BC%EC%82%AC%EC%9A%A9_%ED%9A%A8%EC%9C%A8_%EC%B5%9C%EC%9A%B0%EC%88%98_%EC%A0%9C%ED%92%88_%EC%88%98%EC%83%81.jpg", category: "Household" },
  { id: "house-32", italian: "il ferro da stiro", english: "Iron", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Iron_electrolytic_and_1cm3_cube.jpg/600px-Iron_electrolytic_and_1cm3_cube.jpg", category: "Household" },
  { id: "house-33", italian: "la scopa", english: "Broom", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/BroomsforSale.jpg/600px-BroomsforSale.jpg", category: "Household" },
  { id: "house-34", italian: "il secchio", english: "Bucket", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Gotland-Bottarve_Museumshof_07.jpg/600px-Gotland-Bottarve_Museumshof_07.jpg", category: "Household" },
  { id: "house-35", italian: "la sveglia", english: "Alarm Clock", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/2010-07-20_Black_windup_alarm_clock_face.jpg/600px-2010-07-20_Black_windup_alarm_clock_face.jpg", category: "Household" },
  { id: "house-36", italian: "il telecomando", english: "Remote Control", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Nuon-N2000-Remote-Control.jpg/600px-Nuon-N2000-Remote-Control.jpg", category: "Household" },
  { id: "house-37", italian: "la pattumiera", english: "Bin", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Waste_container_in_Japan.jpg/600px-Waste_container_in_Japan.jpg", category: "Household" },
  { id: "house-38", italian: "il tetto", english: "Roof", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Tak_-_Ystad-2022.jpg/600px-Tak_-_Ystad-2022.jpg", category: "Household" },
  { id: "house-39", italian: "il pavimento", english: "Floor", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Parquet_flooring_in_Mus%C3%A9e_des_arts_d%C3%A9coratifs_de_Strasbourg.jpg/600px-Parquet_flooring_in_Mus%C3%A9e_des_arts_d%C3%A9coratifs_de_Strasbourg.jpg", category: "Household" },
  { id: "house-40", italian: "il muro", english: "Wall", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Noel_2005_P%C3%A9kin_031_muraille_de_chine_Mutianyu.jpg/600px-Noel_2005_P%C3%A9kin_031_muraille_de_chine_Mutianyu.jpg", category: "Household" },

  // ===========================
  // BODY (30)
  // ===========================
  { id: "body-21", italian: "la caviglia", english: "Ankle", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Ankle.jpg/600px-Ankle.jpg", category: "Body" },
  { id: "body-22", italian: "il polso", english: "Wrist", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Nadgarstek_%28ubt%29.jpeg/600px-Nadgarstek_%28ubt%29.jpeg", category: "Body" },
  { id: "body-23", italian: "il petto", english: "Chest", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Chest.jpg/600px-Chest.jpg", category: "Body" },
  { id: "body-24", italian: "la pancia", english: "Belly", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Abdomen-periumbilical_region.png/600px-Abdomen-periumbilical_region.png", category: "Body" },
  { id: "body-25", italian: "il sopracciglio", english: "Eyebrow", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Jeremy_Cadot%27s_eyebrow.jpg/600px-Jeremy_Cadot%27s_eyebrow.jpg", category: "Body" },
  { id: "body-26", italian: "il mento", english: "Chin", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Crane3chin.png/600px-Crane3chin.png", category: "Body" },
  { id: "body-27", italian: "la fronte", english: "Forehead", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Male_forehead-01_ies.jpg/600px-Male_forehead-01_ies.jpg", category: "Body" },
  { id: "body-28", italian: "l'unghia", english: "Nail", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Clou_127.jpg/600px-Clou_127.jpg", category: "Body" },
  { id: "body-29", italian: "il labbro", english: "Lip", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Lips_2023.jpg/600px-Lips_2023.jpg", category: "Body" },
  { id: "body-30", italian: "la guancia", english: "Cheek", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Cheek.jpg/600px-Cheek.jpg", category: "Body" },

  // ===========================
  // CLOTHING (30)
  // ===========================
  { id: "cloth-21", italian: "il pigiama", english: "Pyjamas", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Muslim_girl_india1844_%28cropped%29.jpg/600px-Muslim_girl_india1844_%28cropped%29.jpg", category: "Clothing" },
  { id: "cloth-22", italian: "il costume da bagno", english: "Swimsuit", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/BathingSuit1920s.jpg/600px-BathingSuit1920s.jpg", category: "Clothing" },
  { id: "cloth-23", italian: "la felpa", english: "Hoodie", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Marvin_Jones_2019_%28cropped%29.jpg/600px-Marvin_Jones_2019_%28cropped%29.jpg", category: "Clothing" },
  { id: "cloth-24", italian: "i jeans", english: "Jeans", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Jeans.jpg/600px-Jeans.jpg", category: "Clothing" },
  { id: "cloth-25", italian: "la tuta", english: "Tracksuit", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Jude_Bellingham_during_an_EA_Sports_event_in_September_2024_2.jpg/600px-Jude_Bellingham_during_an_EA_Sports_event_in_September_2024_2.jpg", category: "Clothing" },
  { id: "cloth-26", italian: "l'impermeabile", english: "Raincoat", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/David_Julian_Kirchner_%28cropped%29.jpg/600px-David_Julian_Kirchner_%28cropped%29.jpg", category: "Clothing" },
  { id: "cloth-27", italian: "i sandali", english: "Sandals", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Men%27s_size_10_Sandals.jpg/600px-Men%27s_size_10_Sandals.jpg", category: "Clothing" },
  { id: "cloth-28", italian: "la collana", english: "Necklace", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Dasaneh_girls.JPG/600px-Dasaneh_girls.JPG", category: "Clothing" },
  { id: "cloth-29", italian: "l'anello", english: "Ring", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Ring_Ruby.jpg/600px-Ring_Ruby.jpg", category: "Clothing" },
  { id: "cloth-30", italian: "il braccialetto", english: "Bracelet", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Gold_charm_bracelet.JPG/600px-Gold_charm_bracelet.JPG", category: "Clothing" },

  // ===========================
  // NATURE (30)
  // ===========================
  { id: "nat-21", italian: "la foglia", english: "Leaf", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Lisc_lipy.jpg/600px-Lisc_lipy.jpg", category: "Nature" },
  { id: "nat-22", italian: "l'erba", english: "Grass", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Poa_annua.jpg/600px-Poa_annua.jpg", category: "Nature" },
  { id: "nat-23", italian: "la roccia", english: "Rock", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Marsh_Butte_and_Geikie_Peak%2C_Grand_Canyon.jpg/600px-Marsh_Butte_and_Geikie_Peak%2C_Grand_Canyon.jpg", category: "Nature" },
  { id: "nat-24", italian: "la sabbia", english: "Sand", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Libya_4608_Idehan_Ubari_Dunes_Luca_Galuzzi_2007.jpg/600px-Libya_4608_Idehan_Ubari_Dunes_Luca_Galuzzi_2007.jpg", category: "Nature" },
  { id: "nat-25", italian: "il fango", english: "Mud", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/2003-11-27_Northerner_boots_in_mud.jpg/600px-2003-11-27_Northerner_boots_in_mud.jpg", category: "Nature" },
  { id: "nat-26", italian: "il ghiacciaio", english: "Glacier", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Geikie_Plateau_Glacier.JPG/600px-Geikie_Plateau_Glacier.JPG", category: "Nature" },
  { id: "nat-27", italian: "la grotta", english: "Cave", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Lechuguilla_Cave_Pearlsian_Gulf.jpg/600px-Lechuguilla_Cave_Pearlsian_Gulf.jpg", category: "Nature" },
  { id: "nat-28", italian: "la collina", english: "Hill", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Uliveti_monte_cinto.JPG/600px-Uliveti_monte_cinto.JPG", category: "Nature" },
  { id: "nat-29", italian: "la valle", english: "Valley", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Salta-VallesCalchaquies-P3140151.JPG/600px-Salta-VallesCalchaquies-P3140151.JPG", category: "Nature" },
  { id: "nat-30", italian: "il campo", english: "Field", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Iglesia_de_Nuestra_Se%C3%B1ora_de_La_Blanca%2C_Cardej%C3%B3n%2C_Espa%C3%B1a%2C_2012-09-01%2C_DD_02.JPG/600px-Iglesia_de_Nuestra_Se%C3%B1ora_de_La_Blanca%2C_Cardej%C3%B3n%2C_Espa%C3%B1a%2C_2012-09-01%2C_DD_02.JPG", category: "Nature" },

  // ===========================
  // TRANSPORT (25)
  // ===========================
  { id: "trans-16", italian: "il furgone", english: "Van", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/2018_Ford_Transit_Custom_300_Base_2.0_facelift.jpg/600px-2018_Ford_Transit_Custom_300_Base_2.0_facelift.jpg", category: "Transport" },
  { id: "trans-17", italian: "l'ambulanza", english: "Ambulance", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Order_of_Malta_Ireland_MB_Sprinter_ambulance_in_National_Services_Day.jpg/600px-Order_of_Malta_Ireland_MB_Sprinter_ambulance_in_National_Services_Day.jpg", category: "Transport" },
  { id: "trans-18", italian: "i vigili del fuoco", english: "Fire Engine", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Dublin_Fire_Brigade_Pump_Ladder_D32.jpg/600px-Dublin_Fire_Brigade_Pump_Ladder_D32.jpg", category: "Transport" },
  { id: "trans-19", italian: "il trattore", english: "Tractor", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Ford_8N.jpg/600px-Ford_8N.jpg", category: "Transport" },
  { id: "trans-20", italian: "il parcheggio", english: "Car Park", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Angle_parking_lot_diagram.PNG/600px-Angle_parking_lot_diagram.PNG", category: "Transport" },
  { id: "trans-21", italian: "la benzina", english: "Petrol", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Gasoline_in_mason_jar.jpg/600px-Gasoline_in_mason_jar.jpg", category: "Transport" },
  { id: "trans-22", italian: "la ruota", english: "Wheel", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Landesmuseum_W%C3%BCrttemberg_Kelten_011.4.jpg/600px-Landesmuseum_W%C3%BCrttemberg_Kelten_011.4.jpg", category: "Transport" },
  { id: "trans-23", italian: "il volante", english: "Steering Wheel", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Steering_wheels_from_different_periods.jpg/600px-Steering_wheels_from_different_periods.jpg", category: "Transport" },
  { id: "trans-24", italian: "il finestrino", english: "Car Window", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Panoramic-windshield.JPG/600px-Panoramic-windshield.JPG", category: "Transport" },
  { id: "trans-25", italian: "il bagagliaio", english: "Boot/Trunk", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/2010_Porsche_Boxster_Spyder_%285217139071%29.jpg/600px-2010_Porsche_Boxster_Spyder_%285217139071%29.jpg", category: "Transport" },

  // ===========================
  // SPORTS (24)
  // ===========================
  { id: "sport-16", italian: "la pallavolo", english: "Volleyball", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Brasil_vence_a_Fran%C3%A7a_no_v%C3%B4lei_masculino_1037987-15.08.2016_ffz-6369.jpg/600px-Brasil_vence_a_Fran%C3%A7a_no_v%C3%B4lei_masculino_1037987-15.08.2016_ffz-6369.jpg", category: "Sports" },
  { id: "sport-17", italian: "il nuoto", english: "Swimming", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/40._Schwimmzonen-_und_Mastersmeeting_Enns_2017_100m_Brust_Herren_USC_Traun-9897.jpg/600px-40._Schwimmzonen-_und_Mastersmeeting_Enns_2017_100m_Brust_Herren_USC_Traun-9897.jpg", category: "Sports" },
  { id: "sport-18", italian: "la corsa", english: "Running", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Runners_JFK_Memorial_%28cropped%29.jpg/600px-Runners_JFK_Memorial_%28cropped%29.jpg", category: "Sports" },
  { id: "sport-19", italian: "il golf", english: "Golf", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Golfer_swing.jpg/600px-Golfer_swing.jpg", category: "Sports" },
  { id: "sport-20", italian: "il tennis", english: "Tennis", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/2013_Australian_Open_-_Guillaume_Rufin.jpg/600px-2013_Australian_Open_-_Guillaume_Rufin.jpg", category: "Sports" },
  { id: "sport-21", italian: "la batteria", english: "Drums", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/DrumMozartRegiment.jpg/600px-DrumMozartRegiment.jpg", category: "Sports" },
  { id: "sport-22", italian: "il flauto", english: "Flute", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Shinobue_and_other_flutes-3.jpg/600px-Shinobue_and_other_flutes-3.jpg", category: "Sports" },
  { id: "sport-23", italian: "la tromba", english: "Trumpet", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Yamaha_Trumpet_YTR-8335LA_crop.jpg/600px-Yamaha_Trumpet_YTR-8335LA_crop.jpg", category: "Sports" },
  { id: "sport-24", italian: "il surf", english: "Surfing", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Mavericks_Surf_Contest_2010b.jpg/600px-Mavericks_Surf_Contest_2010b.jpg", category: "Sports" },
  { id: "sport-25", italian: "l'arrampicata", english: "Climbing", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Crack_climbing_in_Indian_Creek%2C_Utah.jpg/600px-Crack_climbing_in_Indian_Creek%2C_Utah.jpg", category: "Sports" },
];
