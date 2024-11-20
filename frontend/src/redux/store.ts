import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../redux/auth'
import subscriptionReducer from './subscriptions'
import serviceReducer from './services'
export const store = configureStore({
    reducer : {
        auth:userReducer,
        subscriptions: subscriptionReducer,
        services:serviceReducer,

    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch