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
            redirect: { name: 'brand' },
            children: [
                {
                    path: 'brand',
                    name: 'brand',
                    component: BrandView,
                },
                {
                    path: 'posts',
                    name: 'posts',
                    component: PostsView,
                },
                {
                    path: 'items',
                    name: 'items',
                    component: ItemsView,
                },
            ],
        }
    ]
})

export default router
