

export enum MealType {
  Appetizers = 'Appetizers',
  BreakfastBrunch = 'Breakfast & Brunch',
  MainCourses = 'Main Courses',
  SideDishes = 'Side Dishes',
  Desserts = 'Desserts',
  Beverages = 'Beverages',
  SoupsSalads = 'Soups & Salads',
  BreadsBakedGoods = 'Breads & Baked Goods',
}

export interface RecipeCategory {
  id: string;
  label: string;
  imageUrl: string; // URL pointing to the category icon/image
}



export const categoriesWithImages: RecipeCategory[] = [
  {
    id: 'appetizers',
    label: MealType.Appetizers,
    // Real image of a smoked salmon appetizer platter
    imageUrl: 'https://cdn.loveandlemons.com/wp-content/uploads/2022/12/appetizers.jpg',
  },
  {
    id: 'breakfast',
    label: MealType.BreakfastBrunch,
    // Real image of french toast with berries
    imageUrl: 'https://images.squarespace-cdn.com/content/v1/59f0e6beace8641044d76e9c/1601921659197-JS5HYFK7FC08I9TLAMYI/Social+breakfast+foods.jpeg?format=1000w',
  },
  {
    id: 'maincourses',
    label: MealType.MainCourses,
    // Real image of a gourmet main dish plate (roast duck breast)
    imageUrl: 'https://www.recipemash.com/wp-content/uploads/2024/12/Pasta-and-pizza-1024x683.jpg',
  },
  {
    id: 'sidedishes',
    label: MealType.SideDishes,
    // Real image of roasted sweet potatoes
    imageUrl: 'https://www.eatingwell.com/thmb/ahxy161gW4p2blBUfjD3vw5KITU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/crispy-smashed-brussels-sprouts-with-balsamic-and-parmesan-8c2bec6d79054458a12965d7c368cf1c.jpg',
  },
  {
    id: 'desserts',
    label: MealType.Desserts,
    // Real image of various colorful desserts on a plate
    imageUrl: 'https://en.wikipedia.org/wiki/File:Desserts.jpg',
  },
  {
    id: 'beverages',
    label: MealType.Beverages,
    // Real image of assorted cold drinks
    imageUrl: 'https://agronfoodprocessing.com/wp-content/uploads/2023/08/drinks.jpg',
  },
  {
    id: 'soupssalads',
    label: MealType.SoupsSalads,
    // Real image of a healthy vegetable salad
    imageUrl: 'images.unsplash.com',
  },
  {
    id: 'breads',
    label: MealType.BreadsBakedGoods,
    // Real image of assorted artisan breads
    imageUrl: 'images.unsplash.com',
  },
];