import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ResultsView from '../views/ResultsView.vue'
import BrandView from '../views/results/BrandView.vue'
import PostsView from '../views/results/PostsView.vue'
import ItemsView from '../views/results/ItemsView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/results/:brandId',
            name: 'results',
            component: ResultsView,
            children: [
                {
                    path: 'brand', // :id is the path parameter
                    name: 'brand',
                    component: BrandView,
                },
                {
                    path: 'posts', // :id is the path parameter
                    name: 'posts',
                    component: PostsView,
                },
                {
                    path: 'items', // :id is the path parameter
                    name: 'items',
                    component: ItemsView,
                },
            ],
        }
    ]
})

export default router
