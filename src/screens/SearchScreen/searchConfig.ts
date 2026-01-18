

const UserItem=null// User Item Component
const ProductItem=null// Product Item Component
// const api={}// API Instance

export const SEARCH_CONFIG = {
  USERS: {
    title: 'Search People',
    placeholder: 'Find by name...',
    fetcher: ()=>{},
    component: UserItem,
  },
  PRODUCTS: {
    title: 'Search Shop',
    placeholder: 'Search items...',
    fetcher: ()=>{},
    component: ProductItem,
  },
};

export type SearchType = keyof typeof SEARCH_CONFIG;